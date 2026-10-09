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
npm test
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

## Vocabulary and lookup

The reading course contains 101 distinct practice words, expanded by reusing the app’s existing glossed letter, vowel and rule vocabulary. Each has checked structure tags for filtering. `data.js` derives a glossary from all existing gloss fields, preserving multiple senses. Tapping a proverb syllable or a Sum cu pa syllable opens its reading, existing glosses, parse and Builder link. Unknown meanings are left blank; unsupported spellings are explicitly identified.

Content follow-ups: the book’s omission of ནྲ from ratak could not be established from the available material, so its list is unchanged with a TODO. Broader orthographic sources include it. The pre-existing gloss “to attract” for འཁོར needs source review and is excluded from the new practice-word expansion. This change retains the manual’s simplified phonetic conventions rather than claiming a dialect-independent transcription.

## Offline, phones and accessibility

`npm run build` fetches fonts if needed, inlines application JS/CSS, copies self-hosted fonts and emits a relative manifest, icon and service worker. The app makes no external runtime requests. `dist/index.html` is still the single-file application; `sw.js`, `manifest.webmanifest`, `icon.svg`, raster icons, fonts and their OFL notices are deployment companions. Deploy the entire `dist/` directory. The existing Pages workflow is unchanged.

The worker precaches HTML, metadata and fonts. Its cache name includes the Pages scope and a SHA-256 digest of built content; activation removes only older TibReading caches for that scope. The first successful online load prepares offline use (status appears in the sidebar/header). HTTP(S) hosting is required for the service worker; opening the HTML locally still runs the app. Font refresh: `node bench/fetch-fonts.mjs --refresh`.

At ≤720px, Learn / Practice / Read / More replaces the sidebar. More opens a keyboard-accessible modal menu. Controls have 44px minimum tap targets, focus indicators and feedback announcements. Tibetan text carries `lang="bo"`; mixed prose preserves language boundaries. Builder works through buttons/selects as well as drag/drop. Tracing supports arrow keys and Space for pen up/down. Dark colors and reduced motion follow system preferences.

`check:reader` additionally verifies all exercise formats, lookup/Builder links, export/import/reset, keyboard tracing, offline fonts/progress after reload at `/TibReading/`, relative hosting, `file://` opening, every mobile view at 390px, and language tags. `check:text` covers all 11 views at desktop widths. `node bench/screenshots.mjs after` regenerates the desktop and mobile review images in `docs/screenshots/`.

Intentionally outside this course: audio/speech, accounts, backend services, analytics, general Sanskrit stacks, archaic post-suffix da, and unverified extensions to the book’s ratak list.


## App icon, startup and installation

A font-independent Tibetan ཨ and book mark is shared by the favicon, loading screen and install invitation. Committed PNGs provide 192px/512px home-screen icons, a maskable Android icon and a 180px Apple touch icon. Edit `public/icon.svg`, then run `npm run icons` (requires Playwright Chromium) to regenerate PNGs. Installers receive opaque square PNGs; the operating system applies its own corner mask. The foreground stays inside the central 80% circular safe zone. Built manifest and PNG filenames include content hashes so an older worker or browser cannot reuse stale installation artwork. The app identity and `/TibReading/` scope remain stable. Every icon is included in the content-hashed offline cache.

The initial HTML shows the icon and three pulsing dots until React mounts, without an artificial delay. Dark mode and reduced motion apply before JavaScript runs; disabled JavaScript gets a readable fallback.

A browser `beforeinstallprompt` offer enables the native install button. iPhone/iPad visitors get Share → Add to Home Screen instructions. Settings always provides installation help when no native offer is available. “Not now” snoozes the inline invitation for seven days, while Settings remains available. Standalone launches and `appinstalled` suppress future invitations; a fresh browser offer clears a stale installed marker after uninstalling. Preferences stay in localStorage separately from course progress. Browsers do not expose a universal installed-app check, so an existing installation cannot always be detected from a separate browser tab/profile (especially on iOS).

`npm run check:install` verifies native offer/accept/cancel/error paths with simulated browser events, dismissal persistence, standalone suppression, iOS instructions, blocked storage, icon dimensions, offline assets and loading/reduced-motion/no-JavaScript behavior. It also runs as part of `check:reader` in CI. These checks do not automate the operating system’s installation dialog. `SCREENSHOTS=1 node bench/install.mjs` captures desktop/mobile install and loading previews after a build.

Installation API reference: [MDN’s install prompt guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt).

If an existing home-screen shortcut retains old artwork, refreshing the page cannot reliably update the operating system’s saved icon. Once the new version is deployed, export your progress from Settings before removing and re-adding the shortcut, then import it if needed. The versioned manifest and icon URLs apply to fresh installations without requiring users to clear their browser’s storage.


For Safari’s native Add to Home Screen sheet, the plain, unsized `apple-touch-icon.png` link is the first link in the head, followed by the hashed 180px link; both and the charset fit within the first 1 KB. The Apple PNG is opaque 8-bit RGB, non-interlaced and explicitly sRGB-tagged. Worker behavior v5 serves icons network-first, revalidating HTTP caches and falling back only to successful image responses when offline. The data-URI fallback is reserved for a failed test on the affected iPhone. See [the exact iPhone test steps and curl inspection](docs/ios-icon-test.md).
