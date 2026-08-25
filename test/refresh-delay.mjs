// A floor on the scheduled forecast refresh delay. Defensive: it closes off a spin that
// is possible in principle and was not observed in practice.
//
// The refresh is armed a minute after the forecast expires and re-armed by every draw,
// so an expiry already in the past would give a delay of zero — fire, force a redraw,
// arm another zero-delay timer — until a fetch moved the expiry forward.
//
// Two things this is NOT, both of which were claimed during the investigation and are
// wrong. It does not explain three forecast-refresh draws landing in one second in a
// reported log; an idle card makes none in 100 seconds. And met.no does not serve a past
// Expires — measured, it is about 31 minutes ahead. The past expiry that started this is
// dev.html stubbing the header to Date.now() - 1000 deliberately, which is also why this
// test can exercise the floor at all.
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
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
let failed = false;
const check = (ok, label, extra = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${extra ? "  (" + extra + ")" : ""}`);
  if (!ok) failed = true;
};

// The card logs the delay it settled on, which is more direct than inferring it from
// how long nothing happens.
const armed = [];
page.on("console", (m) => {
  const t = m.text();
  const hit = /scheduled-refresh-after-expiresAt in (-?\d+)s/.exec(t);
  if (hit) armed.push(Number(hit[1]));
});

await page.goto(`http://127.0.0.1:${server.address().port}/dev.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 30000 });

// An expiry an hour in the past: what a card finds after a laptop has been shut.
const drewBefore = await page.evaluate(() => {
  const c = document.querySelector("meteogram-card");
  c.debug = true;
  c.apiExpiresAt = Date.now() - 3600 * 1000;
  c._forceNextDraw = true;
  c._scheduleDrawMeteogram("test-arm", true);
  return c.constructor._recentDraws.length;
});
await page.waitForTimeout(3500);

const after = await page.evaluate(() => {
  const c = document.querySelector("meteogram-card");
  return {
    total: c.constructor._recentDraws.length,
    refreshes: c.constructor._recentDraws.filter((l) => /forecast refresh/.test(l)).length,
  };
});

check(armed.length > 0, "the refresh timer was armed", `${armed.length} time(s)`);
check(armed.every((d) => d >= 60), "and never for less than the floor",
  `delays ${armed.join(", ")}s`);
check(after.refreshes === 0,
  "an expired forecast does not spin the refresh in the seconds after a draw",
  `${after.refreshes} forecast-refresh draw(s) in 3.5s`);
check(after.total - drewBefore <= 3,
  "and does not pile up draws either",
  `${after.total - drewBefore} new log entries`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "refresh-delay: FAILED" : "refresh-delay: ok");
process.exit(failed ? 1 : 0);
