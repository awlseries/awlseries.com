
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase';
import { newsService } from './newsService';

// Ключи для localStorage
const ADMIN_CACHE_KEY = 'admin_cache';
const NEWS_CACHE_KEY = 'news_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 дней
const NEWS_CACHE_DURATION = 30 * 60 * 1000; // 30 минут для новостей

// Функции для работы с кэшем админа
const getAdminCache = () => {
  try {
    const cached = localStorage.getItem(ADMIN_CACHE_KEY);
    if (!cached) return null;
    
    const { value, timestamp, userId } = JSON.parse(cached);
    
    // Проверяем не устарел ли кэш
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(ADMIN_CACHE_KEY);
      return null;
    }
    
    return { value, timestamp, userId };
  } catch (error) {
    console.error('Ошибка чтения кэша админа:', error);
    return null;
  }
};

const setAdminCache = (userId, isAdmin) => {
  try {
    const cacheData = {
      value: isAdmin,
      timestamp: Date.now(),
      userId: userId
    };
    localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Ошибка записи кэша админа:', error);
  }
};

// Функции для работы с кэшем новостей
const getNewsCache = (lang) => {
  try {
    const cached = localStorage.getItem(`${NEWS_CACHE_KEY}_${lang}`);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Проверяем не устарели ли новости
    if (Date.now() - timestamp > NEWS_CACHE_DURATION) {
      localStorage.removeItem(`${NEWS_CACHE_KEY}_${lang}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Ошибка чтения кэша новостей:', error);
    return null;
  }
};

const setNewsCache = (lang, newsData) => {
  try {
    const cacheData = {
      data: newsData,
      timestamp: Date.now()
    };
    localStorage.setItem(`${NEWS_CACHE_KEY}_${lang}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Ошибка записи кэша новостей:', error);
  }
};

const clearNewsCache = (lang = null) => {
  try {
    if (lang) {
      localStorage.removeItem(`${NEWS_CACHE_KEY}_${lang}`);
    } else {
      // Очищаем все языки
      Object.keys(localStorage)
        .filter(key => key.startsWith(`${NEWS_CACHE_KEY}_`))
        .forEach(key => localStorage.removeItem(key));
      console.log('🧹 Весь кэш новостей очищен');
    }
  } catch (error) {
    console.error('Ошибка очистки кэша новостей:', error);
  }
};

const clearAdminCache = () => {
  try {
    localStorage.removeItem(ADMIN_CACHE_KEY);
  } catch (error) {
    console.error('Ошибка очистки кэша админа:', error);
  }
};

// Объединенный хук
export const useAdminCache = (userId) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAdminWithCache = async () => {
      try {
        // 1. Проверяем кэш
        const cached = getAdminCache();
        if (cached && cached.userId === userId) {
          setIsAdmin(cached.value);
          setLoading(false);
          return;
        }
        
        // 2. Запрашиваем из базы
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .single();

        if (error) {
          console.log('❌ Профиль админа не найден:', error);
          setIsAdmin(false);
          setAdminCache(userId, false);
        } else {
          const adminStatus = profile?.is_admin || false;
          console.log('🎯 Получен статус админа из БД:', adminStatus);
          setIsAdmin(adminStatus);
          setAdminCache(userId, adminStatus);
        }
      } catch (error) {
        console.error('❌ Ошибка при проверке прав админа:', error);
        setIsAdmin(false);
        setAdminCache(userId, false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminWithCache();
  }, [userId]);

  // Функции для работы с новостями
  const getCachedNews = useCallback(async (lang = 'ru') => {
    // 1. Проверяем кэш
    const cachedNews = getNewsCache(lang);
    if (cachedNews) {
      return cachedNews;
    }

    // 2. Загружаем с сервера
    try {
      const news = await newsService.getAllNews(lang);
      setNewsCache(lang, news);
      return news;
    } catch (error) {
      console.error('❌ Ошибка загрузки новостей:', error);
      return [];
    }
  }, []);

  const updateNewsCache = useCallback((lang, newsData) => {
    setNewsCache(lang, newsData);
  }, []);

  const invalidateNewsCache = useCallback((lang = null) => {
    clearNewsCache(lang);
  }, []);

  const clearAllCache = useCallback(() => {
    clearAdminCache();
    clearNewsCache();
  }, []);

  return {
    // Админские права
    isAdmin,
    loading,
    
    // Новости
    getCachedNews,
    updateNewsCache,
    invalidateNewsCache,
    
    // Очистка
    clearAdminCache,
    clearNewsCache,
    clearAllCache
  };
};