import { useEffect, useState } from 'react';
import { getProgress, rememberView, markSeen } from './progress.js';
import { TIBETAN_DATA as D } from './data.js';
export const tabs = ['intro', 'alphabet', 'vowels', 'stacks', 'builder', 'rules', 'trace', 'read', 'proverbs', 'practice', 'settings'];
const index = (raw, max) => /^\d+$/.test(raw || '') && Number(raw) < max ? Number(raw) : 0;
export function parseRoute(hash) {
  let parts;
  try { parts = decodeURIComponent(hash.replace(/^#\/?/, '')).split('/'); } catch { parts = []; }
  const [candidate, value, extra] = parts;
  const tab = tabs.includes(candidate) ? candidate : 'intro';
  let payload = null;
  if (['alphabet', 'trace'].includes(tab)) payload = { letter: index(value, D.consonants.length) };
  if (tab === 'vowels') payload = { vowel: D.vowels.findIndex(v => v.mark === value), letter: index(extra || value, D.consonants.length) };
  if (tab === 'read') payload = { index: index(value, D.practiceWords.length) };
  if (tab === 'builder' && value) payload = { syllable: value };
  return { tab, payload };
}
export function routeHash(tab, payload) {
  const value = payload?.syllable ?? (tab === 'vowels' && payload?.vowel >= 0 ? D.vowels[payload.vowel]?.mark : payload?.letter) ?? payload?.index;
  return '#/' + tab + (value !== undefined ? '/' + encodeURIComponent(value) : '') + (tab === 'vowels' && payload?.vowel >= 0 && payload?.letter ? '/' + payload.letter : '');
}
export function useRoute() {
  const [hash, setHash] = useState(() => location.hash || getProgress().lastView);
  useEffect(() => {
    if (!location.hash) history.replaceState(null, '', hash);
    const change = () => setHash(location.hash || '#/intro');
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => { rememberView(hash); markSeen('view:' + parseRoute(hash).tab); }, [hash]);
  return { ...parseRoute(hash), hash, go: (tab, payload) => { location.hash = routeHash(tab, payload); } };
}
