// Five-box Leitner: intervals in days. Wrong resets to 1, unsure drops one
// box, correct advances one (a first correct answer starts in box 1).
export const DAY = 86400000;
export const INTERVALS = [1, 2, 4, 8, 16];
export function schedule(previous, grade, now = Date.now()) {
  if (!['knew', 'unsure', 'missed'].includes(grade)) throw new Error('Unknown grade');
  const oldBox = previous?.box || 1;
  const box = grade === 'missed' ? 1 : grade === 'unsure' ? Math.max(1, oldBox - 1) : Math.min(5, previous?.reviews ? oldBox + 1 : 1);
  return { seen: true, mastered: box === 5, box, due: now + (grade === 'missed' ? 10 * 60000 : grade === 'unsure' ? DAY : INTERVALS[box - 1] * DAY), reviews: (previous?.reviews || 0) + 1, lapses: (previous?.lapses || 0) + (grade === 'missed' ? 1 : 0) };
}
export const localDay = time => { const d = new Date(time); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY; };
export function sessionStreak(progress, now) {
  if (progress.lastSession === null) return 1;
  const gap = localDay(now) - localDay(progress.lastSession);
  return gap === 0 ? progress.streak : gap === 1 ? progress.streak + 1 : 1;
}
export function selectCards(deck, items, mode, now = Date.now()) {
  return deck.filter(c => {
    const p = items[c.id];
    if (mode === 'new') return !p?.reviews;
    if (mode === 'weak') return p?.reviews && p.box <= 2;
    return p?.reviews && p.due <= now;
  }).sort((a,b) => (items[a.id]?.due || 0) - (items[b.id]?.due || 0));
}
export const normalizeAnswer = text => text.normalize('NFC').toLowerCase().replace(/[\s-]+/g, '').replace(/[’‘]/g, "'");
export const matchesAnswer = (card, answer) => [card.r, card.wylie].filter(Boolean).some(x => normalizeAnswer(x) === normalizeAnswer(answer));
