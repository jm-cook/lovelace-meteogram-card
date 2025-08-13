// Use only the imports that are actually needed for type checking
import {PropertyValues} from "lit";
// Import our local types
import {MeteogramCardConfig, MeteogramCardEditorElement} from "./types";
// Version info - update this when releasing new versions
import {version} from "../package.json";

// Add logEnabled boolean at the outer scope
const logEnabled = version.includes("beta");

const CARD_NAME = "Meteogram Card";

// Declare litModulesPromise to avoid TypeScript error
// This will be defined in the banner added by rollup
declare const litModulesPromise: Promise<any>;

// Add TypeScript declarations for window extensions
declare global {
    interface Window {
        litElementModules: any;
        customCards?: Array<{ type: string, name: string, description: string }>;
        d3: any; // Add d3 to the Window interface
    }

    // Fix the d3 namespace declaration to remove the BaseType reference
    namespace d3 {
        // Simple interface that avoids referencing non-existent types
        interface Selection {
            node(): Element | null;

            selectAll(selector: string): any;

            remove(): void;
        }
    }
}

// Print version info - based on mushroom cards implementation
const printVersionInfo = () => {
    // Use the blue color from wind barbs and add weather emojis
    console.info(
        `%c☀️ ${CARD_NAME} ${version} ⚡️🌦️`,
        "color: #1976d2; font-weight: bold; background: white"
    );
};

// Clean up expired cached forecasts on startup
const cleanupExpiredForecastCache = () => {
    try {
        const cacheStr = localStorage.getItem('meteogram-card-weather-cache');
        if (!cacheStr) return;
        const cacheObj = JSON.parse(cacheStr);
        let changed = false;
        const now = Date.now();
        for (const key in cacheObj) {
            if (cacheObj[key]?.expiresAt && now >= cacheObj[key].expiresAt) {
                delete cacheObj[key];
                changed = true;
            }
        }
        if (changed) {
            localStorage.setItem('meteogram-card-weather-cache', JSON.stringify(cacheObj));
        }
    } catch (e) {
        // Ignore storage errors
    }
};

