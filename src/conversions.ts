// Common unit conversion helpers for meteogram-card
// Based on Home Assistant conventions

export function convertTemperature(value: number, from: string, to: string): number {
    if (from === to) return value;
    if (from === "°C" && to === "°F") return value * 9 / 5 + 32;
    if (from === "°F" && to === "°C") return (value - 32) * 5 / 9;
    console.warn(`[meteogram-card] Temperature conversion from ${from} to ${to} not implemented.`);
    return value;
}

export function convertPressure(value: number, from: string, to: string): number {
    if (from === to) return value;
    if (from === "hPa" && to === "inHg") return value * 0.029529983071445;
    if (from === "inHg" && to === "hPa") return value / 0.029529983071445;
    console.warn(`[meteogram-card] Pressure conversion from ${from} to ${to} not implemented.`);
    return value;
}

export function convertWindSpeed(value: number, from: string, to: string): number {
    if (from === to) return value;
    if (from === "m/s" && to === "km/h") return value * 3.6;
    if (from === "km/h" && to === "m/s") return value / 3.6;
    if (from === "m/s" && to === "mph") return value * 2.2369362920544;
    if (from === "mph" && to === "m/s") return value / 2.2369362920544;
    if (from === "km/h" && to === "mph") return value * 0.62137119223733;
    if (from === "mph" && to === "km/h") return value / 0.62137119223733;
    // Knots conversions for wind barbs
    if (from === "m/s" && to === "kt") return value * 1.9438444924574;
    if (from === "kt" && to === "m/s") return value / 1.9438444924574;
    if (from === "km/h" && to === "kt") return value * 0.5399568034557;
    if (from === "kt" && to === "km/h") return value / 0.5399568034557;
    if (from === "mph" && to === "kt") return value * 0.8689762419006;
    if (from === "kt" && to === "mph") return value / 0.8689762419006;
    console.warn(`[meteogram-card] Wind speed conversion from ${from} to ${to} not implemented.`);
    return value;
}

export function convertPrecipitation(value: number, from: string, to: string): number {
    if (from === to) return value;
    if (from === "mm" && to === "in") return value * 0.0393701;
    if (from === "in" && to === "mm") return value / 0.0393701;
    console.warn(`[meteogram-card] Precipitation conversion from ${from} to ${to} not implemented.`);
    return value;
}

export function convertDistance(value: number, from: string, to: string): number {
    if (from === to) return value;
    if (from === "km" && to === "mi") return value * 0.62137119223733;
    if (from === "mi" && to === "km") return value / 0.62137119223733;
    console.warn(`[meteogram-card] Distance conversion from ${from} to ${to} not implemented.`);
    return value;
}

