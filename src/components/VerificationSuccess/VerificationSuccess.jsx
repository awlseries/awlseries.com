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
    console.log('🔵 URL Search params:', window.location.search);
    
    // Проверяем наличие токена подтверждения в URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    
    console.log('🔵 Token:', token);
    console.log('🔵 Type:', type);
    
    if (token && type === 'signup') {
      console.log('🔵 Valid confirmation token found');
      setHasValidToken(true);
      if (!hasCheckedToken) {
        showSingleNotification(`✓ ${t('notifications.email_verified')}`);
      }
    } else {
      console.log('🔵 No valid token found - manual access');
      setHasValidToken(false);
      if (!hasCheckedToken) {
        showSingleNotification(t('verification_success.invalid_verification_link'), true);
      }
    }
    
    setHasCheckedToken(true);
    
    return () => {
      console.log('🔴 VerificationSuccess unmounted');
    };
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