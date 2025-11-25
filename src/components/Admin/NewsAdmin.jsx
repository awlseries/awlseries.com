import { useState, useEffect } from 'react';
import { newsService } from '../Services/newsService';
import './NewsAdmin.css';

const NewsAdmin = ({ onClose, onNewsUpdate }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [formData, setFormData] = useState({
    slug: '',
    image_url: '',
    translations: {
      ru: { 
        title: '', 
        excerpt: '', 
        full_text: '', 
        source: 'AWL Пресса' 
      },
      en: { 
        title: '', 
        excerpt: '', 
        full_text: '', 
        source: 'AWL Press' 
      }
    }
  });

  useEffect(() => {
    loadAllNews();
  }, []);

  const loadAllNews = async () => {
    try {
      setLoading(true);
      
      // Добавляем таймаут для защиты от вечной загрузки
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Таймаут загрузки новостей')), 10000);
      });
      
      const newsPromise = newsService.getAllNews('ru');
      
      const allNews = await Promise.race([newsPromise, timeoutPromise]);
      
      setNews(allNews || []); // Защита от undefined
      
    } catch (error) {
      console.error('❌ Ошибка загрузки новостей:', error);
      showMessage('Ошибка загрузки новостей: ' + error.message, 'error');
      setNews([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        showMessage('Пожалуйста, выберите файл изображения (JPEG, PNG, WebP, GIF)', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showMessage('Размер исходного файла не должен превышать 5MB', 'error');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        image_url: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile && !formData.image_url) {
      showMessage('Загрузите изображение или укажите URL', 'error');
      return;
    }

    if (!formData.slug) {
      showMessage('Заполните url-адрес', 'error');
      return;
    }

    if (!formData.translations.ru.title) {
      showMessage('Заполните заголовок на русском', 'error');
      return;
    }

    try {
      setLoading(true);
      await newsService.createNews(formData, imageFile);
      showMessage('Новость успешно создана!', 'success');
      resetForm();
      await loadAllNews(); // Перезагружаем список
      if (onNewsUpdate) onNewsUpdate();
    } catch (error) {
      showMessage('Ошибка создания новости: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value
        }
      }
    }));
  };

  const handleMainFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      image_url: '',
      translations: {
        ru: { title: '', excerpt: '', full_text: '', source: 'AWL Пресса' },
        en: { title: '', excerpt: '', full_text: '', source: 'AWL Press' }
      }
    });
    setImageFile(null);
    setImagePreview('');
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 5000);
  };

  const deleteNews = async (newsId, imageUrl) => {
  if (!confirm('Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.')) return;
  
  try {
    setLoading(true);
    setDeleteLoading(newsId);
    // Вызываем функцию удаления из сервиса
    await newsService.deleteNews(newsId);
    
    showMessage('Новость успешно удалена!', 'success');
    
    // Перезагружаем список новостей
    await loadAllNews();
    
    // Обновляем родительский компонент если нужно
    if (onNewsUpdate) onNewsUpdate();
    
  } catch (error) {
    console.error('❌ Ошибка удаления новости:', error);
    showMessage('Ошибка удаления новости: ' + error.message, 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="news-admin">
      <h2>Управление новостями</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="news-admin-grid">
        {/* Левая колонка - форма создания */}
        <div className="create-news-form">
          <h3>➕ Создать новость</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-admin">
              <label>Url-адрес (английскими буквами):</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleMainFieldChange('slug', e.target.value)}
                placeholder="winter-tournament-2024"
                required
              />
              <small>Только английские буквы, цифры и дефисы</small>
            </div>

            <div className="form-group-admin">
              <label>Изображение:</label>
              <input
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
                onChange={handleImageChange}
              />
              <small>Файлы автоматически конвертируются в WebP до 200KB</small>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="remove-image-btn"
                >
                  Удалить
                </button>
              </div>
            )}

            <div className="form-group-admin">
              <label>URL изображения (если не загружаете файл):</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => handleMainFieldChange('image_url', e.target.value)}
                placeholder="/images/banners/news-bf6-1.webp"
                disabled={!!imageFile}
              />
            </div>

            {/* Русская версия */}
            <div className="translation-section">
              <h4>🇷🇺 Русская версия *</h4>
              
              <div className="form-group-admin">
                <label>Заголовок *:</label>
                <input
                  type="text"
                  value={formData.translations.ru.title}
                  onChange={(e) => handleInputChange('ru', 'title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group-admin">
                <label>Краткое описание:</label>
                <textarea
                  value={formData.translations.ru.excerpt}
                  onChange={(e) => handleInputChange('ru', 'excerpt', e.target.value)}
                  rows="3"
                />
              </div>

              <div className="form-group-admin">
                <label>Полный текст:</label>
                <textarea
                  value={formData.translations.ru.full_text}
                  onChange={(e) => handleInputChange('ru', 'full_text', e.target.value)}
                  rows="6"
                />
              </div>

              <div className="form-group-admin">
                <label>Источник:</label>
                <input
                  type="text"
                  value={formData.translations.ru.source}
                  onChange={(e) => handleInputChange('ru', 'source', e.target.value)}
                />
              </div>
            </div>

            <button className="create-news-btn" type="submit" disabled={loading}>
              {loading ? 'Создание...' : 'Создать новость'}
            </button>
          </form>
        </div>

        {/* Правая колонка */}
        <div className="right-column">
          {/* Английская версия */}
          <div className="translation-section english-section">
            <h4>🇺🇸 English version</h4>
            
            <div className="form-group-admin">
              <label>Title:</label>
              <input
                type="text"
                value={formData.translations.en.title}
                onChange={(e) => handleInputChange('en', 'title', e.target.value)}
              />
            </div>

            <div className="form-group-admin">
              <label>Excerpt:</label>
              <textarea
                value={formData.translations.en.excerpt}
                onChange={(e) => handleInputChange('en', 'excerpt', e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-group-admin">
              <label>Full text:</label>
              <textarea
                value={formData.translations.en.full_text}
                onChange={(e) => handleInputChange('en', 'full_text', e.target.value)}
                rows="6"
              />
            </div>

            <div className="form-group-admin">
              <label>Source:</label>
              <input
                type="text"
                value={formData.translations.en.source}
                onChange={(e) => handleInputChange('en', 'source', e.target.value)}
              />
            </div>
          </div>

          {/* Список новостей */}
          <div className="news-list-admin">
            <h3>📋 Существующие новости ({news.length})</h3>
            
            {loading ? (
              <div className="loading-state">
                <div className="spinner-small"></div>
                <p>Загрузка новостей...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="no-news">
                <p>Новостей пока нет</p>
              </div>
            ) : (
              <div className="news-grid-admin">
                {news.map((item) => (
                  <div key={item.id} className="news-item-admin">
                    <img src={item.image} alt={item.alt} />
                    <div className="news-info-admin">
                      <h4 className='h4-admin-name-news'>{item.title}</h4>
                      <p><strong>ID:</strong> {item.news_id} | <strong>URL:</strong> {item.slug}</p>
                      <p><strong>Источник: </strong> {item.source}</p>
                      <div className="news-actions-admin">
                        <button 
                          onClick={() => deleteNews(item.news_id, item.image)}
                          className="btn-admin delete"
                          disabled={deleteLoading === item.news_id}
                        >
                          {deleteLoading === item.news_id ? 'Удаление...' : 'Удалить'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-close-btn">
        <button onClick={onClose}>✕ Закрыть админку</button>
      </div>
    </div>
  );
};

export default NewsAdmin;