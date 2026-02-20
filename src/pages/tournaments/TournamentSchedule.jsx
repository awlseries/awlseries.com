import React from 'react';
import './tournaments.css';

const TournamentSchedule = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="tournament-schedule">
        <div className="schedule-placeholder">
          Расписание турнира пока не опубликовано
        </div>
      </div>
    );
  }

  // Группируем матчи по неделям
  const groupByWeek = (matches) => {
    const weeks = {};
    matches.forEach(match => {
      const week = match.week || 'Неделя 1';
      if (!weeks[week]) {
        weeks[week] = [];
      }
      weeks[week].push(match);
    });
    return weeks;
  };

  const weeks = groupByWeek(schedule);

  return (
    <div className="tournament-schedule">
      {Object.entries(weeks).map(([weekName, matches], weekIndex) => (
        <div key={weekIndex} className="schedule-week">
          <div className="week-header">
            <div className="week-title-section">
              <span className="week-name">{weekName}</span>
              {matches[0]?.dates && (
                <span className="week-dates">• {matches[0].dates}</span>
              )}
            </div>
            <span className="week-status">{matches[0]?.status || 'Скоро'}</span>
          </div>
          <div className="matches-grid">
            {matches.map((match, matchIndex) => (
              <div key={matchIndex} className="match-card">
                <div className="match-time">{match.time || '18:00'}</div>
                <div className="match-info">
                  <span className="match-name">{match.name || `Матч ${matchIndex + 1}`}</span>
                  {match.hasRecording ? (
                    <img 
                      src="../images/icons/icon-yt-tournament.png" 
                      alt="watch-game-awl" 
                      className="match-recording" 
                    />
                  ) : (
                    <img 
                      src="../images/icons/icon-yt-tournament.png" 
                      alt="match-no-record-awl" 
                      className="match-recording no-recording" 
                    />
                  )}
                </div>
                <div className="day-result">
                  {match.result || 'Результат'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentSchedule;