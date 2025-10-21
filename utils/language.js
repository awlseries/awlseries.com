// utils/language.js
// Перевод страницы регистрации
export const translations = {
  ru: {

    // СТРАНИЦА MBM
    mobile_block_title: "Доступно только на компьютерах",
    mobile_block_description: "Мобильная версия сайта в разработке. Для полного доступа к функциям Arena Warborn League используйте ноутбук или компьютер.",
    mobile_block_footer: "Arena Warborn League 2025. Все права защищены.",

    // СТРАНИЦА RESET PASSWORD
  reset_password_title: "Сброс пароля",
  new_password_label: "Новый пароль* ",
  new_password_placeholder: "Введите новый пароль",
  confirm_new_password_label: "Подтвердите пароль*",
  confirm_new_password_placeholder: "Повторите новый пароль",
  password_updated: "Пароль успешно обновлен!",
  use_reset_link: '✗ Доступ запрещен, используйте ссылку из письма для сброса пароля',
  session_expired: '✗ Сессия истекла или недействительна',

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
    email_already_exists: 'Пользователь с таким email уже существует',
    email_rate_limit: "Превышен лимит отправки писем. Пожалуйста, попробуйте позже.",

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

    // ШАПКА RU
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

    // КОМПОНЕНТ Footer
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

    // КОМПОНЕНТ FeedbackModal
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
    
    // Ошибки supabase
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
      'auth/user-not-found': 'Пользователь не найден',
      'auth/wrong-password': 'Некорректный email/пароль'
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
    },

    // СТРАНИЦА ПРОФИЛЯ
    stats: {
      notAvailable: "Н/д",
      kdRatio: "У/С",
      winRate: "% Побед", 
      playTime: "Время в игре",
      favoriteWeapon: "Любимое оружие",
      wins: "Побед",
      losses: "Поражений",
      inDevelopment: "В разработке"
    },

    // СТРАНИЦА ТРАНСФЕРОВ
    freeAgents: 'Свободные агенты',
    freeAgentsDescription: 'Найдите игроков без команды, которые находятся в поиске напарников для участия в турнирах. Наша платформа помогает собрать сильную команду и начать путь к победе в турнирах.',
    freeAgentsCount: 'свободных агентов',
    searchPartners: 'поиск напарников',
    formedTeams: 'сформированных команд',
    allPlayers: 'Все игроки',
    data: 'Данные',
    class: 'Класс',
    nickname: 'Никнейм',
    kd: 'У/С',
    playTime: 'Время в игре',
    details: 'Подробнее',
    loading: 'Загрузка игроков...',
    playerInfo: 'Информация об игроке',

    // СТРАНИЦА КОМАНД
    teams: {
    free_slot: "Свободный слот", 
  division_1_rank: "Дивизион I ранга",
  division_2_rank: "Дивизион II ранга", 
  division_3_rank: "Дивизион III ранга", 
  division_system_title: "СИСТЕМА ДИВИЗИОНОВ AWL SERIES S1",
  division_system_description: "Продемонстрируйте свои навыки в лучшем соревновательном опыте из популярных режимов Battlefield. Поднимайтесь по рангам, получайте престижные награды и создайте свое наследие в интернациональной соревновательной системе Arena Warborn League.",
  rating_structure_title: "СТРУКТУРА РЕЙТИНГА И НАГРАД", 
  rating_structure_description: "Наша соревновательная система создана для признания и вознаграждения мастерства, преданности и стратегического превосходства. Зарабатывайте очки TMMR (Team Match Making Rating) через соревновательные матчи, серии турниров и открытых кубков. Поднимайтесь по дивизионам и открывайте эксклюзивные боевые достижения AWL. Каждый сезон приносит новые вызовы и престижные награды для лучших команд и MVP.",
  
  // СТРАНИЦА КОМАНД Награды
  sponsor_contracts: "СПОНСОРСКИЕ КОНТРАКТЫ", 
  contracts_with_organizations: "Контракты с игровыми организациями",
  equipment_sponsorship: "Спонсорство оборудования и экипировки",
  media_contracts: "Медийные контракты и стриминговые сделки",
  exclusive_partnerships: "Эксклюзивные партнерства с лигой",
  
  combat_rewards: "БОЕВЫЕ НАГРАДЫ", 
  prize_funds: "Призовые фонды до $1,000 за сезон на старте лиги",
  unique_medals: "Уникальные медали за победы в сезонах",
  seasonal_tokens: "Сезонные жетоны за каждое участие",
  profile_badges: "Знаки отличия для профиля игрока",
  invite_bonuses: "Бонусы за приглашение напарников",
  guaranteed_prizes: "Гарантированные призы за первенство в команде и соло",
  
  privileged_quotas: "ПРИВИЛЕГИРОВАННЫЕ КВОТЫ",
  automatic_qualification: "Автоматическая квалификация в Majors",
  priority_slots: "Приоритетные слоты в больших турнирах",
  exclusive_access: "Эксклюзивный доступ к закрытым событиям",
  championship_quotas: "Квоты на серию чемпионатов лиги",
  
  career_growth: "КАРЬЕРНЫЙ РОСТ",
  scout_programs: "Участие в скаутских программах",
  training_sessions: "Доступ к тренировочным сессиям",
  professional_mentorship: "Менторство от профессиональных игроков",
  streaming_opportunities: "Возможности для стриминговой карьеры",
  
  // СТРАНИЦА КОМАНД Статистика
  tmmr: "TMMR", 
  teams: "Команды", 
  new_teams: "Новые составы (30д)", 
  expand: "Развернуть",
  view_team: "Просмотр команды",
  
  // СТРАНИЦА КОМАНД Будущие возможности
  future_opportunities_title: "БУДУЩИЕ СОРЕВНОВАТЕЛЬНЫЕ ВОЗМОЖНОСТИ",
  future_features_icon: "Иконка будущих возможностей", 
  seasonal_tournaments: "Сезонные крупные турниры:", 
  seasonal_tournaments_desc: "Ежеквартальные чемпионские события с увеличенными призовыми фондами и специальными наградами",
  global_leaderboards: "Глобальные таблицы лидеров:",
  global_leaderboards_desc: "Рейтинги в реальном времени с региональными и мировыми позициями",
  captain_announcements: "Система объявлений от капитанов",
  captain_announcements_desc: "Поиски тиммейтов в новым команды внутри лиги качественно упростится",
  practice_matches: "Поиск тренировочных матчей:",
  practice_matches_desc: "Автоматизированная система для поиска тренировочных игр против соперников равного уровня",
  payment_system: "Система оплаты в валюте и криптовалюте:", 
  payment_system_desc: "Внедрение сервисов для платежей по всему миру",
  integrated_streams: "Интегрированные трансляции:",
  integrated_streams_desc: "Транслирование матчей игроков напрямую на платформы AWL с оверлеями"
  }
  },

  en: {

    // PAGE MOBILE BLOCK
    mobile_block_title: "Available only on computers",
    mobile_block_description: "Mobile version is under development. For full access to Arena Warborn League features, please use a laptop or computer.",
    mobile_block_footer: "Arena Warborn League 2025. All rights reserved.",

    // PAGE RESET PASSWORD
  reset_password_title: "Reset Password",
  new_password_label: "New Password* ", 
  new_password_placeholder: "Enter new password",
  confirm_new_password_label: "Confirm Password*",
  confirm_new_password_placeholder: "Repeat new password",
  password_updated: "Password successfully updated!",
  use_reset_link: 'Access Denied, use the link from the email to reset your password',
  session_expired: '✗ The session has expired or is invalid',

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
    email_already_exists: 'User with this email already exists',
    email_rate_limit: "Email rate limit exceeded. Please try again later.",

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
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Invalid email/password'
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
    },

    // PROFILE PAGE
    stats: {
      notAvailable: "N/a",
  kdRatio: "K/D Ratio",
  winRate: "Win Rate", 
  playTime: "Play Time",
  favoriteWeapon: "Favorite Weapon",
  wins: "Wins",
  losses: "Loses",
  inDevelopment: "In Development"
    },

    // TRANSFERS PAGE
    freeAgents: 'Free Agents',
    freeAgentsDescription: 'Find players without a team who are looking for partners to participate in tournaments. Our platform helps build a strong team and start the path to victory in tournaments.',
    freeAgentsCount: 'free agents',
    searchPartners: 'search partners',
    formedTeams: 'formed teams',
    allPlayers: 'All Players',
    data: 'Data',
    class: 'Class',
    nickname: 'Nickname',
    kd: 'K/D',
    playTime: 'Play Time',
    details: 'Details',
    loading: 'Loading players...',
    playerInfo: 'Player information',
  
  // TEAMS PAGE
    teams: {
      free_slot: "Free slot", 
      division_1_rank: "Division I rank",
      division_2_rank: "Division II rank", 
      division_3_rank: "Division III rank", 
      division_system_title: "AWL SERIES S1 DIVISION SYSTEM",
      division_system_description: "Showcase your skills in the best competitive experience from popular Battlefield modes. Rise through the ranks, earn prestigious rewards and build your legacy in the international competitive system of Arena Warborn League.",
      rating_structure_title: "RATING STRUCTURE AND REWARDS", 
      rating_structure_description: "Our competitive system is designed to recognize and reward mastery, dedication and strategic excellence. Earn TMMR (Team Match Making Rating) points through competitive matches, tournament series and open cups. Rise through divisions and unlock exclusive AWL combat achievements. Each season brings new challenges and prestigious rewards for the best teams and MVPs.",
      
      // TEAMS PAGE Rewards
      sponsor_contracts: "SPONSOR CONTRACTS", 
      contracts_with_organizations: "Contracts with gaming organizations",
      equipment_sponsorship: "Equipment and gear sponsorship",
      media_contracts: "Media contracts and streaming deals",
      exclusive_partnerships: "Exclusive partnerships with the league",
      
      combat_rewards: "COMBAT REWARDS", 
      prize_funds: "Prize pools up to $1,000 per season at league start",
      unique_medals: "Unique medals for season victories",
      seasonal_tokens: "Seasonal tokens for each participation",
      profile_badges: "Distinction badges for player profile",
      invite_bonuses: "Bonuses for inviting teammates",
      guaranteed_prizes: "Guaranteed prizes for team and solo leadership",
      
      privileged_quotas: "PRIVILEGED QUOTAS",
      automatic_qualification: "Automatic qualification to Majors",
      priority_slots: "Priority slots in major tournaments",
      exclusive_access: "Exclusive access to closed events",
      championship_quotas: "Quotas for league championship series",
      
      career_growth: "CAREER GROWTH",
      scout_programs: "Participation in scout programs",
      training_sessions: "Access to training sessions",
      professional_mentorship: "Mentorship from professional players",
      streaming_opportunities: "Opportunities for streaming career",
      
      // TEAMS PAGE Statistics
      tmmr: "TMMR", 
      teams: "Teams", 
      new_teams: "New teams (30d)", 
      expand: "Expand",
      view_team: "View team",
      
      // TEAMS PAGE Future opportunities
      future_opportunities_title: "FUTURE COMPETITIVE OPPORTUNITIES",
      future_features_icon: "Future features icon", 
      seasonal_tournaments: "Seasonal major tournaments:", 
      seasonal_tournaments_desc: "Quarterly championship events with increased prize pools and special rewards",
      global_leaderboards: "Global leaderboards:",
      global_leaderboards_desc: "Real-time rankings with regional and world positions",
      captain_announcements: "Captain announcement system",
      captain_announcements_desc: "Searching for teammates for new teams within the league will be significantly simplified",
      practice_matches: "Practice match search:",
      practice_matches_desc: "Automated system for finding practice games against opponents of equal level",
      payment_system: "Currency and cryptocurrency payment system:", 
      payment_system_desc: "Implementation of payment services worldwide",
      integrated_streams: "Integrated streams:",
      integrated_streams_desc: "Broadcasting player matches directly to AWL platforms with overlays"
    }
}};