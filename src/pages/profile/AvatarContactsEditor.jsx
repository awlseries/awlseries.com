import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';

const AvatarContactsEditor = ({ userData, onAvatarUpdate }) => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Валидация файла
  const validateFile = (file) => {
    // Проверка типа файла
    const allowedTypes = ['image/png'];
    if (!allowedTypes.includes(file.type)) {
      showSingleNotification('✗ Допустимы только PNG', true);
      return false;
    }

    // Проверка размера файла (100KB максимум)
    const maxSize = 100 * 1024; 
    if (file.size > maxSize) {
      showSingleNotification('✗ Размер файла не должен превышать 100KB', true);
      return false;
    }

    return true;
  };

  // Создание preview с сохранением размеров блока
const createOptimizedPreview = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const targetHeight = 335;
      
      // Если оригинальное изображение меньше 335px, используем оригинальный размер
      let finalWidth, finalHeight;
      
      if (img.height < targetHeight) {
        // Используем оригинальные размеры для маленьких изображений
        finalWidth = img.width;
        finalHeight = img.height;
      } else {
        // Масштабируем только большие изображения
        finalWidth = (img.width * targetHeight) / img.height;
        finalHeight = targetHeight;
      }
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      
      // Максимальное качество рендеринга
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

  // Обработка выбора файла
  const handleAvatarSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setAvatarFile(file);
      const previewUrl = await createOptimizedPreview(file);
      setAvatarPreview(previewUrl);
      setIsEditingAvatar(true);
    } catch (error) {
      console.error('Ошибка создания preview:', error);
      showSingleNotification('✗ Ошибка обработки изображения', true);
    }
  };

  // Загрузка аватара
const handleAvatarUpload = async () => {
  if (!avatarFile) return;

  try {
    setIsUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showSingleNotification('✗ Пользователь не авторизован', true);
      return;
    }

    // ✅ Добавляем timestamp к имени файла для избежания кэширования
    const fileExt = avatarFile.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${user.id}/avatar_${timestamp}.${fileExt}`;

    // Загружаем файл в Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { 
        upsert: false, // Не перезаписываем, создаем новый
        contentType: avatarFile.type 
      });

    if (uploadError) throw uploadError;

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // ✅ Удаляем старый аватар если он есть
    if (userData?.avatar_url) {
      // Извлекаем имя старого файла из URL
      const oldFileName = userData.avatar_url.split('/').pop();
      if (oldFileName) {
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${oldFileName}`]);
      }
    }

    // Обновляем запись пользователя
    const { error: updateError } = await supabase
      .from('users')
      .update({
        avatar_url: publicUrl,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Вызываем колбэк для обновления родительского компонента
    onAvatarUpdate(publicUrl);
    
    setIsEditingAvatar(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    showSingleNotification('✓ Аватар успешно обновлен');
    
  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    showSingleNotification('✗ Ошибка загрузки аватара', true);
  } finally {
    setIsUploading(false);
  }
};

  // Удаление аватара
const handleAvatarRemove = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showSingleNotification('✗ Пользователь не авторизован', true);
      return;
    }

    // ✅ Удаляем ВСЕ файлы аватара пользователя из Storage
    const { data: fileList, error: listError } = await supabase.storage
      .from('avatars')
      .list(user.id);

    if (listError) {
      console.error('Ошибка получения списка файлов:', listError);
    } else if (fileList && fileList.length > 0) {
      // Удаляем все файлы в папке пользователя
      const filesToRemove = fileList.map(file => `${user.id}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove(filesToRemove);

      if (deleteError && deleteError.message !== 'Not Found') {
        console.error('Ошибка удаления файлов:', deleteError);
      }
    }

    // Обновляем запись пользователя
    const { error: updateError } = await supabase
      .from('users')
      .update({
        avatar_url: null,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Вызываем колбэк
    onAvatarUpdate(null);
    
    showSingleNotification('✓ Аватар удален');
    
  } catch (error) {
    console.error('Ошибка удаления аватара:', error);
    showSingleNotification('✗ Ошибка удаления аватара', true);
  }
};

  // Отмена редактирования
  const handleAvatarCancel = () => {
    setIsEditingAvatar(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="fade-block">
      <div className="avatar-container">
        {isEditingAvatar ? (
          <div className="avatar-edit-container">
            <img 
              src={avatarPreview || "/images/other/team-player-empty.png"} 
              alt="Preview" 
              className="masked-image avatar-preview"
            />
            <div className="avatar-edit-buttons">
              <button 
                className="avatar-save-btn"
                onClick={handleAvatarUpload}
                disabled={isUploading}
                title="Сохранить"
              >
                {isUploading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                className="avatar-cancel-btn"
                onClick={handleAvatarCancel}
                disabled={isUploading}
                title="Отмена"
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          // В компоненте AvatarEditor замените блок отображения аватара:
<div className="avatar-display-container">
  <img 
    src={userData?.avatar_url || "/images/other/team-player-empty.png"} 
    alt="awl-player-photo" 
    className="masked-image"
  />
  
  {/* Кнопка загрузки - показывается только когда НЕТ аватара */}
  {!userData?.avatar_url && (
    <label className="avatar-upload-btn" title="Добавить фото">
      <img 
        src="/images/icons/icon-add-data.png" 
        alt="Добавить фото"
        className="add-contacts-btn-icon"
      />
      <input
        type="file"
        accept="image/png"
        onChange={handleAvatarSelect}
        style={{ display: 'none' }}
      />
    </label>
  )}
  
  {/* Кнопка удаления - показывается только при наведении И если есть аватар */}
  {userData?.avatar_url && (
    <button 
      className="avatar-remove-btn"
      onClick={handleAvatarRemove}
      title="Удалить фото"
    >
      <img 
        src="/images/icons/icon-redactor2.png" 
        alt="Удалить фото"
        className="avatar-delete-btn"
      />
    </button>
  )}
</div>
        )}
      </div>
    </div>
  );
};

export default AvatarContactsEditor;