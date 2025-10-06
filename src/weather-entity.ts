import {ForecastData} from "./weather-api";

export class WeatherEntityAPI {
    hass: any;
    entityId: string;
    private _forecastData: ForecastData | null = null;
    private _lastDataFetch: number | null = null; // Timestamp of last data fetch
    private _unsubForecast: (() => void) | null = null;
    private _lastPauseTime: number | null = null; // Timestamp of last pause
    private _lastResumeTime: number | null = null; // Timestamp of last resume

    constructor(hass: any, entityId: string, from: string) {
        // Instrumentation: log caller stack and arguments
        console.debug(`[WeatherEntityAPI] from ${from} Constructor called for entityId: ${entityId}`);
        this.hass = hass;
        this.entityId = entityId;
        
        // Verify entity exists before setting up subscription
        if (!this.hass?.states?.[this.entityId]) {
            console.warn(`[WeatherEntityAPI] ❌ Weather entity ${this.entityId} not found in hass.states`);
            const availableWeatherEntities = Object.keys(this.hass?.states || {}).filter(id => id.startsWith('weather.'));
            console.debug(`[WeatherEntityAPI] Available weather entities:`, availableWeatherEntities);
            return;
        }
        
        // In modern Home Assistant, forecast data ONLY comes from subscriptions
        // The entity.attributes.forecast property was removed in recent HA versions
        if (this.hass && this.entityId) {
            console.debug(`[WeatherEntityAPI] Setting up forecast subscription for ${this.entityId} (modern HA method)`);
            this.subscribeForecast((forecastArr: any[]) => {
                console.debug(`[WeatherEntityAPI] 🔔 Subscription update received for ${this.entityId}:`, {
                    forecastLength: forecastArr?.length || 0,
                    firstItem: forecastArr?.[0],
                    updateTime: new Date().toISOString()
                });
                
                this._forecastData = this._parseForecastArray(forecastArr);
                this._lastDataFetch = Date.now(); // Update fetch timestamp
                console.debug(`[WeatherEntityAPI] ⏰ Updated _lastDataFetch to: ${new Date(this._lastDataFetch).toLocaleString()}`);
                
                console.debug(`[WeatherEntityAPI] ✅ Subscription data processed for ${this.entityId}:`, {
                    parsedTimeLength: this._forecastData?.time?.length || 0,
                    firstTime: this._forecastData?.time?.[0]?.toISOString() || 'none',
                    lastTime: this._forecastData?.time?.[this._forecastData.time.length - 1]?.toISOString() || 'none'
                });
                // Force chart update by dispatching a custom event
                const card = document.querySelector('meteogram-card') as any;
                if (card && typeof card._scheduleDrawMeteogram === "function") {
                    card._scheduleDrawMeteogram("WeatherEntityAPI-forecast-update", true);
                }
            }).then(unsub => {
                this._unsubForecast = unsub;
                console.debug(`[WeatherEntityAPI] ✅ Forecast subscription established successfully for ${this.entityId}`);
            }).catch(error => {
                console.error(`[WeatherEntityAPI] ❌ Forecast subscription failed for ${this.entityId}:`, error);
                console.debug(`[WeatherEntityAPI] This may indicate an unsupported entity or HA version issue`);
            });
        }
    }

    // Clean up old entity cache entries (older than 24h) and validate data structures
    private static cleanupOldEntityCacheEntries(cache: Record<string, { timestamp: number; data: ForecastData }>) {
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        let removedCount = 0;
        let invalidCount = 0;
        const requiredArrays = ['time', 'temperature', 'rain', 'rainMin', 'rainMax', 'cloudCover', 'windSpeed', 'windGust', 'windDirection', 'symbolCode', 'pressure'];
        
        for (const [entityId, entry] of Object.entries(cache)) {
            let shouldRemove = false;
            
            // Remove entries older than 24h
            if (now - entry.timestamp > twentyFourHours) {
                shouldRemove = true;
                removedCount++;
            }
            // Remove entries with invalid data structure
            else if (!entry.data || typeof entry.data !== 'object') {
                shouldRemove = true;
                invalidCount++;
                console.debug(`[WeatherEntityAPI] Removing cache entry for ${entityId}: invalid data structure`);
            }
            // Remove entries missing required arrays
            else {
                const missingArrays = requiredArrays.filter(prop => !Array.isArray(entry.data[prop as keyof ForecastData]));
                if (missingArrays.length > 0) {
                    shouldRemove = true;
                    invalidCount++;
                    console.debug(`[WeatherEntityAPI] Removing cache entry for ${entityId}: missing arrays ${missingArrays.join(', ')}`);
                }
            }
            
            if (shouldRemove) {
                delete cache[entityId];
            }
        }
        
        if (removedCount > 0 || invalidCount > 0) {
            console.debug(`[WeatherEntityAPI] Cleaned up ${removedCount} old and ${invalidCount} invalid entity cache entries`);
        }
    }

