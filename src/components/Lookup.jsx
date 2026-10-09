import { useEffect, useRef, useState } from 'react';
import { TIBETAN_DATA as D } from '../data.js';
import { clean, parseSyllable, slots, slotLabels } from '../syllable.js';

export function LookupPopover({ text, contextReading, onClose, go }) {
  const dialog = useRef(null);
  const word = clean(text);
  const entry = D.glossary[word];
  const parses = word.split('་').map(parseSyllable);
  useEffect(() => {
    const node = dialog.current; node.showModal();
    return () => node.close();
  }, []);
  return <dialog lang="en" ref={dialog} className="lookup-dialog" aria-labelledby="lookup-title" onCancel={onClose} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
    <div className="course-actions"><h2 id="lookup-title" lang="bo" className="ti">{word}་</h2><button className="btn" autoFocus onClick={onClose}>Close lookup</button></div>
    {entry?.r && <p>Reading: <strong>{contextReading || entry.r}</strong>{contextReading && contextReading !== entry.r ? ` (isolated: ${entry.r})` : ''}</p>}
    {entry?.glosses.length > 0 && <p>{entry.glosses.join(' · ')}</p>}
    {parses.map((p,i) => <div key={i}>{p.valid ? <><p>Wylie: <span className="mono">{p.wylie}</span></p><dl className="lookup-parse">{slots.filter(s => p.parts[s]).map(s => <div key={s}><dt>{slotLabels[s]}</dt><dd className="ti" lang="bo">{s === 'vowel' ? 'ཨ'+p.parts[s] : p.parts[s]}</dd></div>)}</dl><p>{p.explanation}</p></> : <p>{p.reason}</p>}<button className="btn" onClick={() => { onClose(); go('builder',{syllable:p.text}); }}>Open {parses.length > 1 ? p.text : 'syllable'} in Builder →</button></div>)}
  </dialog>;
}
export function LookupText({ text, go }) {
  const [lookup,setLookup] = useState(null);
  return <>{text.split(/([\u0f40-\u0fbc]+)/u).map((part,i) => /[\u0f40-\u0fbc]/u.test(part) ? <button lang="bo" className="lookup-token" key={i} onClick={() => setLookup(part)} aria-label={'Look up '+part}>{part}</button> : part)}{lookup && <LookupPopover text={lookup} onClose={() => setLookup(null)} go={go} />}</>;
}
