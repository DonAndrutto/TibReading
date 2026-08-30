// Benchmark: reader zoom and language switching, before vs after.
//
// Method
//   - fresh browser context AND fresh page for every single run, so no run
//     inherits another's JIT state, style caches or pretext caches
//   - CPU throttled 6x via CDP, because "instant" only means anything on a
//     machine that is not a workstation
//   - 15 runs per condition (configurable), reported as a median; means are
//     shown too so a skewed distribution is visible rather than hidden
//   - the interaction is measured with Chrome's own cumulative CPU-time
//     counters (Performance.getMetrics), not a wall clock, so the numbers are
//     work done rather than frame-boundary quantisation
//   - the real metric is anchor drift: how far the line the reader was
//     looking at moved. scrollY is reported alongside precisely because it is
//     the misleading one — it can be identical while the text has jumped.

import { chromium } from 'playwright';
import { serve, routeFonts } from './serve.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const SCRATCH = process.env.BENCH_BASELINE
  || '/tmp/claude-0/-home-user-TibReading/f2492ba1-b890-5c6d-8284-3e125ab4df76/scratchpad/main-baseline';

const RUNS = Number(process.env.RUNS || 15);
const THROTTLE = Number(process.env.THROTTLE || 6);
const VIEWPORT = { width: 1280, height: 800 };

const roots = {
  bench: join(here, 'dist'),
  branch: join(repo, 'dist'),
  main: join(SCRATCH, 'dist'),
};

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const p95 = (a) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(a.length * 0.95))];

// Runs entirely in the page so one protocol round trip covers the whole
// interaction: instrument, click, wait for the layout to go quiet, report.
// Runs entirely in the page so one protocol round trip covers the whole
// interaction: instrument, click, wait for the layout to go quiet, report.
const INTERACT = async (sel) => {
  const root = document.querySelector('.sum-body') || document.querySelector('.sum-scroll');

  // The anchor is the line the reader was looking at. Everything below is
  // about whether it is still there afterwards.
  const pickAnchor = () => {
    const els = root.querySelectorAll('.sum-verse-ti, .sum-line, .sum-verse-label');
    const line = window.innerHeight * 0.25;
    let best = null, bestD = Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) continue;
      const d = Math.abs(r.top - line);
      if (d < bestD) { bestD = d; best = { el, top: r.top }; }
    }
    return best;
  };

  const anchor = pickAnchor();
  const scrollBefore = window.scrollY;

  let mutations = 0;
  const mo = new MutationObserver(recs => {
    for (const r of recs) mutations += r.addedNodes.length + r.removedNodes.length + 1;
  });
  mo.observe(root, { childList: true, subtree: true, attributes: true, characterData: true });

  let shift = 0;
  let po = null;
  try {
    po = new PerformanceObserver(list => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) shift += e.value;
    });
    po.observe({ type: 'layout-shift', buffered: false });
  } catch {}

  const t0 = performance.now();
  document.querySelector(sel).click();
  const tHandler = performance.now() - t0;

  // Peak drift: how far the anchor was from where it started at its worst
  // moment. A single post-settle reading would hide a one-frame jump, which
  // is exactly the thing a reader notices.
  let peakDrift = 0;

  // Settle over a FIXED number of frames, identical for every condition.
  // An early-exit-when-quiet loop would give the slower-converging condition
  // a longer observation window, and the harness's own per-frame rect reads
  // would then land in its layout counters — measuring the ruler, not the
  // thing.
  const SETTLE_FRAMES = 12;
  let frames = 0;
  await new Promise((resolve) => {
    const tick = () => requestAnimationFrame(() => setTimeout(() => {
      frames++;
      if (anchor) {
        const top = anchor.el.getBoundingClientRect().top;
        peakDrift = Math.max(peakDrift, Math.abs(top - anchor.top));
      }
      if (frames >= SETTLE_FRAMES) return resolve();
      tick();
    }, 0));
    tick();
  });

  const tSettled = performance.now() - t0;
  mo.disconnect();
  if (po) po.disconnect();

  return {
    tHandler, tSettled, frames, mutations, shift,
    driftPx: anchor ? Math.abs(anchor.el.getBoundingClientRect().top - anchor.top) : null,
    peakDriftPx: anchor ? peakDrift : null,
    scrollDelta: Math.abs(window.scrollY - scrollBefore),
    convergePasses: window.__convergePasses,
  };
};

