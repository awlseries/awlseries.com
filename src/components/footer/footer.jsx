// src/components/footer/footer.jsx
import '/src/styles.css';

const footer = () => {
  return (
    <footer className="main-footer">
        <div className="footer-container">
            {/* Левый блок с контентом */}
        <div className="footer-block">
            <div className="footer-content">
                <img src="/images/icons/awl-icon-gray.png" alt="Arena Warborn League" className="footer-icon"/>
                <p className="footer-text"><strong>Arena Warborn League</strong> 
                    <span data-translate="footer_description">— это новая профессиональная киберспортивная лига, учрежденная 
                    с целью развития и структурирования соревновательной экосистемы в современных дисциплинах киберспорта</span>
                </p>
            </div>
        </div>
           {/* Центральный блок */}
        <div className="footer-block">
    {/* Иконки в центре */}
    <div className="footer-icons">
        <img src="/images/icons/bf-icon.png" alt="Battlefield" className="footer-center-icon" width="220px" height="47px"/>
        <img src="/images/icons/ea-icon.png" alt="EA Sports" className="footer-center-icon" width="120px" height="120px"/>
    </div>
    {/* Текст внизу */}
    <div className="footer-bottom-text">
        <p className="footer-copyright">© 2025 Arena Warborn League. <span data-translate="rights_reserved">Все права защищены.</span></p>
        <p className="footer-links">
            <strong data-translate="tournament_rules">Правила турниров</strong> | 
            <a href="../documents/privacy-policy.pdf" download className="footer-link" data-translate="privacy_policy">Политика конфиденциальности</a>  | 
            <a href="rules.html" target="_blank" className="footer-link" data-translate="terms_of_use">Условия использования</a>
        </p>
    </div>
    </div>
    {/* Правый блок */}
<div className="footer-block">
    <h3 className="footer-right-title" data-translate="feedback_title">Обратная связь</h3>
    
   <p className="footer-right-text">
        <span data-translate="feedback_text1">Обратная связь помогает нам становиться лучше.</span><br/>
        <span data-translate="feedback_text2">Будем рады любым вопросам и предложениям.</span><br/>
        <span data-translate="feedback_text3">Обработка запроса в течение</span> <strong>24 часов.</strong>
    </p>
    <div className="footer-buttons">
        <button className="footer-button1">
            <img src="/images/icons/icon-bot.png" alt="Бот" className="footer-button-icon1"/>
        </button>
        <button className="footer-button2" id="feedback-button">
            <img src="/images/icons/icon-email-footer.png" alt="Email" className="footer-button-icon2"/>
        </button>
        <button className="footer-button3">
          <a href="https://t.me/awlseries_bot" target="_blank">
            <img src="/images/icons/icon-tg.png" alt="Telegram" className="footer-button-icon3"/>
            </a>
        </button>
    </div>
    </div>
    </div>
        
    </footer>
     );
};

export default footer;