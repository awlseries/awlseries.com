import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';

const TeamHeader = ({ team, userRole, captainName }) => {
  const [contacts, setContacts] = useState(team.contacts || {});
  const [isEditingContacts, setIsEditingContacts] = useState(false);

  // Проверяем есть ли контакты
  const hasContacts = contacts && Object.values(contacts).some(val => val && val.trim());

  // Обработчик редактирования контактов
  const handleEditContacts = async () => {
    if (userRole !== 'captain') {
      showSingleNotification('✗ Только капитан может редактировать контакты', true);
      return;
    }
    setIsEditingContacts(true);
  };

  // Сохранение контактов
  const handleSaveContacts = async (newContacts) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ 
          contacts: newContacts,
          lastUpdate: new Date().toISOString()
        })
        .eq('id', team.id);

      if (error) throw error;
      
      setContacts(newContacts);
      setIsEditingContacts(false);
      showSingleNotification('✓ Контакты обновлены');
    } catch (error) {
      console.error('Ошибка сохранения контактов:', error);
      showSingleNotification('✗ Ошибка сохранения контактов', true);
    }
  };

  return (
    <div className="team-info-block">
      <div className="team-header">
        <h2 className="section-title">Команда</h2>
      </div>
      
      <div className="team-basic-info">
        <div className="team-logo-large">
          <img src={team.logo_url || '/images/other/team-logo.png'} alt="Логотип команды" />
        </div>
        
        <div className="team-name-section">
          <h1 className="team-name">{team.name}</h1>
          <div className="team-tag">{team.tag}</div>
        </div>

        <div className="team-details">
          <div className="team-meta">
            <div className="meta-item">
              <span className="meta-label">Основана</span>
              <span className="meta-value">
                {new Date(team.created_at).getFullYear()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Регион</span>
              <span className="meta-value">{team.region || 'Не указан'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Капитан</span>
              <span className="meta-value">{captainName}</span>
            </div>
          </div>
        </div>

        <div className="team-stats-row">
          <div className="stats-column-team">
            <div className="stat-item-team">
              <span className="stat-label-team">Дивизион</span>
              <span className="stat-value-team">{team.division || 'Калибровка'}</span>
            </div>
            <div className="stat-item-team">
              <span className="stat-label-team">Рейтинг</span>
              <span className="stat-value-team">#{team.rating || ' /'}</span>
            </div>
            <div className="stat-item-team">
              <span className="stat-label-team">Очки</span>
              <span className="stat-value-team">{team.points || 0}</span>
            </div>
            <div className="stat-item-team roster-status">
              <span className="stat-label-team">Состав</span>
              <span className="stat-value-team incomplete">
                {team.members?.length >= 5 ? 'Полный' : 'Не полный'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Контакты команды */}
      <div className={`team-contacts ${!hasContacts ? 'empty-contacts' : ''}`}>
        <h3 className="contacts-title">Контакты команды</h3>
        
        {!hasContacts && !isEditingContacts ? (
  <div className="contacts-empty-state">
    {userRole === 'captain' ? (
      <button 
        className="add-contacts-btn-icon" 
        title="Добавить контакты"
        onClick={handleEditContacts}
      >
        <img src="/images/icons/icon-add-data.png" alt="add-contacts-team-awl" />
      </button>
    ) : (
      <p className="empty-upcoming-subtext">Контактов не добавлено</p>
    )}
  </div>
) : isEditingContacts ? (
          <TeamContactsEdit 
            contacts={contacts}
            onSave={handleSaveContacts}
            onCancel={() => setIsEditingContacts(false)}
          />
        ) : (
          <div className="contacts-list">
            <ContactItem 
              platform="discord"
              label="Discord"
              value={contacts.discord}
              onEdit={handleEditContacts}
              userRole={userRole}
            />
            <ContactItem 
              platform="telegram"
              label="Telegram"
              value={contacts.telegram}
              onEdit={handleEditContacts}
              userRole={userRole}
            />
          </div>
        )}
      </div>
      
      <RecentMatches team={team} />
    </div>
  );
};

// Компонент элемента контакта
const ContactItem = ({ platform, label, value, onEdit, userRole }) => {
  const isEmpty = !value || value.trim() === '';
  
  const handleContactAction = () => {
    if (isEmpty) {
      // Если контакт пустой - редактируем
      if (userRole === 'captain') {
        onEdit();
      }
    } else {
      // Если контакт заполнен - переходим по ссылке
      let url = '';
      switch (platform) {
      case 'discord':
        // Формируем ссылку на Discord сервер
        if (value.includes('discord.gg/') || value.includes('discord.com/invite/')) {
          // Если это уже готовая ссылка
          url = value.startsWith('http') ? value : `https://${value}`;
        } else if (value.startsWith('@')) {
          // Если это никнейм - показываем уведомление
          showSingleNotification(`Discord: ${value}`);
          return;
        } else {
          // Предполагаем что это код приглашения
          url = `https://discord.gg/${value}`;
        }
        break;
        case 'telegram':
          url = value.startsWith('@') ? `https://t.me/${value.slice(1)}` : value;
          break;
        default:
          return;
      }
      
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className={`contact-item ${isEmpty ? 'empty-contact' : ''}`}>
      <div className="contact-icon-team">
        <img 
          src={`/images/icons/icon-${platform === 'telegram' ? 'profile-telegram' : platform}.png`} 
          alt={label} 
        />
      </div>
      <div className="contact-info">
        <span className="contact-label">{label}</span>
        <span className="contact-value">{isEmpty ? 'Не указан' : value}</span>
      </div>
      <div className="contact-actions">
        {/* Кнопка редактирования для капитана (только для заполненных контактов) */}
        {!isEmpty && userRole === 'captain' && (
          <button 
            className="contact-edit"
            onClick={onEdit}
            title="Редактировать"
          >
            <img src="/images/icons/icon-editing.png" alt="Редактировать" />
          </button>
        )}
        
        {/* Кнопка действия (Перейти/Редактировать) */}
        <button 
          className="contact-action"
          onClick={handleContactAction}
          disabled={isEmpty && userRole !== 'captain'}
        >
          {isEmpty ? 'Редактировать' : 'Перейти'}
        </button>
      </div>
    </div>
  );
};

// Компонент редактирования контактов
const TeamContactsEdit = ({ contacts, onSave, onCancel }) => {
  const [localContacts, setLocalContacts] = useState({
    discord: contacts.discord || '',
    telegram: contacts.telegram || '',
  });

  const handleInputChange = (platform, value) => {
    setLocalContacts(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localContacts);
  };

  return (
    <form className="contacts-edit-form" onSubmit={handleSubmit}>
      <div className="contact-input-group">
        <label>Discord</label>
        <input
          type="text"
          value={localContacts.discord}
          onChange={(e) => handleInputChange('discord', e.target.value)}
          placeholder="Введите Discord сервер"
        />
      </div>
      
      <div className="contact-input-group">
        <label>Telegram</label>
        <input
          type="text"
          value={localContacts.telegram}
          onChange={(e) => handleInputChange('telegram', e.target.value)}
          placeholder="Введите Telegram @username"
        />
      </div>
      
      <div className="contacts-edit-actions">
        <button type="submit" className="save-btn">Сохранить</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
};

// Компонент последних матчей
const RecentMatches = ({ team }) => {
  const hasMatches = team.recentMatches && team.recentMatches.length > 0;

  return (
    <div className={`recent-matches ${!hasMatches ? 'empty-matches' : ''}`}>
      <h3 className="contacts-title">Последние матчи</h3>
      {!hasMatches ? (
        <div className="matches-empty-state">
          <div className="empty-matches-icon">
            <img src="/images/icons/icon-team-matches-no-data.png" alt="Нет матчей" />
          </div>
          <p className="empty-matches-subtext">Команда еще не сыграла ни одного матча</p>
        </div>
      ) : (
        <div className="matches-list">
          {/* Здесь будет список матчей */}
          <div className="matches-coming-soon">
            Список матчей появится здесь после первых игр команды
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamHeader;