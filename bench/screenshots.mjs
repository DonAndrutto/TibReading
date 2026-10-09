import { chromium } from 'playwright';
import { serve, routeFonts } from './serve.mjs';
import { mkdirSync } from 'node:fs';
const phase = process.argv[2] || 'after';
const server = await serve({ app: new URL('../dist', import.meta.url).pathname }, 4186);
const browser = await chromium.launch();
try {
  mkdirSync('docs/screenshots', { recursive: true });
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await routeFonts(page, 'http://127.0.0.1:4186');
    await page.goto('http://127.0.0.1:4186/app/');
    await page.evaluate(() => document.fonts.ready);
    for (const tab of (phase === 'before' ? ['intro', 'builder'] : ['intro', 'builder', 'practice'])) {
      await page.evaluate(tab => [...document.querySelectorAll('.nav-item')].find(e => e.querySelector('.nav-label').textContent.toLowerCase() === tab).click(), tab);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `docs/screenshots/${phase}-${tab}-${width}.png` });
    }
    await page.close();
  }
} finally { await browser.close(); server.close(); }
