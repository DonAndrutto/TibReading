import { useState, useEffect } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function StacksView() {
  const [kind, setKind] = useState('sub');
  const [idx, setIdx] = useState(0);
  const set = kind === 'sub' ? D.subscripts : D.superscripts;
  const item = set[idx];

  useEffect(() => setIdx(0), [kind]);

  return (
    <div className="view stacks">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.3</div>
          <h1>Stacks: Sub- &amp; Superscripts</h1>
          <div className="ti-sub">མགོ་ཅན་བཞི་ · ར་ལ་ས་</div>
        </div>
        <div className="filter-row">
          <button className={'chip' + (kind === 'sub' ? ' on' : '')} onClick={() => setKind('sub')}>Subscripts ↓</button>
          <button className={'chip' + (kind === 'sup' ? ' on' : '')} onClick={() => setKind('sup')}>Superscripts ↑</button>
        </div>
      </header>

      <div className="stack-layout">
        <div className="stack-left">
          <div className="stack-list">
            {set.map((s, i) => (
              <button key={s.name}
                className={'stack-row' + (i === idx ? ' on' : '')}
                onClick={() => setIdx(i)}>
                <div className="stack-mark">{kind === 'sub' ? '◌' + s.glyph : s.glyph + '◌'}</div>
                <div className="stack-meta">
                  <div className="stack-name">{s.name}</div>
                  <div className="stack-count">{s.stacks.length} stacks</div>
                </div>
              </button>
            ))}
          </div>

          <div className="stack-detail">
            <div className="stack-hero">
              <div className="hero-label">{kind === 'sub' ? 'subscript' : 'superscript'}</div>
              <div className="hero-glyph">{item.glyph}</div>
              <div className="hero-name">{item.name}</div>
            </div>
            <p className="stack-desc">{item.desc}</p>
          </div>
        </div>

        <div className="stack-grid">
          {item.stacks.map((s, i) => (
            <div key={i} className="stack-cell">
              <div className="sc-ti">{s.s}</div>
              <div className="sc-r mono">{s.r}</div>
              {s.gloss && <div className="sc-gloss">{s.gloss}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
