import { supabase } from '../../supabase';
import { newsTranslationUtils } from '/utils/newsTranslations';

export const newsService = {
  // Получить все новости с учетом текущего языка - ИСПРАВЛЕННАЯ ВЕРСИЯ
  async getAllNews(lang = 'ru') {
    try {
      
      const { data, error } = await supabase
        .from('news')
        .select(`
          id,
          slug,
          image_url,
          published_at,
          is_published,
          news_translations(
            title,
            excerpt,
            full_text,
            source,
            language
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('❌ Ошибка Supabase:', error);
        throw error;
      }

      // Фильтруем и форматируем данные
      const formattedNews = data
        .map((news, index) => this.formatNewsItem(news, index, lang))
        .filter(news => news.title && news.excerpt); // Фильтруем пустые новости

      return formattedNews;

    } catch (error) {
      // Возвращаем пустой массив вместо ошибки, чтобы не ломать UI
      return [];
    }
  },

  // Упрощенная функция форматирования
  formatNewsItem(news, index, lang) {
    try {
      // Ищем перевод для нужного языка, или берем первый доступный
      let translation = null;
      
      if (news.news_translations && news.news_translations.length > 0) {
        translation = news.news_translations.find(t => t.language === lang) || news.news_translations[0];
      }

      // Если перевода нет, создаем заглушку
      if (!translation) {
        console.warn('⚠️ Нет перевода для новости:', news.id);
        translation = {
          title: `Новость ${news.id}`,
          excerpt: 'Описание временно недоступно',
          full_text: 'Полный текст временно недоступен',
          source: 'AWL'
        };
      }

      return {
        id: news.id || index,
        news_id: news.id,
        slug: news.slug || `news-${news.id}`,
        image: news.image_url || '/images/default-news.jpg',
        alt: `news-${news.slug || news.id}-${lang}`,
        title: translation.title,
        source: translation.source || 'AWL',
        excerpt: translation.excerpt,
        fullText: this.formatFullText(translation.full_text),
        published_at: news.published_at,
        is_published: news.is_published
      };
    } catch (error) {
      // Возвращаем заглушку в случае ошибки
      return {
        id: index,
        news_id: news.id || index,
        slug: `error-${index}`,
        image: '/images/default-news.jpg',
        alt: 'news-error',
        title: 'Новость временно недоступна',
        source: 'AWL',
        excerpt: 'Приносим извинения за временные неудобства.',
        fullText: ['Пожалуйста, попробуйте позже.'],
        published_at: new Date().toISOString(),
        is_published: false
      };
    }
  },

  // Остальные функции остаются без изменений
  async uploadNewsImage(file, slug) {
    try {
      const MAX_FILE_SIZE = 200 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Размер файла превышает 200KB. Текущий размер: ${Math.round(file.size / 1024)}KB`);
      }

      if (file.type !== 'image/webp') {
        throw new Error('Разрешены только файлы в формате WebP (image/webp)');
      }

      const fileExt = 'webp';
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { data, error } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

// В newsService.js добавим функцию удаления новости
async deleteNews(newsId) {
  try {

    // 1. Сначала удаляем переводы (из-за foreign key constraints)
    const { error: translationError } = await supabase
      .from('news_translations')
      .delete()
      .eq('news_id', newsId);

    if (translationError) {
      console.error('❌ Ошибка удаления переводов:', translationError);
      throw translationError;
    }

    // 2. Затем удаляем саму новость
    const { error: newsError } = await supabase
      .from('news')
      .delete()
      .eq('id', newsId);

    if (newsError) {
      console.error('❌ Ошибка удаления новости:', newsError);
      throw newsError;
    }

    return true;
  } catch (error) {
    throw error;
  }
},

  async createNews(newsData, imageFile = null) {
    try {
      const { image_url, slug, translations } = newsData;
      
      // Валидируем обязательные поля
      if (!translations?.ru?.title) {
        throw new Error('Заголовок на русском обязателен');
      }

      let finalImageUrl = image_url;

      // Если передан файл изображения, загружаем его
      if (imageFile) {
        finalImageUrl = await this.uploadNewsImage(
          imageFile, 
          slug || this.generateSlug(translations.ru.title)
        );
      }

      // 1. Создаем основную запись новости
      const { data: news, error: newsError } = await supabase
        .from('news')
        .insert([{ 
          slug: slug || this.generateSlug(translations.ru.title),
          image_url: finalImageUrl,
          published_at: new Date().toISOString(),
          is_published: true
        }])
        .select()
        .single();

      if (newsError) throw newsError;

      // 2. Подготавливаем переводы
      const translationEntries = Object.entries(translations)
        .filter(([lang, translation]) => translation.title) // Только с заголовком
        .map(([language, translation]) => ({
          news_id: news.id,
          language,
          title: translation.title,
          excerpt: translation.excerpt || '',
          full_text: translation.full_text || '',
          source: translation.source || this.getDefaultSource(language)
        }));

      // 3. Создаем переводы
      if (translationEntries.length > 0) {
        const { error: translationError } = await supabase
          .from('news_translations')
          .insert(translationEntries);

        if (translationError) throw translationError;
      }

      return news;
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  // Вспомогательные функции
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 100);
  },

  getDefaultSource(language) {
    return language === 'ru' ? 'AWL Пресса' : 'AWL Press';
  },

  formatFullText(fullText) {
    if (typeof fullText === 'string') {
      return fullText.split('\n').filter(line => line.trim() !== '');
    }
    return ['Описание временно недоступно'];
  }
};

// Экспортируем функции для быстрого использования
export const getNews = async (lang = 'ru') => {
  return await newsService.getAllNews(lang);
};

export const createNewsItem = async (newsData, imageFile = null) => {
  return await newsService.createNews(newsData, imageFile);
};