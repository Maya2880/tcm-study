import { useState } from 'react';

// ── ReadStep ─────────────────────────────────────────────────────────────────
function ReadStep({ step, onComplete }) {
  return (
    <div className="lesson-step lesson-step--read" dir="rtl">
      <p className="step-content">{step.content}</p>
      <button className="btn-primary" onClick={onComplete}>
        הבנתי — המשך
      </button>
    </div>
  );
}

// ── TapStep ──────────────────────────────────────────────────────────────────
function TapStep({ step, onComplete }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (opt) => {
    if (submitted) return;
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const check = () => {
    setSubmitted(true);
    const correct =
      step.answer.length === selected.length &&
      step.answer.every((a) => selected.includes(a));
    setTimeout(() => onComplete(correct), 900);
  };

  return (
    <div className="lesson-step lesson-step--tap" dir="rtl">
      <p className="step-prompt">{step.prompt}</p>
      <div className="tap-options">
        {step.options.map((opt) => {
          const isSelected = selected.includes(opt);
          const isCorrect  = step.answer.includes(opt);
          let mod = '';
          if (submitted) mod = isCorrect ? 'correct' : isSelected ? 'wrong' : '';
          else if (isSelected) mod = 'active';
          return (
            <button
              key={opt}
              className={`tap-option ${mod}`}
              onClick={() => toggle(opt)}
              disabled={submitted}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <button
        className="btn-primary"
        onClick={check}
        disabled={!selected.length || submitted}
      >
        בדוק
      </button>
    </div>
  );
}

// ── MatchStep ─────────────────────────────────────────────────────────────────
function MatchStep({ step, onComplete }) {
  // pairs: [[left, right], ...]
  const lefts  = step.pairs.map(([l]) => l);
  const rights = [...step.pairs.map(([, r]) => r)].sort(() => Math.random() - 0.5);

  const [chosen, setChosen]   = useState({ left: null, right: null });
  const [matched, setMatched] = useState([]); // array of left values matched

  const pickLeft  = (l) => !matched.includes(l) && setChosen((c) => ({ ...c, left: l }));
  const pickRight = (r) => setChosen((c) => ({ ...c, right: r }));

  // Auto-evaluate when both sides chosen
  const { left, right } = chosen;
  if (left && right) {
    const correct = step.pairs.find(([l]) => l === left)?.[1] === right;
    if (correct) {
      const next = [...matched, left];
      setMatched(next);
      setChosen({ left: null, right: null });
      if (next.length === step.pairs.length) setTimeout(() => onComplete(true), 500);
    } else {
      setTimeout(() => setChosen({ left: null, right: null }), 600);
    }
  }

  return (
    <div className="lesson-step lesson-step--match" dir="rtl">
      <p className="step-prompt">חבר כל זוג</p>
      <div className="match-columns">
        <div className="match-col">
          {lefts.map((l) => (
            <button
              key={l}
              className={`match-tile ${matched.includes(l) ? 'matched' : chosen.left === l ? 'active' : ''}`}
              onClick={() => pickLeft(l)}
              disabled={matched.includes(l)}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="match-col">
          {rights.map((r) => {
            const pairedLeft = step.pairs.find(([, rv]) => rv === r)?.[0];
            const isMatched  = matched.includes(pairedLeft);
            return (
              <button
                key={r}
                className={`match-tile ${isMatched ? 'matched' : chosen.right === r ? 'active' : ''}`}
                onClick={() => pickRight(r)}
                disabled={isMatched}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LessonStep (router) ───────────────────────────────────────────────────────
export default function LessonStep({ step, onComplete }) {
  if (!step) return null;
  switch (step.type) {
    case 'read':  return <ReadStep  step={step} onComplete={() => onComplete(true)} />;
    case 'tap':   return <TapStep   step={step} onComplete={onComplete} />;
    case 'match': return <MatchStep step={step} onComplete={onComplete} />;
    default:      return <p>סוג שלב לא מוכר: {step.type}</p>;
  }
}
