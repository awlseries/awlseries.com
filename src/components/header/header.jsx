// src/components/header/Header.jsx
import '/src/styles.css';

const header = () => {
  return (
    // Header с копией трапециевидного блока
    // <div class="trapezoid-banner"></div>
<header class="main-header">
    <div class="header-side-blocks">
        {/* Блок в свободном пространстве слева */}
        <button class="free-space-block left-free-space" id="search-toggle">
                <img src="/images/icons/icon-search-submit.png" alt="awl-search" class="header-icon-target"/>
            </button>

        {/* Левый блок */}
        <div class="left-side-block">
            <div class="side-block-content">

                {/* Контент левого блока - верхний блок  */}
                <div class="horizontal-block top-block">
                    <span class="block-text">Присоединяйтесь к нам:</span>
                    <div class="icons-container">
        <div class="icon">
            <img src="/images/icons/icon-vk.png" alt="awl-vk"/>
        </div>
        <div class="icon">
            <img src="/images/icons/icon-yt.png" alt="awl-youtube"/>
        </div>
        <div class="icon">
            <img src="/images/icons/icon-discord.png" alt="awl-discord"/>
        </div>
    </div>
    </div>

                {/* Контент левого блока - нижний блок */}
<div class="horizontal-block bottom-block">
    <div class="menu-item">
        <a href="/index" class="menu-link">Главная</a>
    </div>
    <div class="menu-item">
        <a href="/tournaments" class="menu-link">Турниры</a>
    </div>
    <div class="menu-item">
        <a href="/teams" class="menu-link">Команды</a>
    </div>
</div>
    </div>
    </div>

        {/* Трапеция между блоками */}
        <div class="trapezoid-banner-header"></div>
        
        {/* Правый блок */}
<div class="right-side-block">
    <div class="side-block-content">
        
       {/* Контент правого блока - верхний блок */}
        <div class="horizontal-block top-block">
        </div>

        {/* Контент правого блока - нижний блок */}
        <div class="horizontal-block bottom-block">
            <div class="menu-item">
                <a href="/" class="menu-link" alt="empty-text"></a>
            </div>
            <div class="menu-item">
                <a href="/transfers" class="menu-link">Трансферы</a>
            </div>
            <div class="menu-item">
                <a href="/rating" class="menu-link">Рейтинг</a>
            </div>
        </div>
        
    </div>
</div>

                {/* Блок в свободном пространстве справа */}
        <button class="free-space-block right-free-space">
                <img src="/images/icons/icon-skull-0.png" alt="awl-Skull" class="header-icon-skull"/>
                <img src="/images/icons/icon-skull-complete2.png" alt="awl-Skull-complete" class="header-icon-skull-complete"/>
            </button>
</div>
</header>
);
};

export default header;