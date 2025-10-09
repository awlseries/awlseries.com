import React, { useState } from 'react';

const Teams = () => {
  const [expandedDivision, setExpandedDivision] = useState(null);

  const toggleDivision = (divisionId) => {
    setExpandedDivision(expandedDivision === divisionId ? null : divisionId);
  };

  // Вспомогательная функция для создания рядов
  const createTeamRows = (teams, rowSize = 5) => {
    const rows = [];
    for (let i = 0; i < teams.length; i += rowSize) {
      const row = teams.slice(i, i + rowSize);
      // Добиваем ряд до rowSize пустыми ячейками
      while (row.length < rowSize) {
        row.push({ 
          id: `empty-${rows.length}-${row.length}`, 
          logo: '../public/images/icons/icon-empty-slot-team.png', 
          name: 'Свободный слот', 
          isEmpty: true 
        });
      }
      rows.push(row);
    }
    return rows;
  };

  const divisions = [
    {
      id: 'division1',
      name: 'STAR LADDER L3',
      subtitle: 'Дивизион I ранга',
      tmrr: '3500+',
      teams: '0',
      newTeams: '-',
      type: 'assault',
      icon: '../public/images/icons/icon-division-starladder.png',
      teamsData: createTeamRows([
        { id: 1, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 2, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 3, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 4, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 5, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 6, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 7, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 8, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 9, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 10, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true }
      ])
    },
    {
      id: 'division2',
      name: 'SLAYGER L1',
      subtitle: 'Дивизион II ранга',
      tmrr: '2000+',
      teams: '0',
      newTeams: '-',
      type: 'special',
      icon: '../public/images/icons/icon-division-slayger.png',
      teamsData: createTeamRows([
        { id: 1, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 2, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 3, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 4, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 5, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 5, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true }
      ])
    },
    {
      id: 'division3',
      name: 'VANGUARD L1',
      subtitle: 'Дивизион III ранга',
      tmrr: '500+',
      teams: '0',
      newTeams: '-',
      type: 'vanguard',
      icon: '../public/images/icons/icon-division-vanguard.png',
      teamsData: createTeamRows([
        { id: 1, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 2, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 3, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 4, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 5, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true },
        { id: 5, logo: '../public/images/icons/icon-empty-slot-team.png', name: 'Свободный слот', isEmpty: true }
        // Меньше команд для демонстрации
      ])
    }
  ];

  const rewards = [
    {
      icon: '../public/images/icons/icon-contract.png',
      title: 'СПОНСОРСКИЕ КОНТРАКТЫ',
      items: [
        'Контракты с игровыми организациями',
        'Спонсорство оборудования и экипировки',
        'Медийные контракты и стриминговые сделки',
        'Эксклюзивные партнерства с лигой'
      ]
    },
    {
      icon: '../public/images/icons/icon-awards.png',
      title: 'БОЕВЫЕ НАГРАДЫ',
      items: [
        'Призовые фонды до $1,000 за сезон на старте лиги',
        'Уникальные медали за победы в сезонах',
        'Сезонные жетоны за каждое участие',
        'Знаки отличия для профиля игрока',
        'Бонусы за приглашение напарников',
        'Гарантированные призы за первенство в команде и соло'
      ]
    },
    {
      icon: '../public/images/icons/icon-quotes.png',
      title: 'ПРИВИЛЕГИРОВАННЫЕ КВОТЫ',
      items: [
        'Автоматическая квалификация в Majors',
        'Приоритетные слоты в больших турнирах',
        'Эксклюзивный доступ к закрытым событиям',
        'Квоты на серию чемпионатов лиги'
      ]
    },
    {
      icon: '../public/images/icons/icon-up-career.png',
      title: 'КАРЬЕРНЫЙ РОСТ',
      items: [
        'Участие в скаутских программах',
        'Доступ к тренировочным сессиям',
        'Менторство от профессиональных игроков',
        'Возможности для стриминговой карьеры'
      ]
    }
  ];

  const futureFeatures = [
    {
      icon: '../public/images/icons/icon-shesterenka.png',
      title: 'Сезонные крупные турниры:',
      description: 'Ежеквартальные чемпионские события с увеличенными призовыми фондами и специальными наградами'
    },
    {
      icon: '../public/images/icons/icon-shesterenka.png',
      title: 'Глобальные таблицы лидеров:',
      description: 'Рейтинги в реальном времени с региональными и мировыми позициями'
    },
    {
      icon: '../public/images/icons/icon-shesterenka.png',
      title: 'Система объявлений от капитанов',
      description: 'Поиски тиммейтов в новым команды внутри лиги качественно упростится'
    },
    {
      icon: '../public/images/icons/icon-shesterenka.png',
      title: 'Поиск тренировочных матчей:',
      description: 'Автоматизированная система для поиска тренировочных игр против соперников равного уровня'
    },
    {
      icon: '../public/images/icons/icon-shesterenka.png',
      title: 'Система оплаты в валюте и криптовалюте:',
      description: 'Внедрение сервисов для платежей по всему миру'
    },
    {
      icon: '../public/images/icons/icon-shesterenka.png',
      title: 'Интегрированные трансляции:',
      description: 'Транслирование матчей игроков напрямую на платформы AWL с оверлеями'
    }
  ];

  return (
    <div>
      {/* Герой-секция с описанием */}

      <section className="divisions-hero">
        <h1 className="divisions-title">СИСТЕМА ДИВИЗИОНОВ AWL SERIES S1</h1>
        <p className="divisions-subtitle">
          Продемонстрируйте свои навыки в лучшем соревновательном опыте из популярных режимов Battlefield. 
          Поднимайтесь по рангам, получайте престижные награды и создайте свое наследие 
          в интернациональной соревновательной системе Arena Warborn League.
        </p>
      </section>

      {/* Система рейтинга */}

      <section className="rating-system">
        <h2 className="section-title">СТРУКТУРА РЕЙТИНГА И НАГРАД</h2>
        <p className="system-description">
          Наша соревновательная система создана для признания и вознаграждения мастерства, 
          преданности и стратегического превосходства. Зарабатывайте очки TMMR (Team Match Making Rating) 
          через соревновательные матчи, серии турниров и открытых кубков. Поднимайтесь по дивизионам и открывайте эксклюзивные 
          боевые достижения AWL. Каждый сезон приносит новые вызовы и престижные награды для лучших команд и MVP.
        </p>
        
        <div className="rewards-section">
          {rewards.map((reward, index) => (
            <div key={index} className="reward-card">
              <img src={reward.icon} alt={reward.title} className="reward-icon-division" />
              <h3 className="reward-title">{reward.title}</h3>
              <div className="reward-details">
                <ul className="reward-list">
                  {reward.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Контейнер дивизионов */}

<div className="divisions-container">
  {divisions.map((division) => (
    <div key={division.id} className="division-with-icon">
      {/* Используйте division.icon вместо шаблонной строки */}
      <img 
        src={division.icon} 
        alt={`${division.name} icon`}
        className="division-external-icon"
      />
      
      {/* Существующий division-wrapper */}

      <div className={`division-wrapper division-${division.type}`}>
        <div 
          className={`division-header ${expandedDivision === division.id ? '' : 'collapsed'}`}
          onClick={() => toggleDivision(division.id)}
        >
          <div className="division-info">
            <div className="division-title">
              <h2 className="division-name">{division.name}</h2>
              <span className="division-subtitle">{division.subtitle}</span>
            </div>
          </div>
          <div className="division-stats">
            <div className="division-stat">
              <span className="stat-label">TMMR:</span>
              <span className="stat-value">{division.tmrr}</span>
            </div>
            <div className="division-stat">
              <span className="stat-label">Команды:</span>
              <span className="stat-value">{division.teams}</span>
            </div>
            <div className="division-stat">
              <span className="stat-label">Новые составы (30д):</span>
              <span className="stat-value">{division.newTeams}</span>
            </div>
          </div>
          <img 
            src="../public/images/icons/icon-updown.png" 
            alt="Развернуть" 
            className={`division-toggle ${expandedDivision === division.id ? '' : 'collapsed'}`}
          />
        </div>

         {/* ОБНОВЛЕННЫЙ КОНТЕНТ С ГРИДОМ КОМАНД */}
              <div 
                className={`division-content ${expandedDivision === division.id ? '' : 'collapsed'}`} 
                id={division.id}
              >
                {expandedDivision === division.id && division.teamsData && (
                  <div className="teams-grid">
                    {division.teamsData.map((row, rowIndex) => (
                      <div key={rowIndex} className="team-row">
                        {row.map((team) => (
                          <div 
                            key={team.id} 
                            className={`team-cell ${team.isEmpty ? 'empty' : ''}`}
                          >
                            <img 
                              src={team.logo} 
                              alt={team.name} 
                              className={`team-logo ${team.isEmpty ? 'empty-slot-icon' : ''}`}
                            />
                            <div className="team-info">
                              {team.isEmpty ? (
                                'Свободный слот'
                              ) : (
                                <button className="team-view-btn">
                                  <img 
                                    src="../public/images/icons/icon-eye.png" 
                                    alt="Просмотр команды" 
                                    className="team-view-icon"
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Будущие возможности */}

      <section className="future-features">
        <h2 className="section-title">БУДУЩИЕ СОРЕВНОВАТЕЛЬНЫЕ ВОЗМОЖНОСТИ</h2>
        <div className="features-grid">
          {futureFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <img src={feature.icon} alt="icon-divisions-futures" className="feature-icon" />
              <p className="feature-text">
                <span className="feature-text-span">{feature.title}</span> {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Teams;