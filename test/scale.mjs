// Entering the dashboard editor wraps the card in hui-card-options, costing it ~10px of
// width and ~100px of height. In a panel that is a 1.5% change to the chart, and a full
// rebuild for it replaces every element in one frame — visible as a pop, to correct a
// difference too small to see.
//
// The svg carries a viewBox equal to the size it was drawn at, so a small change can be
// absorbed by setting width/height and leaving the viewBox alone: the browser scales the
// existing chart. The viewBox is also the drift bound — the tolerance is measured against
// it, not against the last scaled size, so repeated small changes cannot accumulate.
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
}, null, { timeout: 30000 });

// Mark the live svg so a rebuild can be told from a scale: a rebuild makes a new node
// and the mark goes with the old one.
const mark = () => page.evaluate(() => {
  const s = document.querySelector("meteogram-card").shadowRoot.querySelector("#chart svg");
  s.dataset.mark = "kept";
});
const read = () => page.evaluate(() => {
  const c = document.querySelector("meteogram-card");
  const s = c.shadowRoot.querySelector("#chart svg");
  return { mark: s?.dataset.mark ?? null, viewBox: s?.getAttribute("viewBox") ?? null,
    w: Number(s?.getAttribute("width")), h: Number(s?.getAttribute("height")),
    // The whole recent list, not the last line: a scale updates the draw key, so the
    // request that follows it logs "nothing changed" and would hide the entry.
    log: c.constructor._recentDraws.join("\n") };
});
// Set the container's CSS height and wait for the card to settle. Written as a
// content-box height, which is what .card's stylesheet rule sets — reading clientHeight
// and writing it back would add the 10px padding on each pass, and every "shrink" would
// silently be a grow.
const H0 = 460;
const resize = async (px) => {
  await page.evaluate((p) => {
    document.querySelector(".card").style.height = p + "px";
  }, px);
  await page.waitForTimeout(700);
};
await resize(H0);

const start = await read();
check(start.viewBox === `0 0 ${start.w} ${start.h}`,
  "the drawn svg's viewBox matches its pixel size", start.viewBox);

// --- a small change is scaled --------------------------------------------------------
await mark();
await resize(H0 - 9);                           // ~2%, inside the 4% tolerance
const small = await read();
check(small.mark === "kept", "a 2% change keeps the same svg element");
check(small.viewBox === start.viewBox, "the viewBox is left alone", small.viewBox);
check(small.h !== start.h && small.h !== Number(small.viewBox.split(" ")[3]),
  "width/height follow the container while the viewBox does not", `${small.w}x${small.h}`);
check(/scaled/.test(small.log), "the log says scaled",
  small.log.split("\n").filter((l) => /scaled/.test(l)).pop() ?? "no scaled line");

// --- returning to the drawn size is pixel-perfect again -------------------------------
await resize(H0);
const back = await read();
check(back.mark === "kept", "returning to the original size still does not rebuild");
check(back.viewBox === `0 0 ${back.w} ${back.h}`,
  "back on the viewBox exactly, so the chart is crisp again", `${back.w}x${back.h}`);

// --- drift is measured against the viewBox, not the last scale ------------------------
// Three successive 2% steps: each is inside the tolerance on its own, but the third is
// more than 4% from the drawn size and so must force a real redraw.
await mark();
let hh = H0;
let rebuilt = false;
for (let i = 0; i < 3; i++) {
  hh -= 9;
  await resize(hh);
  const r = await read();
  if (r.mark === null) { rebuilt = true; break; }
}
check(rebuilt, "accumulated drift past the tolerance forces a real redraw");
const after = await read();
check(after.viewBox === `0 0 ${after.w} ${after.h}`,
  "the redraw re-establishes an exact viewBox", after.viewBox);

// --- a large change is never scaled ---------------------------------------------------
await mark();
await resize(Math.round(H0 * 0.6));
const big = await read();
check(big.mark === null, "a 40% change rebuilds rather than scaling");
check(!/scaled/.test(big.log.split("\n").slice(-1)[0]),
  "and is not logged as scaled", big.log.split("\n").slice(-1)[0].trim());

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "scale: FAILED" : "scale: ok");
process.exit(failed ? 1 : 0);