// This wrapper ensures modules are loaded before code execution
const runWhenLitLoaded = () => {
    // Clean up expired cache entries before anything else
    cleanupExpiredForecastCache();

    // Print version info on startup
    printVersionInfo();

    // Get Lit modules from the global variable set in the banner
    const {LitElement, css, customElement, property, state} = (window as any).litElementModules;

// Define interfaces for better type safety
    interface MeteogramData {
        pressure: number[];
        time: Date[];
        temperature: (number | null)[];
        rain: number[];
        rainMin: number[]; // Add min precipitation array
        rainMax: number[]; // Add max precipitation array
        snow: number[];
        cloudCover: number[];
        windSpeed: number[];
        windDirection: number[];
        symbolCode: string[];
    }

// For day boundary shading
    interface DayRange {
        start: number;
        end: number;
    }

// Define a custom type for inputs that need configValue property
    interface ConfigurableHTMLElement extends HTMLElement {
        configValue?: string;
        value?: string | number;
        checked?: boolean;
    }

    @customElement("meteogram-card")
    class MeteogramCard extends LitElement {
        @property({type: String}) title = "";
        @property({type: Number}) latitude?: number;
        @property({type: Number}) longitude?: number;
        @property({attribute: false}) hass!: any; // Changed from HomeAssistant to any

        // Add new configuration properties with default values
        @property({type: Boolean}) showCloudCover = true;
        @property({type: Boolean}) showPressure = true;
        @property({type: Boolean}) showRain = true;
        @property({type: Boolean}) showWeatherIcons = true;
        @property({type: Boolean}) showWind = true;
        @property({type: Boolean}) denseWeatherIcons = true; // NEW: icon density config

        @state() private chartLoaded = false;
        @state() private meteogramError = "";
        @state() private errorCount = 0;
        @state() private lastErrorTime = 0;

        // Add storage keys for location caching
        private static readonly STORAGE_KEY_LAT = 'meteogram-card-latitude';
        private static readonly STORAGE_KEY_LON = 'meteogram-card-longitude';

        private iconCache = new Map<string, string>();
        private iconBasePath = 'https://raw.githubusercontent.com/metno/weathericons/refs/heads/main/weather/svg/';

        // Add a method to fetch icons
        private async getIconSVG(iconName: string): Promise<string> {
            // Return from cache if available
            if (this.iconCache.has(iconName)) {
                return this.iconCache.get(iconName)!;
            }

            try {
                // Add a console log to debug the URL
                const iconUrl = `${this.iconBasePath}${iconName}.svg`;

                // Fetch from GitHub
                const response = await fetch(iconUrl);

                if (!response.ok) {
                    console.warn(`Failed to load icon: ${iconName}, status: ${response.status}`);
                    return '';
                }

                const svgText = await response.text();

                // Basic validation that we got SVG content
                if (!svgText.includes('<svg') || svgText.length < 20) {
                    console.warn(`Invalid SVG content for ${iconName}`);
                    return '';
                }

                // Store in cache
                this.iconCache.set(iconName, svgText);
                return svgText;
            } catch (error: unknown) {
                console.error(`Error loading icon ${iconName}:`, error);
                return ''; // Return empty SVG on error
            }
        }


        // Track if initial render has happened to avoid duplicate meteograms
        private hasRendered = false;

        // Keep reference to the D3 selection to clean it up properly
        private svg: any = null;

        // Track element size for resize detection
        private _resizeObserver: ResizeObserver | null = null;
        private _lastWidth = 0;
        private _lastHeight = 0;

        // Intersection observer for visibility detection
        private _intersectionObserver: IntersectionObserver | null = null;

        // Mutation observer for detecting DOM changes
        private _mutationObserver: MutationObserver | null = null;

        // Keep track of update cycles
        private _isInitialized = false;

        // Keep track of last rendered data to avoid unnecessary redraws
        private _lastRenderedData: string | null = null;

        // Add a flag to track if chart rendering is in progress
        private _chartRenderInProgress = false;

        // Change these from static to instance properties
        private apiExpiresAt: number | null = null;
        private apiLastModified: string | null = null;
        private cachedWeatherData: MeteogramData | null = null;
        private weatherDataPromise: Promise<MeteogramData> | null = null;

        // Add this property to the class
        private _redrawScheduled = false;

        // Helper to schedule a meteogram draw if not already scheduled
        private _scheduleDrawMeteogram() {
            if (this._redrawScheduled) return;
            this._redrawScheduled = true;
            setTimeout(() => {
                this._drawMeteogram();
                this._redrawScheduled = false;
            }, 50);
        }

        static styles = css`
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
                stroke: orange;
                stroke-width: 3;
                fill: none;
            }

            .pressure-line {
                stroke: var(--meteogram-pressure-color, #90caf9);
                stroke-width: 4; /* Increased thickness */
                stroke-dasharray: 3, 3;
                fill: none;
            }

            .rain-bar {
                fill: deepskyblue;
                opacity: 0.8;
            }

            .rain-min-bar {
                fill: #0074d9;
                opacity: 0.95;
            }

            .rain-max-bar {
                fill: #7fdbff;
                opacity: 0.5;
            }

            .rain-min-label {
                font: 13px sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: #0058a3;
            }

            .rain-max-label {
                font: 13px sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: #2693e6;
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
                font: 14px sans-serif;
                fill: var(--primary-text-color, #222);
            }

            .legend {
                font: 14px sans-serif;
                fill: var(--primary-text-color, #222);
            }

            .wind-barb {
                stroke: #1976d2;
                stroke-width: 2;
                fill: none;
            }

            .wind-barb-feather {
                stroke: #1976d2;
                stroke-width: 1.4;
            }

            .wind-barb-half {
                stroke: #1976d2;
                stroke-width: 0.8;
            }

            .wind-barb-calm {
                stroke: #1976d2;
                fill: none;
            }

            .wind-barb-dot {
                fill: #1976d2;
            }

            /* Improve wind barb contrast in dark mode */

            :host([dark]) .wind-barb,
            :host([dark]) .wind-barb-feather,
            :host([dark]) .wind-barb-half,
            :host([dark]) .wind-barb-calm {
                stroke: #fff;
            }

            :host([dark]) .wind-barb-dot {
                fill: #fff;
            }

            .top-date-label {
                font: 16px sans-serif;
                fill: var(--primary-text-color, #222);
                font-weight: bold;
                dominant-baseline: hanging;
            }

            .bottom-hour-label {
                font: 13px sans-serif;
                fill: var(--meteogram-timescale-color, #ffb300);
            }

            .rain-label {
                font: 13px sans-serif;
                text-anchor: middle;
                font-weight: bold;
                fill: #0058a3;
            }

            .day-bg {
                fill: transparent !important;
                opacity: 0;
                pointer-events: none;
            }

            .wind-band-bg {
                fill: transparent;
            }
        `;

        // Required for Home Assistant
        public setConfig(config: MeteogramCardConfig): void {
            // Truncate to 4 decimals for comparison
            const configLat = config.latitude !== undefined ? parseFloat(Number(config.latitude).toFixed(4)) : undefined;
            const configLon = config.longitude !== undefined ? parseFloat(Number(config.longitude).toFixed(4)) : undefined;
            const currentLat = this.latitude !== undefined ? parseFloat(Number(this.latitude).toFixed(4)) : undefined;
            const currentLon = this.longitude !== undefined ? parseFloat(Number(this.longitude).toFixed(4)) : undefined;

            const latChanged = configLat !== undefined && configLat !== currentLat;
            const lonChanged = configLon !== undefined && configLon !== currentLon;

            if (config.title) this.title = config.title;
            if (config.latitude !== undefined) this.latitude = configLat;
            if (config.longitude !== undefined) this.longitude = configLon;

            // Set the display options from config, using defaults if not specified
            this.showCloudCover = config.show_cloud_cover !== undefined ? config.show_cloud_cover : true;
            this.showPressure = config.show_pressure !== undefined ? config.show_pressure : true;
            this.showRain = config.show_rain !== undefined ? config.show_rain : true;
            this.showWeatherIcons = config.show_weather_icons !== undefined ? config.show_weather_icons : true;
            this.showWind = config.show_wind !== undefined ? config.show_wind : true;
            this.denseWeatherIcons = config.dense_weather_icons !== undefined ? config.dense_weather_icons : true;

            // if (latChanged || lonChanged) {
            //     MeteogramCard.apiExpiresAt = null;
            //     MeteogramCard.cachedWeatherData = null;
            //     try {
            //         if (logEnabled) {
            //             console.log(`[meteogram-card] Location changed: lat=${this.latitude}, lon=${this.longitude}`);
            //         }
            //         localStorage.removeItem('meteogram-card-weather-cache');
            //     } catch (e) {
            //         // Ignore storage errors
            //     }
            // }
        }

        // Required for HA visual editor support
        public static getConfigElement() {
            // Pre-initialize the editor component for faster display
            const editor = document.createElement("meteogram-card-editor") as MeteogramCardEditorElement;
            // Create a basic config to start with
            editor.setConfig({
                show_cloud_cover: true,
                show_pressure: true,
                show_rain: true,
                show_weather_icons: true,
                show_wind: true,
                dense_weather_icons: true
            });
            return editor;
        }

        // Define card configuration type
        public static getStubConfig(): object {
            return {
                title: "Weather Forecast",
                show_cloud_cover: true,
                show_pressure: true,
                show_rain: true,
                show_weather_icons: true,
                show_wind: true,
                dense_weather_icons: true
                // Coordinates will be fetched from HA configuration
            };
        }

        // According to the boilerplate, add getCardSize for panel mode
        public getCardSize(): number {
            return 3; // Returns a height in units of 50 pixels
        }

        // Handle initial setup - now properly setup resize observer
        connectedCallback() {
            super.connectedCallback();
            this._isInitialized = false;

            // Wait for DOM to be ready before setting up observers
            this.updateComplete.then(() => {
                this._setupResizeObserver();
                this._setupVisibilityObserver();
                this._setupMutationObserver();

                // Also handle browser tab visibility changes
                document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));

                // Handle page/panel navigation events
                window.addEventListener('location-changed', this._onLocationChanged.bind(this));

                // Handle re-entry into DOM after being removed temporarily
                if (this.isConnected) {
                    if (!this.hasRendered || !this.chartLoaded) {
                        this.loadD3AndDraw();
                    } else {
                        this._scheduleDrawMeteogram();
                    }
                }
            });
        }

        // Clean up all event listeners
        disconnectedCallback() {
            this._teardownResizeObserver();
            this._teardownVisibilityObserver();
            this._teardownMutationObserver();

            document.removeEventListener('visibilitychange', this._onVisibilityChange.bind(this));
            window.removeEventListener('location-changed', this._onLocationChanged.bind(this));

            this.cleanupChart();
            // Clear retry timer if present
            if (this._weatherRetryTimeout) {
                clearTimeout(this._weatherRetryTimeout);
                this._weatherRetryTimeout = null;
            }
            super.disconnectedCallback();
        }

        // Helper method to check if element is currently visible
        private _isElementVisible(): boolean {
            if (!this.isConnected || !this.shadowRoot) return false;

            // Check if document is visible at all
            if (document.hidden) return false;

            const element = this.shadowRoot.host as HTMLElement;
            if (!element) return false;

            // Check if element has dimensions
            if (element.offsetWidth === 0 && element.offsetHeight === 0) return false;

            // Check computed style
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.display === 'none') return false;
            if (computedStyle.visibility === 'hidden') return false;

            // Check if element is in viewport with getBoundingClientRect
            const rect = element.getBoundingClientRect();
            if (
                rect.top + rect.height <= 0 ||
                rect.left + rect.width <= 0 ||
                rect.bottom >= window.innerHeight ||
                rect.right >= window.innerWidth
            ) {
                return false;
            }

            return true;
        }

        // Set up visibility observer to detect when card becomes visible
        private _setupVisibilityObserver() {
            if (!this._intersectionObserver) {
                this._intersectionObserver = new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                this._handleVisibilityChange();
                                break;
                            }
                        }
                    },
                    {
                        threshold: [0.1] // Trigger when 10% of the card is visible
                    }
                );

                // Start observing the card element itself
                if (this.shadowRoot?.host) {
                    this._intersectionObserver.observe(this.shadowRoot.host);
                }
            }
        }

        // Clean up visibility observer
        private _teardownVisibilityObserver() {
            if (this._intersectionObserver) {
                this._intersectionObserver.disconnect();
                this._intersectionObserver = null;
            }
        }

        // Detect DOM changes that may affect visibility (like tab switching in HA)
        private _setupMutationObserver() {
            if (!this._mutationObserver) {
                this._mutationObserver = new MutationObserver((mutations) => {
                    // Check if we need to handle display/visibility changes
                    let needsVisibilityCheck = false;

                    for (const mutation of mutations) {
                        // Look specifically for the ha-tabs mutations that happen when switching tabs
                        if (mutation.target instanceof HTMLElement &&
                            (mutation.target.tagName === 'HA-TAB' ||
                                mutation.target.tagName === 'HA-TABS' ||
                                mutation.target.classList.contains('content') ||
                                mutation.target.hasAttribute('active'))) {
                            needsVisibilityCheck = true;
                            break;
                        }

                        // Check for display/visibility style changes
                        if (mutation.type === 'attributes' &&
                            (mutation.attributeName === 'style' ||
                                mutation.attributeName === 'class' ||
                                mutation.attributeName === 'hidden' ||
                                mutation.attributeName === 'active')) {
                            needsVisibilityCheck = true;
                            break;
                        }
                    }
                });

                // Specifically observe HA-TABS elements for tab switching
                document.querySelectorAll('ha-tabs, ha-tab, ha-tab-container').forEach(tabs => {
                    if (tabs) {
                        this._mutationObserver!.observe(tabs, {
                            attributes: true,
                            childList: true,
                            subtree: true
                        });
                    }
                });

                // Also observe the parent elements to detect when they become visible
                // Use shadowRoot.host instead of this to get the actual HTMLElement
                const element = this.shadowRoot?.host || null;
                if (element instanceof HTMLElement) {
                    let current: HTMLElement | null = element;
                    while (current && current.parentElement) {
                        this._mutationObserver.observe(current.parentElement, {
                            attributes: true,
                            attributeFilter: ['style', 'class', 'hidden', 'active'],
                            childList: false,
                            subtree: false
                        });
                        current = current.parentElement;
                    }
                }

                // Observe the entire dashboard for broader changes
                const dashboardEl = document.querySelector('home-assistant, ha-panel-lovelace');
                if (dashboardEl) {
                    this._mutationObserver.observe(dashboardEl, {
                        childList: true,
                        subtree: true
                    });
                }
            }
        }

        // Clean up mutation observer
        private _teardownMutationObserver() {
            if (this._mutationObserver) {
                this._mutationObserver.disconnect();
                this._mutationObserver = null;
            }
        }

        // Handle document visibility changes (browser tab switching)
        private _onVisibilityChange = () => {
            if (!document.hidden && this.isConnected) {
                this._handleVisibilityChange();
            }
        }

        // Handle Home Assistant location/page changes
        private _onLocationChanged = () => {
            // Small delay to let the DOM update
            setTimeout(() => {
                if (this.isConnected && this._isElementVisible()) {
                    this._handleVisibilityChange();
                }
            }, 100);
        }

        // Central handler for visibility changes
        private _handleVisibilityChange() {
            if (this._isElementVisible()) {
                const chartDiv = this.shadowRoot?.querySelector("#chart");
                // Check if we need to redraw - only if chart is empty or not rendered
                const needsRedraw = !this.hasRendered ||
                    !this.svg ||
                    !chartDiv ||
                    chartDiv.innerHTML === "" ||
                    chartDiv.clientWidth === 0 ||
                    !chartDiv.querySelector("svg"); // No SVG means we need to redraw

                if (needsRedraw && this.chartLoaded) {
                    // Force a new rendering cycle to ensure chart is properly displayed
                    this.hasRendered = false;
                    this.cleanupChart(); // Ensure previous chart is cleaned up
                    this.requestUpdate();
                    this.updateComplete.then(() => this._scheduleDrawMeteogram());
                }
            }
        }

        // Set up resize observer to detect size changes
        private _setupResizeObserver() {
            if (!this._resizeObserver) {
                this._resizeObserver = new ResizeObserver(
                    this._onResize.bind(this)
                );
            }

            // We need to wait for the element to be in the DOM
            setTimeout(() => {
                const chartDiv = this.shadowRoot?.querySelector("#chart");
                if (chartDiv && this._resizeObserver) {
                    this._resizeObserver.observe(chartDiv);
                }
            }, 100);
        }

        // Handle resize
        private _onResize(entries: ResizeObserverEntry[]) {
            if (entries.length === 0) return;

            const entry = entries[0];

            // Reduce the threshold for horizontal resizing to be more responsive to width changes
            // but keep vertical threshold higher to avoid unnecessary redraws
            if (
                Math.abs(entry.contentRect.width - this._lastWidth) > this._lastWidth * 0.05 ||
                Math.abs(entry.contentRect.height - this._lastHeight) > this._lastHeight * 0.1
            ) {
                this._lastWidth = entry.contentRect.width;
                this._lastHeight = entry.contentRect.height;
                this._scheduleDrawMeteogram();
            }
        }

        // Clean up resize observer
        private _teardownResizeObserver() {
            if (this._resizeObserver) {
                this._resizeObserver.disconnect();
                this._resizeObserver = null;
            }
        }

        // Life cycle hooks
        protected firstUpdated(_: PropertyValues) {
            // Make sure DOM is ready before initial drawing
            setTimeout(() => {
                this.loadD3AndDraw();
            }, 50);
            this.hasRendered = false; // Force redraw on first update

            this._updateDarkMode(); // Ensure dark mode is set on first update
        }

        protected updated(changedProps: PropertyValues) {
            // Only redraw if coordinates, hass, or relevant config options change, or it's the first render
            const needsRedraw =
                changedProps.has('latitude') ||
                changedProps.has('longitude') ||
                changedProps.has('hass') ||
                changedProps.has('showCloudCover') ||
                changedProps.has('showPressure') ||
                changedProps.has('showRain') ||
                changedProps.has('showWeatherIcons') ||
                changedProps.has('showWind') ||
                changedProps.has('denseWeatherIcons') ||
                !this.hasRendered;

            if (this.chartLoaded && needsRedraw) {
                // Get location from HA if not configured
                this._checkAndUpdateLocation();

                // Check if we really need to redraw
                const chartDiv = this.shadowRoot?.querySelector("#chart");
                const chartMissing = !chartDiv || chartDiv.innerHTML === "" || !chartDiv.querySelector("svg");

                // Only redraw if not already rendered or chart is missing
                if (!this.hasRendered || chartMissing) {
                    this._scheduleDrawMeteogram();
                }
            }

            // Track component state for better lifecycle management
            if (!this._isInitialized && this.shadowRoot) {
                this._isInitialized = true;

                // Force a redraw when added back to the DOM after being in the editor
                if (this.chartLoaded) {
                    const chartDiv = this.shadowRoot?.querySelector("#chart");
                    if (chartDiv && chartDiv.innerHTML === "") {
                        this._scheduleDrawMeteogram();
                    }
                }
            }

            // if (changedProps.has('latitude') || changedProps.has('longitude')) {
            //     MeteogramCard.apiExpiresAt = null;
            //     MeteogramCard.cachedWeatherData = null;
            //     try {
            //         localStorage.removeItem('meteogram-card-weather-cache');
            //     } catch (e) {
            //         // Ignore storage errors
            //     }
            // }

            this._updateDarkMode(); // Always check dark mode after update
        }

        // Helper to get a truncated location key for caching
        private getLocationKey(lat: number, lon: number): string {
            // Always use 4 decimals for both lat and lon
            return `${lat.toFixed(4)},${lon.toFixed(4)}`;
        }

        // Save location to localStorage
        private _saveLocationToStorage(latitude: number | undefined, longitude: number | undefined) {
            try {
                // Only save if both values are defined
                if (latitude !== undefined && longitude !== undefined) {
                    // Truncate to 4 decimals before saving
                    localStorage.setItem(MeteogramCard.STORAGE_KEY_LAT, parseFloat(latitude.toFixed(4)).toString());
                    localStorage.setItem(MeteogramCard.STORAGE_KEY_LON, parseFloat(longitude.toFixed(4)).toString());
                }
            } catch (e) {
                // Handle potential localStorage errors (e.g., private browsing mode)
                console.debug('Failed to save location to localStorage:', e);
            }
        }

        // Load location from localStorage
        private _loadLocationFromStorage(): { latitude: number, longitude: number } | null {
            try {
                const lat = localStorage.getItem(MeteogramCard.STORAGE_KEY_LAT);
                const lon = localStorage.getItem(MeteogramCard.STORAGE_KEY_LON);

                if (lat !== null && lon !== null) {
                    // Parse and truncate to 4 decimals
                    const latitude = parseFloat(parseFloat(lat).toFixed(4));
                    const longitude = parseFloat(parseFloat(lon).toFixed(4));

                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        return {latitude, longitude};
                    }
                }
                return null;
            } catch (e) {
                console.debug('Failed to load location from localStorage:', e);
                return null;
            }
        }

        // Check if we need to get location from HA
        private _checkAndUpdateLocation() {
            // Try to get location from config first
            if (this.latitude !== undefined && this.longitude !== undefined) {
                // Truncate to 4 decimals before using
                this.latitude = parseFloat(Number(this.latitude).toFixed(4));
                this.longitude = parseFloat(Number(this.longitude).toFixed(4));
                // We have configured coordinates, save them to localStorage for future fallback
                this._saveLocationToStorage(this.latitude, this.longitude);
                return;
            }

            // Try to get location from HA
            if (this.hass && (this.latitude === undefined || this.longitude === undefined)) {
                const hassConfig = this.hass.config || {};
                const hassLocation = hassConfig.latitude !== undefined && hassConfig.longitude !== undefined;

                if (hassLocation) {
                    // Truncate to 4 decimals before using
                    this.latitude = parseFloat(Number(hassConfig.latitude).toFixed(4));
                    this.longitude = parseFloat(Number(hassConfig.longitude).toFixed(4));
                    // Save successful HA location to localStorage
                    this._saveLocationToStorage(this.latitude, this.longitude);
                    console.debug(`Using HA location: ${this.latitude}, ${this.longitude}`);
                    return;
                }
            }

            // If we still don't have location, try to load from localStorage
            if (this.latitude === undefined || this.longitude === undefined) {
                const cachedLocation = this._loadLocationFromStorage();
                if (cachedLocation) {
                    this.latitude = cachedLocation.latitude;
                    this.longitude = cachedLocation.longitude;
                    console.debug(`Using cached location: ${this.latitude}, ${this.longitude}`);
                } else {
                    // Last resort - use a default location if nothing else is available
                    // London coordinates as a reasonable default
                    this.latitude = 51.5074;
                    this.longitude = -0.1278;
                    console.debug(`Using default location: ${this.latitude}, ${this.longitude}`);
                }
            }
        }


        // Implement the missing loadD3AndDraw method
        async loadD3AndDraw(): Promise<void> {
            // Check if D3 is already loaded
            if (window.d3) {
                this.chartLoaded = true;
                this._scheduleDrawMeteogram();
                return;
            }

            // Try to load D3.js dynamically
            try {
                // Create script element
                const script = document.createElement('script');
                script.src = 'https://d3js.org/d3.v7.min.js';
                script.async = true;

                // Create a promise to track when the script loads
                const loadPromise = new Promise<void>((resolve, reject) => {
                    script.onload = () => {
                        this.chartLoaded = true;
                        resolve();
                    };
                    script.onerror = () => {
                        reject(new Error('Failed to load D3.js library'));
                    };
                });

                // Add script to document
                document.head.appendChild(script);

                // Wait for script to load
                await loadPromise;

                // Check if D3 was successfully loaded
                if (!window.d3) {
                    throw new Error('D3.js not available after loading script');
                }

                // Now that D3 is loaded, draw the meteogram
                await this._scheduleDrawMeteogram();
            } catch (error) {
                console.error('Error loading D3.js:', error);
                this.setError('Failed to load D3.js visualization library. Please refresh the page.');
            }
        }


        // Helper to persist cache to localStorage, indexed by location
        private saveCacheToStorage(lat: number, lon: number) {
            try {
                if (this.cachedWeatherData && this.apiExpiresAt) {
                    const key = this.getLocationKey(lat, lon);
                    let cacheObj: Record<string, { expiresAt: number, lastModified?: string, data: MeteogramData }> = {};
                    const cacheStr = localStorage.getItem('meteogram-card-weather-cache');
                    if (cacheStr) {
                        try {
                            cacheObj = JSON.parse(cacheStr);
                        } catch {
                            cacheObj = {};
                        }
                    }
                    cacheObj[key] = {
                        expiresAt: this.apiExpiresAt,
                        lastModified: this.apiLastModified || undefined,
                        data: this.cachedWeatherData
                    };
                    localStorage.setItem('meteogram-card-weather-cache', JSON.stringify(cacheObj));
                }
            } catch (e) {
                // Ignore storage errors
            }
        }

        // Update loadCacheFromStorage to also load lastModified and assign expiresAt
        private loadCacheFromStorage(lat: number, lon: number) {
            try {
                const key = this.getLocationKey(lat, lon);
                const cacheStr = localStorage.getItem('meteogram-card-weather-cache');

                if (cacheStr) {
                    let cacheObj: Record<string, { expiresAt: number, lastModified?: string, data: MeteogramData }> = {};
                    try {
                        cacheObj = JSON.parse(cacheStr);
                    } catch {
                        cacheObj = {};
                    }
                    const entry = cacheObj[key];
                    if (logEnabled) {
                        console.log(`[meteogram-card] Attempting to load cache for key: ${key}, entry:`, entry);
                    }
                    if (entry && entry.expiresAt && entry.data) {
                        this.apiExpiresAt = entry.expiresAt; // <-- Ensure expiresAt is assigned from cache
                        this.apiLastModified = entry.lastModified || null;
                        if (Array.isArray(entry.data.time)) {
                            entry.data.time = entry.data.time.map((t: string | Date) =>
                                typeof t === "string" ? new Date(t) : t
                            );
                        }
                        this.cachedWeatherData = entry.data;

                    } else {
                        if (logEnabled) {
                            console.log(`[meteogram-card] No cache entry found for key: ${key}`);
                        }
                        this.apiExpiresAt = null;
                        this.apiLastModified = null;
                        this.cachedWeatherData = null;
                    }
                }
            } catch (e) {
                // Ignore storage errors
                console.debug('Failed to load cache from localStorage:', e);
            }
        }

        async fetchWeatherData(): Promise<MeteogramData> {
            // Always truncate to 4 decimals before using
            const lat = this.latitude !== undefined ? parseFloat(Number(this.latitude).toFixed(4)) : undefined;
            const lon = this.longitude !== undefined ? parseFloat(Number(this.longitude).toFixed(4)) : undefined;
            if (logEnabled) {
                console.log(`[meteogram-card] fetchWeatherData called with lat=${lat}, lon=${lon}`);
            }

            // Load cache for this location
            if (lat !== undefined && lon !== undefined) {
                // Load cache from localStorage if available
                if (logEnabled) {
                    console.log(`[meteogram-card] Attempting to load cache for lat=${lat.toFixed(4)}, lon=${lon.toFixed(4)}`);
                }

                this.loadCacheFromStorage(lat, lon);
            }

            const expiresStr = this.apiExpiresAt ? new Date(this.apiExpiresAt).toISOString() : "unknown";
            const latStr = lat !== undefined ? lat.toFixed(4) : undefined;
            const lonStr = lon !== undefined ? lon.toFixed(4) : undefined;

            if (logEnabled) {
                console.log(`[meteogram-card] fetchWeatherData called at ${new Date().toISOString()} with lat=${latStr}, lon=${lonStr} (expires at ${expiresStr})`);
            }

            // Enhanced location check with better error message
            if (!lat || !lon) {
                this._checkAndUpdateLocation(); // Try harder to get location

                const checkedLat = this.latitude !== undefined ? parseFloat(Number(this.latitude).toFixed(4)) : undefined;
                const checkedLon = this.longitude !== undefined ? parseFloat(Number(this.longitude).toFixed(4)) : undefined;

                if (!checkedLat || !checkedLon) {
                    throw new Error("Could not determine location. Please check your card configuration or Home Assistant settings.");
                }
            }

            // Serve cached data if Expires has not passed and cache exists
            if (
                this.apiExpiresAt &&
                Date.now() < this.apiExpiresAt &&
                this.cachedWeatherData
            ) {
                if (logEnabled) {
                    console.log(`[meteogram-card] Returning cached weather data (expires at ${expiresStr})`);
                }
                return Promise.resolve(this.cachedWeatherData);
            }

            // If a fetch is already in progress, return the same promise
            if (this.weatherDataPromise) {
                if (logEnabled) {
                    console.log(`[meteogram-card] Returning in-flight weather data promise (expires at ${expiresStr})`);
                }
                return this.weatherDataPromise;
            }

            this.weatherDataPromise = (async () => {
                try {
                    const forecastUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
                    const headers: Record<string, string> = {};
                    // Remove If-Modified-Since header usage
                    // if (this.apiLastModified) {
                    //     headers['If-Modified-Since'] = this.apiLastModified;
                    // }
                    // Add Origin header for identification
                    headers['Origin'] = window.location.origin;

                    // Log headers before fetch
                    if (logEnabled) {
                        console.log('[meteogram-card] Fetch headers:', headers);
                    }

                    const response = await fetch(forecastUrl, { headers });

                    // Handle 429 Too Many Requests
                    if (response.status === 429) {
                        const expiresHeader = response.headers.get("Expires");
                        let expiresAt: number | null = null;
                        if (expiresHeader) {
                            const expiresDate = new Date(expiresHeader);
                            if (!isNaN(expiresDate.getTime())) {
                                expiresAt = expiresDate.getTime();
                                this.apiExpiresAt = expiresAt;
                            }
                        }
                        const nextTry = expiresAt ? new Date(expiresAt).toLocaleTimeString() : "later";
                        console.warn(`Weather API throttling (429). Next attempt allowed after ${nextTry}.`);
                        throw new Error(`Weather API throttling: Too many requests. Please wait until ${nextTry} before retrying.`);
                    }

                    // Cache Expires header if present
                    const expiresHeader = response.headers.get("Expires");
                    if (expiresHeader) {
                        const expiresDate = new Date(expiresHeader);
                        if (!isNaN(expiresDate.getTime())) {
                            this.apiExpiresAt = expiresDate.getTime();
                            if (logEnabled) {
                                console.log(`[meteogram-card] API response Expires at ${expiresDate.toISOString()}`);
                            }
                        }
                    }

                    // Cache Last-Modified header if present
                    const lastModifiedHeader = response.headers.get("Last-Modified");
                    if (lastModifiedHeader) {
                        this.apiLastModified = lastModifiedHeader;
                        if (logEnabled) {
                            console.log(`[meteogram-card] API response Last-Modified: ${lastModifiedHeader}`);
                        }
                    }

                    // Handle 304 Not Modified
                    if (response.status === 304) {
                        if (logEnabled) {
                            console.log("[meteogram-card] API returned 304 Not Modified, using cached data.");
                        }
                        if (this.cachedWeatherData) {
                            return this.cachedWeatherData;
                        } else {
                            throw new Error("API returned 304 but no cached data is available.");
                        }
                    }

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Weather API fetch failed:', {
                            url: forecastUrl,
                            status: response.status,
                            statusText: response.statusText,
                            body: errorText
                        });
                        // Add CORS/network hint if status is 0
                        if (response.status === 0) {
                            throw new Error(`Weather API request failed (status 0). This may be a network or CORS issue. See browser console for details.`);
                        }
                        throw new Error(`Weather API returned ${response.status}: ${response.statusText}\n${errorText}`);
                    }

                    const data = await response.json();

                    if (!data || !data.properties || !data.properties.timeseries || data.properties.timeseries.length === 0) {
                        throw new Error('Invalid data format received from API');
                    }

                    // Process forecast data
                    const timeseries = data.properties.timeseries;
                    const now = new Date();
                    const timePlus48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

                    // Filter timeseries to get data for the next 48 hours, keep hourly resolution
                    const filtered = timeseries.filter((item: any) => {
                        const time = new Date(item.time);
                        return time >= now && time <= timePlus48h && time.getMinutes() === 0;
                    });

                    const result: MeteogramData = {
                        time: [],
                        temperature: [],
                        rain: [],
                        rainMin: [], // Initialize min precipitation array
                        rainMax: [], // Initialize max precipitation array
                        snow: [],
                        cloudCover: [],
                        windSpeed: [],
                        windDirection: [],
                        symbolCode: [],
                        pressure: [] // Initialize the pressure array
                    };

                    filtered.forEach((item: any) => {
                        const time = new Date(item.time);
                        const instant = item.data.instant.details;
                        const next1h = item.data.next_1_hours?.details;

                        result.time.push(time);
                        result.temperature.push(instant.air_temperature);
                        result.cloudCover.push(instant.cloud_area_fraction);
                        result.windSpeed.push(instant.wind_speed);
                        result.windDirection.push(instant.wind_from_direction);
                        // Extract pressure data (air_pressure_at_sea_level is in hPa)
                        result.pressure.push(instant.air_pressure_at_sea_level);

                        if (next1h) {
                            // Use precipitation_amount_max and precipitation_amount_min if available
                            const rainAmountMax = next1h.precipitation_amount_max !== undefined ?
                                next1h.precipitation_amount_max :
                                (next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);

                            const rainAmountMin = next1h.precipitation_amount_min !== undefined ?
                                next1h.precipitation_amount_min :
                                (next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);

                            // Store min and max separately
                            result.rainMin.push(rainAmountMin);
                            result.rainMax.push(rainAmountMax);

                            // FIX: Use precipitation_amount for main rain bar
                            result.rain.push(next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);

                            result.snow.push(0); // Default to 0 if snow isn't separated out

                            // Get weather symbol code for icons
                            if (item.data.next_1_hours?.summary?.symbol_code) {
                                result.symbolCode.push(item.data.next_1_hours.summary.symbol_code);
                            } else {
                                result.symbolCode.push('');
                            }
                        } else {
                            // Fill in empty data if we don't have hourly precipitation data
                            result.rain.push(0);
                            result.rainMin.push(0);
                            result.rainMax.push(0);
                            result.snow.push(0);
                            result.symbolCode.push('');
                        }
                    });

                    // Cache the data for future requests
                    this.cachedWeatherData = result;
                    if (lat !== undefined && lon !== undefined) {
                        this.saveCacheToStorage(lat, lon);
                    }
                    return result;
                } catch (error: unknown) {
                    // If there is cached weather data, use it instead of throwing
                    if (this.cachedWeatherData) {
                        console.warn('Error fetching weather data, using cached data instead:', error);
                        return this.cachedWeatherData;
                    }
                    // Log error and provide more info for troubleshooting
                    console.error('Error fetching weather data:', error);
                    throw new Error(`Failed to get weather data: ${(error as Error).message}\nCheck your network connection, browser console, and API accessibility.`);
                } finally {
                    this.weatherDataPromise = null;
                }
            })();

            return this.weatherDataPromise;
        }

        // Keep the cleanupChart method as is
        cleanupChart(): void {
            try {
                // Check if we have an active D3 selection
                if (this.svg && typeof this.svg.remove === 'function') {
                    // Use D3's remove method to clean up properly
                    this.svg.remove();
                    this.svg = null;
                }

                // Also clear any chart content directly from the DOM
                if (this.shadowRoot) {
                    const chartDiv = this.shadowRoot.querySelector('#chart');
                    if (chartDiv) {
                        chartDiv.innerHTML = '';
                    }
                }
            } catch (error) {
                console.warn('Error cleaning up chart:', error);
            }
        }

        async _drawMeteogram() {
            // Removed stack trace log

            // Limit excessive error messages
            const now = Date.now();
            if (this.meteogramError && now - this.lastErrorTime < 60000) {
                // Don't try to redraw for at least 1 minute after an error
                this.errorCount++;
                return;
            }

            this.meteogramError = "";

            // Make sure we have a location before proceeding
            this._checkAndUpdateLocation();

            if (!this.latitude || !this.longitude) {
                this.setError("Location not available. Please check your card configuration or Home Assistant settings.");
                return;
            }

            // Create a fingerprint of current location and display settings
            const settingsFingerprint = `${this.latitude},${this.longitude},${this.showCloudCover},${this.showPressure},${this.showWeatherIcons},${this.showWind}`;

            // If nothing has changed and we already have a rendered chart, don't redraw
            if (this._lastRenderedData === settingsFingerprint && this.svg && this.chartLoaded) {
                // Only redraw if chart container is missing or empty
                const chartDiv = this.shadowRoot?.querySelector("#chart");
                if (chartDiv && chartDiv.querySelector("svg")) {
                    return;
                }
            }

            // Store the current settings fingerprint
            this._lastRenderedData = settingsFingerprint;

            // Wait for the render cycle to complete before accessing the DOM
            await this.updateComplete;

            // Use the _logDomState method to log diagnostic info
            this._logDomState();

            // Add a static property to limit D3 retry frequency
            const D3_RETRY_INTERVAL = 10000; // 10 seconds
            if (!MeteogramCard.lastD3RetryTime) {
                MeteogramCard.lastD3RetryTime = 0;
            }

            // Always attempt to load D3 if not present
            if (!window.d3) {
                try {
                    await this.loadD3AndDraw();
                    return; // loadD3AndDraw will call drawMeteogram when ready
                } catch (error) {
                    // Only throttle error messages if repeated failures
                    const now = Date.now();
                    if (now - MeteogramCard.lastD3RetryTime < D3_RETRY_INTERVAL) {
                        // Too soon to retry loading D3, skip this attempt
                        return;
                    }
                    MeteogramCard.lastD3RetryTime = now;
                    this.setError("D3.js library could not be loaded. Please refresh the page.");
                    return;
                }
            }

            // Clean up any existing chart before proceeding
            this.cleanupChart();

            // Ensure we have a clean update cycle before accessing the DOM again
            await new Promise(resolve => setTimeout(resolve, 10));

            // Get chart container after cleanup and another update cycle
            const chartDiv = this.shadowRoot?.querySelector("#chart");

            if (!chartDiv) {
                console.error("Chart container not found in DOM");
                if (this.isConnected) {
                    this.requestUpdate();
                    await this.updateComplete;
                    await new Promise(resolve => setTimeout(resolve, 50));
                    const retryChartDiv = this.shadowRoot?.querySelector("#chart");

                    if (!retryChartDiv) {
                        console.error("Chart container still not found after retry");
                        if (this.shadowRoot) {
                            const cardContent = this.shadowRoot.querySelector('.card-content');
                            if (cardContent && this.isConnected) {
                                cardContent.innerHTML = '<div id="chart"></div>';
                                const finalAttemptChartDiv = this.shadowRoot.querySelector("#chart");
                                if (finalAttemptChartDiv) {
                                    this._renderChart(finalAttemptChartDiv);
                                    return;
                                }
                            }
                        }
                        return;
                    }
                    this._renderChart(retryChartDiv);
                }
                return;
            }

            // Call a separate method to handle the actual chart rendering
            this._renderChart(chartDiv);
        }

        // Separate chart rendering logic for better organization
        private _renderChart(chartDiv: Element) {
            // If a render is already in progress, skip this call
            if (this._chartRenderInProgress) {
                if (logEnabled) {
                    console.log("[meteogram-card] Chart render already in progress, skipping redundant render.");
                }
                const svgExists = chartDiv.querySelector("svg");
                if (!svgExists) {
                    if (logEnabled) {
                        console.log("[meteogram-card] No SVG found, clearing render-in-progress flag to recover.");
                    }
                    this._chartRenderInProgress = false;
                }
                return;
            }
            this._chartRenderInProgress = true;

            setTimeout(() => {
                if (this._chartRenderInProgress) {
                    if (logEnabled) {
                        console.log("[meteogram-card] Clearing chart render flag after timeout.");
                    }
                    this._chartRenderInProgress = false;
                }
            }, 1000);

            try {
                // Prevent unnecessary redraws if chart is already rendered and visible
                const svgExists = chartDiv.querySelector("svg");
                // Cast chartDiv to HTMLElement for offsetWidth/offsetHeight
                const chartIsVisible = (chartDiv as HTMLElement).offsetWidth > 0 && (chartDiv as HTMLElement).offsetHeight > 0;
                if (svgExists && chartIsVisible && this.hasRendered) {
                    this._chartRenderInProgress = false; // Ensure flag is cleared
                    return;
                }

                // Responsive sizing based on parent
                const parent = chartDiv.parentElement;
                const availableWidth = parent ? parent.clientWidth : (chartDiv as HTMLElement).offsetWidth || 350;
                const availableHeight = parent ? parent.clientHeight : (chartDiv as HTMLElement).offsetHeight || 180;

                // Better horizontal stretching - use most of available width up to a reasonable maximum
                const maxAllowedWidth = Math.min(window.innerWidth * 0.95, 1200); // Increased from 800 to 1200
                const width = Math.max(Math.min(availableWidth, maxAllowedWidth), 300);

                const maxAllowedHeight = Math.min(window.innerHeight * 0.7, 520);
                const aspectRatioHeight = width * 0.5; // Slightly reduced aspect ratio (from 0.6 to 0.5) for wider displays
                const height = Math.min(aspectRatioHeight, availableHeight, maxAllowedHeight);

                // Store dimensions for resize detection
                this._lastWidth = availableWidth;
                this._lastHeight = availableHeight;

                // Only clean up and redraw if chart is not rendered or dimensions have changed
                if (!svgExists || this._lastWidth !== availableWidth || this._lastHeight !== availableHeight) {
                    // Clean up previous chart
                    chartDiv.innerHTML = "";
                    // Fetch weather data and render
                    this.fetchWeatherData().then((data: MeteogramData) => {
                        // Ensure the chart div is still empty before creating a new SVG
                        if (chartDiv.querySelector("svg")) {
                            console.debug("SVG already exists, removing before creating new one");
                            chartDiv.innerHTML = "";
                        }

                        // Create SVG with responsive viewBox
                        this.svg = window.d3.select(chartDiv)
                            .append("svg")
                            .attr("width", "100%")
                            .attr("height", "100%")
                            .attr("viewBox", `0 0 ${width + 140} ${height + 160}`)
                            .attr("preserveAspectRatio", "xMidYMid meet");

                        this.renderMeteogram(this.svg, data, width, height);
                        this.hasRendered = true;
                        // Reset error tracking on success
                        this.errorCount = 0;
                        // Clear retry timer if successful
                        if (this._weatherRetryTimeout) {
                            clearTimeout(this._weatherRetryTimeout);
                            this._weatherRetryTimeout = null;
                        }
                        // Ensure observers are setup again
                        this._setupResizeObserver();
                        this._setupVisibilityObserver();
                        this._setupMutationObserver();
                    }).catch(() => {
                        // Show a nice error message and retry in 60 seconds
                        this.setError("Weather data not available, retrying in 60 seconds");
                        if (this._weatherRetryTimeout) clearTimeout(this._weatherRetryTimeout);
                        this._weatherRetryTimeout = window.setTimeout(() => {
                            this.meteogramError = "";
                            this._drawMeteogram();
                        }, 60000);
                    }).finally(() => {
                        this._chartRenderInProgress = false;
                    });
                } else {
                    this._chartRenderInProgress = false;
                }
            } catch (error: unknown) {
                this.setError(`Failed to render chart: ${(error as Error).message}`);
                this._chartRenderInProgress = false;
            }
        }

        renderMeteogram(svg: any, data: MeteogramData, width: number, height: number): void {
            const d3 = window.d3;
            const {
                time,
                temperature,
                rain,
                rainMin,
                rainMax,
                snow,
                cloudCover,
                windSpeed,
                windDirection,
                symbolCode,
                pressure
            } = data;
            const N = time.length;

            // SVG and chart parameters
            const windBarbBand = this.showWind ? 55 : 0; // Only allocate space for wind barbs if they're enabled
            const bottomHourBand = 24;
            const margin = {top: 70, right: 70, bottom: bottomHourBand + 10, left: 70};
            const chartWidth = width;
            const chartHeight = height;

            // Adjust dx for wider charts - ensure elements don't get too stretched or squished
            let dx = chartWidth / (N - 1);
            // If the chart is very wide, adjust spacing so elements don't get too stretched
            const hourSpacing = Math.min(dx, 45); // Cap the hour spacing at 45px

            // X scale - for wider charts, maintain reasonable hour spacing
            const x = d3.scaleLinear()
                .domain([0, N - 1])
                .range([0, Math.min(hourSpacing * (N - 1), chartWidth)]);

            // Adjust the actual dx to what's being used by the scale
            dx = x(1) - x(0);

            // Find day boundaries for shaded backgrounds
            const dateLabelY = margin.top - 30;
            const dayStarts: number[] = [];
            for (let i = 0; i < N; i++) {
                if (i === 0 || time[i].getDate() !== time[i - 1].getDate()) {
                    dayStarts.push(i);
                }
            }

            const dayRanges: DayRange[] = [];
            for (let i = 0; i < dayStarts.length; ++i) {
                const startIdx = dayStarts[i];
                const endIdx = (i + 1 < dayStarts.length) ? dayStarts[i + 1] : N;
                dayRanges.push({start: startIdx, end: endIdx});
            }

            // Alternate shaded background for days
            svg.selectAll(".day-bg")
                .data(dayRanges)
                .enter()
                .append("rect")
                .attr("class", "day-bg")
                .attr("x", (d: DayRange) => margin.left + x(d.start))
                .attr("y", margin.top - 42)
                // Limit width to only main chart area (do not extend to right axis)
                .attr("width", (d: DayRange) => Math.min(x(Math.max(d.end - 1, d.start)) - x(d.start) + dx, chartWidth - x(d.start)))
                // Limit height to only main chart area (do not extend to lower x axis)
                .attr("height", chartHeight + 42)
                .attr("opacity", (_: DayRange, i: number) => i % 2 === 0 ? 0.16 : 0);

            // Date labels at top - with spacing check to prevent overlap
            svg.selectAll(".top-date-label")
                .data(dayStarts)
                .enter()
                .append("text")
                .attr("class", "top-date-label")
                .attr("x", (d: number) => margin.left + x(d))
                .attr("y", dateLabelY)
                .attr("text-anchor", "start")
                .attr("opacity", (d: number, i: number) => {
                    // Check if there's enough space for this label
                    if (i === dayStarts.length - 1) return 1; // Always show the last day

                    const thisLabelPos = margin.left + x(d);
                    const nextLabelPos = margin.left + x(dayStarts[i + 1]);
                    const minSpaceNeeded = 100; // Minimum pixels needed between labels

                    // If not enough space between this and next label, hide this one
                    return nextLabelPos - thisLabelPos < minSpaceNeeded ? 0 : 1;
                })
                .text((d: number) => {
                    const dt = time[d];
                    return dt.toLocaleDateString(undefined, {weekday: "short", day: "2-digit", month: "short"});
                });

            // Day boundary ticks
            svg.selectAll(".day-tic")
                .data(dayStarts)
                .enter()
                .append("line")
                .attr("class", "day-tic")
                .attr("x1", (d: number) => margin.left + x(d))
                .attr("x2", (d: number) => margin.left + x(d))
                .attr("y1", dateLabelY + 22)
                .attr("y2", dateLabelY + 42)
                .attr("stroke", "#1a237e")
                .attr("stroke-width", 3)
                .attr("opacity", 0.6);

            const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            // Temperature Y scale, handling null values
            const tempValues = temperature.filter((t): t is number => t !== null);
            const yTemp = d3.scaleLinear()
                .domain([Math.floor(d3.min(tempValues) - 2), Math.ceil(d3.max(tempValues) + 2)])
                .range([chartHeight, 0]);

            // Precipitation Y scale
            const yPrecip = d3.scaleLinear()
                .domain([0, Math.max(2, d3.max([...rainMax, ...rain, ...snow]) + 1)])
                .range([chartHeight, 0]); // <-- FIXED: range goes from chartHeight (bottom) to 0 (top)

            // Pressure Y scale - we'll use the right side of the chart
            // Only create if pressure is shown
            let yPressure;
            if (this.showPressure) {
                const pressureRange = d3.extent(pressure);
                const pressurePadding = (pressureRange[1] - pressureRange[0]) * 0.1;
                yPressure = d3.scaleLinear()
                    .domain([
                        Math.floor((pressureRange[0] - pressurePadding) / 5) * 5,
                        Math.ceil((pressureRange[1] + pressurePadding) / 5) * 5
                    ])
                    .range([chartHeight, 0]);
            }

            // Add vertical gridlines
            svg.append("g")
                .attr("class", "xgrid")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .selectAll("line")
                .data(d3.range(N))
                .enter().append("line")
                .attr("x1", (i: number) => x(i))
                .attr("x2", (i: number) => x(i))
                .attr("y1", 0)
                .attr("y2", chartHeight)
                .attr("stroke", "#b8c4d9")
                .attr("stroke-width", 1);

            // Day change vertical lines (midnights)
            const dayChangeIdx = dayStarts.slice(1);
            svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .selectAll(".twentyfourh-line")
                .data(dayChangeIdx)
                .enter()
                .append("line")
                .attr("class", "twentyfourh-line")
                .attr("x1", (i: number) => x(i))
                .attr("x2", (i: number) => x(i))
                .attr("y1", 0)
                .attr("y2", chartHeight)
                .lower();

            // Cloud cover band - only if enabled
            if (this.showCloudCover) {
                const bandTop = chartHeight * 0.05;
                const bandHeight = chartHeight * 0.20;
                const cloudBandPoints: [number, number][] = [];

                for (let i = 0; i < N; i++) {
                    cloudBandPoints.push([x(i), bandTop + bandHeight * (cloudCover[i] / 100)]);
                }
                for (let i = N - 1; i >= 0; i--) {
                    cloudBandPoints.push([x(i), bandTop + bandHeight * (1 - cloudCover[i] / 100)]);
                }

                chart.append("path")
                    .attr("class", "cloud-area")
                    .attr("d", d3.line()
                        .x((d: [number, number]) => d[0])
                        .y((d: [number, number]) => d[1])
                        .curve(d3.curveLinearClosed)(cloudBandPoints));
            }

            // Temperature axis and grid
            chart.append("g").attr("class", "grid")
                .call(d3.axisLeft(yTemp).tickSize(-chartWidth).tickFormat(""));

            chart.append("line")
                .attr("x1", 0).attr("x2", chartWidth)
                .attr("y1", chartHeight).attr("y2", chartHeight)
                .attr("stroke", "#333");

            chart.append("g").call(d3.axisLeft(yTemp));

            // Pressure axis (right side) - only if enabled
            if (this.showPressure && yPressure) {
                chart.append("g")
                    .attr("class", "pressure-axis")
                    .attr("transform", `translate(${chartWidth}, 0)`)
                    .call(d3.axisRight(yPressure)
                        .tickFormat((d: any) => `${d}`));

                chart.append("text")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("transform", `translate(${chartWidth + 50},${chartHeight / 2}) rotate(90)`)
                    .text("Pressure (hPa)");

                chart.append("text")
                    .attr("class", "legend")
                    .attr("x", 340).attr("y", -45)
                    .style("fill", "#1976d2")
                    .text("Pressure (hPa)");
            }

            // Axis labels and legend
            chart.append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", `translate(-50,${chartHeight / 2}) rotate(-90)`)
                .text("Temperature (°C)");

            // Only add cloud cover legend if enabled
            if (this.showCloudCover) {
                chart.append("text")
                    .attr("class", "legend")
                    .attr("x", 0).attr("y", -45)
                    .text("Cloud Cover (%)");
            }

            chart.append("text")
                .attr("class", "legend")
                .attr("x", 200).attr("y", -45)
                .style("fill", "orange")
                .text("Temperature (°C)");

            chart.append("text")
                .attr("class", "legend")
                .attr("x", 480).attr("y", -45)
                .style("fill", "deepskyblue")
                .text("Rain (mm)");

            chart.append("text")
                .attr("class", "legend")
                .attr("x", 630).attr("y", -45)
                .style("fill", "#b3e6ff")
                .text("Snow (mm)");

            // Temperature line
            const line = d3.line()
                .defined((d: number | null) => d !== null)
                .x((_: number | null, i: number) => x(i))
                .y((d: number | null) => d !== null ? yTemp(d) : 0);

            chart.append("path")
                .datum(temperature)
                .attr("class", "temp-line")
                .attr("d", line);

            // Pressure line - only if enabled
            if (this.showPressure && yPressure) {
                const pressureLine = d3.line()
                    .defined((d: number) => !isNaN(d))
                    .x((_: number, i: number) => x(i))
                    .y((d: number) => yPressure(d));

                chart.append("path")
                    .datum(pressure)
                    .attr("class", "pressure-line")
                    .attr("d", pressureLine);
            }

            // Weather icons along temperature curve - only if enabled
            if (this.showWeatherIcons) {
                // Use config property for icon density
                const iconInterval = this.denseWeatherIcons ? 1 : 2;

                chart.selectAll(".weather-icon")
                    .data(symbolCode)
                    .enter()
                    .append("foreignObject")
                    .attr("class", "weather-icon")
                    .attr("x", (_: string, i: number) => x(i) - 20)
                    .attr("y", (_: string, i: number) => {
                        const temp = temperature[i];
                        return temp !== null ? yTemp(temp) - 40 : -999;
                    })
                    .attr("width", 40)
                    .attr("height", 40)
                    .attr("opacity", (_: string, i: number) =>
                        (temperature[i] !== null && i % iconInterval === 0) ? 1 : 0)
                    .each((d: string, i: number, nodes: any) => {
                        if (i % iconInterval !== 0) return;

                        const node = nodes[i];
                        if (!d) return;

                        // Handle the typo in the API
                        const correctedSymbol = d
                            .replace(/^lightssleet/, 'lightsleet')
                            .replace(/^lightssnow/, 'lightsnow');

                        this.getIconSVG(correctedSymbol).then(svgContent => {
                            if (svgContent) {
                                const div = document.createElement('div');
                                div.style.width = '40px';
                                div.style.height = '40px';
                                div.innerHTML = svgContent;
                                node.appendChild(div);
                            } else {
                                console.warn(`Failed to load icon: ${correctedSymbol}`);
                            }
                        }).catch((err: Error) => {
                            console.error(`Error loading icon ${correctedSymbol}:`, err);
                        });
                    });
            }

            // Rain bars with labels - only if enabled
            const barWidth = Math.min(26, dx * 0.8);

            if (this.showRain) {
                // Draw max rain bars (background, lighter blue)
                chart.selectAll(".rain-max-bar")
                    .data(rainMax.slice(0, N - 1))
                    .enter().append("rect")
                    .attr("class", "rain-max-bar")
                    .attr("x", (_: number, i: number) => x(i) + dx / 2 - barWidth / 2)
                    .attr("y", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                        return yPrecip(0) - scaledH;
                    })
                    .attr("width", barWidth)
                    .attr("height", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        return h < 2 && d > 0 ? 2 : h * 0.7;
                    });

                // Draw main rain bars (foreground, deeper blue)
                chart.selectAll(".rain-bar")
                    .data(rain.slice(0, N - 1))
                    .enter().append("rect")
                    .attr("class", "rain-bar")
                    .attr("x", (_: number, i: number) => x(i) + dx / 2 - barWidth / 2)
                    .attr("y", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                        return yPrecip(0) - scaledH;
                    })
                    .attr("width", barWidth)
                    .attr("height", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        return h < 2 && d > 0 ? 2 : h * 0.7;
                    });

                // Add main rain labels (show if rain > 0)
                chart.selectAll(".rain-label")
                    .data(rain.slice(0, N - 1))
                    .enter()
                    .append("text")
                    .attr("class", "rain-label")
                    .attr("x", (_: number, i: number) => x(i) + dx / 2)
                    .attr("y", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                        return yPrecip(0) - scaledH - 4; // 4px above the top of the bar
                    })
                    .text((d: number) => {
                        if (d <= 0) return "";
                        return d < 1 ? d.toFixed(1) : d.toFixed(0);
                    })
                    .attr("opacity", (d: number) => d > 0 ? 1 : 0);

                // Add max rain labels (show if max > rain)
                chart.selectAll(".rain-max-label")
                    .data(rainMax.slice(0, N - 1))
                    .enter()
                    .append("text")
                    .attr("class", "rain-max-label")
                    .attr("x", (_: number, i: number) => x(i) + dx / 2)
                    // Remove unused 'i' from the function signature
                    .attr("y", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                        return yPrecip(0) - scaledH - 18; // 18px above the top of the max bar
                    })
                    .text((d: number, i: number) => {
                        if (d <= rain[i]) return "";
                        return d < 1 ? d.toFixed(1) : d.toFixed(0);
                    })
                    .attr("opacity", (d: number, i: number) => (d > rain[i]) ? 1 : 0);

                chart.selectAll(".snow-bar")
                    .data(snow.slice(0, N - 1))
                    .enter().append("rect")
                    .attr("class", "snow-bar")
                    .attr("x", (_: number, i: number) => x(i) + dx / 2 - barWidth / 2)
                    .attr("y", (_: number, i: number) => {
                        const h = chartHeight - yPrecip(snow[i]);
                        const scaledH = h < 2 && snow[i] > 0 ? 2 : h * 0.7;
                        return yPrecip(0) - scaledH;
                    })
                    .attr("width", barWidth)
                    .attr("height", (d: number) => {
                        const h = chartHeight - yPrecip(d);
                        return h < 2 && d > 0 ? 2 : h * 0.7;
                    });
            }

            // Wind band - only if enabled
            if (this.showWind) {
                const windBandYOffset = margin.top + chartHeight;
                const windBand = svg.append('g')
                    .attr('transform', `translate(${margin.left},${windBandYOffset})`);

                const windBandHeight = windBarbBand - 10;
                const windBarbY = windBandHeight / 2;

                windBand.append("rect")
                    .attr("class", "wind-band-bg")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", chartWidth)
                    .attr("height", windBandHeight);

                // Even hour grid lines
                const twoHourIdx: number[] = [];
                for (let i = 0; i < N; i++) {
                    if (time[i].getHours() % 2 === 0) twoHourIdx.push(i);
                }

                windBand.selectAll(".wind-band-grid")
                    .data(twoHourIdx)
                    .enter()
                    .append("line")
                    .attr("class", "wind-band-grid")
                    .attr("x1", (i: number) => x(i))
                    .attr("x2", (i: number) => x(i))
                    .attr("y1", 0)
                    .attr("y2", windBandHeight)
                    .attr("stroke", "#b8c4d9")
                    .attr("stroke-width", 1);

                const dayChangeIdx = dayStarts.slice(1);
                windBand.selectAll(".twentyfourh-line-wind")
                    .data(dayChangeIdx)
                    .enter()
                    .append("line")
                    .attr("class", "twentyfourh-line-wind")
                    .attr("x1", (i: number) => x(i))
                    .attr("x2", (i: number) => x(i))
                    .attr("y1", 0)
                    .attr("y2", windBandHeight);

                // Find the even hours for grid lines first
                const evenHourIdx: number[] = [];
                for (let i = 0; i < N; i++) {
                    if (time[i].getHours() % 2 === 0) evenHourIdx.push(i);
                }

                // Now place wind barbs exactly in the middle between even hours
                for (let idx = 0; idx < evenHourIdx.length - 1; idx++) {
                    const startIdx = evenHourIdx[idx];
                    const endIdx = evenHourIdx[idx + 1];

                    // Skip if the interval doesn't match our desired spacing for small screens
                    if (width < 400 && idx % 2 !== 0) continue;

                    // Calculate the exact center between the grid lines
                    const centerX = (x(startIdx) + x(endIdx)) / 2;

                    // Use average data for the interval
                    const dataIdx = Math.floor((startIdx + endIdx) / 2);
                    const speed = windSpeed[dataIdx];
                    const dir = windDirection[dataIdx];

                    // Scale barb length based on screen size
                    const minBarbLen = width < 400 ? 18 : 23;
                    const maxBarbLen = width < 400 ? 30 : 38;
                    const windLenScale = d3.scaleLinear()
                        .domain([0, Math.max(15, d3.max(windSpeed) || 20)])
                        .range([minBarbLen, maxBarbLen]);
                    const barbLen = windLenScale(speed);

                    // Draw the wind barb
                    this.drawWindBarb(windBand, centerX, windBarbY, speed, dir, barbLen, width < 400 ? 0.7 : 0.8);
                }

                // Wind band border
                windBand.append("rect")
                    .attr("class", "wind-band-outline")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", chartWidth)
                    .attr("height", windBandHeight)
                    .attr("stroke", "var(--meteogram-grid-color, #90caf9)") // Match axis/grid color
                    .attr("stroke-width", 1)
                    .attr("fill", "none");
            }

            // Bottom hour labels - adjust frequency based on width
            const hourLabelY = margin.top + chartHeight + windBarbBand + 18;
            svg.selectAll(".bottom-hour-label")
                .data(time)
                .enter()
                .append("text")
                .attr("class", "bottom-hour-label")
                .attr("x", (_: Date, i: number) => margin.left + x(i))
                .attr("y", hourLabelY)
                .attr("text-anchor", "middle")
                .text((d: Date, i: number) => {
                    const hour = d.getHours();
                    if (width < 400) {
                        return i % 6 === 0 ? String(hour).padStart(2, "0") : "";
                    } else if (width > 800) {
                        return i % 2 === 0 ? String(hour).padStart(2, "0") : "";
                    } else {
                        return i % 3 === 0 ? String(hour).padStart(2, "0") : "";
                    }
                });
        }

        // Draw a wind barb at the given position
        drawWindBarb(g: any, x: number, y: number, speed: number, dirDeg: number, len: number, scale = 0.8) {
            const featherLong = 12;
            const featherShort = 6;
            const featherYOffset = 3;

            const barbGroup = g.append("g")
                .attr("transform", `translate(${x},${y}) rotate(${dirDeg}) scale(${scale})`);

            const y0 = -len / 2, y1 = +len / 2;

            if (speed < 2) {
                barbGroup.append("circle")
                    .attr("class", "wind-barb-calm")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", 4);
                return;
            }

            barbGroup.append("line")
                .attr("class", "wind-barb")
                .attr("x1", 0).attr("y1", y0)
                .attr("x2", 0).attr("y2", y1);

            barbGroup.append("circle")
                .attr("class", "wind-barb-dot")
                .attr("cx", 0)
                .attr("cy", y1)
                .attr("r", 4);

            let v = speed, wy = y0, step = 7;
            let n10 = Math.floor(v / 10);
            v -= n10 * 10;
            let n5 = Math.floor(v / 5);
            v -= n5 * 5;

            for (let i = 0; i < n10; i++, wy += step) {
                barbGroup.append("line")
                    .attr("class", "wind-barb-feather")
                    .attr("x1", 0).attr("y1", wy)
                    .attr("x2", featherLong).attr("y2", wy + featherYOffset);
            }

            for (let i = 0; i < n5; i++, wy += step) {
                barbGroup.append("line")
                    .attr("class", "wind-barb-half")
                    .attr("x1", 0).attr("y1", wy)
                    .attr("x2", featherShort).attr("y2", wy + featherYOffset / 1.5);
            }
        }

        // Add explicit render method to ensure chart container is created properly
        render() {
            this._updateDarkMode(); // Ensure dark mode is set before rendering
            const {html} = window.litElementModules;
            return html`
                <ha-card>
                    ${this.title ? html`
                        <div class="card-header">${this.title}</div>` : ""}
                    <div class="card-content">
                        ${this.meteogramError
                                ? html`
                                    <div class="error">${this.meteogramError}</div>`
                                : html`
                                    <div id="chart"></div>`}
                    </div>
                    <div style="font-size: 0.85em; color: var(--secondary-text-color); text-align: right; padding: 0 16px 8px 0;">
                        Data from <a href="https://met.no/" target="_blank" rel="noopener" style="color: inherit;">met.no</a>
                    </div>
                </ha-card>
            `;
        }

        // Add logging method to help debug DOM structure - only used when errors occur
        private _logDomState() {
            if (this.errorCount > 0 && logEnabled) {
                console.debug('DOM state check:');
                console.debug('- shadowRoot exists:', !!this.shadowRoot);
                if (this.shadowRoot) {
                    const chartDiv = this.shadowRoot.querySelector('#chart');
                    console.debug('- chart div exists:', !!chartDiv);
                    if (chartDiv) {
                        console.debug('- chart div size:', (chartDiv as HTMLElement).offsetWidth, 'x', (chartDiv as HTMLElement).offsetHeight);
                    }
                }
                console.debug('- Is connected:', this.isConnected);
                console.debug('- Has rendered:', this.hasRendered);
                console.debug('- Chart loaded:', this.chartLoaded);
            }
        }

        // Helper method to set errors with rate limiting
        setError(message: string) {
            const now = Date.now();

            // If this is a repeat of the same error, just count it
            if (message === this.meteogramError) {
                this.errorCount++;

                // Only update the UI with the error count periodically
                if (now - this.lastErrorTime > 10000) { // 10 seconds
                    this.meteogramError = `${message} (occurred ${this.errorCount} times)`;
                    this.lastErrorTime = now;
                }
            } else {
                // New error, reset counter
                this.errorCount = 1;
                this.meteogramError = message;
                this.lastErrorTime = now;
                console.error("Meteogram error:", message);
            }
        }

        // Add dark mode detection
        private _updateDarkMode() {
            let isDark = false;
            // Home Assistant sets dark mode in hass.themes.darkMode
            if (this.hass && this.hass.themes && typeof this.hass.themes.darkMode === "boolean") {
                isDark = this.hass.themes.darkMode;
            } else {
                // Fallback: check .dark-theme on <html> or <body>
                isDark = document.documentElement.classList.contains('dark-theme') ||
                         document.body.classList.contains('dark-theme');
            }
            if (isDark) {
                this.setAttribute('dark', '');
            } else {
                this.removeAttribute('dark');
            }
        }
    }

