import { useState, useEffect } from 'react';
import { tournamentService } from '../Services/tournamentService';
import './TournamentAdmin.css';

const TournamentAdmin = ({ onClose, onTournamentUpdate }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'edit'
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [newPartner, setNewPartner] = useState({ name: '', logoFile: null, logoPreview: '',  url: '' });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState('');

  // Основная форма
  const [formData, setFormData] = useState({
    // Основная информация
    name: '',
    slug: '',
    // Игра и формат
    game: 'BATTLEFIELD 6',
    discipline: 'Battle Royale',
    mode: 'Командный 4x4',
    map: 'Fort Lyndon',
    partners: [],
    // Статус
    status: 'draft',
    // Даты
    tournament_start: '',
    tournament_end: '',
    registration_start: '',
    registration_end: '',
    // Практические данные
    prize_pool: 0,
    max_teams: 16,
    max_players_per_team: 4,
    // Описание
    description: '',
    // Медиа
    banner_image: '',
    logo: '',
    // JSON поля
    rules: {
      age_limit: 16,
      team_size: 4,
      substitute_players: 1
    },
    scoring_system: {
      placements: {
        '1st': 14,
        '2nd': 9,
        '3rd': 7,
        '4th-6th': 5,
        '7th-10th': 3,
        '11th-15th': 2,
        '16th-20th': 1
      },
      kills: 1,
      contracts: 1
    },
    schedule: []
  });

  // Переводы
  const [translations, setTranslations] = useState({
    ru: {
      name: '',
      description: '',
      rules_text: ''
    },
    en: {
      name: '',
      description: '',
      rules_text: ''
    }
  });

  useEffect(() => {
    checkAdminStatus();
    loadTournaments();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const admin = await tournamentService.isUserAdmin();
      setIsAdmin(admin);
      if (!admin) {
        showMessage('У вас нет прав администратора', 'error');
      }
    } catch (error) {
      console.error('Ошибка проверки прав:', error);
    }
  };

  const loadTournaments = async () => {
    try {
      setLoading(true);
      const data = await tournamentService.getTournaments({ showAll: true });
      setTournaments(data || []);
    } catch (error) {
      showMessage('Ошибка загрузки турниров: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!isAdmin) {
    showMessage('Только администраторы могут создавать турниры', 'error');
    return;
  }

  try {
    setLoading(true);
    
    // Проверяем наличие баннера
    if (!formData.banner_image) {
      showMessage('Загрузите баннер для турнира', 'error');
      setLoading(false);
      return;
    }
    
    // Подготавливаем данные турнира
    const tournamentData = {
      name: formData.name,
      slug: formData.slug,
      game: formData.game,
      discipline: formData.discipline,
      mode: formData.mode,
      map: formData.map,
      status: formData.status,
      tournament_start: formData.tournament_start,
      tournament_end: formData.tournament_end,
      registration_start: formData.registration_start,
      registration_end: formData.registration_end,
      prize_pool: formData.prize_pool,
      max_teams: formData.max_teams,
      max_players_per_team: formData.max_players_per_team,
      description: formData.description,
      banner_image: formData.banner_image,
      logo: formData.logo,
      rules: formData.rules,
      scoring_system: formData.scoring_system,
      schedule: formData.schedule,
      partners: formData.partners || []
    };

    // Подготавливаем данные для создания
    const createData = {
      ...tournamentData,
      translations: translations // translations передается как отдельное свойство
    };

    if (editingTournament) {
      // Редактирование турнира
      await tournamentService.updateTournament(editingTournament.id, tournamentData);
      
      // Обновляем переводы отдельно
      if (Object.keys(translations).length > 0) {
        await tournamentService.updateTranslations(editingTournament.id, translations);
      }
      
      showMessage('Турнир успешно обновлен!', 'success');
    } else {
      // Создание турнира
      await tournamentService.createTournament(createData);
      showMessage('Турнир успешно создан!', 'success');
    }
    
    resetForm();
    await loadTournaments();
    setActiveTab('list');
    if (onTournamentUpdate) onTournamentUpdate();
    
  } catch (error) {
    showMessage('Ошибка: ' + error.message, 'error');
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTranslationChange = (lang, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleJsonFieldChange = (field, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value
      }
    }));
  };

  // Функция загрузки баннера
const handleBannerUpload = async () => {
  if (!bannerFile || !formData.name) {
    showMessage('Выберите файл баннера и укажите название турнира', 'error');
    return;
  }

  try {
    setUploadingBanner(true);
    
    // Генерируем временный ID для нового турнира
    const tempId = editingTournament?.id || 'new-' + Date.now();
    
    // Загружаем баннер
    const bannerUrl = await tournamentService.uploadTournamentBanner(
      bannerFile,
      tempId
    );

    // Обновляем форму
    setFormData(prev => ({
      ...prev,
      banner_image: bannerUrl
    }));
    
    setBannerPreview(bannerUrl);
    setBannerFile(null);
    
    showMessage('Баннер успешно загружен!', 'success');

  } catch (error) {
    showMessage('Ошибка загрузки баннера: ' + error.message, 'error');
  } finally {
    setUploadingBanner(false);
  }
};

  // ------------------------------------------- Функции для работы с партнерами:

// Эта функция должна быть
const addPartner = () => {
  if (!newPartner.name || !newPartner.logoPreview) {
    showMessage('Заполните название и загрузите логотип', 'error');
    return;
  }

  // Добавляем партнера в массив
  const partnerToAdd = {
    name: newPartner.name,
    logo: newPartner.logoPreview, // URL из Supabase Storage
    url: newPartner.url || ''
  };

  setFormData(prev => ({
    ...prev,
    partners: [...(prev.partners || []), partnerToAdd]
  }));

  // Очищаем форму
  setNewPartner({ 
    name: '', 
    logoFile: null, 
    logoPreview: '', 
    url: '' 
  });

  showMessage('Партнер добавлен в список', 'success');
};

// ----------------------------------------------- Функция для загрузки логотипа партнера

const handleLogoUpload = async () => {
  if (!newPartner.logoFile || !newPartner.name || !newPartner.logoFile.name) {
    showMessage('Выберите файл логотипа и укажите название партнера', 'error');
    return;
  }

  try {
    setUploadingLogo(true);
    
    // Загружаем логотип в Supabase Storage
    const logoUrl = await tournamentService.uploadPartnerLogo(
      newPartner.logoFile,
      editingTournament?.id || 'new', // Если турнир еще не создан
      newPartner.name
    );

    // Обновляем данные партнера
    setNewPartner(prev => ({
      ...prev,
      logoPreview: logoUrl,
      logoFile: null
    }));

    showMessage('Логотип успешно загружен!', 'success');

  } catch (error) {
    showMessage('Ошибка загрузки логотипа: ' + error.message, 'error');
  } finally {
    setUploadingLogo(false);
  }
};

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      game: 'BATTLEFIELD 6',
      discipline: 'Battle Royale',
      mode: 'Командный 4x4',
      map: 'Fort Lyndon',
      status: 'draft',
      tournament_start: '',
      tournament_end: '',
      registration_start: '',
      registration_end: '',
      prize_pool: 0,
      max_teams: 16,
      max_players_per_team: 4,
      description: '',
      banner_image: '',
      logo: '',
      rules: {
        age_limit: 16,
        team_size: 4,
        substitute_players: 1
      },
      scoring_system: {
        placements: {
          '1st': 14,
          '2nd': 9,
          '3rd': 7,
          '4th-6th': 5,
          '7th-10th': 3,
          '11th-15th': 2,
          '16th-20th': 1
        },
        kills: 1,
        contracts: 1
      },
      schedule: []
    });
    
    setTranslations({
      ru: { name: '', description: '', rules_text: '' },
      en: { name: '', description: '', rules_text: '' }
    });
    
    setEditingTournament(null);
  };

  const editTournament = async (tournament) => {
  try {
    setLoading(true);
    
    // Загружаем основной турнир
    const tournamentData = {
      name: tournament.name || '',
      slug: tournament.slug || '',
      game: tournament.game || 'BATTLEFIELD 6',
      discipline: tournament.discipline || 'Battle Royale',
      mode: tournament.mode || 'Командный 4x4',
      map: tournament.map || 'Fort Lyndon',
      status: tournament.status || 'draft',
      tournament_start: tournament.tournament_start ? tournament.tournament_start.slice(0, 16) : '',
      tournament_end: tournament.tournament_end ? tournament.tournament_end.slice(0, 16) : '',
      registration_start: tournament.registration_start ? tournament.registration_start.slice(0, 16) : '',
      registration_end: tournament.registration_end ? tournament.registration_end.slice(0, 16) : '',
      prize_pool: tournament.prize_pool || 0,
      max_teams: tournament.max_teams || 16,
      max_players_per_team: tournament.max_players_per_team || 4,
      description: tournament.description || '',
      banner_image: tournament.banner_image || '',
      logo: tournament.logo || '',
      rules: tournament.rules || {},
      scoring_system: tournament.scoring_system || {},
      schedule: tournament.schedule || [],
      partners: formData.partners || []
    };

    setFormData(tournamentData);

    // Загружаем переводы отдельно
    const translationsData = { ru: {}, en: {} };
    
    if (tournament.translations) {
      // Если translations уже в объекте (из getTournaments)
      translationsData.ru = tournament.translations.ru || {};
      translationsData.en = tournament.translations.en || {};
    } else {
      // Иначе загружаем через API
      const translations = await tournamentService.getTournamentTranslations(tournament.id);
      translationsData.ru = translations.ru || {};
      translationsData.en = translations.en || {};
    }

    setTranslations(translationsData);
    setEditingTournament(tournament);
    setActiveTab('create');
    
  } catch (error) {
    console.error('Ошибка загрузки турнира для редактирования:', error);
    showMessage('Ошибка загрузки турнира', 'error');
  } finally {
    setLoading(false);
  }
};

  const deleteTournament = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот турнир? Это действие нельзя отменить.')) return;
    
    try {
      setLoading(true);
      await tournamentService.deleteTournament(id);
      showMessage('Турнир удален', 'success');
      await loadTournaments();
      if (onTournamentUpdate) onTournamentUpdate();
    } catch (error) {
      showMessage('Ошибка удаления: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statuses = {
      draft: { label: 'Черновик', class: 'draft' },
      upcoming: { label: 'Скоро', class: 'upcoming' },
      registration: { label: 'Регистрация', class: 'registration' },
      live: { label: 'В процессе', class: 'live' },
      completed: { label: 'Завершен', class: 'completed' },
      cancelled: { label: 'Отменен', class: 'cancelled' }
    };
    
    return statuses[status] || { label: status, class: 'draft' };
  };

  if (!isAdmin) {
    return (
      <div className="tournament-admin">
        <div className="message error">
          У вас нет прав для доступа к панели управления турнирами
        </div>
        <div className="admin-close-section">
          <button onClick={onClose} className="admin-close-btn">
            ✕ Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tournament-admin">
      <h2>Управление турнирами</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Список турниров ({tournaments.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => {
            resetForm();
            setActiveTab('create');
          }}
        >
          {editingTournament ? 'Редактирование' : 'Создать турнир'}
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="tournament-list-section">
          <div className="section-header">
            <h3>Турниры</h3>
            <div className="stats">
              <span className="stat-item">Всего: {tournaments.length}</span>
              <span className="stat-item">Активные: {tournaments.filter(t => t.status === 'live').length}</span>
              <span className="stat-item">Этап регистрации: {tournaments.filter(t => t.status === 'registration').length}</span>
            </div>
          </div>
          
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
            <div className="tournaments-table">
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Статус</th>
                    <th>Начало</th>
                    <th>Команд</th>
                    <th>Приз</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {tournaments.map(tournament => {
                    const status = getStatusBadge(tournament.status);
                    return (
                      <tr key={tournament.id}>
                        <td className="tournament-name">
                          <strong>{tournament.name}</strong>
                          <div className="tournament-slug">{tournament.slug}</div>
                        </td>
                        <td>
                          <span className={`status-badge ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td>{formatDate(tournament.tournament_start)}</td>
                        <td>
                          {tournament.current_teams}/{tournament.max_teams}
                        </td>
                        <td>
                          {tournament.prize_pool > 0 ? `$${tournament.prize_pool}` : '—'}
                        </td>
                        <td className="actions-cell">
                          <button 
                            onClick={() => editTournament(tournament)}
                            className="btn-action edit"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => window.open(`/tournaments/${tournament.slug}`, '_blank')}
                            className="btn-action view"
                            title="Просмотр"
                          >
                            👁️
                          </button>
                          <button 
                            onClick={() => deleteTournament(tournament.id)}
                            className="btn-action delete"
                            title="Удалить"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="create-tournament-section">
          <div className="section-header">
            <h3>{editingTournament ? 'Редактирование турнира' : 'Создание нового турнира'}</h3>
            {editingTournament && (
              <div className="edit-info">
                ID: {editingTournament.id} | Создан: {formatDate(editingTournament.created_at)}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="tournament-form">
            
            {/* Основная информация */}
            <div className="form-section">
              <h4>Основная информация</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Название турнира *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="WEEKND CHALLENGE AWL FALL FIRST"
                  />
                </div>
                
                <div className="form-group">
                  <label>URL-адрес (slug) *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    placeholder="weeknd-challenge-fall-2025"
                  />
                  <small>Только английские буквы, цифры и дефисы</small>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Статус *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="draft">Черновик</option>
                    <option value="upcoming">Предстоящий</option>
                    <option value="registration">Регистрация открыта</option>
                    <option value="live">В процессе</option>
                    <option value="completed">Завершен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Игра *</label>
                  <select
                    name="game"
                    value={formData.game}
                    onChange={handleInputChange}
                    required>
                    <option value="BATTLEFIELD 6">BATTLEFIELD 6</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Даты */}
            <div className="form-section">
              <h4>Даты проведения</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Начало турнира *</label>
                  <input
                    type="datetime-local"
                    name="tournament_start"
                    value={formData.tournament_start}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Конец турнира</label>
                  <input
                    type="datetime-local"
                    name="tournament_end"
                    value={formData.tournament_end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Начало регистрации</label>
                  <input
                    type="datetime-local"
                    name="registration_start"
                    value={formData.registration_start}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Конец регистрации</label>
                  <input
                    type="datetime-local"
                    name="registration_end"
                    value={formData.registration_end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Формат турнира */}
            <div className="form-section">
              <h4>Формат турнира</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Дисциплина</label>
                  <input
                    type="text"
                    name="discipline"
                    value={formData.discipline}
                    onChange={handleInputChange}
                    placeholder="Battle Royale"
                  />
                </div>
                
                <div className="form-group">
                  <label>Режим</label>
                  <input
                    type="text"
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    placeholder="Командный 4x4"
                  />
                </div>
                
                <div className="form-group">
                  <label>Карта</label>
                  <input
                    type="text"
                    name="map"
                    value={formData.map}
                    onChange={handleInputChange}
                    placeholder="Fort Lyndon"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Макс. команд *</label>
                  <input
                    type="number"
                    name="max_teams"
                    value={formData.max_teams}
                    onChange={handleInputChange}
                    required
                    min="4"
                    max="100"
                  />
                </div>
                
                <div className="form-group">
                  <label>Игроков в команде *</label>
                  <input
                    type="number"
                    name="max_players_per_team"
                    value={formData.max_players_per_team}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="8"
                  />
                </div>
                
                <div className="form-group">
                  <label>Призовой фонд ($)</label>
                  <input
                    type="number"
                    name="prize_pool"
                    value={formData.prize_pool}
                    onChange={handleInputChange}
                    min="0"
                    step="10000"
                  />
                </div>
              </div>
            </div>
            
            {/* Описание */}
            <div className="form-section">
              <h4>Описание турнира</h4>
              <div className="form-group">
                <label>Описание</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange}
                  rows="5" placeholder="Подробное описание турнира, цели..."/>
              </div>
<div className="form-section">
  <h4>Баннер турнира</h4>
  
  <div className="form-group">
    <label>Баннер для мини-блока *</label>
    
    {/* Превью баннера */}
    {(bannerPreview || formData.banner_image) && (
      <div className="banner-preview" style={{ marginBottom: '15px' }}>
        <img src={bannerPreview || formData.banner_image} alt="Preview"/>
      </div>
    )}
    
    {/* Загрузка файла */}
    <div className="file-upload-group">
      <label className="file-upload-label">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setBannerFile(file);
              setBannerPreview(URL.createObjectURL(file));
            }
          }}
          style={{ display: 'none' }}
        />
        <span className="file-upload-btn">
          {bannerFile ? 'Файл выбран' : 'Выбрать баннер'}
        </span>
      </label>
      
      {bannerFile && (
        <button 
          type="button" 
          onClick={handleBannerUpload}
          disabled={uploadingBanner || !formData.name}
          className="btn-upload-banner"
        >
          {uploadingBanner ? 'Загрузка...' : 'Загрузить баннер'}
        </button>
      )}
    </div>
    
    <small>
      Рекомендуемый размер: 400x200px. Форматы: JPG, PNG, WebP
    </small>
  </div>
</div>
            </div>

            {/*  Раздел для партнеров: */}
<div className="form-section">
  <h4>Партнеры турнира</h4>
  
  <div className="form-group">
    <label>Добавить партнера</label>
    
    {/* Поля для ввода данных партнера */}
    <div className="partner-inputs">
      <input
        type="text"
        placeholder="Название партнера *"
        value={newPartner.name}
        onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Ссылка на сайт партнера"
        value={newPartner.url}
        onChange={(e) => setNewPartner({...newPartner, url: e.target.value})}
      />
      
      {/* Загрузка файла */}
      <div className="file-upload">
        <label className="file-upload-label">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNewPartner({
                  ...newPartner,
                  logoFile: file,
                  logoPreview: URL.createObjectURL(file)
                });
              }
            }}
            style={{ display: 'none' }}
          />
          <span className="file-upload-btn">
            {newPartner.logoFile ? 'Файл выбран' : 'Выбрать логотип'}
          </span>
        </label>
        
        {newPartner.logoFile && (
          <button 
            type="button" 
            onClick={handleLogoUpload}
            disabled={uploadingLogo || !newPartner.name}
            className="btn-upload-logo"
          >
            {uploadingLogo ? 'Загрузка...' : 'Загрузить логотип'}
          </button>
        )}
      </div>
      
      {/* Предпросмотр логотипа */}
      {newPartner.logoPreview && (
        <div className="logo-preview">
          <img 
            src={newPartner.logoPreview} 
            alt="Preview" 
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
    
    {/* Кнопка добавления партнера */}
    <button 
      type="button"
      onClick={addPartner}
      disabled={!newPartner.name || !newPartner.logoPreview}
      className="btn-add-partner"
    >
      Добавить партнера в список
    </button>
    
    {/* Список добавленных партнеров */}
    {formData.partners && formData.partners.length > 0 && (
      <div className="partners-list">
        <h5>Добавленные партнеры:</h5>
        {formData.partners.map((partner, index) => (
          <div key={index} className="partner-item">
            {partner.logo && (
              <img 
                src={partner.logo} 
                alt={partner.name} 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
            )}
            <div className="partner-info">
              <strong>{partner.name}</strong>
              {partner.url && <small>{partner.url}</small>}
            </div>
            <button 
              type="button" 
              onClick={() => removePartner(index)}
              className="btn-remove-partner"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
            
            {/* Переводы */}
            <div className="form-section translations-section">
              <h4>Переводы</h4>
              
              <div className="translation-tabs">
                <div className="translation-tab active">🇷🇺 Русский</div>
                <div className="translation-tab">🇺🇸 English</div>
              </div>
              
              <div className="translation-content">
                <div className="form-group">
                  <label>Название (русский)</label>
                  <input
                    type="text"
                    value={translations.ru.name || formData.name}
                    onChange={(e) => handleTranslationChange('ru', 'name', e.target.value)}
                    placeholder={formData.name || "Название на русском"}
                  />
                </div>
                
                <div className="form-group">
                  <label>Описание (русский)</label>
                  <textarea
                    value={translations.ru.description || formData.description}
                    onChange={(e) => handleTranslationChange('ru', 'description', e.target.value)}
                    rows="3"
                    placeholder={formData.description || "Описание на русском"}
                  />
                </div>
                
                <div className="form-group">
                  <label>Текст правил (русский)</label>
                  <textarea
                    value={translations.ru.rules_text}
                    onChange={(e) => handleTranslationChange('ru', 'rules_text', e.target.value)}
                    rows="4"
                    placeholder="Полный текст правил на русском языке..."
                  />
                </div>
              </div>
            </div>
            
            {/* Кнопки действий */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading || !formData.name || !formData.slug || !formData.tournament_start}
              >
                {loading ? (
                  <>
                    <span className="spinner-mini"></span>
                    {editingTournament ? 'Обновление...' : 'Создание...'}
                  </>
                ) : (
                  editingTournament ? 'Сохранить изменения' : 'Создать турнир'
                )}
              </button>
              
              <button 
                type="button" 
                onClick={resetForm}
                className="btn-reset">
                Очистить форму
              </button>
              
              {editingTournament && (
                <button 
                  type="button" 
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                  className="btn-cancel">
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="admin-close-section">
        <button onClick={onClose} className="admin-close-btn">
          ✕ Закрыть панель управления
        </button>
      </div>
    </div>
  );
};

export default TournamentAdmin;