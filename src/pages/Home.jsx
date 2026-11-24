import { organs } from '../data/organs';
import { points } from '../data/points';
import { cases, flashcards } from '../data/cases';
import { elements } from '../data/elements';
import { useLang } from '../context/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import {
  LearnIcon, OrgansIcon, PointsIcon, ElementsIcon, StudyIcon, CasesIcon,
  QuizIcon, FireIcon, BoltIcon, LogoLeafIcon,
} from '../components/NavIcons';

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };

const pill = {
  display: 'flex', alignItems: 'center', gap: 10,
  background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '10px 16px',
};

const quickLinks = [
  { id: 'organs',   Icon: OrgansIcon,   title: 'תורת האיברים',    titleEn: 'Organs',        desc: `${organs.length} איברים עם פונקציות מלאות`, descEn: `${organs.length} organs with full functions`, color: '#7c83f5' },
  { id: 'points',   Icon: PointsIcon,   title: 'נקודות טצובו',    titleEn: 'Acupoints',     desc: `${points.length} נקודות עם לוקציה ותוויות`, descEn: `${points.length} points with location & tags`, color: '#66bb6a' },
  { id: 'elements', Icon: ElementsIcon, title: 'חמשת היסודות',   titleEn: '5 Elements',    desc: 'עץ, אש, אדמה, מתכת, מים', descEn: 'Wood, Fire, Earth, Metal, Water', color: '#ffa726' },
  { id: 'study',    Icon: StudyIcon,    title: 'כרטיסיות לימוד', titleEn: 'Flashcards',    desc: `${flashcards.length} כרטיסיות לחזרה`, descEn: `${flashcards.length} cards to review`, color: '#ce93d8' },
  { id: 'quiz',     Icon: QuizIcon,     title: 'בחנות',           titleEn: 'Quizzes',       desc: 'בחנות ידע אינטראקטיביות', descEn: 'Test your knowledge', color: '#26c6da' },
  { id: 'cases',    Icon: CasesIcon,    title: 'מקרי מטופלים',   titleEn: 'Case Studies',  desc: `${cases.length} מקרים קליניים לתרגול`, descEn: `${cases.length} clinical cases`, color: '#ef5350' },
];

export default function Home({ onNavigate }) {
  const { lang } = useLang();
  const { streak, xp, level, xpInLevel, XP_PER_LEVEL } = useProgress();
  const isHe = lang === 'he';

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg3))', borderRadius: 16, padding: '28px 32px', marginBottom: 20, border: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 8, color: 'var(--accent)', opacity: 0.7 }}>
          <LogoLeafIcon size={28} />
        </div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>{isHe ? 'ברוכה הבאה, מאיה' : 'Welcome back, Maya'}</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>
          {isHe ? 'מדריך לימוד שיאצו ורפואה סינית | מכללת תמורות — שנה א\'' : 'Shiatsu & TCM Study Guide | Tamura College — Year 1'}
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { label: isHe ? 'איברים'    : 'Organs',     value: organs.length,     color: '#7c83f5' },
            { label: isHe ? 'נקודות'    : 'Points',     value: points.length,     color: '#66bb6a' },
            { label: isHe ? 'כרטיסיות' : 'Cards',      value: flashcards.length, color: '#ce93d8' },
            { label: isHe ? 'מקרים'     : 'Cases',      value: cases.length,      color: '#ef5350' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Streak shelf ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Streak */}
        <div style={pill}>
          <span style={{ color: 'var(--fire)' }}><FireIcon size={22} /></span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fire)', lineHeight: 1 }}>
              {streak.count > 0 ? streak.count : (isHe ? 'התחל!' : 'Go!')}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
              {streak.count > 0 ? (isHe ? 'רצף ימים' : 'Day streak') : (isHe ? 'למד היום' : 'Start today')}
            </div>
          </div>
        </div>
        {/* Total XP */}
        <div style={pill}>
          <span style={{ color: 'var(--gold)' }}><BoltIcon size={22} /></span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{xp}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>Total XP</div>
          </div>
        </div>
        {/* Level mini-bar */}
        <div style={{ flex: 1, minWidth: 160, ...pill, gap: 8 }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
            {isHe ? 'רמה' : 'Lv.'} {level}
          </div>
          <div style={{ flex: 1, height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.round((xpInLevel / XP_PER_LEVEL) * 100)}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              borderRadius: 3,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{xpInLevel}/{XP_PER_LEVEL}</div>
        </div>
      </div>

      {/* ── Continue learning CTA ── */}
      <button
        onClick={() => onNavigate('learn')}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(124,131,245,0.18), rgba(156,65,240,0.14))',
          border: '1px solid rgba(124,131,245,0.35)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 24,
          cursor: 'pointer',
          color: 'var(--text)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(124,131,245,0.35)'; e.currentTarget.style.transform = ''; }}
      >
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>
            {isHe ? '→ המשך ללמוד' : '→ Continue Learning'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>
            {isHe ? 'מסלול לימוד גיימיפיקציה — XP, עיטורים ורמות' : 'Gamified path — XP, badges & levels'}
          </div>
        </div>
        <span style={{ color: 'var(--accent)', opacity: 0.8 }}><LearnIcon /></span>
      </button>

      {/* Quick links */}
      <h2 style={{ marginBottom: 14 }}>{isHe ? 'חומר לימוד' : 'Study Sections'}</h2>
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {quickLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '18px 20px',
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'all 0.15s',
              color: 'var(--text)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
          >
            <div style={{ color: link.color, marginBottom: 8 }}><link.Icon /></div>
            <div style={{ fontWeight: 600, marginBottom: 4, color: link.color }}>{isHe ? link.title : link.titleEn}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{isHe ? link.desc : link.descEn}</div>
          </button>
        ))}
      </div>

      {/* 5 Elements summary */}
      <h2 style={{ marginBottom: 14 }}>{isHe ? 'חמשת היסודות — סיכום מהיר' : '5 Elements — Quick Reference'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 32 }}>
        {elements.map((el) => (
          <div key={el.id} style={{ background: 'var(--bg2)', border: `1px solid ${elementColors[el.id]}30`, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ color: elementColors[el.id], fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>{el.nameHe}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 4 }}>{el.season}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 4 }}>{el.emotion}</div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              {el.organs.map((o) => (
                <span key={o} style={{ background: `${elementColors[el.id]}20`, color: elementColors[el.id], fontSize: '0.65rem', padding: '2px 6px', borderRadius: 20, fontWeight: 600 }}>
                  {o.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick reference tip */}
      <div style={{ background: 'rgba(124,131,245,0.08)', border: '1px solid rgba(124,131,245,0.2)', borderRadius: 12, padding: '16px 20px' }}>
        <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--accent)' }}>{isHe ? 'טיפ לימוד' : 'Study Tip'}</div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7 }}>
          {isHe
            ? <>עבור על <strong>תורת האיברים</strong> לפי יסוד (עץ → אש → אדמה → מתכת → מים). לאחר מכן תרגל עם <strong>כרטיסיות הלימוד</strong> ובחן את עצמך במקרים. נקודות Back-Shu חשובות לאבחון: UB13=ריאות, UB15=לב, UB18=כבד, UB20=טחול, UB23=כליות.</>
            : <>Study <strong>Organs</strong> by element (Wood → Fire → Earth → Metal → Water). Then reinforce with <strong>Flashcards</strong> and test yourself with Case Studies. Key Back-Shu points: UB13=Lungs, UB15=Heart, UB18=Liver, UB20=Spleen, UB23=Kidneys.</>
          }
        </p>
      </div>
    </div>
  );
}
