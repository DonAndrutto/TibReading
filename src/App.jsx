import { useEffect, Component } from 'react';
import { useProgress, getStorageError } from './progress.js';
import { useRoute } from './routing.js';
import SettingsView from './views/SettingsView.jsx';
import PracticeView from './views/PracticeView.jsx';
import Sidebar from './components/Sidebar.jsx';
import IntroView from './views/IntroView.jsx';
import AlphabetView from './views/AlphabetView.jsx';
import VowelsView from './views/VowelsView.jsx';
import StacksView from './views/StacksView.jsx';
import BuilderView from './views/BuilderView.jsx';
import RulesView from './views/RulesView.jsx';
import TraceView from './views/TraceView.jsx';
import ReadView from './views/ReadView.jsx';
import ProverbsView from './views/ProverbsView.jsx';

// A view that throws must not white-screen the whole app — the sidebar
// stays usable and the user can retry or switch sections.
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error(error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="view view-crash">
          <h1>This section hit a snag</h1>
          <p className="lead">Something went wrong while rendering. Your other sections are unaffected.</p>
          <button className="btn primary" onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { tab, payload, hash, go } = useRoute();
  useProgress();
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);
  return (
    <div className="app" data-screen-label={'00 ' + tab}>
      <Sidebar tab={tab} setTab={go} />
      <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); document.getElementById("main-content").focus(); }}>Skip to content</a>
      <main id="main-content" tabIndex={-1} className="main">
        {getStorageError() && <p role="status" className="course-panel">{getStorageError()}</p>}
        <ErrorBoundary key={hash}>
          {tab === 'intro'    && <IntroView go={go} />}
          {tab === 'alphabet' && <AlphabetView go={go} initial={payload} />}
          {tab === 'vowels'   && <VowelsView go={go} initial={payload} />}
          {tab === 'stacks'   && <StacksView go={go} />}
          {tab === 'builder'  && <BuilderView initial={payload} />}
          {tab === 'rules'    && <RulesView go={go} />}
          {tab === 'trace'    && <TraceView go={go} initial={payload} />}
          {tab === 'read'     && <ReadView go={go} initial={payload} />}
          {tab === 'practice' && <PracticeView />}
          {tab === 'settings' && <SettingsView />}
          {tab === 'proverbs' && <ProverbsView go={go} />}
        </ErrorBoundary>
      </main>
    </div>
  );
}
