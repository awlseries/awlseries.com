// src/components/Layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import FeedbackModal from '../FeedbackModal/Feedbackmodal.jsx';
import { useLanguage } from '/utils/language-context.jsx';

function MainLayout() {
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet /> {/* Это место где будет отображаться контент страницы */}
      </main>
      <Footer 
        onFeedbackClick={() => setFeedbackOpen(true)} 
      />
      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
}

export default MainLayout;