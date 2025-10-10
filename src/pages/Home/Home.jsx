// src/pages/index/index.jsx
const Home = () => {
  return (
    <div>
      {/* Баннер */}
      <section className="hero-banner">
        <div className="maintenance-container">
          <img src="/images/icons/icon-processing-works.png" alt="technical-works" className="maintenance-icon" />
          <div className="maintenance-text">Ведутся технические работы</div>
        </div>
      </section>

      {/* Основной контент страницы */}
      <section className="main-content-home">
        <div className="content-grid">
          {/* Левая колонка - текущие турниры */}
          <div className="tournaments-column">
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Текущие турниры</h2>
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
                      <div className="unavailable-text">Информация временно недоступна</div>
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
                      <div className="unavailable-text">Информация временно недоступна</div>
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
                <h2 className="section-title">Последние новости</h2>
              </div>
              
              <div className="news-list">
                <div className="news-item">
                  <div className="news-image">
                    <img src="/images/banners/news-bf6-1.webp" alt="news-one-awl" />
                    <div className="news-content-overlay">
                      <div className="news-content-wrapper">
                        <h3 className="news-title">Важная информация о подтверждении результатов на стартовых турнирах</h3>
                        <div className="news-meta">
                          <span className="news-source">AWL Пресса</span>
                        </div>
                        <p className="news-excerpt">В связи с отсутствием официального API от разработчиков Battlefield 6, подтверждение результатов матчей на 
                          первых соревнованиях будет осуществляться...</p>
                        <div className="news-actions">
                          <button className="news-details-btn">Детали</button>
                          <button className="news-rate-btn">
                            <img src="/images/icons/icon-share.png" alt="share-icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="news-item">
                  <div className="news-image">
                    <img src="/images/banners/news-awlandvk-two.webp" alt="news-awl-and-vk" />
                    <div className="news-content-overlay">
                      <div className="news-content-wrapper">
                        <h3 className="news-title">Возможное стратегическое партнерство с крупными группами VK</h3>
                        <div className="news-meta">
                          <span className="news-source">AWL Пресса</span>
                        </div>
                        <p className="news-excerpt">Arena Warborn League обсуждает возможности сотрудничества с крупными 
                          проектами внутри социальной сети VK в рамках подготовки к запуску соревновательной 
                          сцены по Battlefield 6...</p>
                        <div className="news-actions">
                          <button className="news-details-btn">Детали</button>
                          <button className="news-rate-btn">
                            <img src="/images/icons/icon-share.png" alt="share-icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;