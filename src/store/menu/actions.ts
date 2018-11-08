import {IAction} from 'smarthouse-flux'

export const MENU_SELECT = '[MENU] Click';

export class MenuTransition implements IAction {
  public readonly type = MENU_SELECT;
  constructor(public payload: object) {}
}
