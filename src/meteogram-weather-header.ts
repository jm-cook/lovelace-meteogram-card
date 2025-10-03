/**
 * Weather Header Component
 * 
 * Example implementation of weather header with background imagery
 * for the meteogram card.
 */

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getWeatherHeaderBackground, isDaytimeNow } from "./weather-header-images";

@customElement('meteogram-weather-header')
export class MeteogramWeatherHeader extends LitElement {
  @property({ type: Object }) weatherEntity?: any;
  @property({ type: Boolean }) showHeader = true;
  @property({ type: String }) headerHeight = "200px";
  
  @state() private _isDay = true;

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .weather-header {
      position: relative;
      width: 100%;
      height: var(--header-height, 200px);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 20px;
      box-sizing: border-box;
      color: white;
      overflow: hidden;
    }

    .weather-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0.3) 70%,
        rgba(0, 0, 0, 0.6) 100%
      );
      pointer-events: none;
    }

    .weather-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
    }

    .weather-main {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .weather-condition {
      font-size: 1.2em;
      font-weight: 500;
      opacity: 0.9;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px 12px;
      border-radius: 20px;
      width: fit-content;
    }

    .weather-temperature {
      font-size: 3em;
      font-weight: bold;
      line-height: 1;
      background: rgba(0, 0, 0, 0.3);
      padding: 8px 16px;
      border-radius: 25px;
      width: fit-content;
    }

    .weather-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: flex-end;
      opacity: 0.9;
    }

    .weather-detail {
      background: rgba(0, 0, 0, 0.35);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.9em;
      white-space: nowrap;
    }

    .hidden {
      display: none;
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      .weather-header {
        padding: 15px;
      }
      
      .weather-temperature {
        font-size: 2.5em;
      }
      
      .weather-condition {
        font-size: 1em;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._updateDayNightState();
    
    // Update day/night state every minute
    setInterval(() => this._updateDayNightState(), 60000);
  }

  private _updateDayNightState() {
    this._isDay = isDaytimeNow(this.weatherEntity);
  }

  private _getTemperature(): string {
    if (!this.weatherEntity) return "—";
    
    const temp = this.weatherEntity.attributes?.temperature;
    if (temp === undefined || temp === null) return "—";
    
    const unit = this.weatherEntity.attributes?.temperature_unit || "°C";
    return `${Math.round(temp)}${unit}`;
  }

  private _getCondition(): string {
    if (!this.weatherEntity) return "Unknown";
    
    // You might want to localize this based on Home Assistant's localization
    return this.weatherEntity.state || "Unknown";
  }

  private _getWeatherDetails(): Array<{ label: string; value: string }> {
    if (!this.weatherEntity?.attributes) return [];
    
    const details = [];
    const attrs = this.weatherEntity.attributes;
    
    if (attrs.humidity !== undefined) {
      details.push({ label: "Humidity", value: `${attrs.humidity}%` });
    }
    
    if (attrs.pressure !== undefined) {
      const unit = attrs.pressure_unit || "hPa";
      details.push({ label: "Pressure", value: `${Math.round(attrs.pressure)} ${unit}` });
    }
    
    if (attrs.wind_speed !== undefined) {
      const unit = attrs.wind_speed_unit || "km/h";
      details.push({ label: "Wind", value: `${Math.round(attrs.wind_speed)} ${unit}` });
    }
    
    return details.slice(0, 3); // Limit to 3 details for clean layout
  }

  render() {
    if (!this.showHeader) return nothing;

    const condition = this.weatherEntity?.state || "partlycloudy";
    const backgroundStyle = getWeatherHeaderBackground(condition, this._isDay);
    
    const details = this._getWeatherDetails();

    return html`
      <div 
        class="weather-header"
        style="--header-height: ${this.headerHeight}; background: ${backgroundStyle};"
      >
        <div class="weather-content">
          <div class="weather-main">
            <div class="weather-condition">${this._getCondition()}</div>
            <div class="weather-temperature">${this._getTemperature()}</div>
          </div>
          
          ${details.length > 0 ? html`
            <div class="weather-details">
              ${details.map(detail => html`
                <div class="weather-detail">${detail.value}</div>
              `)}
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meteogram-weather-header': MeteogramWeatherHeader;
  }
}