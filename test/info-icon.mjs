// The information icon sits level with the date labels, above the temperature axis.
//
// It is measured from the rendered label rather than computed, because the svg is
// stretched to its container with preserveAspectRatio="none" — an SVG unit is not a CSS
// pixel, and by how much depends on the card's height. But the measurement ran some
// eight hundred lines before drawDateLabels, so it read the *previous* draw's label, or
// nothing at all on a first draw, and fell back to a fixed 24px from the top. Off by a
// little where the layout barely moved and by a lot after a resize, which is how the
// icon came to sit level with the middle of the temperature axis on a narrow card.
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
const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
let failed = false;
const check = (ok, label, extra = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${extra ? "  (" + extra + ")" : ""}`);
  if (!ok) failed = true;
};
// A couple of pixels is rounding on a stretched svg; anything more is a real drift.
const TOL = 2;

await page.goto(`http://127.0.0.1:${server.address().port}/dev.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 30000 });

const measure = (mode, w, h, resizeTo = null) =>
  page.evaluate(async ([mode, w, h, resizeTo]) => {
    const base = document.querySelector("meteogram-card");
    const host = document.createElement("div");
    host.style.cssText = `width:${w}px;height:${h}px;position:relative`;
    document.body.appendChild(host);
    const el = document.createElement("meteogram-card");
    el.hass = base.hass;
    el.setConfig({ latitude: 58.4314, longitude: 8.8255, display_mode: mode,
      meteogram_hours: "48h", show_pressure: true, show_wind: true, show_sun: true,
      show_precipitation: true, show_cloud_cover: true, show_weather_icons: true });
    host.appendChild(el);
    await new Promise((r) => setTimeout(r, 1800));
    if (resizeTo) {
      host.style.width = `${resizeTo[0]}px`;
      host.style.height = `${resizeTo[1]}px`;
      await new Promise((r) => setTimeout(r, 1500));
    }
    const root = el.shadowRoot;
    const lr = root.querySelector(".top-date-label")?.getBoundingClientRect();
    const ir = root.querySelector(".attribution-icon-wrapper")?.getBoundingClientRect();
    const sr = root.querySelector("#chart svg")?.getBoundingClientRect();
    const out = lr && ir && sr
      ? { delta: Math.round((ir.top + ir.height / 2) - (lr.top + lr.height / 2)),
          // Relative to the svg, whose left edge is where the margin starts. The
          // wrapper is positioned against the card, which is inset from it.
          right: Math.round(ir.right - sr.left),
          marginLeft: el._margin.left }
      : null;
    el.remove(); host.remove();
    return out;
  }, [mode, w, h, resizeTo]);

for (const [mode, w, h] of [["core", 900, 420], ["core", 300, 400], ["core", 240, 380],
                            ["full", 900, 460], ["full", 300, 420]]) {
  const r = await measure(mode, w, h);
  check(r !== null && Math.abs(r.delta) <= TOL,
    `${mode} ${w}x${h}: level with the date label`, `${r?.delta}px off`);
}

// The case that made it obvious: a layout that moves between draws. Measuring before the
// drawers ran meant reading the geometry the card had *left behind*.
for (const [from, to] of [[[900, 420], [280, 400]], [[280, 400], [900, 460]],
                          [[900, 460], [900, 240]]]) {
  const r = await measure("core", from[0], from[1], to);
  check(r !== null && Math.abs(r.delta) <= TOL,
    `still level after ${from.join("x")} -> ${to.join("x")}`, `${r?.delta}px off`);
}

// And it belongs over the temperature axis, in the margin the plot leaves empty.
const pos = await measure("core", 900, 420);
check(pos.right <= pos.marginLeft,
  "and clears the temperature axis, staying inside the left margin",
  `reaches ${pos.right}px of a ${pos.marginLeft}px margin`);

// ── width alone, at a fixed height ───────────────────────────────────────────
// The reported symptom. Two paths reach it and both have to keep the icon level: a
// change big enough to redraw, and one small enough to be absorbed by scaling the svg,
// which moves the label without any drawer running at all.
const widthOnly = await page.evaluate(async () => {
  const base = document.querySelector("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:900px;height:420px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  el.hass = base.hass;
  el.setConfig({ latitude: 58.4314, longitude: 8.8255, display_mode: "core",
    meteogram_hours: "48h", show_pressure: true, show_wind: true, show_sun: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true });
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 1800));
  const read = () => {
    const root = el.shadowRoot;
    const lr = root.querySelector(".top-date-label").getBoundingClientRect();
    const ir = root.querySelector(".attribution-icon-wrapper").getBoundingClientRect();
    return Math.round((ir.top + ir.height / 2) - (lr.top + lr.height / 2));
  };
  const out = [];
  for (const w of [880, 500, 890, 300, 895, 900]) {
    host.style.width = `${w}px`;
    await new Promise((r) => setTimeout(r, 1200));
    const last = el.constructor._recentDraws.slice(-1)[0] ?? "";
    out.push({ w, delta: read(), scaled: /scaled/.test(last) });
  }
  el.remove(); host.remove();
  return out;
});
for (const r of widthOnly)
  check(Math.abs(r.delta) <= TOL,
    `width ${r.w} at a fixed height${r.scaled ? " (scaled, not redrawn)" : ""}`,
    `${r.delta}px off`);

