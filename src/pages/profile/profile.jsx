import React, { lazy, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { showSingleNotification } from '/utils/notifications';
import CountryPicker from '../../components/CountryPicker';
import { supabase } from '../../supabase';
import { useLanguage } from '/utils/language-context.jsx';
import '/src/styles.css';
import { useNavigate } from 'react-router-dom';
import './ProfileInfo.css';
import SEO from '../../components/Seo/Seo';
import CreateTeamModal from './CreateTeamModal';
import AvatarContactsEditor from './AvatarContactsEditor';

// Ленивая загрузка react-world-flags
const Flag = lazy(() => import('react-world-flags').then(module => {
  return { default: module.default };
}));

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAgeBeenSet, setHasAgeBeenSet] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedNickname, setEditedNickname] = useState('');
  const [canEditNickname, setCanEditNickname] = useState(true);
  const [nicknameCooldown, setNicknameCooldown] = useState(null);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('EMPTY');
  const [hasCountryBeenSet, setHasCountryBeenSet] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  // состояния для модалки создания команды
const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
const [teamData, setTeamData] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // ------------------------------------------------------------------------ Загрузка данных при монтировании

useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted && session?.user) {
          await loadUserData(session.user, mounted);
        } else if (mounted) {
          // 🔐 РЕДИРЕКТ ЕСЛИ НЕТ СЕССИИ
          showSingleNotification('✗ Требуется авторизация', true);
          setTimeout(() => navigate('/'), 1000);
          return;
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        if (mounted) {
          showSingleNotification('✗ Ошибка загрузки профиля', true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Слушаем ТОЛЬКО для выхода из системы
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      // Реагируем ТОЛЬКО на выход
      if (event === 'SIGNED_OUT') {
        setUserData(null);
        setLoading(false);
        showSingleNotification('✗ Вы вышли из системы', true);
        navigate('/');
      }
      // 🔐 ДОБАВЛЯЕМ ПРОВЕРКУ ПОДТВЕРЖДЕНИЯ ПОЧТЫ ПРИ ВХОДЕ
      else if (event === 'SIGNED_IN' && session?.user) {
        if (!session.user.email_confirmed_at && !session.user.confirmed_at) {
          showSingleNotification('✗ Подтвердите email для доступа к профилю', true);
          navigate('/');
        }
      }
    });

    loadInitialData();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // -------------------------------------------------------- Эффект для блокировки скролла при открытии модального окна

useEffect(() => {
  if (isDeleteModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isDeleteModalOpen]);

// ----------------------------------------------------------------------- Функция для загрузки данных команды

useEffect(() => {
  if (userData?.team && userData.team !== "free agent") {
    loadTeamData(userData.team_id);
  }
}, [userData?.team_id]);

const loadTeamData = async (teamId) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    if (error) throw error;
    setTeamData(data);
  } catch (error) {
    console.error('Ошибка загрузки данных команды:', error);
  }
};

// Функция для обработки нажатия на кнопку "Команда"
const handleTeamButtonClick = () => {
  if (userData?.team && userData.team !== "free agent") {
    // Перенаправляем на страницу команды
    navigate(`/team/${userData.team_id}`);
  } else {
    setIsCreateTeamModalOpen(true);
  }
};

// Функция после успешного создания команды
const handleTeamCreated = (newTeamData) => {
  setTeamData(newTeamData);
  setUserData(prev => ({ ...prev, team: newTeamData.name }));
};

  // ------------------------------------------------------------------------- Загрузка данных пользователя

