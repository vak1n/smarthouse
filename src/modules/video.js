export default class Video {
  /**
   * @param {Element} videoContainerNode
   */
  constructor(videoContainerNode) {
    this.self = this;
    this.videoContainerNode = videoContainerNode;
    this.videoContainerClass = videoContainerNode.className;
    this.videoNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__video`);
    this.rollupNode = this.videoContainerNode.querySelector(`.${this.videoContainerClass}__rollup`);
    this.brightnessContainerNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__range--brightness`,
    );
    this.contrastContainerNode = this.videoContainerNode.querySelector(
      `.${this.videoContainerClass}__range--contrast`,
    );
    this.brightnessNode = this.brightnessContainerNode.querySelector(
      `.${this.videoContainerClass}__range-input`,
    );
    this.contrastNode = this.contrastContainerNode.querySelector(
      `.${this.videoContainerClass}__range-input`,
    );
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
    if (this.isfullScreen()) {
      return;
    }
    document.body.style.overflow = 'hidden';
    this.videoContainerNode.classList.add(`${this.videoContainerClass}--fullscreen`);
    this.videoContainerNode.style.width = `${document.documentElement.clientWidth}px`;
    this.videoContainerNode.style.height = `${document.documentElement.clientHeight}px`;
    const bounding = this.videoContainerNode.getBoundingClientRect();
    this.videoContainerNode.style.transform = `
          translateX(-${bounding.left}px)
          translateY(-${bounding.top}px)`;
    this.videoNode.muted = false;
    this.rollupNode.style.visibility = 'visible';
    this.brightnessContainerNode.style.visibility = 'visible';
    this.contrastContainerNode.style.visibility = 'visible';
  }

  rollup(ev) {
    ev.stopPropagation();
    if (!this.isfullScreen()) {
      return;
    }
    document.body.style.overflow = '';
    this.videoContainerNode.classList.remove(`${this.videoContainerClass}--fullscreen`);
    this.videoContainerNode.style.width = '';
    this.videoContainerNode.style.height = '';
    this.videoContainerNode.style.transform = '';
    this.videoNode.muted = true;
    this.rollupNode.style.visibility = '';
    this.brightnessContainerNode.style.visibility = '';
    this.contrastContainerNode.style.visibility = '';
  }

  isfullScreen() {
    return this.videoContainerNode.classList.contains(`${this.videoContainerClass}--fullscreen`);
  }

  changeQuality(ev) {
    const filter = `brightness(${this.brightnessNode.value / 100}) contrast(${this.contrastNode.value / 100})`;
    this.videoNode.style.filter = filter;
  }
}
