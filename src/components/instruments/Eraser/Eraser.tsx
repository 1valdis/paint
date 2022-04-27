import {
  useRef,
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
  useLayoutEffect
} from 'react'

import { Color } from '../../../common/Color'
import { Point } from '../../../common/Point'
import { bresenhamLine, getCanvasCoordsFromEvent } from '../../../common/helpers'

export interface EraserProps {
  color: Color
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
  thickness: number // insert true one after thickness is made (4/6/8/10)
}

// class _Eraser extends PureComponent<EraserProps> {
//   noCursorCtx: CanvasRenderingContext2D

//   constructor(props: EraserProps) {
//     super(props)
//     const noCursorCanvas = document.createElement('canvas')
//     const noCursorCtx = noCursorCanvas.getContext('2d')
//     if (!noCursorCtx) throw new Error("Coudn't acquire context")
//     this.noCursorCtx = noCursorCtx
//   }

//   handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
//     if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
//     this.isDrawing = true
//     const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
//     this.drawPoint(x, y)
//     this.beginDrawing(x, y)
//   }

//   handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
//     if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
//     const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
//     if (this.isDrawing && e.buttons !== 3) {
//       this.continueDrawing(x, y)
//     }
//     this.updateCanvas(x, y)
//   }

//   handlePointerLeave = (e: ReactPointerEvent<HTMLCanvasElement>) => {
//     if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
//     if (this.isDrawing) {
//       const [x, y] = getCanvasCoordsFromEvent(this.canvasRef.current, e)
//       this.continueDrawing(x, y)
//     }
//     this.updateCanvas()
//   }

//   handleDocumentPointerMove = (e: PointerEvent) => {
//     if (!this.canvasRef.current) return
//     if (e.target !== this.canvasRef.current) {
//       ;[this.prevX, this.prevY] = getCanvasCoordsFromEvent(
//         this.canvasRef.current,
//         e
//       )
//     }
//     if (this.isDrawing && e.button === 2) {
//       this.preventContextMenu = true
//       this.cancelDrawing()
//     }
//   }

//   handleDocumentContextMenu = (e: Event) => {
//     if (this.isDrawing) {
//       e.preventDefault()
//       this.isDrawing = false
//     }
//   }

//   handleDocumentSelectStart = (e: Event) => {
//     if (this.isDrawing) {
//       e.preventDefault()
//     }
//   }

//   componentDidMount() {
//     if (!this.canvasRef.current) throw new Error("Canvas didn't mount")
//     this.ctx = this.canvasRef.current.getContext('2d') || undefined
//     if (!this.ctx) throw new Error("Coudn't acquire context")
//     const { r, g, b } = this.props.color
//     this.ctx.fillStyle = `rgb(${r},${g},${b})`
//     this.ctx.strokeStyle = 'black'
//     this.noCursorCtx.fillStyle = `rgb(${r},${g},${b})`
//     this.updateCanvasNoCursor()
//     document.addEventListener('pointerup', this.handleDocumentPointerUp)
//     document.addEventListener('pointermove', this.handleDocumentPointerMove)
//     document.addEventListener('selectstart', this.handleDocumentSelectStart)
//     document.addEventListener('contextmenu', this.handleDocumentContextMenu)
//   }

//   componentDidUpdate() {
//     const { r, g, b } = this.props.color
//     if (!this.ctx) throw new Error("Coudn't acquire context")
//     this.ctx.fillStyle = `rgb(${r},${g},${b})`
//     this.noCursorCtx.fillStyle = `rgb(${r},${g},${b})`
//     this.updateCanvasNoCursor()
//   }

//   componentWillUnmount() {
//     document.removeEventListener('pointerup', this.handleDocumentPointerUp)
//     document.removeEventListener('pointermove', this.handleDocumentPointerMove)
//     document.removeEventListener('selectstart', this.handleDocumentSelectStart)
//     document.removeEventListener('contextmenu', this.handleDocumentContextMenu)
//   }

//   beginDrawing = (x: number, y: number) => {
//     const { r, g, b } = this.props.color
//     if (!this.ctx) throw new Error("Coudn't acquire context")
//     this.ctx.fillStyle = `rgb(${r},${g},${b})`
//     this.drawPoint(x, y)
//     ;[this.prevX, this.prevY] = [x, y]
//   }

//   continueDrawing = (x: number, y: number) => {
//     bresenhamLine(this.prevX, this.prevY, x, y, this.drawPoint)
//     ;[this.prevX, this.prevY] = [x, y]
//   }

//   endDrawing = () => {
//     this.props.changeImage(
//       this.noCursorCtx.getImageData(
//         0,
//         0,
//         this.noCursorCtx.canvas.width,
//         this.noCursorCtx.canvas.height
//       )
//     )
//   }

