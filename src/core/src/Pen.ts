import { Point } from './interfaces/Point'
import { Color } from './interfaces/Color'
import { Canvas } from './Canvas'
import { createCanvas } from './utils'

export class Pen {
  private previousPoint: Point
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  constructor(private appCanvas: Canvas, start: Point, private color: Color) {
    const { canvas, context } = createCanvas(
      appCanvas.canvas.width,
      appCanvas.canvas.height
    )
    this.canvas = canvas
    this.context = context
    context.drawImage(appCanvas.canvas, 0, 0)
    this.drawPoint(start)

    this.previousPoint = start
  }

  // based on Bresenham line algorithm
  continueLine(target: Point) {
    const dx = Math.abs(target.x - this.previousPoint.x)
    const dy = Math.abs(target.y - this.previousPoint.y)
    const sx = this.previousPoint.x < target.x ? 1 : -1
    const sy = this.previousPoint.y < target.y ? 1 : -1
    let err = dx - dy

    const current = { ...this.previousPoint }

    while (true) {
      this.drawPoint(current)

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

  private drawPoint(point: Point) {
    this.context.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},255)`
    this.context.fillRect(point.x, point.y, 1, 1)
  }

  finishLine() {
    const imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    this.appCanvas.putImageData(imageData)
  }
}
