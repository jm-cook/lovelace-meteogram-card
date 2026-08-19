/**
 * Keyed joins: bars keep their identity across a redraw instead of being rebuilt.
 *
 * Three things have to hold, and each has caught a real mistake:
 *   - nothing accumulates when the same data is drawn twice with work in between;
 *   - the element for a given hour is the *same node* after a redraw, checked by data
 *     key rather than by position — the data is filtered to hours with rain, so the
 *     bar at a given position is a different hour once an earlier one vanishes;
 *   - with animation on, the height passes through intermediate values rather than
 *     jumping.
 *
 *   node test/join.mjs
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
const ROOT = resolve(import.meta.dirname, "..");
const MIME = { ".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".map":"application/json",".css":"text/css",".svg":"image/svg+xml" };
const server = await new Promise((ok)=>{const sv=createServer(async(req,res)=>{try{const p=join(ROOT,decodeURIComponent(req.url.split("?")[0]));const b=await readFile(p);res.writeHead(200,{"content-type":MIME[extname(p)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404).end();}});sv.listen(0,"127.0.0.1",()=>ok(sv));});
const port = server.address().port;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:900,height:700} });
const errors=[]; page.on("pageerror",(e)=>errors.push(String(e)));
await page.goto(`http://127.0.0.1:${port}/dev.html`,{waitUntil:"load"});
await page.waitForFunction(()=>{const s=document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");return s&&s.querySelectorAll("*").length>50;},null,{timeout:30000});
await page.evaluate(()=>{const a=document.getElementById("auto");a.checked=false;a.dispatchEvent(new Event("change"));});

const bars = () => page.evaluate(()=>{
  const r=document.querySelector("meteogram-card").shadowRoot;
  return { rain:r.querySelectorAll(".rain-bar").length, max:r.querySelectorAll(".rain-max-bar").length,
           label:r.querySelectorAll(".rain-label").length };
});

// Same data twice with ten redraws between: any accumulation shows up here.
await page.click("#reset"); await page.waitForTimeout(700);
const a = await bars();
for (let i=0;i<10;i++){ await page.click("#step"); await page.waitForTimeout(300); }
await page.click("#reset"); await page.waitForTimeout(900);
const b = await bars();
console.log("  reset          :", JSON.stringify(a));
console.log("  after 10+reset :", JSON.stringify(b),
  JSON.stringify(a)===JSON.stringify(b) ? "(no accumulation)" : "(ACCUMULATION)");

// Identity: the same rect element must survive a redraw and change shape, rather than
// being destroyed and replaced. That is the difference a keyed join makes.
await page.click("#step"); await page.waitForTimeout(900);
const identity = await page.evaluate(async () => {
  const r = document.querySelector("meteogram-card").shadowRoot;
  // By forecast hour, not by position and not by index. The data is filtered to hours
  // with rain, so position is not identity; and the window slides, so the index of a
  // given hour changes between draws. Only the timestamp identifies the same slot.
  const byKey = (k) => [...r.querySelectorAll(".rain-max-bar")]
      .find((n) => n.__data__?.t === k);
  const sample = [...r.querySelectorAll(".rain-max-bar")][3];
  const key = sample?.__data__?.t;
  const before = sample?.getAttribute("height");
  document.getElementById("step").click();
  await new Promise(x => setTimeout(x, 1200));
  const now = byKey(key);
  return { key, same: now === sample, present: !!now,
           before, after: sample?.getAttribute("height") };
});
console.log(`  bar for ${new Date(identity.key).toISOString().slice(11,16)}: same element after redraw:`, identity.same,
            `  height ${Number(identity.before).toFixed(1)} -> ${Number(identity.after).toFixed(1)}`);
const frames = await page.evaluate(async () => {
  const r = document.querySelector("meteogram-card").shadowRoot;
  const bar = () => r.querySelectorAll(".rain-max-bar")[3];
  document.getElementById("step").click();
  const seen = new Set();
  for (let i = 0; i < 50; i++) {
    await new Promise(x => requestAnimationFrame(x));
    const h = bar()?.getAttribute("height");
    if (h) seen.add(h);
  }
  return seen.size;
});
console.log("  distinct heights during one step:", frames);
// A forecast window slides: an hour later the earliest slot is gone and every
// remaining hour has shifted down one index. The element for a given hour must follow
// the hour, not the slot — keyed by index it would silently be reused for its
// neighbour, and the chart would morph in place instead of moving.
const slide = await page.evaluate(async () => {
  const root = document.querySelector("meteogram-card").shadowRoot;
  const bars = () => [...root.querySelectorAll(".rain-max-bar")];
  const sample = bars()[3];
  const hour = sample?.__data__?.t;
  const idxBefore = sample?.__data__?.index;
  document.getElementById("step").click();
  await new Promise(x => setTimeout(x, 1400));
  const now = bars().find((n) => n === sample);
  return {
    kept: !!now,
    hourUnchanged: now?.__data__?.t === hour,
    idxBefore,
    idxAfter: now?.__data__?.index,
  };
});
console.log(`  across a window slide: same node kept ${slide.kept}, `
  + `hour unchanged ${slide.hourUnchanged}, index ${slide.idxBefore} -> ${slide.idxAfter}`);

// The temperature line is one persistent path: the same element must survive a redraw
// and interpolate its shape, rather than being replaced. It also must not accumulate —
// its layer no longer clears itself.
const temp = await page.evaluate(async () => {
  const r = document.querySelector("meteogram-card").shadowRoot;
  const path = () => r.querySelector("path.temp-line");
  const first = path();
  const before = first?.getAttribute("d")?.slice(0, 40);
  document.getElementById("step").click();
  const seen = new Set();
  for (let i = 0; i < 50; i++) {
    await new Promise(x => requestAnimationFrame(x));
    const d = path()?.getAttribute("d");
    if (d) seen.add(d);
  }
  return {
    same: path() === first,
    count: r.querySelectorAll("path.temp-line").length,
    defs: r.querySelectorAll(".layer-temperature defs").length,
    moved: before !== path()?.getAttribute("d")?.slice(0, 40),
    frames: seen.size,
  };
});
console.log(`  temperature line: same element ${temp.same}, moved ${temp.moved}, `
  + `${temp.frames} intermediate shapes, ${temp.count} path(s), ${temp.defs} defs`);

// The three single-shape paths all go through persistentPath: same element each draw,
// exactly one of each in its layer, and an interpolated shape when animating.
const paths = await page.evaluate(async () => {
  const r = document.querySelector("meteogram-card").shadowRoot;
  const classes = ["temp-line", "pressure-line", "cloud-area"];
  const before = classes.map((c) => r.querySelector(`path.${c}`));
  const shapes = classes.map(() => new Set());
  document.getElementById("step").click();
  for (let i = 0; i < 50; i++) {
    await new Promise(x => requestAnimationFrame(x));
    classes.forEach((c, j) => {
      const d = r.querySelector(`path.${c}`)?.getAttribute("d");
      if (d) shapes[j].add(d);
    });
  }
  return classes.map((c, j) => ({
    cls: c,
    same: r.querySelector(`path.${c}`) === before[j],
    count: r.querySelectorAll(`path.${c}`).length,
    frames: shapes[j].size,
  }));
});
paths.forEach((p) => console.log(
  `  ${p.cls.padEnd(14)} same element ${p.same}, ${p.count} in the chart, ${p.frames} shapes`));
const pathsOk = paths.every((p) => p.same && p.count === 1 && p.frames > 5);

// Wind barbs: placement animates, the glyph is redrawn. Also the case where the whole
// band group could quietly stack a copy of itself each draw, since its layer no longer
// clears.
const wind = await page.evaluate(async () => {
  const r = document.querySelector("meteogram-card").shadowRoot;
  const band = () => r.querySelector(".layer-wind > g");
  const barbs = () => [...r.querySelectorAll(".layer-wind > g > g")];
  const before = barbs().length;
  const sample = barbs()[3];
  const hour = sample?.__data__?.t;
  const t0 = sample?.getAttribute("transform");
  const seen = new Set();
  document.getElementById("step").click();
  for (let i = 0; i < 50; i++) {
    await new Promise(x => requestAnimationFrame(x));
    const tr = sample?.getAttribute("transform");
    if (tr) seen.add(tr);
  }
  return {
    bands: r.querySelectorAll(".layer-wind > g").length,
    before, after: barbs().length,
    kept: barbs().includes(sample),
    hourUnchanged: sample?.__data__?.t === hour,
    moved: t0 !== sample?.getAttribute("transform"),
    frames: seen.size,
    hasGlyph: (sample?.childElementCount ?? 0) > 0,
  };
});
console.log(`  wind: ${wind.bands} band group, ${wind.before}->${wind.after} barbs, `
  + `sample kept ${wind.kept}, hour unchanged ${wind.hourUnchanged}, `
  + `${wind.frames} positions, glyph present ${wind.hasGlyph}`);
const windOk = wind.bands === 1 && wind.kept && wind.hourUnchanged
  && wind.moved && wind.frames > 5 && wind.hasGlyph;

// Weather icons: the fetch is asynchronous and appends a div, so an element that now
// survives a redraw would stack one on every draw unless the rendered name is checked.
const icons = await page.evaluate(async () => {
  const r = document.querySelector("meteogram-card").shadowRoot;
  const all = () => [...r.querySelectorAll("foreignObject.weather-icon")];
  const visible = () => all().filter((n) => n.getAttribute("opacity") === "1");
  const sample = visible()[2];
  const hour = sample?.__data__?.t;
  const x0 = sample?.getAttribute("x");
  const seen = new Set();
  document.getElementById("step").click();
  for (let i = 0; i < 50; i++) {
    await new Promise(x => requestAnimationFrame(x));
    const xn = sample?.getAttribute("x");
    if (xn) seen.add(xn);
  }
  await new Promise(x => setTimeout(x, 400));
  const divs = all().map((n) => n.childElementCount);
  return {
    count: all().length,
    kept: all().includes(sample),
    hourUnchanged: sample?.__data__?.t === hour,
    moved: x0 !== sample?.getAttribute("x"),
    frames: seen.size,
    maxDivs: Math.max(...divs),
  };
});
console.log(`  icons: ${icons.count} boxes, sample kept ${icons.kept}, `
  + `hour unchanged ${icons.hourUnchanged}, ${icons.frames} positions, `
  + `max children per box ${icons.maxDivs}`);
const iconsOk = icons.kept && icons.hourUnchanged && icons.moved
  && icons.frames > 5 && icons.maxDivs <= 1;

console.log("  page errors:", errors.length ? errors.join("; ") : "none");
await browser.close(); server.close();

const ok = JSON.stringify(a) === JSON.stringify(b)
    && identity.same && identity.present && frames > 5
    && slide.kept && slide.hourUnchanged
    && temp.same && temp.moved && temp.frames > 5 && temp.count === 1 && temp.defs === 1
    && pathsOk && windOk && iconsOk
    && errors.length === 0;
console.log(ok ? "\n9/9 passed" : "\nFAILED");
process.exit(ok ? 0 : 1);
