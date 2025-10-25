document.addEventListener('DOMContentLoaded', () => {
  // Элементы
  const header = document.querySelector('.header__bottom');
  const footer = document.querySelector('.footer');

  // Установка CSS-переменных с высотами
  function updateHeights() {
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }
    if (footer) {
      document.documentElement.style.setProperty('--footer-height', `${footer.offsetHeight}px`);
    }
  }

  // Управление состоянием прокрутки
  function updateScrollState() {
    const isScrolled = window.scrollY > 0;
    document.body.classList.toggle('is-scrolled', isScrolled);
  }

  // Обработчики событий
  function onScroll() {
    updateScrollState();
  }

  function onResize() {
    updateHeights();
    updateScrollState();
  }

  // Инициализация
  updateHeights();
  updateScrollState();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
});