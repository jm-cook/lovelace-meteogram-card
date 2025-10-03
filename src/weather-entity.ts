import {ForecastData} from "./weather-api";

export class WeatherEntityAPI {
    hass: any;
    entityId: string;
    private _forecastData: ForecastData | null = null;
    private _lastDataFetch: number | null = null; // Timestamp of last data fetch
    private _unsubForecast: (() => void) | null = null;

    constructor(hass: any, entityId: string, from: string) {
        // Instrumentation: log caller stack and arguments
        console.debug(`[WeatherEntityAPI] from ${from} Constructor called for entityId: ${entityId}`);
        this.hass = hass;
        this.entityId = entityId;
        // Subscribe to forecast updates if hass and entityId are available
        if (this.hass && this.entityId) {
            // console.debug(`[WeatherEntityAPI] from ${from} Subscribing to forecast updates for ${this.entityId}`);
            this.subscribeForecast((forecastArr: any[]) => {
                this._forecastData = this._parseForecastArray(forecastArr);
                this._lastDataFetch = Date.now(); // Update fetch timestamp
                console.debug(`[WeatherEntityAPI] from ${from} subscribeForecast: stored fresh ForecastData for ${this.entityId}`, this._forecastData?.time?.length);
                // Force chart update by dispatching a custom event
                const card = document.querySelector('meteogram-card') as any;
                if (card && typeof card._scheduleDrawMeteogram === "function") {
                    card._scheduleDrawMeteogram("WeatherEntityAPI-forecast-update", true);
                }
            }).then(unsub => {
                this._unsubForecast = unsub;
            });
        }
    }

    // Clean up old entity cache entries (older than 24h)
    private static cleanupOldEntityCacheEntries(cache: Record<string, { timestamp: number; data: ForecastData }>) {
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        let removedCount = 0;
        
        for (const [entityId, entry] of Object.entries(cache)) {
            if (now - entry.timestamp > twentyFourHours) {
                delete cache[entityId];
                removedCount++;
            }
        }
        
        if (removedCount > 0) {
            console.debug(`[WeatherEntityAPI] Cleaned up ${removedCount} old entity cache entries`);
        }
    }

