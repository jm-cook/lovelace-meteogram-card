import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// Home Assistant expects setConfig for custom cards
// and recommends using ha-card for styling and layout.
// The card should not overflow its grid cell and should be responsive.

@customElement("meteogram-card")
export class MeteogramCard extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: Number }) latitude!: number;
  @property({ type: Number }) longitude!: number;

  @state() private chartLoaded = false;
  @state() private meteogramError = "";

  static styles = [
    css`
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
      }
      .card-header {
        padding: 16px 16px 0 16px;
        font-size: 1.25em;
        font-weight: 500;
        line-height: 1.2;
      }
      .card-content {
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
        max-height: 400px;
        box-sizing: border-box;
        overflow: hidden;
        /* Prevent SVG from overflowing */
        display: flex;
        align-items: stretch;
        justify-content: stretch;
      }
      .error {
        color: var(--error-color, #b71c1c);
        padding: 16px;
      }
      @media (max-width: 600px) {
        .card-header {
          padding: 8px 8px 0 8px;
        }
        .card-content {
          padding: 0 8px 8px 8px;
        }
        #chart {
          min-height: 120px;
          max-height: 220px;
        }
      }
    `
  ];

  setConfig(config: any) {
    if (config.title) this.title = config.title;
    if (config.latitude) this.latitude = config.latitude;
    if (config.longitude) this.longitude = config.longitude;
  }

  // For HA visual editor support
  static getConfigElement() {
    return document.createElement("meteogram-card-editor");
  }

  static getStubConfig() {
    return {
      title: "Weather Forecast",
      latitude: 51.5074,
      longitude: -0.1278
    };
  }

  render() {
    return html`
      <ha-card>
        ${this.title
          ? html`<div class="card-header">${this.title}</div>`
          : ""}
        <div class="card-content">
          ${this.meteogramError
            ? html`<div class="error">${this.meteogramError}</div>`
            : html`<div id="chart"></div>`}
        </div>
      </ha-card>
    `;
  }

  protected firstUpdated(_changedProps: PropertyValues) {
    this.loadD3AndDraw();
  }

  protected updated(_changedProps: PropertyValues) {
    if (this.chartLoaded) {
      this.drawMeteogram();
    }
  }

  async loadD3AndDraw(): Promise<void> {
    if (!(window as any).d3) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load D3.js"));
        document.head.appendChild(script);
      });
    }
    this.chartLoaded = true;
    this.drawMeteogram();
  }

  async drawMeteogram() {
    this.meteogramError = "";
    const d3 = (window as any).d3;
    if (!d3) return;

    const chartDiv = this.renderRoot.querySelector("#chart");
    if (!chartDiv) {
      this.meteogramError = "Chart container not found.";
      return;
    }
    chartDiv.innerHTML = "";

    // Responsive sizing based on parent and grid cell
    const parent = chartDiv.parentElement;
    const gridWidth = parent ? parent.clientWidth : (chartDiv as HTMLElement).offsetWidth || 350;
    const gridHeight = parent ? parent.clientHeight : (chartDiv as HTMLElement).offsetHeight || 180;
    const width = Math.max(Math.min(gridWidth, 800), 220);
    const height = Math.max(Math.min(gridHeight, 400), 120);

    // Fetch and process weather data here (mock for demo)
    const data = this.mockData(width);

    // Remove any previous SVG
    chartDiv.innerHTML = "";

    // Create SVG
    const svg = d3.select(chartDiv)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet");

    // Render meteogram
    this.renderMeteogram(svg, data, width, height);
  }

  renderMeteogram(svg: any, data: any, width: number, height: number) {
    // ...existing meteogram rendering logic...
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 32)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text("Demo Meteogram");
    // ...existing code...
  }

  mockData(width: number) {
    // Return mock data for demo purposes
    return {};
  }
}

// Visual editor stub (minimal, for HA sections view compatibility)
class MeteogramCardEditor extends HTMLElement {
  setConfig(config: any) {}
  get config() { return {}; }
  set config(value: any) {}
  connectedCallback() {
    this.innerHTML = `
      <div>
        <label>Title: <input name="title" /></label><br/>
        <label>Latitude: <input name="latitude" type="number" /></label><br/>
        <label>Longitude: <input name="longitude" type="number" /></label>
      </div>
    `;
  }
}
customElements.define("meteogram-card-editor", MeteogramCardEditor);

// Home Assistant requires this for custom cards
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "meteogram-card",
  name: "Meteogram Card",
  description: "A custom card showing a 48-hour meteogram with wind barbs."
});