import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchModal from '../SearchModal/SearchModal.jsx';
import SearchResults from '../SearchResults/SearchResults.jsx';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebase';
import Ticker from '../Ticker/Ticker.jsx';
import { showSingleNotification } from '/utils/notifications';
import { useLanguage } from '/utils/language-context.jsx';
import '/src/styles.css';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Хук для получения текущего пути
  const [searchKey, setSearchKey] = useState(0);
  const { currentLanguage, changeLanguage, t } = useLanguage();

  // Единственный useEffect для проверки аутентификации
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        setIsEmailVerified(user.emailVerified);
      } else {
        setIsAuthenticated(false);
        setUserEmail(t('not_authenticated_text'));
        setIsEmailVerified(false);
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
}, [t]);

  // Функция для обработки смены языка
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    // Принудительно обновляем ключ, чтобы пересоздать SearchModal
    setSearchKey(prev => prev + 1);
  };

  // Обновляем текущий путь при изменении location
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Функция для проверки активного пункта меню
  const isActiveLink = (path) => {
    return currentPath === path;
  };

  // Функция для отправки верификации email
const handleSendVerification = async () => {
  if (!auth.currentUser) return;
  
  setIsSendingVerification(true);
  try {
    await sendEmailVerification(auth.currentUser);
    showSingleNotification(t('notifications.verification_sent'), false);
  } catch (error) {
    console.error('Ошибка отправки верификации:', error);
    showSingleNotification(t('notifications.resend_error'), 'error');
  } finally {
    setIsSendingVerification(false);
  }
};

