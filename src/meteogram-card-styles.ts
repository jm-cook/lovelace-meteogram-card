import { css } from "lit";

export const meteogramCardStyles = css`
    :host {
        display: block;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
    }

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

    .card-header {
        padding: 16px 16px 0 16px;
        font-size: 1.25em;
        font-weight: 500;
        line-height: 1.2;
        color: var(--primary-text-color, #222);
    }

    .card-content {
        position: relative;
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        padding: 0 16px 16px 16px;
        box-sizing: border-box;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
    }

    #chart {
        width: 100%;
        height: 100%;
        min-height: 180px;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
    }

    .error {
        color: var(--error-color, #b71c1c);
        padding: 16px;
    }

    .temp-line {
        stroke-width: 3;
        fill: none;
    }
    
    .pressure-line {
        /* Uses theme variable, fallback is blue for debug */
        stroke: var(--meteogram-pressure-line-color, blue);
        stroke-width: 4;
        stroke-dasharray: 3, 3;
        fill: none;
    }
    :host([dark]) .pressure-line {
        stroke: var(--meteogram-pressure-line-color, #90caf9);
    }

    .rain-bar {
        fill: var(--meteogram-rain-bar-color, deepskyblue);
        opacity: 0.8;
    }
    :host([dark]) .rain-bar {
        fill: var(--meteogram-rain-bar-color, deepskyblue);
    }

    .rain-max-bar {
        fill: var(--meteogram-rain-max-bar-color, #7fdbff);
        opacity: 0.5;
    }
    :host([dark]) .rain-max-bar {
        fill: var(--meteogram-rain-max-bar-color, #7fdbff);
    }

    .rain-label {
        font: var(--meteogram-label-font-size, 0.875rem) sans-serif;
        text-anchor: middle;
        font-weight: bold;
        fill: var(--meteogram-rain-label-color, #0058a3);
    }
    :host([dark]) .rain-label {
        fill: var(--meteogram-rain-label-color, #a3d8ff);
    }

    .rain-max-label {
        font: var(--meteogram-label-font-size, 0.875rem) sans-serif;
        text-anchor: middle;
        font-weight: bold;
        fill: var(--meteogram-rain-max-bar-color, #2693e6);
    }
    :host([dark]) .rain-max-label {
        fill: var(--meteogram-rain-max-bar-color, #2693e6);
    }

    .legend {
        font: var(--meteogram-legend-font-size) sans-serif;
        fill: var(--primary-text-color, #222);
    }
    :host([dark]) .legend {
        fill: var(--primary-text-color, #fff);
    }

    .legend-temp {
        fill: var(--meteogram-temp-line-color, orange);
    }
    :host([dark]) .legend-temp {
        fill: var(--meteogram-temp-line-color, orange);
    }

    .legend-pressure {
        fill: var(--meteogram-pressure-line-color, #90caf9);
    }
    :host([dark]) .legend-pressure {
        fill: var(--meteogram-pressure-line-color, #90caf9);
    }

    .legend-rain {
        fill: var(--meteogram-rain-bar-color, deepskyblue);
    }
    :host([dark]) .legend-rain {
        fill: var(--meteogram-rain-bar-color, deepskyblue);
    }

    .legend-cloud {
        fill: var(--meteogram-cloud-color, #b0bec5);
    }
    :host([dark]) .legend-cloud {
        fill: var(--meteogram-cloud-color, #eceff1);
    }
    .wind-barb {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
        stroke-width: 2;
        fill: none;
    }
    :host([dark]) .wind-barb {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
    }

    .wind-barb-feather {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
        stroke-width: 2;
    }
    :host([dark]) .wind-barb-feather {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
    }

    .wind-barb-half {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
        stroke-width: 2;
    }
    :host([dark]) .wind-barb-half {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
    }

    .wind-barb-calm {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
        fill: none;
    }
    :host([dark]) .wind-barb-calm {
        stroke: var(--meteogram-wind-barb-color, #1976d2);
    }

    .wind-barb-dot {
        fill: var(--meteogram-wind-barb-color, #1976d2);
    }
    :host([dark]) .wind-barb-dot {
        fill: var(--meteogram-wind-barb-color, #1976d2);
    }

    .top-date-label {
        font: var(--meteogram-label-font-size, 16px) sans-serif;
        fill: var(--primary-text-color, #222);
        font-weight: bold;
        dominant-baseline: hanging;
    }
    :host([dark]) .top-date-label {
        fill: var(--primary-text-color, #fff);
    }

    .bottom-hour-label {
        font: var(--meteogram-label-font-size, 0.875rem) sans-serif;
        fill: var(--meteogram-timescale-color, #ffb300);
    }
    :host([dark]) .bottom-hour-label {
        fill: var(--meteogram-timescale-color, #ffd54f);
    }

    .day-bg {
        fill: transparent !important;
        opacity: 0;
        pointer-events: none;
    }

    .wind-band-bg {
        fill: transparent;
    }

    /* .attribution is not used, move its styles to .attribution-icon-wrapper for correct layout */
    .attribution-icon-wrapper {
        position: absolute;
        top: 12px;
        right: 24px;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 32px;
        width: 32px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        text-align: right;
        background: rgba(255, 255, 255, 0.7);
        padding: 2px 8px;
        border-radius: 6px;
        pointer-events: auto;
    }
    :host([dark]) .attribution-icon-wrapper {
        background: transparent;
    }

    /* Tick text font size for axes */

    .temperature-axis .tick text,
    .pressure-axis .tick text {
        font-size: var(--meteogram-tick-font-size);
        fill: var(--primary-text-color, #222);
    }

    .cloud-area {
        fill: var(--meteogram-cloud-color, #b0bec5);
        opacity: 0.42;
    }
    :host([dark]) .cloud-area {
        fill: var(--meteogram-cloud-color, #eceff1);
        opacity: 0.55;
    }

    .axis-label {
        font: var(--meteogram-label-font-size, 14px) sans-serif;
        fill: var(--meteogram-axis-label-color, #000);
    }
    :host([dark]) .axis-label {
        fill: var(--meteogram-axis-label-color, #fff);
    }

    .grid line,
    .xgrid line,
    .wind-band-grid,
    .twentyfourh-line,
    .twentyfourh-line-wind,
    .day-tic,
    .temperature-axis path,
    .pressure-axis path,
    .wind-band-outline {
        stroke: var(--meteogram-grid-color, #b8c4d9);
    }
    :host([dark]) .grid line,
    :host([dark]) .xgrid line,
    :host([dark]) .wind-band-grid,
    :host([dark]) .twentyfourh-line,
    :host([dark]) .twentyfourh-line-wind,
    :host([dark]) .day-tic,
    :host([dark]) .temperature-axis path,
    :host([dark]) .pressure-axis path,
    :host([dark]) .wind-band-outline {
        stroke: var(--meteogram-grid-color, #444);
    }
    .wind-band-grid {
        stroke-width: 1;
    }
    .twentyfourh-line, .day-tic {
        stroke-width: 3;
        stroke-dasharray: 6, 5;
        opacity: 0.7;
    }
    .twentyfourh-line-wind {
        stroke-width: 2.5;
        stroke-dasharray: 6, 5;
        opacity: 0.5;
    }


    .attribution-icon-wrapper {
        position: absolute;
        top: 12px;
        right: 24px;
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 32px;
        width: 32px;
    }
    .attribution-icon {
        cursor: pointer;
        position: relative;
        display: inline-block;
        outline: none;
    }
    .attribution-tooltip {
        display: none;
        position: absolute;
        top: 120%;
        right: 0;
        background: rgba(255,255,255,0.98);
        color: #222;
        border: 1px solid #bbb;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        padding: 8px 12px;
        min-width: 220px;
        max-width: 340px;
        font-size: 0.97em;
        z-index: 10;
        white-space: normal;
        pointer-events: none;
    }
    .attribution-icon:focus .attribution-tooltip,
    .attribution-icon:hover .attribution-tooltip,
    .attribution-tooltip.open {
        display: block;
        pointer-events: auto;
    }
`;
