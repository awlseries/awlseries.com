// src/components/Layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; 
import Header from '../header/header';
import Footer from '../footer/footer';
import FeedbackModal from '../feedbackmodal/feedbackmodal.jsx';
import { useLanguage } from '/utils/language-context.jsx';
import { supabase } from '../../supabase';
import BackgroundDots from '../BackgroundDots/BackgroundDots';

function MainLayout() {
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useLanguage();
  const debounceRef = useRef(null); 


  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Heartbeat + активность пользователя
  useEffect(() => {
    if (!user?.id) return;


    // Функция обновления last_online с дебаунсом
    const updateLastOnline = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      
      debounceRef.current = setTimeout(async () => {
        try {
          await supabase
            .from('users')
            .update({ 
              last_online: new Date().toISOString()
            })
            .eq('id', user.id);
        } catch (error) {
        }
      }, 10000); 
    };

    // 1. ТАЙМЕР (гарантированные обновления раз в минуту)
    const interval = setInterval(() => {
      supabase.from('users')
        .update({ last_online: new Date().toISOString() })
        .eq('id', user.id);
    }, 60000); // Минутный таймер

    // 2. АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЯ (мгновенные обновления)
    const events = ['click', 'keypress', 'mousemove', 'scroll'];
    
    events.forEach(event => 
      document.addEventListener(event, updateLastOnline, { passive: true })
    );

    // 3. ПРИ ПЕРЕКЛЮЧЕНИИ ВКЛАДОК
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateLastOnline();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Первое обновление
    updateLastOnline();

    return () => {
      clearInterval(interval);
      clearTimeout(debounceRef.current);
      events.forEach(event => 
        document.removeEventListener(event, updateLastOnline)
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id]);

  return (
    <>
      <BackgroundDots />
      <Header />
      <main className="main-content">
        <Outlet />
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