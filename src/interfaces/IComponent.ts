export default interface IComponent<T> {
  render(data: T): void;
}