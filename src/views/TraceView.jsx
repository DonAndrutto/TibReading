import { useState, useRef, useEffect } from 'react';
import { TIBETAN_DATA as D } from '../data.js';

const toneLabel = (t) =>
  t === 'high asp.' ? 'High · aspirated' : t === 'high' ? 'High' : 'Low';

export default function TraceView({ go, initial }) {
  const [idx, setIdx] = useState(initial?.letter ?? 0);
  const [showGuide, setShowGuide] = useState(true);
  const [stroke, setStroke] = useState(14);
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  const c = D.consonants[idx];

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      // Assigning width/height wipes the bitmap, so snapshot the drawing
      // first and paint it back — a window resize must not erase the work.
      let snap = null;
      if (canvas.width > 0 && canvas.height > 0) {
        snap = document.createElement('canvas');
        snap.width = canvas.width;
        snap.height = canvas.height;
        snap.getContext('2d').drawImage(canvas, 0, 0);
      }
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';
      if (snap) ctx.drawImage(snap, 0, 0, snap.width, snap.height, 0, 0, rect.width, rect.height);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => { clear(); }, [idx]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  // React registers touch events as passive, so preventDefault would be
  // ignored (with a console error); the canvas relies on CSS touch-action:
  // none instead. Mouse events stay preventable to stop text selection.
  const start = (e) => {
    if (!e.touches) e.preventDefault();
    drawingRef.current = true;
    lastRef.current = getPos(e);
  };
  const move = (e) => {
    if (!drawingRef.current) return;
    if (!e.touches) e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const p = getPos(e);
    ctx.strokeStyle = '#2A1A0F';
    ctx.lineWidth = stroke;
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
  };
  const end = () => { drawingRef.current = false; };

  return (
    <div className="view trace">
      <header className="view-head">
        <div>
          <div className="kicker">§ 1.4 · writing</div>
          <h1>Trace the Letter</h1>
          <div className="subtitle-en">Practice the head-line and the body.</div>
        </div>
      </header>

      <p className="lead">
        Tibetan letters hang from an invisible <em>head-line</em> at the top of the body.
        Draw the head-line first, then the body strokes downward. Toggle the ghost guide
        once you want to test your memory.
      </p>

      <div className="trace-layout">
        <div className="trace-stage">
          <div className="trace-frame">
            <div className="trace-line trace-line-head" />
            <div className="trace-line trace-line-base" />
            {showGuide && <div className="trace-ghost">{c.g}</div>}
            <canvas ref={canvasRef}
              className="trace-canvas"
              onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
              onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
          </div>

          {/* Controls sit directly beneath the drawable screen */}
          <div className="trace-toolbar">
            <div className="trace-label mono">No. {String(c.n).padStart(2, '0')} · {c.r} · {toneLabel(c.t)}</div>
            <div className="trace-tools">
              <button className={'toggle' + (showGuide ? ' on' : '')}
                onClick={() => setShowGuide(s => !s)}
                title="Ghost guide" aria-label="Toggle ghost guide">
                <span className="knob" />
              </button>
              <span className="trace-tool-label">Ghost</span>
              <label className="trace-brush">
                <span className="trace-tool-label">Brush</span>
                <input type="range" min="2" max="20" value={stroke} onChange={(e) => setStroke(+e.target.value)} />
                <span className="mono small">{stroke}px</span>
              </label>
              <button className="btn" onClick={clear}>Clear paper</button>
              <button className="btn" onClick={() => go('alphabet', { letter: idx })}>About <span className="ti">{c.g}</span> →</button>
              <button className="btn primary" onClick={() => setIdx((idx + 1) % 30)}>Next letter →</button>
            </div>
          </div>
        </div>

        <div className="trace-panel">
          <div className="panel-section">
            <div className="panel-title">Letter</div>
            <div className="letter-strip">
              {D.consonants.map((cn, i) => (
                <button key={i}
                  className={'letter-pill' + (i === idx ? ' on' : '')}
                  onClick={() => setIdx(i)}>
                  <span className="lp-ti">{cn.g}</span>
                  <span className="lp-r mono">{cn.r}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section tips">
            <div className="panel-title">Notes</div>
            <ol>
              <li>Begin with the horizontal head-line where letters "hang."</li>
              <li>Most strokes travel top-to-bottom and left-to-right.</li>
              <li>Letters of one row share a family form — practise them as a set.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
