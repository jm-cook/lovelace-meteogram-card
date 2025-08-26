## v2.1.0 – Language Support & API Migration

Meteogram Card v2.1.0 introduces multi-language support and migrates all weather data requests to a dedicated Met.no API subdomain for improved reliability and compliance.

**Highlights:**
- **Multi-Language Support:**  
  The card now automatically adapts labels, tooltips, and chart text to your Home Assistant language setting. 
  Supported languages are currently English, French, German, Spanish, Norwegian, and Italian.
- **API Migration:**  
  All weather data is now fetched from the  Met.no API subdomain dedicated to Home Assistant, ensuring continued service and compliance with Met.no requirements.
- **Improved Error Handling:**  
  Enhanced diagnostics for API errors, including localized error messages.
- **Minor Fixes & Improvements:**
  - Updated documentation for language and API changes.
  - Minor UI and accessibility improvements.

**Upgrade Notes:**
- No breaking changes. Existing configuration will continue to work.
- If you use custom themes or translations, verify that new labels display correctly.
- _Note: Some iOS users report intermittent issues retrieving data from the Met.no API. 
This appears to be related to iOS network or browser restrictions and is outside the control of the card. Unfortunately there is curretly 
no solution._

Enjoy a more accessible and reliable meteogram experience!

## v2.0.0 – Introducing Fully Themeable Chart with Light & Dark Mode Support

Meteogram Card v2.0.0 brings a major upgrade: every chart element is now fully themeable using CSS variables, with dedicated support for both light and dark mode.  
Customize colors for temperature, pressure, rain, snow, wind barbs, gridlines, axis labels, timescale, and more—directly from your Home Assistant theme or card config.

**Highlights:**
- All chart elements use CSS variables for color and style.
- Each variable has a dark mode counterpart (e.g. `--meteogram-temp-line-color-dark`).
- Snow bars are now themeable (`--meteogram-snow-bar-color`, `--meteogram-snow-bar-color-dark`).
- No more repeated fallback colors—everything is centralized and easy to override.
- See [STYLES.md](STYLES.md) for the full list of variables.

**Example: Customizing the chart for light and dark mode**
```yaml
type: custom:meteogram-card
styles:
  --meteogram-temp-line-color: "#ff9800"
  --meteogram-temp-line-color-dark: "#ffd54f"
  --meteogram-pressure-line-color: "#1976d2"
  --meteogram-pressure-line-color-dark: "#90caf9"
  --meteogram-rain-bar-color: "#2196f3"
  --meteogram-rain-bar-color-dark: "#1565c0"
  --meteogram-snow-bar-color: "lightblue"
  --meteogram-snow-bar-color-dark: "white"
  --meteogram-grid-color: "#b8c4d9"
  --meteogram-grid-color-dark: "#444"
  --meteogram-axis-label-color: "#222"
  --meteogram-axis-label-color-dark: "#fff"
  --meteogram-timescale-color: "#ffb300"
  --meteogram-timescale-color-dark: "#ffd54f"
```

**Try it out and make your meteogram match your dashboard perfectly!**

# Meteogram Card v1.0.9 Release Notes


- Added custom CSS variables for rain labels, rain bars, temperature line, pressure line, and wind barbs/arrows for improved theming and customization.
- Ensured all grid lines consistently use the correct color variable in dark mode.
- Improved style variable naming conventions for better maintainability and conflict avoidance.
- Documentation updates and minor code cleanups.

# Meteogram Card v1.0.8 Release Notes

## Features & Improvements

- **Temperature Unit Respect:** The card now uses the system temperature unit from 
Home Assistant (`°C` or `°F`) for all temperature displays. Temperatures are converted 
from Celsius to Fahrenheit as needed. Refresh your browser to see the changes after making changes to the system units.
- **API Success Indicator:** The API success flag now has three states:
  - **Not Called / Cached:** Green X (❎) with tooltip "cached".
  - **Success:** Green tick (✅) with tooltip "success".
  - **Failed:** Red X (❌) with tooltip "failed".
- **API Success Icon in Attribution:** The API success icon (with tooltip) is now shown next to the met.no attribution at the top right of the card.
- **Tooltips:** Tooltips are added to all API success indicators for clarity.
- **Dark Mode Improvements:** The card now better adapts to Home Assistant's dark mode, ensuring good contrast and readability.


## Bug Fixes

- Minor improvements to chart rendering and error handling.
- Fixed bug in cloud cover shading where it would not display correctly.


## Upgrade Notes

- No breaking changes. Existing configuration will continue to work.
- If you use custom themes, verify that the new icons and tooltips display correctly.

# Meteogram Card v1.0.7 Release Notes

Now included in HACS.

