document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('header__burger--active');
    nav.classList.toggle('header__nav--open');
  });
});
