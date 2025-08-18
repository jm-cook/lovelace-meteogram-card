const t=Promise.all([import("https://unpkg.com/lit@3.1.0/index.js?module"),import("https://unpkg.com/lit@3.1.0/decorators.js?module")]).then(([t,e])=>{window.litElementModules={LitElement:t.LitElement,html:t.html,css:t.css,customElement:e.customElement,property:e.property,state:e.state}});function e(t,e,i,s){var o,r=arguments.length,a=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(a=(r<3?o(a):r>3?o(e,i,a):o(e,i))||a);return r>3&&a&&Object.defineProperty(e,i,a),a}"function"==typeof SuppressedError&&SuppressedError;var i="1.0.9-0";const s=i.includes("beta"),o="Meteogram Card",r=()=>{var t;console.info(`%c☀️ ${o} ${i} ⚡️🌦️`,"color: #1976d2; font-weight: bold; background: white");const{LitElement:r,css:a,customElement:n,property:h,state:l}=window.litElementModules;let d=t=class extends r{constructor(){super(...arguments),this.title="",this.showCloudCover=!0,this.showPressure=!0,this.showRain=!0,this.showWeatherIcons=!0,this.showWind=!0,this.denseWeatherIcons=!0,this.meteogramHours="48h",this.fillContainer=!1,this.styles={},this.chartLoaded=!1,this.meteogramError="",this.errorCount=0,this.lastErrorTime=0,this.iconCache=new Map,this.iconBasePath="https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/",this.hasRendered=!1,this.svg=null,this.t=null,this.i=0,this.o=0,this.h=null,this.l=null,this.u=!1,this.m=null,this.v=!1,this.apiExpiresAt=null,this.apiLastModified=null,this.cachedWeatherData=null,this.weatherDataPromise=null,this.p=!1,this.k="",this.$="",this._="",this.S="",this.M=null,this.C=()=>{!document.hidden&&this.isConnected&&this.N()},this.F=()=>{setTimeout(()=>{this.isConnected&&this.D()&&this.N()},100)}}async getIconSVG(t){if(this.iconCache.has(t))return this.iconCache.get(t);try{const e=`${this.iconBasePath}${t}.svg`,i=await fetch(e);if(!i.ok)return console.warn(`Failed to load icon: ${t}, status: ${i.status}`),"";const s=await i.text();return!s.includes("<svg")||s.length<20?(console.warn(`Invalid SVG content for ${t}`),""):(this.iconCache.set(t,s),s)}catch(e){return console.error(`Error loading icon ${t}:`,e),""}}A(){this.p||(this.p=!0,setTimeout(()=>{this.L(),this.p=!1},50))}setConfig(t){const e=void 0!==t.latitude?parseFloat(Number(t.latitude).toFixed(4)):void 0,i=void 0!==t.longitude?parseFloat(Number(t.longitude).toFixed(4)):void 0;void 0!==this.latitude&&parseFloat(Number(this.latitude).toFixed(4)),void 0!==this.longitude&&parseFloat(Number(this.longitude).toFixed(4)),t.title&&(this.title=t.title),void 0!==t.latitude&&(this.latitude=e),void 0!==t.longitude&&(this.longitude=i),this.showCloudCover=void 0===t.show_cloud_cover||t.show_cloud_cover,this.showPressure=void 0===t.show_pressure||t.show_pressure,this.showRain=void 0===t.show_rain||t.show_rain,this.showWeatherIcons=void 0===t.show_weather_icons||t.show_weather_icons,this.showWind=void 0===t.show_wind||t.show_wind,this.denseWeatherIcons=void 0===t.dense_weather_icons||t.dense_weather_icons,this.meteogramHours=t.meteogram_hours||"48h",this.fillContainer=void 0!==t.fill_container&&t.fill_container,this.styles=t.styles||{}}static getConfigElement(){const t=document.createElement("meteogram-card-editor");return t.setConfig({show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1}),t}static getStubConfig(){return{title:"Weather Forecast",show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1}}getCardSize(){return 3}connectedCallback(){super.connectedCallback(),this.u=!1,this.updateComplete.then(()=>{this.T(),this.O(),this.P(),document.addEventListener("visibilitychange",this.C.bind(this)),window.addEventListener("location-changed",this.F.bind(this)),this.isConnected&&(this.hasRendered&&this.chartLoaded?this.A():this.loadD3AndDraw())})}disconnectedCallback(){this.I(),this.W(),this.j(),document.removeEventListener("visibilitychange",this.C.bind(this)),window.removeEventListener("location-changed",this.F.bind(this)),this.cleanupChart(),this.R&&(clearTimeout(this.R),this.R=null),this.H&&(clearTimeout(this.H),this.H=null),super.disconnectedCallback()}D(){if(!this.isConnected||!this.shadowRoot)return!1;if(document.hidden)return!1;const t=this.shadowRoot.host;if(!t)return!1;if(0===t.offsetWidth&&0===t.offsetHeight)return!1;const e=window.getComputedStyle(t);if("none"===e.display)return!1;if("hidden"===e.visibility)return!1;const i=t.getBoundingClientRect();return!(i.top+i.height<=0||i.left+i.width<=0||i.bottom>=window.innerHeight||i.right>=window.innerWidth)}O(){var t;this.h||(this.h=new IntersectionObserver(t=>{for(const e of t)if(e.isIntersecting){this.N();break}},{threshold:[.1]}),(null===(t=this.shadowRoot)||void 0===t?void 0:t.host)&&this.h.observe(this.shadowRoot.host))}W(){this.h&&(this.h.disconnect(),this.h=null)}P(){var t;if(!this.l){this.l=new MutationObserver(t=>{for(const e of t){if(e.target instanceof HTMLElement&&("HA-TAB"===e.target.tagName||"HA-TABS"===e.target.tagName||e.target.classList.contains("content")||e.target.hasAttribute("active")))break;if("attributes"===e.type&&("style"===e.attributeName||"class"===e.attributeName||"hidden"===e.attributeName||"active"===e.attributeName))break}}),document.querySelectorAll("ha-tabs, ha-tab, ha-tab-container").forEach(t=>{t&&this.l.observe(t,{attributes:!0,childList:!0,subtree:!0})});const e=(null===(t=this.shadowRoot)||void 0===t?void 0:t.host)||null;if(e instanceof HTMLElement){let t=e;for(;t&&t.parentElement;)this.l.observe(t.parentElement,{attributes:!0,attributeFilter:["style","class","hidden","active"],childList:!1,subtree:!1}),t=t.parentElement}const i=document.querySelector("home-assistant, ha-panel-lovelace");i&&this.l.observe(i,{childList:!0,subtree:!0})}}j(){this.l&&(this.l.disconnect(),this.l=null)}N(){var t;if(this.D()){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart");!(this.hasRendered&&this.svg&&e&&""!==e.innerHTML&&0!==e.clientWidth&&e.querySelector("svg"))&&this.chartLoaded&&(this.hasRendered=!1,this.cleanupChart(),this.requestUpdate(),this.updateComplete.then(()=>this.A()))}}T(){this.t||(this.t=new ResizeObserver(this.J.bind(this))),setTimeout(()=>{var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart");e&&this.t&&this.t.observe(e)},100)}J(t){if(0===t.length)return;const e=t[0];(Math.abs(e.contentRect.width-this.i)>.05*this.i||Math.abs(e.contentRect.height-this.o)>.1*this.o)&&(this.i=e.contentRect.width,this.o=e.contentRect.height,this.A())}I(){this.t&&(this.t.disconnect(),this.t=null)}firstUpdated(t){setTimeout(()=>{this.loadD3AndDraw()},50),this.hasRendered=!1,this.B()}updated(t){var e,i;const s=t.has("latitude")||t.has("longitude")||t.has("hass")||t.has("showCloudCover")||t.has("showPressure")||t.has("showRain")||t.has("showWeatherIcons")||t.has("showWind")||t.has("denseWeatherIcons")||t.has("meteogramHours")||t.has("fillContainer")||!this.hasRendered;if(this.chartLoaded&&s){this.U();const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart"),i=!t||""===t.innerHTML||!t.querySelector("svg");this.hasRendered&&!i||this.A()}if(!this.u&&this.shadowRoot&&(this.u=!0,this.chartLoaded)){const t=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector("#chart");t&&""===t.innerHTML&&this.A()}this.B()}static encodeCacheKey(t,e){const i=String(t)+String(e);return btoa(i)}getLocationKey(e,i){return t.encodeCacheKey(Number(e.toFixed(4)),Number(i.toFixed(4)))}V(t,e){try{if(void 0!==t&&void 0!==e){const i=localStorage.getItem("meteogram-card-weather-cache");let s={};if(i)try{s=JSON.parse(i)}catch{s={}}s["default-location"]={latitude:parseFloat(t.toFixed(4)),longitude:parseFloat(e.toFixed(4))},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(s))}}catch(t){console.debug("Failed to save location to localStorage:",t)}}G(t,e){try{const i=localStorage.getItem("meteogram-card-weather-cache");let s={};if(i)try{s=JSON.parse(i)}catch{s={}}s["default-location"]={latitude:parseFloat(t.toFixed(4)),longitude:parseFloat(e.toFixed(4))},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(s))}catch(t){console.debug("Failed to save default location to localStorage:",t)}}q(){try{const t=localStorage.getItem("meteogram-card-weather-cache");if(t){let e={};try{e=JSON.parse(t)}catch{e={}}if(e["default-location"]){const t=parseFloat(Number(e["default-location"].latitude).toFixed(4)),i=parseFloat(Number(e["default-location"].longitude).toFixed(4));if(!isNaN(t)&&!isNaN(i))return{latitude:t,longitude:i}}}return null}catch(t){return console.debug("Failed to load location from localStorage:",t),null}}K(){try{const t=localStorage.getItem("meteogram-card-weather-cache");if(t){let e={};try{e=JSON.parse(t)}catch{e={}}if(e["default-location"]){const t=parseFloat(Number(e["default-location"].latitude).toFixed(4)),i=parseFloat(Number(e["default-location"].longitude).toFixed(4));if(!isNaN(t)&&!isNaN(i))return{latitude:t,longitude:i}}}return null}catch(t){return console.debug("Failed to load default location from localStorage:",t),null}}U(){if(void 0!==this.latitude&&void 0!==this.longitude)return this.latitude=parseFloat(Number(this.latitude).toFixed(4)),void(this.longitude=parseFloat(Number(this.longitude).toFixed(4)));if(this.hass&&(void 0===this.latitude||void 0===this.longitude)){const t=this.hass.config||{};if(void 0!==t.latitude&&void 0!==t.longitude){const e=parseFloat(Number(t.latitude).toFixed(4)),i=parseFloat(Number(t.longitude).toFixed(4)),s=this.K();return s&&s.latitude===e&&s.longitude===i||this.G(e,i),this.latitude=e,this.longitude=i,void console.debug(`Using HA location: ${this.latitude}, ${this.longitude}`)}}if(void 0===this.latitude||void 0===this.longitude){const t=this.K();t?(this.latitude=t.latitude,this.longitude=t.longitude,console.debug(`Using cached default-location: ${this.latitude}, ${this.longitude}`)):(this.latitude=51.5074,this.longitude=-.1278,console.debug(`Using default location: ${this.latitude}, ${this.longitude}`))}}async loadD3AndDraw(){if(window.d3)return this.chartLoaded=!0,void this.A();try{const t=document.createElement("script");t.src="https://d3js.org/d3.v7.min.js",t.async=!0;const e=new Promise((e,i)=>{t.onload=()=>{this.chartLoaded=!0,e()},t.onerror=()=>{i(new Error("Failed to load D3.js library"))}});if(document.head.appendChild(t),await e,!window.d3)throw new Error("D3.js not available after loading script");await this.A()}catch(t){console.error("Error loading D3.js:",t),this.setError("Failed to load D3.js visualization library. Please refresh the page.")}}saveCacheToStorage(t,e){try{if(this.cachedWeatherData&&this.apiExpiresAt){const i=this.getLocationKey(t,e);let s={};const o=localStorage.getItem("meteogram-card-weather-cache");if(o)try{s=JSON.parse(o)}catch{s={}}s["forecast-data"]||(s["forecast-data"]={}),s["forecast-data"][i]={expiresAt:this.apiExpiresAt,lastModified:this.apiLastModified||void 0,data:this.cachedWeatherData},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(s))}}catch(t){}}loadCacheFromStorage(t,e){var i;try{const o=this.getLocationKey(t,e),r=localStorage.getItem("meteogram-card-weather-cache");if(r){let a={};try{a=JSON.parse(r)}catch{a={}}const n=null===(i=a["forecast-data"])||void 0===i?void 0:i[o];s&&console.log(`[meteogram-card] Attempting to load cache for (lat: ${t}, lon: ${e}), key: ${o}, entry:`,n),n&&n.expiresAt&&n.data?(this.apiExpiresAt=n.expiresAt,this.apiLastModified=n.lastModified||null,Array.isArray(n.data.time)&&(n.data.time=n.data.time.map(t=>"string"==typeof t?new Date(t):t)),this.cachedWeatherData=n.data):(s&&console.log(`[meteogram-card] No cache entry found for key: ${o}`),this.apiExpiresAt=null,this.apiLastModified=null,this.cachedWeatherData=null)}}catch(t){console.debug("Failed to load cache from localStorage:",t)}}async fetchWeatherData(){const t=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,e=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;s&&console.log(`[meteogram-card] fetchWeatherData called with lat=${t}, lon=${e}`),void 0!==t&&void 0!==e&&this.loadCacheFromStorage(t,e);const i=this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown",o=void 0!==t?t.toFixed(4):void 0,r=void 0!==e?e.toFixed(4):void 0;if(s&&console.log(`[meteogram-card] fetchWeatherData called at ${(new Date).toISOString()} with lat=${o}, lon=${r} (expires at ${i})`),!t||!e){this.U();const t=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,e=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;if(!t||!e)throw new Error("Could not determine location. Please check your card configuration or Home Assistant settings.")}if(this.apiExpiresAt&&Date.now()<this.apiExpiresAt&&this.cachedWeatherData){this.H&&(clearTimeout(this.H),this.H=null);const t=this.apiExpiresAt+6e4-Date.now();return t>0&&(this.H=window.setTimeout(()=>{this.H=null,this.fetchWeatherData().then(t=>{JSON.stringify(t)!==JSON.stringify(this.cachedWeatherData)&&(this.cachedWeatherData=t,this.A())}).catch(()=>{this.A()})},t)),s&&console.log(`[meteogram-card] Returning cached weather data (expires at ${i}), will refresh in ${Math.round(t/1e3)}s`),Promise.resolve(this.cachedWeatherData)}return this.weatherDataPromise?(s&&console.log(`[meteogram-card] Returning in-flight weather data promise (expires at ${i})`),this.weatherDataPromise):(this.weatherDataPromise=(async()=>{try{this.S=(new Date).toISOString();const i=`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${t}&lon=${e}`,o={};o.Origin=window.location.origin,s&&console.log("[meteogram-card] Fetch headers:",o);const r=await fetch(i,{headers:o});if(429===r.status){const t=r.headers.get("Expires");let e=null;if(t){const i=new Date(t);isNaN(i.getTime())||(e=i.getTime(),this.apiExpiresAt=e)}const i=e?new Date(e).toLocaleTimeString():"later";throw console.warn(`Weather API throttling (429). Next attempt allowed after ${i}.`),new Error(`Weather API throttling: Too many requests. Please wait until ${i} before retrying.`)}const a=r.headers.get("Expires");if(a){const t=new Date(a);isNaN(t.getTime())||(this.apiExpiresAt=t.getTime(),this.k=t.toISOString(),s&&console.log(`[meteogram-card] API response Expires at ${t.toISOString()}`))}const n=r.headers.get("Last-Modified");if(n&&(this.apiLastModified=n,s&&console.log(`[meteogram-card] API response Last-Modified: ${n}`)),304===r.status){if(s&&console.log("[meteogram-card] API returned 304 Not Modified, using cached data."),this.cachedWeatherData)return this.cachedWeatherData;throw new Error("API returned 304 but no cached data is available.")}if(this.M=null,this.M=r.ok,!r.ok){const t=await r.text();if(console.error("Weather API fetch failed:",{url:i,status:r.status,statusText:r.statusText,body:t}),0===r.status)throw new Error("Weather API request failed (status 0). This may be a network or CORS issue. See browser console for details.");throw new Error(`Weather API returned ${r.status}: ${r.statusText}\n${t}`)}const h=await r.json();if(!h||!h.properties||!h.properties.timeseries||0===h.properties.timeseries.length)throw new Error("Invalid data format received from API");const l=h.properties.timeseries.filter(t=>0===new Date(t.time).getMinutes()),d={time:[],temperature:[],rain:[],rainMin:[],rainMax:[],snow:[],cloudCover:[],windSpeed:[],windDirection:[],symbolCode:[],pressure:[]};d.fetchTimestamp=(new Date).toISOString(),l.forEach(t=>{var e,i,s;const o=new Date(t.time),r=t.data.instant.details,a=null===(e=t.data.next_1_hours)||void 0===e?void 0:e.details;if(d.time.push(o),d.temperature.push(r.air_temperature),d.cloudCover.push(r.cloud_area_fraction),d.windSpeed.push(r.wind_speed),d.windDirection.push(r.wind_from_direction),d.pressure.push(r.air_pressure_at_sea_level),a){const e=void 0!==a.precipitation_amount_max?a.precipitation_amount_max:void 0!==a.precipitation_amount?a.precipitation_amount:0,o=void 0!==a.precipitation_amount_min?a.precipitation_amount_min:void 0!==a.precipitation_amount?a.precipitation_amount:0;d.rainMin.push(o),d.rainMax.push(e),d.rain.push(void 0!==a.precipitation_amount?a.precipitation_amount:0),d.snow.push(0),(null===(s=null===(i=t.data.next_1_hours)||void 0===i?void 0:i.summary)||void 0===s?void 0:s.symbol_code)?d.symbolCode.push(t.data.next_1_hours.summary.symbol_code):d.symbolCode.push("")}else d.rain.push(0),d.rainMin.push(0),d.rainMax.push(0),d.snow.push(0),d.symbolCode.push("")}),this.cachedWeatherData=d,void 0!==t&&void 0!==e&&this.saveCacheToStorage(t,e);let c=48;return"8h"===this.meteogramHours?c=8:"12h"===this.meteogramHours?c=12:"24h"===this.meteogramHours?c=24:"48h"===this.meteogramHours?c=48:"54h"===this.meteogramHours?c=54:"max"===this.meteogramHours&&(c=d.time.length),c<d.time.length&&Object.keys(d).forEach(t=>{d[t]=d[t].slice(0,c)}),this.A(),d}catch(t){if(this.M=!1,this.cachedWeatherData)return console.warn("Error fetching weather data, using cached data (may be expired):",t),this.cachedWeatherData;throw console.error("Error fetching weather data:",t),new Error(`Failed to get weather data: ${t.message}\nCheck your network connection, browser console, and API accessibility.`)}finally{this.weatherDataPromise=null}})(),this.weatherDataPromise)}cleanupChart(){try{if(this.svg&&"function"==typeof this.svg.remove&&(this.svg.remove(),this.svg=null),this.shadowRoot){const t=this.shadowRoot.querySelector("#chart");t&&(t.innerHTML="")}}catch(t){console.warn("Error cleaning up chart:",t)}}async L(){var e,i,s;this.$=(new Date).toISOString();const o=Date.now();if(this.meteogramError&&o-this.lastErrorTime<6e4)return void this.errorCount++;if(this.meteogramError="",this.U(),!this.latitude||!this.longitude)return void this.setError("Location not available. Please check your card configuration or Home Assistant settings.");let r=null;try{r=await this.fetchWeatherData()}catch(t){return void this.setError("Weather data not available.")}const a=`${this.latitude},${this.longitude},${this.showCloudCover},${this.showPressure},${this.showWeatherIcons},${this.showWind},${this.meteogramHours},${this.fillContainer},${JSON.stringify(r)}}`;if(this.m===a&&this.svg&&this.chartLoaded){const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");if(t&&t.querySelector("svg"))return}this._=(new Date).toISOString(),this.m=a,await this.updateComplete,this.Y();if(t.lastD3RetryTime||(t.lastD3RetryTime=0),!window.d3)try{return void await this.loadD3AndDraw()}catch(e){const i=Date.now();if(i-t.lastD3RetryTime<1e4)return;return t.lastD3RetryTime=i,void this.setError("D3.js library could not be loaded. Please refresh the page.")}this.cleanupChart(),await new Promise(t=>setTimeout(t,10));const n=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector("#chart");if(n)this.X(n);else if(console.error("Chart container not found in DOM"),this.isConnected){this.requestUpdate(),await this.updateComplete,await new Promise(t=>setTimeout(t,50));const t=null===(s=this.shadowRoot)||void 0===s?void 0:s.querySelector("#chart");if(!t){if(console.error("Chart container still not found after retry"),this.shadowRoot){const t=this.shadowRoot.querySelector(".card-content");if(t&&this.isConnected){t.innerHTML='<div id="chart"></div>';const e=this.shadowRoot.querySelector("#chart");if(e)return void this.X(e)}}return}this.X(t)}}X(t){if(this.v){s&&console.log("[meteogram-card] Chart render already in progress, skipping redundant render.");return void(t.querySelector("svg")||(s&&console.log("[meteogram-card] No SVG found, clearing render-in-progress flag to recover."),this.v=!1))}this.v=!0,setTimeout(()=>{this.v&&(s&&console.log("[meteogram-card] Clearing chart render flag after timeout."),this.v=!1)},1e3);try{const e=t.querySelector("svg"),i=t.offsetWidth>0&&t.offsetHeight>0;if(e&&i&&this.hasRendered)return void(this.v=!1);const s=t.parentElement;let o,r,a=s?s.clientWidth:t.offsetWidth||350,n=s?s.clientHeight:t.offsetHeight||180;const h=Math.min(.7*window.innerHeight,520);if(this.fillContainer)o=t.offsetWidth>0?t.offsetWidth:a,r=t.offsetHeight>0?t.offsetHeight:n;else{const t=Math.min(.95*window.innerWidth,1200);o=Math.max(Math.min(a,t),300);const e=.5*o;r=Math.min(e,n,h)}const l=this.showWind?55:0,d=24;Math.min(r,n,h);this.i=a,this.o=n,e&&this.i===a&&this.o===n?this.v=!1:(t.innerHTML="",this.fetchWeatherData().then(e=>{t.querySelector("svg")&&(console.debug("SVG already exists, removing before creating new one"),t.innerHTML=""),this.svg=window.d3.select(t).append("svg").attr("width","100%").attr("height","100%").attr("viewBox",`0 0 ${o+140} ${r+(this.showWind?l:0)+d+70}`).attr("preserveAspectRatio","xMidYMid meet");Math.min(o,Math.max(300,90*(e.time.length-1)));let i=48;"8h"===this.meteogramHours?i=8:"12h"===this.meteogramHours?i=12:"24h"===this.meteogramHours?i=24:"48h"===this.meteogramHours?i=48:"54h"===this.meteogramHours?i=54:"max"===this.meteogramHours&&(i=e.time.length);const s=t=>t.slice(0,Math.min(i,t.length)+1),a={time:s(e.time),temperature:s(e.temperature),rain:s(e.rain),rainMin:s(e.rainMin),rainMax:s(e.rainMax),snow:s(e.snow),cloudCover:s(e.cloudCover),windSpeed:s(e.windSpeed),windDirection:s(e.windDirection),symbolCode:s(e.symbolCode),pressure:s(e.pressure)};this.renderMeteogram(this.svg,a,o,r,l,d),this.hasRendered=!0,this.errorCount=0,this.R&&(clearTimeout(this.R),this.R=null),this.T(),this.O(),this.P()}).catch(()=>{this.setError("Weather data not available, retrying in 60 seconds"),this.R&&clearTimeout(this.R),this.R=window.setTimeout(()=>{this.meteogramError="",this.L()},6e4)}).finally(()=>{this.v=!1}))}catch(t){this.setError(`Failed to render chart: ${t.message}`),this.v=!1}}renderMeteogram(t,e,i,s,o=0,r=24){const a=window.d3,{time:n,temperature:h,rain:l,rainMin:d,rainMax:c,snow:u,cloudCover:m,windSpeed:f,windDirection:g,symbolCode:v,pressure:w}=e,p=n.length,b=this.getSystemTemperatureUnit(),x=h.map(t=>this.convertTemperature(t)),y=70,k=70,$=Math.min(i,Math.max(300,90*(p-1))),_=s-o;let S=$/(p-1);const M=a.scaleLinear().domain([0,p-1]).range([0,$]);S=M(1)-M(0);const C=y-30,N=[];for(let t=0;t<p;t++)0!==t&&n[t].getDate()===n[t-1].getDate()||N.push(t);const F=[];for(let t=0;t<N.length;++t){const e=N[t],i=t+1<N.length?N[t+1]:p;F.push({start:e,end:i})}t.selectAll(".day-bg").data(F).enter().append("rect").attr("class","day-bg").attr("x",t=>k+M(t.start)).attr("y",y-42).attr("width",t=>Math.min(M(Math.max(t.end-1,t.start))-M(t.start)+S,$-M(t.start))).attr("height",_+42).attr("opacity",(t,e)=>e%2==0?.16:0),t.selectAll(".top-date-label").data(N).enter().append("text").attr("class","top-date-label").attr("x",(t,e)=>{const i=k+M(t);return e===N.length-1?Math.min(i,k+$-80):i}).attr("y",C).attr("text-anchor","start").attr("opacity",(t,e)=>{if(e===N.length-1)return 1;const i=k+M(t);return k+M(N[e+1])-i<100?0:1}).text(t=>n[t].toLocaleDateString(void 0,{weekday:"short",day:"2-digit",month:"short"})),t.selectAll(".day-tic").data(N).enter().append("line").attr("class","day-tic").attr("x1",t=>k+M(t)).attr("x2",t=>k+M(t)).attr("y1",C+22).attr("y2",C+42).attr("stroke","#1a237e").attr("stroke-width",3).attr("opacity",.6);const D=t.append("g").attr("transform",`translate(${k},${y})`),E=x.filter(t=>null!==t),A=a.scaleLinear().domain([Math.floor(a.min(E)-2),Math.ceil(a.max(E)+2)]).range([_,0]),L=a.scaleLinear().domain([0,Math.max(2,a.max([...c,...l,...u])+1)]).range([_,0]);let T;if(this.showPressure){const t=a.extent(w),e=.1*(t[1]-t[0]);T=a.scaleLinear().domain([5*Math.floor((t[0]-e)/5),5*Math.ceil((t[1]+e)/5)]).range([_,0])}if(D.append("g").attr("class","xgrid").selectAll("line").data(a.range(p)).enter().append("line").attr("x1",t=>M(t)).attr("x2",t=>M(t)).attr("y1",0).attr("y2",_).attr("stroke","#b8c4d9").attr("stroke-width",1),D.append("g").attr("class","grid").call(a.axisLeft(A).tickSize(-$).tickFormat("")),D.append("line").attr("x1",0).attr("x2",$).attr("y1",_).attr("y2",_).attr("stroke","#333"),D.append("g").call(a.axisLeft(A)),this.showWind){const e=y+_,i=t.append("g").attr("transform",`translate(${k},${e})`),s=o-10,r=[];for(let t=0;t<p;t++)n[t].getHours()%2==0&&r.push(t);i.selectAll(".wind-band-grid").data(r).enter().append("line").attr("class","wind-band-grid").attr("x1",t=>M(t)).attr("x2",t=>M(t)).attr("y1",0).attr("y2",s).attr("stroke","#b8c4d9").attr("stroke-width",1)}if(D.selectAll(".twentyfourh-line").data(N.slice(1)).enter().append("line").attr("class","twentyfourh-line").attr("x1",t=>M(t)).attr("x2",t=>M(t)).attr("y1",0).attr("y2",_).attr("stroke","#ffb300").attr("stroke-width",3).attr("stroke-dasharray","6,5").attr("opacity",.7),this.showCloudCover){const t=.01*_,e=.2*_,i=[];for(let s=0;s<p;s++)i.push([M(s),t+e/2*(1-m[s]/100)]);for(let s=p-1;s>=0;s--)i.push([M(s),t+e/2*(1+m[s]/100)]);D.append("path").attr("class","cloud-area").attr("d",a.line().x(t=>t[0]).y(t=>t[1]).curve(a.curveLinearClosed)(i))}this.showPressure&&T&&(D.append("g").attr("class","pressure-axis").attr("transform",`translate(${$}, 0)`).call(a.axisRight(T).tickFormat(t=>`${t}`)),D.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(${$+50},${_/2}) rotate(90)`).text("Pressure (hPa)"),D.append("text").attr("class","legend").attr("x",340).attr("y",-45).style("fill","#1976d2").text("Pressure (hPa)")),D.append("g").attr("class","temperature-axis").call(window.d3.axisLeft(A).tickFormat(t=>`${t}`)),D.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(-50,${_/2}) rotate(-90)`).text(`Temperature (${b})`),this.showCloudCover&&D.append("text").attr("class","legend").attr("x",0).attr("y",-45).text("Cloud Cover (%)"),D.append("text").attr("class","legend").attr("x",200).attr("y",-45).style("fill","orange").text(`Temperature (${b})`),D.append("text").attr("class","legend").attr("x",480).attr("y",-45).style("fill","deepskyblue").text("Rain (mm)"),D.append("text").attr("class","legend").attr("x",630).attr("y",-45).style("fill","#b3e6ff").text("Snow (mm)");const z=a.line().defined(t=>null!==t).x((t,e)=>M(e)).y((t,e)=>null!==x[e]?A(x[e]):0);if(D.append("path").datum(x).attr("class","temp-line").attr("d",z).attr("stroke","currentColor"),this.showPressure&&T){const t=a.line().defined(t=>!isNaN(t)).x((t,e)=>M(e)).y(t=>T(t));D.append("path").datum(w).attr("class","pressure-line").attr("d",t).attr("stroke","currentColor")}if(this.showWeatherIcons){const t=this.denseWeatherIcons?1:2;D.selectAll(".weather-icon").data(v).enter().append("foreignObject").attr("class","weather-icon").attr("x",(t,e)=>M(e)-20).attr("y",(t,e)=>{const i=x[e];return null!==i?A(i)-40:-999}).attr("width",40).attr("height",40).attr("opacity",(e,i)=>null!==x[i]&&i%t===0?1:0).each((e,i,s)=>{if(i%t!==0)return;const o=s[i];if(!e)return;const r=e.replace(/^lightssleet/,"lightsleet").replace(/^lightssnow/,"lightsnow");this.getIconSVG(r).then(t=>{if(t){const e=document.createElement("div");e.style.width="40px",e.style.height="40px",e.innerHTML=t,o.appendChild(e)}else console.warn(`Failed to load icon: ${r}`)}).catch(t=>{console.error(`Error loading icon ${r}:`,t)})})}const O=Math.min(26,.8*S);if(this.showRain&&(D.selectAll(".rain-max-bar").data(c.slice(0,p-1)).enter().append("rect").attr("class","rain-max-bar").attr("x",(t,e)=>M(e)+S/2-O/2).attr("y",t=>{const e=_-L(t),i=e<2&&t>0?2:.7*e;return L(0)-i}).attr("width",O).attr("height",t=>{const e=_-L(t);return e<2&&t>0?2:.7*e}).attr("fill","currentColor"),D.selectAll(".rain-bar").data(l.slice(0,p-1)).enter().append("rect").attr("class","rain-bar").attr("x",(t,e)=>M(e)+S/2-O/2).attr("y",t=>{const e=_-L(t),i=e<2&&t>0?2:.7*e;return L(0)-i}).attr("width",O).attr("height",t=>{const e=_-L(t);return e<2&&t>0?2:.7*e}).attr("fill","currentColor"),D.selectAll(".rain-label").data(l.slice(0,p-1)).enter().append("text").attr("class","rain-label").attr("x",(t,e)=>M(e)+S/2).attr("y",t=>{const e=_-L(t),i=e<2&&t>0?2:.7*e;return L(0)-i-4}).text(t=>t<=0?"":t<1?t.toFixed(1):t.toFixed(0)).attr("opacity",t=>t>0?1:0),D.selectAll(".rain-max-label").data(c.slice(0,p-1)).enter().append("text").attr("class","rain-max-label").attr("x",(t,e)=>M(e)+S/2).attr("y",t=>{const e=_-L(t),i=e<2&&t>0?2:.7*e;return L(0)-i-18}).text((t,e)=>t<=l[e]?"":t<1?t.toFixed(1):t.toFixed(0)).attr("opacity",(t,e)=>t>l[e]?1:0),D.selectAll(".snow-bar").data(u.slice(0,p-1)).enter().append("rect").attr("class","snow-bar").attr("x",(t,e)=>M(e)+S/2-O/2).attr("y",(t,e)=>{const i=_-L(u[e]),s=i<2&&u[e]>0?2:.7*i;return L(0)-s}).attr("width",O).attr("height",t=>{const e=_-L(t);return e<2&&t>0?2:.7*e})),this.showWind){const e=y+_,s=t.append("g").attr("transform",`translate(${k},${e})`),r=o-10,h=r/2;s.append("rect").attr("class","wind-band-bg").attr("x",0).attr("y",0).attr("width",$).attr("height",r);const l=[];for(let t=0;t<p;t++)n[t].getHours()%2==0&&l.push(t);s.selectAll(".wind-band-grid").data(l).enter().append("line").attr("class","wind-band-grid").attr("x1",t=>M(t)).attr("x2",t=>M(t)).attr("y1",0).attr("y2",r).attr("stroke","#b8c4d9").attr("stroke-width",1);const d=N.slice(1);s.selectAll(".twentyfourh-line-wind").data(d).enter().append("line").attr("class","twentyfourh-line-wind").attr("x1",t=>M(t)).attr("x2",t=>M(t)).attr("y1",0).attr("y2",r);const c=[];for(let t=0;t<p;t++)n[t].getHours()%2==0&&c.push(t);for(let t=0;t<c.length-1;t++){const e=c[t],o=c[t+1];if(i<400&&t%2!=0)continue;const r=(M(e)+M(o))/2,n=Math.floor((e+o)/2),l=f[n],d=g[n],u=i<400?18:23,m=i<400?30:38,v=a.scaleLinear().domain([0,Math.max(15,a.max(f)||20)]).range([u,m])(l);this.drawWindBarb(s,r,h,l,d,v,i<400?.7:.8)}s.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",$).attr("height",r).attr("stroke","var(--meteogram-grid-color, #90caf9)").attr("stroke-width",1).attr("fill","none")}const P=y+_+o+18;t.selectAll(".bottom-hour-label").data(e.time).enter().append("text").attr("class","bottom-hour-label").attr("x",(t,e)=>k+M(e)).attr("y",P).attr("text-anchor","middle").text((t,e)=>{const s=t.getHours();return i<400?e%6==0?String(s).padStart(2,"0"):"":i>800?e%2==0?String(s).padStart(2,"0"):"":e%3==0?String(s).padStart(2,"0"):""})}drawWindBarb(t,e,i,s,o,r,a=.8){const n=t.append("g").attr("transform",`translate(${e},${i}) rotate(${o}) scale(${a})`),h=-r/2,l=+r/2;if(s<2)return void n.append("circle").attr("class","wind-barb-calm").attr("cx",0).attr("cy",0).attr("r",4);n.append("line").attr("class","wind-barb").attr("x1",0).attr("y1",h).attr("x2",0).attr("y2",l),n.append("circle").attr("class","wind-barb-dot").attr("cx",0).attr("cy",l).attr("r",4);let d=s,c=h,u=Math.floor(d/10);d-=10*u;let m=Math.floor(d/5);d-=5*m;for(let t=0;t<u;t++,c+=7)n.append("line").attr("class","wind-barb-feather").attr("x1",0).attr("y1",c).attr("x2",12).attr("y2",c+3);for(let t=0;t<m;t++,c+=7)n.append("line").attr("class","wind-barb-half").attr("x1",0).attr("y1",c).attr("x2",6).attr("y2",c+2)}render(){var t;this.B();const{html:e}=window.litElementModules;return e`
                <ha-card style="${Object.entries(this.styles||{}).map(([t,e])=>`${t}: ${e};`).join(" ")}">
                    ${this.title?e`
                        <div class="card-header">${this.title}</div>`:""}
                    <div class="card-content">
                        <div class="attribution">
                            Data from <a href="https://met.no/" target="_blank" rel="noopener" style="color: inherit;">met.no</a>
                            <span
                                style="margin-left:8px; vertical-align:middle;"
                                title="${null===this.M?"cached":!0===this.M?"success":"failed"}"
                            >${null===this.M?"❎":!0===this.M?"✅":"❌"}</span>
                        </div>
                        ${this.meteogramError?e`
                                    <div class="error">${this.meteogramError}</div>`:e`
                                    <div id="chart"></div>
                                    ${s?e`
                                        <div id="meteogram-status-panel" style="margin-top:12px; font-size:0.95em; background:#f5f5f5; border-radius:6px; padding:8px; color:#333;">
                                            <b>Status Panel</b>
                                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                                                <div>
                                                    <span>Expires At: ${this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown"}</span><br>
                                                    <span>Last Render: ${this.$||"unknown"}</span><br>
                                                    <span>Last Fingerprint Miss: ${this._||"unknown"}</span><br>
                                                    <span>Last Data Fetch: ${this.S||"unknown"}</span>
                                                </div>
                                                <div>
                                                    <span>Last cached: ${(null===(t=this.cachedWeatherData)||void 0===t?void 0:t.fetchTimestamp)||"unknown"}</span><br>
                                                    <span
                                                        title="${null===this.M?"cached":!0===this.M?"success":"failed"}"
                                                    >
                                                        API Success: ${null===this.M?"❎":!0===this.M?"✅":"❌"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    `:""}
                                `}
                    </div>
                </ha-card>
            `}Y(){if(this.errorCount>0&&s){if(console.debug("DOM state check:"),console.debug("- shadowRoot exists:",!!this.shadowRoot),this.shadowRoot){const t=this.shadowRoot.querySelector("#chart");console.debug("- chart div exists:",!!t),t&&console.debug("- chart div size:",t.offsetWidth,"x",t.offsetHeight)}console.debug("- Is connected:",this.isConnected),console.debug("- Has rendered:",this.hasRendered),console.debug("- Chart loaded:",this.chartLoaded)}}setError(t){const e=Date.now();t===this.meteogramError?(this.errorCount++,e-this.lastErrorTime>1e4&&(this.meteogramError=`${t} (occurred ${this.errorCount} times)`,this.lastErrorTime=e)):(this.errorCount=1,this.meteogramError=t,this.lastErrorTime=e,console.error("Meteogram error:",t))}B(){let t=!1;t=this.hass&&this.hass.themes&&"boolean"==typeof this.hass.themes.darkMode?this.hass.themes.darkMode:document.documentElement.classList.contains("dark-theme")||document.body.classList.contains("dark-theme"),t?this.setAttribute("dark",""):this.removeAttribute("dark")}getSystemTemperatureUnit(){if(this.hass&&this.hass.config&&this.hass.config.unit_system&&this.hass.config.unit_system.temperature){const t=this.hass.config.unit_system.temperature;if("°F"===t||"°C"===t)return t;if("F"===t)return"°F";if("C"===t)return"°C"}return"°C"}convertTemperature(t){if(null==t)return t;return"°F"===this.getSystemTemperatureUnit()?9*t/5+32:t}};d.styles=a`
            :host {
                display: block;
                box-sizing: border-box;
                height: 100%;
                width: 100%;
                max-width: 100%;
                max-height: 100%;
            }

            ha-card {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
                background: var(--card-background-color, #fff);
                color: var(--primary-text-color, #222);
            }

            .card-header {
                padding: 16px 16px 0 16px;
                font-size: 1.25em;
                font-weight: 500;
                line-height: 1.2;
                color: var(--primary-text-color, #222);
            }

            .card-content {
                position: relative;
                flex: 1 1 auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: stretch;
                padding: 0 16px 16px 16px;
                box-sizing: border-box;
                min-height: 0;
                min-width: 0;
                overflow: hidden;
            }

            #chart {
                width: 100%;
                height: 100%;
                min-height: 180px;
                box-sizing: border-box;
                overflow: hidden;
                display: flex;
                align-items: stretch;
                justify-content: stretch;
            }

            .error {
                color: var(--error-color, #b71c1c);
                padding: 16px;
            }

            .temp-line {
                stroke: var(--meteogram-temp-line-color, orange);
                stroke-width: 3;
                fill: none;
            }
            :host([dark]) .temp-line {
                stroke: var(--meteogram-temp-line-color-dark, #ffb300);
            }

            .pressure-line {
                stroke: var(--meteogram-pressure-line-color, var(--meteogram-pressure-color, #90caf9));
                stroke-width: 4;
                stroke-dasharray: 3, 3;
                fill: none;
            }
            :host([dark]) .pressure-line {
                stroke: var(--meteogram-pressure-line-color-dark, #90caf9);
            }

            .rain-bar {
                fill: var(--meteogram-rain-bar-color, deepskyblue);
                opacity: 0.8;
            }
            :host([dark]) .rain-bar {
                fill: var(--meteogram-rain-bar-color-dark, #2196f3);
            }

            .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color, #7fdbff);
                opacity: 0.5;
            }
            :host([dark]) .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color-dark, #90caf9);
            }

            .rain-label {
                font: var(--meteogram-label-font-size, 13px) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-label-color, #0058a3);
            }
            :host([dark]) .rain-label {
                fill: var(--meteogram-rain-label-color-dark, #a3d8ff);
                filter: drop-shadow(0 0 2px #fff);
            }

            .rain-max-label {
                font: var(--meteogram-label-font-size, 13px) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-max-label-color, #2693e6);
            }
            :host([dark]) .rain-max-label {
                fill: var(--meteogram-rain-max-label-color-dark, #1976d2);
            }

            .legend {
                font: var(--meteogram-legend-font-size, 14px) sans-serif;
                fill: var(--primary-text-color, #222);
            }
            :host([dark]) .legend {
                fill: var(--meteogram-legend-text-color-dark, #fff);
            }

            .rain-bar {
                fill: var(--meteogram-rain-bar-color, deepskyblue);
                opacity: 0.8;
            }

            .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color, #7fdbff);
                opacity: 0.5;
            }

            .rain-label {
                font: var(--meteogram-label-font-size, 13px) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-label-color, #0058a3);
            }

            .rain-max-label {
                font: var(--meteogram-label-font-size, 13px) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-max-label-color, #2693e6);
            }

            .snow-bar {
                fill: #b3e6ff;
                opacity: 0.8;
            }

            .cloud-area {
                fill: var(--meteogram-cloud-color, #b0bec5);
                opacity: 0.42;
            }

            /* Use host attribute for dark mode */

            :host([dark]) .cloud-area {
                fill: var(--meteogram-cloud-color-dark, #eceff1);
                opacity: 0.55;
            }

            .grid line {
                stroke: var(--meteogram-grid-color, #90caf9);
            }

            .xgrid line {
                stroke: var(--meteogram-grid-color, #90caf9);
            }

            .wind-band-grid {
                stroke: var(--meteogram-grid-color, #90caf9);
                stroke-width: 1;
            }

            /* Use --meteogram-grid-color-dark for dark mode grid lines and outline */
            :host([dark]) .grid line,
            :host([dark]) .xgrid line,
            :host([dark]) .wind-band-grid,
            :host([dark]) .wind-band-outline,
            :host([dark]) .twentyfourh-line,
            :host([dark]) .twentyfourh-line-wind,
            :host([dark]) .day-tic {
                stroke: var(--meteogram-grid-color-dark, #3a4a5a);
            }

            .twentyfourh-line, .day-tic {
                stroke: var(--meteogram-timescale-color, #ffb300);
                stroke-width: 3;
                stroke-dasharray: 6, 5;
                opacity: 0.7;
            }

            .twentyfourh-line-wind {
                stroke: var(--meteogram-timescale-color, #ffb300);
                stroke-width: 2.5;
                stroke-dasharray: 6, 5;
                opacity: 0.5;
            }

            .axis-label {
                font: var(--meteogram-label-font-size, 14px) sans-serif;
                fill: var(--primary-text-color, #222);
            }

            .legend {
                font: var(--meteogram-legend-font-size, 14px) sans-serif;
                fill: var(--primary-text-color, #222);
            }

            .wind-barb {
                stroke: var(--meteogram-wind-barb-color, #1976d2);
                stroke-width: 2;
                fill: none;
            }

            .wind-barb-feather {
                stroke: var(--meteogram-wind-barb-color, #1976d2);
                stroke-width: 1.4;
            }

            .wind-barb-half {
                stroke: var(--meteogram-wind-barb-color, #1976d2);
                stroke-width: 0.8;
            }

            .wind-barb-calm {
                stroke: var(--meteogram-wind-barb-color, #1976d2);
                fill: none;
            }

            .wind-barb-dot {
                fill: var(--meteogram-wind-barb-color, #1976d2);
            }

            /* Improve wind barb contrast in dark mode */

            :host([dark]) .wind-barb,
            :host([dark]) .wind-barb-feather,
            :host([dark]) .wind-barb-half,
            :host([dark]) .wind-barb-calm {
                stroke: var(--meteogram-wind-barb-color-dark, #fff);
            }

            :host([dark]) .wind-barb-dot {
                fill: var(--meteogram-wind-barb-color-dark, #fff);
            }

            .top-date-label {
                font: var(--meteogram-label-font-size, 16px) sans-serif;
                fill: var(--primary-text-color, #222);
                font-weight: bold;
                dominant-baseline: hanging;
            }

            .bottom-hour-label {
                font: var(--meteogram-label-font-size, 13px) sans-serif;
                fill: var(--meteogram-timescale-color, #ffb300);
            }

            .rain-label {
                font: var(--meteogram-label-font-size, 13px) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-label-color, #0058a3);
            }

            :host([dark]) .rain-label {
                fill: #a3d8ff; /* Light blue tint for dark mode */
                /* Add a white base with blue tint */
                /* Optionally, use a drop-shadow for better contrast */
                filter: drop-shadow(0 0 2px #fff);
            }

            .day-bg {
                fill: transparent !important;
                opacity: 0;
                pointer-events: none;
            }

            .wind-band-bg {
                fill: transparent;
            }

            .attribution {
                position: absolute;
                top: 12px;
                right: 24px;
                font-size: 0.85em;
                color: var(--secondary-text-color);
                text-align: right;
                z-index: 2;
                background: rgba(255,255,255,0.7);
                padding: 2px 8px;
                border-radius: 6px;
                pointer-events: auto;
            }

            /* Tick text font size for axes */
            .temperature-axis .tick text,
            .pressure-axis .tick text {
                font-size: var(--meteogram-tick-font-size, 13px);
                fill: var(--primary-text-color, #222);
            }
        `,e([h({type:String})],d.prototype,"title",void 0),e([h({type:Number})],d.prototype,"latitude",void 0),e([h({type:Number})],d.prototype,"longitude",void 0),e([h({attribute:!1})],d.prototype,"hass",void 0),e([h({type:Boolean})],d.prototype,"showCloudCover",void 0),e([h({type:Boolean})],d.prototype,"showPressure",void 0),e([h({type:Boolean})],d.prototype,"showRain",void 0),e([h({type:Boolean})],d.prototype,"showWeatherIcons",void 0),e([h({type:Boolean})],d.prototype,"showWind",void 0),e([h({type:Boolean})],d.prototype,"denseWeatherIcons",void 0),e([h({type:String})],d.prototype,"meteogramHours",void 0),e([h({type:Boolean})],d.prototype,"fillContainer",void 0),e([h({type:Object})],d.prototype,"styles",void 0),e([l()],d.prototype,"chartLoaded",void 0),e([l()],d.prototype,"meteogramError",void 0),e([l()],d.prototype,"errorCount",void 0),e([l()],d.prototype,"lastErrorTime",void 0),e([l()],d.prototype,"_statusExpiresAt",void 0),e([l()],d.prototype,"_statusLastRender",void 0),e([l()],d.prototype,"_statusLastFingerprintMiss",void 0),e([l()],d.prototype,"_statusLastFetch",void 0),e([l()],d.prototype,"_statusApiSuccess",void 0),d=t=e([n("meteogram-card")],d),window.customElements.get("meteogram-card")||customElements.define("meteogram-card",d);let c=class extends HTMLElement{constructor(){super(...arguments),this.Z={},this.tt=!1,this.et=new Map}set hass(t){this.it=t,this.tt&&this.st()}get hass(){return this.it}setConfig(t){this.Z=t||{},this.tt?this.st():this.ot()}get config(){return this.Z}connectedCallback(){this.tt||this.ot()}ot(){this.render(),this.tt=!0,setTimeout(()=>this.st(),0)}st(){var t,e,i,s;if(!this.tt)return;const o=(t,e,i="value")=>{t&&t[i]!==e&&(t[i]=e)};o(this.et.get("title"),this.Z.title||""),o(this.et.get("latitude"),void 0!==this.Z.latitude?String(this.Z.latitude):void 0!==(null===(e=null===(t=this.it)||void 0===t?void 0:t.config)||void 0===e?void 0:e.latitude)?String(this.it.config.latitude):""),o(this.et.get("longitude"),void 0!==this.Z.longitude?String(this.Z.longitude):void 0!==(null===(s=null===(i=this.it)||void 0===i?void 0:i.config)||void 0===s?void 0:s.longitude)?String(this.it.config.longitude):""),o(this.et.get("show_cloud_cover"),void 0===this.Z.show_cloud_cover||this.Z.show_cloud_cover,"checked"),o(this.et.get("show_pressure"),void 0===this.Z.show_pressure||this.Z.show_pressure,"checked"),o(this.et.get("show_rain"),void 0===this.Z.show_rain||this.Z.show_rain,"checked"),o(this.et.get("show_weather_icons"),void 0===this.Z.show_weather_icons||this.Z.show_weather_icons,"checked"),o(this.et.get("show_wind"),void 0===this.Z.show_wind||this.Z.show_wind,"checked"),o(this.et.get("dense_weather_icons"),void 0===this.Z.dense_weather_icons||this.Z.dense_weather_icons,"checked"),o(this.et.get("meteogram_hours"),this.Z.meteogram_hours||"48h"),o(this.et.get("fill_container"),void 0!==this.Z.fill_container&&this.Z.fill_container,"checked")}render(){var t,e,i,s,o,r;const a=null!==(i=null===(e=null===(t=this.it)||void 0===t?void 0:t.config)||void 0===e?void 0:e.latitude)&&void 0!==i?i:"",n=null!==(r=null===(o=null===(s=this.it)||void 0===s?void 0:s.config)||void 0===o?void 0:o.longitude)&&void 0!==r?r:"",h=void 0===this.Z.show_cloud_cover||this.Z.show_cloud_cover,l=void 0===this.Z.show_pressure||this.Z.show_pressure,d=void 0===this.Z.show_rain||this.Z.show_rain,c=void 0===this.Z.show_weather_icons||this.Z.show_weather_icons,u=void 0===this.Z.show_wind||this.Z.show_wind,m=void 0===this.Z.dense_weather_icons||this.Z.dense_weather_icons,f=this.Z.meteogram_hours||"48h",g=void 0!==this.Z.fill_container&&this.Z.fill_container,v=document.createElement("div");v.innerHTML=`\n  <style>\n    ha-card {\n      padding: 16px;\n    }\n    .values {\n      padding-left: 16px;\n      margin: 8px 0;\n    }\n    .row {\n      display: flex;\n      margin-bottom: 12px;\n      align-items: center;\n    }\n    ha-textfield {\n      width: 100%;\n    }\n    .side-by-side {\n      display: flex;\n      gap: 12px;\n    }\n    .side-by-side > * {\n      flex: 1;\n    }\n    h3 {\n      font-size: 18px;\n      color: var(--primary-text-color);\n      font-weight: 500;\n      margin-bottom: 12px;\n      margin-top: 0;\n    }\n    .help-text {\n      color: var(--secondary-text-color);\n      font-size: 0.875rem;\n      margin-top: 4px;\n    }\n    .info-text {\n      color: var(--primary-text-color);\n      opacity: 0.8;\n      font-size: 0.9rem;\n      font-style: italic;\n      margin: 4px 0 16px 0;\n    }\n    .toggle-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 8px;\n    }\n    .toggle-label {\n      flex-grow: 1;\n    }\n    .toggle-section {\n      margin-top: 16px;\n      border-top: 1px solid var(--divider-color);\n      padding-top: 16px;\n    }\n  </style>\n  <ha-card>\n    <h3>Meteogram Card Settings</h3>\n    <div class="values">\n      <div class="row">\n        <ha-textfield\n          label="Title"\n          id="title-input"\n          .value="${this.Z.title||""}"\n        ></ha-textfield>\n      </div>\n\n      <p class="info-text">\n        Location coordinates will be used to fetch weather data directly from Met.no API.\n        ${a?"Using Home Assistant's location by default.":""}\n      </p>\n\n      <div class="side-by-side">\n        <ha-textfield\n          label="Latitude"\n          id="latitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this.Z.latitude?this.Z.latitude:a}"\n          placeholder="${a?`Default: ${a}`:""}"\n        ></ha-textfield>\n\n        <ha-textfield\n          label="Longitude"\n          id="longitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this.Z.longitude?this.Z.longitude:n}"\n          placeholder="${n?`Default: ${n}`:""}"\n        ></ha-textfield>\n      </div>\n      <p class="help-text">Leave empty to use Home Assistant's configured location</p>\n\n      <div class="toggle-section">\n        <h3>Display Options</h3>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Show Cloud Cover</div>\n          <ha-switch\n            id="show-cloud-cover"\n            .checked="${h}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Show Pressure</div>\n          <ha-switch\n            id="show-pressure"\n            .checked="${l}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Show Rain</div>\n          <ha-switch\n            id="show-rain"\n            .checked="${d}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Show Weather Icons</div>\n          <ha-switch\n            id="show-weather-icons"\n            .checked="${c}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Show Wind</div>\n          <ha-switch\n            id="show-wind"\n            .checked="${u}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Dense Weather Icons (every hour)</div>\n          <ha-switch\n            id="dense-weather-icons"\n            .checked="${m}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Fill Container</div>\n          <ha-switch\n            id="fill-container"\n            .checked="${g}"\n          ></ha-switch>\n        </div>\n      </div>\n\n      <div class="row">\n        <label for="meteogram-hours-select" style="margin-right:8px;">Meteogram Length</label>\n        <select id="meteogram-hours-select">\n          <option value="8h" ${"8h"===f?"selected":""}>8 hours</option>\n          <option value="12h" ${"12h"===f?"selected":""}>12 hours</option>\n          <option value="24h" ${"24h"===f?"selected":""}>24 hours</option>\n          <option value="48h" ${"48h"===f?"selected":""}>48 hours</option>\n          <option value="54h" ${"54h"===f?"selected":""}>54 hours</option>\n          <option value="max" ${"max"===f?"selected":""}>Max available</option>\n        </select>\n      </div>\n      <p class="help-text">Choose how many hours to show in the meteogram</p>\n    </div>\n  </ha-card>\n`,this.innerHTML="",this.appendChild(v),setTimeout(()=>{const t=this.querySelector("#title-input");t&&(t.configValue="title",t.addEventListener("input",this.rt.bind(this)),this.et.set("title",t));const e=this.querySelector("#latitude-input");e&&(e.configValue="latitude",e.addEventListener("input",this.rt.bind(this)),this.et.set("latitude",e));const i=this.querySelector("#longitude-input");i&&(i.configValue="longitude",i.addEventListener("input",this.rt.bind(this)),this.et.set("longitude",i));const s=this.querySelector("#show-cloud-cover");s&&(s.configValue="show_cloud_cover",s.addEventListener("change",this.rt.bind(this)),this.et.set("show_cloud_cover",s));const o=this.querySelector("#show-pressure");o&&(o.configValue="show_pressure",o.addEventListener("change",this.rt.bind(this)),this.et.set("show_pressure",o));const r=this.querySelector("#show-rain");r&&(r.configValue="show_rain",r.addEventListener("change",this.rt.bind(this)),this.et.set("show_rain",r));const a=this.querySelector("#show-weather-icons");a&&(a.configValue="show_weather_icons",a.addEventListener("change",this.rt.bind(this)),this.et.set("show_weather_icons",a));const n=this.querySelector("#show-wind");n&&(n.configValue="show_wind",n.addEventListener("change",this.rt.bind(this)),this.et.set("show_wind",n));const h=this.querySelector("#dense-weather-icons");h&&(h.configValue="dense_weather_icons",h.addEventListener("change",this.rt.bind(this)),this.et.set("dense_weather_icons",h));const l=this.querySelector("#meteogram-hours-select");l&&(l.configValue="meteogram_hours",l.addEventListener("change",this.rt.bind(this)),this.et.set("meteogram_hours",l));const d=this.querySelector("#fill-container");d&&(d.configValue="fill_container",d.addEventListener("change",this.rt.bind(this)),this.et.set("fill_container",d))},0)}rt(t){const e=t.target;if(!this.Z||!e||!e.configValue)return;let i=e.value||"";if("HA-SWITCH"===e.tagName)i=e.checked;else if("number"===e.type)if(""===i)i=void 0;else{const t=parseFloat(i.toString());isNaN(t)||(i=t)}else""===i&&(i=void 0);this.Z={...this.Z,[e.configValue]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.Z}}))}};c=e([n("meteogram-card-editor")],c),window.customCards=window.customCards||[],window.customCards.push({type:"meteogram-card",name:o,description:"A custom card showing a meteogram with wind barbs.",version:i,preview:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/images/meteogram-card.png",documentationURL:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/README.md"})};window.litElementModules?r():void 0!==t?t.then(()=>{r()}):console.error("Lit modules not found and litModulesPromise not available");
