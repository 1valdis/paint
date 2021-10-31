import {
  FunctionComponent,
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect
} from 'react'

import './Pen.css'
import { bresenhamLine, getCanvasCoordsFromEvent } from '../../../common/helpers'
import { Color } from '../../../common/Color'
import { Point } from '../../../common/Point'

export interface PenProps {
  color: Color
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
}

export const Pen: FunctionComponent<PenProps> = (props) => {
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
    const [x, y] = getCanvasCoordsFromEvent(canvasRef.current!, event)
    const context = canvasRef.current!.getContext('2d')
    const { r, g, b } = props.color
    context!.fillStyle = `rgb(${r},${g},${b})`
    context!.fillRect(x, y, 1, 1)
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
          bresenhamLine(mousePosition.x, mousePosition.y, x, y, (fillX, fillY) => context.fillRect(fillX, fillY, 1, 1))
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
      className="pen-canvas"
      ref={canvasRef}
      width={props.image.width}
      height={props.image.height}
    />
  )
}
