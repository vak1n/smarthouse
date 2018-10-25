export default class Illumination {
  constructor(mediaNode, canvasNode, illuminationValueNode) {
    this.mediaNode = mediaNode;
    this.canvasCtx = canvasNode.getContext('2d');
    this.illuminationValueNode = illuminationValueNode;
    this.active = false;
    this.frameStep = 10;
    this.frame = 0;
  }

  get data() {
    this.width = this.mediaNode.clientWidth / 2;
    this.height = this.mediaNode.clientHeight / 2;
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    this.canvasCtx.drawImage(this.mediaNode, 0, 0, this.width, this.height);
    return this.canvasCtx.getImageData(0, 0, this.width, this.height).data;
  }

  get middleRgb() {
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

  on() {
    this.active = true;
    this.setIllumination();
  }

  off() {
    this.active = false;
  }

  setIllumination() {
    this.frame += 1;
    if (this.active) {
      requestAnimationFrame(this.setIllumination.bind(this));
    }
    if (this.frame % this.frameStep !== 0) {
      return;
    }
    const sumRgb = Object.values(this.middleRgb).reduce((sum, value) => sum + value, 0);
    this.illuminationValueNode.innerText = Math.round((sumRgb / 765) * 100);
    this.frame = 0;
  }
}
