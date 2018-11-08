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
const menuComponent = new MenuComponent();

store.subscribe(()=> {
  const links: IItemMenuData[] = store.value.menu as IItemMenuData[];
  menuComponent.render(links);
});

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
