import React, { lazy, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { showSingleNotification } from '/utils/notifications';
import CountryPicker from './CountryPicker';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';
import '/src/styles.css';
import { useNavigate } from 'react-router-dom';
import './ProfileInfo.css';
import SEO from '../../components/Seo/Seo';
import CreateTeamModal from './CreateTeamModal';
import AvatarContactsEditor from './AvatarContactsEditor';
import MvpAwards from './MvpAwards';
import useUserStatus from '/utils/useUserStatus';
import NicknameEditor from './NicknameEditor';
import PlayerStats from './PlayerStats';
import AgeEditor from './AgeEditor';

// Ленивая загрузка react-world-flags
const Flag = lazy(() => import('react-world-flags').then(module => {
  return { default: module.default };
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAgeBeenSet, setHasAgeBeenSet] = useState(false);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('EMPTY');
  const [hasCountryBeenSet, setHasCountryBeenSet] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const isUserOnline = useUserStatus(userData?.id); // хук для отслеживания статуса онлайн/офлайн
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false); // состояния для модалки создания команды
  const [teamData, setTeamData] = useState(null); // состояния для модалки создания команды
  const [showStatsExampleModal, setShowStatsExampleModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ------------------------------------------------------------------------ Загрузка данных при монтировании

useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          await loadUserData(session.user, mounted);
        } else if (mounted) {
          // 🔐 РЕДИРЕКТ ЕСЛИ НЕТ СЕССИИ
          showSingleNotification(t('profile.notifications.authorizationRequired'), true);
          setTimeout(() => navigate('/'), 1000);
          return;
        }
      } catch (error) {
        if (mounted) {
          showSingleNotification(t('profile.notifications.profileLoadError'), true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Слушаем ТОЛЬКО для выхода из системы
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Реагируем ТОЛЬКО на выход
      if (event === 'SIGNED_OUT') {
        setUserData(null);
        setLoading(false);
        showSingleNotification('✗ Вы вышли из системы', true);
        navigate('/');
      }
      // 🔐 ДОБАВЛЯЕМ ПРОВЕРКУ ПОДТВЕРЖДЕНИЯ ПОЧТЫ ПРИ ВХОДЕ
      else if (event === 'SIGNED_IN' && session?.user) {
        if (!session.user.email_confirmed_at && !session.user.confirmed_at) {
          showSingleNotification('✗ Подтвердите email для доступа к профилю', true);
          navigate('/');
        }
      }
    });

    loadInitialData();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // -------------------------------------------------------- Эффект для блокировки скролла при открытии модального окна

useEffect(() => {
  if (isDeleteModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isDeleteModalOpen]);

// ----------------------------------------------------------------------- Функция для загрузки данных команды

useEffect(() => {
  if (userData?.team && userData.team !== "free agent") {
    loadTeamData(userData.team_id);
  }
}, [userData?.team_id]);

const loadTeamData = async (teamId) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    if (error) throw error;
    setTeamData(data);
  } catch (error) {
    console.error('Ошибка загрузки данных команды:', error);
  }
};

// Функция для обработки нажатия на кнопку "Команда"
const handleTeamButtonClick = () => {
  if (userData?.team && userData.team !== "free agent") {
    // Перенаправляем на страницу команды
    navigate(`/team/${userData.team_id}`);
  } else {
    setIsCreateTeamModalOpen(true);
  }
};

// Функция после успешного создания команды
const handleTeamCreated = (newTeamData) => {
  setTeamData(newTeamData);
  setUserData(prev => ({ ...prev, team: newTeamData.name }));
};

  // ------------------------------------------------------------------------- Загрузка данных пользователя

const loadUserData = async (user, mounted) => {
  try {
    setLoading(true);
    
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      // ⚠️ Проверяем, что компонент еще mounted
      if (!mounted) return;

      if (data) {
        const userStats = data.stats || null;

        setUserData({
          ...data,
          stats: userStats,
          battlefield_nickname: data.battlefield_nickname || '',
          country: data.country || 'EMPTY',
          countryName: data.countryName || 'Не выбрана'
        });
        setSelectedCountry(data.country || 'EMPTY');
        setHasAgeBeenSet(!!data.birthDate);
        setHasCountryBeenSet(!!data.country && data.country !== 'EMPTY');
      } else {
        if (mounted) {showSingleNotification(t('profile.notifications.profileNotFound'), true);}
      }
    } else {
      if (mounted) {showSingleNotification(t('profile.notifications.userNotAuthenticated'), true);}
    }
  } catch (error) {
    if (mounted) {showSingleNotification(t('profile.notifications.profileLoadError'), true);}
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
};

// --------------------------------------------------------------------------- Обработчик обновления никнейма
  const handleNicknameUpdate = (updatedUserData) => {
    setUserData(updatedUserData);
  };
  
// --------------------------------------------------------------------------- Обработчик обновления страны
  const handleCountrySelect = (country) => {
  setSelectedCountry(country.code);
  setUserData(prev => ({
    ...prev,
    country: country.code,
    countryName: country.name
  }));
  setHasCountryBeenSet(true);
};

  // --------------------------------------------------------------------------- Функция обновления аватара
  const handleAvatarUpdate = (newAvatarUrl) => {
    setUserData(prev => ({ 
      ...prev, 
      avatar_url: newAvatarUrl 
    }));
  };

  // -------------------------------------------------------------------------- Функция для обработки выбора класса
const handleClassSelect = async (playerClass) => {
  // Если выбран тот же класс, ничего не делаем
  if (userData?.player_class === playerClass) {
    setShowClassSelector(false);
    return;
  }

  setShowClassSelector(false);
  
  // Сохраняем выбор класса в базу данных
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase
      .from('users')
      .update({
        player_class: playerClass,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      showSingleNotification(t('profile.notifications.classChangeError'), true);
      // Возвращаем предыдущее значение при ошибке
      setSelectedClass(userData?.player_class || '');
    } else {
      setUserData(prev => ({ ...prev, player_class: playerClass }));
      showSingleNotification(
    t('profile.notifications.classChanged', { 
      className: getClassName(playerClass) 
    })
  );
}
  }
};

// Вспомогательная функция для получения названия класса
const getClassName = (classKey) => {
  const classNames = {
    assault: t('profile.classes.assault'),
      medic: t('profile.classes.medic'),
      recon: t('profile.classes.recon'),
      engineer: t('profile.classes.engineer')
  };
  return classNames[classKey] || classKey;
};

  // Определяем статус игрока автоматически
  const getPlayerStatus = () => {
    if (userData?.team && userData.team !== "free agent") {
      return {
        text: userData.team,
        color: '#ff6600'
      };
    } else {
      return {
        text: t('profile.freeAgent'),
        color: '#b2ad9c'
      };
    }
  };

  if (loading) {
  return <div className="loading-profile">
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>{t('loading_text')}</p>
    </div>
    </div>;
}

if (!userData) {
  return null; // Компонент не рендерится
}

  const playerStatus = getPlayerStatus();

  // ------------------------------------------------------------------------ Функция удаления аккаунта

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        showSingleNotification(t('notifications.userNotAuthenticated'), true);
        return;
      }

      // Удаляем пользователя из базы данных
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Выходим из системы
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }

      showSingleNotification('✓ Аккаунт успешно удален');
      navigate('/');
      
    } catch (error) {
      showSingleNotification('✗ Ошибка удаления аккаунта', true);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // ------------------------------------------------------------------------ Модальное окно подтверждения удаления

  const DeleteConfirmationModal = () => {
    if (!isDeleteModalOpen) return null;

    return (
      <div 
      className="modal-overlay">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">{t('deleteAccount.title')}</h3>
          </div>
          
          <div className="modal-body">
            <div className="delete-warning">
              <img 
                src="/images/icons/icon-promo-line-news.png" 
                alt="warning"
              />
              <p>{t('deleteAccount.warning')}</p>
            </div>
            
            <div className="delete-consequences">
              <p>{t('deleteAccount.consequences')}</p>
              <ul>
              <li>{t('deleteAccount.listItem1')}</li>
              <li>{t('deleteAccount.listItem2')}</li>
              <li>{t('deleteAccount.listItem3')}</li>
              <li>{t('deleteAccount.listItem4')}</li>
              </ul>
              <p className="final-warning">{t('deleteAccount.finalWarning')}</p>
            </div>
          </div>
          
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => {setIsDeleteModalOpen(false); document.body.style.overflow = 'unset';}}>
            {t('deleteAccount.cancel')}</button>
            <button className="delete-confirm-btn" onClick={handleDeleteAccount}> {t('deleteAccount.confirm')}</button>
          </div>
        </div>
      </div>
    );
  };

   // -------------------------------------------------------------------------------------------------------- HTML ---------------------------------------------

  return (
     <>
      <SEO 
        title="Player Profile - AWL Battlefield 6 Your Cyberpsort Profile"
        description="View your Battlefield 6 player profile, statistics, achievements, and tournament history. Manage your esports career in Arena Warborn League."
        keywords="BF6 profile, player statistics, gaming achievements, esports career BF6"
        canonicalUrl="/profile"
      />
      {/* Основной контент страницы */}
    <div className="content-index">

       {/* Блок информации об игроке */}
      <div className="player-information">
        <img className="profile-awl-background" src="/images/other/profile-background-awl.webp" alt="awl-logo-profile"/>
        {/*  Основной контейнер для первых четырех блоков */}
        <div className="main-info-container">
        <div className="info-content-wrapper">
          {/*  Первый блок - Игрок */}
        <div className="info-section">
          <div className="section-title-with-status">
          <h3 className="section-title">{t('player.player')}</h3>
          <div className={`status-indicator ${isUserOnline ? 'online' : 'offline'}`}>
          <span className="status-dot"></span>
          {isUserOnline ? t('player.online') : t('player.offline')}
          </div>
          </div>
          <div className="info-block first-block">
            <div className="nickname-and-class-container">
            {/* Компонент смены никнейма */}
                    <NicknameEditor 
                      userData={userData}
                      onNicknameUpdate={handleNicknameUpdate}
                      supabase={supabase}
                      showSingleNotification={showSingleNotification}
                    />

             {/* Контейнер для выбора класса игрока */}
<div className="class-selector-container">
  <span className="class-label">{t('player.class')}:</span>
  <div className="class-selector">
    <div className="current-class" onClick={() => setShowClassSelector(!showClassSelector)} style={{ cursor: 'pointer' }}>
      <img src={`/images/icons/icon-class-${userData?.player_class || 'assault'}.png`} alt={userData?.player_class || 'assault'} className="class-icon-profile"/>
    </div>
    
    {showClassSelector && (
      <div className="class-options-row">
        {['assault', 'medic', 'recon', 'engineer'].map((playerClass) => (
          <div
            key={playerClass}
            className={`class-option ${userData?.player_class === playerClass ? 'selected' : ''}`}
            onClick={() => handleClassSelect(playerClass)}
          >
            <img 
              src={`/images/icons/icon-class-${playerClass}.png`} 
              alt={playerClass}
              className="class-icon-profile"
            />
          </div>
        ))}
      </div>
    )}
  </div>
</div>
</div>
            
            <div className="horizontal-row-1">
            <div className="info-player-style">
          {/* Контейнер для иконки страны - кликабельный, если страна не установлена */}
          <div 
            className={`country-selector ${!hasCountryBeenSet ? 'clickable' : ''}`} onClick={!hasCountryBeenSet ? () => setIsCountryPickerOpen(true) : undefined}
            title={!hasCountryBeenSet ? t('player.selectCountry') : t('player.countrySet')}>
            {selectedCountry && selectedCountry !== 'EMPTY' ? (
              <Suspense fallback={<div className="country-flag-fallback">?</div>}>
              <Flag code={selectedCountry} className="country-flag-img" title={userData?.countryName || getCountryName(selectedCountry)}/>
              </Suspense>
            ) : ( <div className="country-flag-fallback">?</div>)}
          </div>
    
          {/* Контейнер для имени игрока - не кликабельный */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <span style={{ 
              fontSize: '16px', 
              color: '#f6efd9',
              lineHeight: '1.2'
            }}>
              {userData?.fullname || t('player.fullnameNotSet')}
            </span>
            {!hasCountryBeenSet && (
              <span style={{
                fontSize: '12px',
                color: '#b2ad9c',
                fontStyle: 'italic'
              }}>
                {t('player.selectCountry')}
              </span>
            )}
          </div>
        </div>
              
              <div className="age-and-status-container">
              {/* Возраст - можно установить один раз */}
              <AgeEditor userData={userData} hasAgeBeenSet={hasAgeBeenSet} supabase={supabase} showSingleNotification={showSingleNotification}
              onAgeUpdated={(newBirthDate) => {setUserData(prev => ({ ...prev, birthDate: newBirthDate })); setHasAgeBeenSet(true);}}/>
                
                {/* Статус игрока - определяется автоматически */}
                <span className="age-and-status-player-style" style={{ color: playerStatus.color }}>
                  <span className="class-label">{t('player.team')}:</span>
                  {playerStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- 2 блок - Награды MVP */}

        <MvpAwards userId={userData?.id} />
        
        {/* ------------------------------------------------------------- 3 и 4 блоки - MMR и Дивизион */}

        <div className="info-sections-container">
          <div className="info-section">
            <h3 className="section-title">MMR</h3>
            <div className="info-block mmr-value">
            {userData.mmr !== undefined && userData.mmr !== null ? userData.mmr : 0}
            </div>
          </div>
          
          <div className="info-section">
            <h3 className="section-title">{t('division')}</h3>
            <div className="svg-division-container">
              <svg className="svg-division-block" viewBox="0 0 302 92" preserveAspectRatio="none">
                <path 
                  d="M9,1 L286,1 L301,46 L286,91 L9,91 C4.58,91 1,87.42 1,83 L1,9 C1,4.58 4.58,1 9,1Z" 
                  fill="none" 
                  stroke="#ff6600" 
                  strokeWidth="2" 
                  strokeLinejoin="round"
                />
              </svg>
              <div className={`svg-division-content ${userData.division === "calibration" ? "calibration" : ""}`}>
              {userData.division === "calibration" ? t('calibration') : userData.division}
              </div>
            </div>
          </div>
        </div>
        </div>

         {/* Блок контактов и аватара на AvatarContactsEditor */}
          <AvatarContactsEditor 
            userData={userData}
            onAvatarUpdate={handleAvatarUpdate}
            isContactsModalOpen={isContactsModalOpen}
            onCloseContactsModal={() => setIsContactsModalOpen(false)}
          />
        </div>

        {/* -------------------------------------------------------------------- Блок статистики */}

        <div className="stats-actions-container">
          <PlayerStats userId={userData?.id} onShowExample={() => setShowStatsExampleModal(true)}/>

          {/* -------------------------------------------------------------------- Блок меню кнопок */}

    <div className="info-section">
        <div className="info-block">
            <div className="action-buttons-container">
                <button className="action-btn" onClick={() => setIsContactsModalOpen(true)}>
                    <span className="btn-text">{t('contacts')}</span>
                </button>
                <button className="action-btn" onClick={handleTeamButtonClick}>
                    <span className="btn-text">{t('actionButtons.team')}</span>
                </button>
                <button className="action-btn disabled">
                    <span className="btn-text">{t('actionButtons.tournaments')}</span>
                    <span className="coming-soon-indicator">{t('comingSoon')}</span>
                </button>
                <button className="action-btn disabled">
                    <span className="btn-text">{t('actionButtons.privacy')}</span>
                    <span className="coming-soon-indicator">{t('comingSoon')}</span>
                </button>
                <button className="action-btn" onClick={() => setIsDeleteModalOpen(true)}>
                    <span className="btn-text">{t('actionButtons.deleteAccount')}</span>
                </button>
            </div>
        </div>
    </div>
</div>

        {/* -------------------------------------------------------------------- Блок достижений */}

        <div className="info-section achievements-section">
          <h3 className="section-title">{t('achievements')}</h3>
          <div className="info-block achievements-block">
            <div className="achievements-row">
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 1"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 2"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 3"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 4"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 5"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 6"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal />
      {/* Модальное окно создания команды */}
      <CreateTeamModal isOpen={isCreateTeamModalOpen} onClose={() => setIsCreateTeamModalOpen(false)} onTeamCreated={handleTeamCreated}/>
       {/* Компонент выбора страны */}
      <CountryPicker isOpen={isCountryPickerOpen} onClose={() => setIsCountryPickerOpen(false)} currentCountry={selectedCountry}
        onCountrySelect={handleCountrySelect} disabled={hasCountryBeenSet} userId={userData?.id} showNotification={showSingleNotification}/>
        {/* МОДАЛКА ПРИМЕРА СКРИНШОТА */}
      {showStatsExampleModal && (
        <div className="modal-overlay" onClick={() => setShowStatsExampleModal(false)}>
          <div className="modal-content example-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title example-modal-title">{t('stats.upload.exampleTitle')}</h3>
            </div>
            <div className="modal-body example-modal-body">
              <img 
                src="/images/other/example-screenshot.webp" 
                alt={t('stats.upload.exampleTitle')} 
                className="example-modal-image"
              />
              <p className="example-modal-hint">
                {t('stats.upload.exampleHint')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Profile;