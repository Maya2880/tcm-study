import { useState, useEffect, useRef, useCallback } from 'react';
import { points } from '../data/points';
import { organs } from '../data/organs';
import { patterns } from '../data/patterns';
import { useLang } from '../context/LanguageContext';

// ─── Agent definitions ─────────────────────────────────────────────────────

const AGENTS = [
  {
    id: 'meridian',
    avatar: 'מ',
    name: 'ד"ר מרידיאן',
    nameEn: 'Dr. Meridian',
    role: 'מומחה נקודות',
    roleEn: 'Points Expert',
    specialty: ['נקודות', 'מרידיאנים', 'מיקומים'],
    color: '#7c83f5',
    baseCapacity: 88,
    greeting: 'שלום! אני מתמחה בנקודות דיקור. שאל/י אותי על כל נקודה — מיקום, פונקציה, קטגוריה.',
    greetingEn: 'Hello! I specialize in acupoints. Ask me about any point — location, function, category.',
  },
  {
    id: 'theorist',
    avatar: 'ת',
    name: 'ד"ר יין-יאנג',
    nameEn: 'Dr. Yin-Yang',
    role: 'תיאוריה סינית',
    roleEn: 'TCM Theorist',
    specialty: ['איברים', 'יסודות', '8 עקרונות'],
    color: '#9c41f0',
    baseCapacity: 72,
    greeting: 'ברוך הבא. אני מכסה תיאוריית TCM — יסודות, איברים, יין/יאנג, צ׳י ודם. מה מעניין אותך?',
    greetingEn: 'Welcome. I cover TCM theory — elements, organs, Yin/Yang, Qi and Blood. What interests you?',
  },
  {
    id: 'clinician',
    avatar: 'ק',
    name: 'ד"ר קליניקה',
    nameEn: 'Dr. Clinica',
    role: 'אבחנה וטיפול',
    roleEn: 'Clinical Advisor',
    specialty: ['דפוסים', 'פרוטוקולים', 'מקרים'],
    color: '#ef5350',
    baseCapacity: 55,
    greeting: 'אני מנתח דפוסים קליניים ופרוטוקולי טיפול. תאר/י מקרה או שאל/י על דפוס.',
    greetingEn: 'I analyze clinical patterns and treatment protocols. Describe a case or ask about a pattern.',
  },
  {
    id: 'coach',
    avatar: 'C',
    name: 'Coach מאיה',
    nameEn: 'Coach Maya',
    role: 'אסטרטגיית לימוד',
    roleEn: 'Study Coach',
    specialty: ['חזרה', 'טכניקות', 'מוטיבציה'],
    color: '#66bb6a',
    baseCapacity: 95,
    greeting: 'היי! אני כאן לעזור לך ללמוד בצורה חכמה יותר. יש לי כמה טכניקות מנצחות לשיאצו.',
    greetingEn: 'Hey! I\'m here to help you study smarter. I have some great techniques for shiatsu learning.',
  },
];

// ─── Response engine ───────────────────────────────────────────────────────

function buildResponse(agentId, text) {
  const upper = text.toUpperCase();
  const lower = text.toLowerCase();

  // --- Point lookup ---
  const pointMatch = upper.match(/\b([A-Z]{1,3}\d+)\b/);
  if (pointMatch) {
    const p = points.find(x => x.code === pointMatch[1]);
    if (p) {
      if (agentId === 'meridian') {
        return `**${p.code} — ${p.nameCn}** (${p.nameHe})\n\n**מיקום:** ${p.location}\n\n**פונקציות:**\n${p.function.map(f => `• ${f}`).join('\n')}\n\n**אינדיקציות:** ${p.indications.join(', ')}\n\n**קטגוריה:** ${p.category}`;
      }
      return `${p.code} (${p.nameCn}) — ${p.nameHe}: ${p.function[0]}. קטגוריה: ${p.category}.`;
    }
  }

  // --- Organ lookup (Hebrew keywords) ---
  const organMap = { 'כבד': 'liv', 'ריאות': 'lu', 'לב': 'ht', 'טחול': 'sp', 'כליות': 'kid', 'כיס מרה': 'gb', 'קיבה': 'st', 'מעי גס': 'li', 'מעי דק': 'si', 'שלפוחית': 'ub', 'מעטפת': 'pc', 'liver': 'liv', 'lung': 'lu', 'heart': 'ht', 'spleen': 'sp', 'kidney': 'kid' };
  for (const [kw, id] of Object.entries(organMap)) {
    if (lower.includes(kw)) {
      const o = organs.find(x => x.id === id);
      if (o) {
        if (agentId === 'theorist') {
          return `**${o.nameHe} (${o.nameEn})**\n\n**יסוד:** ${o.elementHe}\n**רגש:** ${o.emotionHe}\n**עונה:** ${o.seasonHe}\n**אקלים:** ${o.climateHe}\n**פתח:** ${o.opensToHe}\n\n**פונקציות סיניות:**\n${o.chineseFunctions?.map(f => `• ${f}`).join('\n') || ''}`;
        }
        return `${o.nameHe}: יסוד ${o.elementHe}, רגש ${o.emotionHe}, עונה ${o.seasonHe}. ${o.chineseFunctions?.[0] || ''}`;
      }
    }
  }

  // --- Pattern lookup ---
  const patternMap = { 'חסר צ': 'deficiency', 'סטגנ': 'stagnation', 'חום': 'heat', 'לחות': 'damp', 'ריאות': 'lu', 'כבד': 'liv', 'spleen qi': 'sp_qi_def', 'liver qi': 'liv_qi_stag' };
  for (const [kw, type] of Object.entries(patternMap)) {
    if (lower.includes(kw.toLowerCase())) {
      const pat = patterns?.find(p => p.id.includes(type) || p.name?.he?.includes(kw));
      if (pat && agentId === 'clinician') {
        return `**${pat.name?.he}**\n\n**סימנים עיקריים:**\n${pat.symptoms?.slice(0, 4).map(s => `• ${s.he}`).join('\n')}\n\n**לשון:** ${pat.tongue?.he}\n**דופק:** ${pat.pulse?.he}\n\n**נקודות טיפול:**\n${pat.treatmentPoints?.map(p => `• ${p}`).join(', ')}`;
      }
    }
  }

  // --- Study tips (coach) ---
  if (agentId === 'coach') {
    if (lower.includes('לא זוכר') || lower.includes('שכחתי') || lower.includes('קשה') || lower.includes('hard') || lower.includes('forget')) {
      return `**טיפ מנצח לשינון נקודות:**\n\n1. **חבר מיקום לפונקציה** — למד WHERE ולמה זה שם (ST36 = קיבה 36 = "רגל שלושה מייל" → מחזק כוחות)\n2. **קבוצות של 3** — למד 3 נקודות ביחד לפי נושא (Back-Shu, Yuan points, He-Sea)\n3. **כתוב על עצמך** — סמן על הגוף שלך בעט, זה עוזר לזיכרון גופני\n\nנסי את מצב "חזרה חכמה" בכרטיסיות — הוא עוקב אחרי מה שלא ידעת!`;
    }
    if (lower.includes('בחינה') || lower.includes('exam') || lower.includes('test') || lower.includes('מבחן')) {
      return `**פרוטוקול לפני בחינה:**\n\n• יומיים לפני: רק כרטיסיות שגיאות (מצב "תרגל שגיאות")\n• יום לפני: פרק מקרי מטופלים — כל מקרה\n• ביום: 10 דקות בחנות שאלות, ואז אל תיגעי עוד בחומר\n\nהמוח שלך צריך לנוח כדי לאחזר מידע.`;
    }
    return `אני ה-Coach שלך! אני יכולה לעזור עם:\n• טכניקות שינון\n• תכנון לימוד לפני בחינה\n• הבנת הקשרים בין נושאים\n\nמה מאתגר אותך עכשיו?`;
  }

  // --- Generic fallbacks by agent ---
  const fallbacks = {
    meridian: `שאל/י אותי על נקודה ספציפית! לדוגמה: "ST36" ,"LU7" ,"SP6" — אתן לך מיקום, פונקציה וקטגוריה מלאים.`,
    theorist: `אשמח לפרט! שאל/י אותי על:\n• יסוד (עץ, אש, אדמה, מתכת, מים)\n• איבר ספציפי (כבד, לב, ריאות...)\n• מושגים כמו צ'י, דם, יין/יאנג, שן`,
    clinician: `תאר/י מקרה קליני או שאל/י על דפוס TCM. לדוגמה: "חסר צ'י בטחול" או "סטגנציית צ'י בכבד" — אפרט סימנים ופרוטוקול.`,
    coach: `ספר/י לי — מה מאתגר אותך בלימוד השיאצו?`,
  };
  return fallbacks[agentId] || 'אשמח לעזור! שאל/י אותי...';
}

// ─── Capacity simulation ────────────────────────────────────────────────────

