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

