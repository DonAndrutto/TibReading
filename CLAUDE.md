# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TibReading is an interactive Tibetan language reading and writing app built with React + Vite. It serves as a study companion to Dawa Tshering's *Tibetan Grammar Manual Vol. 1*, covering phonology and orthography (the 30 consonants, 4 vowels, stacks, pronunciation rules, tracing, and reading practice with proverbs).

## Commands

```bash
npm run dev       # start dev server (Vite, hot-reload)
npm run build     # production build
npm run preview   # serve the production build locally
```

**There is no test runner, linter, or type-checker.** The only way to verify a change is to run `npm run dev` and exercise the affected view in the browser. Always do this before pushing. For content-only edits to `src/data.js`, the Vite build itself (run by CI) will catch syntax errors, so a quick `npm run build` is sufficient instead of a full dev-server check.

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
                   # full root text with rhymed English translation (default landing tab)
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

## Styling Conventions

All CSS lives in `src/styles.css` as a single file with block comments marking sections per view. CSS custom properties in `:root` define the full palette:

- `--paper` / `--paper-deep` / `--paper-edge` — background tones
- `--ink` / `--ink-soft` / `--ink-mute` — text hierarchy
- `--maroon` / `--gold` / `--teal` — accent colors
- `--tone-high` / `--tone-asp` / `--tone-low` — consonant tone indicators
- `--serif` / `--ti` / `--mono` — the three font stacks (serif body, Tibetan script, monospace)

Class `.ti` or `font-family: var(--ti)` must be applied anywhere Tibetan Unicode script is rendered so the correct font stack (`Noto Serif Tibetan` → `Noto Sans Tibetan` → `Microsoft Himalaya` → `Jomolhari`) is used. The `.mono` class uses `var(--mono)` for romanizations and labels.

Tone colors are used consistently: `--tone-high` (dark ink) for high-tone consonants, `--tone-asp` (maroon) for aspirated, `--tone-low` (teal) for low-tone.

The app shell is a CSS grid: `280px sidebar | 1fr main`. There is no responsive/mobile breakpoint currently implemented.

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
