# Meteogram Card Roadmap

Originally written 2025-10-02 on the `next-gen` branch, brought onto `main` and
reassessed 2026-08-21, then expanded with the clean-look direction. The original text is in this file's history; what follows keeps
the same six phases and says where each one actually stands, because 124 commits have
landed since it was written and they did not leave every phase where it was.

**Status: for review.** The clean-look section below is a description to react to, not a
decision. It lists seven open questions at the end; those want answering before any of it
is built.

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

It is all to be discarded — any implementation starts clean.

**None of it is wired in.** `meteogram-card-class.ts` on that branch never imports any of
it, so it has never run as part of the card. Treat it as a sketch of an approach, not as
working code.

The only chart change on the branch is unrelated to any phase: weather icons shrunk from
40px to 30px, temperature labels added beneath them, and a `console.log('Icon spacing
debug:', …)` left behind.

---

## The clean look — what it means and what it costs

The direction is subtractive: **take the frame away and let the data carry itself.** Grid
lines, the temperature and pressure axes, and the axis labels all go, or become invisible
until wanted. Nothing about the underlying chart is wrong; it is scaffolding-heavy, and
the scaffolding is most of what the eye lands on first.

Any implementation starts clean. Nothing on `next-gen` is worth carrying over.

### The problem the subtraction creates

An axis is a *shared* reference: one column of numbers serves every point on the curve.
Take it away and every value that mattered has to be readable **in place**, which means
ink at the point rather than ink at the edge.

That trade only works when there are few points on screen. At the 48-hour span there are
about 48 slots; at 240 hours there are 240 and a bar is a pixel wide. You cannot label
anything at that density, so a decluttered chart at 240 hours would be *less* readable
than the current one, not more — it would be an unlabelled squiggle.

**So decluttering and multi-resolution are one project, not two.** Phase 5's 6-hourly and
12-hourly series are what make in-place labelling possible on the long spans. Doing the
clean look without it produces something that only works at 48 hours.

That is the single biggest thing this reassessment changes about the plan.

### Temperature — the reading problem, stated concretely

Today, reading the current temperature or a day's maximum means finding the curve,
tracking left to the axis, and interpolating between gridlines. Worse, the weather icons
are positioned at `yTemp(temp) - 40` — they **follow the curve**, sitting 40px above it —
so at exactly the peaks a maximum is read from, an icon is in the way.

Candidate: write the values on the curve and drop the axis.

- **What to label.** Not every point — that is noise. The values actually read are the
  current temperature and each day's maximum and minimum. Over five days that is about
  eleven labels, which is sparse enough to be legible.
- **Where.** Maxima want their label above the curve and minima below, which is where the
  icons currently are. **The icon placement has to be resolved first** — either icons move
  to a fixed band away from the curve, or labels flip to the inside of each turn. This is
  the first real design decision and everything else in the temperature work waits on it.
- **Open question:** with no axis at all, is a coarse sense of "how warm" lost? A faint
  warm-to-cool background tint behind the plot would restore it without lines or numbers.
  Worth trying, easy to reject.
- **Open question:** does the curve still need a *scale*, or only values? If two days have
  very different ranges the curve shape is misleading without one — a flat-looking day
  might span ten degrees.

### Pressure — a trend strip, not a curve

Measured against the recorded forecast, which settles why the curve reads as noise:

- It spans **21.1 hPa** (998.3 to 1019.4) across the file. An hour's change is typically
  0.3 hPa — about 1.4% of the plot height. Invisible by construction.
- The absolute value is not information a household reader can use. 1008 against 1009
  means nothing without a barometer's worth of context.
- Only **21 of 85** hours reach the conventional 1.6 hPa/3h threshold for a
  "rising/falling" call. Three quarters of the time the honest answer is *steady*, which
  a curve cannot say and a label can.

**The proposal: a thin trend strip, in the same vocabulary as the sun strip.** Spans of
rising / steady / falling rather than a line, so it answers "is it coming or going" and
does not pretend to be readable to a value. Everything already exists to draw it — the
sun strip is the same shape of thing, and `layout.ts` already knows how to reserve a band.

**One thing that has to be right, and was not obvious.** The window used to compute the
trend must scale with the forecast's own resolution. met.no is hourly for the first days
and 6-hourly after; a fixed 6-hour window spans several samples early and exactly one
sample late, so late in the forecast it flips between just-over and just-under the
threshold on every step. Measured: a fixed window gives **31 runs** and looks like
confetti, of which most of the tail is an artefact of sampling rather than weather.

Scaling the window to at least four samples and at least six hours gives **14 runs**,
dominated by long spans — 23h falling, 15h falling, 24h rising, 54h rising, 42h steady.
That reads.

This is the third place the resolution change has driven a design decision, after the
in-place labelling and the wind band. It is not a detail of Phase 5; it is a property of
the data that everything else has to accommodate.

Worth keeping `show_pressure` so the curve remains available for anyone who wants it,
on the same reasoning as the wind barbs.

### Pressure — the original note

The pressure trace goes. It is a second y axis, a second curve, and a second legend for
something most users do not read, and it is a large share of the clutter for a small
share of the value.

What is worth keeping is not the value but the **change** — falling pressure is the part
that means something. Candidates, none costing chart space:

- A trend glyph with the three-hour delta, in the header or beside the attribution.
- A tint or marker on the plot only when the fall is steep enough to matter, so it is
  silent on ordinary days.
- Nothing at all unless switched on, with `show_pressure` kept for those who want it.

