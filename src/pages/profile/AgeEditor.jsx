// AgeEditor.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '/utils/language-context.jsx';

const AgeEditor = ({ userData, hasAgeBeenSet, onSaveAge, showSingleNotification, supabase, onAgeUpdated }) => {
  const { t, currentLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (!age) return t('age.notSet');
    
    let yearsText = '';
    
    if (currentLanguage === 'ru') {
      const lastDigit = age % 10;
      const lastTwoDigits = age % 100;
      
      if (lastDigit === 1 && lastTwoDigits !== 11) {
        yearsText = t('age.yearForms.year');
      } else if ([2,3,4].includes(lastDigit) && ![12,13,14].includes(lastTwoDigits)) {
        yearsText = t('age.yearForms.years2_4');
      } else {
        yearsText = t('age.yearForms.years5_20');
      }
    } else {
      yearsText = age === 1 ? t('age.yearForms.year') : t('age.yearForms.years');
    }
    
    return t('age.years', { count: age, form: yearsText });
  };

  const openAgeModal = () => {
    if (hasAgeBeenSet) {
      showSingleNotification('✗ Возраст можно установить только один раз', true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSaveAge = async () => {
    const day = document.querySelector('.day-select')?.value;
    const month = document.querySelector('.month-select')?.value;
    const year = document.querySelector('.year-select')?.value;
    
    if (day && month && year) {
      const birthDate = new Date(year, month - 1, day);
      const age = calculateAge(birthDate);
      
      if (age < 16) {
        showSingleNotification(`✗ ${t('age.minAge')}`, true);
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
        
        if (onAgeUpdated) {
          onAgeUpdated(birthDate.toISOString());
        }
        
        showSingleNotification(t('profile.save_age_notification'));
        closeModal();
      } catch (error) {
        showSingleNotification(`✗ ${t('profile.error_age_notification')}`, true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    const modal = document.querySelector('.date-picker-modal');
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };

  const createModal = () => {
    const modal = document.createElement('div');
    modal.className = 'date-picker-modal';
    modal.innerHTML = `
      <div class="date-picker-content">
        <h3>${t('profile.setBirthDate')}</h3>
        <div class="date-picker-notice">
          ${t('profile.ageSetOnce')}
        </div>
        <div class="date-picker-fields">
          <div class="date-field">
            <label>${t('profile.day')}</label>
            <select class="day-select">
              <option value="">${t('profile.day')}</option>
              ${Array.from({length: 31}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
          </div>
          <div class="date-field">
            <label>${t('profile.month')}</label>
            <select class="month-select">
              <option value="">${t('profile.month')}</option>
              <option value="1">${currentLanguage === 'ru' ? 'Январь' : 'January'}</option>
              <option value="2">${currentLanguage === 'ru' ? 'Февраль' : 'February'}</option>
              <option value="3">${currentLanguage === 'ru' ? 'Март' : 'March'}</option>
              <option value="4">${currentLanguage === 'ru' ? 'Апрель' : 'April'}</option>
              <option value="5">${currentLanguage === 'ru' ? 'Май' : 'May'}</option>
              <option value="6">${currentLanguage === 'ru' ? 'Июнь' : 'June'}</option>
              <option value="7">${currentLanguage === 'ru' ? 'Июль' : 'July'}</option>
              <option value="8">${currentLanguage === 'ru' ? 'Август' : 'August'}</option>
              <option value="9">${currentLanguage === 'ru' ? 'Сентябрь' : 'September'}</option>
              <option value="10">${currentLanguage === 'ru' ? 'Октябрь' : 'October'}</option>
              <option value="11">${currentLanguage === 'ru' ? 'Ноябрь' : 'November'}</option>
              <option value="12">${currentLanguage === 'ru' ? 'Декабрь' : 'December'}</option>
            </select>
          </div>
          <div class="date-field">
            <label>${t('profile.year')}</label>
            <select class="year-select">
              <option value="">${t('profile.year')}</option>
              ${Array.from({length: 100}, (_, i) => {
                const year = new Date().getFullYear() - 15 - i;
                return `<option value="${year}">${year}</option>`;
              }).join('')}
            </select>
          </div>
        </div>
        <div class="date-picker-preview">
          <span>${t('profile.agePreview')} </span>
          <span class="age-preview">-</span>
        </div>
        <div class="date-picker-buttons">
          <button class="cancel-btn">${t('profile.cancel')}</button>
          <button class="save-btn" disabled>${t('profile.save')}</button>
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
          modal.querySelector('.age-preview').textContent = t('profile.lessThan16');
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

    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.save-btn').addEventListener('click', handleSaveAge);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  };

  useEffect(() => {
    if (isModalOpen) {
      createModal();
    }
  }, [isModalOpen]);

  const currentAge = userData?.birthDate ? calculateAge(new Date(userData.birthDate)) : null;

  return (
    <span 
      className={`age-and-status-player-style ${!hasAgeBeenSet ? 'clickable' : ''}`} 
      onClick={!hasAgeBeenSet ? openAgeModal : undefined}
      title={!hasAgeBeenSet ? t('player.setAge') : t('player.ageSet')}
    >
      <span className="class-label">{t('player.age')}:</span>
      {currentAge ? displayAge(currentAge) : t('player.setAge')}
    </span>
  );
};

export default AgeEditor;