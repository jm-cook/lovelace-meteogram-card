import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface MeteogramData {
  time: Date[];
  temperature: (number | null)[];
  rain: number[];
  snow: number[];
  cloudCover: number[];
  windSpeed: number[];
  windDirection: number[];
  symbolCode: string[];
}

interface WeatherDataPoint {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature?: number;
        cloud_area_fraction?: number;
        wind_speed?: number;
        wind_from_direction?: number;
      }
    };
    next_1_hours?: {
      details?: {
        precipitation_amount?: number;
      };
      summary?: {
        symbol_code?: string;
      };
    };
    next_6_hours?: {
      details?: {
        precipitation_amount?: number;
      };
      summary?: {
        symbol_code?: string;
      };
    };
  };
}

// For day boundary shading
interface DayRange {
  start: number;
  end: number;
}

@customElement("meteogram-card")
export class MeteogramCard extends LitElement {
  @property({ type: String }) title = "";
  @property({ type: Number }) latitude!: number;
  @property({ type: Number }) longitude!: number;
  @property({ attribute: false }) hass: any;

  @state() private chartLoaded = false;
  @state() private meteogramError = "";
  @state() private renderPending = false;

  // Track if initial render has happened to avoid duplicate meteograms
  private hasRendered = false;

  // Keep reference to the D3 selection to clean it up properly
  private svg: any = null;

  // Track element size for resize detection
  private _resizeObserver: ResizeObserver | null = null;
  private _lastWidth = 0;
  private _lastHeight = 0;

  static styles = css`
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
    .temp-line { stroke: orange; stroke-width: 3; fill: none; }
    .rain-bar { fill: deepskyblue; opacity: 0.8; }
    .snow-bar { fill: #b3e6ff; opacity: 0.8; }
    .cloud-area { fill: gray; opacity: 0.32; }
    .grid line { stroke: #b8c4d9; }
    .xgrid line { stroke: #b8c4d9; }
    .wind-band-grid { stroke: #b8c4d9; stroke-width: 1; }
    .twentyfourh-line, .day-tic { stroke: #1a237e; stroke-width: 3; stroke-dasharray:6,5; opacity: 0.6; }
    .twentyfourh-line-wind { stroke: #1a237e; stroke-width: 2.5; stroke-dasharray:6,5; opacity: 0.5; }
    .axis-label { font: 14px sans-serif; }
    .legend { font: 14px sans-serif; }
    .wind-barb { stroke: #1976d2; stroke-width:2; fill:none; }
    .wind-barb-feather { stroke: #1976d2; stroke-width:1.4; }
    .wind-barb-half { stroke: #1976d2; stroke-width:0.8; }
    .wind-barb-calm { stroke: #1976d2; fill: none; }
    .wind-barb-dot { fill: #1976d2; }
    .wind-band-bg { fill: #fff; }
    .wind-band-outline { stroke: #000; fill: none; stroke-width: 1; }
    .top-date-label { font: 16px sans-serif; fill: #333; font-weight: bold; dominant-baseline: hanging; }
    .bottom-hour-label { font: 13px sans-serif; fill: #333; }
    .rain-label { font: 13px sans-serif; fill: #0058a3; text-anchor: middle; font-weight: bold; }
    .day-bg { fill: #e3edfa; }
  `;

  // Required for Home Assistant
  setConfig(config: any) {
    if (config.title) this.title = config.title;
    if (config.latitude !== undefined) this.latitude = config.latitude;
    if (config.longitude !== undefined) this.longitude = config.longitude;
  }

  // Required for HA visual editor support
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

  // Handle initial setup - now properly setup resize observer
  connectedCallback() {
    super.connectedCallback();
    this._setupResizeObserver();
  }

