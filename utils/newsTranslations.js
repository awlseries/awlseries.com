import { useLanguage } from './language-context';

// Хук для получения переведенных новостей
export const useNewsTranslations = () => {
  const { currentLanguage } = useLanguage();

  // Возвращаем только текущий язык
  // Загрузку новостей будем делать напрямую в компоненте
  return {
    currentLanguage
  };
};

// Вспомогательные функции для работы с переводами
export const newsTranslationUtils = {
  // Проверка наличия всех необходимых переводов
  validateTranslations: (translations) => {
    const requiredLanguages = ['ru', 'en'];
    const requiredFields = ['title', 'excerpt', 'full_text'];
    
    for (const lang of requiredLanguages) {
      if (!translations[lang]) {
        return false;
      }
      for (const field of requiredFields) {
        if (!translations[lang][field]?.trim()) {
          return false;
        }
      }
    }
    return true;
  },

  // Генерация slug из заголовка
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s]/gi, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
  },

  // Получение источника по языку
  getDefaultSource: (language) => {
    return language === 'ru' ? 'AWL Пресса' : 'AWL Press';
  }
};