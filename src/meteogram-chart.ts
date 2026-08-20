import * as d3 from 'd3';
import { trnslt } from "./translations";
import { mapHaConditionToMetnoSymbol } from "./weather-entity";
import { convertWindSpeed } from "./conversions";
import { isDaylightAt, sunEventsBetween } from "./solar";

/**
 * Sunrise and sunset marks for the day/night strip.
 *
 * Material Design Icons weather-sunset-up and weather-sunset-down (Apache-2.0, from
 * github.com/Templarian/MaterialDesign), inlined as path data.
 *
 * Home Assistant ships these icons, and the strip originally asked for them through
 * ha-icon. On iPad they did not appear at all: WebKit does not reliably paint a custom
 * element with its own shadow DOM inside a foreignObject inside an SVG. The times beside
 * them rendered, and so did the weather icons — which use the same foreignObject but
 * inject plain markup into a div rather than mounting a component. So foreignObject is
 * fine; ha-icon inside one is not.
 *
 * A path has no such problem: it is ordinary SVG that every renderer draws, it takes its
 * colour from the stylesheet like everything else here, and it costs 1.2 KB. There is no
 * longer a second route to go wrong on a device nobody can attach a debugger to.
 *
 * Both replace the \u2600 and \u263D characters the strip used to draw. Those name the
 * sun and the moon, where what the mark means is the moment one rises or sets: a
 * horizon with an arrow through it says that, and a crescent does not.
 *
 * Both are on the standard 24x24 MDI viewBox and are scaled at draw time.
 */
const MDI_VIEWBOX = 24;
const MDI_SUNRISE = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,16.3L15.82,19.41C16.21,19.8 16.21,20.43 15.82,20.82C15.43,21.21 14.8,21.21 14.41,20.82L12,18.41L9.59,20.82C9.2,21.21 8.57,21.21 8.18,20.82C7.79,20.43 7.79,19.8 8.18,19.41L11.29,16.3C11.5,16.1 11.74,16 12,16C12.26,16 12.5,16.1 12.71,16.3Z";
const MDI_SUNSET = "M3,12H7A5,5 0 0,1 12,7A5,5 0 0,1 17,12H21A1,1 0 0,1 22,13A1,1 0 0,1 21,14H3A1,1 0 0,1 2,13A1,1 0 0,1 3,12M15,12A3,3 0 0,0 12,9A3,3 0 0,0 9,12H15M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M12.71,20.71L15.82,17.6C16.21,17.21 16.21,16.57 15.82,16.18C15.43,15.79 14.8,15.79 14.41,16.18L12,18.59L9.59,16.18C9.2,15.79 8.57,15.79 8.18,16.18C7.79,16.57 7.79,17.21 8.18,17.6L11.29,20.71C11.5,20.9 11.74,21 12,21C12.26,21 12.5,20.9 12.71,20.71Z";


/** Substitute {name} placeholders; trnslt returns a plain string with no
 *  interpolation of its own, so the caller fills them in. */
