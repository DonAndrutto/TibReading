import { useState } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function ProverbsView() {
  const P = D.proverbs;
  const [pIdx, setPIdx]   = useState(0);
  const [active, setActive] = useState({ line: 0, syl: 0 });
  const [mode, setMode]   = useState('annotated');
  const [showAll, setShowAll] = useState(false);

  const p = P[pIdx];
  const cur = p.lines[active.line]?.syl?.[active.syl];

  // Reset in the click handler (not an effect) so the new proverb never
  // paints one frame with the previous proverb's syllable still active.
  const pickProverb = (i) => { setPIdx(i); setActive({ line: 0, syl: 0 }); setShowAll(false); };

  return (
    <div className="view proverbs">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.6 · reading practice</div>
          <h1>Proverbs, Sayings &amp; Prayers</h1>
          <div className="subtitle-en">tap each syllable</div>
        </div>
        <div className="filter-row">
          <button className={'chip' + (mode === 'annotated' ? ' on' : '')} onClick={() => setMode('annotated')}>Annotated</button>
          <button className={'chip' + (mode === 'clean'     ? ' on' : '')} onClick={() => setMode('clean')}>Clean text</button>
          <button className={'chip' + (showAll ? ' on' : '')} onClick={() => setShowAll(s => !s)}>Show all readings</button>
        </div>
      </header>

      <p className="lead">
        The lines below are short Tibetan sayings and prayers, chosen because they exercise
        most of the spelling rules at once. Tap any syllable to see how it should actually be
        read — silent prefixes, umlaut vowels, 'ba' between dots becoming 'wa', and so on.
      </p>

      <div className="pr-strip">
        {P.map((q, i) => (
          <button key={q.id}
            className={'pr-tab' + (i === pIdx ? ' on' : '')}
            onClick={() => pickProverb(i)}>
            <div className="pr-tab-kind mono">{q.kind}</div>
            <div className="pr-tab-title">{q.title}</div>
          </button>
        ))}
      </div>

      <div className="pr-stage">
        {p.lines.map((line, li) => (
          <div key={li} className="pr-line-block">
            <div className={'pr-line ti' + (mode === 'clean' ? ' clean' : '')}>
              {line.syl.map((s, si) => {
                const isActive = active.line === li && active.syl === si;
                const reveal   = showAll || isActive;
                return (
                  <button key={si}
                    className={'pr-syl' + (isActive ? ' on' : '') + (reveal ? ' reveal' : '')}
                    onClick={() => setActive({ line: li, syl: si })}>
                    <span className="pr-syl-glyph">
                      <span className="pr-syl-ti">{s.t}</span>
                      {si < line.syl.length - 1 && <span className="pr-sep tsek">་</span>}
                      {si === line.syl.length - 1 && <span className="pr-sep she">།</span>}
                    </span>
                    {mode === 'annotated' && (
                      <span className="pr-syl-r mono">{reveal ? s.r : ''}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="pr-trans">
              <div className="pr-trans-gloss">{line.gloss}</div>
              {line.english && <div className="pr-trans-en mono">— {line.english}</div>}
            </div>
          </div>
        ))}
      </div>

      {cur && (
        <aside className="pr-detail">
          <div className="pr-detail-head">
            <div className="pr-detail-kicker mono">syllable {active.syl + 1} · line {active.line + 1}</div>
            <div key={active.line + '-' + active.syl} className="pr-detail-ti glyph-anim">{cur.t}<span className="tsek">་</span></div>
          </div>
          <div className="pr-detail-body">
            <div className="dl">
              <dt>Reads as</dt>
              <dd className="mono pr-detail-r">{cur.r}</dd>
              <dt>Meaning</dt>
              <dd>{cur.g || '—'}</dd>
              {cur.note && (
                <>
                  <dt>Rule applied</dt>
                  <dd className="pr-detail-note">{cur.note}</dd>
                </>
              )}
            </div>
            <div className="pr-detail-nav">
              <button className="btn" onClick={() => {
                const line = p.lines[active.line];
                if (active.syl > 0) setActive({ line: active.line, syl: active.syl - 1 });
                else if (active.line > 0) {
                  const prev = p.lines[active.line - 1];
                  setActive({ line: active.line - 1, syl: prev.syl.length - 1 });
                }
              }}>← prev</button>
              <button className="btn" onClick={() => {
                const line = p.lines[active.line];
                if (active.syl < line.syl.length - 1) setActive({ line: active.line, syl: active.syl + 1 });
                else if (active.line < p.lines.length - 1) setActive({ line: active.line + 1, syl: 0 });
              }}>next →</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
