// components/CountryPicker.jsx
import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { useLanguage } from '/utils/language-context.jsx';

const Flag = lazy(() => import('react-world-flags'));

  const CountryPicker = ({ isOpen, onClose, currentCountry, onCountrySelect, disabled = false, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);
  const { t, currentLanguage } = useLanguage();
  const baseCountryList = useMemo(() => [
    // ... существующие страны ...
    { code: 'ru', ru: 'Россия', en: 'Russia', flag: '🇷🇺' },
    { code: 'us', ru: 'США', en: 'USA', flag: '🇺🇸' },
    { code: 'de', ru: 'Германия', en: 'Germany', flag: '🇩🇪' },
    { code: 'fr', ru: 'Франция', en: 'France', flag: '🇫🇷' },
    { code: 'gb', ru: 'Великобритания', en: 'United Kingdom', flag: '🇬🇧' },
    { code: 'jp', ru: 'Япония', en: 'Japan', flag: '🇯🇵' },
    { code: 'kr', ru: 'Корея', en: 'South Korea', flag: '🇰🇷' },
    { code: 'cn', ru: 'Китай', en: 'China', flag: '🇨🇳' },
    { code: 'br', ru: 'Бразилия', en: 'Brazil', flag: '🇧🇷' },
    { code: 'in', ru: 'Индия', en: 'India', flag: '🇮🇳' },
    { code: 'ca', ru: 'Канада', en: 'Canada', flag: '🇨🇦' },
    { code: 'au', ru: 'Австралия', en: 'Australia', flag: '🇦🇺' },
    { code: 'it', ru: 'Италия', en: 'Italy', flag: '🇮🇹' },
    { code: 'es', ru: 'Испания', en: 'Spain', flag: '🇪🇸' },
    { code: 'ua', ru: 'Украина', en: 'Ukraine', flag: '🇺🇦' },
    { code: 'kz', ru: 'Казахстан', en: 'Kazakhstan', flag: '🇰🇿' },
    { code: 'by', ru: 'Беларусь', en: 'Belarus', flag: '🇧🇾' },
    { code: 'pl', ru: 'Польша', en: 'Poland', flag: '🇵🇱' },
    { code: 'tr', ru: 'Турция', en: 'Turkey', flag: '🇹🇷' },
    { code: 'nl', ru: 'Нидерланды', en: 'Netherlands', flag: '🇳🇱' },
    { code: 'se', ru: 'Швеция', en: 'Sweden', flag: '🇸🇪' },
    { code: 'no', ru: 'Норвегия', en: 'Norway', flag: '🇳🇴' },
    { code: 'fi', ru: 'Финляндия', en: 'Finland', flag: '🇫🇮' },
    { code: 'dk', ru: 'Дания', en: 'Denmark', flag: '🇩🇰' },
    { code: 'mx', ru: 'Мексика', en: 'Mexico', flag: '🇲🇽' },
    { code: 'id', ru: 'Индонезия', en: 'Indonesia', flag: '🇮🇩' },
    { code: 'sa', ru: 'Саудовская Аравия', en: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'za', ru: 'Южная Африка', en: 'South Africa', flag: '🇿🇦' },
    { code: 'eg', ru: 'Египет', en: 'Egypt', flag: '🇪🇬' },
    { code: 'ar', ru: 'Аргентина', en: 'Argentina', flag: '🇦🇷' },
    { code: 'pt', ru: 'Португалия', en: 'Portugal', flag: '🇵🇹' },
    { code: 'gr', ru: 'Греция', en: 'Greece', flag: '🇬🇷' },
    { code: 'cz', ru: 'Чехия', en: 'Czech Republic', flag: '🇨🇿' },
    { code: 'ch', ru: 'Швейцария', en: 'Switzerland', flag: '🇨🇭' },
    { code: 'at', ru: 'Австрия', en: 'Austria', flag: '🇦🇹' },
    { code: 'be', ru: 'Бельгия', en: 'Belgium', flag: '🇧🇪' },
    { code: 'il', ru: 'Израиль', en: 'Israel', flag: '🇮🇱' },
    { code: 'th', ru: 'Таиланд', en: 'Thailand', flag: '🇹🇭' },
    { code: 'vn', ru: 'Вьетнам', en: 'Vietnam', flag: '🇻🇳' },
    { code: 'my', ru: 'Малайзия', en: 'Malaysia', flag: '🇲🇾' },
    { code: 'sg', ru: 'Сингапур', en: 'Singapore', flag: '🇸🇬' },
    { code: 'ph', ru: 'Филиппины', en: 'Philippines', flag: '🇵🇭' },
    { code: 'ie', ru: 'Ирландия', en: 'Ireland', flag: '🇮🇪' },
    { code: 'hu', ru: 'Венгрия', en: 'Hungary', flag: '🇭🇺' },
    { code: 'ro', ru: 'Румыния', en: 'Romania', flag: '🇷🇴' },
    { code: 'bg', ru: 'Болгария', en: 'Bulgaria', flag: '🇧🇬' },
    { code: 'hr', ru: 'Хорватия', en: 'Croatia', flag: '🇭🇷' },
    { code: 'rs', ru: 'Сербия', en: 'Serbia', flag: '🇷🇸' },
    { code: 'sk', ru: 'Словакия', en: 'Slovakia', flag: '🇸🇰' },
    { code: 'si', ru: 'Словения', en: 'Slovenia', flag: '🇸🇮' },
    { code: 'ee', ru: 'Эстония', en: 'Estonia', flag: '🇪🇪' },
    { code: 'lv', ru: 'Латвия', en: 'Latvia', flag: '🇱🇻' },
    { code: 'lt', ru: 'Литва', en: 'Lithuania', flag: '🇱🇹' },
    { code: 'is', ru: 'Исландия', en: 'Iceland', flag: '🇮🇸' },
    { code: 'lu', ru: 'Люксембург', en: 'Luxembourg', flag: '🇱🇺' },
    { code: 'mt', ru: 'Мальта', en: 'Malta', flag: '🇲🇹' },
    { code: 'ae', ru: 'Объединенные Арабские Эмираты', en: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'pk', ru: 'Пакистан', en: 'Pakistan', flag: '🇵🇰' },
    { code: 'ng', ru: 'Нигерия', en: 'Nigeria', flag: '🇳🇬' },
    { code: 'ir', ru: 'Иран', en: 'Iran', flag: '🇮🇷' },
    { code: 'iq', ru: 'Ирак', en: 'Iraq', flag: '🇮🇶' },
    { code: 'af', ru: 'Афганистан', en: 'Afghanistan', flag: '🇦🇫' },
    { code: 'ke', ru: 'Кения', en: 'Kenya', flag: '🇰🇪' },
    { code: 'et', ru: 'Эфиопия', en: 'Ethiopia', flag: '🇪🇹' },
    { code: 'co', ru: 'Колумбия', en: 'Colombia', flag: '🇨🇴' },
    { code: 'pe', ru: 'Перу', en: 'Peru', flag: '🇵🇪' },
    { code: 've', ru: 'Венесуэла', en: 'Venezuela', flag: '🇻🇪' },
    { code: 'cl', ru: 'Чили', en: 'Chile', flag: '🇨🇱' },
    { code: 'nz', ru: 'Новая Зеландия', en: 'New Zealand', flag: '🇳🇿' },
    { code: 'bd', ru: 'Бангладеш', en: 'Bangladesh', flag: '🇧🇩' },
    { code: 'ma', ru: 'Марокко', en: 'Morocco', flag: '🇲🇦' },
    { code: 'tn', ru: 'Тунис', en: 'Tunisia', flag: '🇹🇳' },
    { code: 'dz', ru: 'Алжир', en: 'Algeria', flag: '🇩🇿' },
    { code: 'lb', ru: 'Ливан', en: 'Lebanon', flag: '🇱🇧' },
    { code: 'jo', ru: 'Иордания', en: 'Jordan', flag: '🇯🇴' }
  ], []);

  // Создаем список стран с правильным языком и сортируем по алфавиту
  const countryList = useMemo(() => {
    return baseCountryList
      .map(country => ({
        code: country.code,
        name: currentLanguage === 'ru' ? country.ru : country.en,
        flag: country.flag,
        // Сохраняем оба названия для сортировки
        nameRu: country.ru,
        nameEn: country.en
      }))
      .sort((a, b) => {
        // Сортируем по названию на текущем языке
        const nameA = currentLanguage === 'ru' ? a.nameRu : a.nameEn;
        const nameB = currentLanguage === 'ru' ? b.nameRu : b.nameEn;
        return nameA.localeCompare(nameB, currentLanguage === 'ru' ? 'ru' : 'en');
      });
  }, [baseCountryList, currentLanguage]);

  useEffect(() => {
    setCountries(countryList);
  }, [countryList]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = countryList.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCountries(filtered);
    } else {
      setCountries(countryList);
    }
  }, [searchTerm, countryList]);

  const handleCountryClick = async (country) => {
  if (disabled || !userId) {
    return;
  }
  
  try {
    // Используйте переданный userId
    if (!userId) {
      showSingleNotification(t('countryPicker.notifications.userNotFound'), true);
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        country: country.code,
        countryName: country.name,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', userId); // Используйте userId из пропсов

    if (error) {
      throw error;
    }
    
    onCountrySelect(country);
    showSingleNotification(t('countryPicker.notifications.countryChanged', { countryName: country.name }));
    onClose();
  } catch (error) {
    showSingleNotification(t('countryPicker.notifications.saveError'), true);
  }
};

  if (!isOpen) return null;

 return (
    <div className="country-picker-modal" style={{ display: 'flex' }}>
      <div className="country-picker-content">
        <button className="feedback-close-btn" onClick={onClose}>×</button>
        <div className="country-picker-header">
          <h3 className='title-name-country-picker'>{t('countryPicker.modalTitle')}</h3>
        </div>
        
        <div className="country-search-container">
          <input
            type="text"
            className="country-search-input"
            placeholder={t('countryPicker.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="countries-list">
          {/* Показываем подсказку если страна не выбрана */}
          {(currentCountry === 'EMPTY' || !currentCountry) && (
            <div className="country-notice">
              <span>{t('countryPicker.countryNotice')}</span>
            </div>
          )}
          
          {countries.map((country) => (
            <div
              key={country.code}
              className={`country-item ${currentCountry === country.code ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={() => handleCountryClick(country)}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1
              }}
            >
              <span className="country-flag">
                <Suspense fallback={
                  <div style={{
                    width: '25px',
                    height: '18px',
                    backgroundColor: '#b2ad9c',
                    borderRadius: '2px'
                  }}></div>
                }>
                  <Flag 
                    code={country.code} 
                    style={{ 
                      width: '25px', 
                      height: '18px',
                      borderRadius: '2px',
                      objectFit: 'cover'
                    }}
                  />
                </Suspense>
              </span>
              <span className="country-name">{country.name}</span>
              {currentCountry === country.code && (
                <span className="country-selected-badge">✓</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryPicker;