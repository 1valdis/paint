import { Point, Color } from './interfaces'
import { createCanvas } from './utils'

export class Pen {
  private previousPoint: Point | null = null
  public readonly canvas: HTMLCanvasElement
  private _context: CanvasRenderingContext2D
  public get context() {
    return this._context
  }

  constructor(private imageData: ImageData) {
    const { canvas, context } = createCanvas(imageData.width, imageData.height)
    this.canvas = canvas
    this._context = context
    context.putImageData(imageData, 0, 0)
  }

  // based on Bresenham line algorithm
  continueLine(target: Point, color: Color) {
    if (!this.previousPoint) {
      this.drawPoint(target, color)
      this.previousPoint = target
      return
    }

    const dx = Math.abs(target.x - this.previousPoint.x)
    const dy = Math.abs(target.y - this.previousPoint.y)
    const sx = this.previousPoint.x < target.x ? 1 : -1
    const sy = this.previousPoint.y < target.y ? 1 : -1
    let err = dx - dy

    const current = { ...this.previousPoint }

    while (true) {
      this.drawPoint(current, color)

      if (current.x === target.x && current.y === target.y) break
      var e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        current.x += sx
      }
      if (e2 < dx) {
        err += dx
        current.y += sy
      }
    }

    this.previousPoint = target
  }

  private drawPoint(point: Point, color: Color) {
    this.context.fillStyle = `rgba(${color.r},${color.g},${color.b},255)`
    this.context.fillRect(point.x, point.y, 1, 1)
  }

  finishLine() {
    this.previousPoint = null
  }
}
