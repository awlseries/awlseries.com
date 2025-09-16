// utils/notifications.js
export function showSingleNotification(message, isError = false, duration = 3000) {
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
}