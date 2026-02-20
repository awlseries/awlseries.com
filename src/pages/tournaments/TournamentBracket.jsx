import React from 'react';
import './tournaments.css';

const TournamentBracket = ({ standings }) => {
  if (!standings || standings.length === 0) {
    return (
      <div className="leaderboard-table">
        <div className="table-header-wsow">
          <div className="col-rank">#</div>
          <div className="col-logo"></div>
          <div className="col-team">Команда</div>
          <div className="col-total">Счет</div>
          <div className="col-kills">Убийства</div>
          <div className="col-stats">Позиции в матчах</div>
        </div>
        <div className="bracket-placeholder">
          Турнир еще не начался или нет данных о результатах
        </div>
      </div>
    );
  }

  // Функция для форматирования позиций в матчах
  const formatPerformance = (performance) => {
    if (!performance || !Array.isArray(performance)) return [];
    
    return performance.map(pos => {
      if (pos === 1) return '1st';
      if (pos === 2) return '2nd';
      if (pos === 3) return '3rd';
      return `${pos}th`;
    });
  };

  return (
    <div className="leaderboard-table">
      <div className="table-header-wsow">
        <div className="col-rank">#</div>
        <div className="col-logo"></div>
        <div className="col-team">Команда</div>
        <div className="col-total">Счет</div>
        <div className="col-kills">Убийства</div>
        <div className="col-stats">Позиции в матчах</div>
      </div>
      
      {standings.map((standing, index) => {
        const team = standing.tournament_teams;
        const performance = formatPerformance(standing.performance);
        
        return (
          <div key={standing.id} className={`table-row-wsow ${index === 0 ? 'champion' : ''}`}>
            <div className="col-rank">
              <span className="rank-number">{standing.rank || index + 1}</span>
              {index === 0 && (
                <img src="../images/icons/icon-tournament-arrow.png" alt="" className="rank-arrow" />
              )}
            </div>
            <div className="col-logo">
              <img 
                src={team?.team_logo || '../images/icons/logo-opponent.png'} 
                alt={`${team?.team_name || 'Team'}-logo`} 
                className="team-logo-tournaments" 
              />
            </div>
            <div className="col-team">
              <div className="team-info">
                <div className="team-name-wrapper">
                  {/* Флаг можно добавить позже, если будет в данных */}
                  <span className="team-name-tournament">{team?.team_name || `Команда ${index + 1}`}</span>
                </div>
                <span className="team-players">
                  {team?.players ? team.players.join(' | ') : 'Состав не указан'}
                </span>
              </div>
            </div>
            <div className="col-total">
              <span className="total-points">{standing.points || 0}</span>
            </div>
            <div className="col-kills">
              <span className="kills-count">{standing.kills || 0}</span>
              <img src="../images/icons/icon-kills.png" alt="kills-icon" className="kills-icon" />
            </div>
            <div className="col-stats">
              <div className="match-performance">
                {performance.length > 0 ? (
                  performance.map((match, matchIndex) => (
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
                  ))
                ) : (
                  <span className="match-result">—</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TournamentBracket;