    private _parseForecastArray(forecast: any[]): ForecastData {
        // Try to get units from the entity attributes if available
        let units: ForecastData['units'] = undefined;
        if (this.hass && this.entityId && this.hass.states && this.hass.states[this.entityId]) {
            const attrs = this.hass.states[this.entityId].attributes || {};
            units = {
                temperature: attrs.temperature_unit,
                pressure: attrs.pressure_unit,
                windSpeed: attrs.wind_speed_unit,
                precipitation: attrs.precipitation_unit || attrs.precipitation_unit || attrs.rain_unit,
                cloudCover: attrs.cloud_coverage_unit || '%'
            };
        }
        const result: ForecastData = {
            time: [],
            temperature: [],
            rain: [],
            rainMin: [],
            rainMax: [],
            snow: [],
            cloudCover: [],
            windSpeed: [],
            windDirection: [],
            windGust: [],
            symbolCode: [],
            pressure: [],
            fetchTimestamp: new Date().toISOString(),
            units
        };

        forecast.forEach((item: any) => {
            result.time.push(new Date(item.datetime || item.time));
            result.temperature.push(item.temperature ?? null);
            result.rain.push(item.precipitation ?? 0);

            // Only push rainMin/rainMax if precipitation_min/max are present
            if ('precipitation_min' in item) {
                result.rainMin.push(item.precipitation_min);
            }
            if ('precipitation_max' in item) {
                result.rainMax.push(item.precipitation_max);
            }

            // Only push snow if present
            if ('snow' in item && typeof item.snow === 'number') {
                result.snow.push(item.snow);
            }

            // Only push cloudCover if present
            if ('cloud_coverage' in item && typeof item.cloud_coverage === 'number') {
                result.cloudCover.push(item.cloud_coverage);
            }

            // Only push windSpeed/windDirection/windGust if present
            if ('wind_speed' in item && typeof item.wind_speed === 'number') {
                result.windSpeed.push(item.wind_speed);
            }
            if ('wind_bearing' in item && typeof item.wind_bearing === 'number') {
                result.windDirection.push(item.wind_bearing);
            }
            if ('wind_gust' in item && typeof item.wind_gust === 'number') {
                result.windGust.push(item.wind_gust);
            } else if ('wind_gust_speed' in item && typeof item.wind_gust_speed === 'number') {
                result.windGust.push(item.wind_gust_speed);
            } else if ('wind_speed_gust' in item && typeof item.wind_speed_gust === 'number') {
                result.windGust.push(item.wind_speed_gust);
            } else if ('gust_speed' in item && typeof item.gust_speed === 'number') {
                result.windGust.push(item.gust_speed);
            } else {
                // No gust data available - push null instead of duplicating wind_speed
                result.windGust.push(null);
            }

            result.symbolCode.push(item.condition ?? "");

            // Map pressure attribute for renderer compatibility
            if ('pressure' in item && typeof item.pressure === 'number') {
                result.pressure.push(item.pressure);
            } else if ('pressure_mbar' in item && typeof item.pressure_mbar === 'number') {
                result.pressure.push(item.pressure_mbar);
            } else if ('pressure_hpa' in item && typeof item.pressure_hpa === 'number') {
                result.pressure.push(item.pressure_hpa);
            }
        });

        // Store the parsed forecast in localStorage using a shared cache object
        try {
            const cacheKey = 'meteogram-card-entity-weather-cache';
            let cache: Record<string, {
                timestamp: number;
                data: ForecastData;
            }> = {};
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                try {
                    const parsedCache = JSON.parse(rawCache);
                    // Handle both old format (direct ForecastData) and new format (with timestamp)
                    for (const [entityId, entry] of Object.entries(parsedCache)) {
                        if (entry && typeof entry === 'object' && 'timestamp' in entry && 'data' in entry) {
                            cache[entityId] = entry as { timestamp: number; data: ForecastData };
                        } else {
                            // Old format - convert to new format with current timestamp
                            cache[entityId] = {
                                timestamp: Date.now(),
                                data: entry as ForecastData
                            };
                        }
                    }
                } catch (e) {
                    console.warn(`[WeatherEntityAPI] Failed to parse existing cache, starting fresh:`, e);
                    cache = {};
                }
            }
            
            // Clean up entries older than 24h before saving
            WeatherEntityAPI.cleanupOldEntityCacheEntries(cache);
            
            cache[this.entityId] = {
                timestamp: Date.now(),
                data: result
            };
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        } catch (e) {
            console.warn(`[WeatherEntityAPI] Failed to store forecast for ${this.entityId} in localStorage:`, e);
        }

