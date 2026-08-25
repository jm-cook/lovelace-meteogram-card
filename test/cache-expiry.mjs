// The forecast cache is timed by a duration, not by an absolute moment.
//
// `Date.now() < this._expiresAt` is the whole of the cache's protection, and storing the
// Expires header's absolute time made it depend on the client's clock being right. This
// card's usual home is a wall panel, and a Raspberry Pi running a browser full-screen has
// no battery-backed clock: it boots at whatever time it last knew and stays there until
// NTP catches up. A device an hour fast fails the check on every draw and refetches every
// time — the exact polling the cache exists to prevent, arriving through a fault nobody
// would think to look for.
//
// met.no sends Date with Expires, both from its own clock, so their difference is a
// duration no client clock can distort. It does not need met.no's clock to be right,
// only self-consistent.
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

await page.goto(`http://127.0.0.1:${server.address().port}/dev.html`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
  return s && s.querySelectorAll("*").length > 50;
}, null, { timeout: 60000 });

// Serve one response with headers of our choosing, and report the validity the card
// derived from it, in minutes from now.
const validityFor = (dateOffsetMin, expiresOffsetMin, omitDate = false) =>
  page.evaluate(async ([dOff, eOff, omit]) => {
    const api = document.querySelector("meteogram-card")._weatherApiInstance;
    const realFetch = window.fetch;
    // The fixture is a captured response: { capturedAt, body }, where body is the raw
    // met.no document. dev.html unwraps it the same way.
    const fixture = await (await realFetch("./test/fixtures/metno-forecast.json")).json();
    const body = fixture.body ?? fixture;
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input?.url ?? "";
      if (url.includes("met.no")) {
        const headers = { "content-type": "application/json",
          expires: new Date(Date.now() + eOff * 60000).toUTCString() };
        if (!omit) headers.date = new Date(Date.now() + dOff * 60000).toUTCString();
        return new Response(JSON.stringify(body), { status: 200, headers });
      }
      return realFetch(input, init);
    };
    api._expiresAt = Date.now() - 1000;
    api._lastFetchTime = null;
    api._throttledUntil = 0;
    try { await api.getForecastData(); } catch { /* reported by the assertion */ }
    const mins = (api._expiresAt - Date.now()) / 60000;
    window.fetch = realFetch;
    return Math.round(mins * 10) / 10;
  }, [dateOffsetMin, expiresOffsetMin, omitDate]);

const near = (v, want, tol = 1.5) => Math.abs(v - want) <= tol;

// ── the ordinary case ────────────────────────────────────────────────────────
const normal = await validityFor(0, 31);
check(near(normal, 31), "an ordinary response is good for the window met.no gave it",
  `${normal} min`);

// ── a client clock running three hours fast ──────────────────────────────────
// Headers three hours "behind" now is indistinguishable from our clock being three hours
// ahead of met.no's. Under the old code the stored deadline was 2.5 hours in the past, so
// the cache check failed on every draw and every draw fetched.
const fast = await validityFor(-180, -180 + 31);
check(near(fast, 31),
  "a clock three hours fast does not expire the cache the moment it is written",
  `${fast} min`);
check(fast > 0, "which is the difference between a cache and no cache at all");

// ── a client clock running three hours slow ──────────────────────────────────
const slow = await validityFor(180, 180 + 31);
check(near(slow, 31), "and a clock three hours slow does not pin stale weather either",
  `${slow} min`);

// ── the header is not ours to trust, at either end ───────────────────────────
const absurd = await validityFor(0, 60 * 24 * 30);          // a month
check(near(absurd, 360, 2), "an absurd window is capped, so stale weather cannot persist",
  `${absurd} min, ceiling 360`);
const backwards = await validityFor(0, -45);                 // expires before it was sent
check(near(backwards, 1, 0.6),
  "and one already past becomes a short wait rather than an instant refetch",
  `${backwards} min, floor 1`);

// ── nothing to measure against ───────────────────────────────────────────────
const noDate = await validityFor(0, 31, true);
check(near(noDate, 30), "without a Date header the published cadence is the default",
  `${noDate} min`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "cache-expiry: FAILED" : "cache-expiry: ok");
process.exit(failed ? 1 : 0);
