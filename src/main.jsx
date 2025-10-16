// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import '/src/styles.css'

// Функция для проверки первого посещения
const isFirstVisit = () => {
  const hasVisited = localStorage.getItem('hasVisited');
  if (!hasVisited) {
    localStorage.setItem('hasVisited', 'true');
    return true;
  }
  return false;
};

// Убираем начальный спиннер когда React загрузился
const removeInitialLoader = () => {
  const initialLoader = document.querySelector('.initial-loading');
  if (initialLoader) {
    initialLoader.style.display = 'none';
  }
};

// Перенаправление на регистрацию при первом посещении
if (isFirstVisit() && window.location.pathname === '/') {
  window.location.href = '/registration';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);

// Убираем спиннер когда всё загрузилось
setTimeout(removeInitialLoader, 100);