import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import AlphabetView from './views/AlphabetView.jsx';
import VowelsView from './views/VowelsView.jsx';
import StacksView from './views/StacksView.jsx';
import BuilderView from './views/BuilderView.jsx';
import RulesView from './views/RulesView.jsx';
import TraceView from './views/TraceView.jsx';
import ReadView from './views/ReadView.jsx';
import ProverbsView from './views/ProverbsView.jsx';

export default function App() {
  const [tab, setTab] = useState('alphabet');
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);
  return (
    <div className="app" data-screen-label={'00 ' + tab}>
      <Sidebar tab={tab} setTab={setTab} />
      <main className="main">
        {tab === 'alphabet' && <AlphabetView />}
        {tab === 'vowels'   && <VowelsView />}
        {tab === 'stacks'   && <StacksView />}
        {tab === 'builder'  && <BuilderView />}
        {tab === 'rules'    && <RulesView />}
        {tab === 'trace'    && <TraceView />}
        {tab === 'read'     && <ReadView />}
        {tab === 'proverbs' && <ProverbsView />}
      </main>
    </div>
  );
}
