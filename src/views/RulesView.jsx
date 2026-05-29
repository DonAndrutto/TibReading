import { useState, useEffect, useMemo } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function RulesView() {
  const R = D.rules;
  const [mode, setMode]     = useState('browse');
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

  // ── Quiz over every spelling→sound example across all rules ──
  const allExamples = useMemo(
    () => R.flatMap(r => r.examples.map(ex => ({ ...ex, ruleTitle: r.title, ruleTag: r.tag }))),
    [R]
  );
  const [qIdx, setQIdx]     = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore]   = useState({ right: 0, wrong: 0 });
  const [streak, setStreak] = useState(0);
  const quiz = allExamples[qIdx];

  const options = useMemo(() => {
    const correct = quiz;
    // unique readings only, so two options never show the same answer
    const pool = [...new Map(
      allExamples.filter(e => e.reads !== correct.reads).map(e => [e.reads, e])
    ).values()];
    const distractors = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    return [...distractors, correct].sort(() => Math.random() - 0.5);
  }, [qIdx, allExamples]);

  const pick = (opt, k) => {
    if (picked !== null) return;
    setPicked(k);
    if (opt.reads === quiz.reads) { setScore(s => ({ ...s, right: s.right + 1 })); setStreak(s => s + 1); }
    else                         { setScore(s => ({ ...s, wrong: s.wrong + 1 })); setStreak(0); }
  };
  const nextQuiz  = () => { setPicked(null); setQIdx(q => (q + 1) % allExamples.length); };
  const resetQuiz = () => {
    setPicked(null);
    setScore({ right: 0, wrong: 0 });
    setStreak(0);
    setQIdx(Math.floor(Math.random() * allExamples.length));
  };

  return (
    <div className="view rules">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.5 · pronunciation</div>
          <h1>Reading by the Rules</h1>
          <div className="subtitle-en">spelling ⇢ sound</div>
        </div>
        <div className="filter-row">
          <button className={'chip' + (mode === 'browse' ? ' on' : '')} onClick={() => setMode('browse')}>Browse</button>
          <button className={'chip' + (mode === 'quiz'   ? ' on' : '')} onClick={() => setMode('quiz')}>Quiz</button>
        </div>
      </header>

      <p className="lead">
        Tibetan spelling carries history: many letters are written but not heard, and certain
        combinations change the sound entirely. Pick a rule on the left, then tap each example
        to flip from <em>spelled</em> to <em>spoken</em>.
      </p>

      {mode === 'browse' && (
        <>
          <div className="rules-filter">
            <span className="filter-label mono">Filter by category</span>
            <div className="filter-row">
              {tags.map(t => (
                <button key={t} className={'chip' + (filter === t ? ' on' : '')} onClick={() => setFilter(t)}>
                  {t === 'all' ? 'All' : t.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

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
        </>
      )}

      {mode === 'quiz' && (
        <div className="quiz-stage">
          <div className="quiz-scoreboard">
            <div className="qs-block"><div className="qs-num">{score.right}</div><div className="qs-label mono">correct</div></div>
            <div className="qs-block"><div className="qs-num">{score.wrong}</div><div className="qs-label mono">missed</div></div>
            <div className="qs-block"><div className="qs-num">{streak}</div><div className="qs-label mono">streak</div></div>
            <button className="btn qs-reset" onClick={resetQuiz}>↺ Reset</button>
          </div>

          <div className="quiz-prompt">
            <div className="quiz-kicker mono">how is this read aloud?</div>
            <div key={qIdx} className="quiz-ti glyph-anim">{quiz.spell}</div>
            <div className="quiz-hint mono">{quiz.ruleTag.replace('-', ' ')}</div>
          </div>

          <div className="quiz-options">
            {options.map((opt, k) => {
              const isCorrect = opt.reads === quiz.reads;
              const isPicked  = picked === k;
              const state = picked === null ? '' :
                isPicked ? (isCorrect ? ' right' : ' wrong') :
                isCorrect ? ' right' : ' dim';
              return (
                <button key={opt.reads + k}
                  className={'quiz-opt' + state}
                  onClick={() => pick(opt, k)}
                  disabled={picked !== null}>
                  <div className="qo-r mono">{opt.reads}</div>
                  {opt.gloss && <div className="qo-m">{picked !== null ? opt.gloss : ''}</div>}
                  {picked !== null && isCorrect && <div className="qo-tag mono">✓ correct</div>}
                  {isPicked && !isCorrect && <div className="qo-tag mono">your pick</div>}
                </button>
              );
            })}
          </div>

          <div className="quiz-controls">
            <button className="btn primary" onClick={nextQuiz} disabled={picked === null}>Next spelling →</button>
          </div>
        </div>
      )}
    </div>
  );
}
