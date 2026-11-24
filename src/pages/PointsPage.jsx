import { useRef, useState } from 'react';
import { points as rawPoints } from '../data/points';
import { organs } from '../data/organs';
import { enrichPointsWithZenDikur } from '../data/zen-dikur-points';
import Sheet from '../components/Sheet';

const points = enrichPointsWithZenDikur(rawPoints);

function searchPoints(query) {
  const q = query.toLowerCase();
  return points.filter(p =>
    p.id.toLowerCase().includes(q) ||
    p.nameCn.toLowerCase().includes(q) ||
    p.nameHe.includes(query) ||
    (p.poeticHe && p.poeticHe.includes(query)) ||
    p.indications.some(i => i.toLowerCase().includes(q)) ||
    p.function.some(f => f.toLowerCase().includes(q))
  );
}

const elementColors = { wood: 'var(--wood)', fire: 'var(--fire)', earth: 'var(--earth)', metal: 'var(--metal)', water: 'var(--water)' };

const categoryColors = {
  'Yuan': '#7c83f5',
  'He-Sea': '#66bb6a',
  'Back-Shu': '#ffa726',
  'Luo': '#ce93d8',
  'Front-Mu': '#42a5f5',
  'Master': '#ff7043',
  'Influential': '#26c6da',
  'Well': '#ef5350',
  'Ying-Spring': '#ab47bc',
  'Jing-River': '#5c6bc0',
  'Blood': '#e53935',
  'Meeting': '#00897b',
  'General': 'var(--text3)',
  'Local': 'var(--text3)',
  'Grounding': '#4caf50',
  'Wind': '#78909c',
};

function PointModal({ point, onClose }) {
  const organ = organs.find((o) => o.id === point.meridian);
  const color = organ ? elementColors[organ.element] || 'var(--accent)' : 'var(--accent)';

  return (
    <>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {point.category.split(' / ').map((cat) => (
              <span key={cat} style={{
                background: `${categoryColors[cat.trim()] || 'var(--text3)'}20`,
                color: categoryColors[cat.trim()] || 'var(--text2)',
                fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20,
              }}>{cat}</span>
            ))}
          </div>
          <h2 style={{ color }}>
            {point.id} — {point.nameHe}
          </h2>
          <p style={{ color: 'var(--text3)', fontSize: '0.88rem', marginTop: 2 }}>
            {point.nameCn} · מרידיאן {organ?.nameHe || point.meridian.toUpperCase()}
          </p>
          {point.poeticHe && (
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 500 }}>✦ {point.poeticHe}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text3)', background: 'var(--bg3)', padding: '1px 6px', borderRadius: 20 }}>Zen-Dikur</span>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 4 }}>לוקציה</div>
          <p style={{ fontSize: '0.9rem' }}>{point.location}</p>
        </div>

        <div style={{ background: 'rgba(124,131,245,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginBottom: 8 }}>פונקציות</div>
          <ul style={{ paddingRight: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {point.function.map((f, i) => (
              <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>{f}</li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 8 }}>התוויות</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {point.indications.map((ind) => (
              <span key={ind} style={{ background: `${color}15`, color, fontSize: '0.8rem', padding: '4px 10px', borderRadius: 20 }}>
                {ind}
              </span>
            ))}
          </div>
        </div>
    </>
  );
}

export default function PointsPage() {
  const [query, setQuery] = useState('');
  const [filterMeridian, setFilterMeridian] = useState('all');
  const [selected, setSelected] = useState(null);
  // Keep last-selected content visible during the Sheet exit animation
  const lastSelected = useRef(null);
  if (selected) lastSelected.current = selected;

  const filtered = (() => {
    let list = query ? searchPoints(query) : points;
    if (filterMeridian !== 'all') list = list.filter((p) => p.meridian === filterMeridian);
    return list;
  })();

  return (
    <div>
      <div className="page-header">
        <h1>נקודות טצובו</h1>
        <p>{points.length} נקודות — לחץ על נקודה לפרטים מלאים</p>
      </div>

      {/* Search */}
      <div className="search-box">
        <span>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפש לפי קוד (ST36), שם (Zu San Li), התווייה (כאב ראש)..."
        />
        {query && <button onClick={() => setQuery('')} style={{ color: 'var(--text3)', background: 'none' }}>✕</button>}
      </div>

      {/* Meridian filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <button
          onClick={() => setFilterMeridian('all')}
          style={{
            padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem',
            background: filterMeridian === 'all' ? 'var(--accent)' : 'var(--bg3)',
            color: filterMeridian === 'all' ? 'white' : 'var(--text2)',
            border: '1px solid var(--border)',
          }}
        >כל המרידיאנים</button>
        {organs.map((o) => {
          const color = elementColors[o.element] || 'var(--accent)';
          const active = filterMeridian === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setFilterMeridian(o.id)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem',
                background: active ? `${color}25` : 'var(--bg3)',
                color: active ? color : 'var(--text2)',
                border: `1px solid ${active ? color : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}
            >
              {o.code}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginBottom: 16 }}>
        מציג {filtered.length} נקודות
      </p>

      {/* Grid */}
      <div className="grid-3">
        {filtered.map((point) => {
          const organ = organs.find((o) => o.id === point.meridian);
          const color = organ ? elementColors[organ.element] || 'var(--accent)' : 'var(--accent)';
          return (
            <div
              key={point.id}
              className="point-card"
              onClick={() => setSelected(point)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span className="point-code" style={{ color }}>{point.id}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 20 }}>
                  {point.category.split(' / ')[0]}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: point.poeticHe ? 2 : 6 }}>{point.nameCn}</div>
              {point.poeticHe && (
                <div style={{ fontSize: '0.72rem', color: 'var(--gold)', marginBottom: 4 }}>✦ {point.poeticHe}</div>
              )}
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 10 }}>{point.location.split(',')[0]}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {point.indications.slice(0, 3).map((ind) => (
                  <span key={ind} style={{ background: `${color}12`, color: color, fontSize: '0.68rem', padding: '2px 7px', borderRadius: 20 }}>{ind}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>
          לא נמצאו נקודות עבור "{query}"
        </div>
      )}

      <Sheet open={!!selected} onClose={() => setSelected(null)}>
        {lastSelected.current && (
          <PointModal point={lastSelected.current} onClose={() => setSelected(null)} />
        )}
      </Sheet>
    </div>
  );
}
