import { useEffect, useRef, useState } from 'react';
import { useLang } from '../context/LanguageContext';

const T = {
  level: { he: 'רמה', en: 'Level' },
  xpTo:  { he: 'נק׳ לרמה הבאה', en: 'XP to next level' },
};

export default function XPBar({ level, xpInLevel, xpPerLevel }) {
  const { lang } = useLang();
  const pct = Math.min(100, Math.round((xpInLevel / xpPerLevel) * 100));

  // animate fill on mount / change
  const [displayPct, setDisplayPct] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = displayPct;
    const to = pct;
    const dur = 600;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayPct(Math.round(from + (to - from) * ease));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pct]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Level badge */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        borderRadius: 10,
        width: 40, height: 40,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>{T.level[lang]}</span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{level}</span>
      </div>

      {/* Bar + label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
            {xpInLevel} / {xpPerLevel} XP
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
            {displayPct}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: 8, borderRadius: 4 }}>
          <div
            className="progress-fill"
            style={{
              width: `${displayPct}%`,
              height: '100%',
              borderRadius: 4,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              boxShadow: displayPct > 0 ? '0 0 8px rgba(124,131,245,0.5)' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
