import { useState, useCallback } from 'react';
import { useLang } from '../context/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import XPBar from '../components/XPBar';
import BadgeToast from '../components/BadgeToast';
import { UnitIcon, FireIcon, BoltIcon, LockIcon, CheckCircleIcon, PlayIcon, ReadStepIcon, TapStepIcon, MatchStepIcon } from '../components/NavIcons';
import { units, getLessonById } from '../data/lessons';

// ── Unlock map ────────────────────────────────────────────────────────────────
function buildUnlockMap(isCompleted) {
  const map = {};
  for (let ui = 0; ui < units.length; ui++) {
    const unit = units[ui];
    const unitGate = ui === 0 ? true : isCompleted(units[ui - 1].lessons.at(-1).id);
    for (let li = 0; li < unit.lessons.length; li++) {
      map[unit.lessons[li].id] = li === 0 ? unitGate : isCompleted(unit.lessons[li - 1].id);
    }
  }
  return map;
}

// ── Shuffle helper ────────────────────────────────────────────────────────────
function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LESSON PLAYER
// ═══════════════════════════════════════════════════════════════════════════════
function LessonPlayer({ lessonRef, unitColor, lang, onComplete, onClose }) {
  const isHe = lang === 'he';
  const totalSteps = lessonRef.steps.length;

  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState('play'); // 'play' | 'result' | 'done'

  // Per-step state
  const [tapSelected, setTapSelected] = useState([]);
  const [tapResult, setTapResult]     = useState(null); // null | 'correct' | 'wrong'
  const [matchLeft, setMatchLeft]     = useState(null);  // selected left key
  const [matchPairs, setMatchPairs]   = useState({});    // { leftKey: rightKey }
  const [matchRight]                  = useState(() => {
    const step = lessonRef.steps.find((s) => s.type === 'match');
    return step ? shuffled(step.pairs.map((p) => p[1])) : [];
  });

  const step = lessonRef.steps[stepIdx];

  // ── advance step ─────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setTapSelected([]);
    setTapResult(null);
    setMatchLeft(null);
    if (stepIdx + 1 < totalSteps) {
      setStepIdx(stepIdx + 1);
    } else {
      setPhase('done');
      setTimeout(() => onComplete(), 1200);
    }
  }, [stepIdx, totalSteps, onComplete]);

  // ── tap step ─────────────────────────────────────────────────────────────
  const handleTapOption = (opt) => {
    if (tapResult) return;
    setTapSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  };

  const checkTap = () => {
    if (!step.answer) return;
    const correct = step.answer.every((a) => tapSelected.includes(a)) && tapSelected.length === step.answer.length;
    setTapResult(correct ? 'correct' : 'wrong');
  };

  // ── match step ───────────────────────────────────────────────────────────
  const handleMatchLeft = (key) => setMatchLeft(key === matchLeft ? null : key);
  const handleMatchRight = (val) => {
    if (!matchLeft) return;
    setMatchPairs((prev) => ({ ...prev, [matchLeft]: val }));
    setMatchLeft(null);
  };
  const matchDone = () => {
    const pairsArr = step?.pairs ?? [];
    return pairsArr.length > 0 && pairsArr.every((p) => matchPairs[p[0]] === p[1]);
  };

  // ── completion screen ─────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={styles.doneScreen}>
        <div style={{ ...styles.doneCircle, background: unitColor, boxShadow: `0 0 40px ${unitColor}55` }}>
          <CheckCircleIcon size={40} />
        </div>
        <div style={styles.doneTitle}>{isHe ? 'כל הכבוד!' : 'Well done!'}</div>
        <div style={styles.doneSub}>+{lessonRef.xpReward ?? 20} XP</div>
      </div>
    );
  }

  return (
    <div style={styles.player}>
      {/* Header */}
      <div style={styles.playerHeader}>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
        <div style={styles.stepDots}>
          {lessonRef.steps.map((_, i) => (
            <div key={i} style={{
              ...styles.dot,
              background: i < stepIdx ? unitColor : i === stepIdx ? unitColor : 'var(--bg3)',
              opacity: i === stepIdx ? 1 : i < stepIdx ? 0.6 : 0.3,
              width: i === stepIdx ? 20 : 8,
            }} />
          ))}
        </div>
        <div style={{ width: 28 }} />
      </div>

      {/* Step label */}
      <div style={styles.stepLabel}>
        {step.type === 'read'  && <><ReadStepIcon  size={14} /> {isHe ? 'קרא' : 'Read'}</>}
        {step.type === 'tap'   && <><TapStepIcon   size={14} /> {isHe ? 'בחר' : 'Select'}</>}
        {step.type === 'match' && <><MatchStepIcon size={14} /> {isHe ? 'התאם' : 'Match'}</>}
      </div>

      {/* ── READ ──────────────────────────────────────────────────────────── */}
      {step.type === 'read' && (
        <div style={styles.readWrap}>
          <div style={styles.readCard}>{step.content}</div>
          <button style={{ ...styles.btn, background: unitColor }} onClick={advance}>
            {isHe ? 'הבנתי' : 'Got it'}
          </button>
        </div>
      )}

      {/* ── TAP ───────────────────────────────────────────────────────────── */}
      {step.type === 'tap' && (
        <div style={styles.tapWrap}>
          <div style={styles.tapPrompt}>{step.prompt}</div>
          <div style={styles.optionGrid}>
            {(step.options ?? []).map((opt) => {
              const isSelected = tapSelected.includes(opt);
              const isCorrect  = tapResult && step.answer?.includes(opt);
              const isWrong    = tapResult && isSelected && !step.answer?.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => handleTapOption(opt)}
                  style={{
                    ...styles.optionBtn,
                    background: isWrong    ? 'rgba(239,83,80,0.2)'
                              : isCorrect  ? `color-mix(in srgb, ${unitColor} 25%, transparent)`
                              : isSelected ? `color-mix(in srgb, ${unitColor} 15%, var(--bg2))`
                              : 'var(--bg2)',
                    border: `1.5px solid ${
                              isWrong   ? 'rgba(239,83,80,0.6)'
                            : isCorrect ? unitColor
                            : isSelected ? `color-mix(in srgb, ${unitColor} 60%, transparent)`
                            : 'var(--border)'}`,
                    color: isCorrect ? unitColor : isWrong ? '#ef5350' : 'var(--text)',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {!tapResult && (
            <button
              style={{ ...styles.btn, background: tapSelected.length ? unitColor : 'var(--bg3)', color: tapSelected.length ? '#fff' : 'var(--text3)' }}
              disabled={!tapSelected.length}
              onClick={checkTap}
            >
              {isHe ? 'בדוק' : 'Check'}
            </button>
          )}
          {tapResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ ...styles.resultBanner, background: tapResult === 'correct' ? `color-mix(in srgb, ${unitColor} 15%, transparent)` : 'rgba(239,83,80,0.12)', borderColor: tapResult === 'correct' ? unitColor : '#ef5350', color: tapResult === 'correct' ? unitColor : '#ef5350' }}>
                {tapResult === 'correct' ? (isHe ? 'נכון!' : 'Correct!') : (isHe ? 'לא בדיוק — נסה שוב' : 'Not quite — look again')}
              </div>
              <button style={{ ...styles.btn, background: unitColor }} onClick={tapResult === 'correct' ? advance : () => { setTapResult(null); setTapSelected([]); }}>
                {tapResult === 'correct' ? (isHe ? 'המשך' : 'Continue') : (isHe ? 'נסה שוב' : 'Try again')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── MATCH ─────────────────────────────────────────────────────────── */}
      {step.type === 'match' && (
        <div style={styles.matchWrap}>
          <div style={styles.matchGrid}>
            {/* Left column */}
            <div style={styles.matchCol}>
              {(step.pairs ?? []).map(([left]) => {
                const paired = matchPairs[left];
                const correct = paired === step.pairs.find((p) => p[0] === left)?.[1];
                return (
                  <button key={left} onClick={() => !paired && handleMatchLeft(left)} style={{
                    ...styles.matchItem,
                    background: paired
                      ? correct
                        ? `color-mix(in srgb, ${unitColor} 20%, transparent)`
                        : 'rgba(239,83,80,0.15)'
                      : matchLeft === left
                        ? `color-mix(in srgb, ${unitColor} 20%, var(--bg2))`
                        : 'var(--bg2)',
                    border: `1.5px solid ${paired ? (correct ? unitColor : '#ef5350') : matchLeft === left ? unitColor : 'var(--border)'}`,
                    color: paired ? (correct ? unitColor : '#ef5350') : 'var(--text)',
                    cursor: paired ? 'default' : 'pointer',
                  }}>
                    {left}
                  </button>
                );
              })}
            </div>
            {/* Right column */}
            <div style={styles.matchCol}>
              {matchRight.map((right) => {
                const usedBy = Object.entries(matchPairs).find(([, v]) => v === right)?.[0];
                const correct = usedBy && step.pairs.find((p) => p[0] === usedBy)?.[1] === right;
                return (
                  <button key={right} onClick={() => !usedBy && handleMatchRight(right)} style={{
                    ...styles.matchItem,
                    background: usedBy
                      ? correct
                        ? `color-mix(in srgb, ${unitColor} 20%, transparent)`
                        : 'rgba(239,83,80,0.15)'
                      : matchLeft
                        ? `color-mix(in srgb, ${unitColor} 8%, var(--bg2))`
                        : 'var(--bg2)',
                    border: `1.5px solid ${usedBy ? (correct ? unitColor : '#ef5350') : matchLeft ? `color-mix(in srgb, ${unitColor} 40%, transparent)` : 'var(--border)'}`,
                    color: usedBy ? (correct ? unitColor : '#ef5350') : 'var(--text)',
                    cursor: usedBy ? 'default' : matchLeft ? 'pointer' : 'default',
                    opacity: !matchLeft && !usedBy ? 0.7 : 1,
                  }}>
                    {right}
                  </button>
                );
              })}
            </div>
          </div>
          {matchDone() && (
            <button style={{ ...styles.btn, background: unitColor }} onClick={advance}>
              {isHe ? 'המשך' : 'Continue'}
            </button>
          )}
          {!matchDone() && Object.keys(matchPairs).length === (step.pairs?.length ?? 0) && (
            <button style={{ ...styles.btn, background: 'rgba(239,83,80,0.2)', color: '#ef5350' }} onClick={() => setMatchPairs({})}>
              {isHe ? 'נסה שוב' : 'Try again'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const MILESTONES = {
  1:  { labelHe: 'השיעור הראשון!', labelEn: 'First lesson!',  icon: 'star'  },
  5:  { labelHe: 'חמישה שיעורים!', labelEn: '5 Lessons!',     icon: 'award' },
  10: { labelHe: 'עשרה שיעורים!',  labelEn: '10 Lessons!',    icon: 'trophy'},
};

export default function Learn() {
  const { lang }  = useLang();
  const { level, xpInLevel, XP_PER_LEVEL, streak, xp, addXP, completeLesson, checkAndAwardBadge, isCompleted, completedLessons } = useProgress();

  const [playing, setPlaying] = useState(null); // { lessonRef, unit }
  const [toast,   setToast]   = useState(null);

  const isHe    = lang === 'he';
  const unlocked = buildUnlockMap(isCompleted);

  const handleStart = (lessonMeta, unit) => {
    if (!unlocked[lessonMeta.id] || isCompleted(lessonMeta.id)) return;
    const full = getLessonById(lessonMeta.id);
    if (!full) return;
    setPlaying({ lessonRef: { ...full, xpReward: lessonMeta.xp }, unit });
  };

  const handleComplete = () => {
    if (!playing) return;
    const id = playing.lessonRef.id;
    completeLesson(id);
    addXP(playing.lessonRef.xpReward ?? 20);
    checkAndAwardBadge();
    const count = completedLessons.length + 1;
    if (MILESTONES[count]) setToast(MILESTONES[count]);
    setPlaying(null);
  };

  // ── Lesson player overlay ─────────────────────────────────────────────────
  if (playing) {
    return (
      <div style={styles.playerOverlay}>
        <LessonPlayer
          lessonRef={playing.lessonRef}
          unitColor={playing.unit.color}
          lang={lang}
          onComplete={handleComplete}
          onClose={() => setPlaying(null)}
        />
      </div>
    );
  }

  // ── Path map ──────────────────────────────────────────────────────────────
  const totalLessons = units.flatMap((u) => u.lessons).length;
  const doneCount    = completedLessons.length;

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1>{isHe ? 'מסלול לימוד' : 'Learning Path'}</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
          {isHe ? 'לומדים שיאצו — צעד אחר צעד' : 'Learn Shiatsu step by step'}
        </p>
      </div>

      {/* Stats shelf */}
      <div style={styles.statsRow}>
        <div style={styles.statPill}>
          <span style={{ color: '#ef6c00' }}><FireIcon size={20} /></span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef6c00', lineHeight: 1 }}>{streak.count}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{isHe ? 'רצף ימים' : 'Day streak'}</div>
          </div>
        </div>
        <div style={styles.statPill}>
          <span style={{ color: 'var(--gold)' }}><BoltIcon size={20} /></span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{xp}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>Total XP</div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 160, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
          <XPBar level={level} xpInLevel={xpInLevel} xpPerLevel={XP_PER_LEVEL} />
        </div>
        <div style={styles.statPill}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{doneCount}<span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: '0.75rem' }}>/{totalLessons}</span></div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{isHe ? 'שיעורים' : 'Lessons'}</div>
          </div>
        </div>
      </div>

      {/* Unit path */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 48 }}>
        {units.map((unit, ui) => {
          const unitDone  = unit.lessons.every((l) => isCompleted(l.id));
          const unitGate  = ui === 0 ? true : isCompleted(units[ui - 1].lessons.at(-1).id);

          return (
            <section key={unit.id}>
              {/* Unit header */}
              <div style={{
                ...styles.unitHeader,
                background: `color-mix(in srgb, ${unit.color} 8%, var(--bg2))`,
                border: `1px solid color-mix(in srgb, ${unit.color} 25%, transparent)`,
                opacity: unitGate ? 1 : 0.5,
              }}>
                <div style={{ ...styles.unitBadge, background: `color-mix(in srgb, ${unit.color} 18%, transparent)`, border: `1px solid color-mix(in srgb, ${unit.color} 40%, transparent)`, color: unit.color }}>
                  <UnitIcon type={unit.iconType} size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: unit.color }}>{isHe ? unit.nameHe : unit.nameEn}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>
                    {unit.lessons.filter((l) => isCompleted(l.id)).length} / {unit.lessons.length} {isHe ? 'שיעורים' : 'lessons'}
                  </div>
                </div>
                {unitDone && <span style={{ color: unit.color }}><CheckCircleIcon size={20} /></span>}
              </div>

              {/* Lesson nodes */}
              <div style={styles.track}>
                {unit.lessons.map((lesson, li) => {
                  const done  = isCompleted(lesson.id);
                  const open  = unlocked[lesson.id];
                  const isCurrent = open && !done;
                  const full  = getLessonById(lesson.id);
                  const stepCount = full?.steps?.length ?? 0;

                  return (
                    <div key={lesson.id} style={styles.trackRow}>
                      {/* Connector line */}
                      {li < unit.lessons.length - 1 && (
                        <div style={{ ...styles.connector, background: done ? unit.color : 'var(--border)' }} />
                      )}

                      {/* Node circle */}
                      <div
                        onClick={() => handleStart(lesson, unit)}
                        style={{
                          ...styles.node,
                          background: done
                            ? unit.color
                            : isCurrent
                              ? `color-mix(in srgb, ${unit.color} 15%, var(--bg2))`
                              : 'var(--bg2)',
                          border: `2px solid ${done ? unit.color : isCurrent ? unit.color : 'var(--border)'}`,
                          cursor: isCurrent ? 'pointer' : done ? 'default' : 'not-allowed',
                          opacity: open ? 1 : 0.4,
                          boxShadow: isCurrent ? `0 0 0 4px color-mix(in srgb, ${unit.color} 20%, transparent)` : 'none',
                          animation: isCurrent ? 'pulse-ring 2s ease-in-out infinite' : 'none',
                        }}
                      >
                        {done
                          ? <span style={{ color: '#fff' }}><CheckCircleIcon size={18} /></span>
                          : open
                            ? <span style={{ color: unit.color }}><PlayIcon size={16} /></span>
                            : <span style={{ color: 'var(--text3)' }}><LockIcon size={16} /></span>
                        }
                      </div>

                      {/* Lesson info */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: done ? 500 : isCurrent ? 600 : 500,
                          fontSize: '0.88rem',
                          color: done ? unit.color : isCurrent ? 'var(--text)' : 'var(--text3)',
                        }}>
                          {isHe ? lesson.titleHe : lesson.titleEn}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                          {full && (
                            <div style={{ display: 'flex', gap: 4 }}>
                              {full.steps.map((s, si) => (
                                <span key={si} style={{ color: 'var(--text3)', opacity: 0.6 }}>
                                  {s === 'read'  && <ReadStepIcon  size={12} />}
                                  {s === 'tap'   && <TapStepIcon   size={12} />}
                                  {s === 'match' && <MatchStepIcon size={12} />}
                                </span>
                              ))}
                            </div>
                          )}
                          <span style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600 }}>+{lesson.xp} XP</span>
                        </div>
                      </div>

                      {/* Start button for current */}
                      {isCurrent && (
                        <button
                          onClick={() => handleStart(lesson, unit)}
                          style={{ ...styles.startBtn, background: `linear-gradient(135deg, ${unit.color}, color-mix(in srgb, ${unit.color} 70%, var(--accent2)))` }}
                        >
                          {isHe ? 'התחל' : 'Start'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <BadgeToast badge={toast} lang={lang} onDone={() => setToast(null)} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = {
  statsRow: {
    display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', alignItems: 'stretch',
  },
  statPill: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px',
  },
  unitHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    borderRadius: 14, padding: '12px 16px', marginBottom: 12,
  },
  unitBadge: {
    width: 42, height: 42, borderRadius: 11,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  track: {
    display: 'flex', flexDirection: 'column', gap: 0, paddingRight: 20, position: 'relative',
  },
  trackRow: {
    display: 'flex', alignItems: 'center', gap: 14, position: 'relative',
    paddingBottom: 12, paddingTop: 12,
  },
  connector: {
    position: 'absolute',
    right: -20 + 20,
    top: 'calc(50% + 20px)',
    width: 2,
    height: 'calc(100% + 0px)',
    borderRadius: 2,
    // actually we'll just use a left border on the section
  },
  node: {
    width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
    position: 'relative', zIndex: 1,
  },
  startBtn: {
    border: 'none', borderRadius: 8, color: '#fff',
    padding: '7px 16px', fontSize: '0.8rem', fontWeight: 600,
    flexShrink: 0, cursor: 'pointer',
    transition: 'transform 0.15s',
  },
  // ── Player styles ───────────────────────────────────────────────────────
  playerOverlay: {
    minHeight: '100%', display: 'flex', flexDirection: 'column',
  },
  player: {
    display: 'flex', flexDirection: 'column', gap: 20, flex: 1,
    maxWidth: 560, margin: '0 auto', width: '100%', padding: '0 4px',
  },
  playerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 4,
  },
  closeBtn: {
    background: 'none', border: 'none', color: 'var(--text3)',
    fontSize: '1rem', cursor: 'pointer', padding: 4, lineHeight: 1,
  },
  stepDots: {
    display: 'flex', gap: 5, alignItems: 'center',
  },
  dot: {
    height: 8, borderRadius: 4, transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
  },
  stepLabel: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em',
  },
  readWrap: {
    display: 'flex', flexDirection: 'column', gap: 20,
  },
  readCard: {
    background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14,
    padding: '20px 18px', fontSize: '0.9rem', lineHeight: 1.7,
    color: 'var(--text)', direction: 'rtl', textAlign: 'right',
  },
  tapWrap: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  tapPrompt: {
    fontWeight: 600, fontSize: '1rem', color: 'var(--text)',
  },
  optionGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
  },
  optionBtn: {
    padding: '12px 10px', borderRadius: 10, fontSize: '0.82rem',
    fontWeight: 500, cursor: 'pointer', textAlign: 'center',
    transition: 'all 0.12s',
  },
  matchWrap: {
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  matchGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
  },
  matchCol: {
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  matchItem: {
    padding: '10px 10px', borderRadius: 9, fontSize: '0.78rem',
    fontWeight: 500, textAlign: 'center', lineHeight: 1.3,
    transition: 'all 0.15s',
  },
  btn: {
    border: 'none', borderRadius: 10, color: '#fff',
    padding: '13px', fontSize: '0.88rem', fontWeight: 600,
    cursor: 'pointer', transition: 'opacity 0.15s',
  },
  resultBanner: {
    padding: '12px 16px', borderRadius: 10, border: '1px solid',
    fontWeight: 600, fontSize: '0.88rem', textAlign: 'center',
  },
  doneScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 16, padding: '60px 20px', flex: 1,
  },
  doneCircle: {
    width: 80, height: 80, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  },
  doneTitle: {
    fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)',
  },
  doneSub: {
    fontSize: '1.1rem', fontWeight: 600, color: 'var(--gold)',
  },
};
