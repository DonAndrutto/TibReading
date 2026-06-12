import { useState } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

export default function IntroView() {
  const I = D.intro;
  const [sumOpen, setSumOpen] = useState(false);
  const [showEn, setShowEn]   = useState(true);

  const verses = I.sumchupa.verses;

  return (
    <div className="view intro">
      <header className="view-head">
        <div>
          <div className="kicker">§ 0 · introduction</div>
          <h1>The Story of the Tibetan Script</h1>
          <div className="subtitle-en">from Thonmi Sambhota to the digital age</div>
        </div>
      </header>

      <p className="lead">{I.lead}</p>

      {/* ── Genesis ── */}
      <section className="intro-section">
        <div className="intro-sec-kicker mono">{I.genesis.kicker}</div>
        <h2 className="intro-sec-title">{I.genesis.title}</h2>
        <div className="intro-sec-sub">{I.genesis.subtitle}</div>
        <div className="intro-prose">
          {I.genesis.paras.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="intro-section">
        <div className="intro-sec-kicker mono">{I.architecture.kicker}</div>
        <h2 className="intro-sec-title">{I.architecture.title}</h2>
        <div className="intro-sec-sub">{I.architecture.subtitle}</div>
        <div className="intro-prose">
          <p>{I.architecture.lead}</p>
        </div>

        <div className="intro-arch-grid">
          <div className="intro-card">
            <div className="intro-card-kicker mono">
              {I.architecture.consonants.wylie} · <span className="ti">{I.architecture.consonants.tib}</span>
            </div>
            <h3>{I.architecture.consonants.title}</h3>
            <p>{I.architecture.consonants.desc}</p>
            <div className="invented-row">
              {I.architecture.consonants.invented.map(x => (
                <div key={x.g} className="invented-pill">
                  <span className="ti">{x.g}</span>
                  <span className="mono">{x.r}</span>
                </div>
              ))}
            </div>
            <div className="invented-note mono">{I.architecture.consonants.inventedNote}</div>
          </div>

          <div className="intro-card">
            <div className="intro-card-kicker mono">
              {I.architecture.vowels.wylie} · <span className="ti">{I.architecture.vowels.tib}</span>
            </div>
            <h3>{I.architecture.vowels.title}</h3>
            <p>{I.architecture.vowels.desc}</p>
            <div className="intro-marks">
              {I.architecture.vowels.marks.map(m => (
                <div key={m.name} className="intro-mark">
                  <div className="intro-mark-ti ti">◌{m.mark}</div>
                  <div className="intro-mark-name">{m.name} <span className="mono">( {m.sound} )</span></div>
                  <div className="intro-mark-pos mono">{m.pos}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3 className="intro-sub-title">{I.architecture.spelling.title}</h3>
        <div className="intro-prose">
          <p>{I.architecture.spelling.intro}</p>
        </div>
        <div className="intro-pos-list">
          {I.architecture.spelling.positions.map(p => (
            <div key={p.id} className={'intro-pos c-' + p.id}>
              <div className="intro-pos-name">{p.name}</div>
              <div className="intro-pos-ti ti">{p.tib}</div>
              <div className="intro-pos-wylie mono">{p.wylie}</div>
              <div className="intro-pos-desc">{p.desc}</div>
            </div>
          ))}
        </div>
        <div className="intro-prose">
          <p>{I.architecture.spelling.outro}</p>
        </div>
      </section>

      {/* ── Foundational texts ── */}
      <section className="intro-section">
        <div className="intro-sec-kicker mono">{I.texts.kicker}</div>
        <h2 className="intro-sec-title">{I.texts.title}</h2>
        <div className="intro-sec-sub">{I.texts.subtitle}</div>
        <div className="intro-prose">
          <p>{I.texts.lead}</p>
        </div>

        <div className="sumtag-grid">
          <button className={'sum-card' + (sumOpen ? ' open' : '')}
            onClick={() => setSumOpen(o => !o)} aria-expanded={sumOpen}>
            <div className="intro-card-kicker mono">treatise i · {I.texts.sumchupaCard.wylie}</div>
            <div className="intro-card-ti ti">{I.texts.sumchupaCard.tib}</div>
            <h3>{I.texts.sumchupaCard.en}</h3>
            <p>{I.texts.sumchupaCard.desc}</p>
            <div className="sum-card-foot">
              <span>{sumOpen ? 'hide the root text' : 'tap to read the root text — in verse'}</span>
              <span className={'lw-chevron' + (sumOpen ? ' open' : '')}>⌄</span>
            </div>
          </button>

          <div className="intro-card">
            <div className="intro-card-kicker mono">treatise ii · {I.texts.tagjugCard.wylie}</div>
            <div className="intro-card-ti ti">{I.texts.tagjugCard.tib}</div>
            <h3>{I.texts.tagjugCard.en}</h3>
            <p>{I.texts.tagjugCard.desc}</p>
          </div>
        </div>

        {sumOpen && (
          <div className="sum-scroll">
            <div className="sum-head">
              <div className="sum-head-ti ti">{I.sumchupa.titleTib}</div>
              <div className="sum-head-en">
                {I.sumchupa.titleEn.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div className="sum-head-author mono">{I.sumchupa.author}</div>
            </div>

            <div className="sum-toolbar filter-row">
              <button className={'chip' + (showEn ? ' on' : '')} onClick={() => setShowEn(s => !s)}>
                {showEn ? 'Translation shown' : 'Tibetan only'}
              </button>
            </div>

            {verses.map((v, vi) => {
              const num = vi === 0 || vi === verses.length - 1 ? null : vi;
              return (
                <div key={vi} className="sum-verse">
                  <div className="sum-verse-label mono">
                    {num !== null && <span className="sum-verse-num">{String(num).padStart(2, '0')} · </span>}
                    {v.label}
                  </div>
                  <div className="sum-verse-ti ti">{v.tib}</div>
                  {showEn && (
                    <div className="sum-verse-en">
                      {v.en.map((line, li) => <div key={li} className="sum-line">{line}</div>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Pedagogy ── */}
      <section className="intro-section">
        <div className="intro-sec-kicker mono">{I.pedagogy.kicker}</div>
        <h2 className="intro-sec-title">{I.pedagogy.title}</h2>
        <div className="intro-sec-sub">{I.pedagogy.subtitle}</div>

        <div className="peda-grid">
          {[I.pedagogy.historical, I.pedagogy.modern].map(col => (
            <div key={col.title} className="peda-col">
              <h3>{col.title}</h3>
              <p className="peda-note">{col.note}</p>
              {col.items.map(it => (
                <div key={it.name} className="peda-item">
                  <div className="peda-name">{it.name}</div>
                  <div className="peda-desc">{it.desc}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
