import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { FireIcon } from '../components/NavIcons';

const MASTERY_KEY = 'tcm_mastered_topics';
const NOTES_KEY = 'tcm_notes';
const STREAK_KEY = 'tcm_streak';

const studyTopics = [
  { id: 'lu', he: 'ריאות (Lu)', en: 'Lungs (Lu)', category: 'organs' },
  { id: 'li', he: 'מעי גס (Li)', en: 'Large Intestine (Li)', category: 'organs' },
  { id: 'st', he: 'קיבה (St)', en: 'Stomach (St)', category: 'organs' },
  { id: 'sp', he: 'טחול-לבלב (Sp)', en: 'Spleen-Pancreas (Sp)', category: 'organs' },
  { id: 'ht', he: 'לב (Ht)', en: 'Heart (Ht)', category: 'organs' },
  { id: 'si', he: 'מעי דק (Si)', en: 'Small Intestine (Si)', category: 'organs' },
  { id: 'ub', he: 'שלפוחית (Ub)', en: 'Bladder (Ub)', category: 'organs' },
  { id: 'kid', he: 'כליות (Kid)', en: 'Kidneys (Kid)', category: 'organs' },
  { id: 'pc', he: 'מעטפת לב (Pc)', en: 'Pericardium (Pc)', category: 'organs' },
  { id: 'tw', he: 'תלת מחמם (TW)', en: 'Triple Warmer (TW)', category: 'organs' },
  { id: 'gb', he: 'כיס מרה (Gb)', en: 'Gallbladder (Gb)', category: 'organs' },
  { id: 'liv', he: 'כבד (Liv)', en: 'Liver (Liv)', category: 'organs' },
  { id: 'el_wood', he: 'יסוד עץ', en: 'Wood Element', category: 'elements' },
  { id: 'el_fire', he: 'יסוד אש', en: 'Fire Element', category: 'elements' },
  { id: 'el_earth', he: 'יסוד אדמה', en: 'Earth Element', category: 'elements' },
  { id: 'el_metal', he: 'יסוד מתכת', en: 'Metal Element', category: 'elements' },
  { id: 'el_water', he: 'יסוד מים', en: 'Water Element', category: 'elements' },
  { id: '8principles', he: '8 העקרונות', en: '8 Principles', category: 'theory' },
  { id: 'back_shu', he: 'נקודות Back-Shu', en: 'Back-Shu Points', category: 'theory' },
  { id: 'key_points', he: 'נקודות מפתח (ST36, SP6, LV3...)', en: 'Key points (ST36, SP6, LV3...)', category: 'theory' },
];

const categories = [
  { id: 'organs', he: 'איברים', en: 'Organs' },
  { id: 'elements', he: 'יסודות', en: 'Elements' },
  { id: 'theory', he: 'תיאוריה', en: 'Theory' },
];

const topicOptions = [
  { v: 'organs', he: 'איברים', en: 'Organs' },
  { v: 'points', he: 'נקודות', en: 'Points' },
  { v: 'elements', he: 'יסודות', en: 'Elements' },
  { v: 'cases', he: 'מקרי מטופלים', en: 'Case Studies' },
  { v: 'principles', he: '8 עקרונות', en: '8 Principles' },
  { v: 'other', he: 'אחר', en: 'Other' },
];

