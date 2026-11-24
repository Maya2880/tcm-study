import { useState, useCallback, useEffect, useRef } from 'react';
import { flashcards } from '../data/cases';
import { useLang } from '../context/LanguageContext';

const LEITNER_KEY = 'tcm-srs-v1';
const INTERVALS_MS = [0, 86400000, 259200000, 604800000, Infinity]; // 0,1,3,7,∞ days

function loadSRS() {
  try { return JSON.parse(localStorage.getItem(LEITNER_KEY) || '{}'); }
  catch { return {}; }
}
function saveSRS(state) {
  localStorage.setItem(LEITNER_KEY, JSON.stringify(state));
}
function getCardInfo(srs, id) {
  return srs[id] || { box: 0, nextReview: 0 };
}
function isDue(srs, id) {
  const info = getCardInfo(srs, id);
  if (info.box >= 4) return false;
  return Date.now() >= info.nextReview;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const categories = [
  { id: 'all',      he: 'הכל',    en: 'All' },
  { id: 'organs',   he: 'איברים', en: 'Organs' },
  { id: 'points',   he: 'נקודות', en: 'Points' },
  { id: 'elements', he: 'יסודות', en: 'Elements' },
  { id: 'patterns', he: 'דפוסים', en: 'Patterns' },
];

const BOX_LABEL = ['חדש', 'יום', '3 ימים', 'שבוע', 'שלטון'];
const BOX_COLOR = ['var(--text3)', 'var(--water)', 'var(--wood)', 'var(--earth)', 'var(--gold)'];

export default function StudyPage() {
  const { lang } = useLang();
  const [mode, setMode] = useState('free'); // 'free' | 'srs'
  const [category, setCategory] = useState('all');
  const [srs, setSrs] = useState(() => loadSRS());
  const [deck, setDeck] = useState(() => shuffle(flashcards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);
  const [justAnswered, setJustAnswered] = useState(null); // 'known' | 'unknown'

  const touchStart = useRef(null);

  const filtered = (() => {
    const base = category === 'all' ? deck : deck.filter(c => c.category === category);
    if (mode === 'srs') return base.filter(c => isDue(srs, c.id));
    return base;
  })();

  const current = filtered[index];
  const dueCount = flashcards.filter(c => isDue(srs, c.id)).length;
  const masteredCount = flashcards.filter(c => (srs[c.id]?.box || 0) >= 4).length;

  const reset = useCallback(() => {
    setDeck(shuffle(flashcards));
    setIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false); setJustAnswered(null);
  }, []);

  const changeMode = (m) => {
    setMode(m);
    setIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false); setJustAnswered(null);
  };

  const advance = useCallback(() => {
    setFlipped(false);
    setJustAnswered(null);
    setTimeout(() => {
      if (index + 1 >= filtered.length) setDone(true);
      else setIndex(i => i + 1);
    }, 60);
  }, [index, filtered.length]);

  const handleKnow = useCallback(() => {
    setKnown(k => [...k, current.id]);
    setJustAnswered('known');
    if (mode === 'srs') {
      const info = getCardInfo(srs, current.id);
      const newBox = Math.min(info.box + 1, 4);
      const updated = { ...srs, [current.id]: { box: newBox, nextReview: Date.now() + INTERVALS_MS[newBox] } };
      setSrs(updated); saveSRS(updated);
    }
    setTimeout(advance, 400);
  }, [current, mode, srs, advance]);

  const handleDontKnow = useCallback(() => {
    setUnknown(u => [...u, current.id]);
    setJustAnswered('unknown');
    if (mode === 'srs') {
      const updated = { ...srs, [current.id]: { box: 0, nextReview: Date.now() } };
      setSrs(updated); saveSRS(updated);
    }
    setTimeout(advance, 400);
  }, [current, mode, srs, advance]);

  // Swipe support
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (!flipped) return;
    if (dx > 60) handleKnow();
    else if (dx < -60) handleDontKnow();
  };

  if (done) {
    const total = known.length + unknown.length;
    const pct = total > 0 ? Math.round((known.length / total) * 100) : 0;
    const scoreChar = pct >= 80 ? '✦' : pct >= 50 ? '◎' : '◇';
    return (
      <div>
        <div className="page-header">
          <h1>{lang === 'he' ? 'כרטיסיות לימוד' : 'Flashcards'}</h1>
        </div>
        <div style={{ maxWidth: 440, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12, lineHeight: 1, color: 'var(--accent)' }}>{scoreChar}</div>
          <h2 style={{ marginBottom: 8 }}>{lang === 'he' ? 'סבב הסתיים!' : 'Round complete!'}</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 28 }}>
            {lang === 'he' ? `ידעת ${known.length} מתוך ${total} (${pct}%)` : `You knew ${known.length} of ${total} (${pct}%)`}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
            <StatBubble value={known.length} label={lang === 'he' ? 'ידעתי' : 'Known'} color="var(--wood)" bg="rgba(102,187,106,0.1)" />
            <StatBubble value={unknown.length} label={lang === 'he' ? 'לחזור' : 'Review'} color="var(--fire)" bg="rgba(239,83,80,0.1)" />
            {mode === 'srs' && <StatBubble value={masteredCount} label={lang === 'he' ? 'שלטון' : 'Mastered'} color="var(--gold)" bg="rgba(255,213,79,0.1)" />}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={reset} style={btnStyle('var(--accent)', 'white')}>
              ↩ {lang === 'he' ? 'סבב חדש' : 'New round'}
            </button>
            {unknown.length > 0 && (
              <button
                onClick={() => {
                  const wrongCards = flashcards.filter(c => unknown.includes(c.id));
                  setDeck(shuffle(wrongCards));
                  setIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false); setJustAnswered(null);
                }}
                style={btnStyle('rgba(239,83,80,0.15)', 'var(--fire)', '1px solid rgba(239,83,80,0.3)')}
              >
                {lang === 'he' ? `חזור על שגיאות (${unknown.length})` : `Retry mistakes (${unknown.length})`}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>{lang === 'he' ? 'כרטיסיות לימוד' : 'Flashcards'}</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>
          {lang === 'he' ? 'לחץ לחשיפת התשובה · החלק ימין=ידעתי' : 'Tap to reveal · Swipe right=known'}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        <button className={`tab ${mode === 'free' ? 'active' : ''}`} onClick={() => changeMode('free')}>
          {lang === 'he' ? 'חופשי' : 'Free browse'}
        </button>
        <button className={`tab ${mode === 'srs' ? 'active' : ''}`} onClick={() => changeMode('srs')}>
          {lang === 'he' ? 'חזרה חכמה' : 'Smart review'}
          {dueCount > 0 && (
            <span style={{ background: 'var(--fire)', color: 'white', borderRadius: 10, fontSize: '0.65rem', padding: '1px 6px', marginRight: 6 }}>
              {dueCount}
            </span>
          )}
        </button>
      </div>

      {/* SRS stats bar */}
      {mode === 'srs' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {BOX_LABEL.map((label, i) => {
            const count = flashcards.filter(c => (srs[c.id]?.box || 0) === i).length;
            if (i === 4) {
              const mastCount = flashcards.filter(c => (srs[c.id]?.box || 0) >= 4).length;
              return (
                <span key={i} style={{ fontSize: '0.72rem', color: BOX_COLOR[i], background: 'rgba(255,213,79,0.08)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(255,213,79,0.15)' }}>
                  {label} {mastCount}
                </span>
              );
            }
            return (
              <span key={i} style={{ fontSize: '0.72rem', color: BOX_COLOR[i], background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--border)' }}>
                {label} {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setCategory(cat.id); setIndex(0); setFlipped(false); setDone(false); }}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', border: '1px solid',
              background: category === cat.id ? 'var(--accent)' : 'transparent',
              borderColor: category === cat.id ? 'var(--accent)' : 'var(--border)',
              color: category === cat.id ? 'white' : 'var(--text2)',
              transition: 'all 0.15s',
            }}
          >
            {cat[lang]}
          </button>
        ))}
      </div>

      {/* SRS empty state */}
      {mode === 'srs' && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12, color: 'var(--gold)' }}>★</div>
          <h3 style={{ marginBottom: 8 }}>{lang === 'he' ? 'אין כרטיסיות להיום!' : 'Nothing due today!'}</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{lang === 'he' ? 'כל הכרטיסיות נלמדו. חזור מחר.' : 'All cards are reviewed. Come back tomorrow.'}</p>
        </div>
      )}

      {current && (
        <>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 6 }}>
            <span>{index + 1} / {filtered.length}</span>
            {mode === 'srs' && (
              <span style={{ color: BOX_COLOR[srs[current.id]?.box || 0] }}>
                {BOX_LABEL[srs[current.id]?.box || 0]}
              </span>
            )}
            <span>
              <span style={{ color: 'var(--wood)' }}>✓ {known.length}</span>
              {'  '}
              <span style={{ color: 'var(--fire)' }}>✗ {unknown.length}</span>
            </span>
          </div>
          <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(index / filtered.length) * 100}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 0.3s ease' }} />
          </div>

          {/* 3D Flip Card */}
          <div
            style={{ perspective: '1200px', marginBottom: 28, cursor: 'pointer' }}
            onClick={() => !flipped && setFlipped(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                position: 'relative',
                minHeight: 200,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1)',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front face */}
              <div style={{
                ...faceStyle,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {categories.find(c => c.id === current.category)?.[lang] || current.category}
                </div>
                <div style={{ fontSize: '1.08rem', lineHeight: 1.65, color: 'var(--text)' }}>{current.question}</div>
                <div style={{ marginTop: 16, fontSize: '0.72rem', color: 'var(--text3)' }}>
                  {lang === 'he' ? 'לחץ לגילוי התשובה' : 'Tap to reveal'}
                </div>
              </div>

              {/* Back face */}
              <div style={{
                ...faceStyle,
                background: 'rgba(124,131,245,0.06)',
                border: '1px solid rgba(124,131,245,0.2)',
                transform: 'rotateY(180deg)',
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {lang === 'he' ? 'תשובה' : 'Answer'}
                </div>
                <div style={{ fontSize: '1.0rem', lineHeight: 1.7, color: 'var(--text)' }}>{current.answer}</div>
                <div style={{ marginTop: 14, fontSize: '0.72rem', color: 'var(--text3)' }}>
                  {lang === 'he' ? 'החלק ימין = ידעתי · שמאל = לחזור' : 'Swipe right = known · left = review'}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!flipped ? (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setFlipped(true)} style={btnStyle('var(--accent)', 'white', undefined, '12px 36px')}>
                {lang === 'he' ? 'הצג תשובה' : 'Show answer'}
              </button>
              <button onClick={advance} style={btnStyle('var(--bg3)', 'var(--text2)', '1px solid var(--border)', '12px 20px')}>
                {lang === 'he' ? 'דלג' : 'Skip'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={handleDontKnow}
                style={{
                  ...btnStyle('rgba(239,83,80,0.12)', 'var(--fire)', '1px solid rgba(239,83,80,0.3)', '12px 0'),
                  flex: 1, maxWidth: 180,
                  opacity: justAnswered === 'known' ? 0.4 : 1,
                  transform: justAnswered === 'unknown' ? 'scale(0.96)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              >
                ✗ {lang === 'he' ? 'לא ידעתי' : "Didn't know"}
              </button>
              <button
                onClick={handleKnow}
                style={{
                  ...btnStyle('rgba(102,187,106,0.12)', 'var(--wood)', '1px solid rgba(102,187,106,0.3)', '12px 0'),
                  flex: 1, maxWidth: 180,
                  opacity: justAnswered === 'unknown' ? 0.4 : 1,
                  transform: justAnswered === 'known' ? 'scale(0.96)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              >
                ✓ {lang === 'he' ? 'ידעתי' : 'Knew it'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatBubble({ value, label, color, bg }) {
  return (
    <div style={{ background: bg, border: `1px solid ${color}30`, borderRadius: 12, padding: '14px 20px', textAlign: 'center', minWidth: 80 }}>
      <div style={{ fontSize: '1.6rem', color, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{label}</div>
    </div>
  );
}

const faceStyle = {
  position: 'absolute',
  inset: 0,
  borderRadius: 16,
  padding: '24px',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 200,
};

function btnStyle(bg, color, border, padding = '12px 28px') {
  return { background: bg, color, border: border || 'none', borderRadius: 12, padding, fontSize: '0.9rem', transition: 'all 0.15s', cursor: 'pointer' };
}
