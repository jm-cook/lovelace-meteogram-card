import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
const ROOT=resolve(import.meta.dirname,"..");
const MIME={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".json":"application/json",".map":"application/json",".css":"text/css"};
const sv=createServer(async(q,res)=>{try{const p=join(ROOT,decodeURIComponent(q.url.split("?")[0]));const b=await readFile(p);res.writeHead(200,{"content-type":MIME[extname(p)]??"application/octet-stream"});res.end(b);}catch{res.writeHead(404).end();}});
await new Promise(ok=>sv.listen(0,"127.0.0.1",ok));
const br=await chromium.launch();const p=await br.newPage({viewport:{width:1300,height:1000}});
await p.goto(`http://127.0.0.1:${sv.address().port}/dev.html`,{waitUntil:"load"});
await p.waitForFunction(()=>{const s=document.querySelector("meteogram-card")?.shadowRoot?.querySelector("#chart svg");return s&&s.querySelectorAll("*").length>50;},null,{timeout:60000});

const runs=[];
for(let i=0;i<3;i++){
runs.push(await p.evaluate(async () => {
  const old=document.querySelector("meteogram-card");
  const C=old.constructor;
  const cfg={latitude:58.4314,longitude:8.8255,display_mode:"full",meteogram_hours:"48h",
    show_wind:true,show_sun:true,show_pressure:true,show_precipitation:true,
    show_cloud_cover:true,show_weather_icons:true,animate:true};
  const hass=old.hass, host=old.parentElement;
  const m=[]; let t0=0;
  const wrap=(name,orig)=>function(...a){
    const s=performance.now(); m.push([name+" in", +(s-t0).toFixed(1)]);
    const r=orig.apply(this,a);
    if(r&&typeof r.then==="function") r.then(()=>m.push([name+" resolved", +(performance.now()-t0).toFixed(1)]));
    else m.push([name+" out", +(performance.now()-t0).toFixed(1)]);
    return r;
  };
  const saved={};
  for(const n of ["_drawWhenSizeSettles","_drawMeteogram","_renderChart","fetchWeatherData","renderChart"]){
    if(typeof C.prototype[n]==="function"){ saved[n]=C.prototype[n]; C.prototype[n]=wrap(n,saved[n]); }
  }
  old.remove();
  t0=performance.now();
  const el=document.createElement("meteogram-card");
  if(hass) el.hass=hass; el.setConfig(cfg); host.appendChild(el);
  await new Promise(res=>{const tick=()=>{
    const s=el.shadowRoot?.querySelector("#chart svg");
    if(s&&s.querySelectorAll("*").length>50){m.push(["chart visible",+(performance.now()-t0).toFixed(1)]);res();}
    else if(performance.now()-t0>15000) res(); else requestAnimationFrame(tick);};tick();});
  for(const n in saved) C.prototype[n]=saved[n];
  return m;
}));
await p.waitForTimeout(400);
}
const r=runs[2];
let prev=0;
console.log("  phases of one rebuild (3rd run, warm):\n");
for(const [what,t] of r){ console.log(`   +${String(t).padStart(6)}ms  (${String((t-prev).toFixed(1)).padStart(5)})  ${what}`); prev=t; }
await br.close(); sv.close();
