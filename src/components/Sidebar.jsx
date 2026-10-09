import { useRef } from 'react';
import OfflineStatus from './OfflineStatus.jsx';
export default function Sidebar({ tab, setTab }) {
  const menu = useRef(null);
  const items = [
    { id: 'intro',    label: 'Intro',     sub: 'history of the script', ti: 'ཨ'   },
    { id: 'alphabet', label: 'Alphabet',  sub: '30 consonants',         ti: 'ཀ'   },
    { id: 'vowels',   label: 'Vowels',    sub: '4 marks · combiner',    ti: 'ཨི'   },
    { id: 'stacks',   label: 'Stacks',    sub: 'sub- & superscripts',   ti: 'རྒྱ' },
    { id: 'practice', label: 'Practice', sub: 'daily review', ti: 'ཀྱ' },
    { id: 'builder',  label: 'Builder',   sub: 'anatomy of a syllable', ti: 'སྒྲ' },
    { id: 'rules',    label: 'Rules',     sub: 'spelling ⇢ sound',      ti: 'སྨ'   },
    { id: 'trace',    label: 'Trace',     sub: 'write on the line',     ti: 'ཞ'   },
    { id: 'read',     label: 'Read',      sub: 'first words',           ti: 'ཆུ'  },
    { id: 'proverbs', label: 'Proverbs',  sub: 'sayings & prayers',     ti: '༄'   },
    { id: 'settings', label: 'Settings', sub: 'your progress', ti: 'ཡ' },
  ];

  return (
    <>
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-ti" lang="bo">བོད་ཡིག</div>
        <div className="brand-en">
          <div className="brand-title">Tibetan Manual</div>
          <div className="brand-sub">Reading · Writing</div>
        </div>
      </div>

      <nav className="nav">
        {items.map((it, i) => (
          <button key={it.id}
            className={'nav-item' + (tab === it.id ? ' is-active' : '')}
            aria-current={tab === it.id ? 'page' : undefined}
            onClick={() => setTab(it.id)}>
            <div className="nav-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="nav-ti" lang="bo">{it.ti}</div>
            <div className="nav-text">
              <div className="nav-label">{it.label}</div>
              <div className="nav-sub">{it.sub}</div>
            </div>
          </button>
        ))}
      </nav>

      <OfflineStatus />
      <div className="side-foot">
        <div className="side-foot-mark" lang="bo">༄༅༎</div>
        <div className="side-foot-line">A study companion to the</div>
        <div className="side-foot-line">phonology &amp; orthography</div>
        <div className="side-foot-line">manual.</div>
      </div>
    </aside>
    <header className="mobile-header"><span className="ti" lang="bo">བོད་ཡིག</span><span>Tibetan Manual<OfflineStatus /></span></header>
    <nav className="bottom-nav" aria-label="Main navigation">
      {[['alphabet','Learn'],['practice','Practice'],['read','Read']].map(([id,label]) => <button key={id} aria-current={tab===id ? 'page' : undefined} onClick={() => setTab(id)}>{label}</button>)}
      <button aria-current={!["alphabet","practice","read"].includes(tab) ? "page" : undefined} onClick={() => menu.current.showModal()}>More</button>
    </nav>
    <dialog className="mobile-menu" ref={menu} aria-label="All sections">
      <div className="course-actions"><h2>Explore the course</h2><button className="btn" onClick={() => menu.current.close()}>Close menu</button></div>
      <nav aria-label="All sections">{items.map(it => <button className="menu-item" key={it.id} aria-current={tab===it.id ? 'page' : undefined} onClick={() => { menu.current.close(); setTab(it.id); }}><span className="ti" lang="bo">{it.ti}</span><span>{it.label}<small>{it.sub}</small></span></button>)}</nav>
    </dialog>
    </>
  );
}
