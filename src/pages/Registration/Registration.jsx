import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import Footer from '../../components/footer/footer';
import FeedbackModal from '../../components/feedbackmodal/feedbackmodal.jsx';
import { showSingleNotification } from '/utils/notifications';
import LottieAnimation from '../../components/LottieAnimation/LottieAnimation';
import { useLanguage } from '/utils/language-context.jsx';
import '/src/styles.css';

const Registration = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isPasswordRecoveryOpen, setPasswordRecoveryOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('registration');
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const registrationContainerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const STORAGE_KEYS = {
    VERIFICATION: "email_verification_pending",
    TEMP_EMAIL: "temp_email_for_verification",
    TEMP_PASSWORD: "temp_password_for_verification",
    CURRENT_SCREEN: "current_screen"
  };
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  // ------------------------------------------------- Проверка авторизации при загрузке страницы

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Пользователь авторизован, получаем его данные
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData && !userError) {
            const displayName = userData.fullname || userData.email || 'Пользователь';
            // Показываем уведомление
            showSingleNotification(
  `${t('notifications.auth_already')} <span style="color: #d0cbba; font-weight: bold;">${displayName}</span>`,
  false,  // isError = false
  3000    // duration = 3000
);
            setIsUserAuthenticated(true);
            
            // Через 3 секунды перенаправляем на главную
            setTimeout(() => {
              window.location.href = '/';
            }, 3000);
          }
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkUserAuth();
  }, []);

  // ------------------------------- Слушатель изменения состояния авторизации

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && !isUserAuthenticated) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData && !userError && window.location.pathname === '/registration') {
          const displayName = userData.fullname || userData.email || 'Пользователь';
          
          // Показываем уведомление только если мы еще на странице регистрации
          if (window.location.pathname === '/registration') {
            showSingleNotification(
            `${t('notifications.auth_already')} <span style="color: #d0cbba; font-weight: bold;">${displayName}</span>`,
            false,
            3000
          );
          
          setIsUserAuthenticated(true);
        }
      }
      }
    });

    return () => subscription.unsubscribe();
  }, [isUserAuthenticated]);

  // --------------------------------------------- Таймер для обратного отсчета

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // ------------------------------------- Запуск таймера при показе экрана верификации

  useEffect(() => {
    if (currentScreen === 'verification') {
      startCountdown();
    }
  }, [currentScreen]);

  const startCountdown = (seconds = 60) => {
    setResendCooldown(seconds);
    setIsResendDisabled(true);
  };

  // ------------------------------------------------------- Плавное появление при скролле

  useEffect(() => {
    const checkScroll = () => {
      if (registrationContainerRef.current) {
        const footer = document.querySelector('.main-footer');
        if (footer) {
          const footerRect = footer.getBoundingClientRect();
          if (footerRect.top <= window.innerHeight) {
            registrationContainerRef.current.classList.add('show');
            window.removeEventListener('scroll', checkScroll);
          }
        }
      }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  // ------------------------------------------------------ Проверка состояния при загрузке

useEffect(() => {
  const checkAuthState = async () => {
    try {
      // Проверяем сохраненный экран верификации
      const savedScreen = localStorage.getItem(STORAGE_KEYS.CURRENT_SCREEN);
      if (savedScreen === 'verification') {
        // Если был сохранен экран верификации, проверяем сессию
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user && !session.user.email_confirmed_at) {
          // Пользователь все еще не подтвердил email, показываем экран верификации
          setUser(session.user);
          setUserEmail(session.user.email);
          setCurrentScreen('verification');
          startVerificationCheck(session.user);
          return;
        } else {
          // Если email подтвержден или сессии нет, очищаем
          localStorage.removeItem(STORAGE_KEYS.CURRENT_SCREEN);
        }
      }

      const savedData = localStorage.getItem(STORAGE_KEYS.VERIFICATION);
      
      if (savedData) {
        const { email, userId, timestamp } = JSON.parse(savedData);
        
        // Проверяем актуальность данных (не старше 24 часов)
        if (timestamp && Date.now() - new Date(timestamp).getTime() > 24 * 60 * 60 * 1000) {
          clearAuthData();
          return;
        }
        
        // Проверяем текущую сессию
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          if (session.user.email_confirmed_at) {
            setCurrentScreen('complete');
            clearAuthData();
          } else {
            setUser(session.user);
            setUserEmail(session.user.email || email);
            setCurrentScreen('verification');
            startVerificationCheck(session.user);
          }
        }
      }
    } catch (error) {
      console.error("Ошибка проверки состояния:", error);
      clearAuthData();
    } finally {
      setIsCheckingAuth(false);
    }
  };

  checkAuthState();
}, []);

  // ----------------------------------------------------- Отключение браузерных подсказок валидации

  useEffect(() => {
    const disableBrowserValidation = () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.setAttribute('novalidate', 'true');
      });
    };

    disableBrowserValidation();
  }, [currentScreen, isLoginForm]);

  // ------------------------------------------------------------------ Валидация полей формы

