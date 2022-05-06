import {
  PointerEvent as ReactPointerEvent,
  FunctionComponent,
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect
} from 'react'

import { Rectangle } from '../../../common/Rectangle'
import { Color } from '../../../common/Color'
import { Point } from '../../../common/Point'
import { MovableSelection } from './MovableSelection/MovableSelection'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.

import './Selection.css'
import { SelectionZoneType } from '../../../common/SelectionZoneType'

export interface SelectionProps {
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
  setIsSelectionActive: (value: boolean) => void
  selectionRectangle: Rectangle | null
  setSelectionRectangle: (value: Rectangle | null) => void
  selectionImage: HTMLCanvasElement | null
  setSelectionImage: (image: HTMLCanvasElement | null) => void
  selectionBackground: HTMLCanvasElement | null
  setSelectionBackground: (image: HTMLCanvasElement | null) => void,
  secondaryColor: Color,
  zoneType: SelectionZoneType,
  setFreeformSelectionPath: (path: Array<Point> | null) => void
  freeformSelectionPath: Array<Point> | null
}

function usePrevious<T> (value: T): T {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const Selection: FunctionComponent<SelectionProps> = ({
  image,
  onImageChange,
  setIsSelectionActive,
  selectionRectangle,
  setSelectionRectangle,
  selectionImage,
  setSelectionImage,
  selectionBackground,
  setSelectionBackground,
  secondaryColor,
  zoneType,
  setFreeformSelectionPath,
  freeformSelectionPath
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectingOrigin, setSelectingOrigin] = useState<Point | null>(null)
  const [selectingRectangle, setSelectingRectangle] = useState<Rectangle | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [path, setPath] = useState<Array<Point> | null>(null)

  const contextMenuShouldBePrevented = useRef(false)

  const modifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const freeformSelectorPathRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = freeformSelectorPathRef.current
    if (!canvas) throw new Error()
    canvas.width = image.width
    canvas.height = image.height
  }, [image])
  useLayoutEffect(() => {
    const canvas = freeformSelectorPathRef.current
    if (!canvas) throw new Error()
    const context = canvas.getContext('2d')
    if (!context) throw new Error()
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (!path) return
    context.imageSmoothingEnabled = false
    context.strokeStyle = 'white'
    context.lineWidth = 3
    context.beginPath()
    const [start, ...rest] = path
    if (start) {
      context.moveTo(start.x, start.y)
    }
    for (const point of rest) {
      context.lineTo(point.x, point.y)
    }
    context.stroke()
  }, [path])

  const prevSelectionDetails = usePrevious({ selectionBackground, selectionImage, selectionRectangle })

  useEffect(() => {
    if (!modifiedCanvasRef.current) return
    modifiedCanvasRef.current.width = image.width
    modifiedCanvasRef.current.height = image.height
    const context = modifiedCanvasRef.current.getContext('2d')!
    if (selectionBackground && selectionImage && selectionRectangle &&
      (prevSelectionDetails.selectionBackground !== selectionBackground ||
        prevSelectionDetails.selectionImage !== selectionImage ||
        prevSelectionDetails.selectionRectangle !== selectionRectangle)) {
      context.drawImage(selectionBackground, 0, 0)
      context.drawImage(selectionImage, selectionRectangle.left, selectionRectangle.top)
      onImageChange(modifiedCanvasRef.current)
    } else {
      context.drawImage(image, 0, 0)
    }
  }, [image, onImageChange, prevSelectionDetails, selectionBackground, selectionImage, selectionRectangle])

  // #region new selection creation
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

  const startSelecting = useCallback((e: ReactPointerEvent) => {
    if (e.target !== e.currentTarget) return

    if (!containerRef.current) throw new Error("Couldn't get ref to div")

    let {
      top,
      left,
      bottom,
      right
    } = containerRef.current.getBoundingClientRect()
    ;[top, left, bottom, right] = [
      top + window.pageYOffset,
      left + window.pageXOffset,
      bottom + window.pageYOffset,
      right + window.pageXOffset
    ]
    const [mouseX, mouseY] = [
      e.clientX + window.pageXOffset,
      e.clientY + window.pageYOffset
    ]
    ;[top, left] = [Math.ceil(mouseY - top), Math.ceil(mouseX - left)]

    const point = { y: top, x: left }
    if (zoneType === 'rectangle') {
      setSelectingOrigin(point)
    } else {
      setPath([point])
    }
    setIsSelecting(true)
    setSelectingRectangle(null)
    setIsSelectionActive(true)
    setSelectionRectangle(null)
    setFreeformSelectionPath(null)
  }, [setFreeformSelectionPath, setIsSelectionActive, setSelectionRectangle, zoneType])

  const handleDocumentPointerMove = useCallback((e: PointerEvent) => {
    if (!isSelecting) return

    switch (e.buttons) {
      case 1: {
        // getting bounding rect and mouse coords relatively to document, not viewport
        if (!containerRef.current) { throw new Error("Couldn't get ref to div") }
        let {
          top,
          left,
          bottom,
          right
        } = containerRef.current.getBoundingClientRect()
        ;[top, left, bottom, right] = [
          top + window.pageYOffset,
          left + window.pageXOffset,
          bottom + window.pageYOffset,
          right + window.pageXOffset
        ]
        const [mouseX, mouseY] = [
          e.clientX + window.pageXOffset,
          e.clientY + window.pageYOffset
        ]

        // getting top and left coordinates of current mouse position relatively to canvas
        let [canvasRelativeTop, canvasRelativeLeft] = [
          Math.trunc(mouseY - top),
          Math.trunc(mouseX - left)
        ]
        // clamping top and left coordinates between 0 and canvas width
        ;[canvasRelativeTop, canvasRelativeLeft] = [
          Math.max(
            0,
            Math.min(canvasRelativeTop, image.height)
          ),
          Math.max(
            0,
            Math.min(canvasRelativeLeft, image.width)
          )
        ]

        if (zoneType === 'rectangle') {
          if (!selectingOrigin) { throw new Error('No coordinates in the state') }

          setSelectingRectangle({
            top: Math.min(selectingOrigin.y, canvasRelativeTop),
            left: Math.min(selectingOrigin.x, canvasRelativeLeft),
            width: Math.max(
              Math.max(selectingOrigin.x, canvasRelativeLeft) -
                Math.min(selectingOrigin.x, canvasRelativeLeft),
              0
            ),
            height: Math.max(
              Math.max(selectingOrigin.y, canvasRelativeTop) -
                Math.min(selectingOrigin.y, canvasRelativeTop),
              0
            )
          })
        } else {
          setPath((path) => [...path ?? [], { x: canvasRelativeLeft, y: canvasRelativeTop }])
        }
        break
      }
      case 2:
      case 3:
        setIsSelecting(false)
        setSelectingOrigin(null)
        setSelectingRectangle(null)
        setSelectionRectangle(null)
        setSelectionBackground(null)
        setSelectionImage(null)
        setPath(null)
        setFreeformSelectionPath(null)
        contextMenuShouldBePrevented.current = true
        break // no default
    }
  }, [image, isSelecting, selectingOrigin, setFreeformSelectionPath, setSelectionBackground, setSelectionImage, setSelectionRectangle, zoneType])
  useLayoutEffect(() => {
    document.addEventListener('pointermove', handleDocumentPointerMove)
    return () => {
      document.removeEventListener('pointermove', handleDocumentPointerMove)
    }
  }, [handleDocumentPointerMove])

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleDocumentPointerUp = useCallback(() => {
    if (isSelecting) {
      if (selectingRectangle) {
        if (selectingRectangle.width > 0 &&
          selectingRectangle.height > 0) {
          setSelectionRectangle(selectingRectangle)
          setSelectionBackground(null)
          setSelectionImage(null)
        } else {
          setSelectionRectangle(null)
          setSelectionBackground(null)
          setSelectionImage(null)
          setIsSelectionActive(false)
        }
      } else if (path) {
        if (path.length > 1) {
          const top = Math.min(...path.map(point => point.y))
          const left = Math.min(...path.map(point => point.x))
          const selectionRectangle = {
            top,
            left,
            width: Math.max(...path.map(point => point.x)) - left,
            height: Math.max(...path.map(point => point.y)) - top
          }
          if (selectionRectangle.width > 0 && selectionRectangle.height > 0) {
            setFreeformSelectionPath(path)
            setSelectionRectangle(selectionRectangle)
            setSelectionBackground(null)
            setSelectionImage(null)
          } else {
            setFreeformSelectionPath(null)
            setSelectionRectangle(null)
            setSelectionBackground(null)
            setSelectionImage(null)
            setIsSelectionActive(false)
          }
        } else {
          setFreeformSelectionPath(null)
          setSelectionRectangle(null)
          setSelectionBackground(null)
          setSelectionImage(null)
          setIsSelectionActive(false)
        }
      } else {
        setSelectionRectangle(null)
        setSelectionBackground(null)
        setSelectionImage(null)
        setIsSelectionActive(false)
      }
    }
    setIsSelecting(false)
    setPath(null)
    setSelectingOrigin(null)
    setSelectingRectangle(null)
  }, [isSelecting, path, selectingRectangle, setFreeformSelectionPath, setIsSelectionActive, setSelectionBackground, setSelectionImage, setSelectionRectangle])
  useEffect(() => {
    document.addEventListener('pointerup', handleDocumentPointerUp)
    return () => {
      document.removeEventListener('pointerup', handleDocumentPointerUp)
    }
  }, [handleDocumentPointerUp])
  // #endregion

  // #region work with existing selection
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleMoving = useCallback(({ top, left, width, height }: Rectangle) => {
    const modifiedCtx = modifiedCanvasRef.current?.getContext('2d')
    if (!modifiedCtx || !selectionRectangle) throw new Error()
    if (!selectionBackground) {
      const backgroundCanvas = document.createElement('canvas')
      backgroundCanvas.width = image.width
      backgroundCanvas.height = image.height
      const backgroundCtx = backgroundCanvas.getContext('2d')
      if (!backgroundCtx) throw new Error()
      backgroundCtx.drawImage(image, 0, 0)
      backgroundCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`
      if (freeformSelectionPath) {
        backgroundCtx.beginPath()
        const [start, ...rest] = freeformSelectionPath
        if (start) {
          backgroundCtx.moveTo(start.x, start.y)
        }
        for (const point of rest) {
          backgroundCtx.lineTo(point.x, point.y)
        }
        backgroundCtx.fill()
      } else {
        backgroundCtx.fillRect(selectionRectangle.left, selectionRectangle.top, selectionRectangle.width, selectionRectangle.height)
      }
      setSelectionBackground(backgroundCanvas)
    }
    if (!selectionImage || selectionRectangle.width !== width || selectionRectangle.height !== height) {
      const selectionCanvas = document.createElement('canvas')
      selectionCanvas.width = selectionRectangle.width
      selectionCanvas.height = selectionRectangle.height
      const selectionCtx = selectionCanvas.getContext('2d')
      if (!selectionCtx) throw new Error()
      if (freeformSelectionPath) {
        selectionCtx.beginPath()
        const [start, ...rest] = freeformSelectionPath
        if (start) {
          selectionCtx.moveTo(start.x - selectionRectangle.left, start.y - selectionRectangle.top)
        }
        for (const point of rest) {
          selectionCtx.lineTo(point.x - selectionRectangle.left, point.y - selectionRectangle.top)
        }
        selectionCtx.clip()
      }
      selectionCtx.drawImage(
        image,
        selectionRectangle.left,
        selectionRectangle.top,
        selectionRectangle.width,
        selectionRectangle.height,
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height
      )
      setSelectionImage(selectionCanvas)
      setFreeformSelectionPath(null)
    }
    setSelectionRectangle({ top, left, width, height })
  }, [freeformSelectionPath, image, secondaryColor, selectionBackground, selectionImage, selectionRectangle, setFreeformSelectionPath, setSelectionBackground, setSelectionImage, setSelectionRectangle])

  const handleResizeOrMoveEnd = useCallback(({ top, left, width, height }: Rectangle) => {
    const modifiedCtx = modifiedCanvasRef.current?.getContext('2d')
    if (!modifiedCtx || !selectionRectangle) throw new Error()
    if (width === selectionRectangle.width && height === selectionRectangle.height) return
    if (!selectionBackground) {
      const backgroundCanvas = document.createElement('canvas')
      backgroundCanvas.width = image.width
      backgroundCanvas.height = image.height
      const backgroundCtx = backgroundCanvas.getContext('2d')
      if (!backgroundCtx) throw new Error()
      backgroundCtx.drawImage(image, 0, 0)
      backgroundCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`
      backgroundCtx.fillRect(selectionRectangle.left, selectionRectangle.top, selectionRectangle.width, selectionRectangle.height)
      setSelectionBackground(backgroundCanvas)
    }
    if (!selectionImage || selectionRectangle.width !== width || selectionRectangle.height !== height) {
      const selectionCanvas = document.createElement('canvas')
      selectionCanvas.width = width
      selectionCanvas.height = height
      const selectionCtx = selectionCanvas.getContext('2d')
      if (!selectionCtx) throw new Error()
      selectionCtx.imageSmoothingEnabled = false
      selectionCtx.drawImage(
        image,
        selectionRectangle.left,
        selectionRectangle.top,
        selectionRectangle.width,
        selectionRectangle.height,
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height
      )
      setSelectionImage(selectionCanvas)
    }
    setSelectionRectangle({ top, left, width, height })
  }, [image, secondaryColor, selectionBackground, selectionImage, selectionRectangle, setSelectionBackground, setSelectionImage, setSelectionRectangle])
  // #endregion

  let El = <></>
  if (isSelecting && selectingRectangle) {
    El = <div
      className="selecting"
      style={{
        top: `${selectingRectangle.top}px`,
        left: `${selectingRectangle.left}px`,
        width: `${selectingRectangle.width}px`,
        height: `${selectingRectangle.height}px`
      }}
    />
  } else if (selectionRectangle) {
    El = <>
      <canvas
        ref={modifiedCanvasRef}
        width={image.width}
        height={image.height}/>
      <MovableSelection
        {...selectionRectangle}
        onResizeEnd={handleResizeOrMoveEnd}
        onMoving={handleMoving}
        onMoveEnd={handleResizeOrMoveEnd}
        hideBorderOnResizing={false}
      />
    </>
  }
  return <div
    className="selection"
    onPointerDown={startSelecting}
    ref={containerRef}>
      <canvas ref={freeformSelectorPathRef} className='freeform-canvas'/>
      {El}
  </div>
}
