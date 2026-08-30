// Reader controls for the Sum cu pa root text: zoom and language.
//
// The organising idea is that neither of these is "state the view renders
// from". Both are presentation, and the DOM already has a channel for each:
//
//   scale / size  -> ONE CSS custom property (--reader-scale) on the smallest
//                    container that encloses everything that scales
//   visibility    -> ONE attribute (data-lang) on that same container
//   actual content -> React state, re-render (which verses exist at all)
//
// So zoom and language never enter the render path. Clicking A+ writes one
// custom property; the browser restyles that subtree and that is the whole
// cost. React does not reconcile, no vdom is built, and no DOM node is
// created, moved or destroyed — bench/identity.mjs asserts exactly that.
//
// What remains is that changing type size reflows a long document and slides
// the reader's line out from under them. pretext fixes that: it can say how
// tall every paragraph *will* be at the new scale without touching the DOM,
// so the scroll offset is corrected in the same tick as the mutation rather
// than measured afterwards and jumped.

import { readTextStyle, readBox, heightWith } from './textMeasure.js';

const ZOOM_STEPS = [0.85, 1, 1.15, 1.3, 1.5, 1.75, 2];
const DEFAULT_ZOOM_INDEX = 1; // 100%

// The text blocks that flow in the reader column, and the language each
// belongs to. Grouped by class because every member of a group shares a
// computed style and a box width, so the DOM-touching reads happen once per
// group rather than once per block.
const BLOCKS = [
  { sel: '.sum-verse-label', lang: null },
  { sel: '.sum-verse-ti',    lang: 'ti' },
  { sel: '.sum-line',        lang: 'en' },
];

// lang: null means "always shown", whatever the switch is set to.
const visibleIn = (lang, mode) => lang === null || mode === 'both' || mode === lang;

// Reads must not happen inside a requestAnimationFrame callback: rAF runs
// before the frame's style and layout, so a getBoundingClientRect() there
// forces a synchronous reflow of whatever was just mutated — the exact thrash
// we are avoiding. Hopping to a task after the frame means layout is already
// clean and the read costs nothing. The rAF callback itself only schedules;
// it never reads and never writes.
function afterPaint(fn) {
  return requestAnimationFrame(() => setTimeout(fn, 0));
}

// One style + box read per group, reused for every block in it.
function probeGroups(root) {
  const out = [];
  for (const g of BLOCKS) {
    const els = root.querySelectorAll(g.sel);
    let probe = null;
    for (let i = 0; i < els.length; i++) if (els[i].clientWidth > 0) { probe = els[i]; break; }
    if (!probe) continue;
    out.push({ ...g, els, style: readTextStyle(probe), box: readBox(probe) });
  }
  return out;
}

// The line the reader is actually looking at — not the top of the document.
// Among the text blocks intersecting the viewport, take the one nearest the
// reading line (a quarter of the way down, where eyes sit) and remember its
// live viewport position.
//
// The anchor has to survive the change it is anchoring. Switching to one
// language hides the other, and an anchor that gets display:none reports a
// zeroed rect afterwards — convergence would then chase a position that no
// longer exists and drag the page hundreds of pixels. So a candidate must be
// visible both before and after: the verse label always is, which guarantees
// there is something to anchor to in every mode.
function pickAnchor(root, fromLang, toLang) {
  const readingLine = window.innerHeight * 0.25;
  let best = null;
  let bestDist = Infinity;
  for (const b of BLOCKS) {
    if (!visibleIn(b.lang, fromLang) || !visibleIn(b.lang, toLang)) continue;
    const els = root.querySelectorAll(b.sel);
    for (let i = 0; i < els.length; i++) {
      const r = els[i].getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) continue;
      const d = Math.abs(r.top - readingLine);
      if (d < bestDist) { bestDist = d; best = { el: els[i], top: r.top }; }
    }
  }
  return best;
}

