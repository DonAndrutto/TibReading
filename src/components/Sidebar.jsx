export default function Sidebar({ tab, setTab }) {
  const items = [
    { id: 'intro',    label: 'Intro',     sub: 'history of the script', ti: 'ཨ'   },
    { id: 'alphabet', label: 'Alphabet',  sub: '30 consonants',         ti: 'ཀ'   },
    { id: 'vowels',   label: 'Vowels',    sub: '4 marks · combiner',    ti: 'ི'   },
    { id: 'stacks',   label: 'Stacks',    sub: 'sub- & superscripts',   ti: 'རྒྱ' },
    { id: 'builder',  label: 'Builder',   sub: 'anatomy of a syllable', ti: 'སྒྲ' },
    { id: 'rules',    label: 'Rules',     sub: 'spelling ⇢ sound',      ti: 'ྨ'   },
    { id: 'trace',    label: 'Trace',     sub: 'write on the line',     ti: 'ཞ'   },
    { id: 'read',     label: 'Read',      sub: 'first words',           ti: 'ཆུ'  },
    { id: 'proverbs', label: 'Proverbs',  sub: 'sayings & prayers',     ti: '༄'   },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-ti">བོད་ཡིག</div>
        <div className="brand-en">
          <div className="brand-title">Tibetan Manual</div>
          <div className="brand-sub">Reading · Writing</div>
        </div>
      </div>

      <nav className="nav">
        {items.map((it, i) => (
          <button key={it.id}
            className={'nav-item' + (tab === it.id ? ' is-active' : '')}
            onClick={() => setTab(it.id)}>
            <div className="nav-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="nav-ti">{it.ti}</div>
            <div className="nav-text">
              <div className="nav-label">{it.label}</div>
              <div className="nav-sub">{it.sub}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="side-foot">
        <div className="side-foot-mark">༄༅༎</div>
        <div className="side-foot-line">A study companion to the</div>
        <div className="side-foot-line">phonology &amp; orthography</div>
        <div className="side-foot-line">manual.</div>
      </div>
    </aside>
  );
}
