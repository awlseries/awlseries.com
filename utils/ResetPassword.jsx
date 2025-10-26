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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  // Проверяем, что пользователь пришел по правильной ссылке сброса пароля
  useEffect(() => {
  const checkAccess = async () => {
    try {
      console.log('🔵 Current URL:', window.location.href);
      
      // Сценарий 1: Прямой доступ с токеном в hash (после verify)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      // Сценарий 2: Возможно, токен еще в query params (до verify)
      const urlParams = new URLSearchParams(window.location.search);
      const verifyToken = urlParams.get('token');
      const verifyType = urlParams.get('type');
      const redirectTo = urlParams.get('redirect_to');
      
      console.log('🔵 Hash access_token:', accessToken);
      console.log('🔵 Hash type:', type);
      console.log('🔵 Query token:', verifyToken);
      console.log('🔵 Query type:', verifyType);
      
      // Если есть токен verify в query - это значит пользователь только что перешел по email ссылке
      // Supabase еще не обработал verify и не перенаправил
      if (verifyToken && verifyType === 'recovery' && redirectTo) {
        console.log('🟡 Need to process verify URL first');
        
        // Показываем загрузку пока Supabase обрабатывает verify
        showSingleNotification('Проверка ссылки...');
        return;
      }
      
      // Если есть access_token в hash - значит verify прошел успешно
      if (accessToken && type === 'recovery') {
        console.log('🟢 Valid recovery token in hash');
        setIsValidAccess(true);
        setIsCheckingAccess(false);
        return;
      }
      
      // Если нет валидных параметров
      console.log('🔴 No valid token found');
      showSingleNotification(t('use_reset_link'), true);
      setTimeout(() => {
        window.location.href = '/forgot-password';
      }, 3000);
      
    } catch (error) {
      console.error('🔴 Access check error:', error);
      showSingleNotification(t('session_expired'), true);
      setTimeout(() => {
        window.location.href = '/forgot-password';
      }, 3000);
    } finally {
      setIsCheckingAccess(false);
    }
  };

  checkAccess();
}, [t]);

  // Функции валидации (возвращают boolean)
  const validatePasswordRealTime = (value) => {
    if (!value) return true; // Пустое поле - нейтральный статус
    return value.length >= 8 && 
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) return true; // Пустое поле - нейтральный статус
    return password === confirmPassword;
  };

  // Функция проверки совпадения паролей с визуальной индикацией
  const checkPasswordMatch = () => {
    const passwordInput = document.getElementById('new-password');
    const confirmInput = document.getElementById('confirm-new-password');
    
    if (!passwordInput || !confirmInput) return;
    
    // Валидация основного пароля
    const isPasswordValid = validatePasswordRealTime(password);
    passwordInput.classList.remove('valid-input', 'invalid-input');
    if (password) {
      if (!isPasswordValid) {
        passwordInput.classList.add('invalid-input');
      } else {
        passwordInput.classList.add('valid-input');
      }
    }
    
    // Валидация подтверждения пароля
    const isMatchValid = validatePasswordMatch(password, confirmPassword);
    confirmInput.classList.remove('valid-input', 'invalid-input');
    if (confirmPassword) {
      if (!isMatchValid) {
        confirmInput.classList.add('invalid-input');
      } else {
        confirmInput.classList.add('valid-input');
      }
    }
  };

  // Обработчик изменения основного пароля
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  // Обработчик изменения подтверждения пароля
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError(t('errors.passwords_mismatch'));
      setLoading(false);
      return;
    }

    // Проверка длины пароля
    if (password.length < 8) {
      setError(t('errors.password_length'));
      setLoading(false);
      return;
    }

    // Проверка сложности пароля
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(t('errors.password_complexity'));
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

  // Вызываем проверку при изменении паролей
  useEffect(() => {
    checkPasswordMatch();
  }, [password, confirmPassword]);

  // Показываем loader пока проверяем доступ
  if (isCheckingAccess) {
    return (
      <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Проверка доступа..</p>
    </div>
    );
  }
  
  // Если доступ не валиден, не показываем форму
  if (!isValidAccess) {
    return (
      <div className="registration-page-reset-password">
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
        </div>

        <Footer 
          onFeedbackClick={() => setFeedbackOpen(true)} 
        />
        <FeedbackModal 
          isOpen={isFeedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="registration-page-reset-password">
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
          <form onSubmit={handleResetPassword} className='form-reset-password'>
            <h1>{t('reset_password_title')}</h1>
            
            {error && <div className="error-message global-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="new-password">
                {t('new_password_label')}
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="new-password"
                value={password}
                onChange={handlePasswordChange}
                placeholder={t('new_password_placeholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-new-password">
                {t('confirm_new_password_label')}
              </label>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirm-new-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder={t('confirm_new_password_placeholder')}
                required
              />
            </div>
            
            <button type="submit" className="next-btn" disabled={loading}>
              {loading ? '...' : (
                <img src="/images/icons/icon-strelka.png" alt="Иконка стрелки" className="button-icon-strelka" />
              )}
            </button>
          </form>
        </div>
      </div>

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