import { useState, useEffect } from 'react';
import { supabase } from '../src/supabase';
import { useLanguage } from '/utils/language-context.jsx';
import { showSingleNotification } from '/utils/notifications';
import Footer from '../src/components/footer/footer';
import FeedbackModal from '../src/components/feedbackmodal/feedbackmodal.jsx';
import './ResetPassword.css';

const ResetPassword = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError(t('errors.passwords_mismatch'));
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(t('errors.password_length'));
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      showSingleNotification(`✓ ${t('password_updated')}`);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page-reset-password">
      {/* Переключатель языка как в Registration */}
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
      
      <div className="main-content-registration-reset-password">
        <div className="registration-container-reset-password">
          <form onSubmit={handleResetPassword}>
            <h1>{t('reset_password_title')}</h1>
            
            {error && <div className="error-message global-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="new-password">{t('new_password_label')}</label>
              <input 
                type="password" 
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('new_password_placeholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-new-password">{t('confirm_new_password_label')}</label>
              <input 
                type="password" 
                id="confirm-new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirm_new_password_placeholder')}
                required
              />
            </div>
            
            <button type="submit" className="next-btn" disabled={loading}>
              {loading ? '...' : (
                <img src="/images/icons/icon-strelka.png" alt="Иконка стрелки" className="button-icon-strelka" />
              )}
            </button>

            {/* Ссылка на страницу входа */}
            <div className="login-link">
              <span>{t('remember_password')}</span>
              <a href="/registration"> {t('login_link')}</a>
            </div>
          </form>
        </div>
      </div>

      {/* Футер и модальное окно как в Registration */}
      <Footer 
        onFeedbackClick={() => setFeedbackOpen(true)} 
      />
      <FeedbackModal 
        isOpen={isFeedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
};

export default ResetPassword;