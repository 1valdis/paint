import { createCanvas } from './utils';
import { throws } from 'assert';

export class Canvas {
  private _canvas: HTMLCanvasElement;
  get canvas() {
    return this._canvas;
  }
  private context: CanvasRenderingContext2D;
  constructor(width: number = 800, height: number = 450) {
    const { canvas, context } = createCanvas(width, height);
    context.imageSmoothingEnabled = false;
    this._canvas = canvas;
    this.context = context;
  }

  putImageData(imageData: ImageData): void {
    console.log('attempt to put imagedata', JSON.stringify(imageData));
    if (
      this._canvas.width !== imageData.width ||
      this._canvas.height !== imageData.height
    ) {
      const { canvas, context } = createCanvas(
        imageData.width,
        imageData.height
      );
      this._canvas = canvas;
      this.context = context;
    }
    this.context.putImageData(imageData, 0, 0);
    console.log(
      'after putting',
      JSON.stringify(
        this.context.getImageData(0, 0, imageData.width, imageData.height)
      )
    );
  }

  getImageData() {
    return this.context.getImageData(
      0,
      0,
      this._canvas.width,
      this._canvas.height
    );
  }
}
