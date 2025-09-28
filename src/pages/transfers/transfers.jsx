import React from 'react';

const Transfers = () => {
  return (
    <div className="content-index-transfers">
    <div className="centered-container">
        
        <div className="top-block">
            <div className="top-left-block">
                <h2>Свободные агенты</h2>
                <p>Найдите игроков без команды, которые находятся в поиске напарников для участия в турнирах. 
                    Наша платформа помогает собрать сильную команду и начать путь к победе в турнирах.</p>
            </div>
            <div className="top-right-block">
                <div className="stat-block">
                    <h3>150+</h3>
                    <p>свободных агентов</p>
                </div>
                <div className="stat-block">
                    <h3>24/7</h3>
                    <p>поиск напарников</p>
                </div>
                <div className="stat-block">
                    <h3>50+</h3>
                    <p>сформированных команд</p>
                </div>
            </div>
        </div>

        <div className="middle-block">
            <div className="players-block">
            <h3 className="block-title">Все игроки</h3>
        </div>
        <div className="data-block">
        <h3 className="block-title">Данные</h3>
        </div>
        </div>

        <div className="bottom-block">
            <div className="filters-container">
            <div className="filters-block-left">
                <div className="filter-item" data-filter="number">#</div>
                <div className="filter-item" data-filter="class">Класс</div>
                <div className="filter-item" data-filter="nickname">Никнейм</div>
                </div>
            <div className="filters-block-right">
                <div className="filter-item" data-filter="kd">У\С</div>
                <div className="filter-item" data-filter="mmr">MMR</div>
                <div className="filter-item" data-filter="playtime">Время в игре</div>
            </div>
            </div>
            <div className="players-container">

                {/* Игрок 1 */}
                <div className="player-row">
                    <div className="player-number">1</div>
                    <div className="player-class">
                        <img src="../public/images/icons/icon-class-sniper.png" alt="class-sniper" class="class-icon"/>
                    </div>
                    <div className="player-nickname">SpYd3R-</div>
                    <div className="player-kd">2.23</div>
                    <div className="player-mmr">2450</div>
                    <div className="player-playtime">120ч</div>
                    <button className="player-details-btn">Подробнее</button>
                </div>

                {/* Игрок 2 */}
                    <div className="player-row">
                        <div className="player-number">2</div>
                        <div className="player-class">
                            <img src="../public/images/icons/icon-class-engineer.png" alt="Поддержка" class="class-icon"/>
                        </div>
                        <div className="player-nickname">ArenaMaster</div>
                        <div className="player-kd">1.78</div>
                        <div className="player-mmr">2310</div>
                        <div className="player-playtime">95ч</div>
                        <button className="player-details-btn">Подробнее</button>
                    </div>
            </div>
        </div>
    </div>
</div>
  );
};

export default Transfers;