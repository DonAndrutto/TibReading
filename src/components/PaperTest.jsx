import { useState, useEffect } from 'react';

export default function PaperTest({ aspirated }) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => { setPulse(p => p + 1); }, [aspirated]);

  return (
    <div className="paper-test" title={aspirated ? 'Aspirated — paper flutters' : 'Unaspirated — paper holds still'}>
      <div className="paper-test-label mono">{aspirated ? 'paper flutters' : 'paper holds still'}</div>
      <div className="paper-test-stage">
        <svg className="paper-mouth" viewBox="0 0 32 32" aria-hidden="true">
          <ellipse cx="16" cy="16" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="16" cy="16" rx="4" ry="2" fill="currentColor" opacity=".5" />
        </svg>
        <svg key={pulse}
          className={'paper-sheet' + (aspirated ? ' is-flutter' : '')}
          viewBox="0 0 40 50"
          aria-hidden="true">
          <path d="M4 4 L34 4 L36 46 L2 48 Z"
                fill="var(--paper)"
                stroke="var(--ink-mute)"
                strokeWidth="1" />
          <line x1="10" y1="14" x2="28" y2="14" stroke="var(--ink-mute)" strokeWidth=".6" opacity=".6" />
          <line x1="10" y1="22" x2="28" y2="22" stroke="var(--ink-mute)" strokeWidth=".6" opacity=".6" />
          <line x1="10" y1="30" x2="24" y2="30" stroke="var(--ink-mute)" strokeWidth=".6" opacity=".6" />
        </svg>
        {aspirated && (
          <>
            <span className="puff p1" />
            <span className="puff p2" />
            <span className="puff p3" />
          </>
        )}
      </div>
    </div>
  );
}
