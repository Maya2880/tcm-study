export {
  Home          as HomeIcon,
  BookOpen      as LearnIcon,
  HeartPulse    as OrgansIcon,
  Crosshair     as PointsIcon,
  Layers        as ElementsIcon,
  Compass       as PrinciplesIcon,
  ClipboardList as IntakeIcon,
  BookMarked    as ProtocolsIcon,
  CreditCard    as StudyIcon,
  HelpCircle    as QuizIcon,
  Shuffle       as CardPlaysIcon,
  Briefcase     as CasesIcon,
  MessageSquare as ChatIcon,
  BarChart2     as ProgressIcon,
  Globe         as ResourcesIcon,
} from 'lucide-react'

// ── Inline status / lesson icons ─────────────────────────────────────────────

export function FireIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2c0 4-5 5-4 10a6 6 0 0012 0c0-5-3.5-5.5-4-9-1.5 2-1.5 4-4 4z" />
    </svg>
  )
}

export function BoltIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 11h6l-2 7 8-9h-6l2-7z" />
    </svg>
  )
}

export function LockIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="12" height="9" rx="2" />
      <path d="M7 9V7a3 3 0 016 0v2" />
    </svg>
  )
}

export function CheckCircleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.5 10.5l2.5 2.5 4.5-4.5" />
    </svg>
  )
}

export function PlayIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 4.5l9 5.5-9 5.5V4.5z" />
    </svg>
  )
}

export function StarIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2 11.9 7.4 17.6 7.5 13.1 11 14.9 16.5 10 13.3 5.1 16.5 6.9 11 2.4 7.5 8.1 7.4z" />
    </svg>
  )
}

export function TrophyIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h8v7a4 4 0 01-8 0V2z" />
      <path d="M4 4H2.5a1.5 1.5 0 000 3H4" />
      <path d="M16 4h1.5a1.5 1.5 0 010 3H16" />
      <path d="M10 13v4" />
      <path d="M6.5 17h7" />
    </svg>
  )
}

export function ReadStepIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h12M4 9h8M4 13h10" />
    </svg>
  )
}

export function TapStepIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3a4 4 0 014 4v1l3 4-1.5 1-2-2v4a1.5 1.5 0 01-3 0v-2a1.5 1.5 0 01-3 0V7a3 3 0 013-4z" />
    </svg>
  )
}

export function MatchStepIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="5" height="4" rx="1" />
      <rect x="13" y="4" width="5" height="4" rx="1" />
      <rect x="2" y="12" width="5" height="4" rx="1" />
      <rect x="13" y="12" width="5" height="4" rx="1" />
      <line x1="7" y1="6" x2="13" y2="6" />
      <line x1="7" y1="14" x2="13" y2="14" />
    </svg>
  )
}

// ── Unit / element icons ──────────────────────────────────────────────────────

export function FlameIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 18c-4 0-7-2.5-7-6.5 0-3 2-4.5 2-7 2 1 2.5 3 2.5 3s1-2 .5-5C10 4 13 7 13 7s.5-2 0-4c3 2 4 5 4 8.5 0 4-2.5 6.5-7 6.5z" />
    </svg>
  )
}

export function WaterDropIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2c0 0-7 7-7 11a7 7 0 0014 0c0-4-7-11-7-11z" />
    </svg>
  )
}

export function TreeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2L4 10h3l-3 5h5v3h2v-3h5l-3-5h3L10 2z" />
    </svg>
  )
}

export function MountainIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17L8 7l3 4 2-3 5 9H2z" />
    </svg>
  )
}

export function WindIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10a2.5 2.5 0 000-5 2.5 2.5 0 00-2.5 2.5" />
      <path d="M3 12h13a2.5 2.5 0 010 5 2.5 2.5 0 01-2.5-2.5" />
      <path d="M3 10h8" />
    </svg>
  )
}

export function AwardIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="8" r="5" />
      <path d="M6.5 13.5L5 18l5-2 5 2-1.5-4.5" />
    </svg>
  )
}

export function MetalIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h10l2 4-7 9-7-9 2-4z" />
      <path d="M5 4l3 4h4l3-4" />
    </svg>
  )
}

// Map iconType string → JSX unit badge icon
export function UnitIcon({ type, size = 20 }) {
  const icons = {
    lungs:    <OrgansIcon />,
    water:    <WaterDropIcon size={size} />,
    wood:     <TreeIcon size={size} />,
    fire:     <FlameIcon size={size} />,
    earth:    <MountainIcon size={size} />,
    wind:     <WindIcon size={size} />,
    'yin-yang': <PrinciplesIcon />,
    metal:    <MetalIcon size={size} />,
  };
  return (
    <span style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icons[type] ?? <StarIcon size={size} />}
    </span>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

export function LogoLeafIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* stem */}
      <path d="M10 17.5v-6" />
      {/* left leaf */}
      <path d="M10 15c-3.5-.5-5.5-3-4.5-6C6.5 6 10 6.5 10 11.5" />
      {/* right leaf */}
      <path d="M10 11.5C10 6.5 13.5 6 14.5 9c1 3-1 5.5-4.5 6" />
    </svg>
  )
}
