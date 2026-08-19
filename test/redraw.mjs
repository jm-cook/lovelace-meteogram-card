/**
 * Redraw behaviour: a config change must reach the screen, and a burst must not draw
 * the chart several times over.
 *
 * Both were broken. The old scheduler throttled by discarding requests, while
 * updated() had already recorded the new state as drawn — so a discarded request lost
 * the change permanently, and requests spaced beyond the throttle each drew in full.
 *
 *   node test/redraw.mjs
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FIXTURE = join(ROOT, "test/fixtures/metno-forecast.json");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
               ".json": "application/json", ".map": "application/json", ".css": "text/css",
               ".svg": "image/svg+xml" };

function serve() {
  const server = createServer(async (req, res) => {
    try {
      const path = join(ROOT, decodeURIComponent(req.url.split("?")[0]));
      if (!path.startsWith(ROOT)) return res.writeHead(403).end();
      const body = await readFile(path);
      res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
      res.end(body);
    } catch { res.writeHead(404).end("not found"); }
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const checks = [];
const check = (name, pass, detail = "") => {
  checks.push(pass);
  console.log(`  ${pass ? "ok  " : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

async function main() {
  if (!existsSync(FIXTURE)) { console.error("No fixture."); process.exit(2); }
  const fixture = JSON.parse(await readFile(FIXTURE, "utf8"));
  const frozen = new Date(new Date(fixture.capturedAt).getTime() + 60_000).toISOString();
  const server = await serve();
  const port = server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });

  await page.addInitScript((iso) => {
    const Real = Date;
    const fixedMs = new Real(iso).getTime();
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

  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`http://127.0.0.1:${port}/test.html`, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const s = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
    return s && s.querySelectorAll("*").length > 50;
  }, null, { timeout: 30_000 });

  // Count chart rebuilds by watching #chart's children change.
  await page.evaluate(() => {
    const root = document.querySelector("meteogram-card").shadowRoot;
    window.__draws = 0;
    new MutationObserver((muts) => {
      for (const m of muts) if (m.addedNodes.length) window.__draws++;
    }).observe(root.querySelector("#chart"), { childList: true });
  });

  const windCount = () => page.evaluate(() =>
    document.querySelector("meteogram-card").shadowRoot
      .querySelectorAll(".wind-barb, .wind-band-bg").length);

  const before = await windCount();
  check("wind is drawn to start with", before > 0, `${before} elements`);

  // One config change must reach the screen. It did not: the request was discarded by
  // the throttle after updated() had already recorded the new state as drawn.
  await page.evaluate(() => {
    const c = document.querySelector("meteogram-card");
    c.setConfig({ ...(c._config ?? {}), show_wind: false });
  });
  await page.waitForTimeout(900);
  const after = await windCount();
  check("a config change redraws the chart", after === 0, `${before} -> ${after} wind elements`);

  // A burst must collapse. Five changes in quick succession are one visual outcome.
  await page.evaluate(() => { window.__draws = 0; });
  await page.evaluate(() => {
    const c = document.querySelector("meteogram-card");
    for (const v of [true, false, true, false, true]) {
      c.setConfig({ ...(c._config ?? {}), show_wind: v });
    }
  });
  await page.waitForTimeout(1200);
  const draws = await page.evaluate(() => window.__draws);
  check("a burst of changes draws once", draws === 1, `${draws} draws for 5 changes`);
  const end = await windCount();
  check("the burst lands on the last value", end > 0, `${end} wind elements`);
  // The console hook exists so a live card can be made to log without a reload — a
  // reload destroys the transient behaviour worth logging in the first place.
  const hook = await page.evaluate(() => {
    const said = window.meteogramDebug?.();
    const card = document.querySelector("meteogram-card");
    return { said, on: card.debug === true, off: (window.meteogramDebug?.(false), card.debug) };
  });
  check("meteogramDebug() turns debug on", hook.on === true, hook.said);
  check("meteogramDebug(false) turns it off", hook.off === false);

  check("no page errors", errors.length === 0, errors.join("; "));

  await browser.close();
  server.close();
  const failed = checks.filter((c) => !c).length;
  console.log(`\n${checks.length - failed}/${checks.length} passed`);
  process.exit(failed ? 1 : 0);
}
main();
