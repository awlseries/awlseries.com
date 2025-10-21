import React from 'react';

const Tournaments = () => {
  return (
    <section class="tournaments">
    <div class="tournament-container">
        <!-- Первый блок -->
        <div class="tournament-header-block">
            <div class="tournament-title-section">
                <div class="tournament-page-status">Статус: недоступен</div>
                <h2 class="tournament-page-name">WEEKND CHALLENGE AWL FALL FIRST</h2>
            </div>
            <button class="join-tournament-btn">
                <span>Присоединиться</span>
                <img class="icons-tournaments" src="../public/images/icons/icon-join.png" alt="join-tournament">
            </button>
        </div>
        
        <!-- Второй блок -->
        <div class="tournament-middle-block">
            <!-- Левая часть - 3 мини-блока в ряд -->
            <div class="tournament-mini-blocks">
                <div class="mini-block">
                    <div class="mini-block-top">
                    <img class="icons-tournaments" src="../public/images/icons/icon-reward-tournament.png" alt="rewards-tournament"></div>
                    <div class="mini-block-bottom">
                        <div class="mini-text-line-top">Сумма</div>
                        <div class="mini-text-line-bottom">Призовой пул</div>
                    </div>
                </div>
                <div class="mini-block">
                    <div class="mini-block-top">
                    <img class="icons-tournaments" src="../public/images/icons/icon-time-tournament.png" alt="time-tournament"></div>
                    <div class="mini-block-bottom">
                        <div class="mini-text-line-top">00.11 20:00 ( +5 )</div>
                        <div class="mini-text-line-bottom">Начало турнира</div>
                    </div>
                </div>
                <div class="mini-block">
                    <div class="mini-block-top">
                    <img class="icons-tournaments" src="../public/images/icons/icon-date-tournament.png" alt="date-tournament"></div>
                    <div class="mini-block-bottom">
                        <div class="mini-text-line-top">00.11 - 00.11.25</div>
                        <div class="mini-text-line-bottom">Период регистрации</div>
                    </div>
                </div>
            </div>
            
            <!-- Правая часть - 1 блок -->
            <div class="tournament-right-block">
                <div class="right-block-top">
                        <div class="right-block-line-top">Заявленные команды</div>
                        <div class="right-block-line-bottom">00/64</div>
                </div>
                <div class="right-block-bottom">
                    <div class="team-icons-container">
            <div class="team-icon-circle">
                <img src="../public/images/icons/logo-opponent2.png" alt="Team 1">
            </div>
            <div class="team-icon-circle">
                <img src="../public/images/icons/logo-opponent.png" alt="Team 2">
            </div>
            <div class="team-icon-circle">
                <img src="../public/images/icons/logo-opponent2.png" alt="Team 3">
            </div>
            <div class="team-icon-circle">
                <img src="../public/images/icons/logo-opponent.png" alt="Team 4">
            </div>
            <div class="team-icon-circle">
                <img src="../public/images/icons/logo-opponent2.png" alt="Team 5">
            </div>
            <div class="team-icon-circle">
                <div class="right-block-line-bottom-last">+00</div>
            </div>
        </div>
                </div>
            </div>
        </div>
        
        <!-- Третий блок -->
        <div class="tournament-bottom-block">
            <div class="tournament-info-section">
        <!-- Левая секция - описание турнира 40% -->
        <div class="info-block-tournament">
            <h3 class="info-title-tournament">О турнире</h3>
            <p class="info-description-tournament">
                В рамках серии любительских турниров выходного дня Weeknd Challenge CUP ( WCCA ) 
                еженедельно проводятся матчи, где каждая команда может проявить себя независимо от опыта и заработать TMMR. 
                Идеальная площадка для тех, кто только начинает свой путь в киберспорте или хочет оттачивать навыки 
                без давления высших лиг.
            </p>
        </div>
        
        <div class="info-block-tournament">
            <h3 class="info-title-tournament">В перспективе</h3>
            <p class="info-description-tournament">
                Регулярное участие в WCCA открывает путь в более серьезные серии игр — лучшие команды получают квоты 
                в верхних дивизионах лиги. Каждый этап — это новый шаг к совершенствованию.
            </p>
        </div>
        
        <div class="game-details">
            <div class="detail-item">
                <span class="detail-label">Дисциплина:</span>
                <span class="detail-value">BF6 Battle Royale</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Режим:</span>
                <span class="detail-value">Командный 4x4</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Карта:</span>
                <span class="detail-value">Оман Песчаная буря</span>
            </div>
        </div>
        
        <div class="partners-block">
            <h4 class="partners-title">Партнеры:</h4>
            <div class="partners-icons">
                <img src="../public/images/icons/logo-partner1.png" alt="partner-awl" class="partner-icon">
                <img src="../public/images/icons/logo-partner2.png" alt="partner-awl" class="partner-icon">
            </div>
        </div>
    </div>
    
    <!---------------------------------------------------- Правая секция - детали турнира 60% ----------------------------->

    <div class="tournament-details-section">
        <div class="details-content-container">
    <!-- Верхний блок с навигацией -->
    <div class="details-navigation">
        <div class="nav-item active" data-tab="bracket">Рейтинг</div>
        <div class="nav-item" data-tab="schedule">Расписание</div>
        <div class="nav-item" data-tab="participants">Участники</div>
        <div class="nav-item" data-tab="rules">Регламент</div>
    </div>
    
    <!-- Блок с контентом -->
    <div class="details-content">
        <div class="content-tab active" id="bracket-tab">
    <!--------------------------------------------------------------- Общая таблица лидеров ------------------------------>
    <div class="leaderboard-table">
        <div class="table-header-wsow">
            <div class="col-rank">#</div>
            <div class="col-logo"></div>
            <div class="col-team">Команда</div>
            <div class="col-total">Счет</div>
            <div class="col-kills">Убийства</div>
            <div class="col-stats">Позиции в матчах</div>
        </div>
        
        <div class="table-row-wsow champion">
            <div class="col-rank">
                <span class="rank-number">1</span>
                <img src="../public/images/icons/icon-tournament-arrow.png" alt="" class="rank-arrow">
            </div>
            <div class="col-logo">
                <img src="../public/images/icons/logo-opponent.png" alt="first-team-on-tournament" class="team-logo">
            </div>
            <div class="col-team">
                <div class="team-info">
        <div class="team-name-wrapper">
            <img src="../public/images/icons/icon-kazakhstan.png" alt="country-team-tournament-awl" class="team-flag">
            <span class="team-name-tournament">Testing</span>
        </div>
        <span class="team-players">Player1 | Player2 | Player3 | Player4</span>
    </div>
            </div>
            <div class="col-total">
                <span class="total-points">108</span>
            </div>
            <div class="col-kills">
                <span class="kills-count">58</span>
            </div>
            <div class="col-stats">
                <div class="match-performance">
                    <span class="match-result win">1st</span>
                    <span class="match-result top3">3rd</span>
                    <span class="match-result top5">5th</span>
                    <span class="match-result">12th</span>
                </div>
            </div>
        </div>
        
        <div class="table-row-wsow">
            <div class="col-rank">
                <span class="rank-number">2</span>
                <img src="../public/images/icons/icon-tournament-arrow.png" alt="" class="rank-arrow">
            </div>
            <div class="col-logo">
                <img src="../public/images/icons/logo-opponent.png" alt="second-team-on-tournament" class="team-logo">
            </div>
            <div class="col-team">
                <div class="team-info">
                    <div class="team-name-wrapper">
            <img src="../public/images/icons/icon-europe.png" alt="country-team-tournament-awl" class="team-flag">
            <span class="team-name-tournament">Bravo</span>
        </div>
                    <span class="team-players">Player1 | Player2 | Player3 | Player4</span>
                </div>
            </div>
            <div class="col-total">
                <span class="total-points">000</span>
            </div>
            <div class="col-kills">
                <span class="kills-count">00</span>
            </div>
            <div class="col-stats">
                <div class="match-performance">
                    <span class="match-result top3">2nd</span>
                    <span class="match-result top5">4th</span>
                    <span class="match-result">8th</span>
                    <span class="match-result">15th</span>
                </div>
            </div>
        </div>
        
        <div class="table-row-wsow">
            <div class="col-rank">
                <span class="rank-number">3</span>
                <img src="../public/images/icons/icon-tournament-arrow.png" alt="" class="rank-arrow">
            </div>
            <div class="col-logo">
                <img src="../public/images/icons/logo-opponent.png" alt="thirth-team-on-tournament" class="team-logo">
            </div>
            <div class="col-team">
                <div class="team-info">
                    <div class="team-name-wrapper">
            <img src="../public/images/icons/icon-europe.png" alt="country-team-tournament-awl" class="team-flag">
            <span class="team-name-tournament">Delta</span>
        </div>
                    <span class="team-players">Player1 | Player2 | Player3 | Player4</span>
                </div>
            </div>
            <div class="col-total">
                <span class="total-points">00</span>
            </div>
            <div class="col-kills">
                <span class="kills-count">00</span>
            </div>
            <div class="col-stats">
                <div class="match-performance">
                    <span class="match-result top3">3rd</span>
                    <span class="match-result">5th</span>
                    <span class="match-result">7th</span>
                    <span class="match-result">11th</span>
                </div>
            </div>
        </div>

        <div class="table-row-wsow">
            <div class="col-rank">
                <span class="rank-number">4</span>
                <img src="../public/images/icons/icon-tournament-arrow.png" alt="" class="rank-arrow">
            </div>
            <div class="col-logo">
                <img src="../public/images/icons/logo-opponent.png" alt="third-team-on-tournament" class="team-logo">
            </div>
            <div class="col-team">
                <div class="team-info">
                    <div class="team-name-wrapper">
            <img src="../public/images/icons/icon-europe.png" alt="country-team-tournament-awl" class="team-flag">
            <span class="team-name-tournament">Charlie</span>
        </div>
                    <span class="team-players">Player1 | Player2 | Player3 | Player4</span>
                </div>
            </div>
            <div class="col-total">
                <span class="total-points">00</span>
            </div>
            <div class="col-kills">
                <span class="kills-count">00</span>
            </div>
            <div class="col-stats">
                <div class="match-performance">
                    <span class="match-result">4th</span>
                    <span class="match-result">9th</span>
                    <span class="match-result">13th</span>
                    <span class="match-result">17th</span>
                </div>
            </div>
        </div>

        <div class="table-row-wsow">
            <div class="col-rank">
                <span class="rank-number">5</span>
                <img src="../public/images/icons/icon-tournament-arrow.png" alt="" class="rank-arrow">
            </div>
            <div class="col-logo">
                <img src="../public/images/icons/logo-opponent.png" alt="fifth-team-on-tournament" class="team-logo">
            </div>
            <div class="col-team">
                <div class="team-info">
                    <div class="team-name-wrapper">
            <img src="../public/images/icons/icon-europe.png" alt="country-team-tournament-awl" class="team-flag">
            <span class="team-name-tournament">Zeta</span>
        </div>
                    <span class="team-players">Player1 | Player2 | Player3 | Player4</span>
                </div>
            </div>
            <div class="col-total">
                <span class="total-points">00</span>
            </div>
            <div class="col-kills">
                <span class="kills-count">00</span>
            </div>
            <div class="col-stats">
                <div class="match-performance">
                    <span class="match-result top5">8th</span>
                    <span class="match-result">20th</span>
                    <span class="match-result">14th</span>
                    <span class="match-result">19th</span>
                    <span class="match-result win">1th</span>
                </div>
            </div>
        </div>
    </div>
</div>

        <div class="content-tab" id="schedule-tab">
    <!-- Расписание турнира -->
    <div class="tournament-schedule">
        
        <!-- Неделя 1 -->
        <div class="schedule-week">
            <div class="week-header">
                <div class="week-title-section">
                    <span class="week-name">I Неделя</span>
                    <span class="week-dates">• 6-7 Декабря</span>
                </div>
                <span class="week-status">Скоро</span>
            </div>
            <div class="matches-grid">
                <div class="match-card">
                    <div class="match-time">18:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 1 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="watch-game-awl" class="match-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">19:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 2 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">21:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 3 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">22:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 4 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
            </div>
        </div>
        
        <!-- Неделя 2 -->
        <div class="schedule-week">
            <div class="week-header">
                <div class="week-title-section">
                    <span class="week-name">II Неделя</span>
                    <span class="week-dates">• 13-14 Декабря</span>
                </div>
                <span class="week-status">Скоро</span>
            </div>
            <div class="matches-grid">
                <div class="match-card">
                    <div class="match-time">18:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 1 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">19:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 2 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">21:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 3 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">22:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 4 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
            </div>
        </div>
        
        <!-- Неделя 3 -->
        <div class="schedule-week">
            <div class="week-header">
                <div class="week-title-section">
                    <span class="week-name">III Неделя</span>
                    <span class="week-dates">• 20-21 Декабря</span>
                </div>
                <span class="week-status">Скоро</span>
            </div>
            <div class="matches-grid">
                <div class="match-card">
                    <div class="match-time">18:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 1 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">19:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 2 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">21:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 3 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">22:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 4 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
            </div>
        </div>
        
        <!-- Неделя 4 -->
        <div class="schedule-week">
            <div class="week-header">
                <div class="week-title-section">
                    <span class="week-name">IV Неделя</span>
                    <span class="week-dates">• 27-28 Декабря</span>
                </div>
                <span class="week-status">Скоро</span>
            </div>
            <div class="matches-grid">
                <div class="match-card">
                    <div class="match-time">18:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 1 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">19:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 2 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">21:00</div>
                    <div class="match-info">
                        <span class="match-name">Матч 3 • Группа A</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
                <div class="match-card">
                    <div class="match-time">22:30</div>
                    <div class="match-info">
                        <span class="match-name">Матч 4 • Группа B</span>
                        <img src="../public/images/icons/icon-yt-tournament.png" alt="match-no-record-awl" class="match-recording no-recording">
                    </div>
                    <div class="day-result">Результат</div>
                </div>
            </div>
        </div>
    </div>
</div>

        <div class="content-tab" id="participants-tab">
            <!-- Контент участников -->
            <div class="participants-placeholder">Список участников не сформирован</div>
        </div>
        <div class="content-tab" id="rules-tab">
    <!-- Регламент турнира -->
    <div class="tournament-rules">
        
        <!-- 1. Общие положения -->
        <div class="rules-section">
            <div class="section-header-rules">
                <span class="section-number">1</span>
                <h3 class="section-title-rules">Общие положения</h3>
            </div>
            <div class="rules-content">
                <div class="rule-item">
                    <span class="rule-label">Турнир:</span>
                    <span class="rule-value">WEEKND CHALLENGE AWL FALL FIRST</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Дисциплина:</span>
                    <span class="rule-value">Battlefield 6 • Battle Royale</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Формат:</span>
                    <span class="rule-value">Командный • 4 игрока</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Даты:</span>
                    <span class="rule-value">Декабрь 2025 • 4 недели</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Организатор:</span>
                    <span class="rule-value">Arena Warborn League</span>
                </div>
            </div>
        </div>

        <!-- 2. Участники и регистрация -->
        <div class="rules-section">
            <div class="section-header-rules">
                <span class="section-number">2</span>
                <h3 class="section-title-rules">Участники и регистрация</h3>
            </div>
            <div class="rules-content">
                <div class="rule-item">
                    <span class="rule-label">Возраст:</span>
                    <span class="rule-value">16+ лет</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Регистрация:</span>
                    <span class="rule-value">До начала турнира • Командная</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Состав:</span>
                    <span class="rule-value">4 основных + 1 запасной</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Аккаунт:</span>
                    <span class="rule-value">Личный • Без нарушений</span>
                </div>
            </div>
        </div>

        <!-- 3. Формат проведения -->
        <div class="rules-section">
            <div class="section-header-rules">
                <span class="section-number">3</span>
                <h3 class="section-title-rules">Формат проведения</h3>
            </div>
            <div class="rules-content">
                <div class="rule-item">
                    <span class="rule-label">Этапы:</span>
                    <span class="rule-value">4 недели • 16 матчей</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Матчи:</span>
                    <span class="rule-value">4 в неделю • 25-30 минут</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Лобби:</span>
                    <span class="rule-value">20 команд • 80 игроков</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Победитель:</span>
                    <span class="rule-value">По сумме очков за сезон</span>
                </div>
            </div>
        </div>

        <!-- 4. Система очков -->
        <div class="rules-section">
            <div class="section-header-rules">
                <span class="section-number">4</span>
                <h3 class="section-title-rules ">Система подсчета</h3>
            </div>
            <div class="scoring-system">
                <div class="scoring-grid">
                    <div class="scoring-item">
                        <span class="placement">1 место</span>
                        <span class="points">+14</span>
                    </div>
                    <div class="scoring-item">
                        <span class="placement">2 место</span>
                        <span class="points">+9</span>
                    </div>
                    <div class="scoring-item">
                        <span class="placement">3 место</span>
                        <span class="points">+7</span>
                    </div>
                    <div class="scoring-item">
                        <span class="placement">4-6</span>
                        <span class="points">+5</span>
                    </div>
                    <div class="scoring-item">
                        <span class="placement">7-10</span>
                        <span class="points">+3</span>
                    </div>
                    <div class="scoring-item">
                        <span class="placement">11-15</span>
                        <span class="points">+2</span>
                    </div>
                    <div class="scoring-item">
                        <span class="placement">16-20</span>
                        <span class="points">+1</span>
                    </div>
                    <div class="scoring-item kills">
                        <span class="placement">Убийство</span>
                        <span class="points">+1</span>
                    </div>
                    <div class="scoring-item kills">
                        <span class="placement">Контракт</span>
                        <span class="points">+1</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 5. Технические требования -->
        <div class="rules-section">
            <div class="section-header-rules">
                <span class="section-number">5</span>
                <h3 class="section-title-rules">Технические требования</h3>
            </div>
            <div class="rules-content">
                <div class="rule-item">
                    <span class="rule-label">Пинг:</span>
                    <span class="rule-value">< 100ms • Стабильное соединение</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Клиент:</span>
                    <span class="rule-value">Официальный • Последняя версия</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Запись экрана:</span>
                    <span class="rule-value">Обязательная для всех игроков</span>
                </div>
                <div class="rule-item">
                    <span class="rule-label">Скриншоты результатов:</span>
                    <span class="rule-value">От капитанов</span>
                </div>
            </div>
        </div>

        <!-- 6. Запрещенные действия -->
        <div class="rules-section">
            <div class="section-header-rules">
                <span class="section-number">6</span>
                <h3 class="section-title-rules">Запрещенные действия</h3>
            </div>
            <div class="rules-content">
                <div class="rule-item prohibited">
                    <span class="rule-label">Teaming:</span>
                    <span class="rule-value">Договорные матчи</span>
                </div>
                <div class="rule-item prohibited">
                    <span class="rule-label">Читы:</span>
                    <span class="rule-value">Любое ПО для преимущества</span>
                </div>
                <div class="rule-item prohibited">
                    <span class="rule-label">Stream sniping:</span>
                    <span class="rule-value">Использование трансляций</span>
                </div>
                <div class="rule-item prohibited">
                    <span class="rule-label">Баги:</span>
                    <span class="rule-value">Использование ошибок игры</span>
                </div>
                <div class="rule-item prohibited">
                    <span class="rule-label">Нецензурная лексика:</span>
                    <span class="rule-value">Вежливое поведение в чатах</span>
                </div>
            </div>
        </div>

    </div>
</div>
    </div>
</div>
        </div>
        </div>
    </div>
</section>
  );
};

// ОБЯЗАТЕЛЬНО добавьте эту строку:
export default Tournaments;