**Open question:** is this a header element, an in-plot annotation, or a conditional
warning? They imply quite different work.

### Wind — a public-facing option, not a replacement

**Both notations ship. Whatever is done here is configurable.**

The reason to move away from barbs was never that they are bad — they are a professional
station-model notation, they encode speed to five knots in the space of a glyph, and they
are the most compact thing available. The reason is that they are aimed at meteorologists
and this card is aimed at a household.

But at least one user flies gliders and plans trips with them, and that is not an edge
case to be designed away. Barbs read in **knots**, which is why: `meteogram-chart.ts`
converts to knots and draws pennants at 50, feathers at 10 and half-feathers at 5. That is
aviation and marine units, deliberately. Nothing about the barb rendering should be
"improved" — it is correct as it stands and its correctness is the point.

So the wind band gets a style setting rather than a rewrite. `show_wind` stays as the
on/off; a new key selects the notation.

**The hazard, and it is a real one.** The two conventions point in opposite directions:

| notation | the glyph points |
|---|---|
| barbs (today) | towards where the wind comes **from** |
| Met Office arrows | towards where the wind is **going** |

Verified against the Met Office's own guide: *"The arrow shows the direction that the wind
is blowing. The letter shows the direction the wind is blowing from."* The card currently
does `rotate(dir)` straight from met.no's `wind_from_direction`, which is the barb
convention.

Two modes in one card, drawing the same wind 180° apart, with nothing on screen to say
which is which. Mitigations worth taking together rather than choosing between:

- Carry the compass letter beside the arrow, as the Met Office does. It is almost
  certainly why they do it.
- Say so in the tooltip.
- Be loud about it in the release note, and louder if the default changes.

**Open — what the default should be.** Arrows serve the larger audience, but changing the
default silently rotates every existing card's wind glyphs by half a turn. Leaving barbs
as the default means most users never see the friendlier option. This wants deciding
deliberately, not inheriting.

**Also open — how far the "technical offering" goes.** If barbs are staying for people
doing real planning with them, the question is whether that is all they get, or whether
the technical mode should also carry what such a user actually needs: gust explicitly
labelled, units in knots, and the numbers rather than the glyph. Worth asking the pilot.

A forecast card is not a flight-planning instrument, and the documentation should not
imply otherwise however it is being used.

### Wind — chevrons and numbers, in the UK Met Office style

Replace the meteorological barbs with a row of direction chevrons above a numeric speed,
on its own band. Barbs are precise and compact but need training to read; a chevron and a
number are instantly legible.

- **Gusts must show too.** Options: a second, lighter number; a range (`9–14`); or a
  lighter chevron behind the main one. A range reads well and takes the least room, but
  hides which is which — worth mocking up all three.
- **Width is the constraint, and it points back at resolution.** A legible speed label
  needs roughly 40px. At 48 hours that fits; at 240 it does not, by a factor of five. So
  the wind band is either resolution-dependent (numbers when coarse, something denser when
  fine) or it drives the decision to show fewer points. Another place the clean look and
  Phase 5 turn out to be the same job.
- The band is already declared to `layout.ts` as `windBand`; changing its contents is
  safe, changing its height means updating the layout model.

### What replaces the grid as a time reference

Grid lines currently do double duty: value reference *and* "where does tomorrow start".
Removing them takes both. The second job still has to be done — candidates are alternating
day background bands at very low contrast, or day labels alone with no rule beneath them.

**Open question:** is the hour axis going too, or only the temperature and pressure ones?
Time is the one axis where a shared reference is hard to replace, because every point
needs it and no point can carry it.

### For review

1. Icons: move to a fixed band, or keep them on the curve and place labels inside the
   turns?
2. Temperature: label current plus daily max/min, or something else?
3. Is a background tint wanted as a coarse scale, or is that clutter by another name?
4. Pressure: header glyph, conditional annotation, or gone entirely?
5. Gusts: second number, range, or second chevron?
6. Does the hour axis survive?
7. Confirm that the clean look ships *with* multi-resolution rather than before it.

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

## Phase 1 — Remove the grid and axes · **superseded**

Described in "The clean look" above, which replaces this phase. Kept as a heading only
so the original numbering still resolves.

The warning that came out of the reassessment stands: the axis bands (`legendBand`,
`dateBand`, `windBand`, `hourLabelBand`) are inputs to `layout.ts`, which computes the
plot rectangle from them, and both #24 and #46 were sizing bugs in that code. Removing
axes is a change to the geometry model, not a rendering change. `test/layout.test.ts` and
`test/geometry.mjs` are the safety net; the byte-level snapshot will legitimately change.

## Phase 6 — Cloud cover, once the header exists

Whether the cloud band is redundant once a header illustration shows conditions. Cannot
be judged until Phase 3 exists. Keep the data either way — the band is cheap and some
users read it directly.

---

## Order

1. **Phase 4 — precipitation range.** Small, self-contained, independent of the clean
   look, and it uses data already being fetched and discarded. Good first move whatever
   is decided about the rest.
2. **Phase 5 — multi-resolution.** Promoted: it is a prerequisite for the clean look, not
   a parallel feature. In-place labels need few points.
3. **The clean look** — icons and temperature labels, then pressure, then wind. Sequenced
   internally by the icon decision, which blocks the temperature work.
4. **Phases 2/3 — header.** Largest, touches the layout model, and the pressure trend
   probably wants to live in it — so it may pull earlier once pressure is decided.
5. **Phase 6 — cloud cover.** Decide after the header exists.

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
