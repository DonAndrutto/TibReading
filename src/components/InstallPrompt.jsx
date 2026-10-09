import { useState } from 'react';
import { dismissInstall, requestInstall, useInstall } from '../install.js';

export default function InstallPrompt({ settings = false }) {
  const { installed, available, ios, dismissed, busy, message } = useInstall();
  const [instructions, setInstructions] = useState(false);
  if (!['https:', 'http:'].includes(location.protocol)) return null;
  if (!settings && (installed || dismissed || (!available && !ios && !message))) return null;
  return <section className={`install-panel ${settings ? 'course-panel' : 'install-banner'}`} aria-label="Install TibReading">
    <img src="./icon.svg" width="56" height="56" alt="" />
    <div className="install-copy">
      <h2>{installed ? 'TibReading is installed' : 'A little practice, always close by'}</h2>
      <p>{installed ? 'Open it from your home screen or app launcher.' : 'Add TibReading to your device for quick access and offline practice.'}</p>
      {!installed && <div className="course-actions">
        {available ? <button className="btn primary" disabled={busy} onClick={requestInstall}>{busy ? 'Opening installer…' : 'Install TibReading'}</button> :
          <button className="btn primary" aria-expanded={instructions} onClick={() => setInstructions(!instructions)}>How to install</button>}
        {!settings && <button className="btn" onClick={dismissInstall}>Not now</button>}
      </div>}
      {!installed && instructions && <p className="install-help">{ios ? 'Open the Share menu in your browser, choose Add to Home Screen, then tap Add. If that option is missing, open this page in Safari first.' : 'Open your browser’s menu and look for Install TibReading, Install app, or Add to Home Screen. In Safari on Mac, use File → Add to Dock. If no option appears, this browser may not support installation.'}</p>}
      <p className="install-message" role="status">{message}</p>
    </div>
  </section>;
}
