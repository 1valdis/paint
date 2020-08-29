import { createCanvas } from "./utils";
import { Rectangle } from "./interfaces/Rectangle";
import { Color } from "../../actions";

export class Selection {
  private _originalCoordinates: Rectangle | null = null;
  private _currentSelection: Rectangle | null = null;
  private selectionWasUpdatedSinceCreation: boolean = false;
  private originalCanvas: HTMLCanvasElement;
  private originalContext: CanvasRenderingContext2D;
  private modifiedCanvas: HTMLCanvasElement;
  private modifiedContext: CanvasRenderingContext2D;
  private selectionCanvas: HTMLCanvasElement | null = null;
  private selectionContext: CanvasRenderingContext2D | null = null;

  get currentSelection() {
    return this._currentSelection;
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
  constructor(imageData: ImageData) {
    const { canvas: originalCanvas, context: originalContext } = createCanvas(
      imageData.width,
      imageData.height
    );
    this.originalCanvas = originalCanvas;
    this.originalContext = originalContext;

    const { canvas: modifiedCanvas, context: modifiedContext } = createCanvas(
      imageData.width,
      imageData.height
    );
    this.modifiedCanvas = modifiedCanvas;
    this.modifiedContext = modifiedContext;
  }

  // createFromRectangle (takes rectangle, isTransparent)
  createFromRectangle(rectangle: Rectangle, colorForTransparency?: Color) {
    this._originalCoordinates = rectangle;
    const { canvas, context } = createCanvas(rectangle.width, rectangle.height);
    this.selectionCanvas = canvas;
    this.selectionContext = context;
    this.selectionContext.putImageData(
      this.originalContext.getImageData(
        rectangle.left,
        rectangle.top,
        rectangle.width,
        rectangle.height
      ),
      0,
      0
    );
  }

  // createFromPolygon?
  // createFromImageData (takes imagedata)
  createFromImageData(imageData: ImageData) {
    const { canvas, context } = createCanvas(imageData.width, imageData.height);
    this.selectionCanvas = canvas;
    this.selectionContext = context;
    this.selectionContext.putImageData(imageData, 0, 0);
  }

  // moveToRectangle (takes rectangle and backgroundColor)
  moveToRectangle(rectangle: Rectangle, backgroundColor: Color) {}
  // get selection imagedata
}
