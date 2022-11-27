import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { getCanvasCoordsFromEvent } from '../../../common/helpers'
import { Point } from '../../../common/Point'
import { ResizerPoint } from '../../ResizerPoint/ResizerPoint'
import { ShapesInstrumentProps } from './ShapesInstrumentProps'

export const StraightLine: FunctionComponent<ShapesInstrumentProps> = ({
  primaryColor,
  contour,
  image,
  thickness,
  onImageChange
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [line, setLine] = useState<[Point, Point] | null>(null)

  const modifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!modifiedCanvasRef.current) return
    const context = modifiedCanvasRef.current!.getContext('2d')!
    context.drawImage(image, 0, 0)
  }, [image])

  const contextMenuShouldBePrevented = useRef(false)

  const startDrawing = useCallback((event: PointerEvent) => {
    if (event.button === 2) return
    const [x, y] = getCanvasCoordsFromEvent(modifiedCanvasRef.current!, event)
    const context = modifiedCanvasRef.current!.getContext('2d')
    if (!context) throw new Error()
    const { r, g, b } = primaryColor
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.lineCap = 'round'
    context.lineWidth = thickness
    setLine([{ x, y }, { x, y }])
    setIsDrawing(true)
  }, [primaryColor, thickness])

  useLayoutEffect(() => {
    const currentRef = modifiedCanvasRef.current
    if (!currentRef) return
    currentRef.addEventListener('pointerdown', startDrawing)
    return () => {
      currentRef.removeEventListener('pointerdown', startDrawing)
    }
  }, [startDrawing])

  const draw = useCallback(
    (event: PointerEvent) => {
      if (isDrawing) {
        const context = modifiedCanvasRef.current!.getContext('2d')!
        if (event.buttons === 1) {
          const [x, y] = getCanvasCoordsFromEvent(modifiedCanvasRef.current!, event)
          if (!line) throw Error()
          context.drawImage(image, 0, 0)
          context.beginPath()
          context.moveTo(line[0].x, line[0].y)
          context.lineTo(x, y)
          context.stroke()
          flushSync(() => setLine([line[0], { x, y }]))
        } else if (event.button === 2) {
          context.drawImage(image, 0, 0)
          setIsDrawing(false)
          setLine(null)
          contextMenuShouldBePrevented.current = true
        }
      }
    },
    [isDrawing, line, image]
  )
  useLayoutEffect(() => {
    document.addEventListener('pointermove', draw)
    return () => {
      document.removeEventListener('pointermove', draw)
    }
  }, [draw])

  const finishDrawing = useCallback(() => {
    if (!modifiedCanvasRef.current) return
    setIsDrawing(false)
    onImageChange(modifiedCanvasRef.current)
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

  let El = <></>
  if (!isDrawing && line) {
    El = <>
      <div className='straight-line-mover'></div>
      <ResizerPoint
        onResizeStart={() => {}}
        onResizeMove={(e) => {}}
        onResizeEnd={() => {}}
        onResizeCancel={() => {}}
        outerStyle={{ top: line[0].y, left: line[0].x }}
        className='straight-line-resizer'/>
      <ResizerPoint
        onResizeStart={() => {}}
        onResizeMove={(e) => {}}
        onResizeEnd={() => {}}
        onResizeCancel={() => {}}
        outerStyle={{ top: line[1].y, left: line[1].x }}
        className='straight-line-resizer'/>
    </>
  }
  return <>
    <canvas
      className='shape-canvas'
      ref={modifiedCanvasRef}
      width={image.width}
      height={image.height}>
    </canvas>
    {El}
  </>
}
