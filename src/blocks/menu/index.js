import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/menu.json')
    .then(response => response.json())
    .then(menu => {
      const menuList = document.querySelectorAll('.menu__list');
      for (let i = 0; i < menuList.length; i += 1) {
        menu.links.forEach(link => {
          const itemNode = menuList[i].getElementsByTagName('template')[0].content.cloneNode(true);
          const linkNode = itemNode.querySelector('a');
          linkNode.href = link.href;
          linkNode.textContent = link.name;
          if (link.selected) {
            linkNode.classList.add('menu__link--selected');
          }
          menuList[i].appendChild(itemNode);
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
