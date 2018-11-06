import IAudioTool from '../interfaces/IAudioTool';

interface IWindow {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}

declare const window: IWindow;

export default class AudioAnalyser implements IAudioTool {
  protected mediaNode: HTMLMediaElement;
  protected analyserNode: HTMLCanvasElement;
  protected data: Uint8Array | [];
  protected active: boolean;

  protected context: AudioContext;
  protected source: MediaElementAudioSourceNode;
  protected analyser: AnalyserNode;

  constructor(mediaNode: HTMLMediaElement, analyserNode: HTMLCanvasElement) {
    this.mediaNode = mediaNode;
    this.analyserNode = analyserNode;

    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createMediaElementSource(this.mediaNode);
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 32;
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.data = [];
    this.active = false;
  }

  public on(): void {
    this.active = true;
    this.draw();
  }

  public off(): void {
    this.active = false;
  }

  protected analyse(): void {
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.data);
  }

  protected draw(): void {
    if (this.active) {
      requestAnimationFrame(this.draw.bind(this));
    }
    this.analyse();
    const analyserContext = this.analyserNode.getContext('2d');
    if (!analyserContext) {
      return;
    }

    analyserContext.fillStyle = 'rgb(0, 0, 0)';
    analyserContext.fillRect(0, 0, this.analyserNode.clientWidth, this.analyserNode.clientHeight);

    const barWidth = this.analyserNode.clientWidth / this.analyser.frequencyBinCount;
    let barHeight;
    let x = 0;
    analyserContext.fillStyle = 'rgb(255, 255, 255)';
    for (let i = 0; i < this.analyser.frequencyBinCount; i += 1) {
      barHeight = (this.data[i] / this.analyserNode.clientHeight) * 25;
      barHeight = barHeight > this.analyserNode.clientHeight ? this.analyserNode.clientHeight : barHeight;
      analyserContext.fillRect(x, 0, barWidth, barHeight);
      x += barWidth;
    }
  }
}