  // Clean up when component is removed
  disconnectedCallback() {
    this._teardownResizeObserver();
    this.cleanupChart();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <ha-card>
        ${this.title ? html`<div class="card-header">${this.title}</div>` : ""}
        <div class="card-content">
          ${this.meteogramError
            ? html`<div class="error">${this.meteogramError}</div>`
            : html`<div id="chart"></div>`}
        </div>
      </ha-card>
    `;
  }

  // Set up resize observer to detect size changes
  private _setupResizeObserver() {
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(
        this._onResize.bind(this)
      );
    }

    // We need to wait for the element to be in the DOM
    setTimeout(() => {
      const chartDiv = this.shadowRoot?.querySelector("#chart");
      if (chartDiv && this._resizeObserver) {
        this._resizeObserver.observe(chartDiv);
      }
    }, 100);
  }

  // Handle resize
  private _onResize(entries: ResizeObserverEntry[]) {
    if (entries.length === 0) return;

    const entry = entries[0];

    // Only redraw if size actually changed by at least 10% to avoid excessive redraws
    if (
        Math.abs(entry.contentRect.width - this._lastWidth) > this._lastWidth * 0.1 ||
        Math.abs(entry.contentRect.height - this._lastHeight) > this._lastHeight * 0.1
    ) {
      this._lastWidth = entry.contentRect.width;
      this._lastHeight = entry.contentRect.height;
      this.drawMeteogram();
    }
  }

  // Clean up resize observer
  private _teardownResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  // Life cycle hooks
  protected firstUpdated(_: PropertyValues) {
    this.loadD3AndDraw();
    this.hasRendered = false; // Force redraw on first update
  }

  protected updated(changedProps: PropertyValues) {
    // Only redraw if coordinates change or it's the first render
    if (this.chartLoaded && (
        changedProps.has('latitude') ||
        changedProps.has('longitude') ||
        !this.hasRendered)
    ) {
      // Delay drawing slightly to ensure DOM is ready
      setTimeout(() => this.drawMeteogram(), 0);
    }
  }

  // Clean up any previous chart to avoid duplicates
  private cleanupChart() {
    if (this.svg) {
      try {
        // Remove all child elements from the SVG
        this.svg.selectAll("*").remove();
      } catch (e) {
        console.debug("Error cleaning up chart:", e);
      }
      this.svg = null;
    }

    const chartDiv = this.shadowRoot?.querySelector("#chart");
    if (chartDiv) {
      chartDiv.innerHTML = "";
    }
  }

  async loadD3AndDraw(): Promise<void> {
    if (!(window as any).d3) {
      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load D3.js"));
          document.head.appendChild(script);
        });
        this.chartLoaded = true;
        this.drawMeteogram();
      } catch (error) {
        this.meteogramError = `Failed to load D3.js: ${error}`;
        console.error(error);
      }
    } else {
      this.chartLoaded = true;
      this.drawMeteogram();
    }
  }

  private lastDrawTime = 0;
  private readonly REDRAW_THROTTLE_MS = 300000; // 5 minutes

  // Ensure we don't have multiple draws in progress
  async drawMeteogram() {
    // Prevent multiple simultaneous renders
    if (this.renderPending) {
      return;
    }

    // Throttle redraws
    const now = Date.now();
    if (now - this.lastDrawTime < this.REDRAW_THROTTLE_MS && this.hasRendered) {
      return;
    }

    this.renderPending = true;

    try {
      await this._drawMeteogram();
    } finally {
      this.renderPending = false;
    }
  }

  async _drawMeteogram() {
    this.meteogramError = "";

    // Ensure D3 is loaded
    if (!(window as any).d3) {
      this.meteogramError = "D3.js library not loaded.";
      return;
    }

    // Clean up any existing chart
    this.cleanupChart();

    // Add a small delay to ensure the DOM is ready
    await new Promise(resolve => setTimeout(resolve, 0));

    const chartDiv = this.shadowRoot?.querySelector("#chart");
    if (!chartDiv) {
      console.error("Chart container not found in DOM");
      this.meteogramError = "Unable to render chart. Please refresh.";
      return;
    }

    try {
      // Responsive sizing based on parent
      const parent = chartDiv.parentElement;
      const availableWidth = parent ? parent.clientWidth : (chartDiv as HTMLElement).offsetWidth || 350;
      const availableHeight = parent ? parent.clientHeight : (chartDiv as HTMLElement).offsetHeight || 180;

      const maxAllowedHeight = Math.min(window.innerHeight * 0.7, 520);
      const width = Math.max(Math.min(availableWidth, 800), 300);
      const aspectRatioHeight = width * 0.6;
      const height = Math.min(aspectRatioHeight, availableHeight, maxAllowedHeight);

      // Store dimensions for resize detection
      this._lastWidth = availableWidth;
      this._lastHeight = availableHeight;

      // Fetch weather data
      const data = await this.fetchWeatherData();

      // Create SVG with responsive viewBox
      // Store reference so we can clean it up later
      this.svg = (window as any).d3.select(chartDiv)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width + 140} ${height + 160}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      this.renderMeteogram(this.svg, data, width, height);
      this.hasRendered = true;

      // Ensure observers are setup again
      this._setupResizeObserver();
    } catch (error) {
      console.error('Error in _drawMeteogram:', error);
      this.meteogramError = `Failed to render chart: ${(error as Error).message}`;
    }
  }

  private static weatherDataCache: Map<string, {data: MeteogramData, timestamp: number}> = new Map();
  private static CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes cache

  async fetchWeatherData(): Promise<MeteogramData> {
    // Create a cache key based on coordinates (rounded to 3 decimal places for stability)
    const cacheKey = `${this.latitude.toFixed(3)},${this.longitude.toFixed(3)}`;
    const now = new Date().getTime();

    // Check if we have valid cached data
    const cachedData = MeteogramCard.weatherDataCache.get(cacheKey);
    if (cachedData && (now - cachedData.timestamp < MeteogramCard.CACHE_DURATION_MS)) {
      console.debug("Using cached weather data");
      return cachedData.data;
    }

    // No cache or expired, fetch new data
    console.debug("Fetching fresh weather data");

    try {
      const response = await fetch(
          `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${this.latitude}&lon=${this.longitude}`,
          {
            headers: {
              'User-Agent': 'ha-meteogram-card/1.0 github.com/jm-cook/ha-meteogram-card'
            }
          }
      );

      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const ts = data.properties.timeseries.slice(0, 48) as WeatherDataPoint[];

      if (!ts.length) {
        throw new Error("No data received from API.");
      }

      // Process the data as before
      const time = ts.map(e => new Date(e.time));
      const temperature = ts.map(e => e.data.instant.details.air_temperature ?? null);
      const rain = ts.map(e => e.data.next_1_hours?.details?.precipitation_amount ?? 0);
      const snow = ts.map(e => e.data.next_1_hours?.details?.precipitation_amount ?? 0);
      const cloudCover = ts.map(e => e.data.instant.details.cloud_area_fraction ?? 0);
      const windSpeed = ts.map(e => e.data.instant.details.wind_speed ?? 0);
      const windDirection = ts.map(e => e.data.instant.details.wind_from_direction ?? 0);
      const symbolCode = ts.map(e =>
          e.data.next_1_hours?.summary?.symbol_code ||
          e.data.next_6_hours?.summary?.symbol_code ||
          ""
      );

      // Limit to last full hour
      let lastHourIdx = time.length - 1;
      for (let i = time.length - 1; i >= 0; i--) {
        if (time[i].getMinutes() === 0 && time[i].getSeconds() === 0) {
          lastHourIdx = i;
          break;
        }
      }

      const processedData = {
        time: time.slice(0, lastHourIdx + 1),
        temperature: temperature.slice(0, lastHourIdx + 1),
        rain: rain.slice(0, lastHourIdx + 1),
        snow: snow.slice(0, lastHourIdx + 1),
        cloudCover: cloudCover.slice(0, lastHourIdx + 1),
        windSpeed: windSpeed.slice(0, lastHourIdx + 1),
        windDirection: windDirection.slice(0, lastHourIdx + 1),
        symbolCode: symbolCode.slice(0, lastHourIdx + 1)
      };

      // Store in cache
      MeteogramCard.weatherDataCache.set(cacheKey, {
        data: processedData,
        timestamp: now
      });

      return processedData;
    } catch (error) {
      // If error occurs and we have expired cache data, use it as fallback
      if (cachedData) {
        console.warn("API request failed, using expired cache data as fallback", error);
        return cachedData.data;
      }
      throw error;
    }
  }

  renderMeteogram(svg: any, data: MeteogramData, width: number, height: number): void {
    const d3 = (window as any).d3;
    const { time, temperature, rain, snow, cloudCover, windSpeed, windDirection, symbolCode } = data;
    const N = time.length;

    // SVG and chart parameters
    const windBarbBand = 55;
    const bottomHourBand = 24;
    const margin = {top: 70, right: 70, bottom: bottomHourBand + 10, left: 70};
    const chartWidth = width;
    const chartHeight = height;
    const dx = chartWidth / (N - 1);

    // X scale
    const x = d3.scaleLinear()
      .domain([0, N - 1])
      .range([0, chartWidth]);

    // Find day boundaries for shaded backgrounds
    const dateLabelY = margin.top - 30;
    const dayStarts: number[] = [];
    for (let i = 0; i < N; i++) {
      if (i === 0 || time[i].getDate() !== time[i-1].getDate()) {
        dayStarts.push(i);
      }
    }

    const dayRanges: DayRange[] = [];
    for (let i = 0; i < dayStarts.length; ++i) {
      const startIdx = dayStarts[i];
      const endIdx = (i + 1 < dayStarts.length) ? dayStarts[i+1] : N;
      dayRanges.push({start: startIdx, end: endIdx});
    }

    // Alternate shaded background for days
    svg.selectAll(".day-bg")
      .data(dayRanges)
      .enter()
      .append("rect")
      .attr("class", "day-bg")
      .attr("x", (d: DayRange) => margin.left + x(d.start))
      .attr("y", margin.top - 42)
      .attr("width", (d: DayRange) => x(Math.max(d.end-1, d.start)) - x(d.start) + dx)
      .attr("height", chartHeight + windBarbBand + 42 + bottomHourBand)
      .attr("opacity", (_: DayRange, i: number) => i % 2 === 0 ? 0.16 : 0);

    // Date labels at top
    svg.selectAll(".top-date-label")
      .data(dayStarts)
      .enter()
      .append("text")
      .attr("class", "top-date-label")
      .attr("x", (d: number) => margin.left + x(d))
      .attr("y", dateLabelY)
      .attr("text-anchor", "start")
      .text((d: number) => {
        const dt = time[d];
        return dt.toLocaleDateString(undefined, {weekday: "short", day: "2-digit", month: "short"});
      });

    // Day boundary ticks
    svg.selectAll(".day-tic")
      .data(dayStarts)
      .enter()
      .append("line")
      .attr("class", "day-tic")
      .attr("x1", (d: number) => margin.left + x(d))
      .attr("x2", (d: number) => margin.left + x(d))
      .attr("y1", dateLabelY+22)
      .attr("y2", dateLabelY+42)
      .attr("stroke", "#1a237e")
      .attr("stroke-width", 3)
      .attr("opacity", 0.6);

    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Temperature Y scale, handling null values
    const tempValues = temperature.filter((t): t is number => t !== null);
    const yTemp = d3.scaleLinear()
      .domain([Math.floor(d3.min(tempValues) - 2), Math.ceil(d3.max(tempValues) + 2)])
      .range([chartHeight, 0]);

    // Precipitation Y scale
    const yPrecip = d3.scaleLinear()
      .domain([0, Math.max(2, d3.max([...rain, ...snow]) + 1)])
      .range([chartHeight, chartHeight*0.65]);

    // Add vertical gridlines
    svg.append("g")
      .attr("class", "xgrid")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("line")
      .data(d3.range(N))
      .enter().append("line")
      .attr("x1", (i: number) => x(i))
      .attr("x2", (i: number) => x(i))
      .attr("y1", 0)
      .attr("y2", chartHeight)
      .attr("stroke", "#b8c4d9")
      .attr("stroke-width", 1);

    // Day change vertical lines (midnights)
    const dayChangeIdx = dayStarts.slice(1);
    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll(".twentyfourh-line")
      .data(dayChangeIdx)
      .enter()
      .append("line")
      .attr("class", "twentyfourh-line")
      .attr("x1", (i: number) => x(i))
      .attr("x2", (i: number) => x(i))
      .attr("y1", 0)
      .attr("y2", chartHeight)
      .lower();

    // Cloud cover band
    const bandTop = chartHeight * 0.05;
    const bandHeight = chartHeight * 0.20;
    const cloudBandPoints: [number, number][] = [];

    for (let i = 0; i < N; i++) {
      cloudBandPoints.push([x(i), bandTop + bandHeight * (cloudCover[i] / 100)]);
    }
    for (let i = N - 1; i >= 0; i--) {
      cloudBandPoints.push([x(i), bandTop + bandHeight * (1 - cloudCover[i] / 100)]);
    }

    chart.append("path")
      .attr("class", "cloud-area")
      .attr("d", d3.line()
        .x((d: [number, number]) => d[0])
        .y((d: [number, number]) => d[1])
        .curve(d3.curveLinearClosed)(cloudBandPoints));

    // Temperature axis and grid
    chart.append("g").attr("class", "grid")
      .call(d3.axisLeft(yTemp).tickSize(-chartWidth).tickFormat(""));

    chart.append("line")
      .attr("x1", 0).attr("x2", chartWidth)
      .attr("y1", chartHeight).attr("y2", chartHeight)
      .attr("stroke", "#333");

    chart.append("g").call(d3.axisLeft(yTemp));

    // Axis labels and legend
    chart.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-50,${chartHeight/2}) rotate(-90)`)
      .text("Temperature (°C)");

