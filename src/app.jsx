// src/App.jsx
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy, useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home/Home';
import { LanguageProvider } from '/utils/language-context.jsx';
import MobileBlockMessage from './components/MobileBlockMessage/MobileBlockMessage';
import './supabase';
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


// Создаем отдельный компонент для контента с роутингом
function AppContent() {
  useEffect(() => {
    console.log('App initialized');
  }, []);

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
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
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
        </Route>
      </>
    ),
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }
    }
  );

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Проверка мобильного устройства и редирект
  useEffect(() => {
    // Проверка на мобильное устройство
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
    };

    // Проверка редиректа при первом посещении
    const isFirstVisit = !localStorage.getItem('hasVisited');
    const shouldRedirectToRegistration = isFirstVisit && window.location.pathname === '/';
    
    if (shouldRedirectToRegistration) {
      localStorage.setItem('hasVisited', 'true');
      window.location.href = '/registration';
      setShouldRedirect(true);
      return;
    }

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Если редирект сработал, не рендерим контент
  if (shouldRedirect) {
    return null;
  }

  // Показываем мобильное сообщение вместо контента
  return (
    <LanguageProvider>
      {isMobile ? <MobileBlockMessage /> : <AppContent />}
    </LanguageProvider>
  );
}

export default App;