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
      // Fresh filenames bypass browser/OS caches left over from earlier installs.
      const iconFiles = ['icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
      const iconHash = createHash('sha256');
      iconFiles.forEach(name=>iconHash.update(readFileSync(join(out,name))));
      const iconVersion = iconHash.digest('hex').slice(0,12);
      mkdirSync(join(out,'icons'),{recursive:true});
      const iconURL = name => './icons/' + name.replace('.png','-' + iconVersion + '.png');
      iconFiles.forEach(name=>copyFileSync(join(out,name),join(out,iconURL(name).slice(2))));
      html = html.replace('href="./apple-touch-icon.png"',`href="${iconURL('apple-touch-icon.png')}"`);
      writeFileSync(path,html);
      // PNG-only install icons work across WebAPK, Safari and desktop installers.
      // The SVG remains the favicon and the inline invitation's artwork.
      const icons = [
        {src:iconURL('icon-192.png'),sizes:'192x192',type:'image/png',purpose:'any'},
        {src:iconURL('icon-512.png'),sizes:'512x512',type:'image/png',purpose:'any'},
        {src:iconURL('icon-maskable-512.png'),sizes:'512x512',type:'image/png',purpose:'maskable'},
      ];
      const manifest = {name:'Tibetan Manual — Reading & Writing',short_name:'TibReading',id:'./',start_url:'./',scope:'./',display:'standalone',background_color:'#F4ECD8',theme_color:'#7A1F1F',icons};
      const manifestJSON = JSON.stringify(manifest,null,2);
      const manifestName = 'manifest-' + createHash('sha256').update(manifestJSON).digest('hex').slice(0,12) + '.webmanifest';
      writeFileSync(join(out,'manifest.webmanifest'),manifestJSON);
      writeFileSync(join(out,manifestName),manifestJSON);
      html = html.replace('href="./manifest.webmanifest"',`href="./${manifestName}"`);
      writeFileSync(path,html);
      const assets = ['index.html','manifest.webmanifest',manifestName,'icon.svg',...iconFiles,...iconFiles.map(n=>iconURL(n).slice(2)),...names.map(n=>'fonts/'+n)];
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
