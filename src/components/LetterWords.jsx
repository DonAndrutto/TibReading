import { useState, useMemo } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function LetterWords() {
  const words = D.letterWords;
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState('study');

  // tap-to-reveal
  const [revealed, setRevealed]   = useState({});
  const [revealAll, setRevealAll] = useState(false);
  const toggle = (i) => setRevealed(r => ({ ...r, [i]: !r[i] }));
  const resetStudy = () => { setRevealed({}); setRevealAll(false); };

  // quiz
  const [qIdx, setQIdx]     = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore]   = useState({ right: 0, wrong: 0 });
  const [streak, setStreak] = useState(0);
  const quiz = words[qIdx];

  const options = useMemo(() => {
    const pool = words.filter(w => w.r !== quiz.r);
    const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...distractors, quiz].sort(() => Math.random() - 0.5);
  }, [qIdx]);

  const pick = (opt, k) => {
    if (picked !== null) return;
    setPicked(k);
    if (opt.r === quiz.r) { setScore(s => ({ ...s, right: s.right + 1 })); setStreak(s => s + 1); }
    else                  { setScore(s => ({ ...s, wrong: s.wrong + 1 })); setStreak(0); }
  };
  const nextQuiz  = () => { setPicked(null); setQIdx(q => (q + 1) % words.length); };
  const resetQuiz = () => {
    setPicked(null);
    setScore({ right: 0, wrong: 0 });
    setStreak(0);
    setQIdx(Math.floor(Math.random() * words.length));
  };

  return (
    <section className="letter-words">
      <button className="lw-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="lw-head-text">
          <span className="lw-kicker mono">vocabulary · {words.length} words</span>
          <span className="lw-title">Words that are a single letter</span>
        </span>
        <span className={'lw-chevron' + (open ? ' open' : '')}>⌄</span>
      </button>

      {open && (
        <div className="lw-body">
          <p className="lw-lead">
            A handful of consonants are complete words on their own — just the bare
            letter and its inherent <em>-a</em>, with no vowel mark, subscript or
            superscript. Tap a card to reveal its meaning, then test yourself.
          </p>

          <div className="lw-tabs filter-row">
            <button className={'chip' + (mode === 'study' ? ' on' : '')} onClick={() => setMode('study')}>Tap to reveal</button>
            <button className={'chip' + (mode === 'quiz'  ? ' on' : '')} onClick={() => setMode('quiz')}>Quiz</button>
            {mode === 'study' && (
              <>
                <button className="chip" onClick={() => setRevealAll(true)}>Reveal all</button>
                <button className="chip" onClick={resetStudy}>Hide all</button>
              </>
            )}
          </div>

          {mode === 'study' && (
            <div className="lw-grid">
              {words.map((w, i) => {
                const show = revealAll || !!revealed[i];
                return (
                  <button key={w.g} className={'lw-card' + (show ? ' open' : '')} onClick={() => toggle(i)}>
                    <span className="lw-card-ti">{w.g}<span className="tsek">་</span></span>
                    <span className="lw-card-r mono">{w.r}</span>
                    <span className={'lw-card-m' + (show ? '' : ' hidden')}>{show ? w.m : 'tap to reveal'}</span>
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'quiz' && (
            <div className="lw-quiz">
              <div className="quiz-scoreboard">
                <div className="qs-block"><div className="qs-num">{score.right}</div><div className="qs-label mono">correct</div></div>
                <div className="qs-block"><div className="qs-num">{score.wrong}</div><div className="qs-label mono">missed</div></div>
                <div className="qs-block"><div className="qs-num">{streak}</div><div className="qs-label mono">streak</div></div>
                <button className="btn qs-reset" onClick={resetQuiz}>↺ Reset</button>
              </div>

              <div className="quiz-prompt">
                <div className="quiz-kicker mono">what does this word mean?</div>
                <div key={quiz.g} className="quiz-ti glyph-anim">{quiz.g}<span className="tsek">་</span></div>
                <div className="quiz-hint mono">{quiz.r}</div>
              </div>

              <div className="quiz-options">
                {options.map((opt, k) => {
                  const isCorrect = opt.r === quiz.r;
                  const isPicked  = picked === k;
                  const state = picked === null ? '' :
                    isPicked ? (isCorrect ? ' right' : ' wrong') :
                    isCorrect ? ' right' : ' dim';
                  return (
                    <button key={opt.r + k}
                      className={'quiz-opt' + state}
                      onClick={() => pick(opt, k)}
                      disabled={picked !== null}>
                      <div className="qo-m">{opt.m}</div>
                      {picked !== null && isCorrect && <div className="qo-tag mono">✓ correct</div>}
                      {isPicked && !isCorrect && <div className="qo-tag mono">your pick</div>}
                    </button>
                  );
                })}
              </div>

              <div className="quiz-controls">
                <button className="btn primary" onClick={nextQuiz} disabled={picked === null}>Next word →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
