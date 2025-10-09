// src/App.jsx
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './components/Layout/MainLayout'; // ИМПОРТИРУЕМ MainLayout
import Home from './pages/Home/Home';
import Tournaments from './pages/Tournaments/Tournaments.jsx';
import Teams from './pages/Teams/Teams';
import Rating from './pages/Rating/Rating';
import Profile from './pages/Profile/Profile';
import Transfers from './pages/Transfers/Transfers.jsx';
import Registration from './pages/Registration/Registration.jsx'; 
import Rules from './pages/Rules/Rules';
import { LanguageProvider } from '/utils/language-context.jsx';
import './firebase';
import '/src/styles.css';

// Создаем отдельный компонент для контента с роутингом
function AppContent() {
  useEffect(() => {
    console.log('App initialized');
  }, []);

  // Создаем роутер с future flags
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Страница регистрации без Header и Footer */}
        <Route path="/registration" element={<Registration />} />
        
        {/* Страницы с Header и Footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="teams" element={<Teams />} />
          <Route path="rating" element={<Rating />} />
          <Route path="profile" element={<Profile />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="rules" element={<Rules />} />
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

// Главный компонент App только оборачивает в провайдеры
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;