import { useSyncExternalStore } from 'react';

const KEY = 'tibreading.install';
const WEEK = 7 * 86400000;
const listeners = new Set();
let deferredPrompt = null;
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { /* Private browsing can block storage. */ }
const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let state = { installed: standalone() || saved.installed === true, available: false, ios, dismissed: Number(saved.dismissedUntil) > Date.now(), busy: false, message: '' };
function update(patch) { state = { ...state, ...patch }; listeners.forEach(fn => fn()); }
function persist(patch) { saved = { ...saved, ...patch }; try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* Keep working in memory. */ } }
function installed() { deferredPrompt = null; persist({ installed: true }); update({ installed: true, available: false, busy: false, message: '' }); }
// Register before React mounts: the browser can offer installation at any time.
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  if (standalone()) return;
  deferredPrompt = event;
  persist({ installed: false }); // A new offer also handles a previously uninstalled app.
  update({ installed: false, available: true, message: '' });
});
window.addEventListener('appinstalled', installed);
window.matchMedia('(display-mode: standalone)').addEventListener('change', event => { if (event.matches) installed(); });
if (standalone()) persist({ installed: true });

export function useInstall() { return useSyncExternalStore(fn => { listeners.add(fn); return () => listeners.delete(fn); }, () => state); }
export function dismissInstall() { persist({ dismissedUntil: Date.now() + WEEK }); update({ dismissed: true }); }
export async function requestInstall() {
  if (!deferredPrompt || state.busy) return;
  const prompt = deferredPrompt;
  deferredPrompt = null; // Browser prompt events can only be used once.
  update({ busy: true, message: '' });
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (state.installed) return;
    update({ available: false, message: choice.outcome === 'accepted' ? 'Installation requested. Open TibReading from your home screen or app launcher once it is ready.' : 'Installation cancelled. You can install later from your browser menu.' });
    dismissInstall();
  } catch {
    update({ available: false, message: 'Installation could not start. Try your browser’s install or Add to Home Screen menu.' });
  } finally { update({ busy: false }); }
}
