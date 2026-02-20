import React, { useState } from 'react';
import TournamentNavigation from './TournamentNavigation';
import TournamentBracket from './TournamentBracket';
import TournamentSchedule from './TournamentSchedule';
import TournamentParticipants from './TournamentParticipants';
import TournamentRules from './TournamentRules';
import './tournaments.css';

const TournamentDetails = ({ tournament }) => {
  const [activeTab, setActiveTab] = useState('bracket');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  
  const handlePartnerClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'bracket':
        return <TournamentBracket standings={tournament?.standings} />;
      case 'schedule':
        return <TournamentSchedule schedule={tournament?.schedule} />;
      case 'participants':
        return <TournamentParticipants teams={tournament?.teams} />;
      case 'rules':
        return <TournamentRules tournament={tournament} />;
      default:
        return <TournamentBracket standings={tournament?.standings} />;
    }
  };

  if (!tournament) return null;

  // Безопасное получение данных из JSON полей
  const rules = tournament.rules || {};
  const scoringSystem = tournament.scoring_system || {};
  const partners = tournament.partners || [];

  return (
    <div className="tournament-bottom-block">
      {/* Левая часть - описание турнира */}
      <div className="tournament-info-section">
        <div className="info-block-tournament">
          <h3 className="info-title-tournament">О турнире</h3>
          <p className="info-description-tournament">
            {tournament.description || 'Описание турнира пока не добавлено.'}
          </p>
        </div>
        
        <div className="info-block-tournament">
          <h3 className="info-title-tournament">В перспективе</h3>
          <p className="info-description-tournament">
            Регулярное участие в турнирах открывает путь в более серьезные серии игр — 
            лучшие команды получают квоты в верхних дивизионах лиги. 
            Каждый этап — это новый шаг к совершенствованию.
          </p>
        </div>
        
        <div className="game-details">
          <div className="detail-item">
            <span className="detail-label">Игра:</span>
            <span className="detail-value">{tournament.game || 'Не указана'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Дисциплина:</span>
            <span className="detail-value">{tournament.discipline || 'Не указана'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Режим:</span>
            <span className="detail-value">{tournament.mode || 'Не указан'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Карта:</span>
            <span className="detail-value">{tournament.map || 'Не указана'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Лимит команд:</span>
            <span className="detail-value">{tournament.max_teams || 'Нет данных'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Игроков в команде:</span>
            <span className="detail-value">{tournament.max_players_per_team || 'Нет данных'}</span>
          </div>
          {rules.age_limit && (
            <div className="detail-item">
              <span className="detail-label">Возрастное ограничение:</span>
              <span className="detail-value">{rules.age_limit}+ лет</span>
            </div>
          )}
        </div>
        
        {/* Партнеры - динамические данные */}
        {partners.length > 0 && (
          <div className="partners-block">
            <h4 className="partners-title">Партнеры:</h4>
            <div className="partners-icons">
              {partners.map((partner, index) => (
                <img 
                  key={index}
                  src={partner.logo} 
                  alt={partner.name} 
                  className="partner-icon"
                  onClick={() => handlePartnerClick(partner.url)}
                  style={{ cursor: partner.url ? 'pointer' : 'default' }}
                  title={partner.url ? `Перейти на сайт ${partner.name}` : partner.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Правая часть - детали турнира */}
      <div className="tournament-details-section">
        <div className="details-content-container">
          <TournamentNavigation activeTab={activeTab} handleTabClick={handleTabClick} />
          
          <div className="details-content">
            <div className={`content-tab ${activeTab === 'bracket' ? 'active' : ''}`} id="bracket-tab">
              {renderActiveTab()}
            </div>
            <div className={`content-tab ${activeTab === 'schedule' ? 'active' : ''}`} id="schedule-tab">
              {renderActiveTab()}
            </div>
            <div className={`content-tab ${activeTab === 'participants' ? 'active' : ''}`} id="participants-tab">
              {renderActiveTab()}
            </div>
            <div className={`content-tab ${activeTab === 'rules' ? 'active' : ''}`} id="rules-tab">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;