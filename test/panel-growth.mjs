/**
 * A card whose container has no fixed height must not grow on redraw.
 *
 * The chart div is styled height:100%, so where nothing sets the card's height from
 * outside, its height comes from what is inside it. Measuring the div and then sizing the
 * svg from that measurement closes a loop — svg height from div height from svg height —
 * and the card creeps downward on every redraw.
 *
 * HONEST LIMIT: this does not reproduce issue #46. With the container height removed
 * entirely the chart div measures near zero, and the too-small-to-draw guard skips the
 * draw before any loop can start, so this passes with or without the measurement fix. It
 * guards the invariant, not the reported bug. Reproducing #46 needs a container that has
 * some height and can still be pushed by its content, which nothing here builds.
 *
 *   node test/panel-growth.mjs
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FIXTURE = join(ROOT, "test/fixtures/metno-forecast.json");
const MIME = { ".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",
               ".json":"application/json",".map":"application/json",".css":"text/css",".svg":"image/svg+xml" };

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
const port = server.address().port;
const fixture = JSON.parse(await readFile(FIXTURE, "utf8"));
const frozen = new Date(new Date(fixture.capturedAt).getTime() + 60_000).toISOString();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.addInitScript((iso) => {
  const Real = Date; const fixedMs = new Real(iso).getTime();
  class Frozen extends Real {
    constructor(...a) { super(...(a.length ? a : [fixedMs])); }
    static now() { return fixedMs; }
  }
  globalThis.Date = Frozen;
}, frozen);
await page.route((u) => u.hostname.endsWith("met.no"), (r) => r.fulfill({
  status: 200, contentType: "application/json",
  headers: { expires: new Date(new Date(frozen).getTime() + 3600_000).toUTCString() },
  body: JSON.stringify(fixture.body),
}));
await page.route((u) => u.hostname.includes("githubusercontent") || u.pathname.endsWith(".svg"),
  (r) => r.fulfill({ status: 200, contentType: "image/svg+xml",
    body: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>` }));

await page.goto(`http://127.0.0.1:${port}/test.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 30_000 });

// Take the height off the container: this is what a panel dashboard does.
await page.evaluate(() => {
  const box = document.querySelector(".card");
  box.style.height = "auto";
  box.style.minHeight = "0";
  const card = document.querySelector("meteogram-card");
  card.style.height = "auto";
  card.style.display = "block";
});
await page.waitForTimeout(800);
console.log("  container after removing the height:", await page.evaluate(() => {
  const box = document.querySelector(".card");
  const card = document.querySelector("meteogram-card");
  const chart = card.shadowRoot.querySelector("#chart");
  return `.card=${Math.round(box.getBoundingClientRect().height)} card=${Math.round(card.getBoundingClientRect().height)} #chart=${Math.round(chart.getBoundingClientRect().height)}`;
}));

const heights = [];
for (let i = 0; i < 8; i++) {
  await page.evaluate(() => {
    const c = document.querySelector("meteogram-card");
    c._scheduleDrawMeteogram("panel-growth-test", true);
  });
  await page.waitForTimeout(500);
  heights.push(await page.evaluate(() =>
    Math.round(document.querySelector("meteogram-card").getBoundingClientRect().height)));
}

const first = heights[0];
const last = heights[heights.length - 1];
const grew = last - first;
console.log("  card height across 8 forced redraws:", heights.join(" → "));
console.log(`  growth: ${grew}px`);
console.log("  page errors:", errors.length ? errors.join("; ") : "none");

await browser.close();
server.close();

// A couple of pixels of settling is fine; a loop compounds without limit.
const ok = Math.abs(grew) <= 4 && errors.length === 0;
console.log(ok ? "\n1/1 passed" : "\nFAILED — the card grows when its container has no fixed height");
process.exit(ok ? 0 : 1);
