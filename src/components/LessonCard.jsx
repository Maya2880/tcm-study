import { ReadStepIcon, TapStepIcon, MatchStepIcon, PlayIcon, LockIcon } from './NavIcons';

const STEP_ICON = {
  read:  <ReadStepIcon size={12} />,
  tap:   <TapStepIcon size={12} />,
  match: <MatchStepIcon size={12} />,
};

export default function LessonCard({ lesson, lang, done, open, unitColor, onStart }) {
  const isHe = lang === 'he';
  const title = isHe ? lesson.titleHe : lesson.titleEn;

  const bg    = done ? `color-mix(in srgb, ${unitColor} 10%, var(--bg2))` : open ? 'var(--bg2)' : 'var(--bg)';
  const border = done ? `color-mix(in srgb, ${unitColor} 40%, transparent)` : open ? 'var(--border)' : 'rgba(255,255,255,0.04)';

  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 12,
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      opacity: open ? 1 : 0.45, transition: 'all 0.15s',
    }}>
      {/* Status dot */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? unitColor : open ? `color-mix(in srgb, ${unitColor} 20%, transparent)` : 'var(--bg3)',
        border: done ? 'none' : `1px solid ${open ? unitColor : 'var(--border)'}`,
        color: done ? '#fff' : open ? unitColor : 'var(--text3)',
      }}>
        {done ? '✓' : open ? <PlayIcon size={12} /> : <LockIcon size={12} />}
      </div>

      {/* Title + steps */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: done ? unitColor : open ? 'var(--text)' : 'var(--text3)' }}>
          {title}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
          {(lesson.steps ?? []).map((s) => (
            <span key={s} style={{ fontSize: '0.68rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 2 }}>
              {STEP_ICON[s]} {s}
            </span>
          ))}
        </div>
      </div>

      {/* XP */}
      <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600, flexShrink: 0 }}>
        +{lesson.xp} XP
      </div>

      {/* Button / done label */}
      {!done && open && (
        <button
          onClick={onStart}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.93)'; e.currentTarget.style.transition = 'transform 60ms ease'; }}
          onPointerUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.transition = 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)'; }}
          onPointerLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.transition = ''; }}
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            border: 'none', borderRadius: 8, color: '#fff',
            padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600,
            flexShrink: 0, cursor: 'pointer',
          }}
        >
          {isHe ? 'התחל' : 'Start'}
        </button>
      )}
      {done && (
        <span style={{ fontSize: '0.72rem', color: unitColor, fontWeight: 600, flexShrink: 0 }}>
          {isHe ? 'הושלם' : 'Done'}
        </span>
      )}
    </div>
  );
}
