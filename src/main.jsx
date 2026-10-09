import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

if ('serviceWorker' in navigator && ['https:', 'http:'].includes(location.protocol) && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./sw.js', location.href), { scope: './' })
      .then(() => navigator.serviceWorker.ready)
      .then(() => window.dispatchEvent(new Event('tibreading-offline-ready')))
      .catch(() => window.dispatchEvent(new Event('tibreading-offline-unavailable')));
  });
}