const validateRegistrationForm = (formData) => {
  const errors = {};
  const { fullname, email, password, confirmPassword } = formData;

  // Валидация имени
  if (!fullname.trim()) {
    errors.fullname = t('errors.fullname_required');
  } else if (!/^[А-ЯЁA-Z][а-яёa-z]+\s[А-ЯЁA-Z][а-яёa-z]+$/.test(fullname)) {
    errors.fullname = t('errors.fullname_format');
  } else if (fullname.length < 5 || fullname.length > 30) {
    errors.fullname = t('errors.fullname_length');
  }

  // Валидация email
  if (!email.trim()) {
    errors.email = t('errors.email_required');
  } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
    errors.email = t('errors.email_invalid');
  }

  // Валидация пароля
  if (!password) {
    errors.password = t('errors.password_required');
  } else if (password.length < 8) {
    errors.password = t('errors.password_length');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.password = t('errors.password_complexity');
  }

  // Валидация подтверждения пароля
  if (!confirmPassword) {
    errors.confirmPassword = t('errors.confirm_password_required');
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t('errors.passwords_mismatch');
  }

  return errors;
};

  // -------------------------------------------------------------- Валидация формы входа

const validateLoginForm = (formData) => {
  const errors = {};
  const { email, password } = formData;

  if (!email.trim()) {
    errors.email = t('errors.email_required');
  } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
    errors.email = t('errors.email_invalid');
  }

  if (!password) {
    errors.password = t('errors.password_required');
  }

  return errors;
};

  // ----------------------------------------------------------------- Показать экран верификации

  const showVerificationScreen = (email, user) => {
    setUserEmail(email);
    setUser(user);
    setCurrentScreen('verification');
    // Сохраняем текущий экран
    localStorage.setItem(STORAGE_KEYS.CURRENT_SCREEN, 'verification');
    
    startVerificationCheck(user);
    startCountdown();
    showSingleNotification(`✓ ${t('notifications.verification_sent')}`);
  };

  // -------------------------------------------------------------------- Проверка верификации email

  const startVerificationCheck = (user) => {
  const checkInterval = setInterval(async () => {
    try {
      // Получаем актуальную сессию
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      // Проверяем подтверждение в auth
      if (session?.user) {
        // Получаем свежие данные пользователя из auth
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;

        // Проверяем различные возможные поля подтверждения
        const isEmailConfirmed = 
          currentUser?.email_confirmed_at || 
          currentUser?.confirmed_at ||
          currentUser?.email_verified;
        
        if (isEmailConfirmed) {
          clearInterval(checkInterval);
          
          // ОБНОВЛЯЕМ запись в таблице users
          await supabase
            .from('users')
            .update({ 
              email_confirmed_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            })
            .eq('id', currentUser.id);

          setCurrentScreen('complete');
          localStorage.removeItem(STORAGE_KEYS.CURRENT_SCREEN);
          clearAuthData();
          showSingleNotification(`✓ ${t('notifications.email_verified')}`);
        }
      }
    } catch (error) {
      console.error('Ошибка проверки верификации:', error);
      clearInterval(checkInterval);
    }
  }, 5000);
};

  // -------------------------------------------------------- Обработчик отправки повторного письма верификации

  const handleResendVerification = async () => {
    if (isResendDisabled) return;
    
    try {
      setIsResendDisabled(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) throw error;
      showSingleNotification(`✓ ${t('notifications.resend_success')}`);
      
      // Запускаем таймер
      startCountdown();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setIsResendDisabled(false);
      showSingleNotification(`✗ ${t('notifications.resend_error')} ${error.message}`, true);
    }
  };

  // ------------------------------------------------------- Очистка данных аутентификации

  const clearAuthData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  };

  // ------------------------------------------------------------- Обработчик отправки формы регистрации

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError('');
    setFieldErrors({});
    
    const form = e.target;
    const formData = {
      fullname: form.fullname.value,
      email: form.email.value,
      password: form.password.value,
      confirmPassword: form['confirm-password'].value
    };

    // -------------------------------------------------------------- Валидация формы регистрации

    const errors = validateRegistrationForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Регистрация в Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullname
          }
        }
      });

      if (error) {
      // Проверяем, является ли ошибка "email уже существует"
      if (error.message?.includes('already registered') || error.code === 'user_already_exists' || error.message?.includes('User already registered')) {
        throw new Error('EMAIL_ALREADY_EXISTS');
      }
      throw error;
    }
      
      // Сохраняем данные в localStorage
      localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify({
        email: formData.email,
        userId: data.user.id
      }));
      localStorage.setItem(STORAGE_KEYS.TEMP_EMAIL, formData.email);
      
      // Создаем запись в таблице users supabase
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          fullname: formData.fullname,
          email: formData.email,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          email_confirmed_at: null,
          team: "free agent",
          battlefield_nickname: "",
          country: "EMPTY",
          division: "calibration",
          mmr: 0,
          stats: null,
          player_class: "assault"
        });

      if (dbError) throw dbError;

      showVerificationScreen(formData.email, data.user);
      
    } catch (error) {
    console.error('Ошибка регистрации:', error);
    
    // Обрабатываем случай существующего email
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      const errorMessage = t('email_already_exists');
      setError(errorMessage);
      showSingleNotification(errorMessage, true);
    } else {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      showSingleNotification(errorMessage, true);
    }
  } finally {
    setLoading(false);
  }
};

  // ----------------------------------------------------------------- Обработчик входа
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    
    const form = e.target;
    const formData = {
      email: form.email.value,
      password: form.password.value
    };

    // ----------------------------------------------------------------- Валидация формы логина

    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      // Обновляем last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      showSingleNotification(`✓ ${t('notifications.login_success')}`);
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка входа:', error);
      const errorMessage = getLoginErrorMessage(error);
      setError(errorMessage);
      showSingleNotification(errorMessage, true);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------- Обработчик восстановления пароля

