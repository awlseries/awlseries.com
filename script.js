/**
 * ОПТИМИЗИРОВАННЫЙ КОД СИСТЕМЫ РЕГИСТРАЦИИ
 * С исправленными ошибками и улучшениями производительности
 */
// Простая функция экранирования HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Константы для хранения данных
const STORAGE_KEYS = {
  VERIFICATION: "email_verification_pending",
  TEMP_EMAIL: "temp_email_for_verification",
  TEMP_PASSWORD: "temp_password_for_verification",
  PREFERRED_LANG: "preferred_lang" // текущий язык
};

// Основная функция, выполняемая при загрузке DOM
document.addEventListener("DOMContentLoaded", async function() {
  // 1. Сразу скрываем все элементы интерфейса
  const registrationForm = document.getElementById('registrationForm');
  const verificationScreen = document.getElementById('verification-screen');
  const completeScreen = document.getElementById('registration-complete');
  
  [registrationForm, verificationScreen, completeScreen].forEach(el => {
    if (el) el.style.display = 'none';
  });

  // 2. Проверяем состояние верификации в localStorage
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.VERIFICATION);
    
    if (savedData) {
      const { email, uid } = JSON.parse(savedData);
      const password = localStorage.getItem(STORAGE_KEYS.TEMP_PASSWORD);
      
      if (email) {
        // Сценарий 1: Пользователь уже верифицирован
        if (await checkUserVerified(email, password)) {
          if (completeScreen) completeScreen.style.display = 'block';
          return;
        }
        
        // Сценарий 2: Пользователь не верифицирован
        await handleUnverifiedUser(email, password, uid);
        return;
      }
    }
  } catch (error) {
    console.error("Ошибка проверки состояния:", error);
    clearAuthData();
    showSingleNotification('✗ Ошибка проверки состояния', true);
  }

  // 3. Если никакое состояние не найдено - показываем форму регистрации
  if (registrationForm) {
    registrationForm.style.display = 'block';
    setTimeout(() => {
      registrationForm.style.opacity = '1';
    }, 10);
  }

  initializeRegistrationProcess();
  handleSearchOnPageLoad(); // Добавляем обработчик поиска при загрузке
});

// Проверяет, верифицирован ли пользователь
async function checkUserVerified(email, password) {
  try {
    let user = firebase.auth().currentUser;
    
    if (!user && password) {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      user = userCredential.user;
    }
    
    if (user) {
      await user.reload();
      return user.emailVerified;
    }
  } catch (error) {
    console.log("Не удалось проверить статус верификации:", error);
    showSingleNotification('✗ Ошибка проверки верификации', true);
  }
  return false;
}

// Обрабатывает случай, когда пользователь не верифицирован
async function handleUnverifiedUser(email, password, uid) {
  let user = firebase.auth().currentUser;
  
  // Пытаемся восстановить сессию
  if (!user && password) {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      user = userCredential.user;
    } catch (error) {
      console.log("Не удалось войти с сохраненными данными:", error);
      showSingleNotification('✗ Ошибка входа с сохраненными данными', true);
      clearAuthData();
      location.reload();
      return;
    }
  }
  
  // Показываем экран верификации
  showVerificationScreen(email, user, false);
  initializeRegistrationProcess();
}

// Функция попытки восстановления сессии
async function tryRestoreSession() {
  const savedData = localStorage.getItem(STORAGE_KEYS.VERIFICATION);
  if (!savedData) return;

  const { email, uid } = JSON.parse(savedData);
  const password = localStorage.getItem(STORAGE_KEYS.TEMP_PASSWORD);
  
  if (!email || !password) {
    clearAuthData();
    return;
  }

  // Аутентификация пользователя
  let user = firebase.auth().currentUser;
  if (!user) {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      user = userCredential.user;
    } catch (error) {
      showSingleNotification('✗ Ошибка восстановления сессии', true);
      clearAuthData();
      return;
    }
  }

  // Проверка статуса email
  try {
    await user.reload();
    
    if (user.emailVerified) {
      await completeRegistration(uid);
    } else {
      showVerificationScreen(email, user, false);
    }
  } catch (error) {
    showSingleNotification('✗ Ошибка проверки статуса email', true);
  }
}

// Инициализация процесса регистрации
function initializeRegistrationProcess() {
  setupLazyLoading();
  setupLanguageSwitcher();
  setupFormAnimation();
  setupFormValidation();
  setupRegistrationForm();
}

// Обработчик кнопки "Войти"
document.getElementById('login-link')?.addEventListener('click', function(e) {
  e.preventDefault();
  transformToLoginForm();
});

