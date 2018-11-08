import DomHeleper from '../helpers/DomHelper';
import IComponent from '../interfaces/IComponent';
import IItemMenuData from '../interfaces/IItemMenuData';

export default class MenuComponent implements IComponent<IItemMenuData[]> {
  protected menuListNode: HTMLElement;
  protected menuItemNode: HTMLTemplateElement;

  constructor(menuListNode: HTMLElement, menuItemNode: HTMLTemplateElement) {
    this.menuListNode = menuListNode;
    this.menuItemNode = menuItemNode;
  }

  public render(links: IItemMenuData[]) {
    this.menuListNode.innerHTML = '';

    links.forEach((link: IItemMenuData) => {
      const menuItemHeaderTemplate: DocumentFragment = DomHeleper.cloneNode(this.menuItemNode.content);

      const menuLinkNode: HTMLLinkElement | null = menuItemHeaderTemplate.querySelector('.menu__link');
      if (menuLinkNode) {
        menuLinkNode.textContent = link.name;
        menuLinkNode.href = link.href;
        if (link.selected) {
          menuLinkNode.classList.add('menu__link--selected');
        }
      }

      this.menuListNode.appendChild(menuItemHeaderTemplate);
    });
  }
}
