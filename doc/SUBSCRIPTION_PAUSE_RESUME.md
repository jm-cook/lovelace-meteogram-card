# Weather Subscription Pause/Resume Enhancement

## Overview
Enhanced the Meteogram Card with intelligent subscription management that pauses weather subscriptions when tabs become hidden and resumes them with freshness checking when tabs become visible again.

## Features Added

### 1. Subscription Lifecycle Management

**WeatherEntityAPI Methods:**
- `pause(from: string)` - Pauses the forecast subscription
- `resume(from: string)` - Resumes subscription and checks for fresh data  
- `isSubscriptionActive()` - Checks if subscription is currently active

### 2. Automatic Pause/Resume Triggers

**Tab Visibility Changes:**
- ✅ **Tab Hidden**: Subscription paused to save resources
- ✅ **Tab Visible**: Subscription resumed with data freshness check

**Element Visibility Changes:**
- ✅ **Element Hidden**: Subscription paused (scrolled out of view, dialog closed, etc.)
- ✅ **Element Visible**: Subscription resumed (scrolled into view, dialog opened, etc.)

### 3. Data Freshness Checking on Resume

When a subscription is resumed, the system:

1. **Checks entity last_updated time** vs our cached data timestamp
2. **Calls weather.get_forecasts service** if entity has newer data
3. **Updates cached data** with fresh forecast information  
4. **Re-establishes subscription** for future real-time updates
5. **Forces chart refresh** if new data was retrieved

## Implementation Details

### Pause Logic
```typescript
private _pauseWeatherSubscription(from: string): void {
    if (this._weatherEntityApiInstance?.isSubscriptionActive()) {
        console.debug(`Pausing weather subscription from: ${from}`);
        this._weatherEntityApiInstance.pause(from);
    }
}
```

### Resume Logic with Freshness Check
```typescript
private async _resumeWeatherSubscription(from: string): Promise<void> {
    if (this._weatherEntityApiInstance && !this._weatherEntityApiInstance.isSubscriptionActive()) {
        console.debug(`Resuming weather subscription from: ${from}`);
        await this._weatherEntityApiInstance.resume(from);
    }
}
```

### Fresh Data Retrieval
```typescript
private async _checkAndUpdateFromHassState(): Promise<void> {
    const entity = this.hass.states[this.entityId];
    const entityLastUpdated = new Date(entity.last_updated).getTime();
    const ourLastFetch = this._lastDataFetch || 0;
    
    if (entityLastUpdated > ourLastFetch) {
        // Get fresh data via weather.get_forecasts service
        const result = await this.hass.callService('weather', 'get_forecasts', {
            entity_id: this.entityId,
            type: 'hourly'
        });
        
        if (result?.[this.entityId]?.forecast) {
            this._forecastData = this._parseForecastArray(result[this.entityId].forecast);
            this._lastDataFetch = Date.now();
            // Trigger chart update
        }
    }
}
```

## Benefits

### Performance Benefits
- ⚡ **Reduced CPU usage**: No background subscription processing for hidden tabs
- ⚡ **Lower memory usage**: Paused subscriptions use minimal resources
- ⚡ **Battery savings**: Important for mobile devices and tablets
- ⚡ **Network efficiency**: Fewer WebSocket message handlers active

### User Experience Benefits  
- 🔄 **Always current data**: Freshness check ensures data is up-to-date on resume
- 🔄 **Seamless transitions**: Automatic pause/resume with no user intervention
- 🔄 **Immediate updates**: Chart refreshes instantly when fresh data is available
- 🔄 **Reliable subscriptions**: Re-established subscriptions ensure future updates

### Resource Management
- 📊 **Scalable**: Multiple weather cards don't all maintain active subscriptions
- 📊 **Efficient**: Only visible cards consume subscription resources
- 📊 **Responsive**: Quick resume when tab/element becomes visible
- 📊 **Robust**: Handles subscription failures gracefully

## Behavior Scenarios

### Scenario 1: Tab Switch
```
User switches to different browser tab
→ document.hidden becomes true
→ Subscription paused
→ User switches back to HA tab  
→ document.hidden becomes false
→ Subscription resumed with freshness check
→ Chart updated if new data available
```

### Scenario 2: Scroll Out of View
```
User scrolls weather card out of viewport
→ IntersectionObserver detects element hidden
→ Subscription paused
→ User scrolls back to weather card
→ IntersectionObserver detects element visible  
→ Subscription resumed with freshness check
→ Chart updated if new data available
```

### Scenario 3: Modal Dialog
```
User opens modal dialog over weather card
→ Element becomes hidden (DOM visibility check)
→ Subscription paused
→ User closes modal dialog
→ Element becomes visible again
→ Subscription resumed with freshness check
→ Chart updated if new data available
```

### Scenario 4: Home Assistant Navigation
```
User navigates to different HA page
→ Weather card unmounted (disconnectedCallback)
→ Subscription destroyed (permanent cleanup)
→ User navigates back to dashboard
→ Weather card remounted (connectedCallback)  
→ New subscription established automatically
```

## Diagnostic Information

The subscription status is now included in diagnostic panels:

```typescript
subscriptionStatus: this._unsubForecast ? 'active' : 'paused/inactive'
```

**Console Logging:**
- Pause events: `"Pausing weather subscription from: tab hidden"`
- Resume events: `"Resuming weather subscription from: tab visible"`
- Freshness checks: `"Entity state is newer, requesting fresh forecast"`
- Service calls: `"Fresh forecast data retrieved from service"`

## Configuration

This feature works automatically with no configuration required. The pause/resume behavior is:

- **Always enabled** for weather entity subscriptions
- **Transparent** to users - no visible changes in behavior
- **Fallback safe** - if resume fails, cached data is used
- **Performance optimized** - minimal overhead when active

## Compatibility

### Home Assistant Versions
- ✅ **Modern HA (2023.9+)**: Uses `weather.get_forecasts` service for fresh data
- ✅ **Older HA versions**: Graceful fallback to subscription-only data
- ✅ **All weather integrations**: Works with any weather entity that supports forecasts

### Browser Support
- ✅ **All modern browsers**: Uses standard `document.hidden` and `IntersectionObserver`
- ✅ **Mobile browsers**: Optimized for mobile/tablet usage patterns
- ✅ **PWA mode**: Works in Home Assistant mobile apps

## Future Enhancements

### Potential Improvements
1. **Configurable pause delay**: Optional delay before pausing (e.g., 30 seconds)
2. **Smart resume timing**: More sophisticated freshness checking logic
3. **Bandwidth optimization**: Compress subscription data when resumed
4. **Multi-entity batching**: Batch forecast requests for multiple entities
5. **Offline detection**: Pause subscriptions when network is offline

---

**Summary**: This enhancement provides intelligent resource management while maintaining excellent user experience through automatic subscription lifecycle management and proactive data freshness checking.