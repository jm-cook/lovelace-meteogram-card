import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * MeteogramCard: Custom Home Assistant Card for 48h meteogram
 * To use: add meteogram-card.js as a Lovelace resource and add type: "custom:meteogram-card" to your dashboard
 */

@customElement("meteogram-card")
export class MeteogramCard extends LitElement {

  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 8px;
      box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0,0,0,0.1));
      padding: 0;
    }
    #chart {
      width: 100%;
      height: 350px;
      min-height: 300px;
    }
    .header {
      font-weight: bold;
      padding: 16px 16px 0 16px;
      font-size: 1.2em;
    }
    .config-row {
      padding: 0 16px 8px 16px;
      color: #444;
      font-size: 0.93em;
    }
  `;

  @property({ type: Object }) hass: any;
  @property({ type: Object }) config: any = {};

  @state() private chartLoaded = false;
  @state() private lat = 51.5074;
  @state() private lon = -0.1278;
  @state() private meteogramError = "";

  setConfig(config: any) {
    this.config = config;
    this.lat = config.lat ?? 51.5074;
    this.lon = config.lon ?? -0.1278;
  }

  render() {
    return html`
      <div class="header">${this.config.title ?? "Meteogram"}</div>
      <div class="config-row">Location: ${this.lat}, ${this.lon}</div>
      <div id="chart"></div>
      ${this.meteogramError
        ? html`<div style="color:red;padding:8px;">${this.meteogramError}</div>`
        : ""}
    `;
  }

  firstUpdated() {
    this.loadD3AndDraw();
  }

  updated(changedProps: PropertyValues) {
    if (changedProps.has("lat") || changedProps.has("lon")) {
      this.loadD3AndDraw();
    }
  }

  async loadD3AndDraw() {
    if (!(window as any).d3) {
      // Load D3 only once
      const script = document.createElement("script");
      script.src = "https://d3js.org/d3.v7.min.js";
      script.onload = () => this.drawMeteogram();
      script.onerror = () => (this.meteogramError = "Failed to load D3.js");
      document.head.appendChild(script);
    } else {
      this.drawMeteogram();
    }
  }

  async drawMeteogram() {
    this.meteogramError = "";
    const d3 = (window as any).d3;
    if (!d3) return;

    const chartDiv = this.renderRoot.querySelector("#chart");
    chartDiv.innerHTML = "";
    const width = chartDiv.offsetWidth || 650;
    const height = chartDiv.offsetHeight || 350;

    // Create SVG
    const svg = d3.select(chartDiv)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Fetch data from met.no as in your D3 example
    const apiUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${this.lat}&lon=${this.lon}`;
    let data;
    try {
      const res = await fetch(apiUrl, {
        headers: { 'User-Agent': 'home-assistant-meteogram-card' }
      });
      data = await res.json();
    } catch (e) {
      this.meteogramError = "Failed to fetch weather data.";
      return;
    }

    // ... You can insert your D3 meteogram drawing code here,
    // using svg, width, height, and the data object ...
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .attr("font-size", "22px")
      .text("Meteogram chart goes here");

    // TODO: Paste your D3 meteogram code here from your HTML prototype!
  }
}

// Home Assistant requires this for custom cards
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "meteogram-card",
  name: "Meteogram Card",
  description: "A custom card showing a 48-hour meteogram with wind barbs."
});
