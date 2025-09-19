## v3.0.2 – Improved Legacy Dashboard Scaling & Altitude Option

**Highlights:**
- **Improved Scaling for Legacy Dashboards (Experimental):**
  - The card now scales and sizes more reliably on dashboards that do not use Home Assistant's new sections layout. This ensures better appearance and usability on older or custom dashboard setups.
  - **Note:** This improved scaling is experimental and is not likely to be further developed or improved in the future.
  - **Details:** For more information, see the documentation.
- **Optional Altitude for Met.no API:**
  - You can now specify an `altitude` parameter in the card configuration. This is passed to the Met.no API for more accurate weather forecasts, especially in mountainous regions.

**Upgrade Notes:**
- No breaking changes. Existing configuration will continue to work.
- If you use the Met.no API and want more accurate forecasts for high-altitude locations, add the `altitude` option to your card config.
- Improved scaling is automatic; no configuration changes are required.

---

## v3.0.1 – Display Mode Feature, Sizing & Fahrenheit Fixes

**Highlights:**
- **New Display Mode Feature:**
  - The card now supports three display modes: `full` (all features and legends), `core` (minimal, no legend), and `minimal` (ultra-minimal, no title or attribution). Select your preferred mode with the `display_mode` config option.
  - The legacy `focussed` option is now fully replaced by `display_mode`. Migration from old configs is automatic—if you previously used `focussed: true`, it will be converted to `display_mode: minimal`.
- **Sizing Improvements for Section View:**
  - Chart sizing and layout have been improved for Home Assistant's section view, ensuring better fit and appearance in dashboards.
- **Fahrenheit Double Conversion Bug Fixed:**
  - Fixed an issue where weather entities using Fahrenheit as the main unit would sometimes display temperatures incorrectly due to double conversion. Now, temperatures are shown correctly for all unit systems and sources.
- **iOS API Connectivity:**
  - Previous issues retrieving data from the Met.no API on iOS devices now appear to be resolved. If you experience new problems with iOS, please create a new issue on GitHub and include details.
  - Before reporting, check which version of the card you are running in the diagnostic panel (shown at the bottom of the card).


**Upgrade Notes:**
- No breaking changes. Existing configuration will continue to work.
- If you previously used `focussed: true`, your config will be automatically migrated to `display_mode: minimal`.
- Sizing is improved for section view layouts.
- Fahrenheit temperatures from weather entities are now always correct.
- If you use custom themes or translations, verify that new labels and legend visibility display correctly.

---

## v3.0.0 – Weather Entity Support & Entity Caching

**Highlights:**
- **Weather Entity Support:**  
  You can now use any Home Assistant weather entity as the data source for the meteogram. 
  Set `entity_id` in your card config. See [README.md](../README.md) for details and limitations.
- **Entity Caching:**  
  Forecasts from weather entities are cached in localStorage keyed by entity ID. Multiple entities can be cached and retrieved independently.
- **Met.no API remains supported:**  
  If no `entity_id` is specified, the card uses the Met.no API as before.
- **Focus Mode:**  
  New `focussed` option for a minimal chart display. When enabled, the card hides the title and attribution, showing only the chart—ideal for dashboards and kiosk views.
- **Improved error handling and diagnostics.**
- **No more fillContainer option:**  
  The card now automatically sizes to its container.

**Additional Changes:**
- **Chart Sizing & Margin Fixes:**  
  The chart now fills the card correctly in all configurations, especially when pressure is not shown. Previous issues with excessive gaps or margins have been resolved.
- **Responsive Rendering:**  
  Improved logic for chart width and margins ensures the meteogram adapts smoothly to all container sizes and modes.
- **Bug Fixes:**  
  - Fixed chart layout issues when pressure is not displayed.
  - Improved handling of edge cases for chart rendering and data availability.
- **Codebase Improvements:**  
  - Refactored margin and sizing logic for clarity and maintainability.
  - Enhanced error reporting and diagnostics for easier troubleshooting.
- **Theme & Style Support:**  
  - Continued support for CSS variables and dark mode.
  - Improved handling of custom properties for better compatibility with Home Assistant themes.
- **Documentation Updates:**  
  - README and STYLES.md updated to reflect new features, options, and usage examples.

---

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
