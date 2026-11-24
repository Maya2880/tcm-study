import { useState } from 'react';
import { organs } from '../data/organs';
import { points } from '../data/points';

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };
const elementOrder = ['wood', 'fire', 'earth', 'metal', 'water'];
const elementNames = { wood: 'עץ', fire: 'אש', earth: 'אדמה', metal: 'מתכת', water: 'מים' };

function OrganModal({ organ, onClose }) {
  const organPoints = points.filter((p) => p.meridian === organ.id);
  const color = elementColors[organ.element] || 'var(--accent)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span className={`badge badge-${organ.type}`}>{organ.type === 'yin' ? 'ייני' : 'יאנגי'}</span>
            <span className={`badge badge-${organ.element}`}>{elementNames[organ.element]}</span>
            <span style={{ background: 'var(--bg3)', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', color: 'var(--text3)' }}>
              {organ.code} — {organPoints.length} נקודות
            </span>
          </div>
          <h2 style={{ color }}>
            {organ.nameHe} <span style={{ fontSize: '0.9rem', color: 'var(--text3)', fontWeight: 400 }}>({organ.nameEn})</span>
          </h2>
          <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: 4 }}>
            בן זוג: <strong style={{ color: 'var(--text2)' }}>{organ.pairNameHe} ({organ.pair.toUpperCase()})</strong>
          </p>
        </div>

        {/* Properties grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'רגש', value: organ.emotionHe },
            { label: 'עונה', value: organ.seasonHe },
            { label: 'טעם', value: organ.tasteHe },
            { label: 'אקלים', value: organ.climateHe },
            { label: 'צבע', value: organ.colorHe },
            { label: 'פתיחה אל', value: organ.opensToHe },
          ].map((item) => (
            <div key={item.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: '0.88rem' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 6 }}>שולט על</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text2)' }}>{organ.controlsHe}</p>
        </div>

        {/* Western function */}
        <div style={{ background: 'rgba(66,165,245,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: '#42a5f5', marginBottom: 4 }}>פונקציה מערבית</div>
          <p style={{ fontSize: '0.88rem' }}>{organ.westernFunction}</p>
        </div>

        {/* Chinese functions */}
        <div style={{ background: 'rgba(124,131,245,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginBottom: 8 }}>פונקציות סיניות</div>
          <ul style={{ paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {organ.chineseFunctions.map((f, i) => (
              <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Pathologies */}
        {organ.pathologies && organ.pathologies.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8 }}>דפוסי מחלה נפוצים</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {organ.pathologies.map((p) => (
                <div key={p.key} style={{ background: 'rgba(239,83,80,0.08)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef9a9a', marginBottom: 6 }}>{p.pattern}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.signs.map((s) => (
                      <span key={s} style={{ background: 'rgba(239,83,80,0.1)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20, color: 'var(--text2)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key points */}
        {organPoints.length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8 }}>נקודות מפתח ({organPoints.length})</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {organPoints.map((p) => (
                <div key={p.id} style={{ background: `${color}15`, border: `1px solid ${color}40`, borderRadius: 8, padding: '6px 12px', fontSize: '0.82rem' }}>
                  <span style={{ color, fontWeight: 700 }}>{p.id}</span>
                  <span style={{ color: 'var(--text3)', marginRight: 4 }}> {p.nameCn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {organ.notes && (
          <div style={{ marginTop: 14, background: 'rgba(255,213,79,0.06)', border: '1px solid rgba(255,213,79,0.15)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginBottom: 4 }}>הערה חשובה</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{organ.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrgansPage() {
  const [selected, setSelected] = useState(null);
  const [filterEl, setFilterEl] = useState('all');

  const filtered = filterEl === 'all' ? organs : organs.filter((o) => o.element === filterEl);

  const grouped = elementOrder.reduce((acc, el) => {
    const group = filtered.filter((o) => o.element === el);
    if (group.length) acc[el] = group;
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h1>תורת האיברים</h1>
        <p>12 איברים פנימיים — פונקציות, רגשות, דפוסי מחלה</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[{ id: 'all', label: 'כל האיברים' }, ...elementOrder.map((e) => ({ id: e, label: elementNames[e] }))].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterEl(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              background: filterEl === f.id ? (f.id === 'all' ? 'var(--accent)' : elementColors[f.id]) : 'var(--bg3)',
              color: filterEl === f.id ? 'white' : 'var(--text2)',
              border: '1px solid',
              borderColor: filterEl === f.id ? 'transparent' : 'var(--border)',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      {Object.entries(grouped).map(([el, orgs]) => (
        <div key={el} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: elementColors[el] }} />
            <h2 style={{ color: elementColors[el] }}>יסוד {elementNames[el]}</h2>
          </div>
          <div className="grid-2">
            {orgs.map((organ) => (
              <div
                key={organ.id}
                className="organ-card"
                onClick={() => setSelected(organ)}
                style={{ borderColor: `${elementColors[organ.element]}20` }}
              >
                <div className="organ-card-header">
                  <div>
                    <div className="organ-name">{organ.nameHe}</div>
                    <div className="organ-code">{organ.nameEn} · {organ.code}</div>
                  </div>
                  <span className={`badge badge-${organ.type}`}>{organ.type === 'yin' ? 'ייני' : 'יאנגי'}</span>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>✦ {organ.emotionHe}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>✦ {organ.seasonHe}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                  {organ.chineseFunctions[0]}
                </p>

                <div style={{ marginTop: 10, fontSize: '0.75rem', color: elementColors[organ.element] }}>
                  בן זוג: {organ.pairNameHe} →
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selected && <OrganModal organ={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
