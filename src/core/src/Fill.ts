import { Canvas } from './Canvas'
import { Point } from './interfaces/Point'
import { Color } from './interfaces/Color'
import { createCanvas } from './utils'

export class Fill {
  static fill(canvas: Canvas, { x, y }: Point, color: Color) {
    if (
      x < 0 ||
      y < 0 ||
      x >= canvas.canvas.width ||
      y >= canvas.canvas.height
    ) {
      return
    }
    const { canvas: canvasToBeFilled, context } = createCanvas(
      canvas.canvas.width,
      canvas.canvas.height
    )
    context.drawImage(canvas.canvas, 0, 0)
    const imageData = context.getImageData(
      0,
      0,
      canvasToBeFilled.width,
      canvasToBeFilled.height
    )

    const colorToReplace = {
      r: imageData.data[(y * imageData.width + x) * 4],
      g: imageData.data[(y * imageData.width + x) * 4 + 1],
      b: imageData.data[(y * imageData.width + x) * 4 + 2]
    }

    this.floodFill(imageData, { x, y }, colorToReplace, color)

    canvas.putImageData(imageData)
  }

  // optimized the shit out of it (as I can judge)
  private static floodFill(
    data: ImageData,
    { x, y }: Point,
    colorToReplace: Color,
    colorToFillWith: Color
  ) {
    const replaceR = colorToReplace.r
    const replaceG = colorToReplace.g
    const replaceB = colorToReplace.b
    const fillR = colorToFillWith.r
    const fillG = colorToFillWith.g
    const fillB = colorToFillWith.b

    const i = (y * data.width + x) * 4

    if (
      !(
        replaceR === data.data[i] &&
        replaceG === data.data[i + 1] &&
        replaceB === data.data[i + 2]
      ) ||
      (replaceR === fillR && replaceG === fillG && replaceB === fillB)
    ) {
      return
    }

    const q: Point[] = []

    data.data[i] = fillR
    data.data[i + 1] = fillG
    data.data[i + 2] = fillB

    q.push({ x, y })

    while (q.length !== 0) {
      const { x, y } = q.shift()!
      const i = (y * data.width + x) * 4
      if (
        x > 0 &&
        replaceR === data.data[i - 4] &&
        replaceG === data.data[i - 3] &&
        replaceB === data.data[i - 2]
      ) {
        data.data[i - 4] = fillR
        data.data[i - 3] = fillG
        data.data[i - 2] = fillB
        q.push({ x: x - 1, y })
      }
      if (
        x < data.width - 1 &&
        replaceR === data.data[i + 4] &&
        replaceG === data.data[i + 5] &&
        replaceB === data.data[i + 6]
      ) {
        data.data[i + 4] = fillR
        data.data[i + 5] = fillG
        data.data[i + 6] = fillB
        q.push({ x: x + 1, y })
      }
      if (
        y > 0 &&
        replaceR === data.data[i - data.width * 4] &&
        replaceG === data.data[i - data.width * 4 + 1] &&
        replaceB === data.data[i - data.width * 4 + 2]
      ) {
        data.data[i - data.width * 4] = fillR
        data.data[i - data.width * 4 + 1] = fillG
        data.data[i - data.width * 4 + 2] = fillB
        q.push({ x, y: y - 1 })
      }
      if (
        y < data.height - 1 &&
        replaceR === data.data[i + data.width * 4] &&
        replaceG === data.data[i + data.width * 4 + 1] &&
        replaceB === data.data[i + data.width * 4 + 2]
      ) {
        data.data[i + data.width * 4] = fillR
        data.data[i + data.width * 4 + 1] = fillG
        data.data[i + data.width * 4 + 2] = fillB
        q.push({ x, y: y + 1 })
      }
    }
  }
}
