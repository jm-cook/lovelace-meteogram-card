const e=Promise.all([import("https://unpkg.com/lit@3.1.0/index.js?module"),import("https://unpkg.com/lit@3.1.0/decorators.js?module")]).then(([e,t])=>{window.litElementModules={LitElement:e.LitElement,html:e.html,css:e.css,customElement:t.customElement,property:t.property,state:t.state}});function t(e,t,r,i){var a,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(o<3?a(s):o>3?a(t,r,s):a(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s}"function"==typeof SuppressedError&&SuppressedError;var r="2.1.2-0";class i{constructor(e,t){this.lastError=null,this.lastStatusCode=null,this._forecastData=null,this._expiresAt=null,this._fetchPromise=null,this._lastFetchTime=null,this.lat=e,this.lon=t}async getForecastData(){if(console.debug(`[weather-api] getForecastData called for lat=${this.lat}, lon=${this.lon}`),this._forecastData||this.loadCacheFromStorage(),this._forecastData&&this._expiresAt&&Date.now()<this._expiresAt)return this._forecastData;const e=Date.now();if(this._lastFetchTime&&e-this._lastFetchTime<6e4&&this._fetchPromise)return await this._fetchPromise,this._forecastData;this._fetchPromise||(this._fetchPromise=this._fetchWeatherDataFromAPI());try{await this._fetchPromise}finally{this._fetchPromise=null}return this._forecastData}get expiresAt(){return this._expiresAt}getDiagnosticText(){var e;let t="<br><b>API Error</b><br>";return this.lastError instanceof Error?t+=`Error: <code>${this.lastError.message}</code><br>`:void 0!==this.lastError&&null!==this.lastError&&(t+=`Error: <code>${String(this.lastError)}</code><br>`),t+=`Status: <code>${null!==(e=this.lastStatusCode)&&void 0!==e?e:""}</code><br>`,t+=`Card version: <code>${r}</code><br>`,t+=`Client type: <code>${navigator.userAgent}</code><br>`,t}static encodeCacheKey(e,t){const r=String(e)+String(t);return btoa(r)}saveCacheToStorage(){if(!this._forecastData||!this._expiresAt)return;const e=i.encodeCacheKey(Number(this.lat.toFixed(4)),Number(this.lon.toFixed(4)));let t={};const r=localStorage.getItem("metno-weather-cache");if(r)try{t=JSON.parse(r)}catch{t={}}t["forecast-data"]||(t["forecast-data"]={}),t["forecast-data"][e]={expiresAt:this._expiresAt,data:this._forecastData},localStorage.setItem("metno-weather-cache",JSON.stringify(t))}loadCacheFromStorage(){var e;const t=i.encodeCacheKey(Number(this.lat.toFixed(4)),Number(this.lon.toFixed(4))),r=localStorage.getItem("metno-weather-cache");if(r){let i={};try{i=JSON.parse(r)}catch{i={}}const a=null===(e=i["forecast-data"])||void 0===e?void 0:e[t];a&&a.expiresAt&&a.data?(this._expiresAt=a.expiresAt,Array.isArray(a.data.time)&&(a.data.time=a.data.time.map(e=>"string"==typeof e?new Date(e):e)),this._forecastData=a.data):(this._expiresAt=null,this._forecastData=null)}}async _fetchWeatherDataFromAPI(){const e=Date.now();if(this._lastFetchTime&&e-this._lastFetchTime<6e4)return;this._lastFetchTime=e;const t=this.lat,r=this.lon;let a=`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${t}&lon=${r}`,o=`https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${t}&lon=${r}`,s=a,n={};this.lastStatusCode=null,this.lastError=null;try{n={Origin:window.location.origin,Accept:"application/json"},s=window.location.origin.includes("ui.nabu.casa")?o:a,console.debug(`[weather-api] Fetching weather data from ${s} with Origin ${n.Origin}`),i.METEOGRAM_CARD_API_CALL_COUNT++;const e=await fetch(s,{headers:n,mode:"cors"});this.lastStatusCode=e.status;const t=e.headers.get("Expires");let r=null;if(t){const e=new Date(t);isNaN(e.getTime())||(r=e)}if(429===this.lastStatusCode){const e=r?r.toLocaleTimeString():"later";throw new Error(`Weather API throttling: Too many requests. Please wait until ${e} before retrying.`)}if(304===this.lastStatusCode)throw new Error("API returned 304 but no cached data is available.");if(!e.ok){const t=await e.text();throw new Error(`Weather API returned ${e.status}: ${e.statusText}\n${t}`)}const d=await e.json();i.METEOGRAM_CARD_API_SUCCESS_COUNT++,this.assignMeteogramDataFromRaw(d),this._expiresAt=r?r.getTime():null,this.saveCacheToStorage()}catch(e){this.lastError=e;const t=this.getDiagnosticText()+`API URL: <code>${s}</code><br>`+`Origin header: <code>${n.Origin}</code><br>`;throw new Error(`<br>Failed to get weather data: ${e.message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${t}`)}}assignMeteogramDataFromRaw(e){try{if(!e||!e.properties||!Array.isArray(e.properties.timeseries))throw new Error("Invalid raw data format from weather API");const t=e.properties.timeseries.filter(e=>0===new Date(e.time).getMinutes()),r={time:[],temperature:[],rain:[],rainMin:[],rainMax:[],snow:[],cloudCover:[],windSpeed:[],windDirection:[],symbolCode:[],pressure:[]};r.fetchTimestamp=(new Date).toISOString(),t.forEach(e=>{var t,i,a;const o=new Date(e.time),s=e.data.instant.details,n=null===(t=e.data.next_1_hours)||void 0===t?void 0:t.details;if(r.time.push(o),r.temperature.push(s.air_temperature),r.cloudCover.push(s.cloud_area_fraction),r.windSpeed.push(s.wind_speed),r.windDirection.push(s.wind_from_direction),r.pressure.push(s.air_pressure_at_sea_level),n){const t=void 0!==n.precipitation_amount_max?n.precipitation_amount_max:void 0!==n.precipitation_amount?n.precipitation_amount:0,o=void 0!==n.precipitation_amount_min?n.precipitation_amount_min:void 0!==n.precipitation_amount?n.precipitation_amount:0;r.rainMin.push(o),r.rainMax.push(t),r.rain.push(void 0!==n.precipitation_amount?n.precipitation_amount:0),r.snow.push(0),(null===(a=null===(i=e.data.next_1_hours)||void 0===i?void 0:i.summary)||void 0===a?void 0:a.symbol_code)?r.symbolCode.push(e.data.next_1_hours.summary.symbol_code):r.symbolCode.push("")}else r.rain.push(0),r.rainMin.push(0),r.rainMax.push(0),r.snow.push(0),r.symbolCode.push("")}),this._forecastData=r}catch(e){throw new Error("Failed to parse weather data: "+(e instanceof Error?e.message:String(e)))}}}i.METEOGRAM_CARD_API_CALL_COUNT=0,i.METEOGRAM_CARD_API_SUCCESS_COUNT=0;var a={"ui.card.meteogram.attribution":"Data from","ui.card.meteogram.status.cached":"cached","ui.card.meteogram.status.success":"success","ui.card.meteogram.status.failed":"failed","ui.card.meteogram.status_panel":"Status Panel","ui.card.meteogram.status.expires_at":"Expires At","ui.card.meteogram.status.last_render":"Last Render","ui.card.meteogram.status.last_fingerprint_miss":"Last Fingerprint Miss","ui.card.meteogram.status.last_data_fetch":"Last Data Fetch","ui.card.meteogram.status.last_cached":"Last cached","ui.card.meteogram.status.api_success":"API Success","ui.card.meteogram.error":"Weather data not available","ui.card.meteogram.attributes.temperature":"Temperature","ui.card.meteogram.attributes.air_pressure":"Pressure","ui.card.meteogram.attributes.precipitation":"Rain","ui.card.meteogram.attributes.snow":"Snow","ui.card.meteogram.attributes.cloud_coverage":"Cloud Cover","ui.card.meteogram.attributes.weather_icons":"Show Weather Icons","ui.card.meteogram.attributes.wind":"Show Wind","ui.card.meteogram.attributes.dense_icons":"Dense Weather Icons (every hour)","ui.card.meteogram.attributes.fill_container":"Fill Container","ui.editor.meteogram.title":"Meteogram Card Settings","ui.editor.meteogram.title_label":"Title","ui.editor.meteogram.location_info":"Location coordinates will be used to fetch weather data directly from Met.no API.","ui.editor.meteogram.using_ha_location":"Using Home Assistant's location by default.","ui.editor.meteogram.latitude":"Latitude","ui.editor.meteogram.longitude":"Longitude","ui.editor.meteogram.default":"Default","ui.editor.meteogram.leave_empty":"Leave empty to use Home Assistant's configured location","ui.editor.meteogram.display_options":"Display Options","ui.editor.meteogram.meteogram_length":"Meteogram Length","ui.editor.meteogram.hours_8":"8 hours","ui.editor.meteogram.hours_12":"12 hours","ui.editor.meteogram.hours_24":"24 hours","ui.editor.meteogram.hours_48":"48 hours","ui.editor.meteogram.hours_54":"54 hours","ui.editor.meteogram.hours_max":"Max available","ui.editor.meteogram.choose_hours":"Choose how many hours to show in the meteogram","ui.editor.meteogram.attributes.cloud_coverage":"Show Cloud Cover","ui.editor.meteogram.attributes.air_pressure":"Show Pressure","ui.editor.meteogram.attributes.precipitation":"Show Rain","ui.editor.meteogram.attributes.weather_icons":"Show Weather Icons","ui.editor.meteogram.attributes.wind":"Show Wind","ui.editor.meteogram.attributes.dense_icons":"Dense Weather Icons (every hour)","ui.editor.meteogram.attributes.fill_container":"Fill Container"},o={"ui.card.meteogram.attribution":"Data fra","ui.card.meteogram.status.cached":"bufret","ui.card.meteogram.status.success":"suksess","ui.card.meteogram.status.failed":"feilet","ui.card.meteogram.status_panel":"Statuspanel","ui.card.meteogram.status.expires_at":"Utløper","ui.card.meteogram.status.last_render":"Sist tegnet","ui.card.meteogram.status.last_fingerprint_miss":"Siste fingerprint-miss","ui.card.meteogram.status.last_data_fetch":"Siste datainnhenting","ui.card.meteogram.status.last_cached":"Sist bufret","ui.card.meteogram.status.api_success":"API-suksess","ui.card.meteogram.error":"Værdata ikke tilgjengelig","ui.card.meteogram.attributes.temperature":"Temperatur","ui.card.meteogram.attributes.air_pressure":"Lufttrykk","ui.card.meteogram.attributes.precipitation":"Regn","ui.card.meteogram.attributes.snow":"Snø","ui.card.meteogram.attributes.cloud_coverage":"Skydekke","ui.card.meteogram.attributes.weather_icons":"Vis værikoner","ui.card.meteogram.attributes.wind":"Vis vind","ui.card.meteogram.attributes.dense_icons":"Tette værikoner (hver time)","ui.card.meteogram.attributes.fill_container":"Fyll beholder","ui.editor.meteogram.title":"Meteogram-kortinnstillinger","ui.editor.meteogram.title_label":"Tittel","ui.editor.meteogram.location_info":"Lokasjonskoordinater brukes for å hente værdata direkte fra Met.no API.","ui.editor.meteogram.using_ha_location":"Bruker Home Assistants lokasjon som standard.","ui.editor.meteogram.latitude":"Breddegrad","ui.editor.meteogram.longitude":"Lengdegrad","ui.editor.meteogram.default":"Standard","ui.editor.meteogram.leave_empty":"La stå tomt for å bruke Home Assistants konfigurerte lokasjon","ui.editor.meteogram.display_options":"Visningsvalg","ui.editor.meteogram.meteogram_length":"Meteogramlengde","ui.editor.meteogram.hours_8":"8 timer","ui.editor.meteogram.hours_12":"12 timer","ui.editor.meteogram.hours_24":"24 timer","ui.editor.meteogram.hours_48":"48 timer","ui.editor.meteogram.hours_54":"54 timer","ui.editor.meteogram.hours_max":"Maks tilgjengelig","ui.editor.meteogram.choose_hours":"Velg hvor mange timer som skal vises i meteogrammet","ui.editor.meteogram.attributes.cloud_coverage":"Vis skydekke","ui.editor.meteogram.attributes.air_pressure":"Vis lufttrykk","ui.editor.meteogram.attributes.precipitation":"Vis regn","ui.editor.meteogram.attributes.weather_icons":"Vis værikoner","ui.editor.meteogram.attributes.wind":"Vis vind","ui.editor.meteogram.attributes.dense_icons":"Tette værikoner (hver time)","ui.editor.meteogram.attributes.fill_container":"Fyll beholder"},s={"ui.card.meteogram.attribution":"Datos de","ui.card.meteogram.status.cached":"en caché","ui.card.meteogram.status.success":"éxito","ui.card.meteogram.status.failed":"fallido","ui.card.meteogram.status_panel":"Panel de estado","ui.card.meteogram.status.expires_at":"Expira en","ui.card.meteogram.status.last_render":"Última representación","ui.card.meteogram.status.last_fingerprint_miss":"Última huella fallida","ui.card.meteogram.status.last_data_fetch":"Última obtención de datos","ui.card.meteogram.status.last_cached":"Último en caché","ui.card.meteogram.status.api_success":"Éxito de la API","ui.card.meteogram.error":"Datos meteorológicos no disponibles","ui.card.meteogram.attributes.temperature":"Temperatura","ui.card.meteogram.attributes.air_pressure":"Presión","ui.card.meteogram.attributes.precipitation":"Lluvia","ui.card.meteogram.attributes.snow":"Nieve","ui.card.meteogram.attributes.cloud_coverage":"Cobertura de nubes","ui.card.meteogram.attributes.weather_icons":"Mostrar iconos meteorológicos","ui.card.meteogram.attributes.wind":"Mostrar viento","ui.card.meteogram.attributes.dense_icons":"Iconos meteorológicos densos (cada hora)","ui.card.meteogram.attributes.fill_container":"Rellenar el contenedor","ui.editor.meteogram.title":"Configuración de la tarjeta Meteograma","ui.editor.meteogram.title_label":"Título","ui.editor.meteogram.location_info":"Las coordenadas se utilizarán para obtener datos meteorológicos directamente de la API de Met.no.","ui.editor.meteogram.using_ha_location":"Usando la ubicación de Home Assistant por defecto.","ui.editor.meteogram.latitude":"Latitud","ui.editor.meteogram.longitude":"Longitud","ui.editor.meteogram.default":"Predeterminado","ui.editor.meteogram.leave_empty":"Dejar vacío para usar la ubicación configurada en Home Assistant","ui.editor.meteogram.display_options":"Opciones de visualización","ui.editor.meteogram.meteogram_length":"Duración del meteograma","ui.editor.meteogram.hours_8":"8 horas","ui.editor.meteogram.hours_12":"12 horas","ui.editor.meteogram.hours_24":"24 horas","ui.editor.meteogram.hours_48":"48 horas","ui.editor.meteogram.hours_54":"54 horas","ui.editor.meteogram.hours_max":"Máximo disponible","ui.editor.meteogram.choose_hours":"Elija cuántas horas mostrar en el meteograma","ui.editor.meteogram.attributes.cloud_coverage":"Mostrar cobertura de nubes","ui.editor.meteogram.attributes.air_pressure":"Mostrar presión","ui.editor.meteogram.attributes.precipitation":"Mostrar lluvia","ui.editor.meteogram.attributes.weather_icons":"Mostrar iconos meteorológicos","ui.editor.meteogram.attributes.wind":"Mostrar viento","ui.editor.meteogram.attributes.dense_icons":"Iconos meteorológicos densos (cada hora)","ui.editor.meteogram.attributes.fill_container":"Rellenar el contenedor"},n={"ui.card.meteogram.attribution":"Dati da","ui.card.meteogram.status.cached":"memorizzato","ui.card.meteogram.status.success":"successo","ui.card.meteogram.status.failed":"fallito","ui.card.meteogram.status_panel":"Pannello di stato","ui.card.meteogram.status.expires_at":"Scade il","ui.card.meteogram.status.last_render":"Ultima visualizzazione","ui.card.meteogram.status.last_fingerprint_miss":"Ultima impronta mancante","ui.card.meteogram.status.last_data_fetch":"Ultimo recupero dati","ui.card.meteogram.status.last_cached":"Ultimo memorizzato","ui.card.meteogram.status.api_success":"Successo API","ui.card.meteogram.error":"Dati meteorologici non disponibili","ui.card.meteogram.attributes.temperature":"Temperatura","ui.card.meteogram.attributes.air_pressure":"Pressione","ui.card.meteogram.attributes.precipitation":"Pioggia","ui.card.meteogram.attributes.snow":"Neve","ui.card.meteogram.attributes.cloud_coverage":"Copertura nuvolosa","ui.card.meteogram.attributes.weather_icons":"Mostra icone meteo","ui.card.meteogram.attributes.wind":"Mostra vento","ui.card.meteogram.attributes.dense_icons":"Icone meteo dense (ogni ora)","ui.card.meteogram.attributes.fill_container":"Riempi contenitore","ui.editor.meteogram.title":"Impostazioni della scheda Meteogramma","ui.editor.meteogram.title_label":"Titolo","ui.editor.meteogram.location_info":"Le coordinate verranno utilizzate per ottenere i dati meteorologici direttamente dall'API Met.no.","ui.editor.meteogram.using_ha_location":"Utilizzo della posizione di Home Assistant come predefinita.","ui.editor.meteogram.latitude":"Latitudine","ui.editor.meteogram.longitude":"Longitudine","ui.editor.meteogram.default":"Predefinito","ui.editor.meteogram.leave_empty":"Lascia vuoto per usare la posizione configurata in Home Assistant","ui.editor.meteogram.display_options":"Opzioni di visualizzazione","ui.editor.meteogram.meteogram_length":"Durata meteogramma","ui.editor.meteogram.hours_8":"8 ore","ui.editor.meteogram.hours_12":"12 ore","ui.editor.meteogram.hours_24":"24 ore","ui.editor.meteogram.hours_48":"48 ore","ui.editor.meteogram.hours_54":"54 ore","ui.editor.meteogram.hours_max":"Massimo disponibile","ui.editor.meteogram.choose_hours":"Scegli quante ore mostrare nel meteogramma","ui.editor.meteogram.attributes.cloud_coverage":"Mostra copertura nuvolosa","ui.editor.meteogram.attributes.air_pressure":"Mostra pressione","ui.editor.meteogram.attributes.precipitation":"Mostra pioggia","ui.editor.meteogram.attributes.weather_icons":"Mostra icone meteo","ui.editor.meteogram.attributes.wind":"Mostra vento","ui.editor.meteogram.attributes.dense_icons":"Icone meteo dense (ogni ora)","ui.editor.meteogram.attributes.fill_container":"Riempi contenitore"},d={"ui.card.meteogram.attribution":"Daten von","ui.card.meteogram.status.cached":"zwischengespeichert","ui.card.meteogram.status.success":"Erfolg","ui.card.meteogram.status.failed":"Fehler","ui.card.meteogram.status_panel":"Statuspanel","ui.card.meteogram.status.expires_at":"Ablaufdatum","ui.card.meteogram.status.last_render":"Letzte Darstellung","ui.card.meteogram.status.last_fingerprint_miss":"Letzter Fingerabdruck-Fehler","ui.card.meteogram.status.last_data_fetch":"Letzter Datenabruf","ui.card.meteogram.status.last_cached":"Zuletzt zwischengespeichert","ui.card.meteogram.status.api_success":"API-Erfolg","ui.card.meteogram.error":"Wetterdaten nicht verfügbar","ui.card.meteogram.attributes.temperature":"Temperatur","ui.card.meteogram.attributes.air_pressure":"Luftdruck","ui.card.meteogram.attributes.precipitation":"Regen","ui.card.meteogram.attributes.snow":"Schnee","ui.card.meteogram.attributes.cloud_coverage":"Wolkenbedeckung","ui.card.meteogram.attributes.weather_icons":"Wetter-Symbole anzeigen","ui.card.meteogram.attributes.wind":"Wind anzeigen","ui.card.meteogram.attributes.dense_icons":"Dichte Wettersymbole (jede Stunde)","ui.card.meteogram.attributes.fill_container":"Container ausfüllen","ui.editor.meteogram.title":"Meteogramm-Karteneinstellungen","ui.editor.meteogram.title_label":"Titel","ui.editor.meteogram.location_info":"Die Koordinaten werden verwendet, um Wetterdaten direkt von der Met.no API abzurufen.","ui.editor.meteogram.using_ha_location":"Standardmäßig wird der Standort von Home Assistant verwendet.","ui.editor.meteogram.latitude":"Breitengrad","ui.editor.meteogram.longitude":"Längengrad","ui.editor.meteogram.default":"Standard","ui.editor.meteogram.leave_empty":"Leer lassen, um die konfigurierte Position von Home Assistant zu verwenden","ui.editor.meteogram.display_options":"Anzeigeoptionen","ui.editor.meteogram.meteogram_length":"Meteogramm-Länge","ui.editor.meteogram.hours_8":"8 Stunden","ui.editor.meteogram.hours_12":"12 Stunden","ui.editor.meteogram.hours_24":"24 Stunden","ui.editor.meteogram.hours_48":"48 Stunden","ui.editor.meteogram.hours_54":"54 Stunden","ui.editor.meteogram.hours_max":"Maximal verfügbar","ui.editor.meteogram.choose_hours":"Wählen Sie, wie viele Stunden im Meteogramm angezeigt werden sollen","ui.editor.meteogram.attributes.cloud_coverage":"Wolkenbedeckung anzeigen","ui.editor.meteogram.attributes.air_pressure":"Luftdruck anzeigen","ui.editor.meteogram.attributes.precipitation":"Regen anzeigen","ui.editor.meteogram.attributes.weather_icons":"Wetter-Symbole anzeigen","ui.editor.meteogram.attributes.wind":"Wind anzeigen","ui.editor.meteogram.attributes.dense_icons":"Dichte Wettersymbole (jede Stunde)","ui.editor.meteogram.attributes.fill_container":"Container ausfüllen"},l={"ui.card.meteogram.attribution":"Données de","ui.card.meteogram.status.cached":"mis en cache","ui.card.meteogram.status.success":"succès","ui.card.meteogram.status.failed":"échec","ui.card.meteogram.status_panel":"Panneau d'état","ui.card.meteogram.status.expires_at":"Expire à","ui.card.meteogram.status.last_render":"Dernier rendu","ui.card.meteogram.status.last_fingerprint_miss":"Dernière empreinte manquée","ui.card.meteogram.status.last_data_fetch":"Dernière récupération de données","ui.card.meteogram.status.last_cached":"Dernière mise en cache","ui.card.meteogram.status.api_success":"Succès API","ui.card.meteogram.error":"Données météo non disponibles","ui.card.meteogram.attributes.temperature":"Température","ui.card.meteogram.attributes.air_pressure":"Pression","ui.card.meteogram.attributes.precipitation":"Pluie","ui.card.meteogram.attributes.snow":"Neige","ui.card.meteogram.attributes.cloud_coverage":"Couverture nuageuse","ui.card.meteogram.attributes.weather_icons":"Afficher les icônes météo","ui.card.meteogram.attributes.wind":"Afficher le vent","ui.card.meteogram.attributes.dense_icons":"Icônes météo denses (chaque heure)","ui.card.meteogram.attributes.fill_container":"Remplir le conteneur","ui.editor.meteogram.title":"Paramètres de la carte Météogramme","ui.editor.meteogram.title_label":"Titre","ui.editor.meteogram.location_info":"Les coordonnées seront utilisées pour obtenir les données météo directement depuis l'API Met.no.","ui.editor.meteogram.using_ha_location":"Utilisation de la localisation Home Assistant par défaut.","ui.editor.meteogram.latitude":"Latitude","ui.editor.meteogram.longitude":"Longitude","ui.editor.meteogram.default":"Défaut","ui.editor.meteogram.leave_empty":"Laisser vide pour utiliser la localisation configurée dans Home Assistant","ui.editor.meteogram.display_options":"Options d'affichage","ui.editor.meteogram.meteogram_length":"Durée du météogramme","ui.editor.meteogram.hours_8":"8 heures","ui.editor.meteogram.hours_12":"12 heures","ui.editor.meteogram.hours_24":"24 heures","ui.editor.meteogram.hours_48":"48 heures","ui.editor.meteogram.hours_54":"54 heures","ui.editor.meteogram.hours_max":"Maximum disponible","ui.editor.meteogram.choose_hours":"Choisissez combien d'heures afficher dans le météogramme","ui.editor.meteogram.attributes.cloud_coverage":"Afficher la couverture nuageuse","ui.editor.meteogram.attributes.air_pressure":"Afficher la pression","ui.editor.meteogram.attributes.precipitation":"Afficher la pluie","ui.editor.meteogram.attributes.weather_icons":"Afficher les icônes météo","ui.editor.meteogram.attributes.wind":"Afficher le vent","ui.editor.meteogram.attributes.dense_icons":"Icônes météo denses (chaque heure)","ui.editor.meteogram.attributes.fill_container":"Remplir le conteneur"};const h=r.includes("beta"),c="Meteogram Card",u=new Date;function m(e,t,r){var i;if(e&&"function"==typeof e.localize){const r=e.localize(t);if(r&&r!==t)return r}if(e&&e.resources&&"object"==typeof e.resources){const r=e.language||"en",a=null===(i=e.resources[r])||void 0===i?void 0:i[t];if(a)return a}const h=e&&e.language?e.language:"en";let c;return c=h.startsWith("nb")?o[t]:h.startsWith("es")?s[t]:h.startsWith("it")?n[t]:h.startsWith("de")?d[t]:h.startsWith("fr")?l[t]:a[t],c||(void 0!==r?r:t)}const g=()=>{var e;console.info(`%c☀️ ${c} ${r} ⚡️🌦️`,"color: #1976d2; font-weight: bold; background: white");const{LitElement:s,css:n,customElement:d,property:l,state:g}=window.litElementModules;let p=e=class extends s{constructor(){super(...arguments),this.title="",this.showCloudCover=!0,this.showPressure=!0,this.showRain=!0,this.showWeatherIcons=!0,this.showWind=!0,this.denseWeatherIcons=!0,this.meteogramHours="48h",this.fillContainer=!1,this.styles={},this.diagnostics=h,this.chartLoaded=!1,this.meteogramError="",this.errorCount=0,this.lastErrorTime=0,this.iconCache=new Map,this.iconBasePath="https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/",this.svg=null,this._resizeObserver=null,this._lastWidth=0,this._lastHeight=0,this._intersectionObserver=null,this._mutationObserver=null,this._isInitialized=!1,this._lastRenderedData=null,this.apiExpiresAt=null,this.apiLastModified=null,this.weatherDataPromise=null,this._weatherApiInstance=null,this._redrawScheduled=!1,this._lastDrawScheduleTime=0,this._drawThrottleMs=200,this._statusExpiresAt="",this._statusLastRender="",this._statusLastFetch="",this._statusApiSuccess=null,this._onVisibilityChange=()=>{!document.hidden&&this.isConnected&&this._handleVisibilityChange()},this._onLocationChanged=()=>{setTimeout(()=>{this.isConnected&&this._isElementVisible()&&this._handleVisibilityChange()},100)},this.trnslt=(e,t)=>{var r;if(this.hass&&"function"==typeof this.hass.localize){const t=this.hass.localize(e);if(t&&t!==e)return t}if(this.hass&&this.hass.resources&&"object"==typeof this.hass.resources){const t=this.hass.language||"en",i=null===(r=this.hass.resources[t])||void 0===r?void 0:r[e];if(i)return i}let i;return i=(this.hass&&this.hass.language?this.hass.language:"en").startsWith("nb")?o[e]:a[e],i||(void 0!==t?t:e)}}async getIconSVG(e){if(this.iconCache.has(e))return this.iconCache.get(e);try{const t=`${this.iconBasePath}${e}.svg`,r=await fetch(t);if(!r.ok)return console.warn(`Failed to load icon: ${e}, status: ${r.status}`),"";const i=await r.text();return!i.includes("<svg")||i.length<20?(console.warn(`Invalid SVG content for ${e}`),""):(this.iconCache.set(e,i),i)}catch(t){return console.error(`Error loading icon ${e}:`,t),""}}_scheduleDrawMeteogram(e="unknown"){const t=Date.now();this._drawCallIndex++;const r=`${e}#${this._drawCallIndex}`;console.debug(`[${c}] _scheduleDrawMeteogram called from: ${r}`),this._redrawScheduled||t-this._lastDrawScheduleTime<this._drawThrottleMs?console.debug(`[${c}] _scheduleDrawMeteogram: redraw already scheduled or throttled, skipping.`):(this._redrawScheduled=!0,this._lastDrawScheduleTime=t,setTimeout(()=>{this._redrawScheduled=!1,this._lastDrawScheduleTime=Date.now(),this._drawMeteogram(r)},50))}setConfig(e){const t=void 0!==e.latitude?parseFloat(Number(e.latitude).toFixed(4)):void 0,r=void 0!==e.longitude?parseFloat(Number(e.longitude).toFixed(4)):void 0;void 0!==this.latitude&&parseFloat(Number(this.latitude).toFixed(4)),void 0!==this.longitude&&parseFloat(Number(this.longitude).toFixed(4)),e.title&&(this.title=e.title),void 0!==e.latitude&&(this.latitude=t),void 0!==e.longitude&&(this.longitude=r),this.showCloudCover=void 0===e.show_cloud_cover||e.show_cloud_cover,this.showPressure=void 0===e.show_pressure||e.show_pressure,this.showRain=void 0===e.show_rain||e.show_rain,this.showWeatherIcons=void 0===e.show_weather_icons||e.show_weather_icons,this.showWind=void 0===e.show_wind||e.show_wind,this.denseWeatherIcons=void 0===e.dense_weather_icons||e.dense_weather_icons,this.meteogramHours=e.meteogram_hours||"48h",this.fillContainer=void 0!==e.fill_container&&e.fill_container,this.styles=e.styles||{},this.diagnostics=void 0!==e.diagnostics?e.diagnostics:h}static getConfigElement(){const e=document.createElement("meteogram-card-editor");return e.setConfig({show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1,diagnostics:h}),e}static getStubConfig(){return{title:"Weather Forecast",show_cloud_cover:!0,show_pressure:!0,show_rain:!0,show_weather_icons:!0,show_wind:!0,dense_weather_icons:!0,meteogram_hours:"48h",fill_container:!1,diagnostics:h}}getCardSize(){return 3}connectedCallback(){super.connectedCallback(),this._isInitialized=!1,this.updateComplete.then(()=>{this._setupResizeObserver(),this._setupVisibilityObserver(),this._setupMutationObserver(),document.addEventListener("visibilitychange",this._onVisibilityChange.bind(this)),window.addEventListener("location-changed",this._onLocationChanged.bind(this)),this.isConnected&&(this.chartLoaded?this._scheduleDrawMeteogram("connectedCallback"):this.loadD3AndDraw())})}disconnectedCallback(){this._teardownResizeObserver(),this._teardownVisibilityObserver(),this._teardownMutationObserver(),document.removeEventListener("visibilitychange",this._onVisibilityChange.bind(this)),window.removeEventListener("location-changed",this._onLocationChanged.bind(this)),this.cleanupChart(),this._weatherRetryTimeout&&(clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=null),this._weatherRefreshTimeout&&(clearTimeout(this._weatherRefreshTimeout),this._weatherRefreshTimeout=null),super.disconnectedCallback()}_isElementVisible(){if(!this.isConnected||!this.shadowRoot)return!1;if(document.hidden)return!1;const e=this.shadowRoot.host;if(!e)return!1;if(0===e.offsetWidth&&0===e.offsetHeight)return!1;const t=window.getComputedStyle(e);if("none"===t.display)return!1;if("hidden"===t.visibility)return!1;const r=e.getBoundingClientRect();return!(r.top+r.height<=0||r.left+r.width<=0||r.bottom>=window.innerHeight||r.right>=window.innerWidth)}_setupVisibilityObserver(){var e;this._intersectionObserver||(this._intersectionObserver=new IntersectionObserver(e=>{for(const t of e)if(t.isIntersecting){this._handleVisibilityChange();break}},{threshold:[.1]}),(null===(e=this.shadowRoot)||void 0===e?void 0:e.host)&&this._intersectionObserver.observe(this.shadowRoot.host))}_teardownVisibilityObserver(){this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null)}_setupMutationObserver(){var e;if(!this._mutationObserver){this._mutationObserver=new MutationObserver(e=>{for(const t of e){if(t.target instanceof HTMLElement&&("HA-TAB"===t.target.tagName||"HA-TABS"===t.target.tagName||t.target.classList.contains("content")||t.target.hasAttribute("active")))break;if("attributes"===t.type&&("style"===t.attributeName||"class"===t.attributeName||"hidden"===t.attributeName||"active"===t.attributeName))break}}),document.querySelectorAll("ha-tabs, ha-tab, ha-tab-container").forEach(e=>{e&&this._mutationObserver.observe(e,{attributes:!0,childList:!0,subtree:!0})});const t=(null===(e=this.shadowRoot)||void 0===e?void 0:e.host)||null;if(t instanceof HTMLElement){let e=t;for(;e&&e.parentElement;)this._mutationObserver.observe(e.parentElement,{attributes:!0,attributeFilter:["style","class","hidden","active"],childList:!1,subtree:!1}),e=e.parentElement}const r=document.querySelector("home-assistant, ha-panel-lovelace");r&&this._mutationObserver.observe(r,{childList:!0,subtree:!0})}}_teardownMutationObserver(){this._mutationObserver&&(this._mutationObserver.disconnect(),this._mutationObserver=null)}_handleVisibilityChange(){var e;if(this._isElementVisible()){const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart"),r=null==t?void 0:t.querySelector("svg"),i=t&&t.offsetWidth>0&&t.offsetHeight>0,a=!this.svg||!t||""===t.innerHTML||0===t.clientWidth||!r;if(!a&&r&&i)return void console.debug(`[${c}] _handleVisibilityChange: chart already rendered and visible, skipping redraw.`);a&&this.chartLoaded&&(this.cleanupChart(),this.requestUpdate(),this.updateComplete.then(()=>this._scheduleDrawMeteogram("_handleVisibilityChange")))}}_setupResizeObserver(){this._resizeObserver||(this._resizeObserver=new ResizeObserver(this._onResize.bind(this))),setTimeout(()=>{var e;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");t&&this._resizeObserver&&this._resizeObserver.observe(t)},100)}_onResize(e){var t;if(0===e.length)return;const r=e[0];if(Math.abs(r.contentRect.width-this._lastWidth)>.05*this._lastWidth||Math.abs(r.contentRect.height-this._lastHeight)>.1*this._lastHeight){this._lastWidth=r.contentRect.width,this._lastHeight=r.contentRect.height;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart"),i=null==e?void 0:e.querySelector("svg"),a=e&&e.offsetWidth>0&&e.offsetHeight>0;if(i&&a)return void console.debug(`[${c}] _onResize: chart already rendered and visible, skipping redraw.`);this._scheduleDrawMeteogram("_onResize")}}_teardownResizeObserver(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null)}firstUpdated(e){setTimeout(()=>{this.loadD3AndDraw()},50),this._updateDarkMode()}updated(e){var t,r;const i=e.has("latitude")||e.has("longitude")||e.has("showCloudCover")||e.has("showPressure")||e.has("showRain")||e.has("showWeatherIcons")||e.has("showWind")||e.has("denseWeatherIcons")||e.has("meteogramHours")||e.has("fillContainer");if(i&&console.debug(`[${c}] updated(): needsRedraw because:`,{latitude:e.has("latitude"),longitude:e.has("longitude"),showCloudCover:e.has("showCloudCover"),showPressure:e.has("showPressure"),showRain:e.has("showRain"),showWeatherIcons:e.has("showWeatherIcons"),showWind:e.has("showWind"),denseWeatherIcons:e.has("denseWeatherIcons"),meteogramHours:e.has("meteogramHours"),fillContainer:e.has("fillContainer")}),i){if(console.debug(`[${c}] updated(): scheduling redraw, chartLoaded=${this.chartLoaded}`),this.chartLoaded&&i){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("#chart");null==e||e.querySelector("svg"),e&&e.offsetWidth>0&&e.offsetHeight,this._scheduleDrawMeteogram("updated")}if(!this._isInitialized&&this.shadowRoot&&(this._isInitialized=!0,this.chartLoaded)){const e=null===(r=this.shadowRoot)||void 0===r?void 0:r.querySelector("#chart");e&&""===e.innerHTML&&this._scheduleDrawMeteogram("updated-forced")}this._updateDarkMode()}else console.debug(`[${c}] updated(): no redraw needed or chart render in progress, skipping.`)}static encodeCacheKey(e,t){const r=String(e)+String(t);return btoa(r)}getLocationKey(t,r){return e.encodeCacheKey(Number(t.toFixed(4)),Number(r.toFixed(4)))}_saveDefaultLocationToStorage(e,t){try{const r={latitude:parseFloat(e.toFixed(4)),longitude:parseFloat(t.toFixed(4))};localStorage.setItem("meteogram-card-default-location",JSON.stringify(r))}catch(e){console.debug(`[${c}] Failed to save default location to localStorage:`,e)}}_loadDefaultLocationFromStorage(){try{const e=localStorage.getItem("meteogram-card-default-location");if(e)try{const t=JSON.parse(e),r=parseFloat(Number(t.latitude).toFixed(4)),i=parseFloat(Number(t.longitude).toFixed(4));if(!isNaN(r)&&!isNaN(i))return{latitude:r,longitude:i}}catch{}return null}catch(e){return console.debug(`[${c}] Failed to load default location from localStorage:`,e),null}}_checkAndUpdateLocation(){if(void 0!==this.latitude&&void 0!==this.longitude)return this.latitude=parseFloat(Number(this.latitude).toFixed(4)),this.longitude=parseFloat(Number(this.longitude).toFixed(4)),void(this._weatherApiInstance&&this._weatherApiInstance.lat===this.latitude&&this._weatherApiInstance.lon===this.longitude||(this._weatherApiInstance=new i(this.latitude,this.longitude)));if(this.hass&&(void 0===this.latitude||void 0===this.longitude)){const e=this.hass.config||{};if(void 0!==e.latitude&&void 0!==e.longitude){const t=parseFloat(Number(e.latitude).toFixed(4)),r=parseFloat(Number(e.longitude).toFixed(4)),a=this._loadDefaultLocationFromStorage();return a&&a.latitude===t&&a.longitude===r||this._saveDefaultLocationToStorage(t,r),this.latitude=t,this.longitude=r,this._weatherApiInstance&&this._weatherApiInstance.lat===this.latitude&&this._weatherApiInstance.lon===this.longitude||(this._weatherApiInstance=new i(this.latitude,this.longitude)),void console.debug(`[${c}] Using HA location: ${this.latitude}, ${this.longitude}`)}}if(void 0===this.latitude||void 0===this.longitude){const e=this._loadDefaultLocationFromStorage();e?(this.latitude=e.latitude,this.longitude=e.longitude,this._weatherApiInstance&&this._weatherApiInstance.lat===this.latitude&&this._weatherApiInstance.lon===this.longitude||(this._weatherApiInstance=new i(this.latitude,this.longitude)),console.debug(`[${c}] Using cached default-location: ${this.latitude}, ${this.longitude}`)):(this.latitude=51.5074,this.longitude=-.1278,this._weatherApiInstance&&this._weatherApiInstance.lat===this.latitude&&this._weatherApiInstance.lon===this.longitude||(this._weatherApiInstance=new i(this.latitude,this.longitude)),console.debug(`[${c}] Using default location: ${this.latitude}, ${this.longitude}`))}}async loadD3AndDraw(){var e;if(window.d3){this.chartLoaded=!0;const t=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("#chart");return null==t||t.querySelector("svg"),t&&t.offsetWidth>0&&t.offsetHeight,void this._scheduleDrawMeteogram("loadD3AndDraw")}try{const e=document.createElement("script");e.src="https://d3js.org/d3.v7.min.js",e.async=!0;const t=new Promise((t,r)=>{e.onload=()=>{this.chartLoaded=!0,t()},e.onerror=()=>{r(new Error("Failed to load D3.js library"))}});if(document.head.appendChild(e),await t,!window.d3)throw new Error("D3.js not available after loading script");await this._scheduleDrawMeteogram("loadD3AndDraw-afterD3")}catch(e){console.error("Error loading D3.js:",e),this.setError("Failed to load D3.js visualization library. Please refresh the page.")}}async fetchWeatherData(){const e=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,t=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;if(console.debug(`[${c}] fetchWeatherData called with lat=${e}, lon=${t}`),!e||!t){this._checkAndUpdateLocation();const e=void 0!==this.latitude?parseFloat(Number(this.latitude).toFixed(4)):void 0,t=void 0!==this.longitude?parseFloat(Number(this.longitude).toFixed(4)):void 0;if(!e||!t)throw new Error("Could not determine location. Please check your card configuration or Home Assistant settings.")}this._weatherApiInstance&&this._weatherApiInstance.lat===e&&this._weatherApiInstance.lon===t||(this._weatherApiInstance=new i(e,t));const r=this._weatherApiInstance;return this.weatherDataPromise?(console.debug(`[${c}] Returning in-flight weather data promise`),this.weatherDataPromise):(this.weatherDataPromise=(async()=>{let e=null;try{const t=await r.getForecastData();if(!t)throw new Error("No forecast data available from WeatherAPI.");e=t,this.apiExpiresAt=r.expiresAt,this._statusApiSuccess=!0,this._lastApiSuccess=!0;let i=48;return"8h"===this.meteogramHours?i=8:"12h"===this.meteogramHours?i=12:"24h"===this.meteogramHours?i=24:"48h"===this.meteogramHours?i=48:"54h"===this.meteogramHours?i=54:"max"===this.meteogramHours&&(i=e.time.length),i<e.time.length&&Object.keys(e).forEach(t=>{e[t]=e[t].slice(0,i)}),e}catch(e){this._statusApiSuccess=!1;let t=r.getDiagnosticText();throw this.setError(t),new Error(`<br>Failed to get weather data: ${e.message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${t}`)}})(),this.weatherDataPromise)}cleanupChart(){try{if(this.svg&&"function"==typeof this.svg.remove&&(this.svg.remove(),this.svg=null),this.shadowRoot){const e=this.shadowRoot.querySelector("#chart");e&&(e.innerHTML="")}}catch(e){console.warn("Error cleaning up chart:",e)}}async _drawMeteogram(t="unknown"){var r,i;console.debug(`[${c}] _drawMeteogram called from: ${t}`);const a=Date.now();if(this.meteogramError&&a-this.lastErrorTime<6e4)return void this.errorCount++;if(this.meteogramError="",this._checkAndUpdateLocation(),!this.latitude||!this.longitude)return void this.setError("Location not available. Please check your card configuration or Home Assistant settings.");await this.updateComplete,this._logDomState();if(e.lastD3RetryTime||(e.lastD3RetryTime=0),!window.d3)try{return void await this.loadD3AndDraw()}catch(t){const r=Date.now();if(r-e.lastD3RetryTime<1e4)return;return e.lastD3RetryTime=r,void this.setError("D3.js library could not be loaded. Please refresh the page.")}this.cleanupChart(),await new Promise(e=>setTimeout(e,10));const o=null===(r=this.shadowRoot)||void 0===r?void 0:r.querySelector("#chart");if(o)this._renderChart(o,"_drawMeteogram");else if(console.error("Chart container not found in DOM"),this.isConnected){this.requestUpdate(),await this.updateComplete,await new Promise(e=>setTimeout(e,50));const e=null===(i=this.shadowRoot)||void 0===i?void 0:i.querySelector("#chart");if(!e){if(console.error("Chart container still not found after retry"),this.shadowRoot){const e=this.shadowRoot.querySelector(".card-content");if(e&&this.isConnected){e.innerHTML='<div id="chart"></div>';const t=this.shadowRoot.querySelector("#chart");if(t)return void this._renderChart(t,"_drawMeteogram-finalAttempt")}}return}this._renderChart(e,"_drawMeteogram-retry")}}_renderChart(e,t="unknown"){if(console.debug(`[${c}] _renderChart called from: ${t}`),this._chartRenderInProgress)return void console.debug(`[${c}] _renderChart: already in progress, skipping.`);this._chartRenderInProgress=!0,console.debug(`[${c}] _renderChart: starting render.`);const r=e.parentElement;let i,a,o=r?r.clientWidth:e.offsetWidth||350,s=r?r.clientHeight:e.offsetHeight||180;const n=Math.min(.7*window.innerHeight,520);if(this.fillContainer)i=e.offsetWidth>0?e.offsetWidth:o,a=e.offsetHeight>0?e.offsetHeight:s;else{const e=Math.min(.95*window.innerWidth,1200);i=Math.max(Math.min(o,e),300);const t=.5*i;a=Math.min(t,s,n)}const d=this.showWind?55:0;this._lastWidth=o,this._lastHeight=s,e.innerHTML="",this.fetchWeatherData().then(t=>{e.querySelector("svg")&&(e.innerHTML=""),this.svg=window.d3.select(e).append("svg").attr("width","100%").attr("height","100%").attr("viewBox",`0 0 ${i+140} ${a+(this.showWind?d:0)+24+70}`).attr("preserveAspectRatio","xMidYMid meet");Math.min(i,Math.max(300,90*(t.time.length-1)));let r=48;"8h"===this.meteogramHours?r=8:"12h"===this.meteogramHours?r=12:"24h"===this.meteogramHours?r=24:"48h"===this.meteogramHours?r=48:"54h"===this.meteogramHours?r=54:"max"===this.meteogramHours&&(r=t.time.length);const o=e=>e.slice(0,Math.min(r,e.length)+1),s={time:o(t.time),temperature:o(t.temperature),rain:o(t.rain),rainMin:o(t.rainMin),rainMax:o(t.rainMax),snow:o(t.snow),cloudCover:o(t.cloudCover),windSpeed:o(t.windSpeed),windDirection:o(t.windDirection),symbolCode:o(t.symbolCode),pressure:o(t.pressure)};this.renderMeteogram(this.svg,s,i,a,d,24),this.errorCount=0,this._weatherRetryTimeout&&(clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=null),this._setupResizeObserver(),this._setupVisibilityObserver(),this._setupMutationObserver()}).catch(()=>{this.setError("Weather data not available, retrying in 60 seconds"),this._weatherRetryTimeout&&clearTimeout(this._weatherRetryTimeout),this._weatherRetryTimeout=window.setTimeout(()=>{this.meteogramError="",this._drawMeteogram("retry-after-error")},6e4)}).finally(()=>{this._chartRenderInProgress=!1,console.debug(`[${c}] _renderChart: finished render.`),this._pendingRender&&(this._pendingRender=!1,console.debug(`[${c}] _renderChart: running pending render.`),this._drawMeteogram("pending-after-render"))})}getHaLocale(){return this.hass&&this.hass.language?this.hass.language:"en"}renderMeteogram(e,t,r,i,a=0,o=24){const s=window.d3,{time:n,temperature:d,rain:l,rainMin:h,rainMax:c,snow:u,cloudCover:g,windSpeed:p,windDirection:_,symbolCode:f,pressure:w}=t,b=n.length,v=this.getSystemTemperatureUnit(),y=d.map(e=>this.convertTemperature(e)),x=70,k=70,C=Math.min(r,Math.max(300,90*(b-1))),A=i-a;let S=C/(b-1);const $=s.scaleLinear().domain([0,b-1]).range([0,C]);S=$(1)-$(0);const M=x-30,D=[];for(let e=0;e<b;e++)0!==e&&n[e].getDate()===n[e-1].getDate()||D.push(e);const E=[];for(let e=0;e<D.length;++e){const t=D[e],r=e+1<D.length?D[e+1]:b;E.push({start:t,end:r})}e.selectAll(".day-bg").data(E).enter().append("rect").attr("class","day-bg").attr("x",e=>k+$(e.start)).attr("y",x-42).attr("width",e=>Math.min($(Math.max(e.end-1,e.start))-$(e.start)+S,C-$(e.start))).attr("height",A+42).attr("opacity",(e,t)=>t%2==0?.16:0),e.selectAll(".top-date-label").data(D).enter().append("text").attr("class","top-date-label").attr("x",(e,t)=>{const r=k+$(e);return t===D.length-1?Math.min(r,k+C-80):r}).attr("y",M).attr("text-anchor","start").attr("opacity",(e,t)=>{if(t===D.length-1)return 1;const r=k+$(e);return k+$(D[t+1])-r<100?0:1}).text(e=>{const t=n[e],r=this.getHaLocale();return t.toLocaleDateString(r,{weekday:"short",day:"2-digit",month:"short"})}),e.selectAll(".day-tic").data(D).enter().append("line").attr("class","day-tic").attr("x1",e=>k+$(e)).attr("x2",e=>k+$(e)).attr("y1",M+22).attr("y2",M+42).attr("stroke","#1a237e").attr("stroke-width",3).attr("opacity",.6);const L=e.append("g").attr("transform",`translate(${k},${x})`),T=y.filter(e=>null!==e),R=s.scaleLinear().domain([Math.floor(s.min(T)-2),Math.ceil(s.max(T)+2)]).range([A,0]),z=s.scaleLinear().domain([0,Math.max(2,s.max([...c,...l,...u])+1)]).range([A,0]);let I;if(this.showPressure){const e=s.extent(w),t=.1*(e[1]-e[0]);I=s.scaleLinear().domain([5*Math.floor((e[0]-t)/5),5*Math.ceil((e[1]+t)/5)]).range([A,0])}if(L.append("g").attr("class","xgrid").selectAll("line").data(s.range(b)).enter().append("line").attr("x1",e=>$(e)).attr("x2",e=>$(e)).attr("y1",0).attr("y2",A).attr("stroke","currentColor").attr("stroke-width",1),this.showWind){const t=x+A,r=e.append("g").attr("transform",`translate(${k},${t})`),i=a-10,o=[];for(let e=0;e<b;e++)n[e].getHours()%2==0&&o.push(e);r.selectAll(".wind-band-grid").data(o).enter().append("line").attr("class","wind-band-grid").attr("x1",e=>$(e)).attr("x2",e=>$(e)).attr("y1",0).attr("y2",i).attr("stroke","currentColor").attr("stroke-width",1),r.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",C).attr("height",i).attr("stroke","currentColor").attr("stroke-width",2).attr("fill","none")}if(L.selectAll(".twentyfourh-line").data(D.slice(1)).enter().append("line").attr("class","twentyfourh-line").attr("x1",e=>$(e)).attr("x2",e=>$(e)).attr("y1",0).attr("y2",A).attr("stroke","var(--meteogram-grid-color, #b8c4d9)").attr("stroke-width",3).attr("stroke-dasharray","6,5").attr("opacity",.7),this.showCloudCover){const e=.01*A,t=.2*A,r=[];for(let i=0;i<b;i++)r.push([$(i),e+t/2*(1-g[i]/100)]);for(let i=b-1;i>=0;i--)r.push([$(i),e+t/2*(1+g[i]/100)]);L.append("path").attr("class","cloud-area").attr("d",s.line().x(e=>e[0]).y(e=>e[1]).curve(s.curveLinearClosed)(r))}this.showPressure&&I&&(L.append("g").attr("class","pressure-axis").attr("transform",`translate(${C}, 0)`).call(s.axisRight(I).tickFormat(e=>`${e}`)),L.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(${C+50},${A/2}) rotate(90)`).text(m(this.hass,"ui.card.meteogram.attributes.air_pressure","Pressure")+" (hPa)"),L.append("text").attr("class","legend legend-pressure").attr("x",340).attr("y",-45).text(m(this.hass,"ui.card.meteogram.attributes.air_pressure","Pressure")+" (hPa)")),L.append("g").attr("class","temperature-axis").call(window.d3.axisLeft(R).tickFormat(e=>`${e}`)),L.append("g").attr("class","grid").call(window.d3.axisLeft(R).tickSize(-C).tickFormat(()=>"")),L.append("text").attr("class","axis-label").attr("text-anchor","middle").attr("transform",`translate(-50,${A/2}) rotate(-90)`).text(m(this.hass,"ui.card.weather.attributes.temperature","Temperature")+` (${v})`),L.append("line").attr("class","line").attr("x1",0).attr("x2",C).attr("y1",0).attr("y2",0).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),L.append("line").attr("class","line").attr("x1",0).attr("x2",C).attr("y1",A).attr("y2",A).attr("stroke","var(--meteogram-grid-color, #e0e0e0)"),L.append("line").attr("class","line").attr("x1",C).attr("x2",C).attr("y1",0).attr("y2",A).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),L.append("line").attr("class","line").attr("x1",0).attr("x2",0).attr("y1",0).attr("y2",A).attr("stroke","var(--meteogram-grid-color, #e0e0e0)").attr("stroke-width",3),this.showCloudCover&&L.append("text").attr("class","legend legend-cloud").attr("x",0).attr("y",-45).text(m(this.hass,"ui.card.meteogram.attributes.cloud_coverage","Cloud Cover")+" (%)"),L.append("text").attr("class","legend legend-temp").attr("x",200).attr("y",-45).text(m(this.hass,"ui.card.meteogram.attributes.temperature","Temperature")+` (${v})`),L.append("text").attr("class","legend legend-rain").attr("x",480).attr("y",-45).text(m(this.hass,"ui.card.meteogram.attributes.precipitation","Rain")+" (mm)"),L.append("text").attr("class","legend legend-snow").attr("x",630).attr("y",-45).text(m(this.hass,"ui.card.meteogram.attributes.snow","Snow")+" (mm)");const P=s.line().defined(e=>null!==e).x((e,t)=>$(t)).y((e,t)=>null!==y[t]?R(y[t]):0);if(L.append("path").datum(y).attr("class","temp-line").attr("d",P).attr("stroke","currentColor"),this.showPressure&&I){const e=s.line().defined(e=>!isNaN(e)).x((e,t)=>$(t)).y(e=>I(e));L.append("path").datum(w).attr("class","pressure-line").attr("d",e).attr("stroke","currentColor")}if(this.showWeatherIcons){const e=this.denseWeatherIcons?1:2;L.selectAll(".weather-icon").data(f).enter().append("foreignObject").attr("class","weather-icon").attr("x",(e,t)=>$(t)-20).attr("y",(e,t)=>{const r=y[t];return null!==r?R(r)-40:-999}).attr("width",40).attr("height",40).attr("opacity",(t,r)=>null!==y[r]&&r%e===0?1:0).each((t,r,i)=>{if(r%e!==0)return;const a=i[r];if(!t)return;const o=t.replace(/^lightssleet/,"lightsleet").replace(/^lightssnow/,"lightsnow");this.getIconSVG(o).then(e=>{if(e){const t=document.createElement("div");t.style.width="40px",t.style.height="40px",t.innerHTML=e,a.appendChild(t)}else console.warn(`Failed to load icon: ${o}`)}).catch(e=>{console.error(`Error loading icon ${o}:`,e)})})}const F=Math.min(26,.8*S);if(this.showRain&&(L.selectAll(".rain-max-bar").data(c.slice(0,b-1)).enter().append("rect").attr("class","rain-max-bar").attr("x",(e,t)=>$(t)+S/2-F/2).attr("y",e=>{const t=A-z(e),r=t<2&&e>0?2:.7*t;return z(0)-r}).attr("width",F).attr("height",e=>{const t=A-z(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor"),L.selectAll(".rain-bar").data(l.slice(0,b-1)).enter().append("rect").attr("class","rain-bar").attr("x",(e,t)=>$(t)+S/2-F/2).attr("y",e=>{const t=A-z(e),r=t<2&&e>0?2:.7*t;return z(0)-r}).attr("width",F).attr("height",e=>{const t=A-z(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor"),L.selectAll(".rain-label").data(l.slice(0,b-1)).enter().append("text").attr("class","rain-label").attr("x",(e,t)=>$(t)+S/2).attr("y",e=>{const t=A-z(e),r=t<2&&e>0?2:.7*t;return z(0)-r-4}).text(e=>e<=0?"":e<1?e.toFixed(1):e.toFixed(0)).attr("opacity",e=>e>0?1:0),L.selectAll(".rain-max-label").data(c.slice(0,b-1)).enter().append("text").attr("class","rain-max-label").attr("x",(e,t)=>$(t)+S/2).attr("y",e=>{const t=A-z(e),r=t<2&&e>0?2:.7*t;return z(0)-r-18}).text((e,t)=>e<=l[t]?"":e<1?e.toFixed(1):e.toFixed(0)).attr("opacity",(e,t)=>e>l[t]?1:0),L.selectAll(".snow-bar").data(u.slice(0,b-1)).enter().append("rect").attr("class","snow-bar").attr("x",(e,t)=>$(t)+S/2-F/2).attr("y",(e,t)=>{const r=A-z(u[t]),i=r<2&&u[t]>0?2:.7*r;return z(0)-i}).attr("width",F).attr("height",e=>{const t=A-z(e);return t<2&&e>0?2:.7*t}).attr("fill","currentColor")),this.showWind){const t=x+A,i=e.append("g").attr("transform",`translate(${k},${t})`),o=a-10,d=o/2;i.append("rect").attr("class","wind-band-bg").attr("x",0).attr("y",0).attr("width",C).attr("height",o);const l=[];for(let e=0;e<b;e++)n[e].getHours()%2==0&&l.push(e);i.selectAll(".wind-band-grid").data(l).enter().append("line").attr("class","wind-band-grid").attr("x1",e=>$(e)).attr("x2",e=>$(e)).attr("y1",0).attr("y2",o).attr("stroke","currentColor").attr("stroke-width",1);const h=D.slice(1);i.selectAll(".twentyfourh-line-wind").data(h).enter().append("line").attr("class","twentyfourh-line-wind").attr("x1",e=>$(e)).attr("x2",e=>$(e)).attr("y1",0).attr("y2",o);const c=[];for(let e=0;e<b;e++)n[e].getHours()%2==0&&c.push(e);for(let e=0;e<c.length-1;e++){const t=c[e],a=c[e+1];if(r<400&&e%2!=0)continue;const o=($(t)+$(a))/2,n=Math.floor((t+a)/2),l=p[n],h=_[n],u=r<400?18:23,m=r<400?30:38,g=s.scaleLinear().domain([0,Math.max(15,s.max(p)||20)]).range([u,m])(l);this.drawWindBarb(i,o,d,l,h,g,r<400?.7:.8)}i.append("rect").attr("class","wind-band-outline").attr("x",0).attr("y",0).attr("width",C).attr("height",o).attr("stroke","currentColor").attr("stroke-width",1).attr("fill","none")}const O=x+A+a+18;e.selectAll(".bottom-hour-label").data(t.time).enter().append("text").attr("class","bottom-hour-label").attr("x",(e,t)=>k+$(t)).attr("y",O).attr("text-anchor","middle").text((e,t)=>{const i=this.getHaLocale(),a=e.toLocaleTimeString(i,{hour:"2-digit",hour12:!1});return r<400?t%6==0?a:"":r>800?t%2==0?a:"":t%3==0?a:""})}drawWindBarb(e,t,r,i,a,o,s=.8){const n=e.append("g").attr("transform",`translate(${t},${r}) rotate(${a}) scale(${s})`),d=-o/2,l=+o/2;if(i<2)return void n.append("circle").attr("class","wind-barb-calm").attr("cx",0).attr("cy",0).attr("r",4);n.append("line").attr("class","wind-barb").attr("x1",0).attr("y1",d).attr("x2",0).attr("y2",l),n.append("circle").attr("class","wind-barb-dot").attr("cx",0).attr("cy",l).attr("r",4);let h=i,c=d,u=Math.floor(h/10);h-=10*u;let m=Math.floor(h/5);h-=5*m;for(let e=0;e<u;e++,c+=7)n.append("line").attr("class","wind-barb-feather").attr("x1",0).attr("y1",c).attr("x2",12).attr("y2",c+3);for(let e=0;e<m;e++,c+=7)n.append("line").attr("class","wind-barb-half").attr("x1",0).attr("y1",c).attr("x2",6).attr("y2",c+2)}render(){this._updateDarkMode();const{html:e}=window.litElementModules,t=Object.entries(this.styles||{}).map(([e,t])=>`${e}: ${t};`).join(" "),a=i.METEOGRAM_CARD_API_CALL_COUNT>0?Math.round(100*i.METEOGRAM_CARD_API_SUCCESS_COUNT/i.METEOGRAM_CARD_API_CALL_COUNT):0,o=`API Success Rate: ${i.METEOGRAM_CARD_API_SUCCESS_COUNT}/${i.METEOGRAM_CARD_API_CALL_COUNT} (${a}%) since ${u.toISOString()}`;return e`
                <ha-card style="${t}">
                    ${this.title?e`
                        <div class="card-header">${this.title}</div>`:""}
                    <div class="card-content">
                        <div class="attribution">
                            ${m(this.hass,"ui.card.meteogram.attribution","Data from")} <a href="https://met.no/"
                                                                                                  target="_blank"
                                                                                                  rel="noopener"
                                                                                                  style="color: inherit;">met.no</a>
                            <span
                                    style="margin-left:8px; vertical-align:middle;"
                                    title="${this._lastApiSuccess?m(this.hass,"ui.card.meteogram.status.success","success")+` : ${o}`:null===this._statusApiSuccess?m(this.hass,"ui.card.meteogram.status.cached","cached")+` : ${o}`:m(this.hass,"ui.card.meteogram.status.failed","failed")+` : ${o}`}"
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
                                        <b>${m(this.hass,"ui.card.meteogram.status_panel","Status Panel")}</b>
                                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:6px;">
                                            <div>
                                                <span>${m(this.hass,"ui.card.meteogram.status.expires_at","Expires At")}
                                                    : ${this.apiExpiresAt?new Date(this.apiExpiresAt).toISOString():"unknown"}</span><br>
                                                <span>${m(this.hass,"ui.card.meteogram.status.last_render","Last Render")}
                                                    : ${this._statusLastRender||"unknown"}</span><br>
                                                <span>${m(this.hass,"ui.card.meteogram.status.last_data_fetch","Last Data Fetch")}
                                                    : ${this._statusLastFetch||"unknown"}</span>
                                            </div>
                                            <div>
                                                <span
                                                        title="${this._lastApiSuccess?m(this.hass,"ui.card.meteogram.status.success","success")+` : ${o}`:null===this._statusApiSuccess?m(this.hass,"ui.card.meteogram.status.cached","cached")+` : ${o}`:m(this.hass,"ui.card.meteogram.status.failed","failed")+` : ${o}`}"
                                                >
                                                    ${m(this.hass,"ui.card.meteogram.status.api_success","API Success")}
                                                        : ${this._lastApiSuccess?"✅":null===this._statusApiSuccess?"❎":"❌"}
                                                </span>
                                                <br>
                                                <span>Card version: <code>${r}</code></span><br>
                                                <span>Client type: <code>${function(){const e=navigator.userAgent;return/Home Assistant/.test(e)?"HA Companion":/Edg/.test(e)?"Edge":/Chrome/.test(e)?"Chrome":/Android/.test(e)?"Android":/iPhone|iPad|iPod/.test(e)?"iOS":/Firefox/.test(e)?"Firefox":"Unknown"}()}</code></span><br>
                                                <span>${o}</span>

                                            </div>
                                        </div>
                                    </div>
                                `:""}
                            `}
                    </div>
                </ha-card>
            `}_logDomState(){if(this.errorCount>0){if(console.debug("DOM state check:"),console.debug("- shadowRoot exists:",!!this.shadowRoot),this.shadowRoot){const e=this.shadowRoot.querySelector("#chart");console.debug("- chart div exists:",!!e),e&&console.debug("- chart div size:",e.offsetWidth,"x",e.offsetHeight)}console.debug("- Is connected:",this.isConnected),console.debug("- Chart loaded:",this.chartLoaded)}}setError(e){const t=Date.now();this.meteogramError=e,this.lastErrorTime=t,this.errorCount=1,console.error("Meteogram error:",e),e===this.meteogramError?(this.errorCount++,t-this.lastErrorTime>1e4&&(this.meteogramError=`${e} (occurred ${this.errorCount} times)`,this.lastErrorTime=t)):(this.errorCount=1,this.meteogramError=e,this.lastErrorTime=t,console.error("Meteogram error:",e))}_updateDarkMode(){let e=!1;e=this.hass&&this.hass.themes&&"boolean"==typeof this.hass.themes.darkMode?this.hass.themes.darkMode:document.documentElement.classList.contains("dark-theme")||document.body.classList.contains("dark-theme"),e?this.setAttribute("dark",""):this.removeAttribute("dark")}getSystemTemperatureUnit(){if(this.hass&&this.hass.config&&this.hass.config.unit_system&&this.hass.config.unit_system.temperature){const e=this.hass.config.unit_system.temperature;if("°F"===e||"°C"===e)return e;if("F"===e)return"°F";if("C"===e)return"°C"}return"°C"}convertTemperature(e){if(null==e)return e;return"°F"===this.getSystemTemperatureUnit()?9*e/5+32:e}};p.styles=n`
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
        `,t([l({type:String})],p.prototype,"title",void 0),t([l({type:Number})],p.prototype,"latitude",void 0),t([l({type:Number})],p.prototype,"longitude",void 0),t([l({attribute:!1})],p.prototype,"hass",void 0),t([l({type:Boolean})],p.prototype,"showCloudCover",void 0),t([l({type:Boolean})],p.prototype,"showPressure",void 0),t([l({type:Boolean})],p.prototype,"showRain",void 0),t([l({type:Boolean})],p.prototype,"showWeatherIcons",void 0),t([l({type:Boolean})],p.prototype,"showWind",void 0),t([l({type:Boolean})],p.prototype,"denseWeatherIcons",void 0),t([l({type:String})],p.prototype,"meteogramHours",void 0),t([l({type:Boolean})],p.prototype,"fillContainer",void 0),t([l({type:Object})],p.prototype,"styles",void 0),t([l({type:Boolean})],p.prototype,"diagnostics",void 0),t([g()],p.prototype,"chartLoaded",void 0),t([g()],p.prototype,"meteogramError",void 0),t([g()],p.prototype,"errorCount",void 0),t([g()],p.prototype,"lastErrorTime",void 0),t([g()],p.prototype,"_statusExpiresAt",void 0),t([g()],p.prototype,"_statusLastRender",void 0),t([g()],p.prototype,"_statusLastFetch",void 0),t([g()],p.prototype,"_statusApiSuccess",void 0),p=e=t([d("meteogram-card")],p),window.customElements.get("meteogram-card")||customElements.define("meteogram-card",p);let _=class extends HTMLElement{constructor(){super(...arguments),this._config={},this._initialized=!1,this._elements=new Map}set hass(e){this._hass=e}get hass(){return this._hass}setConfig(e){this._config=e||{},this._initialized?this._updateValues():this._initialize()}get config(){return this._config}connectedCallback(){this._initialized||this._initialize()}_initialize(){this.render(),this._initialized=!0,setTimeout(()=>this._updateValues(),0)}_updateValues(){var e,t,r,i;if(!this._initialized)return;const a=(e,t,r="value")=>{e&&e[r]!==t&&(e[r]=t)};a(this._elements.get("title"),this._config.title||""),a(this._elements.get("latitude"),void 0!==this._config.latitude?String(this._config.latitude):void 0!==(null===(t=null===(e=this._hass)||void 0===e?void 0:e.config)||void 0===t?void 0:t.latitude)?String(this._hass.config.latitude):""),a(this._elements.get("longitude"),void 0!==this._config.longitude?String(this._config.longitude):void 0!==(null===(i=null===(r=this._hass)||void 0===r?void 0:r.config)||void 0===i?void 0:i.longitude)?String(this._hass.config.longitude):""),a(this._elements.get("show_cloud_cover"),void 0===this._config.show_cloud_cover||this._config.show_cloud_cover,"checked"),a(this._elements.get("show_pressure"),void 0===this._config.show_pressure||this._config.show_pressure,"checked"),a(this._elements.get("show_rain"),void 0===this._config.show_rain||this._config.show_rain,"checked"),a(this._elements.get("show_weather_icons"),void 0===this._config.show_weather_icons||this._config.show_weather_icons,"checked"),a(this._elements.get("show_wind"),void 0===this._config.show_wind||this._config.show_wind,"checked"),a(this._elements.get("dense_weather_icons"),void 0===this._config.dense_weather_icons||this._config.dense_weather_icons,"checked"),a(this._elements.get("meteogram_hours"),this._config.meteogram_hours||"48h"),a(this._elements.get("fill_container"),void 0!==this._config.fill_container&&this._config.fill_container,"checked"),a(this._elements.get("diagnostics"),void 0!==this._config.diagnostics?this._config.diagnostics:h,"checked")}render(){var e,t,r,i,a,o,s;const n=this.hass,d=this._config;if(!n||!d)return this.innerHTML='<ha-card><div style="padding:16px;">Loading Home Assistant context...</div></ha-card>',void setTimeout(()=>this.render(),300);const l=null!==(t=null===(e=null==n?void 0:n.config)||void 0===e?void 0:e.latitude)&&void 0!==t?t:"",c=null!==(i=null===(r=null==n?void 0:n.config)||void 0===r?void 0:r.longitude)&&void 0!==i?i:"",u=void 0===this._config.show_cloud_cover||this._config.show_cloud_cover,g=void 0===this._config.show_pressure||this._config.show_pressure,p=void 0===this._config.show_rain||this._config.show_rain,_=void 0===this._config.show_weather_icons||this._config.show_weather_icons,f=void 0===this._config.show_wind||this._config.show_wind,w=void 0===this._config.dense_weather_icons||this._config.dense_weather_icons,b=this._config.meteogram_hours||"48h",v=void 0!==this._config.fill_container&&this._config.fill_container,y=void 0!==this._config.diagnostics?this._config.diagnostics:h,x=document.createElement("div");x.innerHTML=`\n  <style>\n    ha-card {\n      padding: 16px;\n    }\n    .values {\n      padding-left: 16px;\n      margin: 8px 0;\n    }\n    .row {\n      display: flex;\n      margin-bottom: 12px;\n      align-items: center;\n    }\n    ha-textfield {\n      width: 100%;\n    }\n    .side-by-side {\n      display: flex;\n      gap: 12px;\n    }\n    .side-by-side > * {\n      flex: 1;\n    }\n    h3 {\n      font-size: 18px;\n      color: var(--primary-text-color);\n      font-weight: 500;\n      margin-bottom: 12px;\n      margin-top: 0;\n    }\n    .help-text {\n      color: var(--secondary-text-color);\n      font-size: 0.875rem;\n      margin-top: 4px;\n    }\n    .info-text {\n      color: var(--primary-text-color);\n      opacity: 0.8;\n      font-size: 0.9rem;\n      font-style: italic;\n      margin: 4px 0 16px 0;\n    }\n    .toggle-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 8px;\n    }\n    .toggle-label {\n      flex-grow: 1;\n    }\n    .toggle-section {\n      margin-top: 16px;\n      border-top: 1px solid var(--divider-color);\n      padding-top: 16px;\n    }\n  </style>\n  <ha-card>\n    <h3>${(null===(a=this._hass)||void 0===a?void 0:a.localize)?this._hass.localize("ui.editor.meteogram.title"):"Meteogram Card Settings"}</h3>\n    <div class="values">\n      <div class="row">\n        <ha-textfield\n          label="${(null===(o=this._hass)||void 0===o?void 0:o.localize)?this._hass.localize("ui.editor.meteogram.title_label"):"Title"}"\n          id="title-input"\n          .value="${this._config.title||""}"\n        ></ha-textfield>\n      </div>\n\n      <p class="info-text">\n        ${(null===(s=this._hass)||void 0===s?void 0:s.localize)?this._hass.localize("ui.editor.meteogram.location_info"):"Location coordinates will be used to fetch weather data directly from Met.no API."}\n        ${l?m(this._hass,"ui.editor.meteogram.using_ha_location","Using Home Assistant's location by default."):""}\n      </p>\n\n      <div class="side-by-side">\n        <ha-textfield\n          label="${m(this._hass,"ui.editor.meteogram.latitude","Latitude")}"\n          id="latitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this._config.latitude?this._config.latitude:l}"\n          placeholder="${l?`${m(this._hass,"ui.editor.meteogram.default","Default")}: ${l}`:""}"\n        ></ha-textfield>\n\n        <ha-textfield\n          label="${m(this._hass,"ui.editor.meteogram.longitude","Longitude")}"\n          id="longitude-input"\n          type="number"\n          step="any"\n          .value="${void 0!==this._config.longitude?this._config.longitude:c}"\n          placeholder="${c?`${m(this._hass,"ui.editor.meteogram.default","Default")}: ${c}`:""}"\n        ></ha-textfield>\n      </div>\n      <p class="help-text">${m(this._hass,"ui.editor.meteogram.leave_empty","Leave empty to use Home Assistant's configured location")}</p>\n\n      <div class="toggle-section">\n        <h3>${m(this._hass,"ui.editor.meteogram.display_options","Display Options")}</h3>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.cloud_coverage","Show Cloud Cover")}</div>\n          <ha-switch\n            id="show-cloud-cover"\n            .checked="${u}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.air_pressure","Show Pressure")}</div>\n          <ha-switch\n            id="show-pressure"\n            .checked="${g}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.precipitation","Show Rain")}</div>\n          <ha-switch\n            id="show-rain"\n            .checked="${p}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.weather_icons","Show Weather Icons")}</div>\n          <ha-switch\n            id="show-weather-icons"\n            .checked="${_}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.wind","Show Wind")}</div>\n          <ha-switch\n            id="show-wind"\n            .checked="${f}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.dense_icons","Dense Weather Icons (every hour)")}</div>\n          <ha-switch\n            id="dense-weather-icons"\n            .checked="${w}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">${m(this._hass,"ui.editor.meteogram.attributes.fill_container","Fill Container")}</div>\n          <ha-switch\n            id="fill-container"\n            .checked="${v}"\n          ></ha-switch>\n        </div>\n\n        <div class="toggle-row">\n          <div class="toggle-label">Diagnostics (debug logging)</div>\n          <ha-switch\n            id="diagnostics"\n            .checked="${y}"\n          ></ha-switch>\n        </div>\n      </div>\n\n      <div class="row">\n        <label for="meteogram-hours-select" style="margin-right:8px;">${m(this._hass,"ui.editor.meteogram.meteogram_length","Meteogram Length")}</label>\n        <select id="meteogram-hours-select">\n          <option value="8h" ${"8h"===b?"selected":""}>${m(this._hass,"ui.editor.meteogram.hours_8","8 hours")}</option>\n          <option value="12h" ${"12h"===b?"selected":""}>${m(this._hass,"ui.editor.meteogram.hours_12","12 hours")}</option>\n          <option value="24h" ${"24h"===b?"selected":""}>${m(this._hass,"ui.editor.meteogram.hours_24","24 hours")}</option>\n          <option value="48h" ${"48h"===b?"selected":""}>${m(this._hass,"ui.editor.meteogram.hours_48","48 hours")}</option>\n          <option value="54h" ${"54h"===b?"selected":""}>${m(this._hass,"ui.editor.meteogram.hours_54","54 hours")}</option>\n          <option value="max" ${"max"===b?"selected":""}>${m(this._hass,"ui.editor.meteogram.hours_max","Max available")}</option>\n        </select>\n      </div>\n      <p class="help-text">${m(this._hass,"ui.editor.meteogram.choose_hours","Choose how many hours to show in the meteogram")}</p>\n    </div>\n  </ha-card>\n`,this.innerHTML="",this.appendChild(x),setTimeout(()=>{const e=this.querySelector("#title-input");e&&(e.configValue="title",e.addEventListener("input",this._valueChanged.bind(this)),this._elements.set("title",e));const t=this.querySelector("#latitude-input");t&&(t.configValue="latitude",t.addEventListener("input",this._valueChanged.bind(this)),this._elements.set("latitude",t));const r=this.querySelector("#longitude-input");r&&(r.configValue="longitude",r.addEventListener("input",this._valueChanged.bind(this)),this._elements.set("longitude",r));const i=this.querySelector("#show-cloud-cover");i&&(i.configValue="show_cloud_cover",i.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_cloud_cover",i));const a=this.querySelector("#show-pressure");a&&(a.configValue="show_pressure",a.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_pressure",a));const o=this.querySelector("#show-rain");o&&(o.configValue="show_rain",o.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_rain",o));const s=this.querySelector("#show-weather-icons");s&&(s.configValue="show_weather_icons",s.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_weather_icons",s));const n=this.querySelector("#show-wind");n&&(n.configValue="show_wind",n.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("show_wind",n));const d=this.querySelector("#dense-weather-icons");d&&(d.configValue="dense_weather_icons",d.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("dense_weather_icons",d));const l=this.querySelector("#meteogram-hours-select");l&&(l.configValue="meteogram_hours",l.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("meteogram_hours",l));const h=this.querySelector("#fill-container");h&&(h.configValue="fill_container",h.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("fill_container",h));const c=this.querySelector("#diagnostics");c&&(c.configValue="diagnostics",c.addEventListener("change",this._valueChanged.bind(this)),this._elements.set("diagnostics",c)),this._updateValues()},0)}_valueChanged(e){const t=e.target;if(!this._config||!t||!t.configValue)return;let r=t.value||"";if("HA-SWITCH"===t.tagName)r=t.checked;else if("number"===t.type)if(""===r)r=void 0;else{const e=parseFloat(r.toString());isNaN(e)||(r=e)}else""===r&&(r=void 0);this._config={...this._config,[t.configValue]:r},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}}))}};_=t([d("meteogram-card-editor")],_),window.customCards=window.customCards||[],window.customCards.push({type:"meteogram-card",name:c,description:"A custom card showing a meteogram with wind barbs.",version:r,preview:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/images/meteogram-card.png",documentationURL:"https://github.com/jm-cook/lovelace-meteogram-card/blob/main/README.md"})};window.litElementModules?g():void 0!==e?e.then(()=>{g()}):console.error("Lit modules not found and litModulesPromise not available");
