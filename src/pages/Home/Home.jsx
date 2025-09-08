// src/pages/index/index.jsx
const Home = () => {
  return (
    <div>
      {/* Баннер */}
<section class="hero-banner">
    <div class="maintenance-container">
        <img src="/images/icons/icon-processing-works.png" alt="technical-works" class="maintenance-icon"/>
        <div class="maintenance-text">Ведутся технические работы</div>
    </div>
</section>
    {/* Основной контент страницы */}
    <div class="content">
        <h1>Основной контент страницы</h1>
        <p>Здесь будет располагаться основной контент вашего сайта</p>
    </div>
    </div>
  );
};

export default Home;