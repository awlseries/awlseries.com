// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FeedbackModal from './components/FeedbackModal/FeedbackModal.jsx';
import SearchModal from './components/SearchModal/SearchModal.jsx';
import Home from './pages/Home/Home';
import Tournaments from './pages/Tournaments/Tournaments';
import Teams from './pages/Teams/Teams';
import Rating from './pages/Rating/Rating';
import Profile from './pages/Profile/Profile';
import Transfers from './pages/Transfers/Transfers';
import './firebase'; // Импорт для инициализации Firebase
import '/src/styles.css'; // Подключаем ваши стили из корня

function App() {
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  // Инициализация модальных окон и функционала из script.js
  useEffect(() => {
    // Здесь будет перенесен функционал из script.js
    console.log('App initialized');
  }, []);

  return (
    <Router>
      <div className="app">
        <Header 
          onSearchClick={() => setSearchOpen(true)}
        />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transfers" element={<Transfers />} />
          </Routes>
        </main>

        <Footer onFeedbackClick={() => setFeedbackOpen(true)} />
        
        {/* Модальные окна */}
        <FeedbackModal 
          isOpen={isFeedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
        
        <SearchModal
          isOpen={isSearchOpen} 
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;