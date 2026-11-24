import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { points } from '../data/points';
import { organs } from '../data/organs';
import { flashcards } from '../data/cases';
import { enrichPointsWithZenDikur } from '../data/zen-dikur-points';
import { useLang } from '../context/LanguageContext';

const enrichedPoints = enrichPointsWithZenDikur(points);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Memory Match ──────────────────────────────────────────────────────────

const MATCH_DECKS = [
  {
    id: 'code_poetic',
    he: 'קוד ↔ שם פיוטי (Zen-Dikur)',
    en: 'Code ↔ Poetic name (Zen-Dikur)',
    build: () => {
      const pool = shuffle(enrichedPoints.filter(p => p.poeticHe)).slice(0, 6);
      return pool.flatMap(p => [
        { id: `${p.code}_a`, pairId: p.code, text: p.code, type: 'code', color: 'var(--accent)' },
        { id: `${p.code}_b`, pairId: p.code, text: p.poeticHe, type: 'name', color: 'var(--gold)' },
      ]);
    },
  },
  {
    id: 'code_cn',
    he: 'קוד ↔ שם סיני',
    en: 'Code ↔ Chinese name',
    build: () => {
      const pool = shuffle(points.filter(p => p.nameCn)).slice(0, 6);
      return pool.flatMap(p => [
        { id: `${p.code}_a`, pairId: p.code, text: p.code, type: 'code', color: 'var(--accent)' },
        { id: `${p.code}_b`, pairId: p.code, text: p.nameCn, type: 'name', color: 'var(--water)' },
      ]);
    },
  },
  {
    id: 'organ_emotion',
    he: 'איבר ↔ רגש',
    en: 'Organ ↔ Emotion',
    build: () => {
      const pool = shuffle(organs.filter(o => o.emotionHe)).slice(0, 6);
      return pool.flatMap(o => [
        { id: `${o.id}_a`, pairId: o.id, text: o.nameHe, type: 'organ', color: 'var(--wood)' },
        { id: `${o.id}_b`, pairId: o.id, text: o.emotionHe.split('/')[0].trim(), type: 'emotion', color: 'var(--fire)' },
      ]);
    },
  },
];

