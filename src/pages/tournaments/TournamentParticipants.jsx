import React from 'react';
import './tournaments.css';

const TournamentParticipants = ({ teams }) => {
  if (!teams || teams.length === 0) {
    return (
      <div className="participants-container">
        <div className="participants-placeholder">
          Пока нет зарегистрированных команд
        </div>
      </div>
    );
  }

  return (
    <div className="participants-container">
      <div className="participants-grid">
        {teams.map((team, index) => (
          <div key={team.id} className="participant-team">
            <div className="team-logo-participant">
              <img 
                src={team.team_logo || '../images/icons/logo-opponent.png'} 
                alt={`${team.team_name} Team`} 
              />
            </div>
            <span className="team-name-participant">{team.team_name}</span>
            {team.team_tag && (
              <span className="team-tag-tournament">[{team.team_tag}]</span>
            )}
            <div className="team-view-btn">
              <img src="../images/icons/icon-eye.png" alt="Просмотр" className="view-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentParticipants;