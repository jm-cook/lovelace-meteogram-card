# Meteogram Card for Home Assistant

[![hacs][hacs-badge]][hacs-url]
![Maintenance][maintenance-badge]
[![release][release-badge]][release-url]
![downloads][downloads-badge]

A custom card showing a 48-hour meteogram with wind barbs, powered by Met.no API.

![Meteogram Card](https://raw.githubusercontent.com/jm-cook/ha-meteogram-card/main/images/meteogram-card.png)

## Features

- 48-hour weather forecast visualization
- Temperature curve with weather icons
- Precipitation display (rain/snow) with probability indicators
- Cloud coverage visualization
- Professional-style wind barbs showing wind speed and direction
- Barometric pressure trend
- Automatically uses Home Assistant's configured location

## Installation

### HACS Installation
1. In Home Assistant, go to HACS > Frontend
2. Click the three dots in the top right corner and select "Custom repositories"
3. Add the URL of this repository (`https://github.com/jm-cook/ha-meteogram-card`) and select "Dashboard" as the category
4. Click "Add"
5. Find and install "Meteogram Card"

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
show_rain_probability: true
```

## Options

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| title | string | | Optional title for the card |
| latitude | number | HA's default | Latitude for weather data |
| longitude | number | HA's default | Longitude for weather data |
| show_cloud_cover | boolean | true | Show/hide cloud cover visualization |
| show_pressure | boolean | true | Show/hide pressure curve |
| show_weather_icons | boolean | true | Show/hide weather icons |
| show_wind | boolean | true | Show/hide wind barbs section |
| show_rain_probability | boolean | true | Show/hide precipitation probability |

## Weather Data

This card fetches weather data directly from the Met.no API using the provided coordinates. If no coordinates are specified, it will use your Home Assistant's configured location.

The card uses the "complete" API endpoint to retrieve precipitation probability data, which allows visualization of rain/snow uncertainty.

## Credits

- Weather data provided by [MET Norway Weather API](https://api.met.no/)
- Weather icons from [Met.no Weather Icons](https://github.com/metno/weathericons)

<!-- Badges -->
[hacs-badge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/jm-cook/ha-meteogram-card?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/jm-cook/ha-meteogram-card/total?style=flat-square
[hacs-url]: https://github.com/hacs/integration

[maintenance-badge]: https://img.shields.io/maintenance/yes/2025.svg?style=flat-square
[release-url]: https://github.com/jm-cook/ha-meteogram-card/releases