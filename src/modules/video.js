import AudioAnalyser from './audioAnalyser';
import Illumination from './illumination';

export default class Video {
  /**
   * @param {Element} videoContainerNode
   */
  constructor(videoContainerNode) {
    this.self = this;
    this.videoContainerNode = videoContainerNode;
    this.videoContainerClass = videoContainerNode.className;
    this.videoNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__video`);
    this.analyserNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__analyser`);
    this.canvasNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__canvas`);
    this.rollupNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__rollup`);
    this.brightnessContainerNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__range--brightness`,
    );
    this.illuminationValueNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__value--illumination`);
    this.contrastContainerNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__range--contrast`);
    this.brightnessNode = this.brightnessContainerNode.querySelector(`.${this.videoContainerClass}__range-input`);
    this.contrastNode = this.contrastContainerNode.querySelector(`.${this.videoContainerClass}__range-input`);
    this.curtain = document.querySelector('.page__curtain');

    this.audioAnalyser = new AudioAnalyser(this.videoNode, this.analyserNode);
    this.illumination = new Illumination(this.videoNode, this.canvasNode, this.illuminationValueNode);
  }

  init(url) {
    if (window.Hls.isSupported()) {
      const hls = new window.Hls();
      hls.loadSource(url);
      hls.attachMedia(this.videoNode);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.videoNode.play();
      });
    } else if (this.videoNode.canPlayType('application/vnd.apple.mpegurl')) {
      this.videoNode.src = 'https://videos-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      this.videoNode.addEventListener('loadedmetadata', () => {
        this.videoNode.play();
      });
    }

    this.videoContainerNode.addEventListener('click', ev => {
      this.fullScreen(ev);
    });
    this.rollupNode.addEventListener('click', ev => {
      this.rollup(ev);
    });
    this.brightnessNode.addEventListener('input', ev => {
      this.changeQuality(ev);
    });
    this.contrastNode.addEventListener('input', ev => {
      this.changeQuality(ev);
    });

    window.addEventListener('resize', () => {
      if (!this.isFullScreen() || !this.issetFullScreen()) {
        return;
      }
      this.resizeVideo();
    });
  }

  fullScreen(ev) {
    ev.stopPropagation();
    if (this.isFullScreen() || this.issetFullScreen()) {
      return;
    }
    document.body.style.overflow = 'hidden';
    this.videoContainerNode.classList.add(`${this.videoContainerClass}--fullscreen`);
    this.resizeVideo();
    this.videoNode.muted = false;
    setTimeout(() => {
      this.curtain.style.display = 'block';
      this.curtain.style.opacity = 1;
      this.videoContainerNode.classList.add(`${this.videoContainerClass}--show-control`);
      this.audioAnalyser.on();
      this.illumination.on();
    }, 300);
  }

  resizeVideo() {
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

  rollup(ev) {
    ev.stopPropagation();
    if (!this.isFullScreen()) {
      return;
    }
    this.illumination.off();
    this.audioAnalyser.off();
    this.videoNode.muted = true;
    this.videoNode.style.transform = '';
    this.videoContainerNode.classList.remove(`${this.videoContainerClass}--fullscreen`);
    this.videoContainerNode.classList.remove(`${this.videoContainerClass}--show-control`);
    this.curtain.style.display = 'none';
    this.curtain.style.opacity = 0;
    document.body.style.overflow = '';
  }

  isFullScreen() {
    return this.videoContainerNode.classList.contains(`${this.videoContainerClass}--fullscreen`);
  }

  issetFullScreen() {
    return document.querySelectorAll(`.${this.videoContainerClass}--fullscreen`).length > 0;
  }

  changeQuality() {
    const filter = `brightness(${this.brightnessNode.value / 100}) contrast(${this.contrastNode.value / 100})`;
    this.videoNode.style.filter = filter;
  }
}
