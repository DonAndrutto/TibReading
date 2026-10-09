import { useState } from 'react';
import { useProgress, exportProgress, importProgress, resetProgress, getStorageError } from '../progress.js';
export default function SettingsView() {
  const progress = useProgress();
  const [message, setMessage] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(null);
  const download = () => {
    const url = URL.createObjectURL(new Blob([exportProgress()], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'tibreading-progress.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Progress exported. Keep the file to move your progress to another device.');
  };
  return <div className="view"><div className="kicker">Your course</div><h1>Settings &amp; progress</h1>
    <p className="lead">Progress stays on this device. Export a copy, then import it on another device to continue there.</p>
    <section className="course-panel">
      <p>{Object.values(progress.items).filter(x => x.seen).length} items seen · {Object.values(progress.items).filter(x => x.mastered).length} mastered · {progress.streak} day streak</p>
      <p>Last practice: {progress.lastSession ? new Date(progress.lastSession).toLocaleString() : 'No sessions yet'}</p>
      <div className="course-actions"><button className="btn primary" onClick={download}>Export progress JSON</button>
        <label className="btn">Import progress JSON<input type="file" accept=".json,application/json" onChange={async e => {
          const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
          if (file.size > 5000000) { setMessage('Progress file is too large.'); return; }
          try { setPending(await file.text()); setMessage(''); } catch { setMessage('Could not read that file.'); }
        }} /></label></div>
      {pending !== null && <div><p>Import replaces current progress. Export first if you want a backup.</p><button className="btn" onClick={() => { try { importProgress(pending); setMessage('Progress imported.'); setPending(null); } catch (e) { setMessage(e.message); } }}>Replace with imported progress</button><button className="btn" onClick={() => setPending(null)}>Cancel import</button></div>}
      <hr /><button className="btn" onClick={() => setConfirm(true)}>Reset progress</button>
      {confirm && <div role="group" aria-label="Confirm reset"><p>Erase all progress on this device? This cannot be undone without an export.</p><button className="btn" onClick={() => { resetProgress(); setConfirm(false); setMessage('Progress reset.'); }}>Yes, erase progress</button><button className="btn" onClick={() => setConfirm(false)}>Keep progress</button></div>}
      <p role="status">{message || getStorageError()}</p>
    </section>
  </div>;
}
