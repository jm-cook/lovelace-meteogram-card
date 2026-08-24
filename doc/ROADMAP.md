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

#### The standard vocabulary — and why it cannot be used as written

There *is* a defined scale, confirmed against the Met Office's own tables. It belongs to
the synoptic station report, so it is a trailing three-hour measure of an observed
barometer:

| Term | Change in the preceding three hours |
|---|---|
| rising / falling **slowly** | 0.1 – 1.5 hPa |
| rising / falling | 1.6 – 3.5 hPa |
| rising / falling **quickly** | 3.6 – 6.0 hPa |
| rising / falling **very rapidly** | more than 6.0 hPa |
| rising / falling **more slowly** | still moving the same way, at a progressively slower rate |
| **now** rising / falling | was falling (rising) or steady, but at observation time definitely turned |

The published table is worth reading carefully: its *very rapidly* row carries the
description of the **reversal** case, not a magnitude, so the two bottom rows appear to
have merged somewhere in reproduction. Either reading rules the term out for us — see the
decision below.

The Shipping Forecast does not use this. Its synopsis describes a *system* — position,
central pressure, and movement in knots (*slowly* under 15, *steadily* 15–25, *rather
quickly* 25–35, *rapidly* 35–45, *very rapidly* over 45) — plus **deepening** and
**filling** for the low itself. None of it transfers to pressure at one point.

**Applied to the recorded forecast the station scale collapses.** The largest three-hour
change anywhere in the hourly region is **1.4 hPa**, so every hour lands in the lowest
band: 48 h *falling slowly*, 6 h *rising slowly*, 1 h *steady*. The thresholds are
calibrated for a barometer reading, where 0.1 hPa is real; a forecast is smoothed, so its
three-hour deltas are systematically smaller and the scale never leaves its floor.

Nor can *rapidly* ever fire on a two-day view: the steepest sustained rate in the whole
ten-day file is **5.4 hPa/day**, against a WMO "rapidly" of 16 hPa/day.

**Conclusion — borrow the words, recalibrate the numbers.** *Falling slowly* is what a
reader recognises, but 0.1 hPa is not the threshold that makes it true of a forecast.
And the two useful terms here are the ones that are not numeric: *more slowly* and *now
rising* describe the turn, which is the thing a household reader actually wants.

#### Two measures, two jobs

They should not compete for the same slot:

- **A three-hour tendency, standard scale, as a *now* reading** — one glyph plus a word,
  in the header or the tooltip. This is where the official vocabulary is honest, because
  it is being used for what it was defined for.
- **A long centred window for the strip.** The barometer analogy holds: what matters is
  which side of the needle you are on, and with forecast data ahead of us the strip can
  commit to a direction until it actually changes, rather than re-deciding hourly.

The graded-depth treatment (colour depth tracking rate, rather than named bands) came out
of this: it shows *more slowly* as a fade without needing a threshold to cross.

#### Decided: three bands, a steady, and a taper

- **Three magnitude bands plus steady**, in the standard's own words — *steady*, *rising /
  falling slowly*, *rising / falling*, *rising / falling quickly*.
- **Thresholds recalibrated to 0.8 / 2.5 / 4.0 hPa per day** over the centred two-day
  window. On the recorded forecast that gives 28 hours steady, then 63, 101 and 45 — all
  four populated, where the published thresholds put 100% of it in one band.
- **`very rapidly` is dropped.** As a magnitude it is 6 hPa/3h — 48 per day, against a
  forecast maximum of 5.4, so it could never fire. As the table's own description has it,
  it is a reversal rather than a rate and belongs with *now rising*, not on an intensity
  ladder. Either way it earns no colour.
- **The published bands stay unaltered for the header's *now* reading.** Only the strip's
  thresholds move. A three-hour tendency at one moment is exactly what the scale was
  defined to measure, so it should say *falling slowly* when a barometer would.
- **`more slowly` is a modifier, not a band.** It applies on top of the other three — you
  can be falling quickly more slowly — so giving it a colour would steal hours from the
  bands and the strip would stop meaning intensity. It is drawn as a lightening of
  whichever band is already there.
