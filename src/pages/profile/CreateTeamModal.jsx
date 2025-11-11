import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { getRegionByIP } from '/utils/geoLocation';

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [teamTag, setTeamTag] = useState('');
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamLogoPreview, setTeamLogoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamRegion, setTeamRegion] = useState('Европа'); // состояние для региона
  const [isDetectingRegion, setIsDetectingRegion] = useState(false); // индикация загрузки региона

  // Очистка при размонтировании
React.useEffect(() => {
  return () => {
    // Base64 URL не нужно освобождать, но на всякий случай
    if (teamLogoPreview && teamLogoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(teamLogoPreview);
    }
  };
}, [teamLogoPreview]);

// Блокировка скролла при открытии модалки
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Определяем регион при открытии модалки
  useEffect(() => {
    if (isOpen) {
      detectRegion();
    }
  }, [isOpen]);

  const detectRegion = async () => {
    setIsDetectingRegion(true);
    try {
      const region = await getRegionByIP();
      setTeamRegion(region);
    } catch (error) {
      console.error('Ошибка определения региона:', error);
      showSingleNotification('⚠ Регион определен по умолчанию (Европа)', true);
    } finally {
      setIsDetectingRegion(false);
    }
  };

  // В функции handleLogoUpload
const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Проверка формата (только PNG)
    if (file.type !== 'image/png') {
      showSingleNotification('✗ Загрузите изображение в формате PNG', true);
      return;
    }

    // Проверка размера (100KB максимум)
    if (file.size > 100 * 1024) {
      showSingleNotification('✗ Размер логотипа не должен превышать 100KB', true);
      return;
    }

    // Используем FileReader для Base64
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        if (this.width > 500 || this.height > 500) {
          showSingleNotification('✗ Размер изображения не должен превышать 500x500px', true);
          return;
        }
        
        setTeamLogo(file);
        setTeamLogoPreview(e.target.result); // Base64 данные
      };
      img.onerror = function() {
        showSingleNotification('✗ Ошибка загрузки изображения', true);
      };
      img.src = e.target.result;
    };
    
    reader.onerror = function() {
      showSingleNotification('✗ Ошибка чтения файла', true);
    };
    
    reader.readAsDataURL(file);
  }
};

  const handleClearLogo = () => {
    setTeamLogo(null);
    setTeamLogoPreview(null);
  };

  const handleCreateTeam = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showSingleNotification('✗ Пользователь не авторизован', true);
        return;
      }

      // Загрузка логотипа
      const logoFileName = `team_logo_${user.id}_${Date.now()}.${teamLogo.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('team-logos')
        .upload(logoFileName, teamLogo);

      if (uploadError) throw new Error(`Ошибка загрузки логотипа: ${uploadError.message}`);

      const { data: logoData } = supabase.storage
        .from('team-logos')
        .getPublicUrl(logoFileName);

      // Создание команды
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([{
          name: teamName.trim(),
          tag: `#${teamTag.replace('#', '').trim().toUpperCase()}`,
          logo_url: logoData.publicUrl,
          captain_id: user.id,
          region: teamRegion,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (teamError) {
        await supabase.storage.from('team-logos').remove([logoFileName]);
        throw teamError;
      }

      // Обновление пользователя
      const { error: userError } = await supabase
        .from('users')
        .update({ 
            team: teamData.name, 
            team_id: teamData.id,
            lastUpdate: new Date().toISOString() })
        .eq('id', user.id);

      if (userError) {
        await supabase.from('teams').delete().eq('id', teamData.id);
        await supabase.storage.from('team-logos').remove([logoFileName]);
        throw userError;
      }

      showSingleNotification('✓ Команда успешно создана!');
      onTeamCreated(teamData);
      resetForm();
      onClose();

    } catch (error) {
      console.error('Ошибка создания команды:', error);
      showSingleNotification('✗ Ошибка создания команды', true);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!teamName.trim()) {
      showSingleNotification('✗ Введите название команды', true);
      return false;
    }
    if (teamName.length < 3 || teamName.length > 13) {
      showSingleNotification('✗ Название команды должно содержать от 3 до 13 символов', true);
      return false;
    }
  // Разрешаем латинские буквы, цифры, пробелы и основные спецсимволы
  if (!/^[a-zA-Z0-9\s\-_!@#$%^&*()+=.,:;'"|~`?]+$/.test(teamName)) {
    showSingleNotification('✗ Название команды содержит запрещенные символы', true);
    return false;
  }
    if (!teamTag.trim()) {
      showSingleNotification('✗ Введите тег команды', true);
      return false;
    }
    const cleanTag = teamTag.replace('#', '').trim();
  if (cleanTag.length < 2 || cleanTag.length > 4) {
    showSingleNotification('✗ Тег команды должен содержать от 2 до 4 символов', true);
    return false;
  }
    if (!/^[a-zA-Z]+$/.test(cleanTag)) {
      showSingleNotification('✗ Тег команды может содержать только латинские буквы и символы', true);
      return false;
    }
    if (!teamLogo) {
      showSingleNotification('✗ Загрузите логотип команды', true);
      return false;
    }
    if (teamLogo.size > 2 * 1024 * 1024) {
      showSingleNotification('✗ Размер логотипа не должен превышать 100Кб', true);
      return false;
    }
    if (!teamLogo.type.startsWith('image/png')) {
      showSingleNotification('✗ Загрузите изображение в формате PNG', true);
      return false;
    }
    return true;
  };

  const resetForm = () => {
  if (teamLogoPreview) {
    URL.revokeObjectURL(teamLogoPreview);
  }
  setTeamName('');
  setTeamTag('');
  setTeamLogo(null);
  setTeamLogoPreview(null);
};

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-team-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Создание команды</h3>
        </div>
        
        <div className="modal-body">
          <div className="team-create-form">
            <div className="contact-input-group">
              <label className="contact-input-label">Название *</label>
              <input
                type="text"
                className="contact-input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Введите название команды (От 3 до 13 символов)"
                maxLength={13}
              />
            </div>

            <div className="contact-input-group">
              <label className="contact-input-label">Тег *</label>
              <div className="tag-input-container">
                <span className="tag-prefix">#</span>
                <input
                  type="text"
                  className="contact-input tag-input"
                  value={teamTag.replace('#', '')}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                    setTeamTag(value);
                  }}
                  placeholder="ABC ( 2-4 латинские буквы )"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Поле региона */}
            <div className="contact-input-group">
              <label className="contact-input-label">Регион</label>
              <div className="region-display-container">
                <input
                  type="text"
                  className="contact-input region-display"
                  value={isDetectingRegion ? 'Определение региона...' : teamRegion}
                  disabled
                />
                {isDetectingRegion && (
                  <div className="region-loading">⟳</div>
                )}
              </div>
              <div className="region-hint">
                Регион определен автоматически
              </div>
            </div>

            <div className="contact-input-group">
              <label className="contact-input-label">Логотип *</label>
              {teamLogoPreview ? (
                <div className="logo-preview-container">
                  <img src={teamLogoPreview} alt="Предпросмотр логотипа" className="logo-preview"/>
                  <button type="button" className="clear-logo-btn" onClick={handleClearLogo}>✕</button>
                </div>
              ) : (
                <div className="logo-upload-area">
                  <input
                    type="file"
                    id="team-logo-upload"
                    accept="image/png"
                    onChange={handleLogoUpload}
                    className="logo-upload-input"
                  />
                  <label htmlFor="team-logo-upload" className="logo-upload-label">
                    <div className="upload-icon"><img 
        src="/images/icons/icon-folder-load.png" 
        alt="Загрузить логотип" 
        className="folder-icon"
      /></div>
                    <div className="upload-text">Нажмите для загрузки логотипа</div>
                    <div className="upload-hint">PNG • Макс. 100KB • 500x500px</div>
                  </label>
                </div>
              )}
            </div>

            <div className="create-team-notice">
              <div className="notice-icon">
                <img src="/images/icons/icon-promo-line-news.png" alt="warning"/>
                </div>
              <div className="notice-text">
                После создания команды вы станете её капитаном. 
                Сможете приглашать других игроков и управлять настройками.
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleClose} disabled={isLoading}>
            Отмена
          </button>
          <button 
            className="create-team-btn" 
            onClick={handleCreateTeam}
            disabled={isLoading || !teamName || !teamTag || !teamLogo}
          >
            {isLoading ? 'Создание..' : 'Создать команду'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;