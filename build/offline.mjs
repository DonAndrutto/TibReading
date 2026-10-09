import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

// The application remains one HTML file with inline JS/CSS. PWA metadata,
// worker, icons and font binaries are auxiliary files with relative URLs.
export function offlinePlugin() {
  let out, command;
  return {
    name: 'tibreading-offline',
    enforce: 'post',
    configResolved(config) { out = config.build.outDir; command = config.command; },
    buildStart() { execFileSync(process.execPath,['bench/fetch-fonts.mjs'],{stdio:'inherit'}); },
    configureServer(server) {
      server.middlewares.use('/fonts', (req,res,next) => {
        const name = req.url?.slice(1);
        if (!name || !/^[a-f0-9]+\.woff2$/.test(name)) return next();
        try { res.setHeader('Content-Type','font/woff2'); res.end(readFileSync(join('bench/fonts',name))); } catch { next(); }
      });
    },
    transformIndexHtml(html) {
      if (command !== 'serve') return html;
      const css = readFileSync('bench/fonts/fonts.css','utf8').replaceAll('__FONTBASE__','/fonts');
      return html.replace('</head>',`<style>${css}</style></head>`);
    },
    closeBundle() {
      if (command !== 'build') return;
      const fontDir = 'bench/fonts';
      const names = readdirSync(fontDir).filter(n=>n.endsWith('.woff2')).sort();
      mkdirSync(join(out,'fonts'),{recursive:true});
      names.forEach(n=>copyFileSync(join(fontDir,n),join(out,'fonts',n)));
      const css = readFileSync(join(fontDir,'fonts.css'),'utf8').replaceAll('__FONTBASE__','./fonts');
      const path = join(out,'index.html');
      let html = readFileSync(path,'utf8').replace('</head>',`<style>${css}</style><link rel="manifest" href="./manifest.webmanifest"></head>`);
      writeFileSync(path,html);
      const manifest = {name:'Tibetan Manual — Reading & Writing',short_name:'TibReading',id:'./',start_url:'./',scope:'./',display:'standalone',background_color:'#F4ECD8',theme_color:'#7A1F1F',icons:[{src:'./icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]};
      const icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="40" fill="#7A1F1F"/><path d="M40 52q28-12 56 4 28-16 56-4v90q-28-12-56 4-28-16-56-4z" fill="#F4ECD8"/><path d="M96 56v90M55 76h25M55 92h25M112 76h25M112 92h25" fill="none" stroke="#7A1F1F" stroke-width="5"/></svg>';
      writeFileSync(join(out,'manifest.webmanifest'),JSON.stringify(manifest,null,2));
      writeFileSync(join(out,'icon.svg'),icon);
      const assets = ['index.html','manifest.webmanifest','icon.svg',...names.map(n=>'fonts/'+n)];
      const hash = createHash('sha256');
      // Worker behavior is part of the hash too, so cache changes deploy safely.
      const behaviorVersion = '4'; hash.update(behaviorVersion);
      assets.forEach(n=>hash.update(n).update(readFileSync(join(out,n))));
      const version = hash.digest('hex').slice(0,16);
      writeFileSync(join(out,'sw.js'),`
const PREFIX = 'tibreading:' + new URL(self.registration.scope).pathname + ':';
const CACHE = PREFIX + '${version}';
const ASSETS = ${JSON.stringify(assets)}.map(p => new URL(p,self.registration.scope).href);
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(ASSETS);
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(async () => (await caches.open(CACHE)).match(ASSETS[0])));
  } else if (ASSETS.includes(url.href)) {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(event.request)) || fetch(event.request))());
  }
});
`);
      console.log(`Offline cache ${version}: HTML + ${names.length} self-hosted fonts`);
    },
  };
}
