import React from 'react';
import './tournaments.css';

const TournamentHeader = ({ tournament }) => {
  if (!tournament) return null;

  // Форматируем даты
  const formatDate = (dateString, showTime = true) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    
    if (showTime) {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Статус турнира
  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'Черновик',
      'upcoming': 'Скоро',
      'registration': 'Регистрация открыта',
      'live': 'Активный',
      'completed': 'Завершен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  // Преобразуем teams для отображения иконок
  const displayTeams = tournament.teams || [];
  const displayedIcons = displayTeams.slice(0, 5); // Показываем до 5 команд
  const remainingTeams = Math.max(0, displayTeams.length - 4);

  // Количество команд
  const currentTeams = tournament.current_teams || 0;
  const maxTeams = tournament.max_teams || 50;
  
  // Если команд нет, показываем знаки вопроса
  const showQuestionMarks = currentTeams === 0;

  // Получаем команды из tournament
  const teams = tournament.teams || [];

  return (
    <>
      {/* Первый блок - заголовок */}
      <div className="tournament-header-block">
        <div className="tournament-title-section">
          <div className={`tournament-page-status status-${tournament.status}`}>
            {getStatusText(tournament.status)}
          </div>
          <h2 className="tournament-page-name">{tournament.name}</h2>
        </div>
        
        {/* Кнопка - используем canRegister() который возвращает объект */}
        {(() => {
          // Получаем информацию о регистрации
          const registrationInfo = tournament.canRegister || { allowed: false, message: 'Регистрация недоступна' };
          
          return (
            <button 
              className={`join-tournament-btn ${!registrationInfo.allowed ? 'disabled' : ''}`}
              disabled={!registrationInfo.allowed}
              onClick={() => {
                if (registrationInfo.allowed) {
                  // Здесь логика при клике на кнопку "Присоединиться"
                  console.log('Присоединяемся к турниру:', tournament.id);
                  // Можно добавить переход на страницу регистрации или открыть модалку
                }
              }}
            >
              <span>{registrationInfo.message}</span>
              {registrationInfo.allowed && (
                <img className="icons-tournaments" src="/images/icons/icon-join.png" alt="join-tournament" />
              )}
            </button>
          );
        })()}
      </div>
      
      {/* Второй блок - статистика */}
      <div className="tournament-middle-block">
        {/* Левая часть - 3 мини-блока в ряд */}
        <div className="tournament-mini-blocks">
          {/* Призовой фонд */}
          <div className="mini-block">
            <div className="mini-block-top">
              <img className="icons-tournaments" src="../images/icons/icon-reward-tournament.png" alt="rewards-tournament" />
            </div>
            <div className="mini-block-bottom">
              <div className="mini-text-line-top">
                ${tournament.prize_pool > 0 ? tournament.prize_pool.toLocaleString() : '0'}
              </div>
              <div className="mini-text-line-bottom">Призовой пул</div>
            </div>
          </div>
          
          {/* Начало турнира */}
          <div className="mini-block">
            <div className="mini-block-top">
              <img className="icons-tournaments" src="../images/icons/icon-time-tournament.png" alt="time-tournament" />
            </div>
            <div className="mini-block-bottom">
              <div className="mini-text-line-top">
                {formatDate(tournament.tournament_start)}
              </div>
              <div className="mini-text-line-bottom">Начало турнира</div>
            </div>
          </div>
          
          {/* Период регистрации */}
          <div className="mini-block">
            <div className="mini-block-top">
              <img className="icons-tournaments" src="../images/icons/icon-date-tournament.png" alt="date-tournament" />
            </div>
            <div className="mini-block-bottom">
              <div className="mini-text-line-top">
                {formatDate(tournament.registration_start, false)} - {formatDate(tournament.registration_end, false)}
              </div>
              <div className="mini-text-line-bottom">Период регистрации</div>
            </div>
          </div>
        </div>
        
        {/* Правая часть - команды */}
        <div className="tournament-right-block">
          <div className="right-block-top">
            <div className="right-block-line-top">Заявленные команды</div>
            <div className="right-block-line-bottom">
              {currentTeams.toString().padStart(2, '0')}/{maxTeams.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="right-block-bottom">
            <div className="team-icons-container">
              {showQuestionMarks ? (
                // Показываем знаки вопроса если нет команд
                <>
                  <div className="team-icon-circle">
                    <div className="question-mark">?</div>
                  </div>
                  <div className="team-icon-circle">
                    <div className="question-mark">?</div>
                  </div>
                  <div className="team-icon-circle">
                    <div className="question-mark">?</div>
                  </div>
                  <div className="team-icon-circle">
                    <div className="question-mark">?</div>
                  </div>
                  <div className="team-icon-circle">
                    <div className="question-mark">?</div>
                  </div>
                  <div className="team-icon-circle">
                    <div className="right-block-line-bottom-last">+00</div>
                  </div>
                </>
              ) : (
                // Показываем реальные команды если есть
                <>
                  {/* Отображаем иконки команд */}
                  {(tournament.teams || []).slice(0, 5).map((team, index) => (
                    <div key={team.id || index} className="team-icon-circle">
                      <img 
                        src={team.team_logo || '../images/icons/logo-opponent.png'} 
                        alt={team.team_name || `Team ${index + 1}`} 
                      />
                    </div>
                  ))}
                  
                  {/* Показываем количество оставшихся команд */}
                  {currentTeams > 5 && (
                    <div className="team-icon-circle">
                      <div className="right-block-line-bottom-last">
                        +{(currentTeams - 5).toString().padStart(2, '0')}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentHeader;