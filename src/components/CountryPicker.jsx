// components/CountryPicker.jsx
import React, { useState, useEffect } from 'react';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Flag from 'react-world-flags';
import { showSingleNotification } from '/utils/notifications';

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

  const handleCountryClick = (country) => {
    if (disabled) {
      return; // Не делаем ничего, если компонент заблокирован
    }
    onCountrySelect(country);
  };

  const handleCountrySelect = async (country) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          country: country.code,
          countryName: country.name,
          lastUpdate: serverTimestamp()
        });
        
        onCountrySelect(country);
        showSingleNotification(`✓ Страна изменена на ${country.name}`);
        onClose();
      }
    } catch (error) {
      console.error('Ошибка сохранения страны:', error);
      showSingleNotification('✗ Ошибка сохранения страны', true);
    }
  };

  // Функция для получения отображаемого названия страны
  const getDisplayCountry = () => {
    if (!currentCountry || currentCountry === 'EMPTY') {
      return 'Выберите страну';
    }
    const country = countryList.find(c => c.code === currentCountry);
    return country ? country.name : 'Неизвестно';
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
            {/* Замените эмодзи на react-world-flags */}
            <span className="country-flag">
              <Flag 
                code={country.code} 
                style={{ 
                  width: '25px', 
                  height: '18px',
                  borderRadius: '2px',
                  objectFit: 'cover'
                }}
              />
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