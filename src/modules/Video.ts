import Hls from 'hls.js';
import IAudioTool from '../interfaces/IAudioTool';
import IVideo from '../interfaces/IVideo';
import AudioAnalyser from './AudioAnalyser';
import Illumination from './Illumination';

export default class Video implements IVideo {
  public videoContainerNode: HTMLElement;
  protected videoContainerClass: string;
  protected videoNode: HTMLVideoElement | null;
  protected analyserNode: HTMLCanvasElement | null;
  protected canvasNode: HTMLCanvasElement | null;
  protected rollupNode: HTMLElement | null;
  protected brightnessContainerNode: HTMLElement | null;
  protected illuminationValueNode: HTMLElement | null;
  protected contrastContainerNode: HTMLElement | null;
  protected brightnessNode: HTMLInputElement | null;
  protected contrastNode: HTMLInputElement | null;
  protected curtain: HTMLElement | null;

  protected audioAnalyser: IAudioTool | undefined;
  protected illumination: IAudioTool | undefined;

  constructor(videoContainerNode: HTMLElement) {
    this.videoContainerNode = videoContainerNode;
    this.videoContainerClass = videoContainerNode.className;
    this.videoNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__video`);
    this.analyserNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__analyser`);
    this.canvasNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__canvas`);
    this.rollupNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__rollup`);
    this.brightnessContainerNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__range--brightness`,
    );
    this.illuminationValueNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__value--illumination`,
    );
    this.contrastContainerNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__range--contrast`,
    );
    this.brightnessNode = this.brightnessContainerNode
      ? this.brightnessContainerNode.querySelector(`.${this.videoContainerClass}__range-input`)
      : null;
    this.contrastNode = this.contrastContainerNode
      ? this.contrastContainerNode.querySelector(`.${this.videoContainerClass}__range-input`)
      : null;
    this.curtain = document.querySelector('.page__curtain');

    if (this.videoNode && this.analyserNode) {
      this.audioAnalyser = new AudioAnalyser(this.videoNode, this.analyserNode);
    }
    if (this.videoNode && this.canvasNode && this.illuminationValueNode) {
      this.illumination = new Illumination(this.videoNode, this.canvasNode, this.illuminationValueNode);
    }
  }

  public init(url: string): void {
    if (!this.videoNode) {
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(this.videoNode);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (this.videoNode) {
          this.videoNode.play();
        }
      });
    } else if (this.videoNode.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoNode.src = 'https://videos-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      this.videoNode.addEventListener('loadedmetadata', () => {
        if (this.videoNode) {
          this.videoNode.play();
        }
      });
    }

    this.videoContainerNode.addEventListener('click', (ev) => {
      this.fullScreen(ev);
    });
    if (this.rollupNode) {
      this.rollupNode.addEventListener('click', (ev) => {
        this.rollup(ev);
      });
    }
    if (this.brightnessNode) {
      this.brightnessNode.addEventListener('input', (ev) => {
        this.changeQuality();
      });
    }
    if (this.contrastNode) {
      this.contrastNode.addEventListener('input', (ev) => {
        this.changeQuality();
      });
    }

    window.addEventListener('resize', () => {
      if (!this.isFullScreen() || !this.issetFullScreen()) {
        return;
      }
      this.resizeVideo();
    });
  }

  public fullScreen(ev: Event): void {
    ev.stopPropagation();
    if (this.isFullScreen() || this.issetFullScreen()) {
      return;
    }
    document.body.style.overflow = 'hidden';
    this.videoContainerNode.classList.add(`${this.videoContainerClass}--fullscreen`);
    this.resizeVideo();
    if (this.videoNode) {
      this.videoNode.muted = false;
    }
    setTimeout(() => {
      if (this.curtain) {
        this.curtain.style.display = 'block';
        this.curtain.style.opacity = '1';
      }
      this.videoContainerNode.classList.add(`${this.videoContainerClass}--show-control`);
      if (this.audioAnalyser) {
        this.audioAnalyser.on();
      }
      if (this.illumination) {
        this.illumination.on();
      }
    }, 300);
  }

  public resizeVideo(): void {
    if (!document.documentElement || !this.videoNode) {
      return;
    }

    const bounding = this.videoContainerNode.getBoundingClientRect();
    const sX = document.documentElement.clientWidth / this.videoContainerNode.clientWidth;
    const sY = document.documentElement.clientHeight / this.videoContainerNode.clientHeight;
    const s = sX > sY ? sY : sX;
    let tX = (this.videoContainerNode.clientWidth * s - this.videoContainerNode.clientWidth) / 2 - bounding.left;
    if (document.documentElement.clientWidth > tX) {
      tX += (document.documentElement.clientWidth - this.videoContainerNode.clientWidth * s) / 2;
    }
    let tY = (this.videoContainerNode.clientHeight * s - this.videoContainerNode.clientHeight) / 2 - bounding.top;
    if (document.documentElement.clientHeight > tY) {
      tY += (document.documentElement.clientHeight - this.videoContainerNode.clientHeight * s) / 2;
    }
    this.videoNode.style.transform = `
      translate3d(${tX}px, ${tY}px, 0)
      scale3d(${s}, ${s}, 1)`;
  }

  public rollup(ev: Event): void {
    ev.stopPropagation();
    if (!this.isFullScreen()) {
      return;
    }
    if (this.illumination) {
      this.illumination.off();
    }
    if (this.audioAnalyser) {
      this.audioAnalyser.off();
    }
    if (this.videoNode) {
      this.videoNode.muted = true;
      this.videoNode.style.transform = '';
    }
    this.videoContainerNode.classList.remove(`${this.videoContainerClass}--fullscreen`);
    this.videoContainerNode.classList.remove(`${this.videoContainerClass}--show-control`);
    if (this.curtain) {
      this.curtain.style.display = 'none';
      this.curtain.style.opacity = '0';
    }
    document.body.style.overflow = '';
  }

  protected isFullScreen(): boolean {
    return this.videoContainerNode.classList.contains(`${this.videoContainerClass}--fullscreen`);
  }

  protected issetFullScreen(): boolean {
    return document.querySelectorAll(`.${this.videoContainerClass}--fullscreen`).length > 0;
  }

  protected changeQuality(): void {
    if (!this.videoNode) {
      return;
    }
    const brightness: number = this.brightnessNode ? Number(this.brightnessNode.value) : 100;
    const contrast: number = this.contrastNode ? Number(this.contrastNode.value) : 100;
    const filter = `brightness(${brightness / 100}) contrast(${contrast / 100})`;
    this.videoNode.style.filter = filter;
  }
}
