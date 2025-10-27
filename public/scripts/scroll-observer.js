document.addEventListener('DOMContentLoaded', () => {
  // Элементы
  const headerBottom = document.querySelector('.header__bottom');
  const headerTop = document.querySelector('.header__top');
  const footer = document.querySelector('.footer');

  // Установка CSS-переменных с высотами
  function updateHeights() {
    const headerHeight = headerTop.offsetTop == 0 ? headerTop.offsetHeight + headerBottom.offsetHeight : headerBottom.offsetHeight; 
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--footer-height', `${footer.offsetHeight}px`);
  }

  // Управление состоянием прокрутки
  function updateScrollState() {
    const isScrolled = window.scrollY > headerTop.offsetHeight;
    const isNotScrolled = !isScrolled;
    document.body.classList.toggle('is-scrolled', isScrolled);
    document.body.classList.toggle('is-not-scrolled', isNotScrolled);
  }

  // Обработчики событий
  function onScroll() {
    updateScrollState();
    updateHeights();
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