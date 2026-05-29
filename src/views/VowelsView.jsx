import { useState } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function VowelsView() {
  const [cIdx, setCIdx] = useState(0);
  const [vIdx, setVIdx] = useState(-1);
  const c = D.consonants[cIdx];
  const v = vIdx === -1 ? null : D.vowels[vIdx];
  const out = v ? c.g + v.mark : c.g;
  const rOut = v ? c.r.replace(/a$/, v.sound) : c.r;

  return (
    <div className="view vowels">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.2</div>
          <h1>The Four Vowels</h1>
          <div className="ti-sub">དབྱངས་བཞི།</div>
        </div>
      </header>

      <p className="lead">
        Every consonant carries an inherent <em>-a</em>. A vowel mark added above or below
        replaces it. Pick a consonant, then a vowel — watch the syllable form.
      </p>

      <div className="combiner">
        <div className="combine-stage">
          <div className="stage-label">syllable</div>
          <div key={out} className="stage-glyph glyph-anim">{out}<span className="tsek">་</span></div>
          <div className="stage-roman mono">{rOut}</div>
        </div>

        <div className="picker">
          <div className="picker-section">
            <div className="picker-title">Consonant</div>
            <div className="pick-grid pick-cons">
              {D.consonants.map((cn, i) => (
                <button key={i}
                  className={'pick' + (i === cIdx ? ' on' : '')}
                  onClick={() => setCIdx(i)}>
                  <span className="pick-ti">{cn.g}</span>
                  <span className="pick-r mono">{cn.r}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="picker-section">
            <div className="picker-title">Vowel</div>
            <div className="pick-grid pick-vow">
              <button className={'pick big' + (vIdx === -1 ? ' on' : '')} onClick={() => setVIdx(-1)}>
                <span className="pick-ti pick-inherent">a</span>
                <span className="pick-r mono">inherent</span>
              </button>
              {D.vowels.map((vv, i) => (
                <button key={i} className={'pick big' + (vIdx === i ? ' on' : '')} onClick={() => setVIdx(i)}>
                  <span className="pick-ti vow-ti">◌{vv.mark}</span>
                  <span className="pick-r mono">{vv.sound}</span>
                  <span className="pick-name">{vv.nameR}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="vowel-ref">
        <h3>The four marks</h3>
        <div className="ref-grid">
          {D.vowels.map((vv) => (
            <div key={vv.mark} className="ref-card">
              <div className="ref-glyph">ཀ{vv.mark}</div>
              <div className="ref-name ti">{vv.name}</div>
              <div className="ref-namer mono">{vv.nameR} · {vv.sound}</div>
              <div className="ref-hint">{vv.hint}</div>
              <div className="ref-pos">{vv.pos === 'above' ? '↑ above' : '↓ below'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="words-strip">
        <div className="strip-title">Words formed from a consonant + a single vowel</div>
        <div className="strip-row">
          {D.vowelExamples.filter(e => e.gloss).map((e, i) => (
            <div key={i} className="word-card" onClick={() => {
              setCIdx(D.consonants.findIndex(cn => cn.g === e.c));
              setVIdx(D.vowels.findIndex(vv => vv.mark === e.v));
            }}>
              <div className="word-ti">{e.out}<span className="tsek">་</span></div>
              <div className="word-r mono">{e.r}</div>
              <div className="word-gloss">{e.gloss}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
