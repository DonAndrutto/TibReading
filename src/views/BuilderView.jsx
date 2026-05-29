import { useState, useRef, useEffect, useMemo } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function BuilderView() {
  const W = D.builderWord;
  const N = W.parts.length;
  const [step, setStep] = useState(N);
  const [sel, setSel]   = useState(2);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const assembled = useMemo(
    () => W.parts.slice(0, step).map(p => p.add).join(''),
    [step]
  );

  useEffect(() => {
    if (!playing) { clearTimeout(timerRef.current); return; }
    if (step >= N) { setPlaying(false); return; }
    timerRef.current = setTimeout(() => {
      setSel(step);
      setStep(s => s + 1);
    }, 750);
    return () => clearTimeout(timerRef.current);
  }, [playing, step]);

  const start = () => {
    if (step >= N) { setStep(0); setSel(0); }
    setPlaying(true);
  };
  const reset = () => { setPlaying(false); setStep(0); setSel(0); };
  const showAll = () => { setPlaying(false); setStep(N); };

  const active = W.parts[sel];
  const soundedSoFar = W.parts.slice(0, step).filter(p => !p.silent);

  return (
    <div className="view builder">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.3b · anatomy</div>
          <h1>Anatomy of a Syllable</h1>
          <div className="ti-sub ti">བསྒྲུབས་</div>
        </div>
        <div className="filter-row">
          <button className="chip" onClick={reset}>↺ Reset</button>
          <button className="chip on" onClick={start}>{playing ? '❚❚ Pause' : '▶ Assemble'}</button>
          <button className="chip" onClick={showAll}>Show all</button>
        </div>
      </header>

      <p className="lead">
        Most Tibetan syllables you'll meet are simple — a root letter and a vowel.
        But the orthography allows up to seven positions in a single syllable, with most of
        them <em>silent</em>. <span className="ti">བསྒྲུབས་</span> — "to accomplish, fulfill" —
        uses every one of them.
      </p>

      <div className="build-hero">
        <div className="build-stage">
          <div className="stage-label">syllable</div>
          <div className="hero-word">
            <span className="hero-word-ti">{assembled || '·'}</span>
            <span className="hero-tsek">{step === N ? '་' : ''}</span>
          </div>
          <div className="hero-pron">
            <span className="pron-label mono">reads as</span>
            <span className="pron-word ti">{step === N ? 'དྲུབ་' : (soundedSoFar.length ? '…' : '—')}</span>
            <span className="pron-rom mono">{step === N ? W.pron : '—'}</span>
          </div>
          <div className="hero-meaning">{step === N ? `"${W.meaning}"` : 'build the word to reveal its meaning'}</div>
          <div className="build-progress">
            {Array.from({ length: N }).map((_, i) => (
              <span key={i} className={'prog-tick' + (i < step ? ' on' : '') + (i === sel ? ' sel' : '')} />
            ))}
            <span className="prog-num mono">{step} / {N}</span>
          </div>
        </div>

        <div className="build-track">
          {W.parts.map((p, i) => {
            const placed = i < step;
            const isSel  = i === sel;
            return (
              <button key={p.id}
                className={'track-cell c-' + p.color + (placed ? ' placed' : '') + (isSel ? ' sel' : '') + (p.silent ? ' silent' : '')}
                onClick={() => { setSel(i); setStep(Math.max(step, i + 1)); setPlaying(false); }}>
                <div className="track-pos mono">{String(i + 1).padStart(2, '0')}</div>
                <div className="track-glyph">{p.ghostGlyph || p.glyph}</div>
                <div className="track-label">{p.label}</div>
                <div className="track-tib ti">{p.tib}</div>
                <div className="track-sound mono">
                  {p.silent
                    ? <span className="silent-pill">silent</span>
                    : <span className="sound-pill">{p.sound}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="build-detail">
        <div className="detail-l">
          <div className="dl-kicker mono">position {sel + 1} of {N}</div>
          <div className="dl-label">{active.label}</div>
          <div className="dl-names">
            <span className="ti">{active.tib}</span>
            <span className="mono">· {active.rom}</span>
            {active.gloss && <span className="dl-gloss">{active.gloss}</span>}
          </div>
          <div key={sel} className="dl-glyph glyph-anim">{active.ghostGlyph || active.glyph}</div>
          <div className="dl-family mono">{active.family}</div>
          <div className={'dl-state ' + (active.silent ? 'is-silent' : 'is-sounded')}>
            {active.silent ? 'Silent in pronunciation' : `Contributes the sound "${active.sound}"`}
          </div>
        </div>

        <div className="detail-r">
          <p className="role">{active.role}</p>

          <div className="zones">
            <div className="zones-title mono">how the seven positions read</div>
            <ol className="zones-list">
              <li><b>Prefix</b> <span className="ti">བ</span> — silent (head of word)</li>
              <li><b>Superscript</b> <span className="ti">ས</span> — silent; raises tone</li>
              <li><b>Root</b> <span className="ti">ག</span> — base sound</li>
              <li><b>Subscript</b> <span className="ti">ྲ</span> — fuses g + r → <em>dr</em></li>
              <li><b>Vowel</b> <span className="ti">ུ</span> — replaces inherent ‑a with ‑u</li>
              <li><b>Suffix</b> <span className="ti">བ</span> — silent body, closes with -p</li>
              <li><b>Post-suffix</b> <span className="ti">ས</span> — silent tail</li>
            </ol>
            <div className="zones-arrow ti">
              <span className="zone-piece prefix">བ</span>
              <span className="zone-piece stack">སྒྲུ</span>
              <span className="zone-piece suffix">བ</span>
              <span className="zone-piece post">ས</span>
            </div>
            <div className="zones-arrow-labels mono">
              <span>prefix</span><span>stack + vowel</span><span>suffix</span><span>post</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
