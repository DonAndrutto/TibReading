import { useState, useEffect } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function RulesView() {
  const R = D.rules;
  const [filter, setFilter] = useState('all');
  const [sel, setSel]       = useState(0);
  const [revealed, setRevealed] = useState({});
  const [revealAll, setRevealAll] = useState(false);

  const tags = ['all', ...Array.from(new Set(R.map(r => r.tag)))];
  const visible = R.filter(r => filter === 'all' || r.tag === filter);

  useEffect(() => { setSel(0); }, [filter]);

  const rule = visible[sel] || R[0];

  const toggle = (key) => setRevealed(r => ({ ...r, [key]: !r[key] }));
  const reset = () => { setRevealed({}); setRevealAll(false); };

  return (
    <div className="view rules">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.5 · pronunciation</div>
          <h1>Reading by the Rules</h1>
          <div className="subtitle-en">spelling ⇢ sound</div>
        </div>
        <div className="filter-row">
          {tags.map(t => (
            <button key={t} className={'chip' + (filter === t ? ' on' : '')} onClick={() => setFilter(t)}>
              {t === 'all' ? 'All' : t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </header>

      <p className="lead">
        Tibetan spelling carries history: many letters are written but not heard, and certain
        combinations change the sound entirely. Pick a rule on the left, then tap each example
        to flip from <em>spelled</em> to <em>spoken</em>.
      </p>

      <div className="rules-layout">
        <aside className="rules-list">
          {visible.map((r, i) => (
            <button key={r.id}
              className={'rule-row' + (i === sel ? ' on' : '')}
              onClick={() => { setSel(i); reset(); }}>
              <div className="rule-num mono">{String(i + 1).padStart(2, '0')}</div>
              <div className="rule-meta">
                <div className="rule-title">{r.title}</div>
                <div className="rule-tag mono">{r.tag.replace('-', ' ')}</div>
              </div>
            </button>
          ))}
        </aside>

        <section className="rules-detail">
          <div className="rd-head">
            <div className="rd-tag mono">{rule.tag.replace('-', ' ')}</div>
            <h2 className="rd-title">{rule.title}</h2>
            <p className="rd-desc">{rule.desc}</p>
            <div className="rd-actions">
              <button className="chip" onClick={() => setRevealAll(true)}>Reveal all</button>
              <button className="chip" onClick={reset}>Hide all</button>
            </div>
          </div>

          <div className="rd-examples">
            {rule.examples.map((ex, i) => {
              const key  = rule.id + ':' + i;
              const open = revealAll || !!revealed[key];
              return (
                <button key={key}
                  className={'rd-card' + (open ? ' open' : '')}
                  onClick={() => toggle(key)}>
                  <div className="rd-spell">
                    <span className="rd-spell-ti">{ex.spell}</span>
                  </div>
                  <div className="rd-arrow mono">→</div>
                  <div className="rd-reads">
                    <span className={'rd-reads-r mono' + (open ? '' : ' hidden')}>{open ? ex.reads : '·  ·  ·'}</span>
                    {ex.gloss && <span className={'rd-reads-g' + (open ? '' : ' hidden')}>{open ? ex.gloss : ''}</span>}
                  </div>
                  <div className="rd-flip mono">{open ? '✓' : 'tap'}</div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
