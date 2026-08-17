import { describe, expect, it } from "vitest";
import {
  HORIZON_DEG,
  agreesWithHa,
  isDaylightAt,
  sunAltitude,
  sunDay,
  sunEventsBetween,
} from "../src/solar";

/**
 * Ground truth comes from a live Home Assistant at Neshamn, which computes sun times
 * with astral — an independent implementation. Agreeing with it to within a couple of
 * minutes is a far stronger check than agreeing with my own arithmetic.
 *
 *   lat 59.940471, lon 5.483457
 *   next_rising   2026-08-18T03:58:10Z
 *   next_setting  2026-08-17T19:26:53Z
 *   next_noon     2026-08-17T11:42:15Z
 *   elevation     43.4 deg at 2026-08-17T11:41:42Z
 */
const NESHAMN = { lat: 59.940471, lon: 5.483457 };

const minutesApart = (a: Date, b: Date | string) =>
  Math.abs(a.getTime() - new Date(b).getTime()) / 60000;

describe("sunDay against Home Assistant's astral", () => {
  it("matches sunset on 17 August", () => {
    const day = sunDay(new Date("2026-08-17T12:00:00Z"), NESHAMN.lat, NESHAMN.lon);
    expect(day.kind).toBe("normal");
    expect(minutesApart(day.sunset!, "2026-08-17T19:26:53Z")).toBeLessThan(2);
  });

  it("matches sunrise on 18 August", () => {
    const day = sunDay(new Date("2026-08-18T12:00:00Z"), NESHAMN.lat, NESHAMN.lon);
    expect(minutesApart(day.sunrise!, "2026-08-18T03:58:10Z")).toBeLessThan(2);
  });

  it("matches solar noon on 17 August", () => {
    const day = sunDay(new Date("2026-08-17T12:00:00Z"), NESHAMN.lat, NESHAMN.lon);
    expect(minutesApart(day.transit, "2026-08-17T11:42:15Z")).toBeLessThan(2);
  });
});

describe("sunAltitude", () => {
  it("matches the elevation Home Assistant reported at that instant", () => {
    const alt = sunAltitude(new Date("2026-08-17T11:41:42Z"), NESHAMN.lat, NESHAMN.lon);
    expect(alt).toBeCloseTo(43.4, 0);
  });

  it("is above the horizon at local noon and below it at local midnight", () => {
    expect(isDaylightAt(new Date("2026-08-17T11:42:00Z"), NESHAMN.lat, NESHAMN.lon)).toBe(true);
    expect(isDaylightAt(new Date("2026-08-17T23:42:00Z"), NESHAMN.lat, NESHAMN.lon)).toBe(false);
  });

  it("agrees with sunDay at the moment of sunset", () => {
    // The two are computed by different routes, so this pins them to each other.
    const { sunset } = sunDay(new Date("2026-08-17T12:00:00Z"), NESHAMN.lat, NESHAMN.lon);
    expect(sunAltitude(sunset!, NESHAMN.lat, NESHAMN.lon)).toBeCloseTo(HORIZON_DEG, 1);
  });
});

