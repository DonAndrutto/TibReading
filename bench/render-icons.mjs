// Regenerate committed raster icons from the font-independent SVG source.
import { chromium } from 'playwright';
import { tagSRGB } from '../build/png.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const browser = await chromium.launch({ args:['--force-color-profile=srgb'] });
try {
  const svg = readFileSync('public/icon.svg', 'utf8');
  for (const [name, size] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180],['icon-maskable-512.png',512]]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    // Opaque, square canvases: iOS/Android apply their own corner masks.
    await page.setContent(`<style>html,body{width:100%;height:100%;margin:0;background:#7A1F1F}svg{display:block;width:100%;height:100%}</style>${svg}`);
    const png = await page.screenshot({ omitBackground: false });
    writeFileSync(`public/${name}`, name === 'apple-touch-icon.png' ? tagSRGB(png) : png);
    await page.close();
  }
} finally { await browser.close(); }
