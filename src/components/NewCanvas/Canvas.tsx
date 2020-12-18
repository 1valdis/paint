import React, { forwardRef } from 'react'

// import { CanvasResizer } from '../CanvasResizer/CanvasResizer'
// import { CanvasEditor } from '../CanvasEditor/CanvasEditor'

import './Canvas.css'

export interface CanvasProps {
  // ref: RefObject<HTMLCanvasElement>
}

export type Ref = HTMLCanvasElement

export const Canvas = forwardRef<Ref, CanvasProps>(function Canvas (props, ref) {
  return <div className="canvas-wrapper">
    <canvas
      ref={ref}
      className="canvas"
    />
    {/* <div
      className="canvas-upper-layer"
      style={{
        width: this.props.imageData.width,
        height: this.props.imageData.height
      }}>
      <CanvasResizer />
      <CanvasEditor />
    </div> */}
  </div>
})

// class _Canvas extends PureComponent<CanvasProps> {
//   canvas: RefObject<HTMLCanvasElement> = createRef()

//   updateCanvas = () => {
//     const canvas = this.canvas.current
//     if (canvas != null) {
//       ;[canvas.width, canvas.height] = [
//         this.props.imageData.width,
//         this.props.imageData.height
//       ]
//       const ctx = canvas.getContext('2d')
//       if (!ctx) throw new Error("Couldn't acquire context")
//       ctx.putImageData(this.props.imageData, 0, 0)
//     }
//   }

//   componentDidMount () {
//     this.updateCanvas()
//   }

//   componentDidUpdate () {
//     this.updateCanvas()
//   }
// }
