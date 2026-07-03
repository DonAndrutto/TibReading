import { useState, useMemo } from 'react';
import { shuffle } from '../utils.js';

// Collapsible vocabulary deck — tap-to-reveal flashcards plus a meaning quiz —
// over any list of { g, r, m } words. Shared by AlphabetView (single-letter
// words) and VowelsView (consonant + vowel words).
export default function VocabCards({ words, title, lead, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const [mode, setMode] = useState('study');

  // tap-to-reveal — flashcard, mirrors the Read (07) section
  const [fi, setFi] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const w = words[fi];
  const prevFlash = () => { setFlipped(false); setFi(i => (i + words.length - 1) % words.length); };
  const nextFlash = () => { setFlipped(false); setFi(i => (i + 1) % words.length); };

  // quiz
  const [qIdx, setQIdx]     = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore]   = useState({ right: 0, wrong: 0 });
  const [streak, setStreak] = useState(0);
  const quiz = words[qIdx];

  const options = useMemo(() => {
    const pool = words.filter(x => x.r !== quiz.r);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([...distractors, quiz]);
  }, [qIdx, words, quiz]);

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
          <span className="lw-title">{title}</span>
        </span>
        <span className={'lw-chevron' + (open ? ' open' : '')}>⌄</span>
      </button>

      {open && (
        <div className="lw-body">
          <p className="lw-lead">{lead}</p>

          <div className="lw-tabs filter-row">
            <button className={'chip' + (mode === 'study' ? ' on' : '')} onClick={() => setMode('study')}>Tap to reveal</button>
            <button className={'chip' + (mode === 'quiz'  ? ' on' : '')} onClick={() => setMode('quiz')}>Quiz</button>
          </div>

          {mode === 'study' && (
            <>
              <div className="read-stage">
                <div className={'flashcard' + (flipped ? ' is-revealed' : '')} onClick={() => setFlipped(f => !f)}>
                  <div className="card-face card-front">
                    <div className="card-num mono">{String(fi + 1).padStart(2, '0')} / {words.length}</div>
                    <div className="card-ti">{w.g}<span className="tsek">་</span></div>
                    <div className="card-hint mono">tap to reveal</div>
                  </div>
                  <div className="card-face card-back">
                    <div className="card-r mono">{w.r}</div>
                    <div className="card-m">{w.m}</div>
                  </div>
                </div>

                <div className="read-nav">
                  <button className="btn" onClick={prevFlash}>← prev</button>
                  <button className="btn primary" onClick={() => setFlipped(f => !f)}>{flipped ? 'Hide' : 'Reveal'}</button>
                  <button className="btn" onClick={nextFlash}>next →</button>
                </div>
              </div>

              <div className="read-list">
                {words.map((x, k) => (
                  <button key={x.g}
                    className={'list-card' + (k === fi ? ' on' : '')}
                    onClick={() => { setFi(k); setFlipped(false); }}>
                    <div className="lc-ti">{x.g}<span className="tsek">་</span></div>
                    <div className="lc-r mono">{x.r}</div>
                    <div className="lc-m">{x.m}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === 'quiz' && (
            <div className="lw-quiz">
              <div className="quiz-scoreboard">
                <div className="qs-block"><div className="qs-num">{score.right}</div><div className="qs-label mono">correct</div></div>
                <div className="qs-block"><div className="qs-num">{score.wrong}</div><div className="qs-label mono">missed</div></div>
                <div className="qs-block"><div className={'qs-num' + (streak >= 3 ? ' hot' : '')}>{streak}</div><div className="qs-label mono">{streak >= 3 ? 'streak ✦' : 'streak'}</div></div>
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
