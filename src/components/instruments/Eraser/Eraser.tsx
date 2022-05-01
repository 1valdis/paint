import {
  useRef,
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
  useLayoutEffect
} from 'react'

import './Eraser.css'
import { Color } from '../../../common/Color'
import { Point } from '../../../common/Point'
import { bresenhamLine, getCanvasCoordsFromEvent } from '../../../common/helpers'
import { flushSync } from 'react-dom'

export interface EraserProps {
  color: Color
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
  thickness: number // insert true one after thickness is made (4/6/8/10)
}

export const Eraser: FunctionComponent<EraserProps> = ({
  color,
  image,
  onImageChange,
  thickness
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const context = canvasRef.current!.getContext('2d')!
    context.drawImage(image, 0, 0)
  }, [image])

  const [isDrawing, setIsDrawing] = useState(false)
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 })
  const contextMenuShouldBePrevented = useRef(false)

  const startDrawing = useCallback((event: PointerEvent) => {
    if (event.button === 2) return
    const [x, y] = getCanvasCoordsFromEvent(canvasRef.current!, event)
    const context = canvasRef.current!.getContext('2d')!
    const { r, g, b } = color
    context.fillStyle = `rgb(${r},${g},${b})`
    context.fillRect(
      x - thickness / 2,
      y - thickness / 2,
      thickness,
      thickness
    )
    setMousePosition({ x, y })
    setIsDrawing(true)
  }, [color, thickness])
  useLayoutEffect(() => {
    const currentRef = canvasRef.current
    if (!currentRef) return
    currentRef.addEventListener('pointerdown', startDrawing)
    return () => {
      currentRef.removeEventListener('pointerdown', startDrawing)
    }
  }, [startDrawing])

  const draw = useCallback(
    (event: PointerEvent) => {
      if (isDrawing) {
        const context = canvasRef.current!.getContext('2d')!
        if (event.buttons === 1) {
          const [x, y] = getCanvasCoordsFromEvent(canvasRef.current!, event)
          bresenhamLine(mousePosition.x, mousePosition.y, x, y, (fillX, fillY) => context.fillRect(
            fillX - thickness / 2,
            fillY - thickness / 2,
            thickness,
            thickness
          ))
          flushSync(() => setMousePosition({ x, y }))
        } else if (event.button === 2) {
          context.drawImage(image, 0, 0)
          setIsDrawing(false)
          contextMenuShouldBePrevented.current = true
        }
      }
    },
    [isDrawing, mousePosition, image, thickness]
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
    onImageChange(canvasRef.current)
  }, [onImageChange])
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

  const drawPointer = useCallback(
    (event: PointerEvent) => {
      const context = pointerCanvasRef.current!.getContext('2d')!
      context.clearRect(0, 0, pointerCanvasRef.current!.width, pointerCanvasRef.current!.height)
      context.strokeStyle = 'black'
      const { r, g, b } = color
      context.fillStyle = `rgb(${r},${g},${b})`
      const [x, y] = getCanvasCoordsFromEvent(pointerCanvasRef.current!, event)

      context.fillRect(
        x - thickness / 2,
        y - thickness / 2,
        thickness,
        thickness
      )
      context.strokeRect(
        x - thickness / 2 + 0.5,
        y - thickness / 2 + 0.5,
        thickness - 1,
        thickness - 1
      )
    },
    [color, thickness]
  )
  useLayoutEffect(() => {
    document.addEventListener('pointermove', drawPointer)
    return () => {
      document.removeEventListener('pointermove', drawPointer)
    }
  }, [drawPointer])

  return (<>
    <canvas
      className="eraser-canvas"
      ref={canvasRef}
      width={image.width}
      height={image.height}
    />
    <canvas
      className="eraser-canvas-cursor"
      ref={pointerCanvasRef}
      width={image.width}
      height={image.height}
    />
  </>)
}
