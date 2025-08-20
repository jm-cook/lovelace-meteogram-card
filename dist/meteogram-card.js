const e=Promise.all([import("https://unpkg.com/lit@3.1.0/index.js?module"),import("https://unpkg.com/lit@3.1.0/decorators.js?module")]).then(([e,t])=>{window.litElementModules={LitElement:e.LitElement,html:e.html,css:e.css,customElement:t.customElement,property:t.property,state:t.state}});function t(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s}"function"==typeof SuppressedError&&SuppressedError;var i="2.1.0-beta0",r={"ui.card.meteogram.attribution":"Data from","ui.card.meteogram.status.cached":"cached","ui.card.meteogram.status.success":"success","ui.card.meteogram.status.failed":"failed","ui.card.meteogram.status_panel":"Status Panel","ui.card.meteogram.status.expires_at":"Expires At","ui.card.meteogram.status.last_render":"Last Render","ui.card.meteogram.status.last_fingerprint_miss":"Last Fingerprint Miss","ui.card.meteogram.status.last_data_fetch":"Last Data Fetch","ui.card.meteogram.status.last_cached":"Last cached","ui.card.meteogram.status.api_success":"API Success","ui.card.meteogram.error":"Weather data not available","ui.card.meteogram.attributes.temperature":"Temperature","ui.card.meteogram.attributes.air_pressure":"Pressure","ui.card.meteogram.attributes.precipitation":"Rain","ui.card.meteogram.attributes.snow":"Snow","ui.card.meteogram.attributes.cloud_coverage":"Cloud Cover","ui.card.meteogram.attributes.weather_icons":"Show Weather Icons","ui.card.meteogram.attributes.wind":"Show Wind","ui.card.meteogram.attributes.dense_icons":"Dense Weather Icons (every hour)","ui.card.meteogram.attributes.fill_container":"Fill Container","ui.editor.meteogram.title":"Meteogram Card Settings","ui.editor.meteogram.title_label":"Title","ui.editor.meteogram.location_info":"Location coordinates will be used to fetch weather data directly from Met.no API.","ui.editor.meteogram.using_ha_location":"Using Home Assistant's location by default.","ui.editor.meteogram.latitude":"Latitude","ui.editor.meteogram.longitude":"Longitude","ui.editor.meteogram.default":"Default","ui.editor.meteogram.leave_empty":"Leave empty to use Home Assistant's configured location","ui.editor.meteogram.display_options":"Display Options","ui.editor.meteogram.meteogram_length":"Meteogram Length","ui.editor.meteogram.hours_8":"8 hours","ui.editor.meteogram.hours_12":"12 hours","ui.editor.meteogram.hours_24":"24 hours","ui.editor.meteogram.hours_48":"48 hours","ui.editor.meteogram.hours_54":"54 hours","ui.editor.meteogram.hours_max":"Max available","ui.editor.meteogram.choose_hours":"Choose how many hours to show in the meteogram","ui.editor.meteogram.attributes.cloud_coverage":"Show Cloud Cover","ui.editor.meteogram.attributes.air_pressure":"Show Pressure","ui.editor.meteogram.attributes.precipitation":"Show Rain","ui.editor.meteogram.attributes.weather_icons":"Show Weather Icons","ui.editor.meteogram.attributes.wind":"Show Wind","ui.editor.meteogram.attributes.dense_icons":"Dense Weather Icons (every hour)","ui.editor.meteogram.attributes.fill_container":"Fill Container"},o={"ui.card.meteogram.attribution":"Data fra","ui.card.meteogram.status.cached":"bufret","ui.card.meteogram.status.success":"suksess","ui.card.meteogram.status.failed":"feilet","ui.card.meteogram.status_panel":"Statuspanel","ui.card.meteogram.status.expires_at":"Utløper","ui.card.meteogram.status.last_render":"Sist tegnet","ui.card.meteogram.status.last_fingerprint_miss":"Siste fingerprint-miss","ui.card.meteogram.status.last_data_fetch":"Siste datainnhenting","ui.card.meteogram.status.last_cached":"Sist bufret","ui.card.meteogram.status.api_success":"API-suksess","ui.card.meteogram.error":"Værdata ikke tilgjengelig","ui.card.meteogram.attributes.temperature":"Temperatur","ui.card.meteogram.attributes.air_pressure":"Lufttrykk","ui.card.meteogram.attributes.precipitation":"Regn","ui.card.meteogram.attributes.snow":"Snø","ui.card.meteogram.attributes.cloud_coverage":"Skydekke","ui.card.meteogram.attributes.weather_icons":"Vis værikoner","ui.card.meteogram.attributes.wind":"Vis vind","ui.card.meteogram.attributes.dense_icons":"Tette værikoner (hver time)","ui.card.meteogram.attributes.fill_container":"Fyll beholder","ui.editor.meteogram.title":"Meteogram-kortinnstillinger","ui.editor.meteogram.title_label":"Tittel","ui.editor.meteogram.location_info":"Lokasjonskoordinater brukes for å hente værdata direkte fra Met.no API.","ui.editor.meteogram.using_ha_location":"Bruker Home Assistants lokasjon som standard.","ui.editor.meteogram.latitude":"Breddegrad","ui.editor.meteogram.longitude":"Lengdegrad","ui.editor.meteogram.default":"Standard","ui.editor.meteogram.leave_empty":"La stå tomt for å bruke Home Assistants konfigurerte lokasjon","ui.editor.meteogram.display_options":"Visningsvalg","ui.editor.meteogram.meteogram_length":"Meteogramlengde","ui.editor.meteogram.hours_8":"8 timer","ui.editor.meteogram.hours_12":"12 timer","ui.editor.meteogram.hours_24":"24 timer","ui.editor.meteogram.hours_48":"48 timer","ui.editor.meteogram.hours_54":"54 timer","ui.editor.meteogram.hours_max":"Maks tilgjengelig","ui.editor.meteogram.choose_hours":"Velg hvor mange timer som skal vises i meteogrammet","ui.editor.meteogram.attributes.cloud_coverage":"Vis skydekke","ui.editor.meteogram.attributes.air_pressure":"Vis lufttrykk","ui.editor.meteogram.attributes.precipitation":"Vis regn","ui.editor.meteogram.attributes.weather_icons":"Vis værikoner","ui.editor.meteogram.attributes.wind":"Vis vind","ui.editor.meteogram.attributes.dense_icons":"Tette værikoner (hver time)","ui.editor.meteogram.attributes.fill_container":"Fyll beholder"},a={"ui.card.meteogram.attribution":"Datos de","ui.card.meteogram.status.cached":"en caché","ui.card.meteogram.status.success":"éxito","ui.card.meteogram.status.failed":"fallido","ui.card.meteogram.status_panel":"Panel de estado","ui.card.meteogram.status.expires_at":"Expira en","ui.card.meteogram.status.last_render":"Última representación","ui.card.meteogram.status.last_fingerprint_miss":"Última huella fallida","ui.card.meteogram.status.last_data_fetch":"Última obtención de datos","ui.card.meteogram.status.last_cached":"Último en caché","ui.card.meteogram.status.api_success":"Éxito de la API","ui.card.meteogram.error":"Datos meteorológicos no disponibles","ui.card.meteogram.attributes.temperature":"Temperatura","ui.card.meteogram.attributes.air_pressure":"Presión","ui.card.meteogram.attributes.precipitation":"Lluvia","ui.card.meteogram.attributes.snow":"Nieve","ui.card.meteogram.attributes.cloud_coverage":"Cobertura de nubes","ui.card.meteogram.attributes.weather_icons":"Mostrar iconos meteorológicos","ui.card.meteogram.attributes.wind":"Mostrar viento","ui.card.meteogram.attributes.dense_icons":"Iconos meteorológicos densos (cada hora)","ui.card.meteogram.attributes.fill_container":"Rellenar el contenedor","ui.editor.meteogram.title":"Configuración de la tarjeta Meteograma","ui.editor.meteogram.title_label":"Título","ui.editor.meteogram.location_info":"Las coordenadas se utilizarán para obtener datos meteorológicos directamente de la API de Met.no.","ui.editor.meteogram.using_ha_location":"Usando la ubicación de Home Assistant por defecto.","ui.editor.meteogram.latitude":"Latitud","ui.editor.meteogram.longitude":"Longitud","ui.editor.meteogram.default":"Predeterminado","ui.editor.meteogram.leave_empty":"Dejar vacío para usar la ubicación configurada en Home Assistant","ui.editor.meteogram.display_options":"Opciones de visualización","ui.editor.meteogram.meteogram_length":"Duración del meteograma","ui.editor.meteogram.hours_8":"8 horas","ui.editor.meteogram.hours_12":"12 horas","ui.editor.meteogram.hours_24":"24 horas","ui.editor.meteogram.hours_48":"48 horas","ui.editor.meteogram.hours_54":"54 horas","ui.editor.meteogram.hours_max":"Máximo disponible","ui.editor.meteogram.choose_hours":"Elija cuántas horas mostrar en el meteograma","ui.editor.meteogram.attributes.cloud_coverage":"Mostrar cobertura de nubes","ui.editor.meteogram.attributes.air_pressure":"Mostrar presión","ui.editor.meteogram.attributes.precipitation":"Mostrar lluvia","ui.editor.meteogram.attributes.weather_icons":"Mostrar iconos meteorológicos","ui.editor.meteogram.attributes.wind":"Mostrar viento","ui.editor.meteogram.attributes.dense_icons":"Iconos meteorológicos densos (cada hora)","ui.editor.meteogram.attributes.fill_container":"Rellenar el contenedor"},s={"ui.card.meteogram.attribution":"Dati da","ui.card.meteogram.status.cached":"memorizzato","ui.card.meteogram.status.success":"successo","ui.card.meteogram.status.failed":"fallito","ui.card.meteogram.status_panel":"Pannello di stato","ui.card.meteogram.status.expires_at":"Scade il","ui.card.meteogram.status.last_render":"Ultima visualizzazione","ui.card.meteogram.status.last_fingerprint_miss":"Ultima impronta mancante","ui.card.meteogram.status.last_data_fetch":"Ultimo recupero dati","ui.card.meteogram.status.last_cached":"Ultimo memorizzato","ui.card.meteogram.status.api_success":"Successo API","ui.card.meteogram.error":"Dati meteorologici non disponibili","ui.card.meteogram.attributes.temperature":"Temperatura","ui.card.meteogram.attributes.air_pressure":"Pressione","ui.card.meteogram.attributes.precipitation":"Pioggia","ui.card.meteogram.attributes.snow":"Neve","ui.card.meteogram.attributes.cloud_coverage":"Copertura nuvolosa","ui.card.meteogram.attributes.weather_icons":"Mostra icone meteo","ui.card.meteogram.attributes.wind":"Mostra vento","ui.card.meteogram.attributes.dense_icons":"Icone meteo dense (ogni ora)","ui.card.meteogram.attributes.fill_container":"Riempi contenitore","ui.editor.meteogram.title":"Impostazioni della scheda Meteogramma","ui.editor.meteogram.title_label":"Titolo","ui.editor.meteogram.location_info":"Le coordinate verranno utilizzate per ottenere i dati meteorologici direttamente dall'API Met.no.","ui.editor.meteogram.using_ha_location":"Utilizzo della posizione di Home Assistant come predefinita.","ui.editor.meteogram.latitude":"Latitudine","ui.editor.meteogram.longitude":"Longitudine","ui.editor.meteogram.default":"Predefinito","ui.editor.meteogram.leave_empty":"Lascia vuoto per usare la posizione configurata in Home Assistant","ui.editor.meteogram.display_options":"Opzioni di visualizzazione","ui.editor.meteogram.meteogram_length":"Durata meteogramma","ui.editor.meteogram.hours_8":"8 ore","ui.editor.meteogram.hours_12":"12 ore","ui.editor.meteogram.hours_24":"24 ore","ui.editor.meteogram.hours_48":"48 ore","ui.editor.meteogram.hours_54":"54 ore","ui.editor.meteogram.hours_max":"Massimo disponibile","ui.editor.meteogram.choose_hours":"Scegli quante ore mostrare nel meteogramma","ui.editor.meteogram.attributes.cloud_coverage":"Mostra copertura nuvolosa","ui.editor.meteogram.attributes.air_pressure":"Mostra pressione","ui.editor.meteogram.attributes.precipitation":"Mostra pioggia","ui.editor.meteogram.attributes.weather_icons":"Mostra icone meteo","ui.editor.meteogram.attributes.wind":"Mostra vento","ui.editor.meteogram.attributes.dense_icons":"Icone meteo dense (ogni ora)","ui.editor.meteogram.attributes.fill_container":"Riempi contenitore"},n={"ui.card.meteogram.attribution":"Daten von","ui.card.meteogram.status.cached":"zwischengespeichert","ui.card.meteogram.status.success":"Erfolg","ui.card.meteogram.status.failed":"Fehler","ui.card.meteogram.status_panel":"Statuspanel","ui.card.meteogram.status.expires_at":"Ablaufdatum","ui.card.meteogram.status.last_render":"Letzte Darstellung","ui.card.meteogram.status.last_fingerprint_miss":"Letzter Fingerabdruck-Fehler","ui.card.meteogram.status.last_data_fetch":"Letzter Datenabruf","ui.card.meteogram.status.last_cached":"Zuletzt zwischengespeichert","ui.card.meteogram.status.api_success":"API-Erfolg","ui.card.meteogram.error":"Wetterdaten nicht verfügbar","ui.card.meteogram.attributes.temperature":"Temperatur","ui.card.meteogram.attributes.air_pressure":"Luftdruck","ui.card.meteogram.attributes.precipitation":"Regen","ui.card.meteogram.attributes.snow":"Schnee","ui.card.meteogram.attributes.cloud_coverage":"Wolkenbedeckung","ui.card.meteogram.attributes.weather_icons":"Wetter-Symbole anzeigen","ui.card.meteogram.attributes.wind":"Wind anzeigen","ui.card.meteogram.attributes.dense_icons":"Dichte Wettersymbole (jede Stunde)","ui.card.meteogram.attributes.fill_container":"Container ausfüllen","ui.editor.meteogram.title":"Meteogramm-Karteneinstellungen","ui.editor.meteogram.title_label":"Titel","ui.editor.meteogram.location_info":"Die Koordinaten werden verwendet, um Wetterdaten direkt von der Met.no API abzurufen.","ui.editor.meteogram.using_ha_location":"Standardmäßig wird der Standort von Home Assistant verwendet.","ui.editor.meteogram.latitude":"Breitengrad","ui.editor.meteogram.longitude":"Längengrad","ui.editor.meteogram.default":"Standard","ui.editor.meteogram.leave_empty":"Leer lassen, um die konfigurierte Position von Home Assistant zu verwenden","ui.editor.meteogram.display_options":"Anzeigeoptionen","ui.editor.meteogram.meteogram_length":"Meteogramm-Länge","ui.editor.meteogram.hours_8":"8 Stunden","ui.editor.meteogram.hours_12":"12 Stunden","ui.editor.meteogram.hours_24":"24 Stunden","ui.editor.meteogram.hours_48":"48 Stunden","ui.editor.meteogram.hours_54":"54 Stunden","ui.editor.meteogram.hours_max":"Maximal verfügbar","ui.editor.meteogram.choose_hours":"Wählen Sie, wie viele Stunden im Meteogramm angezeigt werden sollen","ui.editor.meteogram.attributes.cloud_coverage":"Wolkenbedeckung anzeigen","ui.editor.meteogram.attributes.air_pressure":"Luftdruck anzeigen","ui.editor.meteogram.attributes.precipitation":"Regen anzeigen","ui.editor.meteogram.attributes.weather_icons":"Wetter-Symbole anzeigen","ui.editor.meteogram.attributes.wind":"Wind anzeigen","ui.editor.meteogram.attributes.dense_icons":"Dichte Wettersymbole (jede Stunde)","ui.editor.meteogram.attributes.fill_container":"Container ausfüllen"},d={"ui.card.meteogram.attribution":"Données de","ui.card.meteogram.status.cached":"mis en cache","ui.card.meteogram.status.success":"succès","ui.card.meteogram.status.failed":"échec","ui.card.meteogram.status_panel":"Panneau d'état","ui.card.meteogram.status.expires_at":"Expire à","ui.card.meteogram.status.last_render":"Dernier rendu","ui.card.meteogram.status.last_fingerprint_miss":"Dernière empreinte manquée","ui.card.meteogram.status.last_data_fetch":"Dernière récupération de données","ui.card.meteogram.status.last_cached":"Dernière mise en cache","ui.card.meteogram.status.api_success":"Succès API","ui.card.meteogram.error":"Données météo non disponibles","ui.card.meteogram.attributes.temperature":"Température","ui.card.meteogram.attributes.air_pressure":"Pression","ui.card.meteogram.attributes.precipitation":"Pluie","ui.card.meteogram.attributes.snow":"Neige","ui.card.meteogram.attributes.cloud_coverage":"Couverture nuageuse","ui.card.meteogram.attributes.weather_icons":"Afficher les icônes météo","ui.card.meteogram.attributes.wind":"Afficher le vent","ui.card.meteogram.attributes.dense_icons":"Icônes météo denses (chaque heure)","ui.card.meteogram.attributes.fill_container":"Remplir le conteneur","ui.editor.meteogram.title":"Paramètres de la carte Météogramme","ui.editor.meteogram.title_label":"Titre","ui.editor.meteogram.location_info":"Les coordonnées seront utilisées pour obtenir les données météo directement depuis l'API Met.no.","ui.editor.meteogram.using_ha_location":"Utilisation de la localisation Home Assistant par défaut.","ui.editor.meteogram.latitude":"Latitude","ui.editor.meteogram.longitude":"Longitude","ui.editor.meteogram.default":"Défaut","ui.editor.meteogram.leave_empty":"Laisser vide pour utiliser la localisation configurée dans Home Assistant","ui.editor.meteogram.display_options":"Options d'affichage","ui.editor.meteogram.meteogram_length":"Durée du météogramme","ui.editor.meteogram.hours_8":"8 heures","ui.editor.meteogram.hours_12":"12 heures","ui.editor.meteogram.hours_24":"24 heures","ui.editor.meteogram.hours_48":"48 heures","ui.editor.meteogram.hours_54":"54 heures","ui.editor.meteogram.hours_max":"Maximum disponible","ui.editor.meteogram.choose_hours":"Choisissez combien d'heures afficher dans le météogramme","ui.editor.meteogram.attributes.cloud_coverage":"Afficher la couverture nuageuse","ui.editor.meteogram.attributes.air_pressure":"Afficher la pression","ui.editor.meteogram.attributes.precipitation":"Afficher la pluie","ui.editor.meteogram.attributes.weather_icons":"Afficher les icônes météo","ui.editor.meteogram.attributes.wind":"Afficher le vent","ui.editor.meteogram.attributes.dense_icons":"Icônes météo denses (chaque heure)","ui.editor.meteogram.attributes.fill_container":"Remplir le conteneur"};const l=i.includes("beta"),c="Meteogram Card";function h(e,t,i){var l;if(e&&"function"==typeof e.localize){const i=e.localize(t);if(i&&i!==t)return i}if(e&&e.resources&&"object"==typeof e.resources){const i=e.language||"en",r=null===(l=e.resources[i])||void 0===l?void 0:l[t];if(r)return r}const c=e&&e.language?e.language:"en";let h;return h=c.startsWith("nb")?o[t]:c.startsWith("es")?a[t]:c.startsWith("it")?s[t]:c.startsWith("de")?n[t]:c.startsWith("fr")?d[t]:r[t],h||(void 0!==i?i:t)}const m=()=>{var e;console.info(`%c☀️ ${c} ${i} ⚡️🌦️`,"color: #1976d2; font-weight: bold; background: white");const{LitElement:a,css:s,customElement:n,property:d,state:m}=window.litElementModules;let u=e=class extends a{constructor(){super(...arguments),this.title="",this.showCloudCover=!0,this.showPressure=!0,this.showRain=!0,this.showWeatherIcons=!0,this.showWind=!0,this.denseWeatherIcons=!0,this.meteogramHours="48h",this.fillContainer=!1,this.styles={},this.chartLoaded=!1,this.meteogramError="",this.errorCount=0,this.lastErrorTime=0,this.iconCache=new Map,this.iconBasePath="https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/",this.hasRendered=!1,this.svg=null,this.t=null,this.i=0,this.o=0,this.l=null,this.h=null,this.m=!1,this.u=null,this.p=!1,this.apiExpiresAt=null,this.apiLastModified=null,this.cachedWeatherData=null,this.weatherDataPromise=null,this.v=!1,this._="",this.k="",this.$="",this.S="",this.M=null,this.C=()=>{!document.hidden&&this.isConnected&&this.D()},this.A=()=>{setTimeout(()=>{this.isConnected&&this.L()&&this.D()},100)},this.trnslt=(e,t)=>{var i;if(this.hass&&"function"==typeof this.hass.localize){const t=this.hass.localize(e);if(t&&t!==e)return t}if(this.hass&&this.hass.resources&&"object"==typeof this.hass.resources){const t=this.hass.language||"en",r=null===(i=this.hass.resources[t])||void 0===i?void 0:i[e];if(r)return r}let a;return a=(this.hass&&this.hass.language?this.hass.language:"en").startsWith("nb")?o[e]:r[e],a||(void 0!==t?t:e)}}async getIconSVG(e){if(this.iconCache.has(e))return this.iconCache.get(e);try{const t=`${this.iconBasePath}${e}.svg`,i=await fetch(t);if(!i.ok)return console.warn(`Failed to load icon: ${e}, status: ${i.status}`),"";const r=await i.text();return!r.includes("<svg")||r.length<20?(console.warn(`Invalid SVG content for ${e}`),""):(this.iconCache.set(e,r),r)}catch(t){return console.error(`Error loading icon ${e}:`,t),""}}P(){this.v||(this.v=!0,setTimeout(()=>{this.F(),this.v=!1},50))}setConfig(e){const t=void 0!==e.latitude?parseFloat(Number(e.latitude).toFixed(4)):void 0,i=void 0!==e.longitude?parseFloat(Number(e.longitude).toFixed(4)):void 0;void 0!==this.latitude&&parseFloat(Number(this.latitude).toFixed(4)),void 0!==this.longitude&&parseFloat(Number(this.longitude).toFixed(4)),e.title&&(this.title=e.title),void 0!==e.latitude&&(this.latitude=t),void 0!==e.longitude&&(this.longitude=i),this.showCloudCover=void 0===e.show_cloud_cover||e.show_cloud_cover,this.showPressure=void 0===e.show_pressure||e.show_pressure,this.showRain=void 0===e.show_rain||e.show_rain,this.showWeatherIcons=void 0===e.show_weather_icons||e.show_weather_icons,this.showWind=void 0===e.show_wind||e.show_wind,this.denseWeatherIcons=void 0===e.dense_weather_icons||e.dense_weather_icons,this.meteogramHours=e.meteogram_hours||"48h",this.fillContainer=void 0!==e.fill_container&&e.fill_container,this.styles=e.styles||{}}static getConfigElement(){const e=document.createElement("meteogram-card-editor");return e.setConfig({show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1}),e}static getStubConfig(){return{title:"Weather Forecast",show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1}}getCardSize(){return 3}connectedCallback(){super.connectedCallback(),this.m=!1,this.updateComplete.then(()=>{this.N(),this.T(),this.I(),document.addEventListener("visibilitychange",this.C.bind(this)),window.addEventListener("location-changed",this.A.bind(this)),this.isConnected&&(this.hasRendered&&this.chartLoaded?this.P():this.loadD3AndDraw())})}disconnectedCallback(){this.W(),this.O(),this.j(),document.removeEventListener("visibilitychange",this.C.bind(this)),window.removeEventListener("location-changed",this.A.bind(this)),this.cleanupChart(),this.R&&(clearTimeout(this.R),this.R=null),this.H&&(clearTimeout(this.H),this.H=null),super.disconnectedCallback()}L(){if(!this.isConnected||!this.shadowRoot)return!1;if(document.hidden)return!1;const e=this.shadowRoot.host;if(!e)return!1;if(0===e.offsetWidth&&0===e.offsetHeight)return!1;const t=window.getComputedStyle(e);if("none"===t.display)return!1;if("hidden"===t.visibility)return!1;const i=e.getBoundingClientRect();return!(i.top+i.height<=0||i.left+i.width<=0||i.bottom>=window.innerHeight||i.right>=window.innerWidth)}T(){var e;this.l||(this.l=new IntersectionObserver(e=>{for(const t of e)if(t.isIntersecting){this.D();break}},{threshold:[.1]}),(null===(e=this.shadowRoot)||void 0===e?void 0:e.host)&&this.l.observe(this.shadowRoot.host))}O(){this.l&&(this.l.disconnect(),this.l=null)}I(){var e;if(!this.h){this.h=new MutationObserver(e=>{for(const t of e){if(t.target instanceof HTMLElement&&("HA-TAB"===t.target.tagName||"HA-TABS"===t.target.tagName||t.target.classList.contains("content")||t.target.hasAttribute("active")))break;if("attributes"===t.type&&("style"===t.attributeName||"class"===t.attributeName||"hidden"===t.attributeName||"active"===t.attributeName))break}}),document.querySelectorAll("ha-tabs, ha-tab, ha-tab-container").forEach(e=>{e&&this.h.observe(e,{attributes:!0,childList:!0,subtree:!0})});const t=(null===(e=this.shadowRoot)||void 0===e?void 0:e.host)||null;if(t instanceof HTMLElement){let e=t;for(;e&&e.parentElement;)this.h.observe(e.parentElement,{attributes:!0,attributeFilter:["style","class","hidden","active"],childList:!1,subtree:!1}),e=e.parentElement}const i=document.querySelector("home-assistant, ha-panel-lovelace");i&&this.h.observe(i,{childList:!0,subtree:!0})}}j(){this.h&&(this.h.disconnect(),this.h=null)}D(){var e;if(this.L()){const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");!(this.hasRendered&&this.svg&&t&&""!==t.innerHTML&&0!==t.clientWidth&&t.querySelector("svg"))&&this.chartLoaded&&(this.hasRendered=!1,this.cleanupChart(),this.requestUpdate(),this.updateComplete.then(()=>this.P()))}}N(){this.t||(this.t=new ResizeObserver(this.V.bind(this))),setTimeout(()=>{var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");t&&this.t&&this.t.observe(t)},100)}V(e){if(0===e.length)return;const t=e[0];(Math.abs(t.contentRect.width-this.i)>.05*this.i||Math.abs(t.contentRect.height-this.o)>.1*this.o)&&(this.i=t.contentRect.width,this.o=t.contentRect.height,this.P())}W(){this.t&&(this.t.disconnect(),this.t=null)}firstUpdated(e){setTimeout(()=>{this.loadD3AndDraw()},50),this.hasRendered=!1,this.U()}updated(e){var t,i;const r=e.has("latitude")||e.has("longitude")||e.has("hass")||e.has("showCloudCover")||e.has("showPressure")||e.has("showRain")||e.has("showWeatherIcons")||e.has("showWind")||e.has("denseWeatherIcons")||e.has("meteogramHours")||e.has("fillContainer")||!this.hasRendered;if(this.chartLoaded&&r){this.B();const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart"),i=!e||""===e.innerHTML||!e.querySelector("svg");this.hasRendered&&!i||this.P()}if(!this.m&&this.shadowRoot&&(this.m=!0,this.chartLoaded)){const e=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector("#chart");e&&""===e.innerHTML&&this.P()}this.U()}static encodeCacheKey(e,t){const i=String(e)+String(t);return btoa(i)}getLocationKey(t,i){return e.encodeCacheKey(Number(t.toFixed(4)),Number(i.toFixed(4)))}J(e,t){try{if(void 0!==e&&void 0!==t){const i=localStorage.getItem("meteogram-card-weather-cache");let r={};if(i)try{r=JSON.parse(i)}catch{r={}}r["default-location"]={latitude:parseFloat(e.toFixed(4)),longitude:parseFloat(t.toFixed(4))},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(r))}}catch(e){console.debug("Failed to save location to localStorage:",e)}}q(e,t){try{const i=localStorage.getItem("meteogram-card-weather-cache");let r={};if(i)try{r=JSON.parse(i)}catch{r={}}r["default-location"]={latitude:parseFloat(e.toFixed(4)),longitude:parseFloat(t.toFixed(4))},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(r))}catch(e){console.debug("Failed to save default location to localStorage:",e)}}G(){try{const e=localStorage.getItem("meteogram-card-weather-cache");if(e){let t={};try{t=JSON.parse(e)}catch{t={}}if(t["default-location"]){const e=parseFloat(Number(t["default-location"].latitude).toFixed(4)),i=parseFloat(Number(t["default-location"].longitude).toFixed(4));if(!isNaN(e)&&!isNaN(i))return{latitude:e,longitude:i}}}return null}catch(e){return console.debug("Failed to load location from localStorage:",e),null}}K(){try{const e=localStorage.getItem("meteogram-card-weather-cache");if(e){let t={};try{t=JSON.parse(e)}catch{t={}}if(t["default-location"]){const e=parseFloat(Number(t["default-location"].latitude).toFixed(4)),i=parseFloat(Number(t["default-location"].longitude).toFixed(4));if(!isNaN(e)&&!isNaN(i))return{latitude:e,longitude:i}}}return null}catch(e){return console.debug("Failed to load default location from localStorage:",e),null}}B(){if(void 0!==this.latitude&&void 0!==this.longitude)return this.latitude=parseFloat(Number(this.latitude).toFixed(4)),void(this.longitude=parseFloat(Number(this.longitude).toFixed(4)));if(this.hass&&(void 0===this.latitude||void 0===this.longitude)){const e=this.hass.config||{};if(void 0!==e.latitude&&void 0!==e.longitude){const t=parseFloat(Number(e.latitude).toFixed(4)),i=parseFloat(Number(e.longitude).toFixed(4)),r=this.K();return r&&r.latitude===t&&r.longitude===i||this.q(t,i),this.latitude=t,this.longitude=i,void console.debug(`Using HA location: ${this.latitude}, ${this.longitude}`)}}if(void 0===this.latitude||void 0===this.longitude){const e=this.K();e?(this.latitude=e.latitude,this.longitude=e.longitude,console.debug(`Using cached default-location: ${this.latitude}, ${this.longitude}`)):(this.latitude=51.5074,this.longitude=-.1278,console.debug(`Using default location: ${this.latitude}, ${this.longitude}`))}}async loadD3AndDraw(){if(window.d3)return this.chartLoaded=!0,void this.P();try{const e=document.createElement("script");e.src="https://d3js.org/d3.v7.min.js",e.async=!0;const t=new Promise((t,i)=>{e.onload=()=>{this.chartLoaded=!0,t()},e.onerror=()=>{i(new Error("Failed to load D3.js library"))}});if(document.head.appendChild(e),await t,!window.d3)throw new Error("D3.js not available after loading script");await this.P()}catch(e){console.error("Error loading D3.js:",e),this.setError("Failed to load D3.js visualization library. Please refresh the page.")}}saveCacheToStorage(e,t){try{if(this.cachedWeatherData&&this.apiExpiresAt){const i=this.getLocationKey(e,t);let r={};const o=localStorage.getItem("meteogram-card-weather-cache");if(o)try{r=JSON.parse(o)}catch{r={}}r["forecast-data"]||(r["forecast-data"]={}),r["forecast-data"][i]={expiresAt:this.apiExpiresAt,lastModified:this.apiLastModified||void 0,data:this.cachedWeatherData},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(r))}}catch(e){}}loadCacheFromStorage(e,t){var i;try{const r=this.getLocationKey(e,t),o=localStorage.getItem("meteogram-card-weather-cache");if(o){let a={};try{a=JSON.parse(o)}catch{a={}}const s=null===(i=a["forecast-data"])||void 0===i?void 0:i[r];l&&console.log(`[meteogram-card] Attempting to load cache for (lat: ${e}, lon: ${t}), key: ${r}, entry:`,s),s&&s.expiresAt&&s.data?(this.apiExpiresAt=s.expiresAt,this.apiLastModified=s.lastModified||null,Array.isArray(s.data.time)&&(s.data.time=s.data.time.map(e=>"string"==typeof e?new Date(e):e)),this.cachedWeatherData=s.data):(l&&console.log(`[meteogram-card] No cache entry found for key: ${r}`),this.apiExpiresAt=null,this.apiLastModified=null,this.cachedWeatherData=null)}}catch(e){console.debug("Failed to load cache from localStorage:",e)}}async fetchWeatherData(){const e=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,t=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;l&&console.log(`[meteogram-card] fetchWeatherData called with lat=${e}, lon=${t}`),void 0!==e&&void 0!==t&&this.loadCacheFromStorage(e,t);const i=this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown",r=void 0!==e?e.toFixed(4):void 0,o=void 0!==t?t.toFixed(4):void 0;if(l&&console.log(`[meteogram-card] fetchWeatherData called at ${(new Date).toISOString()} with lat=${r}, lon=${o} (expires at ${i})`),!e||!t){this.B();const e=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,t=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;if(!e||!t)throw new Error("Could not determine location. Please check your card configuration or Home Assistant settings.")}if(this.apiExpiresAt&&Date.now()<this.apiExpiresAt&&this.cachedWeatherData){this.H&&(clearTimeout(this.H),this.H=null);const e=this.apiExpiresAt+6e4-Date.now();return e>0&&(this.H=window.setTimeout(()=>{this.H=null,this.fetchWeatherData().then(e=>{JSON.stringify(e)!==JSON.stringify(this.cachedWeatherData)&&(this.cachedWeatherData=e,this.P())}).catch(()=>{this.P()})},e)),l&&console.log(`[meteogram-card] Returning cached weather data (expires at ${i}), will refresh in ${Math.round(e/1e3)}s`),Promise.resolve(this.cachedWeatherData)}return this.weatherDataPromise?(l&&console.log(`[meteogram-card] Returning in-flight weather data promise (expires at ${i})`),this.weatherDataPromise):(this.weatherDataPromise=(async()=>{try{this.S=(new Date).toISOString();const i=`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${e}&lon=${t}`,r={};r.Origin=window.location.origin,l&&console.log("[meteogram-card] Fetch headers:",r);const o=await fetch(i,{headers:r});if(429===o.status){const e=o.headers.get("Expires");let t=null;if(e){const i=new Date(e);isNaN(i.getTime())||(t=i.getTime(),this.apiExpiresAt=t)}const i=t?new Date(t).toLocaleTimeString():"later";throw console.warn(`Weather API throttling (429). Next attempt allowed after ${i}.`),new Error(`Weather API throttling: Too many requests. Please wait until ${i} before retrying.`)}const a=o.headers.get("Expires");if(a){const e=new Date(a);isNaN(e.getTime())||(this.apiExpiresAt=e.getTime(),this._=e.toISOString(),l&&console.log(`[meteogram-card] API response Expires at ${e.toISOString()}`))}const s=o.headers.get("Last-Modified");if(s&&(this.apiLastModified=s,l&&console.log(`[meteogram-card] API response Last-Modified: ${s}`)),304===o.status){if(l&&console.log("[meteogram-card] API returned 304 Not Modified, using cached data."),this.cachedWeatherData)return this.cachedWeatherData;throw new Error("API returned 304 but no cached data is available.")}if(this.M=null,this.M=o.ok,!o.ok){const e=await o.text();if(console.error("Weather API fetch failed:",{url:i,status:o.status,statusText:o.statusText,body:e}),0===o.status)throw new Error("Weather API request failed (status 0). This may be a network or CORS issue. See browser console for details.");throw new Error(`Weather API returned ${o.status}: ${o.statusText}\n${e}`)}const n=await o.json();if(!n||!n.properties||!n.properties.timeseries||0===n.properties.timeseries.length)throw new Error("Invalid data format received from API");const d=n.properties.timeseries.filter(e=>0===new Date(e.time).getMinutes()),c={time:[],temperature:[],rain:[],rainMin:[],rainMax:[],snow:[],cloudCover:[],windSpeed:[],windDirection:[],symbolCode:[],pressure:[]};c.fetchTimestamp=(new Date).toISOString(),d.forEach(e=>{var t,i,r;const o=new Date(e.time),a=e.data.instant.details,s=null===(t=e.data.next_1_hours)||void 0===t?void 0:t.details;if(c.time.push(o),c.temperature.push(a.air_temperature),c.cloudCover.push(a.cloud_area_fraction),c.windSpeed.push(a.wind_speed),c.windDirection.push(a.wind_from_direction),c.pressure.push(a.air_pressure_at_sea_level),s){const t=void 0!==s.precipitation_amount_max?s.precipitation_amount_max:void 0!==s.precipitation_amount?s.precipitation_amount:0,o=void 0!==s.precipitation_amount_min?s.precipitation_amount_min:void 0!==s.precipitation_amount?s.precipitation_amount:0;c.rainMin.push(o),c.rainMax.push(t),c.rain.push(void 0!==s.precipitation_amount?s.precipitation_amount:0),c.snow.push(0),(null===(r=null===(i=e.data.next_1_hours)||void 0===i?void 0:i.summary)||void 0===r?void 0:r.symbol_code)?c.symbolCode.push(e.data.next_1_hours.summary.symbol_code):c.symbolCode.push("")}else c.rain.push(0),c.rainMin.push(0),c.rainMax.push(0),c.snow.push(0),c.symbolCode.push("")}),this.cachedWeatherData=c,void 0!==e&&void 0!==t&&this.saveCacheToStorage(e,t);let h=48;return"8h"===this.meteogramHours?h=8:"12h"===this.meteogramHours?h=12:"24h"===this.meteogramHours?h=24:"48h"===this.meteogramHours?h=48:"54h"===this.meteogramHours?h=54:"max"===this.meteogramHours&&(h=c.time.length),h<c.time.length&&Object.keys(c).forEach(e=>{c[e]=c[e].slice(0,h)}),this.P(),c}catch(e){if(this.M=!1,this.cachedWeatherData)return console.warn("Error fetching weather data, using cached data (may be expired):",e),this.cachedWeatherData;throw console.error("Error fetching weather data:",e),new Error(`Failed to get weather data: ${e.message}\nCheck your network connection, browser console, and API accessibility.`)}finally{this.weatherDataPromise=null}})(),this.weatherDataPromise)}cleanupChart(){try{if(this.svg&&"function"==typeof this.svg.remove&&(this.svg.remove(),this.svg=null),this.shadowRoot){const e=this.shadowRoot.querySelector("#chart");e&&(e.innerHTML="")}}catch(e){console.warn("Error cleaning up chart:",e)}}async F(){var t,i,r;this.k=(new Date).toISOString();const o=Date.now();if(this.meteogramError&&o-this.lastErrorTime<6e4)return void this.errorCount++;if(this.meteogramError="",this.B(),!this.latitude||!this.longitude)return void this.setError("Location not available. Please check your card configuration or Home Assistant settings.");let a=null;try{a=await this.fetchWeatherData()}catch(e){return void this.setError("Weather data not available.")}const s=`${this.latitude},${this.longitude},${this.showCloudCover},${this.showPressure},${this.showWeatherIcons},${this.showWind},${this.meteogramHours},${this.fillContainer},${JSON.stringify(a)}}`;if(this.u===s&&this.svg&&this.chartLoaded){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart");if(e&&e.querySelector("svg"))return}this.$=(new Date).toISOString(),this.u=s,await this.updateComplete,this.Y();if(e.lastD3RetryTime||(e.lastD3RetryTime=0),!window.d3)try{return void await this.loadD3AndDraw()}catch(t){const i=Date.now();if(i-e.lastD3RetryTime<1e4)return;return e.lastD3RetryTime=i,void this.setError("D3.js library could not be loaded. Please refresh the page.")}this.cleanupChart(),await new Promise(e=>setTimeout(e,10));const n=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector("#chart");if(n)this.Z(n);else if(console.error("Chart container not found in DOM"),this.isConnected){this.requestUpdate(),await this.updateComplete,await new Promise(e=>setTimeout(e,50));const e=null===(r=this.shadowRoot)||void 0===r?void 0:r.querySelector("#chart");if(!e){if(console.error("Chart container still not found after retry"),this.shadowRoot){const e=this.shadowRoot.querySelector(".card-content");if(e&&this.isConnected){e.innerHTML='<div id="chart"></div>';const t=this.shadowRoot.querySelector("#chart");if(t)return void this.Z(t)}}return}this.Z(e)}}Z(e){if(this.p){l&&console.log("[meteogram-card] Chart render already in progress, skipping redundant render.");return void(e.querySelector("svg")||(l&&console.log("[meteogram-card] No SVG found, clearing render-in-progress flag to recover."),this.p=!1))}this.p=!0,setTimeout(()=>{this.p&&(l&&console.log("[meteogram-card] Clearing chart render flag after timeout."),this.p=!1)},1e3);try{const t=e.querySelector("svg"),i=e.offsetWidth>0&&e.offsetHeight>0;if(t&&i&&this.hasRendered)return void(this.p=!1);const r=e.parentElement;let o,a,s=r?r.clientWidth:e.offsetWidth||350,n=r?r.clientHeight:e.offsetHeight||180;const d=Math.min(.7*window.innerHeight,520);if(this.fillContainer)o=e.offsetWidth>0?e.offsetWidth:s,a=e.offsetHeight>0?e.offsetHeight:n;else{const e=Math.min(.95*window.innerWidth,1200);o=Math.max(Math.min(s,e),300);const t=.5*o;a=Math.min(t,n,d)}const l=this.showWind?55:0,c=24;Math.min(a,n,d);this.i=s,this.o=n,t&&this.i===s&&this.o===n?this.p=!1:(e.innerHTML="",this.fetchWeatherData().then(t=>{e.querySelector("svg")&&(console.debug("SVG already exists, removing before creating new one"),e.innerHTML=""),this.svg=window.d3.select(e).append("svg").attr("width","100%").attr("height","100%").attr("viewBox",`0 0 ${o+140} ${a+(this.showWind?l:0)+c+70}`).attr("preserveAspectRatio","xMidYMid meet");Math.min(o,Math.max(300,90*(t.time.length-1)));let i=48;"8h"===this.meteogramHours?i=8:"12h"===this.meteogramHours?i=12:"24h"===this.meteogramHours?i=24:"48h"===this.meteogramHours?i=48:"54h"===this.meteogramHours?i=54:"max"===this.meteogramHours&&(i=t.time.length);const r=e=>e.slice(0,Math.min(i,e.length)+1),s={time:r(t.time),temperature:r(t.temperature),rain:r(t.rain),rainMin:r(t.rainMin),rainMax:r(t.rainMax),snow:r(t.snow),cloudCover:r(t.cloudCover),windSpeed:r(t.windSpeed),windDirection:r(t.windDirection),symbolCode:r(t.symbolCode),pressure:r(t.pressure)};this.renderMeteogram(this.svg,s,o,a,l,c),this.hasRendered=!0,this.errorCount=0,this.R&&(clearTimeout(this.R),this.R=null),this.N(),this.T(),this.I()}).catch(()=>{this.setError("Weather data not available, retrying in 60 seconds"),this.R&&clearTimeout(this.R),this.R=window.setTimeout(()=>{this.meteogramError="",this.F()},6e4)}).finally(()=>{this.p=!1}))}catch(e){this.setError(`Failed to render chart: ${e.message}`),this.p=!1}}renderMeteogram(e,t,i,r,o=0,a=24){const s=window.d3,{time:n,temperature:d,rain:l,rainMin:c,rainMax:m,snow:u,cloudCover:g,windSpeed:f,windDirection:p,symbolCode:v,pressure:b}=t,w=n.length,_=this.getSystemTemperatureUnit(),x=d.map(e=>this.convertTemperature(e)),y=70,k=70,$=Math.min(i,Math.max(300,90*(w-1))),S=r-o;let M=$/(w-1);const z=s.scaleLinear().domain([0,w-1]).range([0,$]);M=z(1)-z(0);const C=y-30,D=[];for(let e=0;e<w;e++)0!==e&&n[e].getDate()===n[e-1].getDate()||D.push(e);const A=[];for(let e=0;e<D.length;++e){const t=D[e],i=e+1<D.length?D[e+1]:w;A.push({start:t,end:i})}e.selectAll(".day-bg").data(A).enter().append("rect").attr("class","day-bg").attr("x",e=>k+z(e.start)).attr("y",y-42).attr("width",e=>Math.min(z(Math.max(e.end-1,e.start))-z(e.start)+M,$-z(e.start))).attr("height",S+42).attr("opacity",(e,t)=>t%2==0?.16:0),e.selectAll(".top-date-label").data(D).enter().append("text").attr("class","top-date-label").attr("x",(e,t)=>{const i=k+z(e);return t===D.length-1?Math.min(i,k+$-80):i}).attr("y",C).attr("text-anchor","start").attr("opacity",(e,t)=>{if(t===D.length-1)return 1;const i=k+z(e);return k+z(D[t+1])-i<100?0:1}).text(e=>n[e].toLocaleDateString(void 0,{weekday:"short",day:"2-digit",month:"short"})),e.selectAll(".day-tic").data(D).enter().append("line").attr("class","day-tic").attr("x1",e=>k+z(e)).attr("x2",e=>k+z(e)).attr("y1",C+22).attr("y2",C+42).attr("stroke","#1a237e").attr("stroke-width",3).attr("opacity",.6);const L=e.append("g").attr("transform",`translate(${k},${y})`),P=x.filter(e=>null!==e),F=s.scaleLinear().domain([Math.floor(s.min(P)-2),Math.ceil(s.max(P)+2)]).range([S,0]),N=s.scaleLinear().domain([0,Math.max(2,s.max([...m,...l,...u])+1)]).range([S,0]);let T;if(this.showPressure){const e=s.extent(b),t=.1*(e[1]-e[0]);T=s.scaleLinear().domain([5*Math.floor((e[0]-t)/5),5*Math.ceil((e[1]+t)/5)]).range([S,0])}if(L.append("g").attr("class","xgrid").selectAll("line").data(s.range(w)).enter().append("line").attr("x1",e=>z(e)).attr("x2",e=>z(e)).attr("y1",0).attr("y2",S).attr("stroke","currentColor").attr("stroke-width",1),this.showWind){const t=y+S,i=e.append("g").attr("transform",`translate(${k},${t})`),r=o-10,a=[];for(let e=0;e<w;e++)n[e].getHours()%2==0&&a.push(e);i.selectAll(".wind-band-grid").data(a).enter().append("line").attr("class","wind-band-grid").attr("x1",e=>z(e)).attr("x2",e=>z(e)).attr("y1",0).attr("y2",r).attr("stroke","currentColor").attr("stroke-width",1),i.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",$).attr("height",r).attr("stroke","currentColor").attr("stroke-width",2).attr("fill","none")}if(L.selectAll(".twentyfourh-line").data(D.slice(1)).enter().append("line").attr("class","twentyfourh-line").attr("x1",e=>z(e)).attr("x2",e=>z(e)).attr("y1",0).attr("y2",S).attr("stroke","var(--meteogram-grid-color, #b8c4d9)").attr("stroke-width",3).attr("stroke-dasharray","6,5").attr("opacity",.7),this.showCloudCover){const e=.01*S,t=.2*S,i=[];for(let r=0;r<w;r++)i.push([z(r),e+t/2*(1-g[r]/100)]);for(let r=w-1;r>=0;r--)i.push([z(r),e+t/2*(1+g[r]/100)]);L.append("path").attr("class","cloud-area").attr("d",s.line().x(e=>e[0]).y(e=>e[1]).curve(s.curveLinearClosed)(i))}this.showPressure&&T&&(L.append("g").attr("class","pressure-axis").attr("transform",`translate(${$}, 0)`).call(s.axisRight(T).tickFormat(e=>`${e}`)),L.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(${$+50},${S/2}) rotate(90)`).text(h(this.hass,"ui.card.meteogram.attributes.air_pressure","Pressure")+" (hPa)"),L.append("text").attr("class","legend legend-pressure").attr("x",340).attr("y",-45).text(h(this.hass,"ui.card.meteogram.attributes.air_pressure","Pressure")+" (hPa)")),L.append("g").attr("class","temperature-axis").call(window.d3.axisLeft(F).tickFormat(e=>`${e}`)),L.append("g").attr("class","grid").call(window.d3.axisLeft(F).tickSize(-$).tickFormat(()=>"")),L.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(-50,${S/2}) rotate(-90)`).text(h(this.hass,"ui.card.weather.attributes.temperature","Temperature")+` (${_})`),L.append("line").attr("class","line").attr("x1",0).attr("x2",$).attr("y1",0).attr("y2",0).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),L.append("line").attr("class","line").attr("x1",0).attr("x2",$).attr("y1",S).attr("y2",S).attr("stroke","var(--meteogram-grid-color, #e0e0e0)"),L.append("line").attr("class","line").attr("x1",$).attr("x2",$).attr("y1",0).attr("y2",S).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),L.append("line").attr("class","line").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",S).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),this.showCloudCover&&L.append("text").attr("class","legend legend-cloud").attr("x",0).attr("y",-45).text(h(this.hass,"ui.card.meteogram.attributes.cloud_coverage","Cloud Cover")+" (%)"),L.append("text").attr("class","legend legend-temp").attr("x",200).attr("y",-45).text(h(this.hass,"ui.card.meteogram.attributes.temperature","Temperature")+` (${_})`),L.append("text").attr("class","legend legend-rain").attr("x",480).attr("y",-45).text(h(this.hass,"ui.card.meteogram.attributes.precipitation","Rain")+" (mm)"),L.append("text").attr("class","legend legend-snow").attr("x",630).attr("y",-45).text(h(this.hass,"ui.card.meteogram.attributes.snow","Snow")+" (mm)");const I=s.line().defined(e=>null!==e).x((e,t)=>z(t)).y((e,t)=>null!==x[t]?F(x[t]):0);if(L.append("path").datum(x).attr("class","temp-line").attr("d",I).attr("stroke","currentColor"),this.showPressure&&T){const e=s.line().defined(e=>!isNaN(e)).x((e,t)=>z(t)).y(e=>T(e));L.append("path").datum(b).attr("class","pressure-line").attr("d",e).attr("stroke","currentColor")}if(this.showWeatherIcons){const e=this.denseWeatherIcons?1:2;L.selectAll(".weather-icon").data(v).enter().append("foreignObject").attr("class","weather-icon").attr("x",(e,t)=>z(t)-20).attr("y",(e,t)=>{const i=x[t];return null!==i?F(i)-40:-999}).attr("width",40).attr("height",40).attr("opacity",(t,i)=>null!==x[i]&&i%e===0?1:0).each((t,i,r)=>{if(i%e!==0)return;const o=r[i];if(!t)return;const a=t.replace(/^lightssleet/,"lightsleet").replace(/^lightssnow/,"lightsnow");this.getIconSVG(a).then(e=>{if(e){const t=document.createElement("div");t.style.width="40px",t.style.height="40px",t.innerHTML=e,o.appendChild(t)}else console.warn(`Failed to load icon: ${a}`)}).catch(e=>{console.error(`Error loading icon ${a}:`,e)})})}const E=Math.min(26,.8*M);if(this.showRain&&(L.selectAll(".rain-max-bar").data(m.slice(0,w-1)).enter().append("rect").attr("class","rain-max-bar").attr("x",(e,t)=>z(t)+M/2-E/2).attr("y",e=>{const t=S-N(e),i=t<2&&e>0?2:.7*t;return N(0)-i}).attr("width",E).attr("height",e=>{const t=S-N(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor"),L.selectAll(".rain-bar").data(l.slice(0,w-1)).enter().append("rect").attr("class","rain-bar").attr("x",(e,t)=>z(t)+M/2-E/2).attr("y",e=>{const t=S-N(e),i=t<2&&e>0?2:.7*t;return N(0)-i}).attr("width",E).attr("height",e=>{const t=S-N(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor"),L.selectAll(".rain-label").data(l.slice(0,w-1)).enter().append("text").attr("class","rain-label").attr("x",(e,t)=>z(t)+M/2).attr("y",e=>{const t=S-N(e),i=t<2&&e>0?2:.7*t;return N(0)-i-4}).text(e=>e<=0?"":e<1?e.toFixed(1):e.toFixed(0)).attr("opacity",e=>e>0?1:0),L.selectAll(".rain-max-label").data(m.slice(0,w-1)).enter().append("text").attr("class","rain-max-label").attr("x",(e,t)=>z(t)+M/2).attr("y",e=>{const t=S-N(e),i=t<2&&e>0?2:.7*t;return N(0)-i-18}).text((e,t)=>e<=l[t]?"":e<1?e.toFixed(1):e.toFixed(0)).attr("opacity",(e,t)=>e>l[t]?1:0),L.selectAll(".snow-bar").data(u.slice(0,w-1)).enter().append("rect").attr("class","snow-bar").attr("x",(e,t)=>z(t)+M/2-E/2).attr("y",(e,t)=>{const i=S-N(u[t]),r=i<2&&u[t]>0?2:.7*i;return N(0)-r}).attr("width",E).attr("height",e=>{const t=S-N(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor")),this.showWind){const t=y+S,r=e.append("g").attr("transform",`translate(${k},${t})`),a=o-10,d=a/2;r.append("rect").attr("class","wind-band-bg").attr("x",0).attr("y",0).attr("width",$).attr("height",a);const l=[];for(let e=0;e<w;e++)n[e].getHours()%2==0&&l.push(e);r.selectAll(".wind-band-grid").data(l).enter().append("line").attr("class","wind-band-grid").attr("x1",e=>z(e)).attr("x2",e=>z(e)).attr("y1",0).attr("y2",a).attr("stroke","currentColor").attr("stroke-width",1);const c=D.slice(1);r.selectAll(".twentyfourh-line-wind").data(c).enter().append("line").attr("class","twentyfourh-line-wind").attr("x1",e=>z(e)).attr("x2",e=>z(e)).attr("y1",0).attr("y2",a);const h=[];for(let e=0;e<w;e++)n[e].getHours()%2==0&&h.push(e);for(let e=0;e<h.length-1;e++){const t=h[e],o=h[e+1];if(i<400&&e%2!=0)continue;const a=(z(t)+z(o))/2,n=Math.floor((t+o)/2),l=f[n],c=p[n],m=i<400?18:23,u=i<400?30:38,g=s.scaleLinear().domain([0,Math.max(15,s.max(f)||20)]).range([m,u])(l);this.drawWindBarb(r,a,d,l,c,g,i<400?.7:.8)}r.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",$).attr("height",a).attr("stroke","currentColor").attr("stroke-width",1).attr("fill","none")}const W=y+S+o+18;e.selectAll(".bottom-hour-label").data(t.time).enter().append("text").attr("class","bottom-hour-label").attr("x",(e,t)=>k+z(t)).attr("y",W).attr("text-anchor","middle").text((e,t)=>{const r=e.getHours();return i<400?t%6==0?String(r).padStart(2,"0"):"":i>800?t%2==0?String(r).padStart(2,"0"):"":t%3==0?String(r).padStart(2,"0"):""})}drawWindBarb(e,t,i,r,o,a,s=.8){const n=e.append("g").attr("transform",`translate(${t},${i}) rotate(${o}) scale(${s})`),d=-a/2,l=+a/2;if(r<2)return void n.append("circle").attr("class","wind-barb-calm").attr("cx",0).attr("cy",0).attr("r",4);n.append("line").attr("class","wind-barb").attr("x1",0).attr("y1",d).attr("x2",0).attr("y2",l),n.append("circle").attr("class","wind-barb-dot").attr("cx",0).attr("cy",l).attr("r",4);let c=r,h=d,m=Math.floor(c/10);c-=10*m;let u=Math.floor(c/5);c-=5*u;for(let e=0;e<m;e++,h+=7)n.append("line").attr("class","wind-barb-feather").attr("x1",0).attr("y1",h).attr("x2",12).attr("y2",h+3);for(let e=0;e<u;e++,h+=7)n.append("line").attr("class","wind-barb-half").attr("x1",0).attr("y1",h).attr("x2",6).attr("y2",h+2)}render(){var e;this.U();const{html:t}=window.litElementModules;return t`
                <ha-card style="${Object.entries(this.styles||{}).map(([e,t])=>`${e}: ${t};`).join(" ")}">
                    ${this.title?t`
                        <div class="card-header">${this.title}</div>`:""}
                    <div class="card-content">
                        <div class="attribution">
                            ${h(this.hass,"ui.card.meteogram.attribution","Data from")} <a href="https://met.no/" target="_blank" rel="noopener" style="color: inherit;">met.no</a>
                            <span
                                style="margin-left:8px; vertical-align:middle;"
                                title="${null===this.M?h(this.hass,"ui.card.meteogram.status.cached","cached"):!0===this.M?h(this.hass,"ui.card.meteogram.status.success","success"):h(this.hass,"ui.card.meteogram.status.failed","failed")}"
                            >${null===this.M?"❎":!0===this.M?"✅":"❌"}</span>
                        </div>
                        ${this.meteogramError?t`
                                    <div class="error">${h(this.hass,"ui.card.meteogram.error",this.meteogramError)}</div>`:t`
                                    <div id="chart"></div>
                                    ${l?t`
                                        <div id="meteogram-status-panel"
                                             style="margin-top:12px; font-size:0.95em; background:#f5f5f5; border-radius:6px; padding:8px; color:#333;"
                                             xmlns="http://www.w3.org/1999/html">
                                            <b>${h(this.hass,"ui.card.meteogram.status_panel","Status Panel")}</b>
                                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                                                <div>
                                                    <span>${h(this.hass,"ui.card.meteogram.status.expires_at","Expires At")}: ${this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown"}</span><br>
                                                    <span>${h(this.hass,"ui.card.meteogram.status.last_render","Last Render")}: ${this.k||"unknown"}</span><br>
                                                    <span>${h(this.hass,"ui.card.meteogram.status.last_fingerprint_miss","Last Fingerprint Miss")}: ${this.$||"unknown"}</span><br>
                                                    <span>${h(this.hass,"ui.card.meteogram.status.last_data_fetch","Last Data Fetch")}: ${this.S||"unknown"}</span>
                                                </div>
                                                <div>
                                                    <span>${h(this.hass,"ui.card.meteogram.status.last_cached","Last cached")}: ${(null===(e=this.cachedWeatherData)||void 0===e?void 0:e.fetchTimestamp)||"unknown"}</span><br>
                                                    <span
                                                        title="${null===this.M?h(this.hass,"ui.card.meteogram.status.cached","cached"):!0===this.M?h(this.hass,"ui.card.meteogram.status.success","success"):h(this.hass,"ui.card.meteogram.status.failed","failed")}"
                                                    >
                                                        ${h(this.hass,"ui.card.meteogram.status.api_success","API Success")}: ${null===this.M?"❎":!0===this.M?"✅":"❌"}
                                                    </span></br>
                                                    <span>${h(this.hass,"ui.card.meteogram.attributes.temperature","Temperature translated")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    `:""}
                                `}
                    </div>
                </ha-card>
            `}Y(){if(this.errorCount>0&&l){if(console.debug("DOM state check:"),console.debug("- shadowRoot exists:",!!this.shadowRoot),this.shadowRoot){const e=this.shadowRoot.querySelector("#chart");console.debug("- chart div exists:",!!e),e&&console.debug("- chart div size:",e.offsetWidth,"x",e.offsetHeight)}console.debug("- Is connected:",this.isConnected),console.debug("- Has rendered:",this.hasRendered),console.debug("- Chart loaded:",this.chartLoaded)}}setError(e){const t=Date.now();e===this.meteogramError?(this.errorCount++,t-this.lastErrorTime>1e4&&(this.meteogramError=`${e} (occurred ${this.errorCount} times)`,this.lastErrorTime=t)):(this.errorCount=1,this.meteogramError=e,this.lastErrorTime=t,console.error("Meteogram error:",e))}U(){let e=!1;e=this.hass&&this.hass.themes&&"boolean"==typeof this.hass.themes.darkMode?this.hass.themes.darkMode:document.documentElement.classList.contains("dark-theme")||document.body.classList.contains("dark-theme"),e?this.setAttribute("dark",""):this.removeAttribute("dark")}getSystemTemperatureUnit(){if(this.hass&&this.hass.config&&this.hass.config.unit_system&&this.hass.config.unit_system.temperature){const e=this.hass.config.unit_system.temperature;if("°F"===e||"°C"===e)return e;if("F"===e)return"°F";if("C"===e)return"°C"}return"°C"}convertTemperature(e){if(null==e)return e;return"°F"===this.getSystemTemperatureUnit()?9*e/5+32:e}};u.styles=s`
            :host {
                --meteogram-grid-color: #b8c4d9;
                --meteogram-grid-color-dark: #b8c4d9;
                --meteogram-temp-line-color: orange;
                --meteogram-temp-line-color-dark: orange;
                --meteogram-pressure-line-color: #90caf9;
                --meteogram-pressure-line-color-dark: #90caf9;
                --meteogram-rain-bar-color: deepskyblue;
                --meteogram-rain-bar-color-dark: deepskyblue;
                --meteogram-rain-max-bar-color: #7fdbff;
                --meteogram-rain-max-bar-color-dark: #7fdbff;
                --meteogram-rain-label-color: #0058a3;
                --meteogram-rain-label-color-dark: #a3d8ff;
                --meteogram-rain-max-label-color: #2693e6;
                --meteogram-rain-max-label-color-dark: #2693e6;
                --meteogram-cloud-color: #b0bec5;
                --meteogram-cloud-color-dark: #eceff1;
                --meteogram-wind-barb-color: #1976d2;
                --meteogram-wind-barb-color-dark: #1976d2;
                --meteogram-label-font-size: var(--mdc-typography-body2-font-size, 0.875rem);
                --meteogram-legend-font-size: var(--mdc-typography-body1-font-size, 1rem);
                --meteogram-tick-font-size: var(--mdc-typography-body2-font-size, 0.875rem);
                --meteogram-axis-label-color: #000;
                --meteogram-axis-label-color-dark: #fff;
                --meteogram-timescale-color: #ffb300;
                --meteogram-timescale-color-dark: #ffd54f;
                --meteogram-snow-bar-color: #b3e6ff;
                --meteogram-snow-bar-color-dark: #e0f7fa;
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
                stroke: var(--meteogram-temp-line-color);
                stroke-width: 3;
                fill: none;
            }
            :host([dark]) .temp-line {
                stroke: var(--meteogram-temp-line-color-dark);
            }

            .pressure-line {
                stroke: var(--meteogram-pressure-line-color);
                stroke-width: 4;
                stroke-dasharray: 3, 3;
                fill: none;
            }
            :host([dark]) .pressure-line {
                stroke: var(--meteogram-pressure-line-color-dark);
            }

            .rain-bar {
                fill: var(--meteogram-rain-bar-color);
                opacity: 0.8;
            }
            :host([dark]) .rain-bar {
                fill: var(--meteogram-rain-bar-color-dark);
            }

            .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color);
                opacity: 0.5;
            }
            :host([dark]) .rain-max-bar {
                fill: var(--meteogram-rain-max-bar-color-dark);
            }

            .rain-label {
                font: var(--meteogram-label-font-size) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-label-color);
            }
            :host([dark]) .rain-label {
                fill: var(--meteogram-rain-label-color-dark);
                filter: drop-shadow(0 0 2px #fff);
            }

            .rain-max-label {
                font: var(--meteogram-label-font-size) sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: var(--meteogram-rain-max-label-color);
            }
            :host([dark]) .rain-max-label {
                fill: var(--meteogram-rain-max-label-color-dark);
            }

            .legend {
                font: var(--meteogram-legend-font-size) sans-serif;
                fill: var(--primary-text-color, #222);
            }
            :host([dark]) .legend {
                fill: var(--primary-text-color, #fff);
            }

            .legend-temp {
                fill: var(--meteogram-temp-line-color);
            }
            :host([dark]) .legend-temp {
                fill: var(--meteogram-temp-line-color-dark);
            }

            .legend-pressure {
                fill: var(--meteogram-pressure-line-color);
            }
            :host([dark]) .legend-pressure {
                fill: var(--meteogram-pressure-line-color-dark);
            }

            .legend-rain {
                fill: var(--meteogram-rain-bar-color);
            }
            :host([dark]) .legend-rain {
                fill: var(--meteogram-rain-bar-color-dark);
            }

            .legend-rain-max {
                fill: var(--meteogram-rain-max-bar-color);
            }
            :host([dark]) .legend-rain-max {
                fill: var(--meteogram-rain-max-bar-color-dark);
            }

            .legend-snow {
                fill: #b3e6ff;
            }

            .legend-cloud {
                fill: var(--meteogram-cloud-color);
            }
            :host([dark]) .legend-cloud {
                fill: var(--meteogram-cloud-color-dark);
            }

            .wind-barb {
                stroke: var(--meteogram-wind-barb-color);
                stroke-width: 2;
                fill: none;
            }

            .wind-barb-feather {
                stroke: var(--meteogram-wind-barb-color);
                stroke-width: 1.4;
            }

            .wind-barb-half {
                stroke: var(--meteogram-wind-barb-color);
                stroke-width: 0.8;
            }

            .wind-barb-calm {
                stroke: var(--meteogram-wind-barb-color);
                fill: none;
            }

            .wind-barb-dot {
                fill: var(--meteogram-wind-barb-color);
            }

            :host([dark]) .wind-barb,
            :host([dark]) .wind-barb-feather,
            :host([dark]) .wind-barb-half,
            :host([dark]) .wind-barb-calm {
                stroke: var(--meteogram-wind-barb-color-dark);
            }

            :host([dark]) .wind-barb-dot {
                fill: var(--meteogram-wind-barb-color-dark);
            }

            .top-date-label {
                font: var(--meteogram-label-font-size, 16px) sans-serif;
                fill: var(--primary-text-color, #222);
                font-weight: bold;
                dominant-baseline: hanging;
            }

            .bottom-hour-label {
                font: var(--meteogram-label-font-size) sans-serif;
                fill: var(--meteogram-timescale-color);
            }
            :host([dark]) .bottom-hour-label {
                fill: var(--meteogram-timescale-color-dark);
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
                font-size: var(--meteogram-tick-font-size);
                fill: var(--primary-text-color, #222);
            }

            .cloud-area {
                fill: var(--meteogram-cloud-color);
                opacity: 0.42;
            }
            :host([dark]) .cloud-area {
                fill: var(--meteogram-cloud-color-dark);
                opacity: 0.55;
            }

            .axis-label {
                font: var(--meteogram-label-font-size, 14px) sans-serif;
                fill: var(--meteogram-axis-label-color);
            }
            :host([dark]) .axis-label {
                fill: var(--meteogram-axis-label-color-dark);
            }

            .grid line,
            .xgrid line,
            .wind-band-grid,
            .twentyfourh-line,
            .twentyfourh-line-wind,
            .day-tic,
            .temperature-axis path,
            .pressure-axis path,
            .wind-band-outline {
                stroke: var(--meteogram-grid-color);
            }
            :host([dark]) .grid line,
            :host([dark]) .xgrid line,
            :host([dark]) .wind-band-grid,
            :host([dark]) .twentyfourh-line,
            :host([dark]) .twentyfourh-line-wind,
            :host([dark]) .day-tic,
            :host([dark]) .temperature-axis path,
            :host([dark]) .pressure-axis path,
            :host([dark]) .wind-band-outline {
                stroke: var(--meteogram-grid-color-dark);
            }

            /* Tick text font size for axes */
            .temperature-axis .tick text,
            .pressure-axis .tick text {
                font-size: var(--meteogram-tick-font-size);
                fill: var(--primary-text-color, #222);
            }

            .cloud-area {
                fill: var(--meteogram-cloud-color);
                opacity: 0.42;
            }
            :host([dark]) .cloud-area {
                fill: var(--meteogram-cloud-color-dark);
                opacity: 0.55;
            }

            .axis-label {
                font: var(--meteogram-label-font-size, 14px) sans-serif;
                fill: var(--meteogram-axis-label-color);
            }
            :host([dark]) .axis-label {
                fill: var(--meteogram-axis-label-color-dark);
            }

            .grid line {
                stroke: var(--meteogram-grid-color);
            }
            .xgrid line {
                stroke: var(--meteogram-grid-color);
            }
            .wind-band-grid {
                stroke: var(--meteogram-grid-color);
                stroke-width: 1;
            }
            .twentyfourh-line, .day-tic {
                stroke: var(--meteogram-grid-color);
                stroke-width: 3;
                stroke-dasharray: 6, 5;
                opacity: 0.7;
            }
            .twentyfourh-line-wind {
                stroke: var(--meteogram-grid-color);
                stroke-width: 2.5;
                stroke-dasharray: 6, 5;
                opacity: 0.5;
            }
            :host([dark]) .grid line,
            :host([dark]) .xgrid line,
            :host([dark]) .wind-band-grid,
            :host([dark]) .twentyfourh-line,
            :host([dark]) .twentyfourh-line-wind,
            :host([dark]) .day-tic {
                stroke: var(--meteogram-grid-color-dark);
            }

            .temperature-axis path,
            .pressure-axis path {
                stroke: var(--meteogram-grid-color);
            }
            :host([dark]) .temperature-axis path,
            :host([dark]) .pressure-axis path {
                stroke: var(--meteogram-grid-color-dark);
            }

            .wind-band-outline {
                stroke: var(--meteogram-grid-color);
                stroke-width: 2;
                fill: none;
            }
            :host([dark]) .wind-band-outline {
                stroke: var(--meteogram-grid-color-dark);
            }
        `,t([d({type:String})],u.prototype,"title",void 0),t([d({type:Number})],u.prototype,"latitude",void 0),t([d({type:Number})],u.prototype,"longitude",void 0),t([d({attribute:!1})],u.prototype,"hass",void 0),t([d({type:Boolean})],u.prototype,"showCloudCover",void 0),t([d({type:Boolean})],u.prototype,"showPressure",void 0),t([d({type:Boolean})],u.prototype,"showRain",void 0),t([d({type:Boolean})],u.prototype,"showWeatherIcons",void 0),t([d({type:Boolean})],u.prototype,"showWind",void 0),t([d({type:Boolean})],u.prototype,"denseWeatherIcons",void 0),t([d({type:String})],u.prototype,"meteogramHours",void 0),t([d({type:Boolean})],u.prototype,"fillContainer",void 0),t([d({type:Object})],u.prototype,"styles",void 0),t([m()],u.prototype,"chartLoaded",void 0),t([m()],u.prototype,"meteogramError",void 0),t([m()],u.prototype,"errorCount",void 0),t([m()],u.prototype,"lastErrorTime",void 0),t([m()],u.prototype,"_statusExpiresAt",void 0),t([m()],u.prototype,"_statusLastRender",void 0),t([m()],u.prototype,"_statusLastFingerprintMiss",void 0),t([m()],u.prototype,"_statusLastFetch",void 0),t([m()],u.prototype,"_statusApiSuccess",void 0),u=e=t([n("meteogram-card")],u),window.customElements.get("meteogram-card")||customElements.define("meteogram-card",u);let g=class extends HTMLElement{constructor(){super(...arguments),this.X={},this.ee=!1,this.te=new Map}set hass(e){this.ie=e}get hass(){return this.ie}setConfig(e){this.X=e||{},this.ee?this.re():this.oe()}get config(){return this.X}connectedCallback(){this.ee||this.oe()}oe(){this.render(),this.ee=!0,setTimeout(()=>this.re(),0)}re(){var e,t,i,r;if(!this.ee)return;const o=(e,t,i="value")=>{e&&e[i]!==t&&(e[i]=t)};o(this.te.get("title"),this.X.title||""),o(this.te.get("latitude"),void 0!==this.X.latitude?String(this.X.latitude):void 0!==(null===(t=null===(e=this.ie)||void 0===e?void 0:e.config)||void 0===t?void 0:t.latitude)?String(this.ie.config.latitude):""),o(this.te.get("longitude"),void 0!==this.X.longitude?String(this.X.longitude):void 0!==(null===(r=null===(i=this.ie)||void 0===i?void 0:i.config)||void 0===r?void 0:r.longitude)?String(this.ie.config.longitude):""),o(this.te.get("show_cloud_cover"),void 0===this.X.show_cloud_cover||this.X.show_cloud_cover,"checked"),o(this.te.get("show_pressure"),void 0===this.X.show_pressure||this.X.show_pressure,"checked"),o(this.te.get("show_rain"),void 0===this.X.show_rain||this.X.show_rain,"checked"),o(this.te.get("show_weather_icons"),void 0===this.X.show_weather_icons||this.X.show_weather_icons,"checked"),o(this.te.get("show_wind"),void 0===this.X.show_wind||this.X.show_wind,"checked"),o(this.te.get("dense_weather_icons"),void 0===this.X.dense_weather_icons||this.X.dense_weather_icons,"checked"),o(this.te.get("meteogram_hours"),this.X.meteogram_hours||"48h"),o(this.te.get("fill_container"),void 0!==this.X.fill_container&&this.X.fill_container,"checked")}render(){var e,t,i,r,o,a,s;const n=this.hass,d=this.X;if(!n||!d)return this.innerHTML='<ha-card><div style="padding:16px;">Loading Home Assistant context...</div></ha-card>',void setTimeout(()=>this.render(),300);const l=null!==(t=null===(e=null==n?void 0:n.config)||void 0===e?void 0:e.latitude)&&void 0!==t?t:"",c=null!==(r=null===(i=null==n?void 0:n.config)||void 0===i?void 0:i.longitude)&&void 0!==r?r:"",m=void 0===this.X.show_cloud_cover||this.X.show_cloud_cover,u=void 0===this.X.show_pressure||this.X.show_pressure,g=void 0===this.X.show_rain||this.X.show_rain,f=void 0===this.X.show_weather_icons||this.X.show_weather_icons,p=void 0===this.X.show_wind||this.X.show_wind,v=void 0===this.X.dense_weather_icons||this.X.dense_weather_icons,b=this.X.meteogram_hours||"48h",w=void 0!==this.X.fill_container&&this.X.fill_container,_=document.createElement("div");_.innerHTML=`\n  <style>\n    ha-card {\n      padding: 16px;\n    }\n    .values {\n      padding-left: 16px;\n      margin: 8px 0;\n    }\n    .row {\n      display: flex;\n      margin-bottom: 12px;\n      align-items: center;\n    }\n    ha-textfield {\n      width: 100%;\n    }\n    .side-by-side {\n      display: flex;\n      gap: 12px;\n    }\n    .side-by-side > * {\n      flex: 1;\n    }\n    h3 {\n      font-size: 18px;\n      color: var(--primary-text-color);\n      font-weight: 500;\n      margin-bottom: 12px;\n      margin-top: 0;\n    }\n    .help-text {\n      color: var(--secondary-text-color);\n      font-size: 0.875rem;\n      margin-top: 4px;\n    }\n    .info-text {\n      color: var(--primary-text-color);\n      opacity: 0.8;\n      font-size: 0.9rem;\n      font-style: italic;\n      margin: 4px 0 16px 0;\n    }\n    .toggle-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 8px;\n    }\n    .toggle-label {\n      flex-grow: 1;\n    }\n    .toggle-section {\n      margin-top: 16px;\n      border-top: 1px solid var(--divider-color);\n      padding-top: 16px;\n    }\n  </style>\n  <ha-card>\n    <h3>${(null===(o=this.ie)||void 0===o?void 0:o.localize)?this.ie.localize("ui.editor.meteogram.title"):"Meteogram Card Settings"}</h3>\n    <div class="values">\n      <div class="row">\n        <ha-textfield\n          label="${(null===(a=this.ie)||void 0===a?void 0:a.localize)?this.ie.localize("ui.editor.meteogram.title_label"):"Title"}"\n          id="title-input"\n          .value="${this.X.title||""}"\n        ></ha-textfield>\n      </div>\n\n      <p class="info-text">\n        ${(null===(s=this.ie)||void 0===s?void 0:s.localize)?this.ie.localize("ui.editor.meteogram.location_info"):"Location coordinates will be used to fetch weather data directly from Met.no API."}\n        ${l?h(this.ie,"ui.editor.meteogram.using_ha_location","Using Home Assistant's location by default."):""}\n      </p>\n\n      <div class="side-by-side">\n        <ha-textfield\n          label="${h(this.ie,"ui.editor.meteogram.latitude","Latitude")}"\n          id="latitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this.X.latitude?this.X.latitude:l}"\n          placeholder="${l?`${h(this.ie,"ui.editor.meteogram.default","Default")}: ${l}`:""}"\n        ></ha-textfield>\n\n        <ha-textfield\n          label="${h(this.ie,"ui.editor.meteogram.longitude","Longitude")}"\n          id="longitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this.X.longitude?this.X.longitude:c}"\n          placeholder="${c?`${h(this.ie,"ui.editor.meteogram.default","Default")}: ${c}`:""}"\n        ></ha-textfield>\n      </div>\n      <p class="help-text">${h(this.ie,"ui.editor.meteogram.leave_empty","Leave empty to use Home Assistant's configured location")}</p>\n\n      <div class="toggle-section">\n        <h3>${h(this.ie,"ui.editor.meteogram.display_options","Display Options")}</h3>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.cloud_coverage","Show Cloud Cover")}</div>\n          <ha-switch\n            id="show-cloud-cover"\n            .checked="${m}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.air_pressure","Show Pressure")}</div>\n          <ha-switch\n            id="show-pressure"\n            .checked="${u}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.precipitation","Show Rain")}</div>\n          <ha-switch\n            id="show-rain"\n            .checked="${g}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.weather_icons","Show Weather Icons")}</div>\n          <ha-switch\n            id="show-weather-icons"\n            .checked="${f}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.wind","Show Wind")}</div>\n          <ha-switch\n            id="show-wind"\n            .checked="${p}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.dense_icons","Dense Weather Icons (every hour)")}</div>\n          <ha-switch\n            id="dense-weather-icons"\n            .checked="${v}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${h(this.ie,"ui.editor.meteogram.attributes.fill_container","Fill Container")}</div>\n          <ha-switch\n            id="fill-container"\n            .checked="${w}"\n          ></ha-switch>\n        </div>\n      </div>\n\n      <div class="row">\n        <label for="meteogram-hours-select" style="margin-right:8px;">${h(this.ie,"ui.editor.meteogram.meteogram_length","Meteogram Length")}</label>\n        <select id="meteogram-hours-select">\n          <option value="8h" ${"8h"===b?"selected":""}>${h(this.ie,"ui.editor.meteogram.hours_8","8 hours")}</option>\n          <option value="12h" ${"12h"===b?"selected":""}>${h(this.ie,"ui.editor.meteogram.hours_12","12 hours")}</option>\n          <option value="24h" ${"24h"===b?"selected":""}>${h(this.ie,"ui.editor.meteogram.hours_24","24 hours")}</option>\n          <option value="48h" ${"48h"===b?"selected":""}>${h(this.ie,"ui.editor.meteogram.hours_48","48 hours")}</option>\n          <option value="54h" ${"54h"===b?"selected":""}>${h(this.ie,"ui.editor.meteogram.hours_54","54 hours")}</option>\n          <option value="max" ${"max"===b?"selected":""}>${h(this.ie,"ui.editor.meteogram.hours_max","Max available")}</option>\n        </select>\n      </div>\n      <p class="help-text">${h(this.ie,"ui.editor.meteogram.choose_hours","Choose how many hours to show in the meteogram")}</p>\n    </div>\n  </ha-card>\n`,this.innerHTML="",this.appendChild(_),setTimeout(()=>{const e=this.querySelector("#title-input");e&&(e.configValue="title",e.addEventListener("input",this.ae.bind(this)),this.te.set("title",e));const t=this.querySelector("#latitude-input");t&&(t.configValue="latitude",t.addEventListener("input",this.ae.bind(this)),this.te.set("latitude",t));const i=this.querySelector("#longitude-input");i&&(i.configValue="longitude",i.addEventListener("input",this.ae.bind(this)),this.te.set("longitude",i));const r=this.querySelector("#show-cloud-cover");r&&(r.configValue="show_cloud_cover",r.addEventListener("change",this.ae.bind(this)),this.te.set("show_cloud_cover",r));const o=this.querySelector("#show-pressure");o&&(o.configValue="show_pressure",o.addEventListener("change",this.ae.bind(this)),this.te.set("show_pressure",o));const a=this.querySelector("#show-rain");a&&(a.configValue="show_rain",a.addEventListener("change",this.ae.bind(this)),this.te.set("show_rain",a));const s=this.querySelector("#show-weather-icons");s&&(s.configValue="show_weather_icons",s.addEventListener("change",this.ae.bind(this)),this.te.set("show_weather_icons",s));const n=this.querySelector("#show-wind");n&&(n.configValue="show_wind",n.addEventListener("change",this.ae.bind(this)),this.te.set("show_wind",n));const d=this.querySelector("#dense-weather-icons");d&&(d.configValue="dense_weather_icons",d.addEventListener("change",this.ae.bind(this)),this.te.set("dense_weather_icons",d));const l=this.querySelector("#meteogram-hours-select");l&&(l.configValue="meteogram_hours",l.addEventListener("change",this.ae.bind(this)),this.te.set("meteogram_hours",l));const c=this.querySelector("#fill-container");c&&(c.configValue="fill_container",c.addEventListener("change",this.ae.bind(this)),this.te.set("fill_container",c)),this.re()},0)}ae(e){const t=e.target;if(!this.X||!t||!t.configValue)return;let i=t.value||"";if("HA-SWITCH"===t.tagName)i=t.checked;else if("number"===t.type)if(""===i)i=void 0;else{const e=parseFloat(i.toString());isNaN(e)||(i=e)}else""===i&&(i=void 0);this.X={...this.X,[t.configValue]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.X}}))}};g=t([n("meteogram-card-editor")],g),window.customCards=window.customCards||[],window.customCards.push({type:"meteogram-card",name:c,description:"A custom card showing a meteogram with wind barbs.",version:i,preview:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/images/meteogram-card.png",documentationURL:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/README.md"})};window.litElementModules?m():void 0!==e?e.then(()=>{m()}):console.error("Lit modules not found and litModulesPromise not available");