// Scroll the whole reader top to bottom in fixed steps. This is where
// content-visibility earns its keep: the browser can skip layout and paint
// for the verses that are not on screen.
const SCROLL = async () => {
  const doc = document.documentElement;
  const end = doc.scrollHeight - window.innerHeight;
  const t0 = performance.now();
  for (let y = 0; y <= end; y += 400) {
    window.scrollTo(0, y);
    await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
  }
  return { tSettled: performance.now() - t0, steps: Math.ceil(end / 400) };
};

async function metrics(cdp) {
  const { metrics } = await cdp.send('Performance.getMetrics');
  const m = {};
  for (const { name, value } of metrics) m[name] = value;
  return m;
}

async function runOnce(browser, { url, setup, target }) {
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  // Real fonts, served from disk: identical bytes for every run, no network
  // variance, and pretext measured against the actual Noto Serif Tibetan.
  await routeFonts(page, 'http://127.0.0.1:4173');

  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: THROTTLE });
  if (setup) await setup(page);

  // Let first-paint work and any idle-scheduled warm-up drain, the way a real
  // reader would before reaching for a control. Draining the idle queue works
  // for every condition — including main/, which has no idle work at all —
  // where waiting on an app-specific signal would not.
  await page.evaluate(() => new Promise((resolve) => {
    let quiet = 0;
    const step = () => requestIdleCallback((d) => {
      // A long idle slice with nothing queued behind it means the warm-up is
      // done; two in a row means it is not about to reschedule itself.
      if (d.timeRemaining() > 10 && !d.didTimeout) quiet++; else quiet = 0;
      if (quiet >= 2) return resolve();
      step();
    }, { timeout: 400 });
    step();
  }));
  await page.waitForTimeout(200);

  const before = await metrics(cdp);
  const r = target === null ? await page.evaluate(SCROLL) : await page.evaluate(INTERACT, target);
  const after = await metrics(cdp);

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await ctx.close();

  return {
    ...r,
    layoutMs: (after.LayoutDuration - before.LayoutDuration) * 1000,
    styleMs: (after.RecalcStyleDuration - before.RecalcStyleDuration) * 1000,
    scriptMs: (after.ScriptDuration - before.ScriptDuration) * 1000,
    layoutCount: after.LayoutCount - before.LayoutCount,
    styleCount: after.RecalcStyleCount - before.RecalcStyleCount,
    nodes: after.Nodes,
  };
}

