// Text measurement via pretext (@chenglou/pretext).
//
// Why this exists: measuring wrapped text the DOM way (offsetHeight,
// getBoundingClientRect) forces a synchronous reflow, and doing it once per
// paragraph per zoom step is what makes a zoom control feel like mud.
// pretext measures with canvas plus its own line breaker, so a height query
// is pure arithmetic over cached segment widths — no reflow at all.
//
// Three rules make it cheap enough to call freely:
//
//   1. prepare() is the expensive half (segmentation + per-segment canvas
//      measureText). It runs ONCE per distinct string, at a fixed 100px
//      reference size, and is cached.
//   2. Line breaking is linear in font size, so one prepared handle answers
//      every zoom level: to ask "how tall at 24px in a 700px box?", query the
//      100px handle at 700 * (100 / 24) and scale the answer back. Seven zoom
//      steps over 132 blocks is 132 prepares, not 924.
//   3. Every block sharing a class shares a computed style and a box width,
//      so the DOM-touching part (readTextStyle / readBox) runs once per
//      class, not once per block.

import { prepare, layout } from '@chenglou/pretext';

// The size prepare() runs at. Any value works; 100 keeps the scaling
// arithmetic legible and sub-pixel error far below one device pixel.
const REF_SIZE = 100;

const preparedCache = new Map();

// pretext models the CSS properties that decide where a line breaks. These
// are read from the element being measured — not a parent, not a synthetic
// probe appended to the body — so max-width, letter-spacing and the font
// stack are exactly the ones the browser is painting with.
export function readTextStyle(el) {
  const cs = getComputedStyle(el);
  const fontSize = parseFloat(cs.fontSize) || 16;

  // getComputedStyle returns the WHOLE family list, not the resolved match:
  //   "Noto Serif Tibetan", "Noto Sans Tibetan", "Microsoft Himalaya", ...
  // Canvas has to see the same chain or it silently falls back to the default
  // font for glyphs the first family lacks — which is exactly the case here,
  // since most Latin-first fonts carry no Tibetan and most Tibetan fonts
  // carry no italic. Truncating the chain measures a font nobody is painting.
  const family = cs.fontFamily;

  // Canvas font shorthand: [style] [variant] [weight] size/lineHeight family.
  // line-height is deliberately omitted — pretext takes it as a layout-time
  // argument, not a shaping input.
  const style = cs.fontStyle && cs.fontStyle !== 'normal' ? cs.fontStyle + ' ' : '';
  const weight = cs.fontWeight && cs.fontWeight !== '400' ? cs.fontWeight + ' ' : '';

  return {
    fontSize,
    family,
    prefix: style + weight,
    // letter-spacing is a px value to pretext, so it scales with the
    // reference size the same way widths do.
    letterSpacing: cs.letterSpacing === 'normal' ? 0 : (parseFloat(cs.letterSpacing) || 0),
    // "normal" has no computed px value; the usual browser default is ~1.2.
    lineHeight: cs.lineHeight === 'normal' ? fontSize * 1.2
      : (parseFloat(cs.lineHeight) || fontSize * 1.2),
    whiteSpace: (cs.whiteSpace === 'pre-wrap' || cs.whiteSpace === 'pre-line') ? 'pre-wrap' : 'normal',
    wordBreak: cs.wordBreak === 'keep-all' ? 'keep-all' : 'normal',
  };
}

