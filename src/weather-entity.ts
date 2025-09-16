import {ForecastData} from "./weather-api";

export class WeatherEntityAPI {
    hass: any;
    entityId: string;
    private _forecastData: ForecastData | null = null;
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
                // console.debug(`[WeatherEntityAPI] from ${from} subscribeForecast: stored ForecastData for ${this.entityId}`, this._forecastData);
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

            // Only push windSpeed/windDirection if present
            if ('wind_speed' in item && typeof item.wind_speed === 'number') {
                result.windSpeed.push(item.wind_speed);
            }
            if ('wind_bearing' in item && typeof item.wind_bearing === 'number') {
                result.windDirection.push(item.wind_bearing);
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
            let cache: Record<string, ForecastData> = {};
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                cache = JSON.parse(rawCache);
            }
            cache[this.entityId] = result;
            localStorage.setItem(cacheKey, JSON.stringify(cache));
        } catch (e) {
            console.warn(`[WeatherEntityAPI] Failed to store forecast for ${this.entityId} in localStorage:`, e);
        }

        return result;
    }

    getForecast(): ForecastData | null {
        console.debug(`[WeatherEntityAPI] getForecastData called for entityId=${this.entityId}`);
        if (this._forecastData) {
            // console.debug(`[WeatherEntityAPI] Returning stored ForecastData for ${this.entityId}`, this._forecastData);
            return this._forecastData;
        }
        const entity = this.hass.states[this.entityId];
        if (!entity) {
            console.debug(`[WeatherEntityAPI] Entity not found: ${this.entityId}`);
            return null;
        }
        if (!entity.attributes) {
            console.debug(`[WeatherEntityAPI] Entity has no attributes: ${this.entityId}`);
            return null;
        }
        // console.debug(`[WeatherEntityAPI] Entity contents:`, entity);
        if (!Array.isArray(entity.attributes.forecast)) {
            console.debug(`[WeatherEntityAPI] Entity forecast attribute is not an array:`, entity.attributes.forecast);
            return null;
        }

        this._forecastData = this._parseForecastArray(entity.attributes.forecast);
        // console.debug(`[WeatherEntityAPI] getForecastData result:`, this._forecastData);
        return this._forecastData;
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
        if (this._forecastData) {
            return this._forecastData;
        }
        // Try to load from localStorage cache object
        try {
            const cacheKey = 'meteogram-card-entity-weather-cache';
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                const cache = JSON.parse(rawCache);
                const stored = cache[this.entityId];
                if (stored) {
                    // Restore Date objects in time array
                    if (Array.isArray(stored.time)) {
                        stored.time = stored.time.map((t: string | Date) =>
                            typeof t === "string" ? new Date(t) : t
                        );
                    }
                    this._forecastData = stored;
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
 * Map HA weather entity 'condition' values to Met.no weather icon names.
 */
export function mapHaConditionToMetnoSymbol(condition: string): string {
    const mapping: Record<string, string> = {
        "clear-night": "clearsky_night",
        "cloudy": "cloudy",
        "fog": "fog",
        "hail": "heavyrainshowers",
        "lightning": "lightrainshowers",
        "lightning-rainy": "lightrainshowers",
        "partlycloudy": "partlycloudy_day",
        "pouring": "heavyrain",
        "rainy": "rain",
        "snowy": "snow",
        "snowy-rainy": "sleet",
        "sunny": "clearsky_day",
        "windy": "fair_day",
        "windy-variant": "fair_day",
        "exceptional": "clearsky_day"
    };
    // Default to condition itself if not mapped
    return mapping[condition] || condition;
}
