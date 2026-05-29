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
