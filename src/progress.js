import { schedule, sessionStreak } from './srs.js';
import { useSyncExternalStore } from 'react';

export const PROGRESS_KEY = 'tibreading.progress';
export const VERSION = 2;
export const emptyProgress = () => ({ version: VERSION, items: {}, streak: 0, lastSession: null, lastView: '#/intro' });
const plain = x => x && typeof x === 'object' && !Array.isArray(x);
const safeId = id => typeof id === 'string' && id.length <= 200 && !['__proto__', 'constructor', 'prototype'].includes(id);
const timestamp = x => x === null || (Number.isFinite(x) && x >= 0 && x <= 8640000000000000);

export function migrateProgress(input) {
  if (!plain(input)) throw new Error('Progress must be a JSON object.');
  let data = input;
  if (data.version === 1) {
    const items = {};
    for (const id of data.seen || []) if (safeId(id)) items[id] = { seen: true, mastered: false, box: 1, due: 0, reviews: 0, lapses: 0 };
    for (const id of data.mastered || []) if (safeId(id)) items[id] = { ...items[id], seen: true, mastered: true, box: 5, due: 0, reviews: 1, lapses: 0 };
    data = { ...emptyProgress(), ...data, items, version: VERSION };
  }
  if (data.version !== VERSION) throw new Error('Unsupported progress version.');
  if (!plain(data.items) || Object.keys(data.items).length > 20000) throw new Error('Invalid progress items.');
  const result = emptyProgress();
  for (const [id, item] of Object.entries(data.items)) {
    if (!safeId(id) || !plain(item) || typeof item.seen !== 'boolean' || typeof item.mastered !== 'boolean' || !Number.isInteger(item.box) || item.box < 1 || item.box > 5 || !timestamp(item.due) || item.due === null || !Number.isInteger(item.reviews) || item.reviews < 0 || !Number.isInteger(item.lapses) || item.lapses < 0) throw new Error(`Invalid card progress: ${id}`);
    result.items[id] = { seen: item.seen, mastered: item.mastered, box: item.box, due: item.due, reviews: item.reviews, lapses: item.lapses };
  }
  if (!Number.isInteger(data.streak) || data.streak < 0 || !timestamp(data.lastSession)) throw new Error('Invalid session history.');
  result.streak = data.streak;
  result.lastSession = data.lastSession;
  if (typeof data.lastView === 'string' && /^#\/[a-z]+(?:\/[^\s]*)?$/.test(data.lastView) && data.lastView.length < 300) result.lastView = data.lastView;
  return result;
}

let storageError = '';
function read() {
  try {
    const raw = globalThis.localStorage?.getItem(PROGRESS_KEY);
    return raw ? migrateProgress(JSON.parse(raw)) : emptyProgress();
  } catch { storageError = 'Saved progress could not be read. Export this session before closing the app.'; return emptyProgress(); }
}
let current = read();
const listeners = new Set();
export const getProgress = () => current;
export const getStorageError = () => storageError;
export const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export const useProgress = () => useSyncExternalStore(subscribe, getProgress, getProgress);
export function saveProgress(next) {
  current = migrateProgress(next);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(current)); storageError = ''; }
  catch { storageError = 'Progress is only saved for this session. Export it before closing the app.'; }
  listeners.forEach(fn => fn());
}
export function markSeen(id) {
  if (current.items[id]?.seen) return;
  saveProgress({ ...current, items: { ...current.items, [id]: { seen: true, mastered: false, box: 1, due: 0, reviews: 0, lapses: 0 } } });
}
export function rememberView(hash) { if (current.lastView !== hash) saveProgress({ ...current, lastView: hash }); }
export function importProgress(text) {
  if (text.length > 5000000) throw new Error('Progress file is too large.');
  const next = migrateProgress(JSON.parse(text));
  saveProgress(next);
}
export const resetProgress = () => saveProgress(emptyProgress());
export const exportProgress = () => JSON.stringify(current, null, 2);
if (typeof window !== 'undefined') window.addEventListener('storage', e => {
  if (e.key === PROGRESS_KEY) { current = read(); listeners.forEach(fn => fn()); }
});

// The store is the only write path, so all exercises share the same schedule.
export function gradeCard(id, grade, now = Date.now()) {
  saveProgress({ ...current, items: { ...current.items, [id]: schedule(current.items[id], grade, now) }, streak: sessionStreak(current, now), lastSession: now });
}
