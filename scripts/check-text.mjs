// Content check: does any label in the app overflow the space designed for it?
//
// All the app's content lives in one hand-edited file (src/data.js), there is
// no test runner, and the failure mode is silent — a proverb title that grows
// two words wraps a tab card and nothing complains until someone looks. This
// walks every view and measures the real text against its real box with
// pretext, which is the use case pretext's own README calls out: verifying
// that labels do not spill, without eyeballing screenshots.
//
// Usage: npm run check:text   (builds dist/ first)

import { chromium } from 'playwright';
import { serve, routeFonts } from '../bench/serve.mjs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const PORT = 4180;

// Budgets are baselined to what the app renders today, so this passes now and
// fails when content grows past what its box was built for. Two of them are
// deliberately above 1 — see the notes — because those already wrap and the
// wrap is tolerable; tightening them is a design decision, not a check.
const RULES = [
  { sel: '.nav-label',        maxLines: 1, note: 'sidebar nav item' },
  { sel: '.nav-sub',          maxLines: 2, note: 'sidebar nav subtitle (2: "history of the script" already wraps in the 129px column)' },
  { sel: '.brand-title',      maxLines: 2, note: 'sidebar wordmark' },
  { sel: '.kicker',           maxLines: 1, note: 'section kicker' },
  { sel: '.chip',             maxLines: 1, note: 'filter / nav chip' },
  { sel: '.cell-r',           maxLines: 1, note: 'alphabet grid romanization' },
  { sel: '.pr-tab-title',     maxLines: 2, note: 'proverb tab card title' },
  { sel: '.pr-tab-kind',      maxLines: 1, note: 'proverb tab card kind' },
  { sel: '.lw-title',         maxLines: 1, note: 'vocabulary deck title' },
  { sel: '.rz-readout',       maxLines: 1, note: 'reader zoom readout' },
  { sel: '.sum-verse-label',  maxLines: 1, note: 'verse label' },
  { sel: '.intro-mark-name',  maxLines: 3, note: 'vowel mark name (3: the marks grid squeezes to 41px at 1024, where the app has no breakpoint)' },
  { sel: '.intro-pos-name',   maxLines: 1, note: 'syllable position name' },
  { sel: '.qo-tag',           maxLines: 1, note: 'quiz option tag' },
  { sel: '.rd-tag',           maxLines: 1, note: 'rule tag' },
  { sel: '.stack-row',        maxLines: 1, note: 'stack list row' },
];

// Each view, plus whatever has to be clicked to reveal its content.
const VIEWS = [
  { tab: 'intro',    reveal: async (p) => {
      await p.getByRole('button', { name: /tap to read the root text/i }).click();
      await p.waitForSelector('.sum-verse');
    } },
  { tab: 'alphabet' },
  { tab: 'vowels' },
  { tab: 'stacks' },
  { tab: 'builder' },
  { tab: 'rules',    reveal: async (p) => { await p.getByRole('button', { name: /^Quiz/i }).click().catch(() => {}); } },
  { tab: 'trace' },
  { tab: 'read',     reveal: async (p) => { await p.getByRole('button', { name: /^Quiz$/i }).click().catch(() => {}); } },
  { tab: 'proverbs' },
  { tab: 'practice' },
  { tab: 'settings' },
];

// Only a true text leaf can be measured as one string. A flex or grid
// container's textContent is its children concatenated, and its height comes
// from its layout rather than its line boxes — measuring either would be
// nonsense, and the --audit pass is what caught this.
const isTextLeaf = (el) => {
  if (el.children.length > 0) return false;
  const d = getComputedStyle(el).display;
  return d === 'block' || d === 'inline' || d === 'inline-block' || d === 'list-item';
};

const MEASURE = (rules) => {
  const isTextLeaf = window.__isTextLeaf;
  const out = [];
  for (const rule of rules) {
    const els = document.querySelectorAll(rule.sel);
    for (const el of els) {
      if (!isTextLeaf(el)) continue;
      const text = el.textContent.trim();
      if (!text) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue; // not displayed
      const style = window.__tm.readTextStyle(el);
      const box = window.__tm.readBox(el);
      if (box.avail <= 0) continue;
      const lines = window.__tm.lineCountWith(style, box, text);
      if (lines > rule.maxLines) {
        out.push({ sel: rule.sel, note: rule.note, text: text.slice(0, 60), lines, max: rule.maxLines,
                   width: Math.round(Math.min(box.avail, box.fontRelativeMax)) });
      }
    }
  }
  return out;
};

// Two widths: the design width, and the narrowest the sidebar grid still
// holds together at. Wrapping bugs hide at exactly one of them.
const WIDTHS = [1280, 1024];

