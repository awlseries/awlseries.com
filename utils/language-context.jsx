// utils/language-context.jsx
import { useState, useEffect, createContext, useContext } from 'react';
import { translations } from './language';

const LanguageContext = createContext();

// Провайдер языка
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'ru';
    setCurrentLanguage(savedLanguage);
    document.documentElement.lang = savedLanguage;
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
  };

  const t = (key, variables = {}) => {
    const keys = key.split('.');
    
    if (keys.length === 1) {
      let translation = translations[currentLanguage]?.[key] || translations.ru[key] || key;
      
      if (typeof translation === 'string') {
        Object.entries(variables).forEach(([varKey, varValue]) => {
          translation = translation.replace(new RegExp(`{${varKey}}`, 'g'), varValue);
        });
      }
      
      return translation;
    }
    
    let result = translations[currentLanguage];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        result = translations.ru;
        for (const k2 of keys) {
          result = result?.[k2];
          if (result === undefined) {
            return key;
          }
        }
        break;
      }
    }
    
    if (typeof result === 'string') {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        result = result.replace(new RegExp(`{${varKey}}`, 'g'), varValue);
      });
    }
    
    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования языка
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};