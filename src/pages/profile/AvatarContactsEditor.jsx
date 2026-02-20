  // Блок АВАТАРА и Контактов
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { useLanguage } from '/utils/language-context.jsx';

const AvatarContactsEditor = ({ userData, onAvatarUpdate, isContactsModalOpen, onCloseContactsModal }) => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useLanguage();

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

  // Функция обработки кликов по контактам
  const handleContactClick = (platform, contact) => {
    if (!contact) return;
    
    let url = '';
    
    switch (platform) {
      case 'steam':
        if (contact.startsWith('https://') || contact.startsWith('http://')) {
          url = contact;
        } else {
          url = `https://steamcommunity.com/id/${contact}`;
        }
        break;
        
      case 'telegram':
        if (contact.startsWith('https://') || contact.startsWith('http://') || contact.startsWith('@')) {
          url = contact.startsWith('@') ? `https://t.me/${contact.slice(1)}` : contact;
        } else {
          url = `https://t.me/${contact}`;
        }
        break;
        
      case 'whatsapp':
        const cleanPhone = contact.replace(/\D/g, '');
        
        if (cleanPhone.length < 10) {
          showSingleNotification('✗ Неверный формат номера WhatsApp', true);
          return;
        }
        
        let formattedPhone = cleanPhone;
        if (formattedPhone.startsWith('8') && formattedPhone.length === 11) {
          formattedPhone = '7' + formattedPhone.slice(1);
        }
        
        url = `https://wa.me/${formattedPhone}`;
        break;
        
      default:
        return;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Компонент модального окна контактов
  const ContactsModal = () => {
    const [localContactsData, setLocalContactsData] = useState({
      steam: '',
      telegram: '',
      whatsapp: ''
    });

    useEffect(() => {
      if (isContactsModalOpen) {
        setLocalContactsData({
          steam: userData?.contacts?.steam || '',
          telegram: userData?.contacts?.telegram || '',
          whatsapp: userData?.contacts?.whatsapp || ''
        });
      }
    }, [isContactsModalOpen, userData?.contacts]);

    const handleInputChange = (field, value) => {
      setLocalContactsData(prev => ({...prev, [field]: value}));
    };

    const handleSaveContacts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          showSingleNotification(t('notifications.userNotAuthenticated'), true);
          return;
        }

        const { error } = await supabase
          .from('users')
          .update({
            contacts: localContactsData,
            lastUpdate: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;

        onAvatarUpdate({ contacts: localContactsData });
        
        onCloseContactsModal();
        showSingleNotification(t('contactsModal.saveSuccess'));
      } catch (error) {
        showSingleNotification(t('contactsModal.saveError'), true);
      }
    };

    if (!isContactsModalOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content contacts-modal">
          <div className="modal-header">
            <h3 className="modal-title-contacts">{t('contactsModal.title')}</h3>
          </div>
          
          <div className="modal-body">
            <div className="contacts-inputs-container">
              <div className="contact-input-group">
                <div className="contact-input-label">
                  <span>Steam</span>
                </div>
                <input
                  type="text"
                  className="contact-input"
                  value={localContactsData.steam}
                  onChange={(e) => handleInputChange('steam', e.target.value)}
                  placeholder={t('contactsModal.steamPlaceholder')}
                />
              </div>

              <div className="contact-input-group">
                <div className="contact-input-label">
                  <span>Telegram</span>
                </div>
                <input
                  type="text"
                  className="contact-input"
                  value={localContactsData.telegram}
                  onChange={(e) => handleInputChange('telegram', e.target.value)}
                  placeholder={t('contactsModal.telegramPlaceholder')}
                />
              </div>

              <div className="contact-input-group">
                <div className="contact-input-label">
                  <span>WhatsApp</span>
                </div>
                <input
                  type="text"
                  className="contact-input"
                  value={localContactsData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder={t('contactsModal.whatsappPlaceholder')}
                />
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onCloseContactsModal}> {t('contactsModal.cancel')}</button>
            <button className="save-contacts-btn" onClick={handleSaveContacts}> {t('contactsModal.save')}</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fade-block-container">
        <h3 className="section-title">{t('contacts')}</h3>
        <div className="contacts-profile-block">
          <div className="contacts-container">
            <div 
              className={`contact-block ${!userData?.contacts?.steam ? 'disabled' : ''}`}
              onClick={() => userData?.contacts?.steam && handleContactClick('steam', userData.contacts.steam)}
              title={userData?.contacts?.steam ? t('goToSteam') : t('contactNotSet')}
            >
              <span className="contact-name">Steam</span>
              <img src="/images/icons/icon-profile-steam.png" alt="Steam" className="contact-icon"/>
            </div>
            
            <div 
              className={`contact-block middle ${!userData?.contacts?.telegram ? 'disabled' : ''}`}
              onClick={() => userData?.contacts?.telegram && handleContactClick('telegram', userData.contacts.telegram)}
              title={userData?.contacts?.telegram ? t('goToTelegram') : t('contactNotSet')}
            >
              <span className="contact-name">Telegram</span>
              <img src="/images/icons/icon-profile-telegram.png" alt="Telegram" className="contact-icon"/>
            </div>
            
            <div 
              className={`contact-block ${!userData?.contacts?.whatsapp ? 'disabled' : ''}`}
              onClick={() => userData?.contacts?.whatsapp && handleContactClick('whatsapp', userData.contacts.whatsapp)}
              title={userData?.contacts?.whatsapp ? t('goToWhatsApp') : t('contactNotSet')}
            >
              <span className="contact-name">WhatsApp</span>
              <img src="/images/icons/icon-profile-whatsup.png" alt="WhatsApp" className="contact-icon"/>
            </div>
          </div>
        </div>

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
    <button className="avatar-remove-btn" onClick={handleAvatarRemove} title="Удалить фото">
      <img src="/images/icons/icon-redactor2.png" alt="Удалить фото" className="avatar-delete-btn"/>
    </button>
  )}
</div>
        )}
      </div>
    </div>
    </div>
    <ContactsModal /></>
  );
};

export default AvatarContactsEditor;