    chart.append("text")
      .attr("class","legend")
      .attr("x", 0).attr("y", -45)
      .text("Cloud Cover (%)");

    chart.append("text")
      .attr("class","legend")
      .attr("x", 200).attr("y", -45)
      .style("fill", "orange")
      .text("Temperature (°C)");

    chart.append("text")
      .attr("class","legend")
      .attr("x", 410).attr("y", -45)
      .style("fill", "deepskyblue")
      .text("Rain (mm)");

    chart.append("text")
      .attr("class","legend")
      .attr("x", 560).attr("y", -45)
      .style("fill", "#b3e6ff")
      .text("Snow (mm)");

    // Temperature line
    const line = d3.line()
      .defined((d: number | null) => d !== null)
      .x((_: number | null, i: number) => x(i))
      .y((d: number | null) => d !== null ? yTemp(d) : 0);

    chart.append("path")
      .datum(temperature)
      .attr("class", "temp-line")
      .attr("d", line);

    // Weather icons along temperature curve
    chart.selectAll(".weather-icon")
      .data(symbolCode)
      .enter()
      .append("image")
      .attr("class", "weather-icon")
      .attr("x", (_: string, i: number) => x(i) - 16)
      .attr("y", (_: string, i: number) => {
        const temp = temperature[i];
        return temp !== null ? yTemp(temp) - 32 - 8 : -999;
      })
      .attr("width", 32)
      .attr("height", 32)
      .attr("href", (d: string) => this.getWeatherIconUrl(d))
      .attr("opacity", (_: string, i: number) => temperature[i] !== null ? 1 : 0);