// Функция для выхода из аккаунта
const handleLogout = async () => {
  try {
    await auth.signOut();
    
    // ОЧИСТКА ЛОКАЛЬНОГО ХРАНИЛИЩА
    const storageKeys = [
      'email_verification_pending',
      'temp_email_for_verification', 
      'temp_password_for_verification'
    ];
    
    storageKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    showSingleNotification(t('notifications.logout_success'), false);
    navigate('/');
    
  } catch (error) {
    console.error('Ошибка выхода:', error);
    showSingleNotification(t('notifications.logout_error'), true);
  }
};

  // Функция для определения класса статуса email
  const getEmailStatusClass = () => {
    if (!isAuthenticated) {
      return 'not-authenticated';
    }
    return isEmailVerified ? 'authenticated' : 'not-verified';
  };

  // Функция для определения класса иконки
  const getUserIconStatusClass = () => {
    if (!isAuthenticated) {
      return 'not-authenticated';
    }
    return isEmailVerified ? 'authenticated' : 'not-verified';
  };

  // Функция для получения пути к иконке
  const getUserIconPath = () => {
    if (!isAuthenticated) {
      return '../images/icons/icon-profile.png';
    }
    return isEmailVerified 
      ? '../images/icons/icon-profile.png' 
      : '../images/icons/icon-promo-line-news.png';
  };

  // Функция для открытия поиска
  const handleSearchClick = () => {
    setIsSearchOpen(true);
    // Также обновляем ключ при каждом открытии
    setSearchKey(prev => prev + 1);
  };
  const handleSkullClick = () => navigate('/Profile');
  const handleSearch = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  };
  const closeSearchResults = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <>
      <div className="trapezoid-banner"></div>
      
      <header className="main-header">
        <div className="header-side-blocks">
          <button className="free-space-block left-free-space" onClick={handleSearchClick}>
            <img src="/images/icons/icon-search-submit.png" alt="awl-search" className="header-icon-target"/>
          </button>

          <div className="left-side-block">
            <div className="side-block-content">
              <div className="horizontal-block top-block">
                <span className="block-text">{t('join_us_text')}</span>
                <div className="icons-container">
                  <div className="icon"><img src="/images/icons/icon-vk.png" alt="awl-vk"/></div>
                  <div className="icon"><img src="/images/icons/icon-yt.png" alt="awl-youtube"/></div>
                  <div className="icon"><img src="/images/icons/icon-discord.png" alt="awl-discord"/></div>
                </div>
              </div>

              <div className="horizontal-block bottom-block">
                <div className={`menu-item ${isActiveLink('/') ? 'current' : ''}`}>
                  <Link to="/" className="menu-link">{t('home_link')}</Link>
                </div>
                <div className={`menu-item ${isActiveLink('/tournaments') ? 'current' : ''}`}>
                  <Link to="/tournaments" className="menu-link">{t('tournaments_link')}</Link>
                </div>
                <div className={`menu-item ${isActiveLink('/teams') ? 'current' : ''}`}>
                  <Link to="/teams" className="menu-link">{t('teams_link')}</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="trapezoid-banner-header"></div>
          
          <div className="right-side-block">
            <div className="side-block-content">

            {/* Контент правого блока - верхний блок */}
            <div className="horizontal-block top-block">

              {/* Информация о пользователе */}
              <div className="user-info-container">
                <div className="user-icon-status">
                  <img 
                    src={getUserIconPath()} 
                    alt="user profile icon" 
                    className={`user-icon ${getUserIconStatusClass()}`}
                  />
                </div>
                <div className="user-email">
                  <span className={`email-text ${getEmailStatusClass()} ${!isAuthChecked ? 'loading' : ''}`}>
                    {!isAuthChecked ? t('loading_text') : (userEmail || t('not_authenticated_text'))}
                  </span>
                </div>

                {/* Кнопка входа для неавторизованных пользователей */}
                {!isAuthenticated && isAuthChecked && (
                  <button 
                    className="login-btn"
                    onClick={() => navigate('/registration')}
                  >
                    {t('login_button')}
                  </button>
                )}
                
                {/* Кнопка подтверждения email для неверифицированных пользователей */}
                {isAuthenticated && !isEmailVerified && isAuthChecked && (
                  <button 
                    className="verify-email-btn"
                    onClick={handleSendVerification}
                    disabled={isSendingVerification}
                  >
                    {isSendingVerification ? t('sending_button') : t('verify_email_button')}
                  </button>
                )}

                {/* Кнопка выхода для верифицированных пользователей */}
                {isAuthenticated && isEmailVerified && isAuthChecked && (
                  <button 
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    {t('logout_button')}
                  </button>
                )}
              </div>

              {/* Языковой переключатель */}
              <div className="language-switcher">
                <img 
                  src="../images/icons/icon-rus.png" 
                  alt="Russian" 
                  className={`language-flag ${currentLanguage === 'ru' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('ru')}
                />
                <img 
                  src="../images/icons/icon-usa.png" 
                  alt="English" 
                  className={`language-flag ${currentLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                />
              </div>
            </div>
              
              <div className="horizontal-block bottom-block">
                <div className="menu-item disabled">
                  <Link to="" className="menu-link" alt="empty-menu-link"></Link>
                </div>
                <div className={`menu-item ${isActiveLink('/transfers') ? 'current' : ''}`}>
                  <Link to="/transfers" className="menu-link">{t('transfers_link')}</Link>
                </div>
                <div className={`menu-item ${isActiveLink('/rating') ? 'current' : ''}`}>
                  <Link to="/rating" className="menu-link">{t('rating_link')}</Link>
                </div>
              </div>
            </div>
          </div>

          <button className="free-space-block right-free-space" onClick={handleSkullClick}>
            <img src="/images/icons/icon-skull-0.png" alt="awl-Skull" className="header-icon-skull"/>
            <img src="/images/icons/icon-skull-complete2.png" alt="awl-Skull-complete" className="header-icon-skull-complete"/>
          </button>
        </div>
      </header>

      {/* Бегущая строка как React компонент */}
      <Ticker />

      <SearchModal 
        key={`search-modal-${searchKey}-${currentLanguage}`}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      {searchResults.length > 0 && (
        <SearchResults 
          results={searchResults}
          query={searchQuery}
          onClose={closeSearchResults}
        />
      )}
    </>
  );
};

export default Header;