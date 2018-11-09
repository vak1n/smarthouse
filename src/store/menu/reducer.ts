import { IAction } from 'smarthouse-flux';
import { IReducer } from 'smarthouse-flux';
import { menu } from '../../const/menu';
import IItemMenuData from '../../interfaces/IItemMenuData';
import * as actions from './actions';

const initialState: IItemMenuData[] = menu.links;

export const menuReducer: IReducer<IItemMenuData> = (
  state = initialState,
  action: IAction<IItemMenuData>,
) => {
  switch (action.type) {
    case actions.MENU_SELECT: {
      const selected: IItemMenuData = action.payload as IItemMenuData;
      const newState: IItemMenuData[] = state.map((item) => {
        item.selected = false;
        if (item.name === selected.name) {
          item.selected = true;
        }
        return item;
      });
      return newState;
    }
  }

  state[0].selected = true;
  return state;
};
