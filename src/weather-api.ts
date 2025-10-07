import {version} from "../package.json";


export interface ForecastData {
    pressure: (number | null)[];
    time: Date[];
    temperature: (number | null)[];
    rain: (number | null)[];
    rainMin: (number | null)[];
    rainMax: (number | null)[];
    cloudCover: (number | null)[];
    windSpeed: (number | null)[];
    windGust: (number | null)[];
    windDirection: (number | null)[];
    symbolCode: string[];
    fetchTimestamp?: string;
    units?: {
        temperature?: string;
        pressure?: string;
        windSpeed?: string;
        precipitation?: string;
        cloudCover?: string;
        [key: string]: string | undefined;
    };
}

export class WeatherAPI {
    static METEOGRAM_CARD_API_CALL_COUNT = 0;
    static METEOGRAM_CARD_API_SUCCESS_COUNT = 0;

    lastError: unknown = null;
    lastStatusCode: number | null = null;
    lat: number;
    lon: number;
    altitude?: number; // Optional altitude in meters
    private _forecastData: ForecastData | null = null;
    private _expiresAt: number | null = null;
    private _fetchPromise: Promise<void> | null = null;
    private _lastFetchTime: number | null = null; // Track last fetch timestamp

    constructor(lat: number, lon: number, altitude?: number) {
        this.lat = lat;
        this.lon = lon;
        if (Number.isFinite(altitude)) {
            this.altitude = altitude;
        }
    }

    // Getter for forecastData: checks expiry and refreshes if needed
    async getForecastData(): Promise<ForecastData | null> {
        console.debug(`[weather-api] getForecastData called for lat=${this.lat}, lon=${this.lon}`);

        // If no data loaded, try to load from cache first
        if (!this._forecastData) {
            this.loadCacheFromStorage();
        }
        // If cache is valid, return it
        if (this._forecastData && this._expiresAt && Date.now() < this._expiresAt) {
            return this._forecastData;
        }
        // Only one fetch at a time, and throttle to 1 per 60 seconds
        const now = Date.now();
        if (
            this._lastFetchTime &&
            now - this._lastFetchTime < 60000
        ) {
            // If there's an active fetch, wait for it
            if (this._fetchPromise) {
                await this._fetchPromise;
                return this._forecastData;
            }
            // If we're in throttle period but no active fetch, return cached data if available
            // This prevents the "retrying in 60 seconds" issue when fetch failed
            if (this._forecastData) {
                console.debug('[weather-api] Using expired cached data during throttle period');
                return this._forecastData;
            }
        }
        if (!this._fetchPromise) {
            this._fetchPromise = this._fetchWeatherDataFromAPI();
        }
        try {
            await this._fetchPromise;
        } finally {
            this._fetchPromise = null;
        }
        
        // Final safeguard: if we still don't have data, throw an error
        if (!this._forecastData) {
            throw new Error('Weather data fetch completed but no valid data was obtained');
        }
        
        return this._forecastData;
    }

    get expiresAt(): number | null {
        return this._expiresAt;
    }

    getDiagnosticText(): string {
        let diag = `<br><b>Weather API Error</b><br>`;
        if (this.lastError instanceof Error) {
            diag += `Error: <code>${this.lastError.message}</code><br>`;
        } else if (this.lastError !== undefined && this.lastError !== null) {
            diag += `Error: <code>${String(this.lastError)}</code><br>`;
        }
        diag += `Status: <code>${this.lastStatusCode ?? ""}</code><br>`;
        diag += `Card version: <code>${version || "unknown"}</code><br>`;
        diag += `Client type: <code>${navigator.userAgent}</code><br>`;
        return diag;
    }

    getDiagnosticInfo(): any {
        return {
            apiType: 'MET.no Weather API',
            hasData: !!this._forecastData,
            dataTimeLength: this._forecastData?.time?.length || 0,
            lastFetchTime: this._lastFetchTime ? new Date(this._lastFetchTime).toISOString() : 'never',
            lastFetchFormatted: this._lastFetchTime ? new Date(this._lastFetchTime).toLocaleString() : 'not yet fetched',
            dataAgeMinutes: this._lastFetchTime ? Math.round((Date.now() - this._lastFetchTime) / (60 * 1000)) : 'n/a',
            expiresAt: this._expiresAt,
            expiresAtFormatted: this._expiresAt ? new Date(this._expiresAt).toLocaleString() : 'not set',
            isExpired: this._expiresAt ? Date.now() > this._expiresAt : false,
            location: {
                lat: this.lat,
                lon: this.lon,
                altitude: this.altitude
            }
        };
    }

