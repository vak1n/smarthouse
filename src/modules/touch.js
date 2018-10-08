export default class Touch {
  /**
   * @param {Element} imgNode
   * @param {Element} zoomNode
   * @param {Element} brightnessNode
   */
  constructor(imgNode, zoomNode, brightnessNode) {
    this.state = {};
    this.imgNode = imgNode;
    this.zoomNode = zoomNode;
    this.brightnessNode = brightnessNode;
    this.zoom = 1;
    this.deltaX = 0;
    this.deltaY = 0;
    this.brightness = 100;

    imgNode.onpointerdown = this.downHandler.bind(this);
    imgNode.onpointermove = this.moveHandler.bind(this);
    imgNode.eonpointerup = this.upHandler.bind(this);
    imgNode.onpointercancel = this.upHandler.bind(this);
    imgNode.onpointerout = this.upHandler.bind(this);
    imgNode.onpointerleave = this.upHandler.bind(this);
  }

  /**
   * @param {Event} event
   */
  downHandler(event) {
    this.imgNode.setPointerCapture(event.pointerId);
    this.state[event.pointerId] = [event];
  }

  /**
   * @param {Event} event
   */
  moveHandler(event) {
    const eventPrev = this.state[event.pointerId][this.state[event.pointerId].length - 1];
    const point = {
      x: event.x,
      y: event.y,
    };
    const pointPrev = {
      x: eventPrev.x,
      y: eventPrev.y,
    };
    const deltaX = point.x - pointPrev.x;
    const deltaY = point.y - pointPrev.y;

    switch (Object.keys(this.state).length) {
      case 1:
        this.deltaX += deltaX;
        this.deltaY += deltaY;
        break;
      case 2:
        if (deltaX > 0 && this.zoom <= 100) {
          this.zoom += 1;
        }
        if (deltaX < 0 && this.zoom > 1) {
          this.zoom -= 1;
        }
        break;
      default:
        return;
    }

    this.imgNode.style.transform = `
      scale(${1 + this.zoom / 10}) 
      translateX(${Math.round(this.deltaX / 10)}px) 
      translateY(${Math.round(this.deltaY / 10)}px)`;
    this.zoomNode.textContent = this.zoom - 1;

    this.state[event.pointerId].shift();
    this.state[event.pointerId].push(event);
  }

  /**
   * @param {Event} event
   */
  upHandler(event) {
    delete this.state[event.pointerId];
  }
}
