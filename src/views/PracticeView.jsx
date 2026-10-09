import { useMemo, useRef, useState } from 'react';
import { deck, challenges, optionsFor } from '../deck.js';
import { useProgress, gradeCard } from '../progress.js';
import { selectCards, matchesAnswer } from '../srs.js';
import { slots, slotLabels, parseSyllable } from '../syllable.js';
import { shuffle } from '../utils.js';

function Exercise({ card, format, onGrade }) {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [ordered, setOrdered] = useState([]);
  const submitted = useRef(false);
  const options = useMemo(() => optionsFor(card, format), [card, format]);
  const parse = useMemo(() => parseSyllable(card.t), [card]);
  const parts = useMemo(() => parse.valid ? slots.filter(s => parse.parts[s]) : [], [parse]);
  const shuffled = useMemo(() => shuffle(parts), [parts]);
  const check = correct => {
    if (submitted.current) return;
    submitted.current = true; setResult(correct); onGrade(correct);
  };
  return <section className="course-panel exercise">
    <div className="kicker">{format === 'root' ? 'Find the root letter' : format === 'order' ? 'Order the syllable parts' : format === 'produce' ? 'Pick the Tibetan spelling' : format === 'type' ? 'Type the reading or Wylie' : 'Pick the reading'}</div>
    <div className={format === 'produce' || format === 'order' ? 'exercise-roman' : 'exercise-glyph ti'} lang={format === 'produce' || format === 'order' ? 'en' : 'bo'}>{format === 'produce' ? card.r : format === 'order' ? card.wylie : card.t + '་'}</div>
    {format === 'produce' && <p>{card.m} {card.wylie && <span className="mono">· Wylie: {card.wylie}</span>}</p>}
    {['recognise','produce'].includes(format) && <div className="answer-grid">{options.map(c => <button className="btn answer-option" key={c.id} disabled={result !== null} onClick={() => check(c.id === card.id)}>{format === 'produce' ? <span className="ti" lang="bo">{c.t}</span> : c.r}</button>)}</div>}
    {format === 'type' && <form className="course-actions" onSubmit={e => { e.preventDefault(); check(matchesAnswer(card, answer)); }}><label>Reading or Wylie<input autoFocus autoComplete="off" autoCapitalize="off" spellCheck="false" value={answer} disabled={result !== null} onChange={e => setAnswer(e.target.value)} /></label><button className="btn primary" disabled={result !== null || !answer.trim()}>Check answer</button></form>}
    {format === 'order' && <>
      <p>Tap parts in writing order: prefix → superscript → root → subscript → vowel → suffix → second suffix. Empty positions are omitted.</p>
      <div className="course-actions">{shuffled.map(s => <button className="btn" key={s} disabled={ordered.includes(s) || result !== null} onClick={() => setOrdered(a => [...a,s])}><span lang="bo" className="ti">{s === 'vowel' ? 'ཨ' + parse.parts[s] : parse.parts[s]}</span> · {slotLabels[s]}</button>)}</div>
      <ol className="ordered-parts">{ordered.map(s => <li key={s}>{slotLabels[s]} <span lang="bo" className="ti">{s === 'vowel' ? 'ཨ' + parse.parts[s] : parse.parts[s]}</span></li>)}</ol>
      <div className="course-actions"><button className="btn" disabled={result !== null || !ordered.length} onClick={() => setOrdered(a => a.slice(0,-1))}>Undo last part</button><button className="btn primary" disabled={result !== null || ordered.length !== parts.length} onClick={() => check(ordered.join() === parts.join())}>Check order</button></div>
    </>}
    {format === 'root' && <><p>Choose the root from the letters in this syllable. Subjoined letters are shown in their full form below.</p><div className="answer-grid">{[...new Set(parts.filter(s => s !== 'vowel').map(s => parse.parts[s]))].map(g => <button className="btn answer-option ti" lang="bo" key={g} disabled={result !== null} onClick={() => check(g === parse.root)}>{g}</button>)}</div></>}
    <div className="answer-feedback" aria-live="polite" aria-atomic="true">{result !== null && <><strong>{result ? 'Correct.' : 'Not quite.'}</strong> <span lang="bo" className="ti">{card.t}</span> — {card.r}{card.wylie && ` · Wylie: ${card.wylie}`}<p>{card.m}</p>{['root','order'].includes(format) && <p>Root: <span lang="bo" className="ti">{parse.root}</span>. {parse.explanation}</p>}</>}</div>
  </section>;
}
export default function PracticeView() {
  const progress = useProgress();
  const [mode,setMode] = useState('new'), [format,setFormat] = useState('mixed'), [length,setLength] = useState(10), [filter,setFilter] = useState('all');
  const [session,setSession] = useState(null), [index,setIndex] = useState(0), [results,setResults] = useState([]), [answered,setAnswered] = useState(false);
  const source = ['order','root'].includes(format) ? challenges : deck;
  const filtered = source.filter(c => filter === 'all' || c.tags.includes(filter));
  const counts = Object.fromEntries(['due','new','weak'].map(m => [m,selectCards(filtered,progress.items,m).length]));
  const start = () => {
    const cards = selectCards(filtered,progress.items,mode);
    setSession((mode === 'due' ? cards : shuffle(cards)).slice(0,length)); setIndex(0); setResults([]); setAnswered(false);
  };
  const done = session && index >= session.length;
  const card = session?.[index];
  const exerciseFormat = format === 'mixed' ? ['recognise','produce','type',...(card && parseSyllable(card.t).valid && Object.values(parseSyllable(card.t).parts).filter(Boolean).length > 1 ? ['order','root'] : [])][index % (card && parseSyllable(card.t).valid && Object.values(parseSyllable(card.t).parts).filter(Boolean).length > 1 ? 5 : 3)] : format;
  return <div className="view practice"><div className="kicker">A little, every day</div><h1>Practice</h1><p className="lead">Read, recall, build. Short sessions turn familiar shapes into letters you know.</p>
    {!session && <>
      <div className="practice-stats">{[['due','Due today'],['new','New'],['weak','Review weak']].map(([id,label]) => <button className={'stat-card' + (mode === id ? ' on' : '')} key={id} aria-pressed={mode === id} onClick={() => setMode(id)}><strong>{counts[id]}</strong><span>{label}</span></button>)}</div>
      <section className="course-panel"><h2>Your next session</h2><div className="course-actions">
        <label>Session length<select aria-label="Session length" value={length} onChange={e => setLength(Number(e.target.value))}>{[5,10,20].map(n => <option key={n} value={n}>{n} cards</option>)}</select></label>
        <label>Exercise<select aria-label="Exercise" value={format} onChange={e => setFormat(e.target.value)}>{[['mixed','Mixed practice'],['recognise','Recognise'],['produce','Produce'],['type','Type in'],['order','Order parts'],['root','Root finder']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label>Structure<select aria-label="Structure" value={filter} onChange={e => setFilter(e.target.value)}>{['all','no prefix','prefix','superscript','subscript','suffix','combos'].map(t => <option key={t}>{t}</option>)}</select></label>
      </div><p>{counts[mode] ? `${Math.min(length,counts[mode])} cards ready.` : 'No cards in this queue. Try New or another structure.'}</p><button className="btn primary" disabled={!counts[mode]} onClick={start}>Start session</button></section>
      <p>{progress.streak} day streak · {deck.filter(c => progress.items[c.id]?.mastered).length} mastered</p><p className="course-note">Correct answers move through five boxes, reviewed after 1, 2, 4, 8 and 16 days. Missed cards return in 10 minutes. Weak review covers boxes 1–2.</p>
    </>}
    {card && <><div className="course-actions"><span>Card {index+1} of {session.length}</span><progress value={index} max={session.length} aria-label="Session progress" /><button className="btn" onClick={() => setIndex(session.length)}>Finish session</button></div>
      <Exercise key={index} card={card} format={exerciseFormat} onGrade={correct => { gradeCard(card.id,correct ? 'knew' : 'missed'); setResults(r => [...r,{ card,correct }]); setAnswered(true); }} />
      <button className="btn primary" disabled={!answered} onClick={() => { setIndex(i => i+1); setAnswered(false); }}>{index+1 === session.length ? 'See summary' : 'Next card'}</button></>}
    {done && <section className="course-panel" aria-live="polite"><h2>Session complete</h2><p>{results.filter(r => r.correct).length} correct of {results.length} practised. Your progress is saved.</p>{results.some(r => !r.correct) && <><h3>Keep practising</h3><ul>{results.filter(r => !r.correct).map(({card}) => <li key={card.id}><span lang="bo" className="ti">{card.t}</span> — {card.r}</li>)}</ul></>}<button className="btn primary" onClick={() => setSession(null)}>Back to practice</button></section>}
  </div>;
}