// How far the content above the anchor will grow or shrink, from text metrics
// alone. Every DOM read here happens before any mutation, while layout is
// still clean, and there are only two per group.
//
// This covers the text, which is the dominant term across 31 verses and 101
// translation lines. Box-model residue — em-based padding, a margin that
// collapses when a language is hidden, the hanging indent pretext does not
// model — is left to the convergence pass below. That is what it is for.
function predictShift(groups, anchorEl, from, to) {
  // The probe styles were read before the mutation, so they already carry the
  // `from` size. Ask pretext for relative factors, not absolute zoom levels.
  const relTo = to.scale / from.scale;
  let delta = 0;
  for (const g of groups) {
    const wasVisible = visibleIn(g.lang, from.lang);
    const willBeVisible = visibleIn(g.lang, to.lang);
    if (!wasVisible && !willBeVisible) continue;

    for (let i = 0; i < g.els.length; i++) {
      const el = g.els[i];
      // Document order is visual order in a single column, so "before the
      // anchor in this list" means "above the anchor on screen" — no
      // per-element rect read needed.
      if (el === anchorEl) break;
      if (el.compareDocumentPosition(anchorEl) & Node.DOCUMENT_POSITION_PRECEDING) break;
      const text = el.textContent;
      if (!text) continue;
      if (wasVisible) delta -= heightWith(g.style, g.box, text, 1);
      if (willBeVisible) delta += heightWith(g.style, g.box, text, relTo);
    }
  }
  return delta;
}

// Restore the anchor to the viewport position it held before the mutation,
// then keep correcting until it stops moving.
//
// One pass is not enough in practice: content-visibility materialises blocks
// as they enter the viewport, a ch-based measure re-wraps once the new type
// size lands, and a hidden language collapses margins. Each of those nudges
// the anchor again. So re-read the anchor's LIVE position every pass and stop
// only once it has held still across two consecutive frames.
function converge(anchor, done) {
  let stable = 0;
  let passes = 0;
  const step = () => {
    // Post-paint, so layout is clean and this read forces nothing.
    const rect = anchor.el.getBoundingClientRect();
    // A display:none element reports an all-zero rect. Correcting towards
    // that would be worse than not correcting at all, so stop instead.
    if (rect.width === 0 && rect.height === 0) { if (done) done(passes); return; }
    const drift = rect.top - anchor.top;
    if (Math.abs(drift) < 0.5) {
      if (++stable >= 2) { if (done) done(passes); return; }
    } else {
      stable = 0;
      window.scrollBy(0, drift);
    }
    if (++passes >= 8) { if (done) done(passes); return; }
    afterPaint(step);
  };
  afterPaint(step);
}

