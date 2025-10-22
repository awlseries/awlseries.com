import React, { useEffect, useState } from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import { showSingleNotification } from '/utils/notifications';
import './VerificationSuccess.css';

const VerificationSuccess = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [hasValidToken, setHasValidToken] = useState(false);
  const [hasCheckedToken, setHasCheckedToken] = useState(false);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  useEffect(() => {
  console.log('🔵 VerificationSuccess mounted');
  console.log('🔵 Current URL:', window.location.href);
  
  // Проверяем HASH fragment (после #)
  const hash = window.location.hash;
  console.log('🔵 Hash fragment:', hash);
  
  if (hash) {
    // Убираем # и парсим параметры из hash
    const hashParams = new URLSearchParams(hash.substring(1));
    console.log('🔵 All HASH parameters:');
    for (let [key, value] of hashParams) {
      console.log(`🔵 ${key}: ${value}`);
    }
    
    const token = hashParams.get('access_token');
    const token_hash = hashParams.get('token_hash');
    const type = hashParams.get('type');
    
    console.log('🔵 Access token:', token);
    console.log('🔵 Token hash:', token_hash);
    console.log('🔵 Type:', type);
    
    // Проверяем параметры из hash
    if ((token || token_hash) && type === 'signup') {
      console.log('🔵 Valid confirmation found in hash');
      setHasValidToken(true);
      if (!hasCheckedToken) {
        showSingleNotification(`✓ ${t('notifications.email_verified')}`);
      }
      return;
    }
  }
  
  console.log('🔵 No valid token found');
  setHasValidToken(false);
  if (!hasCheckedToken) {
    showSingleNotification(t('verification_success.invalid_verification_link'), true);
  }
  
  setHasCheckedToken(true);
}, [t, hasCheckedToken]);

  console.log('🟢 VerificationSuccess rendering');

  return (
    <div className="verification-success-page">
      <div className="language-switcher">
        <img 
          src="/images/icons/icon-rus.png" 
          alt="Russian" 
          className={`language-flag ${currentLanguage === 'ru' ? 'active' : ''}`} 
          data-lang="ru" 
          onClick={() => handleLanguageChange('ru')}
        />
        <img 
          src="/images/icons/icon-usa.png" 
          alt="English" 
          className={`language-flag ${currentLanguage === 'en' ? 'active' : ''}`} 
          data-lang="en" 
          onClick={() => handleLanguageChange('en')}
        />
      </div>

      {/* Контент зависит от наличия токена */}
      {hasValidToken ? (
        <div className="verification-success-container">
          <div className="success-icon">
            <img src="/images/icons/awl_icon_complete.png" alt="Email Verified" />
          </div>
          <h1 className="success-title">{t('verification_success.title')}</h1>
          <p className="success-message">
            {t('verification_success.welcome_text')}{' '}
          </p>
          <div className="success-actions">
            <button 
              className="close-btn"
              onClick={() => {
                window.close();
              }}
            >
              {t('verification_success.close_window')}
            </button>
          </div>
        </div>
      ) : (
        <div className="verification-success-container">
          <div className="success-icon">
            <img src="/images/icons/awl-icon-error.png" alt="Invalid Access" />
          </div>
          <h1 className="success-title" style={{color: '#e74c3c'}}>
            {t('verification_success.invalid_access')}
          </h1>
          <p className="success-message">
            {t('verification_success.invalid_access_message')}
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationSuccess;