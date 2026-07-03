import { useState, useEffect } from 'react';
import { TIBETAN_DATA as D } from '../data.js';
import PaperTest from '../components/PaperTest.jsx';
import VocabCards from '../components/VocabCards.jsx';

const toneColor = (t) => {
  if (t === 'high') return 'var(--tone-high)';
  if (t === 'high asp.') return 'var(--tone-asp)';
  return 'var(--tone-low)';
};

const toneLabel = (t) =>
  t === 'high asp.' ? 'High · aspirated' : t === 'high' ? 'High' : 'Low';

export default function AlphabetView({ go, initial }) {
  const [sel, setSel] = useState(initial?.letter ?? 0);
  const [highlight, setHighlight] = useState('all');

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'ArrowRight')      setSel(s => (s + 1) % 30);
      else if (e.key === 'ArrowLeft')  setSel(s => (s + 29) % 30);
      else if (e.key === 'ArrowDown')  setSel(s => Math.min(29, s + 4));
      else if (e.key === 'ArrowUp')    setSel(s => Math.max(0,  s - 4));
      else return;
      e.preventDefault(); // handled arrows must not also scroll the page
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visible = (c) => {
    if (highlight === 'all')  return true;
    if (highlight === 'high') return c.t === 'high';
    if (highlight === 'asp')  return c.t === 'high asp.';
    if (highlight === 'low')  return c.t === 'low';
  };

  const rows = [];
  for (let i = 0; i < 7; i++) rows.push(D.consonants.slice(i * 4, i * 4 + 4));
  rows.push(D.consonants.slice(28));

  const c = D.consonants[sel];

  return (
    <div className="view alphabet">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.1</div>
          <h1>The 30 Consonants</h1>
          <div className="ti-sub">གསལ་བྱེད་སུམ་ཅུ།</div>
        </div>
        <div className="filter-row">
          {[['all', 'All'], ['high', 'High'], ['asp', 'Aspirated'], ['low', 'Low']].map(([k, l]) => (
            <button key={k} className={'chip' + (highlight === k ? ' on' : '')} onClick={() => setHighlight(k)}>{l}</button>
          ))}
        </div>
      </header>

      <p className="lead">
        Hold a sheet of paper to your mouth. <em>Column 1 and 3 — the paper does not move.
        Column 2 is aspirated; the paper flutters.</em> Letters marked low are pronounced
        in a low register.
      </p>

      <div className="alpha-layout">
        <div className="alpha-grid">
          {rows.map((row, ri) => (
            <div key={ri} className={'row row-' + ri + (row.length < 4 ? ' short' : '')}>
              {row.map((cn) => {
                const isSel = D.consonants.indexOf(cn) === sel;
                const dim = !visible(cn);
                return (
                  <button key={cn.g}
                    className={'cell t-' + cn.t.replace(/[ .]/g, '') + (isSel ? ' is-sel' : '') + (dim ? ' is-dim' : '')}
                    onClick={() => setSel(D.consonants.indexOf(cn))}>
                    <span className="cell-num">{String(cn.n).padStart(2, '0')}</span>
                    <span className="cell-ti">{cn.g}</span>
                    <span className="cell-r">{cn.r}</span>
                    <span className="cell-dot" style={{ background: toneColor(cn.t) }} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <aside className="detail">
          <div className="detail-num">No. {String(c.n).padStart(2, '0')} / 30</div>
          <div className="detail-glyph-wrap">
            <div key={c.g} className="detail-glyph glyph-anim">{c.g}</div>
            <PaperTest aspirated={c.t === 'high asp.'} />
          </div>
          <div className="dl">
            <dt>Romanization</dt>
            <dd className="mono">{c.r}</dd>
            <dt>Tone</dt>
            <dd><span className="dot" style={{ background: toneColor(c.t) }} /> {toneLabel(c.t)}</dd>
            <dt>Column</dt>
            <dd>{((c.n - 1) % 4) + 1} of 4 {c.n > 28 ? '(final row)' : ''}</dd>
            {c.v && (<><dt>Word it makes</dt><dd className="gloss"><span className="ti">{c.g}་</span> — {c.v}</dd></>)}
          </div>

          <div className="detail-form">
            <div className="form-line">
              <span className="form-big">{c.g}<span className="tsek">་</span></span>
              <span className="form-small">+ vowel = syllable</span>
            </div>
            <div className="form-line">
              <span className="form-big">{c.g}ི་ {c.g}ུ་ {c.g}ེ་ {c.g}ོ་</span>
            </div>
            <div className="form-line mono small">
              {c.r.replace(/a$/, 'i')}  ·  {c.r.replace(/a$/, 'u')}  ·  {c.r.replace(/a$/, 'e')}  ·  {c.r.replace(/a$/, 'o')}
            </div>
          </div>

          <div className="detail-nav">
            <button onClick={() => setSel((sel + 29) % 30)}>← prev</button>
            <button onClick={() => setSel((sel + 1)  % 30)}>next →</button>
          </div>
          <div className="detail-kbd mono">use ← → ↑ ↓ to navigate</div>

          <div className="xlinks">
            <button className="chip" onClick={() => go('trace', { letter: sel })}>✎ Trace <span className="ti">{c.g}</span></button>
            <button className="chip" onClick={() => go('vowels', { letter: sel })}>Add a vowel to <span className="ti">{c.g}</span> →</button>
          </div>
        </aside>
      </div>

      <VocabCards
        words={D.letterWords}
        title="Words that are a single letter"
        lead={
          <>
            A handful of consonants are complete words on their own — just the bare
            letter and its inherent <em>-a</em>, with no vowel mark, subscript or
            superscript. Flip a card to reveal its meaning, then test yourself.
          </>
        }
      />
    </div>
  );
}
