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
  change_password_button: "Смена пароля",
  error_invalid_access_message: "Для смены пароля требуется авторизация",
  session_expired: '✗ Сессия истекла или недействительна',

  // СТРАНИЦА ПОДТВЕРЖДЕНИЯ EMAIL
  verification_success: {
    title: "Почта подтверждена!",
    welcome_text: "Возвращайся на страницу регистрации",
    close_window: "Закрыть",
    invalid_access: "Доступ закрыт",
    invalid_access_message: "Эта страница доступна только через ссылки подтверждения email.",
    invalid_verification_link: '✗ Неверная ссылка подтверждения'
  },

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
      authorization_required: "✗ Для доступа к профилю требуется авторизация",
      logout_error: "Ошибка при выходе из системы",
      authorizationRequired: "✗ Требуется авторизация",
      profileLoadError: "✗ Ошибка загрузки профиля",
      profileNotFound: "✗ Профиль не найден",
      userNotAuthenticated: "✗ Пользователь не авторизован",
      signOutSuccess: "✗ Вы вышли из системы",
      emailNotVerified: "✗ Подтвердите email для доступа к профилю",
      classChanged: "✓ Класс изменен на {className}",
      classChangeError: "✗ Ошибка сохранения класса",
      deleteAccountSuccess: "✓ Аккаунт успешно удален",
      deleteAccountError: "✗ Ошибка удаления аккаунта"
    },

    // СТРАНИЦА ТРАНСФЕРОВ
    last_news_title: 'Последние новости',
    current_tournaments_title: 'Текущие турниры',
    technical_works_title: 'Технические работы',
    details_back_button: 'Свернуть',
    details_button: 'Детали',

    // ------------------------------------ СТРАНИЦА ПРОФИЛЯ --------------------------------------
    // Блок профиля "Игрок" (Статистика)
    stats: {
      notAvailable: "Н/д",
      kdRatio: "У/С",
      winRate: "% Побед", 
      playTime: "Время в игре",
      favoriteWeapon: "Любимое оружие",
      wins: "Побед",
      losses: "Поражений",
      inDevelopment: "В разработке",
      title: "Статистика",
      loadingStats: "Загрузка статистики...",
      noPublicStats: "Игрок еще не добавил статистику",
      noStats: {
        message1: "Загрузите скриншот",
        message1_2: "игровой статистики с ресурса",
        message2: "Система автоматически определит необходимые данные.",
        message3: "Никнейм, указанный в профиле и на скриншоте, должны быть идентичными.",
        uploadButton: "Загрузить данные",
        uploading: "Загрузка...",
        example: "пример",
        processing: "Обработка...",
        noNickname: "Укажите никнейм в профиле"
      },
      upload: {
        button: "Обновить данные",
        uploading: "Загрузка...",
        processing: "Обработка...",
        fileFormat: "Формат файла должен быть PNG",
        fileSize: "Размер файла не должен превышать 1MB",
        noNickname: "Не указан никнейм в профиле",
        success: "Статистика успешно обновлена!",
        error: "Ошибка проверки статистики",
        exampleTitle: "Пример скриншота статистики",
        exampleHint: "Убедитесь, что ваш никнейм виден на скриншоте"
      },
      banWarning: "За подделку статистики игрока предусмотрен перманентный бан",
      kills: "Убийств",
      assists: "Помощи",
      rank: "Ранг",
      matches: "Матчи",
      kd: "К/Д",
      playTimeValue: "ч"
    },

    // Блок профиля "Игрок" (Изменение никнейма)
    nickname: {
      edit: "Редактировать никнейм",
      save: "Сохранить",
      cancel: "Отмена",
      placeholder: "Введите никнейм",
      empty: "Ник не указан",
      required: "Введите никнейм",
      noSpaces: "Никнейм не должен содержать пробелы",
      minLength: "Никнейм должен содержать минимум 2 символа",
      maxLength: "Никнейм не должен превышать 20 символов",
      sameAsCurrent: "Это ваш текущий никнейм",
      alreadyExists: "Никнейм уже занят",
      changeSuccess: "Никнейм успешно изменен! Следующее изменение возможно через 30 дней",
      changeError: "Ошибка сохранения никнейма",
      checkError: "Ошибка проверки никнейма",
      nextChangeIn: "Следующее изменение через {days} дней",
      notAuthenticated: "Пользователь не авторизован",
      cooldown: "д"
    },
    
    // Блок профиля "Игрок" (общие данные)
    player: {
      player: "Игрок",
      class: "Класс",
      country: "Страна",
      age: "Возраст",
      team: "Команда",
      selectCountry: "Выберите страну",
      countrySet: "Страна установлена",
      setAge: "Изменить",
      ageSet: "Возраст установлен",
      freeAgent: "Свободный агент",
      online: "Онлайн",
      offline: "Оффлайн",
      fullnameNotSet: "Имя не указано"
    },

    // Блок профиля "Игрок" (возраст)
    age: {
      years: "{count} {form}",
      yearForms: {
        year: "год",
        years2_4: "года",
        years5_20: "лет"
      },
      notSet: "Не указан",
      setAge: "Изменить",
      ageSet: "Возраст установлен",
      minAge: "Минимальный возраст - 16 лет"
    },

    // Блок профиля "Игрок" (модалка изменения возраста)
    profile: {
  setBirthDate: "Выберите дату рождения",
  ageSetOnce: "Возраст можно установить только один раз!",
  day: "День",
  month: "Месяц",
  year: "Год",
  agePreview: "Возраст:",
  lessThan16: "Меньше 16 лет",
  cancel: "Отмена",
  save_age_notification: "✓ Возраст установлен",
  error_age_notification: "✗ Ошибка сохранения возраста",
  save: "Сохранить",
  freeAgent: "Свободный агент"
},

