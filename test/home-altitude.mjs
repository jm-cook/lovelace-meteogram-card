// met.no asks for an altitude, and without one resolves the point against a coarse
// global elevation model. Home Assistant already holds the elevation its owner entered
// for their home, so a card that has fallen back to the home coordinates should use the
// home elevation with them rather than leaving met.no to guess.
//
// It is also part of the request and therefore part of the cache key, so two cards on one
// dashboard that differ only in altitude run out of two separate caches with two
// different expiry times — which is how the omission was noticed.
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
const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
let failed = false;
const check = (ok, label, extra = "") => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${extra ? "  (" + extra + ")" : ""}`);
  if (!ok) failed = true;
};

await page.goto(`http://127.0.0.1:${server.address().port}/dev.html`, { waitUntil: "load" });
await page.evaluate(() => customElements.whenDefined("meteogram-card"));
// Nothing must reach met.no: this is about what the card resolves, not what it draws.
await page.route("**://api.met.no/**", (r) => r.abort());

// A fresh element each time — latitude and longitude are properties that survive a
// second setConfig, so reusing one card would carry the previous test's coordinates in.
const build = (config, haConfig) => page.evaluate(async ([cfg, ha]) => {
  const card = document.createElement("meteogram-card");
  card.setConfig(cfg);
  card.hass = { language: "en", locale: { language: "en", time_format: "24" }, config: ha };
  document.body.appendChild(card);
  await card.updateComplete;
  await new Promise((r) => setTimeout(r, 150));
  const out = {
    latitude: card.latitude, longitude: card.longitude, altitude: card.altitude,
    fromHome: card._altitudeFromHome,
    apiAltitude: card._weatherApiInstance?.altitude ?? null,
  };
  card.remove();
  return out;
}, [config, haConfig]);

const HOME = { latitude: 59.9405, longitude: 5.4835, elevation: 214, version: "2026.8.2" };

const inherited = await build({ type: "custom:meteogram-card" }, HOME);
check(inherited.latitude === 59.9405 && inherited.longitude === 5.4835,
  "falls back to the home coordinates", `${inherited.latitude}, ${inherited.longitude}`);
check(inherited.altitude === 214, "and takes the home elevation with them",
  `altitude ${inherited.altitude}`);
check(inherited.fromHome === true, "marked as inherited rather than configured");
check(inherited.apiAltitude === 214, "the elevation reaches the weather api",
  `api altitude ${inherited.apiAltitude}`);

const configured = await build(
  { type: "custom:meteogram-card", altitude: 8 }, HOME);
check(configured.altitude === 8, "an altitude in the card config always wins",
  `altitude ${configured.altitude}`);
check(configured.fromHome === false, "and is not marked as inherited");

const elsewhere = await build(
  { type: "custom:meteogram-card", latitude: 60.39, longitude: 5.32 }, HOME);
check(elsewhere.altitude === undefined,
  "explicit coordinates do not get the home elevation", `altitude ${elsewhere.altitude}`);

// Sea level is a real elevation. A truthiness test would drop it.
const seaLevel = await build({ type: "custom:meteogram-card" },
  { ...HOME, elevation: 0 });
check(seaLevel.altitude === 0, "an elevation of zero is honoured, not treated as absent",
  `altitude ${seaLevel.altitude}`);

const noElevation = await build({ type: "custom:meteogram-card" },
  { latitude: 59.9405, longitude: 5.4835 });
check(noElevation.altitude === undefined && noElevation.fromHome === false,
  "a home with no elevation leaves the altitude unset", `altitude ${noElevation.altitude}`);

check(errors.length === 0, "no page errors", errors[0] ?? "");
await browser.close(); server.close();
console.log(failed ? "home-altitude: FAILED" : "home-altitude: ok");
process.exit(failed ? 1 : 0);
