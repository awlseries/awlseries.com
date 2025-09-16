// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/footer/footer';
import FeedbackModal from './components/FeedbackModal/FeedbackModal.jsx';
import Home from './pages/Home/Home';
import Tournaments from './pages/Tournaments/Tournaments.jsx';
import Teams from './pages/Teams/Teams';
import Rating from './pages/Rating/Rating';
import Profile from './pages/Profile/Profile';
import Transfers from './pages/Transfers/Transfers.jsx';
import './firebase'; // Импорт для инициализации Firebase
import '/src/styles.css'; // Подключаем ваши стили из корня

function App() {
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);

  // Инициализация модальных окон и функционала из script.js
  useEffect(() => {
    // Здесь будет перенесен функционал из script.js
    console.log('App initialized');
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/Rating" element={<Rating />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/transfers" element={<Transfers />} />
          </Routes>
        </main>

        <Footer onFeedbackClick={() => setFeedbackOpen(true)} />
        
        {/* Модальные окна */}
        <FeedbackModal 
          isOpen={isFeedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
        
        {/* SearchModal УБРАН - теперь управляется через Header */}
      </div>
    </Router>
  );
}

export default App;