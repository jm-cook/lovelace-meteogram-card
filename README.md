# Meteogram Card for Home Assistant

[![hacs][hacs-badge]][hacs-url]
![Maintenance][maintenance-badge]
[![release][release-badge]][release-url]
![downloads][downloads-badge]

A custom card showing a 48-hour meteogram with wind barbs, powered by Met.no API.





![Meteogram Card](https://raw.githubusercontent.com/jm-cook/lovelace-meteogram-card/main/images/meteogram-card.png)

## Features

- Full weather forecast visualization
- Temperature curve with weather icons
- Precipitation display (rain/snow) with probability indicators
- Cloud coverage visualization
- Professional-style wind barbs showing wind speed and direction
- Barometric pressure trend
- Automatically uses Home Assistant's configured location

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
# Optional: toggle display components
show_cloud_cover: true
show_pressure: true
show_weather_icons: true
show_wind: true
show_rain: true
```

## Features in detail

The meteogram retrieves weather data from the Met.no API and displays it in a visually appealing format. 

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
  Automatically uses Home Assistant's configured location or specified coordinates.
- **Responsive Design**  
  Automatically resizes to fit the card/container, ensuring a good layout on both wide and narrow screens.
- **Error Handling**  
  User-friendly error messages for network issues, API errors, and CORS problems.
- **Dark Mode Support**  
  Optimized for Home Assistant's dark mode with improved color contrast.
- **Visual Editor Support**  
  Fully compatible with Home Assistant's visual editor for easy configuration.
- **Caching**  
  Caches weather data per location to reduce API calls and improve performance. Uses an aggressive caching strategy to ensure compliance with Terms and Conditions for the MET API service.
- **Location Handling**  
  Uses configured coordinates, Home Assistant's location, or falls back to a default location (London).


## Options

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| title | string | Weather Forecast | Optional title for the card |
| latitude | string | HA's default | Latitude for weather data |
| longitude | string | HA's default | Longitude for weather data |
| show_cloud_cover | boolean | true | Show/hide cloud cover visualization |
| show_pressure | boolean | true | Show/hide pressure curve |
| show_weather_icons | boolean | true | Show/hide weather icons |
| show_wind | boolean | true | Show/hide wind barbs section |
| show_rain | boolean | true | Show/hide precipitation visualization |
| meteogram_length | string | 48h | Number of hours to display in the meteogram (`12h`, `24h`, `48h`, `54h`, or `max`) |
| styles | object | {} | Custom CSS variables for card styling |

### meteogram_length

The `meteogram_length` option allows you to specify the number of hours to display in the meteogram.  
Accepted values: **12h**, **24h**, **48h**, **54h**, or **max** (as provided by the Met.no location forecast).  
If not set, the default value is **48h**.

**Example:**
```yaml
type: 'custom:meteogram-card'
meteogram_length: 24h  # Shows 24 hours in the meteogram
```

**Example (max available):**
```yaml
type: 'custom:meteogram-card'
meteogram_length: max  # Shows the maximum available hours from Met.no
```

### styles

The `styles` option allows you to override CSS variables for the card, enabling custom colors and appearance.  
You can set any supported CSS variable (see [STYLES.md](doc/STYLES.md) for details).

**Example: Change background and text color**
```yaml
type: custom:meteogram-card
styles:
  --card-background-color: "#222"
  --primary-text-color: "#fff"
```

**Example: Customize chart colors**
```yaml
type: custom:meteogram-card
styles:
  --meteogram-cloud-color: "#ffb300"
  --meteogram-grid-color: "#1976d2"
  --meteogram-cloud-color-dark: "#333"
  --meteogram-grid-color-dark: "#444"   # Dark mode grid color
```

**Example: Change font size for labels, legends, and axis ticks**
```yaml
type: custom:meteogram-card
styles:
  --meteogram-label-font-size: "18px"      # Axis labels, date/hour/rain labels
  --meteogram-legend-font-size: "16px"     # Legend text
  --meteogram-tick-font-size: "15px"       # Y axis tick text
```

**Example: Customize rain bar, temperature line, pressure line, wind barb colors, and rain label text**
```yaml
type: custom:meteogram-card
styles:
  --meteogram-rain-bar-color: "#2196f3"
  --meteogram-rain-bar-color-dark: "#1565c0"
  --meteogram-rain-max-bar-color: "#90caf9"
  --meteogram-rain-max-bar-color-dark: "#1976d2"
  --meteogram-temp-line-color: "#ff9800"
  --meteogram-temp-line-color-dark: "#ffd54f"
  --meteogram-pressure-line-color: "#1976d2"
  --meteogram-pressure-line-color-dark: "#90caf9"
  --meteogram-wind-barb-color: "#388e3c"
  --meteogram-wind-barb-color-dark: "#c8e6c9"
  --meteogram-rain-label-color: "#d32f2f"
  --meteogram-rain-label-color-dark: "#ffebee"
  --meteogram-rain-max-label-color: "#1976d2"
  --meteogram-rain-max-label-color-dark: "#90caf9"
  --meteogram-legend-text-color-dark: "#fff"
```

**Usage notes:**
- All values must be strings.
- You can override any CSS variable used by the card.
- For dark mode, if a `-dark` variable is not set, the card will use the corresponding non-dark variable as a fallback.
- For a full list of variables, see [doc/STYLES.md](doc/STYLES.md).

#### List of Customizable CSS Variables

You can override the following CSS variables via the `styles` option:

- `--card-background-color`
- `--primary-text-color`
- `--secondary-text-color`
- `--error-color`
- `--divider-color`
- `--meteogram-cloud-color`
- `--meteogram-cloud-color-dark`
- `--meteogram-grid-color`
- `--meteogram-grid-color-dark`
- `--meteogram-pressure-color`
- `--meteogram-timescale-color`
- `--meteogram-label-font-size`
- `--meteogram-legend-font-size`
- `--meteogram-tick-font-size`
- `--meteogram-rain-bar-color`
- `--meteogram-rain-bar-color-dark`
- `--meteogram-rain-max-bar-color`
- `--meteogram-rain-max-bar-color-dark`
- `--meteogram-temp-line-color`
- `--meteogram-temp-line-color-dark`
- `--meteogram-pressure-line-color`
- `--meteogram-pressure-line-color-dark`
- `--meteogram-wind-barb-color`
- `--meteogram-wind-barb-color-dark`
- `--meteogram-rain-label-color`
- `--meteogram-rain-label-color-dark`
- `--meteogram-rain-max-label-color`
- `--meteogram-rain-max-label-color-dark`
- `--meteogram-legend-text-color-dark`

For details and more variables, see [doc/STYLES.md](doc/STYLES.md).

## Weather Data

This card fetches weather data directly from the Met.no API using the provided coordinates. If no coordinates are specified, it will use your Home Assistant's configured location.

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
