/**
 * Compare two SVG snapshots, optionally ignoring nodes of a given class.
 *
 * The reason this exists rather than a `diff` in a shell one-liner: a naive comparison
 * reports success when *both* sides are empty. The first version of this check did
 * exactly that — it printed "IDENTICAL — harness is deterministic" while the browser
 * had failed to launch and both files were zero bytes. A comparison that passes when
 * nothing was rendered is worse than no comparison, so both inputs are validated before
 * anything is compared.
 *
 * Usage:
 *   node test/compare.mjs before.svg after.svg [--ignore-class day-bg]
 */

import { readFileSync, existsSync } from "node:fs";

const MIN_NODES = 50;   // a real chart is hundreds of nodes; anything less is a failure

// Parse positionally, consuming the value that follows a flag. Filtering on a leading
// "--" alone treated the class name as a third filename.
const args = process.argv.slice(2);
const files = [];
let ignoreClass = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--ignore-class") ignoreClass = args[++i];
  else if (args[i].startsWith("--")) { console.error(`unknown flag ${args[i]}`); process.exit(2); }
  else files.push(args[i]);
}

if (files.length !== 2) {
  console.error("usage: node test/compare.mjs before.svg after.svg [--ignore-class NAME]");
  process.exit(2);
}

function load(path, label) {
  if (!existsSync(path)) fail(`${label}: ${path} does not exist`);
  const text = readFileSync(path, "utf8");
  if (!text.trim()) fail(`${label}: ${path} is empty — the render failed, not the comparison`);
  const nodes = (text.match(/<[a-zA-Z]/g) || []).length;
  if (nodes < MIN_NODES) fail(`${label}: only ${nodes} elements in ${path}; expected >= ${MIN_NODES}`);
  return { text, nodes };
}

function fail(msg) {
  console.error(`FAIL  ${msg}`);
  process.exit(1);
}

/**
 * Rewrite generated ids to stable placeholders.
 *
 * The card suffixes SVG ids with a random string — `temp-gradient-qwj7ft8lz` — so that
 * two cards on one dashboard cannot collide. Sensible in production, fatal to a
 * byte comparison: no two renders are ever identical. Each id is mapped to id0, id1 …
 * in order of first appearance, which keeps the comparison sensitive to *structure*
 * (an id appearing, vanishing, or being referenced from somewhere new) while ignoring
 * the random text itself.
 */
function normaliseIds(svg) {
  const ids = [...new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))];
  let out = svg;
  ids.forEach((id, i) => {
    const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(esc, "g"), `__id${i}__`);
  });
  return { out, count: ids.length };
}

/** Drop whole elements carrying the given class, so their absence is not "a difference". */
function strip(svg, cls) {
  if (!cls) return svg;
  // Self-closing and paired forms; these are d3-generated rects, so no nesting to worry about.
  const selfClosing = new RegExp(`<[a-zA-Z]+[^>]*class="${cls}"[^>]*/>`, "g");
  const paired = new RegExp(`<([a-zA-Z]+)[^>]*class="${cls}"[^>]*>.*?</\\1>`, "g");
  return svg.replace(paired, "").replace(selfClosing, "");
}

const before = load(files[0], "before");
const after = load(files[1], "after");

console.log(`before: ${before.nodes} elements`);
console.log(`after:  ${after.nodes} elements`);

if (ignoreClass) {
  const bCount = (before.text.match(new RegExp(`class="${ignoreClass}"`, "g")) || []).length;
  const aCount = (after.text.match(new RegExp(`class="${ignoreClass}"`, "g")) || []).length;
  console.log(`.${ignoreClass}: ${bCount} before, ${aCount} after (excluded from the comparison)`);
}

const nb = normaliseIds(before.text);
const na = normaliseIds(after.text);
console.log(`generated ids normalised: ${nb.count} before, ${na.count} after`);

const b = strip(nb.out, ignoreClass);
const a = strip(na.out, ignoreClass);

if (b === a) {
  console.log(`\nPASS  identical once .${ignoreClass ?? "(nothing)"} is excluded — the change is a no-op`);
  process.exit(0);
}

// Report the first divergence usefully rather than dumping two 200KB strings.
let i = 0;
while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++;
const ctx = 160;
console.error(`\nFAIL  they differ, first at character ${i} of ${b.length}/${a.length}`);
console.error(`  before: ...${b.slice(Math.max(0, i - ctx / 2), i + ctx)}`);
console.error(`  after:  ...${a.slice(Math.max(0, i - ctx / 2), i + ctx)}`);
process.exit(1);
