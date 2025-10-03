/**
 * Meteogram Card with Weather Header - Integration Example
 * 
 * This file shows how to integrate the weather header component
 * into your existing meteogram card.
 */

import { html, nothing } from "lit";
import "./meteogram-weather-header";
import { getWeatherHeaderBackground, isDaytimeNow } from "./weather-header-images";
// import { getCartoonWeatherBackground } from "./cartoon-weather-svgs"; // Parked for future use

// Example of how to modify your existing MeteogramCard class to include a header

/**
 * Add this property to your MeteogramCardConfig interface in types.ts
 */
interface WeatherHeaderConfig {
  show_weather_header?: boolean;
  header_height?: string;
  weather_entity?: string; // Optional: use different weather entity for header
}

/**
 * Add these methods to your existing MeteogramCard class
 */
export class MeteogramCardHeaderMethods {
  
  /**
   * Render weather header if enabled
   * Add this to your main render() method
   */
  protected renderWeatherHeader() {
    const config = (this as any).config;
    if (!config?.show_weather_header) return nothing;
    
    const weatherEntity = this._getWeatherEntityForHeader();
    if (!weatherEntity) return nothing;

    return html`
      <meteogram-weather-header
        .weatherEntity=${weatherEntity}
        .showHeader=${true}
        .headerHeight=${config.header_height || "200px"}
      ></meteogram-weather-header>
    `;
  }

  /**
   * Alternative: Render header using built-in styles (no custom component)
   */
  protected renderInlineWeatherHeader() {
    const config = (this as any).config;
    if (!config?.show_weather_header) return nothing;
    
    const weatherEntity = this._getWeatherEntityForHeader();
    if (!weatherEntity) return nothing;

    const condition = weatherEntity.state || "partlycloudy";
    const isDaytime = isDaytimeNow(weatherEntity);
    const backgroundStyle = getWeatherHeaderBackground(condition, isDaytime);
    
    // Cartoon style option - parked for future use
    // const useCartoonStyle = config.cartoon_weather_style || false;
    // const backgroundStyle = useCartoonStyle 
    //   ? getCartoonWeatherBackground(condition)
    //   : getWeatherHeaderBackground(condition, isDaytime);
    
    const temperature = this._getHeaderTemperature(weatherEntity);
    const details = this._getHeaderDetails(weatherEntity);

    return html`
      <div class="meteogram-weather-header" style="background: ${backgroundStyle};">
        <div class="weather-header-overlay">
          <div class="weather-main">
            <div class="weather-condition">${weatherEntity.state || "Unknown"}</div>
            <div class="weather-temperature">${temperature}</div>
          </div>
          <div class="weather-details">
            ${details.map(detail => html`<div class="weather-detail">${detail}</div>`)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get weather entity for header (could be different from meteogram data source)
   */
  private _getWeatherEntityForHeader() {
    const hass = (this as any).hass;
    const config = (this as any).config;
    
    // Use specific header weather entity if configured
    if (config.weather_entity && hass?.states[config.weather_entity]) {
      return hass.states[config.weather_entity];
    }
    
    // Fall back to meteogram weather entity
    const weatherEntityId = (this as any).weatherEntityId;
    if (weatherEntityId && hass?.states[weatherEntityId]) {
      return hass.states[weatherEntityId];
    }
    
    return null;
  }

  /**
   * Format temperature for header display
   */
  private _getHeaderTemperature(weatherEntity: any): string {
    const temp = weatherEntity.attributes?.temperature;
    if (temp === undefined || temp === null) return "—";
    
    const unit = weatherEntity.attributes?.temperature_unit || "°C";
    return `${Math.round(temp)}${unit}`;
  }

  /**
   * Get weather details for header
   */
  private _getHeaderDetails(weatherEntity: any): string[] {
    const details = [];
    const attrs = weatherEntity.attributes;
    
    if (attrs?.humidity !== undefined) {
      details.push(`${attrs.humidity}%`);
    }
    
    if (attrs?.pressure !== undefined) {
      const unit = attrs.pressure_unit || "hPa";
      details.push(`${Math.round(attrs.pressure)} ${unit}`);
    }
    
    if (attrs?.wind_speed !== undefined) {
      const unit = attrs.wind_speed_unit || "km/h";
      details.push(`${Math.round(attrs.wind_speed)} ${unit}`);
    }
    
    return details.slice(0, 3);
  }
}

/**
 * Add these CSS styles to your meteogram-card-styles.ts file
 */
export const weatherHeaderStyles = `
  .meteogram-weather-header {
    position: relative;
    width: 100%;
    height: var(--header-height, 200px);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
    display: flex;
    align-items: flex-end;
    padding: 20px;
    box-sizing: border-box;
    color: white;
    overflow: hidden;
  }

  .weather-header-overlay {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.3) 70%,
      rgba(0, 0, 0, 0.6) 100%
    );
    padding: 20px;
    margin: -20px;
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

  /* When header is present, adjust chart container */
  .meteogram-weather-header + .meteogram-chart-container {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

/**
 * Integration Steps:
 * 
 * 1. Add weather header properties to your MeteogramCardConfig interface
 * 2. Add the renderWeatherHeader() or renderInlineWeatherHeader() method to your MeteogramCard class
 * 3. Call it in your main render() method before the chart
 * 4. Add the CSS styles to your meteogram-card-styles.ts
 * 5. Add configuration options to your card editor
 * 
 * Example render method modification:
 * 
 * render() {
 *   return html`
 *     <ha-card>
 *       ${this.renderWeatherHeader()}
 *       <div class="meteogram-chart-container">
 *         <!-- existing chart content -->
 *       </div>
 *     </ha-card>
 *   `;
 * }
 */