// The box the text flows in, split into the part that scales with type size
// and the part that does not.
//
// A `max-width` in ch or em is font-relative: it computes to px at the
// current size, so it grows proportionally when the reader zooms. The column
// around it does not. Which of the two binds can flip mid-zoom, so both are
// carried and min()'d at query time rather than baked in now.
export function readBox(el) {
  const cs = getComputedStyle(el);
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;

  // clientWidth excludes borders and any scrollbar gutter. It is 0 on inline
  // elements, which have no layout box of their own — fall back to the union
  // rect, which is the width the inline content actually flows in.
  let own = Math.max(0, el.clientWidth - pl - pr);
  if (own === 0) own = Math.max(0, el.getBoundingClientRect().width - pl - pr);

  const parent = el.parentElement;
  let avail = own;
  if (parent) {
    const pcs = getComputedStyle(parent);
    const w = parent.clientWidth - (parseFloat(pcs.paddingLeft) || 0) - (parseFloat(pcs.paddingRight) || 0);
    if (w > 0) avail = Math.max(0, w - pl - pr);
  }

  const mw = parseFloat(cs.maxWidth);
  // A font-relative max-width computes to px at the CURRENT size, so it is
  // already the "at scale 1 relative to now" figure.
  const fontRelativeMax = Number.isFinite(mw) && mw > 0 ? Math.max(0, mw - pl - pr) : Infinity;

  return { avail, fontRelativeMax, own };
}

// `rel` is always RELATIVE to the style that was read, never an absolute
// zoom level. readTextStyle() returns the size the element computes to right
// now, so asking about the current state is rel = 1, and asking "what if the
// type were 30% bigger than it is at this moment" is rel = 1.3. Passing an
// absolute zoom factor into a style already carrying that zoom would scale it
// twice.
function widthAt(box, rel) {
  return Math.min(box.avail, box.fontRelativeMax * rel);
}

function preparedFor(text, s) {
  // The cache key deliberately omits font size — that is the entire point of
  // the reference size. It does include the full family chain, because a
  // different fallback chain measures differently.
  const k = s.prefix + s.family + '|' + s.whiteSpace + '|' + s.wordBreak
    + '|' + (s.letterSpacing / s.fontSize).toFixed(6) + '|' + text;

  let p = preparedCache.get(k);
  if (p === undefined) {
    p = prepare(text, s.prefix + REF_SIZE + 'px ' + s.family, {
      whiteSpace: s.whiteSpace,
      wordBreak: s.wordBreak,
      letterSpacing: s.letterSpacing * (REF_SIZE / s.fontSize),
    });
    preparedCache.set(k, p);
  }
  return p;
}

// How many lines `text` takes at `rel` times the read style's size, given a
// style and box read once. Pure arithmetic after the first call for a given
// string: no DOM, no reflow.
export function lineCountWith(style, box, text, rel = 1) {
  if (!text) return 0;
  const width = widthAt(box, rel);
  if (width <= 0) return 0;
  // k converts real px into reference-size px.
  const k = REF_SIZE / (style.fontSize * rel);
  // Browsers still give an empty block one line box; pretext reports 0.
  return Math.max(1, layout(preparedFor(text, style), width * k, style.lineHeight * rel * k).lineCount);
}

export function heightWith(style, box, text, rel = 1) {
  if (!text) return 0;
  return lineCountWith(style, box, text, rel) * style.lineHeight * rel;
}

// Convenience wrapper for one-off queries: reads style and box, then
// measures. Prefer readTextStyle/readBox + heightWith when measuring many
// blocks that share a class.
export function measureTextHeight(el, text, rel = 1) {
  return heightWith(readTextStyle(el), readBox(el), text, rel);
}

// Known limitation, for Tibetan specifically
// ------------------------------------------
// pretext breaks after a tsek (U+0F0B) correctly in a pure Tibetan run — a
// spaceless tsek-joined string wraps exactly where the browser wraps it. But
// when a run also contains an ASCII space, it stops taking the intra-run tsek
// opportunities and breaks at the space instead, ending the line early.
//
// That combination is normal in verse: phrases are separated by shad-space-shad
// ("...pa'i| |'jam..."), so a line can carry both. On the Sum cu pa it costs one
// extra line on 1-2 of 31 verses; measured against the browser the error is
// always an over-estimate, never an under (bench/accuracy.mjs). Over is the
// safe direction for contain-intrinsic-size, and the reader's convergence pass
// absorbs it for scroll anchoring — but it is worth knowing before trusting a
// pretext line count as exact for mixed Tibetan.
//
// Minimal repro: prepare the same verse with and without its spaces; the
// spaceless one packs to the full width, the other breaks at the space.

export function _cacheSize() { return preparedCache.size; }
