// PublicProfile.jsx
import React, { lazy, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';
import '/src/styles.css';
import { useParams, Link } from 'react-router-dom';
import './ProfileInfo.css';
import SEO from '../../components/Seo/Seo';
import MvpAwards from './MvpAwards';
import useUserStatus from '/utils/useUserStatus';


const Flag = lazy(() => import('react-world-flags'));

const PublicProfile = () => {
  const [userData, setUserData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('EMPTY');
  const [loading, setLoading] = useState(true);
  const [teamData, setTeamData] = useState(null);
  const { userId } = useParams();
  const isUserOnline = useUserStatus(userId);
  const { t } = useLanguage();

  // Загрузка данных публичного профиля
  useEffect(() => {
    const loadPublicProfile = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        

        if (data) {
          console.log('Загруженные данные пользователя:', data); // ДЛЯ ОТЛАДКИ
        console.log('Страна пользователя:', data.country); // ДЛЯ ОТЛАДКИ
          setUserData({
            ...data,
            stats: data.stats || null
          });
          setSelectedCountry(data.country || 'EMPTY');

          if (data.team_id) {
            loadTeamData(data.team_id);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки публичного профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadPublicProfile();
    }
  }, [userId]);

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

  // Функции для контактов (только просмотр)
  const handleContactClick = (platform, contact) => {
    if (!contact) return;
    
    let url = '';
    
    switch (platform) {
      case 'steam':
        url = contact.startsWith('http') ? contact : `https://steamcommunity.com/id/${contact}`;
        break;
      case 'telegram':
        url = contact.startsWith('@') ? `https://t.me/${contact.slice(1)}` : 
              contact.startsWith('http') ? contact : `https://t.me/${contact}`;
        break;
      case 'whatsapp':
        const cleanPhone = contact.replace(/\D/g, '');
        let formattedPhone = cleanPhone;
        if (formattedPhone.startsWith('8') && formattedPhone.length === 11) {
          formattedPhone = '7' + formattedPhone.slice(1);
        }
        url = `https://wa.me/${formattedPhone}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Вспомогательные функции
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const displayAge = (age) => {
    if (!age) return 'Не указан';
    let yearsText = 'лет';
    if (age % 10 === 1 && age % 100 !== 11) yearsText = 'год';
    else if ([2,3,4].includes(age % 10) && ![12,13,14].includes(age % 100)) yearsText = 'года';
    return `${age} ${yearsText}`;
  };

  const getPlayerStatus = () => {
    if (userData?.team && userData.team !== "free agent") {
      return {
        text: userData.team,
        color: '#ff6600'
      };
    } else {
      return {
        text: 'Свободный агент',
        color: '#b2ad9c'
      };
    }
  };

  const getCountryName = (countryCode) => {
    const countryList = [
      { code: 'ru', name: 'Россия' },
      { code: 'us', name: 'США' },
      { code: 'de', name: 'Германия' },
      { code: 'fr', name: 'Франция' },
      { code: 'gb', name: 'Великобритания' },
      { code: 'jp', name: 'Япония' },
      { code: 'kr', name: 'Корея' },
      { code: 'cn', name: 'Китай' },
      { code: 'br', name: 'Бразилия' },
      { code: 'in', name: 'Индия' },
      { code: 'ca', name: 'Канада' },
      { code: 'au', name: 'Австралия' },
      { code: 'it', name: 'Италия' },
      { code: 'es', name: 'Испания' },
      { code: 'ua', name: 'Украина' },
      { code: 'kz', name: 'Казахстан' },
      { code: 'by', name: 'Беларусь' },
      { code: 'pl', name: 'Польша' },
      { code: 'tr', name: 'Турция' },
      { code: 'nl', name: 'Нидерланды' },
      { code: 'se', name: 'Швеция' },
      { code: 'no', name: 'Норвегия' },
      { code: 'fi', name: 'Финляндия' },
      { code: 'dk', name: 'Дания' },
      { code: 'mx', name: 'Мексика' },
      { code: 'id', name: 'Индонезия' },
      { code: 'sa', name: 'Саудовская Аравия' },
      { code: 'za', name: 'Южная Африка' },
      { code: 'eg', name: 'Египет' },
      { code: 'ar', name: 'Аргентина' },
      { code: 'pt', name: 'Португалия' },
      { code: 'gr', name: 'Греция' },
      { code: 'cz', name: 'Чехия' },
      { code: 'ch', name: 'Швейцария' },
      { code: 'at', name: 'Австрия' },
      { code: 'be', name: 'Бельгия' },
      { code: 'il', name: 'Израиль' },
      { code: 'th', name: 'Таиланд' },
      { code: 'vn', name: 'Вьетнам' },
      { code: 'my', name: 'Малайзия' },
      { code: 'sg', name: 'Сингапур' },
      { code: 'ph', name: 'Филиппины' },
      { code: 'ie', name: 'Ирландия' },
      { code: 'hu', name: 'Венгрия' },
      { code: 'ro', name: 'Румыния' },
      { code: 'bg', name: 'Болгария' },
      { code: 'hr', name: 'Хорватия' },
      { code: 'rs', name: 'Сербия' },
      { code: 'sk', name: 'Словакия' },
      { code: 'si', name: 'Словения' },
      { code: 'ee', name: 'Эстония' },
      { code: 'lv', name: 'Латвия' },
      { code: 'lt', name: 'Литва' },
      { code: 'is', name: 'Исландия' },
      { code: 'lu', name: 'Люксембург' },
      { code: 'mt', name: 'Мальта' },
    ];
    
    const country = countryList.find(c => c.code === countryCode);
    return country ? country.name : 'Неизвестно';
  };

  if (loading) {
    return <div className="loading-profile">
      <div className="loading-container">
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
        <p>Загрузка профиля...</p>
      </div>
    </div>;
  }

  if (!userData) {
    return (
      <div className="content-index">
        <div className="error-message" style={{ 
          textAlign: 'center', 
          padding: '50px',
          color: '#f6efd9'
        }}>
          <h2>Профиль не найден</h2>
          <p>Пользователь с таким ID не существует</p>
          <Link to="/" style={{ color: '#ff6600', textDecoration: 'none' }}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const age = userData.birthDate ? calculateAge(userData.birthDate) : null;
  const playerStatus = getPlayerStatus();

  return (
    <>
      <SEO 
        title={`${userData.battlefield_nickname || 'Player'} - AWL Battlefield 6 Profile`}
        description={`Профиль игрока ${userData.battlefield_nickname || ''} в Arena Warborn League. Статистика, достижения и рейтинг в Battlefield 6.`}
        keywords={`${userData.battlefield_nickname}, bf6 profile, player statistics, AWL, Arena Warborn League`}
        canonicalUrl={`/player/${userId}`}
      />
      
      {/* Основной контент страницы */}
      <div className="content-index">

        {/* Блок информации об игроке */}
        <div className="player-information">
          <img className="profile-awl-background" src="/images/other/profile-background-awl.webp" alt="awl-logo-profile"/>
          
          {/* Основной контейнер для первых четырех блоков */}
          <div className="main-info-container">
            <div className="info-content-wrapper">
              
              {/* Первый блок - Игрок */}
              <div className="info-section">
                <div className="section-title-with-status">
                  <h3 className="section-title">Игрок</h3>
                  <div className={`status-indicator ${isUserOnline ? 'online' : 'offline'}`}>
                    <span className="status-dot"></span>
                    {isUserOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
                <div className="info-block first-block">
                  <div className="nickname-and-class-container">
                    {/* Ник игрока - только просмотр */}
                    <div className="nickname-container">
                      <div className="nickname-display-container">
                        <span className="name-player-style">
                          {userData.battlefield_nickname || 'Ник не указан'}
                        </span>
                      </div>
                    </div>

                    {/* Контейнер для класса игрока */}
                    <div className="class-selector-container">
                      <span className="class-label">Класс:</span>
                      <div className="class-selector public-profile-class-selector">
                        <div className="current-class">
                          <img 
                            src={`/images/icons/icon-class-${userData?.player_class || 'assault'}.png`} 
                            alt={userData?.player_class || 'assault'}
                            className="class-icon-profile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="horizontal-row-1">
                    <div className="info-player-style">
                      {/* Контейнер для иконки страны */}
                      <div className="country-selector">
                        {selectedCountry && selectedCountry !== 'EMPTY' && selectedCountry !== null && selectedCountry !== undefined ? (
                          <Suspense fallback={
                            <div style={{
                              width: '30px',
                              height: '23px',
                              backgroundColor: '#b2ad9c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '2px',
                              color: '#333',
                              fontSize: '12px'
                            }}>
                              🌐
                            </div>
                          }>
                            <Flag 
                              code={selectedCountry} 
                              style={{ 
                              width: '30px',
                              height: '23px',
                              borderRadius: '2px',
                              objectFit: 'cover',
                              display: 'block',
                              marginRight: '15px'
                          }}
                          title={userData.countryName || getCountryName(selectedCountry)}
                          />
                          </Suspense>
                        ) : (
                          <div style={{
                            width: '30px',
                            height: '23px',
                            backgroundColor: '#b2ad9c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '2px',
                            marginRight: '15px',
                            color: '#333',
                            fontSize: '12px'
                          }}>
                            ?
                          </div>
                        )}
                      </div>
                      
                      {/* Имя игрока */}
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
                          {userData.fullname || 'Имя не указано'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="age-and-status-container">
                      {/* Возраст */}
                      <span className="age-and-status-player-style public-profile-age-status">
                        <span className="class-label">Возраст:</span>
                        {age ? displayAge(age) : 'Не указан'}
                      </span>
                      
                      {/* Статус игрока */}
                      <span 
                        className="age-and-status-player-style" 
                        style={{ color: playerStatus.color }}
                      >
                        <span className="class-label">Команда:</span>
                        {playerStatus.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Второй блок - Награды MVP */}

              <MvpAwards userId={userId} />
              
              {/* Третий и четвертый блоки - MMR и Дивизион */}
              <div className="info-sections-container">
                <div className="info-section">
                  <h3 className="section-title">MMR</h3>
                  <div className="info-block mmr-value">
                    {userData.mmr !== undefined && userData.mmr !== null ? userData.mmr : 0}
                  </div>
                </div>
                
                <div className="info-section">
                  <h3 className="section-title">Дивизион</h3>
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
                      {userData.division === "calibration" ? "Калибровка" : userData.division}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок для фото и контактов */}
            <div className="fade-block-container">
              <h3 className="section-title">Контакты</h3>
              <div className="contacts-profile-block">
                <div className="contacts-container">
                  {/* Steam */}
                  <div 
                    className={`contact-block ${!userData.contacts?.steam ? 'disabled' : ''}`}
                    onClick={() => userData.contacts?.steam && handleContactClick('steam', userData.contacts.steam)}
                    title={userData.contacts?.steam ? "Перейти в Steam" : "Контакт не указан"}
                  >
                    <span className="contact-name">Steam</span>
                    <img src="/images/icons/icon-profile-steam.png" alt="Steam" className="contact-icon"/>
                  </div>
                  
                  {/* Telegram */}
                  <div 
                    className={`contact-block middle ${!userData.contacts?.telegram ? 'disabled' : ''}`}
                    onClick={() => userData.contacts?.telegram && handleContactClick('telegram', userData.contacts.telegram)}
                    title={userData.contacts?.telegram ? "Перейти в Telegram" : "Контакт не указан"}
                  >
                    <span className="contact-name">Telegram</span>
                    <img src="/images/icons/icon-profile-telegram.png" alt="Telegram" className="contact-icon"/>
                  </div>
                  
                  {/* WhatsApp */}
                  <div 
                    className={`contact-block ${!userData.contacts?.whatsapp ? 'disabled' : ''}`}
                    onClick={() => userData.contacts?.whatsapp && handleContactClick('whatsapp', userData.contacts.whatsapp)}
                    title={userData.contacts?.whatsapp ? "Перейти в WhatsApp" : "Контакт не указан"}
                  >
                    <span className="contact-name">WhatsApp</span>
                    <img src="/images/icons/icon-profile-whatsup.png" alt="WhatsApp" className="contact-icon"/>
                  </div>
                </div>
              </div>

              {/* Блок с аватаром */}
              <div className="fade-block"><div className="fade-block">
                <div className="avatar-container">
                  <img 
                    src={userData.avatar_url || '/images/other/team-player-empty.png'}
                    alt="Аватар игрока" 
                    className="masked-image"
                  />
                </div></div>
              </div>
            </div>
          </div>

          {/* Блок статистики и действий */}
          <div className="stats-actions-container">
            <div className="info-section">
              <h3 className="section-title">Статистика</h3>
              <div className="info-block">
                <div className="stats-container">
                  <div className="stats-column">
                    <div className="stat-item">
                      <span className="stat-label">{t('stats.kdRatio')}</span>
                      <span className="stat-value">{userData.stats?.kdRatio ?? t('stats.notAvailable')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('stats.winRate')}</span>
                      <span className="stat-value">{userData.stats?.winRate ? `${userData.stats.winRate}%` : t('stats.notAvailable')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('stats.playTime')}</span>
                      <span className="stat-value">{userData.stats?.playTime ?? t('stats.notAvailable')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('stats.favoriteWeapon')}</span>
                      <span className="stat-value">{userData.stats?.favoriteWeapon ?? t('stats.notAvailable')}</span>
                    </div>
                  </div>
                  
                  <div className="stats-column">
                    <div className="stat-item">
                      <span className="stat-label">{t('stats.wins')}</span>
                      <span className="stat-value">{userData.stats?.wins ?? t('stats.notAvailable')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('stats.losses')}</span>
                      <span className="stat-value">{userData.stats?.losses ?? t('stats.notAvailable')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">В разработке</span>
                      <span className="stat-value">{t('stats.notAvailable')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">В разработке</span>
                      <span className="stat-value">{t('stats.notAvailable')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок меню кнопок - для гостя */}
            <div className="info-section">
              <div className="info-block">
                <div className="action-buttons-container">
                  <button className="action-btn">
                    <span className="btn-text">В избранное</span>
                  </button>
                  <button className="action-btn">
                    <span className="btn-text">Пожаловаться</span>
                  </button>
                  <button className="action-btn disabled">
                    <span className="btn-text disabled-text">В разработке</span>
                    <span className="coming-soon-indicator">Скоро</span>
                  </button>
                  <button className="action-btn disabled">
                    <span className="btn-text disabled-text">В разработке</span>
                    <span className="coming-soon-indicator">Скоро</span>
                  </button>
                  <button className="action-btn disabled">
                    <span className="btn-text disabled-text">В разработке</span>
                    <span className="coming-soon-indicator">Скоро</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Блок достижений */}
          <div className="info-section achievements-section">
            <h3 className="section-title">Достижения</h3>
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
      </div>
    </>
  );
};

export default PublicProfile;