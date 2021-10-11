import { forwardRef, ReactElement, RefObject } from 'react'

import './Canvas.css'

export interface CanvasProps {
  ref: RefObject<HTMLCanvasElement>
  canvas: HTMLCanvasElement
  changeImage: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void
  children: ReactElement[]
}

export type Ref = HTMLCanvasElement

export const Canvas = forwardRef<Ref, CanvasProps>(function Canvas (props, ref) {
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
