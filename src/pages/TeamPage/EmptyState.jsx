import React from 'react';

const EmptyState = ({ 
  type = 'default',
  title,
  subtitle,
  icon,
  actionButton,
  size = 'medium'
}) => {
  const getConfig = () => {
    const configs = {
      contacts: {
        icon: '/images/icons/icon-add-data.png',
        title: 'Контакты не указаны',
        subtitle: 'Добавьте контакты для связи с командой'
      },
      matches: {
        icon: '/images/icons/icon-team-matches-no-data.png',
        title: 'Нет матчей',
        subtitle: 'Команда еще не сыграла ни одного матча'
      },
      upcoming: {
        icon: '/images/icons/icon-kills.png',
        title: 'Нет предстоящих матчей',
        subtitle: 'Команда не зарегистрирована на турниры',
        customContent: (
          <div className="upcoming-empty-state">
            <div className="match-silhouettes">
              {[1, 2, 3].map(i => (
                <div key={i} className="br-match-card-compact silhouette">
                  <div className="br-match-content">
                    <div className="br-match-tournament"></div>
                    <div className="br-game-info"></div>
                    <div className="br-match-datetime">
                      <div className="br-match-date"></div>
                      <div className="br-match-time"></div>
                      <div className="br-match-mode"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="empty-upcoming-icon">
              <img src="/images/icons/icon-kills.png" alt="no-data-tournaments-matches-awl" />
              <img className="icon-versus" src="/images/icons/icon-versus.png" alt="no-data-tournaments-matches-awl" />
              <img src="/images/icons/icon-kills.png" alt="no-data-tournaments-matches-awl" />
            </div>
            <p className="empty-upcoming-text">Нет предстоящих матчей</p>
            <p className="empty-upcoming-subtext">Команда не зарегистрирована на турниры</p>
          </div>
        )
      },
      players: {
        icon: '/images/icons/icon-team-player-empty.png',
        title: 'Нет игроков',
        subtitle: 'В команде пока нет других участников'
      },
      tournaments: {
        icon: '/images/icons/icon-tournament-empty.png',
        title: 'Нет турниров',
        subtitle: 'Команда не участвует в турнирах'
      },
      default: {
        icon: '/images/icons/icon-not-information.png',
        title: 'Нет данных',
        subtitle: 'Информация отсутствует'
      }
    };

    return configs[type] || configs.default;
  };

  const config = getConfig();
  const finalIcon = icon || config.icon;
  const finalTitle = title || config.title;
  const finalSubtitle = subtitle || config.subtitle;

  return (
    <div className={`empty-state empty-state-${type} empty-state-${size}`}>
      {config.customContent ? (
        config.customContent
      ) : (
        <>
          <div className="empty-state-icon">
            <img src={finalIcon} alt={finalTitle} />
          </div>
          <div className="empty-state-content">
            <h3 className="empty-state-title">{finalTitle}</h3>
            <p className="empty-state-subtitle">{finalSubtitle}</p>
            {actionButton && (
              <div className="empty-state-actions">
                {actionButton}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Специализированные компоненты для конкретных случаев
export const EmptyContacts = ({ onAddContact, canEdit }) => (
  <EmptyState 
    type="contacts"
    actionButton={
      canEdit && (
        <button 
          className="add-contacts-btn-icon" 
          onClick={onAddContact}
          title="Добавить контакты"
        >
          <img src="/images/icons/icon-add-data.png" alt="add-contacts-team-awl" />
        </button>
      )
    }
  />
);

export const EmptyMatches = () => (
  <EmptyState type="matches" />
);

export const EmptyUpcomingMatches = () => (
  <EmptyState type="upcoming" />
);

export const EmptyPlayers = () => (
  <EmptyState type="players" />
);

export const EmptyTournaments = () => (
  <EmptyState type="tournaments" />
);

export default EmptyState;