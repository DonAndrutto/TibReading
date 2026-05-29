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

There is no test runner, linter, or type-checker configured.

## Architecture

The app is a pure client-side React SPA. There is no router — navigation is a single `tab` state string in `App.jsx`, toggled via the `Sidebar`. Each tab value maps to one view component rendered conditionally.

```
src/
  data.js          # single source of truth — all Tibetan content (consonants, vowels,
                   # subscripts/superscripts, rules, practice words, proverbs, builder word)
  App.jsx          # root — holds tab state, renders <Sidebar> + the active view
  main.jsx         # ReactDOM.createRoot entry point
  styles.css       # all styles (single flat file, organized by view with comments)
  components/
    Sidebar.jsx    # nav with hardcoded item list, receives tab + setTab props
    PaperTest.jsx  # animated SVG widget showing aspirated vs. unaspirated airflow
  views/
    AlphabetView   # 30-consonant grid with detail panel; keyboard arrow navigation
    VowelsView     # interactive consonant + vowel combiner
    StacksView     # sub/superscript stacks browser (tabbed: subscripts / superscripts)
    BuilderView    # step-by-step syllable assembler (animated) for བསྒྲུབས་
    RulesView      # filterable spelling-to-sound rules with tap-to-reveal examples
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
- **proverb line syllable**: `{ t, r, g, note? }` — Tibetan glyph, reading, gloss, optional rule note
- **builderWord.parts**: 7 positions describing the anatomy of a syllable — each part has `{ id, label, tib, rom, glyph, add, color, silent, sound, role, family }`

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

## Key Interactions

- **AlphabetView** — arrow keys navigate the consonant grid (registered on `window` via `useEffect`; guard checks `e.target.tagName` to avoid firing in inputs).
- **BuilderView** — animated assembly uses `setTimeout` via `useRef` to step through `W.parts`; `step` controls how many parts are shown, `sel` controls which detail panel is displayed independently.
- **TraceView** — canvas drawing uses `devicePixelRatio` scaling for crisp HiDPI rendering; touch and mouse events share the same handlers.
- **ReadView** quiz — `options` is derived with `useMemo` keyed on `qIdx`; distractors are picked randomly from words with a different romanization than the correct answer.
- **ProverbsView** — `active` state is `{ line, syl }` indices; navigation wraps across line boundaries.
