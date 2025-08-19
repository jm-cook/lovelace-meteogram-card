# Meteogram Card CSS Styles

This document describes the CSS styles used in the Meteogram Card, including how dark mode is handled.

---

## Card Container

- `:host`  
  Ensures the card fills its container and is responsive.
  ```css
  :host {
      display: block;
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      max-width: 100%;
      max-height: 100%;
  }
  ```

- `ha-card`  
  Main card styling, background and text color use Home Assistant theme variables.
  ```css
  ha-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #222);
  }
  ```

## Header and Content

- `.card-header`  
  Title styling.
- `.card-content`  
  Layout and padding for the main content.

## Chart Area

- `#chart`  
  Container for the D3 SVG chart.

## Error Display

- `.error`  
  Red text for error messages.

## Chart Elements

- `.temp-line`  
  Temperature line color:  
  `--meteogram-temp-line-color` (light), `--meteogram-temp-line-color-dark` (dark)
- `.pressure-line`  
  Pressure line color:  
  `--meteogram-pressure-line-color` (light), `--meteogram-pressure-line-color-dark` (dark)
- `.rain-bar`  
  Rain bar color:  
  `--meteogram-rain-bar-color` (light), `--meteogram-rain-bar-color-dark` (dark)
- `.rain-max-bar`  
  Max rain bar color:  
  `--meteogram-rain-max-bar-color` (light), `--meteogram-rain-max-bar-color-dark` (dark)
- `.rain-label`  
  Rain label text color:  
  `--meteogram-rain-label-color` (light), `--meteogram-rain-label-color-dark` (dark)
- `.rain-max-label`  
  Max rain label text color:  
  `--meteogram-rain-max-label-color` (light), `--meteogram-rain-max-label-color-dark` (dark)
- `.legend`  
  Legend text color:  
  `--primary-text-color` (light and dark mode)
- `.wind-barb`, `.wind-barb-feather`, `.wind-barb-half`, `.wind-barb-calm`, `.wind-barb-dot`  
  Wind barb color:  
  `--meteogram-wind-barb-color` (light mode), `--meteogram-wind-barb-color-dark` (dark mode)

---

## Dark Mode Support

Dark mode is detected by:
- Home Assistant's `hass.themes.darkMode` property.
- Fallback: `.dark-theme` class on `<html>` or `<body>`.

When dark mode is active, the card sets the `dark` attribute on the host element.  
Styles for dark mode use the selector `:host([dark]) ...`.

If a `-dark` CSS variable is not set, the card will automatically fall back to the corresponding non-dark variable.

### Examples

- Cloud area fill:
  ```css
  .cloud-area {
      fill: var(--meteogram-cloud-color, #b0bec5);
      opacity: 0.42;
  }
  :host([dark]) .cloud-area {
      fill: var(--meteogram-cloud-color-dark, #eceff1);
      opacity: 0.55;
  }
  ```

- Wind barb color:
  ```css
  .wind-barb { stroke: #1976d2; }
  :host([dark]) .wind-barb { stroke: #fff; }
  ```

- Grid color:
  ```css
  .grid line { stroke: var(--meteogram-grid-color, #e0e0e0); }
  :host([dark]) .grid line { stroke: var(--meteogram-grid-color-dark, var(--meteogram-grid-color, #e0e0e0)); }
  ```
  *You can override `--meteogram-grid-color` for light mode and `--meteogram-grid-color-dark` for dark mode. Default is a light grey.*

- Rain label color:
  ```css
  .rain-label { fill: #0058a3; }
  :host([dark]) .rain-label { fill: #a3d8ff; filter: drop-shadow(0 0 2px #fff); }
  ```

---

## Theme Variables

The card uses Home Assistant theme variables where possible:
- `--card-background-color`
- `--primary-text-color`
- `--secondary-text-color`
- `--error-color`
- `--divider-color`
- Custom variables for chart elements (e.g. `--meteogram-cloud-color`, `--meteogram-grid-color`, `--meteogram-grid-color-dark`).
- `--meteogram-label-font-size` (font size for axis labels, date/hour/rain labels, default: 14px/16px/13px)
- `--meteogram-legend-font-size` (font size for legend text, default: 14px)
- `--meteogram-tick-font-size` (font size for y axis tick text, default: 13px)
- `--meteogram-rain-bar-color` (rain bar color, light)
- `--meteogram-rain-bar-color-dark` (rain bar color, dark)
- `--meteogram-rain-max-bar-color` (max rain bar color, light)
- `--meteogram-rain-max-bar-color-dark` (max rain bar color, dark)
- `--meteogram-temp-line-color` (temperature line color, light)
- `--meteogram-temp-line-color-dark` (temperature line color, dark)
- `--meteogram-pressure-line-color` (pressure line color, light)
- `--meteogram-pressure-line-color-dark` (pressure line color, dark)
- `--meteogram-wind-barb-color` (wind barb color, light mode)
- `--meteogram-wind-barb-color-dark` (wind barb color, dark mode)
- `--meteogram-rain-label-color` (rain label text color, light)
- `--meteogram-rain-label-color-dark` (rain label text color, dark)
- `--meteogram-rain-max-label-color` (max rain label text color, light)
- `--meteogram-rain-max-label-color-dark` (max rain label text color, dark)
- `--primary-text-color` (legend text color, light and dark)

---

## Customization

You can override these CSS variables in your Home Assistant theme for further customization.

### Font Size Example

```yaml
type: custom:meteogram-card
styles:
  --meteogram-label-font-size: "18px"
  --meteogram-legend-font-size: "16px"
  --meteogram-tick-font-size: "15px"
```

### Example: Custom rain bar, line, and wind barb colors

```yaml
type: custom:meteogram-card
styles:
  --meteogram-rain-bar-color: "hotpink"
  --meteogram-rain-bar-color-dark: "lime"
  --meteogram-rain-max-bar-color: "gold"
  --meteogram-rain-max-bar-color-dark: "aqua"
  --meteogram-temp-line-color: "rebeccapurple"
  --meteogram-temp-line-color-dark: "orange"
  --meteogram-pressure-line-color: "deepskyblue"
  --meteogram-pressure-line-color-dark: "magenta"
  --meteogram-wind-barb-color: "black"
  --meteogram-wind-barb-color-dark: "yellow"
  --meteogram-rain-label-color: "crimson"
  --meteogram-rain-label-color-dark: "chartreuse"
  --meteogram-rain-max-label-color: "navy"
  --meteogram-rain-max-label-color-dark: "fuchsia"
```
