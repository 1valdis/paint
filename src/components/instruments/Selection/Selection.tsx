import {
  PointerEvent as ReactPointerEvent,
  FunctionComponent,
  useRef,
  useState,
  useCallback,
  useEffect
} from 'react'

// import { ZoneSelection } from '../ZoneSelection/ZoneSelection'
// import { ImageDataSelection } from '../ImageDataSelection/ImageDataSelection'
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
  secondaryColor
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectingOrigin, setSelectingOrigin] = useState<Point | null>(null)
  const [selectingRectangle, setSelectingRectangle] = useState<Rectangle | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const contextMenuShouldBePrevented = useRef(false)

  const modifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!modifiedCanvasRef.current) return
    modifiedCanvasRef.current.width = image.width
    modifiedCanvasRef.current.height = image.height
    const context = modifiedCanvasRef.current.getContext('2d')!
    if (selectionBackground && selectionImage && selectionRectangle) {
      context.drawImage(selectionBackground, 0, 0)
      context.drawImage(selectionImage, selectionRectangle.left, selectionRectangle.top)
      onImageChange(modifiedCanvasRef.current)
    } else {
      context.drawImage(image, 0, 0)
    }
  }, [image, onImageChange, selectionBackground, selectionImage, selectionRectangle])

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

    setIsSelecting(true)
    setSelectingOrigin({ y: top, x: left })
    setSelectingRectangle(null)
    setIsSelectionActive(true)
  }, [setIsSelectionActive])

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

        // console.log(canvasRelativeTop, canvasRelativeLeft)

        if (!selectingOrigin) { throw new Error('No coordinates in the state') }

        // maybe change to function
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
        break
      }
      case 2:
      case 3:
        setIsSelecting(false)
        setSelectingOrigin(null)
        setSelectingRectangle(null)
        contextMenuShouldBePrevented.current = true
        break // no default
    }
  }, [image, isSelecting, selectingOrigin, setIsSelecting])
  useEffect(() => {
    document.addEventListener('pointermove', handleDocumentPointerMove)
    return () => {
      document.removeEventListener('pointermove', handleDocumentPointerMove)
    }
  }, [handleDocumentPointerMove])

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
      } else {
        setSelectionRectangle(null)
        setSelectionBackground(null)
        setSelectionImage(null)
        setIsSelectionActive(false)
      }
    }
    setIsSelecting(false)
    setSelectingOrigin(null)
    setSelectingRectangle(null)
  }, [isSelecting, selectingRectangle, setIsSelectionActive, setSelectionBackground, setSelectionImage, setSelectionRectangle])
  useEffect(() => {
    document.addEventListener('pointerup', handleDocumentPointerUp)
    return () => {
      document.removeEventListener('pointerup', handleDocumentPointerUp)
    }
  })
  // #endregion

  // #region work with existing selection
  const handleMoving = useCallback(({ top, left, width, height }: Rectangle) => {
    const modifiedCtx = modifiedCanvasRef.current?.getContext('2d')
    if (!modifiedCtx || !selectionRectangle) throw new Error('Something is wrong')
    if (!selectionBackground) {
      const backgroundCanvas = document.createElement('canvas')
      backgroundCanvas.width = image.width
      backgroundCanvas.height = image.height
      const backgroundCtx = backgroundCanvas.getContext('2d')
      if (!backgroundCtx) throw new Error("Couldn't get context")
      backgroundCtx.drawImage(image, 0, 0)
      backgroundCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`
      backgroundCtx.fillRect(selectionRectangle.left, selectionRectangle.top, selectionRectangle.width, selectionRectangle.height)
      setSelectionBackground(backgroundCanvas)
    }
    if (!selectionImage || selectionRectangle.width !== width || selectionRectangle.height !== height) {
      const selectionCanvas = document.createElement('canvas')
      selectionCanvas.width = selectionRectangle.width
      selectionCanvas.height = selectionRectangle.height
      const selectionCtx = selectionCanvas.getContext('2d')
      if (!selectionCtx) throw new Error("Couldn't get context")
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

  const handleMoveEndOrResize = useCallback(() => {
    if (!modifiedCanvasRef.current) throw new Error('Something is wrong')
    onImageChange(modifiedCanvasRef.current)
  }, [onImageChange])
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
        onResizeEnd={handleMoving}
        onMoving={handleMoving}
        onMoveEnd={handleMoveEndOrResize}
        hideBorderOnResizing={false}
      />
    </>
  }
  return <div
    className="selection"
    onPointerDown={startSelecting}
    ref={containerRef}>
      {El}
  </div>
}
