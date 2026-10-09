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
