import { useState, useEffect } from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import './tournaments.css';
import TournamentAdmin from '../../components/Admin/TournamentAdmin.jsx';
import { tournamentService } from '/src/components/Services/tournamentService';
import { useNavigate } from 'react-router-dom';

const Tournaments = () => {
  const [teams, setTeams] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showFullAdmin, setShowFullAdmin] = useState(false);
  const [tournaments, setTournaments] = useState([]); // Добавляем состояние для турниров
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Добавьте эту строку
  const navigate = useNavigate();

  // Данные команд из таблицы рейтинга
  const teamData = [
    {
      id: 1,
      name: "Testing",
      tag: "TEST",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-kazakhstan.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 108,
      kills: 58,
      matches: ["1st", "3rd", "5th", "12th"]
    },
    {
      id: 2,
      name: "Bravo",
      tag: "BRV",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["2nd", "4th", "8th", "15th"]
    },
    {
      id: 3,
      name: "Delta",
      tag: "DLT",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["3rd", "5th", "7th", "11th"]
    },
    {
      id: 4,
      name: "Charlie",
      tag: "CHR",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["4th", "9th", "13th", "17th"]
    },
    {
      id: 5,
      name: "Zeta",
      tag: "ZTA",
      logo: "../images/icons/logo-opponent.png",
      country: "../images/icons/icon-europe.png",
      players: "Player1 | Player2 | Player3 | Player4",
      points: 0,
      kills: 0,
      matches: ["8th", "20th", "14th", "19th", "1st"]
    }
  ];

  useEffect(() => {
    setTeams(teamData);
    checkAdminStatus();
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Загружаем турниры из БД
    const data = await tournamentService.getTournamentCards(20);
    setTournaments(data);
    
  } catch (error) {
    console.error('Ошибка загрузки турниров:', error);
    setError('Не удалось загрузить турниры. Попробуйте обновить страницу.');
    setTournaments([]); // Устанавливаем пустой массив
  } finally {
    setLoading(false);
  }
};

  const checkAdminStatus = async () => {
    try {
      const admin = await tournamentService.isUserAdmin();
      setIsAdmin(admin);
    } catch (error) {
      console.error('Ошибка проверки прав админа:', error);
      setIsAdmin(false);
    }
  };

  const handleTournamentUpdate = () => {
    console.log('Турнир обновлен');
  };

  const handleCardClick = (tournament) => {
    navigate(`/tournaments/${tournament.slug}`);
  };

  return (
    <section className="tournaments">
      {/* Полная админ-панель (перекрывает весь контент) */}
      {showFullAdmin && isAdmin && (
        <div className="full-admin-overlay">
          <TournamentAdmin 
            onClose={() => setShowFullAdmin(false)} 
            onTournamentUpdate={handleTournamentUpdate}
          />
        </div>
      )}

      {/* Мини-админ-панель сверху (только для админов) */}
      {isAdmin && !showFullAdmin && (
        <div className="tournament-admin-panel">
          <div className="admin-panel-header">
            <h3>Админ-панель турниров</h3>
            <div className="admin-panel-actions">
              <button 
                onClick={() => setShowFullAdmin(true)} 
                className="admin-edit-btn"
              >
                Открыть
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tournaments-page">
        <div className="tournaments-header">
          <p>Присоединяйтесь к самым захватывающим киберспортивным событиям</p>
        </div>

        {/* Сетка карточек турниров */}
        <div className="tournaments-grid-cards">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-small"></div>
              <p>Загрузка турниров...</p>
            </div>
          ) : tournaments.length === 0 ? (
            <div className="no-tournaments">
              <p>Турниров пока нет</p>
            </div>
          ) : (
            tournaments.map(tournament =>  (
              <div 
                key={tournament.id} 
                className="tournament-card"
                onClick={() => handleCardClick(tournament)}
                style={{ cursor: 'pointer' }}
              >
                {/* Левая часть - изображение турнира */}
                <div className="card-image-section">
                  <img 
                    src={tournament.image || '/images/default-tournament.jpg'} 
                    alt={tournament.name} 
                    className="card-tournament-image"
                  />
                </div>

                {/* Правая часть - информация о турнире */}
                <div className="card-content-section">
                  <div className="card-header">
                    <div className="card-title-row">
                      <h3 className="card-tournament-name">{tournament.name}</h3>
                      <div className="card-status-badge">
                        <span 
                          className={`status-${tournament.status || 'Нет данных о статусе'}`}
                        >
                          {tournament.status === 'registration' ? 'Регистрация открыта' : 
                           tournament.status === 'live' ? 'Активный' : 
                           tournament.status === 'completed' ? 'Завершен' : 'Скоро'}
                        </span>
                      </div>
                    </div>
                    <div className="card-meta">
                      <span className="card-date">{tournament.date}</span>
                      <div className="card-game-league">
                        <span className="card-game">{tournament.game}</span>
                        <span className="card-divider">•</span>
                        <span className="card-league">{tournament.league}</span>
                      </div>
                    </div>
                  </div>

                  {/* Статистика турнира */}
                  <div className="card-info-row">
                    <div className="card-stats">
                      <div className="stat-item">
                        <span className="stat-label">Команд</span>
                        <span className="stat-value">{tournament.teams}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Призовой фонд</span>
                        <span className="stat-value prize">{tournament.prize}</span>
                      </div>
                    </div>
                     {/* Правая часть - партнеры (если есть) */}
                      {tournament.partners.length > 0 && (
  <div className="card-partners">
    <span className="partners-label">Партнеры:</span>
    <div className="partners-logos">
      {tournament.partners.map((partner, index) => {
        // Проверяем, является ли partner строкой или объектом
        const logoUrl = typeof partner === 'string' 
          ? partner 
          : partner.logo || partner.url || partner.image;
        
        if (!logoUrl) return null;
        
        return (
          <img 
            key={index}
            src={logoUrl}
            alt={`Partner ${index + 1}`}
            className="partner-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        );
      })}
    </div>
  </div>
)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Tournaments;