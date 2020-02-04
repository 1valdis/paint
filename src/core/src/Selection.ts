import { Canvas } from './Canvas';
import { createCanvas } from './utils';

export interface SelectionCoords {
  top: number;
  left: number;
  width: number;
  height: number;
}

export class Selection {
  private _currentSelection: SelectionCoords | null = null;
  get currentSelection() {
    return this._currentSelection;
  }
  private selectionWasUpdatedSinceCreation: boolean = false;

  constructor(
    private appCanvas: Canvas,
    coords: SelectionCoords,
    imageData?: ImageData
  ) {
    this.updateInternalCanvas();
  }

  public static fromCoords(appCanvas: Canvas, coords: SelectionCoords) {
    return new Selection(appCanvas, coords);
  }

  public static fromImageData(appCanvas: Canvas, imageData: ImageData) {}

  private updateInternalCanvas() {
    const { canvas, context } = createCanvas(
      this.appCanvas.canvas.width,
      this.appCanvas.canvas.height
    );
    this.canvas = canvas;
    this.context = context;
  }

  createSelectionFromImageData(imageData: ImageData) {}

  updateSelectionToCoords(coords: SelectionCoords) {}
}
