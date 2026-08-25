// Proves the claim that zoom and language never enter the render path.
//
// "It didn't re-render" is not something a timing number can establish — a
// fast re-render is still a re-render. So check it structurally instead:
// stamp every node in the reader with an identity before the interaction and
// verify that afterwards it is the same node object, in the same place, with
// the same text, and that the DOM was not mutated apart from the two
// properties the controller is supposed to write.
import { chromium } from 'playwright';
import { serve, routeFonts } from './serve.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const PORT = 4174;

const CHECK = async (sel) => { try {
  // main/ has no .sum-body wrapper — the verses sit directly in .sum-scroll.
  const body = document.querySelector('.sum-body') || document.querySelector('.sum-scroll');

  // Tag every node so a replaced node is detectable even if the new one is
  // structurally identical. An expando survives reordering; it does not
  // survive React unmounting and recreating the element.
  const all = [...body.querySelectorAll('*')];
  all.forEach((el, i) => { el.__id = i; });
  const before = {
    count: all.length,
    verses: [...body.querySelectorAll('.sum-verse')],
    lines: [...body.querySelectorAll('.sum-line')],
    firstLineText: body.querySelector('.sum-line').textContent,
  };

  // Record every mutation, and what kind.
  const mutations = [];
  let t0 = 0;
  const record = (r) => mutations.push({
    type: r.type,
    attr: r.attributeName,
    target: String(r.target.className || r.target.nodeName),
    added: r.addedNodes.length,
    removed: r.removedNodes.length,
    at: performance.now() - t0,
  });
  const mo = new MutationObserver(recs => { for (const r of recs) record(r); });
  mo.observe(body, { childList: true, subtree: true, attributes: true, characterData: true });

  t0 = performance.now();
  document.querySelector(sel).click();

  // React schedules its render; it does not run inside click(). Give it
  // several frames to land before deciding nothing happened — otherwise the
  // baseline would look free purely because we asked too early.
  // The boundary between "on the interaction path" and "deferred" is the
  // first paint after the click: whatever the browser had to do before it
  // could show the result. React's discrete-event render lands inside that
  // window; the pretext intrinsic-size pass is an idle callback and does not.
  let interactionEnd = null;
  await new Promise(r => requestAnimationFrame(() => {
    mo.takeRecords().forEach(record);
    interactionEnd = performance.now() - t0;
    r();
  }));
  for (let i = 0; i < 8; i++) await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
  mo.takeRecords().forEach(record);
  mo.disconnect();

  const after = [...body.querySelectorAll('*')];
  const onPath = mutations.filter(m => m.at <= interactionEnd);
  const deferred = mutations.length - onPath.length;
  const recreated = after.filter(el => el.__id === undefined).length;
  const reordered = after.some((el, i) => el.__id !== i);

  return {
    nodesBefore: before.count,
    nodesAfter: after.length,
    recreated,
    reordered,
    sameVerseObjects: before.verses.every((v, i) => v === body.querySelectorAll('.sum-verse')[i]),
    linesStillInDom: body.querySelectorAll('.sum-line').length,
    firstLineTextUnchanged: (() => {
      const l = body.querySelector('.sum-line');
      return l ? l.textContent === before.firstLineText : false;
    })(),
    mutations: onPath,
    deferred,
    reactRenders: window.__renders ? window.__renders() : null,
  };
  } catch (e) { return { error: String(e && e.stack || e) }; }
};

function report(name, r) {
  if (!r || r.error) { console.log(`${name.padEnd(22)} ERROR ${r && r.error}`); return; }
  const kinds = r.mutations.reduce((a, m) => {
    const k = m.type === 'attributes' ? `attr:${m.attr}` : m.type;
    a[k] = (a[k] || 0) + 1; return a;
  }, {});
  console.log(
    `${name.padEnd(22)} nodes ${String(r.nodesBefore).padStart(4)} -> ${String(r.nodesAfter).padStart(4)}` +
    `  recreated ${String(r.recreated).padStart(3)}` +
    `  reordered ${r.reordered ? 'yes' : ' no'}` +
    `  on-path mutations ${String(r.mutations.length).padStart(4)} ${JSON.stringify(kinds).padEnd(24)}` +
    `  deferred(idle) ${String(r.deferred).padStart(3)}`);
}

const CASES = [
  { name: 'naive  · zoom in',      url: `http://127.0.0.1:${PORT}/bench/?mode=naive`, sel: '[data-zoom="in"]' },
  { name: 'pretext · zoom in',     url: `http://127.0.0.1:${PORT}/bench/?mode=fast`,  sel: '[data-zoom="in"]' },
  { name: 'naive  · lang switch',  url: `http://127.0.0.1:${PORT}/bench/?mode=naive`, sel: '.lang-chip[data-lang="ti"]' },
  { name: 'pretext · lang switch', url: `http://127.0.0.1:${PORT}/bench/?mode=fast`,  sel: '.lang-chip[data-lang="ti"]' },
];

const SCRATCH = process.env.BENCH_BASELINE
  || '/tmp/claude-0/-home-user-TibReading/f2492ba1-b890-5c6d-8284-3e125ab4df76/scratchpad/main-baseline';
const server = await serve({
  bench: join(here, 'dist'),
  branch: join(repo, 'dist'),
  main: join(SCRATCH, 'dist'),
}, PORT);
const browser = await chromium.launch();

for (const c of CASES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await routeFonts(page, `http://127.0.0.1:${PORT}`);
  await page.goto(c.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const r = await page.evaluate(CHECK, c.sel);

  report(c.name, r);
  await page.close();
}

// The real app, main vs branch: the language switch is the one control that
// exists on both, so it is a like-for-like comparison.
for (const [label, url, sel] of [
  ['main   · real app lang', `http://127.0.0.1:${PORT}/main/`,   '.sum-toolbar .chip'],
  ['branch · real app lang', `http://127.0.0.1:${PORT}/branch/`, '.lang-chip[data-lang="ti"]'],
]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await routeFonts(page, `http://127.0.0.1:${PORT}`);
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: /tap to read the root text/i }).click();
  await page.waitForSelector('.sum-verse');
  await page.waitForTimeout(700);
  const r = await page.evaluate(CHECK, sel);
  report(label, r);
  await page.close();
}

await browser.close();
server.close();
