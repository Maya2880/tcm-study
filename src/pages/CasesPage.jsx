import { useState } from 'react';
import { cases } from '../data/cases';
import { organs } from '../data/organs';

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };

function CaseQuiz({ caseData, onBack }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [finished, setFinished] = useState(false);

  const totalQ = caseData.questions.length;
  const answeredQ = Object.keys(answers).length;
  const correctQ = caseData.questions.filter((q) => answers[q.id] === q.options.find((o) => o.correct)?.id).length;

  const handleAnswer = (qId, optId) => {
    if (answers[qId]) return;
    setAnswers((a) => ({ ...a, [qId]: optId }));
    setRevealed((r) => ({ ...r, [qId]: true }));
  };

  const organ = organs.find((o) => o.id === caseData.organ);
  const color = elementColors[caseData.element] || 'var(--accent)';

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', color: 'var(--text3)', fontSize: '0.88rem',
          marginBottom: 20,
        }}
      >
        ← חזרה למקרים
      </button>

      {/* Case header */}
      <div style={{
        background: `${color}10`,
        border: `1px solid ${color}30`,
        borderRadius: 14, padding: '20px 24px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ background: `${color}20`, color, fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20 }}>
            {organ?.nameHe} · {caseData.element}
          </span>
          <span style={{ background: 'var(--bg3)', fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20, color: 'var(--text3)' }}>
            {caseData.patient}
          </span>
        </div>
        <h2 style={{ marginBottom: 10 }}>{caseData.title}</h2>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 14 }}>
          {caseData.description}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {caseData.symptoms.map((s) => (
            <span key={s} style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20, color: 'var(--text2)' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      {answeredQ > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 8 }}>
          <span>{answeredQ} / {totalQ} ענית</span>
          <span style={{ color: correctQ === answeredQ ? 'var(--wood)' : 'var(--fire)' }}>
            {correctQ} נכון
          </span>
        </div>
      )}

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {caseData.questions.map((q, qi) => {
          const answered = answers[q.id];
          const correctOpt = q.options.find((o) => o.correct);

          return (
            <div key={q.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>שאלה {qi + 1}</div>
              <h3 style={{ marginBottom: 14, lineHeight: 1.5 }}>{q.question}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: answered ? 14 : 0 }}>
                {q.options.map((opt) => {
                  let cls = 'quiz-option';
                  if (answered) {
                    cls += ' disabled';
                    if (opt.correct) cls += ' correct';
                    else if (answered === opt.id) cls += ' wrong';
                  }
                  return (
                    <div
                      key={opt.id}
                      className={cls}
                      onClick={() => handleAnswer(q.id, opt.id)}
                    >
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: answered
                          ? opt.correct ? 'rgba(102,187,106,0.3)' : answered === opt.id ? 'rgba(239,83,80,0.3)' : 'var(--bg3)'
                          : 'var(--bg3)',
                        color: answered
                          ? opt.correct ? 'var(--wood)' : answered === opt.id ? 'var(--fire)' : 'var(--text3)'
                          : 'var(--text3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                      }}>
                        {answered
                          ? opt.correct ? '✓' : answered === opt.id ? '✗' : opt.id.toUpperCase()
                          : opt.id.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.9rem' }}>{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {answered && q.explanation && (
                <div style={{ background: 'rgba(255,213,79,0.06)', border: '1px solid rgba(255,213,79,0.15)', borderRadius: 8, padding: '10px 14px', marginTop: 10 }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--gold)', marginBottom: 4 }}>הסבר</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final score */}
      {answeredQ === totalQ && (
        <div style={{
          marginTop: 24, background: `${color}10`, border: `1px solid ${color}30`,
          borderRadius: 12, padding: '20px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>
            {correctQ === totalQ ? '✦' : correctQ >= totalQ * 0.7 ? '◎' : '◇'}
          </div>
          <h3 style={{ marginBottom: 6 }}>תוצאה: {correctQ}/{totalQ}</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 14 }}>
            אבחנה: <strong style={{ color }}>{caseData.diagnosis}</strong>
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 10 }}>נקודות טיפול מומלצות</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {caseData.treatmentPoints.map((p) => (
              <span key={p} style={{ background: `${color}20`, color, fontSize: '0.82rem', padding: '4px 12px', borderRadius: 20, fontFamily: 'monospace' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CasesPage() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <CaseQuiz caseData={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>מקרי מטופלים</h1>
        <p>תרגול קליני — בחר מקרה, ענה על השאלות, קבל הסבר</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cases.map((c) => {
          const organ = organs.find((o) => o.id === c.organ);
          const color = elementColors[c.element] || 'var(--accent)';
          return (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateX(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: `${color}18`, color, fontSize: '0.75rem', padding: '2px 10px', borderRadius: 20 }}>
                      {organ?.nameHe}
                    </span>
                    <span style={{ background: 'var(--bg3)', fontSize: '0.75rem', padding: '2px 10px', borderRadius: 20, color: 'var(--text3)' }}>
                      {c.patient}
                    </span>
                    <span style={{ background: 'var(--bg3)', fontSize: '0.75rem', padding: '2px 10px', borderRadius: 20, color: 'var(--text3)' }}>
                      {c.questions.length} שאלות
                    </span>
                  </div>
                  <h3 style={{ marginBottom: 8 }}>{c.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.86rem', lineHeight: 1.6 }}>
                    {c.description.substring(0, 160)}...
                  </p>
                </div>
                <div style={{ marginRight: 16, color: 'var(--text3)', fontSize: '1.2rem' }}>→</div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                {c.symptoms.slice(0, 5).map((s) => (
                  <span key={s} style={{ background: 'rgba(255,255,255,0.04)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20, color: 'var(--text3)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
