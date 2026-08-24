import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
const ROOT=resolve(import.meta.dirname,"..");
const MIME={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".map":"application/json",".css":"text/css"};
const sv=createServer(async(q,res)=>{try{const p=join(ROOT,decodeURIComponent(q.url.split("?")[0]));const b=await readFile(p);res.writeHead(200,{"content-type":MIME[extname(p)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404).end();}});
await new Promise(ok=>sv.listen(0,"127.0.0.1",ok));
const br=await chromium.launch();const p=await br.newPage({viewport:{width:1300,height:1000}});
p.on("pageerror",e=>console.log("PAGEERROR:",String(e).slice(0,200)));
await p.goto(`http://127.0.0.1:${sv.address().port}/dev.html`,{waitUntil:"load"});
await p.waitForFunction(()=>{const s=document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");return s&&s.querySelectorAll("*").length>50;},null,{timeout:60000});

const r = await p.evaluate(async () => {
  const old=document.querySelector("meteogram-card");
  const cfg={latitude:58.4314,longitude:8.8255,display_mode:"full",meteogram_hours:"48h",
    show_wind:true,show_sun:true,show_pressure:true,show_precipitation:true,
    show_cloud_cover:true,show_weather_icons:true,animate:true};
  const hass=old.hass, host=old.parentElement;
  old.remove();

  const marks=[];
  const t0=performance.now();
  const at=(label,el)=>{
    const cd=el.shadowRoot?.querySelector("#chart");
    const par=cd?.parentElement;
    marks.push([label, +(performance.now()-t0).toFixed(1),
      par?`${par.clientWidth}x${par.clientHeight}`:(cd?"no parent":"no #chart")]);
  };

  const el=document.createElement("meteogram-card");
  at("constructed", el);
  if(hass) el.hass=hass;
  el.setConfig(cfg);
  at("after setConfig", el);
  host.appendChild(el);
  at("sync after append", el);

  // Force Lit to render synchronously, if it will.
  if (typeof el.performUpdate === "function") { el.performUpdate(); at("after performUpdate()", el); }
  await el.updateComplete;
  at("after updateComplete", el);
  await new Promise(r=>requestAnimationFrame(r)); at("after 1 frame", el);
  await new Promise(r=>requestAnimationFrame(r)); at("after 2 frames", el);
  await new Promise(r=>requestAnimationFrame(r)); at("after 3 frames", el);
  await new Promise(r=>setTimeout(r,200)); at("after 200ms", el);
  await new Promise(r=>setTimeout(r,300)); at("after 500ms", el);
  return {marks, blank: el._firstPaintMs};
});
console.log("  when is the container size knowable?\n");
for (const [label,t,size] of r.marks) console.log(`   +${String(t).padStart(6)}ms  ${label.padEnd(22)} ${size}`);
console.log(`\n  card reported blank: ${r.blank}ms`);
await br.close(); sv.close();
