// Home Assistant detaches and re-attaches the same card element on every edit-mode
// round trip. connectedCallback registered its document/window handlers as
// `this._onVisibilityChange.bind(this)` and disconnectedCallback removed
// `this._onVisibilityChange.bind(this)` — bind() returns a NEW function each call, so
// the add registered one object and the remove asked for a different one that had never
// been registered. Every attach therefore left another live listener behind, all bound
// to the same element, and one tab switch later fired the handler once per round trip.
//
// The handlers are already arrow-function class fields, so the reference is stable
// without bind() at all.
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

// Count listeners by counting handler *invocations* for one dispatched event: the DOM
// gives no way to enumerate them, but a leaked listener is only a problem because it
// runs, so running is the right thing to measure.
await page.addInitScript(() => {
  window.__counts = { visibilitychange: 0, "location-changed": 0, orientationchange: 0 };
  for (const target of [document, window]) {
    const orig = target.addEventListener.bind(target);
    target.addEventListener = function (type, fn, opts) {
      if (type in window.__counts && typeof fn === "function") {
        const wrapped = function (...a) { window.__counts[type]++; return fn.apply(this, a); };
        fn.__wrapped = wrapped;
        return orig(type, wrapped, opts);
      }
      return orig(type, fn, opts);
    };
    const origR = target.removeEventListener.bind(target);
    target.removeEventListener = function (type, fn, opts) {
      if (type in window.__counts && typeof fn === "function" && fn.__wrapped)
        return origR(type, fn.__wrapped, opts);
      return origR(type, fn, opts);
    };
  }
});

await page.goto(`http://127.0.0.1:${server.address().port}/dev.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 30000 });

const fire = () => page.evaluate(() => {
  window.__counts = { visibilitychange: 0, "location-changed": 0, orientationchange: 0 };
  document.dispatchEvent(new Event("visibilitychange"));
  window.dispatchEvent(new Event("location-changed"));
  window.dispatchEvent(new Event("orientationchange"));
  return { ...window.__counts };
});

const base = await fire();
check(base.visibilitychange === 1, "one visibilitychange handler when freshly mounted",
  `got ${base.visibilitychange}`);

// Five edit-mode round trips: HA moves the same element between containers.
await page.evaluate(async () => {
  const card = document.querySelector("meteogram-card");
  const home = card.parentElement;
  const wrap = document.createElement("div");
  wrap.style.cssText = "width:640px;height:400px";
  home.appendChild(wrap);
  for (let i = 0; i < 5; i++) {
    wrap.appendChild(card);              // into "edit mode"
    await new Promise((r) => setTimeout(r, 60));
    home.insertBefore(card, wrap);       // and back out
    await new Promise((r) => setTimeout(r, 60));
  }
  await new Promise((r) => setTimeout(r, 400));
});

const after = await fire();
console.log(`  after 5 round trips: visibilitychange ${after.visibilitychange}, ` +
  `location-changed ${after["location-changed"]}, orientationchange ${after.orientationchange}`);
check(after.visibilitychange === 1, "still one visibilitychange handler",
  `got ${after.visibilitychange}`);
check(after["location-changed"] === 1, "still one location-changed handler",
  `got ${after["location-changed"]}`);
check(after.orientationchange === 1, "still one orientationchange handler",
  `got ${after.orientationchange}`);

// A detached card must leave nothing behind at all.
await page.evaluate(() => document.querySelector("meteogram-card").remove());
await page.waitForTimeout(200);
const gone = await fire();
check(gone.visibilitychange === 0 && gone["location-changed"] === 0 &&
      gone.orientationchange === 0, "removed card leaves no listeners",
  `got ${JSON.stringify(gone)}`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "listener-leak: FAILED" : "listener-leak: ok");
process.exit(failed ? 1 : 0);
