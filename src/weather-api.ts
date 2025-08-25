import {version} from "../package.json";

export interface ForecastData {
    pressure: number[];
    time: Date[];
    temperature: (number | null)[];
    rain: number[];
    rainMin: number[];
    rainMax: number[];
    snow: number[];
    cloudCover: number[];
    windSpeed: number[];
    windDirection: number[];
    symbolCode: string[];
    fetchTimestamp?: string;
}

export class WeatherAPI {
    static METEOGRAM_CARD_API_CALL_COUNT = 0;
    static METEOGRAM_CARD_API_SUCCESS_COUNT = 0;

    lastError: unknown = null;
    lastStatusCode: number | null = null;
    lat: number;
    lon: number;
    private _forecastData: ForecastData | null = null;
    private _expiresAt: number | null = null;

    constructor(lat: number, lon: number) {
        this.lat = lat;
        this.lon = lon;
    }

    get forecastData(): ForecastData | null {
        return this._forecastData;
    }

    get expiresAt(): number | null {
        return this._expiresAt;
    }

    getDiagnosticText(): string {
        let diag = `<br><b>API Error</b><br>`;
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

    // Helper to encode cache key as base64 of str(lat)+str(lon)
    private static encodeCacheKey(lat: number, lon: number): string {
        const keyStr = String(lat) + String(lon);
        return btoa(keyStr);
    }

    // Save forecast data to localStorage
    saveCacheToStorage() {
        if (!this._forecastData || !this._expiresAt) return;
        const key = WeatherAPI.encodeCacheKey(Number(this.lat.toFixed(4)), Number(this.lon.toFixed(4)));
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
        const key = WeatherAPI.encodeCacheKey(Number(this.lat.toFixed(4)), Number(this.lon.toFixed(4)));
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
                cacheObj = {};
            }
            const entry = cacheObj["forecast-data"]?.[key];
            if (entry && entry.expiresAt && entry.data) {
                this._expiresAt = entry.expiresAt;
                // Restore Date objects in time array
                if (Array.isArray(entry.data.time)) {
                    entry.data.time = entry.data.time.map((t: string | Date) =>
                        typeof t === "string" ? new Date(t) : t
                    );
                }
                this._forecastData = entry.data;
            } else {
                this._expiresAt = null;
                this._forecastData = null;
            }
        }
    }

    async fetchWeatherDataFromAPI(): Promise<{ data: any, expires: Date | null }> {
        const lat = this.lat;
        const lon = this.lon;
        let forecastUrl = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
        let dedicatedForecastUrl = `https://aa015h6buqvih86i1.api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`;
        let urlToUse = forecastUrl;
        let headers: Record<string, string> = {};
        this.lastStatusCode = null;
        this.lastError = null;

        try {
            headers = {
                'Origin': window.location.origin,
                'Accept': 'application/json'
            };

            urlToUse = window.location.origin.includes("ui.nabu.casa")
                ? dedicatedForecastUrl
                : forecastUrl;

            WeatherAPI.METEOGRAM_CARD_API_CALL_COUNT++;
            const response = await fetch(urlToUse, { headers, mode: 'cors' });

            this.lastStatusCode = response.status;

            const expiresHeader = response.headers.get("Expires");
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
            return { data: jsonData, expires };

        } catch (error: unknown) {
            this.lastError = error;
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
                snow: [],
                cloudCover: [],
                windSpeed: [],
                windDirection: [],
                symbolCode: [],
                pressure: []
            };
            result.fetchTimestamp = new Date().toISOString();

            filtered.forEach((item: any) => {
                const time = new Date(item.time);
                const instant = item.data.instant.details;
                const next1h = item.data.next_1_hours?.details;

                result.time.push(time);
                result.temperature.push(instant.air_temperature);
                result.cloudCover.push(instant.cloud_area_fraction);
                result.windSpeed.push(instant.wind_speed);
                result.windDirection.push(instant.wind_from_direction);
                result.pressure.push(instant.air_pressure_at_sea_level);

                if (next1h) {
                    const rainAmountMax = next1h.precipitation_amount_max !== undefined ?
                        next1h.precipitation_amount_max :
                        (next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);

                    const rainAmountMin = next1h.precipitation_amount_min !== undefined ?
                        next1h.precipitation_amount_min :
                        (next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);

                    result.rainMin.push(rainAmountMin);
                    result.rainMax.push(rainAmountMax);
                    result.rain.push(next1h.precipitation_amount !== undefined ? next1h.precipitation_amount : 0);
                    result.snow.push(0);

                    if (item.data.next_1_hours?.summary?.symbol_code) {
                        result.symbolCode.push(item.data.next_1_hours.summary.symbol_code);
                    } else {
                        result.symbolCode.push('');
                    }
                } else {
                    result.rain.push(0);
                    result.rainMin.push(0);
                    result.rainMax.push(0);
                    result.snow.push(0);
                    result.symbolCode.push('');
                }
            });
            this._forecastData = result;
        } catch (err) {
            throw new Error("Failed to parse weather data: " + (err instanceof Error ? err.message : String(err)));
        }
    }
}
