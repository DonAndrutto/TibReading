import { useState, useMemo } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function ReadView() {
  const [mode, setMode] = useState('flash');
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const word = D.practiceWords[i];

  const next = () => { setRevealed(false); setI((i + 1) % D.practiceWords.length); };
  const prev = () => { setRevealed(false); setI((i + D.practiceWords.length - 1) % D.practiceWords.length); };

  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const quizWord = D.practiceWords[qIdx];

  const options = useMemo(() => {
    const correct = quizWord;
    const pool = D.practiceWords.filter(w => w.r !== correct.r);
    const distractors = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...distractors, correct].sort(() => Math.random() - 0.5);
  }, [qIdx]);

  const pickOption = (opt, k) => {
    if (picked !== null) return;
    setPicked(k);
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
        separated by an inter-syllabic dot <span className="ti">་</span> (<span className="mono">tsek</span>);
        sentences end with a vertical bar <span className="ti">།</span> (<span className="mono">shé</span>).
      </p>

      {mode === 'flash' && (
        <>
          <div className="read-stage">
            <div className={'flashcard' + (revealed ? ' is-revealed' : '')} onClick={() => setRevealed(r => !r)}>
              <div className="card-face card-front">
                <div className="card-num mono">{String(i + 1).padStart(2, '0')} / {D.practiceWords.length}</div>
                <div className="card-ti">{word.w}་</div>
                <div className="card-hint mono">tap to reveal</div>
              </div>
              <div className="card-face card-back">
                <div className="card-r mono">{word.r}</div>
                <div className="card-m">{word.m}</div>
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

          <div className="read-list">
            {D.practiceWords.map((w, k) => (
              <button key={k}
                className={'list-card' + (k === i ? ' on' : '')}
                onClick={() => { setI(k); setRevealed(false); }}>
                <div className="lc-ti">{w.w}་</div>
                <div className="lc-r mono">{w.r}</div>
                <div className="lc-m">{w.m}</div>
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
              <div className="qs-num">{streak}</div>
              <div className="qs-label mono">streak</div>
            </div>
            <button className="btn qs-reset" onClick={resetQuiz}>↺ Reset</button>
          </div>

          <div className="quiz-prompt">
            <div className="quiz-kicker mono">read this word</div>
            <div className="quiz-ti">{quizWord.w}་</div>
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
                  <div className="qo-m">{opt.m}</div>
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