- **Drawing rules, both learned the hard way.** Draw each band run as one solid rect, not
  as translucent hour-cells over a base — an overlay leaks the base through every
  antialiased seam and the strip comes out looking hatched. And enforce a **four-hour
  minimum run**: a band that holds for a single hour is a rounding artefact, and at strip
  width it draws as a sliver that reads as a rendering fault.
- **The ramp inverts between themes.** On light, deeper colour is the stronger band; on
  dark, deeper disappears into the ground, so stronger has to mean brighter.
- **The taper must be measured against the run, not the previous hour.** Comparing
  neighbours makes it flicker on and off hour by hour, which is the same confetti the long
  window was chosen to avoid. Taken as a fade from each run's peak toward its end it is
  monotone: the deep fall through d1 pales as it bottoms out, the long climb fades from d6.

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

## Phase 7 — A readout at a point · [#31](https://github.com/DTekNO/lovelace-meteogram-card/issues/31)

Requested: click or hover a position and see the forecast for that hour, the way
ApexCharts and the HA history card do. The reporter's own case is the strongest one —
they were reading the wind and realised the barbs have to be decoded, with no way to ask
the card what it actually meant.

**This is not a side feature. It is the missing half of the clean look.** Everything above
proposes removing value references: the grid goes, the temperature axis goes, the pressure
axis goes, and in-place labels carry what is left. That trades a reference anyone can read
at any point for a few labelled points — which is the right trade for glanceability, and
leaves "what exactly is it at 3pm tomorrow" unanswerable. A readout answers it on demand
without putting anything back on the chart. The two features argue for each other:
subtraction is easier to justify when the detail is a tap away, and the readout is worth
more once the axes are gone.

So it should not wait for the clean look. Built first, it de-risks it.

### What already exists

More than it appears. The sun strip is a worked example of this exact interaction: a
tap target per segment, a panel that positions itself, dismissal on a tap anywhere else,
namespaced so it cannot clobber another handler, and `test/sun-tap.mjs` driving it in a
real browser. A forecast readout is the same shape of thing over the whole plot rather
than one band, and it should reuse that machinery rather than grow a second copy.

### What has to be decided

- **Hover and tap are not the same feature.** This card usually lives on a wall tablet,
  where hover does not exist — the sun strip's times were `<title>` only and were
  therefore unreachable on the device the card most often runs on. Whatever is built has
  to work by tap, with hover as the desktop convenience. It cannot be a `<title>`.
- **One panel or one per series.** The request offers both readings: every attribute at
  that time, or a single box showing all of them. A single box is likely right — it is
  one hit target rather than six overlapping ones, and it answers "what is this hour
  like" rather than "what is this pixel".
- **What the panel says when a field is missing.** Most entities publish neither
  pressure nor a precipitation range, and met.no publishes the range only inside the
  Nordic area. A readout makes absence visible in a way the chart never did — a chart
  simply omits a curve, but a labelled panel with a blank row is conspicuous.
- **Whether the panel survives a redraw.** The chart animates hourly and the forecast
  advances underneath it. A panel pinned to an hour must either travel with that hour —
  it is keyed on `d.t` like everything else — or dismiss itself. Silently retargeting to
  whatever now occupies that x position would be the worst of the three.

### The resolution problem, for the fourth time

met.no is hourly for the first days and six-hourly after, and the x scale is by index. A
tap two-thirds of the way along the plot does not land on an hour; it lands in a
six-hour interval, and the honest answer there is a range or a coarser label, not a
confident single hour. Nearest-point snapping would return an exact-looking time that is
up to three hours out.

This is the fourth design decision the resolution change has driven, after in-place
labelling, the wind band and the pressure window. It is now a property of the data that
every feature has to accommodate, and it is the first thing to check in any new one.

---

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

**Phase 7 — the readout** sits outside that sequence and could come first. It is
independent of everything above, it is the one item requested by a user rather than
chosen from inside, and it strengthens the argument for the clean look rather than
depending on it. The sun strip already carries most of the machinery.

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