const handlePasswordRecoverySubmit = async (e) => {
  e.preventDefault();
  setRecoveryLoading(true);
  setError('');
  
  const form = e.target;
  const email = form.email.value;

  if (!email.trim() || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
    setError(t('errors.email_invalid'));
    setRecoveryLoading(false);
    return;
  }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      showSingleNotification(`✓ ${t('notifications.recovery_instructions')}`);
      setPasswordRecoveryOpen(false);
      setError('');
    } catch (error) {
      console.error('Ошибка восстановления пароля:', error);
      const errorMessage = getRecoveryErrorMessage(error);
      setError(errorMessage);
      showSingleNotification(errorMessage, true);
    } finally {
      setRecoveryLoading(false);
    }
  };

  // -------------------------------------------------------------- Переключение на форму входа

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsLoginForm(true);
    setError('');
    setFieldErrors({});
  };
  // Переключение обратно на форму регистрации
  const handleRegisterClick = (e) => {
    e.preventDefault();
    setIsLoginForm(false);
    setError('');
    setFieldErrors({});
  };

  // ------------------------------------------------- Получение понятных сообщений об ошибке регистрации

  const getErrorMessage = (error) => {
    const supabaseErrorMap = {
      'user_already_exists': t('firebase_errors.auth/email-already-in-use'),
      'weak_password': t('firebase_errors/auth/weak-password'),
      'invalid_email': t('firebase_errors/auth/invalid-email'),
      'email_rate_limit_exceeded': t('email_rate_limit'),
    '23505': t('email_already_exists'), // unique violation
    '23503': t('email_already_exists') // foreign key violation - тоже означает что пользователь существует
  };
  
  // сообщение об ошибке на наличие ключевых фраз
  if (error.message?.includes('already registered') || 
      error.message?.includes('already exists') ||
      error.code === '23505' || 
      error.code === '23503') {
    return t('email_already_exists');
  }
  // на лимит писем
  if (error.message?.includes('rate limit') || error.code === 'email_rate_limit_exceeded') {
    return t('email_rate_limit');
  }
  
  const errorMessage = supabaseErrorMap[error.code] || 
                      t(`firebase_errors.${error.code}`) || 
                      t('errors.registration_failed');
  
  return errorMessage;
};

  // Ошибки для входа
  const getLoginErrorMessage = (error) => {
    const supabaseErrorMap = {
      'invalid_credentials': t('firebase_errors.auth/wrong-password'),
      'email_not_confirmed': t('firebase_errors/auth/email-not-verified'),
      'invalid_email': t('firebase_errors/auth/invalid-email')
    };
    
    const errorMessage = supabaseErrorMap[error.code] || t(`firebase_errors.${error.code}`) || `Ошибка входа: ${error.message}`;
    return errorMessage;
  };

  // Ошибки для восстановления
  const getRecoveryErrorMessage = (error) => {
    const errorMessage = t(`firebase_errors.${error.code}`) || `Ошибка восстановления: ${error.message}`;
    return errorMessage;
  };

  // ------------------------------------------------------------ Очистка ошибки поля при фокусе

  const handleFieldFocus = (fieldName) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  // ---------------------------------------------------------------- Простая проверка совпадения паролей

