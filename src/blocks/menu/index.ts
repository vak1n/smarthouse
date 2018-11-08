import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  const menuBurger = document.querySelector('.menu__burger');
  const menuWrapper = document.querySelector('.menu__wrapper');
  const page = document.querySelector('.page');

  if (menuBurger) {
    menuBurger.addEventListener('click', event => {
      event.stopPropagation();
      if (menuWrapper) {
        menuWrapper.classList.toggle('menu__wrapper--show');
      }
    });
  }

  if (page) {
    page.addEventListener('click', event => {
      event.stopPropagation();
      if (menuWrapper) {
        menuWrapper.classList.remove('menu__wrapper--show');
      }
    });
  }

  if (menuWrapper) {
    menuWrapper.addEventListener('click', event => {
      event.stopPropagation();
    });
  }
});
