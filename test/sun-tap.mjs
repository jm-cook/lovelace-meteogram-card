/**
 * Verify the sun strip is usable without a mouse.
 *
 * The strip's times were <title> elements only, which the browser shows on hover. A
 * tablet never hovers, so on the device this card most often runs on the times were
 * unreachable. This drives the real thing in a real browser: tap a segment, get the
 * times; tap it again, they go away.
 *
 *   node test/sun-tap.mjs
 *
 * Shares the fixture and the clock freezing with snapshot.mjs, for the same reason —
 * the strip is positioned from "now", so an unfrozen clock moves the targets.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FIXTURE = join(ROOT, "test/fixtures/metno-forecast.json");
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".map": "application/json", ".css": "text/css",
  ".svg": "image/svg+xml",
};

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

const checks = [];
const check = (name, pass, detail = "") => {
  checks.push({ name, pass, detail });
  console.log(`  ${pass ? "ok  " : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

/** State of the tap panel, read straight out of the live DOM. */
const tipState = (page) => page.evaluate(() => {
  const root = document.querySelector("meteogram-card").shadowRoot;
  const tip = root.querySelector(".sun-strip-tip");
  const box = root.querySelector(".sun-strip-tip-box");
  const text = root.querySelector(".sun-strip-tip-text");
  return {
    exists: !!tip,
    visible: !!tip && tip.style.display !== "none",
    text: text?.textContent ?? "",
    left: box ? +box.getAttribute("x") : null,
    width: box ? +box.getAttribute("width") : null,
  };
});

async function main() {
  if (!existsSync(FIXTURE)) {
    console.error("No fixture. Run: node test/snapshot.mjs --capture");
    process.exit(2);
  }
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

  await page.route((url) => url.hostname.endsWith("met.no"), (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: { expires: new Date(new Date(frozen).getTime() + 3600_000).toUTCString() },
    body: JSON.stringify(fixture.body),
  }));
  await page.route(
    (url) => url.hostname.includes("githubusercontent") || url.pathname.endsWith(".svg"),
    (route) => route.fulfill({
      status: 200, contentType: "image/svg+xml",
      body: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`,
    })
  );

  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`http://127.0.0.1:${port}/test.html`, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const svg = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
    return svg && svg.querySelectorAll("*").length > 50;
  }, null, { timeout: 30_000 });

  const hits = page.locator("meteogram-card .sun-strip-hit");
  const n = await hits.count();
  check("tap targets exist", n > 0, `${n} targets`);

  const geom = await page.evaluate(() => {
    const r = document.querySelector("meteogram-card").shadowRoot
      .querySelector(".sun-strip-hit");
    const strip = document.querySelector("meteogram-card").shadowRoot
      .querySelector(".sun-strip-day, .sun-strip-night");
    return { hit: +r.getAttribute("height"), strip: +strip.getAttribute("height") };
  });
  check("target is taller than the strip", geom.hit > geom.strip,
        `${geom.hit}px target over a ${geom.strip}px strip`);

  check("panel starts hidden", !(await tipState(page)).visible);

  // A segment near the middle: the first and last runs are cut off by the window and
  // word their label differently, so they are not the representative case.
  const mid = Math.floor(n / 2);
  await hits.nth(mid).click({ force: true });
  const open = await tipState(page);
  check("tap opens the panel", open.visible);
  check("panel carries times", /\d{1,2}[:.]\d{2}/.test(open.text), JSON.stringify(open.text));

  await hits.nth(mid).click({ force: true });
  check("tapping again closes it", !(await tipState(page)).visible);

  // Leftmost run: its midpoint sits at the very edge, so an unclamped panel would hang
  // off the card.
  await hits.nth(0).click({ force: true });
  const edge = await tipState(page);
  const bounds = await page.evaluate(() => {
    const svg = document.querySelector("meteogram-card").shadowRoot.querySelector("#chart svg");
    return { w: +svg.getAttribute("width") || svg.viewBox.baseVal.width };
  });
  check("panel stays inside the card at the left edge",
        edge.visible && edge.left >= 0 && edge.left + edge.width <= bounds.w + 1,
        `x=${edge.left} w=${edge.width} card=${bounds.w}`);

  // Tapping the chart elsewhere dismisses it — the gesture a reader tries first.
  // .first(): the weather icons are themselves nested <svg> elements, so this selector
  // matches fifty of them and Playwright refuses an ambiguous click.
  await page.locator("meteogram-card #chart svg").first()
    .click({ position: { x: 450, y: 400 }, force: true });
  check("tapping elsewhere dismisses it", !(await tipState(page)).visible);

  check("no page errors", errors.length === 0, errors.join("; "));

  await browser.close();
  server.close();

  const failed = checks.filter((c) => !c.pass);
  console.log(`\n${checks.length - failed.length}/${checks.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
