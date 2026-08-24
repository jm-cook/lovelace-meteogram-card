// The right margin is one weather icon wide: the last icon is centred on the final hour,
// so half of it overhangs the plot and the other half of the margin keeps it off the card
// edge. In core and focussed the pressure axis was drawn into that same strip —
// d3.axisRight sits at the plot edge and its four-digit labels reach ~32px past it,
// against the icon's 20px — so the last icon was rendered on top of the tick numbers.
//
// Widening the margin cannot fix that: it moves the plot edge left and takes the icon and
// the labels with it, both still measured from the same edge. So in the compact modes the
// axis goes and the icons keep their overhang. Full mode reserves 70px and keeps both.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".map": "application/json", ".css": "text/css" };
const server = await new Promise((ok) => {
  const sv = createServer(async (q, res) => {
    try {
      const p = join(ROOT, decodeURIComponent(q.url.split("?")[0]));
      const b = await readFile(p);
      res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
      res.end(b);
    } catch { res.writeHead(404).end(); }
  });
  sv.listen(0, "127.0.0.1", () => ok(sv));
});
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") console.error("CONSOLE:", m.text()); });
let failed = false;
const check = (ok, label, extra = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${extra ? "  (" + extra + ")" : ""}`);
  if (!ok) failed = true;
};

await page.goto(`http://127.0.0.1:${server.address().port}/dev.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 30000 });

// display_mode is the modern key; the boolean `focussed` is legacy and only migrates
// when display_mode is absent, so passing both silently ignores it.
const build = (mode, press) => page.evaluate(async ([mode, press]) => {
  const base = document.querySelector("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:900px;height:420px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  el.hass = base.hass;
  el.setConfig({ latitude: 58.4314, longitude: 8.8255, display_mode: mode,
    meteogram_hours: "48h", show_pressure: press, show_wind: true, show_sun: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true });
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 1600));
  const svg = el.shadowRoot.querySelector("#chart svg");
  const s = svg.getBoundingClientRect();
  const plotRight = el._margin.left + el._chartWidth;
  // How far the rightmost weather icon reaches past the plot edge.
  let iconRight = 0;
  for (const n of svg.querySelectorAll(".weather-icon, .weather-icon *, image, foreignObject")) {
    const r = n.getBoundingClientRect();
    if (r.width) iconRight = Math.max(iconRight, r.right - s.left - plotRight);
  }
  const out = {
    axis: !!svg.querySelector(".pressure-axis"),
    curve: !!svg.querySelector("path.pressure-line"),
    marginRight: el._margin.right,
    chartWidth: el._chartWidth,
    svgWidth: Number(svg.getAttribute("width")),
    iconOverhang: Math.round(iconRight),
  };
  el.remove(); host.remove();
  return out;
}, [mode, press]);

const corePress = await build("core", true);
const coreNone  = await build("core", false);
const fullPress = await build("full", true);
const focPress  = await build("focussed", true);

check(!corePress.axis, "core draws no pressure axis");
check(corePress.curve, "but still draws the pressure curve");
check(!focPress.axis, "focussed draws no pressure axis either");
check(fullPress.axis, "full keeps its axis, where there is room for one");

check(corePress.chartWidth === coreNone.chartWidth,
  "core's plot is the same width with pressure on or off",
  `${corePress.chartWidth} vs ${coreNone.chartWidth}`);
check(corePress.marginRight === 40 && coreNone.marginRight === 40,
  "and its right margin stays one icon wide either way",
  `${corePress.marginRight} / ${coreNone.marginRight}`);

// The margin exists for the overhang, so the overhang must actually happen and must fit.
check(coreNone.iconOverhang > 0, "the last icon overhangs the plot, as intended",
  `${coreNone.iconOverhang}px`);
check(coreNone.iconOverhang <= coreNone.marginRight,
  "and stays inside the margin rather than off the card",
  `${coreNone.iconOverhang}px of ${coreNone.marginRight}px`);
check(corePress.iconOverhang === coreNone.iconOverhang,
  "turning pressure on no longer changes what the icon has to itself",
  `${corePress.iconOverhang} vs ${coreNone.iconOverhang}`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "pressure-axis: FAILED" : "pressure-axis: ok");
process.exit(failed ? 1 : 0);
