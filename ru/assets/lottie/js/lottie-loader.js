// Улучшенный lottie-loader.js
document.addEventListener('DOMContentLoaded', function() {
  const lottieContainers = document.querySelectorAll('[data-lottie]');

  lottieContainers.forEach(container => {
    const jsonPath = container.dataset.lottie;
    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: container.dataset.loop !== 'false',
      autoplay: container.dataset.autoplay !== 'false',
      path: '../ru/assets/lottie/gear-icon.json'
    });

    // Обработчики событий
    animation.addEventListener('DOMLoaded', () => {
      console.log('Анимация загружена');
      // Изменение цвета
      if(container.dataset.color) {
        container.querySelectorAll('path').forEach(path => {
          path.style.fill = container.dataset.color;
        });
      }
    });

    animation.addEventListener('error', (err) => {
      console.error('Ошибка загрузки:', err);
      container.innerHTML = '<p>Анимация не загружена</p>';
    });
  });
});