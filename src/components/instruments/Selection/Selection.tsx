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
  setIsResizerHidden: (value: boolean) => void
  selectionRectangle: Rectangle | null
  setSelectionRectangle: (value: Rectangle | null) => void
  selectionImage: HTMLCanvasElement | null
  setSelectionImage: (image: HTMLCanvasElement | null) => void
  selectionBackground: HTMLCanvasElement | null
  setSelectionBackground: (image: HTMLCanvasElement | null) => void
}

export const Selection: FunctionComponent<SelectionProps> = ({
  image,
  onImageChange,
  setIsResizerHidden,
  selectionRectangle,
  setSelectionRectangle,
  selectionImage,
  setSelectionImage,
  selectionBackground,
  setSelectionBackground
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [selectingOrigin, setSelectingOrigin] = useState<Point | null>(null)
  const [selectingRectangle, setSelectingRectangle] = useState<Rectangle | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const contextMenuShouldBePrevented = useRef(false)

  const modifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!modifiedCanvasRef.current) return
    const context = modifiedCanvasRef.current!.getContext('2d')!
    context.drawImage(image, 0, 0)
  }, [image])

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

    console.log('should set it, right?')
    setIsSelecting(true)
    setSelectingOrigin({ y: top, x: left })
    setSelectingRectangle(null)
    setIsResizerHidden(true)
  }, [setIsResizerHidden])

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
    // let selectionOriginCoords: Rectangle | null = null
    // also checking if user just clicked without moving (so there's no selectionCoords)
    // if (state.selecting && state.selectingCoords) {
    //   if (
    //     state.selectingCoords.width > 0 &&
    //     state.selectingCoords.height > 0
    //   ) {
    //     this.changeSelection({
    //       coords: state.selectingCoords,
    //       imageData: null
    //     })
    //     selectionOriginCoords = state.selectingCoords
    //   }
    //   return {
    //     selecting: false,
    //     selectingX: null,
    //     selectingY: null,
    //     selectingCoords: null,
    //     selectionOriginCoords
    //   }
    // } else {
    //   return {
    //     selecting: false,
    //     selectingX: null,
    //     selectingY: null
    //   }
    // }
    if (isSelecting && selectingRectangle &&
      selectingRectangle.width > 0 &&
      selectingRectangle.height > 0) {
      setSelectionRectangle(selectingRectangle)
    } else {
      setSelectionRectangle(null)
      setIsResizerHidden(false)
    }
    setIsSelecting(false)
    setSelectingOrigin(null)
    setSelectingRectangle(null)
  }, [isSelecting, selectingRectangle, setIsResizerHidden, setSelectionRectangle])
  useEffect(() => {
    document.addEventListener('pointerup', handleDocumentPointerUp)
    return () => {
      document.removeEventListener('pointerup', handleDocumentPointerUp)
    }
  })
  // #endregion

  // #region work with existing selection
  // const handleResizeEnd = useCallback(() => {
  //   if (!this.newCtx) throw new Error("Coudn't acquire context")
  //   if (!this.backgroundColor) {
  //     this.backgroundColor = this.secondaryColor
  //     this.newCtx.fillStyle = `rgb(${this.backgroundColor.r}, ${this.backgroundColor.g}, ${this.backgroundColor.b})`
  //   }
  //   this.onCoordsChanged({ top, left, width, height })
  //   this.onImageChanged(
  //     this.newCtx.getImageData(
  //       0,
  //       0,
  //       this.newCtx.canvas.width,
  //       this.newCtx.canvas.height
  //     )
  //   )
  // })
  // const handleMoving = useCallback(({ top, left, width, height }: Rectangle) => {
  //   const modifiedCtx = modifiedCanvasRef.current?.getContext('2d')
  //   if (!modifiedCtx || !selectionRectangle || !movedSelectionRectangle) throw new Error('Something is wrong')
  //   if (!usedSecondaryColor) {
  //     setUsedSecondaryColor(secondaryColor)
  //     modifiedCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`
  //   }
  //   setMovedSelectionRectangle({ top, left, width, height })

  //   modifiedCtx.drawImage(image, 0, 0)
  //   modifiedCtx.fillRect(
  //     selectionRectangle.left,
  //     selectionRectangle.top,
  //     selectionRectangle.width,
  //     selectionRectangle.height
  //   )
  //   modifiedCtx.drawImage(
  //     image,
  //     selectionRectangle.left,
  //     selectionRectangle.top,
  //     selectionRectangle.width,
  //     selectionRectangle.height,
  //     movedSelectionRectangle.left,
  //     movedSelectionRectangle.top,
  //     movedSelectionRectangle.width,
  //     movedSelectionRectangle.height
  //   )
  // }, [selectionRectangle, image, movedSelectionRectangle, secondaryColor, usedSecondaryColor])

  // const handleMoveEnd = useCallback(() => {
  //   if (!modifiedCanvasRef.current) throw new Error('Something is wrong')
  //   onImageChange(modifiedCanvasRef.current)
  // }, [onImageChange])
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
        // onResizeEnd={this.handleResizeEnd}
        // onMoving={handleMoving}
        // onMoveEnd={handleMoveEnd}
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
