import IItemMenuData from '../../interfaces/IItemMenuData';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
  fetch('api/menu.json')
    .then(response => response.json())
    .then(json => {
      const menuListHeaderNode: HTMLElement | null = document.querySelector('.js-menu__list--header');
      const menuListFooterNode: HTMLElement | null = document.querySelector('.js-menu__list--footer');
      json.links.forEach((link: IItemMenuData) => {
        const menuItemHeader: HTMLTemplateElement | null = document.querySelector('#menuItemHeader');
        const menuItemFooter: HTMLTemplateElement | null = document.querySelector('#menuItemFooter');
        const menuItemHeaderTemplate: DocumentFragment | null = menuItemHeader ? menuItemHeader.content.cloneNode(true) as DocumentFragment : null;
        const menuItemFooterTemplate: DocumentFragment | null = menuItemFooter ? menuItemFooter.content.cloneNode(true) as DocumentFragment : null;

        if (menuItemHeaderTemplate) {
          const menuLinkNode: HTMLLinkElement | null = menuItemHeaderTemplate.querySelector('.menu__link');
          if (menuLinkNode) {
            menuLinkNode.textContent = link.name;
            menuLinkNode.href = link.href;
            if (link.selected) {
              menuLinkNode.classList.add('menu__link--selected');
            }
          }

          if (menuListHeaderNode) {
            menuListHeaderNode.appendChild(menuItemHeaderTemplate);
          }
        }

        if (menuItemFooterTemplate) {
          const menuLinkNode: HTMLLinkElement | null = menuItemFooterTemplate.querySelector('.menu__link');

          if (menuLinkNode) {
            menuLinkNode.textContent = link.name;
            menuLinkNode.href = link.href;
          }

          if (menuListFooterNode) {
            menuListFooterNode.appendChild(menuItemFooterTemplate);
          }
        }

      });
    });

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
