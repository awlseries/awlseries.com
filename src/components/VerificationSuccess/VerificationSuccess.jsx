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
  
  const checkEmailConfirmation = async () => {
    try {
      // Получаем текущую сессию
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔵 Session error:', error);
        setHasValidToken(false);
        showSingleNotification(t('verification_success.invalid_verification_link'), true);
        return;
      }
      
      if (session?.user) {
        console.log('🔵 User found:', session.user.email);
        
        // Проверяем, подтвержден ли email
        const isEmailConfirmed = session.user.email_confirmed_at || 
                                session.user.confirmed_at;
        
        console.log('🔵 Email confirmed:', isEmailConfirmed);
        
        if (isEmailConfirmed) {
          setHasValidToken(true);
          showSingleNotification(`✓ ${t('notifications.email_verified')}`);
          
          // Обновляем запись в таблице users
          await supabase
            .from('users')
            .update({ email_confirmed_at: new Date().toISOString() })
            .eq('id', session.user.id);
            
        } else {
          setHasValidToken(false);
          showSingleNotification(t('verification_success.invalid_verification_link'), true);
        }
      } else {
        console.log('🔵 No user session found');
        setHasValidToken(false);
        showSingleNotification(t('verification_success.invalid_verification_link'), true);
      }
    } catch (error) {
      console.error('🔵 Check confirmation error:', error);
      setHasValidToken(false);
      showSingleNotification(t('verification_success.invalid_verification_link'), true);
    } finally {
      setHasCheckedToken(true);
    }
  };

  checkEmailConfirmation();
}, [t]);

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