    // Rain bars with labels
    const barWidth = Math.min(26, dx * 0.8);

    chart.selectAll(".rain-bar")
      .data(rain.slice(0, N - 1))
      .enter().append("rect")
      .attr("class", "rain-bar")
      .attr("x", (_: number, i: number) => x(i) + dx/2 - barWidth/2)
      .attr("y", (d: number) => yPrecip(d))
      .attr("width", barWidth)
      .attr("height", (d: number) => chartHeight - yPrecip(d));

    chart.selectAll(".rain-label")
      .data(rain.slice(0, N - 1))
      .enter()
      .append("text")
      .attr("class", "rain-label")
      .attr("x", (_: number, i: number) => x(i) + dx/2)
      .attr("y", (d: number) => yPrecip(d) - 4)
      .text((d: number) => d > 0 ? (d < 1 ? d.toFixed(1) : d.toFixed(0)) : "")
      .attr("opacity", (d: number) => d > 0 ? 1 : 0);

    chart.selectAll(".snow-bar")
      .data(snow.slice(0, N - 1))
      .enter().append("rect")
      .attr("class", "snow-bar")
      .attr("x", (_: number, i: number) => x(i) + dx/2 - barWidth/2)
      .attr("y", (_: number, i: number) => yPrecip(rain[i]+snow[i]))
      .attr("width", barWidth)
      .attr("height", (d: number) => chartHeight - yPrecip(d));

