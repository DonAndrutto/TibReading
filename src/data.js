// Tibetan learning data — sourced from "Tibetan Grammar Vol 1"

export const TIBETAN_DATA = {
  consonants: [
    { g: "ཀ", r: "ka",  t: "high",      v: "",                      n: 1  },
    { g: "ཁ", r: "kha", t: "high asp.", v: "mouth",                 n: 2  },
    { g: "ག", r: "ga",  t: "low",       v: "",                      n: 3  },
    { g: "ང", r: "nga", t: "low",       v: "I",                     n: 4  },
    { g: "ཅ", r: "cha", t: "high",      v: "",                      n: 5  },
    { g: "ཆ", r: "cha", t: "high asp.", v: "",                      n: 6  },
    { g: "ཇ", r: "ja",  t: "low",       v: "tea",                   n: 7  },
    { g: "ཉ", r: "nya", t: "low",       v: "fish",                  n: 8  },
    { g: "ཏ", r: "ta",  t: "high",      v: "",                      n: 9  },
    { g: "ཐ", r: "tha", t: "high asp.", v: "",                      n: 10 },
    { g: "ད", r: "da",  t: "low",       v: "",                      n: 11 },
    { g: "ན", r: "na",  t: "low",       v: "if / to be sick",       n: 12 },
    { g: "པ", r: "pa",  t: "high",      v: "",                      n: 13 },
    { g: "ཕ", r: "pha", t: "high asp.", v: "",                      n: 14 },
    { g: "བ", r: "ba",  t: "low",       v: "",                      n: 15 },
    { g: "མ", r: "ma",  t: "low",       v: "",                      n: 16 },
    { g: "ཙ", r: "tsa", t: "high",      v: "",                      n: 17 },
    { g: "ཚ", r: "tsha",t: "high asp.", v: "salt",                  n: 18 },
    { g: "ཛ", r: "dza", t: "low",       v: "",                      n: 19 },
    { g: "ཝ", r: "wa",  t: "low",       v: "",                      n: 20 },
    { g: "ཞ", r: "sha", t: "low",       v: "",                      n: 21 },
    { g: "ཟ", r: "sa",  t: "low",       v: "to eat",                n: 22 },
    { g: "འ", r: "'a",  t: "low",       v: "",                      n: 23 },
    { g: "ཡ", r: "ya",  t: "low",       v: "",                      n: 24 },
    { g: "ར", r: "ra",  t: "low",       v: "goat",                  n: 25 },
    { g: "ལ", r: "la",  t: "low",       v: "mountain pass; to/in",  n: 26 },
    { g: "ཤ", r: "sha", t: "high",      v: "meat",                  n: 27 },
    { g: "ས", r: "sa",  t: "high",      v: "",                      n: 28 },
    { g: "ཧ", r: "ha",  t: "high",      v: "",                      n: 29 },
    { g: "ཨ", r: "a",   t: "high",      v: "",                      n: 30 }
  ],

  vowels: [
    { mark: "ི", name: "གི་གུ་",    nameR: "gigu",     pos: "above", sound: "i", hint: "small hook drawn on top of the consonant" },
    { mark: "ུ", name: "ཞབས་ཀྱུ་", nameR: "shabkyu",  pos: "below", sound: "u", hint: "tail tucked under the consonant" },
    { mark: "ེ", name: "འགྲེང་བུ་", nameR: "drengbu", pos: "above", sound: "e", hint: "horizontal stroke above" },
    { mark: "ོ", name: "ན་རོ་",     nameR: "naro",    pos: "above", sound: "o", hint: "small flame on top" }
  ],

  vowelExamples: [
    { c: "ཀ", v: "ི", out: "ཀི", r: "ki" },
    { c: "ཀ", v: "ུ", out: "ཀུ", r: "ku" },
    { c: "ཀ", v: "ེ", out: "ཀེ", r: "ke" },
    { c: "ཀ", v: "ོ", out: "ཀོ", r: "ko" },
    { c: "མ", v: "ི", out: "མི", r: "mi",  gloss: "man / human" },
    { c: "ར", v: "ི", out: "རི", r: "ri",  gloss: "mountain" },
    { c: "ཆ", v: "ུ", out: "ཆུ", r: "chu", gloss: "water" },
    { c: "བ", v: "ུ", out: "བུ", r: "bu",  gloss: "son / boy" },
    { c: "མ", v: "ེ", out: "མེ", r: "me",  gloss: "fire" },
    { c: "ལ", v: "ོ", out: "ལོ", r: "lo",  gloss: "year / age" }
  ],

  // One consonant carrying one vowel mark — no subscript, superscript or affix —
  // that is a complete word on its own.
  vowelWords: [
    { g: "ཀོ", r: "ko",   m: "leather" },
    { g: "ཁེ", r: "khe",  m: "profit, advantage" },
    { g: "ཁོ", r: "kho",  m: "he, him" },
    { g: "ངོ", r: "ngo",  m: "face" },
    { g: "ཆུ", r: "chu",  m: "water" },
    { g: "ཇོ", r: "jo",   m: "lord, master" },
    { g: "ཉི", r: "nyi",  m: "sun" },
    { g: "ཐོ", r: "tho",  m: "list, register" },
    { g: "དེ", r: "de",   m: "that" },
    { g: "དུ", r: "du",   m: "smoke" },
    { g: "ནུ", r: "nu",   m: "breast" },
    { g: "ཕོ", r: "pho",  m: "male" },
    { g: "བུ", r: "bu",   m: "son, boy" },
    { g: "མི", r: "mi",   m: "man, person, human" },
    { g: "མུ", r: "mu",   m: "boundary, edge" },
    { g: "མེ", r: "me",   m: "fire" },
    { g: "མོ", r: "mo",   m: "female, divination" },
    { g: "ཚེ", r: "tshe", m: "life, lifespan" },
    { g: "ཞི", r: "zhi",  m: "peace" },
    { g: "ཟོ", r: "zo",   m: "eat (imperative)" },
    { g: "རི", r: "ri",   m: "mountain" },
    { g: "རུ", r: "ru",   m: "horn, division" },
    { g: "རེ", r: "re",   m: "each, to hope" },
    { g: "ལི", r: "li",   m: "bronze, bell-metal" },
    { g: "ལོ", r: "lo",   m: "year" },
    { g: "ཤི", r: "shi",  m: "to die" },
    { g: "སུ", r: "su",   m: "who" },
    { g: "སོ", r: "so",   m: "tooth" }
  ],

  // Consonants that form a meaningful word on their own — a bare root letter
  // with its inherent -a, no vowel mark, no sub/superscripts, no affixes.
  letterWords: [
    { g: "ཁ", r: "kha",  m: "mouth, surface, snow" },
    { g: "ང", r: "nga",  m: "I, me" },
    { g: "ཆ", r: "cha",  m: "part, pair, fraction" },
    { g: "ཇ", r: "ja",   m: "tea" },
    { g: "ཉ", r: "nya",  m: "fish" },
    { g: "ཐ", r: "tha",  m: "end, edge" },
    { g: "ད", r: "da",   m: "now" },
    { g: "ན", r: "na",   m: "illness, to be sick, if" },
    { g: "ཕ", r: "pha",  m: "father, beyond" },
    { g: "བ", r: "ba",   m: "cow" },
    { g: "མ", r: "ma",   m: "mother, negative particle (not)" },
    { g: "ཚ", r: "tsha", m: "hot, heat, salt" },
    { g: "ཝ", r: "wa",   m: "fox" },
    { g: "ཟ", r: "za",   m: "to eat" },
    { g: "ཡ", r: "ya",   m: "up, upper" },
    { g: "ར", r: "ra",   m: "goat, enclosure" },
    { g: "ལ", r: "la",   m: "mountain pass, to/at (locative particle)" },
    { g: "ཤ", r: "sha",  m: "meat, flesh" },
    { g: "ས", r: "sa",   m: "earth, ground, soil" }
  ],

  subscripts: [
    {
      name: "yatak", mark: "ྱ", glyph: "ྱ",
      desc: "Subjoined ya — added to seven consonants. Most stacks read with a -y- glide; the labial set palatalizes to ch/chh/j.",
      stacks: [
        { s: "ཀྱ", r: "kya"  },
        { s: "ཁྱ", r: "khya" },
        { s: "གྱ", r: "gya"  },
        { s: "པྱ", r: "cha"  },
        { s: "ཕྱ", r: "chha" },
        { s: "བྱ", r: "ja"   },
        { s: "མྱ", r: "nya"  }
      ]
    },
    {
      name: "ratak", mark: "ྲ", glyph: "ྲ",
      desc: "Subjoined ra — collapses many consonants into a single retroflex tr / thr / dr family.",
      stacks: [
        { s: "ཀྲ", r: "tra"  },
        { s: "ཁྲ", r: "thra" },
        { s: "གྲ", r: "dra"  },
        { s: "ཏྲ", r: "tra"  },
        { s: "ཐྲ", r: "thra" },
        { s: "དྲ", r: "dra"  },
        { s: "པྲ", r: "tra"  },
        { s: "ཕྲ", r: "thra" },
        { s: "བྲ", r: "dra"  },
        { s: "མྲ", r: "ma (high)" },
        { s: "སྲ", r: "sa"   },
        { s: "ཧྲ", r: "hra"  }
      ]
    },
    {
      name: "latak", mark: "ླ", glyph: "ླ",
      desc: "Subjoined la — joins only six. The host consonant goes silent and the la is heard with raised tone (except ཟླ, read as 'da').",
      stacks: [
        { s: "ཀླ", r: "la" },
        { s: "གླ", r: "la" },
        { s: "བླ", r: "la" },
        { s: "ཟླ", r: "da" },
        { s: "རླ", r: "la" },
        { s: "སླ", r: "la" }
      ]
    },
    {
      name: "wasur", mark: "ྭ", glyph: "ྭ",
      desc: "Subjoined wa — silent in modern speech, kept in spelling.",
      stacks: [
        { s: "ཀྭ", r: "ka" },
        { s: "ཁྭ", r: "kha" },
        { s: "གྭ", r: "ga" }
      ]
    }
  ],

  superscripts: [
    {
      name: "rago", mark: "ར", glyph: "ར",
      desc: "Superscript ra — sits above twelve consonants. Raises the tone of low-tone hosts; high/aspirated hosts keep their sound.",
      stacks: [
        { s: "རྐ", r: "ka" },
        { s: "རྒ", r: "ga" },
        { s: "རྔ", r: "nga (high)", gloss: "drum" },
        { s: "རྗ", r: "ja" },
        { s: "རྙ", r: "nya (high)" },
        { s: "རྟ", r: "ta", gloss: "horse" },
        { s: "རྡ", r: "da" },
        { s: "རྣ", r: "na (high)" },
        { s: "རྦ", r: "ba" },
        { s: "རྨ", r: "ma (high)" },
        { s: "རྩ", r: "tsa", gloss: "grass" },
        { s: "རྫ", r: "dza" }
      ]
    },
    {
      name: "lago", mark: "ལ", glyph: "ལ",
      desc: "Superscript la — ten stacks. Special: ལྷ keeps both letters audible → 'lha' (god).",
      stacks: [
        { s: "ལྐ", r: "ka" },
        { s: "ལྒ", r: "ga" },
        { s: "ལྔ", r: "nga (high)", gloss: "five" },
        { s: "ལྕ", r: "cha" },
        { s: "ལྗ", r: "ja" },
        { s: "ལྟ", r: "ta", gloss: "to look" },
        { s: "ལྡ", r: "da" },
        { s: "ལྤ", r: "pa" },
        { s: "ལྦ", r: "ba" },
        { s: "ལྷ", r: "lha", gloss: "god" }
      ]
    },
    {
      name: "sago", mark: "ས", glyph: "ས",
      desc: "Superscript sa — eleven stacks. Raises the tone of low-tone hosts.",
      stacks: [
        { s: "སྐ", r: "ka", gloss: "body (h.)" },
        { s: "སྒ", r: "ga", gloss: "door" },
        { s: "སྔ", r: "nga (high)" },
        { s: "སྙ", r: "nya (high)" },
        { s: "སྟ", r: "ta" },
        { s: "སྡ", r: "da" },
        { s: "སྣ", r: "na (high)" },
        { s: "སྤ", r: "pa", gloss: "to move" },
        { s: "སྦ", r: "ba" },
        { s: "སྨ", r: "ma (high)" },
        { s: "སྩ", r: "tsa" }
      ]
    }
  ],

  practiceWords: [
    { w: "ཆུ",     r: "chu",     m: "water" },
    { w: "མེ",     r: "me",      m: "fire" },
    { w: "རི",     r: "ri",      m: "mountain" },
    { w: "ལོ",     r: "lo",      m: "year, age" },
    { w: "བུ",     r: "bu",      m: "son, boy" },
    { w: "མི",     r: "mi",      m: "man, human" },
    { w: "ཉི་མ",   r: "nyi-ma",  m: "sun, day" },
    { w: "ཟླ་བ",   r: "da-wa",   m: "moon, month" },
    { w: "ལྷ",     r: "lha",     m: "god" },
    { w: "རྟ",     r: "ta",      m: "horse" },
    { w: "བླ་མ",   r: "la-ma",   m: "spiritual teacher" },
    { w: "བོད",    r: "bö",      m: "Tibet" },
    { w: "ཁྱི",    r: "khyi",    m: "dog" },
    { w: "སྒོ",    r: "go",      m: "door" },
    { w: "ལྔ",     r: "nga",     m: "five (high tone)" },
    { w: "དགུ",    r: "gu",      m: "nine (prefix ད silent)" },
    { w: "མགོ",    r: "go",      m: "head (prefix མ silent)" },
    { w: "བཞི",    r: "shi",     m: "four (prefix བ silent)" }
  ],

  rules: [
    {
      id: "suf-basic",
      title: "Suffixes ག ང བ མ ར",
      tag: "suffix",
      desc: "These five suffixes follow the root letter directly (no dot between). Root and suffix are pronounced together as one syllable.",
      examples: [
        { spell: "ཡག་པོ་",  reads: "yag-po",   gloss: "good",        suf: "ག" },
        { spell: "མང་པོ་",  reads: "mang-po",  gloss: "many",        suf: "ང" },
        { spell: "ཐོབ་",    reads: "thob",     gloss: "to win",      suf: "བ" },
        { spell: "ཕམ་",     reads: "pham",     gloss: "to lose",     suf: "མ" },
        { spell: "ཚར་",     reads: "tsar",     gloss: "to finish",   suf: "ར" }
      ]
    },
    {
      id: "suf-ds-e",
      title: "Suffixes ད · ས → soft -e (silent)",
      tag: "vowel-shift",
      desc: "After a consonant, suffixes ད and ས add a soft -e sound to the vowel but are themselves not heard.",
      examples: [
        { spell: "ཆད་",  reads: "che",  gloss: "" },
        { spell: "ཆས་",  reads: "che",  gloss: "" },
        { spell: "ནས་",  reads: "ne",   gloss: "from" },
        { spell: "ལས་",  reads: "le",   gloss: "" },
        { spell: "དད་",  reads: "de",   gloss: "" },
        { spell: "པད་མ་", reads: "pe-ma", gloss: "lotus" }
      ]
    },
    {
      id: "suf-nl-e",
      title: "Suffixes ན · ལ → -e (audible)",
      tag: "vowel-shift",
      desc: "Like ད/ས they add an -e sound, but ན and ལ themselves are heard.",
      examples: [
        { spell: "ཆན་",  reads: "chen",  gloss: "" },
        { spell: "ལན་",  reads: "len",   gloss: "answer" },
        { spell: "གལ་",  reads: "gel",   gloss: "" },
        { spell: "ཉན་",  reads: "nyen",  gloss: "to listen" }
      ]
    },
    {
      id: "umlaut-u-ds",
      title: "ུ + ད/ས → umlaut ü (suffix silent)",
      tag: "umlaut",
      desc: "When the vowel ུ (shabkyu) is followed by suffix ད or ས, round your lips: the sound becomes ü. The suffix itself is not audible.",
      examples: [
        { spell: "གུས་", reads: "gü",  gloss: "" },
        { spell: "དུས་", reads: "dü",  gloss: "" },
        { spell: "བུས་", reads: "bü",  gloss: "" },
        { spell: "ལུས་", reads: "lü",  gloss: "body" }
      ]
    },
    {
      id: "umlaut-o-ds",
      title: "ོ + ད/ས → umlaut ö (suffix silent)",
      tag: "umlaut",
      desc: "The vowel ོ (naro) before ད/ས becomes the rounded ö. Again, the suffix is silent.",
      examples: [
        { spell: "གོས་", reads: "gö",   gloss: "" },
        { spell: "ཆོས་", reads: "chö",  gloss: "Dharma" },
        { spell: "ཐོས་", reads: "thö",  gloss: "" },
        { spell: "ཡོད་", reads: "yö",   gloss: "to have" }
      ]
    },
    {
      id: "umlaut-u-nl",
      title: "ུ + ན/ལ → umlaut ü (suffix heard)",
      tag: "umlaut",
      desc: "ུ before ན or ལ also becomes ü — but the suffix is pronounced.",
      examples: [
        { spell: "ཀུན་",  reads: "kün",  gloss: "all" },
        { spell: "ཕུན་",  reads: "phün", gloss: "" },
        { spell: "ཁུལ་",  reads: "khül", gloss: "" },
        { spell: "ཚུལ་",  reads: "tsül", gloss: "" }
      ]
    },
    {
      id: "umlaut-o-nl",
      title: "ོ + ན/ལ → umlaut ö (suffix heard)",
      tag: "umlaut",
      desc: "ོ before ན or ལ rounds to ö, and the suffix is heard.",
      examples: [
        { spell: "དོན་",  reads: "dön",  gloss: "meaning" },
        { spell: "ཡོན་",  reads: "yön",  gloss: "" },
        { spell: "ཁོལ་",  reads: "khöl", gloss: "" },
        { spell: "མོལ་",  reads: "möl",  gloss: "" }
      ]
    },
    {
      id: "ie-ds-noop",
      title: "ི or ེ + ད/ས → no change",
      tag: "vowel-shift",
      desc: "When the vowel is already ི (gigu) or ེ (drengbu), suffix ད/ས has no effect on the sound.",
      examples: [
        { spell: "ཡིད་",  reads: "yi",  gloss: "mind" },
        { spell: "ཉིད་",  reads: "nyi", gloss: "" },
        { spell: "ངེས་",  reads: "nge", gloss: "" },
        { spell: "ཚེས་",  reads: "tshe", gloss: "date" }
      ]
    },
    {
      id: "ai-suffix",
      title: "consonant + འི་ → adds -e, drawn-out",
      tag: "suffix",
      desc: "The particle འི་ adds the drengbu (-e) sound and lengthens it slightly. འི་ itself is silent.",
      examples: [
        { spell: "ངའི་",  reads: "ngey",  gloss: "my" },
        { spell: "མའི་",  reads: "may",   gloss: "of mother" },
        { spell: "སའི་",  reads: "say",   gloss: "of the earth" }
      ]
    },
    {
      id: "prefix-silent",
      title: "Prefixes ག ད བ མ འ — silent",
      tag: "prefix",
      desc: "The five prefixes stand at the head of a syllable but are not heard. They are still written.",
      examples: [
        { spell: "དགའ་",   reads: "ga",     gloss: "to be happy" },
        { spell: "འཁོར་",  reads: "khor",   gloss: "to attract" },
        { spell: "བཞི་",   reads: "shi",    gloss: "four" },
        { spell: "མགོ་",   reads: "go",     gloss: "head" },
        { spell: "དགུ་",   reads: "gu",     gloss: "nine" }
      ]
    },
    {
      id: "db-wa",
      title: "དབ → wa",
      tag: "special",
      desc: "When ད is prefixed to root བ, the cluster is read as 'wa'.",
      examples: [
        { spell: "དབང་",     reads: "wang",  gloss: "power" },
        { spell: "དབུ་",     reads: "u",     gloss: "head (hon.)" },
        { spell: "དབུས་",    reads: "ü",     gloss: "centre" },
        { spell: "དབྱར་ཀ་", reads: "yar-ka", gloss: "summer" }
      ]
    },
    {
      id: "ba-wa",
      title: "བ between two dots → wa",
      tag: "special",
      desc: "When the letter བ sits as the second syllable between two tsek dots, it is read as ཝ (wa).",
      examples: [
        { spell: "རྩ་བ་",   reads: "tsa-wa",   gloss: "root" },
        { spell: "ཞི་བ་",   reads: "shi-wa",   gloss: "peace" },
        { spell: "ཤ་བ་",    reads: "sha-wa",   gloss: "deer" },
        { spell: "ལྟ་བ་",   reads: "ta-wa",    gloss: "view" }
      ]
    },
    {
      id: "post-silent",
      title: "Post-suffix ས — silent",
      tag: "post-suffix",
      desc: "ས as a post-suffix (the very last letter) is silent. ད as post-suffix is no longer written.",
      examples: [
        { spell: "བསྒྲུབས་", reads: "drup",  gloss: "to accomplish" },
        { spell: "འཇིགས་",   reads: "jig",   gloss: "fear" },
        { spell: "སེམས་",    reads: "sem",   gloss: "mind" },
        { spell: "ཐབས་",     reads: "thab",  gloss: "method" }
      ]
    },
    {
      id: "four-letter",
      title: "Four letters → read the middle two",
      tag: "spelling",
      desc: "When four letters sit between two dots, only the second and third are heard (with their stack and vowel). First letter is the silent prefix, last is the silent post-suffix.",
      examples: [
        { spell: "བསམས་",   reads: "sam",   gloss: "thought" },
        { spell: "གསུངས་",  reads: "sung",  gloss: "to say (hon.)" },
        { spell: "མགྱོགས་པོ་", reads: "gyog-po", gloss: "fast" },
        { spell: "འགྲིགས་", reads: "drig",  gloss: "to be correct" }
      ]
    },
    {
      id: "raise-nga",
      title: "ད or མ + ང → ང raised in tone",
      tag: "tone",
      desc: "When ད or མ is the prefix of root ང, the ང takes high tone.",
      examples: [
        { spell: "དངུལ་",  reads: "ngül",  gloss: "money, silver" },
        { spell: "དངོས་",  reads: "ngö",   gloss: "real" },
        { spell: "མངའ་",   reads: "nga",   gloss: "to possess" },
        { spell: "མངོན་",  reads: "ngön",  gloss: "to be visible" }
      ]
    },
    {
      id: "raise-na",
      title: "ག or མ + ན → ན raised in tone",
      tag: "tone",
      desc: "ག or མ as prefix of root ན raises the tone of ན.",
      examples: [
        { spell: "མནའ་མ་",  reads: "na-ma",   gloss: "daughter-in-law" },
        { spell: "གནའ་བོ་", reads: "na-bo",   gloss: "ancient" },
        { spell: "གནང་",    reads: "nang",    gloss: "to give (hon.)" },
        { spell: "གནས་",    reads: "ne",      gloss: "place; to stay" }
      ]
    }
  ],

  proverbs: [
    {
      id: "ocean-of-drops",
      title: "An ocean of droplets",
      kind: "Proverb",
      lines: [
        {
          syl: [
            { t: "ཆུ",       r: "chu",   g: "water" },
            { t: "ཐིག",     r: "thig",  g: "drop" },
            { t: "བསགས",    r: "sag",   g: "accumulate", note: "prefix བ silent; post-suffix ས silent" },
            { t: "པའི",     r: "pay",   g: "of (gen.)" },
            { t: "རྒྱ",     r: "gya",   g: "vast" },
            { t: "མཚོ",     r: "tso",   g: "ocean", note: "prefix མ silent" }
          ],
          gloss: "An ocean built up from droplets of water.",
          english: "A journey of a thousand miles begins with a single step."
        }
      ]
    },
    {
      id: "mouth-said",
      title: "Words & deeds",
      kind: "Saying",
      lines: [
        {
          syl: [
            { t: "ཁ",     r: "kha",   g: "mouth" },
            { t: "བཤད",   r: "she",   g: "said",   note: "prefix བ silent · suffix ད softens to -e" },
            { t: "ཆུ",    r: "chu",   g: "water" },
            { t: "ཡི",    r: "yi",    g: "of (gen.)" },
            { t: "ལྦུ",   r: "bu",    g: "—",       note: "superscript ལ silent" },
            { t: "བ",     r: "wa",    g: "bubble",  note: "བ between two dots → 'wa'" }
          ],
          gloss: "What the mouth says is a bubble of water."
        },
        {
          syl: [
            { t: "ལག",    r: "lag",   g: "hand" },
            { t: "ལེན",   r: "len",   g: "practice", note: "suffix ན brings -e and is heard" },
            { t: "གསེར",  r: "ser",   g: "gold",   note: "prefix ག silent" },
            { t: "གྱི",   r: "gyi",   g: "of (gen.)" },
            { t: "ཐིག",   r: "thig",  g: "drop" },
            { t: "པ",     r: "pa",    g: "(particle)" }
          ],
          gloss: "Practice is a droplet of gold."
        }
      ]
    },
    {
      id: "hope-prepare",
      title: "Hope from the best, prepare for the worst",
      kind: "Saying",
      lines: [
        {
          syl: [
            { t: "རེ",    r: "re",    g: "hope" },
            { t: "བ",     r: "wa",    g: "(nominalizer)",  note: "བ between dots → 'wa'" },
            { t: "བཟང",   r: "zang",  g: "good",  note: "prefix བ silent" },
            { t: "ས",     r: "sa",    g: "side, place" },
            { t: "ནས",    r: "ne",    g: "from",  note: "suffix ས softens to -e, silent" },
            { t: "བྱེད",  r: "jé",    g: "do",    note: "suffix ད softens to -e, silent" }
          ],
          gloss: "Place your hope on the best side."
        },
        {
          syl: [
            { t: "གྲ",    r: "dra",   g: "preparation" },
            { t: "སྒྲིགས", r: "drig",  g: "arrange",  note: "post-suffix ས silent" },
            { t: "སྡུག",  r: "dug",   g: "bad" },
            { t: "ས",     r: "sa",    g: "side" },
            { t: "ནས",    r: "ne",    g: "from" },
            { t: "བྱེད",  r: "jé",    g: "do" }
          ],
          gloss: "Prepare from the worst side."
        }
      ]
    },
    {
      id: "look-at-now",
      title: "Look to the present",
      kind: "Proverb",
      lines: [
        {
          syl: [
            { t: "སྔོན",  r: "ngön",  g: "in the past" },
            { t: "མ",     r: "ma",    g: "(particle)" },
            { t: "གང",    r: "gang",  g: "whatever" },
            { t: "བྱས",   r: "jé",    g: "did",  note: "suffix ས softens to -e, silent" },
            { t: "ད",     r: "da",    g: "now" },
            { t: "ལྟའི",  r: "tay",   g: "of (gen.)", note: "འི adds -e, lengthens" },
            { t: "ལུས",   r: "lü",    g: "body",  note: "ུ + ས → umlaut ü, ས silent" },
            { t: "ལ",     r: "la",    g: "to" },
            { t: "ལྟོས",  r: "tö",    g: "look",  note: "ོ + ས → umlaut ö" }
          ],
          gloss: "For what you did in the past, look at your present body."
        },
        {
          syl: [
            { t: "ཕྱི",   r: "chi",   g: "later" },
            { t: "མ",     r: "ma",    g: "(particle)" },
            { t: "གར",    r: "gar",   g: "where" },
            { t: "འགྲོ",  r: "dro",   g: "go",   note: "prefix འ silent" },
            { t: "ད",     r: "da",    g: "now" },
            { t: "ལྟའི",  r: "tay",   g: "of (gen.)" },
            { t: "ལས",    r: "le",    g: "action",  note: "suffix ས → -e, silent" },
            { t: "ལ",     r: "la",    g: "to" },
            { t: "ལྟོས",  r: "tö",    g: "look" }
          ],
          gloss: "For where you will go, look at your present action."
        }
      ]
    },
    {
      id: "refuge",
      title: "Going for Refuge",
      kind: "Prayer",
      lines: [
        {
          syl: [
            { t: "སངས",   r: "sang",  g: "purified",   note: "post-suffix ས silent" },
            { t: "རྒྱས",  r: "gyé",   g: "expanded",   note: "suffix ས softens to -e, silent" },
            { t: "ཆོས",   r: "chö",   g: "Dharma",     note: "ོ + ས → umlaut ö" },
            { t: "དང",    r: "dang",  g: "and" },
            { t: "མཆོག",  r: "chog",  g: "supreme",    note: "prefix མ silent" },
            { t: "གི",    r: "gi",    g: "of (gen.)" },
            { t: "ཚོགས",  r: "tsog",  g: "assembly",   note: "post-suffix ས silent" },
            { t: "རྣམས",  r: "nam",   g: "(plural)" },
            { t: "ལ",     r: "la",    g: "to" }
          ],
          gloss: "To the Buddha, Dharma, and the supreme assembly,"
        },
        {
          syl: [
            { t: "བྱང",   r: "jang",  g: "purified" },
            { t: "ཆུབ",   r: "chub",  g: "perfected" },
            { t: "བར",    r: "bar",   g: "until" },
            { t: "དུ",    r: "du",    g: "to" },
            { t: "བདག",   r: "dag",   g: "I",    note: "prefix བ silent" },
            { t: "ནི",    r: "ni",    g: "as for" },
            { t: "སྐྱབས", r: "kyab",  g: "refuge",  note: "post-suffix ས silent" },
            { t: "སུ",    r: "su",    g: "in" },
            { t: "མཆི",   r: "chi",   g: "go (lit.)",  note: "prefix མ silent" }
          ],
          gloss: "Until awakening I go for refuge."
        }
      ]
    }
  ],

  // History & origins of the script, plus the Sum cu pa root text in verse —
  // shown on the Intro view.
  intro: {
    lead: "Before the letters, the story. How a 7th-century minister built an alphabet for Tibet, the architecture he gave it, the two treatises that fixed its grammar — and how Tibetans have learned to read it ever since.",

    genesis: {
      kicker: "7th century · the empire of Songtsen Gampo",
      title: "The Genesis of the Tibetan Script",
      subtitle: "Thonmi Sambhota and the 7th Century",
      paras: [
        "The development of the Tibetan writing system is historically pinpointed to the 7th century during the reign of King Songtsen Gampo, the founder of the Tibetan Empire. Recognizing the administrative and cultural limitations of an oral society — particularly for diplomacy, taxation, and the translation of newly arriving Buddhist texts — the king sought a formal written language.",
        "According to traditional historiography, Songtsen Gampo dispatched a group of young scholars to India to study linguistics and script. Among them, only Thonmi Sambhota survived the perilous journey across the Himalayas and the intense Indian heat. Studying under Indian masters like Devavidyasimha (often referred to in Tibetan as Lipi-kara, the script-maker), Thonmi Sambhota mastered Sanskrit phonology and various Indic scripts.",
        "Upon returning to Tibet, he did not simply copy an Indian alphabet; he engineered a completely new writing system tailored to the unique phonetic demands of the Tibetan language, primarily basing it on the Late Brahmi or Gupta scripts of North India."
      ]
    },

    architecture: {
      kicker: "an engineered abugida",
      title: "The Architecture of the Script",
      subtitle: "Consonants and Vowels",
      lead: "The genius of the Tibetan script lies in its highly structured, syllabic framework. Thonmi Sambhota designed an abugida — a segmental writing system where consonant-vowel sequences are written as units.",
      consonants: {
        title: "The 30 Consonants",
        tib: "གསལ་བྱེད",
        wylie: "gsal byed",
        desc: "He identified 30 base consonants required for the Tibetan language. Because Tibetan possessed sounds that did not exist in Sanskrit, he invented six new characters: ca, cha, ja, zha, za, and 'a (the a-chung). The consonants are organized systematically by point of articulation (velar, palatal, dental, labial) and aspiration.",
        invented: [
          { g: "ཅ", r: "ca"  },
          { g: "ཆ", r: "cha" },
          { g: "ཇ", r: "ja"  },
          { g: "ཞ", r: "zha" },
          { g: "ཟ", r: "za"  },
          { g: "འ", r: "'a"  }
        ],
        inventedNote: "the six letters invented for sounds Sanskrit lacked"
      },
      vowels: {
        title: "The 4 Vowel Marks",
        tib: "དབྱངས",
        wylie: "dbyangs",
        desc: "Like Sanskrit, every base consonant carries an inherent “a” sound. To change this vowel, one of four diacritical marks is added to the base letter:",
        marks: [
          { name: "Gi-gu",     sound: "i", pos: "above", mark: "ི" },
          { name: "Zhabs-kyu", sound: "u", pos: "below", mark: "ུ" },
          { name: "'Greng-bu", sound: "e", pos: "above", mark: "ེ" },
          { name: "Na-ro",     sound: "o", pos: "above", mark: "ོ" }
        ]
      },
      spelling: {
        title: "Two-Dimensional Spelling",
        intro: "Unlike the linear left-to-right flow of the Latin alphabet, Tibetan is built around a “root letter” (ming gzhi). This root letter can be modified by:",
        positions: [
          { id: "super",  name: "Superscripts",  tib: "མགོ་ཅན",    wylie: "mgo can",   desc: "Letters stacked above." },
          { id: "sub",    name: "Subscripts",    tib: "འདོགས་ཅན",  wylie: "'dogs can", desc: "Letters appended below." },
          { id: "prefix", name: "Prefixes",      tib: "སྔོན་འཇུག",  wylie: "sngon 'jug", desc: "Letters placed before the root." },
          { id: "suffix", name: "Suffixes",      tib: "རྗེས་འཇུག",  wylie: "rjes 'jug",  desc: "Letters placed after the root." },
          { id: "post",   name: "Post-suffixes", tib: "ཡང་འཇུག",   wylie: "yang 'jug",  desc: "A second suffix." }
        ],
        outro: "This creates complex, stacked syllable blocks. While the pronunciation of modern Central Tibetan has drifted significantly from the 7th-century orthography (rendering many prefixes and suffixes silent, though they alter the tone and vowel sound), the spelling has remained rigidly conservative."
      }
    },

    texts: {
      kicker: "the sumtag · སུམ་རྟགས",
      title: "The Foundational Texts",
      subtitle: "Sum cu pa and Rtags kyi 'jug pa",
      lead: "To establish the rules of this new literary language, Thonmi Sambhota is credited with authoring several treatises, of which two survived and became the bedrock of Tibetan grammatical study. Collectively, they are often referred to as Sumtag (Sum rtags).",
      sumchupaCard: {
        wylie: "Sum cu pa",
        tib: "སུམ་ཅུ་པ",
        en: "The Thirty Verses",
        desc: "This text primarily addresses the morphology of the language. It outlines the 30 consonants and the vowel signs, and most importantly, it details the usage of Tibetan grammatical particles (phrad). It explains how case markers (ergative, genitive, locative, etc.) are applied depending on the final letter of the preceding syllable."
      },
      tagjugCard: {
        wylie: "Rtags kyi 'jug pa",
        tib: "རྟགས་ཀྱི་འཇུག་པ",
        en: "The Application of Gender Signs",
        desc: "This is a more complex phonetic and phonological treatise. It categorizes the letters — specifically the prefixes and suffixes — into “genders” (masculine, feminine, neuter, very feminine, and barren). These categorizations have nothing to do with biological gender; instead, they represent phonetic properties such as strength, aspiration, and voicing. The text dictates the complex rules of which prefixes can precede which root letters, and how suffixes alter the pronunciation and grammatical function of a word (e.g., forming verbs or nominalizing)."
      }
    },

    pedagogy: {
      kicker: "then & now",
      title: "Pedagogy",
      subtitle: "Historical vs. Modern Learning",
      historical: {
        title: "Historical Learning Methods",
        note: "Historically, literacy was primarily the domain of monasteries and the aristocracy.",
        items: [
          {
            name: "The Jang-shing (Practice Board)",
            desc: "Paper was expensive. Novices learned to write using a wooden board dusted with chalk powder or fine sand. They would write with a bamboo stylus, wipe it clean, and start again."
          },
          {
            name: "Chanted Spelling (Jor-log)",
            desc: "Tibetan is learned through a highly rhythmic, chanted spelling system. A student does not just read a word; they recite its entire structural assembly. For example, to read the word bsgrubs (accomplished), a student chants: ba-o sa-ga-tag ga-ra-ta dra-zhabs-kyu dru-ba-sa drub."
          },
          {
            name: "Rote Memorization",
            desc: "Students were required to memorize the Sumtag texts in their entirety before they were taught the meaning of the verses. Grammar was internalized audibly and rhythmically before it was understood intellectually."
          }
        ]
      },
      modern: {
        title: "Modern Learning Methods",
        note: "The script has fully transitioned into the present — but not everything old was replaced.",
        items: [
          {
            name: "Standardization and Whiteboards",
            desc: "The sbyang shing has been largely replaced by whiteboards, notebooks, and digital tools."
          },
          {
            name: "The Persistence of Sbyor klog",
            desc: "Despite modernization, the traditional chanted spelling method remains the primary way Tibetans learn to read. It is highly effective for internalizing the complex two-dimensional spelling rules."
          },
          {
            name: "Integrated Language Acquisition",
            desc: "Modern curricula, especially for non-native speakers or in secular Tibetan schools, integrate grammar with vocabulary and conversational practice immediately, rather than forcing years of rote memorization of the Sum rtags before translation begins."
          },
          {
            name: "Digital Accessibility",
            desc: "The script has fully transitioned into the digital age. Keyboards, automated phonetic translators, and digital manuscript repositories allow students to analyze root letters and suffixes instantly, bypassing the need to manually compute the “gender” rules of Rtags kyi 'jug pa for basic reading."
          }
        ]
      }
    },

    // The Essence of the Thirty Verses (Sum cu pa'i snying po) by Yangchen
    // Drubpey Dorje — root text with a rhymed English translation, verse by
    // verse. First entry is the homage, last the colophon; the body verses
    // in between are numbered when rendered.
    sumchupa: {
      titleTib: "༄།། སུམ་ཅུ་པའི་སྙིང་པོ་ལེགས་བཤད་ལྗོན་པའི་དབང་པོ་ཞེས་བྱ་བ་བཞུགས་སོ། །དབྱངས་ཅན་གྲུབ་པའི་རྡོ་རྗེས་མཛད།།",
      titleEn: [
        "The Essence of the Thirty, beautifully displayed,",
        "The Lordly Tree of Eloquence, herein is laid."
      ],
      author: "Composed by Yangchen Drubpey Dorje",
      verses: [
        {
          label: "Homage",
          tib: "༄།། ན་མོ་གུ་རུ་མཉྫུ་གྷོ་ཥཱ་ཡ། །བླ་མ་མཆོག་དང་དབྱེར་མེད་པའི། །འཇམ་དཔལ་དབྱངས་ལ་གུས་བཏུད་ནས། །ཐོན་མིའི་ལེགས་བཤད་སུམ་ཅུ་པའི། །སྙིང་པོ་མདོར་བསྡུས་བཤད་པར་བྱ། །",
          en: [
            "Namo Guru Mañjughoṣāya! To the supreme Guru, who is never set apart",
            "From Manjushri's gentle voice, I bow with all my heart.",
            "Of Thonmi's Thirty Verses, eloquent and bold,",
            "The essence now, concisely, I shall to you unfold."
          ]
        },
        {
          label: "Vowels, consonants & the ten suffixes",
          tib: "དབྱངས་ཀྱི་བྱ་བ་གསལ་པོ་རུ། །བྱེད་པ་ཨི་ཨུ་ཨེ་ཨོ་བཞི། །གསལ་བྱེད་ཀ་སོགས་སུམ་ཅུ་ཡིན། །ག་ང་ད་ན་བ་མ་འ། །ར་ལ་ས་རྣམས་རྗེས་འཇུག་བཅུ། །",
          en: [
            "The vowels, which make the consonants distinct and true,",
            "Are exactly four in number: I, E, O, and U.",
            "The consonants, from Ka to 'A, as thirty are defined;",
            "Ten serve as suffix letters that trail along behind:",
            "Ga, Nga, Da, Na, Ba, Ma, and 'A are in this crew,",
            "And Ra, La, Sa — these ten complete the word for you."
          ]
        },
        {
          label: "The two secondary suffixes",
          tib: "ད་དང་ས་གཉིས་ཡང་འཇུག་སྟེ། །ད་ནི་ན་ར་ལ་གསུམ་དང་། །ས་ནི་ག་ང་བ་མར་འཐོབ། །",
          en: [
            "As secondary suffixes, just Da and Sa appear:",
            "Da follows Na, Ra, La — a rule distinctly clear;",
            "While Sa takes Ga, Nga, Ba, or Ma to bring up the rear."
          ]
        },
        {
          label: "The five prefixes",
          tib: "ག་ད་བ་མ་འ་སྔོན་འཇུག །",
          en: [
            "Ga, Da, Ba, Ma, and 'A as prefixes are placed,",
            "Five letters by which the beginnings of words are graced."
          ]
        },
        {
          label: "Terminating particles",
          tib: "གོ་ངོ་དོ་ནོ་བོ་མོ་འོ། །རོ་ལོ་སོ་ཏོ་སླར་བསྡུ་སྟེ། །རྫོགས་ཚིག་ཟླ་སྡུད་ཅེས་ཀྱང་བྱ། །དྲག་ཡོད་ཏོ་དང་མཐའ་མེད་འོ། །གཞན་རྣམས་མིང་མཐའི་རྗེས་མཐུན་སྦྱར། །",
          en: [
            "Go, Ngo, Do, No, Bo, Mo, 'O,",
            "Ro, Lo, So, To — serve to stop the sentence flow.",
            "We call them “terminators” or the “gathering of friends.”",
            "Use 'To' for strong-closed sounds; 'O' where an open vowel ends;",
            "The rest will match the suffix on which the word depends."
          ]
        },
        {
          label: "The seven la-don particles",
          tib: "སུ་ར་རུ་དུ་ན་ལ་ཏུ། །ལ་དོན་རྣམ་པ་བདུན་ཡིན་ཏེ། །རྣམ་དབྱེ་གཉིས་བཞི་བདུན་པ་དང་། །དེ་ཉིད་ཚེ་སྐབས་རྣམས་ལ་འཇུག །",
          en: [
            "Su, Ra, Ru, Du, Na, La, Tu — these seven-fold remain",
            "The particles of “La-intent,” whose functions we explain:",
            "The second, fourth, and seventh cases they assign,",
            "Along with “thatness,” time, and occasions they define."
          ]
        },
        {
          label: "Joining the la-don",
          tib: "ས་སུ་ག་བ་དྲག་མཐར་ཏུ། །ང་ད་ན་མ་ར་ལ་དུ། །འ་དང་མཐའ་མེད་ར་དང་རུ། །",
          en: [
            "For Sa use 'Su'; for Ga, Ba, and strong closures, 'Tu' is placed;",
            "Nga, Da, Na, Ma, Ra, La are with the suffix 'Du' embraced;",
            "While 'A and open vowels with 'Ra' or 'Ru' are graced."
          ]
        },
        {
          label: "The genitive & the agentive",
          tib: "གི་ཀྱི་གྱི་འི་ཡི་ལྔ་པོ། །རྣམ་དབྱེ་དྲུག་པ་འབྲེལ་སྒྲ་དང་། །དེ་རྣམས་ས་མཐའ་ཅན་ལྔ་ནི། །རྣམ་དབྱེ་གསུམ་པ་བྱེད་སྒྲ་སྟེ། །",
          en: [
            "Gi, Kyi, Gyi, 'I, and Yi — this group of five supplies",
            "The sixth case, where the ownership or the connection lies;",
            "But if the letter Sa to these same five is bound,",
            "They form the third case, acting as the “agent's sound.”"
          ]
        },
        {
          label: "Joining the genitive",
          tib: "སྦྱོར་ཚུལ་ན་མ་ར་ལ་གྱི། །ད་བ་ས་ཀྱི་ག་ང་གི །འ་དང་མཐའ་མེད་འི་དང་ཡི། །",
          en: [
            "The rules for joining: Na, Ma, Ra, and La take 'Gyi';",
            "Da, Ba, and Sa take 'Kyi' as their proper company;",
            "Ga and Nga take 'Gi'; and where 'A or no suffix lies,",
            "The particle 'I or 'Yi will naturally arise."
          ]
        },
        {
          label: "Ornament & inclusion — kyang, yang, 'ang",
          tib: "ཀྱང་ཡང་འང་གསུམ་རྒྱན་སྡུད་དེ། །ག་ད་བ་ས་དྲག་མཐར་ཀྱང་། །ང་ན་མ་ར་ལ་མཐར་ཡང་། །འ་དང་མཐའ་མེད་འང་དང་ཡང་། །",
          en: [
            "Kyang, Yang, and 'Ang are ornaments, or gather words in bound:",
            "Ga, Da, Ba, Sa, and strong endings take 'Kyang' to close the sound;",
            "Nga, Na, Ma, Ra, and La find 'Yang' a fitting friend;",
            "While 'Ang and 'Yang take 'A or open vowels at the end."
          ]
        },
        {
          label: "Continuatives — te, de, ste",
          tib: "ཏེ་དེ་སྟེ་གསུམ་ལྷག་བཅས་ཏེ། །ན་ར་ལ་ས་དྲག་མཐར་ཏེ། །ད་དེ་ག་ང་བ་མ་འ། །མཐའ་མེད་རྣམས་ལ་ས་སྟེ་འཐོབ། །",
          en: [
            "Te, De, Ste are “continuatives” — more is left to state:",
            "Na, Ra, La, Sa, and strong closures take 'Te' to conjugate;",
            "To Da goes 'De'; for Ga, Nga, Ba, Ma, 'A, and those",
            "With open vowel sounds, the suffix 'Ste' arose."
          ]
        },
        {
          label: "Question & alternation — gam … tam",
          tib: "གམ་ངམ་དམ་ནམ་བམ་མམ་འམ། །རམ་ལམ་སམ་ཏམ་འབྱེད་སྡུད་དེ། །སྦྱོར་ཚུལ་སླར་བསྡུའི་སྐབས་དང་མཚུངས།།",
          en: [
            "Gam, Ngam, Dam, Nam, Bam, Mam, 'Am,",
            "And Ram, Lam, Sam, Tam — these questioning words we see.",
            "Their rules of joining mirror those of the decree",
            "Matching the “terminators” quite identically."
          ]
        },
        {
          label: "Filling the metre & the floating tsek",
          tib: "ར་རུ་འི་ཡི་འང་ཡང་རྣམས། །རྐང་པ་མི་སྐོང་སྐོང་བའི་ཁྱད། །འོ་འུ་འམ་གྱི་གོང་དུ་ཚེག །མེད་དང་ཡོད་པའང་དེ་བཞིན་ཡིན། །",
          en: [
            "Ra, Ru, 'I, Yi, 'Ang, and Yang — these particles compete",
            "Depending on if they must make a metered line complete.",
            "Before 'O, 'U, and 'Am, the tsek, that tiny space,",
            "May similarly be absent or be present in its place."
          ]
        },
        {
          label: "Source particles — nas, las",
          tib: "ནས་ལས་འབྱུང་ཁུངས་དགར་སྡུད་དེ། །འབྱུང་ཁུངས་དངོས་ལ་གང་སྦྱར་འཐུས། །རིགས་མཐུན་དགར་ནས་མི་མཐུན་ལས། །སྡུད་ལ་ནས་སྒྲ་ཁོ་ན་འཇུག །",
          en: [
            "'Nas' and 'Las' denote a source, isolate, or aggregate.",
            "For literal origins, either word is adequate.",
            "To isolate like things, use 'Nas'; unalike, 'Las' applies;",
            "But for gathering things together, 'Nas' alone is wise."
          ]
        },
        {
          label: "Vocatives — kye, kwa-ye",
          tib: "ཀྱེ་དང་ཀྭ་ཡེ་བོད་སྒྲ་སྟེ། །ཕལ་ཆེར་མིང་གི་ཐོག་མར་སྦྱོར། །",
          en: [
            "'Kye!' and 'Kwa-ye!' are vocatives, a sudden calling sound,",
            "And mostly at the very start of titles they are found."
          ]
        },
        {
          label: "The isolating ni",
          tib: "ནི་ནི་དགར་དང་བརྣན་པའི་སྒྲ། །",
          en: [
            "'Ni' serves to isolate a theme, or emphasize a thought."
          ]
        },
        {
          label: "The five uses of dang",
          tib: "དང་ནི་སྡུད་འབྱེད་རྒྱུ་མཚན་དང་། །ཚེ་སྐབས་གདམས་ངག་ལྔ་ལ་འཇུག །",
          en: [
            "'Dang' serves for five: to gather, sever, or for reasons sought,",
            "For timing and occasions, or instructions to be taught."
          ]
        },
        {
          label: "The pointing de",
          tib: "མིང་གི་ཐོག་མའི་དེ་སྒྲ་ནི། །ཐ་སྙད་འདས་མ་ཐག་པ་དང་། །རྣམ་གྲངས་གཞན་ཅན་གཉིས་ལ་འཇུག །",
          en: [
            "The 'De' that starts a noun points backward to review",
            "To what was just discussed, or points to topics quite anew."
          ]
        },
        {
          label: "General terms — ci, ji, su, gang",
          tib: "ཅི་ཇི་སུ་གང་སྤྱི་སྒྲ་སྟེ། །ཞིག་སྟེ་སླད་འདྲ་ཕྱིར་ལ་ཅི། །སྙེད་སྲིད་ལྟར་བཞིན་སྐད་ལ་ཇི། །སུ་ནི་གང་ཟག་གང་ཀུན་ལའོ། །",
          en: [
            "Ci, Ji, Su, Gang are general terms, interrogatives defined:",
            "With zhig, ste, slad, 'dra, phyir, the letter 'Ci' is signed;",
            "With snyed, srid, ltar, bzhin, skad, the letter 'Ji' is assigned;",
            "'Su' is for the person; 'Gang' for all you find."
          ]
        },
        {
          label: "The owner's particles — pa, ba, ma",
          tib: "ན་རོ་ཡོད་མེད་པ་བ་མ། །བདག་པོའི་སྒྲ་སྟེ་ག་ད་ན། །བ་མ་ས་དང་དྲག་མཐར་པ། །ང་འ་ར་ལ་མཐའ་མེད་ལ། །བདག་སྒྲ་ཡར་གྱུར་བ་དང་ནི། །ཆ་ལ་པ་ཉིད་སྦྱོར་བ་ལེགས། །མིང་མཐའི་པ་བའང་ཕལ་ཆེར་འདྲ། །མ་ནི་ངེས་མེད་སྐབས་དང་སྦྱར།།",
          en: [
            "Pa, Ba, and Ma, with or without the vowel 'O' to bear,",
            "Serve as the “owner's particle”. To Ga, Da, Na, with care,",
            "Ba, Ma, Sa, and strong-closed sounds take 'Pa' by strict designs;",
            "For Nga, 'A, Ra, La, and open vowels, 'Ba' aligns.",
            "For fractional parts, the 'Pa' itself is strictly best applied;",
            "A noun's own 'Pa' or 'Ba' suffix acts as a similar guide.",
            "'Ma' joins the word when what's to come is yet unverified."
          ]
        },
        {
          label: "Negation — ma, mi, min, med",
          tib: "མ་མི་མིན་མེད་དགག་སྒྲ་སྟེ། །མ་མི་ཐོག་མ་མིན་མེད་མཇུག །མ་ནི་བར་གྱི་གསལ་བྱེད་ལའང་། །",
          en: [
            "Ma, Mi, Min, Med — these four words will negate:",
            "Ma and Mi begin the phrase; Min and Med conclude the state;",
            "And 'Ma' between two syllables will also designate."
          ]
        },
        {
          label: "Conjunctives — the zhing set",
          tib: "ཚིག་ཕྲད་ཞིང་སོགས་ང་ན་མ། །འ་དང་ར་ལ་མཐའ་མེད་མཐར། །ཞིང་ཞེས་ཞེ་འོ་ཞེ་ན་ཞིག །",
          en: [
            "For conjunctive links like 'Zhing': after Nga, Na, Ma,",
            "'A, Ra, La, or open syllables, these particles are the star:",
            "'Zhing, zhes, zhe'o, zhe na, zhig' — how elegant they are."
          ]
        },
        {
          label: "Conjunctives — the cing set",
          tib: "ག་ད་བ་དང་ད་དྲག་མཐར། །ཅིང་ཅེས་ཅེ་འོ་ཅེ་ན་ཅིག །",
          en: [
            "For Ga, Da, Ba, or closures that are strong, a different set will ring:",
            "'Cing, ces, ce'o, ce na, cig' must clearly sing."
          ]
        },
        {
          label: "Conjunctives — the shing set",
          tib: "ས་མཐར་དམིགས་བསལ་ཞེས་མ་གཏོགས། །ཤིང་ཤིག་ཤེའོ་ཤེ་ན་འཐོབ། །",
          en: [
            "When 'Sa' concludes, except for 'zhes', an S-sound it awakes:",
            "'Shing, shig, she'o, she na' is the pattern that it takes."
          ]
        },
        {
          label: "A caution on look-alikes",
          tib: "འོན་ཀྱང་ཁ་ཅིག་ལྷན་ཅིག་སོགས། །མིང་གི་ཆ་དང་མ་ནོར་གཅེས། །",
          en: [
            "Yet be alert! With words like 'lhan cig' you are shown",
            "Intrinsic parts of nouns; don't mix them for a rule alone."
          ]
        },
        {
          label: "Writing the final 'a",
          tib: "རྐྱང་པ་འཕུལ་ལ་འ་མཐའ་དགོས། །གུག་ཀྱེད་བརྩེགས་འདོགས་ཅན་ལ་སྤང་། །",
          en: [
            "A prefixed single letter takes a final 'A by rule;",
            "But subjoined, stacked, or vowel signs employ a different tool:",
            "You drop the 'A entirely, according to the school."
          ]
        },
        {
          label: "The single stroke — chig-shad",
          tib: "ལྷུག་པའི་དོན་མང་མིང་མཚམས་དང་། །དོན་འབྲིང་འབྱེད་དང་དོན་ཉུང་རྫོགས། །ཚིགས་བཅད་ག་མཐར་ཆིག་ཤད་བྱ།།",
          en: [
            "For prose comprising lists, or middling clauses to equate,",
            "For short completed thoughts, or verse in 'Ga' concluding straight,",
            "A single stroke, the chig-shad, you must delineate."
          ]
        },
        {
          label: "The double stroke — nyi-shad",
          tib: "རྫོགས་ཚིག་མཐའ་ཅན་ལྷུག་པ་དང་། །ཚིགས་བཅད་རྐང་མཐར་ཉིས་ཤད་འཐོབ། །",
          en: [
            "Where prose concludes with terminal words, or where verse lines abate,",
            "A double stroke, the nyi-shad, is the appropriate state."
          ]
        },
        {
          label: "The fourfold stroke — zhi-shad",
          tib: "དོན་ཚན་ཆེན་མོ་རྫོགས་པ་དང་། །ལེའུའི་མཚམས་སུ་བཞི་ཤད་དགོས། །",
          en: [
            "When major textual sections close, or chapters terminate,",
            "A fourfold stroke, the zhi-shad, will those boundaries separate."
          ]
        },
        {
          label: "The tsek before the shad",
          tib: "ང་ཡིག་མ་གཏོགས་ཡིག་ཤད་དབར། །ཚེག་མེད་དེ་སོགས་ཞིབ་ཏུ་འབད། །",
          en: [
            "Save for the letter 'Nga', between the letter and the stroke",
            "No tsek should stand. Thus, master all the rules this text bespoke."
          ]
        },
        {
          label: "Colophon",
          tib: "ཚིག་གི་ལོ་མས་མ་བསྒྲིབས་ཤིང་། །དོན་གྱི་འབྲས་བུ་གཡུར་ཟ་བའི། །ལེགས་བཤད་ལྗོན་པའི་དབང་པོ་འདི། །དབྱངས་ཅན་གྲུབ་པའི་རྡོ་རྗེས་སྤེལ།།",
          en: [
            "Unshadowed by the leaves of words, but rather, heavy-weighed",
            "With fruits of genuine meaning elegantly displayed,",
            "This Lordly Tree of Eloquence, a grammar perfectly made,",
            "By Yangchen Drubpey Dorje is before you laid."
          ]
        }
      ]
    }
  },

  builderWord: {
    word: "བསྒྲུབས",
    pron: "drup",
    meaning: "to accomplish, fulfill",
    parts: [
      {
        id: "prefix",
        label: "Prefix",
        tib: "སྔོན་འཇུག",
        rom: "ngön-jug",
        glyph: "བ",
        add: "བ",
        color: "prefix",
        silent: true,
        sound: "—",
        role: "Stands at the head of the syllable. The five prefixes (ག ད བ མ འ) are silent in modern speech, but they are still written.",
        family: "one of 5 prefixes"
      },
      {
        id: "super",
        label: "Superscript",
        tib: "མགོ་ཅན",
        rom: "go-chen",
        glyph: "ས",
        gloss: "'sago'",
        add: "ས",
        color: "super",
        silent: true,
        sound: "—",
        role: "Sits atop the root. Sa-go is silent itself but raises the tone of low-tone roots. Only ར་ ལ་ ས་ ever take this position.",
        family: "ར་ལ་ས་"
      },
      {
        id: "root",
        label: "Root letter",
        tib: "མིང་གཞི",
        rom: "ming-zhi",
        glyph: "ག",
        add: "ྒ",
        color: "root",
        silent: false,
        sound: "d-",
        role: "The base consonant — the heart of the syllable. Here ག (ga, low tone). When ratak ྲ is subjoined, the cluster sounds as 'dra'; sa-go on top raises the tone.",
        family: "any of the 30 consonants"
      },
      {
        id: "sub",
        label: "Subscript",
        tib: "འདོགས་ཅན",
        rom: "dok-chen",
        glyph: "ྲ",
        ghostGlyph: "◌ྲ",
        gloss: "'ratak'",
        add: "ྲ",
        color: "sub",
        silent: false,
        sound: "-r-",
        role: "Tucks under the root. Ratak fuses with most hosts into a retroflex tr / thr / dr sound. Four subscripts in all: ya, ra, la, wa.",
        family: "ya · ra · la · wa"
      },
      {
        id: "vowel",
        label: "Vowel",
        tib: "དབྱངས",
        rom: "yang · shabkyu",
        glyph: "ུ",
        ghostGlyph: "◌ུ",
        add: "ུ",
        color: "vowel",
        silent: false,
        sound: "u",
        role: "Replaces the inherent 'a' with one of four vowels. Shabkyu (ུ) sits beneath the root, giving the 'u' sound.",
        family: "one of 4 vowels"
      },
      {
        id: "suffix",
        label: "Suffix",
        tib: "རྗེས་འཇུག",
        rom: "jé-jug",
        glyph: "བ",
        add: "བ",
        color: "suffix",
        silent: true,
        sound: "(p)",
        role: "The first 'tail'. Ten letters can sit here (ག ང ད ན བ མ འ ར ལ ས). Suffix ba closes the syllable with an unreleased -p sound.",
        family: "one of 10 suffixes"
      },
      {
        id: "post",
        label: "Post-suffix",
        tib: "ཡང་འཇུག",
        rom: "yang-jug",
        glyph: "ས",
        add: "ས",
        color: "post",
        silent: true,
        sound: "—",
        role: "A second, silent tail. Only ས (and historically ད) may take this place; modern Tibetan no longer writes the ད.",
        family: "ས (or ད, no longer written)"
      }
    ]
  }
};