// Блок Авторизации пользователя (по кнопке "Войти")
function transformToLoginForm() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  // Меняем заголовок
  const title = form.querySelector('h1');
  if (title) title.textContent = 'Авторизация';

  // Удаляем ненужные поля
  const fieldsToRemove = ['fullname', 'confirm-password'];
  fieldsToRemove.forEach(fieldId => {
    const fieldGroup = form.querySelector(`[for="${fieldId}"]`)?.closest('.form-group');
    if (fieldGroup) fieldGroup.remove();
  });

  // Обновляем оставшиеся поля
  const emailField = form.querySelector('[for="email"]');
  if (emailField) emailField.textContent = 'Email*';

  const passwordField = form.querySelector('[for="password"]');
  if (passwordField) passwordField.textContent = 'Пароль*';

  // Меняем обработчик формы
  form.removeEventListener('submit', handleFormSubmit);
  form.addEventListener('submit', handleLoginSubmit);

  // Создаем кнопку восстановления пароля
  const recoverButton = document.createElement('button');
  recoverButton.id = 'recover-password-btn';
  recoverButton.className = 'recover-password-btn';
  recoverButton.textContent = 'Восстановить пароль';
  
  // Добавляем кнопку после формы
  form.appendChild(recoverButton);

  // Обновляем ссылку
  const loginLink = document.querySelector('.login-link');
  if (loginLink) {
    loginLink.innerHTML = 'Нет аккаунта? <a href="#" id="register-link">Назад</a>';
    
    // Обработчик для возврата к регистрации
    document.getElementById('register-link')?.addEventListener('click', function(e) {
      e.preventDefault();
      location.reload();
    });
  }

  // Обработчик для кнопки восстановления пароля
  recoverButton.addEventListener('click', function(e) {
    e.preventDefault();
    showPasswordRecoveryModal();
  });
}

// Обработчик входа
async function handleLoginSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
    showSingleNotification('✓ Вход выполнен успешно');
    // Перенаправляем на главную после успешного входа
    window.location.href = '/';
  } catch (error) {
    console.error('Ошибка входа:', error);
    
    // Обработка новых кодов ошибок Firebase v9+
    if (error.code === 'auth/invalid-login-credentials') {
      showSingleNotification('✗ Неверный email или пароль', true);
    } else if (error.code === 'auth/invalid-email') {
      showSingleNotification('✗ Некорректный email', true);
    } else if (error.code === 'auth/too-many-requests') {
      showSingleNotification('✗ Слишком много попыток. Попробуйте позже', true);
    } else if (error.code === 'auth/user-disabled') {
      showSingleNotification('✗ Аккаунт заблокирован', true);
    } else {
      showSingleNotification('✗ Ошибка входа: ' + error.message, true);
    }
  }
}

function setupPasswordToggle() {
        const togglePassword = document.getElementById('togglePassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (togglePassword && password) {
            togglePassword.addEventListener('click', function() {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
        
        if (toggleConfirmPassword && confirmPassword) {
            toggleConfirmPassword.addEventListener('click', function() {
                const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPassword.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', setupPasswordToggle);

// Настройка ленивой загрузки изображений
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach(img => observer.observe(img));
}

// Настройка переключателя языков (ИСПРАВЛЕННАЯ ВЕРСИЯ)
function setupLanguageSwitcher() {
  
  // Находим все переключатели языка
  const flags = document.querySelectorAll('.language-flag');
  
  // Вешаем обработчики на клики
  flags.forEach(flag => {
    flag.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      changeLanguage(lang); // Используем функцию из language.js
    });
  });
  
  // Загружаем сохраненный язык или используем русский по умолчанию
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  changeLanguage(savedLanguage);
}

// Настройка анимации формы
function setupFormAnimation() {
  const formContainer = document.querySelector('.registration-container');
  if (!formContainer) return;

  const checkScroll = () => {
    const rect = formContainer.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
      formContainer.classList.add('show');
      window.removeEventListener('scroll', checkScroll);
    }
  };

  checkScroll();
  window.addEventListener('scroll', checkScroll);
}

// Настройка валидации формы
function setupFormValidation() {
  const confirmPass = document.getElementById('confirm-password');
  if (!confirmPass) return;

  const validatePasswordMatch = () => {
    const password = document.getElementById('password');
    const group = confirmPass.closest('.form-group');
    const errorMessage = group.querySelector('.error-message');

    confirmPass.setCustomValidity('');
    errorMessage.textContent = '';

    if (!confirmPass.value) {
      group.classList.remove('error');
      return;
    }

    if (password.value !== confirmPass.value) {
      confirmPass.setCustomValidity('Пароли не совпадают');
      group.classList.add('error');
      errorMessage.textContent = 'Пароли не совпадают';
    } else {
      group.classList.remove('error');
    }
  };

  confirmPass.addEventListener('input', validatePasswordMatch);
  confirmPass.addEventListener('blur', validatePasswordMatch);
  document.getElementById('password').addEventListener('input', validatePasswordMatch);
}

// Настройка обработки формы регистрации
function setupRegistrationForm() {
  const registrationForm = document.getElementById('registrationForm');
  if (!registrationForm) return;

  // Установка сообщений об ошибках
  const errorMessages = {
    fullname: "Только буквы, пробелы и дефисы (2-50 символов)",
    email: "Введите корректный email",
    password: "Минимум 8 символов, 1 заглавная, 1 строчная буква и 1 цифра",
    confirmPassword: "Пароли не совпадают"
  };

  document.querySelectorAll('.error-message').forEach((el) => {
    const fieldName = el.closest('.form-group').querySelector('input').name;
    el.textContent = errorMessages[fieldName] || "Ошибка";
  });

  // Обработка отправки формы
  registrationForm.addEventListener('submit', handleFormSubmit);

  // Сброс ошибок при вводе
  registrationForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
      this.closest('.form-group').classList.remove('error');
    });
  });
}

