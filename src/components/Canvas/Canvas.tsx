import { forwardRef, ReactNode, RefObject } from 'react'

import './Canvas.css'

export interface CanvasProps {
  ref: RefObject<HTMLCanvasElement>
  canvas: HTMLCanvasElement
  children: ReactNode[]
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas (props, ref) {
  return <div className="canvas-wrapper">
    <canvas
      ref={ref}
      className="canvas"
    />
    <div
      className="canvas-upper-layer"
      style={{
        width: props.canvas.width,
        height: props.canvas.height
      }}>
      {props.children}
    </div>
  </div>
})
