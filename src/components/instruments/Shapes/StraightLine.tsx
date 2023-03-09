import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getCanvasCoordsFromEvent } from '../../../common/helpers'
import { Point } from '../../../common/Point'
import { ResizerPoint } from '../../ResizerPoint/ResizerPoint'
import { ShapesInstrumentProps } from './ShapesInstrumentProps'

export const StraightLine: FunctionComponent<ShapesInstrumentProps> = ({
  primaryColor,
  image,
  thickness,
  onImageChange
}) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [line, setLine] = useState<[Point, Point] | null>(null)

  const modifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const startingCanvasRef = useRef(image)
  const contextMenuShouldBePrevented = useRef(false)

  useEffect(() => {
    if (!modifiedCanvasRef.current) return
    const context = modifiedCanvasRef.current!.getContext('2d')!
    context.drawImage(startingCanvasRef.current, 0, 0)
    if (!line) return
    const { r, g, b } = primaryColor
    context.strokeStyle = `rgb(${r},${g},${b})`
    context.lineCap = 'round'
    context.lineWidth = thickness
    context.beginPath()
    context.moveTo(line[0].x, line[0].y)
    context.lineTo(line[1].x, line[1].y)
    context.stroke()
  }, [image, line, primaryColor, thickness])

  const startDrawing = useCallback((event: PointerEvent) => {
    if (event.button === 2 || !modifiedCanvasRef.current) return
    const newCanvas = document.createElement('canvas')
    newCanvas.height = image.height
    newCanvas.width = image.width
    const ctx = newCanvas.getContext('2d')!
    ctx.drawImage(modifiedCanvasRef.current, 0, 0)
    startingCanvasRef.current = newCanvas
    const [x, y] = getCanvasCoordsFromEvent(modifiedCanvasRef.current!, event)
    setLine([{ x, y }, { x, y }])
    setIsDrawing(true)
  }, [image])

  useEffect(() => {
    const currentRef = modifiedCanvasRef.current
    if (!currentRef) return
    currentRef.addEventListener('pointerdown', startDrawing)
    return () => {
      currentRef.removeEventListener('pointerdown', startDrawing)
    }
  }, [startDrawing])

  const draw = useCallback(
    (event: PointerEvent) => {
      if ((isDrawing) && line) {
        if (event.buttons === 1) {
          const [x, y] = getCanvasCoordsFromEvent(modifiedCanvasRef.current!, event)
          console.log('fuck')
          setLine([line[0], { x, y }])
        } else if (event.button === 2) {
          setIsDrawing(false)
          setLine(null)
          contextMenuShouldBePrevented.current = true
        }
      }
    },
    [isDrawing, line]
  )
  useEffect(() => {
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
        onResizeStart={(event) => {
          event.stopPropagation()
        }}
        onResizeMove={(event) => {
          event.stopPropagation()
          const [x, y] = getCanvasCoordsFromEvent(modifiedCanvasRef.current!, event)
          console.log(`setting line in FIRST handler to ${x + ' ' + y}, ${line[1].x + ' ' + line[1].y}`)
          setLine((oldLine) => [{ x, y }, oldLine![1]])
        }}
        onResizeEnd={(event) => {
          event.stopPropagation()
        }}
        onResizeCancel={() => {}}
        outerStyle={{ top: line[0].y, left: line[0].x }}
        className='straight-line-resizer'/>
      <ResizerPoint
        onResizeStart={(event) => {
          event.stopPropagation()
        }}
        onResizeMove={(event) => {
          event.stopPropagation()
          const [x, y] = getCanvasCoordsFromEvent(modifiedCanvasRef.current!, event)
          console.log(`setting line in SECOND handler to ${line[0].x + ' ' + line[0].y}, ${x + ' ' + y}`)
          setLine((oldLine) => [oldLine![0], { x, y }])
        }}
        onResizeEnd={(event) => {
          event.stopPropagation()
        }}
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
