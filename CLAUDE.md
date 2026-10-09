# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TibReading is an interactive Tibetan language reading and writing app built with React + Vite. It serves as a study companion to Dawa Tshering's *Tibetan Grammar Manual Vol. 1*, covering phonology and orthography (the 30 consonants, 4 vowels, stacks, pronunciation rules, tracing, and reading practice with proverbs).

## Commands

```bash
npm ci                 # install dependencies
node bench/fetch-fonts.mjs # fetch fonts for deterministic checks
npx playwright install chromium # browser used by checks
npm run check:romanization # detect inconsistent readings
npm run dev            # start dev server (Vite, hot-reload)
npm run build          # production build
npm run preview        # serve the production build locally

npm run check:reader   # build + drive the app in Chromium: every view renders,
                       # and the reader's line stays put through zoom/language
npm run check:text     # build + measure every label against its box with
                       # pretext; fails if content outgrows its space
npm run bench          # build + benchmark the reader against a naive baseline
```

**There is no unit-test runner, linter, or type-checker,** but `check:reader` and `check:text` are real automated checks and both must pass before pushing. Anything they do not cover still needs `npm run dev` and a look in the browser. For content-only edits to `src/data.js`, run `npm run check:text` — it is what catches a proverb title that has grown past its card.

The checks drive a real Chromium via Playwright and serve the built `dist/`, so run `npm run build` first if invoking the scripts directly. `node bench/fetch-fonts.mjs` vendors the Google Fonts locally once, so measurements use the real Noto Serif Tibetan instead of a fallback.

## Architecture

The app is a pure client-side React SPA. There is no router — navigation is a single `nav` state (`{ tab, payload }`) in `App.jsx`, changed via `go(tab, payload)`. The `Sidebar` calls `go` with no payload; views receive `go` to render cross-section links (e.g. Alphabet → "Trace this letter"), and Alphabet/Vowels/Trace accept an `initial` payload (`{ letter: index }`) to open on a specific consonant. Each tab value maps to one view component rendered conditionally, wrapped in an `ErrorBoundary` keyed by tab so a view crash never takes down the sidebar.

```
src/
  data.js          # single source of truth — all Tibetan content (consonants, vowels,
                   # subscripts/superscripts, rules, practice words, proverbs, builder word,
                   # intro history sections + Sum cu pa root text in verse)
  App.jsx          # root — holds nav state + go(), ErrorBoundary, renders <Sidebar> + the active view
  main.jsx         # ReactDOM.createRoot entry point
  utils.js         # tiny shared helpers (Fisher–Yates shuffle used by all quiz option builders)
  textMeasure.js   # text measurement over @chenglou/pretext — line counts and heights
                   # without touching the DOM. prepare() once per string at a 100px
                   # reference size, then every zoom level is one multiply
  reader.js        # imperative controller for the Sum cu pa reader: zoom, language,
                   # and the scroll anchoring that keeps the reader's line still
  styles.css       # all styles (single flat file, organized by view with comments)
  components/
    Sidebar.jsx    # nav with hardcoded item list, receives tab + setTab props
    PaperTest.jsx  # animated SVG widget showing aspirated vs. unaspirated airflow
    VocabCards.jsx # reusable expandable vocabulary deck (tap-to-reveal + quiz) over any
                   # { g, r, m } word list; takes words/title/lead props. Used by both
                   # AlphabetView (single-letter words) and VowelsView (consonant + vowel words)
  views/
    IntroView      # history of the script (Thonmi Sambhota, script architecture,
                   # foundational texts, pedagogy); the Sum cu pa card expands into the
                   # full root text with rhymed English translation, with reader
                   # controls for text size and language (default landing tab)
    AlphabetView   # 30-consonant grid with detail panel; keyboard arrow navigation;
                   # ends with a <VocabCards> single-letter vocabulary section
    VowelsView     # interactive consonant + vowel combiner; ends with a <VocabCards>
                   # consonant-plus-vowel vocabulary section
    StacksView     # sub/superscript stacks browser (tabbed: subscripts / superscripts)
    BuilderView    # step-by-step syllable assembler (animated) for བསྒྲུབས་
    RulesView      # spelling-to-sound rules: Browse (category filter + tap-to-reveal
                   # examples) and Quiz (read-aloud multiple choice) modes
    TraceView      # canvas drawing pad for letter tracing with ghost-guide toggle
    ReadView       # flashcard + multiple-choice quiz over practiceWords
    ProverbsView   # syllable-by-syllable annotated proverbs/prayers
```

