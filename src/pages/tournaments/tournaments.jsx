import { useState, useEffect } from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import './tournaments.css';

const Tournaments = () => {
  const [activeTab, setActiveTab] = useState('bracket');
  const [teams, setTeams] = useState([]);

  // Данные команд из таблицы рейтинга
  const teamData = [
    {
      id: 1,
      name: "Testing",
      tag: "TEST",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-kazakhstan.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 108,
      kills: 58,
      matches: ["1st", "3rd", "5th", "12th"]
    },
    {
      id: 2,
      name: "Bravo",
      tag: "BRV",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["2nd", "4th", "8th", "15th"]
    },
    {
      id: 3,
      name: "Delta",
      tag: "DLT",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["3rd", "5th", "7th", "11th"]
    },
    {
      id: 4,
      name: "Charlie",
      tag: "CHR",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["4th", "9th", "13th", "17th"]
    },
    {
      id: 5,
      name: "Zeta",
      tag: "ZTA",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["8th", "20th", "14th", "19th", "1st"]
    }
  ];

  useEffect(() => {
    setTeams(teamData);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className="tournaments">
      <div className="tournament-container">
        {/* Первый блок */}
        <div className="tournament-header-block">
          <div className="tournament-title-section">
            <div className="tournament-page-status">Статус: недоступен</div>
            <h2 className="tournament-page-name">WEEKND CHALLENGE AWL FALL FIRST</h2>
          </div>
          <button className="join-tournament-btn">
            <span>Присоединиться</span>
            <img className="icons-tournaments" src="/images/icons/icon-join.png" alt="join-tournament" />
          </button>
        </div>
        
        {/* Второй блок */}
        <div className="tournament-middle-block">
          {/* Левая часть - 3 мини-блока в ряд */}
          <div className="tournament-mini-blocks">
            <div className="mini-block">
              <div className="mini-block-top">
                <img className="icons-tournaments" src="../images/icons/icon-reward-tournament.png" alt="rewards-tournament" />
              </div>
              <div className="mini-block-bottom">
                <div className="mini-text-line-top">Сумма</div>
                <div className="mini-text-line-bottom">Призовой пул</div>
              </div>
            </div>
            <div className="mini-block">
              <div className="mini-block-top">
                <img className="icons-tournaments" src="../images/icons/icon-time-tournament.png" alt="time-tournament" />
              </div>
              <div className="mini-block-bottom">
                <div className="mini-text-line-top">00.11 20:00 ( +5 )</div>
                <div className="mini-text-line-bottom">Начало турнира</div>
              </div>
            </div>
            <div className="mini-block">
              <div className="mini-block-top">
                <img className="icons-tournaments" src="../images/icons/icon-date-tournament.png" alt="date-tournament" />
              </div>
              <div className="mini-block-bottom">
                <div className="mini-text-line-top">00.11 - 00.11.25</div>
                <div className="mini-text-line-bottom">Период регистрации</div>
              </div>
            </div>
          </div>
          
          {/* Правая часть - 1 блок */}
          <div className="tournament-right-block">
            <div className="right-block-top">
              <div className="right-block-line-top">Заявленные команды</div>
              <div className="right-block-line-bottom">00/64</div>
            </div>
            <div className="right-block-bottom">
              <div className="team-icons-container">
                <div className="team-icon-circle">
                  <img src="../images/icons/logo-opponent2.png" alt="Team 1" />
                </div>
                <div className="team-icon-circle">
                  <img src="../images/icons/logo-opponent.png" alt="Team 2" />
                </div>
                <div className="team-icon-circle">
                  <img src="../images/icons/logo-opponent2.png" alt="Team 3" />
                </div>
                <div className="team-icon-circle">
                  <img src="../images/icons/logo-opponent.png" alt="Team 4" />
                </div>
                <div className="team-icon-circle">
                  <img src="../images/icons/logo-opponent2.png" alt="Team 5" />
                </div>
                <div className="team-icon-circle">
                  <div className="right-block-line-bottom-last">+00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Третий блок */}
        <div className="tournament-bottom-block">
          <div className="tournament-info-section">
            {/* Левая секция - описание турнира 40% */}
            <div className="info-block-tournament">
              <h3 className="info-title-tournament">О турнире</h3>
              <p className="info-description-tournament">
                В рамках серии любительских турниров выходного дня Weeknd Challenge CUP ( WCCA ) 
                еженедельно проводятся матчи, где каждая команда может проявить себя независимо от опыта и заработать TMMR. 
                Идеальная площадка для тех, кто только начинает свой путь в киберспорте или хочет оттачивать навыки 
                без давления высших лиг.
              </p>
            </div>
            
            <div className="info-block-tournament">
              <h3 className="info-title-tournament">В перспективе</h3>
              <p className="info-description-tournament">
                Регулярное участие в WCCA открывает путь в более серьезные серии игр — лучшие команды получают квоты 
                в верхних дивизионах лиги. Каждый этап — это новый шаг к совершенствованию.
              </p>
            </div>
            
            <div className="game-details">
              <div className="detail-item">
                <span className="detail-label">Дисциплина:</span>
                <span className="detail-value">BF6 Battle Royale</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Режим:</span>
                <span className="detail-value">Командный 4x4</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Карта:</span>
                <span className="detail-value">Оман Песчаная буря</span>
              </div>
            </div>
            
            <div className="partners-block">
              <h4 className="partners-title">Партнеры:</h4>
              <div className="partners-icons">
                <img src="../images/icons/logo-partner1.png" alt="partner-awl" className="partner-icon" />
                <img src="../images/icons/logo-partner2.png" alt="partner-awl" className="partner-icon" />
              </div>
            </div>
          </div>
          
          {/* Правая секция - детали турнира 60% */}
          <div className="tournament-details-section">
            <div className="details-content-container">
              {/* Верхний блок с навигацией */}
              <div className="details-navigation">
                <div 
                  className={`nav-item ${activeTab === 'bracket' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('bracket')}
                >
                  Рейтинг
                </div>
                <div 
                  className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('schedule')}
                >
                  Расписание
                </div>
                <div 
                  className={`nav-item ${activeTab === 'participants' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('participants')}
                >
                  Участники
                </div>
                <div 
                  className={`nav-item ${activeTab === 'rules' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('rules')}
                >
                  Регламент
                </div>
              </div>
              
              {/* Блок с контентом */}
              <div className="details-content">
                <div className={`content-tab ${activeTab === 'bracket' ? 'active' : ''}`} id="bracket-tab">
                  {/* Общая таблица лидеров */}
                  <div className="leaderboard-table">
                    <div className="table-header-wsow">
                      <div className="col-rank">#</div>
                      <div className="col-logo"></div>
                      <div className="col-team">Команда</div>
                      <div className="col-total">Счет</div>
                      <div className="col-kills">Убийства</div>
                      <div className="col-stats">Позиции в матчах</div>
                    </div>
                    
                    {teams.map((team, index) => (
                      <div key={team.id} className={`table-row-wsow ${index === 0 ? 'champion' : ''}`}>
                        <div className="col-rank">
                          <span className="rank-number">{index + 1}</span>
                          <img src="../images/icons/icon-tournament-arrow.png" alt="" className="rank-arrow" />
                        </div>
                        <div className="col-logo">
                          <img src={team.logo} alt={`${team.name}-team-on-tournament`} className="team-logo-tournaments" />
                        </div>
                        <div className="col-team">
                          <div className="team-info">
                            <div className="team-name-wrapper">
                              <img src={team.country} alt="country-team-tournament-awl" className="team-flag" />
                              <span className="team-name-tournament">{team.name}</span>
                            </div>
                            <span className="team-players">{team.players}</span>
                          </div>
                        </div>
                        <div className="col-total">
                          <span className="total-points">{team.points}</span>
                        </div>
                        <div className="col-kills">
                          <span className="kills-count">{team.kills}</span>
                          <img src="../images/icons/icon-kills.png" alt="kills-icon" className="kills-icon" />
                        </div>
                        <div className="col-stats">
                          <div className="match-performance">
                            {team.matches.map((match, matchIndex) => (
                              <span 
                                key={matchIndex} 
                                className={`match-result ${
                                  match.includes('1st') ? 'win' : 
                                  match.includes('2nd') || match.includes('3rd') ? 'top3' :
                                  match.includes('4th') || match.includes('5th') || match.includes('6th') ? 'top5' : ''
                                }`}
                              >
                                {match}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


                <div className={`content-tab ${activeTab === 'schedule' ? 'active' : ''}`} id="schedule-tab">
                  {/* Расписание турнира */}
                  <div className="tournament-schedule">
                    
                    {/* Неделя 1 */}
                    <div className="schedule-week">
                      <div className="week-header">
                        <div className="week-title-section">
                          <span className="week-name">I Неделя</span>
                          <span className="week-dates">• 6-7 Декабря</span>
                        </div>
                        <span className="week-status">Скоро</span>
                      </div>
                      <div className="matches-grid">
                        <div className="match-card">
                          <div className="match-time">18:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 1 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="watch-game-awl" className="match-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">19:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 2 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">21:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 3 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">22:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 4 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Неделя 2 */}
                    <div className="schedule-week">
                      <div className="week-header">
                        <div className="week-title-section">
                          <span className="week-name">II Неделя</span>
                          <span className="week-dates">• 13-14 Декабря</span>
                        </div>
                        <span className="week-status">Скоро</span>
                      </div>
                      <div className="matches-grid">
                        <div className="match-card">
                          <div className="match-time">18:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 1 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">19:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 2 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">21:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 3 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">22:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 4 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Неделя 3 */}
                    <div className="schedule-week">
                      <div className="week-header">
                        <div className="week-title-section">
                          <span className="week-name">III Неделя</span>
                          <span className="week-dates">• 20-21 Декабря</span>
                        </div>
                        <span className="week-status">Скоро</span>
                      </div>
                      <div className="matches-grid">
                        <div className="match-card">
                          <div className="match-time">18:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 1 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">19:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 2 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">21:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 3 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">22:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 4 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Неделя 4 */}
                    <div className="schedule-week">
                      <div className="week-header">
                        <div className="week-title-section">
                          <span className="week-name">IV Неделя</span>
                          <span className="week-dates">• 27-28 Декабря</span>
                        </div>
                        <span className="week-status">Скоро</span>
                      </div>
                      <div className="matches-grid">
                        <div className="match-card">
                          <div className="match-time">18:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 1 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">19:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 2 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">21:00</div>
                          <div className="match-info">
                            <span className="match-name">Матч 3 • Группа A</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                        <div className="match-card">
                          <div className="match-time">22:30</div>
                          <div className="match-info">
                            <span className="match-name">Матч 4 • Группа B</span>
                            <img src="../images/icons/icon-yt-tournament.png" alt="match-no-record-awl" className="match-recording no-recording" />
                          </div>
                          <div className="day-result">Результат</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`content-tab ${activeTab === 'participants' ? 'active' : ''}`} id="participants-tab">
                  {/* Контент участников */}
                  <div className="participants-container">
                    <div className="participants-grid">
                      {teams.map(team => (
                        <div key={team.id} className="participant-team">
                          <div className="team-logo-participant">
                            <img src={team.logo} alt={`${team.name} Team`} />
                          </div>
                          <span className="team-name-participant">{team.name}</span>
                          <span className="team-tag-tournament">[{team.tag}]</span>
                          <div className="team-view-btn">
                            <img src="../images/icons/icon-eye.png" alt="Просмотр" className="view-icon" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`content-tab ${activeTab === 'rules' ? 'active' : ''}`} id="rules-tab">
                  {/* Регламент турнира */}
                  <div className="tournament-rules">
                    
                    {/* 1. Общие положения */}
                    <div className="rules-section">
                      <div className="section-header-rules">
                        <span className="section-number">1</span>
                        <h3 className="section-title-rules">Общие положения</h3>
                      </div>
                      <div className="rules-content">
                        <div className="rule-item">
                          <span className="rule-label">Турнир:</span>
                          <span className="rule-value">WEEKND CHALLENGE AWL FALL FIRST</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Дисциплина:</span>
                          <span className="rule-value">Battlefield 6 • Battle Royale</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Формат:</span>
                          <span className="rule-value">Командный • 4 игрока</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Даты:</span>
                          <span className="rule-value">Декабрь 2025 • 4 недели</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Организатор:</span>
                          <span className="rule-value">Arena Warborn League</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Участники и регистрация */}
                    <div className="rules-section">
                      <div className="section-header-rules">
                        <span className="section-number">2</span>
                        <h3 className="section-title-rules">Участники и регистрация</h3>
                      </div>
                      <div className="rules-content">
                        <div className="rule-item">
                          <span className="rule-label">Возраст:</span>
                          <span className="rule-value">16+ лет</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Регистрация:</span>
                          <span className="rule-value">До начала турнира • Командная</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Состав:</span>
                          <span className="rule-value">4 основных + 1 запасной</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Аккаунт:</span>
                          <span className="rule-value">Личный • Без нарушений</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Формат проведения */}
                    <div className="rules-section">
                      <div className="section-header-rules">
                        <span className="section-number">3</span>
                        <h3 className="section-title-rules">Формат проведения</h3>
                      </div>
                      <div className="rules-content">
                        <div className="rule-item">
                          <span className="rule-label">Этапы:</span>
                          <span className="rule-value">4 недели • 16 матчей</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Матчи:</span>
                          <span className="rule-value">4 в неделю • 25-30 минут</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Лобби:</span>
                          <span className="rule-value">20 команд • 80 игроков</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Победитель:</span>
                          <span className="rule-value">По сумме очков за сезон</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Система очков */}
                    <div className="rules-section">
                      <div className="section-header-rules">
                        <span className="section-number">4</span>
                        <h3 className="section-title-rules ">Система подсчета</h3>
                      </div>
                      <div className="scoring-system">
                        <div className="scoring-grid">
                          <div className="scoring-item">
                            <span className="placement">1 место</span>
                            <span className="points">+14</span>
                          </div>
                          <div className="scoring-item">
                            <span className="placement">2 место</span>
                            <span className="points">+9</span>
                          </div>
                          <div className="scoring-item">
                            <span className="placement">3 место</span>
                            <span className="points">+7</span>
                          </div>
                          <div className="scoring-item">
                            <span className="placement">4-6</span>
                            <span className="points">+5</span>
                          </div>
                          <div className="scoring-item">
                            <span className="placement">7-10</span>
                            <span className="points">+3</span>
                          </div>
                          <div className="scoring-item">
                            <span className="placement">11-15</span>
                            <span className="points">+2</span>
                          </div>
                          <div className="scoring-item">
                            <span className="placement">16-20</span>
                            <span className="points">+1</span>
                          </div>
                          <div className="scoring-item kills">
                            <span className="placement">Убийство</span>
                            <span className="points">+1</span>
                          </div>
                          <div className="scoring-item kills">
                            <span className="placement">Контракт</span>
                            <span className="points">+1</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Технические требования */}
                    <div className="rules-section">
                      <div className="section-header-rules">
                        <span className="section-number">5</span>
                        <h3 className="section-title-rules">Технические требования</h3>
                      </div>
                      <div className="rules-content">
                        <div className="rule-item">
                          <span className="rule-label">Пинг:</span>
                          <span className="rule-value">&lt; 100ms • Стабильное соединение</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Клиент:</span>
                          <span className="rule-value">Официальный • Последняя версия</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Запись экрана:</span>
                          <span className="rule-value">Обязательная для всех игроков</span>
                        </div>
                        <div className="rule-item">
                          <span className="rule-label">Скриншоты результатов:</span>
                          <span className="rule-value">От капитанов</span>
                        </div>
                      </div>
                    </div>

                    {/* 6. Запрещенные действия */}
                    <div className="rules-section">
                      <div className="section-header-rules">
                        <span className="section-number">6</span>
                        <h3 className="section-title-rules">Запрещенные действия</h3>
                      </div>
                      <div className="rules-content">
                        <div className="rule-item prohibited">
                          <span className="rule-label">Teaming:</span>
                          <span className="rule-value">Договорные матчи</span>
                        </div>
                        <div className="rule-item prohibited">
                          <span className="rule-label">Читы:</span>
                          <span className="rule-value">Любое ПО для преимущества</span>
                        </div>
                        <div className="rule-item prohibited">
                          <span className="rule-label">Stream sniping:</span>
                          <span className="rule-value">Использование трансляций</span>
                        </div>
                        <div className="rule-item prohibited">
                          <span className="rule-label">Баги:</span>
                          <span className="rule-value">Использование ошибок игры</span>
                        </div>
                        <div className="rule-item prohibited">
                          <span className="rule-label">Нецензурная лексика:</span>
                          <span className="rule-value">Вежливое поведение в чатах</span>
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

export default Tournaments;