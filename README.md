# Meteogram Card for Home Assistant

A custom card showing a 48-hour meteogram with wind barbs, powered by Met.no API.

![Meteogram Card](https://raw.githubusercontent.com/jm-cook/ha-meteogram-card/main/images/meteogram-card.png)

## Features

- 48-hour weather forecast visualization
- Temperature curve with weather icons
- Precipitation display (rain/snow)
- Cloud coverage visualization
- Professional-style wind barbs showing wind speed and direction
- Automatically uses Home Assistant's configured location

## Installation

### HACS Installation
1. In Home Assistant, go to HACS > Frontend
2. Click the three dots in the top right corner and select "Custom repositories"
3. Add the URL of this repository (`https://github.com/jm-cook/ha-meteogram-card`) and select "Lovelace" as the category
4. Click "Add"
5. Find and install "Meteogram Card"

### Manual Installation
1. Download the `ha-meteogram-card.zip` file from the latest release
2. Extract the contents to your `config/www/ha-meteogram-card/` directory
3. Add the following to your Lovelace resources:
   ```yaml
   - url: /local/ha-meteogram-card/dist/meteogram-card.js
     type: module
   ```

## Usage

Add the card to your dashboard:

```yaml
type: custom:meteogram-card
title: Weather Forecast
# Optional: specify coordinates, or use Home Assistant's default location
latitude: 51.5074
longitude: -0.1278
```

## Options

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| title | string | | Optional title for the card |
| latitude | number | HA's default | Latitude for weather data |
| longitude | number | HA's default | Longitude for weather data |

## Weather Data

This card fetches weather data directly from the Met.no API using the provided coordinates. If no coordinates are specified, it will use your Home Assistant's configured location.

## Credits

- Weather data provided by [MET Norway Weather API](https://api.met.no/)
- Weather icons from [Met.no Weather Icons](https://github.com/metno/weathericons)
