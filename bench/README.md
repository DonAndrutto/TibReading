# Reader benchmarks

Numbers behind the reader rework. Everything here is reproducible:

```bash
node bench/fetch-fonts.mjs   # once — vendors the app's Google Fonts locally
npm run bench                # build + 15 runs per condition
npm run check:reader         # the line-stays-put assertion
npm run check:text           # label overflow check
node bench/identity.mjs      # DOM node identity
node bench/accuracy.mjs      # pretext vs the browser
```

For a `main` baseline: `git worktree add ../main-baseline main`, `npm ci && npm run build`
there, then point `BENCH_BASELINE` at it.

## Method

- **Fresh browser context and page per run.** Not per condition — per run. No
  run inherits another's JIT state, style caches or pretext caches.
- **6x CPU throttle** via CDP. "Instant" only means something off a workstation.
- **Median of 15**, with mean and p95 kept in `results.json` so a skewed
  distribution is visible rather than averaged away.
- **Cost is CPU time, not wall clock** — Chrome's own cumulative counters
  (`Performance.getMetrics`). A wall clock here would mostly measure frame
  boundaries.
- **The settle window is a fixed number of frames for every condition.** An
  early-exit-when-quiet loop gives the slower-converging condition a longer
  observation window, and the harness's own per-frame `getBoundingClientRect`
  reads then land in that condition's layout counters. That measures the ruler.
- **Fonts are served from disk**, identical bytes every run, so pretext is
  measured against the real Noto Serif Tibetan rather than a fallback.
- **The A/B page is controlled**: `bench/reader.jsx` renders the same verses
  with the same CSS and the same React in both modes. Only the thing under test
  differs. `main` vs `branch` covers the language switch, which is the one
  control that exists on both.

## The metric that matters

The reader's *line* has to stay put. `scrollY` is reported next to it because
it is the misleading one — on `main` the language switch leaves `scrollY`
untouched and moves the text a page and a half:

| language switch, real app | main | branch |
|---|---|---|
| **peak line drift** | **1504 px** | **0.17 px** |
| scrollY delta | 0 px | 1504 px |
| main-thread cost (script+style+layout) | 34.6 ms | **22.57 ms** (1.53x) |
| DOM mutations | 64 | **1** |
| style recalcs | 9 | 1 |
| layout passes | 1 | 1 |

`npm run check:reader` asserts drift stays under 2px through nine consecutive
control changes; measured drift is under 0.5px at every step while the page
scrolls by up to 2,542px to hold the line.

## Controlled A/B (same page, same CSS, same React)

Naive = zoom and language as React state, zoom applied via inline `style=`
overriding the stylesheet, one-pass re-anchor reading inside `requestAnimationFrame`.

| zoom, one step | naive | pretext |
|---|---|---|
| main-thread cost | 88.54 ms | **74.07 ms** (1.2x) |
| script | 31.52 ms | 19.28 ms |
| DOM mutations | 133 | **1** |
| line drift | 0.3 px | 0.3 px |

| language switch | naive | pretext |
|---|---|---|
| main-thread cost | 30.5 ms | **24.51 ms** (1.24x) |
| DOM mutations | 62 | **1** |

The cost win is modest because relaying out the text is unavoidable when its
size changes, and 31 verses is not much text. The DOM-churn and correctness
wins are the large ones.

## DOM node identity

`bench/identity.mjs`, on-path = before the first paint after the click:

| | nodes | recreated | reordered | on-path mutations |
|---|---|---|---|---|
| naive · zoom | 254 -> 254 | 0 | no | 133 (`style`) |
| **pretext · zoom** | 254 -> 254 | 0 | no | **1** (`style`, one custom property) |
| naive · language | 254 -> **122** | 0 | **yes** | 31 (`childList`) |
| **pretext · language** | 254 -> 254 | 0 | no | **1** (`data-lang`) |
| main · language (real app) | 262 -> **130** | 0 | **yes** | 33 |
| **branch · language (real app)** | 254 -> 254 | 0 | no | **1** (`data-lang`) |

## pretext accuracy

`bench/accuracy.mjs` — per-verse height from pretext vs what the browser lays
out, 31 verses:

| zoom | within 2px | median error | max | direction |
|---|---|---|---|---|
| 100% | 30/31 | 0.4 px (0.16%) | 49.4 px | over only |
| 130% | 29/31 | 0.3 px (0.08%) | 64.0 px | over only |
| 175% | 29/31 | 0.4 px (0.10%) | 86.1 px | over only |

Never under-estimates, which is the safe direction for `contain-intrinsic-size`.
The outliers are one extra line on verses where Tibetan `།  །` phrase separators
put an ASCII space in the same run as tsek-joined syllables — see the note in
`src/textMeasure.js`.

`npm run check:text --audit` agrees with the browser on 394/394 label line counts.

## content-visibility: measured, and left off

`content-visibility: auto` with pretext-derived `contain-intrinsic-size` is
implemented (`createReader`'s `intrinsicSizes` option) but **not enabled**. On a
document this size it is a loss on every axis:

| | no cv | with cv |
|---|---|---|
| scroll the whole reader | **1.8 ms**, 0 layout passes | 50.69 ms, 18 layout passes |
| zoom, one step | **74.07 ms** | 112 ms |
| language switch | **24.51 ms** | 96.14 ms |
| peak line drift on zoom | **0.3 px** | 74.83 px |

31 verses is about 7,700px: the browser lays the whole thing out once for free
and scrolling costs zero layout passes. Skipping trades that for re-materialising
verses as you scroll, and the height changes that causes outrun the anchoring
convergence. Worth revisiting if the reader ever holds a corpus rather than one
treatise.
