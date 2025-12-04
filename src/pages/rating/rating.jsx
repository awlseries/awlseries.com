import { useState, useEffect, useCallback } from 'react';
import SEO from '../../components/Seo/Seo';
import { showSingleNotification } from '/utils/notifications';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';
import './rating.css';

const Rating = () => {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const { t } = useLanguage();

  const playersPerPage = 20;

  // -------------------------------------------------------------------------------------------- Загрузка данных игроков (loadPlayersData)

  const loadPlayersData = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setCurrentPage(page);

      // Базовый запрос для подсчета
      let countQuery = supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Базовый запрос для данных
      let dataQuery = supabase
        .from('users')
        .select('*')
        .order('mmr', { ascending: false })
        .range((page - 1) * playersPerPage, page * playersPerPage - 1);

      // Применяем фильтры если они выбраны
      if (divisionFilter !== 'all') {
        countQuery = countQuery.eq('division', divisionFilter);
        dataQuery = dataQuery.eq('division', divisionFilter);
      }

      const [{ count, error: countError }, { data: playersData, error }] = await Promise.all([
        countQuery,
        dataQuery
      ]);

      if (countError) throw countError;
      if (error) throw error;

      setTotalPlayers(count || 0);
      setPlayers(playersData || []);
      setFilteredPlayers(playersData || []);
      
    } catch (error) {
      showSingleNotification(t('notifications.general_error'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [divisionFilter, playersPerPage]);

  //----------------------------------------------------------------------------------------------- Поиск игроков (searchPlayers)

  const searchPlayers = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredPlayers(players);
      return;
    }

    const filtered = players.filter(player =>
      player.battlefield_nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlayers(filtered);

    if (searchTerm && filtered.length === 0) {
      showSingleNotification(t('rating.no_players_found'), 'warning');
    } else if (searchTerm) {
      showSingleNotification(t('rating.players_found', { count: filtered.length }), 'success');
    }
  }, [searchTerm, players]);

  // --------------------------------------------------------------------------------------------------- Поиск своей позиции (findMyPosition)

  const findMyPosition = useCallback(async () => {
    try {
      // Для авторизованных пользователей
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: player, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error || !player) {
          findMyPositionByNickname();
          return;
        }
        
        await scrollToPlayerPosition(player);
      } else {
        findMyPositionByNickname();
      }
    } catch (error) {
      showSingleNotification(t('rating.position_error'), 'error');
    }
  }, []);

  // ----------------------------------------------------------------------------------------------- Поиск своей позиции (findMyPositionByNickname)

  const findMyPositionByNickname = useCallback(async () => {
    const userNickname = prompt(t('rating.enter_nickname'));
    
    if (!userNickname) return;

    try {
      const { data: players, error } = await supabase
        .from('users')
        .select('*')
        .ilike('battlefield_nickname', `%${userNickname}%`)
        .order('mmr', { ascending: false });

      if (error) throw error;
      
      if (players.length === 0) {
        showSingleNotification(t('rating.player_not_found'), 'error');
        return;
      }
      
      let player;
      if (players.length > 1) {
        const playerNames = players.map((p, index) => 
          `${index + 1}. ${p.battlefield_nickname}${p.team && p.team !== 'free agent' ? ` (${p.team})` : ''}  - MMR: ${p.mmr}`
        ).join('\n');
        
        const choice = prompt(t('rating.multiple_players_found', { players: playerNames }));
        const index = parseInt(choice) - 1;
        
        if (isNaN(index) || index < 0 || index >= players.length) {
          showSingleNotification(t('rating.invalid_choice'), 'error');
          return;
        }
        
        player = players[index];
      } else {
        player = players[0];
      }
      
      await scrollToPlayerPosition(player);
    } catch (error) {
      showSingleNotification(t('rating.search_error'), 'error');
    }
  }, []);

  // ------------------------------------------------------------------------------------- Прокрутка к позиции (scrollToPlayerPosition)

  const scrollToPlayerPosition = useCallback(async (player) => {
    const { data: allPlayers, error } = await supabase
      .from('users')
      .select('id, mmr')
      .order('mmr', { ascending: false });
      
    if (error) throw error;
    
    const myPosition = allPlayers.findIndex(p => p.id === player.id) + 1;
    const targetPage = Math.ceil(myPosition / playersPerPage);
    
    if (targetPage !== currentPage) {
      await loadPlayersData(targetPage);
    }
    
    // Прокрутка будет выполнена после обновления DOM
    setTimeout(() => {
      const playerRow = document.querySelector(`[data-player-id="${player.id}"]`);
      
      if (playerRow) {
        playerRow.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Временное выделение
        playerRow.style.background = 'rgba(255, 102, 0, 0.3)';
        playerRow.style.borderLeft = '4px solid #ff6600';
        
        setTimeout(() => {
          playerRow.style.background = '';
          playerRow.style.borderLeft = '';
        }, 4000);
      }
      
      showSingleNotification(
        t('rating.position_found', { position: myPosition, nickname: player.battlefield_nickname, mmr: player.mmr }), 'success');
    }, 500);
  }, [currentPage, loadPlayersData, playersPerPage]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setDivisionFilter('all');
    loadPlayersData(1);
    showSingleNotification(t('rating.filters_reset'), 'info');
  }, [loadPlayersData]);

  // -------------------------------------------------------------------------------------------- Пагинация

  const totalPages = Math.ceil(totalPlayers / playersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      loadPlayersData(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      loadPlayersData(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    loadPlayersData(page);
  };

  // Эффекты
  useEffect(() => {
    loadPlayersData(1);
  }, [loadPlayersData]);

  useEffect(() => {
    searchPlayers();
  }, [searchPlayers]);

  // Генерация номеров страниц для пагинации
  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    if (startPage > 1) {
      pages.push(
        <span key={1} className="rating-page-number active" onClick={() => handlePageClick(1)}>
          1
        </span>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="rating-page-ellipsis">...</span>);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <span 
          key={i} 
          className={`rating-page-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </span>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="rating-page-ellipsis">...</span>);
      }
      pages.push(
        <span 
          key={totalPages} 
          className="rating-page-number"
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </span>
      );
    }
    
    return pages;
  };

  // ------------------------------------------------------------------------------------------ Рендеринг игроков (renderPlayerRow)

  const renderPlayerRow = (player, index) => {
    const rank = (currentPage - 1) * playersPerPage + index + 1;
    const winrateClass = player.win_rate >= 50 ? 'positive' : 'negative';
    
    return (
      <div 
        key={player.id} 
        className={`rating-player-row ${rank <= 3 ? 'top-3' : ''}`}
        data-player-id={player.id}
      >
        <div className="rating-col-rank">{rank}</div>
        <div className="rating-col-player">
          <div className="rating-player-avatar">
            <img 
              src={player.avatar_url || '../images/other/team-player-empty.png'} 
              alt={player.battlefield_nickname}
              onError={(e) => {
                e.target.src = '../images/other/team-player-empty.png';
              }}
            />
          </div>
          <div className="rating-player-info">
            <div className="rating-player-nickname">{player.battlefield_nickname}</div>
            <div className="rating-player-realname">{player.fullname || ''}</div>
          </div>
        </div>
        <div className="rating-col-team">
  {player.team && player.team !== 'free agent' && (
    <div className="rating-team-logo-small">
    </div>
  )}
  <div className="rating-team-name">
    {player.team && player.team !== 'free agent' ? player.team : t('rating.no_team')}
  </div>
</div>
        <div className="rating-col-mmr">{player.mmr || 0}</div>
        <div className="rating-col-kd">{player.kd_ratio || '0.00'}</div>
        <div className={`rating-col-winrate ${winrateClass}`}>{player.win_rate || 0}%</div>
        <div className="rating-col-matches">{player.matches_played || 0}</div>
      </div>
    );
  };

  // ------------------------------------------------------------------------------------------ HTML -----------------------------------

  return (
    <>
      <SEO 
        title="AWL Battlefield 6 Best Players Rankings - MMR & Statistics"
        description="Check Battlefield 6 player rankings, MMR ratings, and detailed statistics. Track your progress in the competitive BF6 esports ladder."
        keywords="awl rating, bf6 rankings, battlefield 6 rating, player stats, MMR, esports ladder"
        canonicalUrl="/rating"
      />
      
      <section className="rating-hero">
        <div className="rating-container">
          
          <div className="rating-controls">
            <div className="rating-search-control">
              <input 
                type="text" 
                className="rating-player-search" 
                placeholder={t('rating.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="rating-search-btn">
                <img src="/images/icons/icon-searching.png" alt="search-player-on-awl" />
              </button>
            </div>
            <div className="rating-filter-controls">
              <select 
                className="rating-filter-select" 
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
              >
                <option value="all">{t('rating.division_filter_all')}</option>
                <option value="assault">{t('rating.division_filter_assault')}</option>
                <option value="special">{t('rating.division_filter_special')}</option>
                <option value="vanguard">{t('rating.division_filter_vanguard')}</option>
              </select>
              <button 
                className="rating-my-position-btn" 
                onClick={findMyPosition}
                disabled={isLoading}
              >
                {isLoading ? t('rating.searching') : t('rating.my_position')}
              </button>
              <button className="rating-reset-filters" onClick={resetFilters}>
                {t('rating.reset_filters')}
              </button>
            </div>
          </div>

          <div className="rating-table-container">
            <div className="rating-table-header">
              <div className="rating-col-rank">#</div>
              <div className="rating-col-player">{t('rating.player')}</div>
              <div className="rating-col-team">{t('rating.team')}</div>
              <div className="rating-col-mmr">{t('rating.mmr')}</div>
              <div className="rating-col-kd">{t('rating.kd')}</div>
              <div className="rating-col-winrate">{t('rating.winrate')}</div>
              <div className="rating-col-matches">{t('rating.matches')}</div>
            </div>
            
            <div className="rating-table-body">
              {isLoading ? (
                <div className="loading-container">
                <div className="spinner">
                  <div className="spinner-circle"></div></div>
                <p>{t('rating.loading_data')}</p></div>
              ) : filteredPlayers.length === 0 ? (
                <div className="no-players-message">{t('rating.no_players')}</div>
              ) : (
                filteredPlayers.map((player, index) => renderPlayerRow(player, index))
              )}
            </div>
          </div>

          <div className="rating-pagination">
            <button 
              className="rating-page-btn prev" 
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
            >
              {t('rating.prev_page')}
            </button>
            <div className="rating-page-numbers">
              {renderPageNumbers()}
            </div>
            <button 
              className="rating-page-btn next" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              {t('rating.next_page')}
            </button>
          </div>
        </div>
      </section>    
    </>
  );
};

export default Rating;