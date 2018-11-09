import { IAction } from 'smarthouse-flux';
import IItemMenuData from '../../interfaces/IItemMenuData';

export const MENU_SELECT = '[MENU] SELECT';

export class MenuActions {
  public static select(data: IItemMenuData): IAction<IItemMenuData> {
    return {
      payload: data,
      type: MENU_SELECT
    }
  }
}
