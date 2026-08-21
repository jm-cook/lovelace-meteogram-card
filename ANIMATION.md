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
      - [x] wind barbs (done — placement animates, glyph redraws)
      - [x] weather icons (done)
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

- Never mount a Home Assistant custom element (ha-icon and friends) inside a
  foreignObject inside the SVG. WebKit — Safari, and the iOS Companion app, which is
  WKWebView — often does not paint it, with no error anywhere. Inject plain markup, as
  the weather icons do, or use ordinary SVG. Nothing local reproduces this: the harness
  is not Home Assistant, so it never registers those components and never takes that
  branch.

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

## Not done: handing the SVG to the replacement element

Parked 2026-08-21. Pick this up if the blank on a rebuild starts to grate; there is no
correctness problem to fix here, only about 200 ms of blank card.

**The situation.** Home Assistant replaces a card element without the page reloading —
`hui-view` compares view configs by reference, so any re-emitted config rebuilds every
card in the view, and its reconnect handler re-emits one. Observed three elements in
eighty minutes on a page that never reloaded. A replacement mounts empty, waits out
`_firstDrawSettleMs`, draws, and reports `rebuilt`. Measured end to end: ~200 ms of
nothing, of which ~20 ms is the drawing.

Two things already reduce it and are worth knowing before adding more:

- The opening animation is suppressed on a remount (`_remountDraw`), so the blank is no
  longer followed by a full animated build of a forecast that did not change.
- A redraw is held for 2.5 s after `hass.connected` goes false→true, so the outgoing
  element does not spend a draw it will not live to show.

**The idea.** Cache the last rendered `<svg>` at module level, keyed on the render
signature *and* the drawn size. A new element adopts it during `firstUpdated`, before
its own first draw. The geometry then matches, so `reusable` is true and that first draw
comes out `reused` rather than `rebuilt` — an update against elements that already
exist, which is also the path that can animate. The handover becomes seamless instead of
a blank.

**Attempted 2026-08-21 and parked again**, in `git stash` as "wip: svg handoff". Three
things were established, and a fourth was not:

1. *Keying on the render signature alone is right.* Keying on signature **and** drawn
   size never matched once: the container at adoption is not the size the previous
   element drew at, because it is measured before layout has settled — 846x444 against a
   chart drawn at 846x404, every attempt. Scale the placeholder to the container instead
   and let the real draw correct it.
2. *The cache must be written in `finally()`*, not beside `_lastDrawnKey`. That runs
   before the svg is built, so the first attempt cached nothing at all.
3. *The placeholder must be out of flow from the moment it is adopted.* As an ordinary
   flex child it sizes the container, the draw measures that, and removing the
   placeholder shrinks the container back — so the handover manufactures the very second
   draw it exists to prevent. `position:absolute; inset:0` at adoption time, not when the
   draw later notices it.
4. *Unresolved:* the adopted chart is visible for the first ~12ms and then the chart div
   is emptied at ~14ms, before the replacement has drawn (~50ms). The div itself is not
   replaced — its identity is stable across the whole sequence — so something is clearing
   its children with `_adoptedSvg` already false. Three `_renderChart` calls are involved,
   the second entering with the flag set and the third without. That third call is the
   next thing to understand; instrument the flag at the `innerHTML = ""` site rather than
   at entry.

Keeping the placeholder alive until the *drawing* finishes — rather than until the new
`<svg>` element exists — is necessary and was implemented: hold the old node out of flow,
draw the replacement beside it under `visibility:hidden` (not `display:none`, or text
measurement returns zero), and swap in `finally()`. That part is sound; it is item 4 that
stops the whole thing working.

**What to be careful about.**

- Key it on the full render signature, not just the size. A card whose config differs
  would otherwise flash the other card's chart before correcting itself.
- Two meteogram cards on one page share the module scope. Either key per signature and
  accept a miss, or hold a small map.
- The adopted svg is one draw stale by definition. That is fine — the real draw follows
  within ~200 ms — but it must never be *left* stale, so adoption has to be followed by
  a scheduled draw unconditionally, not one gated on the draw key.
- `_chartResized` keys off the same `reusable` flag. Adopting an svg makes a first draw
  look like an update, so check what that does to the animation decision before
  assuming it is free.
