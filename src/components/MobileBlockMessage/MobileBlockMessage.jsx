// components/MobileBlockMessage/MobileBlockMessage.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '/utils/language-context.jsx';
import './MobileBlockMessage.css';

function MobileBlockMessage() {
    const [deviceType, setDeviceType] = useState('desktop');
    const { currentLanguage, changeLanguage, t } = useLanguage();

    const handleLanguageChange = (lang) => {
        changeLanguage(lang);
    };

    useEffect(() => {
        const checkDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const width = window.innerWidth;
            
            // Проверка User Agent
            const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isTablet = /ipad|android(?=.*mobile)|tablet|kindle|silk/i.test(userAgent);
            
            // Проверка по размеру экрана
            if (isMobile || width <= 768) {
                setDeviceType('mobile');
            } else if (isTablet || (width > 768 && width <= 1100)) {
                setDeviceType('tablet');
            } else {
                setDeviceType('desktop');
            }
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Показываем сообщение только для мобильных и планшетов
    if (deviceType === 'desktop') return null;

    return (
        <div className="mobile-block-message">
            <div className="message-content">
                {/* Языковой переключатель */}
                <div className="language-switcher-mobile">
                    <img 
                        src="/images/icons/icon-rus.png" 
                        alt="Russian" 
                        className={`language-flag ${currentLanguage === 'ru' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('ru')}
                    />
                    <img 
                        src="/images/icons/icon-usa.png" 
                        alt="English" 
                        className={`language-flag ${currentLanguage === 'en' ? 'active' : ''}`}
                        onClick={() => handleLanguageChange('en')}
                    />
                </div>
                <h2 className='mobile-avalible-icon'>{t('mobile_block_title')}</h2>
                <p>
                     {t('mobile_block_description')}
                </p>
                <div className="message-footer">
                    <small>{t('mobile_block_footer')}</small>
                </div>
                <div className="message-image">
                    <img 
                        src="/images/icons/icon-not-information.png" 
                        alt="Information" 
                    />
                </div>
            </div>
        </div>
    );
}

export default MobileBlockMessage;