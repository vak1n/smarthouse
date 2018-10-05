import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/menu.json')
    .then(response => response.json())
    .then(menu => {
      const menuList = document.querySelectorAll('.menu__list');
      const menuItem = document.getElementById('menu__item');
      for (let i = 0; i < menuList.length; i += 1) {
        menu.links.forEach(link => {
          const itemNode = menuItem.content.cloneNode(true);
          const linkNode = itemNode.querySelector('.menu__link');
          linkNode.href = link.href;
          linkNode.textContent = link.name;
          if (link.active) {
            linkNode.classList.add('menu__link--active');
          }
          menuList[0].appendChild(itemNode);
        });
      }
    });

  document.querySelector('.menu__burger').addEventListener('click', event => {
    event.stopPropagation();
    document.querySelector('.menu__wrapper').classList.toggle('menu__wrapper--show');
  });

  document.querySelector('.page').addEventListener('click', event => {
    event.stopPropagation();
    document.querySelector('.menu__wrapper').classList.remove('menu__wrapper--show');
  });

  document.querySelector('.menu__wrapper').addEventListener('click', event => {
    event.stopPropagation();
  });
});
