import SEO from '../../components/Seo/Seo';
import './Home.css';
import { useState, useEffect } from 'react';
import { getNews } from '../../components/Services/newsService';
import { useLanguage } from '/utils/language-context';
import NewsAdmin from '../../components/Admin/NewsAdmin';

const Home = ({ isAdmin, getCachedNews, invalidateNewsCache }) => {
  const [expandedNews, setExpandedNews] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [newsCache, setNewsCache] = useState({});
  const { t } = useLanguage();
  const { currentLanguage } = useLanguage();

  const handleNewsUpdate = () => {
  invalidateNewsCache();
  
  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await getNews(currentLanguage);
      setNewsData(news);
      setNewsCache(prev => ({
        ...prev,
        [currentLanguage]: news
      }));
    } catch (err) {
      console.error('Ошибка загрузки новостей:', err);
      setError('Ошибка загрузки новостей');
    } finally {
      setLoading(false); // ВАЖНО: сбрасываем загрузку
    }
  };
  loadNews();
};

  // Загрузка новостей с учетом текущего языка
  useEffect(() => {
    
    const loadNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (newsCache[currentLanguage]) {
          setNewsData(newsCache[currentLanguage]);
          setLoading(false);
          return;
        }
        
        const news = await getCachedNews(currentLanguage);
        
        setNewsData(news);
        setNewsCache(prev => ({ ...prev, [currentLanguage]: news }));
        
      } catch (error) {
        console.error('❌ Home: ошибка загрузки новостей', error);
        setError('Ошибка загрузки новостей');
        setNewsData([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoading(false); // ВАЖНО: сбрасываем загрузку в ЛЮБОМ случае
      }
    };

    // Убираем setTimeout - он может мешать
    loadNewsData();
  }, [currentLanguage, getCachedNews]);

  const toggleNews = (index) => {
    setExpandedNews(expandedNews === index ? null : index);
  };

  const toggleAdminPanel = () => {
    setShowAdmin(!showAdmin);
  };

  return (
    <>
      <SEO 
        title="Battlefield 6 Esports Tournaments - Arena Warborn League"
        description="Join official Battlefield 6 competitive tournaments. Team rankings, player stats, and BF6 esports community. Register now for season matches!"
        keywords="battlefield 6 tournaments, bf6 competitive, esports bf6, battlefield 6 league, gaming tournaments"
        canonicalUrl="/"
      />
      
      <div>
        {/* Баннер */}
        <section className="hero-banner">
          <div className="maintenance-container">
            <img src="/images/icons/icon-processing-works.png" alt="technical-works" className="maintenance-icon" loading="eager" />
            <div className="maintenance-text">{t('technical_works_title')}</div>
          </div>
        </section>

        {/* 👇 Админ-панель поверх всей страницы */}
        {isAdmin && showAdmin && (
          <div className="admin-panel-overlay">
            <NewsAdmin 
              onClose={() => setShowAdmin(false)}
              onNewsUpdate={handleNewsUpdate}
            />
          </div>
        )}

        {/* Основной контент страницы */}
      <section className="main-content-home">
        <div className="content-grid">
          {/* Лева¤ колонка - текущие турниры */}
          <div className="tournaments-column">
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title-home">{t('current_tournaments_title')}</h2>
              </div>
              <div className="tournaments-list">
                {/* Первый турнир */}
                <div className="tournament-item">
                  <div className="tournament-header">
                    <div className="tournament-title-wrapper">
                      <h3 className="tournament-name">WEEKND CHALLENGE FALL ONE SERIES</h3>
                      <div className="tournament-formats-container">
                        <span className="tournament-format">Solo format</span>
                        <span className="tournament-format-2">Ranked</span>
                      </div>
                    </div>
                    <span className="tournament-date">01.11 - 02.11.2025</span>
                  </div>
                  
                  <div className="tournament-info">
                    <button className="tournament-details-btn">Подробнее</button>
                    <div className="tournament-details">
                      <span className="tournament-prize">$100</span>
                      <span className="tournament-teams">0/84 участников</span>
                    </div>
                  </div>
                  <div className="tournament-progress">
                    <div className="progress-bar" style={{width: "65%"}}></div>
                  </div>
                  <div className="tournament-footer">
                    <span className="tournament-status">Групповой этап • 65%</span>
                  </div>
                  <div className="tournament-type-selector">
                    <div className="tournament-type-option active">Battle Royal</div>
                    <div className="tournament-type-option">Multiplayer</div>
                    <div className="tournament-type-option">Portal</div>
                  </div>
                </div>
                
                {/* Второй турнир (недоступен) */}
                <div className="tournament-item unavailable">
                  <div className="unavailable-overlay">
                    <div className="unavailable-content">
                      <div className="unavailable-icon">
                        <img src="/images/icons/icon-warning-skull.png" alt="unavailable-icon-skull-awl" />
                      </div>
                      <div className="unavailable-text">Информаци¤ временно недоступна</div>
                    </div>
                  </div>
                  <div className="tournament-header">
                    <div className="tournament-title-wrapper">
                      <h3 className="tournament-name">Winter Duo Cup</h3>
                      <span className="tournament-format">2x2</span>
                    </div>
                    <span className="tournament-date">10.12 - 20.12.2024</span>
                  </div>
                  
                  <div className="tournament-type-selector">
                    <div className="tournament-type-option">Battle Royal</div>
                    <div className="tournament-type-option active">Multiplayer</div>
                    <div className="tournament-type-option">Portal</div>
                  </div>
                  
                  <div className="tournament-info">
                    <div className="tournament-details">
                      <span className="tournament-prize">$10,000</span>
                      <span className="tournament-teams">24/32 команд</span>
                    </div>
                  </div>
                  <div className="tournament-progress">
                    <div className="progress-bar" style={{width: "30%"}}></div>
                  </div>
                  <div className="tournament-footer">
                    <span className="tournament-status">Отборочный этап • 30%</span>
                    <button className="tournament-details-btn">Подробнее</button>
                  </div>
                </div>

                {/* Третий турнир (недоступен) */}
                <div className="tournament-item unavailable">
                  <div className="unavailable-overlay">
                    <div className="unavailable-content">
                      <div className="unavailable-icon">
                        <img src="/images/icons/icon-warning-skull.png" alt="unavailable-icon-skull-awl" />
                      </div>
                      <div className="unavailable-text">Информаци¤ временно недоступна</div>
                    </div>
                  </div>
                  <div className="tournament-header">
                    <div className="tournament-title-wrapper">
                      <h3 className="tournament-name">WEEKND CHALLENGE FALL ONE SERIES</h3>
                      <div className="tournament-formats-container">
                        <span className="tournament-format">Solo format</span>
                        <span className="tournament-format-2">Ranked</span>
                      </div>
                    </div>
                    <span className="tournament-date">01.11 - 02.11.2025</span>
                  </div>
                  
                  <div className="tournament-info">
                    <button className="tournament-details-btn">Подробнее</button>
                    <div className="tournament-details">
                      <span className="tournament-prize">$100</span>
                      <span className="tournament-teams">0/84 участников</span>
                    </div>
                  </div>
                  <div className="tournament-progress">
                    <div className="progress-bar" style={{width: "65%"}}></div>
                  </div>
                  <div className="tournament-footer">
                    <span className="tournament-status">Групповой этап • 65%</span>
                  </div>
                  <div className="tournament-type-selector">
                    <div className="tournament-type-option active">Battle Royal</div>
                    <div className="tournament-type-option">Multiplayer</div>
                    <div className="tournament-type-option">Portal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
             {/* Правая колонка - новости */}
            <div className="news-column">
              <div className="content-section">
                <div className="section-header">
                  <h2 className="section-title-home">{t('last_news_title')}</h2>
                  
                  {/* Кнопка редактирования для админа */}
                  {isAdmin && (
                    <button 
                      className="edit-news-btn"
                      onClick={toggleAdminPanel}
                    >
                      {showAdmin ? 'Закрыть' : 'Редактировать'}
                    </button>
                  )}
                </div>
                
                {/* Основной контент новостей */}
                <>
                  {/* Состояние загрузки */}
                  {loading && (
                    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Загрузка новостей...</p>
    </div>
                  )}

                  {/* Сообщение об ошибке */}
                  {error && !loading && (
                    <div className="news-error">
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Список новостей */}
                  <div className="news-list">
                    {!loading && !error && newsData.map((news, index) => (
                      <div className="news-item" key={news.id || index}>
                        <div className="news-image">
                          <img src={news.image} alt={news.alt} />
                          <div className={`news-content-overlay ${expandedNews === index ? 'expanded' : ''}`}>
                            <div className="news-content-wrapper">
                              <h3 className="news-title">{news.title}</h3>
                              <div className="news-meta">
                                <span className="news-source">{news.source}</span>
                              </div>
                              <div className={`news-text ${expandedNews === index ? 'full' : 'excerpt'}`}>
                                {expandedNews === index 
                                  ? news.fullText.map((paragraph, i) => (
                                      <p key={i}>{paragraph}</p>
                                    ))
                                  : news.excerpt
                                }
                              </div>
                              <div className="news-actions">
                                <button 
                                  className="news-details-btn" 
                                  onClick={() => toggleNews(index)}
                                >
                                  {expandedNews === index ? t('details_back_button') : t('details_button')}
                                </button>
                                <button className="news-rate-btn">
                                  <img src="/images/icons/icon-share.png" alt="share-icon" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Сообщение если нет новостей */}
                  {!loading && !error && newsData.length === 0 && (
                    <div className="no-news">
                      <p>Новостей пока нет</p>
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;