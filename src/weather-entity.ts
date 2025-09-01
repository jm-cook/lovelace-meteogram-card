import {ForecastData} from "./weather-api";

export class WeatherEntityAPI {
    hass: any;
    entityId: string;
    private _forecastData: ForecastData | null = null;
    private _unsubForecast: (() => void) | null = null;

    constructor(hass: any, entityId: string) {
        this.hass = hass;
        this.entityId = entityId;

        // Subscribe to forecast updates if hass and entityId are available
        if (this.hass && this.entityId) {
            this.subscribeForecast((forecastArr: any[]) => {
                this._forecastData = this._parseForecastArray(forecastArr);
                // console.debug(`[WeatherEntityAPI] subscribeForecast: stored ForecastData for ${this.entityId}`, this._forecastData);
            }).then(unsub => {
                this._unsubForecast = unsub;
            });
        }
    }

    private _parseForecastArray(forecast: any[]): ForecastData {
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
            fetchTimestamp: new Date().toISOString()
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

            result.snow.push(item.snow ?? 0);
            result.cloudCover.push(item.cloud_coverage ?? 0);
            result.windSpeed.push(item.wind_speed ?? 0);
            result.windDirection.push(item.wind_bearing ?? 0);
            result.symbolCode.push(item.condition ?? "");

            // Map pressure attribute for renderer compatibility
            // Try 'pressure', fallback to 'pressure_mbar', fallback to 'pressure_hpa'
            if ('pressure' in item && typeof item.pressure === 'number') {
                result.pressure.push(item.pressure);
            } else if ('pressure_mbar' in item && typeof item.pressure_mbar === 'number') {
                result.pressure.push(item.pressure_mbar);
            } else if ('pressure_hpa' in item && typeof item.pressure_hpa === 'number') {
                result.pressure.push(item.pressure_hpa);
            }

            // Log each forecast item for debugging
            // console.debug(`[WeatherEntityAPI] Forecast[${idx}]:`, item);
        });

        return result;
    }

    getForecast(): ForecastData | null {
        console.debug(`[WeatherEntityAPI] getForecastData called for entityId=${this.entityId}`);
        if (this._forecastData) {
            console.debug(`[WeatherEntityAPI] Returning stored ForecastData for ${this.entityId}`, this._forecastData);
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
        console.debug(`[WeatherEntityAPI] Entity contents:`, entity);
        if (!Array.isArray(entity.attributes.forecast)) {
            console.debug(`[WeatherEntityAPI] Entity forecast attribute is not an array:`, entity.attributes.forecast);
            return null;
        }

        this._forecastData = this._parseForecastArray(entity.attributes.forecast);
        console.debug(`[WeatherEntityAPI] getForecastData result:`, this._forecastData);
        return this._forecastData;
    }

    /**
     * Subscribe to forecast updates for the weather entity.
     * @param callback Called with the forecast array when updates arrive.
     * @returns Unsubscribe function.
     */
    subscribeForecast(callback: (forecast: any[]) => void): Promise<() => void> {
        if (!this.hass?.connection) {
            console.debug(`[WeatherEntityAPI] subscribeForecast: hass.connection not available`);
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
     */
    getForecastData(): ForecastData | null {
        return this._forecastData;
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
