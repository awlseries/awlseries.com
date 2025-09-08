import { useState } from 'react';
import '/src/styles.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="feedback-modal show">
      <div className="feedback-modal-content">
        <button className="feedback-close-btn" onClick={onClose}>&times;</button>
        <h3>Обратная связь</h3>
        <form className="feedback-form">
          <div class="form-group">
                <label for="user-email" data-translate="feedback_email_label">Ваш Email*</label>
                <input type="email" id="user-email" name="email" required placeholder="Почта, на которую вам придет ответ"
                data-translate-placeholder="feedback_email_placeholder"/>
            </div>
            <div class="form-group">
                <label for="user-message" data-translate="feedback_message_label">Ваше обращение*</label>
                <textarea id="user-message" name="message" required placeholder="Опишите вопрос или предложение..." rows="4"
                data-translate-placeholder="feedback_message_placeholder"></textarea>
            </div>
            <button type="submit" class="feedback-submit-btn" data-translate="send_button">Отправить</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;