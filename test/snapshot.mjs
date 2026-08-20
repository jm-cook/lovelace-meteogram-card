/**
 * Render the card headlessly and print its SVG, deterministically.
 *
 * The point is to be able to compare two builds and trust the difference. That needs
 * three things nailed down, because without them a re-run differs from itself and the
 * comparison is worthless:
 *
 *   1. The forecast. test.html fetches live met.no data, which changes hourly. The
 *      request is intercepted and served from a fixture instead.
 *   2. The clock. The chart positions "now", date labels and hour ticks against the
 *      current time, so a run either side of an hour boundary would differ. Date is
 *      frozen inside the page.
 *   3. The viewport, since the layout is responsive.
 *
 * Usage:
 *   node test/snapshot.mjs --capture          refresh the fixture from live met.no
 *   node test/snapshot.mjs > /tmp/before.svg  render and print the SVG
 */

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FIXTURE = join(ROOT, "test/fixtures/metno-forecast.json");
const CAPTURE = process.argv.includes("--capture");
// Extra card config, as JSON, merged over what test.html sets. Needed to snapshot the
// display modes, which lay out very differently above and below the plot.
const cfgIdx = process.argv.indexOf("--config");
const EXTRA_CONFIG = cfgIdx !== -1 ? JSON.parse(process.argv[cfgIdx + 1]) : null;

// test.html's defaults. The fixture is for these coordinates; changing one means
// recapturing the other.
const LAT = 58.4314;
const LON = 8.8255;
const VIEWPORT = { width: 900, height: 700 };

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".map": "application/json", ".css": "text/css",
  ".svg": "image/svg+xml",
};

