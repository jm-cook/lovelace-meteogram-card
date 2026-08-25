// A re-attached card holds its draw, when it has a chart to hold behind.
//
// Home Assistant re-attaches the live element and then replaces it about a second later,
// repeatedly — observed at 09:55, 10:03 and 10:21 on one panel dashboard. Each cycle the
// re-attached element built a complete chart and was discarded a second after finishing
// it, so half of every draw the card made was thrown away. The tally said it outright:
// `new element 3, first load 2`.
//
// The mechanism already existed for websocket reconnects, whose docstring describes this
// exact situation — "decline to spend a redraw on an element that is about to be
// discarded" — but it was gated on the connected false→true edge, and these re-attaches
// come without one.
//
// It was not applied to re-attachment because at the time a re-attached card was empty,
// so waiting only lengthened the blank. The chart handover landed afterwards and removed
// the blank. Hence the gate below: hold only behind an inherited chart, never over an
// empty card.
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
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
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

const drawsBy = (no, lines) =>
  lines.filter((l) => l.includes(` #${no}  `) && l.includes("  drew  ")).length;

// ── the reported cycle: re-attach, then replaced a second later ──────────────
const cycle = await page.evaluate(async () => {
  const el = document.querySelector("meteogram-card");
  const K = el.constructor;
  const host = el.parentElement;
  const no = el._elementNo;
  const before = drawsOf(no);
  function drawsOf(n) {
    return K._recentDraws.filter((l) => l.includes(` #${n}  `) && l.includes("  drew  ")).length;
  }
  // Detach and re-attach, the way Home Assistant re-parents a card.
  el.remove();
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 1000));      // the observed gap
  const duringHold = drawsOf(no);
  // …and then it is discarded, exactly as Home Assistant does.
  el.remove();
  await new Promise((r) => setTimeout(r, 3000));      // well past the hold
  return { before, duringHold, after: drawsOf(no),
    held: K._recentDraws.filter((l) => /re-attached/.test(l)).length };
});

check(cycle.held > 0, "a re-attached card says it is waiting", `${cycle.held} hold note(s)`);
check(cycle.duringHold === cycle.before,
  "and does not draw during the second before it is replaced",
  `${cycle.duringHold - cycle.before} draw(s)`);
check(cycle.after === cycle.before,
  "so an element that is discarded never draws at all",
  `${cycle.after - cycle.before} draw(s) in total`);

// ── a survivor still draws, just later ───────────────────────────────────────
const survivor = await page.evaluate(async () => {
  const K = customElements.get("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:800px;height:400px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  el.hass = document.querySelector("meteogram-card")?.hass ?? window.__hass;
  el.setConfig({ latitude: 58.4314, longitude: 8.8255, display_mode: "full",
    meteogram_hours: "48h", show_wind: true, show_sun: true, show_pressure: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true });
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 2500));
  const no = el._elementNo;
  const drawsOf = () => K._recentDraws.filter(
    (l) => l.includes(` #${no}  `) && l.includes("  drew  ")).length;
  const before = drawsOf();
  el.remove(); host.appendChild(el);                  // re-attach, then let it live
  await new Promise((r) => setTimeout(r, 5000));
  const svg = el.shadowRoot.querySelector("#chart svg");
  const out = { drew: drawsOf() - before, nodes: svg?.querySelectorAll("*").length ?? 0 };
  el.remove(); host.remove();
  return out;
});
check(survivor.drew >= 1, "a card that survives the hold does draw",
  `${survivor.drew} draw(s)`);
check(survivor.nodes > 50, "and ends up with a real chart, not the inherited copy",
  `${survivor.nodes} nodes`);

// ── never hold over an empty card ────────────────────────────────────────────
// The regression this gate exists to prevent: with nothing inherited there is nothing to
// wait behind, and holding would restore the six-second blank that made re-attachment
// draw immediately in the first place.
const noCache = await page.evaluate(async () => {
  const K = customElements.get("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:800px;height:400px;position:relative";
  document.body.appendChild(host);
  const el = document.createElement("meteogram-card");
  el.hass = document.querySelector("meteogram-card")?.hass;
  // A configuration nothing on this page has drawn, so no chart can be inherited.
  el.setConfig({ latitude: -33.87, longitude: 151.21, display_mode: "core",
    meteogram_hours: "48h", show_sun: true, show_precipitation: true,
    show_weather_icons: true });
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 2500));
  // Re-attach with the cache emptied and the chart div emptied: exactly the state the
  // hold must not be entered from, since there would be nothing on screen to wait behind.
  el.remove();
  K._chartCache.clear();
  el.shadowRoot.querySelector("#chart").innerHTML = "";
  el._holdDrawsUntil = 0;
  host.appendChild(el);
  await new Promise((r) => setTimeout(r, 200));
  const out = {
    adopted: el._adoptedSvg,
    heldFor: Math.max(0, Math.round(el._holdDrawsUntil - Date.now())),
  };
  el.remove(); host.remove();
  return out;
});
check(noCache.adopted === false, "nothing was inherited, as the case requires",
  `adopted=${noCache.adopted}`);
check(noCache.heldFor === 0,
  "and with nothing to wait behind the draw is not held at all",
  `hold would have been ${noCache.heldFor}ms`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "reattach-hold: FAILED" : "reattach-hold: ok");
process.exit(failed ? 1 : 0);
