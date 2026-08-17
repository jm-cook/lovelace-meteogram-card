/**
 * Sun position and rise/set times, computed from coordinates.
 *
 * Why compute rather than read `sun.sun`: that entity exposes only the *next* rising
 * and setting, which covers under 24 hours. The meteogram spans 48 hours by default and
 * up to about ten days, so most of the chart is beyond anything the entity can answer.
 * It remains useful as a cross-check — see `agreesWithHa` — but it cannot be the source.
 *
 * The algorithm is the standard low-precision sunrise equation (NOAA / Meeus), good to
 * well under a minute for this purpose. Everything is computed in UTC; converting for
 * display is the caller's business.
 */

const DEG = Math.PI / 180;
const J2000 = 2451545.0;
const JULIAN_UNIX_EPOCH = 2440587.5;
const MS_PER_DAY = 86400000;

/**
 * Sun altitude at which sunrise and sunset are defined: the centre of the disc sits
 * 50 arcminutes below the true horizon, which accounts for refraction (~34') and the
 * solar radius (~16'). This is the same convention Home Assistant's astral uses, so the
 * two agree.
 */
export const HORIZON_DEG = -0.833;

const toJulian = (d: Date): number => d.getTime() / MS_PER_DAY + JULIAN_UNIX_EPOCH;
const fromJulian = (j: number): Date => new Date((j - JULIAN_UNIX_EPOCH) * MS_PER_DAY);

/** Mean solar anomaly, degrees. */
const meanAnomaly = (daysSinceJ2000: number): number =>
  (357.5291 + 0.98560028 * daysSinceJ2000) % 360;

/** Ecliptic longitude of the sun, degrees, from the mean anomaly. */
function eclipticLongitude(M: number): number {
  // Equation of the centre, then the argument of perihelion.
  const C =
    1.9148 * Math.sin(M * DEG) +
    0.02 * Math.sin(2 * M * DEG) +
    0.0003 * Math.sin(3 * M * DEG);
  return (M + C + 180 + 102.9372) % 360;
}

/** Solar declination, degrees. */
const declination = (lambda: number): number =>
  Math.asin(Math.sin(lambda * DEG) * Math.sin(23.4397 * DEG)) / DEG;

/**
 * Altitude of the sun above the horizon at an instant, in degrees.
 *
 * This is what "is it daytime" should ask. Comparing an instant against a day's
 * sunrise and sunset needs a notion of "which day", which goes wrong around midnight
 * and across timezones; an altitude has no such ambiguity, and it degrades gracefully
 * inside the polar circles where there may be no sunrise to compare against at all.
 */
export function sunAltitude(when: Date, latitude: number, longitude: number): number {
  const d = toJulian(when) - J2000;
  const M = meanAnomaly(d);
  const lambda = eclipticLongitude(M);
  const dec = declination(lambda) * DEG;

  // Right ascension, not ecliptic longitude. The hour angle is measured along the
  // celestial equator, so the ecliptic longitude has to be projected onto it first;
  // using lambda directly is wrong by up to ~2.5 degrees, which put the computed sunset
  // 1.2 degrees below where sunDay placed it.
  const ra =
    Math.atan2(
      Math.sin(lambda * DEG) * Math.cos(23.4397 * DEG),
      Math.cos(lambda * DEG)
    ) / DEG;

  // Greenwich mean sidereal time, then the sun's hour angle at this longitude.
  const theta = 280.16 + 360.9856235 * d;
  const H = (theta + longitude - ra) * DEG;

  const phi = latitude * DEG;
  const sinAlt =
    Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H);
  return Math.asin(Math.max(-1, Math.min(1, sinAlt))) / DEG;
}

/** True when the sun is above the rise/set horizon at that instant. */
export const isDaylightAt = (when: Date, latitude: number, longitude: number): boolean =>
  sunAltitude(when, latitude, longitude) > HORIZON_DEG;

export type SunDayKind = "normal" | "polar-day" | "polar-night";

export interface SunDay {
  /** Null on a polar day or polar night, where the event does not occur. */
  sunrise: Date | null;
  sunset: Date | null;
  /** Solar noon; always defined, and the anchor the events are computed around. */
  transit: Date;
  kind: SunDayKind;
}

/**
 * Sunrise, sunset and solar noon for the solar day containing `date`.
 *
 * Returns nulls with `kind` set rather than throwing or producing NaN when the sun does
 * not cross the horizon. Above the Arctic circle that is not an edge case, it is most of
 * the summer — and a NaN reaching a d3 scale silently destroys the whole chart, so the
 * caller is made to acknowledge it.
 */