    // Wind band
    const windBandYOffset = margin.top + chartHeight;
    const windBand = svg.append('g')
      .attr('transform', `translate(${margin.left},${windBandYOffset})`);

    const windBandHeight = windBarbBand - 10;
    const windBarbY = windBandHeight / 2;

    windBand.append("rect")
      .attr("class", "wind-band-bg")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", chartWidth)
      .attr("height", windBandHeight);

    // Even hour grid lines
    const twoHourIdx: number[] = [];
    for (let i = 0; i < N; i++) {
      if (time[i].getHours() % 2 === 0) twoHourIdx.push(i);
    }

    windBand.selectAll(".wind-band-grid")
      .data(twoHourIdx)
      .enter()
      .append("line")
      .attr("class", "wind-band-grid")
      .attr("x1", (i: number) => x(i))
      .attr("x2", (i: number) => x(i))
      .attr("y1", 0)
      .attr("y2", windBandHeight)
      .attr("stroke", "#b8c4d9")
      .attr("stroke-width", 1);

    windBand.selectAll(".twentyfourh-line-wind")
      .data(dayChangeIdx)
      .enter()
      .append("line")
      .attr("class", "twentyfourh-line-wind")
      .attr("x1", (i: number) => x(i))
      .attr("x2", (i: number) => x(i))
      .attr("y1", 0)
      .attr("y2", windBandHeight);

    // Draw wind barbs at regular intervals
    const windBarbInterval = width < 400 ? 3 : 2;

    for (let i = 1; i < N - 1; i += windBarbInterval) {
      const cx = x(i);
      const speed = windSpeed[i], dir = windDirection[i];
      const minBarbLen = width < 400 ? 18 : 23;
      const maxBarbLen = width < 400 ? 30 : 38;
      const windLenScale = d3.scaleLinear()
        .domain([0, Math.max(15, d3.max(windSpeed) || 20)])
        .range([minBarbLen, maxBarbLen]);
      const barbLen = windLenScale(speed);
      this.drawWindBarb(windBand, cx, windBarbY, speed, dir, barbLen, width < 400 ? 0.7 : 0.8);
    }

    // Wind band border
    windBand.append("rect")
      .attr("class", "wind-band-outline")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", chartWidth)
      .attr("height", windBandHeight)
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    // Bottom hour labels
    const hourLabelY = margin.top + chartHeight + windBarbBand + 18;
    svg.selectAll(".bottom-hour-label")
      .data(time)
      .enter()
      .append("text")
      .attr("class", "bottom-hour-label")
      .attr("x", (_: Date, i: number) => margin.left + x(i))
      .attr("y", hourLabelY)
      .attr("text-anchor", "middle")
      .text((d: Date, i: number) => {
        const hour = d.getHours();
        if (width < 400) {
          return i % 6 === 0 ? String(hour).padStart(2, "0") : "";
        } else {
          return i % 3 === 0 ? String(hour).padStart(2, "0") : "";
        }
      });
  }

  // Draw a wind barb at the given position
  drawWindBarb(g: any, x: number, y: number, speed: number, dirDeg: number, len: number, scale = 0.8) {
    const featherLong = 12;
    const featherShort = 6;
    const featherYOffset = 3;

    const barbGroup = g.append("g")
      .attr("transform", `translate(${x},${y}) rotate(${dirDeg}) scale(${scale})`);

    const y0 = -len/2, y1 = +len/2;

    if (speed < 2) {
      barbGroup.append("circle")
        .attr("class", "wind-barb-calm")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4);
      return;
    }

    barbGroup.append("line")
      .attr("class", "wind-barb")
      .attr("x1", 0).attr("y1", y0)
      .attr("x2", 0).attr("y2", y1);

    barbGroup.append("circle")
      .attr("class", "wind-barb-dot")
      .attr("cx", 0)
      .attr("cy", y1)
      .attr("r", 4);

    let v = speed, wy = y0, step = 7;
    let n10 = Math.floor(v/10); v -= n10*10;
    let n5 = Math.floor(v/5); v -= n5*5;

    for (let i = 0; i < n10; i++, wy += step) {
      barbGroup.append("line")
        .attr("class", "wind-barb-feather")
        .attr("x1", 0).attr("y1", wy)
        .attr("x2", featherLong).attr("y2", wy + featherYOffset);
    }

    for (let i = 0; i < n5; i++, wy += step) {
      barbGroup.append("line")
        .attr("class", "wind-barb-half")
        .attr("x1", 0).attr("y1", wy)
        .attr("x2", featherShort).attr("y2", wy + featherYOffset/1.5);
    }
  }

  // Weather icon URL handling
  getWeatherIconUrl(symbolCode: string): string {
    // Handle the typo in the API (extra "s" after "light" in some symbols)
    const correctedSymbol = symbolCode
      .replace(/^lightssleet/, 'lightsleet')
      .replace(/^lightssnow/, 'lightsnow');

    // Use local icons
    return `/local/ha-meteogram-card/icons/${correctedSymbol}.svg`;
  }
}

