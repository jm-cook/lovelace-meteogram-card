/**
 * Extract the vertical layout from a rendered SVG.
 *
 * Ground truth for the layout refactor. Every number here is *observed* from a real
 * render rather than read out of the source, so the refactor can be held to reproducing
 * what the card actually does today rather than what I believe it does.
 *
 *   node test/geometry.mjs snapshot.svg
 */
import { readFileSync } from "node:fs";

const svg = readFileSync(process.argv[2], "utf8");

const num = (s) => (s === undefined ? null : Number(s));

// The plot group is translated by (margin.left, margin.top).
const translate = /transform="translate\((-?[\d.]+),(-?[\d.]+)\)"/.exec(svg);
const marginLeft = num(translate?.[1]);
const marginTop = num(translate?.[2]);

const height = num(/<svg[^>]*\bheight="([\d.]+)"/.exec(svg)?.[1]);
const width = num(/<svg[^>]*\bwidth="([\d.]+)"/.exec(svg)?.[1]);

// Text nodes carry a group-relative y when inside the plot group and an absolute one
// otherwise — the very inconsistency this refactor exists to remove. Legends are inside;
// date and hour labels are appended to the svg directly.
const texts = [...svg.matchAll(/<text[^>]*\by="(-?[\d.]+)"[^>]*>([^<]{0,20})</g)]
  .map(([, y, t]) => ({ y: Number(y), text: t.trim() }));

const legend = texts.find((t) => /\(hPa\)|\(°C\)|\(mm\)|\(m\/s\)|%/.test(t.text));
const dateLabel = texts.find((t) => /^\w{3},\s\w{3}\s\d+$/.test(t.text));
const hourLabel = texts.filter((t) => /^\d{1,2}(:\d{2})?$/.test(t.text)).sort((a, b) => b.y - a.y)[0];

const windBand = /class="wind-band-bg"[^>]*\by="([\d.]+)"[^>]*\bheight="([\d.]+)"/.exec(svg);
const gridOutline = /class="grid-outline"[^>]*\bheight="([\d.]+)"/.exec(svg);

console.log(JSON.stringify({
  svg: { width, height },
  marginTop,
  marginLeft,
  // Legends sit inside the translated group, so add marginTop for a comparable number.
  legendAbsY: legend ? legend.y + marginTop : null,
  legendRawY: legend ? legend.y : null,
  dateLabelY: dateLabel ? dateLabel.y : null,
  hourLabelY: hourLabel ? hourLabel.y : null,
  windBandY: windBand ? Number(windBand[1]) : null,
  windBandH: windBand ? Number(windBand[2]) : null,
  plotHeight: gridOutline ? Number(gridOutline[1]) : null,
}, null, 1));
