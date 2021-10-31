import { FunctionComponent } from 'react'
import { Resizer } from '../Resizer/Resizer'

export interface CanvasResizerProps {
  canvas: HTMLCanvasElement
  backgroundColor: { r: number; g: number; b: number }
  onImageChange(canvas: HTMLCanvasElement): void
}

export const CanvasResizer: FunctionComponent<CanvasResizerProps> = (props) => {
  const onResize = (top: number, left: number, toWidth: number, toHeight: number) => {
    if (
      props.canvas.width !== toWidth ||
      props.canvas.height !== toHeight
    ) {
      const newCanvas = document.createElement('canvas')
      newCanvas.width = toWidth
      newCanvas.height = toHeight
      const newCtx = newCanvas.getContext('2d')
      if (!newCtx) throw new Error("Coudn't acquire context")
      newCtx.fillStyle = `rgb(${props.backgroundColor.r},${props.backgroundColor.g},${props.backgroundColor.b})`
      newCtx.fillRect(0, 0, toWidth, toHeight)
      newCtx.drawImage(props.canvas, 0, 0)
      props.onImageChange(newCanvas)
    }
  }

  return (
    <Resizer
      mode="canvas"
      onResizeEnd={onResize}
      // onResizing={() =>
      //   changeInstrument({ instrument: this.props.selectedInstrument })
      // }
      width={props.canvas.width}
      height={props.canvas.height}
      top={0}
      left={0}
    />
  )
}