function MemoryMatch({ lang }) {
  const [deckId, setDeckId] = useState('code_poetic');
  const [cards, setCards] = useState(() => shuffle(MATCH_DECKS[0].build()));
  const [flipped, setFlipped] = useState([]); // indices of face-up cards
  const [matched, setMatched] = useState([]); // pairIds matched
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [locked, setLocked] = useState(false);
  const [wrongFlash, setWrongFlash] = useState([]);
  const intervalRef = useRef(null);
  const bestRef = useRef(null);

  // Timer
  useEffect(() => {
    if (running && !done) {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, done]);

  const startNew = useCallback((id = deckId) => {
    const deck = MATCH_DECKS.find(d => d.id === id) || MATCH_DECKS[0];
    setCards(shuffle(deck.build()));
    setFlipped([]); setMatched([]); setMoves(0); setTimer(0);
    setRunning(false); setDone(false); setLocked(false); setWrongFlash([]);
    setDeckId(id);
  }, [deckId]);

  const flip = useCallback((idx) => {
    if (locked) return;
    if (flipped.includes(idx)) return;
    if (matched.includes(cards[idx].pairId)) return;

    if (!running) setRunning(true);

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (cards[a].pairId === cards[b].pairId && cards[a].id !== cards[b].id) {
        // Match!
        const newMatched = [...matched, cards[a].pairId];
        setTimeout(() => {
          setMatched(newMatched);
          setFlipped([]);
          setLocked(false);
          if (newMatched.length === cards.length / 2) {
            setDone(true);
            setRunning(false);
          }
        }, 400);
      } else {
        // No match
        setWrongFlash(newFlipped);
        setTimeout(() => {
          setFlipped([]);
          setWrongFlash([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [locked, flipped, matched, cards, running]);

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (done) {
    const stars = moves <= cards.length ? 3 : moves <= cards.length * 1.5 ? 2 : 1;
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: 8, color: 'var(--gold)' }}>{'★'.repeat(stars)}</div>
        <h3 style={{ marginBottom: 6 }}>{lang === 'he' ? 'כל הצמדים נמצאו!' : 'All pairs matched!'}</h3>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>
          {moves} {lang === 'he' ? 'ניסיונות' : 'moves'} · {fmtTime(timer)}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => startNew()} style={btn('var(--accent)', 'white')}>
            ↩ {lang === 'he' ? 'סבב חדש' : 'New round'}
          </button>
          {MATCH_DECKS.filter(d => d.id !== deckId).map(d => (
            <button key={d.id} onClick={() => startNew(d.id)} style={btn('var(--bg3)', 'var(--text2)', '1px solid var(--border)')}>
              {d[lang]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Deck selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {MATCH_DECKS.map(d => (
          <button key={d.id} onClick={() => startNew(d.id)}
            style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.82rem', border: '1px solid', cursor: 'pointer',
              background: deckId === d.id ? 'var(--accent)' : 'transparent',
              borderColor: deckId === d.id ? 'var(--accent)' : 'var(--border)',
              color: deckId === d.id ? 'white' : 'var(--text2)' }}>
            {d[lang]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, fontSize: '0.85rem', color: 'var(--text3)' }}>
        <span>{fmtTime(timer)}</span>
        <span>{moves} {lang === 'he' ? 'ניסיונות' : 'moves'}</span>
        <span>✓ {matched.length} / {cards.length / 2} {lang === 'he' ? 'צמדים' : 'pairs'}</span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {cards.map((card, idx) => {
          const isFaceUp = flipped.includes(idx) || matched.includes(card.pairId);
          const isMatched = matched.includes(card.pairId);
          const isWrong = wrongFlash.includes(idx);

          return (
            <div key={card.id} onClick={() => flip(idx)}
              style={{ perspective: '600px', cursor: isMatched ? 'default' : 'pointer', aspectRatio: '1 / 1.1' }}>
              <div style={{
                width: '100%', height: '100%', position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)',
                transform: isFaceUp ? 'rotateY(180deg)' : 'rotateY(0)',
              }}>
                {/* Back */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  borderRadius: 12, background: 'var(--bg2)', border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em',
                }}>TCM</div>
                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)', borderRadius: 12, padding: 8,
                  background: isMatched ? 'rgba(102,187,106,0.12)' : isWrong ? 'rgba(239,83,80,0.12)' : `${card.color}12`,
                  border: `1.5px solid ${isMatched ? 'rgba(102,187,106,0.4)' : isWrong ? 'rgba(239,83,80,0.4)' : card.color + '40'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  fontSize: card.text.length > 8 ? '0.72rem' : '0.9rem',
                  fontWeight: 600, lineHeight: 1.4,
                  color: isMatched ? 'var(--wood)' : isWrong ? 'var(--fire)' : card.color,
                  fontFamily: card.type === 'code' ? 'monospace' : 'inherit',
                  transition: 'background 0.3s, border-color 0.3s',
                }}>
                  {isMatched && <span style={{ position: 'absolute', top: 4, right: 6, fontSize: '0.65rem' }}>✓</span>}
                  {card.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Speed Drill ───────────────────────────────────────────────────────────

const SPEED_SOURCES = {
  points_cn: {
    he: 'נקודות → שם סיני',
    en: 'Points → Chinese name',
    make: () => points.filter(p => p.nameCn).map(p => ({
      id: p.code, prompt: p.code, answer: p.nameCn, hint: p.nameHe,
    })),
  },
  points_poetic: {
    he: 'נקודות → שם פיוטי (Zen-Dikur)',
    en: 'Points → Poetic name (Zen-Dikur)',
    make: () => enrichedPoints.filter(p => p.poeticHe).map(p => ({
      id: p.code, prompt: p.code, answer: p.poeticHe, hint: p.nameCn || '',
    })),
  },
  flashcards: {
    he: 'כרטיסיות מהירות',
    en: 'Quick flashcards',
    make: () => flashcards.map(f => ({
      id: f.id, prompt: f.question, answer: f.answer, hint: f.category,
    })),
  },
};

const DURATION = 60;

function SpeedDrill({ lang }) {
  const [sourceId, setSourceId] = useState('points_cn');
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [history, setHistory] = useState([]); // { correct: bool }
  const timerRef = useRef(null);
  const [justScored, setJustScored] = useState(null); // '+1' | '+2' | '+3'

  const pct = (timeLeft / DURATION) * 100;
  const timeColor = timeLeft > 20 ? 'var(--wood)' : timeLeft > 10 ? 'var(--earth)' : 'var(--fire)';

  const startGame = useCallback(() => {
    const src = SPEED_SOURCES[sourceId];
    const d = shuffle(src.make());
    setDeck(d); setIdx(0); setRevealed(false);
    setTimeLeft(DURATION); setScore(0); setStreak(0); setMaxStreak(0); setHistory([]);
    setPhase('playing');
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setPhase('done');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [sourceId]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const advance = useCallback(() => {
    setRevealed(false);
    if (idx + 1 >= deck.length) {
      clearInterval(timerRef.current);
      setPhase('done');
    } else {
      setIdx(i => i + 1);
    }
  }, [idx, deck.length]);

  const mark = useCallback((correct) => {
    const newStreak = correct ? streak + 1 : 0;
    setStreak(newStreak);
    setMaxStreak(ms => Math.max(ms, newStreak));
    setHistory(h => [...h, { correct }]);

    const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
    const pts = correct ? multiplier : 0;
    if (correct) {
      setScore(s => s + pts);
      setJustScored(`+${pts}${multiplier > 1 ? ' ×' + multiplier : ''}`);
      setTimeout(() => setJustScored(null), 600);
    }
    setTimeout(advance, 150);
  }, [streak, advance]);

  const handleKey = useCallback((e) => {
    if (phase !== 'playing') return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!revealed) setRevealed(true); }
    if (e.key === 'ArrowRight' && revealed) mark(true);
    if (e.key === 'ArrowLeft' && revealed) mark(false);
  }, [phase, revealed, mark]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const card = deck[idx];
  const correct = history.filter(h => h.correct).length;
  const wrong = history.filter(h => !h.correct).length;

  if (phase === 'idle') {
    return (
      <div style={{ textAlign: 'center', paddingTop: 32 }}>
        <div style={{ fontSize: '3rem', marginBottom: 12, color: 'var(--gold)' }}>⟡</div>
        <h3 style={{ marginBottom: 8 }}>{lang === 'he' ? 'ספרינט 60 שניות' : '60-second sprint'}</h3>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 28 }}>
          {lang === 'he' ? 'כמה כרטיסיות תוכלי לענות ב-60 שניות?' : 'How many cards can you answer in 60 seconds?'}
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          {Object.entries(SPEED_SOURCES).map(([id, src]) => (
            <button key={id} onClick={() => setSourceId(id)}
              style={{ padding: '7px 16px', borderRadius: 20, fontSize: '0.85rem', border: '1px solid', cursor: 'pointer',
                background: sourceId === id ? 'var(--accent)' : 'transparent',
                borderColor: sourceId === id ? 'var(--accent)' : 'var(--border)',
                color: sourceId === id ? 'white' : 'var(--text2)' }}>
              {src[lang]}
            </button>
          ))}
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 24px', maxWidth: 320, margin: '0 auto 28px', fontSize: '0.85rem', color: 'var(--text2)', textAlign: 'right' }}>
          <div>{lang === 'he' ? 'Space/Enter — גלה תשובה' : 'Space/Enter — reveal'}</div>
          <div style={{ marginTop: 6 }}>→ {lang === 'he' ? 'ידעתי · ← לא ידעתי' : 'known · ← unknown'}</div>
          <div style={{ marginTop: 6 }}>{lang === 'he' ? '3 ברצף = ×2 · 5 ברצף = ×3' : '3 streak = ×2 · 5 streak = ×3'}</div>
        </div>
        <button onClick={startGame} style={btn('var(--accent)', 'white', undefined, '14px 48px', '1.1rem')}>
          {lang === 'he' ? 'התחל!' : 'Start!'}
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const total = correct + wrong;
    const pctScore = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8, color: 'var(--gold)' }}>⟡</div>
        <h3 style={{ marginBottom: 16 }}>{lang === 'he' ? 'זמן נגמר!' : "Time's up!"}</h3>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            { label: lang === 'he' ? 'ניקוד' : 'Score', value: score, color: 'var(--gold)' },
            { label: lang === 'he' ? 'נכון' : 'Correct', value: correct, color: 'var(--wood)' },
            { label: lang === 'he' ? 'שגוי' : 'Wrong', value: wrong, color: 'var(--fire)' },
            { label: lang === 'he' ? 'רצף מקסימלי' : 'Best streak', value: maxStreak, color: 'var(--water)' },
          ].map(s => (
            <div key={s.label} style={{ background: `${s.color}10`, border: `1px solid ${s.color}30`, borderRadius: 12, padding: '14px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Accuracy bar */}
        <div style={{ maxWidth: 300, margin: '0 auto 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>
            <span>{lang === 'he' ? 'דיוק' : 'Accuracy'}</span><span>{pctScore}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pctScore}%`, background: 'var(--accent)', borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={startGame} style={btn('var(--accent)', 'white')}>{lang === 'he' ? 'שוב!' : 'Again!'}</button>
          <button onClick={() => setPhase('idle')} style={btn('var(--bg3)', 'var(--text2)', '1px solid var(--border)')}>
            {lang === 'he' ? 'שנה מקצב' : 'Change deck'}
          </button>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div>
      {/* Timer bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
          <span style={{ color: timeColor, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {timeLeft}s
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            {streak >= 2 && (
              <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>
                {streak} ×{streak >= 5 ? 3 : 2}
              </span>
            )}
            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
              {score} {lang === 'he' ? 'נק׳' : 'pts'}
            </span>
          </div>
        </div>
        <div style={{ height: 5, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: timeColor, borderRadius: 4, transition: 'width 1s linear, background 0.3s' }} />
        </div>
      </div>

      {/* Score popup */}
      {justScored && (
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold)', pointerEvents: 'none', animation: 'floatUp 0.6s ease-out forwards', zIndex: 100 }}>
          {justScored}
        </div>
      )}

      {/* Card */}
      {card && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', cursor: !revealed ? 'pointer' : 'default' }}
            onClick={() => !revealed && setRevealed(true)}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              {idx + 1} / {deck.length}
            </div>
            <div style={{ fontSize: card.prompt.length > 30 ? '0.95rem' : '1.3rem', fontWeight: 700, fontFamily: card.prompt.match(/^[A-Z]{1,3}\d+$/) ? 'monospace' : 'inherit', color: 'var(--accent)' }}>
              {card.prompt}
            </div>
            {card.hint && !revealed && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 8 }}>{card.hint}</div>
            )}
            {revealed && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: '1rem', color: 'var(--text)', lineHeight: 1.5 }}>
                {card.answer}
              </div>
            )}
            {!revealed && (
              <div style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--text3)' }}>
                {lang === 'he' ? 'לחץ לגילוי (Space)' : 'Tap to reveal (Space)'}
              </div>
            )}
          </div>

          {revealed && (
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <button onClick={() => mark(false)} style={{ ...btn('rgba(239,83,80,0.12)', 'var(--fire)', '1px solid rgba(239,83,80,0.3)', '12px 0'), flex: 1 }}>
                ✗ {lang === 'he' ? 'לא ידעתי (←)' : "Didn't know (←)"}
              </button>
              <button onClick={() => mark(true)} style={{ ...btn('rgba(102,187,106,0.12)', 'var(--wood)', '1px solid rgba(102,187,106,0.3)', '12px 0'), flex: 1 }}>
                ✓ {lang === 'he' ? 'ידעתי (→)' : 'Knew it (→)'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mini progress */}
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {history.slice(-30).map((h, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: h.correct ? 'var(--wood)' : 'var(--fire)' }} />
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(1.3); }
        }
      `}</style>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────

const MODES = [
  { id: 'match',  he: 'זיכרון', en: 'Memory match' },
  { id: 'speed',  he: 'ספרינט',  en: 'Speed drill' },
];

function btn(bg, color, border, padding = '11px 24px', fontSize = '0.9rem') {
  return { background: bg, color, border: border || 'none', borderRadius: 12, padding, fontSize, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' };
}

export default function CardPlaysPage() {
  const { lang } = useLang();
  const [mode, setMode] = useState('match');

  return (
    <div>
      <div className="page-header">
        <h1>{lang === 'he' ? 'משחקי כרטיסים' : 'Card Plays'}</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>
          {lang === 'he' ? 'זיכרון · ספרינט — נתונים מ-Zen-Dikur + חומר הקורס' : 'Memory match · Speed sprint — Zen-Dikur data + course material'}
        </p>
      </div>

      <div className="tabs" style={{ marginBottom: 28 }}>
        {MODES.map(m => (
          <button key={m.id} className={`tab ${mode === m.id ? 'active' : ''}`} onClick={() => setMode(m.id)}>
            {m[lang]}
          </button>
        ))}
      </div>

      {mode === 'match' && <MemoryMatch lang={lang} />}
      {mode === 'speed' && <SpeedDrill lang={lang} />}
    </div>
  );
}
