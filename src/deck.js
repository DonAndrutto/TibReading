import { TIBETAN_DATA as D } from './data.js';
import { clean, parseSyllable, structureTags } from './syllable.js';
import { shuffle } from './utils.js';
export function buildDeck() {
  const cards = new Map();
  function add(t, r, m, kind) {
    t = clean(t); const id = 'card:' + t;
    const parses = t.split('་').map(parseSyllable);
    const card = cards.get(id) || { id, t, r, m: m || '', kinds: [], tags: structureTags(t), wylie: parses.every(p => p.valid) ? parses.map(p => p.wylie).join(' ') : undefined };
    card.kinds.push(kind); if (m) card.m = m;
    cards.set(id, card);
  }
  D.consonants.forEach(c => add(c.g,c.r,c.v,'consonant'));
  D.vowels.forEach(v => add('ཨ'+v.mark,v.sound,v.nameR,'vowel'));
  [...D.subscripts,...D.superscripts].forEach(g => g.stacks.forEach(s => add(s.s,s.r,s.gloss,'stack')));
  D.practiceWords.forEach(w => add(w.w,w.r,w.m,'word'));
  [...D.letterWords,...D.vowelWords].forEach(w => add(w.g,w.r,w.m,'word'));
  D.rules.forEach(rule => rule.examples.forEach(e => add(e.spell,e.reads,e.gloss,'rule')));
  D.proverbs.forEach(p => p.lines.forEach(l => l.syl.forEach(s => add(s.t,s.r,s.g === '—' ? '' : s.g,'reading'))));
  return [...cards.values()];
}
export const deck = buildDeck();
export const challenges = deck.map(c => ({ ...c, parse: parseSyllable(c.t) })).filter(c => c.parse.valid && Object.values(c.parse.parts).filter(Boolean).length >= 2).sort((a,b) => a.t === clean(D.builderWord.full || D.builderWord.word || 'བསྒྲུབས') ? -1 : b.t === 'བསྒྲུབས' ? 1 : 0);
export function optionsFor(card, mode, randomize = shuffle) {
  const confusable = D.confusables.filter(set => [...set].includes(card.t)).join('');
  const sameFamily = deck.filter(c => c.id !== card.id && c.r !== card.r && [...confusable].includes(c.t));
  const others = randomize(deck.filter(c => c.id !== card.id && c.r !== card.r && !sameFamily.includes(c) && c.kinds.some(k => card.kinds.includes(k))));
  const seen = new Set([mode === 'produce' ? card.t : card.r]);
  const choices = [card];
  for (const c of [...randomize(sameFamily), ...others]) {
    const key = mode === 'produce' ? c.t : c.r;
    if (!seen.has(key)) { seen.add(key); choices.push(c); }
    if (choices.length === 4) break;
  }
  return randomize(choices);
}