// Open the Sum cu pa scroll in the real app and scroll into the middle of it,
// so the interaction happens where a reader would actually be.
const openRealApp = async (page) => {
  await page.getByRole('button', { name: /tap to read the root text/i }).click();
  await page.waitForSelector('.sum-verse', { state: 'attached' });
  await page.evaluate(() => {
    const vs = document.querySelectorAll('.sum-verse');
    vs[Math.floor(vs.length / 2)].scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(250);
};

const scrollIntoReader = async (page) => {
  await page.waitForSelector('.sum-verse', { state: 'attached' });
  await page.evaluate(() => {
    const vs = document.querySelectorAll('.sum-verse');
    vs[Math.floor(vs.length / 2)].scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(250);
};

const B = 'http://127.0.0.1:4173/bench/';
const CONDITIONS = [
  { group: 'zoom  (A+ one step)', label: 'naive', url: B + '?mode=naive', setup: scrollIntoReader, target: '[data-zoom="in"]' },
  { group: 'zoom  (A+ one step)', label: 'pretext', url: B + '?mode=fast&cv=off', setup: scrollIntoReader, target: '[data-zoom="in"]' },
  { group: 'zoom  (A+ one step)', label: 'pretext+cv', url: B + '?mode=fast', setup: scrollIntoReader, target: '[data-zoom="in"]' },

  { group: 'language switch (A/B page)', label: 'naive', url: B + '?mode=naive', setup: scrollIntoReader, target: '.lang-chip[data-lang="ti"]' },
  { group: 'language switch (A/B page)', label: 'pretext', url: B + '?mode=fast&cv=off', setup: scrollIntoReader, target: '.lang-chip[data-lang="ti"]' },
  { group: 'language switch (A/B page)', label: 'pretext+cv', url: B + '?mode=fast', setup: scrollIntoReader, target: '.lang-chip[data-lang="ti"]' },

  { group: 'language switch (real app)', label: 'main', url: 'http://127.0.0.1:4173/main/',
    setup: openRealApp, target: '.sum-toolbar .chip' },
  { group: 'language switch (real app)', label: 'branch', url: 'http://127.0.0.1:4173/branch/',
    setup: openRealApp, target: '.lang-chip[data-lang="ti"]' },

  { group: 'scroll the whole reader', label: 'no cv', url: B + '?mode=fast&cv=off', setup: scrollIntoReader, target: null },
  { group: 'scroll the whole reader', label: 'with cv', url: B + '?mode=fast', setup: scrollIntoReader, target: null },
  { group: 'scroll the whole reader (real app)', label: 'main', url: 'http://127.0.0.1:4173/main/', setup: openRealApp, target: null },
  { group: 'scroll the whole reader (real app)', label: 'branch', url: 'http://127.0.0.1:4173/branch/', setup: openRealApp, target: null },
];

const FIELDS = [
  ['scriptMs', 'script ms'],
  ['styleMs', 'style recalc ms'],
  ['layoutMs', 'layout ms'],
  ['tHandler', 'handler ms'],
  ['layoutCount', 'layout passes'],
  ['styleCount', 'style recalcs'],
  ['mutations', 'DOM mutations'],
  ['convergePasses', 'converge passes'],
  ['peakDriftPx', 'peak line drift px'],
  ['driftPx', 'final line drift px'],
  ['scrollDelta', 'scrollY delta px'],
  ['shift', 'cumulative shift'],
];

const main = async () => {
  const server = await serve(roots, 4173);
  const browser = await chromium.launch();
  const results = [];

  for (const c of CONDITIONS) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await runOnce(browser, c));
    const agg = {};
    for (const [k] of FIELDS) {
      const vals = runs.map(r => r[k]).filter(v => typeof v === 'number' && Number.isFinite(v));
      if (vals.length) agg[k] = { med: median(vals), mean: mean(vals), p95: p95(vals) };
    }
    results.push({ ...c, agg, runs });
    process.stderr.write(`done: ${c.group} / ${c.label}\n`);
  }

  await browser.close();
  server.close();

  const round = (n) => (Math.abs(n) >= 100 ? Math.round(n) : Math.round(n * 100) / 100);
  const groups = [...new Set(results.map(r => r.group))];
  const out = [];
  out.push(`runs per condition: ${RUNS}   CPU throttle: ${THROTTLE}x   viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
  out.push(`fresh browser context + page per run\n`);
  for (const g of groups) {
    const rs = results.filter(r => r.group === g);
    out.push(`## ${g}`);
    const w = 20;
    out.push(['metric'.padEnd(w), ...rs.map(r => r.label.padStart(14))].join(''));
    for (const [k, label] of FIELDS) {
      if (!rs.every(r => r.agg[k])) continue;
      out.push([label.padEnd(w), ...rs.map(r => String(round(r.agg[k].med)).padStart(14))].join(''));
    }
    const cost = (r) => r.agg.scriptMs.med + r.agg.styleMs.med + r.agg.layoutMs.med;
    if (rs.every(r => r.agg.scriptMs)) {
      const base = cost(rs[0]);
      out.push('\n  main-thread cost (script+style+layout), median:');
      for (const r of rs) {
        const c = cost(r);
        const rel = r === rs[0] ? 'baseline' : `${round(base / Math.max(c, 0.001))}x vs ${rs[0].label}`;
        out.push(`    ${r.label.padEnd(12)} ${String(round(c)).padStart(7)} ms   ${rel}`);
      }
    }
    out.push('');
  }
  console.log(out.join('\n'));
  const fs = await import('node:fs');
  fs.writeFileSync(join(here, 'results.json'), JSON.stringify(results, null, 2));
};

main().catch(e => { console.error(e); process.exit(1); });
