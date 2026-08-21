// Home Assistant replaces a card element without the page reloading, and every
// replacement is a first draw for that element. The opening animation is a page-load
// flourish and must not replay on one: restoring a window left minimised produced a
// blank card and then a full animated build of a forecast that had not changed.
//
// The page's own first draw still animates, so the feature stays demonstrable by
// reloading — which is how it is checked.
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

const first = await page.evaluate(() => {
  const c = document.querySelector("meteogram-card");
  return { remount: c._remountDraw, pageHasDrawn: c.constructor._pageHasDrawn };
});
check(first.remount === false, "the page's own first draw is not treated as a remount");

// Replace the element the way Home Assistant does, and watch what the new one reports.
const after = await page.evaluate(async () => {
  const old = document.querySelector("meteogram-card");
  // The card keeps its settings as properties, not on _config, so the replacement is
  // configured from the same literal the harness used rather than from the old element.
  const cfg = {
    latitude: 58.4314, longitude: 8.8255, title: "Changing data",
    display_mode: "full", meteogram_hours: "48",
    show_wind: true, show_sun: true, show_pressure: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true,
    animate: true,
  };
  const hass = old.hass;
  const host = old.parentElement;
  old.remove();
  const el = document.createElement("meteogram-card");
  if (hass) el.hass = hass;          // hass before config, as Home Assistant does
  el.setConfig(cfg);
  host.appendChild(el);
  const drew = await new Promise((res) => {
    const started = performance.now();
    const tick = () => {
      const svg = el.shadowRoot?.querySelector("#chart svg");
      if (svg && svg.querySelectorAll("*").length > 50) res(true);
      else if (performance.now() - started > 20000) res(false);
      else requestAnimationFrame(tick);
    };
    tick();
  });
  return { drew, remount: el._remountDraw, log: el.constructor._recentDraws.slice(),
           err: el.meteogramError ? String(el.meteogramError).slice(0, 60) : null };
});
check(after.drew, "the replacement element draws");
check(after.remount === true, "and knows it is a remount, so it does not animate");
// The log is shared across elements on the page, so it still carries the first
// element's history — that is the point of it. The replacement's own draw is the last
// one, and it is reported as a new element.
const draws = after.log.filter((l) => l.includes("  drew  "));
check(draws.length >= 2, "the replacement inherits the page's redraw history",
  `${draws.length} draws in the log`);
check(draws[draws.length - 1].includes("new element"),
  "and its own draw is reported as new",
  draws[draws.length - 1] ?? "none");
check(errors.length === 0, "no page errors", errors.join("; "));

// A first draw must not be postponed by the requests that arrive behind it.
//
// Mounting produces a burst — the load path, the visibility observer, the load path
// again, the resize observer's opening callback — and coalescing by resetting the timer
// pushed the first paint a further settle away on each one. Measured at 293ms to start
// drawing, of which 21ms was drawing. The deadline now runs from the first request, so
// the burst is still absorbed but the wait cannot accumulate.
const paced = await page.evaluate(async () => {
  const old = document.querySelector("meteogram-card");
  const cfg = {
    latitude: 58.4314, longitude: 8.8255, display_mode: "full", meteogram_hours: "48",
    show_wind: true, show_sun: true, show_pressure: true, show_precipitation: true,
    show_cloud_cover: true, show_weather_icons: true, animate: true,
  };
  const hass = old.hass; const host = old.parentElement;
  old.remove();
  const el = document.createElement("meteogram-card");
  if (hass) el.hass = hass;
  el.setConfig(cfg);
  host.appendChild(el);
  // Keep asking, well past the settle, the way a slow mount does.
  const before = el.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  const nag = setInterval(() => el._scheduleDrawMeteogram("test-nag"), 20);
  await new Promise((res) => {
    const started = performance.now();
    const tick = () => {
      const svg = el.shadowRoot?.querySelector("#chart svg");
      if (svg && svg.querySelectorAll("*").length > 50) res();
      else if (performance.now() - started > 20000) res();
      else requestAnimationFrame(tick);
    };
    tick();
  });
  clearInterval(nag);
  const after = el.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  return { blank: el._firstPaintMs, draws: after - before };
});
// The deadline is _firstDrawSettleMs from the first request plus the draw itself, so
// about 190ms; the old reset-on-every-request policy ran to its _drawMaxWaitMs ceiling
// instead, measured at 416ms under this same nagging. 300ms separates them with room
// on both sides, and is not tight enough to be a speed test.
check(paced.blank !== null && paced.blank < 300,
  "a steady stream of requests cannot postpone the first paint", `blank ${paced.blank}ms`);
check(paced.draws === 1, "and it still coalesces to a single draw", `${paced.draws} draws`);

console.log(failed ? "\nremount: FAILED" : "\n8/8 passed");
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