    // Diagnostic method to check entity and subscription status
    getDiagnosticInfo(): any {
        const entity = this.hass.states[this.entityId];
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        const expiresAt = this._lastDataFetch ? this._lastDataFetch + oneHour : null;
        
        return {
            entityId: this.entityId,
            entityExists: !!entity,
            entityState: entity?.state,
            entityLastChanged: entity?.last_changed,
            entityLastUpdated: entity?.last_updated,
            hourlyForecastData: {
                // In modern HA, forecast data comes only from subscriptions, not entity attributes
                processedLength: this._forecastData?.time?.length || 0,
                status: this._forecastData?.time?.length 
                    ? `${this._forecastData.time.length} processed entries`
                    : 'waiting for subscription data'
            },
            hasSubscription: !!this._unsubForecast,
            subscriptionStatus: this._unsubForecast ? 'active' : 'paused/inactive',
            lastPauseTime: this._lastPauseTime ? new Date(this._lastPauseTime).toLocaleString() : 'never',
            lastResumeTime: this._lastResumeTime ? new Date(this._lastResumeTime).toLocaleString() : 'never',
            hasConnection: !!this.hass?.connection,
            inMemoryData: {
                hasData: !!this._forecastData,
                dataTimeLength: this._forecastData?.time?.length || 0,
                lastFetchTime: this._lastDataFetch ? new Date(this._lastDataFetch).toISOString() : 'never',
                lastFetchFormatted: this._lastDataFetch ? new Date(this._lastDataFetch).toLocaleString() : 'not yet fetched',
                dataAgeMinutes: this._lastDataFetch ? Math.round((Date.now() - this._lastDataFetch) / (60 * 1000)) : 'n/a',
                expiresAt: expiresAt,
                expiresAtFormatted: expiresAt ? new Date(expiresAt).toLocaleString() : 'not set',
                isExpired: expiresAt ? Date.now() > expiresAt : false
            }
        };
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

            // Only use actual min/max values if they exist, otherwise set to null
            result.rainMin.push('precipitation_min' in item && typeof item.precipitation_min === 'number' ? item.precipitation_min : null);
            result.rainMax.push('precipitation_max' in item && typeof item.precipitation_max === 'number' ? item.precipitation_max : null);

            // Always push values to maintain array consistency (use 0 if not present)
            result.cloudCover.push('cloud_coverage' in item && typeof item.cloud_coverage === 'number' ? item.cloud_coverage : 0);
            result.windSpeed.push('wind_speed' in item && typeof item.wind_speed === 'number' ? item.wind_speed : 0);
            result.windDirection.push('wind_bearing' in item && typeof item.wind_bearing === 'number' ? item.wind_bearing : 0);
            
            // Handle wind gust with proper null handling
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
            } else {
                result.pressure.push(0); // Maintain array consistency
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

    // Note: In modern Home Assistant, forecast data comes from subscriptions only
    // The entity.attributes.forecast property doesn't exist in recent HA versions

    getForecast(): ForecastData | null {
        // This method returns the current/instantaneous forecast data
        // For hourly forecast data used by meteogram, use getForecastData() instead
        
        // In modern HA, forecast data only comes from subscriptions
        // Return whatever we have in memory from subscription updates
        return this._forecastData;
    }

    /**
     * Subscribe to forecast updates for the weather entity.
     * @param callback Called with the forecast array when updates arrive.
     * @returns Unsubscribe function.
     */
    subscribeForecast(callback: (forecast: any[]) => void): Promise<() => void> {
        console.debug(`[WeatherEntityAPI] 📡 Setting up subscription for entityId=${this.entityId}`);
        
        if (!this.hass?.connection) {
            console.warn(`[WeatherEntityAPI] ❌ Cannot subscribe: hass.connection not available for ${this.entityId}`);
            return Promise.resolve(() => {});
        }
        
        console.debug(`[WeatherEntityAPI] ✅ hass.connection available, creating subscription for ${this.entityId}`);
        
        const unsubPromise = this.hass.connection.subscribeMessage(
            (event: any) => {
                console.debug(`[WeatherEntityAPI] 📨 Raw subscription event for ${this.entityId}:`, {
                    hasEvent: !!event,
                    hasForecast: !!event?.forecast,
                    isArray: Array.isArray(event?.forecast),
                    forecastLength: event?.forecast?.length || 0,
                    eventType: typeof event,
                    eventKeys: Object.keys(event || {})
                });
                
                if (Array.isArray(event.forecast)) {
                    console.debug(`[WeatherEntityAPI] ✅ Valid forecast array received for ${this.entityId}, length: ${event.forecast.length}`);
                    callback(event.forecast);
                } else {
                    console.warn(`[WeatherEntityAPI] ❌ Invalid forecast data for ${this.entityId}:`, event);
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
        console.debug(`[WeatherEntityAPI] getForecastData() called for ${this.entityId}`);
        
        // Check if we have data and if it's fresh (less than 1 hour old)
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();
        
        // Debug: Log current state
        console.debug(`[WeatherEntityAPI] Current state for ${this.entityId}:`, {
            hasData: !!this._forecastData,
            dataTimeLength: this._forecastData?.time?.length || 0,
            lastDataFetch: this._lastDataFetch ? new Date(this._lastDataFetch).toISOString() : 'never',
            dataAgeMinutes: this._lastDataFetch ? Math.round((now - this._lastDataFetch) / (60 * 1000)) : 'unknown',
            firstForecastTime: this._forecastData?.time?.[0]?.toISOString() || 'none',
            lastForecastTime: this._forecastData?.time?.[this._forecastData.time.length - 1]?.toISOString() || 'none'
        });
        
        if (this._forecastData && this._lastDataFetch && (now - this._lastDataFetch < oneHour)) {
            // Data is fresh, return it
            console.debug(`[WeatherEntityAPI] Returning fresh data for ${this.entityId} (${Math.round((now - this._lastDataFetch) / (60 * 1000))} min old)`);
            return this._forecastData;
        }
        
        // Data is stale or doesn't exist - in modern HA, we rely on subscriptions for fresh data
        // Clear stale data and fall back to cache while waiting for subscription updates
        if (this._lastDataFetch) {
            const ageMinutes = Math.round((now - this._lastDataFetch) / (60 * 1000));
            console.debug(`[WeatherEntityAPI] Data is stale for ${this.entityId} (${ageMinutes} min old), clearing and waiting for subscription update`);
        } else {
            console.debug(`[WeatherEntityAPI] No data for ${this.entityId}, waiting for subscription update`);
        }
        
        this._forecastData = null; // Clear stale data
        
        // Note: In modern HA, we can't fetch forecast directly from entity attributes
        // Fresh data will come from the subscription when HA sends updates
        // For now, we fall back to localStorage cache if available
        
        // Fresh fetch failed, try to load from localStorage cache as fallback
        let shouldCleanupCache = false;
        try {
            const cacheKey = 'meteogram-card-entity-weather-cache';
            const rawCache = localStorage.getItem(cacheKey);
            if (rawCache) {
                const cache = JSON.parse(rawCache);
                const stored = cache[this.entityId];
                if (stored) {
                    // Handle both old format (direct ForecastData) and new format (with timestamp)
                    let forecastData: ForecastData | undefined;
                    if (stored && typeof stored === 'object' && 'timestamp' in stored && 'data' in stored) {
                        // New format - check if not too old (24h)
                        const twentyFourHours = 24 * 60 * 60 * 1000;
                        if (Date.now() - stored.timestamp > twentyFourHours) {
                            console.debug(`[WeatherEntityAPI] Cached data for ${this.entityId} is too old (${Math.round((Date.now() - stored.timestamp) / (60 * 60 * 1000))}h), removing from cache`);
                            shouldCleanupCache = true;
                            delete cache[this.entityId];
                        } else {
                            forecastData = stored.data;
                        }
                    } else {
                        // Old format - convert to new format or remove if corrupted
                        if (stored && typeof stored === 'object') {
                            // Old format - use directly but consider it potentially stale
                            forecastData = stored as ForecastData;
                            console.debug(`[WeatherEntityAPI] Converting old format cache entry for ${this.entityId} to new format`);
                            shouldCleanupCache = true;
                            // Convert to new format
                            cache[this.entityId] = {
                                timestamp: Date.now() - (12 * 60 * 60 * 1000), // Mark as 12h old to trigger refresh soon
                                data: forecastData
                            };
                        } else {
                            console.warn(`[WeatherEntityAPI] Corrupted cache entry for ${this.entityId}, removing from cache`);
                            shouldCleanupCache = true;
                            delete cache[this.entityId];
                        }
                    }
                    
                    // Validate that cached data has all required array properties if we have forecastData
                    if (forecastData) {
                        const requiredArrays = ['time', 'temperature', 'rain', 'rainMin', 'rainMax', 'cloudCover', 'windSpeed', 'windGust', 'windDirection', 'symbolCode', 'pressure'];
                        const missingArrays = requiredArrays.filter(prop => !Array.isArray(forecastData[prop as keyof ForecastData]));
                        
                        if (missingArrays.length > 0) {
                            console.warn(`[WeatherEntityAPI] Cached data for ${this.entityId} is missing required arrays: ${missingArrays.join(', ')}, removing from cache`);
                            shouldCleanupCache = true;
                            delete cache[this.entityId];
                        } else {
                            // Restore Date objects in time array
                            if (Array.isArray(forecastData.time)) {
                                forecastData.time = forecastData.time.map((t: string | Date) =>
                                    typeof t === "string" ? new Date(t) : t
                                );
                            }
                            this._forecastData = forecastData;
                            
                            // Save cache back to localStorage if we made changes
                            if (shouldCleanupCache) {
                                localStorage.setItem(cacheKey, JSON.stringify(cache));
                                console.debug(`[WeatherEntityAPI] Updated cache structure for ${this.entityId}`);
                            }
                            
                            // console.debug(`[WeatherEntityAPI] Loaded forecast for ${this.entityId} from localStorage cache`, this._forecastData);
                            return this._forecastData;
                        }
                    }
                    
                    // Save cache back to localStorage if we made changes (cleanup only)
                    if (shouldCleanupCache) {
                        localStorage.setItem(cacheKey, JSON.stringify(cache));
                        console.debug(`[WeatherEntityAPI] Cleaned up cache for ${this.entityId}`);
                    }
                }
            }
        } catch (e) {
            console.warn(`[WeatherEntityAPI] Failed to load forecast for ${this.entityId} from localStorage cache:`, e);
            // Clear corrupted cache entirely
            try {
                const cacheKey = 'meteogram-card-entity-weather-cache';
                localStorage.removeItem(cacheKey);
                console.warn(`[WeatherEntityAPI] Cleared corrupted cache due to parse error`);
            } catch (cleanupError) {
                console.error(`[WeatherEntityAPI] Failed to clear corrupted cache:`, cleanupError);
            }
        }
        return null;
    }

    /**
     * Pause the subscription (when tab becomes hidden)
     */
    pause(from: string) {
        if (this._unsubForecast) {
            try {
                console.debug(`[WeatherEntityAPI] from ${from} Pausing subscription for ${this.entityId}`);
                this._unsubForecast();
                this._unsubForecast = null;
                this._lastPauseTime = Date.now();
            } catch (err) {
                console.warn(`[WeatherEntityAPI] from ${from} Error pausing subscription for ${this.entityId}:`, err);
            }
        }
    }

    /**
     * Resume the subscription (when tab becomes visible) and check for fresh data
     */
    async resume(from: string): Promise<void> {
        console.debug(`[WeatherEntityAPI] from ${from} Resuming subscription for ${this.entityId}`);
        
        // First, check if we can get fresher data from the current hass state
        await this._checkAndUpdateFromHassState();
        
        // Re-establish subscription for future updates
        if (this.hass && this.entityId && !this._unsubForecast) {
            try {
                const unsubPromise = this.subscribeForecast((forecastArr: any[]) => {
                    console.debug(`[WeatherEntityAPI] 🔔 Subscription update received after resume for ${this.entityId}:`, {
                        forecastLength: forecastArr?.length || 0,
                        updateTime: new Date().toISOString()
                    });
                    
                    this._forecastData = this._parseForecastArray(forecastArr);
                    this._lastDataFetch = Date.now();
                    
                    // Force chart update
                    const card = document.querySelector('meteogram-card') as any;
                    if (card && typeof card._scheduleDrawMeteogram === "function") {
                        card._scheduleDrawMeteogram("WeatherEntityAPI-resume-update", true);
                    }
                });
                
                this._unsubForecast = await unsubPromise;
                this._lastResumeTime = Date.now();
                console.debug(`[WeatherEntityAPI] ✅ Subscription resumed successfully for ${this.entityId}`);
            } catch (error) {
                console.error(`[WeatherEntityAPI] ❌ Failed to resume subscription for ${this.entityId}:`, error);
            }
        }
    }

    /**
     * Check if hass state has fresher data than our cached data
     */
    private async _checkAndUpdateFromHassState(): Promise<void> {
        if (!this.hass?.states?.[this.entityId]) {
            console.debug(`[WeatherEntityAPI] Entity ${this.entityId} not found in hass.states during resume check`);
            return;
        }

        const entity = this.hass.states[this.entityId];
        const entityLastUpdated = entity.last_updated ? new Date(entity.last_updated).getTime() : 0;
        const ourLastFetch = this._lastDataFetch || 0;
        
        console.debug(`[WeatherEntityAPI] Freshness check for ${this.entityId}:`, {
            entityLastUpdated: new Date(entityLastUpdated).toISOString(),
            ourLastFetch: new Date(ourLastFetch).toISOString(),
            entityIsNewer: entityLastUpdated > ourLastFetch,
            ageDifferenceMinutes: Math.round((entityLastUpdated - ourLastFetch) / (60 * 1000))
        });

        // If entity was updated after our last fetch, try to get fresh forecast data
        if (entityLastUpdated > ourLastFetch) {
            console.debug(`[WeatherEntityAPI] Entity state is newer, requesting fresh forecast for ${this.entityId}`);
            
            try {
                // Use the get_forecasts service to get current forecast data
                const result = await this.hass.callService('weather', 'get_forecasts', {
                    entity_id: this.entityId,
                    type: 'hourly'
                });
                
                if (result?.[this.entityId]?.forecast && Array.isArray(result[this.entityId].forecast)) {
                    console.debug(`[WeatherEntityAPI] ✅ Fresh forecast data retrieved from service for ${this.entityId}:`, {
                        forecastLength: result[this.entityId].forecast.length,
                        serviceCallTime: new Date().toISOString()
                    });
                    
                    this._forecastData = this._parseForecastArray(result[this.entityId].forecast);
                    this._lastDataFetch = Date.now();
                    
                    // Force chart update with fresh data
                    const card = document.querySelector('meteogram-card') as any;
                    if (card && typeof card._scheduleDrawMeteogram === "function") {
                        card._scheduleDrawMeteogram("WeatherEntityAPI-fresh-service-data", true);
                    }
                } else {
                    console.debug(`[WeatherEntityAPI] Service call succeeded but no forecast data returned for ${this.entityId}`);
                }
            } catch (error) {
                console.warn(`[WeatherEntityAPI] Failed to get fresh forecast via service for ${this.entityId}:`, error);
                // Fall back to existing cached data
            }
        } else {
            console.debug(`[WeatherEntityAPI] Our cached data is still current for ${this.entityId}`);
        }
    }

    /**
     * Check if subscription is currently active
     */
    isSubscriptionActive(): boolean {
        return !!this._unsubForecast;
    }

    /**
     * Destructor: Unsubscribe from forecast updates.
     */
    destroy(from: string) {
        if (this._unsubForecast) {
            try {
                this._unsubForecast();
                this._unsubForecast = null;
                console.debug(`[WeatherEntityAPI] from ${from} Destroyed subscription for ${this.entityId}`);
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
