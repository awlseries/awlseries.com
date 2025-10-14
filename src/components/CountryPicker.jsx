// components/CountryPicker.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { supabase } from '../supabase';
import { showSingleNotification } from '/utils/notifications';

const Flag = lazy(() => import('react-world-flags'));

const CountryPicker = ({ isOpen, onClose, currentCountry, onCountrySelect, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);

  const countryList = [
    { code: 'ru', name: 'Россия', flag: '🇷🇺' },
    { code: 'us', name: 'США', flag: '🇺🇸' },
    { code: 'de', name: 'Германия', flag: '🇩🇪' },
    { code: 'fr', name: 'Франция', flag: '🇫🇷' },
    { code: 'gb', name: 'Великобритания', flag: '🇬🇧' },
    { code: 'jp', name: 'Япония', flag: '🇯🇵' },
    { code: 'kr', name: 'Корея', flag: '🇰🇷' },
    { code: 'cn', name: 'Китай', flag: '🇨🇳' },
    { code: 'br', name: 'Бразилия', flag: '🇧🇷' },
    { code: 'in', name: 'Индия', flag: '🇮🇳' },
    { code: 'ca', name: 'Канада', flag: '🇨🇦' },
    { code: 'au', name: 'Австралия', flag: '🇦🇺' },
    { code: 'it', name: 'Италия', flag: '🇮🇹' },
    { code: 'es', name: 'Испания', flag: '🇪🇸' },
    { code: 'ua', name: 'Украина', flag: '🇺🇦' },
    { code: 'kz', name: 'Казахстан', flag: '🇰🇿' },
    { code: 'by', name: 'Беларусь', flag: '🇧🇾' },
    { code: 'pl', name: 'Польша', flag: '🇵🇱' },
    { code: 'tr', name: 'Турция', flag: '🇹🇷' },
    { code: 'nl', name: 'Нидерланды', flag: '🇳🇱' },
    { code: 'se', name: 'Швеция', flag: '🇸🇪' },
    { code: 'no', name: 'Норвегия', flag: '🇳🇴' },
    { code: 'fi', name: 'Финляндия', flag: '🇫🇮' },
    { code: 'dk', name: 'Дания', flag: '🇩🇰' },
    { code: 'mx', name: 'Мексика', flag: '🇲🇽' },
    { code: 'id', name: 'Индонезия', flag: '🇮🇩' },
    { code: 'sa', name: 'Саудовская Аравия', flag: '🇸🇦' },
    { code: 'za', name: 'Южная Африка', flag: '🇿🇦' },
    { code: 'eg', name: 'Египет', flag: '🇪🇬' },
    { code: 'ar', name: 'Аргентина', flag: '🇦🇷' },
    { code: 'pt', name: 'Португалия', flag: '🇵🇹' },
    { code: 'gr', name: 'Греция', flag: '🇬🇷' },
    { code: 'cz', name: 'Чехия', flag: '🇨🇿' },
    { code: 'ch', name: 'Швейцария', flag: '🇨🇭' },
    { code: 'at', name: 'Австрия', flag: '🇦🇹' },
    { code: 'be', name: 'Бельгия', flag: '🇧🇪' },
    { code: 'il', name: 'Израиль', flag: '🇮🇱' },
    { code: 'th', name: 'Таиланд', flag: '🇹🇭' },
    { code: 'vn', name: 'Вьетнам', flag: '🇻🇳' },
    { code: 'my', name: 'Малайзия', flag: '🇲🇾' },
    { code: 'sg', name: 'Сингапур', flag: '🇸🇬' },
    { code: 'ph', name: 'Филиппины', flag: '🇵🇭' },
    { code: 'ie', name: 'Ирландия', flag: '🇮🇪' },
    { code: 'hu', name: 'Венгрия', flag: '🇭🇺' },
    { code: 'ro', name: 'Румыния', flag: '🇷🇴' },
    { code: 'bg', name: 'Болгария', flag: '🇧🇬' },
    { code: 'hr', name: 'Хорватия', flag: '🇭🇷' },
    { code: 'rs', name: 'Сербия', flag: '🇷🇸' },
    { code: 'sk', name: 'Словакия', flag: '🇸🇰' },
    { code: 'si', name: 'Словения', flag: '🇸🇮' },
    { code: 'ee', name: 'Эстония', flag: '🇪🇪' },
    { code: 'lv', name: 'Латвия', flag: '🇱🇻' },
    { code: 'lt', name: 'Литва', flag: '🇱🇹' },
    { code: 'is', name: 'Исландия', flag: '🇮🇸' },
    { code: 'lu', name: 'Люксембург', flag: '🇱🇺' },
    { code: 'mt', name: 'Мальта', flag: '🇲🇹' },
  ];

  useEffect(() => {
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = countryList.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCountries(filtered);
    } else {
      setCountries(countryList);
    }
  }, [searchTerm]);

  const handleCountryClick = async (country) => {
  if (disabled) {
    return; // Не делаем ничего, если компонент заблокирован
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({
          country: country.code,
          countryName: country.name,
          lastUpdate: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      
      onCountrySelect(country);
      showSingleNotification(`✓ Страна изменена на ${country.name}`);
      onClose();
    }
  } catch (error) {
    console.error('Ошибка сохранения страны:', error);
    showSingleNotification('✗ Ошибка сохранения страны', true);
  }
};

  if (!isOpen) return null;

 return (
    <div className="country-picker-modal" style={{ display: 'flex' }}>
      <div className="country-picker-content">
        <button 
            className="feedback-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        <div className="country-picker-header">
          <h3>Выберите страну</h3>
        </div>
        
        <div className="country-search-container">
          <input
            type="text"
            className="country-search-input"
            placeholder="Поиск страны..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="countries-list">
          {/* Показываем подсказку если страна не выбрана */}
          {(currentCountry === 'EMPTY' || !currentCountry) && (
            <div className="country-notice">
              <span>Страну можно выбрать только один раз</span>
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