import { createContext, useContext, useState } from 'react';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('he');
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

export const translations = {
  home: { he: 'בית', en: 'Home' },
  organs: { he: 'איברים', en: 'Organs' },
  points: { he: 'נקודות טצובו', en: 'Acupoints' },
  elements: { he: '5 יסודות', en: '5 Elements' },
  study: { he: 'כרטיסיות לימוד', en: 'Flashcards' },
  cases: { he: 'מקרי מטופלים', en: 'Case Studies' },
  principles: { he: '8 עקרונות', en: '8 Principles' },
  intake: { he: 'טופס מטופל', en: 'Patient Intake' },
  protocols: { he: 'פרוטוקולי טיפול', en: 'Protocols' },
  progress: { he: 'התקדמות', en: 'Progress' },
};

export const t = (key, lang) => translations[key]?.[lang] ?? key;
