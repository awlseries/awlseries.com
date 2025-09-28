// components/Ticker/Ticker.jsx
import React from 'react';
import '/src/styles.css';

const Ticker = () => {
  const tickerData = [
    'Открыт набор в команду дизайна и back/front-end разработки! Присоединяйся к Arena Warborn League',
    'Осенью стартует первая серия турниров выходного дня « WKND CHALLENGE Series 24/25 »',
    'Все вопросы сотрудничества через форму обратной связи',
    'Ищешь команду? В разделе "Трансферы" найдешь напарников'
  ];

  return (
    <div className="ticker-container">
      <div className="ticker-wrapper">
        <div className="ticker-content">
          {tickerData.map((text, index) => (
            <span key={`original-${index}`} className="ticker-item">
              {text}
            </span>
          ))}
          {tickerData.map((text, index) => (
            <span key={`duplicate-${index}`} className="ticker-item">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ticker;