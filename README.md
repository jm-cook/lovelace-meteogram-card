# Meteogram Card for Home Assistant

[![hacs][hacs-badge]][hacs-url]
![Maintenance][maintenance-badge]
[![release][release-badge]][release-url]
![downloads][downloads-badge]

A custom card showing a meteogram with wind barbs, powered by Met.no API or Home Assistant weather entity.

---

![Meteogram Card](https://raw.githubusercontent.com/jm-cook/lovelace-meteogram-card/main/images/meteogram-card.png)

## Features

- Full weather forecast visualization
- Temperature curve with weather icons
- Precipitation display (rain/snow) with probability indicators
- Cloud coverage visualization
- Professional-style wind barbs showing wind speed and direction
- Barometric pressure trend
- Automatically uses Home Assistant's configured location or weather entity

## Installation (HACS)

1. Open Home Assistant and go to **HACS** > **Frontend**.
2. Click the "+" button to add a new integration.
3. Search for **Meteogram Card**.
4. Click **Install**.
5. Restart Home Assistant if prompted.

You no longer need to add a custom repository. The card is available directly in HACS.

## Usage

Add the card to your dashboard:

```yaml
type: custom:meteogram-card
title: Weather Forecast
# Optional: specify coordinates, or use Home Assistant's default location
latitude: 51.5074
longitude: -0.1278
# Optional: use a Home Assistant weather entity
entity_id: weather.home
# Optional: toggle display components
show_cloud_cover: true
show_pressure: true
show_weather_icons: true
show_wind: true
show_precipitation: true
```

### Weather Entity Mode

If you set `entity_id`, the card will use the forecast from that entity.  
Supported entities: any Home Assistant weather entity with a `forecast` attribute.

**Important Note:**  
Most Home Assistant weather integrations do **not** provide the full set of attributes that meteogram-card can display.  
For example, some integrations may lack cloud cover, `precipitation_max`, or even wind speed and direction.  
Additionally, weather integration entities may only provide data for a limited number of hours (often 24 or 48), which may restrict the length of the meteogram.  
For example some Weather integrations for Home Assistant only provide 24 hours of forecast data, which gives a 23 hour meteogram.
For best functionality and a complete meteogram, passing `latitude` and `longitude` (to use the Met.no API) is recommended.  

**Caching:**  
Forecasts are cached in localStorage under `meteogram-card-entity-weather-cache`, keyed by entity ID.  
Multiple entities can be cached and retrieved independently.

### Met.no API Mode

If no `entity_id` is set, the card uses the Met.no API and caches per location.

## Features in detail

The meteogram retrieves weather data from the Met.no API or a Home Assistant weather entity and displays it in a visually appealing format. 

### Graphical elements
- **Temperature Curve**  
  Displays temperature over the next specified period with weather icons for each hour.
- **Precipitation Visualization**  
  Shows rain and snow probability with bars indicating expected precipitation.
- **Cloud Coverage**  
  Visualizes cloud cover as a shaded area on the chart.
- **Wind Barbs**  
  Displays wind speed and direction using professional-style wind barbs.
- **Barometric Pressure**  
  Shows the pressure trend over the next 48 hours with an optional right-side axis.

### Customizable Options
  Configure various display options like cloud cover, pressure, weather icons, wind, and rain.
- **Meteogram Length**  
  Configurable length of the meteogram (8, 12, 24, 48 hours, or "max" for full available data).
- **Weather Icons Density**  
  Choose between dense (every hour) or sparse (every 2 hours) weather icons.
- **Title**  
  Optional title for the card, displayed at the top.


### Functionality
- **Dynamic Location**  
  Automatically uses Home Assistant's configured location, specified coordinates, or weather entity.
- **Responsive Design**  
  Automatically resizes to fit the card/container, ensuring a good layout on both wide and narrow screens.
- **Error Handling**  
  User-friendly error messages for network issues, API errors, and CORS problems.
- **Dark Mode Support**  
  Fully supports Home Assistant's dark mode using the `modes:` setting in your theme YAML. All colors and styles adapt automatically. You can override any CSS variable for both light and dark mode using Home Assistant's theme system.
- **Visual Editor Support**  
  Fully compatible with Home Assistant's visual editor for easy configuration.
- **Caching**  
  Caches weather data per location or per entity to reduce API calls and improve performance.


## Options

| Name                  | Type     | Default         | Description                                                                                       |
|-----------------------|----------|-----------------|---------------------------------------------------------------------------------------------------|
  meteogram-rain-bar-color: "#2196f3"
  meteogram-rain-max-bar-color: "#90caf9"
  meteogram-temp-line-color: "#ff9800"
  meteogram-pressure-line-color: "#1976d2"
  meteogram-wind-barb-color: "#388e3c"
  meteogram-rain-label-color: "#d32f2f"
  meteogram-rain-max-label-color: "#1976d2"
  meteogram-cloud-color: red
| styles                | object   | {{}}            | Custom CSS variables for card styling                                                             |

### Option Notes
- `show_precipitation` replaces the deprecated `show_rain` option. For backward compatibility, `show_rain` is still supported but will be ignored if `show_precipitation` is set.
- `meteogram_hours` replaces the deprecated `meteogram_length` option. For backward compatibility, `meteogram_length` is still supported but will be ignored if `meteogram_hours` is set.
- `layout_mode` controls the card's layout. Possible values:
  - `sections` (default): Standard Home Assistant card layout.
  - `panel`: Wide, single-panel layout (good for dashboards).
  - `grid`: Grid layout for advanced dashboarding.
- `aspect_ratio` only applies in `panel` or `grid` layout modes.
- `diagnostics` enables a status panel for troubleshooting API/data issues.
- `display_mode` is the preferred way to set the card's display style. Use `"focussed"` for a minimal chart-only view.
- `altitude` is optional and can be set to improve forecast accuracy for locations at significant elevation. If not set, the Home Assistant default altitude is used (if available).

### Layout Mode (`layout_mode`)

> **Experimental Option for Advanced/Legacy Views**

The `layout_mode` option controls the overall layout of the meteogram card. The default and recommended value is `sections`, which is designed to integrate seamlessly with Home Assistant's modern dashboard experience.

- **sections** (default, recommended):
  - The primary and best-supported view for meteogram-card.
  - Uses Home Assistant's standard card layout, ensuring maximum compatibility and visual consistency.
  - All features and options are tested and optimized for this mode.
- **panel** (experimental):
  - Renders the chart in a wide, single-panel layout.
  - Useful for legacy dashboards or custom kiosk views.
  - Some features or styling may not be as robust as in `sections` mode.
- **grid** (experimental):
  - Places the chart in a grid layout for advanced dashboarding.
  - Intended for power users and special use cases.
  - May not be fully supported in all Home Assistant themes or dashboard types.

> **Note:** The `panel` and `grid` modes are provided for advanced users and legacy compatibility. Most users should use the default `sections` mode for the best experience.

> **Note:** The `layout_mode` option is **not available in the visual (interactive) editor**. To use `layout_mode`, you must open the YAML editor (click "Show code editor" in the card configuration dialog) and add the option manually. This is because `layout_mode` is an advanced/experimental feature and not exposed in the standard UI.

### Aspect Ratio (`aspect_ratio`)

> **Only applies in `panel` or `grid` layout modes**

The `aspect_ratio` option allows you to control the width-to-height ratio of the chart area. This is only relevant if you are using `layout_mode: panel` or `layout_mode: grid`.

- Examples: `16:9` (default), `4:3`, `1:1`, `21:9`, `3:2`, or a custom value like `1.6` or `5:3`.
- Has no effect in the default `sections` layout mode.

**Recommended:**
- Use the default `sections` layout for most dashboards. Only use `panel` or `grid` (and thus `aspect_ratio`) if you have a specific advanced use case or are maintaining a legacy dashboard.


### Example Configuration

```yaml
type: custom:meteogram-card
title: Weather Forecast
latitude: 51.5074
longitude: -0.1278
entity_id: weather.home
show_cloud_cover: true
show_pressure: true
show_precipitation: true
show_weather_icons: true
show_wind: true
dense_weather_icons: true
meteogram_hours: 48h
aspect_ratio: "16:9"
layout_mode: sections
diagnostics: false
display_mode: full
styles:
  meteogram-label-font-size: "16px"
  meteogram-grid-color: "#1976d2"
```

#### Example: Focussed Mode (Minimal Chart)
```yaml
type: custom:meteogram-card
display_mode: focussed
```

#### Example: Panel Layout with Custom Aspect Ratio
```yaml
type: custom:meteogram-card
layout_mode: panel
aspect_ratio: "21:9"
```

#### Example: Diagnostics Panel Enabled
 
For more details and examples, see [doc/STYLES.md](doc/STYLES.md).
```yaml
type: custom:meteogram-card
diagnostics: true
The card provides built-in defaults for all CSS variables for both light and dark mode. You can override these in your Home Assistant theme or via the `styles` property. For dark mode, use the `modes: dark:` section in your theme YAML.
```

## Note on Color Codes in Documentation

> **Why are some colors named instead of hex codes?**
> To avoid HACS/GitHub auto-linking hex codes like `#333` and `#444` as issue references, these have been replaced with named CSS colors (e.g., `darkgray`, `dimgray`, `gray`, `black`) in documentation examples. You can safely copy-paste these values—they will work in Home Assistant and CSS. Other hex codes remain unchanged.

**Example: Customize chart colors**
```yaml
type: custom:meteogram-card
styles:
  meteogram-cloud-color: "#ffb300"
  meteogram-grid-color: "#1976d2"
```

**Example: Change font size for labels, legends, and axis ticks**
```yaml
type: custom:meteogram-card
styles:
  meteogram-label-font-size: "18px"      # Axis labels, date/hour/rain labels
  meteogram-legend-font-size: "16px"     # Legend text
  meteogram-tick-font-size: "15px"       # Y axis tick text
```

**Example: Customize rain bar, temperature line, pressure line, wind barb colors, and rain label text**
```yaml
type: custom:meteogram-card
styles:
  meteogram-rain-bar-color: "#2196f3"
  meteogram-rain-max-bar-color: "#90caf9"
  meteogram-temp-line-color: "#ff9800"
  meteogram-pressure-line-color: "#1976d2"
  meteogram-wind-barb-color: "#388e3c"
  meteogram-rain-label-color: "#d32f2f"
  meteogram-rain-max-label-color: "#1976d2"
  meteogram-cloud-color: red
```

**Usage notes:**
- All values must be strings.
- You can override any CSS variable used by the card.
- For dark mode, use the `modes: dark:` section in your theme YAML (see [doc/STYLES.md](doc/STYLES.md)).
- For a full list of variables, see [doc/STYLES.md](doc/STYLES.md).


#### List of Customizable CSS Variables

You can override the following CSS variables via the `styles` option or your theme YAML (without the `--` prefix):

- `meteogram-label-font-size`
- `meteogram-legend-font-size`
- `meteogram-tick-font-size`
- `meteogram-cloud-color`
- `meteogram-grid-color`
- `meteogram-pressure-line-color`
- `meteogram-timescale-color`
- `meteogram-rain-bar-color`
- `meteogram-rain-max-bar-color`
- `meteogram-temp-line-color`
- `meteogram-wind-barb-color`
- `meteogram-rain-label-color`
- `meteogram-rain-max-label-color`
- `meteogram-snow-bar-color`
- ...and more (see [doc/STYLES.md](doc/STYLES.md) for the full list)

For more details and examples, see [doc/STYLES.md][styledoc-url].

## Weather Data

This card fetches weather data from the Met.no API or from a Home Assistant weather entity.  
If no coordinates or entity are specified, it will use your Home Assistant's configured location.

The card uses the "complete" API endpoint to retrieve precipitation probability data, which allows visualization of rain/snow uncertainty.

## Development

For developers, the Meteogram Card is built with TypeScript and uses modern web technologies. 

[Developer Documentation][devdoc-url]

## Credits

- Weather data provided by [MET Norway Weather API](https://api.met.no/)
- Weather icons from [Met.no Weather Icons](https://github.com/metno/weathericons)

<!-- Badges and links -->
[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/jm-cook/lovelace-meteogram-card?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/jm-cook/lovelace-meteogram-card/total?style=flat-square
[hacs-url]: https://github.com/hacs/integration

[maintenance-badge]: https://img.shields.io/maintenance/yes/2025.svg?style=flat-square
[release-url]: https://github.com/jm-cook/lovelace-meteogram-card/releases
[devdoc-url]: https://github.com/jm-cook/lovelace-meteogram-card/blob/main/doc/DEV.md
[styledoc-url]: https://github.com/jm-cook/lovelace-meteogram-card/blob/main/doc/STYLES.md

## Default Configuration Properties

The following are the default configuration properties for the Meteogram Card (as of the latest version):

| Property             | Default Value |
|----------------------|--------------|
| title                | ""           |
| latitude             | undefined    |
| longitude            | undefined    |
| showCloudCover       | true         |
| showPressure         | true         |
| showRain             | true         |
| showWeatherIcons     | true         |
| showWind             | true         |
| denseWeatherIcons    | true         |
| meteogramHours       | "48h"        |
| styles               | {{}}         |
| diagnostics          | DIAGNOSTICS_DEFAULT |
| entityId             | undefined    |
| focussed             | false        |

*Note: `DIAGNOSTICS_DEFAULT` is defined in the code and typically defaults to `false` for production builds.*


## CSS Variable Defaults

The following are the default CSS variables for the card. You can override these in your Home Assistant theme or via the `styles` property:

```css
:host {
  --meteogram-grid-color: #b8c4d9;
  --meteogram-temp-line-color: orange;
  --meteogram-pressure-line-color: #90caf9;
  --meteogram-rain-bar-color: deepskyblue;
  --meteogram-rain-max-bar-color: #7fdbff;
  --meteogram-rain-label-color: #0058a3;
  --meteogram-rain-max-label-color: #2693e6;
  --meteogram-cloud-color: #b0bec5;
  --meteogram-wind-barb-color: #1976d2;
  --meteogram-snow-bar-color: #b3e6ff;
  --meteogram-label-font-size: 13px;
  --meteogram-legend-font-size: 14px;
  --meteogram-tick-font-size: 13px;
  --meteogram-axis-label-color: #000;
  --meteogram-timescale-color: #ffb300;
}
```

*Note: The card no longer uses `-dark` variable names. Instead, all variables are automatically applied for the correct mode using Home Assistant's theme system and the `:host([dark])` selector.*

### Wind Barbs

The meteogram displays wind speed and direction using professional-style wind barbs, a standard meteorological symbol. Each wind barb is plotted at the corresponding forecast hour and visually encodes both the wind speed and the direction:

- **Direction:**
  - The shaft of the wind barb points in the direction **from which** the wind is blowing.
  - **North is up** on the chart, so a barb pointing straight up means wind is coming from the north (blowing south).
  - For example, a barb pointing to the right (east) means wind is coming from the east (blowing west).
- **Speed:**
  - Wind speed is indicated by the number and type of barbs (feathers) and flags on the shaft:
    - **Short feather:** 5 knots
    - **Long feather:** 10 knots
    - **Triangle (flag):** 50 knots (not used in this card; only short and long feathers are shown)
  - The total wind speed is the sum of the values of all feathers on the barb.
  - For example, a barb with two long feathers and one short feather represents 25 knots (10 + 10 + 5).
  - If the wind is very light (less than 2 knots), a small circle is drawn instead of a barb ("calm").
- **Placement:**
  - Wind barbs are shown in a dedicated band below the main chart area, aligned with the forecast hour.
  - The length of the shaft and the size of the feathers are scaled for readability.
- **Gusts:**
  - **Wind gusts are currently not shown** in the meteogram. Only the sustained wind speed and direction are visualized. If your data source provides gust information, it will not be displayed in the wind barb band at this time.

**Reading the wind barbs:**
- The orientation of the shaft shows the wind's origin direction (where it's coming from).
- The number and type of feathers show the wind speed in knots.
- Calm winds (less than 2 knots) are shown as a small circle.

**Example:**
- A wind barb pointing up with one long and one short feather: wind from the north at 15 knots.
- A wind barb pointing left with two long feathers: wind from the west at 20 knots.

This visualization allows you to quickly assess both the strength and direction of the wind at each forecast hour, just as in professional meteorological charts.
