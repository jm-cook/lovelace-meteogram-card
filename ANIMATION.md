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

- [ ] **1. Persistent svg.** Reuse the existing `<svg>` when the size is unchanged
      instead of clearing `#chart` and appending a new one. No visual change.
- [ ] **2. Per-drawer layers.** A `layer(parent, class)` helper that selects-or-appends
      a `<g>`. Every drawer targets its own layer and clears only that layer. Still no
      visual change, but each drawer can then be converted independently.
- [ ] **3. Keyed joins, drawer by drawer.** `.data(d, keyFn).join(...)` so elements keep
      their identity across redraws. Order by value:
      - [ ] temperature line (replaces the spike hack)
      - [ ] rain bars — the interesting case, bars appear and vanish
      - [ ] wind barbs
      - [ ] weather icons
      - [ ] axes, grid, labels, legends
- [ ] **4. Transitions** on the joined attributes, gated behind `animate` (already
      wired, default off).
- [ ] **5. Remove the spike** in `drawTemperatureLine` once its line is a real join.

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

- `animate` cannot be a property name: it collides with `HTMLElement.animate()`. The
  property is `animateChanges`; the config key is `animate`.
- Generated ids (gradients) differ per render; `compare.mjs` normalises them.
- `WeatherAPI` will not fetch twice inside 60s, which is why `dev.html` drops the
  instance each step.