        return result;
    }

    // Fetch fresh data directly from the entity (not from cache)
    private _fetchFreshEntityData(): void {
        console.debug(`[WeatherEntityAPI] _fetchFreshEntityData called for entityId=${this.entityId}`);
        
        const entity = this.hass.states[this.entityId];
        if (!entity) {
            console.debug(`[WeatherEntityAPI] Entity not found: ${this.entityId}`);
            return;
        }
        if (!entity.attributes) {
            console.debug(`[WeatherEntityAPI] Entity has no attributes: ${this.entityId}`);
            return;
        }
        
        if (!Array.isArray(entity.attributes.forecast)) {
            console.debug(`[WeatherEntityAPI] Entity forecast attribute is not an array:`, entity.attributes.forecast);
            return;
        }

        // Parse and store fresh data
        this._forecastData = this._parseForecastArray(entity.attributes.forecast);
        this._lastDataFetch = Date.now(); // Update fetch timestamp
        
        console.debug(`[WeatherEntityAPI] Fresh data fetched for ${this.entityId}, forecast length: ${entity.attributes.forecast.length}`);
    }

    getForecast(): ForecastData | null {
        // This method returns the current/instantaneous forecast data
        // For hourly forecast data used by meteogram, use getForecastData() instead
        if (this._forecastData) {
            return this._forecastData;
        }
        
        const entity = this.hass.states[this.entityId];
        if (!entity?.attributes?.forecast) {
            return null;
        }
        
        // Return current forecast without freshness checking (different use case)
        return this._parseForecastArray(entity.attributes.forecast);
    }

    /**
     * Subscribe to forecast updates for the weather entity.
     * @param callback Called with the forecast array when updates arrive.
     * @returns Unsubscribe function.
     */
    subscribeForecast(callback: (forecast: any[]) => void): Promise<() => void> {
        console.debug(`[WeatherEntityAPI] subscribeForecast called for entityId=${this.entityId}`);
        if (!this.hass?.connection) {
            // console.debug(`[WeatherEntityAPI] subscribeForecast: hass.connection not available`);
            return Promise.resolve(() => {});
        }
        const unsubPromise = this.hass.connection.subscribeMessage(
            (event: any) => {
                if (Array.isArray(event.forecast)) {
                    // console.debug(`[WeatherEntityAPI] subscribeForecast: received forecast update`, event.forecast);
                    callback(event.forecast);
                } else {
                    console.debug(`[WeatherEntityAPI] subscribeForecast: event.forecast not array`, event);
                }
            },
            {
                type: "weather/subscribe_forecast",
                entity_id: this.entityId,
                forecast_type: "hourly"
            }
        );
        return unsubPromise;
    }

    /**
     * Get the latest ForecastData received from subscribeForecast.
     * If _forecastData is null, try to fill it from localStorage.
     */
    getForecastData(): ForecastData | null {
        // Check if we have data and if it's fresh (less than 1 hour old)
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
        
        if (this._forecastData && this._lastDataFetch && (now - this._lastDataFetch < oneHour)) {
            // Data is fresh, return it
            return this._forecastData;
        }
        
        // Data is stale or doesn't exist, fetch fresh data
        if (this._lastDataFetch) {
            const ageMinutes = Math.round((now - this._lastDataFetch) / (60 * 1000));
            console.debug(`[WeatherEntityAPI] Data is stale for ${this.entityId} (${ageMinutes} min old), fetching fresh data`);
        } else {
            console.debug(`[WeatherEntityAPI] No data for ${this.entityId}, fetching fresh data`);
        }
        
        this._forecastData = null; // Clear stale data
        this._fetchFreshEntityData();
        
        // If fresh fetch succeeded, return the data
        if (this._forecastData) {
            return this._forecastData;
        }
        
        // Fresh fetch failed, try to load from localStorage cache as fallback
        try {
            const cacheKey = 'meteogram-card-entity-weather-cache';
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                const cache = JSON.parse(rawCache);
                const stored = cache[this.entityId];
                if (stored) {
                    // Handle both old format (direct ForecastData) and new format (with timestamp)
                    let forecastData: ForecastData;
                    if (stored && typeof stored === 'object' && 'timestamp' in stored && 'data' in stored) {
                        // New format - check if not too old (24h)
                        const twentyFourHours = 24 * 60 * 60 * 1000;
                        if (Date.now() - stored.timestamp > twentyFourHours) {
                            console.debug(`[WeatherEntityAPI] Cached data for ${this.entityId} is too old (${Math.round((Date.now() - stored.timestamp) / (60 * 60 * 1000))}h), ignoring cache`);
                            return null;
                        }
                        forecastData = stored.data;
                    } else {
                        // Old format - use directly but consider it potentially stale
                        forecastData = stored as ForecastData;
                    }
                    
                    // Validate that cached data has all required array properties
                    const requiredArrays = ['time', 'temperature', 'rain', 'rainMin', 'rainMax', 'snow', 'cloudCover', 'windSpeed', 'windGust', 'windDirection', 'symbolCode', 'pressure'];
                    const missingArrays = requiredArrays.filter(prop => !Array.isArray(forecastData[prop as keyof ForecastData]));
                    
                    if (missingArrays.length > 0) {
                        console.warn(`[WeatherEntityAPI] Cached data for ${this.entityId} is missing required arrays: ${missingArrays.join(', ')}, ignoring cache`);
                        return null;
                    }
                    
                    // Restore Date objects in time array
                    if (Array.isArray(forecastData.time)) {
                        forecastData.time = forecastData.time.map((t: string | Date) =>
                            typeof t === "string" ? new Date(t) : t
                        );
                    }
                    this._forecastData = forecastData;
                    // console.debug(`[WeatherEntityAPI] Loaded forecast for ${this.entityId} from localStorage cache`, this._forecastData);
                    return this._forecastData;
                }
            }
        } catch (e) {
            console.warn(`[WeatherEntityAPI] Failed to load forecast for ${this.entityId} from localStorage cache:`, e);
        }
        return null;
    }

    /**
     * Destructor: Unsubscribe from forecast updates.
     */
    destroy(from: string) {
        if (this._unsubForecast) {
            try {
                this._unsubForecast();
                this._unsubForecast = null;
                // console.debug(`[WeatherEntityAPI] from ${from} Unsubscribed from forecast updates for ${this.entityId}`);
            } catch (err) {
                console.warn(`[WeatherEntityAPI] from ${from} Error during unsubscribe for ${this.entityId}:`, err);
            }
        }
    }
}