// contain-intrinsic-size wants a number, and a wrong one makes the scrollbar
// lie and the scroll position drift as blocks materialise. pretext produces a
// real per-verse height instead of a guess — measured against the browser it
// lands within 2px on 30 of 31 verses, and never under-estimates (see
// bench/accuracy.mjs).
//
// Only runs when createReader is given { intrinsicSizes: true }, which the
// app does not do: content-visibility measured as a loss on a document this
// small. See the note in styles.css.
//
// Always deferred to idle: a refinement, never on the interaction path.
function refreshIntrinsicSizes(root, lang) {
  const verses = root.querySelectorAll('.sum-verse');
  if (!verses.length) return;
  const groups = probeGroups(root);
  if (!groups.length) return;

  // Runs after the mutation has landed, so the probe styles already reflect
  // the new scale and every query here is at rel = 1.
  const textHeightOf = (verse) => {
    let h = 0;
    for (const g of groups) {
      if (!visibleIn(g.lang, lang)) continue;
      const els = verse.querySelectorAll(g.sel);
      for (let j = 0; j < els.length; j++) h += heightWith(g.style, g.box, els[j].textContent);
    }
    return h;
  };

  // Everything in a verse that is not text: padding, the dashed rule, and the
  // margins between the label, the Tibetan and the translation.
  //
  // Read from computed styles rather than by subtracting pretext's answer
  // from a rendered verse's height. Computed style is available whether or
  // not the browser has laid the element out, and a verse skipped by
  // content-visibility reports its own *intrinsic* size from offsetHeight —
  // so height-subtraction would feed the previous estimate back in as if it
  // were a measurement, and is silently wrong precisely when it matters
  // (nothing on screen yet).
  const px = (v) => parseFloat(v) || 0;

  // The inter-block margins are the same on every verse, so they are read
  // once. Padding and the dashed rule are not — :last-child drops both — so
  // those come from each verse's own computed style.
  let margins = 0;
  {
    const label = verses[0].querySelector('.sum-verse-label');
    if (label) margins += px(getComputedStyle(label).marginBottom);
    const en = verses[0].querySelector('.sum-verse-en');
    if (en && visibleIn('en', lang)) margins += px(getComputedStyle(en).marginTop);
  }
  const chromeOf = (v) => {
    const cs = getComputedStyle(v);
    return margins + px(cs.paddingTop) + px(cs.paddingBottom)
      + px(cs.borderTopWidth) + px(cs.borderBottomWidth);
  };

  // Batch the reads above and the writes below so they never interleave.
  const writes = [];
  for (let i = 0; i < verses.length; i++) {
    const h = textHeightOf(verses[i]) + chromeOf(verses[i]);
    if (h > 0) writes.push([verses[i], Math.round(h) + 'px']);
  }
  // Writing the property here — rather than through a React style= prop —
  // keeps the estimate out of the render path entirely.
  for (const [v, h] of writes) v.style.setProperty('--verse-h', h);
}

const idle = (fn) => (window.requestIdleCallback
  ? window.requestIdleCallback(fn, { timeout: 500 })
  : setTimeout(() => fn({ timeRemaining: () => 8, didTimeout: true }), 1));

// pretext splits its work in two: prepare() segments the text and measures
// every segment with canvas — that is the expensive half — and layout() is
// pure arithmetic over the result. Warm the first half here, at idle, so a
// click only ever pays for the second.
//
// This is not an optimisation, it is the difference between the feature
// working and not: across 31 verses and 101 translation lines, prepare() is
// ~340ms of throttled main thread. On a click handler that is a stall; at
// idle, spread over as many callbacks as it takes, it is invisible. It runs
// once — the prepared handles are cached at a 100px reference size, so every
// zoom level reuses them and no later interaction re-prepares anything.
function prewarm(root, onDone) {
  let work = null;
  let i = 0;

  const pump = (deadline) => {
    if (work === null) {
      // Built inside the idle callback, not at call time: probeGroups reads
      // clientWidth, and doing that from a layout effect would force a
      // synchronous layout before the reader's first paint.
      const groups = probeGroups(root);
      work = [];
      for (const g of groups) {
        for (let k = 0; k < g.els.length; k++) {
          const text = g.els[k].textContent;
          if (text) work.push(() => heightWith(g.style, g.box, text));
        }
      }
    }
    // Yield while the browser still has time in this idle period rather than
    // running 132 measurements in one task and creating the jank we are here
    // to avoid.
    while (i < work.length && (deadline.timeRemaining() > 2 || deadline.didTimeout)) {
      work[i++]();
      if (deadline.didTimeout && i % 16 === 0) break;
    }
    if (i < work.length) idle(pump);
    else if (onDone) onDone(work.length);
  };
  idle(pump);
}

