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
  
  // Проверяем ВСЕ параметры URL
  const urlParams = new URLSearchParams(window.location.search);
  console.log('🔵 All URL parameters:');
  for (let [key, value] of urlParams) {
    console.log(`🔵 ${key}: ${value}`);
  }
  
  // Supabase может использовать другие параметры
  const token = urlParams.get('token');
  const type = urlParams.get('type');
  const token_hash = urlParams.get('token_hash'); // Supabase часто использует это
  const refresh_token = urlParams.get('refresh_token');
  
  console.log('🔵 Token:', token);
  console.log('🔵 Type:', type);
  console.log('🔵 Token hash:', token_hash);
  console.log('🔵 Refresh token:', refresh_token);
  
  // Проверяем разные комбинации параметров Supabase
  if ((token && type === 'signup') || token_hash) {
    console.log('🔵 Valid confirmation found');
    setHasValidToken(true);
    if (!hasCheckedToken) {
      showSingleNotification(`✓ ${t('notifications.email_verified')}`);
    }
  } else {
    console.log('🔵 No valid token found');
    setHasValidToken(false);
    if (!hasCheckedToken) {
      showSingleNotification(t('verification_success.invalid_verification_link'), true);
    }
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