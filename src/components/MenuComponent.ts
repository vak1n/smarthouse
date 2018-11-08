import DomHeleper from '../helpers/DomHelper';
import IItemMenuData from '../interfaces/IItemMenuData';

export default class MenuComponent {
  public render(links: IItemMenuData[]) {
    const menuListHeaderNode: HTMLElement | null = document.querySelector('.js-menu__list--header');
    if (menuListHeaderNode) {
      menuListHeaderNode.innerHTML = '';
    }
    const menuListFooterNode: HTMLElement | null = document.querySelector('.js-menu__list--footer');
    if (menuListFooterNode) {
      menuListFooterNode.innerHTML = '';
    }
    links.forEach((link: IItemMenuData) => {
      const menuItemHeader: HTMLTemplateElement | null = document.querySelector('#menuItemHeader');
      const menuItemFooter: HTMLTemplateElement | null = document.querySelector('#menuItemFooter');
      const menuItemHeaderTemplate: DocumentFragment | null = menuItemHeader ? DomHeleper.cloneNode(menuItemHeader.content) : null;
      const menuItemFooterTemplate: DocumentFragment | null = menuItemFooter ? DomHeleper.cloneNode(menuItemFooter.content) : null;

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
  }
}
