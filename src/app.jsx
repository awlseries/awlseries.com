import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy, useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home/Home';
import { LanguageProvider } from '/utils/language-context.jsx';
import MobileBlockMessage from './components/MobileBlockMessage/MobileBlockMessage';
import { supabase } from './supabase';
import { useAdminCache } from './components/Services/useAdminCache';
import '/src/styles.css';

// Ленивая загрузка только тяжелых компонентов
const Tournaments = lazy(() => import('./pages/tournaments/tournaments.jsx'));
const Teams = lazy(() => import('./pages/teams/teams'));
const Rating = lazy(() => import('./pages/rating/rating'));
const Profile = lazy(() => import('./pages/profile/profile'));
const Transfers = lazy(() => import('./pages/transfers/transfers.jsx'));
const Rules = lazy(() => import('./pages/Rules/Rules'));
const Registration = lazy(() => import('./pages/Registration/Registration.jsx'));
const VerificationSuccess = lazy(() => import('./components/VerificationSuccess/VerificationSuccess.jsx'));
const ResetPassword = lazy(() => import('/utils/ResetPassword'));
const TeamPage = lazy(() => import('./pages/TeamPage/TeamPage'));
const PublicProfile = lazy(() => import('./pages/profile/PublicProfile'));

// Простой inline компонент для загрузки
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Загрузка...</p>
    </div>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Используем хук с кэшированием
  const { isAdmin, loading: adminLoading, clearAdminCache, getCachedNews, invalidateNewsCache } = useAdminCache(user?.id);

  useEffect(() => {
    let mounted = true;

    const getCurrentUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          setAuthChecked(true);
          return;
        }

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          clearAdminCache();
        }
      } catch (error) {
        if (mounted) {
          setUser(null);
          clearAdminCache();
        }
      } finally {
        if (mounted) {
          setAuthChecked(true);
        }
      }
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      
      try {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          clearAdminCache();
        }
      } catch (error) {
        console.error('❌ Ошибка при изменении состояния авторизации:', error);
        setUser(null);
        clearAdminCache();
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [clearAdminCache]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route 
          path="/registration" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Registration />
            </Suspense>
          } 
        />
        <Route 
          path="/verification-success" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <VerificationSuccess />
            </Suspense>
          } 
        />
        <Route 
            path="/rules" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Rules />
              </Suspense>
            } 
          />
          <Route 
          path="/reset-password" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ResetPassword />
            </Suspense>
          } 
          />
        
          <Route path="/" element={
        <MainLayout 
          isAdmin={isAdmin} 
          getCachedNews={getCachedNews}
          invalidateNewsCache={invalidateNewsCache}
        />
      }>
        <Route index element={
          <Home 
            isAdmin={isAdmin} 
            getCachedNews={getCachedNews}
            invalidateNewsCache={invalidateNewsCache}
          />
        } />

          <Route 
            path="tournaments" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Tournaments />
              </Suspense>
            } 
          />
          <Route 
            path="teams" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Teams />
              </Suspense>
            } 
          />
          <Route 
            path="rating" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Rating />
              </Suspense>
            } 
          />
          <Route 
            path="profile" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Profile />
              </Suspense>
            } 
          />
          <Route 
            path="transfers" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Transfers />
              </Suspense>
            } 
          />
          <Route 
            path="team/:teamId" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <TeamPage />
              </Suspense>
            } 
          />
          <Route 
            path="player/:userId" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PublicProfile />
              </Suspense>
            } 
          />
        </Route>
      </>
    )
  );

  // Показываем загрузку пока проверяем авторизацию
  if (!authChecked) {
    return <LoadingFallback />;
  }

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Проверка мобильного устройства и редирект
  useEffect(() => {
    
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setAppReady(true);
    };

    const isFirstVisit = !localStorage.getItem('hasVisited');
    const shouldRedirectToRegistration = isFirstVisit && window.location.pathname === '/';
    
    if (shouldRedirectToRegistration) {
      localStorage.setItem('hasVisited', 'true');
      window.location.href = '/registration';
      setShouldRedirect(true);
      return;
    }

    // Небольшая задержка для стабилизации
    const timer = setTimeout(() => {
      checkMobile();
    }, 100);

    window.addEventListener('resize', checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (shouldRedirect) {
    return null;
  }

  // Показываем загрузку пока приложение не готово
  if (!appReady) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <LanguageProvider>
      {isMobile ? <MobileBlockMessage /> : <AppContent />}
    </LanguageProvider>
  );
}

export default App;