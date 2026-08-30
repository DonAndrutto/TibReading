// Functional check for the reader, and the assertion behind the whole change:
// after a zoom step or a language switch, the line the reader was looking at
// is still where it was.
//
// scrollY is deliberately reported next to it. On main the language switch
// leaves scrollY untouched and moves the text 1,500px — which is exactly why
// "did the scroll position change" is the wrong question to ask.
//
// Usage: npm run check:reader   (builds dist/ first)

import { chromium } from 'playwright';
import { serve, routeFonts } from './serve.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const PORT = 4182;
const MAX_DRIFT_PX = 2;

const TABS = ['Intro', 'Alphabet', 'Vowels', 'Stacks', 'Builder', 'Rules', 'Trace', 'Read', 'Proverbs'];

// toLang is which languages are showing AFTER the click. The element we track
// has to survive the change — measuring a display:none element would report
// nonsense, and it is a mistake this test made before it was fixed.
const STEPS = [
  ['zoom in',        '[data-zoom="in"]',            'both'],
  ['zoom in',        '[data-zoom="in"]',            'both'],
  ['zoom in',        '[data-zoom="in"]',            'both'],
  ['Tibetan only',   '.lang-chip[data-lang="ti"]',  'ti'],
  ['both',           '.lang-chip[data-lang="both"]','both'],
  ['English only',   '.lang-chip[data-lang="en"]',  'en'],
  ['both',           '.lang-chip[data-lang="both"]','both'],
  ['zoom out',       '[data-zoom="out"]',           'both'],
  ['reset zoom',     '[data-zoom-readout]',         'both'],
];

const MEASURE = async ({ sel, toLang }) => {
  const body = document.querySelector('.sum-body');
  const want = toLang === 'ti' ? '.sum-verse-ti, .sum-verse-label'
    : toLang === 'en' ? '.sum-line, .sum-verse-label'
    : '.sum-verse-ti, .sum-line, .sum-verse-label';
  const readingLine = window.innerHeight * 0.25;
  let a = null, best = Infinity;
  for (const el of body.querySelectorAll(want)) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.bottom <= 0 || r.top >= window.innerHeight) continue;
    const d = Math.abs(r.top - readingLine);
    if (d < best) { best = d; a = { el, top: r.top, text: el.textContent.trim().slice(0, 26) }; }
  }
  if (!a) return null;

  const y0 = window.scrollY;
  document.querySelector(sel).click();
  for (let i = 0; i < 16; i++) await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));

  return {
    anchor: a.text,
    drift: +(a.el.getBoundingClientRect().top - a.top).toFixed(2),
    scrolled: window.scrollY - y0,
    // The page is clamped at the top, so an anchor already at scroll 0 cannot
    // be corrected downward — not a failure, just nowhere left to go.
    atTop: window.scrollY === 0,
    scale: getComputedStyle(document.querySelector('.sum-body')).getPropertyValue('--reader-scale').trim(),
    lang: document.querySelector('.sum-body').getAttribute('data-lang'),
    readout: document.querySelector('[data-zoom-readout]').textContent,
  };
};

const server = await serve({ app: join(repo, 'dist') }, PORT);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errors.push('console: ' + m.text()); });

await routeFonts(page, `http://127.0.0.1:${PORT}`);
await page.goto(`http://127.0.0.1:${PORT}/app/`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

let failed = 0;

// 1. Every view renders without hitting the error boundary.
for (const tab of TABS) {
  await page.evaluate((t) => {
    [...document.querySelectorAll('.nav-item')]
      .find(i => i.querySelector('.nav-label').textContent.trim() === t).click();
  }, tab);
  await page.waitForTimeout(120);
  const crashed = await page.$('.view-crash');
  if (crashed) { console.log(`  ${tab.padEnd(10)} CRASHED`); failed++; }
}
console.log(`views: ${TABS.length - failed}/${TABS.length} render`);

// 2. The reader keeps its place through every control.
await page.evaluate(() => {
  [...document.querySelectorAll('.nav-item')]
    .find(i => i.querySelector('.nav-label').textContent.trim() === 'Intro').click();
});
await page.waitForTimeout(200);
await page.getByRole('button', { name: /tap to read the root text/i }).click();
await page.waitForSelector('.sum-verse');
await page.waitForTimeout(900);
await page.evaluate(() => {
  const vs = document.querySelectorAll('.sum-verse');
  vs[Math.floor(vs.length / 2)].scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(300);

console.log(`\nreader — line drift after each control (budget ${MAX_DRIFT_PX}px):`);
for (const [label, sel, toLang] of STEPS) {
  const r = await page.evaluate(MEASURE, { sel, toLang });
  if (!r) { console.log(`  ${label.padEnd(14)} no visible anchor`); failed++; continue; }
  const over = Math.abs(r.drift) > MAX_DRIFT_PX && !r.atTop;
  if (over) failed++;
  console.log(
    `  ${label.padEnd(14)} drift ${String(r.drift).padStart(7)}px   ` +
    `scrolled ${String(r.scrolled).padStart(6)}px   ${r.readout.padStart(5)} ${r.lang.padEnd(5)}` +
    `  ${over ? 'OVER BUDGET' : 'ok'}   "${r.anchor}"`);
}

await browser.close();
server.close();

if (errors.length) { console.log('\npage errors:'); errors.forEach(e => console.log('  ' + e)); failed += errors.length; }
console.log(failed ? `\nFAILED (${failed})` : '\nall checks passed');
process.exit(failed ? 1 : 0);
