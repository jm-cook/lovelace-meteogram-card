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
      let body = await readFile(path);
      // ?hours=<value> pre-selects a span in the form. The card reads the form once on
      // load: setting config afterwards updates its properties but does not trigger a
      // redraw, so switching span at runtime here changes nothing on screen.
      const want = new URL(req.url, "http://x").searchParams.get("hours");
      if (want && path.endsWith("test.html")) {
        body = Buffer.from(String(body)
          .replace(/(<option value="[^"]*")\s+selected/g, "$1")
          .replace(new RegExp(`(<option value="${want}")`), "$1 selected"));
      }
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
  const errors = [];

  /** A page showing the card at one span, rendered and settled. */
  const openCard = async (hours) => {
    const pg = await browser.newPage({ viewport: { width: 900, height: 700 } });
    await pg.addInitScript((iso) => {
      const Real = Date;
      const fixedMs = new Real(iso).getTime();
      class Frozen extends Real {
        constructor(...a) { super(...(a.length ? a : [fixedMs])); }
        static now() { return fixedMs; }
      }
      globalThis.Date = Frozen;
    }, frozen);
    await pg.route((url) => url.hostname.endsWith("met.no"), (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { expires: new Date(new Date(frozen).getTime() + 3600_000).toUTCString() },
      body: JSON.stringify(fixture.body),
    }));
    await pg.route(
      (url) => url.hostname.includes("githubusercontent") || url.pathname.endsWith(".svg"),
      (route) => route.fulfill({
        status: 200, contentType: "image/svg+xml",
        body: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`,
      })
    );
    pg.on("pageerror", (e) => errors.push(String(e)));
    await pg.goto(`http://127.0.0.1:${port}/test.html${hours ? `?hours=${hours}` : ""}`,
                  { waitUntil: "load" });
    await pg.waitForFunction(() => {
      const svg = document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");
      return svg && svg.querySelectorAll("*").length > 50;
    }, null, { timeout: 30_000 });
    return pg;
  };

  /** Every sun-strip mark on a page, with the geometry needed to spot a collision. */
  const marksOn = (pg) => pg.evaluate(() => {
    const root = document.querySelector("meteogram-card").shadowRoot;
    const svgRect = root.querySelector("#chart svg").getBoundingClientRect();
    return {
      svg: { left: svgRect.left, width: svgRect.width },
      runs: root.querySelectorAll(".sun-strip-day, .sun-strip-night").length,
      // Each mark is a <g> holding an icon and, where it fits, a <text> of the time.
      // Client rects, not getBBox: getBBox on a <g> reports the local frame, before the
      // group's own translate, so every mark comes back at the same x.
      marks: [...root.querySelectorAll(".sun-strip-glyph")].map((g) => {
        const r = g.getBoundingClientRect();
        const time = g.querySelector(".sun-strip-glyph-timed");
        return {
          text: time?.textContent ?? "",
          timed: !!time,
          icon: g.querySelector("ha-icon")?.getAttribute("icon")
             ?? (g.querySelector("path") ? "path-fallback" : null),
          left: r.left, right: r.right, x: r.left + r.width / 2, width: r.width,
        };
      }),
    };
  });

  /** No two lettered labels may share pixels — the invariant behind all the tiers. */
  const collides = (marks) => {
    const sorted = [...marks].sort((a, b) => a.left - b.left);
    return sorted.some((m, i) => i > 0 && m.left < sorted[i - 1].right);
  };

  const page = await openCard(null);

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

  // --- inline times -----------------------------------------------------------
  // The point of the strip on a wall tablet is that it needs no interaction at all, so
  // wherever there is room the time is printed beside the glyph.
  const at48 = await marksOn(page);
  check("glyphs are drawn at 48h", at48.marks.length > 0, `${at48.marks.length} events`);
  check("times are printed inline at 48h",
        at48.marks.length > 0 && at48.marks.every((m) => m.timed && /\d{1,2}[:.]\d{2}/.test(m.text)),
        JSON.stringify(at48.marks.map((m) => m.text)));
  // The two mdi icons differ only by a small arrow, so colour is what actually tells
  // them apart at this size. If both ever resolve to the same fill, the distinction is
  // gone and nothing else in the test would notice.
  const kinds = await page.evaluate(() => {
    const root = document.querySelector("meteogram-card").shadowRoot;
    return [...root.querySelectorAll(".sun-strip-glyph")].map((g) => {
      const icon = g.querySelector("path") ?? g.querySelector("foreignObject");
      return {
        kind: g.classList.contains("sun-strip-rise") ? "rise"
            : g.classList.contains("sun-strip-set") ? "set" : "untyped",
        fill: icon ? getComputedStyle(icon).fill : null,
      };
    });
  });
  check("every mark is typed rise or set",
        kinds.length > 0 && kinds.every((k) => k.kind !== "untyped"),
        kinds.map((k) => k.kind).join(" "));
  const riseFill = kinds.find((k) => k.kind === "rise")?.fill;
  const setFill = kinds.find((k) => k.kind === "set")?.fill;
  check("sunrise and sunset are different colours",
        !!riseFill && !!setFill && riseFill !== setFill,
        `rise ${riseFill} vs set ${setFill}`);

  // Plain <path>, never ha-icon. On iPad the ha-icon route drew nothing at all: WebKit
  // does not reliably paint a custom element with its own shadow DOM inside a
  // foreignObject inside an SVG, and the Companion app is WebKit too. The test harness
  // is not Home Assistant, so it never registered ha-icon and never took that route —
  // which is exactly why nothing here caught it.
  check("marks are drawn as plain paths, not ha-icon",
        at48.marks.length > 0 && at48.marks.every((m) => m.icon === "path-fallback"),
        JSON.stringify([...new Set(at48.marks.map((m) => m.icon))]));
  check("inline labels stay inside the card",
        at48.marks.every((m) => m.left >= at48.svg.left - 1
                             && m.right <= at48.svg.left + at48.svg.width + 1),
        at48.marks.map((m) => `${(m.left - at48.svg.left).toFixed(0)}..${(m.right - at48.svg.left).toFixed(0)}`)
          .join(" ") + ` of ${at48.svg.width.toFixed(0)}`);
  check("no two inline labels overlap at 48h", !collides(at48.marks));

  // 120h is the interesting one. met.no is hourly for the first days and six-hourly
  // after, and x is by index, so a day at the far end takes a quarter of the width a
  // day at the near end does. The near end should still be lettered and the far end
  // should not — which a single average across the window would get wrong.
  const p120 = await openCard("120");
  const at120 = await marksOn(p120);
  check("the 120h span is wider than 48h", at120.runs > at48.runs,
        `${at120.runs} runs vs ${at48.runs}`);
  // Events outnumber marks: the compressed far end drops them rather than colliding.
  check("marks are dropped where the scale compresses",
        at120.marks.length < at120.runs - 1,
        `${at120.marks.length} marks for ${at120.runs - 1} events`);
  // And what survives is the hourly near end, not an arbitrary subset: nothing is
  // lettered out in the six-hourly tail, where a day is a quarter as wide.
  const frac = (m, o) => (m.x - o.svg.left) / o.svg.width;
  check("nothing survives in the compressed tail",
        at120.marks.length > 0 && at120.marks.every((m) => frac(m, at120) < 0.75),
        `marks at ${at120.marks.map((m) => frac(m, at120).toFixed(2)).join(" ")} of the width`);
  check("no two inline labels overlap at 120h", !collides(at120.marks));
  await p120.close();

  // At the widest span even bare glyphs would collide, and the strip carries it alone.
  const pMax = await openCard("max");
  const atMax = await marksOn(pMax);
  check("the max span is wider still", atMax.runs > at120.runs,
        `${atMax.runs} runs vs ${at120.runs}`);
  check("marks are dropped at max too", atMax.marks.length < atMax.runs - 1,
        `${atMax.marks.length} marks for ${atMax.runs - 1} events`);
  check("no two inline labels overlap at max", !collides(atMax.marks),
        `${atMax.marks.filter((m) => m.timed).length} of ${atMax.marks.length} marks lettered`);
  await pMax.close();

  // --- hover must survive ------------------------------------------------------
  // The tap targets sit on top of the coloured runs. If they do not carry a title of
  // their own, they swallow the pointer and the native hover tooltip — which is still
  // how this reads on a desktop and to assistive technology — silently stops working.
  const hover = await page.evaluate(() => {
    const card = document.querySelector("meteogram-card");
    const root = card.shadowRoot;
    const run = root.querySelector(".sun-strip-day, .sun-strip-night");
    const box = run.getBoundingClientRect();
    const el = root.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    // Walk up: a <title> anywhere on the hit path is what the browser shows.
    let node = el, title = null;
    while (node && !title) {
      title = [...(node.children ?? [])].find((c) => c.tagName === "title")?.textContent ?? null;
      node = node.parentElement;
    }
    return { tag: el?.tagName, cls: el?.getAttribute?.("class"), title };
  });
  check("hovering a run still reveals its times", !!hover.title,
        `topmost is ${hover.cls}, title ${JSON.stringify(hover.title)}`);

  check("no page errors", errors.length === 0, errors.join("; "));

  await browser.close();
  server.close();

  const failed = checks.filter((c) => !c.pass);
  console.log(`\n${checks.length - failed.length}/${checks.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main();
