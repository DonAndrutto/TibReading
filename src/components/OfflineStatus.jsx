import { useEffect, useState } from 'react';
export default function OfflineStatus() {
  const [status,setStatus] = useState('Preparing offline copy…');
  useEffect(() => {
    if (!('serviceWorker' in navigator) || location.protocol === 'file:') { setStatus('Local reading copy'); return; }
    const ready = () => setStatus(navigator.onLine ? 'Ready for offline practice' : 'Offline · progress stays here');
    const failed = () => setStatus('Offline copy unavailable this time');
    navigator.serviceWorker.getRegistration().then(r => { if(r?.active) ready(); });
    window.addEventListener('tibreading-offline-ready',ready); window.addEventListener('tibreading-offline-unavailable',failed);
    window.addEventListener('online',ready); window.addEventListener('offline',ready);
    return () => { window.removeEventListener('tibreading-offline-ready',ready); window.removeEventListener('tibreading-offline-unavailable',failed); window.removeEventListener('online',ready); window.removeEventListener('offline',ready); };
  },[]);
  return <span className="offline-status" role="status">{status}</span>;
}