describe("polar cases", () => {
  // Tromsø, comfortably inside the Arctic circle.
  const TROMSO = { lat: 69.6496, lon: 18.9560 };

  it("reports polar day at midsummer", () => {
    const day = sunDay(new Date("2026-06-21T12:00:00Z"), TROMSO.lat, TROMSO.lon);
    expect(day.kind).toBe("polar-day");
    expect(day.sunrise).toBeNull();
    expect(day.sunset).toBeNull();
  });

  it("reports polar night at midwinter", () => {
    const day = sunDay(new Date("2026-12-21T12:00:00Z"), TROMSO.lat, TROMSO.lon);
    expect(day.kind).toBe("polar-night");
  });

  it("still returns a usable transit, and never NaN", () => {
    // A NaN reaching a d3 scale destroys the entire chart, so this matters more than it
    // looks: the caller must always get a real Date to position against.
    for (const when of ["2026-06-21T12:00:00Z", "2026-12-21T12:00:00Z"]) {
      const day = sunDay(new Date(when), TROMSO.lat, TROMSO.lon);
      expect(Number.isNaN(day.transit.getTime())).toBe(false);
    }
  });

  it("keeps the sun up all day at midsummer and down all day at midwinter", () => {
    const up = [0, 6, 12, 18].map((h) =>
      isDaylightAt(new Date(`2026-06-21T${String(h).padStart(2, "0")}:00:00Z`), TROMSO.lat, TROMSO.lon)
    );
    expect(up).toEqual([true, true, true, true]);
    const down = [0, 6, 12, 18].map((h) =>
      isDaylightAt(new Date(`2026-12-21T${String(h).padStart(2, "0")}:00:00Z`), TROMSO.lat, TROMSO.lon)
    );
    expect(down).toEqual([false, false, false, false]);
  });
});

describe("sunEventsBetween", () => {
  it("finds one sunrise and one sunset per day, in order", () => {
    const from = new Date("2026-08-17T00:00:00Z");
    const to = new Date("2026-08-20T00:00:00Z");
    const events = sunEventsBetween(from, to, NESHAMN.lat, NESHAMN.lon);

    expect(events).toHaveLength(6); // three days, two events each
    expect(events.map((e) => e.type)).toEqual([
      "sunrise", "sunset", "sunrise", "sunset", "sunrise", "sunset",
    ]);
    for (let i = 1; i < events.length; i++) {
      expect(events[i].at.getTime()).toBeGreaterThan(events[i - 1].at.getTime());
    }
    events.forEach((e) => {
      expect(e.at >= from && e.at <= to).toBe(true);
    });
  });

  it("returns nothing across a polar stretch, rather than failing", () => {
    const events = sunEventsBetween(
      new Date("2026-06-18T00:00:00Z"),
      new Date("2026-06-24T00:00:00Z"),
      69.6496, 18.9560
    );
    expect(events).toEqual([]);
  });

  it("returns nothing for a window too short to contain an event", () => {
    // An 8h span over midday: the strip must render wholly light, not blank.
    const events = sunEventsBetween(
      new Date("2026-08-17T09:00:00Z"),
      new Date("2026-08-17T17:00:00Z"),
      NESHAMN.lat, NESHAMN.lon
    );
    expect(events).toEqual([]);
    expect(isDaylightAt(new Date("2026-08-17T13:00:00Z"), NESHAMN.lat, NESHAMN.lon)).toBe(true);
  });

  it("catches an event belonging to a neighbouring calendar day", () => {
    // Window starts after sunrise and ends after the next one, so the only events are
    // tonight's sunset and tomorrow's sunrise — both from different UTC days.
    const events = sunEventsBetween(
      new Date("2026-08-17T12:00:00Z"),
      new Date("2026-08-18T06:00:00Z"),
      NESHAMN.lat, NESHAMN.lon
    );
    expect(events.map((e) => e.type)).toEqual(["sunset", "sunrise"]);
  });
});

describe("agreesWithHa", () => {
  it("confirms a match and rejects a mismatch", () => {
    const sunset = sunDay(new Date("2026-08-17T12:00:00Z"), NESHAMN.lat, NESHAMN.lon).sunset;
    expect(agreesWithHa(sunset, "2026-08-17T19:26:53+00:00")).toBe(true);
    expect(agreesWithHa(sunset, "2026-08-17T18:00:00+00:00")).toBe(false);
  });

  it("declines to judge when either side is missing or unparseable", () => {
    expect(agreesWithHa(null, "2026-08-17T19:26:53Z")).toBeNull();
    expect(agreesWithHa(new Date(), undefined)).toBeNull();
    expect(agreesWithHa(new Date(), "not a date")).toBeNull();
  });
});
