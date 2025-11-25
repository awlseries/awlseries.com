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
        
        const { data, error } = await supabase
          .from('user_awards')
          .select(`
            *,
            tournaments (
              name,
              date
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setAwards(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки наград MVP:', error);
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
        <h3 className="section-title">Награды MVP</h3>
        <div className="info-block second-block">
          <div className="mvp-rewards-loading">
            <div className="spinner">
              <div className="spinner-circle"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (awards.length === 0) {
    return (
      <div className="info-section">
        <h3 className="section-title">Награды MVP</h3>
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
      <img src="/images/icons/icon-trophy-empty.png" alt="без наград" />
      <p>Наград пока нет</p>
    </div>
    <span>Побеждайте в турнирах, чтобы получить первые награды</span>
  </div>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="info-section">
      <h3 className="section-title">Награды MVP</h3>
      <div className="info-block second-block">
        <div className="mvp-rewards-grid">
          {awards.slice(0, 4).map((award, index) => (
            <div key={award.id || index} className="mvp-reward-item">
              <img 
                src={`/images/medals/${award.medal_icon || 'icon-cup-first-place.png'}`} 
                className="reward-icon" 
                alt={award.medal_type || 'Награда'}
              />
              <span className="reward-text">
                {award.tournaments?.name || 'Турнир'} - {award.medal_type || 'MVP'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MvpAwards;