// Обработчик отправки формы
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  let isValid = true;

  // Валидация формы
  form.querySelectorAll('input[required]').forEach(field => {
    if (!field.checkValidity()) {
      field.closest('.form-group').classList.add('error');
      isValid = false;
    }
  });
  if (!isValid) return;

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password);
    
    localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify({
      email: email,
      uid: user.uid
    }));
    localStorage.setItem(STORAGE_KEYS.TEMP_EMAIL, email);
    localStorage.setItem(STORAGE_KEYS.TEMP_PASSWORD, password);
    
    await user.sendEmailVerification();
    showSingleNotification('✓ Письмо с подтверждением отправлено на ваш email');
    
    await firebase.firestore().collection('users').doc(user.uid).set({
      fullname: document.getElementById('fullname').value,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      pendingEmailVerification: true,
      emailVerified: false
    });

    showVerificationScreen(email, user, true);
    
  } catch (error) {
    showRegistrationError(error);
  }
}

function showVerificationScreen(email, user, isNewSubmission) {
  const container = document.querySelector('.registration-container');
  const verificationScreen = document.getElementById('verification-screen');

  if (!container || !verificationScreen) return;

  // 1. Устанавливаем email
  const emailDisplay = verificationScreen.querySelector('.verification-text strong');
  if (emailDisplay) emailDisplay.textContent = email;

  // 2. Ускоренное скрытие других элементов
  Array.from(container.children).forEach(child => {
    if (child.id !== 'verification-screen' && 
        child.id !== 'registration-complete') {
      child.style.transition = 'opacity 0.1s ease';
      child.style.opacity = '0';
      child.style.pointerEvents = 'none';
      setTimeout(() => {
        child.style.display = 'none';
      }, 100);
    }
  });

  // 3. Подготовка к плавному показу
  verificationScreen.style.display = 'block';
  
  // Принудительный reflow перед анимацией
  void verificationScreen.offsetHeight;
  
  // Плавное появление
 setTimeout(() => {
  verificationScreen.style.opacity = '1';
  verificationScreen.style.transform = 'translateY(0)';
}, 300); // Задержка 100 мс перед стартом анимации
  verificationScreen.classList.add('show');

  // 4. Инициализация анимации и обработчиков
  initLottieAnimation();
  setupVerificationHandlers(user);

  // 5. Запускаем проверку верификации каждые 5 секунд
  const checkInterval = setInterval(async () => {
    try {
      await user.reload();
      if (user.emailVerified) {
        clearInterval(checkInterval);
        await completeRegistration(user.uid);
      }
    } catch (error) {
      console.error('Ошибка проверки верификации:', error);
      showSingleNotification('✗ Ошибка проверки статуса email', true);
      clearInterval(checkInterval);
    }
  }, 5000); // Проверка каждые 5 секунд
}

