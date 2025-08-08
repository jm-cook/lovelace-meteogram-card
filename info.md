# Meteogram Card

A custom card showing a 48-hour meteogram with wind barbs, powered by Met.no API.

![Meteogram Card](https://raw.githubusercontent.com/jm-cook/ha-meteogram-card/main/images/meteogram-card.png)

## Features

- 48-hour weather forecast visualization
- Temperature curve with weather icons
- Precipitation display (rain/snow)
- Cloud coverage visualization
- Professional-style wind barbs showing wind speed and direction
- Automatically uses Home Assistant's configured location

## Configuration

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
