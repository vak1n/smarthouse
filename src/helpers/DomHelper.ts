export default class DomHelper {
  public static cloneNode<T extends Node>(node: T) {
    return node.cloneNode(true) as T;
  }
}