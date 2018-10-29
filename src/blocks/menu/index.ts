import './style.scss';
import ItemMenuDataInterface from '../../interfaces/itemMenuDataInterface';

document.addEventListener('DOMContentLoaded', () => {
  fetch('api/menu.json')
    .then(response => response.json())
    .then(json => {
      const menuListHeaderNode: HTMLElement | null = document.querySelector('.js-menu__list--header');
      const menuListFooterNode: HTMLElement | null = document.querySelector('.js-menu__list--footer');
      json.links.forEach((link: ItemMenuDataInterface) => {
        const menuItemHeader: HTMLTemplateElement | null = document.querySelector('#menuItemHeader');
        const menuItemFooter: HTMLTemplateElement | null = document.querySelector('#menuItemFooter');
        const menuItemHeaderTemplate: HTMLElement | null = menuItemHeader ? <HTMLElement> menuItemHeader.content.cloneNode(true) : null;
        const menuItemFooterTemplate: HTMLElement | null = menuItemFooter ? <HTMLElement> menuItemFooter.content.cloneNode(true) : null;

        if (menuItemHeaderTemplate) {
          const menuLinkNode: HTMLLinkElement = <HTMLLinkElement> menuItemHeaderTemplate.querySelector('.menu__link');
          if (menuLinkNode) {
            menuLinkNode.textContent = link.name;
            menuLinkNode.href = link.href;
            if (link.selected) {
              menuLinkNode.classList.add('menu__link--selected');
            }
          }

          menuListHeaderNode && menuListHeaderNode.appendChild(menuItemHeaderTemplate);
        }

        if (menuItemFooterTemplate) {
          const menuLinkNode: HTMLLinkElement = <HTMLLinkElement> menuItemFooterTemplate.querySelector('.menu__link');

          if (menuLinkNode) {
            menuLinkNode.textContent = link.name;
            menuLinkNode.href = link.href;
          }

          menuListFooterNode && menuListFooterNode.appendChild(menuItemFooterTemplate);
        }

      });
    });

  const menuBurger = document.querySelector('.menu__burger');
  const menuWrapper = document.querySelector('.menu__wrapper');
  const page = document.querySelector('.page');

  menuBurger && menuBurger.addEventListener('click', event => {
    event.stopPropagation();
    menuWrapper && menuWrapper.classList.toggle('menu__wrapper--show');
  });

  page && page.addEventListener('click', event => {
    event.stopPropagation();
    menuWrapper && menuWrapper.classList.remove('menu__wrapper--show');
  });

  menuWrapper && menuWrapper.addEventListener('click', event => {
    event.stopPropagation();
  });
});
