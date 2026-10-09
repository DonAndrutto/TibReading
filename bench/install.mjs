import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { crc32 } from '../build/png.mjs';
import { serve } from './serve.mjs';

const server = await serve({ TibReading: resolve('dist') }, 4190);
const browser = await chromium.launch();
const base = 'http://127.0.0.1:4190/TibReading/';
const html = readFileSync('dist/index.html', 'utf8');
const errors = [];
async function open(options = {}, init) {
  const context = await browser.newContext({ serviceWorkers: 'block', ...options });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '#/practice');
  await page.getByRole('heading', { name: 'Practice', exact: true }).waitFor();
  return page;
}
async function offer(page, outcome = 'dismissed') {
  return page.evaluate(outcome => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = async () => { window.installCalls = (window.installCalls || 0) + 1; if (outcome === 'error') throw new Error('Installer unavailable'); };
    event.userChoice = Promise.resolve({ outcome });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  }, outcome);
}
try {
  const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest','utf8'));
  for (const icon of manifest.icons.filter(i => i.type === 'image/png')) {
    const bytes = readFileSync(resolve('dist', icon.src));
    const [w,h] = icon.sizes.split('x').map(Number);
    assert.equal(bytes.readUInt32BE(16), w); assert.equal(bytes.readUInt32BE(20), h);
  }
  assert.ok(manifest.icons.every(i => i.type === 'image/png' && /-[a-f0-9]{12}\.png$/.test(i.src)), 'Installers get versioned PNGs');
  assert.ok(manifest.icons.some(i => i.purpose === 'maskable'));
  const headLinks = [...html.matchAll(/<link\b[^>]*>/g)];
  assert.equal(headLinks[0][0], '<link rel="apple-touch-icon" href="./apple-touch-icon.png">');
  assert.match(headLinks[1][0], /^<link rel="apple-touch-icon" sizes="180x180" href="\.\/icons\/apple-touch-icon-[a-f0-9]{12}\.png">$/);
  const charsetEnd = html.indexOf('<meta charset="utf-8"') + '<meta charset="utf-8" />'.length;
  assert.ok(charsetEnd < 1024);
  for (const link of headLinks.slice(0,2)) {
    const end = Buffer.byteLength(html.slice(0,link.index+link[0].length));
    assert.ok(end < 1024, 'Apple links must fit in the first 1 KB');
    assert.ok(link.index < html.indexOf('<style') && link.index < html.indexOf('<script'));
  }
  const apple = readFileSync('dist/apple-touch-icon.png');
  assert.equal(apple.readUInt32BE(16),180); assert.equal(apple.readUInt32BE(20),180);
  assert.equal(apple[24],8); assert.equal(apple[25],2); assert.equal(apple[28],0);
  let srgb = 0;
  for (let offset=8; offset<apple.length;) {
    const length = apple.readUInt32BE(offset), end=offset+length+12;
    assert.equal(apple.readUInt32BE(end-4), crc32(apple.subarray(offset+4,end-4)), 'Valid PNG chunk CRC');
    if (apple.toString('ascii',offset+4,offset+8)==='sRGB') {
      srgb++; assert.equal(length,1); assert.equal(apple[offset+8],0);
    }
    offset=end;
  }
  assert.equal(srgb,1,'Explicit sRGB tag');
  const desktop = await open({ viewport: { width: 1280, height: 900 } });
  // An older worker/browser can retain the previous canonical manifest. New
  // HTML must use fresh metadata rather than that stale installation response.
  let staleManifestRequests = 0;
  await desktop.route('**/manifest.webmanifest', route => {
    staleManifestRequests++;
    return route.fulfill({ contentType:'application/manifest+json', body:'{"name":"Old cached app","icons":[]}' });
  });
  const cdp = await desktop.context().newCDPSession(desktop);
  const parsed = await cdp.send('Page.getAppManifest');
  assert.deepEqual(parsed.errors, []);
  assert.match(parsed.url, /manifest-[a-f0-9]{12}\.webmanifest$/);
  assert.deepEqual(JSON.parse(parsed.data).icons, manifest.icons);
  assert.equal(staleManifestRequests, 0);
  assert.deepEqual((await cdp.send('Page.getInstallabilityErrors')).installabilityErrors, []);
  const appleURLs = await desktop.locator('link[rel="apple-touch-icon"]').evaluateAll(links=>links.map(l=>l.getAttribute('href')));
  assert.equal(appleURLs[0],'./apple-touch-icon.png');
  const appleURL = appleURLs[1];
  assert.match(appleURL, /apple-touch-icon-[a-f0-9]{12}\.png$/);
  // Decode actual browser images: dimensions in a PNG header alone cannot
  // detect a blank/transparent export or artwork cropped by a launcher mask.
  const raster = await desktop.evaluate(async icons => Promise.all(icons.map(async icon => {
    const response = await fetch(icon.src);
    const bitmap = await createImageBitmap(await response.blob());
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap,0,0);
    const pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let transparent = 0, foreground = 0, unsafe = 0;
    for (let i=0; i<pixels.length; i+=4) {
      if (pixels[i+3] !== 255) transparent++;
      if (pixels[i]>150 && pixels[i+1]>120) {
        foreground++;
        const x=(i/4)%canvas.width+.5, y=Math.floor(i/4/canvas.width)+.5;
        if (Math.hypot(x-canvas.width/2,y-canvas.height/2)>canvas.width*.4) unsafe++;
      }
    }
    return {width:bitmap.width,height:bitmap.height,transparent,foreground,unsafe,type:response.headers.get('content-type')};
  })), [...manifest.icons, ...appleURLs.map(src=>({src}))]);
  for (const [i,image] of raster.entries()) {
    const size = i<manifest.icons.length ? Number(manifest.icons[i].sizes.split('x')[0]) : 180;
    assert.equal(image.width,size); assert.equal(image.height,size);
    assert.equal(image.transparent,0,'Home-screen PNGs must be opaque');
    assert.ok(image.foreground > size*size*.05,'Icon has visible artwork');
    assert.equal(image.type,'image/png');
    if (manifest.icons[i]?.purpose === 'maskable') assert.equal(image.unsafe,0,'Artwork stays in the circular safe zone');
  }
  assert.equal(await desktop.locator('.boot-screen').count(), 0);
  assert.equal(await desktop.locator('.install-banner').count(), 0, 'No unusable install button without a browser offer');
  assert.ok(await offer(desktop));
  await desktop.getByRole('button', { name: 'Install TibReading', exact: true }).waitFor();
  if (process.env.SCREENSHOTS) {
    await desktop.evaluate(() => document.fonts.ready);
    await desktop.waitForTimeout(500);
    await desktop.screenshot({ path: 'docs/screenshots/install-1280.png' });
  }
  await desktop.getByRole('button', { name: 'Not now' }).click();
  assert.equal(await desktop.locator('.install-banner').count(), 0);
  await desktop.reload(); await offer(desktop);
  assert.equal(await desktop.locator('.install-banner').count(), 0, 'Dismissal survives refresh');
  await desktop.goto(base + '#/settings');
  await desktop.getByRole('button', { name: 'Install TibReading', exact: true }).click();
  await desktop.getByText('Installation cancelled.', { exact: false }).waitFor();
  assert.equal(await desktop.evaluate(() => window.installCalls), 1);
  assert.equal(await desktop.getByRole('button', { name: 'Install TibReading', exact: true }).count(), 0, 'Consumed events cannot prompt again');
  await offer(desktop, 'accepted');
  await desktop.getByRole('button', { name: 'Install TibReading', exact: true }).click();
  await desktop.getByText('Installation requested.', { exact: false }).waitFor();
  await desktop.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
  await desktop.getByRole('heading', { name: 'TibReading is installed' }).waitFor();
  await desktop.reload();
  await desktop.getByRole('heading', { name: 'TibReading is installed' }).waitFor();
  await offer(desktop, 'error'); // Browser can offer installation again after uninstall.
  await desktop.getByRole('button', { name: 'Install TibReading', exact: true }).click();
  await desktop.getByText('Installation could not start.', { exact: false }).waitFor();

  const ios = await open({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1', isMobile: true, hasTouch: true });
  await ios.getByRole('button', { name: 'How to install' }).click();
  await ios.getByText('Open the Share menu', { exact: false }).waitFor();
  assert.equal(await ios.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const buttons = await ios.locator('.install-banner button').evaluateAll(bs => bs.map(b => ({ w:b.getBoundingClientRect().width, h:b.getBoundingClientRect().height })));
  assert.ok(buttons.every(b => b.w >= 44 && b.h >= 44));
  if (process.env.SCREENSHOTS) {
    await ios.evaluate(() => document.fonts.ready);
    await ios.waitForTimeout(500);
    await ios.screenshot({ path: 'docs/screenshots/install-390.png' });
  }
  await ios.getByRole('button', { name: 'Not now' }).click();
  await ios.reload();
  assert.equal(await ios.locator('.install-banner').count(), 0);
  const standalone = await open({}, () => {
    Object.defineProperty(navigator, 'standalone', { value: true });
  });
  await offer(standalone);
  assert.equal(await standalone.locator('.install-banner').count(), 0, 'Installed standalone launch stays quiet');
  const blocked = await open({}, () => {
    Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
  });
  await offer(blocked);
  await blocked.getByRole('button', { name: 'Not now' }).click();
  assert.equal(await blocked.locator('.install-banner').count(), 0);

  // Hold the application script to inspect the actual pre-React loading markup.
  const loading = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await loading.route(base, route => route.fulfill({ contentType: 'text/html', body: html.replace(/<script type="module"[\s\S]*?<\/script>/g, '') }));
  await loading.goto(base);
  await loading.getByRole('status', { name: 'Loading TibReading' }).waitFor();
  assert.equal(await loading.locator('.boot-dots i').first().evaluate(e => getComputedStyle(e).animationName), 'boot-pulse');
  if (process.env.SCREENSHOTS) await loading.screenshot({ path: 'docs/screenshots/loading-390.png' });
  await loading.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
  assert.equal(await loading.locator('.boot-dots i').first().evaluate(e => getComputedStyle(e).animationName), 'none');
  await loading.waitForFunction(() => getComputedStyle(document.querySelector('.boot-screen')).backgroundColor === 'rgb(33, 31, 28)');
  const nojs = await browser.newPage({ javaScriptEnabled: false });
  await nojs.goto(base);
  await nojs.locator('noscript p').waitFor();
  assert.match(await nojs.locator('noscript p').innerText(), /Please enable JavaScript/);
  assert.equal(await nojs.locator('.boot-screen').isVisible(), false);

  console.log('Install UI and loading checks passed; checking offline icons');
  const offline = await open({ serviceWorkers: 'allow' });
  await offline.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration())?.active);
  await offline.waitForFunction(() => !!navigator.serviceWorker.controller);
  const freshIcon = await offline.evaluate(async () => {
    const key=(await caches.keys()).find(k=>k.startsWith('tibreading:/TibReading/:'));
    const cache=await caches.open(key), url=new URL('./apple-touch-icon.png',location.href).href;
    // Poison even the plain filename with an older, valid PNG.
    const old=await fetch('./icon-512.png'); await cache.put(url,old);
    const response=await fetch('./apple-touch-icon.png');
    const bytes=Array.from(new Uint8Array(await response.arrayBuffer()));
    const stored=Array.from(new Uint8Array(await (await cache.match(url)).arrayBuffer()));
    return {bytes,stored};
  });
  assert.deepEqual(freshIcon.bytes,Array.from(apple),'Network wins over stale cached icon');
  assert.deepEqual(freshIcon.stored,Array.from(apple),'Successful network icon refreshes cache');
  // Shut down the origin too: CDP offline emulation can leave worker fetches
  // online, so a live server would mask failures in the offline fallback.
  await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
  await offline.context().setOffline(true);
  await offline.reload();
  const icons = await offline.evaluate(async () => {
    const manifest = await (await fetch('./manifest.webmanifest')).json();
    return Promise.all([...manifest.icons.map(i => i.src), ...Array.from(document.querySelectorAll('link[rel="apple-touch-icon"]'),l=>l.getAttribute('href')), document.querySelector('link[rel="manifest"]').getAttribute('href')].map(async src => (await fetch(src)).ok));
  });
  assert.ok(icons.every(Boolean), 'All install icons are available offline');
  const rejectsBadCache = await offline.evaluate(async () => {
    const key=(await caches.keys()).find(k=>k.startsWith('tibreading:/TibReading/:'));
    const cache=await caches.open(key), url=new URL('./apple-touch-icon.png',location.href).href;
    const good=(await cache.match(url)).clone();
    let rejected=0;
    for (const bad of [new Response('failed icon',{status:500,headers:{'Content-Type':'image/png'}}),new Response('<html>not an icon</html>',{headers:{'Content-Type':'text/html'}})]) {
      await cache.put(url,bad);
      try { await fetch('./apple-touch-icon.png'); } catch { rejected++; }
    }
    await cache.put(url,good);
    return rejected;
  });
  assert.equal(rejectsBadCache,2,'Offline errors/HTML must not be served as icons');
  assert.deepEqual(errors, []);
  console.log('check:install — icons, native offer/accept/cancel/error, reinstall, dismissal, iOS help, installed suppression, blocked storage, loading/reduced motion/no-JS and offline assets passed');
} finally { await browser.close(); if (server.listening) server.close(); }
