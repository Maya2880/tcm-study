import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { patterns, symptomGroups } from '../data/patterns';

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };

// Collect all unique symptoms across all patterns
function getAllSymptoms() {
  const seen = new Set();
  const result = [];
  for (const p of patterns) {
    for (const s of p.symptoms) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        result.push(s);
      }
    }
  }
  return result;
}

const allSymptoms = getAllSymptoms();

function scorePatterns(checkedIds) {
  return patterns
    .map((p) => {
      const matches = p.symptoms.filter((s) => checkedIds.includes(s.id)).length;
      const pct = p.symptoms.length > 0 ? matches / p.symptoms.length : 0;
      return { ...p, matches, pct };
    })
    .filter((p) => p.matches > 0)
    .sort((a, b) => b.pct - a.pct || b.matches - a.matches);
}

export default function IntakePage() {
  const { lang } = useLang();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [checked, setChecked] = useState([]);
  const [tongue, setTongue] = useState('');
  const [coating, setCoating] = useState('');
  const [results, setResults] = useState(null);

  const toggle = (id) =>
    setChecked((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);

  const handleSubmit = () => setResults(scorePatterns(checked));
  const handleReset = () => { setChecked([]); setResults(null); setTongue(''); setCoating(''); };

  const grouped = Object.keys(symptomGroups).reduce((acc, g) => {
    acc[g] = allSymptoms.filter((s) => s.group === g);
    return acc;
  }, {});

  const labels = {
    title: { he: 'טופס מטופל', en: 'Patient Intake' },
    subtitle: { he: 'סמן תסמינים וקבל הצעת אבחנה TCM', en: 'Check symptoms to get a TCM pattern suggestion' },
    patientName: { he: 'שם מטופל', en: 'Patient name' },
    age: { he: 'גיל', en: 'Age' },
    symptoms: { he: 'תסמינים', en: 'Symptoms' },
    tongue: { he: 'תצפית לשון', en: 'Tongue observation' },
    tongueColor: { he: 'צבע לשון', en: 'Tongue color' },
    tongueCoating: { he: 'חיפוי לשון', en: 'Tongue coating' },
    analyze: { he: 'נתח תסמינים', en: 'Analyze symptoms' },
    reset: { he: 'אפס', en: 'Reset' },
    noSymptoms: { he: 'סמן לפחות תסמין אחד', en: 'Please check at least one symptom' },
    results: { he: 'תוצאות', en: 'Results' },
    topMatch: { he: 'התאמה עיקרית', en: 'Top match' },
    match: { he: 'התאמה', en: 'match' },
    symptoms_matched: { he: 'תסמינים תואמים', en: 'matching symptoms' },
    treatmentPoints: { he: 'נקודות טיפול', en: 'Treatment points' },
    protocol: { he: 'פרוטוקול', en: 'Protocol' },
    tongue_obs: { he: 'לשון צפויה', en: 'Expected tongue' },
    pulse_obs: { he: 'דופק צפוי', en: 'Expected pulse' },
  };
  const l = (k) => labels[k]?.[lang] ?? k;

  return (
    <div>
      <div className="page-header">
        <h1>{l('title')}</h1>
        <p>{l('subtitle')}</p>
      </div>

      {!results ? (
        <>
          {/* Patient info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{l('patientName')}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'he' ? 'שם...' : 'Name...'}
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{l('age')}</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                placeholder="30"
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', outline: 'none' }}
              />
            </div>
          </div>

          {/* Symptom checklist */}
          <h2 style={{ marginBottom: 16 }}>{l('symptoms')} {checked.length > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 400 }}>({checked.length} {lang === 'he' ? 'נבחרו' : 'selected'})</span>}</h2>
          {Object.entries(grouped).map(([groupKey, syms]) => syms.length === 0 ? null : (
            <div key={groupKey} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {symptomGroups[groupKey][lang]}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {syms.map((s) => {
                  const on = checked.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      style={{
                        padding: '7px 14px', borderRadius: 20, fontSize: '0.85rem',
                        background: on ? 'var(--accent)' : 'var(--bg3)',
                        color: on ? 'white' : 'var(--text2)',
                        border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                        transition: 'all 0.15s',
                      }}
                    >
                      {on ? '✓ ' : ''}{s[lang]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Tongue observation */}
          <h2 style={{ marginBottom: 14 }}>{l('tongue')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{l('tongueColor')}</label>
              <select
                value={tongue}
                onChange={(e) => setTongue(e.target.value)}
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', outline: 'none' }}
              >
                <option value="">—</option>
                {[
                  { v: 'pale', he: 'חיוורת', en: 'Pale' },
                  { v: 'red', he: 'אדומה', en: 'Red' },
                  { v: 'purple', he: 'סגלגלה', en: 'Purple' },
                  { v: 'normal', he: 'רגילה', en: 'Normal' },
                ].map((o) => <option key={o.v} value={o.v}>{o[lang]}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'block', marginBottom: 4 }}>{l('tongueCoating')}</label>
              <select
                value={coating}
                onChange={(e) => setCoating(e.target.value)}
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', outline: 'none' }}
              >
                <option value="">—</option>
                {[
                  { v: 'none', he: 'אין חיפוי', en: 'No coating' },
                  { v: 'white', he: 'לבן', en: 'White' },
                  { v: 'yellow', he: 'צהוב', en: 'Yellow' },
                  { v: 'thick', he: 'עבה', en: 'Thick' },
                ].map((o) => <option key={o.v} value={o.v}>{o[lang]}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={checked.length === 0}
            style={{
              width: '100%', padding: '14px', borderRadius: 10,
              background: checked.length > 0 ? 'var(--accent)' : 'var(--bg3)',
              color: checked.length > 0 ? 'white' : 'var(--text3)',
              fontSize: '1rem', fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            {checked.length === 0 ? l('noSymptoms') : l('analyze')}
          </button>
        </>
      ) : (
        <>
          {/* Results */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2>{l('results')} {name && `— ${name}${age ? `, ${age}` : ''}`}</h2>
            <button onClick={handleReset} style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', fontSize: '0.85rem' }}>
              ← {l('reset')}
            </button>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
              {lang === 'he' ? 'לא נמצאה התאמה — נסה לסמן יותר תסמינים' : 'No match found — try checking more symptoms'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {results.slice(0, 3).map((r, i) => {
                const color = elementColors[r.element] || 'var(--accent)';
                const isTop = i === 0;
                return (
                  <div key={r.id} style={{
                    background: 'var(--bg2)',
                    border: `1px solid ${isTop ? color : 'var(--border)'}`,
                    borderRadius: 12, padding: '20px',
                    opacity: i === 2 ? 0.75 : 1,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        {isTop && <div style={{ fontSize: '0.68rem', color: color, marginBottom: 4 }}>★ {l('topMatch')}</div>}
                        <h3 style={{ color: isTop ? color : 'var(--text)' }}>{r.name[lang]}</h3>
                      </div>
                      <div style={{ background: `${color}20`, color, borderRadius: 20, padding: '4px 12px', fontSize: '0.82rem', fontWeight: 600 }}>
                        {r.matches}/{r.symptoms.length} {l('match')}
                      </div>
                    </div>

                    {/* Match bar */}
                    <div className="progress-bar" style={{ marginBottom: 12 }}>
                      <div className="progress-fill" style={{ width: `${r.pct * 100}%`, background: color }} />
                    </div>

                    {/* Matching symptoms */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {r.symptoms.map((s) => {
                        const matched = checked.includes(s.id);
                        return (
                          <span key={s.id} style={{
                            fontSize: '0.75rem', padding: '3px 10px', borderRadius: 20,
                            background: matched ? `${color}20` : 'var(--bg3)',
                            color: matched ? color : 'var(--text3)',
                          }}>
                            {matched ? '✓ ' : ''}{s[lang]}
                          </span>
                        );
                      })}
                    </div>

                    {isTop && (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginBottom: 2 }}>{l('tongue_obs')}</div>
                            <div style={{ fontSize: '0.85rem' }}>{r.tongue[lang]}</div>
                          </div>
                          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px' }}>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginBottom: 2 }}>{l('pulse_obs')}</div>
                            <div style={{ fontSize: '0.85rem' }}>{r.pulse[lang]}</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 6 }}>{l('protocol')}</div>
                          <ol style={{ paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {r.protocol[lang].map((step, si) => (
                              <li key={si} style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{step}</li>
                            ))}
                          </ol>
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {r.treatmentPoints.map((pt) => (
                            <span key={pt} style={{ background: `${color}20`, color, fontSize: '0.82rem', padding: '4px 12px', borderRadius: 20, fontFamily: 'monospace', fontWeight: 600 }}>
                              {pt}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
