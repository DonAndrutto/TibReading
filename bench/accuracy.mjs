// Does pretext's estimate match what the browser actually lays out?
//
// contain-intrinsic-size is only worth using if the number is real. This
// walks every verse, forces the browser to lay it out for real, and compares
// the measured height against the --verse-h that reader.js wrote from
// pretext alone.
import { chromium } from 'playwright';
import { serve, routeFonts } from './serve.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const server = await serve({ bench: join(here, 'dist') }, 4189);
const browser = await chromium.launch();

for (const zoom of [0, 2, 4]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await routeFonts(page, 'http://127.0.0.1:4189');
  // The bench page turns on createReader's intrinsicSizes option, which is
  // what writes --verse-h. The app leaves it off.
  await page.goto('http://127.0.0.1:4189/bench/?mode=fast', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('.sum-verse');
  for (let i = 0; i < zoom; i++) { await page.click('[data-zoom="in"]'); await page.waitForTimeout(150); }
  await page.waitForTimeout(900);

  const res = await page.evaluate(async () => {
    const verses = [...document.querySelectorAll('.sum-verse')];
    const rows = [];
    for (const v of verses) {
      const est = parseFloat(v.style.getPropertyValue('--verse-h'));
      // Force a real layout for this verse: scroll it into view so
      // content-visibility stops skipping it, then read.
      v.scrollIntoView({ block: 'center' });
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
      const real = v.getBoundingClientRect().height;
      rows.push({ est, real, err: est - real, pct: 100 * (est - real) / real });
    }
    return { rows, scale: getComputedStyle(document.querySelector('.sum-body')).getPropertyValue('--reader-scale') };
  });

  const px = res.rows.map(r => Math.abs(r.err)).sort((a, b) => a - b);
  const exact = res.rows.filter(r => Math.abs(r.err) <= 2).length;
  const pct = res.rows.map(r => Math.abs(r.pct)).sort((a, b) => a - b);
  const over = res.rows.filter(r => r.err > 2).length;
  const under = res.rows.filter(r => r.err < -2).length;
  console.log(
    `scale ${res.scale.trim().padEnd(5)} verses ${res.rows.length}` +
    `  over ${over} / under ${under}` +
    `  within 2px: ${exact}/${res.rows.length}` +
    `  |err| median ${px[px.length >> 1].toFixed(1)}px (${pct[pct.length >> 1].toFixed(2)}%)` +
    `  max ${px[px.length - 1].toFixed(1)}px (${pct[pct.length - 1].toFixed(1)}%)`);
  await page.close();
}

await browser.close();
server.close();
