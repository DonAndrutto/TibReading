// Regenerate committed raster icons from the font-independent SVG source.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const browser = await chromium.launch();
try {
  const svg = readFileSync('public/icon.svg', 'utf8');
  for (const [name, size, maskable] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180],['icon-maskable-512.png',512,true]]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:${maskable ? '#7A1F1F' : 'transparent'}}svg{display:block;width:100%;height:100%}</style>${maskable ? svg.replace('rx="112"','rx="0"') : svg}`);
    await page.screenshot({ path: `public/${name}`, omitBackground: true });
    await page.close();
  }
} finally { await browser.close(); }
