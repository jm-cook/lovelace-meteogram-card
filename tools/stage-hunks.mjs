/**
 * Stage only the hunks of a file that mention given markers, so interleaved changes in
 * one file can be committed as separate topics.
 *
 *   node tools/stage-hunks.mjs <file> <marker> [marker...]
 *   node tools/stage-hunks.mjs --list <file>
 *
 * Works against the index, so run it repeatedly: each round stages one topic, commits,
 * and the next round sees only what is left.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const args = process.argv.slice(2);
const list = args[0] === "--list";
const file = list ? args[1] : args[0];
const markers = list ? [] : args.slice(1);

const diff = execFileSync("git", ["diff", "--", file], { encoding: "utf8" });
if (!diff.trim()) {
  console.log("  (no unstaged changes)");
  process.exit(0);
}

const lines = diff.split("\n");
const headerEnd = lines.findIndex((l) => l.startsWith("@@"));
const header = lines.slice(0, headerEnd).join("\n");

const hunks = [];
let cur = null;
for (const l of lines.slice(headerEnd)) {
  if (l.startsWith("@@")) {
    if (cur) hunks.push(cur);
    cur = [l];
  } else if (cur) {
    cur.push(l);
  }
}
if (cur) hunks.push(cur);

if (list) {
  hunks.forEach((h, i) => {
    const added = h.filter((l) => l.startsWith("+") && !l.startsWith("+++"));
    const gist = added.map((l) => l.slice(1).trim()).filter(Boolean).slice(0, 2).join(" | ");
    console.log(`  [${i}] ${h[0].split("@@")[1]?.trim() ?? ""}  ${gist.slice(0, 100)}`);
  });
  process.exit(0);
}

// Line mode: keep only the *added* lines that match, dropping other additions from
// the same hunk. Needed where two topics land in adjacent lines and therefore share a
// hunk — a declaration for one feature next to a field for another.
const lineMode = markers[0] === "--lines";
const pats = lineMode ? markers.slice(1) : markers;

const chosen = hunks
  .map((h) => {
    const body = h.join("\n");
    if (!pats.some((m) => body.includes(m))) return null;
    if (!lineMode) return h;
    const kept = h.filter((l, i) =>
      i === 0 || !l.startsWith("+") || pats.some((m) => l.includes(m))
    );
    // Nothing but context left means this hunk contributes nothing.
    return kept.some((l, i) => i > 0 && (l.startsWith("+") || l.startsWith("-"))) ? kept : null;
  })
  .filter(Boolean);
if (!chosen.length) {
  console.error("  no hunks matched " + markers.join(", "));
  process.exit(1);
}

const patch = header + "\n" + chosen.map((h) => h.join("\n")).join("\n") + "\n";
const tmp = "/tmp/stage-hunks.patch";
writeFileSync(tmp, patch.endsWith("\n") ? patch : patch + "\n");
try {
  execFileSync("git", ["apply", "--cached", "--recount", tmp], { stdio: "pipe" });
  console.log(`  staged ${chosen.length} of ${hunks.length} hunks from ${file}`);
} catch (e) {
  console.error("  apply failed:", e.stderr?.toString() ?? e.message);
  process.exit(1);
} finally {
  unlinkSync(tmp);
}
