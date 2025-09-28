// utils/language.js
// Перевод страницы регистрации
export const translations = {
  ru: {
    registration_title: "Регистрация",
    fullname_label: "Имя*",
    fullname_placeholder: "Имя и фамилия через пробел",
    email_label: "Email*",
    email_placeholder: "Введите вашу почту",
    password_label: "Пароль*",
    password_placeholder: "Не менее 8 символов",
    confirm_password_label: "Подтверждение пароля*",
    confirm_password_placeholder: "Повтор пароля",
    already_account: "Уже есть аккаунт?",
    login_link: "Войти",
    login_title: "Авторизация",
    no_account: "Нет аккаунта?",
    register_link: "Назад",
    verify_email_title: "Подтвердите Email",
    verify_email_text: "Мы отправили письмо на",
    resend_verification: "Отправить повторно",
    verify_email_hint: "Не получили письмо? Проверьте папку 'Спам' или попробуйте отправить повторно.",
    registration_complete_title: "Регистрация завершена!",
    welcome_text: "Добро пожаловать в киберспорт. Не забудь ознакомиться с нашими",
    rules_link: "правилами",
    wish_text: "пользования ресурса. Желаем тебе успехов!",
    main_page_link: "Главная",
    password_recovery_title: "Восстановление пароля",
    recovery_email_label: "Email*",
    password_recovery_placeholder: "Введите ваш email",
    recovery_send_button: "Отправить ссылку",
    recovery_loading: 'Отправка...',

    // Модалка поиска
    search_placeholder: "Поиск по сайту...",
    search_button: "Поиск",

    search_pages: {
      home: "Главная",
      home_description: "Главная страница с информацией о лиге и предстоящих событиях с новостями",
      tournaments: "Турниры",
      tournaments_description: "Раздел с информацией о текущих и предстоящих турнирах",
      teams: "Команды",
      teams_description: "Информация о командах и игроках лиги",
      rating: "Рейтинг",
      rating_description: "Рейтинг игроков и команд",
      profile: "Профиль",
      profile_description: "Личный кабинет игрока",
      transfers: "Трансферы",
      transfers_description: "Информация о трансферах игроков между командами",
      registration: "Регистрация",
      registration_description: "Регистрация новых пользователей"
    },
    search_errors: {
      min_length: "✗ Введите минимум 3 символа для поиска",
      not_found: '✗ Ничего не найдено по запросу: "{query}"',
      general: "✗ Произошла ошибка при поиске"
    },
    search_success: {
      found: '✓ Найдено {count} результатов по запросу: "{query}"'
    },
    search_results: {
      count: "Результаты поиска: {count}",
      current_page: "Найдено на текущей странице",
      go_to_section: "Перейти в раздел"
    },

    // HEADER RU
    join_us_text: "Присоединяйтесь к нам:",
    home_link: "Главная",
    tournaments_link: "Турниры", 
    teams_link: "Команды",
    transfers_link: "Трансферы",
    rating_link: "Рейтинг",
    login_button: "Войти",
    verify_email_button: "Подтвердить email",
    logout_button: "Выйти",
    loading_text: "Загрузка...",
    not_authenticated_text: "Не авторизован",
    sending_button: "Отправка...",

    // Footer translations
    footer_description: " — это новая профессиональная киберспортивная лига, учрежденная с целью развития и структурирования соревновательной экосистемы в современных дисциплинах киберспорта",
    rights_reserved: "Все права защищены.",
    tournament_rules: "Правила турниров",
    privacy_policy: "Политика конфиденциальности",
    terms_of_use: "Условия использования",
    feedback_section_title: "Обратная связь",
    feedback_text1: "Обратная связь помогает нам становиться лучше.",
    feedback_text2: "Будем рады любым вопросам и предложениям.",
    feedback_text3: "Обработка запроса в течение",
    feedback_text3_part2: "24 часов.",

    // FeedbackModal translations
    feedback_modal_title: "Обратная связь",
    feedback_email_label: "Ваш Email*",
    feedback_email_placeholder: "Почта, на которую вам придет ответ",
    feedback_message_label: "Ваше обращение*", 
    feedback_message_placeholder: "Опишите вопрос или предложение...",
    send_button: "Отправить",
    sending_button: "Отправка...",
    
    // Ошибки валидации
    errors: {
      fullname_required: 'Имя обязательно для заполнения',
      fullname_format: 'Введите имя и фамилию через пробел (например: Иван Петров)',
      fullname_length: 'Имя должно быть от 5 до 30 символов',
      email_required: 'Email обязателен для заполнения',
      email_invalid: 'Введите корректный email адрес',
      password_required: 'Пароль обязателен для заполнения',
      password_length: 'Пароль должен содержать минимум 8 символов',
      password_complexity: 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру',
      confirm_password_required: 'Подтверждение пароля обязательно',
      passwords_mismatch: 'Пароли не совпадают',
      message_required: 'Сообщение обязательно для заполнения',
      message_too_short: 'Сообщение должно содержать минимум 10 символов',
      message_too_long: 'Сообщение не должно превышать 1000 символов',
      fill_all_fields: 'Заполните все поля правильно',
      feedback_success: 'Сообщение отправлено!',
      feedback_error: 'Ошибка отправки'
    },
    
    // Ошибки Firebase
    firebase_errors: {
      'auth/email-already-in-use': 'Этот email уже зарегистрирован',
      'auth/weak-password': 'Пароль слишком простой',
      'auth/invalid-email': 'Некорректный email',
      'auth/operation-not-allowed': 'Регистрация временно недоступна',
      'auth/network-request-failed': 'Ошибка сети. Проверьте подключение',
      'auth/missing-password': 'Пароль обязателен для заполнения',
      'auth/missing-email': 'Email обязателен для заполнения',
      'auth/invalid-login-credentials': 'Неверный email или пароль',
      'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
      'auth/user-disabled': 'Аккаунт заблокирован',
      'auth/user-not-found': 'Пользователь не найден'
    },
    // Уведомления
    notifications: {
      auth_already: 'Вы уже авторизованы как',
      verification_sent: 'Письмо с подтверждением отправлено на ваш email',
      email_verified: 'Email успешно подтвержден!',
      login_success: 'Вход выполнен успешно',
      recovery_instructions: 'Если email зарегистрирован, письмо с инструкциями будет отправлено',
      resend_success: 'Письмо с подтверждением отправлено!',
      resend_error: 'Ошибка:',
      feedback_success: 'Сообщение отправлено!',
      feedback_error: 'Ошибка отправки',
      logout_success: "Вы успешно вышли из системы",
      logout_error: "Ошибка при выходе из системы"
    }
  },

  en: {
    registration_title: "Registration",
    fullname_label: "Full Name*",
    fullname_placeholder: "First and last name with space",
    email_label: "Email*",
    email_placeholder: "Enter your email",
    password_label: "Password*",
    password_placeholder: "At least 8 characters",
    confirm_password_label: "Confirm Password*",
    confirm_password_placeholder: "Repeat password",
    already_account: "Already have an account?",
    login_link: "Login",
    login_title: "Authorization",
    no_account: "No account?",
    register_link: "Back",
    verify_email_title: "Confirm your Email",
    verify_email_text: "We sent an email to",
    resend_verification: "Resend",
    verify_email_hint: "Didn't receive the email? Check your Spam folder or try to resend.",
    registration_complete_title: "Registration Complete!",
    welcome_text: "Welcome to esports. Don't forget to check out our",
    rules_link: "rules",
    wish_text: "of using the resource. We wish you success!",
    main_page_link: "Home",
    password_recovery_title: "Password Recovery",
    recovery_email_label: "Email*",
    password_recovery_placeholder: "Enter your email",
    recovery_send_button: "Send Link",
    recovery_loading: 'Sending...',

    // Модалка поиска EN
    search_placeholder: "Search the site...",
    search_button: "Search",

    search_pages: {
      home: "Home",
      home_description: "Home page with information about the league, upcoming events and news",
      tournaments: "Tournaments",
      tournaments_description: "Section with information about current and upcoming tournaments",
      teams: "Teams",
      teams_description: "Information about teams and league players",
      rating: "Rating",
      rating_description: "Player and team ratings",
      profile: "Profile",
      profile_description: "Player personal account",
      transfers: "Transfers",
      transfers_description: "Information about player transfers between teams",
      registration: "Registration",
      registration_description: "Registration new users"
    },
    search_errors: {
      min_length: "✗ Enter at least 3 characters for search",
      not_found: '✗ Nothing found for query: "{query}"',
      general: "✗ An error occurred during search"
    },
    search_success: {
      found: '✓ Found {count} results for query: "{query}"'
    },
    search_results: {
      count: "Search results: {count}",
      current_page: "Found on current page",
      go_to_section: "Go to section"
    },

    // HEADER EN
    join_us_text: "Join us:",
    home_link: "Home",
    tournaments_link: "Tournaments",
    teams_link: "Teams", 
    transfers_link: "Transfers",
    rating_link: "Rating",
    login_button: "Login",
    verify_email_button: "Verify email", 
    logout_button: "Logout",
    loading_text: "Loading...",
    not_authenticated_text: "Not authenticated",
    sending_button: "Sending...",

    // Footer translations
    footer_description: " is a new professional esports league established to develop and structure the competitive ecosystem in modern esports disciplines",
    rights_reserved: "All rights reserved.",
    tournament_rules: "Tournament Rules",
    privacy_policy: "Privacy Policy",
    terms_of_use: "Terms of Use",
    feedback_section_title: "Feedback",
    feedback_text1: "Feedback helps us improve.",
    feedback_text2: "We welcome any questions and suggestions.",
    feedback_text3: "Request processing within",
    feedback_text3_part2: "24 hours.",

    // FeedbackModal translations
    feedback_modal_title: "Feedback",
    feedback_email_label: "Your Email*",
    feedback_email_placeholder: "Email where you will receive response",
    feedback_message_label: "Your Message*",
    feedback_message_placeholder: "Describe your question or suggestion...",
    send_button: "Send",
    sending_button: "Sending...",
    
    // Validation errors
    errors: {
      fullname_required: 'Full name is required',
      fullname_format: 'Enter first and last name separated by space (e.g., John Smith)',
      fullname_length: 'Name must be between 5 and 30 characters',
      email_required: 'Email is required',
      email_invalid: 'Please enter a valid email address',
      password_required: 'Password is required',
      password_length: 'Password must contain at least 8 characters',
      password_complexity: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
      confirm_password_required: 'Password confirmation is required',
      passwords_mismatch: 'Passwords do not match',
      message_required: 'Message is required',
      message_too_short: 'Message must contain at least 10 characters',
      message_too_long: 'Message must not exceed 1000 characters',
      fill_all_fields: 'Please fill all fields correctly',
      feedback_success: 'Message sent successfully!',
      feedback_error: 'Sending error'
    },
    
    // Firebase errors
    firebase_errors: {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/weak-password': 'Password is too weak',
      'auth/invalid-email': 'Invalid email',
      'auth/operation-not-allowed': 'Registration is temporarily unavailable',
      'auth/network-request-failed': 'Network error. Check your connection',
      'auth/missing-password': 'Password is required',
      'auth/missing-email': 'Email is required',
      'auth/invalid-login-credentials': 'Invalid email or password',
      'auth/too-many-requests': 'Too many attempts. Try again later',
      'auth/user-disabled': 'Account is disabled',
      'auth/user-not-found': 'User not found'
    },
    // Notifications
    notifications: {
      auth_already: 'You are already logged in as',
      verification_sent: 'Verification email sent to your email',
      email_verified: 'Email successfully verified!',
      login_success: 'Login successful',
      recovery_instructions: 'If the email is registered, instructions will be sent',
      resend_success: 'Verification email sent!',
      resend_error: 'Error:',
      feedback_success: 'Message sent successfully!',
      feedback_error: 'Sending error',
      logout_success: "You have successfully logged out",
      logout_error: "Logout error"
    }
  }
};