const loadUserData = async (user, mounted) => {
  try {
    setLoading(true);
    
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      // ⚠️ Проверяем, что компонент еще mounted
      if (!mounted) return;

      if (data) {
        const userStats = data.stats || null;

        setUserData({
          ...data,
          stats: userStats,
          battlefield_nickname: data.battlefield_nickname || '',
          country: data.country || 'EMPTY',
          countryName: data.countryName || 'Не выбрана'
        });
        setEditedNickname(data.battlefield_nickname|| '');
        setSelectedCountry(data.country || 'EMPTY');
        setHasAgeBeenSet(!!data.birthDate);
        setHasCountryBeenSet(!!data.country && data.country !== 'EMPTY');
        checkNicknameCooldown(data);
      } else {
        if (mounted) { // ← ДОБАВЬТЕ проверку
          showSingleNotification('✗ Профиль не найден', true);
        }
      }
    } else {
      if (mounted) { // ← ДОБАВЬТЕ проверку
        showSingleNotification('✗ Пользователь не авторизован', true);
      }
    }
  } catch (error) {
    if (mounted) {
      console.error('Ошибка загрузки данных:', error);
      showSingleNotification('✗ Ошибка загрузки профиля', true);
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
};

  const handleCountrySelect = async (country) => {
  // Проверяем, была ли страна уже установлена
  if (hasCountryBeenSet) {
    showSingleNotification('✗ Страну можно установить только один раз', true);
    setIsCountryPickerOpen(false);
    return;
  }

  setSelectedCountry(country.code);
  setUserData(prev => ({
    ...prev,
    country: country.code,
    countryName: country.name
  }));
  setIsCountryPickerOpen(false);
  
  // Сохраняем выбор страны в базу данных
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase
      .from('users')
      .update({
        country: country.code,
        countryName: country.name,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Ошибка сохранения страны:', error);
      showSingleNotification('✗ Ошибка сохранения страны', true);
    } else {
      setHasCountryBeenSet(true);
      showSingleNotification('✓ Страна успешно установлена');
    }
  }
};

  // Проверка кулдауна на смену никнейма
  const checkNicknameCooldown = (userData) => {
    if (userData.lastNicknameChange) {
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

  // --------------------------------------------------------------------------- Функция обновления аватара

  const handleAvatarUpdate = (newAvatarUrl) => {
    setUserData(prev => ({ 
      ...prev, 
      avatar_url: newAvatarUrl 
    }));
  };

  // -------------------------------------------------------------------------- Функция для обработки выбора класса

const handleClassSelect = async (playerClass) => {
  // Если выбран тот же класс, ничего не делаем
  if (userData?.player_class === playerClass) {
    setShowClassSelector(false);
    return;
  }

  setShowClassSelector(false);
  
  // Сохраняем выбор класса в базу данных
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase
      .from('users')
      .update({
        player_class: playerClass,
        lastUpdate: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Ошибка сохранения класса:', error);
      showSingleNotification('✗ Ошибка сохранения класса', true);
      // Возвращаем предыдущее значение при ошибке
      setSelectedClass(userData?.player_class || '');
    } else {
      setUserData(prev => ({ ...prev, player_class: playerClass }));
      showSingleNotification(`✓ Класс изменен на ${getClassName(playerClass)}`);
    }
  }
};

// Вспомогательная функция для получения названия класса
const getClassName = (classKey) => {
  const classNames = {
    assault: 'Штурмовик',
    medic: 'Медик',
    support: 'Поддержка',
    recon: 'Разведчик',
    engineer: 'Инженер'
  };
  return classNames[classKey] || classKey;
};

  // ------------------------------------------------------------------------ Проверка существования никнейма

const checkNicknameExists = async (nickname) => {
  try {
    const cleanNickname = nickname.trim();
    
    // Базовые проверки
    if (!cleanNickname) {
      showSingleNotification('✗ Введите никнейм', true);
      return true;
    }
    
    if (/\s/.test(cleanNickname)) {
      showSingleNotification('✗ Никнейм не должен содержать пробелы', true);
      return true;
    }
    
    if (cleanNickname.length < 2) {
      showSingleNotification('✗ Никнейм должен содержать минимум 2 символа', true);
      return true;
    }

    if (cleanNickname.length > 20) {
      showSingleNotification('✗ Никнейм не должен превышать 20 символов', true);
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
      showSingleNotification('✗ Никнейм уже занят', true);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Ошибка проверки никнейма:', error);
    showSingleNotification('✗ Ошибка проверки никнейма', true);
    return true;
  }
};

// ------------------------------------------------------------------------------- Сохранение никнейма

const saveNickname = async () => {
  if (!editedNickname.trim()) {
    showSingleNotification('✗ Введите никнейм', true);
    return;
  }

  const cleanNickname = editedNickname.trim();
  
  // Проверка на пустую строку
  if (!cleanNickname) {
    showSingleNotification('✗ Введите никнейм', true);
    return;
  }

  // Проверяем, не совпадает ли новый никнейм со старым (учитывая регистр)
  if (cleanNickname === (userData.battlefield_nickname || '')) {
    showSingleNotification('✗ Это ваш текущий никнейм', true);
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
  showSingleNotification('✗ Пользователь не авторизован', true);
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

setUserData(prev => ({ 
  ...prev, 
  battlefield_nickname: cleanNickname,
  lastNicknameChange: new Date().toISOString()
}));

    setIsEditingNickname(false);
    setCanEditNickname(false);
    setNicknameCooldown(30);
    showSingleNotification('✓ Никнейм успешно изменен! Следующее изменение возможно через 30 дней');
  } catch (error) {
    console.error('Ошибка сохранения никнейма:', error);
    showSingleNotification('✗ Ошибка сохранения никнейма', true);
  }
};

  // ----------------------------------------------------------- Функция изменения возраста (можно установить только один раз)
  
  const editAge = async () => {
    // Проверяем, был ли возраст уже установлен
    if (hasAgeBeenSet) {
      showSingleNotification('✗ Возраст можно установить только один раз', true);
      return;
    }

    const currentAge = userData?.birthDate ? calculateAge(new Date(userData.birthDate)) : null;
    

    // ------------------------------------------------ Модальное окно для выбора даты

    const modal = document.createElement('div');
    modal.className = 'date-picker-modal';
    modal.innerHTML = `
      <div class="date-picker-content">
        <h3>Выберите дату рождения</h3>
        <div class="date-picker-notice">
          Возраст можно установить только один раз!
        </div>
        <div class="date-picker-fields">
          <div class="date-field">
            <label>День</label>
            <select class="day-select">
              <option value="">День</option>
              ${Array.from({length: 31}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
          </div>
          <div class="date-field">
            <label>Месяц</label>
            <select class="month-select">
              <option value="">Месяц</option>
              <option value="1">Январь</option>
              <option value="2">Февраль</option>
              <option value="3">Март</option>
              <option value="4">Апрель</option>
              <option value="5">Май</option>
              <option value="6">Июнь</option>
              <option value="7">Июль</option>
              <option value="8">Август</option>
              <option value="9">Сентябрь</option>
              <option value="10">Октябрь</option>
              <option value="11">Ноябрь</option>
              <option value="12">Декабрь</option>
            </select>
          </div>
          <div class="date-field">
            <label>Год</label>
            <select class="year-select">
              <option value="">Год</option>
              ${Array.from({length: 100}, (_, i) => {
                const year = new Date().getFullYear() - 15 - i;
                return `<option value="${year}">${year}</option>`;
              }).join('')}
            </select>
          </div>
        </div>
        <div class="date-picker-preview">
          <span>Возраст: </span>
          <span class="age-preview">-</span>
        </div>
        <div class="date-picker-buttons">
          <button class="cancel-btn">Отмена</button>
          <button class="save-btn" disabled>Сохранить</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    const updateAgePreview = () => {
      const day = modal.querySelector('.day-select').value;
      const month = modal.querySelector('.month-select').value;
      const year = modal.querySelector('.year-select').value;
      
      if (day && month && year) {
        const birthDate = new Date(year, month - 1, day);
        const age = calculateAge(birthDate);
        
        if (age < 16) {
          modal.querySelector('.age-preview').textContent = 'Меньше 16 лет';
          modal.querySelector('.age-preview').style.color = '#ce2727';
          modal.querySelector('.save-btn').disabled = true;
        } else {
          modal.querySelector('.age-preview').textContent = displayAge(age);
          modal.querySelector('.age-preview').style.color = '#22b327';
          modal.querySelector('.save-btn').disabled = false;
        }
      }
    };

    modal.querySelector('.day-select').addEventListener('change', updateAgePreview);
    modal.querySelector('.month-select').addEventListener('change', updateAgePreview);
    modal.querySelector('.year-select').addEventListener('change', updateAgePreview);

    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.save-btn').addEventListener('click', async () => {
  const day = modal.querySelector('.day-select').value;
  const month = modal.querySelector('.month-select').value;
  const year = modal.querySelector('.year-select').value;
  
  if (day && month && year) {
    const birthDate = new Date(year, month - 1, day);
    const age = calculateAge(birthDate);
    
    if (age < 16) {
      showSingleNotification('✗ Минимальный возраст - 16 лет', true);
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('users')
        .update({
          birthDate: birthDate.toISOString(),
          lastUpdate: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      
      setUserData(prev => ({ ...prev, birthDate: birthDate.toISOString() }));
      setHasAgeBeenSet(true);
      showSingleNotification('✓ Возраст установлен');
      document.body.removeChild(modal);
    } catch (error) {
      console.error('Ошибка сохранения возраста:', error);
      showSingleNotification('✗ Ошибка сохранения возраста', true);
    }
  }
});

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  // ----------------------------------------------------------------------------- Вспомогательные функции

  const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

  const displayAge = (age) => {
    if (!age) return 'Не указан';
    let yearsText = 'лет';
    if (age % 10 === 1 && age % 100 !== 11) yearsText = 'год';
    else if ([2,3,4].includes(age % 10) && ![12,13,14].includes(age % 100)) yearsText = 'года';
    return `${age} ${yearsText}`;
  };

  // Определяем статус игрока автоматически
  const getPlayerStatus = () => {
    if (userData?.team && userData.team !== "free agent") {
      return {
        text: userData.team,
        color: '#ff6600'
      };
    } else {
      return {
        text: 'Свободный агент',
        color: '#b2ad9c'
      };
    }
  };

  if (loading) {
  return <div className="loading-profile">
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Загрузка...</p>
    </div>
    </div>;
}

if (!userData) {
  return null; // Компонент не рендерится
}

  const age = userData.birthDate ? calculateAge(userData.birthDate) : null;
  const playerStatus = getPlayerStatus();

  // ------------------------------------------------------------------------ Функция удаления аккаунта

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        showSingleNotification('✗ Пользователь не авторизован', true);
        return;
      }

      // Удаляем пользователя из базы данных
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Выходим из системы
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }

      showSingleNotification('✓ Аккаунт успешно удален');
      navigate('/');
      
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error);
      showSingleNotification('✗ Ошибка удаления аккаунта', true);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // ------------------------------------------------------------------------ Модальное окно подтверждения удаления

  const DeleteConfirmationModal = () => {
    if (!isDeleteModalOpen) return null;

    return (
      <div 
      className="modal-overlay">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Удаление аккаунта</h3>
          </div>
          
          <div className="modal-body">
            <div className="delete-warning">
              <img 
                src="/images/icons/icon-promo-line-news.png" 
                alt="warning"
              />
              <p>Вы уверены, что хотите удалить свой аккаунт?</p>
            </div>
            
            <div className="delete-consequences">
              <p>Это действие приведет к:</p>
              <ul>
                <li>Полному удалению всех ваших данных</li>
                <li>Удалению статистики и достижений</li>
                <li>Удалению информации о команде (если вы в ней состоите)</li>
                <li>Потере доступа ко всем турнирам</li>
              </ul>
              <p className="final-warning">Это действие нельзя отменить!</p>
            </div>
          </div>
          
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => {setIsDeleteModalOpen(false); document.body.style.overflow = 'unset';}}>
            Отмена
            </button>
            <button 
              className="delete-confirm-btn"
              onClick={handleDeleteAccount}
            >
              Да, удалить все данные
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // ------------------------------------------------------------------------ Функция обработки кликов по контактам

const handleContactClick = (platform, contact) => {
  if (!contact) return;
  
  let url = '';
  
  switch (platform) {
    case 'steam':
      // Проверяем, является ли контакт Steam ID или ссылкой
      if (contact.startsWith('https://') || contact.startsWith('http://')) {
        url = contact;
      } else {
        // Если это просто ID, формируем ссылку на профиль Steam
        url = `https://steamcommunity.com/id/${contact}`;
      }
      break;
      
    case 'telegram':
      // Проверяем, является ли контакт ссылкой или username
      if (contact.startsWith('https://') || contact.startsWith('http://') || contact.startsWith('@')) {
        url = contact.startsWith('@') ? `https://t.me/${contact.slice(1)}` : contact;
      } else {
        url = `https://t.me/${contact}`;
      }
      break;
      
    case 'whatsapp':
      // Очищаем номер от всего, кроме цифр
      const cleanPhone = contact.replace(/\D/g, '');
      
      // Проверяем, есть ли код страны
      if (cleanPhone.length < 10) {
        showSingleNotification('✗ Неверный формат номера WhatsApp', true);
        return;
      }
      
      // Если номер начинается с 8 (Россия), заменяем на 7
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

  // ------------------------------------------------------------------------------- Функция для открытия модального окна контактов
// ------------------------------------------------------------------------------------------------------------------------------

const openContactsModal = () => {
  setIsContactsModalOpen(true);
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
        showSingleNotification('✗ Пользователь не авторизован', true);
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

      setUserData(prev => ({ 
        ...prev, 
        contacts: localContactsData 
      }));
      
      setIsContactsModalOpen(false);
      showSingleNotification('✓ Контакты сохранены');
    } catch (error) {
      console.error('Ошибка сохранения контактов:', error);
      showSingleNotification('✗ Ошибка сохранения контактов', true);
    }
  };

  if (!isContactsModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content contacts-modal">
        <div className="modal-header">
          <h3 className="modal-title-contacts">Редактирование контактов</h3>
        </div>
        
        <div className="modal-body">
          <div className="contacts-inputs-container">
            {/* Steam */}
            <div className="contact-input-group">
              <div className="contact-input-label">
                <span>Steam</span>
              </div>
              <input
                type="text"
                className="contact-input"
                value={localContactsData.steam}
                onChange={(e) => handleInputChange('steam', e.target.value)}
                placeholder="Введите Steam никнейм"
              />
            </div>

            {/* Telegram */}
            <div className="contact-input-group">
              <div className="contact-input-label">
                <span>Telegram</span>
              </div>
              <input
                type="text"
                className="contact-input"
                value={localContactsData.telegram}
                onChange={(e) => handleInputChange('telegram', e.target.value)}
                placeholder="Введите никнейм Telegram без @"
              />
            </div>

            {/* WhatsApp */}
            <div className="contact-input-group">
              <div className="contact-input-label">
                <span>WhatsApp</span>
              </div>
              <input
                type="text"
                className="contact-input"
                value={localContactsData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="Введите номер с кодом страны без +"
              />
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button 
            className="cancel-btn"
            onClick={() => setIsContactsModalOpen(false)}
          >
            Отмена
          </button>
          <button 
            className="save-contacts-btn"
            onClick={handleSaveContacts}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

   // -------------------------------------------------------------------------------------------------------- HTML ---------------------------------------------

  return (
     <>
      <SEO 
        title="Player Profile - AWL Battlefield 6 Your Cyberpsort Profile"
        description="View your Battlefield 6 player profile, statistics, achievements, and tournament history. Manage your esports career in Arena Warborn League."
        keywords="bf6 profile, player statistics, gaming achievements, esports career bf6"
        canonicalUrl="/profile"
      />
      {/* Основной контент страницы */}
    <div className="content-index">

       {/* Блок информации об игроке */}
      <div className="player-information">
        <img className="profile-awl-background" src="/images/other/profile-background-awl.webp" alt="awl-logo-profile"/>
        {/*  Основной контейнер для первых четырех блоков */}
        <div className="main-info-container">
        <div className="info-content-wrapper">
          {/*  Первый блок - Игрок */}
        <div className="info-section">
          <h3 className="section-title">Игрок</h3>
          <div className="info-block first-block">
            <div className="nickname-and-class-container">
            {/* Ник игрока - с возможностью редактирования */}
            <div className="nickname-container">
              {isEditingNickname ? (
                <div className="nickname-edit-container">
                  <input
                    className="name-player-style editable"
                    value={editedNickname}
                    onChange={(e) => setEditedNickname(e.target.value)}
                    placeholder="Введите никнейм"
                    maxLength={30}
                    autoFocus
                  />
                  <div className="nickname-edit-buttons">
                    <button 
                      className="nickname-save-btn"
                      onClick={saveNickname}
                    >
                      <img className="icons-redactor" src="/images/icons/icon-save.png" alt="save-options"/>
                    </button>
                    <button 
                      className="nickname-cancel-btn"
                      onClick={() => {
                        setIsEditingNickname(false);
                        setEditedNickname(userData.battlefield_nickname || '');
                      }}
                    >
                      <img className="icons-redactor" src="/images/icons/icon-redactor2.png" alt="back"/>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="nickname-display-container">
                  <span className="name-player-style">
                    {userData.battlefield_nickname || 'Ник не указан'}
                  </span>
                  {canEditNickname && (
                    <button 
                      className="nickname-edit-btn"
                      onClick={() => setIsEditingNickname(true)}
                      title="Редактировать никнейм"
                    >
                      <img className="icons-redactor" src="/images/icons/icon-redactor1.png" alt="choose-options"/>
                    </button>
                  )}
                  {!canEditNickname && nicknameCooldown && (
                    <span className="nickname-cooldown" title={`Следующее изменение через ${nicknameCooldown} дней`}>
                      <img className="icons-redactor-time" src="/images/icons/icon-timeless.png" alt="change-time-is"/> {nicknameCooldown}д
                    </span>
                  )}
                </div>
              )}
            </div>

             {/* Контейнер для выбора класса игрока */}
<div className="class-selector-container">
  <span className="class-label">Класс:</span>
  <div className="class-selector">
    <div 
      className="current-class"
      onClick={() => setShowClassSelector(!showClassSelector)}
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={`/images/icons/icon-class-${userData?.player_class || 'assault'}.png`} 
        alt={userData?.player_class || 'assault'}
        className="class-icon-profile"
      />
    </div>
    
    {showClassSelector && (
      <div className="class-options-row">
        {['assault', 'medic', 'recon', 'engineer'].map((playerClass) => (
          <div
            key={playerClass}
            className={`class-option ${userData?.player_class === playerClass ? 'selected' : ''}`}
            onClick={() => handleClassSelect(playerClass)}
          >
            <img 
              src={`/images/icons/icon-class-${playerClass}.png`} 
              alt={playerClass}
              className="class-icon-profile"
            />
          </div>
        ))}
      </div>
    )}
  </div>
</div>
</div>
            
            <div className="horizontal-row-1">
        <div className="info-player-style">
          {/* Контейнер для иконки страны - кликабельный только если страна не установлена */}
          <div 
            className={`country-selector ${!hasCountryBeenSet ? 'clickable' : ''}`}
            onClick={!hasCountryBeenSet ? () => setIsCountryPickerOpen(true) : undefined}
            title={!hasCountryBeenSet ? "Кликните для выбора страны" : "Страна установлена"}
            style={{ 
              cursor: !hasCountryBeenSet ? 'pointer' : 'default', 
              display: 'flex', 
              alignItems: 'center',
              marginRight: '15px',
              justifyContent: 'center',
              width: '30px',
              height: '23px',
              opacity: hasCountryBeenSet ? 0.7 : 1
            }}
          >
            {/* Ленивая загрузка флагов с fallback */}
            {selectedCountry && selectedCountry !== 'EMPTY' ? (
              <Suspense fallback={
                <div style={{
                  width: '30px',
                  height: '23px',
                  backgroundColor: '#b2ad9c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '2px',
                  color: '#333',
                  fontSize: '12px'
                }}>
                  🌐
                </div>
              }>
                <Flag 
                  code={selectedCountry} 
                  style={{ 
                    borderRadius: '2px',
                    objectFit: 'cover'
                  }}
                  title={userData?.countryName || getCountryName(selectedCountry)}
                />
              </Suspense>
            ) : (
              <div style={{
                width: '30px',
                height: '23px',
                backgroundColor: '#b2ad9c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                color: '#333',
                fontSize: '12px'
              }}>
                ?
              </div>
            )}
          </div>
    
          {/* Контейнер для имени игрока - не кликабельный */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <span style={{ 
              fontSize: '16px', 
              color: '#f6efd9',
              lineHeight: '1.2'
            }}>
              {userData?.fullname || 'Имя не указано'}
            </span>
            {!hasCountryBeenSet && (
              <span style={{
                fontSize: '12px',
                color: '#b2ad9c',
                fontStyle: 'italic'
              }}>
                Выберите страну
              </span>
            )}
          </div>
        </div>
              
              <div className="age-and-status-container">
                {/* Возраст - можно установить один раз */}
                <span 
                  className={`age-and-status-player-style ${!hasAgeBeenSet ? 'clickable' : ''}`} 
                  onClick={!hasAgeBeenSet ? editAge : undefined}
                  title={!hasAgeBeenSet ? "Кликните для установки возраста" : "Возраст установлен"}
                ><span className="class-label">Возраст:</span>
                  {age ? displayAge(age) : 'Установить возраст'}
                </span>
                
                {/* Статус игрока - определяется автоматически */}
                <span 
                  className="age-and-status-player-style" 
                  style={{ color: playerStatus.color }}
                ><span className="class-label">Команда:</span>
                  {playerStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- 2 блок - Награды MVP */}

        <div className="info-section">
          <h3 className="section-title">Награды MVP</h3>
          <div className="info-block second-block">
            <div className="mvp-rewards-grid">
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-cup-first-place.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* ------------------------------------------------------------- 3 и 4 блоки - MMR и Дивизион */}

        <div className="info-sections-container">
          <div className="info-section">
            <h3 className="section-title">MMR</h3>
            <div className="info-block mmr-value">
            {userData.mmr !== undefined && userData.mmr !== null ? userData.mmr : 0}
            </div>
          </div>
          
          <div className="info-section">
            <h3 className="section-title">Дивизион</h3>
            <div className="svg-division-container">
              <svg className="svg-division-block" viewBox="0 0 302 92" preserveAspectRatio="none">
                <path 
                  d="M9,1 L286,1 L301,46 L286,91 L9,91 C4.58,91 1,87.42 1,83 L1,9 C1,4.58 4.58,1 9,1Z" 
                  fill="none" 
                  stroke="#ff6600" 
                  strokeWidth="2" 
                  strokeLinejoin="round"
                />
              </svg>
              <div className={`svg-division-content ${userData.division === "calibration" ? "calibration" : ""}`}>
      {userData.division === "calibration" ? "Калибровка" : userData.division}
              </div>
            </div>
          </div>
        </div>
        </div>

         {/* -------------------------------------------------------------------- Блок для фото и контактов */}

    <div className="fade-block-container">
  <h3 className="section-title">Контакты</h3>
  <div className="contacts-profile-block">
    <div className="contacts-container">
      {/* Steam */}
      <div 
        className={`contact-block ${!userData?.contacts?.steam ? 'disabled' : ''}`}
        onClick={() => userData?.contacts?.steam && handleContactClick('steam', userData.contacts.steam)}
        title={userData?.contacts?.steam ? "Перейти в Steam" : "Контакт не указан"}
      >
        <span className="contact-name">Steam</span>
        <img src="/images/icons/icon-profile-steam.png" alt="Steam" className="contact-icon"/>
      </div>
      
      {/* Telegram */}
      <div 
        className={`contact-block middle ${!userData?.contacts?.telegram ? 'disabled' : ''}`}
        onClick={() => userData?.contacts?.telegram && handleContactClick('telegram', userData.contacts.telegram)}
        title={userData?.contacts?.telegram ? "Перейти в Telegram" : "Контакт не указан"}
      >
        <span className="contact-name">Telegram</span>
        <img src="/images/icons/icon-profile-telegram.png" alt="Telegram" className="contact-icon"/>
      </div>
      
      {/* WhatsApp */}
      <div 
        className={`contact-block ${!userData?.contacts?.whatsapp ? 'disabled' : ''}`}
        onClick={() => userData?.contacts?.whatsapp && handleContactClick('whatsapp', userData.contacts.whatsapp)}
        title={userData?.contacts?.whatsapp ? "Перейти в WhatsApp" : "Контакт не указан"}
      >
        <span className="contact-name">WhatsApp</span>
        <img src="/images/icons/icon-profile-whatsup.png" alt="WhatsApp" className="contact-icon"/>
      </div>
    </div>
  </div>

  {/* -------------------------------------------------------------------- Блок смены аватара */}
  
  <div className="fade-block">
    <AvatarContactsEditor 
          userData={userData}
          onAvatarUpdate={handleAvatarUpdate}
        />
  </div>
</div>
</div>

        {/* -------------------------------------------------------------------- Блок статистики */}

        <div className="stats-actions-container">
          <div className="info-section">
            <h3 className="section-title">Статистика</h3>
            <div className="info-block">
              <div className="stats-container">
                <div className="stats-column">
                  <div className="stat-item">
                    <span className="stat-label">{t('stats.kdRatio')}</span>
                    <span className="stat-value">{userData.stats?.kdRatio ?? t('stats.notAvailable')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('stats.winRate')}</span>
                    <span className="stat-value">{userData.stats?.winRate ? `${userData.stats.winRate}%` : t('stats.notAvailable')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('stats.playTime')}</span>
                    <span className="stat-value">{userData.stats?.playTime ?? t('stats.notAvailable')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('stats.favoriteWeapon')}</span>
                    <span className="stat-value">{userData.stats?.favoriteWeapon ?? t('stats.notAvailable')}</span>
                  </div>
                </div>
                
                <div className="stats-column">
                  <div className="stat-item">
                    <span className="stat-label">{t('stats.wins')}</span>
                    <span className="stat-value">{userData.stats?.wins ?? t('stats.notAvailable')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('stats.losses')}</span>
                    <span className="stat-value">{userData.stats?.losses ?? t('stats.notAvailable')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">В разработке</span>
                    <span className="stat-value">{t('stats.notAvailable')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">В разработке</span>
                    <span className="stat-value">{t('stats.notAvailable')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------- Блок меню кнопок */}

    <div className="info-section">
        <div className="info-block">
            <div className="action-buttons-container">
                <button className="action-btn" onClick={openContactsModal}>
                    <span className="btn-text">Контакты</span>
                </button>
                <button className="action-btn" onClick={handleTeamButtonClick}>
                    <span className="btn-text">Команда</span>
                </button>
                <button className="action-btn">
                    <span className="btn-text">Турниры</span>
                </button>
                <button className="action-btn">
                    <span className="btn-text">Приватность</span>
                </button>
                <button className="action-btn" onClick={() => setIsDeleteModalOpen(true)}>
                    <span className="btn-text">Удалить аккаунт</span>
                </button>
            </div>
        </div>
    </div>
</div>

        {/* -------------------------------------------------------------------- Блок достижений */}

        <div className="info-section achievements-section">
          <h3 className="section-title">Достижения</h3>
          <div className="info-block achievements-block">
            <div className="achievements-row">
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 1"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 2"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 3"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 4"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 5"/>
              </div>
              <div className="achievement-item">
                <img src="/images/icons/icon-not-information.png" className="achievement-icon" alt="Достижение 6"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal />
      {/* Модальное окно контактов */}
      <ContactsModal />
      {/* Модальное окно создания команды */}
      <CreateTeamModal 
  isOpen={isCreateTeamModalOpen}
  onClose={() => setIsCreateTeamModalOpen(false)}
  onTeamCreated={handleTeamCreated}
/>

       {/* Компонент выбора страны */}
      <CountryPicker
        isOpen={isCountryPickerOpen}
        onClose={() => setIsCountryPickerOpen(false)}
        currentCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
        disabled={hasCountryBeenSet} // Передаем пропс о блокировке
      />
    </div>
    </>
  );
};

// Вспомогательная функция для получения названия страны
const getCountryName = (countryCode) => {
  const countryList = [
    { code: 'ru', name: 'Россия' },
    { code: 'us', name: 'США' },
    { code: 'de', name: 'Германия' },
    { code: 'fr', name: 'Франция' },
    { code: 'gb', name: 'Великобритания' },
    { code: 'jp', name: 'Япония' },
    { code: 'kr', name: 'Корея' },
    { code: 'cn', name: 'Китай' },
    { code: 'br', name: 'Бразилия' },
    { code: 'in', name: 'Индия' },
    { code: 'ca', name: 'Канада' },
    { code: 'au', name: 'Австралия' },
    { code: 'it', name: 'Италия' },
    { code: 'es', name: 'Испания' },
    { code: 'ua', name: 'Украина' },
    { code: 'kz', name: 'Казахстан' },
    { code: 'by', name: 'Беларусь' },
    { code: 'pl', name: 'Польша' },
    { code: 'tr', name: 'Турция' },
    { code: 'nl', name: 'Нидерланды' },
    { code: 'se', name: 'Швеция' },
    { code: 'no', name: 'Норвегия' },
    { code: 'fi', name: 'Финляндия' },
    { code: 'dk', name: 'Дания' },
    { code: 'mx', name: 'Мексика' },
    { code: 'id', name: 'Индонезия' },
    { code: 'sa', name: 'Саудовская Аравия' },
    { code: 'za', name: 'Южная Африка' },
    { code: 'eg', name: 'Египет' },
    { code: 'ar', name: 'Аргентина' },
    { code: 'pt', name: 'Португалия' },
    { code: 'gr', name: 'Греция' },
    { code: 'cz', name: 'Чехия' },
    { code: 'ch', name: 'Швейцария' },
    { code: 'at', name: 'Австрия' },
    { code: 'be', name: 'Бельгия' },
    { code: 'il', name: 'Израиль' },
    { code: 'th', name: 'Таиланд' },
    { code: 'vn', name: 'Вьетнам' },
    { code: 'my', name: 'Малайзия' },
    { code: 'sg', name: 'Сингапур' },
    { code: 'ph', name: 'Филиппины' },
    { code: 'ie', name: 'Ирландия' },
    { code: 'hu', name: 'Венгрия' },
    { code: 'ro', name: 'Румыния' },
    { code: 'bg', name: 'Болгария' },
    { code: 'hr', name: 'Хорватия' },
    { code: 'rs', name: 'Сербия' },
    { code: 'sk', name: 'Словакия' },
    { code: 'si', name: 'Словения' },
    { code: 'ee', name: 'Эстония' },
    { code: 'lv', name: 'Латвия' },
    { code: 'lt', name: 'Литва' },
    { code: 'is', name: 'Исландия' },
    { code: 'lu', name: 'Люксембург' },
    { code: 'mt', name: 'Мальта' },
  ];
  
  const country = countryList.find(c => c.code === countryCode);
  return country ? country.name : 'Неизвестно';
};

export default Profile;