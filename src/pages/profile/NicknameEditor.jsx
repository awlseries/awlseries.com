// Блок изменения никнейма
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { showSingleNotification } from '/utils/notifications';
import { useLanguage } from '/utils/language-context.jsx';

const NicknameEditor = ({ userData, onNicknameUpdate }) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');
  const [canEditNickname, setCanEditNickname] = useState(true);
  const [nicknameCooldown, setNicknameCooldown] = useState(null);
  const { t } = useLanguage();

  // Проверка кулдауна на смену никнейма
  const checkNicknameCooldown = (userData) => {
    if (userData?.lastNicknameChange) {
      const lastChange = new Date(userData.lastNicknameChange);
      const now = new Date();
      const monthInMs = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
      const timeSinceLastChange = now - lastChange;
      
      if (timeSinceLastChange < monthInMs) {
        setCanEditNickname(false);
        const daysLeft = Math.ceil((monthInMs - timeSinceLastChange) / (24 * 60 * 60 * 1000));
        setNicknameCooldown(daysLeft);
      } else {
        setCanEditNickname(true);
        setNicknameCooldown(null);
      }
    } else {
      setCanEditNickname(true);
    }
  };

  // Проверка существования никнейма
  const checkNicknameExists = async (nickname) => {
    try {
      const cleanNickname = nickname.trim();
      
      // Базовые проверки
      if (!cleanNickname) {
        showSingleNotification(`✗ ${t('nickname.required')}`, true);
        return true;
      }
      
      if (/\s/.test(cleanNickname)) {
        showSingleNotification(`✗ ${t('nickname.noSpaces')}`, true);
        return true;
      }
      
      if (cleanNickname.length < 2) {
        showSingleNotification(`✗ ${t('nickname.minLength')}`, true);
        return true;
      }

      if (cleanNickname.length > 20) {
        showSingleNotification(`✗ ${t('nickname.maxLength')}`, true);
        return true;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      // Получаем ВСЕ никнеймы для нормализованной проверки
      const { data, error } = await supabase
        .from('users')
        .select('battlefield_nickname, id')
        .neq('id', user?.id);

      if (error) throw error;

      // Нормализуем новый никнейм (убираем дефисы, нижний регистр)
      const normalizeForComparison = (nick) => {
        return nick
          .toLowerCase()
          .replace(/[^a-z0-9]/g, ''); // убираем ВСЕ не-буквы и не-цифры
      };

      const normalizedNewNick = normalizeForComparison(cleanNickname);

      // Проверяем на нормализованные совпадения
      const nicknameExists = data.some(userData => {
        if (!userData.battlefield_nickname) return false;
        
        const normalizedExistingNick = normalizeForComparison(userData.battlefield_nickname);
        return normalizedExistingNick === normalizedNewNick;
      });

      if (nicknameExists) {
        showSingleNotification(`✗ ${t('nickname.alreadyExists')}`, true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Ошибка проверки никнейма:', error);
      showSingleNotification(`✗ ${t('nickname.checkError')}`, true);
      return true;
    }
  };

  // Сохранение никнейма
  const saveNickname = async () => {
    if (!editedNickname.trim()) {
      showSingleNotification(`✗ ${t('nickname.required')}`, true);
      return;
    }

    const cleanNickname = editedNickname.trim();
    
    // Проверка на пустую строку
    if (!cleanNickname) {
      showSingleNotification(`✗ ${t('nickname.required')}`, true);
      return;
    }

    // Проверяем, не совпадает ли новый никнейм со старым (учитывая регистр)
    if (cleanNickname === (userData?.battlefield_nickname || '')) {
      showSingleNotification(`✗ ${t('nickname.sameAsCurrent')}`, true);
      return;
    }

    // Проверяем существование никнейма
    const nicknameExists = await checkNicknameExists(cleanNickname);
    if (nicknameExists) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showSingleNotification(`✗ ${t('nickname.notAuthenticated')}`, true);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({
          battlefield_nickname: cleanNickname,
          lastNicknameChange: new Date().toISOString(),
          lastUpdate: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Возвращаем обновленные данные родительскому компоненту
      const updatedUserData = {
        ...userData,
        battlefield_nickname: cleanNickname,
        lastNicknameChange: new Date().toISOString()
      };

      setIsEditingNickname(false);
      setCanEditNickname(false);
      setNicknameCooldown(30);
      showSingleNotification(`✓ ${t('nickname.changeSuccess')}`);

      // Вызываем колбэк для обновления данных в родительском компоненте
      if (onNicknameUpdate) {
        onNicknameUpdate(updatedUserData);
      }
    } catch (error) {
      showSingleNotification(`✗ ${t('nickname.changeError')}`, true);
    }
  };

  // Сброс редактирования
  const cancelNicknameEdit = () => {
    setIsEditingNickname(false);
    setEditedNickname(userData?.battlefield_nickname || '');
  };

  // Инициализация при загрузке пользователя
  useEffect(() => {
    if (userData) {
      setEditedNickname(userData.battlefield_nickname || '');
      checkNicknameCooldown(userData);
    }
  }, [userData]);

  return (
    <div className="nickname-container">
      {isEditingNickname ? (
        <div className="nickname-edit-container">
          <input
            className="name-player-style editable"
            value={editedNickname}
            onChange={(e) => setEditedNickname(e.target.value)}
            placeholder={t('nickname.placeholder')}
            maxLength={30}
            autoFocus
          />
          <div className="nickname-edit-buttons">
            <button 
              className="nickname-save-btn"
              onClick={saveNickname}
              title={t('nickname.save')}
            >
              <img className="icons-redactor" src="/images/icons/icon-save.png" alt={t('nickname.save')}/>
            </button>
            <button className="nickname-cancel-btn" onClick={cancelNicknameEdit} title={t('nickname.cancel')}>
              <img className="icons-redactor" src="/images/icons/icon-redactor2.png" alt={t('nickname.cancel')}/>
            </button>
          </div>
        </div>
      ) : (
        <div className="nickname-display-container">
          <span className="name-player-style">
            {userData?.battlefield_nickname || t('nickname.empty')}
          </span>
          {canEditNickname && (
            <button className="nickname-edit-btn" onClick={() => setIsEditingNickname(true)} title={t('nickname.edit')}>
              <img className="icons-redactor" src="/images/icons/icon-redactor1.png" alt={t('nickname.edit')}/>
            </button>
          )}
          {!canEditNickname && nicknameCooldown && (
            <span className="nickname-cooldown" title={t('nickname.nextChangeIn', { days: nicknameCooldown })}>
              <img className="icons-redactor-time" src="/images/icons/icon-timeless.png" alt="change-time-is"/> 
              {nicknameCooldown}{t('nickname.cooldown')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NicknameEditor;