// Блок профиля "Игрок" (Модалка выбора стран)
countryPicker: {
  modalTitle: "Выберите страну",
  searchPlaceholder: "Поиск страны...",
  countryNotice: "Страну можно выбрать только один раз",
  cancelButton: "Отмена",
  notifications: {
    countryChanged: "✓ Страна изменена на {countryName}",
    userNotFound: "✗ Пользователь не найден",
    saveError: "✗ Ошибка сохранения страны"
  }
},

countries: {
    ru: "Россия",
    us: "США",
    de: "Германия",
    fr: "Франция",
    gb: "Великобритания",
    jp: "Япония",
    kr: "Корея",
    cn: "Китай",
    br: "Бразилия",
    in: "Индия",
    ca: "Канада",
    au: "Австралия",
    it: "Италия",
    es: "Испания",
    ua: "Украина",
    kz: "Казахстан",
    by: "Беларусь",
    pl: "Польша",
    tr: "Турция",
    nl: "Нидерланды",
    se: "Швеция",
    no: "Норвегия",
    fi: "Финляндия",
    dk: "Дания",
    mx: "Мексика",
    id: "Индонезия",
    sa: "Саудовская Аравия",
    za: "Южная Африка",
    eg: "Египет",
    ar: "Аргентина",
    pt: "Португалия",
    gr: "Греция",
    cz: "Чехия",
    ch: "Швейцария",
    at: "Австрия",
    be: "Бельгия",
    il: "Израиль",
    th: "Таиланд",
    vn: "Вьетнам",
    my: "Малайзия",
    sg: "Сингапур",
    ph: "Филиппины",
    ie: "Ирландия",
    hu: "Венгрия",
    ro: "Румыния",
    bg: "Болгария",
    hr: "Хорватия",
    rs: "Сербия",
    sk: "Словакия",
    si: "Словения",
    ee: "Эстония",
    lv: "Латвия",
    lt: "Литва",
    is: "Исландия",
    lu: "Люксембург",
    mt: "Мальта",
    ae: "Объединенные Арабские Эмираты",
    pk: "Пакистан",
    ng: "Нигерия",
    ir: "Иран",
    iq: "Ирак",
    af: "Афганистан",
    ke: "Кения",
    et: "Эфиопия",
    co: "Колумбия",
    pe: "Перу",
    ve: "Венесуэла",
    cl: "Чили",
    nz: "Новая Зеландия",
    bd: "Бангладеш",
    vg: "Виетнам",
    ma: "Марокко",
    tn: "Тунис",
    dz: "Алжир",
    lb: "Ливан",
    jo: "Иордания"
  },

  // Блок профиля "Игрок" (Награды MVP)
  mvpAwards: {
      title: "Награды MVP",
      noAwards: {
        title: "Наград пока нет",
        subtitle: "Побеждайте в турнирах, чтобы получить первые награды",
        iconAlt: "без наград"
      },
      award: {
        tournament: "Турнир",
        medalType: "Медаль"
      },
      loading: "Загрузка наград MVP..."
    },

      division: "Дивизион",
      calibration: "Калибровка",
      contacts: "Контакты",
      achievements: "Достижения",
      contactNotSet: "Контакт не указан",
      goToSteam: "Перейти в Steam",
      goToTelegram: "Перейти в Telegram",
      goToWhatsApp: "Перейти в WhatsApp",

      // Блок профиля "Игрок" (Меню)
      actionButtons: {
        contacts: "Контакты",
        team: "Команда",
        tournaments: "Турниры",
        privacy: "Приватность",
        deleteAccount: "Удалить аккаунт",
        addToFavorites: "В избранное",
        report: "Пожаловаться",
        block: "Заблокировать",
        message: "Написать сообщение",
        inviteToTeam: "Пригласить в команду"
      },
      comingSoon: "Скоро",

      // Блок профиля "Игрок" (Модалка удаления аккаунта)
      deleteAccount: {
        title: "Удаление аккаунта",
        warning: "Вы уверены, что хотите удалить свой аккаунт?",
        consequences: "Это действие приведет к:",
        listItem1: "Полному удалению всех ваших данных",
        listItem2: "Удалению статистики и достижений",
        listItem3: "Удалению информации о команде (если вы в ней состоите)",
        listItem4: "Потере доступа ко всем турнирам",
        finalWarning: "Это действие нельзя отменить!",
        cancel: "Отмена",
        confirm: "Да, удалить все данные"
      },

      // Блок профиля "Игрок" (Модалка контактов)
      contactsModal: {
        title: "Редактирование контактов",
        steamPlaceholder: "Введите Steam никнейм",
        telegramPlaceholder: "Введите никнейм Telegram без @",
        whatsappPlaceholder: "Введите номер с кодом страны без +",
        cancel: "Отмена",
        save: "Сохранить",
        saveSuccess: "✓ Контакты сохранены",
        saveError: "✗ Ошибка сохранения контактов"
      },
      
      // Блок профиля "Игрок" (Классы)
      classes: {
        assault: "Штурмовик",
        medic: "Медик",
        recon: "Разведчик",
        engineer: "Инженер"
      },

    // СТРАНИЦА РЕЙТИНГА
    rating: {
      title: "Рейтинг игроков",
      description: "Топ игроков Arena Warborn League по MMR и статистике",
      search_placeholder: "Поиск игрока...",
      search_button: "Поиск",
      division_filter_all: "Все дивизионы",
      division_filter_assault: "Штурмовик",
      division_filter_special: "Спецназ", 
      division_filter_vanguard: "Авангард",
      my_position: "Моя позиция",
      reset_filters: "Сбросить",
      loading: "Загрузка...",
      searching: "Поиск...",
      
      // Заголовки таблицы
      rank: "#",
      player: "Игрок",
      team: "Команда",
      mmr: "MMR",
      kd: "K/D",
      winrate: "Win Rate",
      matches: "Матчи",
      
      // Сообщения
      no_players: "Игроки не найдены",
      loading_data: "Загрузка данных...",
      filters_reset: "Фильтры сброшены",
      players_found: "Найдено игроков: {count}",
      no_players_found: "Игроки по вашему запросу не найдены",
      
      // Поиск позиции
      enter_nickname: "Введите ваш игровой nickname для поиска в рейтинге:",
      player_not_found: "Игрок с таким nickname не найден в рейтинге",
      multiple_players_found: "Найдено несколько игроков:\n{players}\n\nВведите номер нужного игрока:",
      invalid_choice: "Неверный выбор",
      position_found: "Ваша позиция: #{position}\n{nickname} | MMR: {mmr}",
      position_error: "Ошибка при поиске вашей позиции",
      search_error: "Ошибка при поиске игрока",
      
      // Пагинация
      prev_page: "Назад",
      next_page: "Вперед",
      
      // Статусы команды
      no_team: "Без команды"
    },

    // ТИКЕРЫ
    ticker: {
      message1: "Открыт набор в команду дизайна и back/front-end разработки! Присоединяйся к Arena Warborn League",
      message2: "Осенью стартует первая серия турниров выходного дня « WKND CHALLENGE Series 25/26 »",
      message3: "Все вопросы сотрудничества через форму обратной связи", 
      message4: "Ищешь команду? В разделе 'Трансферы' найдешь напарников"
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

    // PAGE - MOBILE BLOCK
    mobile_block_title: "Available only on computers",
    mobile_block_description: "Mobile version is under development. For full access to Arena Warborn League features, please use a laptop or computer.",
    mobile_block_footer: "Arena Warborn League 2025. All rights reserved.",

    // PAGE - RESET PASSWORD
  reset_password_title: "Reset Password",
  new_password_label: "New Password* ", 
  new_password_placeholder: "Enter new password",
  confirm_new_password_label: "Confirm Password*",
  confirm_new_password_placeholder: "Repeat new password",
  password_updated: "Password successfully updated!",
  use_reset_link: 'Access Denied, use the link from the email to reset your password',
  change_password_button: "Change password",
  error_invalid_access_message: "Authorization is required to change the password",
  session_expired: '✗ The session has expired or is invalid',

  // PAGE - VERIFICATION EMAIL
verification_success: {
  title: "Email Confirmed!",
  welcome_text: "Return to the registration page", 
  close_window: "Close",
  invalid_access: "Access Denied",
  invalid_access_message: "This page is only accessible through email verification links.",
  invalid_verification_link: '✗ Invalid verification link'
},

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
      authorization_required: "✗ Authorization is required to access the profile",
      logout_error: "Logout error",
      authorizationRequired: "✗ Authorization required",
      profileLoadError: "✗ Profile loading error",
      profileNotFound: "✗ Profile not found",
      userNotAuthenticated: "✗ User not authenticated",
      signOutSuccess: "✗ You have signed out",
      emailNotVerified: "✗ Confirm email to access profile",
      classChanged: "✓ Class changed to {className}",
      classChangeError: "✗ Error saving class",
      deleteAccountSuccess: "✓ Account successfully deleted",
      deleteAccountError: "✗ Error deleting account"
    },

    // HOME PAGE
    last_news_title: 'Last News',
    current_tournaments_title: 'Current Tournaments',
    technical_works_title: 'Technical work',
    details_back_button: 'Back',
    details_button: 'Details',

    // -------------------------------------------- PROFILE PAGE ----------------------------------
    // Block "Player" (Статистика)
    stats: {
      notAvailable: "N/a",
      kdRatio: "K/D Ratio",
      winRate: "Win Rate", 
      playTime: "Play Time",
      favoriteWeapon: "Favorite Weapon",
      wins: "Wins",
      losses: "Loses",
      inDevelopment: "In Development",
      title: "Statistics",
      loadingStats: "Loading statistics...",
      noPublicStats: "No information available",
      noStats: {
        message1: "Upload a screenshot",
        message1_2: "of game statistics from the resource",
        message2: "The system will automatically determine the necessary data.",
        message3: "The nickname specified in the profile and in the screenshot must be identical.",
        uploadButton: "Upload data",
        uploading: "Uploading...",
        processing: "Processing...",
        example: "example",
        noNickname: "Specify nickname in profile"
      },
      upload: {
        button: "Update data",
        uploading: "Uploading...",
        processing: "Processing...",
        fileFormat: "File format must be PNG",
        fileSize: "File size must not exceed 1MB",
        noNickname: "Nickname not specified in profile",
        success: "Statistics successfully updated!",
        error: "Statistics verification error",
        exampleTitle: "Example statistics screenshot",
        exampleHint: "Make sure your nickname is visible in the screenshot"
      },
      banWarning: "Forgery of player statistics results in a permanent ban",
      kills: "Kills",
      assists: "Assists",
      rank: "Rank",
      matches: "Matches",
      kd: "K/D",
      playTimeValue: "h"
    },
    
    // Block "Player" (никнейм)
    nickname: {
      edit: "Edit nickname",
      save: "Save",
      cancel: "Cancel",
      placeholder: "Enter nickname",
      empty: "Nickname not set",
      required: "Enter nickname",
      noSpaces: "Nickname should not contain spaces",
      minLength: "Nickname must contain at least 2 characters",
      maxLength: "Nickname should not exceed 20 characters",
      sameAsCurrent: "This is your current nickname",
      alreadyExists: "Nickname already taken",
      changeSuccess: "Nickname successfully changed! Next change possible in 30 days",
      changeError: "Error saving nickname",
      checkError: "Error checking nickname",
      nextChangeIn: "Next change in {days} days",
      notAuthenticated: "User not authenticated",
      cooldown: "d"
    },
    
    // Block "Player" (общие настройки)
    player: {
      player: "Player",
      class: "Class",
      country: "Country",
      age: "Age",
      team: "Team",
      selectCountry: "Select country",
      countrySet: "Country is set",
      setAge: "Set age",
      ageSet: "Age is set",
      freeAgent: "Free Agent",
      online: "Online",
      offline: "Offline",
      fullnameNotSet: "Name not specified"
    },

    // Block "Player" (возраст)
    age: {
      years: "{count} {form}",
      yearForms: {
        year: "year",
        years: "years"
      },
      notSet: "Not specified",
      setAge: "Set age",
      ageSet: "Age is set",
      minAge: "Minimum age - 16 years"
    },

      // Block "Player" (модалка изменения возраста)
    profile: {
      setBirthDate: "Select Date of Birth",
      ageSetOnce: "Age can be set only once!",
      day: "Day",
      month: "Month", 
      year: "Year",
      agePreview: "Age:",
      lessThan16: "Less than 16 years",
      cancel: "Cancel",
      save_age_notification: "✓ The age is set",
      error_age_notification: "✗ Age saving error",
      save: "Save",
      freeAgent: "Free Agent"
    },

    // Модалка выбора стран ENG
