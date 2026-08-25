// Home Assistant replaces every card in a view when it re-emits the dashboard config,
// which its reconnect handler does. The card sees `hass.connected` flip false→true just
// before that, so it holds redraws briefly rather than spending one on an element that
// is about to be discarded.
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
await page.evaluate(() => {
  const a = document.getElementById("auto");
  if (a?.checked) { a.checked = false; a.dispatchEvent(new Event("change")); }
});

const r = await page.evaluate(async () => {
  const c = document.querySelector("meteogram-card");
  const setHass = (connected) => { c.hass = { ...c.hass, connected }; return c.updateComplete; };
  await setHass(true);
  await setHass(false);                       // socket dropped
  const t0 = performance.now();
  await setHass(true);                        // reconnected — the hold starts here
  const held = c._holdDrawsUntil - Date.now();
  const before = c.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  c._scheduleDrawMeteogram("test-after-reconnect");
  await new Promise((res) => setTimeout(res, 900));
  const during = c.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  // A forced redraw is a setting the user just changed; it must not wait.
  c._scheduleDrawMeteogram("test-forced", true);
  await new Promise((res) => setTimeout(res, 300));
  const forced = c.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  await new Promise((res) => setTimeout(res, 2600));
  const after = c.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  return { held, deferred: during - before, forcedDrew: forced - during,
           eventually: after - before, elapsed: performance.now() - t0,
           note: c.constructor._recentDraws.filter((l) => l.includes("held")).pop() ?? "" };
});

check(r.held > 1000, "a reconnect starts a hold", `${Math.round(r.held)}ms left`);
check(r.deferred === 0, "and an ordinary redraw does not run during it");
check(r.forcedDrew === 1, "but a forced redraw still goes straight through");
check(r.eventually >= 1, "the deferred redraw is not lost, only delayed");
check(r.note.includes("reconnected"), "the hold is recorded in the log", r.note.slice(11));
check(errors.length === 0, "no page errors", errors.join("; "));

// Home Assistant detaches the dashboard panel after five minutes hidden and re-appends
// the same elements on return, so connectedCallback runs on a card that has been drawing
// for an hour. Recorded: two draws in the same second, the second animating, and the card
// replaced five seconds later anyway.
const reattach = await page.evaluate(async () => {
  const c = document.querySelector("meteogram-card");
  const host = c.parentElement;
  c._holdDrawsUntil = 0;                 // start from a clean slate
  const before = c.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  c.remove();                                // detached, as the suspend does
  await new Promise((r) => setTimeout(r, 50));
  host.appendChild(c);                       // and back again — same element
  await c.updateComplete;
  const holding = c._holdDrawsUntil > Date.now();
  const marked = c._reattachDraw;          // set on re-attach; suppresses the animation
  const t0 = performance.now();
  // Both of the requests a re-attach produces, spaced beyond the 60ms coalesce window.
  c._scheduleDrawMeteogram("loadD3AndDraw");
  await new Promise((r) => setTimeout(r, 120));
  c._scheduleDrawMeteogram("_onResize-significant");
  await new Promise((r) => setTimeout(r, 900));
  const msToDraw = Math.round(performance.now() - t0);
  const after = c.constructor._recentDraws.filter((l) => l.includes("  drew  ")).length;
  return { holding, total: after - before, msToDraw, drewFast: after - before >= 1,
           marked, suppressed: c._remountDraw === true };
});

// Re-attachment holds — but only since the handover, and only behind an inherited chart.
//
// This block used to assert the opposite, and the reason it gave was true when it was
// written: Lit re-renders on the way back in and replaces the chart div, so the svg was
// gone and waiting only extended a blank card. Holding cost the full six seconds every
// time edit mode re-parented the card through hui-card-options.
//
// The chart handover removed that premise. A re-attached element now inherits its
// predecessor's chart before it draws, so there is something on screen for a hold to
// wait behind, and the wasted draw is worth avoiding: Home Assistant re-attaches the
// live element and replaces it about a second later, over and over — three times in half
// an hour on a panel dashboard, with the re-attached element building a complete chart
// each time and being discarded a second after finishing it.
//
// The gate is what keeps the old failure from returning: no inherited chart, no hold.
// That case is covered in test/reattach-hold.mjs, which drives it directly.
check(reattach.holding === true,
  "a re-attach holds, now that it has an inherited chart to hold behind");
check(!reattach.drewFast,
  "so it does not spend a draw on an element that is probably about to be replaced",
  `${reattach.total} draw(s) within ${reattach.msToDraw}ms`);
check(reattach.marked,
  "and the restoring draw is still marked not to animate, whenever it comes",
  `marked ${reattach.marked}`);

// A deferred draw must not outlive the element. Recorded: a hold started at 13:45:08,
// the card was replaced at 13:45:11, and the draw fired at 13:45:14 on the removed
// element, measuring 0x0 and logging "tiny  too small" after its replacement had drawn.
const orphan = await page.evaluate(async () => {
  const c = document.querySelector("meteogram-card");
  const host = c.parentElement;
  c._holdDrawsUntil = 0;
  const before = c.constructor._recentDraws.length;
  c._scheduleDrawMeteogram("test-pending");     // a draw is now queued
  const queued = c._drawTimer !== null;
  c.remove();                                   // replaced, as a rebuild does
  const cleared = c._drawTimer === null;
  await new Promise((r) => setTimeout(r, 800));
  const added = c.constructor._recentDraws.slice(before);
  host.appendChild(c);                          // put it back for the tests that follow
  return { queued, cleared, added };
});
check(orphan.queued, "a draw can be pending when the card is removed");
check(orphan.cleared, "removal cancels it");
check(!orphan.added.some((l) => l.includes("tiny")),
  "so no orphaned draw reports a 0x0 container", orphan.added.join(" | ") || "nothing logged");

console.log(failed ? "\nreconnect: FAILED" : "\n12/12 passed");
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
