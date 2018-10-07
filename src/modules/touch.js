export default class Touch {
  /**
   * @param {Element} imgNode
   * @param {Element} zoomNode
   * @param {Element} brightnessNode
   */
  constructor(imgNode, zoomNode, brightnessNode) {
    this.state = [];
    this.diff = -1;
    this.imgNode = imgNode;
    this.zoomNode = zoomNode;
    this.zoom = 1;
    this.deltaX = 0;
    this.deltaY = 0;
    this.brightness = 100;
    this.prevEvent = undefined;
    this.prevAngle = undefined;

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
    this.state.push(event);
    this.prevEvent = event;
  }

  /**
   * @param {Event} event
   */
  moveHandler(event) {
    for (let i = 0; i < this.state.length; i += 1) {
      if (event.pointerId === this.state[i].pointerId) {
        this.state[i] = event;
        break;
      }
    }

    if (this.state.length === 1) {
      const thresholdDistance = 10;
      const deltaX = event.x - this.prevEvent.x;
      const deltaY = event.y - this.prevEvent.y;
      if (deltaX > thresholdDistance && Math.abs(deltaY) < thresholdDistance) {
        this.deltaX += deltaX;
      } else if (-deltaX > thresholdDistance && Math.abs(deltaY) < thresholdDistance) {
        this.deltaX += deltaX;
      } else if (deltaY > thresholdDistance && Math.abs(deltaX) < thresholdDistance) {
        this.deltaY += deltaY;
      } else if (-deltaY > thresholdDistance && Math.abs(deltaX) < thresholdDistance) {
        this.deltaY += deltaY;
      }
    }

    if (this.state.length === 2) {
      const diff = Math.abs(this.state[0].clientX - this.state[1].clientX);

      if (this.diff > 0) {
        if (diff > this.diff && this.zoom <= 100) {
          this.zoom += 1;
        }
        if (diff < this.diff && this.zoom > 1) {
          this.zoom -= 1;
        }
      }
      this.diff = diff;
    }

    this.imgNode.style.transform = `
      scale(${1 + this.zoom / 10}) 
      translateX(${Math.round(this.deltaX / 10)}px) 
      translateY(${Math.round(this.deltaY / 10)}px)`;
    this.zoomNode.textContent = this.zoom - 1;
  }

  /**
   * @param {Event} event
   */
  upHandler(event) {
    this.remove(event);
    if (this.state.length < 2) {
      this.diff = -1;
    }
  }

  /**
   * @param {Event} event
   */
  remove(event) {
    for (let i = 0; i < this.state.length; i += 1) {
      if (this.state[i].pointerId === event.pointerId) {
        this.state.splice(i, 1);
        break;
      }
    }
  }
}
