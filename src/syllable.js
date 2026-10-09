import { TIBETAN_DATA as D } from './data.js';
export const slots = ['prefix', 'super', 'root', 'sub', 'vowel', 'suffix', 'post'];
export const slotLabels = { prefix: 'Prefix', super: 'Superscript', root: 'Root', sub: 'Subscript', vowel: 'Vowel', suffix: 'Suffix', post: 'Second suffix' };
export const emptyParts = () => Object.fromEntries(slots.map(s => [s, '']));
export const clean = text => text.trim().replace(/[་།༎\s]+$/gu, '');
export const subjoin = glyph => glyph ? String.fromCodePoint(glyph.codePointAt(0) + 0x50) : '';
export const unjoin = glyph => glyph && glyph.codePointAt(0) >= 0xf90 ? String.fromCodePoint(glyph.codePointAt(0) - 0x50) : glyph;
const wylieMap = Object.fromEntries(D.consonants.map((c, i) => [c.g, D.orthography.wylie[i]]));
const wy = g => wylieMap[g] ?? '';
export function compose(parts) {
  const p = { ...emptyParts(), ...parts };
  if (!p.root) return '';
  return p.prefix + (p.super ? p.super + subjoin(p.root) : p.root) + (p.sub ? subjoin(p.sub) : '') + p.vowel + p.suffix + p.post;
}
export function toWylie(parts) {
  const p = { ...emptyParts(), ...parts };
  const vowel = D.vowels.find(v => v.mark === p.vowel)?.sound || 'a';
  // g.y distinguishes a full-form ya root from a subjoined ya.
  const prefix = p.prefix === 'ག' && p.root === 'ཡ' ? 'g.' : wy(p.prefix);
  return prefix + wy(p.super) + wy(p.root) + wy(p.sub) + vowel + wy(p.suffix) + wy(p.post);
}
export function validateSyllable(parts) {
  const p = { ...emptyParts(), ...parts }, errors = [];
  if (!D.consonants.some(c => c.g === p.root)) errors.push('Choose one of the 30 consonants as the root.');
  if (p.super && !D.superscripts.some(g => g.mark === p.super && g.stacks.some(s => s.s === p.super + subjoin(p.root)))) errors.push('This superscript cannot sit above this root in the taught stack families.');
  if (p.sub && !D.subscripts.some(g => g.mark === subjoin(p.sub) && g.stacks.some(s => s.s === p.root + subjoin(p.sub)))) errors.push('This root does not take that subscript in the taught stack families.');
  if (p.super && p.sub && !D.orthography.tripleStacks.includes(p.super + subjoin(p.root) + subjoin(p.sub))) errors.push('These two legal pairs do not form an allowed three-letter stack together.');
  const onset = wy(p.super) + wy(p.root) + wy(p.sub);
  if (p.prefix && !D.orthography.prefixes[wy(p.prefix)]?.includes(onset)) errors.push('This prefix cannot precede this root/stack. Prefix permissions apply to the whole stack.');
  if (p.vowel && !D.vowels.some(v => v.mark === p.vowel)) errors.push('Use one of the four vowel marks.');
  if (p.suffix && !D.orthography.suffixes.includes(p.suffix)) errors.push('Only the ten suffix letters may follow the root group.');
  if (p.post && !D.orthography.postSuffixes[p.post]?.includes(p.suffix)) errors.push('Second suffix sa requires first suffix ga, nga, ba or ma.');
  if (p.prefix && !p.super && !p.sub && !p.vowel && !p.suffix) errors.push('A prefixed plain root with inherent a needs final a-chung; two plain letters instead read as root + suffix.');
  return { valid: errors.length === 0, errors, text: errors.length ? '' : compose(p) };
}
function explanation(p, text) {
  const id = p.super || p.sub ? 'root-stack' : p.vowel ? 'root-vowel' : [...text].length === 2 ? 'root-two' : null;
  const rule = D.rules.find(r => r.id === id);
  return rule?.desc || (p.prefix ? 'The allowed prefix precedes the root; the remaining letters are suffixes.' : 'The first letter is the root; the remaining letters are suffixes.');
}
export function parseSyllable(input) {
  const text = clean(input);
  if (!text || /[་།\s]/u.test(text)) return { valid: false, text, reason: 'Choose a single syllable.' };
  const groups = text.match(/[\u0f40-\u0f68][\u0f71-\u0fbc]*/gu) || [];
  if (groups.join('') !== text) return { valid: false, text, reason: 'Unsupported or malformed Tibetan characters.' };
  const candidates = [];
  for (let i = 0; i < Math.min(2, groups.length); i++) {
    if (i === 1 && [...groups[0]].length !== 1) continue;
    const core = [...groups[i]], vowel = core.filter(c => D.vowels.some(v => v.mark === c));
    const cons = core.filter(c => !vowel.includes(c));
    if (vowel.length > 1 || cons.length > 3 || groups.length - i > 3) continue;
    const tails = groups.slice(i + 1);
    if (tails.some(t => [...t].length !== 1)) continue;
    for (const hasSuper of [false, true]) {
      if (hasSuper && cons.length < 2) continue;
      if (!hasSuper && cons.length > 2) continue;
      const p = { prefix: i ? groups[0] : '', super: hasSuper ? cons[0] : '', root: unjoin(cons[hasSuper ? 1 : 0]), sub: unjoin(cons[hasSuper ? 2 : 1]) || '', vowel: vowel[0] || '', suffix: tails[0] || '', post: tails[1] || '' };
      if (validateSyllable(p).valid && compose(p) === text) candidates.push(p);
    }
  }
  const override = D.orthography.rootOverrides[text];
  const eligible = override ? candidates.filter(p => p.root === override) : candidates;
  if (eligible.length !== 1) return { valid: false, text, reason: eligible.length ? 'This spelling is ambiguous without lexical context.' : 'This form is outside the native syllable patterns taught in this Builder.', candidates };
  const parts = eligible[0];
  return { valid: true, text, parts, root: parts.root, wylie: toWylie(parts), explanation: explanation(parts, text) };
}
export function structureTags(word) {
  const tags = new Set();
  for (const s of clean(word).split('་')) {
    const p = parseSyllable(s).parts;
    if (!p) continue;
    tags.add(p.prefix ? 'prefix' : 'no prefix');
    if (p.super) tags.add('superscript'); if (p.sub) tags.add('subscript');
    if (p.suffix) tags.add('suffix'); if (p.post) tags.add('post-suffix');
    if (['prefix','super','sub','suffix','post'].filter(k => p[k]).length > 1) tags.add('combos');
  }
  return [...tags];
}
