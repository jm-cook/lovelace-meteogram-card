// Home Assistant replaces card elements without the page reloading, and a replacement
// starts empty. Even at ~30ms that is a visible gap between two identical charts. A
// replacement now inherits its predecessor's chart and shows it until its own is drawn.
//
// The cache is keyed on the render signature, so this has to be safe with more than one
// card: two cards showing different places must never be handed each other's chart.
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

// ── 1. a replacement is never blank ──────────────────────────────────────────
const seamless = await page.evaluate(async (CFG) => {
  const old = document.querySelector("meteogram-card");
  const hass = old.hass, host = old.parentElement;
  old.remove();
  const el = document.createElement("meteogram-card");
  if (hass) el.hass = hass;
  el.setConfig(CFG);
  host.appendChild(el);
  // Sampling starts at the first render. Before that there is no #chart in the shadow
  // root at all, so an empty reading there is not a gap anyone could see — adoption runs
  // in updated(), a microtask after that render and before the browser paints.
  await el.updateComplete;
  const frames = [];
  await new Promise((res) => {
    const t0 = performance.now();
    const tick = () => {
      const cd = el.shadowRoot?.querySelector("#chart");
      frames.push(cd ? cd.querySelectorAll("svg *").length : 0);
      if (el._firstPaintMs !== null || performance.now() - t0 > 20000) res();
      else requestAnimationFrame(tick);
    };
    tick();
  });
  return { frames, adopted: frames[0] > 50, everEmpty: frames.some((n) => n === 0) };
}, CFG);
check(seamless.adopted, "a replacement shows the previous chart on its first frame",
  `${seamless.frames[0]} nodes`);
check(!seamless.everEmpty, "and is never empty while drawing its own",
  seamless.frames.join(","));

// ── 2. a differently configured card is not handed the wrong chart ───────────
const other = await page.evaluate(async (CFG) => {
  const first = document.querySelector("meteogram-card");
  const hass = first.hass;
  const host = document.createElement("div");
  host.style.cssText = "width:600px;height:340px;position:relative";
  document.body.appendChild(host);
  // Sydney, not Arendal — a different signature entirely.
  const el = document.createElement("meteogram-card");
  if (hass) el.hass = hass;
  el.setConfig({ ...CFG, latitude: -33.8688, longitude: 151.2093 });
  host.appendChild(el);
  await el.updateComplete;
  const cd = el.shadowRoot?.querySelector("#chart");
  const borrowed = cd ? cd.querySelectorAll("svg *").length : 0;
  const keys = el.constructor._chartCache.size;
  el.remove(); host.remove();
  return { borrowed, keys };
}, CFG);
check(other.borrowed === 0, "a card with a different location inherits nothing",
  `${other.borrowed} nodes borrowed`);

// ── 3. two identical cards on one page share safely ──────────────────────────
const twins = await page.evaluate(async (CFG) => {
  const first = document.querySelector("meteogram-card");
  const hass = first.hass;
  const host = document.createElement("div");
  host.style.cssText = "width:846px;height:444px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  if (hass) el.hass = hass;
  el.setConfig(CFG);                       // same config as the card already on the page
  host.appendChild(el);
  await el.updateComplete;
  const cd = el.shadowRoot?.querySelector("#chart");
  const inherited = cd ? cd.querySelectorAll("svg *").length : 0;
  await new Promise((res) => {
    const t0 = performance.now();
    const tick = () => {
      if (el._firstPaintMs !== null || performance.now() - t0 > 20000) res();
      else requestAnimationFrame(tick);
    };
    tick();
  });
  const drew = el._firstPaintMs !== null;
  const stillThere = (document.querySelector("meteogram-card")
    ?.shadowRoot?.querySelector("#chart svg")?.querySelectorAll("*").length) ?? 0;
  el.remove(); host.remove();
  return { inherited, drew, stillThere };
}, CFG);
check(twins.inherited > 50, "an identically configured second card inherits the chart",
  `${twins.inherited} nodes`);
check(twins.drew, "and goes on to draw its own");
check(twins.stillThere > 50, "without disturbing the card it inherited from",
  `${twins.stillThere} nodes`);

// ── 4. re-attachment is covered too, in sections layout ──────────────────────
//
// Home Assistant detaches the dashboard panel after a few minutes hidden and re-appends
// the same elements. Lit re-renders on the way back in and replaces the chart div, so a
// card that has been drawing for an hour comes back as empty as a new one — the "first
// load" draw that precedes the rebuild in a wake-up log. Sections layout because that
// path takes the drawn size straight from the container, with no aspect ratio applied.
const reattach = await page.evaluate(async () => {
  const c = document.querySelector("meteogram-card");
  c.setConfig({ ...(c._config ?? {}), latitude: 58.4314, longitude: 8.8255,
                layout_mode: "sections", display_mode: "core" });
  c._forceNextDraw = true;
  c._scheduleDrawMeteogram("seed-sections", true);
  await new Promise((res) => {
    const t0 = performance.now();
    const tick = () => (performance.now() - t0 > 1200 ? res() : requestAnimationFrame(tick));
    tick();
  });
  const host = c.parentElement;
  c._firstPaintMs = null;
  c.remove();                                  // the suspend detaches it
  await new Promise((r) => setTimeout(r, 60));
  host.appendChild(c);                         // and the SAME element comes back
  await c.updateComplete;
  const frames = [];
  await new Promise((res) => {
    const t0 = performance.now();
    const tick = () => {
      const cd = c.shadowRoot?.querySelector("#chart");
      frames.push(cd ? cd.querySelectorAll("svg *").length : 0);
      if (c._firstPaintMs !== null || performance.now() - t0 > 15000) res();
      else requestAnimationFrame(tick);
    };
    tick();
  });
  return { first: frames[0], everEmpty: frames.some((n) => n === 0), drew: c._firstPaintMs !== null };
});
check(reattach.first > 50, "a re-attached card shows its chart again immediately",
  `${reattach.first} nodes on the first frame`);
check(!reattach.everEmpty, "and is never empty while redrawing");
check(reattach.drew, "and does redraw rather than keeping the placeholder");

// ── 5. the cache is bounded ──────────────────────────────────────────────────
const bounded = await page.evaluate(() => {
  const C = customElements.get("meteogram-card");
  for (let i = 0; i < 40; i++) C._rememberChart(`sig-${i}`, "<svg></svg>", 10, 10);
  return C._chartCache.size;
});
check(bounded <= 8, "the cache does not grow without limit", `${bounded} entries`);
check(errors.length === 0, "no page errors", errors.join("; "));

console.log(failed ? "\nhandoff: FAILED" : "\n11/11 passed");
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
