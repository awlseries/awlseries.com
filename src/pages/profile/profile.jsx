import React, { lazy, Suspense } from 'react';
import { useState, useEffect } from 'react';
import { showSingleNotification } from '/utils/notifications';
import CountryPicker from '../../components/CountryPicker';
import '/src/styles.css';

// Ленивая загрузка react-world-flags
const Flag = lazy(() => import('react-world-flags').then(module => {
  return { default: module.default };
}));

// Правильные пути импорта для структуры проекта
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';

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

   // useEffect для загрузки данных при монтировании
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        loadUserData(user);
      } else {
        setLoading(false);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Загрузка данных пользователя
  const loadUserData = async (user) => {
    try {
      setLoading(true);
      
      if (user && user.emailVerified) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
          ...data,
          battlefieldNickname: data.battlefieldNickname || '',
            country: data.country || 'EMPTY',
            countryName: data.countryName || 'Не выбрана'
          });
          setEditedNickname(data.battlefieldNickname || '');
          setSelectedCountry(data.country || 'EMPTY');
          setHasAgeBeenSet(!!data.birthDate);
          setHasCountryBeenSet(!!data.country && data.country !== 'EMPTY');
          checkNicknameCooldown(data);
          
          // Проверяем кулдаун на смену никнейма
          checkNicknameCooldown(data);
        } else {
          showSingleNotification('✗ Профиль не найден', true);
        }
      } else {
        showSingleNotification('✗ Подтвердите email для доступа к профилю', true);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      showSingleNotification('✗ Ошибка загрузки профиля', true);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country) => {
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
    const user = auth.currentUser;
    if (user) {
      updateDoc(doc(db, 'users', user.uid), {
        country: country.code,
        countryName: country.name,
        lastUpdate: serverTimestamp()
      }).then(() => {
        setHasCountryBeenSet(true); // Устанавливаем флаг, что страна была установлена
        showSingleNotification('✓ Страна успешно установлена');
      }).catch(error => {
        console.error('Ошибка сохранения страны:', error);
        showSingleNotification('✗ Ошибка сохранения страны', true);
      });
    }
  };

  // Проверка кулдауна на смену никнейма
  const checkNicknameCooldown = (userData) => {
    if (userData.lastNicknameChange) {
      const lastChange = userData.lastNicknameChange.toDate();
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
    // Нормализуем входную строку - убираем лишние пробелы
    const cleanNickname = nickname.trim();
    
    // Проверка на пустую строку
    if (!cleanNickname) {
      return false;
    }

    // Проверка на наличие пробелов
    if (/\s/.test(cleanNickname)) {
      showSingleNotification('✗ Никнейм не должен содержать пробелы', true);
      return true;
    }

    // Проверка на минимальную длину
    if (cleanNickname.length < 2) {
      showSingleNotification('✗ Никнейм должен содержать минимум 2 символа', true);
      return true;
    }

    if (cleanNickname.length > 20) {
      showSingleNotification('✗ Никнейм не должен превышать 20 символов', true);
      return true;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef);
    
    const querySnapshot = await getDocs(q);
    
    // Фильтруем результаты с учетом регистра (игнорируем регистр)
    const currentUser = auth.currentUser;
    let caseInsensitiveMatch = false;

    querySnapshot.forEach((doc) => {
      // Пропускаем текущего пользователя
      if (currentUser && doc.id === currentUser.uid) {
        return;
      }

      const existingNickname = doc.data().battlefieldNickname;
      // Сравниваем без учета регистра
      if (existingNickname && existingNickname.toLowerCase() === cleanNickname.toLowerCase()) {
        caseInsensitiveMatch = true;
      }
    });

    if (caseInsensitiveMatch) {
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

// Обновленная функция сохранения никнейма
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
  if (cleanNickname === (userData.battlefieldNickname || '')) {
    showSingleNotification('✗ Это ваш текущий никнейм', true);
    return;
  }

  // Проверяем существование никнейма
  const nicknameExists = await checkNicknameExists(cleanNickname);
  if (nicknameExists) {
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      showSingleNotification('✗ Пользователь не авторизован', true);
      return;
    }

    await updateDoc(doc(db, 'users', user.uid), {
      battlefieldNickname: cleanNickname,
      lastNicknameChange: serverTimestamp(),
      lastUpdate: serverTimestamp()
    });

    setUserData(prev => ({ 
      ...prev, 
      battlefieldNickname: cleanNickname,
      lastNicknameChange: Timestamp.now()
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

  // Функция изменения возраста (можно установить только один раз)
  const editAge = async () => {
    // Проверяем, был ли возраст уже установлен
    if (hasAgeBeenSet) {
      showSingleNotification('✗ Возраст можно установить только один раз', true);
      return;
    }

    const currentAge = userData?.birthDate ? calculateAge(userData.birthDate) : null;
    
    // Создаем модальное окно для выбора даты
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
        const age = calculateAge(Timestamp.fromDate(birthDate));
        
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
        const birthTimestamp = Timestamp.fromDate(birthDate);
        const age = calculateAge(birthTimestamp);
        
        if (age < 16) {
          showSingleNotification('✗ Минимальный возраст - 16 лет', true);
          return;
        }
        
        try {
          const user = auth.currentUser;
          await updateDoc(doc(db, 'users', user.uid), {
            birthDate: birthTimestamp,
            lastUpdate: serverTimestamp()
          });
          
          setUserData(prev => ({ ...prev, birthDate: birthTimestamp }));
          setHasAgeBeenSet(true); // Устанавливаем флаг, что возраст был установлен
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

  // Вспомогательные функции
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const birth = birthDate.toDate();
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
        color: '#22b327'
      };
    } else {
      return {
        text: 'Свободный агент',
        color: '#b2ad9c'
      };
    }
  };

  if (loading) {
  return <div className="loading-profile">Загрузка профиля...</div>;
}

if (!userData) {
  return null; // Компонент не рендерится
}

  const age = userData.birthDate ? calculateAge(userData.birthDate) : null;
  const playerStatus = getPlayerStatus();

  return (
    <div className="content-index">
      <img className="profile-awl-background" src="/images/other/profile-background-awl.webp" alt="awl-logo-profile"/>

      <div className="fade-block">
        <img src="/images/other/profile-player-example.png" alt="awl-player-photo" className="masked-image"/>
      </div>

      <div className="player-information">
        <div className="info-section">
          <h3 className="section-title">Игрок</h3>
          <div className="info-block">
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
                        setEditedNickname(userData.battlefieldNickname || '');
                      }}
                    >
                      <img className="icons-redactor" src="/images/icons/icon-redactor2.png" alt="back"/>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="nickname-display-container">
                  <span className="name-player-style">
                    {userData.battlefieldNickname || 'Ник не указан'}
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
                >
                  {age ? displayAge(age) : 'Установить возраст'}
                </span>
                
                {/* Статус игрока - определяется автоматически */}
                <span 
                  className="age-and-status-player-style" 
                  style={{ color: playerStatus.color }}
                >
                  {playerStatus.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Остальные блоки остаются без изменений */}
        <div className="info-section">
          <h3 className="section-title">Награды MVP</h3>
          <div className="info-block">
            <div className="mvp-rewards-grid">
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-medal1.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-medal2.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-medal3.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
              <div className="mvp-reward-item">
                <img src="/images/medals/icon-medal2.png" className="reward-icon" alt="Награда"/>
                <span className="reward-text">Название турнира с призовым местом</span>
              </div>
            </div>
          </div>
        </div>

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

        <div className="stats-actions-container">
          <div className="info-section">
            <h3 className="section-title">Статистика</h3>
            <div className="info-block">
              <div className="stats-container">
                <div className="stats-column">
                  <div className="stat-item">
                    <span className="stat-label">У/С</span>
                    <span className="stat-value">{userData.stats?.kdRatio || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">% Побед</span>
                    <span className="stat-value">{userData.stats?.winRate || '0%'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Время в игре</span>
                    <span className="stat-value">{userData.stats?.playTime || '0 часов'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Любимое оружие</span>
                    <span className="stat-value">{userData.stats?.favoriteWeapon || 'Не указано'}</span>
                  </div>
                </div>
                
                <div className="stats-column">
                  <div className="stat-item">
                    <span className="stat-label">В разработке</span>
                    <span className="stat-value">n/a</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">В разработке</span>
                    <span className="stat-value">n/a</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">В разработке</span>
                    <span className="stat-value">n/a</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">В разработке</span>
                    <span className="stat-value">n/a</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <div className="info-block">
              <div className="action-buttons-container">
                <button className="action-btn">
                  <span className="btn-text">Контакты</span>
                </button>
                <button className="action-btn">
                  <span className="btn-text">Пригласить в команду</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
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
       {/* Компонент выбора страны */}
      <CountryPicker
        isOpen={isCountryPickerOpen}
        onClose={() => setIsCountryPickerOpen(false)}
        currentCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
        disabled={hasCountryBeenSet} // Передаем пропс о блокировке
      />
    </div>
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