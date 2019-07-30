import { fabric } from "fabric";
export class PaintingCanvas {
  readonly canvas = new fabric.Canvas(this.id);
  readonly yStart = 20;
  public height = this.canvas.getHeight();
  readonly width = this.canvas.getWidth();
  constructor(private id) {}
  add(...ev) {
    this.canvas.add(...ev);
  }
  deactivateAll() {
    return this.canvas.discardActiveObject();
  }
}