countryPicker: {
  modalTitle: "Select country",
  searchPlaceholder: "Search country...",
  countryNotice: "Country can be selected only once",
  cancelButton: "Cancel",
  notifications: {
    countryChanged: "✓ Country changed to {countryName}",
    userNotFound: "✗ User not found",
    saveError: "✗ Error saving country"
  }
},

countries: {
    ru: "Russia",
    us: "USA",
    de: "Germany",
    fr: "France",
    gb: "United Kingdom",
    jp: "Japan",
    kr: "South Korea",
    cn: "China",
    br: "Brazil",
    in: "India",
    ca: "Canada",
    au: "Australia",
    it: "Italy",
    es: "Spain",
    ua: "Ukraine",
    kz: "Kazakhstan",
    by: "Belarus",
    pl: "Poland",
    tr: "Turkey",
    nl: "Netherlands",
    se: "Sweden",
    no: "Norway",
    fi: "Finland",
    dk: "Denmark",
    mx: "Mexico",
    id: "Indonesia",
    sa: "Saudi Arabia",
    za: "South Africa",
    eg: "Egypt",
    ar: "Argentina",
    pt: "Portugal",
    gr: "Greece",
    cz: "Czech Republic",
    ch: "Switzerland",
    at: "Austria",
    be: "Belgium",
    il: "Israel",
    th: "Thailand",
    vn: "Vietnam",
    my: "Malaysia",
    sg: "Singapore",
    ph: "Philippines",
    ie: "Ireland",
    hu: "Hungary",
    ro: "Romania",
    bg: "Bulgaria",
    hr: "Croatia",
    rs: "Serbia",
    sk: "Slovakia",
    si: "Slovenia",
    ee: "Estonia",
    lv: "Latvia",
    lt: "Lithuania",
    is: "Iceland",
    lu: "Luxembourg",
    mt: "Malta",
    ae: "United Arab Emirates",
    pk: "Pakistan",
    ng: "Nigeria",
    ir: "Iran",
    iq: "Iraq",
    af: "Afghanistan",
    ke: "Kenya",
    et: "Ethiopia",
    co: "Colombia",
    pe: "Peru",
    ve: "Venezuela",
    cl: "Chile",
    nz: "New Zealand",
    bd: "Bangladesh",
    vg: "Vietnam",
    ma: "Morocco",
    tn: "Tunisia",
    dz: "Algeria",
    lb: "Lebanon",
    jo: "Jordan"
  },

  // Block MVP Awards
    mvpAwards: {
      title: "MVP Awards",
      noAwards: {
        title: "No awards yet",
        subtitle: "Win tournaments to get your first awards",
        iconAlt: "no awards"
      },
      award: {
        tournament: "Tournament",
        medalType: "Medal"
      },
      loading: "Loading MVP awards..."
    },

      division: "Division",
      calibration: "Calibration",
      contacts: "Contacts",
      achievements: "Achievements",
      contactNotSet: "Contact not set",
      goToSteam: "Go to Steam",
      goToTelegram: "Go to Telegram",
      goToWhatsApp: "Go to WhatsApp",

      // Block Action buttons (MENU)
      actionButtons: {
        contacts: "Contacts",
        team: "Team",
        tournaments: "Tournaments",
        privacy: "Privacy",
        deleteAccount: "Delete account",
        addToFavorites: "Add to favorites",
        report: "Report",
        block: "Block",
        message: "Message",
        inviteToTeam: "Invite to team"
      },
      comingSoon: "Soon",

      // PROFILE (Delete account modal)
      deleteAccount: {
        title: "Delete Account",
        warning: "Are you sure you want to delete your account?",
        consequences: "This action will lead to:",
        listItem1: "Complete deletion of all your data",
        listItem2: "Deletion of statistics and achievements",
        listItem3: "Deletion of team information (if you are in a team)",
        listItem4: "Loss of access to all tournaments",
        finalWarning: "This action cannot be undone!",
        cancel: "Cancel",
        confirm: "Yes, delete all data"
      },
      
      // PROFILE (Contacts modal)
      contactsModal: {
        title: "Edit Contacts",
        steamPlaceholder: "Enter Steam nickname",
        telegramPlaceholder: "Enter Telegram username without @",
        whatsappPlaceholder: "Enter phone number with country code without +",
        cancel: "Cancel",
        save: "Save",
        saveSuccess: "✓ Contacts saved",
        saveError: "✗ Error saving contacts"
      },
      
      // Block "Player" (classes)
      classes: {
        assault: "Assault",
        medic: "Medic",
        recon: "Recon",
        engineer: "Engineer"
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

    // RATING PAGE
    rating: {
      title: "Player Ratings",
      description: "Top Arena Warborn League players by MMR and statistics",
      search_placeholder: "Search player...",
      search_button: "Search",
      division_filter_all: "All divisions",
      division_filter_assault: "Assault",
      division_filter_special: "Special Forces",
      division_filter_vanguard: "Vanguard",
      my_position: "My position",
      reset_filters: "Reset",
      loading: "Loading...",
      searching: "Searching...",
      
      // Table headers
      rank: "#",
      player: "Player",
      team: "Team",
      mmr: "MMR",
      kd: "K/D",
      winrate: "Win Rate",
      matches: "Matches",
      
      // Messages
      no_players: "No players found",
      loading_data: "Loading data...",
      filters_reset: "Filters reset",
      players_found: "Players found: {count}",
      no_players_found: "No players found for your query",
      
      // Position search
      enter_nickname: "Enter your gaming nickname to search in ratings:",
      player_not_found: "Player with this nickname not found in ratings",
      multiple_players_found: "Multiple players found:\n{players}\n\nEnter the number of the required player:",
      invalid_choice: "Invalid choice",
      position_found: "Your position: #{position}\n{nickname} | MMR: {mmr}",
      position_error: "Error searching for your position",
      search_error: "Error searching for player",
      
      // Pagination
      prev_page: "Previous",
      next_page: "Next",
      
      // Team statuses
      no_team: "No team"
    },

    // TICKERS
    ticker: {
      message1: "Open recruitment for design and back/front-end development team! Join Arena Warborn League",
      message2: "The first series of weekend tournaments « WKND CHALLENGE Series 25/26 » starts in autumn",
      message3: "All cooperation questions through the feedback form",
      message4: "Looking for a team? Find partners in the 'Transfers' section"
    },
  
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