const AUDIT = process.argv.includes('--audit');
const AUDIT_FN = (rules) => {
  const isTextLeaf = window.__isTextLeaf;
  let checked = 0;
  const disagreements = [];
  for (const rule of rules) {
    for (const el of document.querySelectorAll(rule.sel)) {
      if (!isTextLeaf(el)) continue;
      const text = el.textContent.trim();
      if (!text) continue;
      const style = window.__tm.readTextStyle(el);
      const box = window.__tm.readBox(el);
      if (box.avail <= 0) continue;
      // A flex or grid item is stretched to its row's height, so its box says
      // nothing about its line count. Height-based ground truth does not
      // apply to it — the check itself is unaffected, since that never reads
      // a height.
      const parent = el.parentElement;
      if (parent) {
        const pd = getComputedStyle(parent).display;
        if (pd === 'flex' || pd === 'inline-flex' || pd === 'grid' || pd === 'inline-grid') continue;
      }
      const cs = getComputedStyle(el);
      // Content-box height only: padding would read as extra lines.
      const contentH = el.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
      if (contentH <= 0) continue;
      checked++;
      const pretextLines = window.__tm.lineCountWith(style, box, text);
      const browserLines = Math.round(contentH / style.lineHeight);
      if (pretextLines !== browserLines) {
        disagreements.push({ sel: rule.sel, text: text.slice(0, 40), pretextLines, browserLines });
      }
    }
  }
  return { checked, disagreements };
};

const server = await serve({ app: join(repo, 'dist') }, PORT);
const browser = await chromium.launch();
const findings = [];
const audit = { checked: 0, disagreements: [] };

for (const width of WIDTHS) {
  for (const view of VIEWS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await routeFonts(page, `http://127.0.0.1:${PORT}`);
    await page.goto(`http://127.0.0.1:${PORT}/app/`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    // Navigate by the sidebar item whose label matches the tab id.
    const navigated = await page.evaluate((tab) => {
      const hit = [...document.querySelectorAll('.nav-item')]
        .find(i => i.querySelector('.nav-label').textContent.trim().toLowerCase() === tab);
      if (hit) { hit.click(); return true; }
      return false;
    }, view.tab);
    if (!navigated) throw new Error('could not navigate to view: ' + view.tab);
    await page.waitForTimeout(200);
    if (view.reveal) { try { await view.reveal(page); } catch {} }
    await page.waitForTimeout(200);
    await page.addScriptTag({ path: join(here, '.probe.js') });
    await page.evaluate(`window.__isTextLeaf = ${isTextLeaf.toString()}`);

    const hits = await page.evaluate(MEASURE, RULES);
    for (const h of hits) findings.push({ ...h, view: view.tab, viewport: width });

    // --audit answers "should I believe this tool?" by comparing pretext's
    // line count against what the browser actually laid out, for every
    // element the rules touch. The check itself never needs this; it is here
    // so the answer is measurable rather than assumed.
    if (AUDIT) {
      const a = await page.evaluate(AUDIT_FN, RULES);
      audit.checked += a.checked;
      audit.disagreements.push(...a.disagreements.map(d => ({ ...d, view: view.tab, viewport: width })));
    }
    await page.close();
  }
}

await browser.close();
server.close();

if (AUDIT) {
  const seenA = new Map();
  for (const d of audit.disagreements) seenA.set(d.sel + d.text + d.viewport, d);
  console.log(`audit — pretext vs browser line count: ${audit.checked} elements, ${seenA.size} distinct disagreement(s)`);
  for (const d of seenA.values()) {
    console.log(`   ${String(d.viewport).padEnd(5)} ${d.sel.padEnd(20)} pretext ${d.pretextLines} / browser ${d.browserLines}   "${d.text}"`);
  }
  console.log('');
}

// The sidebar is on every view, so the same label is found nine times. Report
// each distinct (selector, text, width) once.
const seen = new Map();
for (const f of findings) {
  const k = f.sel + '\u0000' + f.text + '\u0000' + f.viewport;
  if (!seen.has(k) || seen.get(k).lines < f.lines) seen.set(k, f);
}
const distinct = [...seen.values()].sort((a, b) => (b.lines - b.max) - (a.lines - a.max));

if (!distinct.length) {
  console.log(`check:text — ${VIEWS.length} views x ${WIDTHS.length} widths, ${RULES.length} rules: nothing over budget`);
  process.exit(0);
}
console.log(`check:text — ${distinct.length} label(s) over budget:\n`);
for (const f of distinct) {
  console.log(`  ${String(f.viewport).padEnd(5)} ${f.sel.padEnd(20)} ${f.lines} lines (budget ${f.max}) in ${f.width}px  "${f.text}"   — ${f.note}`);
}
process.exit(1);
