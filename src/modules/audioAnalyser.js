export default class AudioAnalyser {
  /**
   * @param {Element} mediaNode
   * @param {Element} analyserNode
   */
  constructor(mediaNode, analyserNode) {
    this.mediaNode = mediaNode;
    this.analyserNode = analyserNode;
    this.connect();
    this.data = [];
    this.active = false;
  }

  connect() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createMediaElementSource(this.mediaNode);
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 32;
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  analyse() {
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(this.data);
  }

  on() {
    this.active = true;
    this.draw();
  }

  draw() {
    if (this.active) {
      requestAnimationFrame(this.draw.bind(this));
    }
    this.analyse();
    const analyserContext = this.analyserNode.getContext('2d');

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

  off() {
    this.active = false;
  }
}
