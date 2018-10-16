import AudioAnalyser from './audioAnalyser';

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
    this.rollupNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__rollup`);
    this.brightnessContainerNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__range--brightness`,
    );
    this.contrastContainerNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__range--contrast`);
    this.brightnessNode = this.brightnessContainerNode.querySelector(`.${this.videoContainerClass}__range-input`);
    this.contrastNode = this.contrastContainerNode.querySelector(`.${this.videoContainerClass}__range-input`);
    this.curtain = document.querySelector('.page__curtain');

    this.audioAnalyser = new AudioAnalyser(this.videoNode, this.analyserNode);
  }

  init() {
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
  }

  fullScreen(ev) {
    ev.stopPropagation();
    if (this.isFullScreen() || this.issetFullScreen()) {
      return;
    }
    document.body.style.overflow = 'hidden';
    this.videoContainerNode.classList.add(`${this.videoContainerClass}--fullscreen`);
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
      translateX(${tX}px)
      translateY(${tY}px)
      scale(${s})`;
    this.videoNode.muted = false;
    setTimeout(() => {
      this.curtain.style.display = 'block';
      this.curtain.style.opacity = 1;
      this.videoContainerNode.classList.add(`${this.videoContainerClass}--show-control`);
      this.audioAnalyser.on();
    }, 300);
  }

  rollup(ev) {
    ev.stopPropagation();
    if (!this.isFullScreen()) {
      return;
    }
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

  changeQuality(ev) {
    const filter = `brightness(${this.brightnessNode.value / 100}) contrast(${this.contrastNode.value / 100})`;
    this.videoNode.style.filter = filter;
  }
}
