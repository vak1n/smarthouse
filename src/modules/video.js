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
  }

  init() {
    this.videoContainerNode.addEventListener('click', ev => {
      this.fullScreen(ev);
    });
    this.rollupNode.addEventListener('click', ev => {
      this.rollup(ev);
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
  }

  rollup(ev) {
    ev.stopPropagation();
    if (!this.isfullScreen()) {
      return;
    }
    document.body.style.overflow = 'auto';
    this.videoContainerNode.classList.remove(`${this.videoContainerClass}--fullscreen`);
    this.videoContainerNode.style.width = '';
    this.videoContainerNode.style.height = '';
    this.videoContainerNode.style.transform = '';
    this.videoNode.muted = true;
    this.rollupNode.style.visibility = 'hidden';
  }

  isfullScreen() {
    return this.videoContainerNode.classList.contains(`${this.videoContainerClass}--fullscreen`);
  }
}
