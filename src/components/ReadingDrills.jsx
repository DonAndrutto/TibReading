import { useMemo, useState } from 'react';
import { TIBETAN_DATA as D } from '../data.js';
import { gradeCard } from '../progress.js';
export default function ReadingDrills() {
  const [level,setLevel] = useState(0), [revealed,setRevealed] = useState({}), [hide,setHide] = useState(true), [grades,setGrades] = useState({});
  const passage = D.readingPassages[level];
  const syllables = useMemo(() => passage.kind === 'words' ? passage.words.flatMap(w => {
    const word = D.practiceWords.find(x => x.w === w);
    return w.split('་').map((t,i) => ({ t,r:word.r.split('-')[i], id:'card:'+w }));
  }) : D.proverbs.find(p => p.id === passage.proverb).lines[passage.line].syl.slice(0,passage.count).map(s => ({ ...s,r:s.contextReading || s.r,id:'card:'+s.t })), [passage]);
  const ids = [...new Set(syllables.map(s => s.id))];
  return <section className="course-panel reading-drills"><h2>Reading path</h2><label>Passage<select value={level} onChange={e => { setLevel(Number(e.target.value)); setRevealed({}); }}>{D.readingPassages.map((p,i) => <option value={i} key={p.title}>{p.title}</option>)}</select></label>
    <label className="course-toggle"><input type="checkbox" checked={hide} onChange={e => { setHide(e.target.checked); setRevealed({}); }} />Hide all romanization</label>
    <p>Tap each syllable to reveal its reading, then grade the passage.</p><div className="reading-syllables">{syllables.map((s,i) => <button key={i} className="reading-syllable" aria-expanded={!hide || !!revealed[i]} onClick={() => setRevealed(r => ({ ...r,[i]:!r[i] }))}><span className="ti" lang="bo">{s.t}{i === syllables.length-1 ? '།' : '་'}</span><span>{!hide || revealed[i] ? s.r : 'Reveal'}</span></button>)}</div>
    <div className="course-actions">{[['knew','Knew it'],['unsure','Unsure'],['missed',"Didn't know"]].map(([grade,label]) => <button className="btn" key={grade} disabled={!!grades[level]} onClick={() => { ids.forEach(id => gradeCard(id,grade)); setGrades(g => ({ ...g,[level]:label })); }}>{label}</button>)}</div><p role="status">{grades[level] ? `Saved: ${grades[level]}. These cards are scheduled for review.` : ''}</p>
  </section>;
}
