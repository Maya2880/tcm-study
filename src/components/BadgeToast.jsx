import { useEffect, useState } from 'react';
import { StarIcon, AwardIcon, FireIcon, BoltIcon, TrophyIcon } from './NavIcons';

const ICON_MAP = {
  star:    <StarIcon size={28} />,
  award:   <AwardIcon size={28} />,
  fire:    <FireIcon size={28} />,
  bolt:    <BoltIcon size={28} />,
  trophy:  <TrophyIcon size={28} />,
};

export default function BadgeToast({ badge, lang, onDone }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    if (!badge) return;
    setPhase('enter');
    const stay = setTimeout(() => setPhase('stay'), 50);
    const exit = setTimeout(() => setPhase('exit'), 2800);
    const done = setTimeout(() => onDone?.(), 3300);
    return () => { clearTimeout(stay); clearTimeout(exit); clearTimeout(done); };
  }, [badge]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!badge) return null;

  const title = lang === 'he' ? badge.labelHe : badge.labelEn;
  const icon  = ICON_MAP[badge.icon] ?? ICON_MAP.star;

  const translateY = phase === 'stay' ? 0 : 80;
  const opacity    = phase === 'stay' ? 1 : 0;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 90px)',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--bg2)',
        border: '1px solid var(--gold)',
        borderRadius: 14,
        padding: '12px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,213,79,0.15)',
        minWidth: 220,
        maxWidth: 320,
      }}
    >
      <span style={{ color: 'var(--gold)', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {lang === 'he' ? 'עיטור חדש!' : 'Badge Earned!'}
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', marginTop: 1 }}>{title}</div>
      </div>
    </div>
  );
}
