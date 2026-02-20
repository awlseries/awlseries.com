// PlayerStats.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';
import { showSingleNotification } from '/utils/notifications';

const PlayerStats = ({ userId, onShowExample }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [battlefieldNickname, setBattlefieldNickname] = useState('')
  const fileInputRef = useRef(null);
  const { t } = useLanguage();

  // Функция проверки, есть ли какие-либо данные в статистике
  const hasAnyStats = (statsData) => {
  if (!statsData || typeof statsData !== 'object') return false;
  
  const values = Object.values(statsData);
  if (values.length === 0) return false;
  
  // Проверяем, есть ли хоть одно НЕ пустое значение
  return values.some(value => {
    // Проверяем на null/undefined
    if (value == null) return false;
    
    // Проверяем строки
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed !== '' && 
             trimmed.toLowerCase() !== 'null' && 
             trimmed.toLowerCase() !== 'undefined';
    }
    
    // Все остальное считается непустым
    return true;
  });
};

  useEffect(() => {
    const loadPlayerStats = async () => {
      try {
        setLoading(true);
        
        // Загружаем статистику пользователя
        const { data, error } = await supabase
          .from('users')
          .select('stats, battlefield_nickname')
          .eq('id', userId)
          .single();
          if (error) throw error;

      if (data) {
        setStats(data.stats || null);
        setBattlefieldNickname(data.battlefield_nickname || '');
      } else {
        setStats(null);
        setBattlefieldNickname('');
      }
    } catch (error) {
      setStats(null);
      setBattlefieldNickname('');
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    loadPlayerStats();
  }
}, [userId]);

  // Обработчик загрузки файла
  const handleUploadClick = () => {
    setUploadError(null);
    setUploadSuccess(false);
    fileInputRef.current.click();
  };

  // Обработчик выбора файла
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Сбросить input
    e.target.value = '';

    // Проверка формата файла
    if (file.type !== 'image/png') {
      setUploadError(t('stats.upload.fileFormat'));
      return;
    }

    // Проверка размера файла (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      setUploadError(t('stats.upload.fileSize'));
      return;
    }

    // Начать процесс загрузки и обработки
    await processImageFile(file);
  };

    // Обработчики модального окна примера скриншота
   const handleExampleClick = () => {
    onShowExample(); // ← вызываем функцию из родителя
  };

  // Функция загрузки файла в хранилище (аналогично OcrTest)
  const uploadFileToStorage = async (file) => {
    try {
      setUploading(true);
      
      // Создаем уникальное имя файла (как в OcrTest)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `data-ocr/${fileName}`; // Используем папку data-ocr

      // Загружаем файл в Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('data-ocr') // Используем bucket 'test' как в OcrTest
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from('data-ocr')
        .getPublicUrl(filePath);

      return publicUrl;

    } catch (err) {
      throw new Error(`Ошибка загрузки: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Функция обработки изображения через OCR (аналогично OcrTest)
  const processImageFile = async (file) => {
    try {
      setProcessing(true);
      setUploadError(null);
      setUploadSuccess(false);

      // Проверяем, есть ли никнейм
    if (!battlefieldNickname) {
      setUploadError(t('stats.upload.noNickname'));
      showSingleNotification(t('stats.upload.noNickname'), true);
      setProcessing(false);
      return;
    }

      // 1. Загружаем файл в хранилище
      const imageUrl = await uploadFileToStorage(file);
      if (!imageUrl) {
        setUploadError(t('stats.upload.error'));
        return;
      }

      // 2. Вызываем OCR функцию (как в OcrTest)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ocr-processor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ imageUrl, expectedNickname: battlefieldNickname })
          
        }
      );

      const result = await response.json();
      
      if (result.success) {
  try {
    // 1. Удаляем файл их хранилища
    const filePath = imageUrl.split('/data-ocr/')[1];
    await supabase.storage
      .from('data-ocr')
      .remove([filePath]);
    console.log('Файл удален:', filePath);
  } catch (deleteError) {
    console.error('Ошибка удаления файла:', deleteError);
  }

  // 3. Сохраняем полученную статистику в базу данных
  await saveStatsToDatabase(result.stats);
      
      // 4. Обновляем локальное состояние
      setStats(result.stats);
      setUploadSuccess(true);
      
      showSingleNotification(t('stats.upload.success'));
    } else {
      setUploadError(`Ошибка: ${result.error}`);
      showSingleNotification(result.error || t('stats.upload.error'), true);
}

  } catch (err) {
    setUploadError(`Ошибка: ${err.message}`);
  } finally {
    setProcessing(false);
  }
};

  // Функция сохранения статистики в базу данных
  const saveStatsToDatabase = async (newStats) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          stats: newStats,
          lastUpdate: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
    } catch (err) {
      throw new Error(t('stats.upload.error'));
    }
  };

  if (loading) {
    return (
      <div className="info-section">
        <h3 className="section-title">{t('stats.title')}</h3>
        <div className="info-block stats-block">
          <div className="loading-container">
            <div className="spinner">
              <div className="spinner-circle"></div>
            </div>
            <p>{t('stats.loadingStats')}</p>
          </div>
        </div>
      </div>
    );
  };

  // Проверяем: если stats null ИЛИ все поля null
  if (!stats || !hasAnyStats(stats)) {
    return (
      <>
      <div className="info-section">
        <h3 className="section-title">{t('stats.title')}</h3>
        <div className="info-block player-stats-block">
          <div className="player-stats-grid">
            <div className="player-stats-column">
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.kd')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.kills')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.assists')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.winRate')}</span>
                <span className="player-stat-value">-</span>
              </div>
            </div>
            
            <div className="player-stats-column">
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.rank')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.playTime')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.matches')}</span>
                <span className="player-stat-value">-</span>
              </div>
              <div className="player-stat-item empty-stat">
                <span className="player-stat-label">{t('stats.favoriteWeapon')}</span>
                <span className="player-stat-value">-</span>
              </div>
            </div>
          </div>

          <div className="player-stats-empty">
            <div className="player-stats-empty-content">
              {/* Скрытый input для загрузки файла */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".png,image/png"
                style={{ display: 'none' }}
              />
              
              {/* Кнопка загрузки данных */}
<div 
  className="upload-data-title-btn" 
  onClick={handleUploadClick}
  style={{ 
    cursor: (uploading || processing || !battlefieldNickname) ? 'not-allowed' : 'pointer',
    opacity: (uploading || processing || !battlefieldNickname) ? 0.7 : 1 
  }}
>
  <div className="upload-title-inner">
    <img src="/images/icons/icon-add-data.png" alt={t('stats.noStats.uploadButton')} />
    <p>
      {uploading 
        ? t('stats.noStats.uploading')  
        : processing 
        ? t('stats.noStats.processing')
        : !battlefieldNickname
        ? t('stats.noStats.noNickname')
        : t('stats.noStats.uploadButton')}
    </p>
  </div>
</div>
              
              {/* Информация о загрузке */}
              <div className="upload-data-description">
                <p>{t('stats.noStats.message1')} (<span className="example-link"onClick={handleExampleClick}> {t('stats.noStats.example')} </span>) {t('stats.noStats.message1_2')}
                <a href="https://tracker.gg/bf6" target="_blank" rel="noopener noreferrer" className="tracker-link"> tracker.gg/bf6</a></p>
                <p>{t('stats.noStats.message2')}</p>
                <p>{t('stats.noStats.message3')}</p>
                
                {/* Предупреждение о бане */}
                <div className="warning-block-single-line" style={{ maxWidth: '450px' }}>
                  <img src="/images/icons/icon-promo-line-news.png" alt="Внимание" className="warning-icon" />
                  <p className="warning-text">{t('stats.banWarning')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </>
)};

  // Функция для безопасного отображения значений
  const displayValue = (value) => {
    return value !== null && value !== undefined ? value : t('stats.notAvailable');
  };

  return (
    <div className="info-section">
      <h3 className="section-title stats-title-with-btn">{t('stats.title')}
        {/* Кнопка для обновления статистики (если уже есть данные) */}
        <div className="stats-upload-btn-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,image/png"
            style={{ display: 'none' }}
          />
          <button className="stats-upload-btn" onClick={handleUploadClick} disabled={uploading || processing}>
            {uploading 
              ? t('stats.upload.uploading') 
              : processing 
              ? t('stats.upload.processing') 
              : t('stats.upload.button')}
          </button>
        </div>
      </h3>

      <div className="info-block player-stats-block">
        <div className="player-stats-grid">
          <div className="player-stats-column">
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.kd')}</span>
              <span className="player-stat-value">
                {typeof stats.kdRatio === 'number' ? stats.kdRatio.toFixed(2) : t('stats.notAvailable')}
              </span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.kills')}</span>
              <span className="player-stat-value">{displayValue(stats.kills)}</span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.assists')}</span>
              <span className="player-stat-value">{displayValue(stats.assists)}</span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.winRate')}</span>
              <span className="player-stat-value">{displayValue(stats.winrate)}</span>
            </div>
          </div>
          
          <div className="player-stats-column">
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.rank')}</span>
              <span className="player-stat-value">{displayValue(stats.rank)}</span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.playTime')}</span>
              <span className="player-stat-value">{displayValue(stats.playtime)}{stats.playtime ? ` ${t('stats.playTimeValue')}` : ''}</span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.matches')}</span>
              <span className="player-stat-value">{displayValue(stats.matches)}</span>
            </div>
            <div className="player-stat-item">
              <span className="player-stat-label">{t('stats.favoriteWeapon')}</span>
              <span className="player-stat-value">{displayValue(stats.favoriteWeapon)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;