function fill(template: string, vars: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}
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

        // Keyed by forecast time, so an icon follows its hour as the window advances
        // rather than being rebuilt at whatever slot it lands in.
        const rows = symbolCode.map((code, i) => ({
            code, idx: i, t: data.time?.[i] ? +data.time[i] : i,
        }));

        /** The met.no symbol this slot should show, after the entity mapping. */
        const iconFor = (d: any): string => {
            let name = d.code;
            if (!name) return "";
            if (this.card.entityId && this.card.entityId !== 'none' && this.card._weatherEntityApiInstance) {
                const forecastTime = data.time[d.idx];
                const isDay = this.card.isDaytimeAt(forecastTime);
                name = window.mapHaConditionToMetnoSymbol
                    ? window.mapHaConditionToMetnoSymbol(d.code, forecastTime, isDay)
                    : d.code;
            }
            return name
                .replace(/^lightssleet/, 'lightsleet')
                .replace(/^lightssnow/, 'lightsnow')
                .replace(/^lightrainshowers$/, 'lightrainshowersday')
                .replace(/^rainshowers$/, 'rainshowersday')
                .replace(/^heavyrainshowers$/, 'heavyrainshowersday');
        };

        /**
         * Put the icon into its box, but only when it is not already there.
         *
         * The fetch is asynchronous and appends a div. Now that the element survives a
         * redraw, calling this unconditionally would stack a fresh div on every draw —
         * so the name currently rendered is recorded on the node and compared first.
         */
        const paint = (node: any, d: any, visible: boolean) => {
            if (!visible) {
                node.textContent = "";
                node.__icon = null;
                return;
            }
            const name = iconFor(d);
            if (!name || node.__icon === name) return;
            node.__icon = name;
            if (!this.card.getIconSVG) return;
            this.card.getIconSVG(name).then((svgContent: string) => {
                if (!svgContent || node.__icon !== name) return;
                node.textContent = "";
                const div = document.createElement('div');
                div.style.width = '40px';
                div.style.height = '40px';
                div.innerHTML = svgContent;
                node.appendChild(div);
            });
        };

        const iconX = (d: any) => x(d.idx) - 20;
        const iconY = (d: any) => {
            const temp = temperatureConverted[d.idx];
            return temp !== null ? yTemp(temp) - 40 : -999;
        };
        const iconVisible = (d: any) =>
            temperatureConverted[d.idx] !== null && d.idx % iconInterval === 0;

        const icons = chart.selectAll("foreignObject.weather-icon")
            .data(rows, (d: any) => d.t);
        icons.exit().remove();

        const enteredIcons = icons.enter().append("foreignObject")
            .attr("class", "weather-icon")
            .attr("x", iconX)
            .attr("y", iconY)
            .attr("width", 40)
            .attr("height", 40)
            .attr("opacity", (d: any) => iconVisible(d) ? 1 : 0);

        const allIcons = enteredIcons.merge(icons);
        // Opacity is set outright rather than transitioned: which slots carry an icon is
        // decided by index against the spacing interval, so it flips as the window
        // slides, and fading that in and out would draw the eye to bookkeeping.
        allIcons.attr("opacity", (d: any) => iconVisible(d) ? 1 : 0);
        if (this.animating) {
            icons.transition().duration(MeteogramChart.ANIM_MS)
                .ease(d3.easeCubicOut).attr("x", iconX).attr("y", iconY);
        } else {
            icons.attr("x", iconX).attr("y", iconY);
        }
        allIcons.each((d: any, i: number, nodes: any) => paint(nodes[i], d, iconVisible(d)));
        allIcons.order();
    }
    private card: any;
    constructor(cardInstance: any) {
        this.card = cardInstance;
    }

    /**
     * Ensures D3.js is loaded globally (window.d3). Returns a promise that resolves when D3 is available.
     */
    async ensureD3Loaded(): Promise<void> {
        // D3 is bundled — no dynamic loading needed.
        return;
    }

    /**
     * Day/night strip along the top of the chart.
     *
     * Drawn as a continuous band rather than a marker per event. A meteogram can span
     * ten days, which is around eighteen sunrises and sunsets; as vertical rules those
     * become a thicket, and they would also be indistinguishable from the day-boundary
     * lines, which are already dashed. A band shows the whole structure at a glance and
     * degrades correctly inside the polar circles, where there is no event to mark at
     * all and the honest answer is a strip that is entirely light or entirely dark.
     *
     * It sits between the date labels and the top border, so each day's light and dark
     * hours read directly beneath the day they belong to.
     */
    /** How long an animated change takes. */
    private static readonly ANIM_MS = 450;

    /**
     * Whether this draw should move things or just place them.
     *
     * Off for a resize: elements sliding to new positions while the card is still being
     * dragged is noise. On for everything else, including the first draw, where the
     * enter transitions bring the chart in — and which is the only trigger anyone can
     * reach on demand, a forecast changing only once an hour.
     */
    private get animating(): boolean {
        return !!this.card.animateChanges && !this.card._chartResized;
    }

    /**
     * A path that survives redraws and interpolates to its new shape.
     *
     * The third copy of this was one too many. Each of the temperature line, the
     * pressure line and the cloud band is a single element whose shape is the whole
     * content, so all three want exactly this: keep the element, and either move it or
     * set it outright.
     *
     * Interpolation only when the point count matches. d3 interpolates the `d` string,
     * which is smooth between two paths of the same shape and produces nonsense between
     * paths of different lengths, so a change of span sets the new shape directly.
     *
     * `init` runs only on the first draw, for attributes that never change afterwards.
     * It runs after `d` is set so the serialised attribute order matches what the
     * append-only code produced — the snapshot comparison is byte-level.
     */
    private persistentPath(parent: any, cls: string, d: string, init?: (sel: any) => void): any {
        let sel = parent.select(`path.${cls}`);
        if (sel.empty()) {
            sel = parent.append("path").attr("class", cls).attr("d", d);
            init?.(sel);
            return sel;
        }
        const previous = sel.attr("d") ?? "";
        const sameShape =
            previous.split("L").length === d.split("L").length && previous !== d;
        if (this.animating && sameShape) {
            sel.transition().duration(MeteogramChart.ANIM_MS)
                .ease(d3.easeCubicOut).attr("d", d);
        } else {
            sel.attr("d", d);
        }
        return sel;
    }

    drawSunStrip(
        svg: any,
        time: Date[],
        x: any,
        margin: any,
        chartWidth: number,
        latitude: number,
        longitude: number,
        stripHeight: number,
        stripY: number,
        locale: string = "en",
        timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }
    ) {
        const N = time.length;
        if (N < 2) return;

        const first = time[0];
        const last = time[N - 1];

        // Index-to-pixel is not linear in time: met.no is hourly for the first days and
        // six-hourly after, so an event has to be interpolated within its own bracket.
        const timeToX = (t: Date): number => {
            const ms = t.getTime();
            if (ms <= first.getTime()) return x(0);
            if (ms >= last.getTime()) return x(N - 1);
            for (let i = 1; i < N; i++) {
                const t1 = time[i].getTime();
                if (t1 >= ms) {
                    const t0 = time[i - 1].getTime();
                    const f = t1 === t0 ? 0 : (ms - t0) / (t1 - t0);
                    return x(i - 1) + f * (x(i) - x(i - 1));
                }
            }
            return x(N - 1);
        };

        const events = sunEventsBetween(first, last, latitude, longitude);

        // Boundaries of alternating light and dark runs across the whole window.
        const bounds: Date[] = [first, ...events.map((e) => e.at), last];
        // Absolute, from the layout. Deriving it from margin.top here is exactly the
        // second frame of reference that made adding this band painful the first time.
        const y = stripY;

        const group = svg.append("g").attr("class", "sun-strip");

        // The strip is 10px tall, which is far below a usable touch target, so the tap
        // areas reach up over the glyph row and a little into the plot. Invisible, so
        // they cost nothing visually.
        const TAP_ABOVE = 12;
        const TAP_BELOW = 6;

        // Tap-to-show panel. Kept inside the svg rather than floated over it as HTML:
        // it then shares the chart's viewBox scaling and is cleared with the chart on
        // every redraw, instead of needing its own positioning maths and teardown.
        const tip = group.append("g").attr("class", "sun-strip-tip").style("display", "none");
        const tipBox = tip.append("rect").attr("class", "sun-strip-tip-box").attr("rx", 4);
        const tipText = tip.append("text").attr("class", "sun-strip-tip-text");
        let openKey: string | null = null;

        const hideTip = () => {
            tip.style("display", "none");
            openKey = null;
        };

        const showTip = (key: string, label: string, cx: number) => {
            // Tapping the open target again closes it — the only dismissal gesture that
            // is discoverable without adding a close button to a 10px strip.
            if (openKey === key) {
                hideTip();
                return;
            }
            openKey = key;
            tipText.text(label);
            tip.style("display", null);
            // Measured only once visible: getComputedTextLength reports 0 while the
            // group is display:none.
            const padX = 6;
            const w = (tipText.node() as SVGTextElement).getComputedTextLength() + padX * 2;
            const h = 18;
            // Clamped to the plot, so a run at either end of the window stays readable
            // instead of hanging off the card.
            const left = Math.max(margin.left,
                                  Math.min(cx - w / 2, margin.left + chartWidth - w));
            const top = y + stripHeight + 4;
            tipBox.attr("x", left).attr("y", top).attr("width", w).attr("height", h);
            tipText.attr("x", left + padX).attr("y", top + h - 5);
        };

        // Resolved once per draw rather than once per run.
        //
        // trnslt tries hass.localize, then a resources lookup, then a linear scan of the
        // locale table with a fresh toLowerCase on every call. At the widest window that
        // ran it around forty times for eight distinct strings, all of which are
        // constant for the whole draw. The clock is the same story: a bare
        // toLocaleTimeString builds an Intl formatter per call, where one formatter
        // reused across the strip does not.
        const clockFmt = new Intl.DateTimeFormat(locale, timeOptions);
        const clock = (d: Date) => clockFmt.format(d);
        const t = (key: string, english: string) =>
            trnslt(this.card.hass, `ui.card.meteogram.sun.${key}`, english);
        // Whole phrases rather than a noun plus a stitched-on "until"/"from". Composing
        // those assumes noun-then-phrase word order holds in every language, which is
        // not a safe bet; a full template lets a translator put the pieces wherever
        // their language wants them.
        const runLabel: Record<string, string> = {
            daylight_range: t("daylight_range", "Daylight {start} – {end}"),
            daylight_until: t("daylight_until", "Daylight until {end}"),
            daylight_from: t("daylight_from", "Daylight from {start}"),
            night_range: t("night_range", "Night {start} – {end}"),
            night_until: t("night_until", "Night until {end}"),
            night_from: t("night_from", "Night from {start}"),
        };
        const eventLabel: Record<string, string> = {
            sunrise: t("sunrise", "Sunrise {time}"),
            sunset: t("sunset", "Sunset {time}"),
        };

        for (let i = 0; i < bounds.length - 1; i++) {
            const a = bounds[i];
            const b = bounds[i + 1];
            if (b.getTime() <= a.getTime()) continue;
            // Classify by the middle of the run, so a boundary landing exactly on an
            // event cannot flip the answer.
            const mid = new Date((a.getTime() + b.getTime()) / 2);
            const daylight = isDaylightAt(mid, latitude, longitude);
            const x0 = margin.left + timeToX(a);
            const x1 = margin.left + timeToX(b);
            const rect = group.append("rect")
                .attr("class", daylight ? "sun-strip-day" : "sun-strip-night")
                .attr("x", x0)
                .attr("y", y)
                .attr("width", Math.max(0, Math.min(x1, margin.left + chartWidth) - x0))
                .attr("height", stripHeight);

            // A native <title> rather than a bespoke tooltip: it needs no event
            // handling, survives being re-rendered, and behaves the way the browser and
            // the platform's assistive technology already expect.
            //
            // The first and last runs are cut off by the forecast window rather than by
            // an event, so say so instead of implying the sun did something then.
            const startsAtEvent = i > 0;
            const endsAtEvent = i < bounds.length - 2;
            const kind = daylight ? "daylight" : "night";
            const shape =
                startsAtEvent && endsAtEvent ? "range"
                : endsAtEvent ? "until"
                : startsAtEvent ? "from"
                : "range";
            const label = fill(runLabel[`${kind}_${shape}`],
                               { start: clock(a), end: clock(b) });
            rect.append("title").text(label);

            // A <title> is a hover tooltip, and hover does not exist on the wall tablet
            // this card usually lives on. The same text is reachable by tapping.
            const xEnd = Math.min(x1, margin.left + chartWidth);
            const hit = group.append("rect")
                .attr("class", "sun-strip-hit")
                .attr("x", x0)
                .attr("y", y - TAP_ABOVE)
                .attr("width", Math.max(0, xEnd - x0))
                .attr("height", stripHeight + TAP_ABOVE + TAP_BELOW)
                .on("click", (event: any) => {
                    event.stopPropagation();
                    showTip(`seg${i}`, label, (x0 + xEnd) / 2);
                });
            // The target covers the run it belongs to, so it has to carry the same
            // title. Without this it swallows the pointer and the hover tooltip stops
            // working — the run underneath is never the topmost element any more.
            hit.append("title").text(label);
        }

        // Midnight ticks, taking over from the day-boundary overshoot the strip
        // displaced. Drawn inside the strip rather than above it, so the band stays one
        // object rather than growing spines.
        // Local midnight, which is what a reader means by "midnight". Date.UTC put the
        // tick at 00:00 UTC — two hours late in Norwegian summer time, and wrong by the
        // offset everywhere else. Stepping a whole day at a time would also drift across
        // a daylight-saving boundary, so each day is constructed from its own date parts.
        const midnightsFrom = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        for (let d = new Date(midnightsFrom); d <= last; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
            const midnight = d;
            if (midnight < first || midnight > last) continue;
            const mx = margin.left + timeToX(midnight);
            group.append("line")
                .attr("class", "sun-strip-tick")
                .attr("x1", mx).attr("x2", mx)
                .attr("y1", y).attr("y2", y + stripHeight);
        }

        // A mark per event, but only where there is room, and how much is written
        // depends on how much room there is.
        //
        // This card usually lives on a wall tablet, where the reader glances rather than
        // interacts, so the time is printed beside the glyph whenever it fits: no tap,
        // no hover, just there. Below that width the glyph alone still marks the event
        // and the time stays a tap away, and below *that* the strip's own light and dark
        // runs still read on their own. Three tiers, degrading in that order.
        // Room is measured per event, against its closest neighbour, not as one average
        // across the window. The x scale is by index and met.no is hourly for the first
        // days and six-hourly after, so a day at the far end occupies a quarter of the
        // width a day at the near end does. An average reports plenty of room while the
        // far-end labels overlap; the minimum of the two adjacent gaps does not, and it
        // lets the roomy near end keep its times while the crowded end gives them up.
        const xs = events.map((e) => timeToX(e.at));
        const roomAt = (i: number) => Math.min(
            i > 0 ? xs[i] - xs[i - 1] : Number.POSITIVE_INFINITY,
            i < xs.length - 1 ? xs[i + 1] - xs[i] : Number.POSITIVE_INFINITY
        );
        const GLYPH_SPACING = 34;
        // Clear air required between two neighbouring marks.
        const LABEL_GAP = 6;
        const ICON = 16;
        const ICON_GAP = 2;
        {
            events.forEach((e, gi) => {
                const room = roomAt(gi);
                if (room < GLYPH_SPACING) return;
                const gx = margin.left + timeToX(e.at);
                const glyphLabel = fill(eventLabel[e.type], { time: clock(e.at) });

                // Icon and time are laid out inside one group, so the pair can be
                // measured and centred as a unit.
                // Typed on the group so the stylesheet can colour rise and set apart:
                // the two mdi icons differ only by the direction of a small arrow,
                // which is not readable at this size.
                const mark = group.append("g")
                    .attr("class", "sun-strip-glyph "
                        + (e.type === "sunrise" ? "sun-strip-rise" : "sun-strip-set"));
                mark.append("title").text(glyphLabel);
                mark.append("path")
                    .attr("d", e.type === "sunrise" ? MDI_SUNRISE : MDI_SUNSET)
                    .attr("transform", `scale(${ICON / MDI_VIEWBOX})`);

                // Written with the time, then measured and dropped back to the icon
                // alone if the pair does not fit. Measuring beats a pixel threshold
                // guessed from the English 24-hour form: "5:51 AM" is wider, and a
                // translator cannot be expected to keep to a width nobody told them of.
                const text = mark.append("text")
                    .attr("class", "sun-strip-glyph-timed")
                    .attr("x", ICON + ICON_GAP)
                    .attr("y", ICON * 0.78)
                    .text(clock(e.at));
                const textW = (text.node() as SVGTextElement).getComputedTextLength();
                // Marks are centred on their event, so two neighbours each reach half
                // their width toward each other: they clear when the gap covers one
                // whole mark plus a margin.
                const withTime = ICON + ICON_GAP + textW + LABEL_GAP <= room;
                if (!withTime) text.remove();
                const total = withTime ? ICON + ICON_GAP + textW : ICON;

                // An event near either end would otherwise have half its mark outside
                // the plot. Nudged inward instead: the run boundary underneath still
                // marks the exact moment, so the mark may drift from it slightly
                // without misleading anyone.
                const half = total / 2;
                const cx = Math.max(margin.left + half,
                                    Math.min(gx, margin.left + chartWidth - half));
                mark.attr("transform", `translate(${cx - half},${y - 2 - ICON})`);

                // Added after the run targets, so a tap near an event reports the
                // event's own time rather than the run it happens to fall inside.
                const hitHalf = Math.max(14, half);
                group.append("rect")
                    .attr("class", "sun-strip-hit")
                    .attr("x", gx - hitHalf)
                    .attr("y", y - TAP_ABOVE)
                    .attr("width", hitHalf * 2)
                    .attr("height", stripHeight + TAP_ABOVE + TAP_BELOW)
                    .on("click", (event: any) => {
                        event.stopPropagation();
                        showTip(`evt${gi}`, glyphLabel, gx);
                    })
                    .append("title").text(glyphLabel);
            });
        }

        // Drawn last so the panel is never hidden behind a segment or glyph added after
        // it. Namespaced so it cannot clobber another handler on the same svg.
        tip.raise();
        // The root svg, not the group this drawer was handed. Since each drawer got its
        // own layer, `svg` here is that layer — attaching the dismissal to it meant a
        // tap anywhere else on the chart no longer closed the panel, because it never
        // reached this element.
        const rootNode = svg.node()?.ownerSVGElement ?? svg.node();
        d3.select(rootNode).on("click.sunstrip", hideTip);
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

    drawBottomHourLabels(svg: any, time: Date[], margin: any, x: any, windBandHeight: number, _width: number) {
        const hourLabelY = margin.top + this.card._chartHeight + windBandHeight + 15;
        
        // Detect transition from hourly to 6-hourly data
        let transitionIdx = time.length;
        for (let i = 1; i < time.length - 1; i++) {
            const interval1 = (time[i].getTime() - time[i - 1].getTime()) / (1000 * 60 * 60);
            const interval2 = (time[i + 1].getTime() - time[i].getTime()) / (1000 * 60 * 60);
            
            if (interval1 <= 1.5 && interval2 > 3) {
                transitionIdx = i + 1;
                break;
            }
        }
        
        // Create a temporary text element to measure label widths
        const tempText = svg.append("text")
            .attr("class", "bottom-hour-label")
            .style("visibility", "hidden");
        
        // Format all hour strings and measure their widths
        const labelData = time.map((d: Date, i: number) => {
            const hourStr = d.getHours().toString().padStart(2, '0');
            tempText.text(hourStr);
            const bbox = (tempText.node() as SVGTextElement).getBBox();
            
            return {
                index: i,
                hour: d.getHours(),
                hourStr: hourStr,
                xPos: margin.left + x(i),
                width: bbox.width,
                isHighRes: i < transitionIdx
            };
        });
        
        tempText.remove();
        
        const avgLabelWidth = labelData.reduce((sum, d) => sum + d.width, 0) / labelData.length;
        const minSpacing = avgLabelWidth + 8;
        
        // Separate high-res and low-res sections
        const highResLabels = labelData.filter(d => d.isHighRes);
        const lowResLabels = labelData.filter(d => !d.isHighRes);
        
        const labelsToShow: number[] = [];
        
        // Strategy: Start from low-res section (establish pattern at day boundaries),
        // then work backwards into high-res section with compatible interval
        
        let patternHours: number[] = [];
        
        // Low-res section: establish pattern using consistent data point intervals
        if (lowResLabels.length > 0) {
            // Find labels at or near day boundaries (hour 0 or close to it) to use as starting point
            const dayBoundaries = lowResLabels.filter(d => {
                const distToMidnight = Math.min(Math.abs(d.hour - 0), Math.abs(d.hour - 24));
                return distToMidnight <= 1; // Strict midnight check
            });
            
            // Determine starting index: prefer midnight, otherwise use first point
            let startIdx = 0;
            let anchorHour = lowResLabels[0].hour;
            
            if (dayBoundaries.length > 0) {
                // Find the index in lowResLabels array
                startIdx = lowResLabels.findIndex(d => d.index === dayBoundaries[0].index);
                anchorHour = dayBoundaries[0].hour;
            }
            
            // Try different step sizes: every 2nd point (12h for 6h data), every 4th point (24h for 6h data)
            const stepSizes = [2, 4];
            let selectedPattern: typeof lowResLabels = [];
            let selectedStep = 2;
            
            for (const step of stepSizes) {
                const pattern: typeof lowResLabels = [];
                
                // Select every Nth point starting from startIdx
                for (let i = startIdx; i < lowResLabels.length; i += step) {
                    pattern.push(lowResLabels[i]);
                }
                
                if (pattern.length < 1) continue;
                
                // Verify spacing
                let spacingOk = true;
                if (pattern.length >= 2) {
                    for (let i = 1; i < pattern.length; i++) {
                        const spacing = pattern[i].xPos - pattern[i - 1].xPos;
                        if (spacing < minSpacing) {
                            spacingOk = false;
                            break;
                        }
                    }
                }
                
                if (spacingOk) {
                    selectedPattern = pattern;
                    selectedStep = step;
                    break;
                }
            }
            
            if (selectedPattern.length > 0) {
                selectedPattern.forEach(d => labelsToShow.push(d.index));
                // Establish the hour pattern for high-res section
                // Step 2 = 12h intervals, step 4 = 24h intervals (assuming 6h low-res data)
                if (selectedStep === 2) {
                    patternHours = [anchorHour, (anchorHour + 12) % 24];
                } else {
                    patternHours = [anchorHour];
                }
            } else {
                // Fallback: show only at day boundaries or first point
                if (dayBoundaries.length > 0) {
                    dayBoundaries.forEach(d => labelsToShow.push(d.index));
                    patternHours = [dayBoundaries[0].hour];
                } else {
                    labelsToShow.push(lowResLabels[0].index);
                    patternHours = [lowResLabels[0].hour];
                }
            }
        }
        
        // Fallback: if no pattern established yet (no low-res data), establish from high-res data
        if (patternHours.length === 0 && highResLabels.length > 0) {
            // Find labels at or near day boundaries in high-res data
            const dayBoundaries = highResLabels.filter(d => {
                const distToMidnight = Math.min(Math.abs(d.hour - 0), Math.abs(d.hour - 24));
                return distToMidnight <= 1; // Strict boundary check for hourly data
            });
            
            if (dayBoundaries.length > 0) {
                // Use midnight as anchor
                const anchorHour = dayBoundaries[0].hour;
                
                // Try progressive intervals: 2h, 3h, 4h, 6h, 12h
                const testIntervals = [2, 3, 4, 6, 12];
                let foundPattern = false;
                
                for (const interval of testIntervals) {
                    const candidates = highResLabels.filter(d => {
                        const hourDiff = (d.hour - anchorHour + 24) % 24;
                        return hourDiff % interval === 0;
                    });
                    
                    if (candidates.length < 2) continue;
                    
                    // Check spacing
                    let hasEnoughSpace = true;
                    for (let i = 1; i < candidates.length; i++) {
                        const spacing = candidates[i].xPos - candidates[i - 1].xPos;
                        if (spacing < minSpacing) {
                            hasEnoughSpace = false;
                            break;
                        }
                    }
                    
                    if (hasEnoughSpace) {
                        candidates.forEach(d => labelsToShow.push(d.index));
                        patternHours = [anchorHour]; // Pattern established
                        foundPattern = true;
                        break;
                    }
                }
                
                if (!foundPattern) {
                    // Last resort: show only day boundaries
                    dayBoundaries.forEach(d => labelsToShow.push(d.index));
                    patternHours = [anchorHour];
                }
            } else {
                // No day boundaries found, use evenly spaced labels
                const totalLabels = highResLabels.length;
                let step = 1;
                
                // Calculate step to ensure minimum spacing
                while (step < totalLabels) {
                    const testIndices = [];
                    for (let i = 0; i < totalLabels; i += step) {
                        testIndices.push(i);
                    }
                    
                    if (testIndices.length < 2) break;
                    
                    let hasEnoughSpace = true;
                    for (let i = 1; i < testIndices.length; i++) {
                        const spacing = highResLabels[testIndices[i]].xPos - highResLabels[testIndices[i - 1]].xPos;
                        if (spacing < minSpacing) {
                            hasEnoughSpace = false;
                            break;
                        }
                    }
                    
                    if (hasEnoughSpace) {
                        testIndices.forEach(i => labelsToShow.push(highResLabels[i].index));
                        patternHours = [highResLabels[0].hour]; // Use first hour as pattern
                        break;
                    }
                    
                    step++;
                }
                
                // Ultimate fallback: show first and last
                if (labelsToShow.length === 0) {
                    labelsToShow.push(highResLabels[0].index);
                    if (highResLabels.length > 1) {
                        labelsToShow.push(highResLabels[highResLabels.length - 1].index);
                    }
                    patternHours = [highResLabels[0].hour];
                }
            }
        }
        
        // High-res section: match the pattern established in low-res (only if pattern came from low-res data)
        if (highResLabels.length > 0 && patternHours.length > 0 && lowResLabels.length > 0) {
            // Get x positions of already-selected labels (from low-res section)
            const existingLabelPositions = labelsToShow.map(idx => labelData[idx].xPos);
            
            // Try 2-hour intervals that align with the low-res pattern
            const anchorHour = patternHours[0];
            
            // Test different intervals (2h, 3h, 4h) that maintain alignment
            const intervals = [2, 3, 4];
            let selectedHighRes: typeof highResLabels = [];
            
            for (const interval of intervals) {
                // Filter to hours that match: anchorHour + N * interval (mod 24)
                let candidates = highResLabels.filter(d => {
                    const hourDiff = (d.hour - anchorHour + 24) % 24;
                    return hourDiff % interval === 0;
                });
                
                // Filter out candidates too close to existing labels (from low-res section)
                candidates = candidates.filter(d => {
                    for (const existingPos of existingLabelPositions) {
                        if (Math.abs(d.xPos - existingPos) < minSpacing) {
                            return false;
                        }
                    }
                    return true;
                });
                
                if (candidates.length < 2) continue;
                
                // Check spacing between candidates themselves
                let hasEnoughSpace = true;
                for (let i = 1; i < candidates.length; i++) {
                    const spacing = candidates[i].xPos - candidates[i - 1].xPos;
                    if (spacing < minSpacing) {
                        hasEnoughSpace = false;
                        break;
                    }
                }
                
                if (hasEnoughSpace) {
                    selectedHighRes = candidates;
                    break;
                }
            }
            
            if (selectedHighRes.length > 0) {
                selectedHighRes.forEach(d => labelsToShow.push(d.index));
            } else {
                // Fallback: show first high-res label if not too close to existing labels
                let addedFirst = false;
                for (const existingPos of existingLabelPositions) {
                    if (Math.abs(highResLabels[0].xPos - existingPos) < minSpacing) {
                        addedFirst = true;
                        break;
                    }
                }
                if (!addedFirst) {
                    labelsToShow.push(highResLabels[0].index);
                }
                
                // Try to add last high-res label if spacing allows
                if (highResLabels.length > 1) {
                    let canAddLast = true;
                    for (const existingPos of existingLabelPositions) {
                        if (Math.abs(highResLabels[highResLabels.length - 1].xPos - existingPos) < minSpacing) {
                            canAddLast = false;
                            break;
                        }
                    }
                    if (canAddLast) {
                        labelsToShow.push(highResLabels[highResLabels.length - 1].index);
                    }
                }
            }
        }
        
        // Draw labels
        svg.selectAll(".bottom-hour-label")
            .data(labelData)
            .enter()
            .append("text")
            .attr("class", "bottom-hour-label")
            .attr("x", (d: any) => d.xPos)
            .attr("y", hourLabelY)
            .attr("text-anchor", "middle")
            .attr("opacity", (d: any) => labelsToShow.includes(d.index) ? 1 : 0)
            .text((d: any) => d.hourStr);
    }

    drawTemperatureLine(chart: any, temperature: (number|null)[], x: any, yTemp: any, legendX?: number, legendY?: number) {

        // Create a gradient that transitions from blue (cold/below freezing) to red (warm/above freezing)
        // Use userSpaceOnUse so we can position gradient stops at exact Y coordinates
        // The layer is no longer cleared for us — the path has to survive for the
        // transition below to have anywhere to start from. Everything else in here is
        // still rebuilt each draw, so it is removed by hand until it too is converted.
        chart.selectAll(":scope > *:not(path.temp-line)").remove();

        const gradientId = `temp-gradient-${Math.random().toString(36).substr(2, 9)}`;
        
        const defs = chart.append("defs");
        
        // Get the temperature domain and calculate actual Y positions
        const tempDomain = yTemp.domain(); // [min, max] in temperature units
        const minTemp = tempDomain[0];
        const maxTemp = tempDomain[1];
        const minTempY = yTemp(minTemp); // Bottom of temperature range
        const maxTempY = yTemp(maxTemp); // Top of temperature range
        
        
        const gradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")  // Use absolute SVG coordinates
            .attr("x1", 0)
            .attr("y1", maxTempY)    // Y position of warmest temperature
            .attr("x2", 0)
            .attr("y2", minTempY);   // Y position of coldest temperature

        // Calculate the Y position of 0°C
        const freezingPoint = 0;
        const freezingYPos = yTemp(freezingPoint);
        const gradientRange = minTempY - maxTempY; // Total Y distance of gradient
        

        // Helper function to calculate offset percentage within the gradient
        const calcOffset = (yPos: number): number => {
            return ((yPos - maxTempY) / gradientRange) * 100;
        };

        // Create gradient stops
        const gradientStops: Array<{temp: number, offset: number, color: string}> = [];
        
        // If freezing point is below the visible range (all temps above freezing)
        if (minTemp > freezingPoint) {
            // Warm colors: orange at coolest (still above 0°C) to deep red at warmest
            gradientStops.push({temp: maxTemp, offset: 0, color: maxTemp >= 20 ? "#cc0000" : "#ff3300"});
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", maxTemp >= 20 ? "#cc0000" : "#ff3300");
            
            // Add 20°C transition if in range
            if (maxTemp > 20 && minTemp < 20) {
                const temp20Y = yTemp(20);
                const offset20 = calcOffset(temp20Y);
                gradientStops.push({temp: 20, offset: offset20, color: "#cc0000"});
                gradient.append("stop")
                    .attr("offset", `${offset20.toFixed(1)}%`)
                    .attr("stop-color", "#cc0000");
            }
            
            gradientStops.push({temp: minTemp, offset: 100, color: "#ff9933"});
            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#ff9933");
        }
        // If freezing point is above the visible range (all temps below freezing)
        else if (maxTemp < freezingPoint) {
            // Cold colors: light blue at warmest (still below 0°C) to deep blue at coldest
            gradientStops.push({temp: maxTemp, offset: 0, color: "#66b3ff"});
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#66b3ff");
            
            // Add -5°C transition if in range
            if (maxTemp > -5 && minTemp < -5) {
                const tempMinus5Y = yTemp(-5);
                const offsetMinus5 = calcOffset(tempMinus5Y);
                gradientStops.push({temp: -5, offset: offsetMinus5, color: "#0066cc"});
                gradient.append("stop")
                    .attr("offset", `${offsetMinus5.toFixed(1)}%`)
                    .attr("stop-color", "#0066cc");
            }
            
            gradientStops.push({temp: minTemp, offset: 100, color: minTemp <= -5 ? "#003d7a" : "#0066cc"});
            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", minTemp <= -5 ? "#003d7a" : "#0066cc");
        }
        // Freezing point is within the visible range - transition AT 0°C
        else {
            
            const freezingOffset = calcOffset(freezingYPos);
            
            // Warmest temperature - check if >= 20°C for deep red
            const warmestColor = maxTemp >= 20 ? "#cc0000" : "#ff3300";
            gradientStops.push({temp: maxTemp, offset: 0, color: warmestColor});
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", warmestColor);

            // Add 20°C deep red transition if in range
            if (maxTemp > 20 && 20 > freezingPoint) {
                const temp20Y = yTemp(20);
                const offset20 = calcOffset(temp20Y);
                gradientStops.push({temp: 20, offset: offset20, color: "#cc0000"});
                gradient.append("stop")
                    .attr("offset", `${offset20.toFixed(1)}%`)
                    .attr("stop-color", "#cc0000");
            }

            // Add 10°C orange-red transition if in range
            if (maxTemp > 10 && minTemp < 10 && 10 > freezingPoint) {
                const temp10Y = yTemp(10);
                const offset10 = calcOffset(temp10Y);
                gradientStops.push({temp: 10, offset: offset10, color: "#ff6600"});
                gradient.append("stop")
                    .attr("offset", `${offset10.toFixed(1)}%`)
                    .attr("stop-color", "#ff6600");
            }

            // At freezing point from above: light orange (warm side of transition)
            gradientStops.push({temp: freezingPoint, offset: freezingOffset, color: "#ff9933"});
            gradient.append("stop")
                .attr("offset", `${freezingOffset.toFixed(1)}%`)
                .attr("stop-color", "#ff9933");
            
            // At freezing point from below: light blue (cold side of transition)
            gradientStops.push({temp: freezingPoint, offset: freezingOffset, color: "#66b3ff"});
            gradient.append("stop")
                .attr("offset", `${freezingOffset.toFixed(1)}%`)
                .attr("stop-color", "#66b3ff");

            // Add -5°C deep blue transition if in range
            if (minTemp < -5 && maxTemp > -5 && -5 < freezingPoint) {
                const tempMinus5Y = yTemp(-5);
                const offsetMinus5 = calcOffset(tempMinus5Y);
                gradientStops.push({temp: -5, offset: offsetMinus5, color: "#0066cc"});
                gradient.append("stop")
                    .attr("offset", `${offsetMinus5.toFixed(1)}%`)
                    .attr("stop-color", "#0066cc");
            }

            // Coldest temperature - check if <= -5°C for very deep blue
            const coldestColor = minTemp <= -5 ? "#003d7a" : "#0066cc";
            gradientStops.push({temp: minTemp, offset: 100, color: coldestColor});
            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", coldestColor);
        }

        this.card._debugLog(
            `[gradient] ${gradientId}: ${minTemp.toFixed(1)}..${maxTemp.toFixed(1)}\u00B0C, `
            + `${gradientStops.length} stops`, gradientStops);

        const line = d3.line<number | null>()
            .defined((d: number | null) => d !== null)
            .x((_: number | null, i: number) => x(i))
            .y((_: number | null, i: number) => temperature[i] !== null ? yTemp(temperature[i]) : 0)
            .curve(d3.curveMonotoneX);

        
        // Check if user has set a custom color that would override the gradient
        const tempLineColorVar = getComputedStyle(this.card).getPropertyValue('--meteogram-temp-line-color');
        const hasCustomColor = tempLineColorVar && tempLineColorVar.trim();
        
        if (hasCustomColor) {
            this.card._debugLog(`⚠️ CSS variable --meteogram-temp-line-color is set to "${tempLineColorVar.trim()}" - using custom color instead of gradient`);
        } else {
        }
        
        // One persistent element, so d3 interpolates from wherever the line currently
        // is straight out of the DOM.
        const tempPath = this.persistentPath(chart, "temp-line", line(temperature) ?? "");
        tempPath.datum(temperature);
        
        // Apply either custom color or gradient
        if (hasCustomColor) {
            tempPath.style("stroke", tempLineColorVar.trim());
        } else {
            tempPath.attr("stroke", `url(#${gradientId})`);
        }

        // Verify the gradient was added to the DOM
        const gradientElement = chart.select(`#${gradientId}`);
        if (gradientElement.empty()) {
            this.card._debugLog(`⚠️ WARNING: Gradient element #${gradientId} not found in DOM!`);
        } else {
            const stops = gradientElement.selectAll('stop');
        }

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

    drawChartGrid(svg: any, chart: any, d3: any, x: any, yTemp: any, N: number, margin: any, dayStarts: number[], tickOvershoot: number = 12) {
        // Day boundary ticks. They normally poke 12px above the top line to mark
        // midnight; with the sun strip enabled that space belongs to the strip, which
        // marks midnight itself, so the caller passes 0 and the tick stops at the line.
        const tickLength = tickOvershoot;
        svg.selectAll(".day-tic")
            .data(dayStarts)
            .enter()
            .append("line")
            .attr("class", "day-tic")
            .attr("x1", (d: number) => margin.left + x(d))
            .attr("x2", (d: number) => margin.left + x(d))
            .attr("y1", margin.top - tickLength)
            .attr("y2", this.card._chartHeight + margin.top);
        // Stroke, width and opacity come from the stylesheet, which already has a
        // `.day-tic` rule using --meteogram-grid-color. They used to be set inline here
        // as #1a237e, and an inline attribute beats the rule — so the variable existed,
        // was documented, and did nothing.


        // Always add temperature Y axis (left side)
        chart.append("g")
            .attr("class", "temperature-axis")
            .call(d3.axisLeft(yTemp)
                .tickFormat((d: any) => `${d}`));

        // Add temperature Y axis for horizontal grid lines (no numbers)
        chart.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yTemp)
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
        N: number,
        /** Forecast times, used as the join key — see joinBars. */
        time: Date[],
        x: any,
        yPrecip: any,
        dx: number,
        legendX?: number,
        legendY?: number
    ) {
        const barWidth = dx * 0.8;

        // Stage 3 of animating updates: the bars are a keyed join.
        //
        // Keyed by hour index, so a bar keeps its identity between redraws — the same
        // hour's bar grows or shrinks instead of being destroyed and rebuilt. Rain is
        // the case worth doing first because bars genuinely appear and vanish as the
        // forecast changes, which is what enter and exit are for.
        //
        // The labels below are still enter-only, so they are cleared by hand here: the
        // rain layer no longer clears itself, because a join needs its elements to
        // survive the draw in order to match them.
        chart.selectAll(".rain-label, .rain-max-label").remove();

        const animate = this.animating;
        const DUR = 450;
        /** Height of a bar, with the 2px floor that keeps a trace of rain visible. */
        const barHeight = (v: number) => {
            const h = this.card._chartHeight - yPrecip(v);
            return h < 2 && v > 0 ? 2 : h * 0.7;
        };
        const barX = (d: any) => x(d.index) + dx / 2 - barWidth / 2;
        const barY = (d: any) => yPrecip(0) - barHeight(d.value);
        const baseline = yPrecip(0);

        /**
         * Join one set of bars, growing new ones out of the baseline and shrinking
         * departing ones back into it.
         *
         * Attributes are set in the order the enter-only code used, so the serialised
         * output is unchanged — the snapshot comparison is byte-level and would
         * otherwise fail on attribute order alone.
         */
        const joinBars = (cls: string, rows: any[]): any => {
            // Keyed by the forecast time, not the array index.
            //
            // A forecast is a window that slides: an hour later the earliest slot is
            // gone and everything has shifted down one index. Keyed by index, the bar
            // for 14:00 would silently become the bar for 15:00 — the element keeps its
            // identity while the thing it represents changes underneath it, so values
            // morph in place instead of the chart moving. Keyed by time, 14:00 stays
            // 14:00 and slides left, hours that fall off the start exit, and new hours
            // enter at the far end.
            const sel = chart.selectAll(`rect.${cls}`).data(rows, (d: any) => d.t);

            const leaving = sel.exit();
            if (animate) {
                leaving.transition().duration(DUR)
                    .attr("y", baseline).attr("height", 0).remove();
            } else {
                leaving.remove();
            }

            const entering = sel.enter().append("rect")
                .attr("class", cls)
                .attr("x", barX)
                .attr("y", barY)
                .attr("width", barWidth)
                .attr("height", (d: any) => barHeight(d.value))
                .attr("fill", "currentColor");
            if (animate) entering.attr("y", baseline).attr("height", 0);

            const all = entering.merge(sel);
            if (animate) {
                all.transition().duration(DUR)
                    .attr("x", barX).attr("y", barY)
                    .attr("width", barWidth)
                    .attr("height", (d: any) => barHeight(d.value));
            } else {
                all.attr("x", barX).attr("y", barY)
                    .attr("width", barWidth)
                    .attr("height", (d: any) => barHeight(d.value));
            }
            // Entering elements are appended at the end, so without this the document
            // order drifts away from the data order every time a bar appears.
            all.order();
            return all;
        };

        // Only draw rainMax bars if precipitation min/max data is available
        if (this.card._dataAvailability.precipitationMinMax) {
            // Draw the max rain range bars first (only for non-null values)
            const rainMaxData = rainMax.slice(0, N - 1)
                .map((d, i) => ({ value: d, index: i, t: time[i] ? +time[i] : i }))
                .filter(d => d.value !== null && d.value > 0);
            joinBars("rain-max-bar", rainMaxData);
        } else {
            joinBars("rain-max-bar", []);
        }

        // Draw main rain bars (foreground, deeper blue) - filter out null values
        const rainBarData = rain.slice(0, N - 1)
                .map((d, i) => ({ value: d, index: i, t: time[i] ? +time[i] : i }))
                .filter(d => d.value !== null && d.value > 0);
        
        // Raised over the max bars: the two sets share a layer, and a max bar entering
        // on a later redraw would otherwise be appended after the rain bars and paint
        // over them. No effect on a first render, where they are already in this order.
        joinBars("rain-bar", rainBarData).raise();

        // Add main rain labels (show if rain > 0) - filter out null values
        const rainLabelData = rain.slice(0, N - 1).map((d, i) => ({ value: d, index: i })).filter(d => d.value !== null && d.value > 0);
        
        // Measure label widths and determine which to show
        const tempRainText = chart.append("text")
            .attr("class", "rain-label")
            .style("visibility", "hidden");
        
        const rainLabelsWithWidth = rainLabelData.map((d: any) => {
            const labelText = d.value < 1 ? d.value.toFixed(1) : d.value.toFixed(0);
            tempRainText.text(labelText);
            const bbox = (tempRainText.node() as SVGTextElement).getBBox();
            return {
                ...d,
                labelText,
                xPos: x(d.index) + dx / 2,
                width: bbox.width
            };
        });
        
        tempRainText.remove();
        
        // Sort by value (descending) to prioritize showing higher values
        const sortedRainLabels = [...rainLabelsWithWidth].sort((a, b) => b.value - a.value);
        
        // Determine which labels to show (avoid overlaps)
        const minGap = 4; // Minimum pixels between rain labels
        const rainLabelsToShow = new Set<number>();
        const occupiedRanges: Array<{start: number, end: number}> = [];
        
        for (const label of sortedRainLabels) {
            const labelStart = label.xPos - label.width / 2;
            const labelEnd = label.xPos + label.width / 2;
            
            // Check if this label overlaps with any already shown label
            const overlaps = occupiedRanges.some(range => 
                (labelStart - minGap < range.end) && (labelEnd + minGap > range.start)
            );
            
            if (!overlaps) {
                rainLabelsToShow.add(label.index);
                occupiedRanges.push({start: labelStart, end: labelEnd});
            }
        }
        
        chart.selectAll(".rain-label")
            .data(rainLabelsWithWidth)
            .enter()
            .append("text")
            .attr("class", "rain-label")
            .attr("x", (d: any) => d.xPos)
            .attr("y", (d: any) => {
                const h = this.card._chartHeight - yPrecip(d.value);
                const scaledH = h < 2 && d.value > 0 ? 2 : h * 0.7;
                return yPrecip(0) - scaledH - 4; // 4px above the top of the bar
            })
            .attr("text-anchor", "middle")
            .text((d: any) => d.labelText)
            .attr("opacity", (d: any) => rainLabelsToShow.has(d.index) ? 1 : 0);

        // Add max rain labels (only if precipitation min/max data is available)
        if (this.card._dataAvailability.precipitationMinMax) {
            const rainMaxLabelData = rainMax.slice(0, N - 1).map((d, i) => ({ value: d, index: i })).filter(d => d.value !== null);
            
            // Measure label widths and determine which to show
            const tempMaxText = chart.append("text")
                .attr("class", "rain-max-label")
                .style("visibility", "hidden");
            
            const rainMaxLabelsWithWidth = rainMaxLabelData.map((d: any) => {
                const rainValue = rain?.[d.index] ?? 0;
                const labelText = d.value < 1 ? d.value.toFixed(1) : d.value.toFixed(0);
                tempMaxText.text(labelText);
                const bbox = (tempMaxText.node() as SVGTextElement).getBBox();
                return {
                    ...d,
                    rainValue,
                    labelText,
                    xPos: x(d.index) + dx / 2,
                    width: bbox.width,
                    shouldShow: d.value > rainValue
                };
            }).filter((d: any) => d.shouldShow);
            
            tempMaxText.remove();
            
            // Sort by value (descending) to prioritize showing higher max values
            const sortedMaxLabels = [...rainMaxLabelsWithWidth].sort((a, b) => b.value - a.value);
            
            // Determine which labels to show (avoid overlaps)
            const minGap = 4;
            const rainMaxLabelsToShow = new Set<number>();
            const maxOccupiedRanges: Array<{start: number, end: number}> = [];
            
            for (const label of sortedMaxLabels) {
                const labelStart = label.xPos - label.width / 2;
                const labelEnd = label.xPos + label.width / 2;
                
                const overlaps = maxOccupiedRanges.some(range => 
                    (labelStart - minGap < range.end) && (labelEnd + minGap > range.start)
                );
                
                if (!overlaps) {
                    rainMaxLabelsToShow.add(label.index);
                    maxOccupiedRanges.push({start: labelStart, end: labelEnd});
                }
            }
            
            chart.selectAll(".rain-max-label")
                .data(rainMaxLabelsWithWidth)
                .enter()
                .append("text")
                .attr("class", "rain-max-label")
                .attr("x", (d: any) => d.xPos)
                .attr("y", (d: any) => {
                    const h = this.card._chartHeight - yPrecip(d.value);
                    const scaledH = h < 2 && d.value > 0 ? 2 : h * 0.7;
                    return yPrecip(0) - scaledH - 18; // 18px above the top of the max bar
                })
                .attr("text-anchor", "middle")
                .text((d: any) => d.labelText)
                .attr("opacity", (d: any) => rainMaxLabelsToShow.has(d.index) ? 1 : 0);
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
        // Still cleared by hand: the legend below is built fresh each draw.
        chart.selectAll(":scope > *:not(path.cloud-area)").remove();
        this.persistentPath(chart, "cloud-area", d3.line()
            .x((d: [number, number]) => d[0])
            .y((d: [number, number]) => d[1])
            .curve(d3.curveLinearClosed)(cloudBandPoints) ?? "");
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
    //
        const pressureLine = d3.line<number | null>()
            .defined((d: number | null) => d !== null && typeof d === "number" && !isNaN(d))
            .x((_: number | null, i: number) => x(i))
            .y((d: number | null) => yPressure(d as number));

        // Still cleared by hand: the axis and legend below are built fresh each draw.
        chart.selectAll(":scope > *:not(path.pressure-line)").remove();
        this.persistentPath(chart, "pressure-line", pressureLine(pressure) ?? "",
            // Ensure no area fill, let CSS handle stroke
            (sel: any) => sel.attr("fill", "none")).datum(pressure);

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
                .tickFormat(d3.format('d') as any));

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
        const windBandYOffset = margin.top + this.card._chartHeight;
        // Select-or-append: the layer no longer clears itself, so appending a fresh
        // group each draw would stack a new copy of the whole band every time.
        // By structure, not a class: it is the layer's only child group, so no marker
        // attribute is needed and the serialised output is unchanged.
        let windBand = svg.select(":scope > g");
        if (windBand.empty()) {
            windBand = svg.append('g')
                .attr('transform', `translate(${margin.left},${windBandYOffset})`);
        } else {
            windBand.attr('transform', `translate(${margin.left},${windBandYOffset})`);
        }
        // Everything except the barb groups is still rebuilt each draw.
        windBand.selectAll(":scope > :not(g)").remove();

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

        // Detect where data transitions from hourly to 6-hourly
        // Check intervals throughout the dataset
        const intervals: number[] = [];
        for (let i = 1; i < N; i++) {
            const intervalHours = (time[i].getTime() - time[i-1].getTime()) / (1000 * 60 * 60);
            intervals.push(intervalHours);
        }
        
        // Find where transition happens (interval jumps from ~1h to 6h)
        let transitionIdx = N; // Default: no transition
        for (let i = 1; i < intervals.length; i++) {
            if (intervals[i-1] < 3 && intervals[i] >= 4) {
                transitionIdx = i;
                break;
            }
        }
        
        // Build indices for wind barbs
        const windBarbIndices: number[] = [];
        
        // For hourly section: use even hours, place barbs between them
        const highResIndices: number[] = [];
        for (let i = 0; i < Math.min(transitionIdx, N); i++) {
            if (time[i].getHours() % 2 === 0) highResIndices.push(i);
        }
        
        // For 6-hourly section: use all data points directly
        const lowResIndices: number[] = [];
        for (let i = transitionIdx; i < N; i++) {
            lowResIndices.push(i);
        }
        
        // Create wind length scale once for all barbs
        const minBarbLen = width < 400 ? 18 : 23;
        const maxBarbLen = width < 400 ? 30 : 38;
        const windLenScale = d3.scaleLinear()
            .domain([0, Math.max(15, (d3.max(windSpeed.filter((v): v is number => typeof v === 'number' && !isNaN(v))) ?? 20))])
            .range([minBarbLen, maxBarbLen]);
        
        // Now place wind barbs 
        const windBarbY = windBandHeight / 2;
        const barbs: Array<{ t: number; cx: number; speed: number;
                             gust: number | null; dir: number; len: number }> = [];
        
        // Draw high-resolution barbs (between even hours)
        for (let idx = 0; idx < highResIndices.length - 1; idx++) {
            const startIdx = highResIndices[idx];
            const endIdx = highResIndices[idx + 1];
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
            
            const barbLen = windLenScale(speed);
            barbs.push({ t: time[dataIdx] ? +time[dataIdx] : dataIdx, cx: centerX,
                         speed: speedInKnots, gust: gustInKnots, dir, len: barbLen });
        }
        
        // Draw low-resolution barbs (every other point for 6-hourly data = 12-hour intervals)
        for (let i = 0; i < lowResIndices.length; i++) {
            const dataIdx = lowResIndices[i];
            
            // For 6-hourly data, show every other point (12-hour intervals)
            // This is timezone-agnostic and adapts to when the data starts
            if (i % 2 !== 0) continue;
            
            if (width < 400 && i % 4 !== 0) continue; // On narrow screens, show every 24 hours (every 4th 6-hourly point)
            
            const speed = windSpeed[dataIdx];
            const gust = windGust[dataIdx];
            const dir = windDirection[dataIdx];
            
            if (typeof speed !== 'number' || typeof dir !== 'number' || isNaN(speed) || isNaN(dir)) continue;
            
            // Convert wind speeds to knots for proper wind barb calculation
            const speedInKnots = convertWindSpeed(speed, windSpeedUnit, "kt");
            const gustInKnots = typeof gust === 'number' && !isNaN(gust) ? convertWindSpeed(gust, windSpeedUnit, "kt") : null;
            
            const barbLen = windLenScale(speed);
            barbs.push({ t: time[dataIdx] ? +time[dataIdx] : dataIdx, cx: x(dataIdx),
                         speed: speedInKnots, gust: gustInKnots, dir, len: barbLen });
        }

        // One barb per forecast slot, keyed by time so a barb slides to its new position
        // as the window advances rather than being destroyed and rebuilt somewhere else.
        //
        // Selected by structure rather than a class: these groups are the only direct <g>
        // children of the wind band, so no marker attribute is needed and the serialised
        // output is unchanged.
        const scale = width < 400 ? 0.7 : 0.8;
        const placement = (d: any) =>
            `translate(${d.cx},${windBarbY}) rotate(${d.dir % 360}) scale(${scale})`;

        const sel = windBand.selectAll(":scope > g").data(barbs, (d: any) => d.t);
        sel.exit().remove();

        const entered = sel.enter().append("g").attr("transform", placement);
        entered.each((d: any, i: number, nodes: any) => {
            this.renderBarb(d3.select(nodes[i]), d.speed, d.gust, d.len);
        });

        const all = entered.merge(sel);
        // The glyph is redrawn rather than morphed: a barb is a discrete symbol, and
        // feathers growing out of each other would read as noise. Its *position* is what
        // carries the movement.
        sel.each((d: any, i: number, nodes: any) => {
            const g = d3.select(nodes[i]);
            g.selectAll("*").remove();
            this.renderBarb(g, d.speed, d.gust, d.len);
        });
        if (this.animating) {
            all.transition().duration(MeteogramChart.ANIM_MS)
                .ease(d3.easeCubicOut).attr("transform", placement);
        } else {
            all.attr("transform", placement);
        }
        all.order();
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
        this.renderBarb(barbGroup, speed, gust, len);
    }

    /**
     * The barb glyph itself, drawn into a group that is already positioned.
     *
     * Split out of drawWindBarb so the wind band can join on the positioned groups —
     * placement animates, the glyph is redrawn. drawWindBarb is kept as the one-shot
     * form it always was.
     */
    private renderBarb(barbGroup: any, speed: number, gust: number | null, len: number) {
        const featherLong = 12;
        const featherShort = 6;
        const featherYOffset = 3;
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
        const n50 = Math.floor(v / 50);
        v -= n50 * 50;
        const n10 = Math.floor(v / 10);
        v -= n10 * 10;
        const n5 = Math.floor(v / 5);
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
            const gustN50 = Math.floor(gustV / 50);
            gustV -= gustN50 * 50;
            const gustN10 = Math.floor(gustV / 10);
            gustV -= gustN10 * 10;
            const gustN5 = Math.floor(gustV / 5);
            
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
