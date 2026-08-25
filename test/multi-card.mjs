// Two cards on one page.
//
// Never tested until now, and the card has a good deal of *static* state: the redraw
// log, the chart cache used for handovers, the page-has-drawn flag that suppresses the
// opening animation, and the draw tally. Every one of those is shared by every card on
// the page, so the interesting failures here are cards contaminating each other rather
// than either one being wrong on its own.
//
// The element numbers on the log lines are what make this checkable: a draw can be
// attributed to the card that made it, so "changing one card redrew the other" is a
// question with an answer.
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
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
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

// Two cards, deliberately unalike: different place, different mode, different size.
const built = await page.evaluate(async () => {
  const seed = document.querySelector("meteogram-card");
  const hass = seed.hass;
  const make = async (cfg, w, h) => {
    const host = document.createElement("div");
    host.style.cssText = `width:${w}px;height:${h}px;position:relative`;
    document.body.appendChild(host);
    const el = document.createElement("meteogram-card");
    el.hass = hass;
    el.setConfig(cfg);
    host.appendChild(el);
    return { el, host };
  };
  window.__a = await make({ latitude: 58.4314, longitude: 8.8255, display_mode: "full",
    meteogram_hours: "48h", show_wind: true, show_sun: true, show_pressure: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true }, 900, 460);
  window.__b = await make({ latitude: 60.39, longitude: 5.32, display_mode: "core",
    meteogram_hours: "24h", show_wind: false, show_sun: true, show_pressure: false,
    show_precipitation: true, show_cloud_cover: false, show_weather_icons: true }, 620, 320);
  await new Promise((r) => setTimeout(r, 3000));
  const read = (o) => {
    const svg = o.el.shadowRoot.querySelector("#chart svg");
    return { no: o.el._elementNo, w: Number(svg?.getAttribute("width")),
      h: Number(svg?.getAttribute("height")), nodes: svg?.querySelectorAll("*").length ?? 0,
      lat: o.el.latitude, mode: o.el.displayMode,
      wind: !!svg?.querySelector(".wind-barb, .wind-band, [class*=wind]"),
      pressure: !!svg?.querySelector(".pressure-line") };
  };
  return { a: read(window.__a), b: read(window.__b) };
});

check(built.a.nodes > 50 && built.b.nodes > 50, "both cards draw a chart of their own",
  `${built.a.nodes} and ${built.b.nodes} nodes`);
check(built.a.no !== built.b.no, "and are distinguishable in the shared log",
  `#${built.a.no} and #${built.b.no}`);
check(built.a.w !== built.b.w || built.a.h !== built.b.h,
  "each at its own size, not the other's",
  `${built.a.w}×${built.a.h} vs ${built.b.w}×${built.b.h}`);
// The handover cache is keyed on every display option, so a differently configured
// neighbour must never be handed this one's chart.
check(built.a.pressure && !built.b.pressure,
  "settings do not leak between them (pressure on in one, off in the other)",
  `a=${built.a.pressure} b=${built.b.pressure}`);

// ── changing one must not redraw the other ───────────────────────────────────
const cross = await page.evaluate(async () => {
  const log = () => document.querySelector("meteogram-card").constructor._recentDraws;
  const drawsBy = (no, from) => from.filter(
    (l) => l.includes(` #${no}  `) && l.includes("  drew  ")).length;
  const before = log().slice();
  const aNo = window.__a.el._elementNo, bNo = window.__b.el._elementNo;
  const beforeA = drawsBy(aNo, before), beforeB = drawsBy(bNo, before);
  window.__b.el.setConfig({ ...(window.__b.el._config ?? {}),
    latitude: 60.39, longitude: 5.32, display_mode: "core", meteogram_hours: "48h",
    show_precipitation: true, show_weather_icons: true, show_sun: true });
  await new Promise((r) => setTimeout(r, 2500));
  const after = log().slice();
  return { a: drawsBy(aNo, after) - beforeA, b: drawsBy(bNo, after) - beforeB };
});
check(cross.b > 0, "reconfiguring a card redraws it", `${cross.b} draw(s)`);
check(cross.a === 0, "and leaves its neighbour alone", `${cross.a} draw(s) on the other`);

// ── removing one must not disturb the other ──────────────────────────────────
const survives = await page.evaluate(async () => {
  window.__b.el.remove(); window.__b.host.remove();
  await new Promise((r) => setTimeout(r, 300));
  const el = window.__a.el;
  el._forceNextDraw = true;
  el._scheduleDrawMeteogram("after-neighbour-removed", true);
  await new Promise((r) => setTimeout(r, 1500));
  const svg = el.shadowRoot.querySelector("#chart svg");
  return { nodes: svg?.querySelectorAll("*").length ?? 0, connected: el.isConnected };
});
check(survives.connected && survives.nodes > 50,
  "removing one card leaves the other drawing normally", `${survives.nodes} nodes`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "multi-card: FAILED" : "multi-card: ok");
process.exit(failed ? 1 : 0);
