# Home Assistant Meteogram Card

A custom Home Assistant Lovelace card that displays a compact meteogram (temperature, rainfall, wind barbs, etc.) for the next 48 hours, powered by D3.js.

## Features

- 48-hour meteogram with temperature, rainfall, wind, clouds, etc.
- Blue wind barbs, day shading, rainfall labels.
- Highly configurable location (`lat`, `lon`).
- Responsive, works in dashboards.

## Installation

1. **Clone or download this repo.**
2. **Build the card:**
   ```bash
   npm install
   npm run build
   ```
3. **Copy `dist/meteogram-card.js` to your Home Assistant `/config/www/` folder.**
4. **Add to Lovelace Resources:**
   - Go to Settings → Dashboards → Resources in Home Assistant UI.
   - Add `/local/meteogram-card.js` as a JavaScript module.

## Usage

Add this to your Lovelace dashboard:

```yaml
type: custom:meteogram-card
title: "London Meteogram"
lat: 51.5074
lon: -0.1278
```

## Development

- Card source: `src/meteogram-card.ts`
- Build/bundle: `npm run build` (uses Rollup)
- Example config: `example/example_config.yaml`

## Screenshot

*(Insert screenshot here once your chart is working!)*

## License

MIT