// Tell TypeScript that the class is being used
// @ts-ignore: Used by customElement decorator
    window.customElements.get('meteogram-card') || customElements.define('meteogram-card', MeteogramCard);

// Visual editor for HACS
    @customElement('meteogram-card-editor')
    class MeteogramCardEditor extends HTMLElement implements MeteogramCardEditorElement {
        private _config: MeteogramCardConfig = {};
        private _initialized = false;
        private _elements: Map<string, ConfigurableHTMLElement> = new Map();
        private _hass: any;

        set hass(hass: any) {
            this._hass = hass;
            if (this._initialized) {
                this._updateValues();
            }
        }

        get hass() {
            return this._hass;
        }

        setConfig(config: MeteogramCardConfig): void {
            this._config = config || {};
            if (this._initialized) {
                this._updateValues();
            } else {
                this._initialize();
            }
        }

        get config() {
            return this._config;
        }

        connectedCallback() {
            if (!this._initialized) {
                this._initialize();
            }
        }

        private _initialize() {
            this.render();
            this._initialized = true;
        }

        // Update only the values, not the entire DOM
        private _updateValues() {
            if (!this._initialized) return;

            // Update title field
            const titleField = this._elements.get('title');
            if (titleField) {
                titleField.value = this._config.title || '';
            }

            // Update latitude field
            const latField = this._elements.get('latitude');
            if (latField) {
                latField.value = this._config.latitude !== undefined ?
                    String(this._config.latitude) :
                    (this._hass?.config?.latitude !== undefined ? String(this._hass.config.latitude) : '');
            }

            // Update longitude field
            const lonField = this._elements.get('longitude');
            if (lonField) {
                lonField.value = this._config.longitude !== undefined ?
                    String(this._config.longitude) :
                    (this._hass?.config?.longitude !== undefined ? String(this._hass.config.longitude) : '');
            }

            // Update toggle switches
            const cloudCoverSwitch = this._elements.get('show_cloud_cover');
            if (cloudCoverSwitch) {
                cloudCoverSwitch.checked = this._config.show_cloud_cover !== undefined ? this._config.show_cloud_cover : true;
            }

            const pressureSwitch = this._elements.get('show_pressure');
            if (pressureSwitch) {
                pressureSwitch.checked = this._config.show_pressure !== undefined ? this._config.show_pressure : true;
            }

            const rainSwitch = this._elements.get('show_rain');
            if (rainSwitch) {
                rainSwitch.checked = this._config.show_rain !== undefined ? this._config.show_rain : true;
            }

            const weatherIconsSwitch = this._elements.get('show_weather_icons');
            if (weatherIconsSwitch) {
                weatherIconsSwitch.checked = this._config.show_weather_icons !== undefined ? this._config.show_weather_icons : true;
            }

            const windSwitch = this._elements.get('show_wind');
            if (windSwitch) {
                windSwitch.checked = this._config.show_wind !== undefined ? this._config.show_wind : true;
            }

            const denseWeatherIconsSwitch = this._elements.get('dense_weather_icons');
            if (denseWeatherIconsSwitch) {
                denseWeatherIconsSwitch.checked = this._config.dense_weather_icons !== undefined ? this._config.dense_weather_icons : true;
            }
        }

        render() {
            // Get default coordinates from Home Assistant config if available
            const defaultLat = this._hass?.config?.latitude ?? '';
            const defaultLon = this._hass?.config?.longitude ?? '';

            // Get current toggle values or default to true
            const showCloudCover = this._config.show_cloud_cover !== undefined ? this._config.show_cloud_cover : true;
            const showPressure = this._config.show_pressure !== undefined ? this._config.show_pressure : true;
            const showRain = this._config.show_rain !== undefined ? this._config.show_rain : true;
            const showWeatherIcons = this._config.show_weather_icons !== undefined ? this._config.show_weather_icons : true;
            const showWind = this._config.show_wind !== undefined ? this._config.show_wind : true;
            const denseWeatherIcons = this._config.dense_weather_icons !== undefined ? this._config.dense_weather_icons : true;

            const div = document.createElement('div');
            div.innerHTML = `
  <style>
    ha-card {
      padding: 16px;
    }
    .values {
      padding-left: 16px;
      margin: 8px 0;
    }
    .row {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
    }
    ha-textfield {
      width: 100%;
    }
    .side-by-side {
      display: flex;
      gap: 12px;
    }
    .side-by-side > * {
      flex: 1;
    }
    h3 {
      font-size: 18px;
      color: var(--primary-text-color);
      font-weight: 500;
      margin-bottom: 12px;
      margin-top: 0;
    }
    .help-text {
      color: var(--secondary-text-color);
      font-size: 0.875rem;
      margin-top: 4px;
    }
    .info-text {
      color: var(--primary-text-color);
      opacity: 0.8;
      font-size: 0.9rem;
      font-style: italic;
      margin: 4px 0 16px 0;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .toggle-label {
      flex-grow: 1;
    }
    .toggle-section {
      margin-top: 16px;
      border-top: 1px solid var(--divider-color);
      padding-top: 16px;
    }
  </style>
  <ha-card>
    <h3>Meteogram Card Settings</h3>

    <div class="values">
      <div class="row">
        <ha-textfield
          label="Title"
          id="title-input"
          .value="${this._config.title || ''}"
        ></ha-textfield>
      </div>

      <p class="info-text">
        Location coordinates will be used to fetch weather data directly from Met.no API.
        ${defaultLat ? "Using Home Assistant's location by default." : ""}
      </p>

      <div class="side-by-side">
        <ha-textfield
          label="Latitude"
          id="latitude-input"
          type="number"
          step="any"
          .value="${this._config.latitude !== undefined ? this._config.latitude : defaultLat}"
          placeholder="${defaultLat ? `Default: ${defaultLat}` : ""}"
        ></ha-textfield>

        <ha-textfield
          label="Longitude"
          id="longitude-input"
          type="number"
          step="any"
          .value="${this._config.longitude !== undefined ? this._config.longitude : defaultLon}"
          placeholder="${defaultLon ? `Default: ${defaultLon}` : ""}"
        ></ha-textfield>
      </div>
      <p class="help-text">Leave empty to use Home Assistant's configured location</p>

      <div class="toggle-section">
        <h3>Display Options</h3>

        <div class="toggle-row">
          <div class="toggle-label">Show Cloud Cover</div>
          <ha-switch
            id="show-cloud-cover"
            .checked="${showCloudCover}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">Show Pressure</div>
          <ha-switch
            id="show-pressure"
            .checked="${showPressure}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">Show Rain</div>
          <ha-switch
            id="show-rain"
            .checked="${showRain}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">Show Weather Icons</div>
          <ha-switch
            id="show-weather-icons"
            .checked="${showWeatherIcons}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">Show Wind</div>
          <ha-switch
            id="show-wind"
            .checked="${showWind}"
          ></ha-switch>
        </div>

        <div class="toggle-row">
          <div class="toggle-label">Dense Weather Icons (every hour)</div>
          <ha-switch
            id="dense-weather-icons"
            .checked="${denseWeatherIcons}"
          ></ha-switch>
        </div>
      </div>
    </div>
  </ha-card>
`;

            // Clear previous content
            this.innerHTML = '';
            // Append new content
            this.appendChild(div);

            // Set up event listeners after DOM is updated
            setTimeout(() => {
                // Get and store references to all input elements with proper type casting
                const titleInput = this.querySelector('#title-input') as ConfigurableHTMLElement;
                if (titleInput) {
                    titleInput.configValue = 'title';
                    titleInput.addEventListener('input', this._valueChanged.bind(this));
                    this._elements.set('title', titleInput);
                }

                const latInput = this.querySelector('#latitude-input') as ConfigurableHTMLElement;
                if (latInput) {
                    latInput.configValue = 'latitude';
                    latInput.addEventListener('input', this._valueChanged.bind(this));
                    this._elements.set('latitude', latInput);
                }

                const lonInput = this.querySelector('#longitude-input') as ConfigurableHTMLElement;
                if ( lonInput) {
                    lonInput.configValue = 'longitude';
                    lonInput.addEventListener('input', this._valueChanged.bind(this));
                    this._elements.set('longitude', lonInput);
                }

                // Set up toggle switches
                const cloudCoverSwitch = this.querySelector('#show-cloud-cover') as ConfigurableHTMLElement;
                if (cloudCoverSwitch) {
                    cloudCoverSwitch.configValue = 'show_cloud_cover';
                    cloudCoverSwitch.addEventListener('change', this._valueChanged.bind(this));
                    this._elements.set('show_cloud_cover', cloudCoverSwitch);
                }

                const pressureSwitch = this.querySelector('#show-pressure') as ConfigurableHTMLElement;
                if (pressureSwitch) {
                    pressureSwitch.configValue = 'show_pressure';
                    pressureSwitch.addEventListener('change', this._valueChanged.bind(this));
                    this._elements.set('show_pressure', pressureSwitch);
                }

                const rainSwitch = this.querySelector('#show-rain') as ConfigurableHTMLElement;
                if (rainSwitch) {
                    rainSwitch.configValue = 'show_rain';
                    rainSwitch.addEventListener('change', this._valueChanged.bind(this));
                    this._elements.set('show_rain', rainSwitch);
                }

                const weatherIconsSwitch = this.querySelector('#show-weather-icons') as ConfigurableHTMLElement;
                if (weatherIconsSwitch) {
                    weatherIconsSwitch.configValue = 'show_weather_icons';
                    weatherIconsSwitch.addEventListener('change', this._valueChanged.bind(this));
                    this._elements.set('show_weather_icons', weatherIconsSwitch);
                }

                const windSwitch = this.querySelector('#show-wind') as ConfigurableHTMLElement;
                if (windSwitch) {
                    windSwitch.configValue = 'show_wind';
                    windSwitch.addEventListener('change', this._valueChanged.bind(this));
                    this._elements.set('show_wind', windSwitch);
                }

                const denseWeatherIconsSwitch = this.querySelector('#dense-weather-icons') as ConfigurableHTMLElement;
                if (denseWeatherIconsSwitch) {
                    denseWeatherIconsSwitch.configValue = 'dense_weather_icons';
                    denseWeatherIconsSwitch.addEventListener('change', this._valueChanged.bind(this));
                    this._elements.set('dense_weather_icons', denseWeatherIconsSwitch);
                }
            }, 0);
        }

        // Add the missing _valueChanged method
        private _valueChanged(ev: Event) {
            const target = ev.target as ConfigurableHTMLElement;
            if (!this._config || !target || !target.configValue) return;

            let newValue: string | number | boolean | undefined = target.value || '';

            // Handle different input types
            if (target.tagName === 'HA-SWITCH') {
                newValue = target.checked;
            } else if ((target as HTMLInputElement).type === 'number') {
                if (newValue === '') {
                    // If field is cleared, set to undefined to use defaults
                    newValue = undefined;
                } else {
                    const numValue = parseFloat(newValue.toString());
                    if (!isNaN(numValue)) {
                        newValue = numValue;
                    }
                }
            } else if (newValue === '') {
                newValue = undefined;
            }

            // Update config without re-rendering the entire form
            this._config = {
                ...this._config,
                [target.configValue]: newValue
            };

            this.dispatchEvent(new CustomEvent('config-changed', {
                detail: {config: this._config}
            }));
        }
    }


// Home Assistant requires this for custom cards
    (window as any).customCards = (window as any).customCards || [];
    (window as any).customCards.push({
        type: "meteogram-card",
        name: CARD_NAME,
        description: "A custom card showing a 48-hour meteogram with wind barbs.",
        version: version
    });
}
// Wait for Lit modules to be loaded before running the code
if (window.litElementModules) {
    runWhenLitLoaded();
} else {
    // If the banner has already set up the promise, wait for it to resolve
    if (typeof litModulesPromise !== 'undefined') {
        litModulesPromise.then(() => {
            runWhenLitLoaded();
        });
    } else {
        console.error("Lit modules not found and litModulesPromise not available");
    }
}

