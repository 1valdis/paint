import { createCanvas } from './utils'
import { Rectangle } from './interfaces'

export class Canvas {
  private _canvas: HTMLCanvasElement
  get canvas() {
    return this._canvas
  }

  private context: CanvasRenderingContext2D
  constructor(width: number = 800, height: number = 450) {
    const { canvas, context } = createCanvas(width, height)
    context.imageSmoothingEnabled = false
    context.fillStyle = `rgba(255, 255, 255, 255)`
    context.fillRect(0, 0, canvas.width, canvas.height)
    this._canvas = canvas
    this.context = context
  }

  putImageData(imageData: ImageData): void {
    if (
      this._canvas.width !== imageData.width ||
      this._canvas.height !== imageData.height
    ) {
      const { canvas, context } = createCanvas(
        imageData.width,
        imageData.height
      )
      this._canvas = canvas
      this.context = context
    }
    this.context.putImageData(imageData, 0, 0)
  }

  getImageData(coords?: Partial<Rectangle>) {
    return this.context.getImageData(
      coords?.left || 0,
      coords?.top || 0,
      coords?.width || this._canvas.width,
      coords?.height || this._canvas.height
    )
  }
}
