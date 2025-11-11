import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { useNavigate } from 'react-router-dom';

const TeamManagement = ({ team }) => {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState(null);

  // Функция расформирования команды
  const handleDisbandTeam = async () => {
    if (!window.confirm('Вы уверены, что хотите расформировать команду? Это действие нельзя отменить!')) {
      return;
    }

    try {
      // 1. Удаляем всех игроков из команды
      const { error: updateError } = await supabase
        .from('users')
        .update({
          team_id: null,
          team: 'free agent',
          lastUpdate: new Date().toISOString()
        })
        .eq('team_id', team.id);

      if (updateError) throw updateError;

      // 2. Удаляем саму команду
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);

      if (deleteError) throw deleteError;

      // 3. Удаляем логотип из storage
      if (team.logo_url) {
        const logoFileName = team.logo_url.split('/').pop();
        await supabase.storage
          .from('team-logos')
          .remove([logoFileName]);
      }

      showSingleNotification('✓ Команда расформирована');
      navigate('/profile'); // Перенаправляем в профиль
    } catch (error) {
      console.error('Ошибка расформирования команды:', error);
      showSingleNotification('✗ Ошибка расформирования команды', true);
    }
  };

  // Функция передачи полномочий капитана
  const handleTransferCaptaincy = async (newCaptainId) => {
    try {
      // 1. Обновляем капитана в команде
      const { error: teamError } = await supabase
        .from('teams')
        .update({
          captain_id: newCaptainId,
          lastUpdate: new Date().toISOString()
        })
        .eq('id', team.id);

      if (teamError) throw teamError;

      showSingleNotification('✓ Полномочия капитана переданы');
      setActiveAction(null);
      
      // Обновляем страницу для отображения изменений
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Ошибка передачи полномочий:', error);
      showSingleNotification('✗ Ошибка передачи полномочий', true);
    }
  };

  // Функция управления трансферами
  const handleTransfers = () => {
    // Здесь будет логика управления трансферами
    showSingleNotification('📋 Раздел трансферов в разработке');
  };

  // Функция статистики матчей
  const handleMatchStats = () => {
    // Здесь будет логика статистики матчей
    showSingleNotification('📊 Раздел статистики в разработке');
  };

  // Функция текущих турниров
  const handleCurrentTournaments = () => {
    // Здесь будет логика управления турнирами
    showSingleNotification('🏆 Раздел турниров в разработке');
  };

  return (
    <div className="team-management-horizontal">
      <div className="action-buttons-container horizontal">
        <button 
          className="action-btn team-action-btn"
          onClick={handleCurrentTournaments}
        >
          <span className="btn-text">Текущие турниры</span>
        </button>
        
        <button 
          className="action-btn team-action-btn"
          onClick={handleMatchStats}
        >
          <span className="btn-text">Статистика матчей</span>
        </button>
        
        <button 
          className="action-btn team-action-btn"
          onClick={handleTransfers}
        >
          <span className="btn-text">Трансферы игроков</span>
        </button>
        
        <button 
          className="action-btn team-action-btn"
          onClick={() => setActiveAction('transfer-captaincy')}
        >
          <span className="btn-text">Передать полномочия</span>
        </button>
        
        <button 
          className="action-btn team-action-btn disband-btn"
          onClick={handleDisbandTeam}
        >
          <span className="btn-text">Расформировать команду</span>
        </button>
      </div>

      {/* Модальное окно передачи полномочий */}
      {activeAction === 'transfer-captaincy' && (
        <TransferCaptaincyModal
          team={team}
          onTransfer={handleTransferCaptaincy}
          onClose={() => setActiveAction(null)}
        />
      )}
    </div>
  );
};

// Модальное окно передачи полномочий капитана
const TransferCaptaincyModal = ({ team, onTransfer, onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Получаем участников команды (кроме текущего капитана)
  const teamMembers = team.members?.filter(member => member.id !== team.captain_id) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content captaincy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Передача полномочий капитана</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="transfer-warning">
            <div className="warning-icon">
              <img src="/images/icons/icon-promo-line-news.png" alt="warning" />
            </div>
            <p>Вы собираетесь передать полномочия капитана другому игроку.</p>
            <p className="warning-subtext">
              После передачи вы станете обычным участником команды и потеряете права управления.
            </p>
          </div>

          <div className="players-list">
            <h4>Выберите нового капитана:</h4>
            
            {teamMembers.length === 0 ? (
              <div className="no-players">В команде нет других игроков</div>
            ) : (
              teamMembers.map((player) => (
                <div 
                  key={player.id}
                  className={`player-select-item ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <img 
                    src={`/images/icons/icon-class-${player.player_class || 'assault'}.png`}
                    alt={player.player_class}
                    className="player-class-icon"
                  />
                  <div className="player-info-transfer">
                    <span className="player-nickname">{player.battlefield_nickname}</span>
                    <span className="player-name">{player.fullname}</span>
                  </div>
                  <div className="player-class-name">
                    {getClassName(player.player_class)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Отмена
          </button>
          <button 
            className="confirm-transfer-btn"
            onClick={() => selectedPlayer && onTransfer(selectedPlayer.id)}
            disabled={!selectedPlayer}
          >
            Передать полномочия
          </button>
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для получения названия класса
const getClassName = (classKey) => {
  const classNames = {
    assault: 'Штурмовик',
    medic: 'Медик',
    recon: 'Разведчик',
    engineer: 'Инженер'
  };
  return classNames[classKey] || classKey;
};

export default TeamManagement;