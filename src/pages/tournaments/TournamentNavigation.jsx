import React from 'react';

const TournamentNavigation = ({ activeTab, handleTabClick }) => {
  return (
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
  );
};

export default TournamentNavigation;