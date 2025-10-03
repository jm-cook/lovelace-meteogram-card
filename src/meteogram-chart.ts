import { trnslt } from "./translations";
import { mapHaConditionToMetnoSymbol } from "./weather-entity";
import { convertWindSpeed } from "./conversions";
// meteogram-chart.ts
// Handles all SVG/D3 chart rendering for MeteogramCard

// Make the mapping function available globally for chart rendering
if (typeof window !== "undefined") {
  window.mapHaConditionToMetnoSymbol = mapHaConditionToMetnoSymbol;
}

export class MeteogramChart {
    /**
     * Draw weather icons at each time step
     */
    public drawWeatherIcons(
        chart: any,
        symbolCode: string[],
        temperatureConverted: (number|null)[],
        x: any,
        yTemp: any,
        data: any,
        N: number
    ) {
        // If denseWeatherIcons is true, show all icons (interval 1)
        // Otherwise, space icons so they don't overlap (e.g., 44px per icon)
        const minIconSpacing = 44; // px, icon is 40px wide
        const chartWidth = this.card._chartWidth || 400;
        const maxIcons = Math.floor(chartWidth / minIconSpacing);
        const iconInterval = this.card.denseWeatherIcons
            ? 1
            : Math.max(1, Math.ceil(N / maxIcons));

        chart.selectAll(".weather-icon")
            .data(symbolCode)
            .enter()
            .append("foreignObject")
            .attr("class", "weather-icon")
            .attr("x", (_: string, i: number) => x(i) - 20)
            .attr("y", (_: string, i: number) => {
                const temp = temperatureConverted[i];
                return temp !== null ? yTemp(temp) - 40 : -999;
            })
            .attr("width", 40)
            .attr("height", 40)
            .attr("opacity", (_: string, i: number) =>
                (temperatureConverted[i] !== null && i % iconInterval === 0) ? 1 : 0)
            .each((d: string, i: number, nodes: any) => {
                if (i % iconInterval !== 0) return;
                const node = nodes[i];
                if (!d) return;
                let iconName = d;
                if (this.card.entityId && this.card.entityId !== 'none' && this.card._weatherEntityApiInstance) {
                    const forecastTime = data.time[i];
                    const isDay = this.card.isDaytimeAt(forecastTime);
                    iconName = window.mapHaConditionToMetnoSymbol
                        ? window.mapHaConditionToMetnoSymbol(d, forecastTime, isDay)
                        : d;
                }
                iconName = iconName
                    .replace(/^lightssleet/, 'lightsleet')
                    .replace(/^lightssnow/, 'lightsnow')
                    .replace(/^lightrainshowers$/, 'lightrainshowersday')
                    .replace(/^rainshowers$/, 'rainshowersday')
                    .replace(/^heavyrainshowers$/, 'heavyrainshowersday');
                if (this.card.getIconSVG) {
                    this.card.getIconSVG(iconName).then((svgContent: string) => {
                        if (svgContent) {
                            const div = document.createElement('div');
                            div.style.width = '40px';
                            div.style.height = '40px';
                            div.innerHTML = svgContent;
                            node.appendChild(div);
                        }
                    });
                }
            });
    }
    private card: any;
    constructor(cardInstance: any) {
        this.card = cardInstance;
    }

    /**
     * Ensures D3.js is loaded globally (window.d3). Returns a promise that resolves when D3 is available.
     */
    async ensureD3Loaded(): Promise<void> {
        if (window.d3) return;
        // Check if a script is already loading
        if ((window as any)._meteogramD3LoadingPromise) {
            await (window as any)._meteogramD3LoadingPromise;
            return;
        }
        // Otherwise, load D3 dynamically
        (window as any)._meteogramD3LoadingPromise = new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://d3js.org/d3.v7.min.js';
            script.async = true;
            script.onload = () => {
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load D3.js library'));
            };
            document.head.appendChild(script);
        });
        await (window as any)._meteogramD3LoadingPromise;
    }

    drawGridOutline(chart: any) {
        chart.append("line")
            .attr("class", "line")
            .attr("x1", 0).attr("x2", this.card._chartWidth)
            .attr("y1", 0).attr("y2", 0)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)")
            .attr("stroke-width", 3);

        chart.append("line")
            .attr("class", "line")
            .attr("x1", 0).attr("x2", this.card._chartWidth)
            .attr("y1", this.card._chartHeight).attr("y2", this.card._chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)");

        chart.append("line")
            .attr("class", "line")
            .attr("x1", this.card._chartWidth).attr("x2", this.card._chartWidth)
            .attr("y1", 0).attr("y2", this.card._chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)")
            .attr("stroke-width", 3);

        chart.append("line")
            .attr("class", "line")
            .attr("x1", 0).attr("x2", 0)
            .attr("y1", 0).attr("y2" , this.card._chartHeight)
            .attr("stroke", "var(--meteogram-grid-color, #e0e0e0)")
            .attr("stroke-width", 3);
    }

    drawBottomHourLabels(svg: any, time: Date[], margin: any, x: any, windBandHeight: number, width: number) {
        const hourLabelY = margin.top + this.card._chartHeight + windBandHeight + 15;
        svg.selectAll(".bottom-hour-label")
            .data(time)
            .enter()
            .append("text")
            .attr("class", "bottom-hour-label")
            .attr("x", (_: Date, i: number) => margin.left + x(i))
            .attr("y", hourLabelY)
            .attr("text-anchor", "middle")
            .text((d: Date, i: number) => {
                const haLocale = this.card.getHaLocale();
                const hour = d.toLocaleTimeString(haLocale, {hour: "2-digit", hour12: false});
                if (width < 400) {
                    return i % 6 === 0 ? hour : "";
                } else if (width > 800) {
                    return i % 2 === 0 ? hour : "";
                } else {
                    return i % 3 === 0 ? hour : "";
                }
            });
    }

    drawTemperatureLine(chart: any, temperature: (number|null)[], x: any, yTemp: any, legendX?: number, legendY?: number) {
        const d3 = window.d3;
        const line = d3.line()
            .defined((d: number | null) => d !== null)
            .x((_: number | null, i: number) => x(i))
            .y((_: number | null, i: number) => temperature[i] !== null ? yTemp(temperature[i]) : 0)
            .curve(d3.curveMonotoneX);

        chart.append("path")
            .datum(temperature)
            .attr("class", "temp-line")
            .attr("d", line)
            .attr("stroke", "currentColor");

            // Always draw axis label (if not in focussed mode)
            if (!this.card.focussed && this.card.displayMode !== "core") {
                chart.append("text")
                    .attr("class", "axis-label")
                    .attr("text-anchor", "middle")
                    .attr("transform", `translate(${-this.card._margin.left + 20},${yTemp.range()[0] / 2}) rotate(-90)`)
                    .text(trnslt(this.card.hass, "ui.card.meteogram.attributes.temperature", "Temperature") + " (" + this.card._tempUnit + ")");
            }

            // Draw colored top legend if coordinates are provided
            if (legendX !== undefined && legendY !== undefined) {
                chart.append("text")
                    .attr("class", "legend legend-temp")
                    .attr("x", legendX)
                    .attr("y", legendY)
                    .attr("text-anchor", "start")
                    .text(trnslt(this.card.hass, "ui.card.meteogram.attributes.temperature", "Temperature") + " (" + this.card._tempUnit + ")");
            }
            

    }

    drawChartGrid(svg: any, chart: any, d3: any, x: any, yTemp: any, N: number, margin: any, dayStarts: number[]) {
        // Day boundary ticks (top short ticks)
        const tickLength = 12; // Short tick length above the top line
        svg.selectAll(".day-tic")
            .data(dayStarts)
            .enter()
            .append("line")
            .attr("class", "day-tic")
            .attr("x1", (d: number) => margin.left + x(d))
            .attr("x2", (d: number) => margin.left + x(d))
            .attr("y1", margin.top - tickLength)
            .attr("y2", this.card._chartHeight + margin.top)
            .attr("stroke", "#1a237e")
            .attr("stroke-width", 3)
            .attr("opacity", 0.6);

        // Always add temperature Y axis (left side)
        chart.append("g")
            .attr("class", "temperature-axis")
            .call(window.d3.axisLeft(yTemp)
                .tickFormat((d: any) => `${d}`));

        // Add temperature Y axis for horizontal grid lines (no numbers)
        chart.append("g")
            .attr("class", "grid")
            .call(window.d3.axisLeft(yTemp)
                .tickSize(-this.card._chartWidth)
                .tickFormat(() => ""));

        // Add vertical gridlines
        chart.append("g")
            .attr("class", "xgrid")
            .selectAll("line")
            .data(d3.range(N))
            .enter().append("line")
            .attr("x1", (i: number) => x(i))
            .attr("x2", (i: number) => x(i))
            .attr("y1", 0)
            .attr("y2", this.card._chartHeight)
            .attr("stroke", "currentColor")
            .attr("stroke-width", 1);
    }

    drawRainBars(
        chart: any,
        rain: (number|null)[],
        rainMax: (number|null)[],
        snow: (number|null)[],
        N: number,
        x: any,
        yPrecip: any,
        dx: number,
        snowAvailable: boolean,
        legendX?: number,
        legendY?: number
    ) {
        const barWidth = dx * 0.8;
        // Draw the max rain range bars first (if present)
        chart.selectAll(".rain-max-bar")
            .data(rainMax.slice(0, N - 1))
            .enter()
            .append("rect")
            .attr("class", "rain-max-bar")
            .attr("x", (_: number, i: number) => x(i) + dx / 2 - barWidth / 2)
            .attr("y", (d: number) => {
                const h = this.card._chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7; // Minimum height of 2px for visibility
                return yPrecip(0) - scaledH;
            })
            .attr("width", barWidth)
            .attr("height", (d: number) => {
                const h = this.card._chartHeight - yPrecip(d);
                return h < 2 && d > 0 ? 2 : h * 0.7;
            })
            .attr("fill", "currentColor");

        // Draw main rain bars (foreground, deeper blue)
        chart.selectAll(".rain-bar")
            .data(rain.slice(0, N - 1))
            .enter().append("rect")
            .attr("class", "rain-bar")
            .attr("x", (_: number, i: number) => x(i) + dx / 2 - barWidth / 2)
            .attr("y", (d: number) => {
                const h = this.card._chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH;
            })
            .attr("width", barWidth)
            .attr("height", (d: number) => {
                const h = this.card._chartHeight - yPrecip(d);
                return h < 2 && d > 0 ? 2 : h * 0.7;
            })
            .attr("fill", "currentColor");

        // Add main rain labels (show if rain > 0)
        chart.selectAll(".rain-label")
            .data(rain.slice(0, N - 1))
            .enter()
            .append("text")
            .attr("class", "rain-label")
            .attr("x", (_: number, i: number) => x(i) + dx / 2)
            .attr("y", (d: number) => {
                const h = this.card._chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH - 4; // 4px above the top of the bar
            })
            .text((d: number) => {
                if (d <= 0) return "";
                return d < 1 ? d.toFixed(1) : d.toFixed(0);
            })
            .attr("opacity", (d: number) => d > 0 ? 1 : 0);

        // Add max rain labels (show if max > rain)
        chart.selectAll(".rain-max-label")
            .data(rainMax.slice(0, N - 1))
            .enter()
            .append("text")
            .attr("class", "rain-max-label")
            .attr("x", (_: number, i: number) => x(i) + dx / 2)
            .attr("y", (d: number) => {
                const h = this.card._chartHeight - yPrecip(d);
                const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH - 18; // 18px above the top of the max bar
            })
            .text((d: number, i: number) => {
                const rainValue = rain?.[i] ?? 0;
                if (d <= rainValue) return "";
                return d < 1 ? d.toFixed(1) : d.toFixed(0);
            })
            .attr("opacity", (d: number, i: number) => {
                const rainValue = rain?.[i] ?? 0;
                return (d > rainValue) ? 1 : 0;
            });

        // Draw snow bars with a different style if present
        if (snowAvailable) {
            chart.selectAll(".snow-bar")
                .data(snow.slice(0, N - 1))
                .enter().append("rect")
                .attr("class", "snow-bar")
                .attr("x", (_: number, i: number) => x(i) + dx / 2 - barWidth / 2)
                .attr("y", (d: number) => {
                    const h = this.card._chartHeight - yPrecip(d);
                    const scaledH = h < 2 && d > 0 ? 2 : h * 0.7;
                    return yPrecip(0) - scaledH; // 18px above the top of the max bar
                })
                .attr("width", barWidth)
                .attr("height", (d: number) => {
                    const h = this.card._chartHeight - yPrecip(d);
                    return h < 2 && d > 0 ? 2 : h * 0.7;
                })
                .attr("fill", "currentColor");
        }

        // Add precipitation legend if coordinates are provided
        if (legendX !== undefined && legendY !== undefined) {
            const precipUnit = this.card.getSystemPrecipitationUnit();
                chart.append("text")
                    .attr("class", "legend legend-rain")
                    .attr("x", legendX)
                    .attr("y", legendY)
                    .attr("text-anchor", "start")
                    .text(trnslt(this.card.hass, "ui.card.meteogram.attributes.precipitation", "Precipitation") + ` (${precipUnit})`);
        }
    }

     /**
     * Draw date labels at the top of the chart
     */
    public drawDateLabels(
        svg: any,
        time: Date[],
        dayStarts: number[],
        margin: { top: number; right: number; bottom: number; left: number },
        x: any,
        chartWidth: number,
        dateLabelY: number
    ) {
    if (!this.card.focussed) {
            svg.selectAll(".top-date-label")
                .data(dayStarts)
                .enter()
                .append("text")
                .attr("class", "top-date-label")
                .attr("x", (d: number, i: number) => {
                    // Ensure last label does not go outside chart area
                    const rawX = margin.left + x(d);
                    if (i === dayStarts.length - 1) {
                        // Cap to chart right edge minus a small margin
                        return Math.min(rawX, margin.left + chartWidth - 80);
                    }
                    return rawX;
                })
                .attr("y", dateLabelY)
                .attr("text-anchor", "start")
                .attr("opacity", (d: number, i: number) => {
                    // Check if there's enough space for this label
                    if (i === dayStarts.length - 1) return 1; // Always show the last day

                    const thisLabelPos = margin.left + x(d);
                    const nextLabelPos = margin.left + x(dayStarts[i + 1]);
                    const minSpaceNeeded = 100; // Minimum pixels needed between labels

                    // If not enough space between this and next label, hide this one
                    return nextLabelPos - thisLabelPos < minSpaceNeeded ? 0 : 1;
                })
                .text((d: number) => {
                    const dt = time[d];
                    // Use HA locale for date formatting
                    const haLocale = this.card.getHaLocale();
                    return dt.toLocaleDateString(haLocale, {weekday: "short", day: "2-digit", month: "short"});
                });
        }
    }
    public drawCloudBand(chart: any, cloudCover: (number|null)[], N: number, x: any, legendX?: number, legendY?: number) {
        const d3 = window.d3;
        // Filter out nulls for cloudCover array
        const cloudFiltered = cloudCover.map(c => c ?? 0);
        const bandTop = this.card._chartHeight * 0.01;
        const bandHeight = this.card._chartHeight * 0.20;
        const cloudBandPoints: [number, number][] = [];
        for (let i = 0; i < N; i++) {
            cloudBandPoints.push([x(i), bandTop + (bandHeight / 2) * (1 - cloudFiltered[i] / 100)]);
        }
        for (let i = N - 1; i >= 0; i--) {
            cloudBandPoints.push([x(i), bandTop + (bandHeight / 2) * (1 + cloudFiltered[i] / 100)]);
        }
        chart.append("path")
            .attr("class", "cloud-area")
            .attr("d", d3.line()
                .x((d: [number, number]) => d[0])
                .y((d: [number, number]) => d[1])
                .curve(d3.curveLinearClosed)(cloudBandPoints));
        // Render legend if legendX and legendY are provided
        if (legendX !== undefined && legendY !== undefined) {
            chart.append("text")
                .attr("class", "legend legend-cloud")
                .attr("x", legendX)
                .attr("y", legendY)
                .attr("text-anchor", "start")
                .text(trnslt(this.card.hass, "ui.card.meteogram.attributes.cloud_coverage", "Cloud Cover") + ` (%)`);
        }
    }
    public drawPressureLine(chart: any, pressure: (number|null)[], x: any, yPressure: any, legendX?: number, legendY?: number) {
        const d3 = window.d3;
    //
        const pressureLine = d3.line()
            .defined((d: number | null) => d !== null && typeof d === "number" && !isNaN(d))
            .x((_: number, i: number) => x(i))
            .y((d: number | null) => yPressure(d as number));

        chart.append("path")
            .datum(pressure)
            .attr("class", "pressure-line")
            .attr("d", pressureLine)
            .attr("fill", "none"); // Ensure no area fill, let CSS handle stroke

        // Draw right-side pressure axis
        const pressureDomain = yPressure.domain();
        const minPressure = Math.ceil(pressureDomain[0] / 10) * 10; // Round to nearest 10
        const maxPressure = Math.floor(pressureDomain[1] / 10) * 10; // Round to nearest 10
        const pressureTicks = [];
        for (let p = minPressure; p <= maxPressure; p += 10) { // Increment by 10 instead of 1
            pressureTicks.push(p);
        }
        chart.append("g")
            .attr("class", "pressure-axis")
            .attr("transform", `translate(${this.card._chartWidth}, 0)`)
            .call(d3.axisRight(yPressure)
                .tickValues(pressureTicks)
                .tickFormat(d3.format('d')));

        // Always draw axis label (if not in focussed mode)
        if (!this.card.focussed && this.card.displayMode !== "core") {
            chart.append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", `translate(${this.card._chartWidth + this.card._margin.right-20},${yPressure.range()[0] / 2}) rotate(90)`)
                .text(trnslt(this.card.hass, "ui.card.meteogram.attributes.air_pressure", "Pressure") + " (" + this.card._pressureUnit + ")");
        }

        // Draw colored top legend if coordinates are provided
        if (legendX !== undefined && legendY !== undefined) {
            chart.append("text")
                .attr("class", "legend legend-pressure")
                .attr("x", legendX)
                .attr("y", legendY)
                .attr("text-anchor", "start")
                .text(trnslt(this.card.hass, "ui.card.meteogram.attributes.air_pressure", "Pressure") + " (" + this.card._pressureUnit + ")");
        }
    }

    /**
     * Draw wind band (barbs, grid, background, border)
     */
    public drawWindBand(
        svg: any,
        x: any,
        windBandHeight: number,
        margin: any,
        width: number,
        N: number,
        time: Date[],
        windSpeed: (number|null)[],
        windGust: (number|null)[],
        windDirection: (number|null)[],
        windSpeedUnit: string
    ) {
        const d3 = window.d3;
        const windBandYOffset = margin.top + this.card._chartHeight;
        const windBand = svg.append('g')
            .attr('transform', `translate(${margin.left},${windBandYOffset})`);

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
            .attr("stroke", "currentColor")
            .attr("stroke-width", 1);

        // Wind band border (outline)
        windBand.append("rect")
            .attr("class", "wind-band-outline")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.card._chartWidth)
            .attr("height", windBandHeight)
            .attr("stroke", "currentColor")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        windBand.append("rect")
            .attr("class", "wind-band-bg")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.card._chartWidth)
            .attr("height", windBandHeight);

        // Day change lines in wind band
        const dayChangeIdx = [];
        for (let i = 1; i < N; i++) {
            if (time[i].getDate() !== time[i - 1].getDate()) dayChangeIdx.push(i);
        }
        windBand.selectAll(".twentyfourh-line-wind")
            .data(dayChangeIdx)
            .enter()
            .append("line")
            .attr("class", "twentyfourh-line-wind")
            .attr("x1", (i: number) => x(i))
            .attr("x2", (i: number) => x(i))
            .attr("y1", 0)
            .attr("y2", windBandHeight);

        // Find the even hours for grid lines first
        const evenHourIdx: number[] = [];
        for (let i = 0; i < N; i++) {
            if (time[i].getHours() % 2 === 0) evenHourIdx.push(i);
        }

        // Now place wind barbs exactly in the middle between even hours
        const windBarbY = windBandHeight / 2;
        for (let idx = 0; idx < evenHourIdx.length - 1; idx++) {
            const startIdx = evenHourIdx[idx];
            const endIdx = evenHourIdx[idx + 1];
            if (width < 400 && idx % 2 !== 0) continue;
            const centerX = (x(startIdx) + x(endIdx)) / 2;
            const dataIdx = Math.floor((startIdx + endIdx) / 2);
            const speed = windSpeed[dataIdx];
            const gust = windGust[dataIdx];
            const dir = windDirection[dataIdx];
            if (typeof speed !== 'number' || typeof dir !== 'number' || isNaN(speed) || isNaN(dir)) continue;
            
            // Convert wind speeds to knots for proper wind barb calculation
            const speedInKnots = convertWindSpeed(speed, windSpeedUnit, "kt");
            const gustInKnots = typeof gust === 'number' && !isNaN(gust) ? convertWindSpeed(gust, windSpeedUnit, "kt") : null;
            
            const minBarbLen = width < 400 ? 18 : 23;
            const maxBarbLen = width < 400 ? 30 : 38;
            const windLenScale = d3.scaleLinear()
                .domain([0, Math.max(15, d3.max(windSpeed.filter(v => typeof v === 'number' && !isNaN(v))) || 20)])
                .range([minBarbLen, maxBarbLen]);
            const barbLen = windLenScale(speed);
            this.drawWindBarb(windBand, centerX, windBarbY, speedInKnots, gustInKnots, dir, barbLen, width < 400 ? 0.7 : 0.8);
        }
    }

    /**
     * Draw a wind barb at the given position
     */
    public drawWindBarb(
        g: any,
        x: number,
        y: number,
        speed: number,
        gust: number | null,
        dirDeg: number,
        len: number,
        scale = 0.8
    ) {
        const featherLong = 12;
        const featherShort = 6;
        const featherYOffset = 3;

        const barbGroup = g.append("g")
            .attr("transform", `translate(${x},${y}) rotate(${(dirDeg) % 360}) scale(${scale})`);

        const y0 = -len / 2, y1 = +len / 2;

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
        
        // Calculate pennants (50 knots each), then full feathers (10 knots), then half feathers (5 knots)
        let n50 = Math.floor(v / 50);
        v -= n50 * 50;
        let n10 = Math.floor(v / 10);
        v -= n10 * 10;
        let n5 = Math.floor(v / 5);
        v -= n5 * 5;

        // Draw pennants (triangles) for 50 knot increments
        for (let i = 0; i < n50; i++, wy += step * 1.5) {
            const pennantHeight = 10;
            const pennantWidth = featherLong;
            barbGroup.append("polygon")
                .attr("class", "wind-barb-pennant")
                .attr("points", `0,${wy} ${pennantWidth},${wy + featherYOffset} 0,${wy + pennantHeight}`)
                .attr("fill", "currentColor")
                .attr("stroke", "currentColor")
                .attr("stroke-width", 1);
        }

        // Draw full feathers for 10 knot increments
        for (let i = 0; i < n10; i++, wy += step) {
            barbGroup.append("line")
                .attr("class", "wind-barb-feather")
                .attr("x1", 0).attr("y1", wy)
                .attr("x2", featherLong).attr("y2", wy + featherYOffset)
                .attr("stroke-width", 2);
        }

        // Draw half feathers for 5 knot increments
        for (let i = 0; i < n5; i++, wy += step) {
            barbGroup.append("line")
                .attr("class", "wind-barb-half")
                .attr("x1", 0).attr("y1", wy)
                .attr("x2", featherShort).attr("y2", wy + featherYOffset / 1.5)
                .attr("stroke-width", 2);
        }

        // Draw gust feathers on the opposite side (left side) in yellow/orange
        // Only show gusts if they are greater than sustained wind speed
        if (typeof gust === 'number' && !isNaN(gust) && gust > speed) {
            let gustWy = y0;
            let gustV = gust; // Show absolute gust speed, not difference
            const gustStep = 7;
            
            // Calculate gust pennants, feathers, and half-feathers (showing absolute gust speed)
            let gustN50 = Math.floor(gustV / 50);
            gustV -= gustN50 * 50;
            let gustN10 = Math.floor(gustV / 10);
            gustV -= gustN10 * 10;
            let gustN5 = Math.floor(gustV / 5);
            
            // Draw gust pennants on the left side for 50 knot increments
            for (let i = 0; i < gustN50; i++, gustWy += gustStep * 1.5) {
                const pennantHeight = 10;
                const pennantWidth = -featherLong; // Negative for left side
                barbGroup.append("polygon")
                    .attr("class", "wind-barb-gust-pennant")
                    .attr("points", `0,${gustWy} ${pennantWidth},${gustWy + featherYOffset} 0,${gustWy + pennantHeight}`)
                    .attr("fill", "#FF8C00")
                    .attr("stroke", "#FF8C00")
                    .attr("stroke-width", 1);
            }
            
            // Draw gust feathers on the left side (negative x values)
            for (let i = 0; i < gustN10; i++, gustWy += gustStep) {
                barbGroup.append("line")
                    .attr("class", "wind-barb-gust-feather")
                    .attr("x1", 0).attr("y1", gustWy)
                    .attr("x2", -featherLong).attr("y2", gustWy + featherYOffset)
                    .attr("stroke", "#FF8C00") // Orange color for gusts
                    .attr("stroke-width", 2);
            }
            
            for (let i = 0; i < gustN5; i++, gustWy += gustStep) {
                barbGroup.append("line")
                    .attr("class", "wind-barb-gust-half")
                    .attr("x1", 0).attr("y1", gustWy)
                    .attr("x2", -featherShort).attr("y2", gustWy + featherYOffset / 1.5)
                    .attr("stroke", "#FFA500") // Slightly lighter orange for half-feathers
                    .attr("stroke-width", 2);
            }
        }
    }
}
