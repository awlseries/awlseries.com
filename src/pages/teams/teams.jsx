import React, { useState } from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import SEO from '../../components/Seo/Seo';

const Teams = () => {
  const [expandedDivision, setExpandedDivision] = useState(null);
  const { t } = useLanguage();

  const toggleDivision = (divisionId) => {
    setExpandedDivision(expandedDivision === divisionId ? null : divisionId);
  };

  // Вспомогательная функция для создания рядов
  const createTeamRows = (teams, rowSize = 5) => {
    const rows = [];
    for (let i = 0; i < teams.length; i += rowSize) {
      const row = teams.slice(i, i + rowSize);
      // Добиваем ряд до rowSize пустыми ячейками
      while (row.length < rowSize) {
        row.push({ 
          id: `empty-${rows.length}-${row.length}`, 
          logo: '/images/icons/icon-empty-slot-team.png', 
          name: t('teams.free_slot'), 
          isEmpty: true 
        });
      }
      rows.push(row);
    }
    return rows;
  };

  const divisions = [
    {
      id: 'division1',
      name: 'STAR LADDER L3',
      subtitle:  t('teams.division_1_rank'),
      tmrr: '3500+',
      teams: '0',
      newTeams: '-',
      type: 'assault',
      icon: '/images/icons/icon-division-starladder.png',
      teamsData: createTeamRows([
        { id: 1, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 2, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 3, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 4, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 5, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 6, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 7, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 8, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 9, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 10, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true }
      ])
    },
    {
      id: 'division2',
      name: 'SLAYGER L1',
      subtitle:  t('teams.division_2_rank'),
      tmrr: '2000+',
      teams: '0',
      newTeams: '-',
      type: 'special',
      icon: '/images/icons/icon-division-slayger.png',
      teamsData: createTeamRows([
        { id: 1, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 2, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 3, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 4, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 5, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 5, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true }
      ])
    },
    {
      id: 'division3',
      name: 'VANGUARD L1',
      subtitle: t('teams.division_3_rank'),
      tmrr: '500+',
      teams: '0',
      newTeams: '-',
      type: 'vanguard',
      icon: '/images/icons/icon-division-vanguard.png',
      teamsData: createTeamRows([
        { id: 1, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 2, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 3, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 4, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 5, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true },
        { id: 5, logo: '/images/icons/icon-empty-slot-team.png', name: t('teams.free_slot'), isEmpty: true }
        // Меньше команд для демонстрации
      ])
    }
  ];

  const rewards = [
    {
      icon: '/images/icons/icon-contract.png',
      title: t('teams.sponsor_contracts'),
      items: [
        t('teams.contracts_with_organizations'),
        t('teams.equipment_sponsorship'),
        t('teams.media_contracts'),
        t('teams.exclusive_partnerships')
      ]
    },
    {
      icon: '/images/icons/icon-awards.png',
      title:  t('teams.combat_rewards'),
      items: [
        t('teams.prize_funds'),
        t('teams.unique_medals'),
        t('teams.seasonal_tokens'),
        t('teams.profile_badges'),
        t('teams.invite_bonuses'),
        t('teams.guaranteed_prizes')
      ]
    },
    {
      icon: '/images/icons/icon-quotes.png',
      title: t('teams.privileged_quotas'),
      items: [
         t('teams.automatic_qualification'),
        t('teams.priority_slots'),
        t('teams.exclusive_access'),
        t('teams.championship_quotas')
      ]
    },
    {
      icon: '/images/icons/icon-up-career.png',
      title: t('teams.career_growth'),
      items: [
        t('teams.scout_programs'),
        t('teams.training_sessions'),
        t('teams.professional_mentorship'),
        t('teams.streaming_opportunities')
      ]
    }
  ];

  const futureFeatures = [
    {
      icon: '/images/icons/icon-shesterenka.png',
      title: t('teams.seasonal_tournaments'),
      description: t('teams.seasonal_tournaments_desc')
    },
    {
      icon: '/images/icons/icon-shesterenka.png',
      title: t('teams.global_leaderboards'),
      description: t('teams.global_leaderboards_desc')
    },
    {
      icon: '/images/icons/icon-shesterenka.png',
      title: t('teams.captain_announcements'),
      description: t('teams.captain_announcements_desc')
    },
    {
      icon: '/images/icons/icon-shesterenka.png',
      title: t('teams.practice_matches'),
      description: t('teams.practice_matches_desc')
    },
    {
      icon: '/images/icons/icon-shesterenka.png',
      title: t('teams.payment_system'),
      description: t('teams.payment_system_desc')
    },
    {
      icon: '/images/icons/icon-shesterenka.png',
      title: t('teams.integrated_streams'),
      description: t('teams.integrated_streams_desc')
    }
  ];

  {/* ---------------------------------------------------------------------------------------------- HTML ------------------------------ */}

  return (
    <>
      <SEO 
        title="AWL Battlefield 6 Divisions - Professional Esports Squads in S1 System Rating"
        description="Explore amateur and professional Battlefield 6 teams. Check team rankings, player rosters, stats, and join existing squads or create your own."
        keywords="battlefield 6 teams, bf6 squads, esports teams, gaming clans, team rankings"
        canonicalUrl="/teams"
      />
    <div>
      {/* Герой-секция с описанием */}
      <section className="divisions-hero">
        {/* Фоновое изображение */}
  <img className='divisions-hero-banner' src="/images/banners/banner-divisions-bg.webp" alt="divisions-banner" loading="eager"
  />
  {/* Градиентный оверлей */}
  <div className='divisions-hero-overlay'/>
  
        <h1 className="divisions-title">{t('teams.division_system_title')}</h1>
        <p className="divisions-subtitle">
          {t('teams.division_system_description')}
        </p>
      </section>

      {/* Система рейтинга */}

      <section className="rating-system">
        <h2 className="section-title">{t('teams.rating_structure_title')}</h2>
        <p className="system-description">
          {t('teams.rating_structure_description')}
        </p>
        
        <div className="rewards-section">
          {rewards.map((reward, index) => (
            <div key={index} className="reward-card">
              <img src={reward.icon} alt={reward.title} className="reward-icon-division" />
              <h3 className="reward-title">{reward.title}</h3>
              <div className="reward-details">
                <ul className="reward-list">
                  {reward.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Контейнер дивизионов */}

      <div className="divisions-container">
        {divisions.map((division) => (
          <div key={division.id} className="division-with-icon">
            {/* Используйте division.icon вместо шаблонной строки */}
            <img 
              src={division.icon} 
              alt={`${division.name} icon`}
              className="division-external-icon"
            />
            
            {/* Существующий division-wrapper */}

            <div className={`division-wrapper division-${division.type}`}>
              <div 
                className={`division-header ${expandedDivision === division.id ? '' : 'collapsed'}`}
                onClick={() => toggleDivision(division.id)}
              >
                <div className="division-info">
                  <div className="division-title">
                    <h2 className="division-name">{division.name}</h2>
                    <span className="division-subtitle">{division.subtitle}</span>
                  </div>
                </div>
                <div className="division-stats">
                  <div className="division-stat">
                    <span className="stat-label">{t('teams.tmmr')}:</span>
                    <span className="stat-value">{division.tmrr}</span>
                  </div>
                  <div className="division-stat">
                    <span className="stat-label">{t('teams.teams')}:</span>
                    <span className="stat-value">{division.teams}</span>
                  </div>
                  <div className="division-stat">
                    <span className="stat-label">{t('teams.new_teams')}:</span>
                    <span className="stat-value">{division.newTeams}</span>
                  </div>
                </div>
                <img 
                  src="/public/images/icons/icon-updown.png" 
                  alt={t('teams.expand')} 
                  className={`division-toggle ${expandedDivision === division.id ? '' : 'collapsed'}`}
                />
              </div>

              {/* ОБНОВЛЕННЫЙ КОНТЕНТ С ГРИДОМ КОМАНД */}
              <div 
                className={`division-content ${expandedDivision === division.id ? '' : 'collapsed'}`} 
                id={division.id}
              >
                {expandedDivision === division.id && division.teamsData && (
                  <div className="teams-grid">
                    {division.teamsData.map((row, rowIndex) => (
                      <div key={rowIndex} className="team-row">
                        {row.map((team) => (
                          <div 
                            key={team.id} 
                            className={`team-cell ${team.isEmpty ? 'empty' : ''}`}
                          >
                            <img 
                              src={team.logo} 
                              alt={team.name} 
                              className={`team-logo ${team.isEmpty ? 'empty-slot-icon' : ''}`}
                            />
                            <div className="team-info">
                              {team.isEmpty ? (
                                t('teams.free_slot')
                              ) : (
                                <button className="team-view-btn">
                                  <img 
                                    src="/images/icons/icon-eye.png" 
                                    alt={t('teams.view_team')} 
                                    className="team-view-icon"
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Будущие возможности */}

      <section className="future-features">
        <h2 className="section-title">{t('teams.future_opportunities_title')}</h2>
        <div className="features-grid">
          {futureFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <img src={feature.icon} alt={t('teams.future_features_icon')} className="feature-icon" />
              <p className="feature-text">
                <span className="feature-text-span">{feature.title}</span> {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default Teams;