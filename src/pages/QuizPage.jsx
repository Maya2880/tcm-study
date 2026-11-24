import { useState, useMemo, useCallback, useRef } from 'react';
import { points } from '../data/points';
import { organs } from '../data/organs';
import { useLang } from '../context/LanguageContext';

// ─── Question generators ───────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]];
  } return a;
}

function pickOthers(arr, exclude, n) {
  const pool = arr.filter(x => x !== exclude);
  return shuffle(pool).slice(0, n);
}

function buildMCQs() {
  const qs = [];

  // Points: Chinese name
  points.forEach(p => {
    if (!p.nameCn) return;
    const distractors = pickOthers(points.map(x => x.nameCn).filter(Boolean), p.nameCn, 3);
    if (distractors.length < 3) return;
    const opts = shuffle([p.nameCn, ...distractors]);
    qs.push({
      id: `cn_${p.id}`,
      type: 'points',
      question: `מה השם הסיני של ${p.code}?`,
      questionEn: `What is the Chinese name of ${p.code}?`,
      options: opts,
      correct: opts.indexOf(p.nameCn),
      explanation: `${p.code} (${p.nameCn}) — ${p.function[0] || ''}`,
    });
  });

  // Points: category
  const categories = [...new Set(points.map(p => p.category).filter(Boolean))];
  points.filter(p => p.category).forEach(p => {
    const distractors = pickOthers(categories, p.category, 3);
    if (distractors.length < 3) return;
    const opts = shuffle([p.category, ...distractors]);
    qs.push({
      id: `cat_${p.id}`,
      type: 'points',
      question: `מה הקטגוריה של ${p.code} (${p.nameCn})?`,
      questionEn: `What category is ${p.code} (${p.nameCn})?`,
      options: opts,
      correct: opts.indexOf(p.category),
      explanation: `${p.code} הוא ${p.category} — ${p.function[0] || ''}`,
    });
  });

  // Organs: emotion
  organs.filter(o => o.emotionHe).forEach(o => {
    const distractors = pickOthers(organs.map(x => x.emotionHe).filter(Boolean), o.emotionHe, 3);
    if (distractors.length < 3) return;
    const opts = shuffle([o.emotionHe, ...distractors]);
    qs.push({
      id: `em_${o.id}`,
      type: 'organs',
      question: `מה הרגש הקשור ל${o.nameHe}?`,
      questionEn: `What emotion is associated with the ${o.nameEn}?`,
      options: opts,
      correct: opts.indexOf(o.emotionHe),
      explanation: `${o.nameHe} קשורה לרגש: ${o.emotionHe}. יסוד: ${o.elementHe}`,
    });
  });

  // Organs: season
  organs.filter(o => o.seasonHe).forEach(o => {
    const distractors = pickOthers(organs.map(x => x.seasonHe).filter(Boolean), o.seasonHe, 3);
    if (distractors.length < 3) return;
    const opts = shuffle([o.seasonHe, ...distractors]);
    qs.push({
      id: `sea_${o.id}`,
      type: 'organs',
      question: `באיזה עונה שולט ה${o.nameHe}?`,
      questionEn: `What season governs the ${o.nameEn}?`,
      options: opts,
      correct: opts.indexOf(o.seasonHe),
      explanation: `${o.nameHe} שולט ב${o.seasonHe}. צמד: ${o.nameHe} + ${organs.find(x=>x.id===o.pair)?.nameHe||''}`,
    });
  });

  // Organs: element pair
  organs.filter(o => o.elementHe && o.type === 'yin').forEach(o => {
    const partner = organs.find(x => x.id === o.pair);
    if (!partner) return;
    const distractors = pickOthers(organs.filter(x=>x.type==='yang').map(x=>x.nameHe), partner.nameHe, 3);
    if (distractors.length < 3) return;
    const opts = shuffle([partner.nameHe, ...distractors]);
    qs.push({
      id: `pair_${o.id}`,
      type: 'organs',
      question: `מה הצמד היאנגי של ה${o.nameHe}?`,
      questionEn: `What is the Yang pair of the ${o.nameEn}?`,
      options: opts,
      correct: opts.indexOf(partner.nameHe),
      explanation: `${o.nameHe} (יין) ו-${partner.nameHe} (יאנג) שייכים שניהם ליסוד ${o.elementHe}`,
    });
  });

  return shuffle(qs);
}

// ─── Fill-in-blank generators ─────────────────────────────────────────────

function buildFIBs() {
  const qs = [];

  points.filter(p => p.nameCn).forEach(p => {
    qs.push({
      id: `fib_cn_${p.id}`,
      type: 'points',
      prompt: `השם הסיני של ${p.code} הוא`,
      promptEn: `The Chinese name of ${p.code} is`,
      answer: p.nameCn,
      hint: p.nameHe,
      explanation: `${p.code} (${p.nameCn}) — ${p.function[0] || ''}`,
    });
  });

  organs.filter(o => o.emotionHe).forEach(o => {
    qs.push({
      id: `fib_em_${o.id}`,
      type: 'organs',
      prompt: `הרגש של ה${o.nameHe} הוא`,
      promptEn: `The emotion of the ${o.nameEn} is`,
      answer: o.emotionHe.split('/')[0].trim(),
      answerAlt: o.emotionHe,
      hint: `יסוד ${o.elementHe}`,
      explanation: `${o.nameHe}: ${o.emotionHe} · יסוד ${o.elementHe} · עונה: ${o.seasonHe}`,
    });
  });

  points.filter(p => p.category && p.category !== 'General' && p.category !== 'Local').forEach(p => {
    qs.push({
      id: `fib_cat_${p.id}`,
      type: 'points',
      prompt: `${p.code} (${p.nameCn}) שייכת לקטגוריה`,
      promptEn: `${p.code} (${p.nameCn}) belongs to category`,
      answer: p.category,
      hint: p.nameHe,
      explanation: `${p.code}: ${p.category} — ${p.function[0] || ''}`,
    });
  });

  return shuffle(qs);
}

// ─── Matching decks ───────────────────────────────────────────────────────

const matchingDecks = {
  points_cn: {
    he: 'נקודות ↔ שם סיני', en: 'Points ↔ Chinese name',
    makeRound: () => {
      const pool = shuffle(points.filter(p => p.nameCn)).slice(0, 6);
      return { left: pool.map(p => ({ id: p.id, text: p.code })), right: shuffle(pool.map(p => ({ id: p.id, text: p.nameCn }))) };
    }
  },
  organs_emotion: {
    he: 'איברים ↔ רגש', en: 'Organs ↔ Emotion',
    makeRound: () => {
      const pool = shuffle(organs.filter(o => o.emotionHe)).slice(0, 6);
      return { left: pool.map(o => ({ id: o.id, text: o.nameHe })), right: shuffle(pool.map(o => ({ id: o.id, text: o.emotionHe.split('/')[0].trim() }))) };
    }
  },
  element_season: {
    he: 'יסוד ↔ עונה', en: 'Element ↔ Season',
    makeRound: () => {
      const pool = shuffle(organs.filter(o => o.type === 'yin' && o.seasonHe)).slice(0, 5);
      return { left: pool.map(o => ({ id: o.id, text: o.elementHe })), right: shuffle(pool.map(o => ({ id: o.id, text: o.seasonHe }))) };
    }
  },
};

// ─── Multiple Choice Quiz ─────────────────────────────────────────────────

