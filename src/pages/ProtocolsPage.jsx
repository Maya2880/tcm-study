import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { patterns } from '../data/patterns';
import { organs } from '../data/organs';

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };
const elementNames = { wood: { he: 'עץ', en: 'Wood' }, fire: { he: 'אש', en: 'Fire' }, earth: { he: 'אדמה', en: 'Earth' }, metal: { he: 'מתכת', en: 'Metal' }, water: { he: 'מים', en: 'Water' } };

function ProtocolModal({ pattern, onClose, lang }) {
  const organ = organs.find((o) => o.id === pattern.organ);
  const color = elementColors[pattern.element] || 'var(--accent)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ background: `${color}20`, color, fontSize: '0.75rem', padding: '2px 10px', borderRadius: 20 }}>
              {elementNames[pattern.element]?.[lang]}
            </span>
            {organ && (
              <span style={{ background: 'var(--bg3)', fontSize: '0.75rem', padding: '2px 10px', borderRadius: 20, color: 'var(--text3)' }}>
                {lang === 'he' ? organ.nameHe : organ.nameEn}
              </span>
            )}
          </div>
          <h2 style={{ color }}>{pattern.name[lang]}</h2>
        </div>

        {/* Symptoms */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 8 }}>
            {lang === 'he' ? 'תסמינים מרכזיים' : 'Key symptoms'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {pattern.symptoms.map((s) => (
              <span key={s.id} style={{ background: `${color}12`, color, fontSize: '0.8rem', padding: '4px 10px', borderRadius: 20 }}>
                {s[lang]}
              </span>
            ))}
          </div>
        </div>

        {/* Tongue & Pulse */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginBottom: 4 }}>
              {lang === 'he' ? 'לשון' : 'Tongue'}
            </div>
            <p style={{ fontSize: '0.88rem' }}>{pattern.tongue[lang]}</p>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginBottom: 4 }}>
              {lang === 'he' ? 'דופק' : 'Pulse'}
            </div>
            <p style={{ fontSize: '0.88rem' }}>{pattern.pulse[lang]}</p>
          </div>
        </div>

        {/* Protocol */}
        <div style={{ background: 'rgba(124,131,245,0.08)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginBottom: 10 }}>
            {lang === 'he' ? 'פרוטוקול טיפול' : 'Treatment Protocol'}
          </div>
          <ol style={{ paddingRight: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pattern.protocol[lang].map((step, i) => (
              <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.5 }}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Points */}
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 8 }}>
            {lang === 'he' ? 'נקודות טיפול' : 'Treatment points'}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {pattern.treatmentPoints.map((pt) => (
              <span key={pt} style={{ background: `${color}20`, color, fontSize: '0.9rem', padding: '6px 14px', borderRadius: 20, fontFamily: 'monospace', fontWeight: 700 }}>
                {pt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtocolsPage() {
  const { lang } = useLang();
  const [selected, setSelected] = useState(null);
  const [filterEl, setFilterEl] = useState('all');

  const filtered = filterEl === 'all' ? patterns : patterns.filter((p) => p.element === filterEl);
  const elements = [...new Set(patterns.map((p) => p.element))];

  return (
    <div>
      <div className="page-header">
        <h1>{lang === 'he' ? 'פרוטוקולי טיפול' : 'Treatment Protocols'}</h1>
        <p>{lang === 'he' ? `${patterns.length} דפוסי מחלה עם פרוטוקולים מלאים` : `${patterns.length} patterns with full treatment protocols`}</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          onClick={() => setFilterEl('all')}
          style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', background: filterEl === 'all' ? 'var(--accent)' : 'var(--bg3)', color: filterEl === 'all' ? 'white' : 'var(--text2)', border: '1px solid var(--border)', transition: 'all 0.15s' }}
        >
          {lang === 'he' ? 'הכל' : 'All'}
        </button>
        {elements.map((el) => {
          const c = elementColors[el];
          const active = filterEl === el;
          return (
            <button key={el} onClick={() => setFilterEl(el)} style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', background: active ? `${c}25` : 'var(--bg3)', color: active ? c : 'var(--text2)', border: `1px solid ${active ? c : 'var(--border)'}`, transition: 'all 0.15s' }}>
              {elementNames[el]?.[lang]}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((p) => {
          const color = elementColors[p.element] || 'var(--accent)';
          const organ = organs.find((o) => o.id === p.organ);
          return (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateX(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ background: `${color}18`, color, fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20 }}>
                      {elementNames[p.element]?.[lang]}
                    </span>
                    {organ && <span style={{ background: 'var(--bg3)', color: 'var(--text3)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20 }}>
                      {lang === 'he' ? organ.nameHe : organ.nameEn}
                    </span>}
                  </div>
                  <h3 style={{ color, marginBottom: 6 }}>{p.name[lang]}</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.symptoms.slice(0, 4).map((s) => (
                      <span key={s.id} style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>• {s[lang]}</span>
                    ))}
                    {p.symptoms.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>+{p.symptoms.length - 4}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxWidth: 160, justifyContent: 'flex-end' }}>
                  {p.treatmentPoints.map((pt) => (
                    <span key={pt} style={{ background: `${color}15`, color, fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20, fontFamily: 'monospace' }}>{pt}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <ProtocolModal pattern={selected} onClose={() => setSelected(null)} lang={lang} />}
    </div>
  );
}
