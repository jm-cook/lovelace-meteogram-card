/**
 * Vertical layout of the chart: one place that decides where every band goes.
 *
 * This exists because the positions were previously computed in four places, in two
 * different coordinate systems, from constants that did not reconcile with each other:
 *
 *   - legends at `y: -45` *inside* the group translated by margin.top, so they move
 *     with the plot;
 *   - date labels at `margin.top - 30`, in absolute terms, so they do not;
 *   - `margin.top` hardcoded to 70 / 50 / 10 per display mode, unrelated to what is
 *     actually above the plot;
 *   - `_chartHeight` subtracting a magic 60 as a stand-in for the space those two rows
 *     occupy — a number connected to nothing else.
 *
 * The practical cost: inserting one new band above the plot required a compensation for
 * the date labels, then a second for the legends when they landed on top of the labels.
 * A third band would have needed a third. Every position returned here is **absolute**,
 * measured from the top of the SVG, so a caller cannot get the frame of reference wrong.
 *
 * The constants reproduce today's rendering exactly, quirks included; they are named so
 * the quirks can be argued with separately from the refactor that exposed them.
 */

/** Vertical space the legend row occupies when present. */
const LEGEND_BAND = 20;
/** Baseline of the legend text, from the top of the SVG. */
const LEGEND_BASELINE = 25;
/** Vertical space the date-label row occupies when present. */
const DATE_BAND = 20;
/** Gap between the date-label baseline and the top border of the plot. */
const DATE_TO_PLOT = 30;
/** Top margin when there is nothing above the plot at all. */
const BARE_TOP = 10;
/** Gap between the bottom of the wind band and the hour-label baseline. */
const WIND_TO_HOUR_LABEL = 15;
/** The strip's own height. It sits flush on the plot border, so its top edge is this
 *  far above marginTop and the rest of the reserved band is clear air above it. */
const SUN_STRIP_ON_BORDER = 10;
/**
 * Room above the strip for the sunrise and sunset marks, which are drawn above it
 * rather than inside it: a 16px icon and a 2px gap.
 *
 * Only needed where nothing else is reserved above the plot. With date labels the marks
 * have always sat in the gap between them and the plot — by luck rather than by
 * arrangement, but with room to spare. In the focussed layout there is no such gap, and
 * the marks landed at y = -3, clipped off the top of the card entirely.
 */
const SUN_MARK_BAND = 18;

/**
 * Height the old code reserved above the plot when computing `_chartHeight`.
 *
 * Note it does not equal the space actually consumed: `marginTop` is 70 in the full
 * layout but only 60 is subtracted here, and in core only 50 is consumed while 60 is
 * still subtracted. That mismatch is why core and focussed leave dead space at the
 * bottom of the card — about 20px and 10px respectively. Preserved for now so the
 * refactor is provably a no-op; `slack` reports it so a later change can drive it to
 * zero deliberately rather than by accident.
 */
const LEGACY_TOP_RESERVE = 60;
const LEGACY_TOP_RESERVE_BARE = 10;

export interface LayoutInput {
  /** Height available to the chart, in pixels. */
  height: number;
  hasLegends: boolean;
  hasDateLabels: boolean;
  /** Height of the wind barb band, or 0 when wind is unavailable or hidden. */
  windBand: number;
  /** Height reserved for the hour labels below the wind band. */
  hourLabelBand: number;
  /** Height of the day/night strip, or 0 when it is off. */
  sunBand?: number;
  /** The focussed display mode reserves less above the plot. */
  focussed: boolean;
}

export interface Layout {
  /** Top of the plot area; the y of the group transform. */
  marginTop: number;
  plotHeight: number;
  /** Absolute baseline of the legend row, or null when there is none. */
  legendY: number | null;
  /** Absolute baseline of the date-label row, or null when there is none. */
  dateLabelY: number | null;
  /** Absolute top edge of the day/night strip, or null when it is off. */
  sunStripY: number | null;
  /** Absolute top edge of the wind band. */
  windTop: number;
  /** Absolute baseline of the hour labels. */
  hourLabelY: number;
  /**
   * Unused pixels between the bottom of the hour labels and the bottom of the card.
   * Should be zero; today it is not in every mode, and that is worth seeing.
   */
  slack: number;
}

export function chartLayout(input: LayoutInput): Layout {
  const {
    height, hasLegends, hasDateLabels, windBand, hourLabelBand, focussed,
  } = input;
  const sunBand = input.sunBand ?? 0;

  const legendBand = hasLegends ? LEGEND_BAND : 0;
  const dateBand = hasDateLabels ? DATE_BAND : 0;

  // With nothing above it the plot starts near the top; otherwise the rows stack and the
  // plot begins below them.
  // The marks need their own headroom only in the bare layout; the date-label gap
  // already provides it in the other.
  const markBand = sunBand && !hasDateLabels ? SUN_MARK_BAND : 0;
  const marginTop = hasDateLabels
    ? legendBand + dateBand + DATE_TO_PLOT + sunBand
    : BARE_TOP + sunBand + markBand;

  const dateLabelY = hasDateLabels ? legendBand + dateBand : null;
  const legendY = hasLegends ? LEGEND_BASELINE : null;
  // The strip takes the lane immediately above the plot border, so it reads directly
  // under the day it describes and cannot be reached by a taller label row.
  const sunStripY = sunBand ? marginTop - SUN_STRIP_ON_BORDER : null;

  const plotHeight =
    height -
    windBand -
    hourLabelBand -
    (focussed ? LEGACY_TOP_RESERVE_BARE : LEGACY_TOP_RESERVE) -
    sunBand -
    // Taken out of the plot as well as added to the margin: adding it to only one would
    // push the wind band and hour labels off the bottom by the same amount.
    markBand;

  const windTop = marginTop + plotHeight;
  const hourLabelY = windTop + windBand + WIND_TO_HOUR_LABEL;

  return {
    marginTop,
    plotHeight,
    legendY,
    dateLabelY,
    sunStripY,
    windTop,
    hourLabelY,
    // Roughly: the hour-label glyphs need a few px below their baseline.
    slack: height - (hourLabelY + 5),
  };
}
