import {
  PointerEvent as ReactPointerEvent,
  FunctionComponent,
  useRef,
  useEffect
} from 'react'

import './Pen.css'
import { bresenhamLine, getCanvasCoordsFromEvent } from '../../../common/helpers'
import { Color } from '../../../common/Color'

export interface PenProps {
  color: Color
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void
}

export const Pen: FunctionComponent<PenProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  let context: CanvasRenderingContext2D | null = null
  useEffect(() => {
    if (!canvasRef.current) return
    context = canvasRef.current.getContext('2d')
  })
  const isDrawing = useRef(false)
  const prevX = useRef(0)
  const prevY = useRef(0)

  const beginDrawing = (x: number, y: number) => {
    if (!context) throw new Error("Coudn't acquire context")
    const { r, g, b } = props.color
    context.fillStyle = `rgb(${r},${g},${b})`
    context.fillRect(x, y, 1, 1)
    ;[prevX.current, prevY.current] = [x, y]
  }

  const continueDrawing = (x: number, y: number) => {
    bresenhamLine(prevX.current, prevY.current, x, y, drawPoint)
    ;[prevX.current, prevY.current] = [x, y]
  }

  const endDrawing = () => {
    if (!canvasRef.current) throw new Error("Canvas didn't mount")
    if (!context) throw new Error("Coudn't acquire context")
    props.onImageChange(canvasRef.current, context)
  }

  const cancelDrawing = () => {
    if (!context) throw new Error("Coudn't acquire context")
    context.drawImage(props.image, 0, 0)
  }

  const drawPoint = (x: number, y: number) => {
    if (!context) throw new Error("Coudn't acquire context")
    context.fillRect(x, y, 1, 1)
  }

  const handlePointerDown = (e: ReactPointerEvent) => {
    if (!canvasRef.current) throw new Error("Canvas didn't mount")
    isDrawing.current = true
    const [x, y] = getCanvasCoordsFromEvent(canvasRef.current, e)
    beginDrawing(x, y)
  }

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!canvasRef.current) throw new Error("Canvas didn't mount")
    if (isDrawing.current && e.buttons !== 3) {
      const [x, y] = getCanvasCoordsFromEvent(canvasRef.current, e)
      continueDrawing(x, y)
    }
  }

  const handlePointerEnter = (e: ReactPointerEvent) => {
    if (!canvasRef.current) throw new Error("Canvas didn't mount")
    if (e.buttons === 1 && isDrawing.current) {
      const [x, y] = getCanvasCoordsFromEvent(canvasRef.current, e)
      continueDrawing(x, y)
    } else {
      isDrawing.current = false
    }
  }

  const handlePointerLeave = (e: ReactPointerEvent) => {
    if (!canvasRef.current) throw new Error("Canvas didn't mount")
    if (isDrawing.current) {
      const [x, y] = getCanvasCoordsFromEvent(canvasRef.current, e)
      continueDrawing(x, y)
    }
  }

  const handleDocumentPointerUp = () => {
    if (isDrawing.current) {
      isDrawing.current = false
      endDrawing()
    }
  }

  const handleDocumentPointerMove = (e: PointerEvent) => {
    if (!canvasRef.current) throw new Error("Canvas didn't mount")
    if (e.target !== canvasRef.current) {
      ;[prevX.current, prevY.current] = getCanvasCoordsFromEvent(
        canvasRef.current,
        e
      )
    }
    if (isDrawing.current && e.button === 2) {
      cancelDrawing()
    }
  }

  const handleDocumentContextMenu = (e: Event) => {
    if (isDrawing.current) {
      e.preventDefault()
      isDrawing.current = false
    }
  }

  const handleDocumentSelectStart = (e: Event) => {
    if (isDrawing.current) {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    ctx.drawImage(props.image, 0, 0)
    document.addEventListener('pointerup', handleDocumentPointerUp)
    document.addEventListener('pointermove', handleDocumentPointerMove)
    document.addEventListener('selectstart', handleDocumentSelectStart)
    document.addEventListener('contextmenu', handleDocumentContextMenu)
    return () => {
      document.removeEventListener('pointerup', handleDocumentPointerUp)
      document.removeEventListener('pointermove', handleDocumentPointerMove)
      document.removeEventListener('selectstart', handleDocumentSelectStart)
      document.removeEventListener('contextmenu', handleDocumentContextMenu)
    }
  }, [])

  return (
    <canvas
      className="pen-canvas"
      ref={canvasRef}
      width={props.image.width}
      height={props.image.height}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    />
  )
}
