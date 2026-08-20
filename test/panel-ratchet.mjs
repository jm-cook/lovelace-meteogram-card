// Issue #46: in a panel dashboard nothing above the card fixes its height, so the card's
// height comes from its own content — and the card sized that content from the container
// it had just filled. Each draw added the slack between the two and the card grew until
// it covered the screen.
//
// The card is put in a container with a definite width and no height at all, which is the
// shape a panel view gives it, and drawn repeatedly. Its height must not move, and must
// come from the configured aspect ratio rather than from the chart.
//
// Honestly: this does not reproduce the reporter's growth. Against the pre-fix bundle the
// card does not ratchet here, it pins to #chart's 180px min-height — that floor is the
// loop's fixed point, and their card escaped it by starting from a height the dashboard
// had given it. What the test does pin down is the cause: before, the height the card drew
// at was read back out of the card's own content; now it is decided by the aspect ratio
// before anything is drawn, so no amount of slack between the two can accumulate.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const BUNDLE = process.env.METEOGRAM_BUNDLE ?? "dist/meteogram-card.js";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".map": "application/json", ".css": "text/css" };

const server = await new Promise((ok) => {
  const sv = createServer(async (q, res) => {
    try {
      let rel = decodeURIComponent(q.url.split("?")[0]);
      if (rel === "/dist/meteogram-card.js") rel = "/" + BUNDLE;
      const p = join(ROOT, rel);
      const b = await readFile(p);
      res.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
      res.end(b);
    } catch { res.writeHead(404).end(); }
  });
  sv.listen(0, "127.0.0.1", () => ok(sv));
});
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
page.on("pageerror", (e) => console.error("PAGEERROR:", String(e)));
page.on("console", (m) => { if (m.type() === "error") console.error("CONSOLE:", m.text()); });
const fail = (m) => { console.error("FAIL: " + m); failed = true; };
let failed = false;

await page.goto(`http://127.0.0.1:${port}/dev.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 30000 });

// Stop the harness driving its own redraws, then rehouse the card the way a panel does:
// full width, and a height nobody has decided.
await page.evaluate(() => {
  const a = document.getElementById("auto");
  if (a?.checked) { a.checked = false; a.dispatchEvent(new Event("change")); }
  const card = document.querySelector("meteogram-card");
  const panel = document.createElement("div");
  panel.id = "panel";
  panel.style.cssText = "width:1700px;";      // no height at all
  card.parentElement.replaceChild(panel, card);
  panel.appendChild(card);
  card.setConfig({ ...(card._config ?? {}), layout_mode: "panel", aspect_ratio: "16:9" });
});
await page.waitForTimeout(1200);

const measure = () => page.evaluate(() => {
  const card = document.querySelector("meteogram-card");
  const chart = card.shadowRoot.querySelector("#chart");
  return {
    panel: Math.round(document.getElementById("panel").getBoundingClientRect().height),
    container: Math.round(chart.parentElement.clientHeight),
    svg: Math.round(Number(chart.querySelector("svg")?.getAttribute("height") ?? 0)),
  };
});

const first = await measure();
const seen = [first];
for (let i = 0; i < 8; i++) {
  await page.evaluate(() => {
    const c = document.querySelector("meteogram-card");
    c._weatherApiInstance = null;
    c._scheduleDrawMeteogram("panel-ratchet", true);
  });
  await page.waitForTimeout(400);
  seen.push(await measure());
}
seen.forEach((m, i) =>
  console.log(`   draw ${i}: panel ${m.panel}  container ${m.container}  svg ${m.svg}`));

const grew = seen[seen.length - 1].panel - first.panel;
if (grew !== 0) fail(`the card grew ${grew}px over 8 draws (${first.panel} → ${seen[seen.length - 1].panel})`);
if (first.panel < 200) fail(`the card collapsed to ${first.panel}px in a container with no height`);
// A container with no height of its own should be sized by the aspect ratio, not by us.
const expected = Math.round(1700 * 9 / 16);
if (Math.abs(first.container - expected) > 40)
  fail(`container is ${first.container}px, expected about ${expected}px from the 16:9 ratio`);

// A container that does have a height still rules: the percentage resolves, and
// aspect-ratio applies only to an auto height, so the card fills it rather than being
// letterboxed to 16:9.
await page.evaluate(() => {
  document.getElementById("panel").style.height = "620px";
  const c = document.querySelector("meteogram-card");
  c._weatherApiInstance = null;
  c._scheduleDrawMeteogram("panel-ratchet-fixed", true);
});
await page.waitForTimeout(600);
const fixed = await measure();
console.log(`   fixed 620px container: panel ${fixed.panel}  container ${fixed.container}  svg ${fixed.svg}`);
if (Math.abs(fixed.panel - 620) > 2)
  fail(`a 620px container gave a ${fixed.panel}px card — the ratio overrode a real height`);

console.log(failed ? "panel-ratchet: FAILED" : "panel-ratchet: ok — height held across 8 draws");
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
