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

export interface EraserProps {
  color: Color
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
  thickness: number // insert true one after thickness is made (4/6/8/10)
}

export const Eraser: FunctionComponent<EraserProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerCanvasRef = useRef<HTMLCanvasElement | null>(null)

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

  const drawPointer = useCallback(
    (event: PointerEvent) => {
      const context = pointerCanvasRef.current!.getContext('2d')!
      context.clearRect(0, 0, pointerCanvasRef.current!.width, pointerCanvasRef.current!.height)
      context.strokeStyle = 'black'
      const { r, g, b } = props.color
      context.fillStyle = `rgb(${r},${g},${b})`
      const [x, y] = getCanvasCoordsFromEvent(pointerCanvasRef.current!, event)

      context.fillRect(
        x - props.thickness / 2,
        y - props.thickness / 2,
        props.thickness,
        props.thickness
      )
      context.strokeRect(
        x - props.thickness / 2 + 0.5,
        y - props.thickness / 2 + 0.5,
        props.thickness - 1,
        props.thickness - 1
      )
    },
    [props.color]
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
      width={props.image.width}
      height={props.image.height}
    />
    <canvas
      className="eraser-canvas-cursor"
      ref={pointerCanvasRef}
      width={props.image.width}
      height={props.image.height}
    />
  </>)
}
