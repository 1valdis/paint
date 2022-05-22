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
import { Point } from '../../../common/Point'
import { MovableSelection } from './MovableSelection/MovableSelection'

// the selection is not working quite right:
// there's no way a person can select the full width
// of the picture, because max coordinate is width-1.
// interesting that full height is selectable though.
// at least it works somehow, will polish it later maybe.

import './Selection.css'
import { SelectionZoneType } from '../../../common/SelectionZoneType'

export type SelectionDetails = {
  rectangle: Rectangle
  image: HTMLCanvasElement
  background: HTMLCanvasElement
}

export interface SelectionProps {
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
  setIsSelectionActive: (value: boolean) => void
  selectionDetails: SelectionDetails | null
  setSelectionDetails: (selectionDetails: SelectionDetails | null) => void
  createSelectionDetailsFromRectangle: (rectangle: Rectangle) => void
  createSelectionDetailsFromPointSequence: (points: Array<Point>) => void
  zoneType: SelectionZoneType
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
  selectionDetails,
  setSelectionDetails,
  createSelectionDetailsFromRectangle,
  createSelectionDetailsFromPointSequence,
  zoneType
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

  const prevSelectionDetails = usePrevious(selectionDetails)

  useLayoutEffect(() => {
    if (!modifiedCanvasRef.current) return
    modifiedCanvasRef.current.width = image.width
    modifiedCanvasRef.current.height = image.height
    const context = modifiedCanvasRef.current.getContext('2d')!
    if (selectionDetails &&
      (prevSelectionDetails?.background !== selectionDetails.background ||
        prevSelectionDetails?.image !== selectionDetails.image ||
        prevSelectionDetails?.rectangle !== selectionDetails.rectangle)) {
      context.drawImage(selectionDetails.background, 0, 0)
      context.drawImage(selectionDetails.image, selectionDetails.rectangle.left, selectionDetails.rectangle.top)
      onImageChange(modifiedCanvasRef.current)
    } else {
      context.drawImage(image, 0, 0)
    }
  }, [image, onImageChange, prevSelectionDetails, selectionDetails])

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
    setSelectionDetails(null)
  }, [setIsSelectionActive, setSelectionDetails, zoneType])

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
        setSelectionDetails(null)
        setPath(null)
        contextMenuShouldBePrevented.current = true
        break // no default
    }
  }, [image, isSelecting, selectingOrigin, setSelectionDetails, zoneType])
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
        createSelectionDetailsFromRectangle(selectingRectangle)
      } else if (path) {
        createSelectionDetailsFromPointSequence(path)
      } else {
        setSelectionDetails(null)
      }
      setIsSelectionActive(false)
    }
    setIsSelecting(false)
    setPath(null)
    setSelectingOrigin(null)
    setSelectingRectangle(null)
  }, [createSelectionDetailsFromPointSequence, createSelectionDetailsFromRectangle, isSelecting, path, selectingRectangle, setIsSelectionActive, setSelectionDetails])
  useEffect(() => {
    document.addEventListener('pointerup', handleDocumentPointerUp)
    return () => {
      document.removeEventListener('pointerup', handleDocumentPointerUp)
    }
  }, [handleDocumentPointerUp])
  // #endregion

  // #region work with existing selection
  const handleMoving = useCallback(({ top, left, width, height }: Rectangle) => {
    const modifiedCtx = modifiedCanvasRef.current?.getContext('2d')
    if (!modifiedCtx || !selectionDetails) throw new Error()
    if (selectionDetails.rectangle.width === width && selectionDetails.rectangle.height === height) {
      setSelectionDetails({
        background: selectionDetails.background,
        image: selectionDetails.image,
        rectangle: { top, left, width, height }
      })
      return
    }

    const selectionCanvas = document.createElement('canvas')
    selectionCanvas.width = width
    selectionCanvas.height = height
    const selectionCtx = selectionCanvas.getContext('2d')
    if (!selectionCtx) throw new Error()
    selectionCtx.imageSmoothingEnabled = false
    selectionCtx.drawImage(
      selectionDetails.image,
      0,
      0,
      selectionDetails.image.width,
      selectionDetails.image.height,
      0,
      0,
      width,
      height
    )
    setSelectionDetails({
      background: selectionDetails.background,
      image: selectionCanvas,
      rectangle: { top, left, width, height }
    })
  }, [selectionDetails, setSelectionDetails])

  const handleResizeOrMoveEnd = useCallback(({ top, left, width, height }: Rectangle) => {
    handleMoving({ top, left, width, height })
    onImageChange(modifiedCanvasRef.current!)
  }, [handleMoving, onImageChange])
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
  } else if (selectionDetails) {
    El = <>
      <canvas
        ref={modifiedCanvasRef}
        width={image.width}
        height={image.height}/>
      <MovableSelection
        {...selectionDetails.rectangle}
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
