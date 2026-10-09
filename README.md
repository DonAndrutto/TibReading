# TibReading

A client-side React 18 + Vite companion to Dawa Tshering’s *Tibetan Grammar Manual Vol. 1*. Content lives in `src/data.js`.

## Develop and check

```sh
npm ci
node bench/fetch-fonts.mjs
npx playwright install chromium
npm run dev
# Before submitting changes:
npm run build
npm run check:romanization
npm run check:text
npm run check:reader
```

The Playwright checks use locally downloaded fonts and Chromium. `check:text` checks label fit; `check:reader` checks every view and scroll anchoring during reader zoom/language changes. The romanization check rejects duplicate base-consonant readings and inconsistent readings of the same Tibetan form. Explicit `contextReading` fields describe contextual pronunciation; Wylie spelling is separate from phonetic reading.

The layout has responsive breakpoints at 1100px and 720px. `vite-plugin-singlefile` inlines app JavaScript and CSS into `dist/index.html`. GitHub Pages deploys `dist/` under `/TibReading/` on pushes to `main` through `.github/workflows/deploy.yml`.

## Progress and navigation

Hash links such as `#/alphabet/5`, `#/vowels/ི`, and `#/read/3` survive refresh and support back/forward. The last view is restored when no hash is supplied. Settings exports/imports versioned JSON and confirms replacement or reset. Version 1 `seen`/`mastered` arrays migrate to version 2 card records. Invalid/future imports are rejected without changing saved progress; unavailable storage falls back to the current session with an export reminder.

## Practice and spelling

`npm test` runs Vitest coverage of Leitner scheduling, migration/import failure handling, romanization collisions, syllable validation, root finding, deck distractors and route parsing. `check:reader` also runs `bench/course.mjs` for routing, a complete practice session, Builder challenge/validation and reading self-grades.

The unified deck deduplicates Tibetan forms across the consonants, vowels, stacks and vocabulary. Recognition, production, typed answers, ordered parts and root finding share a card schedule. Leitner boxes use 1, 2, 4, 8 and 16 days: a first correct answer starts box 1; later correct answers advance; misses reset to box 1 and are due in 10 minutes; “unsure” drops one box and is due in a day. Box 5 is mastered. Streaks count local calendar days with a graded answer. Weak review selects reviewed cards in boxes 1–2. Session queues are fixed when started; each answer is saved immediately.

Builder uses the native syllable patterns in `data.js`, with prefix permissions for whole stacks, explicit triple stacks and second-suffix restrictions. It never joins full-form consonants to imitate a stack. Unsupported/ambiguous forms are reported rather than guessed. Wylie is spelling, while the app’s phonetic romanization is a reading aid; type-in accepts either, ignoring case and whitespace.

Orthographic references: [MSU Basic Tibetan, root letters](https://openbooks.lib.msu.edu/basictibetan/chapter/2-3/), [prefixes](https://openbooks.lib.msu.edu/basictibetan/chapter/3-2/), [post-suffixes](https://openbooks.lib.msu.edu/basictibetan/chapter/2-1/), and [BDRC/OpenPecha’s EWTS tables](https://github.com/OpenPecha/pyewts/blob/master/pyewts/pyewts.py). Native letter-combination facts were checked against these sources; this is not a general Sanskrit/EWTS converter.
