import React, { useEffect, useState } from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import { showSingleNotification } from '/utils/notifications';
import { supabase } from '../../supabase';
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
  
  const checkConfirmation = async () => {
    try {
      // Даем время Supabase обработать сессию
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Проверяем сессию
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('🔵 Session error:', error);
        throw error;
      }
      
      if (session?.user) {
        console.log('🔵 User session found:', session.user.email);
        
        // Проверяем подтверждение email в БД
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email_confirmed_at')
          .eq('id', session.user.id)
          .single();
          
        if (userError) throw userError;
        
        console.log('🔵 Email confirmed in DB:', userData?.email_confirmed_at);
        
        if (userData?.email_confirmed_at) {
          setHasValidToken(true);
          if (!hasCheckedToken) {
            showSingleNotification(`✓ ${t('notifications.email_verified')}`);
          }
        } else {
          setHasValidToken(false);
          if (!hasCheckedToken) {
            showSingleNotification(t('verification_success.invalid_verification_link'), true);
          }
        }
      } else {
        console.log('🔵 No user session found');
        setHasValidToken(false);
        if (!hasCheckedToken) {
          showSingleNotification(t('verification_success.invalid_verification_link'), true);
        }
      }
    } catch (error) {
      console.error('🔵 Error:', error);
      setHasValidToken(false);
      if (!hasCheckedToken) {
        showSingleNotification(t('verification_success.invalid_verification_link'), true);
      }
    } finally {
      setHasCheckedToken(true);
    }
  };

  checkConfirmation();
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