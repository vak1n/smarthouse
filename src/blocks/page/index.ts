import { Store } from 'smarthouse-flux';
import MenuComponent from '../../components/MenuComponent';
import IItemMenuData from '../../interfaces/IItemMenuData';
import { MenuTransition } from '../../store/menu/actions';
import { menuReducer } from '../../store/menu/reducer';
import './style.scss';

const reducers = {
  menu: menuReducer,
};
const store = new Store(reducers);

const menuListHeaderNode: HTMLElement | null = document.querySelector('.js-menu__list--header');
const menuItemHeaderNode: HTMLTemplateElement | null = document.querySelector('#menuItemHeader');
if (menuListHeaderNode && menuItemHeaderNode) {
  const menuComponentHeader = new MenuComponent(menuListHeaderNode, menuItemHeaderNode);

  store.subscribe(()=> {
    const links: IItemMenuData[] = store.value.menu as IItemMenuData[];
    menuComponentHeader.render(links);
  });
}

const menuListFooterNode: HTMLElement | null = document.querySelector('.js-menu__list--footer');
const menuItemFooterNode: HTMLTemplateElement | null = document.querySelector('#menuItemFooter');
if (menuListFooterNode && menuItemFooterNode) {
  const menuComponentFooter = new MenuComponent(menuListFooterNode, menuItemFooterNode);

  store.subscribe(()=> {
    const links: IItemMenuData[] = store.value.menu as IItemMenuData[];
    menuComponentFooter.render(links);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const menuListNode = document.querySelector<HTMLElement>('.menu__list');
  if (menuListNode) {
    menuListNode.addEventListener('click', (event: Event) => {
      event.stopPropagation();
      const target = event.target as HTMLLinkElement;
      if (target && target.href) {
        store.dispatch(new MenuTransition({href: target.href, name: target.innerText}));
      }
    });
  }
});