//   cancelDrawing = () => {
//     this.noCursorCtx.putImageData(this.props.imageData, 0, 0)
//   }

//   drawPoint = (x: number, y: number) => {
//     if (this.noCursorCtx)
//       this.noCursorCtx.fillRect(
//         x - this.props.thickness / 2,
//         y - this.props.thickness / 2,
//         this.props.thickness,
//         this.props.thickness
//       )
//   }

//   updateCanvasNoCursor = () => {
//     if (this.props.imageData != null) {
//       ;[this.noCursorCtx.canvas.width, this.noCursorCtx.canvas.height] = [
//         this.props.imageData.width,
//         this.props.imageData.height
//       ]
//       const { r, g, b } = this.props.color
//       this.noCursorCtx.fillStyle = `rgb(${r},${g},${b})`
//       this.noCursorCtx.putImageData(this.props.imageData, 0, 0)
//     }
//   }

//   updateCanvas = (x?: number, y?: number) => {
//     if (!this.ctx) throw new Error("Coudn't acquire context")
//     this.ctx.drawImage(this.noCursorCtx.canvas, 0, 0)
//     if (x !== undefined && y !== undefined) {
//       this.ctx.fillRect(
//         x - this.props.thickness / 2,
//         y - this.props.thickness / 2,
//         this.props.thickness,
//         this.props.thickness
//       )
//       this.ctx.strokeRect(
//         x - this.props.thickness / 2 + 0.5,
//         y - this.props.thickness / 2 + 0.5,
//         this.props.thickness - 1,
//         this.props.thickness - 1
//       )
//     }
//   }
// }

export const Eraser: FunctionComponent<EraserProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const context = canvasRef.current!.getContext('2d')!
    context.drawImage(props.image, 0, 0)
  }, [props.image])

  const [isDrawing, setIsDrawing] = useState(false)
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 })
  const contextMenuShouldBePrevented = useRef(false)

  const startDrawing = useCallback((event: PointerEvent) => {
    if (event.button === 2) return
    const [x, y] = getCanvasCoordsFromEvent(canvasRef.current!, event)
    const context = canvasRef.current!.getContext('2d')!
    const { r, g, b } = props.color
    context.fillStyle = `rgb(${r},${g},${b})`
    context.fillRect(
      x - props.thickness / 2,
      y - props.thickness / 2,
      props.thickness,
      props.thickness
    )
    setMousePosition({ x, y })
    setIsDrawing(true)
  }, [props.color])
  useLayoutEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.addEventListener('pointerdown', startDrawing)
    return () => {
      canvasRef.current!.removeEventListener('pointerdown', startDrawing)
    }
  }, [startDrawing])

  const draw = useCallback(
    (event: PointerEvent) => {
      if (isDrawing) {
        const context = canvasRef.current!.getContext('2d')!
        if (event.buttons === 1) {
          const [x, y] = getCanvasCoordsFromEvent(canvasRef.current!, event)
          bresenhamLine(mousePosition.x, mousePosition.y, x, y, (fillX, fillY) => context.fillRect(
            fillX - props.thickness / 2,
            fillY - props.thickness / 2,
            props.thickness,
            props.thickness
          ))
          setMousePosition({ x, y })
        } else if (event.button === 2) {
          context.drawImage(props.image, 0, 0)
          setIsDrawing(false)
          contextMenuShouldBePrevented.current = true
        }
      }
    },
    [isDrawing, mousePosition, props.image]
  )
  useLayoutEffect(() => {
    document.addEventListener('pointermove', draw)
    return () => {
      document.removeEventListener('pointermove', draw)
    }
  }, [draw])

  const finishDrawing = useCallback(() => {
    if (!canvasRef.current) return
    setIsDrawing(false)
    props.onImageChange(canvasRef.current)
  }, [])
  useLayoutEffect(() => {
    document.addEventListener('pointerup', finishDrawing)
    return () => {
      document.removeEventListener('pointerup', finishDrawing)
    }
  }, [finishDrawing])

  useEffect(() => {
    const preventContextMenu = (event: Event) => {
      if (contextMenuShouldBePrevented.current) {
        event.preventDefault()
        contextMenuShouldBePrevented.current = false
      }
    }
    document.addEventListener('contextmenu', preventContextMenu)
    return () => document.removeEventListener('contextmenu', preventContextMenu)
  }, [])

  return (
    <canvas
      className="eraser-canvas"
      ref={canvasRef}
      style={{ cursor: 'pointer' }}
      width={props.image.width}
      height={props.image.height}
    />
  )
}