function showSingleNotification(message, isError = false) {
  // Удаляем предыдущие уведомления
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());
  
  // Создаем новое уведомление
  const alert = document.createElement('div');
  alert.className = `custom-alert ${isError ? 'error' : ''}`;
  alert.textContent = message;
  document.body.appendChild(alert);
  
  // Автоматическое скрытие
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function setupVerificationHandlers(user) {
  const resendBtn = document.getElementById('resend-verification');
  
  if (!resendBtn) {
    console.error('Кнопка не найдена');
    return;
  }

  // Создаем элемент для таймера
  const countdownOverlay = document.createElement('div');
  countdownOverlay.className = 'countdown-overlay';
  resendBtn.appendChild(countdownOverlay);

  function startCountdown(seconds = 60) {
    let remaining = seconds;
    resendBtn.disabled = true;
    countdownOverlay.style.display = 'flex';
    countdownOverlay.textContent = remaining;
    
    const interval = setInterval(() => {
      remaining--;
      countdownOverlay.textContent = remaining;
      
      if (remaining <= 0) {
        clearInterval(interval);
        resendBtn.disabled = false;
        countdownOverlay.style.display = 'none';
      }
    }, 1000);
  }

  resendBtn.addEventListener('click', async () => {
    try {
      resendBtn.disabled = true;
      countdownOverlay.textContent = '...';
      countdownOverlay.style.display = 'flex';
      
      await user.sendEmailVerification();
      showSingleNotification('✓ Письмо с подтверждением отправлено!');
      startCountdown();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      resendBtn.disabled = false;
      countdownOverlay.style.display = 'none';
      showSingleNotification('✗ Ошибка: ' + error.message, true);
    }
  });

  // Старт первого таймера
  startCountdown();
}

// Инициализация Lottie анимации
function initLottieAnimation() {
  if (typeof lottie === 'undefined') {
    console.warn('Lottie not loaded, retrying...');
    setTimeout(initLottieAnimation, 100);
    return;
  }

  try {
    lottie.loadAnimation({
      container: document.getElementById('gear-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/lottie/gear-icon.json'
    });
    
    const checkColor = setInterval(() => {
      const paths = document.querySelectorAll('#gear-animation path');
      if (paths.length > 0) {
        paths.forEach(path => {
          path.style.fill = '#e75d00ff';
          path.style.stroke = '#e75d00ff';
        });
        clearInterval(checkColor);
      }
    }, 100);
  } catch (error) {
    console.error('Lottie error:', error);
    showSingleNotification('✗ Ошибка загрузки анимации', true);
  }
}

// Функция завершения регистрации
async function completeRegistration(uid) {
  try {
    // Обновляем статус пользователя
    await firebase.firestore().collection('users').doc(uid).update({
      pendingEmailVerification: false,
      emailVerified: true,
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 2. Показываем экран завершения
    const verificationScreen = document.getElementById('verification-screen');
    const completeScreen = document.getElementById('registration-complete');
    
    if (verificationScreen) verificationScreen.style.display = 'none';
    
    if (completeScreen) {
      completeScreen.style.display = 'block';
      setTimeout(() => {
        completeScreen.style.opacity = '1'; // Плавное появление
      }, 10);
      showSingleNotification('✓ Регистрация успешно завершена!');
    }

    // Очищаем данные
    clearAuthData();

  } catch (error) {
    console.error('Ошибка завершения регистрации:', error);
    showSingleNotification('✗ Ошибка завершения регистрации', true);
  }
}

// Функция очистки данных аутентификации
function clearAuthData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (key !== STORAGE_KEYS.PREFERRED_LANG) {
      localStorage.removeItem(key);
    }
  });
}

// Функции для модального окна обратной связи
function initFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    const closeBtn = document.querySelector('.feedback-close-btn');
    const form = document.getElementById('feedback-form');
    
    if (!modal) {
        console.error('Модальное окно не найдено');
        return;
    }
    
    // ИСПРАВЛЕННЫЙ СЕЛЕКТОР - ищем кнопку с классом footer-button2
    const feedbackButton = document.querySelector('.footer-button2');
    
    // Открытие модального окна
    feedbackButton?.addEventListener('click', function() {
        modal.style.display = 'flex';
        // Блокируем скролл страницы
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        setTimeout(() => modal.classList.add('show'), 10);
    });
    
    // Закрытие модального окна
    closeBtn?.addEventListener('click', closeFeedbackModal);
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeFeedbackModal();
        }
    });
    
    // Обработка отправки формы
    form?.addEventListener('submit', handleFeedbackSubmit);
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.classList.remove('show');
        // Восстанавливаем скролл страницы
        document.body.style.overflow = '';
        setTimeout(() => {
            if (modal) modal.style.display = 'none';
        }, 300);
    }
}

async function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.feedback-submit-btn');
    const email = form.email.value;
    const message = form.message.value;
    
    // Валидация
    if (!email || !message) {
        showSingleNotification('✗ Заполните все поля', true);
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
        // Отправка через EmailJS или Formspree
        await sendFeedbackEmail(email, message);
        
        showSingleNotification('✓ Сообщение отправлено!');
        form.reset();
        closeFeedbackModal();
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
        showSingleNotification('✗ Ошибка отправки', true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
}

// Функция отправки email (Подключаем бесплатный Formspree)
async function sendFeedbackEmail(email, message) {
    const formspreeResponse = await fetch('https://formspree.io/f/mrblwdrb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            message: message,
            _subject: 'Обратная связь с сайта AWL'
        })
    });
    
    if (!formspreeResponse.ok) {
        throw new Error('Ошибка Formspree');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initFeedbackModal();
    setActiveMenuItem();
    handleSearchOnPageLoad(); // Сохраняем функциональность поиска
});

