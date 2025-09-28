import { useState } from 'react';
import { useLanguage } from '/utils/language-context.jsx';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({}); // Добавляем состояние для ошибок полей
  const { t } = useLanguage();

  const handleClose = () => {
    // Разблокируем скролл при закрытии
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    setFieldErrors({}); // Очищаем ошибки при закрытии
    onClose();
  };

  // Валидация формы обратной связи
  const validateFeedbackForm = (email, message) => {
    const errors = {};

    // Валидация email
    if (!email.trim()) {
      errors.email = t('errors.email_required') || 'Email обязателен';
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
      errors.email = t('errors.email_invalid') || 'Некорректный email';
    }

    // Валидация сообщения
    if (!message.trim()) {
      errors.message = t('errors.message_required');
    } else if (message.length < 10) {
      errors.message = t('errors.message_too_short');
    } else if (message.length > 1000) {
      errors.message = t('errors.message_too_long');
    }

    return errors;
  };

  // Очистка ошибки поля при фокусе
  const handleFieldFocus = (fieldName) => {
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Кастомная валидация
    const errors = validateFeedbackForm(email, message);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Отправка через Formspree
      await sendFeedbackEmail(email, message);
      
      showSingleNotification(`✓ ${t('notifications.feedback_success')}`);
      setEmail('');
      setMessage('');
      setFieldErrors({}); // Очищаем ошибки после успешной отправки
      handleClose();
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      showSingleNotification(`✗ ${t('notifications.feedback_error')}`);
    } finally {
      setLoading(false);
    }
  };

  // Функция отправки email через Formspree
  const sendFeedbackEmail = async (email, message) => {
    const formspreeResponse = await fetch('https://formspree.io/f/mrblwdrb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        message: message,
        _subject: 'Обратная связь с сайта AWL'
      })
    });
    
    if (!formspreeResponse.ok) {
      throw new Error('Ошибка Formspree');
    }
  };

  // Функция показа уведомлений (аналог showSingleNotification из script.js)
  const showSingleNotification = (message, isError = false, duration = 3000) => {
    // Удаляем предыдущие уведомления
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Создаем новое уведомление
    const alert = document.createElement('div');
    alert.className = `custom-alert ${isError ? 'error' : ''}`;
    
    // Поддерживаем HTML-разметку
    alert.innerHTML = message;
    
    document.body.appendChild(alert);
    
    // Автоматическое скрытие с указанной длительностью
    setTimeout(() => {
      alert.remove();
    }, duration);
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal show">
      <div className="feedback-modal-content">
        <button className="feedback-close-btn" onClick={handleClose}>&times;</button>
        <h3>{t('feedback_modal_title')}</h3>
        <form className="feedback-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="user-email">{t('feedback_email_label')}</label>
            <input 
              type="email" 
              id="user-email" 
              name="email" 
              required 
              placeholder={t('feedback_email_placeholder')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              onFocus={() => handleFieldFocus('email')}
              disabled={loading}
              className={fieldErrors.email ? 'error-field' : ''}
            />
            {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="user-message">{t('feedback_message_label')}</label>
            <textarea 
              id="user-message" 
              name="message" 
              required 
              placeholder={t('feedback_message_placeholder')} 
              rows="4"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setFieldErrors(prev => ({ ...prev, message: '' }));
              }}
              onFocus={() => handleFieldFocus('message')}
              disabled={loading}
              className={fieldErrors.message ? 'error-field' : ''}
            ></textarea>
            {fieldErrors.message && <span className="error-message">{fieldErrors.message}</span>}
          </div>
          <button 
            type="submit" 
            className="feedback-submit-btn"
            disabled={loading}
          >
            {loading ? t('sending_button') : t('send_button')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;