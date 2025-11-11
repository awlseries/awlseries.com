import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { EmptyContacts, EmptyMatches, EmptyUpcomingMatches } from './EmptyState';

const TeamContent = ({ team, userRole }) => {
  // Проверяем есть ли предстоящие матчи
  const hasUpcomingMatches = team.upcomingMatches && team.upcomingMatches.length > 0;

  return (
    <div className="team-content-columns">
      {/* Левая колонка - теперь пустая, так как контакты и матчи перенесены в Header */}
      <div className="team-left-column">
        {/* Можно добавить другой контент здесь, если нужно */}
      </div>
      
      {/* Правая колонка - Предстоящие матчи */}
      <div className="team-right-column">
        {/* ПРЕДСТОЯЩИЕ МАТЧИ: используем EmptyUpcomingMatches когда нет матчей */}
        {!hasUpcomingMatches ? (
          <div className="upcoming-br-section empty-upcoming">
            <EmptyUpcomingMatches />
          </div>
        ) : (
          <div className="upcoming-br-section">
            <div className="upcoming-br-cards">
              {team.upcomingMatches.map((match, index) => (
                <UpcomingMatchCard key={index} match={match} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Карточка предстоящего матча
const UpcomingMatchCard = ({ match }) => (
  <div className="br-match-card-compact">
    <div className="br-match-content">
      <div className="br-match-tournament">
        <div className="br-match-gmt">GMT +5</div>
        <h4 className="mini-tournament-name">{match.tournamentShortName}</h4>
        <h4 className="mini-tournament-name">SERIES</h4>
        <img className="br-match-bg" src={match.tournamentImage} alt="mini-logo-tournament" />
      </div>
      <div className="br-game-info">
        <span className="br-game-name">Battlefield</span>
        <img src="/images/icons/icon-bf6-logo.png" alt="BF6" className="br-game-icon" />
      </div>
      <div className="br-match-datetime">
        <div className="br-match-date">
          {new Date(match.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
        </div>
        <div className="br-match-time">
          {new Date(match.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="br-match-mode">{match.mode}</div>
      </div>
    </div>
  </div>
);

export default TeamContent;