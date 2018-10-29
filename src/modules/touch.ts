import TouchInterface from '../interfaces/touchInterface';

export default class Touch implements TouchInterface {
  public imgNode: HTMLImageElement;
  public zoomNode: HTMLInputElement;
  public brightnessNode: HTMLInputElement;
  protected state: {[key: string]: PointerEvent[]};
  protected zoom: number;
  protected deltaX: number;
  protected deltaY: number;
  protected brightness: number;
  protected segment: number;
  protected angle: number;

  constructor(imgNode: HTMLImageElement, zoomNode: HTMLInputElement, brightnessNode: HTMLInputElement) {
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

  public init(): void {
    this.imgNode.addEventListener('pointerdown', (ev) => {
      this.downHandler(ev);
    });
    this.imgNode.addEventListener('pointermove', (ev) => {
      this.moveHandler(ev);
    });
    this.imgNode.addEventListener('pointerup', (ev) => {
      this.upHandler(ev);
    });
    this.imgNode.addEventListener('pointercancel', (ev) => {
      this.upHandler(ev);
    });
    this.imgNode.addEventListener('pointerout', (ev) => {
      this.upHandler(ev);
    });
    this.imgNode.addEventListener('pointerleave', (ev) => {
      this.upHandler(ev);
    });

    this.zoomNode.addEventListener('input', (ev) => {
      this.zoom = Number(this.zoomNode.value);
      this.setStyle();
      const labelNode = this.zoomNode.previousElementSibling;
      labelNode && (labelNode.textContent = String(this.zoom));
    });

    this.brightnessNode.addEventListener('input', (ev) => {
      this.brightness = Number(this.brightnessNode.value);
      this.setStyle();
      const labelNode = this.zoomNode.previousElementSibling;
      labelNode && (labelNode.textContent = String(this.brightness));
    });
  }

  public downHandler(ev: PointerEvent): void {
    this.imgNode.setPointerCapture(ev.pointerId);
    this.state[ev.pointerId] = [ev];
    if (this.state[ev.pointerId - 1]) {
      this.segment = this.getSegment(ev, this.state[ev.pointerId - 1][0]);
      this.angle = this.getAngle(ev, this.state[ev.pointerId - 1][0]);
    }
  }

  public moveHandler(ev: PointerEvent): void {
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
    this.zoomNode.value = String(this.zoom);
    const zoomLabelNode: HTMLElement | null = this.zoomNode.previousElementSibling as HTMLElement;
    zoomLabelNode && (zoomLabelNode.textContent = String(this.zoom));
    this.brightnessNode.value = String(this.brightness);
    const brightnessLabelNode: HTMLElement | null = this.brightnessNode.previousElementSibling as HTMLElement;
    brightnessLabelNode && (brightnessLabelNode.textContent = String(this.brightness));

    if (this.state[ev.pointerId].length >= 3) {
      this.state[ev.pointerId].pop();
    }
    this.state[ev.pointerId].push(ev);
  }

  public getSegment(ev2: PointerEvent, ev1: PointerEvent): number {
    return Math.sqrt((Math.round(ev2.x) - Math.round(ev1.x)) ** 2 + (Math.round(ev2.y) - Math.round(ev1.y)) ** 2);
  }

  public getAngle(ev2: PointerEvent, ev1: PointerEvent): number {
    return (Math.atan2(Math.round(ev2.y) - Math.round(ev1.y), Math.round(ev2.x) - Math.round(ev1.x)) * 180) / Math.PI;
  }

  protected setStyle(): void {
    const scale = 1 + this.zoom / 10;
    this.imgNode.style.transform = `
      scale(${scale})
      translateX(${Math.round(this.deltaX / scale)}px)
      translateY(${Math.round(this.deltaY / scale)}px)`;
    this.imgNode.style.filter = `brightness(${this.brightness}%)`;
  }

  protected upHandler(ev: PointerEvent): void {
    delete this.state[ev.pointerId];
  }
}