export function sunDay(date: Date, latitude: number, longitude: number): SunDay {
  // Work from UTC midnight so the result depends on the calendar day, not the time of
  // day that happened to be passed in.
  const dayStart = Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()
  );
  const jDay = dayStart / MS_PER_DAY + JULIAN_UNIX_EPOCH;

  const lw = -longitude * DEG;
  const n = Math.round(jDay - J2000 - 0.0009 - lw / (2 * Math.PI));
  const jNoonApprox = J2000 + 0.0009 + lw / (2 * Math.PI) + n;

  const M = meanAnomaly(jNoonApprox - J2000);
  const lambda = eclipticLongitude(M);
  const jTransit =
    jNoonApprox + 0.0053 * Math.sin(M * DEG) - 0.0069 * Math.sin(2 * lambda * DEG);
  const dec = declination(lambda) * DEG;
  const phi = latitude * DEG;

  const cosOmega =
    (Math.sin(HORIZON_DEG * DEG) - Math.sin(phi) * Math.sin(dec)) /
    (Math.cos(phi) * Math.cos(dec));

  if (cosOmega > 1) {
    // The sun's highest point is still below the horizon.
    return { sunrise: null, sunset: null, transit: fromJulian(jTransit), kind: "polar-night" };
  }
  if (cosOmega < -1) {
    // The sun's lowest point is still above it.
    return { sunrise: null, sunset: null, transit: fromJulian(jTransit), kind: "polar-day" };
  }

  const omega = Math.acos(cosOmega) / DEG;   // half the length of the day, in degrees
  const transit = fromJulian(jTransit);

  // The closed form above is good to a couple of minutes. Refine each event by solving
  // sunAltitude = HORIZON_DEG directly, which costs a few dozen cheap evaluations and
  // buys two things: agreement with astral to within seconds rather than minutes, and —
  // more importantly — internal consistency, so the altitude at the returned sunset
  // really is the horizon. Two routes to the same answer that disagree is a bug waiting
  // to be built on.
  return {
    sunrise: refine(fromJulian(jTransit - omega / 360), transit, -1, latitude, longitude),
    sunset: refine(fromJulian(jTransit + omega / 360), transit, +1, latitude, longitude),
    transit,
    kind: "normal",
  };
}

/**
 * Bisect towards the instant where the sun's altitude crosses the horizon.
 *
 * `direction` is -1 for sunrise (altitude increasing through the horizon) and +1 for
 * sunset (decreasing). The bracket is the approximate event plus or minus 30 minutes,
 * which comfortably contains the closed form's error, and altitude is monotonic there
 * for any day that has an event at all — the polar cases never reach this function.
 */
function refine(
  approx: Date,
  transit: Date,
  direction: -1 | 1,
  latitude: number,
  longitude: number
): Date {
  const HALF_HOUR = 30 * 60000;
  let lo = approx.getTime() - HALF_HOUR;
  let hi = approx.getTime() + HALF_HOUR;
  // Never search past solar noon, where the monotonic assumption breaks down.
  if (direction === -1) hi = Math.min(hi, transit.getTime());
  else lo = Math.max(lo, transit.getTime());

  const above = (t: number) =>
    sunAltitude(new Date(t), latitude, longitude) > HORIZON_DEG;

  // Only refine if the bracket actually straddles the horizon; otherwise the closed
  // form is already outside our assumptions and its answer is the safer one.
  if (above(lo) === above(hi)) return approx;

  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (above(mid) === above(lo)) lo = mid;
    else hi = mid;
  }
  return new Date(Math.round((lo + hi) / 2));
}

/**
 * Every sunrise and sunset between two instants, in order.
 *
 * Used to draw the day/night strip, which spans the whole forecast rather than a single
 * day. Days with no event contribute nothing, so a polar stretch simply yields a run
 * with no transitions — which is exactly how it should be drawn.
 */
export function sunEventsBetween(
  from: Date,
  to: Date,
  latitude: number,
  longitude: number
): { at: Date; type: "sunrise" | "sunset" }[] {
  const events: { at: Date; type: "sunrise" | "sunset" }[] = [];
  // Start a day early and finish a day late: an event belonging to a neighbouring
  // calendar day can still fall inside the window, near either end.
  const first = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()) - MS_PER_DAY;
  for (let t = first; t <= to.getTime() + MS_PER_DAY; t += MS_PER_DAY) {
    const day = sunDay(new Date(t), latitude, longitude);
    if (day.sunrise) events.push({ at: day.sunrise, type: "sunrise" });
    if (day.sunset) events.push({ at: day.sunset, type: "sunset" });
  }
  return events
    .filter((e) => e.at >= from && e.at <= to)
    .sort((a, b) => a.at.getTime() - b.at.getTime());
}

/**
 * Compare a computed event against Home Assistant's own `sun.sun`.
 *
 * Only meaningful when the card's coordinates are Home Assistant's home location: if the
 * user has set coordinates for somewhere else, the two describe different places and
 * disagreement is correct rather than a fault.
 */
export function agreesWithHa(
  computed: Date | null,
  haValue: string | undefined,
  toleranceMinutes = 5
): boolean | null {
  if (!computed || !haValue) return null;
  const ha = new Date(haValue);
  if (Number.isNaN(ha.getTime())) return null;
  return Math.abs(ha.getTime() - computed.getTime()) <= toleranceMinutes * 60000;
}
