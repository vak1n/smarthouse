import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('api/menu.json')
    .then(response => response.json())
    .then(json => {
      const menuListHeaderNode = document.querySelector('.js-menu__list--header');
      const menuListFooterNode = document.querySelector('.js-menu__list--footer');
      json.links.forEach(link => {
        const menuItemHeaderTemplate = window.menuItemHeader.content.cloneNode(true);
        const menuItemFooterTemplate = window.menuItemFooter.content.cloneNode(true);
        menuItemHeaderTemplate.querySelector('.menu__link').textContent = link.name;
        menuItemFooterTemplate.querySelector('.menu__link').textContent = link.name;
        menuItemHeaderTemplate.querySelector('.menu__link').href = link.href;
        menuItemFooterTemplate.querySelector('.menu__link').href = link.href;
        if (link.selected) {
          menuItemHeaderTemplate.querySelector('.menu__link').classList.add('menu__link--selected');
        }
        menuListHeaderNode.appendChild(menuItemHeaderTemplate);
        menuListFooterNode.appendChild(menuItemFooterTemplate);
      });
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
