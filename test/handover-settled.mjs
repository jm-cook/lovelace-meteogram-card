// The chart handed to a replacement element must be the chart as it finally looked,
// not as it looked the instant drawing returned.
//
// Bars enter at height 0 and reach their real height over a 450ms transition, so a
// snapshot taken synchronously in the draw's `finally` serialises `height="0"` for
// every bar that entered. Labels are set directly and land in the snapshot at full
// opacity. The result is a handover placeholder showing rain figures with no rain
// under them — reported from a panel view, where a tab switch re-attaches the card
// and adoption paints that placeholder for the length of the re-attach hold.
//
// A fresh page load has an empty module-scope cache, so the first draw is always
// correct and only the return trip shows it. That is why this needs a second element.
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
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
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
}, null, { timeout: 60000 });
await page.evaluate(() => {
  const a = document.getElementById("auto");
  if (a?.checked) { a.checked = false; a.dispatchEvent(new Event("change")); }
});

const CFG = {
  latitude: 58.4314, longitude: 8.8255, display_mode: "full", meteogram_hours: "48h",
  show_wind: true, show_sun: true, show_pressure: true, show_precipitation: true,
  show_cloud_cover: true, show_weather_icons: true, animate: true,
};

const r = await page.evaluate(async (CFG) => {
  const heights = (root, sel) =>
    [...root.querySelectorAll(sel)].map((n) => Number(n.getAttribute("height")) || 0);

  const Cls = customElements.get("meteogram-card");
  // Only the first draw of a page animates: _remountDraw is
  // `(firstDraw && _pageHasDrawn) || _reattachDraw`, so every later element places its
  // bars instead of growing them and never writes a flat snapshot. Resetting the flag
  // reproduces a page-load draw on demand rather than reloading and racing it.
  Cls._pageHasDrawn = false;
  Cls._chartCache.clear();

  const old = document.querySelector("meteogram-card");
  const hass = old.hass, host = old.parentElement;
  old.remove();
  const el = document.createElement("meteogram-card");
  if (hass) el.hass = hass;
  el.setConfig(CFG);
  host.appendChild(el);
  await el.updateComplete;

  // Settle well past the 450ms bar transition.
  await new Promise((res) => {
    const t0 = performance.now();
    const tick = () => {
      const done = el._firstPaintMs !== null && performance.now() - t0 > 1500;
      if (done || performance.now() - t0 > 20000) res(); else requestAnimationFrame(tick);
    };
    tick();
  });

  const live = heights(el.shadowRoot.querySelector("#chart svg"), "rect.rain-bar");
  const entry = Cls._chartCache.get(el._renderSignature);
  if (!entry) return { error: "nothing was handed over" };
  const doc = new DOMParser().parseFromString(entry.markup, "image/svg+xml");
  const stored = heights(doc, "rect.rain-bar");

  return {
    animated: !el._remountDraw,
    liveBars: live.length, liveMax: Math.max(0, ...live),
    storedBars: stored.length, storedMax: Math.max(0, ...stored),
    storedZero: stored.filter((h) => h === 0).length,
  };
}, CFG);

if (r.error) { check(false, r.error); }
else {
  check(r.animated, "this draw animated, so its bars entered from zero");
  check(r.liveBars > 0, "the drawn chart has rain bars", `${r.liveBars}`);
  check(r.liveMax > 0, "and they have height once the animation has run", `max ${r.liveMax}`);
  check(r.storedBars === r.liveBars, "the handover holds the same bars",
    `${r.storedBars} stored vs ${r.liveBars} drawn`);
  check(r.storedMax > 0, "and holds them at their settled height, not mid-transition",
    `max ${r.storedMax}, ${r.storedZero} of ${r.storedBars} flat`);
}

check(errors.length === 0, "no page errors", errors.join(" | "));
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
