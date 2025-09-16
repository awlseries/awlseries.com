import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchModal from '../SearchModal/SearchModal.jsx';
import SearchResults from '../SearchResults/SearchResults.jsx';
import '/src/styles.css';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Добавляем useNavigate

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };
  // Обработчик клика по черепу - переход на страницу рейтинга
  const handleSkullClick = () => {
    navigate('/Profile');
  };

  // Обработчик поиска
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
    {/* Трапециевидный блок НАД шапкой */}
        <div className="trapezoid-banner"></div>
      <header className="main-header">
        <div className="header-side-blocks">
          {/* Блок в свободном пространстве слева */}
          <button 
            className="free-space-block left-free-space" 
            onClick={handleSearchClick}
          >
            <img src="/images/icons/icon-search-submit.png" alt="awl-search" className="header-icon-target"/>
          </button>

          {/* Левый блок */}
          <div className="left-side-block">
            <div className="side-block-content">

              {/* Контент левого блока - верхний блок  */}
              <div className="horizontal-block top-block">
                <span className="block-text">Присоединяйтесь к нам:</span>
                <div className="icons-container">
                  <div className="icon">
                    <img src="/images/icons/icon-vk.png" alt="awl-vk"/>
                  </div>
                  <div className="icon">
                    <img src="/images/icons/icon-yt.png" alt="awl-youtube"/>
                  </div>
                  <div className="icon">
                    <img src="/images/icons/icon-discord.png" alt="awl-discord"/>
                  </div>
                </div>
              </div>

              {/* Контент левого блока - нижний блок */}
              <div className="horizontal-block bottom-block">
                <div className="menu-item">
                  <Link to="/" className="menu-link">Главная</Link>
                </div>
                <div className="menu-item">
                  <Link to="/tournaments" className="menu-link">Турниры</Link>
                </div>
                <div className="menu-item">
                  <Link to="/teams" className="menu-link">Команды</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Трапеция между блоками */}
          <div className="trapezoid-banner-header"></div>
          
          {/* Правый блок */}
          <div className="right-side-block">
            <div className="side-block-content">
              
              {/* Контент правого блока - верхний блок */}
              <div className="horizontal-block top-block">
              </div>

              {/* Контент правого блока - нижний блок */}
              <div className="horizontal-block bottom-block">
                <div className="menu-item">
                  <Link to="" className="menu-link" alt="empty-menu-link"></Link>
                </div>
                <div className="menu-item">
                  <Link to="/transfers" className="menu-link">Трансферы</Link>
                </div>
                <div className="menu-item">
                  <Link to="/rating" className="menu-link">Рейтинг</Link>
                </div>
              </div>
              
            </div>
          </div>

          {/* Блок в свободном пространстве справа */}
          <button className="free-space-block right-free-space" onClick={handleSkullClick}>
            <img src="/images/icons/icon-skull-0.png" alt="awl-Skull" className="header-icon-skull"/>
            <img src="/images/icons/icon-skull-complete2.png" alt="awl-Skull-complete" className="header-icon-skull-complete"/>
          </button>
        </div>
      </header>

      {/* Модальное окно поиска */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* Окно результатов поиска */}
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