    // Helper to encode cache key as base64 of str(lat)+str(lon)+str(altitude)
    private static encodeCacheKey(lat: number, lon: number, altitude?: number): string {
        let keyStr = String(lat) + "," + String(lon);
        if (typeof altitude === 'number' && !isNaN(altitude)) {
            keyStr += "," + String(altitude);
        }
        return btoa(keyStr);
    }

    // Clean up old cache entries (older than 24h) and validate data structures
    private static cleanupOldCacheEntries() {
        try {
            const cacheStr = localStorage.getItem('metno-weather-cache');
            if (!cacheStr) return;
            
            const cacheObj = JSON.parse(cacheStr);
            if (!cacheObj["forecast-data"]) return;
            
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const requiredArrays = ['time', 'temperature', 'rain', 'rainMin', 'rainMax', 'cloudCover', 'windSpeed', 'windGust', 'windDirection', 'symbolCode', 'pressure'];
            let removedCount = 0;
            let invalidCount = 0;
            
            // Remove old entries and validate data structures
            for (const [key, entry] of Object.entries(cacheObj["forecast-data"])) {
                const entryData = entry as { expiresAt: number; data: ForecastData };
                let shouldRemove = false;
                
                // Remove entries older than 24h past expiry
                if (now - entryData.expiresAt > twentyFourHours) {
                    shouldRemove = true;
                    removedCount++;
                }
                // Validate data structure
                else if (!entryData.data || typeof entryData.data !== 'object') {
                    shouldRemove = true;
                    invalidCount++;
                }
                // Check for missing required arrays
                else {
                    const missingArrays = requiredArrays.filter(prop => !Array.isArray(entryData.data[prop as keyof ForecastData]));
                    if (missingArrays.length > 0) {
                        shouldRemove = true;
                        invalidCount++;
                    }
                }
                
                if (shouldRemove) {
                    delete cacheObj["forecast-data"][key];
                }
            }
            
            if (removedCount > 0 || invalidCount > 0) {
                localStorage.setItem('metno-weather-cache', JSON.stringify(cacheObj));
                console.debug(`[WeatherAPI] Cleaned up ${removedCount} old and ${invalidCount} invalid cache entries from metno-weather-cache`);
            }
        } catch (e) {
            console.warn(`[WeatherAPI] Failed to cleanup cache entries, clearing entire cache:`, e);
            // Clear corrupted cache entirely
            try {
                localStorage.removeItem('metno-weather-cache');
                console.debug(`[WeatherAPI] Cleared corrupted metno-weather-cache`);
            } catch (clearError) {
                console.error(`[WeatherAPI] Failed to clear corrupted cache:`, clearError);
            }
        }
    }

    // Save forecast data to localStorage
    saveCacheToStorage() {
        if (!this._forecastData || !this._expiresAt) return;
        
        // Clean up old entries before saving new ones
        WeatherAPI.cleanupOldCacheEntries();
        
        const key = WeatherAPI.encodeCacheKey(Number(this.lat.toFixed(4)), Number(this.lon.toFixed(4)), this.altitude !== undefined ? Number(this.altitude.toFixed(2)) : undefined);
        let cacheObj: {
            ["forecast-data"]?: Record<string, {
                expiresAt: number,
                data: ForecastData
            }>
        } = {};
        const cacheStr = localStorage.getItem('metno-weather-cache');
        if (cacheStr) {
            try {
                cacheObj = JSON.parse(cacheStr);
            } catch {
                cacheObj = {};
            }
        }
        if (!cacheObj["forecast-data"]) cacheObj["forecast-data"] = {};
        cacheObj["forecast-data"][key] = {
            expiresAt: this._expiresAt,
            data: this._forecastData
        };
        localStorage.setItem('metno-weather-cache', JSON.stringify(cacheObj));
    }

