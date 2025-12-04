// components/Ticker/Ticker.jsx
import React from 'react';
import '/src/styles.css';
import { useLanguage } from '/utils/language-context.jsx';

const Ticker = () => {
  const { t } = useLanguage();
  const tickerData = [
    t('ticker.message1'),
    t('ticker.message2'),
    t('ticker.message3'),
    t('ticker.message4')
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