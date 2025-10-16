// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import { SpeedInsights } from "@vercel/speed-insights/react"
import '/src/styles.css'

// Убираем начальный спиннер когда React загрузился
const removeInitialLoader = () => {
  const initialLoader = document.querySelector('.initial-loading');
  if (initialLoader) {
    initialLoader.style.display = 'none';
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);

// Убираем спиннер когда всё загрузилось
setTimeout(removeInitialLoader, 100);