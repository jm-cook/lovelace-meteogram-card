# Meteogram Card for Home Assistant

A custom card that displays a detailed 48-hour meteogram with temperature, precipitation, cloud cover, and wind barbs.

## Installation

### HACS (Home Assistant Community Store)

1. Add this repository to HACS as a custom repository
2. Install the "Meteogram Card" from HACS
3. Download the weather icons:
   ```bash
   cd ~/homeassistant/www
   mkdir -p ha-meteogram-card/icons
   cd ha-meteogram-card
   # Download icons using the provided script or manually
   ```

### Manual Installation

1. Download the latest release from the repository
2. Copy `meteogram-card.js` to your `<config>/www/` folder
3. Download the weather icons:
   ```bash
   cd ~/homeassistant/www
   mkdir -p ha-meteogram-card/icons
   ```
4. Run the icon download script:
   ```bash
   node scripts/download-icons.cjs
   ```
5. Add the following to your Lovelace resources:
   ```yaml
   resources:
     - url: /local/ha-meteogram-card/meteogram-card.js
       type: module
   ```

## Icon Setup

The card requires weather icons to display properly. You have two options:

### Option 1: Use the Download Script
Run the provided script to automatically download all required icons:

```bash
node scripts/download-icons.cjs
```

### Option 2: Manual Download
1. Create a directory structure: `<config>/www/ha-meteogram-card/icons/`
2. Download all icons from the [Met.no weathericons repository](https://github.com/metno/weathericons/tree/main/weather/svg) into this directory

### Note About Weather Symbols
The Met.no API has some symbol names with typos (extra "s" after "light" in some symbols):
- `lightssleetshowersandthunder_*` (instead of `lightsleetshowersandthunder_*`)
- `lightssnowshowersandthunder_*` (instead of `lightsnowshowersandthunder_*`)

The download script handles these typos automatically, downloading the typo versions but saving them with the corrected names.

## Configuration

Add the card to your dashboard:

```yaml
type: custom:meteogram-card
title: Weather Forecast
latitude: 51.5074
longitude: -0.1278
```

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| title | string | optional | Card title |
| latitude | number | required | Latitude for weather forecast |
| longitude | number | required | Longitude for weather forecast |

## Troubleshooting

If icons are not displaying, make sure:
1. The icons are correctly placed in `/local/ha-meteogram-card/icons/`
2. Home Assistant has proper permissions to read these files
3. You've refreshed your browser cache
4. The download script has handled both correct names and typo versions of the weather symbols
