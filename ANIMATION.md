# Animating chart updates

Status doc for the work on the `dev` branch. Written so this can be picked up mid-way
in a fresh session — check the boxes as stages land.

## Why

The chart is rebuilt from an empty `<svg>` on every redraw: 75 `.append()` calls, 11 of
them data joins, no `.exit()`, no `.join()`, no `.transition()`. Nothing can animate
because nothing survives a redraw.

A spike (3a0ac5f) animated the temperature line by remembering the previous path string
and transitioning from it. It looked good enough to justify doing this properly, but it
does not generalise: it works only because that line is one element with a stable point
count.

## Target

A persistent `<svg>` whose contents are updated in place, so a redraw moves elements
rather than replacing them.

## Stages

Each stage is snapshot-provable as a no-op against `test/snapshot.mjs` +
`test/compare.mjs`, except where noted. That is the safety net that makes this
tractable — a refactor meant to be visually identical can be *proved* so.

- [x] **1. Persistent svg.** (done) Reuse the existing `<svg>` when the size is unchanged
      instead of clearing `#chart` and appending a new one. No visual change.
- [x] **2. Per-drawer layers.** (done — 12 layers) A `layer(parent, class)` helper that selects-or-appends
      a `<g>`. Every drawer targets its own layer and clears only that layer. Still no
      visual change, but each drawer can then be converted independently.
- [ ] **3. Keyed joins, drawer by drawer.** `.data(d, keyFn).join(...)` so elements keep
      their identity across redraws. Order by value:
      - [x] temperature line (done — spike removed)
      - [x] rain bars — the interesting case, bars appear and vanish (done)
      - [x] cloud band and pressure line (done — shared persistentPath helper)
      - [ ] wind barbs
      - [ ] weather icons
      - [ ] axes, grid, labels, legends
- [ ] **4. Transitions** on the joined attributes, gated behind `animate` (already
      wired, default off).
- [x] **5. Remove the spike** (done with the line) in `drawTemperatureLine` once its line is a real join.

## Verifying

```
npm test                 # 27 unit
npm run test:browser     # sun strip + redraw behaviour
node test/snapshot.mjs > /tmp/before.svg   # before a stage
node test/compare.mjs /tmp/before.svg /tmp/after.svg
```

`dev.html` (served over http) is where the movement is judged — static data cannot tell
an animated update from a rebuild.

## Watch out for

- A converted drawer's layer must not be cleared (`_layer(parent, name, false)`) — a
  join needs its elements to survive in order to match them. Anything in that layer
  still on the enter-only pattern has to be removed by hand, or it accumulates.
- Set attributes in the order the enter-only code used them. Serialised attribute order
  follows assignment order, and the snapshot compare is byte-level.
- Entering elements append at the end, so document order drifts from data order. Call
  `.order()` on the merged selection, and `.raise()` a set that must paint over another
  sharing its layer.
- Key a join by the forecast **timestamp**, never the array index. The window slides —
  an hour later the earliest slot is gone and every remaining hour has shifted down one
  index — so an index key silently reuses the 14:00 bar as the 15:00 bar. It looks
  correct against fixed test data and is wrong against real data.
- Check element identity by data key, not by document position: filtered data means the
  nth element is a different datum once an earlier one exits.

- A drawer is handed its *layer*, not the root svg. Anything that must apply to the
  whole chart — the sun strip's tap-to-dismiss, for one — has to reach the root via
  `node().ownerSVGElement`, or it silently stops working.
- The byte-level snapshot compare will fail on a stage that adds wrappers even when
  nothing moves. `test/geometry.mjs` is the check that still means something there.

- `animate` cannot be a property name: it collides with `HTMLElement.animate()`. The
  property is `animateChanges`; the config key is `animate`.
- Generated ids (gradients) differ per render; `compare.mjs` normalises them.
- `WeatherAPI` will not fetch twice inside 60s, which is why `dev.html` drops the
  instance each step.
