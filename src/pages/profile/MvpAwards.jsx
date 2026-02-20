// MvpAwards.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';

const MvpAwards = ({ userId }) => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

 useEffect(() => {
  const loadMvpAwards = async () => {
    try {
      setLoading(true);
      
      // Сначала получаем награды пользователя (простой запрос без JOIN)
      const { data: awardsData, error: awardsError } = await supabase
        .from('user_awards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (awardsError) {
        console.error('Ошибка загрузки наград:', awardsError);
        setAwards([]);
        return;
      }

      // Если наград нет - просто устанавливаем пустой массив
      if (!awardsData || awardsData.length === 0) {
        setAwards([]);
        return;
      }

      // Если есть награды, собираем ID турниров
      const tournamentIds = awardsData
        .map(award => award.tournament_id)
        .filter(id => id != null); // убираем null/undefined

      // Если есть ID турниров, получаем данные о турнирах
      if (tournamentIds.length > 0) {
        const { data: tournamentsData, error: tournamentsError } = await supabase
          .from('tournaments')
          .select('id, name, date')
          .in('id', tournamentIds);

        if (tournamentsError) {
          console.error('Ошибка загрузки турниров:', tournamentsError);
          // Даже если ошибка с турнирами, показываем награды без них
          setAwards(awardsData);
          return;
        }

        // Объединяем данные
        const enrichedAwards = awardsData.map(award => ({
          ...award,
          tournaments: tournamentsData?.find(t => t.id === award.tournament_id) || null
        }));
        
        setAwards(enrichedAwards);
      } else {
        // Если нет ID турниров, показываем награды как есть
        setAwards(awardsData);
      }

    } catch (error) {
      console.error('Неожиданная ошибка:', error);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    loadMvpAwards();
  }
}, [userId]);

  if (loading) {
    return (
      <div className="info-section">
        <h3 className="section-title">{t('mvpAwards.title')}</h3>
        <div className="info-block second-block">
          <div className="loading-container">
            <div className="spinner">
              <div className="spinner-circle"></div>
            </div>
            <p>{t('mvpAwards.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (awards.length === 0) {
    return (
      <div className="info-section">
        <h3 className="section-title">{t('mvpAwards.title')}</h3>
        <div className="info-block second-block">
          <div className="mvp-rewards-grid">
            {/* структура блоков с прозрачным контентом на фоне */}
            <div className="mvp-reward-item empty">
              <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда" style={{opacity: 0.1}}/>
            </div>
            <div className="mvp-reward-item empty">
              <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда" style={{opacity: 0.1}}/>
            </div>
            <div className="mvp-reward-item empty">
              <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда" style={{opacity: 0.1}}/>
            </div>
            <div className="mvp-reward-item empty">
              <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда" style={{opacity: 0.1}}/>
            </div>
          </div>

          <div className="mvp-rewards-empty-overlay">
  <div className="empty-awards-text">
    <div className="empty-awards-title">
      <img src="/images/icons/icon-trophy-empty.png" alt={t('mvpAwards.noAwards.iconAlt')}  />
      <p>{t('mvpAwards.noAwards.title')}</p>
    </div>
    <span>{t('mvpAwards.noAwards.subtitle')}</span>
  </div>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="info-section">
      <h3 className="section-title">{t('mvpAwards.title')}</h3>
      <div className="info-block second-block">
        <div className="mvp-rewards-grid">
          {awards.slice(0, 4).map((award, index) => (
            <div key={award.id || index} className="mvp-reward-item">
              <img 
                src={`/images/medals/${award.medal_icon || 'icon-cup-first-place.png'}`} 
                className="reward-icon" 
                alt={award.medal_type || t('mvpAwards.award.mvp')}
              />
              <span className="reward-text">
                {award.tournaments?.name || t('mvpAwards.award.tournament')} - {award.medal_type || t('mvpAwards.award.mvp')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MvpAwards;