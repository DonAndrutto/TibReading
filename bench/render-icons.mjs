// Regenerate committed raster icons from the font-independent SVG source.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const browser = await chromium.launch();
try {
  const svg = readFileSync('public/icon.svg', 'utf8');
  for (const [name, size] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180],['icon-maskable-512.png',512]]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    // Opaque, square canvases: iOS/Android apply their own corner masks.
    await page.setContent(`<style>html,body{width:100%;height:100%;margin:0;background:#7A1F1F}svg{display:block;width:100%;height:100%}</style>${svg}`);
    await page.screenshot({ path: `public/${name}`, omitBackground: true });
    await page.close();
  }
} finally { await browser.close(); }