// Обновленная функция определения текущей страницы
function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Левое меню
    const leftMenuItems = document.querySelectorAll('.left-side-block .menu-item');
    leftMenuItems.forEach(item => item.classList.remove('current'));
    
    // Правое меню
    const rightMenuItems = document.querySelectorAll('.right-side-block .menu-item');
    rightMenuItems.forEach(item => item.classList.remove('current'));
    
    // Определяем активные пункты для обоих меню
    switch(currentPage) {
        case 'index.html':
            document.querySelector('.left-side-block .menu-item a[href="index.html"]')?.closest('.menu-item')?.classList.add('current');
            break;
        case 'tournaments.html':
            document.querySelector('.left-side-block .menu-item a[href="tournaments.html"]')?.closest('.menu-item')?.classList.add('current');
            break;
        case 'teams.html':
            document.querySelector('.left-side-block .menu-item a[href="teams.html"]')?.closest('.menu-item')?.classList.add('current');
            break;
        case 'rules.html':
            document.querySelector('.right-side-block .menu-item a[href="rules.html"]')?.closest('.menu-item')?.classList.add('current');
            break;
        case 'registration.html':
            document.querySelector('.right-side-block .menu-item a[href="registration.html"]')?.closest('.menu-item')?.classList.add('current');
            break;
        case 'support.html':
            document.querySelector('.right-side-block .menu-item a[href="support.html"]')?.closest('.menu-item')?.classList.add('current');
            break;
    }
}

// Функция показа модального окна восстановления пароля
function showPasswordRecoveryModal() {
  const modal = document.getElementById('password-recovery-modal');
  if (!modal) return;
  
  modal.style.display = 'flex';
  // Блокируем скролл страницы
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.classList.add('show'), 10);
  
  // Фокусируемся на поле ввода
  setTimeout(() => {
    const emailInput = document.getElementById('recovery-email');
    if (emailInput) emailInput.focus();
  }, 100);
}

// Функция закрытия модального окна восстановления пароля
function closePasswordRecoveryModal() {
  const modal = document.getElementById('password-recovery-modal');
  if (modal) {
    modal.classList.remove('show');
    // Восстанавливаем скролл страницы
    document.body.style.overflow = '';
    setTimeout(() => {
      if (modal) modal.style.display = 'none';
    }, 300);
  }
}

// Обработчик отправки формы восстановления пароля
async function handlePasswordRecoverySubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('recovery-email').value.trim();
  const submitBtn = e.target.querySelector('.feedback-submit-btn');
  
  if (!email) {
    showSingleNotification('✗ Введите email', true);
    return;
  }

  // Базовая проверка формата email
  if (!/\S+@\S+\.\S+/.test(email)) {
    showSingleNotification('✗ Введите корректный email', true);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  
  try {
    // Просто пытаемся отправить письмо восстановления
    await firebase.auth().sendPasswordResetEmail(email);
    
    // Всегда показываем успешное сообщение, даже если email не существует
    // (это стандартная практика для безопасности)
    showSingleNotification('✓ Если email зарегистрирован, письмо с инструкциями будет отправлено');
    closePasswordRecoveryModal();
    
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    
    // Обрабатываем только определенные ошибки
    if (error.code === 'auth/invalid-email') {
      showSingleNotification('✗ Некорректный формат email', true);
    } else if (error.code === 'auth/too-many-requests') {
      showSingleNotification('✗ Слишком много попыток. Попробуйте позже', true);
    } else {
      // Для всех других ошибок (включая user-not-found) показываем общее сообщение
      showSingleNotification('✓ Если email зарегистрирован, письмо с инструкциями будет отправлено');
      closePasswordRecoveryModal();
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить ссылку';
  }
}

// Инициализация модального окна восстановления пароля
function initPasswordRecoveryModal() {
  const modal = document.getElementById('password-recovery-modal');
  const closeBtn = modal?.querySelector('.feedback-close-btn');
  const form = document.getElementById('password-recovery-form');
  
  if (!modal) return;
  
  // Закрытие по крестику
  closeBtn?.addEventListener('click', closePasswordRecoveryModal);
  
  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closePasswordRecoveryModal();
    }
  });
  
  // Обработка отправки формы
  form?.addEventListener('submit', handlePasswordRecoverySubmit);
}

// Поиск - добавьте эти переменные
const searchToggle = document.getElementById('search-toggle');
const searchModal = document.getElementById('search-modal');
const searchClose = document.querySelector('.search-close');
const searchInput = document.getElementById('search-field');
const searchSubmit = document.querySelector('.search-submit');
const searchModalContent = document.querySelector('.search-modal-content');

