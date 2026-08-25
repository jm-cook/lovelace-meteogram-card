// Which card element wrote each line of the redraw log.
//
// `_recentDraws` is static: one list for the page, shared by every card on it and
// surviving the replacement of any of them. That is deliberate — a rebuild would
// otherwise wipe the history of what came before it — but it makes a run of identical
// lines ambiguous. Three `forecast refresh` draws inside one second, reported
// 2026-08-25, could be one element drawing three times or three live elements drawing
// once each, and those have entirely different causes. Nothing on the line said which.
//
// The ancestry line cannot answer it: `_lastAncestry` is per-element, so an element that
// has drawn before stays silent, which is precisely the case in question.
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

const log = () => page.evaluate(() =>
  document.querySelector("meteogram-card").constructor._recentDraws.slice());

// ── one element, drawing repeatedly ──────────────────────────────────────────
const idsOf = (lines) => new Set(lines.map((l) => (l.match(/ #(\d+) /) ?? [])[1]).filter(Boolean));
await page.evaluate(async () => {
  const c = document.querySelector("meteogram-card");
  for (let i = 0; i < 3; i++) {
    c._forceNextDraw = true;
    c._scheduleDrawMeteogram("test-repeat", true);
    await new Promise((r) => setTimeout(r, 700));
  }
});
const afterOne = await log();
check(afterOne.every((l) => / #\d+ /.test(l)),
  "every line says which element wrote it", `${afterOne.length} lines`);
check(idsOf(afterOne.slice(-4)).size === 1,
  "one element drawing repeatedly keeps one id throughout",
  [...idsOf(afterOne.slice(-4))].map((n) => "#" + n).join(", "));

// ── two elements alive, both drawing ─────────────────────────────────────────
const two = await page.evaluate(async () => {
  const first = document.querySelector("meteogram-card");
  const host = document.createElement("div");
  host.style.cssText = "width:700px;height:360px;position:relative";
  document.body.appendChild(host);
  const second = document.createElement("meteogram-card");
  second.hass = first.hass;
  second.setConfig({ latitude: 60.39, longitude: 5.32, display_mode: "core",
    meteogram_hours: "48h", show_wind: true, show_sun: true,
    show_precipitation: true, show_cloud_cover: true, show_weather_icons: true });
  host.appendChild(second);
  await new Promise((r) => setTimeout(r, 2000));
  // Alternate, the way two independent cards refreshing would interleave.
  for (let i = 0; i < 2; i++) {
    first._forceNextDraw = true;
    first._scheduleDrawMeteogram("test-a", true);
    await new Promise((r) => setTimeout(r, 600));
    second._forceNextDraw = true;
    second._scheduleDrawMeteogram("test-b", true);
    await new Promise((r) => setTimeout(r, 600));
  }
  const out = first.constructor._recentDraws.slice();
  second.remove(); host.remove();
  return out;
});

const numbers = idsOf(two.slice(-12));
check(numbers.size >= 2, "two elements are told apart in the shared log",
  `saw ${[...numbers].map((n) => "#" + n).join(", ")}`);
// The point of the whole thing: a run of identical lines is now attributable.
const drewLines = two.filter((l) => l.includes("  drew  ")).slice(-8);
check(idsOf(drewLines).size >= 2,
  "a run of draws from different elements can be told from one element repeating",
  drewLines.map((l) => (l.match(/ #(\d+) /) ?? ["", "?"])[1]).join(" "));

// ── the tally, which survives what the list cannot hold ──────────────────────
// Twenty entries over an eighteen-hour day is a keyhole, and the unusual entries are the
// first evicted. A count per trigger is bounded, cannot be evicted, and answers what the
// list cannot: what has been redrawing this card, and how often.
const tally = await page.evaluate(() => {
  const c = document.querySelector("meteogram-card");
  c.diagnostics = true;
  const line = c._setupHtml().replace(/<[^>]+>/g, " ");
  const m = /draws on this page since load: ([^\u00B7]*?)\s+In:/.exec(line + " In:");
  return {
    text: m ? m[1].trim() : null,
    raw: Object.fromEntries(c.constructor._drawTally),
  };
});
check(tally.text !== null, "the setup line carries a tally of draws by trigger",
  tally.text ?? "absent");
const counted = Object.values(tally.raw).reduce((a, b) => a + b, 0);
const drewInBuffer = (await log()).filter((l) => l.includes("  drew  ")).length;
check(counted >= drewInBuffer,
  "and counts at least what the capped list still shows",
  `tally ${counted} vs ${drewInBuffer} lines`);
check(Object.keys(tally.raw).length >= 2,
  "with the triggers kept apart, which is the question the list cannot answer",
  Object.keys(tally.raw).join(", "));

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "element-marker: FAILED" : "element-marker: ok");
process.exit(failed ? 1 : 0);