/** Serve the repo over http — file:// would fail CORS on the module import and fetch. */
function serve() {
  const server = createServer(async (req, res) => {
    try {
      const path = join(ROOT, decodeURIComponent(req.url.split("?")[0]));
      if (!path.startsWith(ROOT)) return res.writeHead(403).end();
      const body = await readFile(path);
      res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

async function captureFixture() {
  const url = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${LAT}&lon=${LON}`;
  // met.no requires an identifying User-Agent and rejects generic ones.
  const r = await fetch(url, { headers: { "User-Agent": "meteogram-card-test/1.0 github.com/DTekNO" } });
  if (!r.ok) throw new Error(`met.no returned ${r.status}`);
  const json = await r.json();
  await mkdir(join(ROOT, "test/fixtures"), { recursive: true });
  await writeFile(FIXTURE, JSON.stringify({ capturedAt: new Date().toISOString(), body: json }, null, 1));
  const times = json?.properties?.timeseries?.length ?? 0;
  console.error(`captured ${times} timesteps to ${FIXTURE}`);
}

async function main() {
  if (CAPTURE) return captureFixture();

  if (!existsSync(FIXTURE)) {
    console.error("No fixture. Run: node test/snapshot.mjs --capture");
    process.exit(2);
  }
  const fixture = JSON.parse(await readFile(FIXTURE, "utf8"));

  // Freeze the clock one minute after capture, so the fixture is fresh relative to it
  // and no staleness path is taken.
  const frozen = new Date(new Date(fixture.capturedAt).getTime() + 60_000).toISOString();

  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEWPORT });

  await page.addInitScript((iso) => {
    const Real = Date;
    const fixedMs = new Real(iso).getTime();
    class Frozen extends Real {
      constructor(...a) { super(...(a.length ? a : [fixedMs])); }
      static now() { return fixedMs; }
    }
    // Assign through globalThis: a bare `Date = ...` throws in strict mode, which
    // module scripts are, and the init script would fail silently before the card loads.
    globalThis.Date = Frozen;
  }, frozen);

  // Match by hostname, not glob. The endpoint is aa015h6buqvih86i1.api.met.no, so a
  // pattern like "**​/api.met.no/**" never matches — it needs a literal "/api.met.no/"
  // and the host has ".api.met.no". That mismatch let the card wait on a real request
  // that never arrived, and the only symptom was a 30s timeout.
  let mocked = 0;
  await page.route(
    (url) => url.hostname.endsWith("met.no"),
    (route) => {
      mocked++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { expires: new Date(new Date(frozen).getTime() + 3600_000).toUTCString() },
        body: JSON.stringify(fixture.body),
      });
    }
  );

  // Weather icons are fetched from raw.githubusercontent.com at render time. Left
  // alone they make the snapshot depend on the network — and on this network they fail
  // outright, because bundled Chromium carries its own CA store and does not know the
  // corporate proxy's certificate. Serve a stub instead. The stub carries the icon
  // *name*, so the snapshot still changes if the card picks a different icon: that is
  // the signal we will want when isDaytimeAt is fixed.
  let icons = 0;
  await page.route(
    (url) => url.hostname.includes("githubusercontent") || url.pathname.endsWith(".svg"),
    (route) => {
      icons++;
      const name = route.request().url().split("/").pop().replace(/\.svg$/, "");
      return route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" data-stub-icon="${name}"><title>${name}</title></svg>`,
      });
    }
  );

  const errors = [];
  const failures = [];
  const logs = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`.slice(0, 200)));
  // Not fatal on its own: a failed asset fetch degrades the chart but does not
  // invalidate a before/after comparison, as long as both sides fail identically.
  page.on("requestfailed", (r) => failures.push(`${r.url()} ${r.failure()?.errorText}`));

  await page.goto(`http://127.0.0.1:${port}/test.html`, { waitUntil: "load" });

  if (EXTRA_CONFIG) {
    await page.evaluate(async (cfg) => {
      const card = document.querySelector("meteogram-card");
      // Re-apply the page's own config with the overrides on top, then let it settle.
      document.getElementById("updateBtn").click();
      const current = card._config ?? {};
      card.setConfig({ ...current, ...cfg });
    }, EXTRA_CONFIG);
    await page.waitForTimeout(1500);
  }

  // Wait for a chart with actual content, not merely an empty <svg>. On failure, say
  // what the page actually contained — a bare timeout tells you nothing about whether
  // the element is missing, the fetch stalled, or the card threw.
  try {
    await page.waitForFunction(() => {
      const svg = document.querySelector("meteogram-card")?.shadowRoot
        ?.querySelector("#chart svg");
      return svg && svg.querySelectorAll("*").length > 50;
    }, null, { timeout: 30_000 });
  } catch (e) {
    const state = await page.evaluate(() => {
      const card = document.querySelector("meteogram-card");
      const root = card?.shadowRoot;
      return {
        cardFound: !!card,
        defined: !!customElements.get("meteogram-card"),
        shadow: !!root,
        chartDiv: !!root?.querySelector("#chart"),
        svgNodes: root?.querySelector("#chart svg")?.querySelectorAll("*").length ?? 0,
        shadowHtml: (root?.innerHTML ?? "").slice(0, 400),
      };
    }).catch(() => null);
    console.error("timed out waiting for the chart.");
    console.error("  mocked met.no requests:", mocked);
    console.error("  page state:", JSON.stringify(state, null, 2));
    if (errors.length) console.error("  page errors:\n    " + errors.join("\n    "));
    if (logs.length) console.error("  last console lines:\n    " + logs.slice(-15).join("\n    "));
    await browser.close(); server.close();
    process.exit(1);
  }

  // Let the chart settle, then confirm it has stopped changing.
  //
  // Counting nodes is not enough. Deferred icon loading adds elements, so a stable count
  // used to mean a stable chart — but the first draw animates now, and a transition
  // moves attributes without adding or removing anything. A snapshot taken mid-flight
  // differs from itself run to run, which makes the whole comparison worthless. Compare
  // the serialised markup instead: it catches both.
  let last = "";
  for (let i = 0; i < 40; i++) {
    const now = await page.evaluate(() => document.querySelector("meteogram-card")
      ?.shadowRoot?.querySelector("#chart svg")?.outerHTML ?? "");
    if (now && now === last) break;
    last = now;
    await page.waitForTimeout(250);
  }

  const svg = await page.evaluate(() => document.querySelector("meteogram-card")
    ?.shadowRoot?.querySelector("#chart svg")?.outerHTML ?? "");

  await browser.close();
  server.close();

  // Only a thrown exception invalidates the render. An earlier version also treated a
  // failed asset request as fatal and threw away a chart that had drawn perfectly well.
  if (errors.length) {
    console.error("page errors:\n  " + errors.join("\n  "));
    process.exit(1);
  }
  if (!svg) {
    console.error("no svg rendered");
    process.exit(1);
  }
  if (failures.length) {
    const hosts = [...new Set(failures.map((f) => new URL(f.split(" ")[0]).hostname))];
    console.error(`warning: ${failures.length} asset request(s) failed from ${hosts.join(", ")}`);
  }
  console.error(`rendered ${last} svg nodes  (met.no mocked x${mocked}, icons stubbed x${icons})`);
  process.stdout.write(svg);
}

main().catch((e) => { console.error(e); process.exit(1); });