const checkPasswordMatch = () => {
  const password = document.getElementById('password')?.value;
  const confirmPassword = document.getElementById('confirm-password')?.value;
  const confirmInput = document.getElementById('confirm-password');
  
  if (!confirmInput) return;
  
  // Убираем предыдущие классы
  confirmInput.classList.remove('valid-password', 'invalid-password');
  
  // Добавляем соответствующий класс только если поле не пустое
  if (confirmPassword) {
    if (password === confirmPassword) {
      confirmInput.classList.add('valid-password');
    } else {
      confirmInput.classList.add('invalid-password');
    }
  }
};

// --------------------------------------------------------------- Обработчик изменения поля подтверждения пароля

const handleConfirmPasswordChange = (e) => {
  checkPasswordMatch();
  
  // Очищаем ошибку при вводе
  setFieldErrors(prev => ({
    ...prev,
    confirmPassword: ''
  }));
  setError('');
};

// Также проверяем при изменении основного пароля
const handlePasswordChange = (e) => {
  checkPasswordMatch();
  setError('');
};

  // ------------------------------------------------------------------------------------------ HTML

  return (
    <div className="registration-page">
      {!isCheckingAuth && ( 
        <>
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
      
      <div className="main-content-registration">
        <div className="registration-container" ref={registrationContainerRef}>

          {/* Форма регистрации */}
          {currentScreen === 'registration' && !isLoginForm && (
  <form id="registrationForm" onSubmit={handleRegistrationSubmit}>
    <h1>{t('registration_title')}</h1>
    
    {error && <div className="error-message global-error">{error}</div>}
    
    <div className="form-group">
      <label htmlFor="fullname">{t('fullname_label')}</label>
      <input 
        type="text" 
        id="fullname" 
        name="fullname"
        placeholder={t('fullname_placeholder')}
        onFocus={() => handleFieldFocus('fullname')}
        onChange={() => setError('')}
      />
      {fieldErrors.fullname && <span className="error-message">{fieldErrors.fullname}</span>}
    </div>
    
    <div className="form-group">
      <label htmlFor="email">{t('email_label')}</label>
      <input 
        type="email" 
        id="email" 
        name="email" 
        placeholder={t('email_placeholder')}
        onFocus={() => handleFieldFocus('email')}
        onChange={() => setError('')}
      />
      {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
    </div>
    
    <div className="form-group">
      <label htmlFor="password">
        {t('password_label')}
        <button 
          type="button" 
          id="togglePassword" 
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </label>
      <input 
        type={showPassword ? 'text' : 'password'} 
        id="password" 
        name="password"
        placeholder={t('password_placeholder')}
        onFocus={() => handleFieldFocus('password')}
        onChange={(e) => {
          handlePasswordChange(e);
          setError('');
        }}
      />
      {fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}
    </div>

    <div className="form-group">
      <label htmlFor="confirm-password">{t('confirm_password_label')}</label>
      <input 
        type="password" 
        id="confirm-password" 
        name="confirm-password"
        placeholder={t('confirm_password_placeholder')}
        onFocus={() => handleFieldFocus('confirmPassword')}
        onChange={(e) => {
          handleConfirmPasswordChange(e);
          setError('');
        }}
        onBlur={(e) => {
  const password = document.getElementById('password')?.value;
  const confirmPassword = e.target.value;
  
  if (confirmPassword && password !== confirmPassword) {
    setFieldErrors(prev => ({
      ...prev,
      confirmPassword: t('errors.passwords_mismatch')
    }));
  }
}}
      />
      {fieldErrors.confirmPassword && <span className="error-message">{fieldErrors.confirmPassword}</span>}
    </div>
    
    <button type="submit" className="next-btn" disabled={loading}>
      {loading ? '...' : (
        <img src="/images/icons/icon-strelka.png" alt="Иконка стрелки" className="button-icon-strelka" />
      )}
    </button>
    
    <div className="login-link">
      <span>{t('already_account')}</span>
      <a href="#" onClick={handleLoginClick}> {t('login_link')}</a>
    </div>
    
    <img src="/images/other/skull-for-registration.png" alt="Skull-registration-awl" className="registration-form-skull" />
    <img src="/images/other/top250-eye-small.png" alt="Горящий глаз" className="registration-form-eye" />
  </form>
)}

          {/* Форма входа */}
          {currentScreen === 'registration' && isLoginForm && (
  <form id="loginForm" onSubmit={handleLoginSubmit}>
    <h1>{t('login_title')}</h1>
    
    {error && <div className="error-message global-error">{error}</div>}
    
    <div className="form-group">
      <label htmlFor="login-email">{t('email_label')}</label>
      <input 
        type="email" 
        id="login-email" 
        name="email" 
        placeholder={t('email_placeholder')}
        onFocus={() => handleFieldFocus('email')}
        onChange={() => setError('')}
      />
      {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
    </div>
    
    <div className="form-group">
      <label htmlFor="login-password">
        {t('password_label')}
        <button 
          type="button" 
          id="toggleLoginPassword" 
          className="toggle-password"
          onClick={() => setShowLoginPassword(!showLoginPassword)}
        >
          {showLoginPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </label>
      <input 
        type={showLoginPassword ? 'text' : 'password'} 
        id="login-password" 
        name="password"
        placeholder={t('password_placeholder')}
        onFocus={() => handleFieldFocus('password')}
        onChange={() => setError('')}
      />
      {fieldErrors.password && <span className="error-message">{fieldErrors.password}</span>}
    </div>
    
    <button type="submit" className="next-btn" disabled={loading}>
      {loading ? '...' : (
        <img src="/images/icons/icon-strelka.png" alt="Иконка стрелки" className="button-icon-strelka" />
      )}
    </button>

    <button 
      type="button" 
      className="recover-password-btn"
      onClick={() => setPasswordRecoveryOpen(true)}
    >
      {t('password_recovery_title')}
    </button>
    
    <div className="login-link">
      <span>{t('no_account')}</span>
      <a href="#" onClick={handleRegisterClick}> {t('register_link')}</a>
    </div>
  </form>
)}

          {/* Экран верификации */}
         {currentScreen === 'verification' && (
  <div id="verification-screen" className="verification-screen active">
    <div className="verification-header">
      <h2 className="verification-title">{t('verify_email_title')}</h2>
      <div className="verification-icon">
        <img 
          src="/images/icons/icon-letter-green.png" 
          style={{width: '70px', height: '70px'}} 
          alt="Иконка письма" 
          className="green-letter"
        />
      </div>
      <p className="verification-text">
        <span>{t('verify_email_text')} &nbsp;</span> 
        <strong id="verification-email" className="email-highlight">{userEmail}</strong>
      </p>
      <LottieAnimation width={40} height={40} />
    </div>
    <button 
      id="resend-verification" 
      className={`btn-secondary ${isResendDisabled ? 'disabled' : ''}`}
      onClick={handleResendVerification} 
      disabled={isResendDisabled}
    >
      {isResendDisabled && (
        <div className="countdown-overlay">
          <span className="countdown-number">{resendCooldown}</span>
        </div>
      )}
      <span 
        className="button-text" 
        style={{ opacity: isResendDisabled ? 0.3 : 1 }}
      >
        {t('resend_verification')}
      </span> 
    </button>
    <p className="verification-hint">
      {t('verify_email_hint')}
    </p>
  </div>
)}

          {/* Экран завершения регистрации */}
          {currentScreen === 'complete' && (
  <div id="registration-complete" className="registration-complete active">
    <h2>{t('registration_complete_title')}</h2>
    <img src="/images/icons/awl_icon_complete.png" alt="Complete" className="complete-icon" />
    <p className="complete-text">
      <span>{t('welcome_text')} </span>
      <a href="/rules" target="_blank" rel="noopener noreferrer" className="rules-link">
        {t('rules_link')}
      </a> 
      <span> {t('wish_text')}</span>
    </p>
    <a href="/" className="complete-to-main-page-btn">{t('main_page_link')}</a>
  </div>
)}
        </div>
      </div>

      <Footer 
        onFeedbackClick={() => setFeedbackOpen(true)} 
      />

      <FeedbackModal 
  isOpen={isFeedbackOpen}
  onClose={() => setFeedbackOpen(false)}
/>

      {/* Модальное окно восстановления пароля */}
{isPasswordRecoveryOpen && (
  <div id="password-recovery-modal" className="feedback-modal show">
    <div className="feedback-modal-content">
      <button className="feedback-close-btn" onClick={() => {
        setPasswordRecoveryOpen(false);
        setError('');
      }}>&times;</button>
      <h3>{t('password_recovery_title')}</h3>
      
      <form id="password-recovery-form" onSubmit={handlePasswordRecoverySubmit} noValidate>
        <div className="form-group">
          <label htmlFor="recovery-email">{t('recovery_email_label')}</label>
          <input 
            type="email" 
            id="recovery-email" 
            name="email" 
            placeholder={t('password_recovery_placeholder')}
            onInvalid={(e) => e.preventDefault()}
            onChange={() => setError('')}
          />
          {error && <div className="error-message global-error">{error}</div>}
        </div>
        <button type="submit" className="feedback-submit-btn" disabled={recoveryLoading}>
          {recoveryLoading ? t('recovery_loading') : t('recovery_send_button')}
        </button>
      </form>
    </div>
  </div>
)}
        </>
)}
    </div>
  );
};

export default Registration;