// Функции для поиска - добавьте эти функции
function openSearchModal() {
    if (!searchModal || !searchToggle) return;
    
    // Получаем позицию кнопки
    const rect = searchToggle.getBoundingClientRect();
    
    // Позиционируем модальное окно рядом с кнопкой
    searchModalContent.style.position = 'absolute';
    searchModalContent.style.top = (rect.top + 50) + 'px';
    searchModalContent.style.left = (rect.left + 350) + 'px';
    
    // Показываем модальное окно
    searchModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        searchModal.classList.add('active');
        searchInput.focus();
        console.log('Search modal activated');
    }, 10);
}

function closeSearchModal() {
    if (!searchModal) return;
    
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        searchModal.style.display = 'none';
        searchInput.value = '';
    }, 300);
}

// Функция выполнения поиска
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    // Проверяем, что запрос не пустой и не слишком короткий
    if (!query || query.length < 3) {
        showSingleNotification('✗ Введите больше символов для поиска', true);
        return;
    }
    
    // Исключаем служебные символы и уведомления
    if (query.startsWith('🔍') || query.startsWith('✓') || query.startsWith('✗')) {
        showSingleNotification('✗ Некорректный поисковый запрос', true);
        return;
    }

    // Закрываем модальное окно
    closeSearchModal();

    // Показываем уведомление о поиске
    showSingleNotification('🔍 Поиск: ' + query);

    // Реализация поиска по сайту
    setTimeout(() => {
        searchOnSite(query);
    }, 500);
}

// Основная функция поиска по сайту
function searchOnSite(query) {
    // Карта страниц сайта с ключевыми словами
    const siteMap = {
        'index.html': {
            keywords: ['главная', 'home', 'турниры', 'расписание', 'баннер', 'maintenance'],
            elements: ['hero-banner', 'horizontal-block', 'maintenance-container']
        },
        'registration.html': {
            keywords: ['регистрация', 'восстановление пароля', 'registration', 'вход', 'login', 'авторизация', 'auth', 'почта', 'email', 'пароль', 'password', 'аккаунт', 'учетная запись'],
            elements: ['registrationForm', 'verification-screen', 'registration-complete', 'fullname', 'email', 'password']
        },
        'rules.html': {
            keywords: ['правила', 'rules', 'условия', 'terms', 'пользовательское соглашение', 'регламент', 'участие'],
            elements: ['rules-content']
        }
    };

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const results = [];

    // Сначала ищем на текущей странице
    const currentPageResults = searchOnCurrentPage(query, currentPage);
    results.push(...currentPageResults);

    // Если на текущей странице ничего не найдено И запрос имеет смысл (не случайный набор символов)
    if (results.length === 0 && isMeaningfulQuery(query)) {
        // Тогда ищем на других страницах по ключевым словам
        for (const [page, pageData] of Object.entries(siteMap)) {
            if (page !== currentPage) {
                const pageResults = searchOnOtherPage(query, page, pageData);
                results.push(...pageResults);
            }
        }
    }

    // Обрабатываем результаты
    if (results.length > 0) {
        processSearchResults(results, query);
    } else {
        showSingleNotification('✗ Ничего не найдено по запросу: "' + query + '"', true);
    }
}

// Функция проверки, является ли запрос осмысленным
function isMeaningfulQuery(query) {
    // Исключаем случайные наборы символов
    const randomPatterns = [
        /^[а-я]{3,}$/i, // Только русские буквы
        /^[a-z]{3,}$/i, // Только английские буквы
        /^[0-9]{3,}$/,  // Только цифры
        /^[а-яa-z0-9\s]{3,}$/i // Смешанный содержательный текст
    ];
    
    // Проверяем, соответствует ли запрос хотя бы одному шаблону
    return randomPatterns.some(pattern => pattern.test(query));
}
// Поиск на текущей странице
function searchOnCurrentPage(query, currentPage) {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div:not([class*="modal"]):not([id*="modal"]):not([class*="alert"]):not([class*="notification"]), label, button, a');
    
    const results = [];
    const processedTexts = new Set(); // Отслеживаем уникальные тексты
    const processedBlocks = new Set();

    textElements.forEach(element => {
        // Пропускаем элементы уведомлений и поисковых результатов
        if (element.closest('.custom-alert') || 
            element.closest('.search-results-container') ||
            element.closest('.search-modal') ||
            element.classList.contains('search-result-text') ||
            element.classList.contains('search-result-title')) {
            return;
        }

        const text = element.textContent.toLowerCase().trim();
        const cleanText = text.replace(/[^\wа-яё\s]/gi, '').trim(); // Очищаем от спецсимволов
        if (text.includes(query.toLowerCase()) && text.length > 2 && !text.startsWith('🔍') && !text.startsWith('✓') && !text.startsWith('✗')) {
            const scrollTarget = findScrollableParent(element);
            const parentBlock = findSignificantParent(element);
            const blockId = getBlockIdentifier(parentBlock);

            // Пропускаем дубликаты текста
            if (processedTexts.has(cleanText)) {
                return;
            }

            if (!processedBlocks.has(blockId)) {
                processedBlocks.add(blockId);
                processedTexts.add(cleanText);

                results.push({
                    type: 'current',
                    element: element,
                    scrollTarget: scrollTarget,
                    text: text,
                    relevance: calculateRelevance(text, query),
                    page: currentPage,
                    blockId: blockId
                });
            }
        }
    });

    return results;
}