**`src/data.js` is the only data layer.** All views import `TIBETAN_DATA` (aliased as `D`) from it — no API calls, no external state, no context. Adding new content (a consonant note, a rule, a proverb) means editing this file.

## Data Shapes (key fields)

- **consonant**: `{ g, r, t, v, n }` — glyph, romanization, tone (`"high"` / `"high asp."` / `"low"`), vocabulary hint, number (1–30)
- **vowel**: `{ mark, name, nameR, pos, sound, hint }`
- **subscript/superscript group**: `{ name, mark, glyph, desc, stacks: [{ s, r, gloss? }] }`
- **rule**: `{ id, title, tag, desc, examples: [{ spell, reads, gloss?, suf? }] }`
- **practiceWord**: `{ w, r, m }` — Tibetan word, romanization, meaning
- **letterWord** / **vowelWord**: `{ g, r, m }` — glyph, romanization, meaning. `letterWords` are bare single consonants that are words; `vowelWords` are a consonant + a single vowel that is a word. Both feed the shared `<VocabCards>` deck.
- **proverb line syllable**: `{ t, r, g, note? }` — Tibetan glyph, reading, gloss, optional rule note
- **builderWord.parts**: 7 positions describing the anatomy of a syllable — each part has `{ id, label, tib, rom, glyph, add, color, silent, sound, role, family }`
- **intro**: prose sections for the Intro view (`genesis`, `architecture`, `texts`, `pedagogy`) plus **intro.sumchupa** — the Sum cu pa root text: `{ titleTib, titleEn, author, verses: [{ label, tib, en: [lines] }] }`; first verse is the homage, last the colophon, body verses are numbered at render time

## The Reader (Sum cu pa root text)

The expanded root text in `IntroView` is the one place with enough text for
interaction cost to matter, and it follows a convention worth keeping:

**Bucket UI state by what it actually is.**

| kind | channel | where |
|---|---|---|
| scale / size | one CSS custom property (`--reader-scale`) | `.sum-body` |
| visibility | one attribute (`data-lang`) | `.sum-body` |
| what content exists | React state, re-render | `IntroView` |

`.sum-body` is the smallest element enclosing everything the controls affect —
the toolbar sits outside it so the controls never scale with the text. Both
channels are written imperatively by `createReader()`, so zoom and language
never enter the render path: a click mutates one attribute and nothing is
reconciled, created, moved or destroyed. `bench/identity.mjs` asserts that.

Consequences to preserve when editing:

- **No inline `style=` on reader text.** Everything scales through `em` against
  `--reader-scale`; an inline font-size would override the cascade and put the
  size back in the render path.
- **Both languages always render.** Hiding is `display: none` from `data-lang`,
  not a conditional in JSX.
- **Entrance animations are one-shot.** `.sum-scroll.first-paint` drops its
  class on `animationend` so no later change can replay the unroll.
- **Anchor before you mutate, converge after.** `reader.js` predicts the height
  change with pretext (no DOM reads), corrects the scroll in the same tick, then
  converges on the anchor's live position until it holds still across two
  frames. Reads never happen inside `requestAnimationFrame` — rAF runs before
  the frame's layout, so a `getBoundingClientRect()` there forces a reflow of
  what was just mutated.
- **`prepare()` is never on the interaction path.** It is the expensive half of
  pretext (~340ms throttled across this document) and is warmed at idle in
  chunks by `prewarm()`. `layout()` — the part a click pays for — is arithmetic.
- `overflow-anchor: none` on `.sum-body` is load-bearing: the browser's own
  scroll anchoring otherwise fights the convergence loop.

## Styling Conventions

All CSS lives in `src/styles.css` as a single file with block comments marking sections per view. CSS custom properties in `:root` define the full palette:

