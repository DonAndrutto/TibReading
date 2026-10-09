import { useState } from 'react';
import { TIBETAN_DATA as D } from '../data.js';
import { challenges } from '../deck.js';
import { slots, slotLabels, emptyParts, compose, validateSyllable, parseSyllable, toWylie, unjoin } from '../syllable.js';
import { gradeCard } from '../progress.js';
const choices = {
  prefix: ['', 'ག','ད','བ','མ','འ'], super: ['', ...D.superscripts.map(g => g.mark)], root: D.consonants.map(c => c.g),
  sub: ['', ...D.subscripts.map(g => unjoin(g.mark))], vowel: ['', ...D.vowels.map(v => v.mark)], suffix: ['', ...D.orthography.suffixes], post: ['', ...Object.keys(D.orthography.postSuffixes)],
};
export default function BuilderView({ initial }) {
  const parsed = initial?.syllable ? parseSyllable(initial.syllable) : null;
  const [parts,setParts] = useState(parsed?.parts || emptyParts());
  const [slot,setSlot] = useState('root');
  const [mode,setMode] = useState('explore');
  const [challenge,setChallenge] = useState(0);
  const [feedback,setFeedback] = useState('');
  const [graded,setGraded] = useState(false);
  const [hint,setHint] = useState(false);
  const target = challenges[challenge];
  const validation = validateSyllable(parts);
  const update = (key, value) => { if (!choices[key]?.includes(value)) return; setParts(p => ({ ...p,[key]:value })); setFeedback(''); };
  const begin = i => { setChallenge(i); setParts(emptyParts()); setFeedback(''); setGraded(false); setHint(false); };
  return <div className="view builder"><div className="kicker">Build the spelling</div><h1>Syllable Builder</h1><p className="lead">Choose a slot, then tap a letter. You can also use the labelled selectors or drag a component to its slot.</p>
    <div className="course-actions"><button className={'btn' + (mode === 'explore' ? ' primary' : '')} onClick={() => { setMode('explore'); setFeedback(''); }}>Explore</button><button className={'btn' + (mode === 'challenge' ? ' primary' : '')} onClick={() => { setMode('challenge'); begin(0); }}>Challenge</button><button className="btn" onClick={() => { setParts(emptyParts()); setFeedback(''); }}>Clear slots</button></div>
    {parsed && !parsed.valid && <p role="status">{parsed.reason} You can explore a supported syllable below.</p>}
    {mode === 'challenge' && <section className="course-panel"><div className="kicker">Challenge {challenge+1} / {challenges.length}</div><h2>Build <span className="mono">{target.wylie}</span></h2><p>{target.m} · reading: {target.r}</p><button className="btn" onClick={() => setHint(true)}>Show target</button>{hint && <p lang="bo" className="ti challenge-target">{target.t}་</p>}</section>}
    <div className="builder-preview" aria-live="polite"><div className="exercise-glyph ti" lang="bo">{validation.valid ? compose(parts) + '་' : '—'}</div><p>{validation.valid ? `Wylie: ${toWylie(parts)}` : 'Choose a valid combination to form the syllable.'}</p></div>
    <div className="builder-slots">{slots.map(s => <div className={'builder-slot' + (slot === s ? ' on' : '')} key={s} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); update(s,e.dataTransfer.getData('text/plain')); }}>
      <button className="slot-button" aria-pressed={slot === s} onClick={() => setSlot(s)}>{slotLabels[s]}<span className="ti" lang="bo">{parts[s] ? (s === 'vowel' ? 'ཨ' + parts[s] : parts[s]) : '—'}</span></button>
      <label className="sr-only" htmlFor={'slot-'+s}>{slotLabels[s]}</label><select id={'slot-'+s} value={parts[s]} onChange={e => update(s,e.target.value)}><option value="" disabled={s !== 'root'}>{s === 'root' ? 'Choose root' : 'None'}</option>{choices[s].filter(Boolean).map(g => <option key={g} value={g}>{s === 'vowel' ? 'ཨ'+g : g}</option>)}</select>
    </div>)}</div>
    <section className="course-panel"><h2>Choose {slotLabels[slot].toLowerCase()}</h2><div className="component-palette">{choices[slot].map(g => <button className="btn" key={g} draggable={!!g} onDragStart={e => e.dataTransfer.setData('text/plain',g)} onClick={() => update(slot,g)}>{g ? <span className="ti" lang="bo">{slot === 'vowel' ? 'ཨ'+g : g}</span> : 'None'}</button>)}</div></section>
    <div className="validation-message" aria-live="polite">{validation.valid ? <p>Valid native syllable structure. A valid spelling pattern does not necessarily form a word.</p> : <ul>{validation.errors.map(e => <li key={e}>{e}</li>)}</ul>}</div>
    {mode === 'challenge' && <div className="course-actions"><button className="btn primary" disabled={graded} onClick={() => { const correct = validation.valid && compose(parts) === target.t; setFeedback(correct ? 'Correct — you built the target.' : 'Not yet. Compare your slots with the Wylie spelling and try the next challenge.'); gradeCard(target.id,correct && !hint ? 'knew' : 'missed'); setGraded(true); }}>Check challenge</button><button className="btn" onClick={() => begin((challenge+1)%challenges.length)}>Next challenge</button></div>}
    <p role="status">{feedback}</p><details><summary>How the seven positions work</summary>{D.builderWord.parts.map(p => <p key={p.id}><strong>{p.label}.</strong> {p.role}</p>)}</details>
  </div>;
}
