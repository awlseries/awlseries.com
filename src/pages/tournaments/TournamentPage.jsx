import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tournamentService } from '/src/components/Services/tournamentService';
import TournamentHeader from './TournamentHeader';
import TournamentDetails from './TournamentDetails';
import './tournaments.css';

const TournamentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTournament();
  }, [slug]);

  const loadTournament = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await tournamentService.getTournament(slug);
      setTournament(data);
      
    } catch (error) {
      console.error('Ошибка загрузки турнира:', error);
      setError(error.message || 'Турнир не найден');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="tournaments">
        <div className="loading-state">
          <div className="spinner-small"></div>
          <p>Загрузка турнира...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tournaments">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/tournaments')}>
            Вернуться к списку турниров
          </button>
        </div>
      </section>
    );
  }

  if (!tournament) {
    return (
      <section className="tournaments">
        <div className="not-found">
          <h2>Турнир не найден</h2>
          <button onClick={() => navigate('/tournaments')}>
            Вернуться к списку турниров
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="tournaments">
      <div className="tournament-container">
        <TournamentHeader tournament={tournament} />
        <TournamentDetails tournament={tournament} />
      </div>
    </section>
  );
};

export default TournamentPage;