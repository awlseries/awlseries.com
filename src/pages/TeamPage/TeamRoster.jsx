import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { EmptyPlayers } from './EmptyState';

const TeamRoster = ({ team, userRole }) => {
  const [members, setMembers] = useState(team.members || []);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Функция для приглашения игрока
  const handleInvitePlayer = async (playerId) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: team.id,
          player_id: playerId,
          invited_by: team.captain_id,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      
      showSingleNotification('✓ Приглашение отправлено');
      setIsInviteModalOpen(false);
    } catch (error) {
      console.error('Ошибка отправки приглашения:', error);
      showSingleNotification('✗ Ошибка отправки приглашения', true);
    }
  };

  // Функция для кика игрока (только капитан)
  const handleKickPlayer = async (playerId) => {
    if (userRole !== 'captain') return;

    try {
      // Обновляем пользователя - убираем из команды
      const { error } = await supabase
        .from('users')
        .update({
          team_id: null,
          team: 'free agent',
          lastUpdate: new Date().toISOString()
        })
        .eq('id', playerId);

      if (error) throw error;

      // Обновляем локальное состояние
      setMembers(prev => prev.filter(member => member.id !== playerId));
      showSingleNotification('✓ Игрок удален из команды');
    } catch (error) {
      console.error('Ошибка удаления игрока:', error);
      showSingleNotification('✗ Ошибка удаления игрока', true);
    }
  };

  // Функция для выхода из команды (для участников)
  const handleLeaveTeam = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          team_id: null,
          team: 'free agent',
          lastUpdate: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      showSingleNotification('✓ Вы покинули команду');
      // Перенаправляем на страницу профиля
      window.location.href = '/profile';
    } catch (error) {
      console.error('Ошибка выхода из команды:', error);
      showSingleNotification('✗ Ошибка выхода из команды', true);
    }
  };

  // Получаем капитана команды
  const captain = members.find(member => member.id === team.captain_id);
  
  // Получаем остальных участников
  const otherMembers = members.filter(member => member.id !== team.captain_id);

  // Создаем пустые слоты (максимум 5 игроков в команде)
  const emptySlotsCount = Math.max(0, 5 - members.length);
  const emptySlots = Array(emptySlotsCount).fill(null);

  return (
    <div className="team-roster-block">
      <div className="roster-header">
        <h2>Состав</h2>
      </div>
      
      <div className="roster-grid">
        {/* Капитан */}
        {captain && (
          <PlayerCard 
            player={captain}
            isCaptain={true}
            userRole={userRole}
            currentUserId={team.captain_id}
            onKick={handleKickPlayer}
            onLeave={handleLeaveTeam}
          />
        )}

        {/* Остальные участники */}
        {otherMembers.map((player) => (
          <PlayerCard 
            key={player.id}
            player={player}
            isCaptain={false}
            userRole={userRole}
            currentUserId={team.captain_id}
            onKick={handleKickPlayer}
            onLeave={handleLeaveTeam}
          />
        ))}

        {/* Пустые слоты для приглашения */}
        {emptySlots.map((_, index) => (
          <EmptySlot 
            key={`empty-${index}`}
            userRole={userRole}
            onInvite={() => setIsInviteModalOpen(true)}
          />
        ))}
      </div>

      {/* Модальное окно приглашения игрока */}
      {isInviteModalOpen && (
        <InvitePlayerModal 
          team={team}
          onInvite={handleInvitePlayer}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}
    </div>
  );
};

// Компонент карточки игрока
const PlayerCard = ({ 
  player, 
  isCaptain, 
  userRole, 
  currentUserId,
  onKick, 
  onLeave 
}) => {
   const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  const isCurrentUser = currentUser?.id === player.id;

  return (
    <div className={`player-card ${isCaptain ? 'captain' : ''} ${isCurrentUser ? 'current-player' : ''}`}>
      <div className="player-photo" data-player={player.id}>
        <img 
          className="player-photo-position" 
          src={player.photo_url || '/images/other/team-player-empty.png'} 
          alt={`Фото ${player.battlefield_nickname}`} 
        />
        
        {isCaptain && <div className="captain-badge">К</div>}
        
        <div className="player-info">
          <h4 className="player-real-name">
            {player.fullname || 'Имя не указано'}
          </h4>
          <p className="player-nickname">« {player.battlefield_nickname} »</p>
          
          <div className="player-role">
            <img 
              src={`/images/icons/icon-class-${player.player_class || 'assault'}.png`} 
              alt={player.player_class || 'assault'} 
            />
            
            {/* Кнопки действий */}
            <div className="player-actions">
              {isCurrentUser ? (
                // Для текущего пользователя - кнопка "Покинуть"
                <button 
                  className="leave-btn"
                  onClick={onLeave}
                >
                  Покинуть
                </button>
              ) : userRole === 'captain' && !isCaptain ? (
                // Для капитана - кнопка "Кикнуть" (кроме себя)
                <button 
                  className="kick-btn"
                  onClick={() => onKick(player.id)}
                >
                  Кикнуть
                </button>
              ) : (
                // Для остальных - кнопка "Профиль"
                <button 
                  className="profile-btn"
                  onClick={() => window.open(`/profile/${player.id}`, '_blank')}
                >
                  Профиль
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент пустого слота
const EmptySlot = ({ userRole, onInvite }) => {
  return (
    <div className="player-card empty-slot">
      <div className="player-photo" data-player="invite">
        <img 
          className="player-photo-position" 
          src="/images/other/team-player-empty.png" 
          alt="Пригласить игрока" 
        />
        <div className="player-info">
          <h4 className="player-real-name">Свободный слот</h4>
          
          {userRole === 'captain' ? (
            <button 
              className="add-contacts-btn-icon" 
              onClick={onInvite}
              title="Пригласить игрока"
            >
              <img src="/images/icons/icon-add-data.png" alt="add-player-team-awl" />
            </button>
          ) : (
            <p className="empty-slot-text"></p>
          )}
        </div>
      </div>
    </div>
  );
};

// Модальное окно приглашения игрока
const InvitePlayerModal = ({ team, onInvite, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

    // Блокировка скролла при открытии модалки
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Поиск игроков
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, battlefield_nickname, fullname, player_class, team_id')
        .or(`battlefield_nickname.ilike.%${query}%`)
        .is('team_id', null) // Только свободные агенты
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Ошибка поиска игроков:', error);
      showSingleNotification('✗ Ошибка поиска игроков', true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-invite" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Пригласить игрока в команду</h3>
        </div>
        
        <div className="modal-body">
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по никнейму свободного игрока"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="search-results">
            {searching ? (
              <div className="loading-search">Поиск...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((player) => (
                <div key={player.id} className="player-search-result">
                  <div className="player-search-info">
                    <img 
                      src={`/images/icons/icon-class-${player.player_class || 'assault'}.png`}
                      alt={player.player_class}
                      className="player-class-icon"
                    />
                    <div className="player-details">
                      <span className="player-nickname-search">{player.battlefield_nickname}</span>
                      <span className="player-name-search">{player.fullname}</span>
                    </div>
                  </div>
                  <button 
                    className="invite-btn"
                    onClick={() => onInvite(player.id)}
                  >
                    Пригласить
                  </button>
                </div>
              ))
            ) : searchQuery.length >= 3 ? (
              <div className="no-results">Игроки не найдены</div>
            ) : (
              <div className="search-hint">Введите минимум 3 символа для поиска</div>
            )}
          </div>
        </div>
        
        {/* блок для кнопки Отмена */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamRoster;