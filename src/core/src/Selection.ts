import { createCanvas } from './utils'
import { Rectangle, Color, Point } from './interfaces'

export interface Selection {
  selectionImageData: ImageData
  boundingBox: Rectangle
}

export const createSelectionFromImageData = (
  imageData: ImageData
): Selection => {
  return {
    selectionImageData: imageData,
    boundingBox: {
      left: 0,
      top: 0,
      width: imageData.width,
      height: imageData.height
    }
  }
}

export const applySelection = (
  selection: Selection,
  targetContext: CanvasRenderingContext2D
) => {
  const { canvas: imageDataCanvas, context: imageDataContext } = createCanvas(
    selection.selectionImageData.width,
    selection.selectionImageData.height
  )
  imageDataContext.putImageData(selection.selectionImageData, 0, 0)
  targetContext.drawImage(
    imageDataCanvas,
    selection.boundingBox.left,
    selection.boundingBox.top,
    selection.boundingBox.width,
    selection.boundingBox.height
  )
}

class SelectionOld {
  private _originalCoordinates: Rectangle | null = null
  private _currentSelection: Rectangle | null = null
  private selectionWasUpdatedSinceCreation: boolean = false
  private originalCanvas: HTMLCanvasElement
  private originalContext: CanvasRenderingContext2D
  private modifiedCanvas: HTMLCanvasElement
  private modifiedContext: CanvasRenderingContext2D
  private selectionCanvas: HTMLCanvasElement | null = null
  private selectionContext: CanvasRenderingContext2D | null = null

  get currentSelection() {
    return this._currentSelection
  }

  // private constructor(
  //   private appCanvas: Canvas,
  //   coords: Rectangle,
  //   imageData?: ImageData
  // ) {
  //   this.originalCanvas = appCanvas.canvas
  //   this._currentSelection = coords
  //   this._originalCoordinates = imageData ? null : coords
  //   const { canvas: selectionCanvas, context: selectionCtx } = createCanvas(
  //     imageData?.width || coords.width,
  //     imageData?.height || coords.height
  //   )
  //   this.selectionCanvas = selectionCanvas
  //   this.selectionCtx = selectionCtx
  //   const { canvas: modifiedCanvas, context: modifiedCtx } = createCanvas(
  //     imageData?.width || coords.width,
  //     imageData?.height || coords.height
  //   )
  //   this.modifiedCanvas = modifiedCanvas
  //   this.modifiedCtx = modifiedCtx
  //   this.modifiedCtx.drawImage(this.originalCanvas, 0, 0)
  //   if (imageData) {
  //     this.selectionCtx.putImageData(imageData, 0, 0)
  //   } else {
  //     this.selectionCtx.putImageData(appCanvas.getImageData(coords), 0, 0)
  //     this.modifiedCtx.drawImage(
  //       this.selectionCanvas,
  //       coords.left,
  //       coords.top,
  //       coords.width,
  //       coords.height
  //     )
  //   }
  // }

  // constructor (takes original imagedata)
  // constructor(imageData: ImageData) {
  //   const { canvas: originalCanvas, context: originalContext } = createCanvas(
  //     imageData.width,
  //     imageData.height
  //   )
  //   this.originalCanvas = originalCanvas
  //   this.originalContext = originalContext

  //   const { canvas: modifiedCanvas, context: modifiedContext } = createCanvas(
  //     imageData.width,
  //     imageData.height
  //   )
  //   this.modifiedCanvas = modifiedCanvas
  //   this.modifiedContext = modifiedContext
  // }

  // // createFromRectangle (takes rectangle, isTransparent)
  // createFromRectangle(rectangle: Rectangle, colorForTransparency?: Color) {
  //   this._originalCoordinates = rectangle
  //   const { canvas, context } = createCanvas(rectangle.width, rectangle.height)
  //   this.selectionCanvas = canvas
  //   this.selectionContext = context
  //   this.selectionContext.putImageData(
  //     this.originalContext.getImageData(
  //       rectangle.left,
  //       rectangle.top,
  //       rectangle.width,
  //       rectangle.height
  //     ),
  //     0,
  //     0
  //   )
  // }

  // // createFromPolygon?
  // // createFromImageData (takes imagedata)
  // createFromImageData(imageData: ImageData) {
  //   const { canvas, context } = createCanvas(imageData.width, imageData.height)
  //   this.selectionCanvas = canvas
  //   this.selectionContext = context
  //   this.selectionContext.putImageData(imageData, 0, 0)
  // }

  // // moveToRectangle (takes rectangle and backgroundColor)
  // moveToRectangle(rectangle: Rectangle, backgroundColor: Color) {}
  // // get selection imagedata

  // static createSelectionFromPolygon(
  //   polygon: Point[],
  //   originalCanvas: HTMLCanvasElement
  // ): SelectionData {
  //   if (polygon.length < 3)
  //     throw new Error('Polygon should have at least 3 points')
  //   const path = new Path2D()
  //   polygon.forEach(({ x, y }) => {
  //     path.lineTo(x, y)
  //   })
  //   path.closePath()
  //   const { canvas, context } = createCanvas(
  //     originalCanvas.width,
  //     originalCanvas.height
  //   )
  //   const pattern = context.createPattern(originalCanvas, 'no-repeat')
  //   if (!pattern) throw new Error("Couldn't create pattern from canvas")
  //   context.fillStyle = pattern
  //   context.fill(path, 'evenodd')

  //   const topLeft: Point = {
  //     x: Math.min(...polygon.map(({ x }) => x)),
  //     y: Math.min(...polygon.map(({ y }) => y))
  //   }
  //   const boundingBox: Rectangle = {
  //     top: topLeft.y,
  //     left: topLeft.x,
  //     width: Math.max(...polygon.map(({ x }) => x)) - topLeft.x,
  //     height: Math.max(...polygon.map(({ y }) => y)) - topLeft.y
  //   }
  //   const { canvas: resultingCanvas, context: resultingContext } = createCanvas(
  //     boundingBox.width,
  //     boundingBox.height
  //   )
  //   resultingContext.drawImage(
  //     canvas,
  //     0,
  //     0,
  //     boundingBox.width,
  //     boundingBox.height,
  //     boundingBox.left,
  //     boundingBox.top,
  //     boundingBox.width,
  //     boundingBox.height
  //   )
  // }
}

// create selection from poly
// create selection from imageData
// switch/create selection with transparent background
// reverse selection
