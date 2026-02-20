// PublicPlayerStats.jsx
import React from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import './PublicProfileInfo.css';


const PublicPlayerStats = ({ stats }) => {
  const { t } = useLanguage();

  // Функция проверки, есть ли какие-либо данные в статистике
  const hasAnyStats = (statsData) => {
    if (!statsData || typeof statsData !== 'object') return false;
    
    const values = Object.values(statsData);
    if (values.length === 0) return false;
    
    return values.some(value => {
      if (value == null) return false;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed !== '' && 
               trimmed.toLowerCase() !== 'null' && 
               trimmed.toLowerCase() !== 'undefined';
      }
      return true;
    });
  };

  // Функция для безопасного отображения значений
  const displayValue = (value) => {
    if (value === null || value === undefined || value === '') return t('stats.notAvailable');
    if (typeof value === 'string' && value.trim() === '') return t('stats.notAvailable');
    return value;
  };

  // Форматирование K/D ratio
  const formatKdRatio = (value) => {
    if (value === null || value === undefined) return t('stats.notAvailable');
    if (typeof value === 'number') return value.toFixed(2);
    return value;
  };

  // Если статистики нет или она пустая
  if (!stats || !hasAnyStats(stats)) {
    return (
      <div className="info-section">
        <h3 className="section-title">{t('stats.title')}</h3>
        <div className="info-block player-stats-block public-stats-block">
          {/* Заглушка с пустыми значениями */}
          <div className="player-stats-grid">
            <div className="player-stats-column">
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.kd')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.kills')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.assists')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.winRate')}</span>
                <span className="player-stat-value">-</span>
              </div>
            </div>
            
            <div className="player-stats-column">
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.rank')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.playTime')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.matches')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.favoriteWeapon')}</span>
                <span className="player-stat-value">-</span>
              </div>
            </div>
          </div>

          {/* Сообщение об отсутствии статистики */}
          <div className="player-stats-empty public-profile">
            <div className="player-stats-empty-content">
              <div className="no-stats-message">
                <img 
                  src="/images/icons/icon-warning-skull.png" 
                  alt={t('stats.noStats')} 
                  className="no-stats-icon"
                />
                <p className="no-stats-text">{t('stats.noPublicStats')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если статистика есть - отображаем её
  return (
    <div className="info-section">
      <h3 className="section-title">{t('stats.title')}</h3>
      <div className="info-block player-stats-block">
        <div className="player-stats-grid">
          {/* Левая колонка */}
          <div className="player-stats-column">
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.kd')}</span>
              <span className="player-stat-value">
                {formatKdRatio(stats.kdRatio)}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.kills')}</span>
              <span className="player-stat-value">
                {displayValue(stats.kills)}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.assists')}</span>
              <span className="player-stat-value">
                {displayValue(stats.assists)}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.winRate')}</span>
              <span className="player-stat-value">
                {displayValue(stats.winrate)}
                {stats.winrate ? '%' : ''}
              </span>
            </div>
          </div>
          
          {/* Правая колонка */}
          <div className="player-stats-column">
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.rank')}</span>
              <span className="player-stat-value">
                {displayValue(stats.rank)}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.playTime')}</span>
              <span className="player-stat-value">
                {displayValue(stats.playtime)}
                {stats.playtime ? ` ${t('stats.playTimeValue')}` : ''}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.matches')}</span>
              <span className="player-stat-value">
                {displayValue(stats.matches)}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.favoriteWeapon')}</span>
              <span className="player-stat-value">
                {displayValue(stats.favoriteWeapon)}
              </span>
            </div>
          </div>
        </div>

        {/* Дополнительная информация, если нужно */}
        {stats.headshots && (
          <div className="player-stats-footer">
            <div className="player-stat-item inline">
              <span className="player-stat-label">{t('stats.headshots')}:</span>
              <span className="player-stat-value">{stats.headshots}</span>
            </div>
            {stats.accuracy && (
              <div className="player-stat-item inline">
                <span className="player-stat-label">{t('stats.accuracy')}:</span>
                <span className="player-stat-value">{stats.accuracy}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPlayerStats;