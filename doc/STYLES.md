# Meteogram Card CSS Styles

This document describes the CSS styles used in the Meteogram Card, including how dark mode is handled.

---

## Card Container

- `:host`  
  Ensures the card fills its container and is responsive.  
  All CSS variables for chart colors and font sizes are defined here, including dark mode variants.
  ```css
  :host {
      --meteogram-grid-color: #b8c4d9;
      --meteogram-grid-color-dark: #b8c4d9;
      --meteogram-temp-line-color: orange;
      --meteogram-temp-line-color-dark: orange;
      --meteogram-pressure-line-color: #90caf9;
      --meteogram-pressure-line-color-dark: #90caf9;
      --meteogram-rain-bar-color: deepskyblue;
      --meteogram-rain-bar-color-dark: deepskyblue;
      --meteogram-rain-max-bar-color: #7fdbff;
      --meteogram-rain-max-bar-color-dark: #7fdbff;
      --meteogram-rain-label-color: #0058a3;
      --meteogram-rain-label-color-dark: #a3d8ff;
      --meteogram-rain-max-label-color: #2693e6;
      --meteogram-rain-max-label-color-dark: #2693e6;
      --meteogram-cloud-color: #b0bec5;
      --meteogram-cloud-color-dark: #eceff1;
      --meteogram-wind-barb-color: #1976d2;
      --meteogram-wind-barb-color-dark: #1976d2;
      --meteogram-snow-bar-color: #b3e6ff;
      --meteogram-snow-bar-color-dark: #b3e6ff;
      --meteogram-label-font-size: 13px;
      --meteogram-legend-font-size: 14px;
      --meteogram-tick-font-size: 13px;
      --meteogram-axis-label-color: #000;
      --meteogram-axis-label-color-dark: #fff;
      --meteogram-timescale-color: #ffb300;
      --meteogram-timescale-color-dark: #ffd54f;
      display: block;
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      max-width: 100%;
      max-height: 100%;
  }
  ```

- All chart element rules now reference only the variable, without fallback values in the rule itself.

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
- `.cloud-area`  
  Cloud cover fill color:  
  `--meteogram-cloud-color` (light), `--meteogram-cloud-color-dark` (dark)
- `.snow-bar`  
  Snow bar color:  
  `--meteogram-snow-bar-color` (light), `--meteogram-snow-bar-color-dark` (dark)
- `.legend`  
  Legend text color:  
  `--primary-text-color` (light and dark mode)
- `.legend-cloud`  
  Cloud legend color:  
  `--meteogram-cloud-color` (light), `--meteogram-cloud-color-dark` (dark)
- `.legend-temp`  
  Temperature legend color:  
  `--meteogram-temp-line-color` (light), `--meteogram-temp-line-color-dark` (dark)
- `.legend-pressure`  
  Pressure legend color:  
  `--meteogram-pressure-line-color` (light), `--meteogram-pressure-line-color-dark` (dark)
- `.legend-rain`  
  Rain legend color:  
  `--meteogram-rain-bar-color` (light), `--meteogram-rain-bar-color-dark` (dark)
- `.legend-rain-max`  
  Max rain legend color:  
  `--meteogram-rain-max-bar-color` (light), `--meteogram-rain-max-bar-color-dark` (dark)
- `.legend-snow`  
  Snow legend color:  
  (fixed color: `#b3e6ff`)
- `.wind-barb`, `.wind-barb-feather`, `.wind-barb-half`, `.wind-barb-calm`, `.wind-barb-dot`  
  Wind barb color:  
  `--meteogram-wind-barb-color` (light mode), `--meteogram-wind-barb-color-dark` (dark mode)
- `.wind-band-bg`  
  Wind band background:  
  (transparent, not themeable)
- `.wind-band-outline`  
  Wind band border:  
  `--meteogram-grid-color` (light), `--meteogram-grid-color-dark` (dark)
- `.day-bg`  
  Day background shading:  
  (transparent, not themeable)
- `.twentyfourh-line`, `.twentyfourh-line-wind`, `.day-tic`, `.grid line`, `.xgrid line`, `.temperature-axis path`, `.pressure-axis path`  
  Grid and border lines:  
  `--meteogram-grid-color` (light), `--meteogram-grid-color-dark` (dark)
- `.axis-label`  
  Axis label text color:  
  `--meteogram-axis-label-color` (light), `--meteogram-axis-label-color-dark` (dark)
- `.temperature-axis .tick text`, `.pressure-axis .tick text`  
  Axis tick text color:  
  `--primary-text-color` (light and dark mode)
- `.bottom-hour-label`  
  Timescale label color:  
  `--meteogram-timescale-color` (light mode), `--meteogram-timescale-color-dark` (dark mode)

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
      fill: var(--meteogram-cloud-color);
      opacity: 0.42;
  }
  :host([dark]) .cloud-area {
      fill: var(--meteogram-cloud-color-dark);
      opacity: 0.55;
  }
  ```

- Wind barb color:
  ```css
  .wind-barb { stroke: var(--meteogram-wind-barb-color); }
  :host([dark]) .wind-barb { stroke: var(--meteogram-wind-barb-color-dark); }
  ```

- Grid color:
  ```css
  .grid line { stroke: var(--meteogram-grid-color); }
  :host([dark]) .grid line { stroke: var(--meteogram-grid-color-dark); }
  ```
  *You can override `--meteogram-grid-color` for light mode and `--meteogram-grid-color-dark` for dark mode. Default is a slightly darker grey.*

- Rain label color:
  ```css
  .rain-label { fill: var(--meteogram-rain-label-color); }
  :host([dark]) .rain-label { fill: var(--meteogram-rain-label-color-dark); filter: drop-shadow(0 0 2px #fff); }
  ```

- Axis label color:
  ```css
  .axis-label {
      fill: var(--meteogram-axis-label-color);
  }
  :host([dark]) .axis-label {
      fill: var(--meteogram-axis-label-color-dark);
  }
  ```

- Timescale label color:
  ```css
  .bottom-hour-label { fill: var(--meteogram-timescale-color); }
  :host([dark]) .bottom-hour-label { fill: var(--meteogram-timescale-color-dark); }
  ```

- Snow bar color:
  ```css
  .snow-bar {
      fill: var(--meteogram-snow-bar-color);
      opacity: 0.8;
  }
  :host([dark]) .snow-bar {
      fill: var(--meteogram-snow-bar-color-dark);
      opacity: 0.9;
  }
  ```

---

## Theme Variables

The card uses Home Assistant theme variables where possible:
- `--card-background-color`
- `--primary-text-color`
- `--secondary-text-color`
- `--error-color`
- `--divider-color`
- Custom variables for chart elements (all defined in `:host`):
  - `--meteogram-cloud-color`, `--meteogram-cloud-color-dark`
  - `--meteogram-grid-color`, `--meteogram-grid-color-dark`
  - `--meteogram-label-font-size`
  - `--meteogram-legend-font-size`
  - `--meteogram-tick-font-size`
  - `--meteogram-rain-bar-color`, `--meteogram-rain-bar-color-dark`
  - `--meteogram-rain-max-bar-color`, `--meteogram-rain-max-bar-color-dark`
  - `--meteogram-temp-line-color`, `--meteogram-temp-line-color-dark`
  - `--meteogram-pressure-line-color`, `--meteogram-pressure-line-color-dark`
  - `--meteogram-wind-barb-color`, `--meteogram-wind-barb-color-dark`
  - `--meteogram-rain-label-color`, `--meteogram-rain-label-color-dark`
  - `--meteogram-rain-max-label-color`, `--meteogram-rain-max-label-color-dark`
  - `--meteogram-axis-label-color`, `--meteogram-axis-label-color-dark`
  - `--meteogram-timescale-color`, `--meteogram-timescale-color-dark`
  - `--meteogram-snow-bar-color`, `--meteogram-snow-bar-color-dark`
  - `--primary-text-color` (legend and axis tick text color, light and dark)

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

### Example: Custom rain bar, line, wind barb, cloud, and timescale colors

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
  --meteogram-cloud-color: "gray"
  --meteogram-cloud-color-dark: "white"
  --meteogram-timescale-color: "purple"
  --meteogram-timescale-color-dark: "orange"
```

### Example: Custom snow bar color

```yaml
type: custom:meteogram-card
styles:
  --meteogram-snow-bar-color: "lightblue"
  --meteogram-snow-bar-color-dark: "white"
```