// Поиск на других страницах
function searchOnOtherPage(query, page, pageData) {
    const results = [];
    
    // Проверяем совпадение по ключевым словам страницы
    const keywordMatch = pageData.keywords.some(keyword => 
        query.includes(keyword.toLowerCase())
    );

    if (keywordMatch) {
        results.push({
            type: 'other',
            page: page,
            query: query,
            relevance: 80, // Высокая релевантность для страниц по ключевым словам
            title: getPageTitle(page),
            description: getPageDescription(page, query)
        });
    }

    return results;
}

// Получение заголовка страницы
function getPageTitle(page) {
    const titles = {
        'index.html': 'Главная страница',
        'registration.html': 'Регистрация и вход',
        'rules.html': 'Правила турнира'
    };
    return titles[page] || page;
}

// Получение описания страницы
function getPageDescription(page, query) {
    const descriptions = {
        'index.html': 'Информация о текущих ивентах лиги',
        'registration.html': 'Регистрация аккаунта, вход в систему и восстановление пароля',
        'rules.html': 'Правила и условия участия в турнирах Arena Warborn League'
    };
    
    return descriptions[page] || `Страница содержит информацию о "${query}"`;
}

// Обновленная функция создания элемента результата
function createResultItem(result, index) {
    const item = document.createElement('div');
    item.className = 'search-result-item';

    if (result.type === 'current') {
        // Результат на текущей странице
        const previewText = result.text.length > 100 
            ? result.text.substring(0, 100) + '...' 
            : result.text;

        item.innerHTML = `
            <div class="search-result-title">
                📍 Результат ${index + 1} (текущая страница)
            </div>
            <div class="search-result-text">
                ${highlightText(previewText, searchInput.value.trim())}
            </div>
        `;

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            result.scrollTarget.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            highlightElement(result.scrollTarget);
        });

    } else {
        // Результат на другой странице
        item.innerHTML = `
            <div class="search-result-title">
                🔗 ${result.title}
            </div>
            <div class="search-result-text">
                ${result.description}
            </div>
            <div class="search-result-meta">
                <small>Перейти к странице →</small>
            </div>
        `;

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateToPage(result.page, result.query);
        });
    }

    return item;
}

// Функция перехода на другую страницу
function navigateToPage(page, query) {
    // Сохраняем поисковый запрос для highlight'а на целевой странице
    sessionStorage.setItem('searchQuery', query);
    sessionStorage.setItem('searchTimestamp', Date.now().toString());
    
    // Переходим на страницу
    window.location.href = page;
}

// Функция для обработки поиска при загрузке страницы
function handleSearchOnPageLoad() {
    const searchQuery = sessionStorage.getItem('searchQuery');
    const searchTimestamp = sessionStorage.getItem('searchTimestamp');
    
    if (searchQuery && searchTimestamp) {
        // Проверяем, что поиск был выполнен не более 5 секунд назад
        const timeDiff = Date.now() - parseInt(searchTimestamp);
        if (timeDiff < 5000) {
            // Очищаем stored данные
            sessionStorage.removeItem('searchQuery');
            sessionStorage.removeItem('searchTimestamp');
            
            // Выполняем поиск и highlight на текущей странице
            setTimeout(() => {
                highlightSearchResults(searchQuery);
            }, 1000);
        }
    }
}

// Highlight результатов на загруженной странице
function highlightSearchResults(query) {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, label, button, a');
    let found = false;
    
    textElements.forEach(element => {
        if (found) return; // Пропускаем остальные элементы, если уже нашли
        
        const text = element.textContent.toLowerCase().trim();
        if (text.includes(query.toLowerCase())) {
            const scrollTarget = findScrollableParent(element);
            scrollTarget.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            highlightElement(scrollTarget);
            found = true; // Устанавливаем флаг, что нашли элемент
        }
    });
}

