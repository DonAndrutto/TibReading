import { pathToFileURL } from 'node:url';
import { TIBETAN_DATA } from '../src/data.js';

export const normalizeTibetan = text => text.trim().replace(/[་།༎\s]+$/gu, '');
export const normalizeReading = text => text.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ');

// Wylie fields are spelling, not pronunciation. Contextual readings must be
// explicitly named contextReading; r/reads remain the canonical reading.
export function checkRomanization(data) {
  const errors = [], bases = new Map(), readings = new Map();
  for (const c of data.consonants || []) {
    const r = normalizeReading(c.r);
    if (bases.has(r) && bases.get(r) !== c.g) errors.push(`Base collision: ${bases.get(r)} / ${c.g} = ${r}`);
    bases.set(r, c.g);
  }
  function visit(value, path) {
    if (!value || typeof value !== 'object') return;
    if (!Array.isArray(value)) {
      const tib = [value.spell, value.out, value.s, value.w, value.t, value.g].find(x => typeof x === 'string' && /[\u0f40-\u0fbc]/u.test(x));
      const roman = value.reads ?? value.r;
      if (typeof tib === 'string' && /[\u0f40-\u0fbc]/u.test(tib) && typeof roman === 'string') {
        const key = normalizeTibetan(tib), r = normalizeReading(roman);
        const register = (key, r) => {
          if (readings.has(key) && readings.get(key).r !== r) errors.push(`${key}: ${readings.get(key).r} (${readings.get(key).path}) ≠ ${r} (${path})`);
          else readings.set(key, { r, path });
        };
        register(key, r);
        const syllables = key.split('་'), parts = r.split(/[- ]/u);
        if (syllables.length > 1 && syllables.length === parts.length) {
          syllables.forEach((s, i) => register(s, value.canonicalSyllables?.[i] ?? parts[i]));
        }
      }
    }
    for (const [k, v] of Object.entries(value)) visit(v, `${path}.${k}`);
  }
  visit(data, 'data');
  return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = checkRomanization(TIBETAN_DATA);
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('check:romanization — distinct bases and consistent readings');
}
