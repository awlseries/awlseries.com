// components/BackgroundDots/AdvancedBackgroundDots.jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // Добавляем хук
import './BackgroundDots.css';

const AdvancedBackgroundDots = () => {
  const containerRef = useRef(null);
  const location = useLocation(); // Получаем текущий route

  useEffect(() => {
    const getContentWidth = () => {
      // Ищем ВНУТРЕННИЕ контейнеры контента, а не внешние
      const content = document.querySelector('.main-content-home, .centered-container, .player-information, .tournament-container, .rating-system, .tournament-header-block');
      
      if (content) {
        return content.offsetWidth;
      }
      
      // Fallback: ищем любой контейнер с ограниченной шириной
      const containers = document.querySelectorAll('div');
      for (let container of containers) {
        const style = window.getComputedStyle(container);
        if (style.maxWidth && style.maxWidth !== 'none' && style.maxWidth !== '100%') {
          return parseInt(style.maxWidth);
        }
      }
      
      // Ultimate fallback
      return 1300;
    };

    const updateDots = () => {
      const width = window.innerWidth;
      const container = containerRef.current;
      
      if (!container) return;

      // Настройка плотности точек
      let spacing;
      if (width < 768) {
        spacing = 15; // было 20
      } else if (width < 1366) {
        spacing = 20; // было 30
      } else if (width < 1920) {
        spacing = 25; // было 40
      } else if (width < 2560) {
        spacing = 30; // было 50
      } else {
        spacing = 35; // было 60
      }

      const dotSize = 2;
      
      container.style.setProperty('--dot-spacing', `${spacing}px`);
      container.style.setProperty('--dot-size', `${dotSize}px`);
      
      // Динамически определяем ширину контента
      const contentWidth = getContentWidth();
      const sideWidth = Math.max(0, (width - contentWidth) / 2);
      
      container.style.setProperty('--left-side-width', `${sideWidth}px`);
      container.style.setProperty('--right-side-width', `${sideWidth}px`);
      
      // Принудительно обновляем background-size
      const leftDots = container.querySelector('.left-dots');
      const rightDots = container.querySelector('.right-dots');
      
      if (leftDots && rightDots) {
        leftDots.style.backgroundSize = `${spacing}px ${spacing}px`;
        rightDots.style.backgroundSize = `${spacing}px ${spacing}px`;
      }
    };
    
    const timeoutId = setTimeout(updateDots, 100);
    const intervalId = setInterval(updateDots, 200);
    const stopIntervalId = setTimeout(() => clearInterval(intervalId), 2000);
    
    window.addEventListener('resize', updateDots);
    
    return () => {
      window.removeEventListener('resize', updateDots);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      clearTimeout(stopIntervalId);
    };
  }, [location.pathname]); // Зависимость от route

  return (
    <div ref={containerRef} className="advanced-background-dots">
      <div className="left-dots"></div>
      <div className="right-dots"></div>
    </div>
  );
};

export default AdvancedBackgroundDots;