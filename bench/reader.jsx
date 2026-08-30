// Controlled A/B for the Sum cu pa reader.
//
// Both modes render the same verses, import the same styles.css and run the
// same React. The ONLY differences are the ones under test:
//
//   naive  — zoom and language are React state; zoom is applied through
//            inline style= that overrides the stylesheet's relative units;
//            no content-visibility; scroll is re-anchored with a single
//            getBoundingClientRect() read inside requestAnimationFrame.
//
//   fast   — zoom is one CSS custom property and language is one attribute,
//            both written imperatively by reader.js; content-visibility with
//            pretext-derived intrinsic sizes; predicted-then-converged
//            anchoring with no reads inside rAF.
//
// Mode comes from ?mode= so a fresh page can be loaded per condition.

import React, { useState, useRef, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { TIBETAN_DATA as D } from '../src/data.js';
import { createReader } from '../src/reader.js';
import * as pretext from '@chenglou/pretext';
import * as tm from '../src/textMeasure.js';
import '../src/styles.css';
import './bench.css';

const verses = D.intro.sumchupa.verses;
const I = D.intro;

function Head() {
  return (
    <div className="sum-head">
      <div className="sum-head-ti ti">{I.sumchupa.titleTib}</div>
      <div className="sum-head-en">{I.sumchupa.titleEn.map((l, i) => <div key={i}>{l}</div>)}</div>
      <div className="sum-head-author mono">{I.sumchupa.author}</div>
    </div>
  );
}

const label = (v, vi) => (
  <div className="sum-verse-label mono">
    {vi !== 0 && vi !== verses.length - 1 && <span className="sum-verse-num">{String(vi).padStart(2, '0')} · </span>}
    {v.label}
  </div>
);

/* ─────────────────────────── naive ─────────────────────────── */

function NaiveReader() {
  const [zoom, setZoom] = useState(1);
  const [showEn, setShowEn] = useState(true);
  const bodyRef = useRef(null);

  // The usual re-anchor: mutate, then read back next frame and jump.
  const reanchor = () => {
    const els = bodyRef.current.querySelectorAll('.sum-verse-ti, .sum-line, .sum-verse-label');
    const line = window.innerHeight * 0.25;
    let anchor = null, best = Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) continue;
      const d = Math.abs(r.top - line);
      if (d < best) { best = d; anchor = { el, top: r.top }; }
    }
    if (!anchor) return;
    requestAnimationFrame(() => {
      // Read inside rAF, before the frame's layout: forces a synchronous
      // reflow of everything React just re-rendered.
      const r = anchor.el.getBoundingClientRect();
      const h = document.documentElement.scrollHeight;
      window.scrollBy(0, r.top - anchor.top);
      if (h < 0) console.log(h);
    });
  };

  const bump = (d) => { reanchor(); setZoom(z => Math.max(0.85, Math.min(2, +(z + d).toFixed(2)))); };

  return (
    <div className="sum-scroll">
      <Head />
      <div className="sum-toolbar">
        <div className="reader-zoom">
          <button className="rz-btn" data-zoom="out" onClick={() => bump(-0.15)}>A−</button>
          <button className="rz-readout mono" data-zoom-readout="">{Math.round(zoom * 100)}%</button>
          <button className="rz-btn" data-zoom="in" onClick={() => bump(0.15)}>A+</button>
        </div>
        <div className="lang-switch">
          <button className="chip lang-chip" data-lang="both"
            onClick={() => { reanchor(); setShowEn(true); }}>Both</button>
          <button className="chip lang-chip" data-lang="ti"
            onClick={() => { reanchor(); setShowEn(false); }}>Tibetan only</button>
        </div>
      </div>
      {/* inline style= wins over the stylesheet's em-based scale */}
      <div className="sum-body naive" ref={bodyRef} style={{ fontSize: 17 * zoom + 'px' }}>
        {verses.map((v, vi) => (
          <div key={vi} className="sum-verse">
            {label(v, vi)}
            <div className="sum-verse-ti ti" style={{ fontSize: 24 * zoom + 'px' }}>{v.tib}</div>
            {showEn && (
              <div className="sum-verse-en">
                {v.en.map((l, li) => (
                  <div key={li} className="sum-line" style={{ fontSize: 15.5 * zoom + 'px' }}>{l}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── fast ─────────────────────────── */

function FastReader() {
  const bodyRef = useRef(null);
  const toolbarRef = useRef(null);
  const readerRef = useRef(null);
  useLayoutEffect(() => {
    window.__convergePasses = null;
    const r = createReader(bodyRef.current, toolbarRef.current, {
      onSettle: (passes) => { window.__convergePasses = passes; },
      onWarm: (n) => { window.__warmed = n; },
      intrinsicSizes: !NO_CV,
    });
    r.init();
    readerRef.current = r;
    window.__reader = r;
  }, []);

  return (
    <div className="sum-scroll">
      <Head />
      <div className="sum-toolbar" ref={toolbarRef}>
        <div className="reader-zoom">
          <button className="rz-btn" data-zoom="out" onClick={() => readerRef.current.zoomOut()}>A−</button>
          <button className="rz-readout mono" data-zoom-readout="" onClick={() => readerRef.current.zoomReset()}>100%</button>
          <button className="rz-btn" data-zoom="in" onClick={() => readerRef.current.zoomIn()}>A+</button>
        </div>
        <div className="lang-switch">
          <button className="chip lang-chip" data-lang="both" onClick={() => readerRef.current.setLang('both')}>Both</button>
          <button className="chip lang-chip" data-lang="ti" onClick={() => readerRef.current.setLang('ti')}>Tibetan only</button>
          <button className="chip lang-chip" data-lang="en" onClick={() => readerRef.current.setLang('en')}>English only</button>
        </div>
      </div>
      <div className="sum-body" ref={bodyRef}>
        {verses.map((v, vi) => (
          <div key={vi} className="sum-verse">
            {label(v, vi)}
            <div className="sum-verse-ti ti">{v.tib}</div>
            <div className="sum-verse-en">
              {v.en.map((l, li) => <div key={li} className="sum-line">{l}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Exposed for the accuracy checks only; the app itself never touches these.
window.__pretext = pretext;
window.__tm = tm;

const params = new URLSearchParams(location.search);
const NO_CV = params.get('cv') === 'off';
const mode = params.get('mode') === 'naive' ? 'naive' : 'fast';
document.documentElement.dataset.mode = mode;

// Count renders of the verse list so the harness can assert that a zoom or a
// language switch produced none.
let renders = 0;
window.__renders = () => renders;
function Counted({ children }) { renders++; return children; }

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className="app"><main className="main"><div className="view intro">
    <Counted>{mode === 'naive' ? <NaiveReader /> : <FastReader />}</Counted>
  </div></main></div>
);