- `--paper` / `--paper-deep` / `--paper-edge` — background tones
- `--ink` / `--ink-soft` / `--ink-mute` — text hierarchy
- `--maroon` / `--gold` / `--teal` — accent colors
- `--tone-high` / `--tone-asp` / `--tone-low` — consonant tone indicators
- `--serif` / `--ti` / `--mono` — the three font stacks (serif body, Tibetan script, monospace)

Class `.ti` or `font-family: var(--ti)` must be applied anywhere Tibetan Unicode script is rendered so the correct font stack (`Noto Serif Tibetan` → `Noto Sans Tibetan` → `Microsoft Himalaya` → `Jomolhari`) is used. The `.mono` class uses `var(--mono)` for romanizations and labels.

Tone colors are used consistently: `--tone-high` (dark ink) for high-tone consonants, `--tone-asp` (maroon) for aspirated, `--tone-low` (teal) for low-tone.

The app shell is a CSS grid: `280px sidebar | 1fr main`. At ≤720px the shell becomes one column and the sidebar stacks above the content; ≤1100px also simplifies multi-column views.

## Benchmarks and checks (`bench/`, `scripts/`)

Not shipped — `bench/dist`, `bench/fonts` and `scripts/.probe.js` are gitignored
and rebuilt on demand.

- `bench/reader.jsx` — one page, two modes (`?mode=naive` / `?mode=fast`),
  same verses, same CSS, same React. The only differences are the ones under
  test, so the A/B is controlled. `?cv=off` isolates `content-visibility`.
- `bench/run.mjs` — fresh browser context and page per run, 6x CPU throttle,
  median of 15. Cost comes from Chrome's own cumulative CPU counters
  (`Performance.getMetrics`), not a wall clock. The settle window is a fixed
  number of frames for every condition so the harness's own rect reads cannot
  land in one condition's layout counters and not the other's.
- `bench/identity.mjs` — stamps every node before the interaction and checks
  identity, order and mutation count after, splitting on-path work (before the
  first paint) from deferred idle work.
- `bench/accuracy.mjs` — pretext's per-verse height vs what the browser
  actually lays out, at three zoom levels.
- `bench/smoke.mjs` (`npm run check:reader`) — every view renders; the
  reader's line stays within 2px through every control.
- `scripts/check-text.mjs` (`npm run check:text`) — measures every label
  against its real box across 9 views x 2 widths. Budgets are baselined to
  today's rendering, so it guards against content growing past its space.
  `--audit` cross-checks pretext against the browser (0 disagreements over 394
  elements).
- Baseline for a before/after: `git worktree add ../main-baseline main`, build
  there, and point `BENCH_BASELINE` at it.

## Deployment

The app is deployed as a **single self-contained HTML file** to GitHub Pages at `https://donandrutto.github.io/TibReading/`.

- `vite-plugin-singlefile` inlines all compiled JS and CSS into `dist/index.html` at build time (~226 kB / 66 kB gzip). Google Fonts load from CDN and are not inlined.
- `.github/workflows/deploy.yml` runs `npm ci && npm run build` and deploys `dist/` to GitHub Pages on every push to `main`, and can also be triggered manually from the Actions tab (Actions → Deploy to GitHub Pages → Run workflow).
- `dist/` is gitignored — CI builds it fresh on each deploy.
- After any push to `main`, the live site updates within ~1 minute.

## Key Interactions

- **AlphabetView** — arrow keys navigate the consonant grid (registered on `window` via `useEffect`; guard checks `e.target.tagName` to avoid firing in inputs).
- **BuilderView** — animated assembly uses `setTimeout` via `useRef` to step through `W.parts`; `step` controls how many parts are shown, `sel` controls which detail panel is displayed independently.
- **TraceView** — canvas drawing uses `devicePixelRatio` scaling for crisp HiDPI rendering; touch and mouse events share the same handlers.
- **ReadView** quiz — `options` is derived with `useMemo` keyed on `qIdx`; distractors are picked randomly from words with a different romanization than the correct answer.
- **ProverbsView** — `active` state is `{ line, syl }` indices; navigation wraps across line boundaries.
