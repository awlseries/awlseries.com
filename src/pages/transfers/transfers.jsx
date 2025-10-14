import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';

const Transfers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'kd', direction: 'desc' });
  const { t } = useLanguage();

  useEffect(() => {
    loadFreeAgents();
  }, []);

  const loadFreeAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('battlefield_nickname', 'is', null)
        .order('mmr', { ascending: false });

      if (error) {
        throw error;
      }

       // Дополнительная фильтрация на клиенте для пустых строк
    const filteredData = data?.filter(player => 
      player.battlefield_nickname && 
      player.battlefield_nickname.trim() !== ''
    ) || [];

    setPlayers(filteredData);
  } catch (error) {
    console.error('Ошибка загрузки свободных агентов:', error);
  } finally {
    setLoading(false);
  }
};

  // Функция для отображения статистики
  const displayStat = (player, statName) => {
    if (!player.stats) {
      return t('stats.notAvailable');
    }
    
    const value = player.stats[statName];
    
    if (value === undefined || value === null || value === '') {
      return t('stats.notAvailable');
    }
    
    return value;
  };

  // Функция для отображения времени игры
  const displayPlayTime = (player) => {
    if (!player.stats) {
      return t('stats.notAvailable');
    }
    
    const value = player.stats.playTime;
    
    if (value === undefined || value === null || value === '') {
      return t('stats.notAvailable');
    }
    
    return value;
  };

  // Функция для отображения MMR
  const displayMMR = (player) => {
    if (player.mmr === undefined || player.mmr === null || player.mmr === 0) {
      return t('stats.notAvailable');
    }
    
    return player.mmr;
  };

  // Функция сортировки
  const handleSort = useCallback((key) => {
  // Отключаем сортировку по номеру
  if (key === 'number') return;
  
  let direction = 'asc';
  
 if (sortConfig.key === key) {
    direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
  }
  
  setSortConfig({ key, direction });
}, [sortConfig]);

  // Сортировка игроков
  const sortedPlayers = useCallback(() => {
    if (!sortConfig.key) return players;

    return [...players].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {

        case 'class':
          aValue = a.player_class || 'assault';
          bValue = b.player_class || 'assault';
          break;

        case 'nickname':
          aValue = a.battlefield_nickname || '';
          bValue = b.battlefield_nickname || '';
          break;

        case 'kd':
          aValue = a.stats?.kdRatio || 0;
          bValue = b.stats?.kdRatio || 0;
          break;

        case 'mmr':
          aValue = a.mmr || 0;
          bValue = b.mmr || 0;
          break;

        case 'playtime':
          aValue = parseInt(a.stats?.playTime?.replace('ч', '') || 0);
          bValue = parseInt(b.stats?.playTime?.replace('ч', '') || 0);
          break;

        default:
          return 0;
      }

      // Сравнение значений
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [players, sortConfig]);

  // Обработчик клика по кнопке "Подробнее"
  const handlePlayerDetails = (nickname) => {
    alert(`${t('playerInfo')}: ${nickname}`);
  };

  // Функция для получения класса иконки сортировки
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="content-index-transfers">
      <div className="centered-container">
        
        <div className="top-block">
            <div className="top-left-block">
                <h2>{t('freeAgents')}</h2>
                <p>{t('freeAgentsDescription')}</p>
            </div>
            <div className="top-right-block">
                <div className="stat-block">
                    <h3>{players.length}</h3>
                    <p>{t('freeAgentsCount')}</p>
                </div>
                <div className="stat-block">
                    <h3>24/7</h3>
                    <p>{t('searchPartners')}</p>
                </div>
                <div className="stat-block">
                    <h3>50+</h3>
                    <p>{t('formedTeams')}</p>
                </div>
            </div>
        </div>

        <div className="middle-block">
            <div className="players-block">
              <h3 className="block-title">{t('allPlayers')}</h3>
            </div>
            <div className="data-block">
              <h3 className="block-title">{t('data')}</h3>
            </div>
        </div>

        <div className="bottom-block">
            <div className="filters-container">
              <div className="filters-block-left">
                <div 
                  className={`filter-item ${sortConfig.key === 'number' ? 'active' : ''}`} 
                  data-filter="number"
                  onClick={() => handleSort('number')}
                >
                  # {getSortIcon('number')}
                </div>
                <div 
                  className={`filter-item ${sortConfig.key === 'class' ? 'active' : ''}`} 
                  data-filter="class"
                  onClick={() => handleSort('class')}
                >
                  {t('class')} {getSortIcon('class')}
                </div>
                <div 
                  className={`filter-item ${sortConfig.key === 'nickname' ? 'active' : ''}`} 
                  data-filter="nickname"
                  onClick={() => handleSort('nickname')}
                >
                  {t('nickname')} {getSortIcon('nickname')}
                </div>
              </div>
              <div className="filters-block-right">
                <div 
                  className={`filter-item ${sortConfig.key === 'kd' ? 'active' : ''}`} 
                  data-filter="kd"
                  onClick={() => handleSort('kd')}
                >
                  {t('kd')} {getSortIcon('kd')}
                </div>
                <div 
                  className={`filter-item ${sortConfig.key === 'mmr' ? 'active' : ''}`} 
                  data-filter="mmr"
                  onClick={() => handleSort('mmr')}
                >
                  MMR {getSortIcon('mmr')}
                </div>
                <div 
                  className={`filter-item ${sortConfig.key === 'playtime' ? 'active' : ''}`} 
                  data-filter="playtime"
                  onClick={() => handleSort('playtime')}
                >
                  {t('playTime')} {getSortIcon('playtime')}
                </div>
              </div>
            </div>
            
            <div className="players-container">
              {loading ? (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>{t('loading')}</p>
    </div>
              ) : (
                sortedPlayers().map((player, index) => (
                  <div className="player-row" key={player.id}>
                    <div className="player-number">
          {sortConfig.key ? index + 1 : players.indexOf(player) + 1}
        </div>
                    <div className="player-class">
                      <img 
                        src={`/images/icons/icon-class-${player.player_class || 'assault'}.png`} 
                        alt={player.player_class || 'assault'} 
                        className="class-icon"
                      />
                    </div>
                    <div className="player-nickname">{player.battlefield_nickname}</div>
                    <div className="player-kd">{displayStat(player, 'kdRatio')}</div>
                    <div className="player-mmr">{displayMMR(player)}</div>
                    <div className="player-playtime">{displayPlayTime(player)}</div>
                    <button 
                      className="player-details-btn"
                      onClick={() => handlePlayerDetails(player.battlefield_nickname)}
                    >
                      {t('details')}
                    </button>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Transfers;