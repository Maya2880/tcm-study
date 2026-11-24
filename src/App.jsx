import { useState } from 'react';
import { useLang } from './context/LanguageContext';
import Home from './pages/Home';
import Learn from './pages/Learn';
import OrgansPage from './pages/OrgansPage';
import PointsPage from './pages/PointsPage';
import ElementsPage from './pages/ElementsPage';
import StudyPage from './pages/StudyPage';
import CasesPage from './pages/CasesPage';
import PrinciplesPage from './pages/PrinciplesPage';
import IntakePage from './pages/IntakePage';
import ProtocolsPage from './pages/ProtocolsPage';
import ProgressPage from './pages/ProgressPage';
import QuizPage from './pages/QuizPage';
import ChatPage from './pages/ChatPage';
import CardPlaysPage from './pages/CardPlaysPage';
import ResourcesPage from './pages/ResourcesPage';
import {
  HomeIcon, LearnIcon, OrgansIcon, PointsIcon, ElementsIcon,
  PrinciplesIcon, IntakeIcon, ProtocolsIcon, StudyIcon, QuizIcon,
  CardPlaysIcon, CasesIcon, ChatIcon, ProgressIcon, LogoLeafIcon,
  ResourcesIcon,
} from './components/NavIcons';

const navSections = [
  {
    labelHe: null, labelEn: null,
    items: [
      { id: 'home', Icon: HomeIcon, he: 'בית', en: 'Home' },
    ],
  },
  {
    labelHe: 'לימוד', labelEn: 'Study',
    items: [
      { id: 'learn',     Icon: LearnIcon,    he: 'מסלול לימוד',  en: 'Learn' },
      { id: 'study',     Icon: StudyIcon,    he: 'כרטיסיות',     en: 'Flashcards' },
      { id: 'quiz',      Icon: QuizIcon,     he: 'בחנות',         en: 'Quizzes' },
      { id: 'cardplays', Icon: CardPlaysIcon, he: 'משחקי קלפים', en: 'Card Plays' },
    ],
  },
  {
    labelHe: 'חומר עיון', labelEn: 'Reference',
    items: [
      { id: 'organs',     Icon: OrgansIcon,     he: 'איברים',      en: 'Organs' },
      { id: 'points',     Icon: PointsIcon,     he: 'נקודות',      en: 'Points' },
      { id: 'elements',   Icon: ElementsIcon,   he: '5 יסודות',    en: 'Elements' },
      { id: 'principles', Icon: PrinciplesIcon, he: '8 עקרונות',   en: 'Principles' },
      { id: 'protocols',  Icon: ProtocolsIcon,  he: 'פרוטוקולים',  en: 'Protocols' },
    ],
  },
  {
    labelHe: 'קליני', labelEn: 'Clinical',
    items: [
      { id: 'intake', Icon: IntakeIcon, he: 'טופס מטופל',    en: 'Intake' },
      { id: 'cases',  Icon: CasesIcon,  he: 'מקרי מטופלים', en: 'Cases' },
    ],
  },
  {
    labelHe: 'כלים', labelEn: 'Tools',
    items: [
      { id: 'chat',      Icon: ChatIcon,      he: 'מדריך AI',    en: 'AI Tutor' },
      { id: 'progress',  Icon: ProgressIcon,  he: 'התקדמות',     en: 'Progress' },
      { id: 'resources', Icon: ResourcesIcon, he: 'מקורות',      en: 'Resources' },
    ],
  },
];

const navItems = navSections.flatMap((s) => s.items);

export default function App() {
  const [page, setPage] = useState('home');
  const { lang, setLang } = useLang();

  const renderPage = () => {
    switch (page) {
      case 'home':       return <Home onNavigate={setPage} />;
      case 'learn':      return <Learn />;
      case 'organs':     return <OrgansPage />;
      case 'points':     return <PointsPage />;
      case 'elements':   return <ElementsPage />;
      case 'principles': return <PrinciplesPage />;
      case 'intake':     return <IntakePage />;
      case 'protocols':  return <ProtocolsPage />;
      case 'study':      return <StudyPage />;
      case 'quiz':       return <QuizPage />;
      case 'cardplays':  return <CardPlaysPage />;
      case 'cases':      return <CasesPage />;
      case 'chat':       return <ChatPage />;
      case 'progress':   return <ProgressPage />;
      case 'resources':  return <ResourcesPage />;
      default:           return <Home onNavigate={setPage} />;
    }
  };

  return (
    <div className="app-shell">
      <div className="top-bar">
        <button className="top-lang-btn" onClick={() => setLang(lang === 'he' ? 'en' : 'he')}>
          {lang === 'he' ? 'EN' : 'עב'} ⇄ {lang === 'he' ? 'עב' : 'EN'}
        </button>
      </div>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <LogoLeafIcon size={22} />
          </div>
          <div className="logo-text">
            <h1>שיאצו TCM</h1>
            <p>מדריך למטפל מוסמך</p>
          </div>
        </div>

        <nav className="nav-section">
          {navSections.map((section, si) => (
            <div key={si} className="nav-group">
              {section.labelHe && (
                <div className="nav-label">
                  {lang === 'he' ? section.labelHe : section.labelEn}
                </div>
              )}
              {section.items.map(({ id, Icon, he, en }) => (
                <button
                  key={id}
                  className={`nav-item ${page === id ? 'active' : ''}`}
                  onClick={() => setPage(id)}
                >
                  <span className="sidebar-pill" />
                  <span className="nav-icon"><Icon /></span>
                  <span className="nav-text">{lang === 'he' ? he : en}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="lang-toggle"
          >
            <span className="lang-toggle-label">
              {lang === 'he' ? 'עב' : 'EN'}
            </span>
            <span className="lang-toggle-arrow">⇄</span>
            <span className="lang-toggle-label">
              {lang === 'he' ? 'EN' : 'עב'}
            </span>
          </button>
          <div className="sidebar-credit">מאיה אונר | שנה א׳ תמורות</div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {navItems.map(({ id, Icon, he, en }) => (
          <button
            key={id}
            className={`bottom-nav-item ${page === id ? 'active' : ''}`}
            onClick={() => setPage(id)}
          >
            <span className="bottom-pill" />
            <span className="bottom-nav-icon"><Icon /></span>
            <span className="bottom-nav-label">{lang === 'he' ? he : en}</span>
          </button>
        ))}
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
