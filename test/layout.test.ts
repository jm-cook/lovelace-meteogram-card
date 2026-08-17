import { describe, expect, it } from "vitest";
import { chartLayout } from "../src/layout";

/**
 * Characterisation tests: every expected number here was *measured* from a real render
 * (test/geometry.mjs against a headless snapshot), not read out of the source. That is
 * the point — the refactor has to reproduce what the card actually does, not what the
 * code appears to say.
 *
 *   mode       marginTop  legend(abs)  dateLabel  hourLabel  svgHeight
 *   full          70          25          40         302        307
 *   core          50         none         20         282        307
 *   focussed      10         -35 (bug)   none        469        484
 */
const WIND = 45;
const HOURS = 30;

describe("reproduces the rendering as measured", () => {
  it("full: legends and date labels above the plot", () => {
    const l = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false,
    });
    expect(l.marginTop).toBe(70);
    expect(l.legendY).toBe(25);
    expect(l.dateLabelY).toBe(40);
    expect(l.hourLabelY).toBe(302);
    expect(l.plotHeight).toBe(172);
  });

  it("core: date labels but no legends", () => {
    const l = chartLayout({
      height: 307, hasLegends: false, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false,
    });
    expect(l.marginTop).toBe(50);
    expect(l.legendY).toBeNull();
    expect(l.dateLabelY).toBe(20);
    expect(l.hourLabelY).toBe(282);
  });

  it("focussed: nothing above the plot", () => {
    const l = chartLayout({
      height: 484, hasLegends: false, hasDateLabels: false,
      windBand: WIND, hourLabelBand: HOURS, focussed: true,
    });
    expect(l.marginTop).toBe(10);
    expect(l.dateLabelY).toBeNull();
    expect(l.hourLabelY).toBe(469);
  });
});

describe("everything is absolute", () => {
  it("legend and date-label positions do not move when the plot does", () => {
    // The old bug in one assertion: legends were relative to the plot group and date
    // labels were not, so moving the plot slid them relative to each other.
    const withoutSun = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false,
    });
    const withSun = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false, sunBand: 17,
    });
    expect(withSun.marginTop).toBe(withoutSun.marginTop + 17);
    expect(withSun.legendY).toBe(withoutSun.legendY);
    expect(withSun.dateLabelY).toBe(withoutSun.dateLabelY);
  });

  it("puts the sun strip between the date labels and the plot border", () => {
    const l = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false, sunBand: 17,
    });
    expect(l.sunStripY).toBeGreaterThan(l.dateLabelY!);
    expect(l.sunStripY).toBeLessThan(l.marginTop);
  });

  it("gives the plot back exactly what the strip took", () => {
    const a = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false,
    });
    const b = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false, sunBand: 17,
    });
    expect(b.plotHeight).toBe(a.plotHeight - 17);
    // and the card as a whole is unchanged
    expect(b.hourLabelY).toBe(a.hourLabelY);
  });

  it("adding a band needs no compensation anywhere else", () => {
    // The property that makes this refactor worth doing: every consumer reads absolute
    // numbers, so a new band changes one input and nothing else.
    for (const sunBand of [0, 7, 17, 40]) {
      const l = chartLayout({
        height: 307, hasLegends: true, hasDateLabels: true,
        windBand: WIND, hourLabelBand: HOURS, focussed: false, sunBand,
      });
      expect(l.legendY).toBe(25);
      expect(l.dateLabelY).toBe(40);
      expect(l.windTop).toBe(l.marginTop + l.plotHeight);
      expect(l.hourLabelY).toBe(l.windTop + WIND + 15);
    }
  });
});

describe("wind band", () => {
  it("collapses cleanly when there is no wind data", () => {
    const l = chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: 0, hourLabelBand: HOURS, focussed: false,
    });
    expect(l.windTop).toBe(l.marginTop + l.plotHeight);
    expect(l.hourLabelY).toBe(l.windTop + 15);
  });
});

describe("slack — dead space at the bottom, which should be zero", () => {
  // These document a real defect rather than approving of it. The old code subtracts a
  // fixed 60 above the plot whatever margin.top actually consumed, so the shorter
  // layouts waste the difference. Pinning the numbers means a later fix has to state
  // its intent by changing them.
  const at = (o: Partial<Parameters<typeof chartLayout>[0]>) =>
    chartLayout({
      height: 307, hasLegends: true, hasDateLabels: true,
      windBand: WIND, hourLabelBand: HOURS, focussed: false, ...o,
    }).slack;

  it("full fits exactly", () => {
    expect(at({})).toBe(0);
  });

  it("core wastes 20px, because marginTop is 50 while 60 is reserved", () => {
    expect(at({ hasLegends: false })).toBe(20);
  });

  it("focussed wastes 10px", () => {
    expect(
      chartLayout({
        height: 484, hasLegends: false, hasDateLabels: false,
        windBand: WIND, hourLabelBand: HOURS, focussed: true,
      }).slack
    ).toBe(10);
  });
});