// Visual editor for HACS
class MeteogramCardEditor extends HTMLElement {
  private _config: any = {};
  private _initialized = false;

  set hass(_: any) {
    // Setter kept for compatibility
  }

  setConfig(config: any) {
    this._config = config || {};
    this.render();
  }

  get config() {
    return this._config;
  }

  connectedCallback() {
    if (!this._initialized) {
      this._initialize();
    }
  }

  private _initialize() {
    this._initialized = true;
    this.render();
  }

  render() {
    if (!this._initialized) {
      return;
    }

    this.innerHTML = `
      <style>
        .side-by-side {
          display: flex;
        }
        .side-by-side > * {
          flex: 1;
          padding-right: 4px;
        }
      </style>
      <div>
        <p>Meteogram Card Settings</p>
        <div>
          <label>Title: <input name="title" value="${this._config.title || ''}"></label>
        </div>
        <div class="side-by-side">
          <div>
            <label>Latitude: <input name="latitude" type="number" step="any" value="${this._config.latitude || ''}"></label>
          </div>
          <div>
            <label>Longitude: <input name="longitude" type="number" step="any" value="${this._config.longitude || ''}"></label>
          </div>
        </div>
      </div>
    `;

    const inputs = this.querySelectorAll("input");
    inputs.forEach(input => {
      input.addEventListener("change", () => {
        if (!this._config) return;

        if ((input as HTMLInputElement).type === 'number') {
          this._config = {
            ...this._config,
            [(input as HTMLInputElement).name]: parseFloat((input as HTMLInputElement).value)
          };
        } else {
          this._config = {
            ...this._config,
            [(input as HTMLInputElement).name]: (input as HTMLInputElement).value
          };
        }

        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config } }));
      });
    });
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