    // Load forecast data from localStorage
    loadCacheFromStorage() {
        const key = WeatherAPI.encodeCacheKey(Number(this.lat.toFixed(4)), Number(this.lon.toFixed(4)), this.altitude !== undefined ? Number(this.altitude.toFixed(2)) : undefined);
        let shouldCleanupCache = false;
        
        try {
            const cacheStr = localStorage.getItem('metno-weather-cache');
            if (cacheStr) {
                let cacheObj: {
                    ["forecast-data"]?: Record<string, {
                        expiresAt: number,
                        data: ForecastData
                    }>
                } = {};
                try {
                    cacheObj = JSON.parse(cacheStr);
                } catch {
                    console.warn(`[WeatherAPI] Corrupted cache JSON, clearing metno-weather-cache`);
                    localStorage.removeItem('metno-weather-cache');
                    this._expiresAt = null;
                    this._forecastData = null;
                    return;
                }
                
                const entry = cacheObj["forecast-data"]?.[key];
                if (entry && entry.expiresAt && entry.data) {
                    // Check if cache entry is expired (older than 24h past expiresAt)
                    const twentyFourHours = 24 * 60 * 60 * 1000;
                    const now = Date.now();
                    if (now - entry.expiresAt > twentyFourHours) {
                        console.debug(`[WeatherAPI] Cached data for ${key} is too old (${Math.round((now - entry.expiresAt) / (60 * 60 * 1000))}h past expiry), removing from cache`);
                        if (!cacheObj["forecast-data"]) cacheObj["forecast-data"] = {};
                        delete cacheObj["forecast-data"][key];
                        shouldCleanupCache = true;
                        this._expiresAt = null;
                        this._forecastData = null;
                    } else {
                        // Validate that cached data has all required array properties
                        const requiredArrays = ['time', 'temperature', 'rain', 'rainMin', 'rainMax', 'cloudCover', 'windSpeed', 'windGust', 'windDirection', 'symbolCode', 'pressure'];
                        const missingArrays = requiredArrays.filter(prop => !Array.isArray(entry.data[prop as keyof ForecastData]));
                        
                        if (missingArrays.length > 0) {
                            console.warn(`[WeatherAPI] Cached data for ${key} is missing required arrays: ${missingArrays.join(', ')}, removing from cache`);
                            if (!cacheObj["forecast-data"]) cacheObj["forecast-data"] = {};
                            delete cacheObj["forecast-data"][key];
                            shouldCleanupCache = true;
                            this._expiresAt = null;
                            this._forecastData = null;
                        } else {
                            this._expiresAt = entry.expiresAt;
                            // Restore Date objects in time array
                            if (Array.isArray(entry.data.time)) {
                                entry.data.time = entry.data.time.map((t: string | Date) =>
                                    typeof t === "string" ? new Date(t) : t
                                );
                            }
                            this._forecastData = entry.data;
                        }
                    }
                    
                    // Save cleaned cache back to localStorage if changes were made
                    if (shouldCleanupCache) {
                        localStorage.setItem('metno-weather-cache', JSON.stringify(cacheObj));
                        console.debug(`[WeatherAPI] Updated cache structure for ${key}`);
                    }
                } else {
                    this._expiresAt = null;
                    this._forecastData = null;
                }
            } else {
                this._expiresAt = null;
                this._forecastData = null;
            }
        } catch (e) {
            console.warn(`[WeatherAPI] Failed to load cache:`, e);
            // Clear corrupted cache entirely
            try {
                localStorage.removeItem('metno-weather-cache');
                console.warn(`[WeatherAPI] Cleared corrupted metno-weather-cache due to error`);
            } catch (cleanupError) {
                console.error(`[WeatherAPI] Failed to clear corrupted cache:`, cleanupError);
            }
            this._expiresAt = null;
            this._forecastData = null;
        }
    }

