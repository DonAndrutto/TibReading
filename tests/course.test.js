import { describe, it, expect } from 'vitest';
import { schedule, DAY, sessionStreak, selectCards, matchesAnswer } from '../src/srs.js';
import { migrateProgress, emptyProgress, importProgress, getProgress, saveProgress } from '../src/progress.js';
import { checkRomanization } from '../bench/check-romanization.mjs';
import { TIBETAN_DATA as D } from '../src/data.js';
import { parseSyllable, compose, validateSyllable, emptyParts, structureTags } from '../src/syllable.js';
import { deck, challenges, optionsFor } from '../src/deck.js';
import { parseRoute } from '../src/routing.js';

describe('Leitner scheduling', () => {
  it('advances through every interval and retains mastery on a correct review', () => {
    let card;
    for (const [i, interval] of [1,2,4,8,16,16].entries()) {
      card = schedule(card,'knew',1000);
      expect(card.box).toBe(Math.min(i+1,5)); expect(card.due).toBe(1000+interval*DAY);
    }
    expect(card.mastered).toBe(true);
  });
  it('resets missed cards and lowers uncertain cards', () => {
    const old = {box:5,reviews:8,lapses:2};
    expect(schedule(old,'missed',0)).toMatchObject({box:1,mastered:false,due:600000,lapses:3,reviews:9});
    expect(schedule(old,'unsure',0)).toMatchObject({box:4,due:DAY,mastered:false});
    expect(() => schedule(old,'invalid')).toThrow();
  });
  it('selects due at the deadline, unseen as new and low boxes as weak', () => {
    const cards = [{id:'a'},{id:'b'},{id:'c'}];
    const items = {a:{reviews:1,due:100,box:2},b:{reviews:1,due:101,box:5}};
    expect(selectCards(cards,items,'due',100)).toEqual([cards[0]]);
    expect(selectCards(cards,items,'new',100)).toEqual([cards[2]]);
    expect(selectCards(cards,items,'weak',100)).toEqual([cards[0]]);
  });
  it('counts consecutive local calendar days and resets gaps', () => {
    const yesterday = new Date(2026,9,8,23).getTime(), today = new Date(2026,9,9,1).getTime();
    expect(sessionStreak({lastSession:yesterday,streak:3},today)).toBe(4);
    expect(sessionStreak({lastSession:today,streak:4},today+10000)).toBe(4);
    expect(sessionStreak({lastSession:yesterday-2*DAY,streak:3},today)).toBe(1);
  });
  it('accepts case/whitespace while preserving significant diacritics', () => {
    expect(matchesAnswer({r:'drup',wylie:'bsgrubs'},' BS GRUBS ')).toBe(true);
    expect(matchesAnswer({r:'bö'},'bo')).toBe(false);
  });
});
describe('progress migration and imports', () => {
  it('migrates v1 without losing mastery', () => {
    expect(migrateProgress({version:1,seen:['a'],mastered:['b'],streak:2,lastSession:100})).toMatchObject({version:2,items:{a:{box:1},b:{box:5,mastered:true}},streak:2,lastSession:100});
  });
  it('roundtrips and rejects corrupt/future data', () => {
    const p=emptyProgress(); expect(migrateProgress(JSON.parse(JSON.stringify(p)))).toEqual(p);
    expect(() => migrateProgress({...p,version:99})).toThrow();
    expect(() => migrateProgress({...p,items:{a:{box:99}}})).toThrow();
    expect(() => migrateProgress({...p,lastSession:'yesterday'})).toThrow();
  });
  it('keeps previous progress when an import fails', () => {
    saveProgress({...emptyProgress(),streak:4});
    expect(() => importProgress('{bad')).toThrow(); expect(getProgress().streak).toBe(4);
  });
});
describe('romanization', () => {
  it('validates all actual data', () => expect(checkRomanization(D)).toEqual([]));
  it('finds duplicate consonants and nested mismatches including tsheg normalization', () => {
    expect(checkRomanization({consonants:[{g:'ཀ',r:'ka'},{g:'ཁ',r:'ka'}]}).join()).toContain('Base collision');
    expect(checkRomanization({a:{g:'ཀ',r:'ka',t:'high'},nested:[{spell:'ཀ་',reads:'ga'}]})).toHaveLength(1);
    expect(checkRomanization({a:{g:'ཀ',r:'ka',t:'high'},nested:[{w:'ཀ་མ',r:'ga-ma'}]})).toHaveLength(1);
  });
  it('keeps Wylie and explicit contextual pronunciation separate', () => {
    expect(checkRomanization({a:{g:'ཆ',r:'chha',wylie:'cha'},b:{t:'བ',r:'ba',contextReading:'wa'}})).toEqual([]);
  });
});
describe('native syllable validation and roots', () => {
  it.each([['བསྒྲུབས','ག','bsgrubs'],['ཁྱི','ཁ','khyi'],['རྟ','ཏ','rta'],['དང','ད','dang'],['ངག','ང','ngag'],['དགུ','ག','dgu'],['མགོ','ག','mgo'],['འཇིགས','ཇ',"'jigs"],['རླ','ར','rla'],['དགས','ག','dgas']])('parses %s', (text,root,wylie) => {
    const result = parseSyllable(text); expect(result.valid).toBe(true); expect(result.root).toBe(root); expect(result.wylie).toBe(wylie); expect(compose(result.parts)).toBe(text);
  });
  it('rejects bad prefixes, independent legal pairs in an illegal triple, and post suffixes', () => {
    expect(validateSyllable({...emptyParts(),root:'ཀ',prefix:'ག',vowel:'ུ'}).valid).toBe(false);
    expect(validateSyllable({...emptyParts(),root:'ག',super:'ལ',sub:'ཡ'}).valid).toBe(false);
    expect(validateSyllable({...emptyParts(),root:'ཀ',suffix:'ན',post:'ས'}).valid).toBe(false);
    expect(parseSyllable('ྒ').valid).toBe(false);
    expect(parseSyllable('ཀིུ').valid).toBe(false);
  });
  it('roundtrips every generated challenge using proper subjoined Unicode', () => {
    expect(challenges.length).toBeGreaterThanOrEqual(20);
    for (const c of challenges) { expect(validateSyllable(c.parse.parts).valid).toBe(true); expect(compose(c.parse.parts)).toBe(c.t); }
    expect(compose(challenges[0].parse.parts)).toBe('བསྒྲུབས');
  });
});
describe('deck and routes', () => {
  it('deduplicates shared cards and provides four unambiguous choices', () => {
    expect(new Set(deck.map(c => c.id)).size).toBe(deck.length);
    expect(deck.find(c => c.t === 'ཆ').r).toBe('chha');
    for (const c of deck) {
      const options = optionsFor(c,'recognise',xs => xs);
      expect(options).toHaveLength(4); expect(new Set(options.map(o => o.r)).size).toBe(4);
    }
    expect(optionsFor(deck.find(c=>c.t==='ཀ'),'recognise',xs=>xs).map(c=>c.t)).toEqual(expect.arrayContaining(['ཁ','ག']));
  });
  it('parses deep links and handles invalid hashes safely', () => {
    expect(parseRoute('#/read/3').payload.index).toBe(3);
    expect(parseRoute('#/vowels/%E0%BD%B2').payload.vowel).toBe(0);
    expect(parseRoute('#/alphabet/-1').payload.letter).toBe(0);
    expect(parseRoute('#/%bad').tab).toBe('intro');
  });
});

describe('vocabulary and glossary', () => {
  it('contains at least 80 distinct tagged words and accurate tags', () => {
    expect(new Set(D.practiceWords.map(w=>w.w)).size).toBeGreaterThanOrEqual(80);
    for (const w of D.practiceWords) { expect(w.tags).toEqual(structureTags(w.w)); expect(w.tags.length).toBeGreaterThan(0); }
  });
  it('indexes existing glosses without inventing entries for unknown syllables', () => {
    expect(D.glossary['ཆུ'].glosses).toContain('water');
    expect(D.glossary['བསྒྲུབས'].glosses).toContain('to accomplish, fulfill');
    expect(D.glossary['རྐི']).toBeUndefined();
  });
});