function MCQQuiz({ lang }) {
  const allQs = useMemo(() => buildMCQs(), []);
  const [filter, setFilter] = useState('all');
  const [deck, setDeck] = useState(() => shuffle(allQs));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  const filtered = filter === 'all' ? deck : deck.filter(q => q.type === filter);
  const q = filtered[index];

  const reset = () => { setDeck(shuffle(allQs)); setIndex(0); setSelected(null); setScore({ right: 0, wrong: 0 }); setDone(false); };

  const pick = useCallback((optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === q.correct;
    setScore(s => ({ right: s.right + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
  }, [selected, q]);

  const next = useCallback(() => {
    setSelected(null);
    if (index + 1 >= filtered.length) setDone(true);
    else setIndex(i => i + 1);
  }, [index, filtered.length]);

  if (done) {
    const total = score.right + score.wrong;
    const pct = Math.round((score.right / total) * 100);
    return (
      <ResultScreen lang={lang} right={score.right} wrong={score.wrong} pct={pct}
        onReset={reset} />
    );
  }

  if (!q) return <div style={{ color: 'var(--text3)', padding: 24 }}>אין שאלות זמינות</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[{ id:'all', he:'הכל',en:'All'},{ id:'points', he:'נקודות',en:'Points'},{ id:'organs',he:'איברים',en:'Organs'}].map(f=>(
          <button key={f.id} onClick={()=>{setFilter(f.id);setIndex(0);setSelected(null);}}
            style={{ padding:'5px 14px', borderRadius:20, fontSize:'0.82rem', border:'1px solid',
              background: filter===f.id?'var(--accent)':'transparent',
              borderColor: filter===f.id?'var(--accent)':'var(--border)',
              color: filter===f.id?'white':'var(--text2)', cursor:'pointer' }}>{f[lang]}</button>
        ))}
      </div>

      <ProgressBar index={index} total={filtered.length} right={score.right} wrong={score.wrong} />

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:'24px', marginBottom:20 }}>
        <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {lang==='he'?'שאלה':'Question'} {index+1} / {filtered.length}
        </div>
        <h3 style={{ lineHeight:1.6, marginBottom:0, fontSize:'1.05rem' }}>{lang==='he'?q.question:q.questionEn}</h3>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
        {q.options.map((opt, i) => {
          let bg = 'var(--bg2)', border = 'var(--border)', color = 'var(--text)';
          if (selected !== null) {
            if (i === q.correct) { bg='rgba(102,187,106,0.12)'; border='rgba(102,187,106,0.4)'; color='var(--wood)'; }
            else if (i === selected) { bg='rgba(239,83,80,0.12)'; border='rgba(239,83,80,0.4)'; color='var(--fire)'; }
          }
          return (
            <div key={i} onClick={() => pick(i)}
              style={{ background:bg, border:`1px solid ${border}`, borderRadius:12, padding:'14px 18px',
                cursor: selected===null?'pointer':'default', display:'flex', alignItems:'flex-start', gap:12,
                transition:'all 0.2s',
                transform: selected!==null && i===selected ? 'scale(0.99)' : 'scale(1)',
              }}>
              <span style={{ width:26, height:26, borderRadius:'50%', background:'var(--bg3)', display:'flex',
                alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:700, flexShrink:0, color }}>
                {selected!==null ? (i===q.correct?'✓': i===selected?'✗': String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
              </span>
              <span style={{ fontSize:'0.92rem', color, lineHeight:1.5 }}>{opt}</span>
            </div>
          );
        })}
      </div>

      {selected !== null && (
        <>
          {q.explanation && (
            <div style={{ background:'rgba(255,213,79,0.06)', border:'1px solid rgba(255,213,79,0.15)', borderRadius:12,
              padding:'14px 18px', marginBottom:16 }}>
              <div style={{ fontSize:'0.68rem', color:'var(--gold)', marginBottom:4 }}>{lang==='he'?'הסבר':'Explanation'}</div>
              <p style={{ fontSize:'0.88rem', color:'var(--text2)', lineHeight:1.6 }}>{q.explanation}</p>
            </div>
          )}
          <button onClick={next} style={{ width:'100%', background:'var(--accent)', color:'white', borderRadius:12,
            padding:'13px', fontSize:'0.95rem', border:'none', cursor:'pointer' }}>
            {lang==='he'?'הבא ←':'Next →'}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Matching Quiz ────────────────────────────────────────────────────────

function MatchingQuiz({ lang }) {
  const [deckId, setDeckId] = useState('points_cn');
  const [round, setRound] = useState(() => matchingDecks.points_cn.makeRound());
  const [leftSel, setLeftSel] = useState(null);
  const [matched, setMatched] = useState([]); // array of ids
  const [wrongFlash, setWrongFlash] = useState(null);
  const [done, setDone] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const changeDeck = (id) => {
    setDeckId(id); setRound(matchingDecks[id].makeRound());
    setLeftSel(null); setMatched([]); setWrongFlash(null); setDone(false); setMistakes(0);
  };

  const newRound = () => {
    setRound(matchingDecks[deckId].makeRound());
    setLeftSel(null); setMatched([]); setWrongFlash(null); setDone(false); setMistakes(0);
  };

  const handleLeft = (item) => {
    if (matched.includes(item.id)) return;
    setLeftSel(item.id === leftSel ? null : item.id);
  };

  const handleRight = (item) => {
    if (matched.includes(item.id)) return;
    if (!leftSel) return;
    if (leftSel === item.id) {
      const newMatched = [...matched, item.id];
      setMatched(newMatched);
      setLeftSel(null);
      if (newMatched.length === round.left.length) setTimeout(() => setDone(true), 400);
    } else {
      setWrongFlash(item.id);
      setMistakes(m => m + 1);
      setTimeout(() => setWrongFlash(null), 500);
    }
  };

  if (done) {
    const total = round.left.length;
    const pct = Math.round((total / (total + mistakes)) * 100);
    return (
      <div style={{ textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:'3rem', marginBottom:12, color:'var(--accent)' }}>{pct>=90?'✦':pct>=60?'◎':'◇'}</div>
        <h3 style={{ marginBottom:8 }}>{lang==='he'?'כל הצמדים נמצאו!':'All pairs matched!'}</h3>
        <p style={{ color:'var(--text2)', marginBottom:24 }}>
          {lang==='he'?`${total} צמדים · ${mistakes} טעויות`:`${total} pairs · ${mistakes} mistakes`}
        </p>
        <button onClick={newRound} style={{ background:'var(--accent)', color:'white', borderRadius:12, padding:'12px 32px', border:'none', cursor:'pointer' }}>
          ↩ {lang==='he'?'סבב חדש':'New round'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {Object.entries(matchingDecks).map(([id, deck]) => (
          <button key={id} onClick={() => changeDeck(id)}
            style={{ padding:'5px 14px', borderRadius:20, fontSize:'0.82rem', border:'1px solid',
              background: deckId===id?'var(--accent)':'transparent',
              borderColor: deckId===id?'var(--accent)':'var(--border)',
              color: deckId===id?'white':'var(--text2)', cursor:'pointer' }}>
            {deck[lang]}
          </button>
        ))}
      </div>

      <p style={{ color:'var(--text3)', fontSize:'0.84rem', marginBottom:20 }}>
        {lang==='he'?'לחץ פריט משמאל, אז צמד ימין':'Click left item, then its match on the right'}
        {' · '}{round.left.length - matched.length} {lang==='he'?'נותרו':'left'}
        {mistakes > 0 && <span style={{ color:'var(--fire)', marginRight:8 }}> · {mistakes} ✗</span>}
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {round.left.map(item => {
            const isMatched = matched.includes(item.id);
            const isSelected = leftSel === item.id;
            return (
              <div key={item.id} onClick={() => handleLeft(item)}
                style={{
                  padding:'12px 14px', borderRadius:12, fontSize:'0.9rem', cursor: isMatched?'default':'pointer',
                  border:`2px solid`, transition:'all 0.2s',
                  borderColor: isMatched?'rgba(102,187,106,0.3)': isSelected?'var(--accent)':'var(--border)',
                  background: isMatched?'rgba(102,187,106,0.08)': isSelected?'rgba(124,131,245,0.1)':'var(--bg2)',
                  color: isMatched?'var(--wood)': isSelected?'var(--accent)':'var(--text)',
                  opacity: isMatched?0.6:1,
                  fontFamily: item.text.match(/^[A-Z]{1,3}\d+$/)? 'monospace':'inherit',
                  fontWeight: isSelected?700:400,
                }}>
                {isMatched ? '✓ ' : ''}{item.text}
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {round.right.map(item => {
            const isMatched = matched.includes(item.id);
            const isWrong = wrongFlash === item.id;
            return (
              <div key={item.id} onClick={() => handleRight(item)}
                style={{
                  padding:'12px 14px', borderRadius:12, fontSize:'0.9rem', cursor: isMatched?'default':'pointer',
                  border:`2px solid`, transition:'all 0.2s',
                  borderColor: isMatched?'rgba(102,187,106,0.3)': isWrong?'rgba(239,83,80,0.5)':'var(--border)',
                  background: isMatched?'rgba(102,187,106,0.08)': isWrong?'rgba(239,83,80,0.1)':'var(--bg2)',
                  color: isMatched?'var(--wood)': isWrong?'var(--fire)':'var(--text)',
                  opacity: isMatched?0.6:1,
                  transform: isWrong?'translateX(4px)':'none',
                }}>
                {isMatched ? '✓ ' : ''}{item.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Fill in Blank Quiz ───────────────────────────────────────────────────

function FIBQuiz({ lang }) {
  const allQs = useMemo(() => buildFIBs(), []);
  const [deck, setDeck] = useState(() => shuffle(allQs));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [state, setState] = useState('idle'); // idle | correct | wrong | revealed
  const [score, setScore] = useState({ right: 0, wrong: 0 });
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const q = deck[index];

  const reset = () => { setDeck(shuffle(allQs)); setIndex(0); setInput(''); setState('idle'); setScore({right:0,wrong:0}); setDone(false); };

  const normalize = (s) => s.trim().toLowerCase().replace(/[^֐-׿a-zA-Z]/g, '');

  const check = useCallback(() => {
    if (!input.trim() || state !== 'idle') return;
    const userN = normalize(input);
    const ansN = normalize(q.answer);
    const altN = q.answerAlt ? normalize(q.answerAlt) : '';
    const isCorrect = userN === ansN || (altN && userN === altN) ||
      (ansN.startsWith(userN) && userN.length >= 3) ||
      ansN.includes(userN) && userN.length >= 4;
    setState(isCorrect ? 'correct' : 'wrong');
    setScore(s => ({ right: s.right+(isCorrect?1:0), wrong: s.wrong+(isCorrect?0:1) }));
  }, [input, state, q]);

  const next = useCallback(() => {
    setInput(''); setState('idle');
    if (index + 1 >= deck.length) setDone(true);
    else setIndex(i => i + 1);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [index, deck.length]);

  const handleKey = (e) => { if (e.key === 'Enter') { if (state === 'idle') check(); else next(); } };

  if (done) {
    const total = score.right + score.wrong;
    const pct = Math.round((score.right/total)*100);
    return <ResultScreen lang={lang} right={score.right} wrong={score.wrong} pct={pct} onReset={reset} />;
  }

  if (!q) return null;

  return (
    <div>
      <ProgressBar index={index} total={deck.length} right={score.right} wrong={score.wrong} />

      <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:16, padding:'28px 24px', marginBottom:20 }}>
        <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {lang==='he'?'השלם את החסר':'Fill in the blank'} · {index+1}/{deck.length}
        </div>
        <p style={{ fontSize:'1.1rem', lineHeight:1.65, marginBottom:0 }}>
          {lang==='he'?q.prompt:q.promptEn}
          {' '}
          <span style={{ display:'inline-block', borderBottom:'2px solid var(--accent)', minWidth:80, paddingBottom:2, color:'var(--accent)', fontStyle:'italic' }}>
            {state !== 'idle' ? q.answer : (input || '      ')}
          </span>
        </p>
        {q.hint && (
          <div style={{ marginTop:10, fontSize:'0.78rem', color:'var(--text3)' }}>
            💡 {lang==='he'?'רמז:':'Hint:'} {q.hint}
          </div>
        )}
      </div>

      {state === 'idle' ? (
        <div style={{ display:'flex', gap:10 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={lang==='he'?'הקלד תשובה...':'Type your answer...'}
            style={{ flex:1, background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:12,
              padding:'12px 16px', color:'var(--text)', fontSize:'0.95rem', outline:'none',
              direction: 'rtl',
              boxShadow: input ? '0 0 0 2px var(--accent)40' : 'none',
              transition: 'box-shadow 0.2s',
            }}
            autoFocus
          />
          <button onClick={check} disabled={!input.trim()}
            style={{ background:'var(--accent)', color:'white', borderRadius:12, padding:'12px 20px',
              border:'none', fontSize:'0.9rem', cursor:'pointer', opacity: input.trim()?1:0.5 }}>
            {lang==='he'?'בדוק':'Check'}
          </button>
        </div>
      ) : (
        <>
          <div style={{
            padding:'14px 18px', borderRadius:12, marginBottom:16,
            background: state==='correct' ? 'rgba(102,187,106,0.1)' : state==='wrong' ? 'rgba(239,83,80,0.1)' : 'rgba(124,131,245,0.08)',
            border: `1px solid ${state==='correct'?'rgba(102,187,106,0.3)': state==='wrong'?'rgba(239,83,80,0.3)':'rgba(124,131,245,0.2)'}`,
          }}>
            <div style={{ fontWeight:700, marginBottom:4,
              color: state==='correct'?'var(--wood)': state==='wrong'?'var(--fire)':'var(--accent)' }}>
              {state==='correct'?'✓ '+(lang==='he'?'נכון!':'Correct!'): state==='wrong'?'✗ '+(lang==='he'?'התשובה הנכונה:':'Correct answer:'): (lang==='he'?'התשובה:':'Answer:')}
            </div>
            {state !== 'correct' && <div style={{ marginBottom:q.explanation?8:0, fontSize:'1.0rem', fontWeight:600 }}>{q.answer}</div>}
            {q.explanation && <div style={{ fontSize:'0.86rem', color:'var(--text2)', lineHeight:1.6 }}>{q.explanation}</div>}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={next} style={{ flex:1, background:'var(--accent)', color:'white', borderRadius:12, padding:'13px', border:'none', cursor:'pointer', fontSize:'0.95rem' }}>
              {lang==='he'?'הבא ←':'Next →'}
            </button>
            {state === 'idle' && (
              <button onClick={() => setState('revealed')} style={{ background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:12, padding:'13px 18px', cursor:'pointer', fontSize:'0.9rem' }}>
                {lang==='he'?'גלה':'Reveal'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────

function ProgressBar({ index, total, right, wrong }) {
  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--text3)', marginBottom:6 }}>
        <span>{index + 1} / {total}</span>
        <span>
          <span style={{ color:'var(--wood)' }}>✓ {right}</span>
          {'  '}
          <span style={{ color:'var(--fire)' }}>✗ {wrong}</span>
        </span>
      </div>
      <div style={{ height:3, background:'var(--bg3)', borderRadius:4, marginBottom:24, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${(index/total)*100}%`, background:'var(--accent)', borderRadius:4, transition:'width 0.3s ease' }} />
      </div>
    </>
  );
}

function ResultScreen({ lang, right, wrong, pct, onReset }) {
  const scoreChar = pct >= 85 ? '✦' : pct >= 60 ? '◎' : '◇';
  const msg = pct >= 85
    ? (lang==='he'?'מדהים! אתה שולט בחומר!':'Amazing! You\'ve got this!')
    : pct >= 60
    ? (lang==='he'?'טוב! כמה דברים לחזור עליהם.':'Good! A few things to review.')
    : (lang==='he'?'המשך לתרגל — ידע בא עם זמן.':'Keep practicing — knowledge takes time.');
  return (
    <div style={{ textAlign:'center', padding:'32px 0' }}>
      <div style={{ fontSize:'3.5rem', marginBottom:12, color:'var(--accent)' }}>{scoreChar}</div>
      <h3 style={{ marginBottom:8 }}>{pct}%</h3>
      <p style={{ color:'var(--text2)', marginBottom:8 }}>{right} ✓ · {wrong} ✗</p>
      <p style={{ color:'var(--text3)', fontSize:'0.9rem', marginBottom:28, fontStyle:'italic' }}>{msg}</p>
      <button onClick={onReset} style={{ background:'var(--accent)', color:'white', borderRadius:12, padding:'12px 32px', border:'none', cursor:'pointer' }}>
        ↩ {lang==='he'?'התחל מחדש':'Start over'}
      </button>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────

const MODES = [
  { id:'mcq',      he:'שאלות', en:'Questions' },
  { id:'matching', he:'התאמה', en:'Matching' },
  { id:'fib',      he:'השלמה', en:'Fill blank' },
];

export default function QuizPage() {
  const { lang } = useLang();
  const [mode, setMode] = useState('mcq');

  return (
    <div>
      <div className="page-header">
        <h1>{lang==='he'?'אזור הבחנות':'Quiz Zone'}</h1>
        <p style={{ color:'var(--text2)', fontSize:'0.88rem' }}>
          {lang==='he'?'שאלות · התאמה · השלמה':'Questions · Matching · Fill-in-blank'}
        </p>
      </div>

      <div className="tabs" style={{ marginBottom:28 }}>
        {MODES.map(m => (
          <button key={m.id} className={`tab ${mode===m.id?'active':''}`} onClick={() => setMode(m.id)}>
            {m[lang]}
          </button>
        ))}
      </div>

      {mode === 'mcq'      && <MCQQuiz      lang={lang} />}
      {mode === 'matching' && <MatchingQuiz lang={lang} />}
      {mode === 'fib'      && <FIBQuiz      lang={lang} />}
    </div>
  );
}
