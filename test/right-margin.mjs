// The right margin follows what is drawn there, not the display mode.
//
// It used to be a constant per mode, and the two were only accidentally related: core
// and focussed reserved 40px whether or not a pressure axis existed, so switching
// show_pressure off in those modes gave nothing back — the space looked empty but was
// never the axis's to return.
//
// Measured from the render: a weather icon is 40px wide and the last one is centred on
// the final hour, so half of it hangs 20px past the plot edge in every mode, and that
// overhang is deliberate. The pressure axis reaches 31.7px, the rotated caption 63px,
// and the hour labels nothing at all.
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
  const past = (sel) => {
    let m = null;
    for (const n of svg.querySelectorAll(sel)) {
      const r = n.getBoundingClientRect();
      if (r.width) m = Math.max(m ?? -1e9, Math.round(r.right - s.left - plotRight));
    }
    return m;
  };
  const out = {
    marginRight: el._margin.right, chartWidth: el._chartWidth,
    svgWidth: Number(svg.getAttribute("width")),
    icon: past(".weather-icon, image, foreignObject"),
    axis: past(".pressure-axis"),
    caption: svg.querySelector(".axis-label") ? past(".axis-label") : null,
    hasAxis: !!svg.querySelector(".pressure-axis"),
  };
  el.remove(); host.remove();
  return out;
}, [mode, press]);

const cases = {};
for (const [mode, press] of [["core", true], ["core", false], ["focussed", true],
                             ["focussed", false], ["full", true], ["full", false]]) {
  cases[`${mode}:${press}`] = await build(mode, press);
}

// ── what is drawn is unchanged: the axis belongs in every mode ────────────────
for (const m of ["core", "focussed", "full"])
  check(cases[`${m}:true`].hasAxis, `${m} still draws the pressure axis`);
for (const m of ["core", "focussed", "full"])
  check(!cases[`${m}:false`].hasAxis, `${m} draws none when pressure is off`);

// ── the margin is decided by content, not by mode ─────────────────────────────
for (const m of ["core", "focussed", "full"])
  check(cases[`${m}:false`].marginRight === 24,
    `${m} reserves only the icon overhang with no axis`,
    `${cases[`${m}:false`].marginRight}px`);
check(cases["core:true"].marginRight === 40 && cases["focussed:true"].marginRight === 40,
  "the compact modes reserve the axis width, having no caption to fit");
check(cases["full:true"].marginRight === 70,
  "full reserves the caption's width as well", `${cases["full:true"].marginRight}px`);

// ── and the plot actually gains the difference ────────────────────────────────
for (const m of ["core", "focussed"]) {
  const gain = cases[`${m}:false`].chartWidth - cases[`${m}:true`].chartWidth;
  check(gain === 16, `${m} gives the space back when the axis goes`, `+${gain}px of plot`);
}
check(cases["full:false"].chartWidth - cases["full:true"].chartWidth === 46,
  "full gives back the caption's share too",
  `+${cases["full:false"].chartWidth - cases["full:true"].chartWidth}px of plot`);

// ── the overhang still happens, and still fits ────────────────────────────────
for (const k of Object.keys(cases)) {
  const c = cases[k];
  check(c.icon === 20, `${k}: the last icon overhangs by half its width`, `${c.icon}px`);
  check(c.icon <= c.marginRight, `${k}: and stays on the card`,
    `${c.icon}px of ${c.marginRight}px`);
}

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "right-margin: FAILED" : "right-margin: ok");
process.exit(failed ? 1 : 0);