function loadJSON(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function updateStreak() {
  const today = new Date().toDateString();
  const data = loadJSON(STREAK_KEY, { last: null, streak: 0 });
  if (data.last === today) return data.streak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const streak = data.last === yesterday ? data.streak + 1 : 1;
  saveJSON(STREAK_KEY, { last: today, streak });
  return streak;
}

export default function ProgressPage() {
  const { lang } = useLang();
  const [mastered, setMastered] = useState(() => loadJSON(MASTERY_KEY, []));
  const [notes, setNotes] = useState(() => loadJSON(NOTES_KEY, []));
  const [noteText, setNoteText] = useState('');
  const [noteTopic, setNoteTopic] = useState('organs');
  const [streak, setStreak] = useState(0);
  const [tab, setTab] = useState('mastery');

  useEffect(() => { setStreak(updateStreak()); }, []);

  const toggleMastered = (id) => {
    const updated = mastered.includes(id) ? mastered.filter((x) => x !== id) : [...mastered, id];
    setMastered(updated);
    saveJSON(MASTERY_KEY, updated);
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = { id: Date.now().toString(), date: new Date().toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US'), topic: noteTopic, text: noteText };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveJSON(NOTES_KEY, updated);
    setNoteText('');
  };

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveJSON(NOTES_KEY, updated);
  };

  const totalTopics = studyTopics.length;
  const masteredCount = mastered.length;
  const pct = Math.round((masteredCount / totalTopics) * 100);

  const labels = {
    title: { he: 'התקדמות', en: 'Progress' },
    mastery: { he: 'שליטה בנושאים', en: 'Topic Mastery' },
    notes: { he: 'הערות אישיות', en: 'Personal Notes' },
    streak: { he: 'רצף לימוד', en: 'Study Streak' },
    days: { he: 'ימים ברצף', en: 'days streak' },
    addNote: { he: 'הוסף הערה', en: 'Add note' },
    placeholder: { he: 'כתוב הערה...', en: 'Write a note...' },
    noNotes: { he: 'אין הערות עדיין', en: 'No notes yet' },
    masteredPct: { he: 'נשלט', en: 'mastered' },
  };
  const l = (k) => labels[k]?.[lang] ?? k;

  return (
    <div>
      <div className="page-header">
        <h1>{l('title')}</h1>
      </div>

      {/* Streak + overall */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
          <div style={{ color: '#ffa726', marginBottom: 4, display: 'flex', justifyContent: 'center' }}><FireIcon size={28} /></div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffa726' }}>{streak}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{l('days')}</div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: 4, color: 'var(--wood)' }}>✓</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--wood)' }}>{masteredCount}/{totalTopics}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{l('masteredPct')}</div>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: 4, color: 'var(--accent)' }}>✦</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>{notes.length}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{lang === 'he' ? 'הערות' : 'notes'}</div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 6 }}>
          <span>{lang === 'he' ? 'התקדמות כוללת' : 'Overall progress'}</span>
          <span style={{ color: 'var(--wood)' }}>{pct}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {[{ id: 'mastery', he: 'נושאים', en: 'Topics' }, { id: 'notes', he: 'הערות', en: 'Notes' }].map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t[lang]}
          </button>
        ))}
      </div>

      {tab === 'mastery' && (
        <div>
          {categories.map((cat) => {
            const catTopics = studyTopics.filter((t) => t.category === cat.id);
            const catMastered = catTopics.filter((t) => mastered.includes(t.id)).length;
            return (
              <div key={cat.id} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3>{cat[lang]}</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{catMastered}/{catTopics.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {catTopics.map((topic) => {
                    const done = mastered.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => toggleMastered(topic.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          background: done ? 'rgba(102,187,106,0.08)' : 'var(--bg2)',
                          border: `1px solid ${done ? 'rgba(102,187,106,0.3)' : 'var(--border)'}`,
                          borderRadius: 8, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: done ? 'var(--wood)' : 'var(--bg3)',
                          border: `2px solid ${done ? 'var(--wood)' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', flexShrink: 0,
                        }}>
                          {done ? '✓' : ''}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: done ? 'var(--wood)' : 'var(--text2)' }}>
                          {topic[lang]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'notes' && (
        <div>
          {/* Add note form */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <select
                value={noteTopic}
                onChange={(e) => setNoteTopic(e.target.value)}
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontSize: '0.85rem', outline: 'none' }}
              >
                {topicOptions.map((o) => <option key={o.v} value={o.v}>{o[lang]}</option>)}
              </select>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={l('placeholder')}
              rows={3}
              style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit', direction: 'rtl' }}
            />
            <button
              onClick={addNote}
              disabled={!noteText.trim()}
              style={{ marginTop: 10, padding: '8px 20px', background: noteText.trim() ? 'var(--accent)' : 'var(--bg3)', color: noteText.trim() ? 'white' : 'var(--text3)', borderRadius: 8, fontSize: '0.88rem', transition: 'all 0.15s' }}
            >
              + {l('addNote')}
            </button>
          </div>

          {/* Notes list */}
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>{l('noNotes')}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notes.map((note) => (
                <div key={note.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ background: 'var(--bg3)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 20, color: 'var(--text3)' }}>
                        {topicOptions.find((o) => o.v === note.topic)?.[lang] ?? note.topic}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{note.date}</span>
                    </div>
                    <button onClick={() => deleteNote(note.id)} style={{ background: 'none', color: 'var(--text3)', fontSize: '0.8rem' }}>✕</button>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
