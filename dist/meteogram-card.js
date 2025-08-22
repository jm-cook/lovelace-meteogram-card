const e=Promise.all([import("https://unpkg.com/lit@3.1.0/index.js?module"),import("https://unpkg.com/lit@3.1.0/decorators.js?module")]).then(([e,t])=>{window.litElementModules={LitElement:e.LitElement,html:e.html,css:e.css,customElement:t.customElement,property:t.property,state:t.state}});function t(e,t,r,a){var i,o=arguments.length,s=o<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,r):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,a);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(s=(o<3?i(s):o>3?i(t,r,s):i(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s}"function"==typeof SuppressedError&&SuppressedError;var r="2.1.1-0";var a={"ui.card.meteogram.attribution":"Data from","ui.card.meteogram.status.cached":"cached","ui.card.meteogram.status.success":"success","ui.card.meteogram.status.failed":"failed","ui.card.meteogram.status_panel":"Status Panel","ui.card.meteogram.status.expires_at":"Expires At","ui.card.meteogram.status.last_render":"Last Render","ui.card.meteogram.status.last_fingerprint_miss":"Last Fingerprint Miss","ui.card.meteogram.status.last_data_fetch":"Last Data Fetch","ui.card.meteogram.status.last_cached":"Last cached","ui.card.meteogram.status.api_success":"API Success","ui.card.meteogram.error":"Weather data not available","ui.card.meteogram.attributes.temperature":"Temperature","ui.card.meteogram.attributes.air_pressure":"Pressure","ui.card.meteogram.attributes.precipitation":"Rain","ui.card.meteogram.attributes.snow":"Snow","ui.card.meteogram.attributes.cloud_coverage":"Cloud Cover","ui.card.meteogram.attributes.weather_icons":"Show Weather Icons","ui.card.meteogram.attributes.wind":"Show Wind","ui.card.meteogram.attributes.dense_icons":"Dense Weather Icons (every hour)","ui.card.meteogram.attributes.fill_container":"Fill Container","ui.editor.meteogram.title":"Meteogram Card Settings","ui.editor.meteogram.title_label":"Title","ui.editor.meteogram.location_info":"Location coordinates will be used to fetch weather data directly from Met.no API.","ui.editor.meteogram.using_ha_location":"Using Home Assistant's location by default.","ui.editor.meteogram.latitude":"Latitude","ui.editor.meteogram.longitude":"Longitude","ui.editor.meteogram.default":"Default","ui.editor.meteogram.leave_empty":"Leave empty to use Home Assistant's configured location","ui.editor.meteogram.display_options":"Display Options","ui.editor.meteogram.meteogram_length":"Meteogram Length","ui.editor.meteogram.hours_8":"8 hours","ui.editor.meteogram.hours_12":"12 hours","ui.editor.meteogram.hours_24":"24 hours","ui.editor.meteogram.hours_48":"48 hours","ui.editor.meteogram.hours_54":"54 hours","ui.editor.meteogram.hours_max":"Max available","ui.editor.meteogram.choose_hours":"Choose how many hours to show in the meteogram","ui.editor.meteogram.attributes.cloud_coverage":"Show Cloud Cover","ui.editor.meteogram.attributes.air_pressure":"Show Pressure","ui.editor.meteogram.attributes.precipitation":"Show Rain","ui.editor.meteogram.attributes.weather_icons":"Show Weather Icons","ui.editor.meteogram.attributes.wind":"Show Wind","ui.editor.meteogram.attributes.dense_icons":"Dense Weather Icons (every hour)","ui.editor.meteogram.attributes.fill_container":"Fill Container"},i={"ui.card.meteogram.attribution":"Data fra","ui.card.meteogram.status.cached":"bufret","ui.card.meteogram.status.success":"suksess","ui.card.meteogram.status.failed":"feilet","ui.card.meteogram.status_panel":"Statuspanel","ui.card.meteogram.status.expires_at":"Utløper","ui.card.meteogram.status.last_render":"Sist tegnet","ui.card.meteogram.status.last_fingerprint_miss":"Siste fingerprint-miss","ui.card.meteogram.status.last_data_fetch":"Siste datainnhenting","ui.card.meteogram.status.last_cached":"Sist bufret","ui.card.meteogram.status.api_success":"API-suksess","ui.card.meteogram.error":"Værdata ikke tilgjengelig","ui.card.meteogram.attributes.temperature":"Temperatur","ui.card.meteogram.attributes.air_pressure":"Lufttrykk","ui.card.meteogram.attributes.precipitation":"Regn","ui.card.meteogram.attributes.snow":"Snø","ui.card.meteogram.attributes.cloud_coverage":"Skydekke","ui.card.meteogram.attributes.weather_icons":"Vis værikoner","ui.card.meteogram.attributes.wind":"Vis vind","ui.card.meteogram.attributes.dense_icons":"Tette værikoner (hver time)","ui.card.meteogram.attributes.fill_container":"Fyll beholder","ui.editor.meteogram.title":"Meteogram-kortinnstillinger","ui.editor.meteogram.title_label":"Tittel","ui.editor.meteogram.location_info":"Lokasjonskoordinater brukes for å hente værdata direkte fra Met.no API.","ui.editor.meteogram.using_ha_location":"Bruker Home Assistants lokasjon som standard.","ui.editor.meteogram.latitude":"Breddegrad","ui.editor.meteogram.longitude":"Lengdegrad","ui.editor.meteogram.default":"Standard","ui.editor.meteogram.leave_empty":"La stå tomt for å bruke Home Assistants konfigurerte lokasjon","ui.editor.meteogram.display_options":"Visningsvalg","ui.editor.meteogram.meteogram_length":"Meteogramlengde","ui.editor.meteogram.hours_8":"8 timer","ui.editor.meteogram.hours_12":"12 timer","ui.editor.meteogram.hours_24":"24 timer","ui.editor.meteogram.hours_48":"48 timer","ui.editor.meteogram.hours_54":"54 timer","ui.editor.meteogram.hours_max":"Maks tilgjengelig","ui.editor.meteogram.choose_hours":"Velg hvor mange timer som skal vises i meteogrammet","ui.editor.meteogram.attributes.cloud_coverage":"Vis skydekke","ui.editor.meteogram.attributes.air_pressure":"Vis lufttrykk","ui.editor.meteogram.attributes.precipitation":"Vis regn","ui.editor.meteogram.attributes.weather_icons":"Vis værikoner","ui.editor.meteogram.attributes.wind":"Vis vind","ui.editor.meteogram.attributes.dense_icons":"Tette værikoner (hver time)","ui.editor.meteogram.attributes.fill_container":"Fyll beholder"},o={"ui.card.meteogram.attribution":"Datos de","ui.card.meteogram.status.cached":"en caché","ui.card.meteogram.status.success":"éxito","ui.card.meteogram.status.failed":"fallido","ui.card.meteogram.status_panel":"Panel de estado","ui.card.meteogram.status.expires_at":"Expira en","ui.card.meteogram.status.last_render":"Última representación","ui.card.meteogram.status.last_fingerprint_miss":"Última huella fallida","ui.card.meteogram.status.last_data_fetch":"Última obtención de datos","ui.card.meteogram.status.last_cached":"Último en caché","ui.card.meteogram.status.api_success":"Éxito de la API","ui.card.meteogram.error":"Datos meteorológicos no disponibles","ui.card.meteogram.attributes.temperature":"Temperatura","ui.card.meteogram.attributes.air_pressure":"Presión","ui.card.meteogram.attributes.precipitation":"Lluvia","ui.card.meteogram.attributes.snow":"Nieve","ui.card.meteogram.attributes.cloud_coverage":"Cobertura de nubes","ui.card.meteogram.attributes.weather_icons":"Mostrar iconos meteorológicos","ui.card.meteogram.attributes.wind":"Mostrar viento","ui.card.meteogram.attributes.dense_icons":"Iconos meteorológicos densos (cada hora)","ui.card.meteogram.attributes.fill_container":"Rellenar el contenedor","ui.editor.meteogram.title":"Configuración de la tarjeta Meteograma","ui.editor.meteogram.title_label":"Título","ui.editor.meteogram.location_info":"Las coordenadas se utilizarán para obtener datos meteorológicos directamente de la API de Met.no.","ui.editor.meteogram.using_ha_location":"Usando la ubicación de Home Assistant por defecto.","ui.editor.meteogram.latitude":"Latitud","ui.editor.meteogram.longitude":"Longitud","ui.editor.meteogram.default":"Predeterminado","ui.editor.meteogram.leave_empty":"Dejar vacío para usar la ubicación configurada en Home Assistant","ui.editor.meteogram.display_options":"Opciones de visualización","ui.editor.meteogram.meteogram_length":"Duración del meteograma","ui.editor.meteogram.hours_8":"8 horas","ui.editor.meteogram.hours_12":"12 horas","ui.editor.meteogram.hours_24":"24 horas","ui.editor.meteogram.hours_48":"48 horas","ui.editor.meteogram.hours_54":"54 horas","ui.editor.meteogram.hours_max":"Máximo disponible","ui.editor.meteogram.choose_hours":"Elija cuántas horas mostrar en el meteograma","ui.editor.meteogram.attributes.cloud_coverage":"Mostrar cobertura de nubes","ui.editor.meteogram.attributes.air_pressure":"Mostrar presión","ui.editor.meteogram.attributes.precipitation":"Mostrar lluvia","ui.editor.meteogram.attributes.weather_icons":"Mostrar iconos meteorológicos","ui.editor.meteogram.attributes.wind":"Mostrar viento","ui.editor.meteogram.attributes.dense_icons":"Iconos meteorológicos densos (cada hora)","ui.editor.meteogram.attributes.fill_container":"Rellenar el contenedor"},s={"ui.card.meteogram.attribution":"Dati da","ui.card.meteogram.status.cached":"memorizzato","ui.card.meteogram.status.success":"successo","ui.card.meteogram.status.failed":"fallito","ui.card.meteogram.status_panel":"Pannello di stato","ui.card.meteogram.status.expires_at":"Scade il","ui.card.meteogram.status.last_render":"Ultima visualizzazione","ui.card.meteogram.status.last_fingerprint_miss":"Ultima impronta mancante","ui.card.meteogram.status.last_data_fetch":"Ultimo recupero dati","ui.card.meteogram.status.last_cached":"Ultimo memorizzato","ui.card.meteogram.status.api_success":"Successo API","ui.card.meteogram.error":"Dati meteorologici non disponibili","ui.card.meteogram.attributes.temperature":"Temperatura","ui.card.meteogram.attributes.air_pressure":"Pressione","ui.card.meteogram.attributes.precipitation":"Pioggia","ui.card.meteogram.attributes.snow":"Neve","ui.card.meteogram.attributes.cloud_coverage":"Copertura nuvolosa","ui.card.meteogram.attributes.weather_icons":"Mostra icone meteo","ui.card.meteogram.attributes.wind":"Mostra vento","ui.card.meteogram.attributes.dense_icons":"Icone meteo dense (ogni ora)","ui.card.meteogram.attributes.fill_container":"Riempi contenitore","ui.editor.meteogram.title":"Impostazioni della scheda Meteogramma","ui.editor.meteogram.title_label":"Titolo","ui.editor.meteogram.location_info":"Le coordinate verranno utilizzate per ottenere i dati meteorologici direttamente dall'API Met.no.","ui.editor.meteogram.using_ha_location":"Utilizzo della posizione di Home Assistant come predefinita.","ui.editor.meteogram.latitude":"Latitudine","ui.editor.meteogram.longitude":"Longitudine","ui.editor.meteogram.default":"Predefinito","ui.editor.meteogram.leave_empty":"Lascia vuoto per usare la posizione configurata in Home Assistant","ui.editor.meteogram.display_options":"Opzioni di visualizzazione","ui.editor.meteogram.meteogram_length":"Durata meteogramma","ui.editor.meteogram.hours_8":"8 ore","ui.editor.meteogram.hours_12":"12 ore","ui.editor.meteogram.hours_24":"24 ore","ui.editor.meteogram.hours_48":"48 ore","ui.editor.meteogram.hours_54":"54 ore","ui.editor.meteogram.hours_max":"Massimo disponibile","ui.editor.meteogram.choose_hours":"Scegli quante ore mostrare nel meteogramma","ui.editor.meteogram.attributes.cloud_coverage":"Mostra copertura nuvolosa","ui.editor.meteogram.attributes.air_pressure":"Mostra pressione","ui.editor.meteogram.attributes.precipitation":"Mostra pioggia","ui.editor.meteogram.attributes.weather_icons":"Mostra icone meteo","ui.editor.meteogram.attributes.wind":"Mostra vento","ui.editor.meteogram.attributes.dense_icons":"Icone meteo dense (ogni ora)","ui.editor.meteogram.attributes.fill_container":"Riempi contenitore"},n={"ui.card.meteogram.attribution":"Daten von","ui.card.meteogram.status.cached":"zwischengespeichert","ui.card.meteogram.status.success":"Erfolg","ui.card.meteogram.status.failed":"Fehler","ui.card.meteogram.status_panel":"Statuspanel","ui.card.meteogram.status.expires_at":"Ablaufdatum","ui.card.meteogram.status.last_render":"Letzte Darstellung","ui.card.meteogram.status.last_fingerprint_miss":"Letzter Fingerabdruck-Fehler","ui.card.meteogram.status.last_data_fetch":"Letzter Datenabruf","ui.card.meteogram.status.last_cached":"Zuletzt zwischengespeichert","ui.card.meteogram.status.api_success":"API-Erfolg","ui.card.meteogram.error":"Wetterdaten nicht verfügbar","ui.card.meteogram.attributes.temperature":"Temperatur","ui.card.meteogram.attributes.air_pressure":"Luftdruck","ui.card.meteogram.attributes.precipitation":"Regen","ui.card.meteogram.attributes.snow":"Schnee","ui.card.meteogram.attributes.cloud_coverage":"Wolkenbedeckung","ui.card.meteogram.attributes.weather_icons":"Wetter-Symbole anzeigen","ui.card.meteogram.attributes.wind":"Wind anzeigen","ui.card.meteogram.attributes.dense_icons":"Dichte Wettersymbole (jede Stunde)","ui.card.meteogram.attributes.fill_container":"Container ausfüllen","ui.editor.meteogram.title":"Meteogramm-Karteneinstellungen","ui.editor.meteogram.title_label":"Titel","ui.editor.meteogram.location_info":"Die Koordinaten werden verwendet, um Wetterdaten direkt von der Met.no API abzurufen.","ui.editor.meteogram.using_ha_location":"Standardmäßig wird der Standort von Home Assistant verwendet.","ui.editor.meteogram.latitude":"Breitengrad","ui.editor.meteogram.longitude":"Längengrad","ui.editor.meteogram.default":"Standard","ui.editor.meteogram.leave_empty":"Leer lassen, um die konfigurierte Position von Home Assistant zu verwenden","ui.editor.meteogram.display_options":"Anzeigeoptionen","ui.editor.meteogram.meteogram_length":"Meteogramm-Länge","ui.editor.meteogram.hours_8":"8 Stunden","ui.editor.meteogram.hours_12":"12 Stunden","ui.editor.meteogram.hours_24":"24 Stunden","ui.editor.meteogram.hours_48":"48 Stunden","ui.editor.meteogram.hours_54":"54 Stunden","ui.editor.meteogram.hours_max":"Maximal verfügbar","ui.editor.meteogram.choose_hours":"Wählen Sie, wie viele Stunden im Meteogramm angezeigt werden sollen","ui.editor.meteogram.attributes.cloud_coverage":"Wolkenbedeckung anzeigen","ui.editor.meteogram.attributes.air_pressure":"Luftdruck anzeigen","ui.editor.meteogram.attributes.precipitation":"Regen anzeigen","ui.editor.meteogram.attributes.weather_icons":"Wetter-Symbole anzeigen","ui.editor.meteogram.attributes.wind":"Wind anzeigen","ui.editor.meteogram.attributes.dense_icons":"Dichte Wettersymbole (jede Stunde)","ui.editor.meteogram.attributes.fill_container":"Container ausfüllen"},d={"ui.card.meteogram.attribution":"Données de","ui.card.meteogram.status.cached":"mis en cache","ui.card.meteogram.status.success":"succès","ui.card.meteogram.status.failed":"échec","ui.card.meteogram.status_panel":"Panneau d'état","ui.card.meteogram.status.expires_at":"Expire à","ui.card.meteogram.status.last_render":"Dernier rendu","ui.card.meteogram.status.last_fingerprint_miss":"Dernière empreinte manquée","ui.card.meteogram.status.last_data_fetch":"Dernière récupération de données","ui.card.meteogram.status.last_cached":"Dernière mise en cache","ui.card.meteogram.status.api_success":"Succès API","ui.card.meteogram.error":"Données météo non disponibles","ui.card.meteogram.attributes.temperature":"Température","ui.card.meteogram.attributes.air_pressure":"Pression","ui.card.meteogram.attributes.precipitation":"Pluie","ui.card.meteogram.attributes.snow":"Neige","ui.card.meteogram.attributes.cloud_coverage":"Couverture nuageuse","ui.card.meteogram.attributes.weather_icons":"Afficher les icônes météo","ui.card.meteogram.attributes.wind":"Afficher le vent","ui.card.meteogram.attributes.dense_icons":"Icônes météo denses (chaque heure)","ui.card.meteogram.attributes.fill_container":"Remplir le conteneur","ui.editor.meteogram.title":"Paramètres de la carte Météogramme","ui.editor.meteogram.title_label":"Titre","ui.editor.meteogram.location_info":"Les coordonnées seront utilisées pour obtenir les données météo directement depuis l'API Met.no.","ui.editor.meteogram.using_ha_location":"Utilisation de la localisation Home Assistant par défaut.","ui.editor.meteogram.latitude":"Latitude","ui.editor.meteogram.longitude":"Longitude","ui.editor.meteogram.default":"Défaut","ui.editor.meteogram.leave_empty":"Laisser vide pour utiliser la localisation configurée dans Home Assistant","ui.editor.meteogram.display_options":"Options d'affichage","ui.editor.meteogram.meteogram_length":"Durée du météogramme","ui.editor.meteogram.hours_8":"8 heures","ui.editor.meteogram.hours_12":"12 heures","ui.editor.meteogram.hours_24":"24 heures","ui.editor.meteogram.hours_48":"48 heures","ui.editor.meteogram.hours_54":"54 heures","ui.editor.meteogram.hours_max":"Maximum disponible","ui.editor.meteogram.choose_hours":"Choisissez combien d'heures afficher dans le météogramme","ui.editor.meteogram.attributes.cloud_coverage":"Afficher la couverture nuageuse","ui.editor.meteogram.attributes.air_pressure":"Afficher la pression","ui.editor.meteogram.attributes.precipitation":"Afficher la pluie","ui.editor.meteogram.attributes.weather_icons":"Afficher les icônes météo","ui.editor.meteogram.attributes.wind":"Afficher le vent","ui.editor.meteogram.attributes.dense_icons":"Icônes météo denses (chaque heure)","ui.editor.meteogram.attributes.fill_container":"Remplir le conteneur"};let l=!1;const c=r.includes("beta"),h="Meteogram Card",u=new Date;let m=0,g=0;function p(e,t,r){var l;if(e&&"function"==typeof e.localize){const r=e.localize(t);if(r&&r!==t)return r}if(e&&e.resources&&"object"==typeof e.resources){const r=e.language||"en",a=null===(l=e.resources[r])||void 0===l?void 0:l[t];if(a)return a}const c=e&&e.language?e.language:"en";let h;return h=c.startsWith("nb")?i[t]:c.startsWith("es")?o[t]:c.startsWith("it")?s[t]:c.startsWith("de")?n[t]:c.startsWith("fr")?d[t]:a[t],h||(void 0!==r?r:t)}const f=()=>{var e;console.info(`%c☀️ ${h} ${r} ⚡️🌦️`,"color: #1976d2; font-weight: bold; background: white"),l=c;const{LitElement:o,css:s,customElement:n,property:d,state:f}=window.litElementModules;let _=e=class extends o{constructor(){super(...arguments),this.title="",this.showCloudCover=!0,this.showPressure=!0,this.showRain=!0,this.showWeatherIcons=!0,this.showWind=!0,this.denseWeatherIcons=!0,this.meteogramHours="48h",this.fillContainer=!1,this.styles={},this.diagnostics=c,this.chartLoaded=!1,this.meteogramError="",this.errorCount=0,this.lastErrorTime=0,this.iconCache=new Map,this.iconBasePath="https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/",this.hasRendered=!1,this.svg=null,this._resizeObserver=null,this._lastWidth=0,this._lastHeight=0,this._intersectionObserver=null,this._mutationObserver=null,this._isInitialized=!1,this._lastRenderedData=null,this._chartRenderInProgress=!1,this.apiExpiresAt=null,this.apiLastModified=null,this.cachedWeatherData=null,this.weatherDataPromise=null,this._redrawScheduled=!1,this._statusExpiresAt="",this._statusLastRender="",this._statusLastFingerprintMiss="",this._statusLastFetch="",this._statusApiSuccess=null,this._onVisibilityChange=()=>{!document.hidden&&this.isConnected&&this._handleVisibilityChange()},this._onLocationChanged=()=>{setTimeout(()=>{this.isConnected&&this._isElementVisible()&&this._handleVisibilityChange()},100)},this.trnslt=(e,t)=>{var r;if(this.hass&&"function"==typeof this.hass.localize){const t=this.hass.localize(e);if(t&&t!==e)return t}if(this.hass&&this.hass.resources&&"object"==typeof this.hass.resources){const t=this.hass.language||"en",a=null===(r=this.hass.resources[t])||void 0===r?void 0:r[e];if(a)return a}let o;return o=(this.hass&&this.hass.language?this.hass.language:"en").startsWith("nb")?i[e]:a[e],o||(void 0!==t?t:e)}}async getIconSVG(e){if(this.iconCache.has(e))return this.iconCache.get(e);try{const t=`${this.iconBasePath}${e}.svg`,r=await fetch(t);if(!r.ok)return console.warn(`Failed to load icon: ${e}, status: ${r.status}`),"";const a=await r.text();return!a.includes("<svg")||a.length<20?(console.warn(`Invalid SVG content for ${e}`),""):(this.iconCache.set(e,a),a)}catch(t){return console.error(`Error loading icon ${e}:`,t),""}}_scheduleDrawMeteogram(){this._redrawScheduled||(this._redrawScheduled=!0,setTimeout(()=>{this._drawMeteogram(),this._redrawScheduled=!1},50))}setConfig(e){const t=void 0!==e.latitude?parseFloat(Number(e.latitude).toFixed(4)):void 0,r=void 0!==e.longitude?parseFloat(Number(e.longitude).toFixed(4)):void 0;void 0!==this.latitude&&parseFloat(Number(this.latitude).toFixed(4)),void 0!==this.longitude&&parseFloat(Number(this.longitude).toFixed(4)),e.title&&(this.title=e.title),void 0!==e.latitude&&(this.latitude=t),void 0!==e.longitude&&(this.longitude=r),this.showCloudCover=void 0===e.show_cloud_cover||e.show_cloud_cover,this.showPressure=void 0===e.show_pressure||e.show_pressure,this.showRain=void 0===e.show_rain||e.show_rain,this.showWeatherIcons=void 0===e.show_weather_icons||e.show_weather_icons,this.showWind=void 0===e.show_wind||e.show_wind,this.denseWeatherIcons=void 0===e.dense_weather_icons||e.dense_weather_icons,this.meteogramHours=e.meteogram_hours||"48h",this.fillContainer=void 0!==e.fill_container&&e.fill_container,this.styles=e.styles||{},this.diagnostics=void 0!==e.diagnostics?e.diagnostics:c,l=this.diagnostics}static getConfigElement(){const e=document.createElement("meteogram-card-editor");return e.setConfig({show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1,diagnostics:c}),e}static getStubConfig(){return{title:"Weather Forecast",show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1,diagnostics:c}}getCardSize(){return 3}connectedCallback(){super.connectedCallback(),this._isInitialized=!1,this.updateComplete.then(()=>{this._setupResizeObserver(),this._setupVisibilityObserver(),this._setupMutationObserver(),document.addEventListener("visibilitychange",this._onVisibilityChange.bind(this)),window.addEventListener("location-changed",this._onLocationChanged.bind(this)),this.isConnected&&(this.hasRendered&&this.chartLoaded?this._scheduleDrawMeteogram():this.loadD3AndDraw())})}disconnectedCallback(){this._teardownResizeObserver(),this._teardownVisibilityObserver(),this._teardownMutationObserver(),document.removeEventListener("visibilitychange",this._onVisibilityChange.bind(this)),window.removeEventListener("location-changed",this._onLocationChanged.bind(this)),this.cleanupChart(),this._weatherRetryTimeout&&(clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=null),this._weatherRefreshTimeout&&(clearTimeout(this._weatherRefreshTimeout),this._weatherRefreshTimeout=null),super.disconnectedCallback()}_isElementVisible(){if(!this.isConnected||!this.shadowRoot)return!1;if(document.hidden)return!1;const e=this.shadowRoot.host;if(!e)return!1;if(0===e.offsetWidth&&0===e.offsetHeight)return!1;const t=window.getComputedStyle(e);if("none"===t.display)return!1;if("hidden"===t.visibility)return!1;const r=e.getBoundingClientRect();return!(r.top+r.height<=0||r.left+r.width<=0||r.bottom>=window.innerHeight||r.right>=window.innerWidth)}_setupVisibilityObserver(){var e;this._intersectionObserver||(this._intersectionObserver=new IntersectionObserver(e=>{for(const t of e)if(t.isIntersecting){this._handleVisibilityChange();break}},{threshold:[.1]}),(null===(e=this.shadowRoot)||void 0===e?void 0:e.host)&&this._intersectionObserver.observe(this.shadowRoot.host))}_teardownVisibilityObserver(){this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null)}_setupMutationObserver(){var e;if(!this._mutationObserver){this._mutationObserver=new MutationObserver(e=>{for(const t of e){if(t.target instanceof HTMLElement&&("HA-TAB"===t.target.tagName||"HA-TABS"===t.target.tagName||t.target.classList.contains("content")||t.target.hasAttribute("active")))break;if("attributes"===t.type&&("style"===t.attributeName||"class"===t.attributeName||"hidden"===t.attributeName||"active"===t.attributeName))break}}),document.querySelectorAll("ha-tabs, ha-tab, ha-tab-container").forEach(e=>{e&&this._mutationObserver.observe(e,{attributes:!0,childList:!0,subtree:!0})});const t=(null===(e=this.shadowRoot)||void 0===e?void 0:e.host)||null;if(t instanceof HTMLElement){let e=t;for(;e&&e.parentElement;)this._mutationObserver.observe(e.parentElement,{attributes:!0,attributeFilter:["style","class","hidden","active"],childList:!1,subtree:!1}),e=e.parentElement}const r=document.querySelector("home-assistant, ha-panel-lovelace");r&&this._mutationObserver.observe(r,{childList:!0,subtree:!0})}}_teardownMutationObserver(){this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null)}_handleVisibilityChange(){var e;if(this._isElementVisible()){const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");!(this.hasRendered&&this.svg&&t&&""!==t.innerHTML&&0!==t.clientWidth&&t.querySelector("svg"))&&this.chartLoaded&&(this.hasRendered=!1,this.cleanupChart(),this.requestUpdate(),this.updateComplete.then(()=>this._scheduleDrawMeteogram()))}}_setupResizeObserver(){this._resizeObserver||(this._resizeObserver=new ResizeObserver(this._onResize.bind(this))),setTimeout(()=>{var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");t&&this._resizeObserver&&this._resizeObserver.observe(t)},100)}_onResize(e){if(0===e.length)return;const t=e[0];(Math.abs(t.contentRect.width-this._lastWidth)>.05*this._lastWidth||Math.abs(t.contentRect.height-this._lastHeight)>.1*this._lastHeight)&&(this._lastWidth=t.contentRect.width,this._lastHeight=t.contentRect.height,this._scheduleDrawMeteogram())}_teardownResizeObserver(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null)}firstUpdated(e){setTimeout(()=>{this.loadD3AndDraw()},50),this.hasRendered=!1,this._updateDarkMode()}updated(e){var t,r;const a=e.has("latitude")||e.has("longitude")||e.has("hass")||e.has("showCloudCover")||e.has("showPressure")||e.has("showRain")||e.has("showWeatherIcons")||e.has("showWind")||e.has("denseWeatherIcons")||e.has("meteogramHours")||e.has("fillContainer")||!this.hasRendered;if(this.chartLoaded&&a){this._checkAndUpdateLocation();const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart"),r=!e||""===e.innerHTML||!e.querySelector("svg");this.hasRendered&&!r||this._scheduleDrawMeteogram()}if(!this._isInitialized&&this.shadowRoot&&(this._isInitialized=!0,this.chartLoaded)){const e=null===(r=this.shadowRoot)||void 0===r?void 0:r.querySelector("#chart");e&&""===e.innerHTML&&this._scheduleDrawMeteogram()}this._updateDarkMode()}static encodeCacheKey(e,t){const r=String(e)+String(t);return btoa(r)}getLocationKey(t,r){return e.encodeCacheKey(Number(t.toFixed(4)),Number(r.toFixed(4)))}_saveLocationToStorage(e,t){try{if(void 0!==e&&void 0!==t){const r=localStorage.getItem("meteogram-card-weather-cache");let a={};if(r)try{a=JSON.parse(r)}catch{a={}}a["default-location"]={latitude:parseFloat(e.toFixed(4)),longitude:parseFloat(t.toFixed(4))},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(a))}}catch(e){console.debug("Failed to save location to localStorage:",e)}}_saveDefaultLocationToStorage(e,t){try{const r=localStorage.getItem("meteogram-card-weather-cache");let a={};if(r)try{a=JSON.parse(r)}catch{a={}}a["default-location"]={latitude:parseFloat(e.toFixed(4)),longitude:parseFloat(t.toFixed(4))},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(a))}catch(e){console.debug("Failed to save default location to localStorage:",e)}}_loadLocationFromStorage(){try{const e=localStorage.getItem("meteogram-card-weather-cache");if(e){let t={};try{t=JSON.parse(e)}catch{t={}}if(t["default-location"]){const e=parseFloat(Number(t["default-location"].latitude).toFixed(4)),r=parseFloat(Number(t["default-location"].longitude).toFixed(4));if(!isNaN(e)&&!isNaN(r))return{latitude:e,longitude:r}}}return null}catch(e){return console.debug("Failed to load location from localStorage:",e),null}}_loadDefaultLocationFromStorage(){try{const e=localStorage.getItem("meteogram-card-weather-cache");if(e){let t={};try{t=JSON.parse(e)}catch{t={}}if(t["default-location"]){const e=parseFloat(Number(t["default-location"].latitude).toFixed(4)),r=parseFloat(Number(t["default-location"].longitude).toFixed(4));if(!isNaN(e)&&!isNaN(r))return{latitude:e,longitude:r}}}return null}catch(e){return console.debug("Failed to load default location from localStorage:",e),null}}_checkAndUpdateLocation(){if(void 0!==this.latitude&&void 0!==this.longitude)return this.latitude=parseFloat(Number(this.latitude).toFixed(4)),void(this.longitude=parseFloat(Number(this.longitude).toFixed(4)));if(this.hass&&(void 0===this.latitude||void 0===this.longitude)){const e=this.hass.config||{};if(void 0!==e.latitude&&void 0!==e.longitude){const t=parseFloat(Number(e.latitude).toFixed(4)),r=parseFloat(Number(e.longitude).toFixed(4)),a=this._loadDefaultLocationFromStorage();return a&&a.latitude===t&&a.longitude===r||this._saveDefaultLocationToStorage(t,r),this.latitude=t,this.longitude=r,void console.debug(`Using HA location: ${this.latitude}, ${this.longitude}`)}}if(void 0===this.latitude||void 0===this.longitude){const e=this._loadDefaultLocationFromStorage();e?(this.latitude=e.latitude,this.longitude=e.longitude,console.debug(`Using cached default-location: ${this.latitude}, ${this.longitude}`)):(this.latitude=51.5074,this.longitude=-.1278,console.debug(`Using default location: ${this.latitude}, ${this.longitude}`))}}async loadD3AndDraw(){if(window.d3)return this.chartLoaded=!0,void this._scheduleDrawMeteogram();try{const e=document.createElement("script");e.src="https://d3js.org/d3.v7.min.js",e.async=!0;const t=new Promise((t,r)=>{e.onload=()=>{this.chartLoaded=!0,t()},e.onerror=()=>{r(new Error("Failed to load D3.js library"))}});if(document.head.appendChild(e),await t,!window.d3)throw new Error("D3.js not available after loading script");await this._scheduleDrawMeteogram()}catch(e){console.error("Error loading D3.js:",e),this.setError("Failed to load D3.js visualization library. Please refresh the page.")}}saveCacheToStorage(e,t){try{if(this.cachedWeatherData&&this.apiExpiresAt){const r=this.getLocationKey(e,t);let a={};const i=localStorage.getItem("meteogram-card-weather-cache");if(i)try{a=JSON.parse(i)}catch{a={}}a["forecast-data"]||(a["forecast-data"]={}),a["forecast-data"][r]={expiresAt:this.apiExpiresAt,lastModified:this.apiLastModified||void 0,data:this.cachedWeatherData},localStorage.setItem("meteogram-card-weather-cache",JSON.stringify(a))}}catch(e){}}loadCacheFromStorage(e,t){var r;try{const a=this.getLocationKey(e,t),i=localStorage.getItem("meteogram-card-weather-cache");if(i){let o={};try{o=JSON.parse(i)}catch{o={}}const s=null===(r=o["forecast-data"])||void 0===r?void 0:r[a];l&&console.log(`[meteogram-card] Attempting to load cache for (lat: ${e}, lon: ${t}), key: ${a}, entry:`,s),s&&s.expiresAt&&s.data?(this.apiExpiresAt=s.expiresAt,this.apiLastModified=s.lastModified||null,Array.isArray(s.data.time)&&(s.data.time=s.data.time.map(e=>"string"==typeof e?new Date(e):e)),this.cachedWeatherData=s.data):(l&&console.log(`[meteogram-card] No cache entry found for key: ${a}`),this.apiExpiresAt=null,this.apiLastModified=null,this.cachedWeatherData=null)}}catch(e){console.debug("Failed to load cache from localStorage:",e)}}async fetchWeatherData(){const e=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,t=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;l&&console.log(`[meteogram-card] fetchWeatherData called with lat=${e}, lon=${t}`),void 0!==e&&void 0!==t&&this.loadCacheFromStorage(e,t);const a=this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown",i=void 0!==e?e.toFixed(4):void 0,o=void 0!==t?t.toFixed(4):void 0;if(l&&console.log(`[meteogram-card] fetchWeatherData called at ${(new Date).toISOString()} with lat=${i}, lon=${o} (expires at ${a})`),!e||!t){this._checkAndUpdateLocation();const e=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,t=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;if(!e||!t)throw new Error("Could not determine location. Please check your card configuration or Home Assistant settings.")}if(this.apiExpiresAt&&Date.now()<this.apiExpiresAt&&this.cachedWeatherData){this._weatherRefreshTimeout&&(clearTimeout(this._weatherRefreshTimeout),this._weatherRefreshTimeout=null);const e=this.apiExpiresAt+6e4-Date.now();return e>0&&(this._weatherRefreshTimeout=window.setTimeout(()=>{this._weatherRefreshTimeout=null,this.fetchWeatherData().then(e=>{JSON.stringify(e)!==JSON.stringify(this.cachedWeatherData)&&(this.cachedWeatherData=e,this._scheduleDrawMeteogram())}).catch(()=>{this._scheduleDrawMeteogram()})},e)),l&&console.log(`[meteogram-card] Returning cached weather data (expires at ${a}), will refresh in ${Math.round(e/1e3)}s`),Promise.resolve(this.cachedWeatherData)}return this.weatherDataPromise?(l&&console.log(`[meteogram-card] Returning in-flight weather data promise (expires at ${a})`),this.weatherDataPromise):(this.weatherDataPromise=(async()=>{let a={};try{this._statusLastFetch=(new Date).toISOString();const r=`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${e}&lon=${t}`,a={};a.Origin=window.location.origin,l&&console.log("[meteogram-card] Fetch headers:",a);const i=await fetch(r,{headers:a});m++;const o=i.status;if(429===o){const e=i.headers.get("Expires");let t=null;if(e){const r=new Date(e);isNaN(r.getTime())||(t=r.getTime(),this.apiExpiresAt=t)}const r=t?new Date(t).toLocaleTimeString():"later";throw console.warn(`Weather API throttling (429). Next attempt allowed after ${r}.`),new Error(`Weather API throttling: Too many requests. Please wait until ${r} before retrying.`)}const s=i.headers.get("Expires");if(s){const e=new Date(s);isNaN(e.getTime())||(this.apiExpiresAt=e.getTime(),this._statusExpiresAt=e.toISOString(),l&&console.log(`[meteogram-card] API response Expires at ${e.toISOString()}`))}const n=i.headers.get("Last-Modified");if(n&&(this.apiLastModified=n,l&&console.log(`[meteogram-card] API response Last-Modified: ${n}`)),304===o){if(l&&console.log("[meteogram-card] API returned 304 Not Modified, using cached data."),this.cachedWeatherData)return this.cachedWeatherData;throw new Error("API returned 304 but no cached data is available.")}if(this._statusApiSuccess=null,this._statusApiSuccess=i.ok,i.ok&&(this._lastApiSuccess=!0,g++),!i.ok){const e=await i.text();if(console.error("Weather API fetch failed:",{url:r,status:i.status,statusText:i.statusText,body:e}),0===i.status)throw new Error("Weather API request failed (status 0). This may be a network or CORS issue. See browser console for details.");const t=["<b>API Error</b>",`Status: <code>${i.status} ${i.statusText}</code>`,`API URL: <code>${r}</code>`,`Origin header: <code>${a.Origin}</code>`,`Error message: <pre>${e}</pre>`].join("<br>");throw this.setError(t),new Error(`Weather API returned ${i.status}: ${i.statusText}\n${e}`)}const d=await i.json();if(!d||!d.properties||!d.properties.timeseries||0===d.properties.timeseries.length)throw new Error("Invalid data format received from API");const c=d.properties.timeseries.filter(e=>0===new Date(e.time).getMinutes()),h={time:[],temperature:[],rain:[],rainMin:[],rainMax:[],snow:[],cloudCover:[],windSpeed:[],windDirection:[],symbolCode:[],pressure:[]};h.fetchTimestamp=(new Date).toISOString(),c.forEach(e=>{var t,r,a;const i=new Date(e.time),o=e.data.instant.details,s=null===(t=e.data.next_1_hours)||void 0===t?void 0:t.details;if(h.time.push(i),h.temperature.push(o.air_temperature),h.cloudCover.push(o.cloud_area_fraction),h.windSpeed.push(o.wind_speed),h.windDirection.push(o.wind_from_direction),h.pressure.push(o.air_pressure_at_sea_level),s){const t=void 0!==s.precipitation_amount_max?s.precipitation_amount_max:void 0!==s.precipitation_amount?s.precipitation_amount:0,i=void 0!==s.precipitation_amount_min?s.precipitation_amount_min:void 0!==s.precipitation_amount?s.precipitation_amount:0;h.rainMin.push(i),h.rainMax.push(t),h.rain.push(void 0!==s.precipitation_amount?s.precipitation_amount:0),h.snow.push(0),(null===(a=null===(r=e.data.next_1_hours)||void 0===r?void 0:r.summary)||void 0===a?void 0:a.symbol_code)?h.symbolCode.push(e.data.next_1_hours.summary.symbol_code):h.symbolCode.push("")}else h.rain.push(0),h.rainMin.push(0),h.rainMax.push(0),h.snow.push(0),h.symbolCode.push("")}),this.cachedWeatherData=h,void 0!==e&&void 0!==t&&this.saveCacheToStorage(e,t);let u=48;return"8h"===this.meteogramHours?u=8:"12h"===this.meteogramHours?u=12:"24h"===this.meteogramHours?u=24:"48h"===this.meteogramHours?u=48:"54h"===this.meteogramHours?u=54:"max"===this.meteogramHours&&(u=h.time.length),u<h.time.length&&Object.keys(h).forEach(e=>{h[e]=h[e].slice(0,u)}),this._scheduleDrawMeteogram(),h}catch(e){if(this._statusApiSuccess=!1,this.cachedWeatherData)return console.warn("Error fetching weather data, using cached data (may be expired):",e),this._weatherRetryTimeout&&clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=window.setTimeout(()=>{this.meteogramError="",this.fetchWeatherData().then(e=>{JSON.stringify(e)!==JSON.stringify(this.cachedWeatherData)&&(this.cachedWeatherData=e,this._scheduleDrawMeteogram())}).catch(()=>{this._scheduleDrawMeteogram()})},6e4),this.cachedWeatherData;let t="<br><b>API Error</b><br>";throw e instanceof Error?t+=`Error: <code>${e.message}</code><br>`:t+=`Error: <code>${String(e)}</code><br>`,t+="Status: <code>0</code><br>",t+="API URL: <code></code><br>",t+=`Origin header: <code>${a.Origin}</code><br>`,t+=`Card version: <code>${r}</code><br>`,t+=`Client type: <code>${navigator.userAgent}</code><br>`,this.setError(t),new Error(`<br>Failed to get weather data: ${e.message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${t}`)}finally{this.weatherDataPromise=null}})(),this.weatherDataPromise)}cleanupChart(){try{if(this.svg&&"function"==typeof this.svg.remove&&(this.svg.remove(),this.svg=null),this.shadowRoot){const e=this.shadowRoot.querySelector("#chart");e&&(e.innerHTML="")}}catch(e){console.warn("Error cleaning up chart:",e)}}async _drawMeteogram(){var t,r,a;this._statusLastRender=(new Date).toISOString();const i=Date.now();if(this.meteogramError&&i-this.lastErrorTime<6e4)return void this.errorCount++;if(this.meteogramError="",this._checkAndUpdateLocation(),!this.latitude||!this.longitude)return void this.setError("Location not available. Please check your card configuration or Home Assistant settings.");let o=null;try{o=await this.fetchWeatherData()}catch(e){return void(e instanceof Error?this.setError(e.message):this.setError("Weather data not available."))}const s=`${this.latitude},${this.longitude},${this.showCloudCover},${this.showPressure},${this.showWeatherIcons},${this.showWind},${this.meteogramHours},${this.fillContainer},${JSON.stringify(o)}}`;if(this._lastRenderedData===s&&this.svg&&this.chartLoaded){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart");if(e&&e.querySelector("svg"))return}this._statusLastFingerprintMiss=(new Date).toISOString(),this._lastRenderedData=s,await this.updateComplete,this._logDomState();if(e.lastD3RetryTime||(e.lastD3RetryTime=0),!window.d3)try{return void await this.loadD3AndDraw()}catch(t){const r=Date.now();if(r-e.lastD3RetryTime<1e4)return;return e.lastD3RetryTime=r,void this.setError("D3.js library could not be loaded. Please refresh the page.")}this.cleanupChart(),await new Promise(e=>setTimeout(e,10));const n=null===(r=this.shadowRoot)||void 0===r?void 0:r.querySelector("#chart");if(n)this._renderChart(n);else if(console.error("Chart container not found in DOM"),this.isConnected){this.requestUpdate(),await this.updateComplete,await new Promise(e=>setTimeout(e,50));const e=null===(a=this.shadowRoot)||void 0===a?void 0:a.querySelector("#chart");if(!e){if(console.error("Chart container still not found after retry"),this.shadowRoot){const e=this.shadowRoot.querySelector(".card-content");if(e&&this.isConnected){e.innerHTML='<div id="chart"></div>';const t=this.shadowRoot.querySelector("#chart");if(t)return void this._renderChart(t)}}return}this._renderChart(e)}}_renderChart(e){if(this._chartRenderInProgress){l&&console.log("[meteogram-card] Chart render already in progress, skipping redundant render.");return void(e.querySelector("svg")||(l&&console.log("[meteogram-card] No SVG found, clearing render-in-progress flag to recover."),this._chartRenderInProgress=!1))}this._chartRenderInProgress=!0,setTimeout(()=>{this._chartRenderInProgress&&(l&&console.log("[meteogram-card] Clearing chart render flag after timeout."),this._chartRenderInProgress=!1)},1e3);try{const t=e.querySelector("svg"),r=e.offsetWidth>0&&e.offsetHeight>0;if(t&&r&&this.hasRendered)return void(this._chartRenderInProgress=!1);const a=e.parentElement;let i,o,s=a?a.clientWidth:e.offsetWidth||350,n=a?a.clientHeight:e.offsetHeight||180;const d=Math.min(.7*window.innerHeight,520);if(this.fillContainer)i=e.offsetWidth>0?e.offsetWidth:s,o=e.offsetHeight>0?e.offsetHeight:n;else{const e=Math.min(.95*window.innerWidth,1200);i=Math.max(Math.min(s,e),300);const t=.5*i;o=Math.min(t,n,d)}const l=this.showWind?55:0,c=24;Math.min(o,n,d);this._lastWidth=s,this._lastHeight=n,t&&this._lastWidth===s&&this._lastHeight===n?this._chartRenderInProgress=!1:(e.innerHTML="",this.fetchWeatherData().then(t=>{e.querySelector("svg")&&(console.debug("SVG already exists, removing before creating new one"),e.innerHTML=""),this.svg=window.d3.select(e).append("svg").attr("width","100%").attr("height","100%").attr("viewBox",`0 0 ${i+140} ${o+(this.showWind?l:0)+c+70}`).attr("preserveAspectRatio","xMidYMid meet");Math.min(i,Math.max(300,90*(t.time.length-1)));let r=48;"8h"===this.meteogramHours?r=8:"12h"===this.meteogramHours?r=12:"24h"===this.meteogramHours?r=24:"48h"===this.meteogramHours?r=48:"54h"===this.meteogramHours?r=54:"max"===this.meteogramHours&&(r=t.time.length);const a=e=>e.slice(0,Math.min(r,e.length)+1),s={time:a(t.time),temperature:a(t.temperature),rain:a(t.rain),rainMin:a(t.rainMin),rainMax:a(t.rainMax),snow:a(t.snow),cloudCover:a(t.cloudCover),windSpeed:a(t.windSpeed),windDirection:a(t.windDirection),symbolCode:a(t.symbolCode),pressure:a(t.pressure)};this.renderMeteogram(this.svg,s,i,o,l,c),this.hasRendered=!0,this.errorCount=0,this._weatherRetryTimeout&&(clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=null),this._setupResizeObserver(),this._setupVisibilityObserver(),this._setupMutationObserver()}).catch(()=>{this.setError("Weather data not available, retrying in 60 seconds"),this._weatherRetryTimeout&&clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=window.setTimeout(()=>{this.meteogramError="",this._drawMeteogram()},6e4)}).finally(()=>{this._chartRenderInProgress=!1}))}catch(e){this.setError(`Failed to render chart: ${e.message}`),this._chartRenderInProgress=!1}}getHaLocale(){return this.hass&&this.hass.language?this.hass.language:"en"}renderMeteogram(e,t,r,a,i=0,o=24){const s=window.d3,{time:n,temperature:d,rain:l,rainMin:c,rainMax:h,snow:u,cloudCover:m,windSpeed:g,windDirection:f,symbolCode:_,pressure:w}=t,b=n.length,v=this.getSystemTemperatureUnit(),y=d.map(e=>this.convertTemperature(e)),x=70,k=70,S=Math.min(r,Math.max(300,90*(b-1))),C=a-i;let $=S/(b-1);const M=s.scaleLinear().domain([0,b-1]).range([0,S]);$=M(1)-M(0);const L=x-30,D=[];for(let e=0;e<b;e++)0!==e&&n[e].getDate()===n[e-1].getDate()||D.push(e);const A=[];for(let e=0;e<D.length;++e){const t=D[e],r=e+1<D.length?D[e+1]:b;A.push({start:t,end:r})}e.selectAll(".day-bg").data(A).enter().append("rect").attr("class","day-bg").attr("x",e=>k+M(e.start)).attr("y",x-42).attr("width",e=>Math.min(M(Math.max(e.end-1,e.start))-M(e.start)+$,S-M(e.start))).attr("height",C+42).attr("opacity",(e,t)=>t%2==0?.16:0),e.selectAll(".top-date-label").data(D).enter().append("text").attr("class","top-date-label").attr("x",(e,t)=>{const r=k+M(e);return t===D.length-1?Math.min(r,k+S-80):r}).attr("y",L).attr("text-anchor","start").attr("opacity",(e,t)=>{if(t===D.length-1)return 1;const r=k+M(e);return k+M(D[t+1])-r<100?0:1}).text(e=>{const t=n[e],r=this.getHaLocale();return t.toLocaleDateString(r,{weekday:"short",day:"2-digit",month:"short"})}),e.selectAll(".day-tic").data(D).enter().append("line").attr("class","day-tic").attr("x1",e=>k+M(e)).attr("x2",e=>k+M(e)).attr("y1",L+22).attr("y2",L+42).attr("stroke","#1a237e").attr("stroke-width",3).attr("opacity",.6);const E=e.append("g").attr("transform",`translate(${k},${x})`),R=y.filter(e=>null!==e),z=s.scaleLinear().domain([Math.floor(s.min(R)-2),Math.ceil(s.max(R)+2)]).range([C,0]),T=s.scaleLinear().domain([0,Math.max(2,s.max([...h,...l,...u])+1)]).range([C,0]);let F;if(this.showPressure){const e=s.extent(w),t=.1*(e[1]-e[0]);F=s.scaleLinear().domain([5*Math.floor((e[0]-t)/5),5*Math.ceil((e[1]+t)/5)]).range([C,0])}if(E.append("g").attr("class","xgrid").selectAll("line").data(s.range(b)).enter().append("line").attr("x1",e=>M(e)).attr("x2",e=>M(e)).attr("y1",0).attr("y2",C).attr("stroke","currentColor").attr("stroke-width",1),this.showWind){const t=x+C,r=e.append("g").attr("transform",`translate(${k},${t})`),a=i-10,o=[];for(let e=0;e<b;e++)n[e].getHours()%2==0&&o.push(e);r.selectAll(".wind-band-grid").data(o).enter().append("line").attr("class","wind-band-grid").attr("x1",e=>M(e)).attr("x2",e=>M(e)).attr("y1",0).attr("y2",a).attr("stroke","currentColor").attr("stroke-width",1),r.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",S).attr("height",a).attr("stroke","currentColor").attr("stroke-width",2).attr("fill","none")}if(E.selectAll(".twentyfourh-line").data(D.slice(1)).enter().append("line").attr("class","twentyfourh-line").attr("x1",e=>M(e)).attr("x2",e=>M(e)).attr("y1",0).attr("y2",C).attr("stroke","var(--meteogram-grid-color, #b8c4d9)").attr("stroke-width",3).attr("stroke-dasharray","6,5").attr("opacity",.7),this.showCloudCover){const e=.01*C,t=.2*C,r=[];for(let a=0;a<b;a++)r.push([M(a),e+t/2*(1-m[a]/100)]);for(let a=b-1;a>=0;a--)r.push([M(a),e+t/2*(1+m[a]/100)]);E.append("path").attr("class","cloud-area").attr("d",s.line().x(e=>e[0]).y(e=>e[1]).curve(s.curveLinearClosed)(r))}this.showPressure&&F&&(E.append("g").attr("class","pressure-axis").attr("transform",`translate(${S}, 0)`).call(s.axisRight(F).tickFormat(e=>`${e}`)),E.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(${S+50},${C/2}) rotate(90)`).text(p(this.hass,"ui.card.meteogram.attributes.air_pressure","Pressure")+" (hPa)"),E.append("text").attr("class","legend legend-pressure").attr("x",340).attr("y",-45).text(p(this.hass,"ui.card.meteogram.attributes.air_pressure","Pressure")+" (hPa)")),E.append("g").attr("class","temperature-axis").call(window.d3.axisLeft(z).tickFormat(e=>`${e}`)),E.append("g").attr("class","grid").call(window.d3.axisLeft(z).tickSize(-S).tickFormat(()=>"")),E.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(-50,${C/2}) rotate(-90)`).text(p(this.hass,"ui.card.weather.attributes.temperature","Temperature")+` (${v})`),E.append("line").attr("class","line").attr("x1",0).attr("x2",S).attr("y1",0).attr("y2",0).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),E.append("line").attr("class","line").attr("x1",0).attr("x2",S).attr("y1",C).attr("y2",C).attr("stroke","var(--meteogram-grid-color, #e0e0e0)"),E.append("line").attr("class","line").attr("x1",S).attr("x2",S).attr("y1",0).attr("y2",C).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),E.append("line").attr("class","line").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",C).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),this.showCloudCover&&E.append("text").attr("class","legend legend-cloud").attr("x",0).attr("y",-45).text(p(this.hass,"ui.card.meteogram.attributes.cloud_coverage","Cloud Cover")+" (%)"),E.append("text").attr("class","legend legend-temp").attr("x",200).attr("y",-45).text(p(this.hass,"ui.card.meteogram.attributes.temperature","Temperature")+` (${v})`),E.append("text").attr("class","legend legend-rain").attr("x",480).attr("y",-45).text(p(this.hass,"ui.card.meteogram.attributes.precipitation","Rain")+" (mm)"),E.append("text").attr("class","legend legend-snow").attr("x",630).attr("y",-45).text(p(this.hass,"ui.card.meteogram.attributes.snow","Snow")+" (mm)");const W=s.line().defined(e=>null!==e).x((e,t)=>M(t)).y((e,t)=>null!==y[t]?z(y[t]):0);if(E.append("path").datum(y).attr("class","temp-line").attr("d",W).attr("stroke","currentColor"),this.showPressure&&F){const e=s.line().defined(e=>!isNaN(e)).x((e,t)=>M(t)).y(e=>F(e));E.append("path").datum(w).attr("class","pressure-line").attr("d",e).attr("stroke","currentColor")}if(this.showWeatherIcons){const e=this.denseWeatherIcons?1:2;E.selectAll(".weather-icon").data(_).enter().append("foreignObject").attr("class","weather-icon").attr("x",(e,t)=>M(t)-20).attr("y",(e,t)=>{const r=y[t];return null!==r?z(r)-40:-999}).attr("width",40).attr("height",40).attr("opacity",(t,r)=>null!==y[r]&&r%e===0?1:0).each((t,r,a)=>{if(r%e!==0)return;const i=a[r];if(!t)return;const o=t.replace(/^lightssleet/,"lightsleet").replace(/^lightssnow/,"lightsnow");this.getIconSVG(o).then(e=>{if(e){const t=document.createElement("div");t.style.width="40px",t.style.height="40px",t.innerHTML=e,i.appendChild(t)}else console.warn(`Failed to load icon: ${o}`)}).catch(e=>{console.error(`Error loading icon ${o}:`,e)})})}const I=Math.min(26,.8*$);if(this.showRain&&(E.selectAll(".rain-max-bar").data(h.slice(0,b-1)).enter().append("rect").attr("class","rain-max-bar").attr("x",(e,t)=>M(t)+$/2-I/2).attr("y",e=>{const t=C-T(e),r=t<2&&e>0?2:.7*t;return T(0)-r}).attr("width",I).attr("height",e=>{const t=C-T(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor"),E.selectAll(".rain-bar").data(l.slice(0,b-1)).enter().append("rect").attr("class","rain-bar").attr("x",(e,t)=>M(t)+$/2-I/2).attr("y",e=>{const t=C-T(e),r=t<2&&e>0?2:.7*t;return T(0)-r}).attr("width",I).attr("height",e=>{const t=C-T(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor"),E.selectAll(".rain-label").data(l.slice(0,b-1)).enter().append("text").attr("class","rain-label").attr("x",(e,t)=>M(t)+$/2).attr("y",e=>{const t=C-T(e),r=t<2&&e>0?2:.7*t;return T(0)-r-4}).text(e=>e<=0?"":e<1?e.toFixed(1):e.toFixed(0)).attr("opacity",e=>e>0?1:0),E.selectAll(".rain-max-label").data(h.slice(0,b-1)).enter().append("text").attr("class","rain-max-label").attr("x",(e,t)=>M(t)+$/2).attr("y",e=>{const t=C-T(e),r=t<2&&e>0?2:.7*t;return T(0)-r-18}).text((e,t)=>e<=l[t]?"":e<1?e.toFixed(1):e.toFixed(0)).attr("opacity",(e,t)=>e>l[t]?1:0),E.selectAll(".snow-bar").data(u.slice(0,b-1)).enter().append("rect").attr("class","snow-bar").attr("x",(e,t)=>M(t)+$/2-I/2).attr("y",(e,t)=>{const r=C-T(u[t]),a=r<2&&u[t]>0?2:.7*r;return T(0)-a}).attr("width",I).attr("height",e=>{const t=C-T(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor")),this.showWind){const t=x+C,a=e.append("g").attr("transform",`translate(${k},${t})`),o=i-10,d=o/2;a.append("rect").attr("class","wind-band-bg").attr("x",0).attr("y",0).attr("width",S).attr("height",o);const l=[];for(let e=0;e<b;e++)n[e].getHours()%2==0&&l.push(e);a.selectAll(".wind-band-grid").data(l).enter().append("line").attr("class","wind-band-grid").attr("x1",e=>M(e)).attr("x2",e=>M(e)).attr("y1",0).attr("y2",o).attr("stroke","currentColor").attr("stroke-width",1);const c=D.slice(1);a.selectAll(".twentyfourh-line-wind").data(c).enter().append("line").attr("class","twentyfourh-line-wind").attr("x1",e=>M(e)).attr("x2",e=>M(e)).attr("y1",0).attr("y2",o);const h=[];for(let e=0;e<b;e++)n[e].getHours()%2==0&&h.push(e);for(let e=0;e<h.length-1;e++){const t=h[e],i=h[e+1];if(r<400&&e%2!=0)continue;const o=(M(t)+M(i))/2,n=Math.floor((t+i)/2),l=g[n],c=f[n],u=r<400?18:23,m=r<400?30:38,p=s.scaleLinear().domain([0,Math.max(15,s.max(g)||20)]).range([u,m])(l);this.drawWindBarb(a,o,d,l,c,p,r<400?.7:.8)}a.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",S).attr("height",o).attr("stroke","currentColor").attr("stroke-width",1).attr("fill","none")}const P=x+C+i+18;e.selectAll(".bottom-hour-label").data(t.time).enter().append("text").attr("class","bottom-hour-label").attr("x",(e,t)=>k+M(t)).attr("y",P).attr("text-anchor","middle").text((e,t)=>{const a=this.getHaLocale(),i=e.toLocaleTimeString(a,{hour:"2-digit",hour12:!1});return r<400?t%6==0?i:"":r>800?t%2==0?i:"":t%3==0?i:""})}drawWindBarb(e,t,r,a,i,o,s=.8){const n=e.append("g").attr("transform",`translate(${t},${r}) rotate(${i}) scale(${s})`),d=-o/2,l=+o/2;if(a<2)return void n.append("circle").attr("class","wind-barb-calm").attr("cx",0).attr("cy",0).attr("r",4);n.append("line").attr("class","wind-barb").attr("x1",0).attr("y1",d).attr("x2",0).attr("y2",l),n.append("circle").attr("class","wind-barb-dot").attr("cx",0).attr("cy",l).attr("r",4);let c=a,h=d,u=Math.floor(c/10);c-=10*u;let m=Math.floor(c/5);c-=5*m;for(let e=0;e<u;e++,h+=7)n.append("line").attr("class","wind-barb-feather").attr("x1",0).attr("y1",h).attr("x2",12).attr("y2",h+3);for(let e=0;e<m;e++,h+=7)n.append("line").attr("class","wind-barb-half").attr("x1",0).attr("y1",h).attr("x2",6).attr("y2",h+2)}render(){this._updateDarkMode();const{html:e}=window.litElementModules,t=Object.entries(this.styles||{}).map(([e,t])=>`${e}: ${t};`).join(" "),a=m>0?Math.round(100*g/m):0,i=`API Success Rate: ${g}/${m} (${a}%) since ${u.toISOString()}`;return e`
                <ha-card style="${t}">
                    ${this.title?e`
                        <div class="card-header">${this.title}</div>`:""}
                    <div class="card-content">
                        <div class="attribution">
                            ${p(this.hass,"ui.card.meteogram.attribution","Data from")} <a href="https://met.no/"
                                                                                                  target="_blank"
                                                                                                  rel="noopener"
                                                                                                  style="color: inherit;">met.no</a>
                            <span
                                    style="margin-left:8px; vertical-align:middle;"
                                    title="${this._lastApiSuccess?p(this.hass,"ui.card.meteogram.status.success","success")+` : ${i}`:null===this._statusApiSuccess?p(this.hass,"ui.card.meteogram.status.cached","cached")+` : ${i}`:p(this.hass,"ui.card.meteogram.status.failed","failed")+` : ${i}`}"
                            >${this._lastApiSuccess?"✅":null===this._statusApiSuccess?"❎":"❌"}</span>
                        </div>
                        ${this.meteogramError?e`
                                <div class="error" style="white-space:normal;"
                                     .innerHTML=${this.meteogramError}></div>`:e`
                                <div id="chart"></div>
                                ${this.diagnostics?e`
                                    <div id="meteogram-status-panel"
                                         style="margin-top:12px; font-size:0.95em; background:#f5f5f5; border-radius:6px; padding:8px; color:#333;"
                                         xmlns="http://www.w3.org/1999/html">
                                        <b>${p(this.hass,"ui.card.meteogram.status_panel","Status Panel")}</b>
                                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                                            <div>
                                                <span>${p(this.hass,"ui.card.meteogram.status.expires_at","Expires At")}
                                                    : ${this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown"}</span><br>
                                                <span>${p(this.hass,"ui.card.meteogram.status.last_render","Last Render")}
                                                    : ${this._statusLastRender||"unknown"}</span><br>
                                                <span>${p(this.hass,"ui.card.meteogram.status.last_fingerprint_miss","Last Fingerprint Miss")}
                                                    : ${this._statusLastFingerprintMiss||"unknown"}</span><br>
                                                <span>${p(this.hass,"ui.card.meteogram.status.last_data_fetch","Last Data Fetch")}
                                                    : ${this._statusLastFetch||"unknown"}</span>
                                            </div>
                                            <div>
                                                <span
                                                        title="${this._lastApiSuccess?p(this.hass,"ui.card.meteogram.status.success","success")+` : ${i}`:null===this._statusApiSuccess?p(this.hass,"ui.card.meteogram.status.cached","cached")+` : ${i}`:p(this.hass,"ui.card.meteogram.status.failed","failed")+` : ${i}`}"
                                                >
                                                    ${p(this.hass,"ui.card.meteogram.status.api_success","API Success")}
                                                        : ${this._lastApiSuccess?"✅":null===this._statusApiSuccess?"❎":"❌"}
                                                </span>
                                                <br>
                                                <span>Card version: <code>${r}</code></span><br>
                                                <span>Client type: <code>${function(){const e=navigator.userAgent;return/Home Assistant/.test(e)?"HA Companion":/Edg/.test(e)?"Edge":/Chrome/.test(e)?"Chrome":/Android/.test(e)?"Android":/iPhone|iPad|iPod/.test(e)?"iOS":/Firefox/.test(e)?"Firefox":"Unknown"}()}</code></span><br>
                                                <span>${i}</span>

                                            </div>
                                        </div>
                                    </div>
                                `:""}
                            `}
                    </div>
                </ha-card>
            `}_logDomState(){if(this.errorCount>0&&l){if(console.debug("DOM state check:"),console.debug("- shadowRoot exists:",!!this.shadowRoot),this.shadowRoot){const e=this.shadowRoot.querySelector("#chart");console.debug("- chart div exists:",!!e),e&&console.debug("- chart div size:",e.offsetWidth,"x",e.offsetHeight)}console.debug("- Is connected:",this.isConnected),console.debug("- Has rendered:",this.hasRendered),console.debug("- Chart loaded:",this.chartLoaded)}}setError(e){const t=Date.now();this.meteogramError=e,this.lastErrorTime=t,this.errorCount=1,console.error("Meteogram error:",e),e===this.meteogramError?(this.errorCount++,t-this.lastErrorTime>1e4&&(this.meteogramError=`${e} (occurred ${this.errorCount} times)`,this.lastErrorTime=t)):(this.errorCount=1,this.meteogramError=e,this.lastErrorTime=t,console.error("Meteogram error:",e))}_updateDarkMode(){let e=!1;e=this.hass&&this.hass.themes&&"boolean"==typeof this.hass.themes.darkMode?this.hass.themes.darkMode:document.documentElement.classList.contains("dark-theme")||document.body.classList.contains("dark-theme"),e?this.setAttribute("dark",""):this.removeAttribute("dark")}getSystemTemperatureUnit(){if(this.hass&&this.hass.config&&this.hass.config.unit_system&&this.hass.config.unit_system.temperature){const e=this.hass.config.unit_system.temperature;if("°F"===e||"°C"===e)return e;if("F"===e)return"°F";if("C"===e)return"°C"}return"°C"}convertTemperature(e){if(null==e)return e;return"°F"===this.getSystemTemperatureUnit()?9*e/5+32:e}};_.styles=s`
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
                background: rgba(255, 255, 255, 0.7);
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
        `,t([d({type:String})],_.prototype,"title",void 0),t([d({type:Number})],_.prototype,"latitude",void 0),t([d({type:Number})],_.prototype,"longitude",void 0),t([d({attribute:!1})],_.prototype,"hass",void 0),t([d({type:Boolean})],_.prototype,"showCloudCover",void 0),t([d({type:Boolean})],_.prototype,"showPressure",void 0),t([d({type:Boolean})],_.prototype,"showRain",void 0),t([d({type:Boolean})],_.prototype,"showWeatherIcons",void 0),t([d({type:Boolean})],_.prototype,"showWind",void 0),t([d({type:Boolean})],_.prototype,"denseWeatherIcons",void 0),t([d({type:String})],_.prototype,"meteogramHours",void 0),t([d({type:Boolean})],_.prototype,"fillContainer",void 0),t([d({type:Object})],_.prototype,"styles",void 0),t([d({type:Boolean})],_.prototype,"diagnostics",void 0),t([f()],_.prototype,"chartLoaded",void 0),t([f()],_.prototype,"meteogramError",void 0),t([f()],_.prototype,"errorCount",void 0),t([f()],_.prototype,"lastErrorTime",void 0),t([f()],_.prototype,"_statusExpiresAt",void 0),t([f()],_.prototype,"_statusLastRender",void 0),t([f()],_.prototype,"_statusLastFingerprintMiss",void 0),t([f()],_.prototype,"_statusLastFetch",void 0),t([f()],_.prototype,"_statusApiSuccess",void 0),_=e=t([n("meteogram-card")],_),window.customElements.get("meteogram-card")||customElements.define("meteogram-card",_);let w=class extends HTMLElement{constructor(){super(...arguments),this._config={},this._initialized=!1,this._elements=new Map}set hass(e){this._hass=e}get hass(){return this._hass}setConfig(e){this._config=e||{},this._initialized?this._updateValues():this._initialize()}get config(){return this._config}connectedCallback(){this._initialized||this._initialize()}_initialize(){this.render(),this._initialized=!0,setTimeout(()=>this._updateValues(),0)}_updateValues(){var e,t,r,a;if(!this._initialized)return;const i=(e,t,r="value")=>{e&&e[r]!==t&&(e[r]=t)};i(this._elements.get("title"),this._config.title||""),i(this._elements.get("latitude"),void 0!==this._config.latitude?String(this._config.latitude):void 0!==(null===(t=null===(e=this._hass)||void 0===e?void 0:e.config)||void 0===t?void 0:t.latitude)?String(this._hass.config.latitude):""),i(this._elements.get("longitude"),void 0!==this._config.longitude?String(this._config.longitude):void 0!==(null===(a=null===(r=this._hass)||void 0===r?void 0:r.config)||void 0===a?void 0:a.longitude)?String(this._hass.config.longitude):""),i(this._elements.get("show_cloud_cover"),void 0===this._config.show_cloud_cover||this._config.show_cloud_cover,"checked"),i(this._elements.get("show_pressure"),void 0===this._config.show_pressure||this._config.show_pressure,"checked"),i(this._elements.get("show_rain"),void 0===this._config.show_rain||this._config.show_rain,"checked"),i(this._elements.get("show_weather_icons"),void 0===this._config.show_weather_icons||this._config.show_weather_icons,"checked"),i(this._elements.get("show_wind"),void 0===this._config.show_wind||this._config.show_wind,"checked"),i(this._elements.get("dense_weather_icons"),void 0===this._config.dense_weather_icons||this._config.dense_weather_icons,"checked"),i(this._elements.get("meteogram_hours"),this._config.meteogram_hours||"48h"),i(this._elements.get("fill_container"),void 0!==this._config.fill_container&&this._config.fill_container,"checked"),i(this._elements.get("diagnostics"),void 0!==this._config.diagnostics?this._config.diagnostics:c,"checked")}render(){var e,t,r,a,i,o,s;const n=this.hass,d=this._config;if(!n||!d)return this.innerHTML='<ha-card><div style="padding:16px;">Loading Home Assistant context...</div></ha-card>',void setTimeout(()=>this.render(),300);const l=null!==(t=null===(e=null==n?void 0:n.config)||void 0===e?void 0:e.latitude)&&void 0!==t?t:"",h=null!==(a=null===(r=null==n?void 0:n.config)||void 0===r?void 0:r.longitude)&&void 0!==a?a:"",u=void 0===this._config.show_cloud_cover||this._config.show_cloud_cover,m=void 0===this._config.show_pressure||this._config.show_pressure,g=void 0===this._config.show_rain||this._config.show_rain,f=void 0===this._config.show_weather_icons||this._config.show_weather_icons,_=void 0===this._config.show_wind||this._config.show_wind,w=void 0===this._config.dense_weather_icons||this._config.dense_weather_icons,b=this._config.meteogram_hours||"48h",v=void 0!==this._config.fill_container&&this._config.fill_container,y=void 0!==this._config.diagnostics?this._config.diagnostics:c,x=document.createElement("div");x.innerHTML=`\n  <style>\n    ha-card {\n      padding: 16px;\n    }\n    .values {\n      padding-left: 16px;\n      margin: 8px 0;\n    }\n    .row {\n      display: flex;\n      margin-bottom: 12px;\n      align-items: center;\n    }\n    ha-textfield {\n      width: 100%;\n    }\n    .side-by-side {\n      display: flex;\n      gap: 12px;\n    }\n    .side-by-side > * {\n      flex: 1;\n    }\n    h3 {\n      font-size: 18px;\n      color: var(--primary-text-color);\n      font-weight: 500;\n      margin-bottom: 12px;\n      margin-top: 0;\n    }\n    .help-text {\n      color: var(--secondary-text-color);\n      font-size: 0.875rem;\n      margin-top: 4px;\n    }\n    .info-text {\n      color: var(--primary-text-color);\n      opacity: 0.8;\n      font-size: 0.9rem;\n      font-style: italic;\n      margin: 4px 0 16px 0;\n    }\n    .toggle-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 8px;\n    }\n    .toggle-label {\n      flex-grow: 1;\n    }\n    .toggle-section {\n      margin-top: 16px;\n      border-top: 1px solid var(--divider-color);\n      padding-top: 16px;\n    }\n  </style>\n  <ha-card>\n    <h3>${(null===(i=this._hass)||void 0===i?void 0:i.localize)?this._hass.localize("ui.editor.meteogram.title"):"Meteogram Card Settings"}</h3>\n    <div class="values">\n      <div class="row">\n        <ha-textfield\n          label="${(null===(o=this._hass)||void 0===o?void 0:o.localize)?this._hass.localize("ui.editor.meteogram.title_label"):"Title"}"\n          id="title-input"\n          .value="${this._config.title||""}"\n        ></ha-textfield>\n      </div>\n\n      <p class="info-text">\n        ${(null===(s=this._hass)||void 0===s?void 0:s.localize)?this._hass.localize("ui.editor.meteogram.location_info"):"Location coordinates will be used to fetch weather data directly from Met.no API."}\n        ${l?p(this._hass,"ui.editor.meteogram.using_ha_location","Using Home Assistant's location by default."):""}\n      </p>\n\n      <div class="side-by-side">\n        <ha-textfield\n          label="${p(this._hass,"ui.editor.meteogram.latitude","Latitude")}"\n          id="latitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this._config.latitude?this._config.latitude:l}"\n          placeholder="${l?`${p(this._hass,"ui.editor.meteogram.default","Default")}: ${l}`:""}"\n        ></ha-textfield>\n\n        <ha-textfield\n          label="${p(this._hass,"ui.editor.meteogram.longitude","Longitude")}"\n          id="longitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this._config.longitude?this._config.longitude:h}"\n          placeholder="${h?`${p(this._hass,"ui.editor.meteogram.default","Default")}: ${h}`:""}"\n        ></ha-textfield>\n      </div>\n      <p class="help-text">${p(this._hass,"ui.editor.meteogram.leave_empty","Leave empty to use Home Assistant's configured location")}</p>\n\n      <div class="toggle-section">\n        <h3>${p(this._hass,"ui.editor.meteogram.display_options","Display Options")}</h3>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.cloud_coverage","Show Cloud Cover")}</div>\n          <ha-switch\n            id="show-cloud-cover"\n            .checked="${u}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.air_pressure","Show Pressure")}</div>\n          <ha-switch\n            id="show-pressure"\n            .checked="${m}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.precipitation","Show Rain")}</div>\n          <ha-switch\n            id="show-rain"\n            .checked="${g}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.weather_icons","Show Weather Icons")}</div>\n          <ha-switch\n            id="show-weather-icons"\n            .checked="${f}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.wind","Show Wind")}</div>\n          <ha-switch\n            id="show-wind"\n            .checked="${_}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.dense_icons","Dense Weather Icons (every hour)")}</div>\n          <ha-switch\n            id="dense-weather-icons"\n            .checked="${w}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${p(this._hass,"ui.editor.meteogram.attributes.fill_container","Fill Container")}</div>\n          <ha-switch\n            id="fill-container"\n            .checked="${v}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Diagnostics (debug logging)</div>\n          <ha-switch\n            id="diagnostics"\n            .checked="${y}"\n          ></ha-switch>\n        </div>\n      </div>\n\n      <div class="row">\n        <label for="meteogram-hours-select" style="margin-right:8px;">${p(this._hass,"ui.editor.meteogram.meteogram_length","Meteogram Length")}</label>\n        <select id="meteogram-hours-select">\n          <option value="8h" ${"8h"===b?"selected":""}>${p(this._hass,"ui.editor.meteogram.hours_8","8 hours")}</option>\n          <option value="12h" ${"12h"===b?"selected":""}>${p(this._hass,"ui.editor.meteogram.hours_12","12 hours")}</option>\n          <option value="24h" ${"24h"===b?"selected":""}>${p(this._hass,"ui.editor.meteogram.hours_24","24 hours")}</option>\n          <option value="48h" ${"48h"===b?"selected":""}>${p(this._hass,"ui.editor.meteogram.hours_48","48 hours")}</option>\n          <option value="54h" ${"54h"===b?"selected":""}>${p(this._hass,"ui.editor.meteogram.hours_54","54 hours")}</option>\n          <option value="max" ${"max"===b?"selected":""}>${p(this._hass,"ui.editor.meteogram.hours_max","Max available")}</option>\n        </select>\n      </div>\n      <p class="help-text">${p(this._hass,"ui.editor.meteogram.choose_hours","Choose how many hours to show in the meteogram")}</p>\n    </div>\n  </ha-card>\n`,this.innerHTML="",this.appendChild(x),setTimeout(()=>{const e=this.querySelector("#title-input");e&&(e.configValue="title",e.addEventListener("input",this._valueChanged.bind(this)),this._elements.set("title",e));const t=this.querySelector("#latitude-input");t&&(t.configValue="latitude",t.addEventListener("input",this._valueChanged.bind(this)),this._elements.set("latitude",t));const r=this.querySelector("#longitude-input");r&&(r.configValue="longitude",r.addEventListener("input",this._valueChanged.bind(this)),this._elements.set("longitude",r));const a=this.querySelector("#show-cloud-cover");a&&(a.configValue="show_cloud_cover",a.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_cloud_cover",a));const i=this.querySelector("#show-pressure");i&&(i.configValue="show_pressure",i.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_pressure",i));const o=this.querySelector("#show-rain");o&&(o.configValue="show_rain",o.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_rain",o));const s=this.querySelector("#show-weather-icons");s&&(s.configValue="show_weather_icons",s.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_weather_icons",s));const n=this.querySelector("#show-wind");n&&(n.configValue="show_wind",n.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_wind",n));const d=this.querySelector("#dense-weather-icons");d&&(d.configValue="dense_weather_icons",d.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("dense_weather_icons",d));const l=this.querySelector("#meteogram-hours-select");l&&(l.configValue="meteogram_hours",l.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("meteogram_hours",l));const c=this.querySelector("#fill-container");c&&(c.configValue="fill_container",c.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("fill_container",c));const h=this.querySelector("#diagnostics");h&&(h.configValue="diagnostics",h.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("diagnostics",h)),this._updateValues()},0)}_valueChanged(e){const t=e.target;if(!this._config||!t||!t.configValue)return;let r=t.value||"";if("HA-SWITCH"===t.tagName)r=t.checked;else if("number"===t.type)if(""===r)r=void 0;else{const e=parseFloat(r.toString());isNaN(e)||(r=e)}else""===r&&(r=void 0);this._config={...this._config,[t.configValue]:r},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}};w=t([n("meteogram-card-editor")],w),window.customCards=window.customCards||[],window.customCards.push({type:"meteogram-card",name:h,description:"A custom card showing a meteogram with wind barbs.",version:r,preview:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/images/meteogram-card.png",documentationURL:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/README.md"})};window.litElementModules?f():void 0!==e?e.then(()=>{f()}):console.error("Lit modules not found and litModulesPromise not available");
