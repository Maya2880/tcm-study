import { useLang } from '../context/LanguageContext';
import { eightPrinciples } from '../data/principles';

const signLabels = {
  color: { he: 'צבע', en: 'Color' },
  temp: { he: 'טמפרטורה', en: 'Temperature' },
  stool: { he: 'יציאות', en: 'Stool' },
  skin: { he: 'עור/ריריות', en: 'Skin/mucosa' },
  mood: { he: 'מצב רוח', en: 'Mood' },
  direction: { he: 'כיוון', en: 'Direction' },
  tongue: { he: 'לשון', en: 'Tongue' },
  organs: { he: 'איברים אופייניים', en: 'Typical organs' },
};

export default function PrinciplesPage() {
  const { lang } = useLang();
  const p = eightPrinciples;

  return (
    <div>
      <div className="page-header">
        <h1>{p.title[lang]}</h1>
        <p>{p.description[lang]}</p>
      </div>

      {/* 4 Pairs */}
      <h2 style={{ marginBottom: 14 }}>{lang === 'he' ? 'ארבעת הזוגות' : 'The Four Pairs'}</h2>
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {p.pairs.map((pair) => (
          <div key={pair.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: 'var(--bg3)', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 4 }}>{pair.question[lang]}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#ef5350' }}>{pair.yangPole[lang]}</span>
                <span style={{ color: 'var(--text3)' }}>↔</span>
                <span style={{ fontWeight: 700, color: '#42a5f5' }}>{pair.yinPole[lang]}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 80 }}>
              <div style={{ padding: '12px 14px', borderLeft: '1px solid var(--border)', background: 'rgba(239,83,80,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#ef5350', marginBottom: 6 }}>{pair.yangPole[lang]}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>{pair.yangSigns[lang]}</p>
              </div>
              <div style={{ padding: '12px 14px', background: 'rgba(66,165,245,0.04)' }}>
                <div style={{ fontSize: '0.68rem', color: '#42a5f5', marginBottom: 6 }}>{pair.yinPole[lang]}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>{pair.yinSigns[lang]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deficiency types comparison table */}
      <h2 style={{ marginBottom: 14 }}>{lang === 'he' ? 'ארבעת סוגי החסר' : 'Four Types of Deficiency'}</h2>
      <div style={{ overflowX: 'auto', marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 600 }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--bg3)', padding: '10px 14px', textAlign: 'right', borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.75rem', fontWeight: 600 }}>
                {lang === 'he' ? 'סימן' : 'Sign'}
              </th>
              {p.deficiencyTypes.map((dt) => (
                <th key={dt.id} style={{ background: 'var(--bg3)', padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid var(--border)', color: dt.color, fontSize: '0.82rem' }}>
                  {dt.name[lang]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(signLabels).map(([key, label], i) => (
              <tr key={key} style={{ background: i % 2 === 0 ? 'var(--bg2)' : 'rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '9px 14px', color: 'var(--text3)', fontSize: '0.78rem', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                  {label[lang]}
                </td>
                {p.deficiencyTypes.map((dt) => (
                  <td key={dt.id} style={{ padding: '9px 14px', textAlign: 'center', borderBottom: '1px solid var(--border)', color: 'var(--text2)', fontSize: '0.82rem' }}>
                    {dt.signs[key]?.[lang] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Memory tip */}
      <div style={{ background: 'rgba(255,213,79,0.07)', border: '1px solid rgba(255,213,79,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
        <div style={{ color: 'var(--gold)', fontWeight: 600, marginBottom: 6 }}>{lang === 'he' ? 'טיפ לזכירה' : 'Memory Tip'}</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>{p.tip[lang]}</p>
      </div>

      {/* Diagnosis order */}
      <h2 style={{ marginBottom: 14 }}>{lang === 'he' ? 'סדר בניית האבחנה' : 'Diagnosis Building Order'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {p.diagnosisOrder.map((step) => (
          <div key={step.step} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
            }}>
              {step.step}
            </div>
            <span style={{ fontSize: '0.95rem' }}>{lang === 'he' ? step.he : step.en}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
