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
  Orange temperature line.
- `.pressure-line`  
  Blue dashed pressure line.
- `.rain-bar`, `.rain-min-bar`, `.rain-max-bar`  
  Various blue shades for rain bars.
- `.snow-bar`  
  Light blue for snow.
- `.cloud-area`  
  Shaded area for cloud cover.

## Grid and Axes

- `.grid`, `.xgrid`, `.wind-band-grid`  
  Grid lines, color adapts to theme.
- `.axis-label`, `.legend`  
  Axis and legend text.

## Wind Barbs

- `.wind-barb`, `.wind-barb-feather`, `.wind-barb-half`, `.wind-barb-calm`, `.wind-barb-dot`  
  Blue wind barb lines and dots.

## Labels

- `.top-date-label`, `.bottom-hour-label`, `.rain-label`, `.rain-max-label`, `.rain-min-label`  
  Various font sizes and colors for date, hour, and precipitation labels.

## Attribution

- `.attribution`  
  Attribution box at the top right, with background and rounded corners.

---

## Dark Mode Support

Dark mode is detected by:
- Home Assistant's `hass.themes.darkMode` property.
- Fallback: `.dark-theme` class on `<html>` or `<body>`.

When dark mode is active, the card sets the `dark` attribute on the host element.  
Styles for dark mode use the selector `:host([dark]) ...`.

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
  .grid line { stroke: var(--meteogram-grid-color, #90caf9); }
  :host([dark]) .grid line { stroke: var(--meteogram-grid-color-dark, #3a4a5a); }
  ```
  *You can override `--meteogram-grid-color` for light mode and `--meteogram-grid-color-dark` for dark mode.*

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

---

## Customization

You can override these CSS variables in your Home Assistant theme for further customization.

### Font Size Example

```yaml
type: custom:meteogram-card
styles:
  --meteogram-label-font-size: "18px"
  --meteogram-legend-font-size: "16px"
```
