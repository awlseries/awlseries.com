// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FeedbackModal from './components/FeedbackModal/Feedbackmodal.jsx';
import Home from './pages/Home/Home';
import Tournaments from './pages/Tournaments/Tournaments.jsx';
import Teams from './pages/Teams/Teams';
import Rating from './pages/Rating/Rating';
import Profile from './pages/Profile/Profile';
import Transfers from './pages/Transfers/Transfers.jsx';
import Registration from './pages/Registration/Registration.jsx'; 
import Rules from './pages/Rules/Rules';
import { LanguageProvider, useLanguage } from '/utils/language-context.jsx';
import './firebase';
import '/src/styles.css';

// Создаем отдельный компонент для контента
function AppContent() {
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const { t } = useLanguage(); // Теперь хук используется внутри провайдера

  useEffect(() => {
    console.log('App initialized');
  }, []);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Для страницы регистрации не показываем Header */}
          <Route path="/registration" element={<Registration />} />
          <Route path="/rules" element={<Rules />} />
          
          {/* Для всех остальных страниц показываем Header */}
          <Route path="*" element={
            <>
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tournaments" element={<Tournaments />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/rating" element={<Rating />} /> {/* исправлен регистр */}
                  <Route path="/profile" element={<Profile />} /> {/* исправлен регистр */}
                  <Route path="/transfers" element={<Transfers />} />
                  <Route path="/rules" element={<Rules />} />
                </Routes>
              </main>
              <Footer 
                onFeedbackClick={() => setFeedbackOpen(true)} 
              />
            </>
          } />
        </Routes>
        
        {/* Модальные окна */}
        <FeedbackModal 
          isOpen={isFeedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
      </div>
    </Router>
  );
}

// Главный компонент App только оборачивает в провайдеры
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;