// ── and with an aspect ratio, where width decides height ─────────────────────
const ratio = await page.evaluate(async () => {
  const base = document.querySelector("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:900px;height:700px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  el.hass = base.hass;
  el.setConfig({ latitude: 58.4314, longitude: 8.8255, display_mode: "core",
    aspect_ratio: "16:9", meteogram_hours: "48h", show_pressure: true, show_wind: true,
    show_sun: true, show_precipitation: true, show_cloud_cover: true,
    show_weather_icons: true });
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 1800));
  const out = [];
  for (const w of [700, 450, 880]) {
    host.style.width = `${w}px`;
    await new Promise((r) => setTimeout(r, 1200));
    const root = el.shadowRoot;
    const lr = root.querySelector(".top-date-label").getBoundingClientRect();
    const ir = root.querySelector(".attribution-icon-wrapper").getBoundingClientRect();
    out.push({ w, delta: Math.round((ir.top + ir.height / 2) - (lr.top + lr.height / 2)) });
  }
  el.remove(); host.remove();
  return out;
});
for (const r of ratio)
  check(Math.abs(r.delta) <= TOL, `16:9 at width ${r.w}, where width sets the height`,
    `${r.delta}px off`);

// ── the case that shows it: switching mode on a live element ─────────────────
// Changing mode moves everything above the plot — core's top margin is 50 against
// full's 70, and full adds a legend row — so the label the icon is measured against
// lands somewhere new. Reading it before the drawers ran meant using the position it
// had in the mode just left behind, which is why the icon only wandered on a switch.
const switched = await page.evaluate(async () => {
  const base = document.querySelector("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:900px;height:460px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  el.hass = base.hass;
  const cfg = (mode) => ({ latitude: 58.4314, longitude: 8.8255, display_mode: mode,
    meteogram_hours: "48h", show_pressure: true, show_wind: true, show_sun: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true });
  el.setConfig(cfg("core"));
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 1800));
  const read = () => {
    const root = el.shadowRoot;
    const lr = root.querySelector(".top-date-label").getBoundingClientRect();
    const ir = root.querySelector(".attribution-icon-wrapper").getBoundingClientRect();
    return Math.round((ir.top + ir.height / 2) - (lr.top + lr.height / 2));
  };
  const out = [];
  for (const mode of ["full", "core", "full"]) {
    el.setConfig(cfg(mode));
    await new Promise((r) => setTimeout(r, 1600));
    out.push({ mode, delta: read() });
  }
  el.remove(); host.remove();
  return out;
});
for (const r of switched)
  check(Math.abs(r.delta) <= TOL, `follows the label when switched to ${r.mode}`,
    `${r.delta}px off`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "info-icon: FAILED" : "info-icon: ok");
process.exit(failed ? 1 : 0);
