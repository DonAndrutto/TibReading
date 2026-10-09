import ScriptText from '../components/ScriptText.jsx';
import { gradeCard } from '../progress.js';
import { markSeen } from '../progress.js';
import { useState, useMemo, useEffect } from 'react';
import { TIBETAN_DATA as D } from '../data.js';
import ReadingDrills from '../components/ReadingDrills.jsx';
import { shuffle } from '../utils.js';

export default function ReadView({ go, initial }) {
  const [structure, setStructure] = useState('all');
  const [mode, setMode] = useState('flash');
  const [i, setI] = useState(initial?.index ?? 0);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { markSeen('card:' + D.practiceWords[i].w); }, [i]);
  const word = D.practiceWords[i];

  const next = () => { setRevealed(false); go('read', { index: (i + 1) % D.practiceWords.length }); };
  const prev = () => { setRevealed(false); go('read', { index: (i + D.practiceWords.length - 1) % D.practiceWords.length }); };

  // Flashcards work from the keyboard too: ← → to move, space/enter to flip.
  // Skip enter/space when a button has focus so it doesn't double-fire.
  useEffect(() => {
    if (mode !== 'flash') return;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return; // e.g. Alt+← is browser back
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if ((e.key === ' ' || e.key === 'Enter') && tag !== 'BUTTON') {
        e.preventDefault();
        setRevealed(r => !r);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, i]);

  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const quizWord = D.practiceWords[qIdx];

  const options = useMemo(() => {
    const correct = quizWord;
    const pool = D.practiceWords.filter(w => w.r !== correct.r);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([...distractors, correct]);
  }, [qIdx]);

  const pickOption = (opt, k) => {
    if (picked !== null) return;
    setPicked(k);
    gradeCard('card:' + quizWord.w, opt.r === quizWord.r ? 'knew' : 'missed');
    if (opt.r === quizWord.r) {
      setScore(s => ({ ...s, right: s.right + 1 }));
      setStreak(s => s + 1);
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      setStreak(0);
    }
  };
  const nextQuiz = () => {
    setPicked(null);
    setQIdx(q => (q + 1) % D.practiceWords.length);
  };
  const resetQuiz = () => {
    setPicked(null);
    setScore({ right: 0, wrong: 0 });
    setStreak(0);
    setQIdx(Math.floor(Math.random() * D.practiceWords.length));
  };

  return (
    <div className="view read">
      <p className="sr-only" role="status">{picked !== null ? (options[picked].r === quizWord.r ? "Correct. " : "Not quite. ") + quizWord.r : ""}</p>
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.5 · reading</div>
          <h1>First Words</h1>
          <div className="subtitle-en">Recognise · romanise · translate</div>
        </div>
        <div className="filter-row">
          <button className={'chip' + (mode === 'flash' ? ' on' : '')} onClick={() => setMode('flash')}>Flashcards</button>
          <button className={'chip' + (mode === 'quiz'  ? ' on' : '')} onClick={() => setMode('quiz')}>Quiz</button>
        </div>
      </header>

      <p className="lead">
        Sound the word out from its letters before flipping the card. Words are
        separated by an inter-syllabic dot <span className="ti" lang="bo">་</span> (<span className="mono">tsek</span>);
        sentences end with a vertical bar <span className="ti" lang="bo">།</span> (<span className="mono">shé</span>).
      </p>

      <ReadingDrills />
      {mode === 'flash' && (
        <>
          <div className="read-stage">
            <div role="button" tabIndex={0} aria-label="Reveal or hide reading" aria-pressed={revealed} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setRevealed(v => !v); } }} className={'flashcard' + (revealed ? ' is-revealed' : '')} onClick={() => setRevealed(r => !r)}>
              <div className="card-face card-front">
                <div className="card-num mono">{String(i + 1).padStart(2, '0')} / {D.practiceWords.length}</div>
                <div className="card-ti" lang="bo">{word.w}<span className="tsek" lang="bo">་</span></div>
                <div className="card-hint mono">tap or press space to reveal · ← → to move</div>
              </div>
              <div className="card-face card-back">
                <div className="card-r mono">{word.r}</div>
                <div className="card-m"><ScriptText>{word.m}</ScriptText></div>
              </div>
            </div>

            <div className="read-nav">
              <button className="btn" onClick={prev}>← prev</button>
              <button className="btn primary" onClick={() => setRevealed(r => !r)}>
                {revealed ? 'Hide' : 'Reveal'}
              </button>
              <button className="btn" onClick={next}>next →</button>
            </div>
          </div>

          <label>Word structure<select aria-label="Word structure" value={structure} onChange={e => setStructure(e.target.value)}>{["all","no prefix","prefix","superscript","subscript","suffix","combos"].map(t => <option key={t}>{t}</option>)}</select></label>
          <div className="read-list">
            {D.practiceWords.map((w, k) => (structure === "all" || w.tags.includes(structure)) && (
              <button key={k}
                className={'list-card' + (k === i ? ' on' : '')}
                onClick={() => { go('read', { index: k }); setRevealed(false); }}>
                <div className="lc-ti" lang="bo">{w.w}<span className="tsek" lang="bo">་</span></div>
                <div className="lc-r mono">{w.r}</div>
                <div className="lc-m"><ScriptText>{w.m}</ScriptText></div>
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'quiz' && (
        <div className="quiz-stage">
          <div className="quiz-scoreboard">
            <div className="qs-block">
              <div className="qs-num">{score.right}</div>
              <div className="qs-label mono">correct</div>
            </div>
            <div className="qs-block">
              <div className="qs-num">{score.wrong}</div>
              <div className="qs-label mono">missed</div>
            </div>
            <div className="qs-block">
              <div className={'qs-num' + (streak >= 3 ? ' hot' : '')}>{streak}</div>
              <div className="qs-label mono">{streak >= 3 ? 'streak ✦' : 'streak'}</div>
            </div>
            <button className="btn qs-reset" onClick={resetQuiz}>↺ Reset</button>
          </div>

          <div className="quiz-prompt">
            <div className="quiz-kicker mono">read this word</div>
            <div key={quizWord.w} className="quiz-ti glyph-anim" lang="bo">{quizWord.w}<span className="tsek" lang="bo">་</span></div>
            <div className="quiz-hint mono">pick the matching romanization &amp; meaning</div>
          </div>

          <div className="quiz-options">
            {options.map((opt, k) => {
              const isCorrect = opt.r === quizWord.r;
              const isPicked  = picked === k;
              const state = picked === null ? '' :
                isPicked ? (isCorrect ? ' right' : ' wrong') :
                isCorrect ? ' right' : ' dim';
              return (
                <button key={opt.r + k}
                  className={'quiz-opt' + state}
                  onClick={() => pickOption(opt, k)}
                  disabled={picked !== null}>
                  <div className="qo-r mono">{opt.r}</div>
                  <div className="qo-m"><ScriptText>{opt.m}</ScriptText></div>
                  {picked !== null && isCorrect && <div className="qo-tag mono">✓ correct</div>}
                  {isPicked && !isCorrect && <div className="qo-tag mono">your pick</div>}
                </button>
              );
            })}
          </div>

          <div className="quiz-controls">
            <button className="btn primary" onClick={nextQuiz} disabled={picked === null}>
              Next word →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
