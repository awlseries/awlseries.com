import React from 'react';
import './tournaments.css';

const TournamentRules = ({ tournament }) => {
  if (!tournament) return null;

  // Безопасное получение данных из JSON полей
  const rules = tournament.rules || {};
  const scoringSystem = tournament.scoring_system || {};
  
  // Получаем систему подсчета очков
  const placements = scoringSystem.placements || {};
  const killsPoints = scoringSystem.kills || 0;
  const contractsPoints = scoringSystem.contracts || 0;

  // Данные для секций регламента
  const rulesSections = [
    {
      id: 1,
      number: "1",
      title: "Общие положения",
      rules: [
        { label: "Турнир:", value: tournament.name },
        { label: "Дисциплина:", value: `${tournament.game || 'BATTLEFIELD 6'} • ${tournament.discipline || 'Battle Royale'}` },
        { label: "Формат:", value: tournament.mode || 'Командный 4x4' },
        { label: "Даты:", value: "По расписанию турнира" },
        { label: "Организатор:", value: "Arena Warborn League" }
      ]
    },
    {
      id: 2,
      number: "2",
      title: "Участники и регистрация",
      rules: [
        { label: "Возраст:", value: rules.age_limit ? `${rules.age_limit}+ лет` : '16+ лет' },
        { label: "Регистрация:", value: "До начала турнира • Командная" },
        { label: "Состав:", value: `${rules.team_size || 4} основных + ${rules.substitute_players || 1} запасной` },
        { label: "Аккаунт:", value: "Личный • Без нарушений" }
      ]
    },
    {
      id: 3,
      number: "3",
      title: "Формат проведения",
      rules: [
        { label: "Этапы:", value: "По расписанию" },
        { label: "Матчи:", value: "По графику турнира" },
        { label: "Лобби:", value: `${tournament.max_teams || 16} команд • ${(tournament.max_teams || 16) * (tournament.max_players_per_team || 4)} игроков` },
        { label: "Победитель:", value: "По сумме очков за турнир" }
      ]
    },
    {
      id: 4,
      number: "4",
      title: "Система подсчета",
      scoring: true,
      scoringItems: [
        ...Object.entries(placements).map(([placement, points]) => ({
          placement,
          points: `+${points}`
        })),
        killsPoints > 0 && { 
          placement: "Убийство", 
          points: `+${killsPoints}`, 
          kills: true 
        },
        contractsPoints > 0 && { 
          placement: "Контракт", 
          points: `+${contractsPoints}`, 
          kills: true 
        }
      ].filter(Boolean)
    },
    {
      id: 5,
      number: "5",
      title: "Технические требования",
      rules: [
        { label: "Пинг:", value: "< 100ms • Стабильное соединение" },
        { label: "Клиент:", value: "Официальный • Последняя версия" },
        { label: "Запись экрана:", value: "Обязательная для всех игроков" },
        { label: "Скриншоты результатов:", value: "От капитанов" }
      ]
    },
    {
      id: 6,
      number: "6",
      title: "Запрещенные действия",
      rules: [
        { label: "Teaming:", value: "Договорные матчи", prohibited: true },
        { label: "Читы:", value: "Любое ПО для преимущества", prohibited: true },
        { label: "Stream sniping:", value: "Использование трансляций", prohibited: true },
        { label: "Баги:", value: "Использование ошибок игры", prohibited: true },
        { label: "Нецензурная лексика:", value: "Вежливое поведение в чатах", prohibited: true }
      ]
    }
  ];

  return (
    <div className="tournament-rules">
      {rulesSections.map(section => (
        <div key={section.id} className="rules-section">
          <div className="section-header-rules">
            <span className="section-number">{section.number}</span>
            <h3 className="section-title-rules">{section.title}</h3>
          </div>
          
          {section.scoring ? (
            <div className="scoring-system">
              <div className="scoring-grid">
                {section.scoringItems.map((item, index) => (
                  <div key={index} className={`scoring-item ${item.kills ? 'kills' : ''}`}>
                    <span className="placement">{item.placement}</span>
                    <span className="points">{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rules-content">
              {section.rules.map((rule, index) => (
                <div key={index} className={`rule-item ${rule.prohibited ? 'prohibited' : ''}`}>
                  <span className="rule-label">{rule.label}</span>
                  <span className="rule-value">{rule.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TournamentRules;