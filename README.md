# Meteogram Card for Home Assistant

![Meteogram Card](https://raw.githubusercontent.com/yourusername/ha-meteogram-card/main/images/preview.png)

A detailed 48-hour meteogram custom card for Home Assistant displaying:
- Temperature curve
- Rain and snow precipitation
- Cloud cover
- Wind barbs showing speed and direction
- Weather condition icons

## Installation

### HACS (Home Assistant Community Store)

1. Add this repository to HACS as a custom repository:
   - Repository: `yourusername/ha-meteogram-card`
   - Category: `Lovelace`

2. Install the "Meteogram Card" from HACS.

3. Download the weather icons:
   ```bash
   # Create the icons directory in your HA configuration
   mkdir -p www/ha-meteogram-card/icons
   
   # Option 1: Download using the included script (if node.js is available)
   cd /path/to/hacs/ha-meteogram-card
   npm run download-icons
   cp -r icons /config/www/ha-meteogram-card/
   
   # Option 2: Download manually from the repository
   # Copy all SVG files from the icons directory to /config/www/ha-meteogram-card/icons/
   ```

4. Add the resource to Lovelace:
   ```yaml
   resources:
     - url: /hacsfiles/meteogram-card/meteogram-card.js
       type: module
   ```

### Manual Installation

1. Download the latest release from the repository
2. Copy `meteogram-card.js` to your `<config>/www/` folder
3. Download the weather icons:
   ```bash
   mkdir -p /config/www/ha-meteogram-card/icons
   # Copy icons from the repository's icons folder to this directory
   ```
4. Add the card as a resource in Lovelace:
   ```yaml
   resources:
     - url: /local/ha-meteogram-card/meteogram-card.js
       type: module
   ```

## Configuration

Add the card to your dashboard:

```yaml
type: custom:meteogram-card
title: Weather Forecast
latitude: 51.5074
longitude: -0.1278
```

### Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| title | string | optional | Card title |
| latitude | number | required | Latitude for weather forecast |
| longitude | number | required | Longitude for weather forecast |

## Weather Data Source

This card uses the Met.no Locationforecast API. This is a free, public API that provides detailed weather forecasts for locations worldwide. No API key is required, but please be respectful with the number of requests.

## Troubleshooting

### Icons not displaying

If weather icons are not showing:
1. Verify the icons are properly copied to `/config/www/ha-meteogram-card/icons/`
2. Make sure each SVG file is correctly named (e.g., `cloudy.svg`, `rain.svg`)
3. Check your browser console for errors
4. Try clearing your browser cache

### Error Loading Weather Data

If you see an error message:
1. Check that your latitude and longitude values are valid
2. Verify your Home Assistant has internet access
3. The Met.no API might be temporarily unavailable or have changed
4. Check browser console for detailed error messages

## Development

This card is built using:
- LitElement
- TypeScript
- D3.js for data visualization
- Rollup for bundling

To build locally:
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Download weather icons
npm run download-icons
```

## Credits

- Weather data provided by [The Norwegian Meteorological Institute](https://met.no/)
- Weather icons from [Met.no Weather Icons](https://github.com/metno/weathericons)
