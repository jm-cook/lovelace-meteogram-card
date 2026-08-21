# Meteogram Card Roadmap

Originally written 2025-10-02 on the `next-gen` branch, brought onto `main` and
reassessed 2026-08-21. The original text is in this file's history; what follows keeps
the same six phases and says where each one actually stands, because 124 commits have
landed since it was written and they did not leave every phase where it was.

## Where next-gen got to

`next-gen` branched at `ded2d1e`, was last touched 2025-11-24, and is now 124 commits
behind. It predates the animation work, the editor rewrite, the layout rework, the panel
sizing fix and the diagnostics panel, so it cannot be merged — anything wanted from it
has to be rewritten against the current chart.

About 800 lines were written there, all of it Phase 2–3:

| file | lines |
|---|---|
| `src/meteogram-weather-header.ts` | 217 |
| `src/meteogram-header-integration.ts` | 250 |
| `src/weather-header-images.ts` | 113 |
| `src/cartoon-weather-svgs.ts` | 214 |

**None of it is wired in.** `meteogram-card-class.ts` on that branch never imports any of
it, so it has never run as part of the card. Treat it as a sketch of an approach, not as
working code.

The only chart change on the branch is unrelated to any phase: weather icons shrunk from
40px to 30px, temperature labels added beneath them, and a `console.log('Icon spacing
debug:', …)` left behind.

---

## Phase 4 — Precipitation as a range · **do this first**

Draw one bar per hour spanning **rainMin to rainMax**, with the expected amount marked
inside it, the way weather cards show a temperature range. Rounded ends.

This is first because most of it is already in place and unused:

- `rainMin` is fetched from met.no's `precipitation_amount_min`, validated, unit
  converted, sliced to the span, and handed to the chart — **and never drawn**. It is
  dead data all the way to the renderer.
- `rainMax` *is* drawn, but as a separate lighter bar behind the main one, both growing
  from zero. So the card already shows a maximum; what it does not show is the range.

Work:

1. Replace the two zero-anchored bars with a single rect per hour: `y` from `rainMax`,
   height down to `rainMin`, `rx` for the rounded ends.
2. Mark the expected `rain` inside the range — a darker inset segment or a rule across
   the bar. Decide by eye against a wet forecast; the range is often narrow and the mark
   must not vanish.
3. Where `rainMin` and `rainMax` are absent — met.no publishes them only inside the
   Nordic area, and most weather entities never supply them — fall back to today's
   zero-anchored bar. This is the common case, not an edge case.
4. Keep the join keyed on `d.t` and the enter/update/exit split intact, or animation
   breaks. See `ANIMATION.md`.

Watch out for: the y scale is currently anchored at zero for rain, and a min-anchored
bar changes what "height" means in the exit transition — the animated exit drops bars to
`baseline` with `height 0`, which is still right, but check it against a shrinking range
rather than assuming.

**Note:** no prototype of this exists. Nothing on any branch draws a min-anchored or
rounded rain bar; the closest is the max-behind-rain pair on `main`, which predates
`next-gen`.

## Phase 5 — Multi-resolution zoom · **aged best**

met.no's `locationforecast` payload carries `next_6_hours` and `next_12_hours` beside
`next_1_hours`, and the parser already reads `next_6_hours` as a fallback when the hourly
block is missing (`weather-api.ts:448`). What it does not do is offer them as a
*resolution*.

This matters more than it did in October, because the card now routinely runs a 240-hour
span where hourly resolution is meaningless past day three and the bars are a pixel wide.

Work: parse all three intervals into separate series, pick one from the configured span
(or let the user tap to change), and rescale. The chart already redraws cleanly on a
config change, so the plumbing is the work rather than the rendering.

## Phases 2 & 3 — Current-conditions header and header imagery

A header bar showing current temperature and conditions, over a per-condition gradient
background with day/night variants; photographic or generated imagery floated as a later
upgrade.

Still wanted, but the 800 lines on `next-gen` are a starting point at best. They were
written against a card that has since changed shape, and the card now has a strict
layout model (`layout.ts`) that has to be told about any new band — a header added
without it will reopen the class of bug that #24 and #46 belong to.

Sequence it after Phase 4, and budget for rewriting rather than porting.

## Phase 1 — Remove the grid and axes · **aged worst, reconsider before starting**

The original aim was a clean chart with no grid lines and no temperature, pressure or
time axes.

Since October the axes and their bands have become load-bearing for sizing:
`legendBand`, `dateBand`, `windBand` and `hourLabelBand` are all inputs to `layout.ts`,
which computes the plot rectangle from them. #24 (negative plot height on short cards)
and #46 (the card growing to fill a panel) were both sizing bugs in that area.

Removing the axes is therefore no longer a rendering change; it is a change to the
geometry model, on the part of the code with the worst bug history. If it is still
wanted, do it after Phase 4 and 5, with `test/layout.test.ts` and the snapshot compare
as the safety net — and expect the snapshot to change, so `test/geometry.mjs` becomes the
check that means anything.

Worth asking first whether it is still wanted at all. The grid was not what made the card
feel dated; several of the things that did have since been fixed.

## Phase 6 — Cloud cover, once the header exists

Whether the cloud band is redundant once a header illustration shows conditions. Cannot
be judged until Phase 3 exists. Keep the data either way — the band is cheap and some
users read it directly.

---

## Order

1. **Phase 4** — precipitation range. Small, self-contained, uses data already being
   fetched and thrown away.
2. **Phase 5** — multi-resolution. Independent of the rest and worth most on the long
   spans the card already supports.
3. **Phases 2/3** — header. Largest, and it touches the layout model.
4. **Phase 1** — grid removal, if still wanted, and only with the layout tests in place.
5. **Phase 6** — decide after 3.

## Constraints that apply to all of it

- Keyed joins on `d.t`, never the array index; enter/update/exit preserved. `ANIMATION.md`
  lists the traps, and every one of them was hit at least once.
- Any new band is declared to `layout.ts`. Nothing computes its own geometry.
- The byte-level snapshot compare (`test/snapshot.mjs` + `compare.mjs`) is the proof a
  refactor changed nothing; `test/geometry.mjs` is what still means something when the
  markup legitimately changes.
- Optional forecast fields are usually absent. met.no publishes the precipitation range
  only inside the Nordic area, and most weather entities supply neither it nor pressure.
  Every feature built on an optional field needs its missing case designed, not bolted on.
- Backward compatibility with existing YAML, and all three display modes kept working.