// The controller. Its state lives in closures, not in React, so nothing it
// does can schedule a render.
// `root` is the container the two presentation channels are written to — the
// smallest element enclosing all the text they affect. `controls` is where
// the buttons live; they sit OUTSIDE root on purpose, since chrome that
// scaled with the text would be a bug, which means they are not reachable by
// querying root.
//
// options.onSettle        diagnostic hook, called with the number of
//                         convergence passes an interaction needed
// options.onWarm          diagnostic hook, called with the number of text
//                         blocks prepared once the idle warm-up finishes
// options.intrinsicSizes  measure every verse with pretext and drive
//                         content-visibility from the result. Off by default:
//                         see the note above refreshIntrinsicSizes.
export function createReader(root, controls, options) {
  const { onSettle, onWarm, intrinsicSizes = false } = options || {};
  const ui = controls || root;
  const state = { zoomIndex: DEFAULT_ZOOM_INDEX, lang: 'both' };
  let idleHandle = null;

  const scaleAt = (i) => ZOOM_STEPS[i];

  // The controls are part of the DOM the controller owns, so their labels and
  // pressed state are written the same way everything else is — directly.
  // Keeping them in React state would defeat the point: a zoom readout is not
  // worth a reconciliation pass over 31 verses.
  const paintReadout = () => {
    const out = ui.querySelector('[data-zoom-readout]');
    if (out) out.textContent = Math.round(scaleAt(state.zoomIndex) * 100) + '%';
    const i = state.zoomIndex;
    const dec = ui.querySelector('[data-zoom="out"]');
    const inc = ui.querySelector('[data-zoom="in"]');
    if (dec) dec.disabled = i === 0;
    if (inc) inc.disabled = i === ZOOM_STEPS.length - 1;
  };

  // CSS already shows which chip is active, but assistive tech reads
  // aria-pressed, and it must not be allowed to drift from the attribute
  // that drives the cascade.
  const paintLang = () => {
    const chips = ui.querySelectorAll('.lang-chip');
    for (let i = 0; i < chips.length; i++) {
      chips[i].setAttribute('aria-pressed', String(chips[i].dataset.lang === state.lang));
    }
  };

  const scheduleIntrinsic = (lang) => {
    if (!intrinsicSizes) return;
    if (idleHandle != null && window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
    idleHandle = idle(() => refreshIntrinsicSizes(root, lang));
  };

  // The single write that applies a new presentation state, wrapped in the
  // anchoring that keeps the reader's line still.
  const apply = (next) => {
    const from = { scale: scaleAt(state.zoomIndex), lang: state.lang };
    const to = {
      scale: scaleAt(next.zoomIndex === undefined ? state.zoomIndex : next.zoomIndex),
      lang: next.lang === undefined ? state.lang : next.lang,
    };
    if (from.scale === to.scale && from.lang === to.lang) return;

    // --- reads, while layout is still clean and nothing has been touched ---
    const anchor = pickAnchor(root, from.lang, to.lang);
    const predicted = anchor ? predictShift(probeGroups(root), anchor.el, from, to) : 0;

    // --- writes: two properties on one element, and that is the mutation ---
    if (next.zoomIndex !== undefined) {
      state.zoomIndex = next.zoomIndex;
      root.style.setProperty('--reader-scale', String(to.scale));
      paintReadout();
    }
    if (next.lang !== undefined) {
      state.lang = next.lang;
      root.setAttribute('data-lang', to.lang);
      paintLang();
    }

    // Correct in the same tick, so the first painted frame is already at the
    // right offset instead of jumping a frame later.
    if (anchor && predicted) window.scrollBy(0, predicted);
    if (anchor) converge(anchor, onSettle);

    scheduleIntrinsic(to.lang);
  };

  return {
    zoomIn:    () => apply({ zoomIndex: Math.min(ZOOM_STEPS.length - 1, state.zoomIndex + 1) }),
    zoomOut:   () => apply({ zoomIndex: Math.max(0, state.zoomIndex - 1) }),
    zoomReset: () => apply({ zoomIndex: DEFAULT_ZOOM_INDEX }),
    setLang:   (lang) => apply({ lang }),
    // First paint: seed the intrinsic sizes so offscreen verses are skipped
    // from the first frame, not only once the reader has scrolled past them.
    init: () => {
      root.setAttribute('data-lang', state.lang);
      if (intrinsicSizes) root.setAttribute('data-intrinsic-sizes', '');
      paintReadout();
      paintLang();
      root.style.setProperty('--reader-scale', String(scaleAt(state.zoomIndex)));
      prewarm(root, onWarm);
      scheduleIntrinsic(state.lang);
    },
    _state: state,
  };
}
