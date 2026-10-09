// Minimal static server for the benchmark: maps /<name>/ to a built dist dir,
// plus /fonts/ for the vendored web fonts.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const TYPES = { '.png': 'image/png', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2' };

export function serve(roots, port = 4173) {
  const all = { fonts: join(here, 'fonts'), ...roots };
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const [, name, ...rest] = url.pathname.split('/');
    const root = all[name];
    if (!root) { res.writeHead(404); return res.end('no such condition'); }
    const rel = rest.join('/');
    const file = rel ? join(root, rel) : join(root, 'index.html');
    const path = rel && existsSync(file) ? file : join(root, 'index.html');
    try {
      const body = readFileSync(path);
      res.writeHead(200, {
        'content-type': TYPES[extname(path)] || 'application/octet-stream',
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      });
      res.end(body);
    } catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise(r => server.listen(port, () => r(server)));
}

// Serve the app's Google Fonts from disk. Every condition gets byte-identical
// fonts with no network variance, and — the point — pretext is measured
// against the real Noto Serif Tibetan, not a fallback that happens to be
// installed.
export async function routeFonts(page, origin) {
  const css = join(here, 'fonts', 'fonts.css');
  if (!existsSync(css)) {
    await page.route('https://fonts.googleapis.com/**', r => r.abort());
    await page.route('https://fonts.gstatic.com/**', r => r.abort());
    return false;
  }
  const body = readFileSync(css, 'utf-8').split('__FONTBASE__').join(origin + '/fonts');
  await page.route('https://fonts.googleapis.com/**', r =>
    r.fulfill({ status: 200, contentType: 'text/css; charset=utf-8', body }));
  await page.route('https://fonts.gstatic.com/**', r => r.abort());
  return true;
}
