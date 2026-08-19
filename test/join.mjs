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
  // By key, not by position: the data is filtered to hours with rain, so when an
  // earlier bar vanishes the bar at a given position is a different hour entirely.
  const byKey = (k) => [...r.querySelectorAll(".rain-max-bar")]
      .find((n) => n.__data__?.index === k);
  const sample = [...r.querySelectorAll(".rain-max-bar")][3];
  const key = sample?.__data__?.index;
  const before = sample?.getAttribute("height");
  document.getElementById("step").click();
  await new Promise(x => setTimeout(x, 1200));
  const now = byKey(key);
  return { key, same: now === sample, present: !!now,
           before, after: sample?.getAttribute("height") };
});
console.log(`  bar for hour ${identity.key}: same element after redraw:`, identity.same,
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
console.log("  page errors:", errors.length ? errors.join("; ") : "none");
await browser.close(); server.close();

const ok = JSON.stringify(a) === JSON.stringify(b)
    && identity.same && identity.present && frames > 5 && errors.length === 0;
console.log(ok ? "\n4/4 passed" : "\nFAILED");
process.exit(ok ? 0 : 1);
