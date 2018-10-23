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
    this.zoom = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.brightness = 100;
    this.segment = 0;
    this.angle = 0;
  }

  init() {
    this.imgNode.addEventListener('pointerdown', ev => {
      this.downHandler(ev);
    });
    this.imgNode.addEventListener('pointermove', ev => {
      this.moveHandler(ev);
    });
    this.imgNode.addEventListener('pointerup', ev => {
      this.upHandler(ev);
    });
    this.imgNode.addEventListener('pointercancel', ev => {
      this.upHandler(ev);
    });
    this.imgNode.addEventListener('pointerout', ev => {
      this.upHandler(ev);
    });
    this.imgNode.addEventListener('pointerleave', ev => {
      this.upHandler(ev);
    });

    this.zoomNode.addEventListener('input', ev => {
      this.zoom = this.zoomNode.value;
      this.setStyle();
      this.zoomNode.previousElementSibling.textContent = this.zoom;
    });

    this.brightnessNode.addEventListener('input', ev => {
      this.brightness = this.brightnessNode.value;
      this.setStyle();
      this.brightnessNode.previousElementSibling.textContent = this.brightness;
    });
  }

  /**
   * @param {Event} ev
   */
  downHandler(ev) {
    this.imgNode.setPointerCapture(ev.pointerId);
    this.state[ev.pointerId] = [ev];
    if (this.state[ev.pointerId - 1]) {
      this.segment = this.getSegment(ev, this.state[ev.pointerId - 1][0]);
      this.angle = this.getAngle(ev, this.state[ev.pointerId - 1][0]);
    }
  }

  /**
   * @param {Event} ev
   */
  moveHandler(ev) {
    switch (Object.keys(this.state).length) {
      case 1:
        // swipe
        this.deltaX += ev.x - this.state[ev.pointerId][this.state[ev.pointerId].length - 1].x;
        this.deltaY += ev.y - this.state[ev.pointerId][this.state[ev.pointerId].length - 1].y;
        const scale = 1 + this.zoom / 10;
        const maxDeltaX = (this.imgNode.clientWidth * scale - this.imgNode.clientWidth) / 2;
        const maxDeltaY = (this.imgNode.clientHeight * scale - this.imgNode.clientHeight) / 2;
        if (this.deltaX > maxDeltaX) {
          this.deltaX = maxDeltaX;
        }
        if (this.deltaY > maxDeltaY) {
          this.deltaY = maxDeltaY;
        }
        if (this.deltaX < maxDeltaX * -1) {
          this.deltaX = maxDeltaX * -1;
        }
        if (this.deltaY < maxDeltaY * -1) {
          this.deltaY = maxDeltaY * -1;
        }
        break;
      case 2:
        if (this.state[ev.pointerId + 1]) {
          break;
        }
        const segment = this.getSegment(ev, this.state[ev.pointerId - 1][0]);
        const angle = this.getAngle(ev, this.state[ev.pointerId - 1][0]);

        if (Math.abs(angle - this.angle) > 1 || Math.abs(angle - this.angle) < -1) {
          // rotate
          if (angle > this.angle && this.brightness < 200) {
            this.brightness += 1;
          } else if (angle < this.angle && this.brightness > 0) {
            this.brightness -= 1;
          }
        } else if (Math.abs(segment - this.segment) > 1 || Math.abs(segment - this.segment) < -1) {
          // zoom
          if (segment > this.segment && this.zoom < 100) {
            this.zoom += 1;
          } else if (segment < this.segment && this.zoom > 0) {
            this.zoom -= 1;
          }
        }

        this.angle = angle;
        this.segment = segment;
        break;
      default:
        return;
    }

    this.setStyle();
    this.zoomNode.value = this.zoom;
    this.zoomNode.previousElementSibling.textContent = this.zoom;
    this.brightnessNode.value = this.brightness;
    this.brightnessNode.previousElementSibling.textContent = this.brightness;

    if (this.state[ev.pointerId].length >= 3) {
      this.state[ev.pointerId].pop();
    }
    this.state[ev.pointerId].push(ev);
  }

  setStyle() {
    const scale = 1 + this.zoom / 10;
    this.imgNode.style.transform = `
      scale(${scale}) 
      translateX(${Math.round(this.deltaX / scale)}px) 
      translateY(${Math.round(this.deltaY / scale)}px)`;
    this.imgNode.style.filter = `brightness(${this.brightness}%)`;
  }

  /**
   * @param {Event} ev
   */
  upHandler(ev) {
    delete this.state[ev.pointerId];
  }

  getSegment(ev2, ev1) {
    return Math.sqrt((Math.round(ev2.x) - Math.round(ev1.x)) ** 2 + (Math.round(ev2.y) - Math.round(ev1.y)) ** 2);
  }

  getAngle(ev2, ev1) {
    return (Math.atan2(Math.round(ev2.y) - Math.round(ev1.y), Math.round(ev2.x) - Math.round(ev1.x)) * 180) / Math.PI;
  }
}