    // Make fetchWeatherDataFromAPI private and update usages
    private async _fetchWeatherDataFromAPI(): Promise<void> {
        // Throttle: if last fetch was less than 60s ago, skip fetch
        const now = Date.now();
        if (this._lastFetchTime && now - this._lastFetchTime < 60000) {
            // Already fetched recently, skip
            return;
        }
        this._lastFetchTime = now;

        const lat = this.lat;
        const lon = this.lon;
        let url = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
        if (Number.isFinite(this.altitude)) {
            url += `&altitude=${this.altitude}`;
        }
        let dedicatedForecastUrl = url;
        let urlToUse = dedicatedForecastUrl;
        let headers: Record<string, string> = {};
        this.lastStatusCode = null;
        this.lastError = null;

        try {
            headers = {
                'Origin': window.location.origin,
                'Accept': 'application/json'
            };

            // Always use dedicated forecast URL
            // log impending call to fetch
            console.debug(`[weather-api] Fetching weather data from ${urlToUse} with Origin ${headers['Origin']}`);
            WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT++;
            const response = await fetch(urlToUse, {
                headers,
                mode: 'cors',
                method: 'GET'
            });

            this.lastStatusCode = response.status;

            const expiresHeader = response.headers.get("Expires");
            // --- SPOOF: Always set expires to now + 3 minutes for testing ---
            // const spoofedExpires = new Date(Date.now() + 1 * 60 * 1000);
            // let expires: Date | null = spoofedExpires;
            // // If you want to log the spoof:
            // console.debug(`[weather-api] Spoofing expiresHeader to ${spoofedExpires.toISOString()}`);
            // --- END SPOOF ---

            // If you want to keep the original logic for reference, comment it out:
            let expires: Date | null = null;
            if (expiresHeader) {
                const expiresDate = new Date(expiresHeader);
                if (!isNaN(expiresDate.getTime())) {
                    expires = expiresDate;
                }
            }

            if (this.lastStatusCode === 429) {
                const nextTry = expires ? expires.toLocaleTimeString() : "later";
                throw new Error(`Weather API throttling: Too many requests. Please wait until ${nextTry} before retrying.`);
            }

            if (this.lastStatusCode === 304) {
                throw new Error("API returned 304 but no cached data is available.");
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Weather API returned ${response.status}: ${response.statusText}\n${errorText}`);
            }

            const jsonData = await response.json();
            WeatherAPI.METEOGRAM_CARD_API_SUCCESS_COUNT++;
            // Parse and store forecast data
            this.assignMeteogramDataFromRaw(jsonData);
            this._expiresAt = expires ? expires.getTime() : null;
            this.saveCacheToStorage();
        } catch (error: unknown) {
            this.lastError = error;
            // Reset throttling on fetch failure to allow retry sooner
            this._lastFetchTime = null;
            const diag = this.getDiagnosticText() +
                `API URL: <code>${urlToUse}</code><br>` +
                `Origin header: <code>${headers['Origin']}</code><br>`;
            throw new Error(`<br>Failed to get weather data: ${(error as Error).message}\n<br>Check your network connection, browser console, and API accessibility.\n\n${diag}`);
        }
    }

    // assignMeteogramDataFromRaw now only sets _forecastData
    assignMeteogramDataFromRaw(rawData: any): void {
        try {
            if (!rawData || !rawData.properties || !Array.isArray(rawData.properties.timeseries)) {
                throw new Error("Invalid raw data format from weather API");
            }
            const timeseries = rawData.properties.timeseries;
            const filtered = timeseries.filter((item: any) => {
                const time = new Date(item.time);
                return time.getMinutes() === 0;
            });

            const result: ForecastData = {
                time: [],
                temperature: [],
                rain: [],
                rainMin: [],
                rainMax: [],
                cloudCover: [],
                windSpeed: [],
                windGust: [],
                windDirection: [],
                symbolCode: [],
                pressure: [],
                units: undefined
            };
            result.fetchTimestamp = new Date().toISOString();

            filtered.forEach((item: any) => {
                const time = new Date(item.time);
                const instant = item.data.instant.details;
                const next1h = item.data.next_1_hours?.details;
                const next6h = item.data.next_6_hours?.details;
                const next6hSummary = item.data.next_6_hours?.summary;

                result.time.push(time);
                result.temperature.push(instant.air_temperature ?? null);
                result.cloudCover.push(instant.cloud_area_fraction ?? null);
                result.windSpeed.push(instant.wind_speed ?? null);
                result.windGust.push(instant.wind_speed_of_gust ?? null);
                result.windDirection.push(instant.wind_from_direction ?? null);
                result.pressure.push(instant.air_pressure_at_sea_level ?? null);

                if (next1h) {
                    // Only use actual min/max values if they exist, otherwise set to null
                    const rainAmountMax = next1h.precipitation_amount_max !== undefined ?
                        next1h.precipitation_amount_max : null;

                    const rainAmountMin = next1h.precipitation_amount_min !== undefined ?
                        next1h.precipitation_amount_min : null;

                    result.rainMin.push(rainAmountMin);
                    result.rainMax.push(rainAmountMax);
                    result.rain.push(next1h.precipitation_amount ?? null);

                    if (item.data.next_1_hours?.summary?.symbol_code) {
                        result.symbolCode.push(item.data.next_1_hours.summary.symbol_code);
                    } else {
                        result.symbolCode.push('');
                    }
                } else if (next6h) {
                    // Use next_6_hours data if next_1_hours is missing
                    // Distribute 6h precipitation over 6 hours (average per hour)
                    const rain6h = next6h.precipitation_amount;
                    const rainPerHour = rain6h !== undefined ? rain6h / 6 : null;
                    result.rain.push(rainPerHour);
                    // 6h data doesn't have min/max ranges, so set to null
                    result.rainMin.push(null);
                    result.rainMax.push(null);

                    if (next6hSummary?.symbol_code) {
                        result.symbolCode.push(next6hSummary.symbol_code);
                    } else {
                        result.symbolCode.push('');
                    }
                } else {
                    // No precipitation data available
                    result.rain.push(null);
                    result.rainMin.push(null);
                    result.rainMax.push(null);
                    result.symbolCode.push('');
                }
            });
            // Extract units from meta.units if available
            if (rawData.properties && rawData.properties.meta && rawData.properties.meta.units) {
                const metaUnits = rawData.properties.meta.units;
                result.units = {
                    temperature: metaUnits.air_temperature,
                    pressure: metaUnits.air_pressure_at_sea_level,
                    windSpeed: metaUnits.wind_speed,
                    precipitation: metaUnits.precipitation_amount,
                    cloudCover: metaUnits.cloud_area_fraction
                };
            }

            this._forecastData = result;
        } catch (err) {
            throw new Error("Failed to parse weather data: " + (err instanceof Error ? err.message : String(err)));
        }
    }
}
