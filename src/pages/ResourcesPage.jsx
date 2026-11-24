import { useLang } from '../context/LanguageContext';

const resources = [
  {
    id: 'zen-dikur',
    he: { title: 'זן דיקור', desc: 'אתר לימוד רפואה סינית בעברית — 14 מרידיאנים ונקודות, פורמולות צמחים, צמחים בודדים, Qi-Quiz ועוד', tag: 'נקודות · צמחים · פורמולות' },
    en: { title: 'Zen Dikur', desc: 'Hebrew TCM study site — all 14 meridians & points, herbal formulas, individual herbs, Qi-Quiz and more', tag: 'Points · Herbs · Formulas' },
    url: 'https://www.zen-dikur.com/acupuncture',
    color: 'var(--wood)',
  },
];

export default function ResourcesPage() {
  const { lang } = useLang();
  const t = lang === 'he';

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>{t ? 'מקורות חיצוניים' : 'Web Resources'}</h1>
        <p>{t ? 'אתרי לימוד ומידע רפואה סינית' : 'TCM study and reference websites'}</p>
      </div>

      <div className="resources-grid">
        {resources.map((r) => {
          const info = t ? r.he : r.en;
          return (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card"
              style={{ '--rc': r.color }}
            >
              <div className="resource-card-top">
                <span className="resource-dot" />
                <span className="resource-tag">{info.tag}</span>
              </div>
              <h2 className="resource-title">{info.title}</h2>
              <p className="resource-desc">{info.desc}</p>
              <div className="resource-url">{r.url.replace('https://', '')}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