Updated documentation, added preview in card-picker.

# Meteogram Card v1.0.6 Release Notes

First release for non-custom HACS repo:

**Release Notes**

- **Improved Caching Strategy:** Weather data is now cached per location, reducing API calls and improving performance. This update enhances compliance with Met.no API Terms of Service by minimizing unnecessary requests.
- **Dark Mode Support:** The card automatically adapts to Home Assistant's dark mode, providing better visual comfort and contrast.
- **Multiple Locations:** You can now specify custom coordinates, enabling support for multiple weather locations beyond the default Home Assistant setting.
- **Alternative Time Periods:** The meteogram can display various time spans (12h, 24h, 48h, 54h, or max available), offering more flexibility in forecast visualization.
- **Improved API Compliance:** The caching and request strategy have been refined to better align with Met.no API Terms of Service, ensuring responsible and efficient data usage.

# Meteogram Card v1.0.5 Release Notes

**Release Notes**

- **Improved Caching Strategy:** Weather data is now cached per location, reducing API calls and improving performance. This update enhances compliance with Met.no API Terms of Service by minimizing unnecessary requests.
- **Dark Mode Support:** The card automatically adapts to Home Assistant's dark mode, providing better visual comfort and contrast.
- **Multiple Locations:** You can now specify custom coordinates, enabling support for multiple weather locations beyond the default Home Assistant setting.
- **Alternative Time Periods:** The meteogram can display various time spans (12h, 24h, 48h, 54h, or max available), offering more flexibility in forecast visualization.
- **Improved API Compliance:** The caching and request strategy have been refined to better align with Met.no API Terms of Service, ensuring responsible and efficient data usage.

# Meteogram Card v1.0.4 Release Notes


## v1.0.4
### 🚀 Recent features & Improvements

- **Pressure Line**  
  Added optional pressure (hPa) line and right-side axis. Toggle with `show_pressure` config.

- **Cloud Cover Band**  
  Optional cloud cover shading and legend. Toggle with `show_cloud_cover` config.

- **Wind Barbs**  
  Wind barbs now appear in a dedicated band below the chart. Toggle with `show_wind` config.

- **Weather Icons Density**  
  Choose between dense (every hour) or sparse (every 2 hours) weather icons with `dense_weather_icons`.

- **Visual Editor**  
  Full Home Assistant visual editor support for all options.

- **Improved: Caching**
    - Caching is now per-location, using 4 decimal places for latitude/longitude.
    - Expired cache entries are cleaned up automatically.
    - Handles API 304/429 responses and uses cache when possible.

- **Improved: Location Handling**
    - Card uses configured coordinates, Home Assistant location, or falls back to last-used or default (London).
    - All lat/lon values are consistently truncated to 4 decimals.

- **Improved: Responsive Design**
    - Chart resizes automatically with card/container.
    - Improved layout for wide and narrow screens.

- **Improved: Error Handling**
    - User-friendly error messages for network, CORS, and API issues.
    - Rate-limited error reporting to avoid log spam.

- **Improved: Dark Mode**
    - Better color contrast and support for Home Assistant dark mode.

- **Improved: Logging**
    - Debug logging enabled for beta versions.
    - More detailed logs for cache, fetch, and rendering.

### 🐛 Bug Fixes

- Fixed: Rain/snow bars and labels now always align with correct hours.
- Fixed: Weather icons are loaded reliably and cached.
- Fixed: Chart no longer redraws unnecessarily or gets stuck on tab switches.
- Fixed: Handles missing or malformed cache gracefully.

### ⚠️ Breaking/Behavior Changes

- Caching is now per-location (4 decimal places).
- Some config options renamed for clarity (`show_cloud_cover`, `show_pressure`, etc.).




# Meteogram Card v1.0.3 Release Notes

Corrected User-agent to refer to correct repository

Improved logic reducing unnecessary calls to api.

# Meteogram Card v1.0.2 Release Notes

**Release Notes for v1.0.2**

- **User-Agent Header Correction:**  
  Updated the User-Agent header for Met.no API requests to reference the GitHub repository, ensuring API compliance and reducing fetch errors.

- **Improved Error Diagnostics:**  
  Enhanced error logging for weather data fetch failures, including response status and body for easier troubleshooting.

- **Dark Mode Compliance:**  
  Implemented automatic dark mode detection and styling. The card now adapts its appearance based on Home Assistant's theme or page CSS classes for better visual integration.

- **Bug Fixes and Code Cleanup:**  
  Minor fixes and code improvements for reliability and maintainability.

**Upgrade Recommendation:**  
Update to this release if you encountered "Failed to fetch weather data" errors, issues with API connectivity, or want improved dark mode support.