/**
 * Map HA weather entity 'condition' values to Met.no weather icon names, with day/night support.
 * Covers all standard and many custom HA conditions, and only uses day/night variants where they exist in Met.no.
 * @param condition The HA condition string
 * @param date The forecast time (Date)
 * @param isDaytime Boolean: true if day, false if night
 */
export function mapHaConditionToMetnoSymbol(condition: string, date?: Date, isDaytime?: boolean): string {
    // Reference: https://github.com/metno/weathericons/tree/main/weather (README)
    // If isDaytime is undefined, fallback to 6:00-18:00 as day
    let day = isDaytime;
    if (day === undefined && date instanceof Date) {
        const hour = date.getHours();
        day = hour >= 6 && hour < 18;
    }
    // Only these icons have _day/_night variants in Met.no set
    const hasDayNight = new Set([
        'clearsky', 'partlycloudy', 'fair',
        'rainshowers', 'heavyrainshowers', 'lightrainshowers',
        'snowshowers', 'heavysnowshowers', 'lightsnowshowers',
        'sleetshowers', 'heavysleetshowers', 'lightsleetshowers',
        'rainshowersandthunder', 'heavyrainshowersandthunder', 'lightrainshowersandthunder',
        'snowshowersandthunder', 'heavysnowshowersandthunder', 'lightsnowshowersandthunder',
        'sleetshowersandthunder', 'heavysleetshowersandthunder', 'lightsleetshowersandthunder',
        'hailshowers', 'hailshowersandthunder',
        'rainshowerspolartwilight', 'snowshowerspolartwilight', 'sleetshowerspolartwilight', 'hailshowerspolartwilight',
        'rainshowersandthunderpolartwilight', 'snowshowersandthunderpolartwilight', 'sleetshowersandthunderpolartwilight', 'hailshowersandthunderpolartwilight',
        'clearsky_polartwilight', 'partlycloudy_polartwilight', 'fair_polartwilight'
    ]);
    // Helper to append _day/_night if needed
    const dn = (base: string) => (hasDayNight.has(base) && day !== undefined ? base + (day ? '_day' : '_night') : base);
    // Expanded mapping for all known HA conditions and common custom ones
    const mapping: Record<string, string|((d?:Date,day?:boolean)=>string)> = {
        // Standard HA conditions
        "clear-night": () => "clearsky_night",
        "clear-day": () => "clearsky_day",
        "sunny": () => "clearsky_day",
        "cloudy": () => "cloudy",
        "overcast": () => "cloudy",
        "mostlycloudy": () => "cloudy",
        "partlycloudy": () => dn("partlycloudy"),
        "partly-sunny": () => dn("partlycloudy"),
        "partly-cloudy-night": () => "partlycloudy_night",
        "fog": () => "fog",
        "hail": () => "hail",
        "lightning": () => "thunderstorm",
        "lightning-rainy": () => dn("rainshowersandthunder"),
        "pouring": () => "heavyrain",
        "rainy": () => "rain",
        "drizzle": () => "lightrain",
        "freezing-rain": () => "sleet",
        "snowy": () => "snow",
        "snowy-rainy": () => "sleet",
        "windy": () => dn("fair"),
        "windy-variant": () => dn("fair"),
        "exceptional": () => "clearsky_day",
        // Extra/rare conditions
        "hot": () => "clearsky_day",
        "cold": () => day === false ? "clearsky_night" : "clearsky_day",
        // Direct Met.no symbol codes (for Met.no API users)
        "fair": () => dn("fair"),
        "rainshowers": () => dn("rainshowers"),
        "heavyrainshowers": () => dn("heavyrainshowers"),
        "lightrainshowers": () => dn("lightrainshowers"),
        "snowshowers": () => dn("snowshowers"),
        "heavysnowshowers": () => dn("heavysnowshowers"),
        "lightsnowshowers": () => dn("lightsnowshowers"),
        "sleetshowers": () => dn("sleetshowers"),
        "heavysleetshowers": () => dn("heavysleetshowers"),
        "lightsleetshowers": () => dn("lightsleetshowers"),
        "rainshowersandthunder": () => dn("rainshowersandthunder"),
        "heavyrainshowersandthunder": () => dn("heavyrainshowersandthunder"),
        "lightrainshowersandthunder": () => dn("lightrainshowersandthunder"),
        "snowshowersandthunder": () => dn("snowshowersandthunder"),
        "heavysnowshowersandthunder": () => dn("heavysnowshowersandthunder"),
        "lightsnowshowersandthunder": () => dn("lightsnowshowersandthunder"),
        "sleetshowersandthunder": () => dn("sleetshowersandthunder"),
        "heavysleetshowersandthunder": () => dn("heavysleetshowersandthunder"),
        "lightsleetshowersandthunder": () => dn("lightsleetshowersandthunder"),
        "hailshowers": () => dn("hailshowers"),
        "hailshowersandthunder": () => dn("hailshowersandthunder"),
        // Non-day/night Met.no codes
        "rain": () => "rain",
        "heavyrain": () => "heavyrain",
        "lightrain": () => "lightrain",
        "snow": () => "snow",
        "heavysnow": () => "heavysnow",
        "lightsnow": () => "lightsnow",
        "sleet": () => "sleet",
        "heavysleet": () => "heavysleet",
        "lightsleet": () => "lightsleet",
        "thunderstorm": () => "thunderstorm",
        "clearsky": () => dn("clearsky")
    };
    // Normalize condition to lowercase for mapping
    const cond = condition ? condition.toLowerCase() : "";
    const entry = mapping[cond];
    if (typeof entry === 'function') return entry(date, day);
    if (typeof entry === 'string') return entry;
    // Fallback: if condition ends with -night, use _night, if -day or -daytime, use _day
    if (cond.endsWith('-night')) return cond.replace('-night', '_night');
    if (cond.endsWith('-day') || cond.endsWith('-daytime')) return cond.replace(/-day(time)?$/, '_day');
    // Fallback: unknown condition, use clearsky_day or clearsky_night
    return day === false ? "clearsky_night" : "clearsky_day";
}
