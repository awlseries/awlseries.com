// src/components/Footer/Footer.jsx
import '/src/styles.css';
import { useLanguage } from '/utils/language-context.jsx'; // Добавляем хук

const Footer = ({ onFeedbackClick }) => { // Убираем t из пропсов
const { t } = useLanguage(); // Используем хук
  
  const handleFeedbackClick = () => {
    // Блокируем скролл при открытии модального окна
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    onFeedbackClick();
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Левый блок с контентом */}
        <div className="footer-block">
          <div className="footer-content">
            <img src="/images/icons/awl-icon-gray.png" alt="Arena Warborn League" className="footer-icon"/>
            <p className="footer-text"><strong>Arena Warborn League</strong> 
              <span>{t('footer_description')}</span>
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
            <p className="footer-copyright">© 2025 Arena Warborn League. <span>{t('rights_reserved')}</span></p>
            <p className="footer-links">
              <strong>{t('tournament_rules')}</strong> &nbsp; | &nbsp; 
              <a href="/documents/privacy-policy.pdf" download className="footer-link">{t('privacy_policy')}</a> &nbsp; | &nbsp;
              <a href="/rules" target="_blank" rel="noopener noreferrer" className="footer-link">{t('terms_of_use')}</a>
            </p>
          </div>
        </div>
        
        {/* Правый блок */}
        <div className="footer-block">
          <h3 className="footer-right-title">{t('feedback_modal_title')}</h3>
          
          <p className="footer-right-text">
            <span>{t('feedback_text1')}</span><br/>
            <span>{t('feedback_text2')}</span><br/>
            <span>{t('feedback_text3')}</span> <strong>{t('feedback_text3_part2')}</strong>
          </p>
          
          <div className="footer-buttons">
            <button className="footer-button1">
              <img src="/images/icons/icon-bot.png" alt="Бот" className="footer-button-icon1"/>
            </button>
            
            {/* Кнопка обратной связи с обработчиком */}
            <button 
              className="footer-button2" 
              onClick={handleFeedbackClick}
              aria-label={t('feedback_modal_title')}
            >
              <img src="/images/icons/icon-email-footer.png" alt="Email" className="footer-button-icon2"/>
            </button>
            
            <button className="footer-button3">
              <a href="https://t.me/awlseries_bot" target="_blank" rel="noopener noreferrer">
                <img src="/images/icons/icon-tg.png" alt="Telegram" className="footer-button-icon3"/>
              </a>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;