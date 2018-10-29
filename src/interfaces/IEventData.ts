export default interface IEventData {
  type: string;
  title: string;
  source: string;
  time: string;
  description: string | null;
  icon: string;
  data?: {
    type?: string,
    values?: object[],

    temperature?: number,
    humidity?: number,

    albumcover?: string,
    artist?: string,
    track?: {
      name: string,
      length: string,
    },
    volume?: number,

    buttons?: string[],

    image?: string,
  };
  size: string;
}
