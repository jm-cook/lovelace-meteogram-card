# Cache Cleanup Improvements

## Overview
This document describes the enhanced localStorage cache management system implemented to ensure data consistency and prevent corruption issues in the Meteogram Card.

## Problems Addressed

### Before Improvements
- ❌ **Inconsistent data structures**: Old format entries were kept indefinitely
- ❌ **Corrupted entries**: JSON parsing errors would crash cache loading
- ❌ **Missing validation**: Cache entries with incomplete data structures weren't detected
- ❌ **Limited cleanup**: Only age-based cleanup on save, not on load
- ❌ **Cache corruption cascade**: One corrupted entry could affect entire cache

### After Improvements
- ✅ **Comprehensive validation**: Data structure validation on every cache access
- ✅ **Automatic format migration**: Old format entries are converted or cleaned up
- ✅ **Corruption resilience**: JSON parsing errors result in selective or complete cache clearing
- ✅ **Proactive cleanup**: Cache cleanup occurs on both save and load operations
- ✅ **Data consistency**: Required array validation ensures data integrity

## Cache Types

### 1. Entity API Cache (`meteogram-card-entity-weather-cache`)

**Storage Key**: `meteogram-card-entity-weather-cache`

**Data Format**:
```typescript
{
  [entityId: string]: {
    timestamp: number;     // When data was cached
    data: ForecastData;   // Weather forecast data
  }
}
```

**Cleanup Triggers**:
- ✅ **On save**: `WeatherEntityAPI.cleanupOldEntityCacheEntries()` 
- ✅ **On cache load**: Validates age, structure, and required arrays
- ✅ **Startup cleanup**: Once per browser session via `schedulePeriodicCacheCleanup()`
- ✅ **Format migration**: Converts old format entries to new format automatically

### 2. MET.no Weather API Cache (`metno-weather-cache`)

**Storage Key**: `metno-weather-cache`

**Data Format**:
```typescript
{
  "forecast-data": {
    [locationKey: string]: {
      expiresAt: number;    // When data expires
      data: ForecastData;   // Weather forecast data
    }
  }
}
```

**Cleanup Triggers**:
- ✅ **On save**: `WeatherAPI.cleanupOldCacheEntries()`
- ✅ **On cache load**: Validates expiry, structure, and required arrays
- ✅ **Startup cleanup**: Once per browser session via `schedulePeriodicCacheCleanup()`
- ✅ **Corruption handling**: Clears entire cache if JSON is corrupted

## Cleanup Criteria

### Age-Based Cleanup
- **Entity Cache**: Entries older than 24 hours from `timestamp`
- **MET.no Cache**: Entries older than 24 hours past `expiresAt`

### Data Structure Validation
Required arrays for `ForecastData`:
```typescript
['time', 'temperature', 'rain', 'rainMin', 'rainMax', 'snow', 
 'cloudCover', 'windSpeed', 'windGust', 'windDirection', 'symbolCode', 'pressure']
```

### Corruption Handling
- **JSON parse errors**: Clear entire cache and log warning
- **Missing arrays**: Remove specific cache entry
- **Invalid data types**: Remove specific cache entry
- **Malformed structure**: Remove specific cache entry

## Implementation Details

### WeatherEntityAPI Improvements

**Enhanced Cache Loading** (`_fetchFreshEntityData`):
```typescript
- Validates entry age (24h limit)
- Converts old format to new format automatically
- Validates required array properties
- Removes corrupted entries immediately
- Handles JSON parsing errors gracefully
```

**Enhanced Cache Cleanup** (`cleanupOldEntityCacheEntries`):
```typescript
- Age-based cleanup (24h)
- Data structure validation  
- Required array validation
- Detailed logging of cleanup actions
```

### WeatherAPI Improvements

**Enhanced Cache Loading** (`loadCacheFromStorage`):
```typescript
- Validates entry age (24h past expiry)
- Validates required array properties
- Removes corrupted entries immediately
- Handles JSON parsing errors gracefully
- Clears entire cache on corruption
```

**Enhanced Cache Cleanup** (`cleanupOldCacheEntries`):
```typescript
- Age-based cleanup (24h past expiry)
- Data structure validation
- Required array validation
- Handles corrupted cache by clearing entirely
```

### Startup Cache Cleanup

**Location**: `meteogram-card-class.ts` - `schedulePeriodicCacheCleanup()`

**Features**:
- Runs once per browser session (using sessionStorage flag)
- Validates both cache types simultaneously  
- Handles both old and new format entries
- Comprehensive data structure validation
- Graceful error handling with cache clearing

## Benefits

### Data Integrity
- **Consistent Structure**: All cache entries have validated data structures
- **Required Arrays**: Ensures all necessary forecast arrays are present
- **Type Safety**: Validates data types match expected format

### Performance
- **Reduced Memory**: Removes old and invalid entries proactively
- **Faster Loading**: Avoids processing corrupted or incomplete data
- **Efficient Validation**: Validates only what's necessary

### Reliability  
- **Corruption Recovery**: Automatically recovers from cache corruption
- **Format Migration**: Seamlessly handles version upgrades
- **Graceful Degradation**: Falls back to fresh data fetch when cache fails

### Debugging
- **Detailed Logging**: Clear messages about cleanup actions
- **Error Context**: Specific error messages for different failure modes
- **Validation Feedback**: Reports missing arrays and data issues

## Migration Path

### Old Format Support
- Old format entries are automatically detected
- Converted to new format with current timestamp  
- Marked as 12h old to trigger refresh soon
- Removed if data structure is invalid

### Backward Compatibility
- No breaking changes for existing users
- Gradual migration as cache entries are accessed
- Fallback to fresh data fetch if migration fails

## Monitoring

### Console Logging
```typescript
// Cleanup actions
"[WeatherEntityAPI] Cleaned up 2 old and 1 invalid entity cache entries"
"[WeatherAPI] Cleaned up 3 old and 0 invalid cache entries from metno-weather-cache"

// Data validation  
"[WeatherEntityAPI] Cached data for weather.openweathermap is missing required arrays: windGust, symbolCode, removing from cache"
"[WeatherAPI] Cached data for 59.91,10.75 is too old (25h past expiry), removing from cache"

// Format migration
"[WeatherEntityAPI] Converting old format cache entry for weather.met to new format"

// Corruption recovery
"[WeatherAPI] Corrupted cache JSON, clearing metno-weather-cache"
"[WeatherEntityAPI] Cleared corrupted cache due to parse error"
```

## Testing Scenarios

### Recommended Test Cases
1. **Age expiry**: Verify entries older than 24h are removed
2. **Missing arrays**: Test cache entries with incomplete ForecastData  
3. **JSON corruption**: Test malformed JSON in localStorage
4. **Format migration**: Test upgrade from old format entries
5. **Startup cleanup**: Verify once-per-session cleanup behavior
6. **Error recovery**: Test recovery from various corruption scenarios

## Future Enhancements

### Potential Improvements
- **Cache size limits**: Implement maximum cache entry limits
- **Selective array validation**: Allow partial data for graceful degradation
- **Cache versioning**: Add version metadata for easier migrations
- **Performance metrics**: Track cache hit rates and cleanup frequency
- **Compression**: Add data compression for large cache entries

---

*This cache management system ensures robust, reliable weather data caching while maintaining compatibility and providing clear debugging information.*