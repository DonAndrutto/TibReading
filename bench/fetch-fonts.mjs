// Vendors the Google Fonts the app uses into bench/fonts/ so benchmark runs
// do not depend on the network — and, more importantly, so pretext is
// measured against the real Noto Serif Tibetan rather than whatever the
// fallback chain lands on. Text metrics are only as meaningful as the font
// they were taken in.
//
// Not committed: run `node bench/fetch-fonts.mjs` once before benchmarking.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'fonts');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const CSS = 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+Tibetan:wght@400;500;600&display=swap';

mkdirSync(out, { recursive: true });
let css = await (await fetch(CSS, { headers: { 'user-agent': UA } })).text();

const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map(m => m[1]))];
for (const u of urls) {
  const name = createHash('sha1').update(u).digest('hex').slice(0, 12) + '.woff2';
  const path = join(out, name);
  if (!existsSync(path)) {
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    writeFileSync(path, buf);
  }
  css = css.split(u).join('__FONTBASE__/' + name);
}
writeFileSync(join(out, 'fonts.css'), css);
console.log(`vendored ${urls.length} font files into bench/fonts/`);
