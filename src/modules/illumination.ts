import IAudioTool from '../interfaces/IAudioTool';

export default class Illumination implements IAudioTool {
  protected mediaNode: HTMLVideoElement;
  protected canvasCtx: CanvasRenderingContext2D | null;
  protected illuminationValueNode: HTMLElement;
  protected active: boolean;
  protected frameStep: number;
  protected frame: number;
  protected width: number;
  protected height: number;

  constructor(mediaNode: HTMLVideoElement, canvasNode: HTMLCanvasElement, illuminationValueNode: HTMLElement) {
    this.mediaNode = mediaNode;
    this.canvasCtx = canvasNode.getContext('2d');
    this.illuminationValueNode = illuminationValueNode;
    this.active = false;
    this.frameStep = 10;
    this.frame = 0;
    this.width = this.mediaNode.clientWidth / 2;
    this.height = this.mediaNode.clientHeight / 2;
  }

  protected get data(): Uint8ClampedArray | []  {
    if (this.canvasCtx) {
      this.canvasCtx.clearRect(0, 0, this.width, this.height);
      this.canvasCtx.drawImage(this.mediaNode, 0, 0, this.width, this.height);
      return this.canvasCtx.getImageData(0, 0, this.width, this.height).data;
    }
    return [];
  }

  protected get middleRgb(): {r: number, g: number, b: number} {
    const data = this.data;
    const rgb = { r: 0, g: 0, b: 0 };
    let i = -4;
    const step = 5;
    let count = 0;

    while ((i += step * 4) < data.length) {
      ++count;
      rgb.r += data[i];
      rgb.g += data[i + 1];
      rgb.b += data[i + 2];
    }
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }

  public on(): void {
    this.active = true;
    this.setIllumination();
  }

  public off(): void {
    this.active = false;
  }

  protected setIllumination(): void {
    this.frame += 1;
    if (this.active) {
      requestAnimationFrame(this.setIllumination.bind(this));
    }
    if (this.frame % this.frameStep !== 0) {
      return;
    }
    const sumRgb = Object.values(this.middleRgb).reduce((sum: number, value: number) => sum + value, 0);
    this.illuminationValueNode.innerText = String(Math.round((sumRgb / 765) * 100));
    this.frame = 0;
  }
}