// Обновленная функция processSearchResults
function processSearchResults(results, query) {
    // Сортируем по релевантности (сначала текущая страница, потом другие)
    results.sort((a, b) => {
        if (a.type === 'current' && b.type !== 'current') return -1;
        if (a.type !== 'current' && b.type === 'current') return 1;
        return b.relevance - a.relevance;
    });

    // Убираем дубликаты по тексту
    const uniqueResults = [];
    const seenTexts = new Set();
    
    results.forEach(result => {
        if (!seenTexts.has(result.text)) {
            seenTexts.add(result.text);
            uniqueResults.push(result);
        }
    });

    showSingleNotification(`✓ Найдено ${results.length} результатов по запросу: "${query}"`);

    const existingContainer = document.querySelector('.search-results-container');
    if (existingContainer) existingContainer.remove();

    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results-container';

    const title = document.createElement('h3');
    title.textContent = `Результаты поиска: "${query}"`;
    title.className = 'search-results-count';
    resultsContainer.appendChild(title);

    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'search-no-results';
        noResults.textContent = 'Ничего не найдено';
        resultsContainer.appendChild(noResults);
    } else {
        results.slice(0, 15).forEach((result, index) => {
            const resultItem = createResultItem(result, index);
            resultsContainer.appendChild(resultItem);
        });
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.className = 'search-result-close';
    closeButton.onclick = (e) => {
        e.stopPropagation();
        resultsContainer.remove();
    };
    resultsContainer.appendChild(closeButton);

    document.body.appendChild(resultsContainer);
}

// Вспомогательные функции для поиска
function findScrollableParent(element) {
    let current = element;
    while (current) {
        const style = getComputedStyle(current);
        if (style.overflowY !== 'visible' || style.overflowY !== 'hidden') {
            return current;
        }
        current = current.parentElement;
    }
    return document.documentElement;
}

function findSignificantParent(element) {
    const significantSelectors = [
        'section', 'article', 'main', 'aside', 'nav', 
        '.card', '.block', '.container', '.content', 
        '[class*="section"]', '[class*="block"]'
    ];
    
    let current = element;
    while (current) {
        if (significantSelectors.some(selector => current.matches(selector))) {
            return current;
        }
        current = current.parentElement;
    }
    return element;
}

function getBlockIdentifier(element) {
    return element.id || Array.from(element.classList).join('-') || element.tagName;
}

function calculateRelevance(text, query) {
    let relevance = 0;
    
    // Точное совпадение
    if (text === query) relevance += 100;
    
    // Начинается с запроса
    if (text.startsWith(query)) relevance += 80;
    
    // Содержит запрос
    if (text.includes(query)) relevance += 60;
    
    // Количество вхождений
    const occurrences = (text.split(query).length - 1);
    relevance += occurrences * 10;
    
    // Приоритет для заголовков
    const element = this.element || {};
    if (element.tagName && element.tagName.match(/^H[1-6]$/i)) {
        relevance += 50;
    }
    
    // Приоритет для более короткого текста (более релевантного)
    if (text.length < 100) relevance += 20;
    
    return relevance;
}

function highlightText(text, query) {
    if (!query) return escapeHtml(text);
    
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightElement(element) {
    element.classList.add('search-highlight');
    setTimeout(() => {
        element.classList.remove('search-highlight');
    }, 2000);
}

// Инициализация поиска
function initSearch() {
    if (!searchToggle || !searchModal) return;
    
    // Открытие модального окна поиска
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openSearchModal();
    });
    
    // Закрытие модального окна поиска
    searchClose?.addEventListener('click', closeSearchModal);
    
    // Закрытие по клику вне области
    searchModal?.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            closeSearchModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal?.classList.contains('active')) {
            closeSearchModal();
        }
    });
    
    // Обработка отправки формы поиска
    searchSubmit?.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    searchInput?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

// Добавьте инициализацию в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initSearch();
  initFeedbackModal();
  initPasswordRecoveryModal(); // Добавьте эту строку
  initSearchModal();
});

// Функция показа ошибок регистрации
async function showRegistrationError(error) {
  console.error('Ошибка регистрации:', error);

  const errorMessages = {
    'auth/email-already-in-use': '✗ Этот email уже зарегистрирован',
    'auth/weak-password': '✗ Пароль слишком простой (минимум 8 символов, 1 заглавная буква и 1 цифра)',
    'auth/invalid-email': '✗ Некорректный email',
    'auth/operation-not-allowed': '✗ Регистрация по email временно недоступна',
    'auth/network-request-failed': '✗ Ошибка сети. Проверьте подключение'
  };

  showSingleNotification(errorMessages[error.code] || `✗ Ошибка: ${error.message || 'неизвестная ошибка'}`, true);
}