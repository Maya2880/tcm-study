import { useState } from 'react';
import { elements } from '../data/elements';
import { organs } from '../data/organs';

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };
const elementColorHex = { wood: '#66bb6a', fire: '#ef5350', earth: '#ffa726', metal: '#bdbdbd', water: '#42a5f5' };

const shengArrows = [
  { from: 'wood', to: 'fire' },
  { from: 'fire', to: 'earth' },
  { from: 'earth', to: 'metal' },
  { from: 'metal', to: 'water' },
  { from: 'water', to: 'wood' },
];

export default function ElementsPage() {
  const [selected, setSelected] = useState(null);
  const el = selected ? elements.find((e) => e.id === selected) : null;

  return (
    <div>
      <div className="page-header">
        <h1>חמשת היסודות</h1>
        <p>Wu Xing — עץ, אש, אדמה, מתכת, מים</p>
      </div>

      {/* Diagram */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        {/* Pentagon visual */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', textAlign: 'center', marginBottom: 4 }}>לחץ לבחירת יסוד</div>
          {/* Simple row of elements */}
          <div style={{ display: 'flex', gap: 10 }}>
            {elements.map((e) => {
              const c = elementColorHex[e.id];
              const isSelected = selected === e.id;
              return (
                <div
                  key={e.id}
                  onClick={() => setSelected(isSelected ? null : e.id)}
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: isSelected ? c : `${c}25`,
                    border: `2px solid ${c}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: isSelected ? 'scale(1.12)' : '',
                  }}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? 'white' : c }}>{e.nameHe}</span>
                </div>
              );
            })}
          </div>

          {/* Sheng cycle legend */}
          <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text3)', marginTop: 8 }}>
            <span>→ מחזור יצירה (Sheng)</span>
            <span style={{ color: 'var(--fire)' }}>⊗ מחזור שליטה (Ke)</span>
          </div>

          {/* Cycle table */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: '0.82rem', minWidth: 240 }}>
            <div style={{ color: 'var(--text3)', marginBottom: 8, fontSize: '0.72rem' }}>מחזור יצירה (Sheng)</div>
            {shengArrows.map(({ from, to }) => (
              <div key={from} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                <span style={{ color: elementColors[from] }}>{elements.find(e=>e.id===from).nameHe}</span>
                <span style={{ color: 'var(--text3)' }}>→ מייצרת →</span>
                <span style={{ color: elementColors[to] }}>{elements.find(e=>e.id===to).nameHe}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', fontSize: '0.82rem', minWidth: 240 }}>
            <div style={{ color: 'var(--text3)', marginBottom: 8, fontSize: '0.72rem' }}>מחזור שליטה (Ke)</div>
            {elements.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                <span style={{ color: elementColors[e.id] }}>{e.nameHe}</span>
                <span style={{ color: 'var(--text3)' }}>⊗ שולט ב-</span>
                <span style={{ color: elementColors[e.controls] }}>{elements.find(x=>x.id===e.controls).nameHe}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {el && (
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{
              background: `${elementColorHex[el.id]}10`,
              border: `1px solid ${elementColorHex[el.id]}40`,
              borderRadius: 14, padding: '20px 22px',
            }}>
              <h2 style={{ color: elementColors[el.id], marginBottom: 14, fontSize: '1.4rem' }}>
                יסוד {el.nameHe} · {el.nameEn}
              </h2>

              <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 16, lineHeight: 1.6 }}>
                {el.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'עונה', value: el.season },
                  { label: 'אקלים', value: el.climate },
                  { label: 'רגש שלילי', value: el.emotion },
                  { label: 'רגש חיובי', value: el.emotionPos },
                  { label: 'טעם', value: el.taste },
                  { label: 'צבע', value: el.color_body },
                  { label: 'חוש', value: el.sense },
                  { label: 'רקמה', value: el.tissue },
                  { label: 'נפתח ל', value: el.opensTo },
                  { label: 'אנרגיה', value: el.energy },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: '0.85rem' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Organs */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 6 }}>איברים</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {el.organs.map((oid) => {
                    const org = organs.find((o) => o.id === oid);
                    return org ? (
                      <div key={oid} style={{
                        background: `${elementColorHex[el.id]}20`,
                        border: `1px solid ${elementColorHex[el.id]}40`,
                        borderRadius: 8, padding: '6px 12px', fontSize: '0.85rem',
                      }}>
                        <strong style={{ color: elementColors[el.id] }}>{org.code}</strong> {org.nameHe}
                        <span style={{ fontSize: '0.68rem', color: 'var(--text3)', marginRight: 4 }}>
                          ({org.type === 'yin' ? 'ין' : 'ינג'})
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Cycles */}
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, background: 'rgba(102,187,106,0.08)', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem' }}>
                  <div style={{ color: 'var(--wood)', fontSize: '0.68rem', marginBottom: 4 }}>מייצרת</div>
                  <strong style={{ color: elementColors[el.generates] }}>{elements.find(e=>e.id===el.generates)?.nameHe}</strong>
                </div>
                <div style={{ flex: 1, background: 'rgba(239,83,80,0.08)', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem' }}>
                  <div style={{ color: 'var(--fire)', fontSize: '0.68rem', marginBottom: 4 }}>שולטת ב</div>
                  <strong style={{ color: elementColors[el.controls] }}>{elements.find(e=>e.id===el.controls)?.nameHe}</strong>
                </div>
                <div style={{ flex: 1, background: 'rgba(66,165,245,0.08)', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem' }}>
                  <div style={{ color: 'var(--water)', fontSize: '0.68rem', marginBottom: 4 }}>נשלטת ע"י</div>
                  <strong style={{ color: elementColors[el.controlledBy] }}>{elements.find(e=>e.id===el.controlledBy)?.nameHe}</strong>
                </div>
              </div>

              {el.imbalance && (
                <div style={{ marginTop: 12, background: 'rgba(239,83,80,0.07)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#ef9a9a', marginBottom: 4 }}>סימני חוסר איזון</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{el.imbalance}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* All elements cards */}
      {!el && (
        <div className="grid-3">
          {elements.map((e) => {
            const c = elementColorHex[e.id];
            return (
              <div
                key={e.id}
                onClick={() => setSelected(e.id)}
                style={{
                  background: 'var(--bg2)', border: `1px solid ${c}25`,
                  borderRadius: 12, padding: '18px 20px', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = `${c}60`; ev.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = `${c}25`; ev.currentTarget.style.transform = ''; }}
              >
                <h3 style={{ color: elementColors[e.id], marginBottom: 10 }}>{e.nameHe} · {e.nameEn}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text2)', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div><span style={{ color: 'var(--text3)' }}>עונה: </span>{e.season}</div>
                  <div><span style={{ color: 'var(--text3)' }}>רגש: </span>{e.emotion}</div>
                  <div><span style={{ color: 'var(--text3)' }}>חושים: </span>{e.sense}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {e.organs.map((oid) => {
                    const org = organs.find((o) => o.id === oid);
                    return org ? (
                      <span key={oid} style={{ background: `${c}18`, color: elementColors[e.id], fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20 }}>
                        {org.code}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
