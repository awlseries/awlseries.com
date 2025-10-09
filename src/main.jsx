// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
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

// Перенаправление на регистрацию при первом посещении
if (isFirstVisit() && window.location.pathname === '/') {
  window.location.href = '/registration';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);