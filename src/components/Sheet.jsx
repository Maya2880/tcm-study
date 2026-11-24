import { useRef, useEffect, useState } from 'react';

function runSpring(from, vel0, to, onTick, onDone) {
  const stiffness = 300, damping = 30;
  let pos = from, vel = vel0;
  let raf;
  const step = () => {
    vel += (-stiffness * (pos - to) - damping * vel) / 60;
    pos += vel / 60;
    onTick(pos);
    if (Math.abs(pos - to) < 0.5 && Math.abs(vel) < 0.5) {
      onTick(to);
      onDone?.();
      return;
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

// Progressive resistance past the top edge
function rubberband(x) {
  return (x * 300 * 0.55) / (300 + 0.55 * Math.abs(x));
}

// phase: 'hidden' | 'entering' | 'open' | 'exiting'
export default function Sheet({ open, onClose, children }) {
  const sheetRef = useRef(null);
  const dragRef = useRef(null);
  const cancelRef = useRef(null);
  const [phase, setPhase] = useState(open ? 'entering' : 'hidden');

  const setY = (y) => {
    if (sheetRef.current) sheetRef.current.style.transform = `translateY(${Math.max(0, y)}px)`;
  };

  const getY = () => {
    const m = sheetRef.current?.style.transform?.match(/-?[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  };

  const spring = (from, vel, to, done) => {
    cancelRef.current?.();
    cancelRef.current = runSpring(from, vel, to, setY, done);
  };

  useEffect(() => {
    if (open && phase === 'hidden') setPhase('entering');
    if (!open && (phase === 'open' || phase === 'entering')) setPhase('exiting');
  }, [open]);

  useEffect(() => {
    if (phase === 'entering') {
      requestAnimationFrame(() => {
        if (!sheetRef.current) return;
        const h = sheetRef.current.offsetHeight;
        sheetRef.current.style.transform = `translateY(${h}px)`;
        spring(h, 0, 0, () => setPhase('open'));
      });
    }
    if (phase === 'exiting') {
      const h = sheetRef.current?.offsetHeight ?? 600;
      spring(getY(), 0, h, () => setPhase('hidden'));
    }
  }, [phase]);

  useEffect(() => () => cancelRef.current?.(), []);

  const onHandleDown = (e) => {
    cancelRef.current?.();
    sheetRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, lastY: e.clientY, lastTime: Date.now(), vel: 0 };
    e.stopPropagation();
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const now = Date.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);
    dragRef.current.vel = (e.clientY - dragRef.current.lastY) / (dt / 1000);
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastTime = now;
    const dy = e.clientY - dragRef.current.startY;
    if (sheetRef.current)
      sheetRef.current.style.transform = `translateY(${dy < 0 ? rubberband(dy) : dy}px)`;
  };

  const onPointerUp = (e) => {
    if (!dragRef.current) return;
    const dy = e.clientY - dragRef.current.startY;
    const vel = dragRef.current.vel;
    dragRef.current = null;
    const h = sheetRef.current?.offsetHeight ?? 600;
    if (dy > 100 || vel > 400) {
      spring(Math.max(0, dy), vel, h, onClose);
    } else {
      spring(dy, vel, 0);
    }
  };

  if (phase === 'hidden') return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div
        ref={sheetRef}
        className="modal"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="sheet-handle" onPointerDown={onHandleDown} />
        {children}
      </div>
    </div>
  );
}