function useAgentCapacities() {
  const [caps, setCaps] = useState(() =>
    Object.fromEntries(AGENTS.map(a => [a.id, a.baseCapacity]))
  );
  const [loads, setLoads] = useState(() =>
    Object.fromEntries(AGENTS.map(a => [a.id, 0]))
  );

  const consume = useCallback((agentId, amount = 8) => {
    setCaps(c => ({ ...c, [agentId]: Math.max(10, c[agentId] - amount) }));
    setLoads(l => ({ ...l, [agentId]: l[agentId] + 1 }));
  }, []);

  // Slow recovery
  useEffect(() => {
    const timer = setInterval(() => {
      setCaps(c => {
        const updated = { ...c };
        AGENTS.forEach(a => {
          if (c[a.id] < a.baseCapacity) {
            updated[a.id] = Math.min(a.baseCapacity, c[a.id] + 2);
          }
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return { caps, loads, consume };
}

function statusFromCap(cap) {
  if (cap >= 70) return { dot: '#66bb6a', label: 'זמין', labelEn: 'Available' };
  if (cap >= 40) return { dot: '#ffa726', label: 'עסוק', labelEn: 'Busy' };
  return { dot: '#ef5350', label: 'עמוס', labelEn: 'At capacity' };
}

// ─── Message bubble ─────────────────────────────────────────────────────────

function Bubble({ msg, agent }) {
  const isUser = msg.role === 'user';
  const lines = msg.text.split('\n');

  return (
    <div style={{
      display: 'flex', gap: 10, marginBottom: 16,
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
    }}>
      {!isUser && (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${agent?.color}22`, border: `1.5px solid ${agent?.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
          {agent?.avatar}
        </div>
      )}
      <div style={{
        maxWidth: '72%',
        background: isUser ? 'var(--accent)' : 'var(--bg2)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding: '10px 14px',
        fontSize: '0.9rem',
        lineHeight: 1.65,
        color: isUser ? 'white' : 'var(--text)',
        direction: 'rtl',
      }}>
        {lines.map((line, i) => {
          const bold = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
          return (
            <p key={i} style={{ margin: 0, marginTop: i > 0 ? 4 : 0 }}
              dangerouslySetInnerHTML={{ __html: bold || '&nbsp;' }} />
          );
        })}
        <div style={{ fontSize: '0.65rem', color: isUser ? 'rgba(255,255,255,0.6)' : 'var(--text3)', marginTop: 4, textAlign: isUser ? 'left' : 'right' }}>
          {new Date(msg.ts).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

// ─── Typing indicator ───────────────────────────────────────────────────────

function TypingIndicator({ agent }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-end' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${agent.color}22`, border: `1.5px solid ${agent.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
        {agent.avatar}
      </div>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 5 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: '50%', background: 'var(--text3)',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Agent panel card ───────────────────────────────────────────────────────

function AgentCard({ agent, cap, loads, selected, onClick, lang }) {
  const st = statusFromCap(cap);
  return (
    <div onClick={onClick} style={{
      padding: '14px 16px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s',
      background: selected ? `${agent.color}14` : 'var(--bg2)',
      border: `1.5px solid ${selected ? agent.color + '55' : 'var(--border)'}`,
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${agent.color}20`, border: `1.5px solid ${agent.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            {agent.avatar}
          </div>
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: st.dot, border: '2px solid var(--bg)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: selected ? agent.color : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {agent.name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{lang === 'he' ? agent.role : agent.roleEn}</div>
        </div>
        <div style={{ fontSize: '0.65rem', color: st.dot, flexShrink: 0 }}>
          {lang === 'he' ? st.label : st.labelEn}
        </div>
      </div>

      {/* Capacity bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text3)', marginBottom: 4 }}>
          <span>{lang === 'he' ? 'קיבולת' : 'Capacity'}</span>
          <span style={{ color: cap > 60 ? 'var(--wood)' : cap > 35 ? 'var(--earth)' : 'var(--fire)' }}>{cap}%</span>
        </div>
        <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${cap}%`,
            background: cap > 60 ? 'var(--wood)' : cap > 35 ? 'var(--earth)' : 'var(--fire)',
            borderRadius: 4,
            transition: 'width 0.8s ease, background 0.5s ease',
          }} />
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 4 }}>
          {lang === 'he' ? `${loads} שאלות היום` : `${loads} questions today`}
        </div>
      </div>

      {/* Specialties */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
        {agent.specialty.map(s => (
          <span key={s} style={{ fontSize: '0.62rem', padding: '2px 7px', borderRadius: 20, background: `${agent.color}15`, color: agent.color }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Chat Page ─────────────────────────────────────────────────────────

export default function ChatPage() {
  const { lang } = useLang();
  const [selectedId, setSelectedId] = useState('meridian');
  const [conversations, setConversations] = useState(() =>
    Object.fromEntries(AGENTS.map(a => [a.id, []]))
  );
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(null);
  const { caps, loads, consume } = useAgentCapacities();
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  const agent = AGENTS.find(a => a.id === selectedId);
  const messages = conversations[selectedId];

  // Auto-greet on first open
  useEffect(() => {
    if (messages.length === 0) {
      setConversations(c => ({
        ...c,
        [selectedId]: [{
          id: Date.now(),
          role: 'agent',
          text: lang === 'he' ? agent.greeting : agent.greetingEn,
          ts: Date.now(),
        }],
      }));
    }
  }, [selectedId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text, ts: Date.now() };
    setConversations(c => ({ ...c, [selectedId]: [...c[selectedId], userMsg] }));
    consume(selectedId);

    // Simulate thinking delay
    const thinkMs = 800 + Math.random() * 1200;
    setTyping(selectedId);
    setTimeout(() => {
      const reply = buildResponse(selectedId, text);
      setTyping(null);
      setConversations(c => ({
        ...c,
        [selectedId]: [...c[selectedId], { id: Date.now(), role: 'agent', text: reply, ts: Date.now() }],
      }));
    }, thinkMs);
  }, [input, selectedId, consume]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const switchAgent = (id) => {
    setSelectedId(id);
    setTyping(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const totalLoad = Object.values(loads).reduce((a, b) => a + b, 0);
  const avgCap = Math.round(Object.values(caps).reduce((a, b) => a + b, 0) / AGENTS.length);

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* Left panel — agent roster */}
      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', padding: '20px 14px' }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 4 }}>{lang === 'he' ? 'הצוות שלי' : 'My Team'}</h2>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
            {lang === 'he' ? `${totalLoad} שאלות · קיבולת ממוצעת ${avgCap}%` : `${totalLoad} questions · avg capacity ${avgCap}%`}
          </div>
          {/* Team capacity bar */}
          <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${avgCap}%`, background: avgCap > 60 ? 'var(--wood)' : avgCap > 35 ? 'var(--earth)' : 'var(--fire)', borderRadius: 4, transition: 'width 0.8s ease' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {AGENTS.map(a => (
            <AgentCard
              key={a.id}
              agent={a}
              cap={caps[a.id]}
              loads={loads[a.id]}
              selected={selectedId === a.id}
              onClick={() => switchAgent(a.id)}
              lang={lang}
            />
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8 }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text3)', textAlign: 'center' }}>
            {lang === 'he' ? 'מנהלת הצוות: מאיה' : 'Team lead: Maya'}
          </div>
        </div>
      </div>

      {/* Right panel — chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Agent header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${agent.color}20`, border: `1.5px solid ${agent.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
              {agent.avatar}
            </div>
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: statusFromCap(caps[agent.id]).dot, border: '2px solid var(--bg)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{agent.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
              {lang === 'he' ? agent.role : agent.roleEn} · {lang === 'he' ? statusFromCap(caps[agent.id]).label : statusFromCap(caps[agent.id]).labelEn}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 4 }}>
              {lang === 'he' ? 'קיבולת' : 'Capacity'} {caps[agent.id]}%
            </div>
            <div style={{ width: 80, height: 5, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${caps[agent.id]}%`, background: caps[agent.id] > 60 ? 'var(--wood)' : caps[agent.id] > 35 ? 'var(--earth)' : 'var(--fire)', borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', direction: 'rtl' }}>
          {messages.map(msg => (
            <Bubble key={msg.id} msg={msg} agent={agent} />
          ))}
          {typing === selectedId && <TypingIndicator agent={agent} />}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 10, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '8px 8px 8px 12px', transition: 'border-color 0.2s' }}
            onFocus={() => {}} >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={lang === 'he' ? `שאל/י את ${agent.name}...` : `Ask ${agent.nameEn}...`}
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none', resize: 'none', outline: 'none',
                color: 'var(--text)', fontSize: '0.92rem', lineHeight: 1.5, fontFamily: 'inherit',
                direction: 'rtl', maxHeight: 100, overflowY: 'auto',
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing === selectedId}
              style={{
                width: 38, height: 38, borderRadius: 10, background: input.trim() ? agent.color : 'var(--bg3)',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
                transition: 'background 0.2s, transform 0.1s',
                transform: input.trim() ? 'scale(1)' : 'scale(0.9)',
                opacity: typing === selectedId ? 0.5 : 1,
              }}
            >
              ↑
            </button>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: 6, textAlign: 'center' }}>
            {lang === 'he' ? 'Enter לשליחה · Shift+Enter לשורה חדשה' : 'Enter to send · Shift+Enter for new line'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
