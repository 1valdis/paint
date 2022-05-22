import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import './normalize.css'
import './App.css'

import { FileMenu } from '../FileMenu/FileMenu'
import { Canvas } from '../Canvas/Canvas'
import { NavBar } from '../NavBar/NavBar'
import { NavBarItem } from '../NavBar/NavBarItem'
import { Colors } from '../Colors/Colors'
import { ImagePanel } from '../Image/Image'
import { Clipboard } from '../Clipboard/Clipboard'
import { Instruments } from '../instruments/Instruments'
import { save } from './save'
import { CanvasResizer } from '../CanvasResizer/CanvasResizer'
import { Color } from '../../common/Color'
import { Pen } from '../instruments/Pen/Pen'
import { Dropper } from '../instruments/Dropper/Dropper'
import { Fill } from '../instruments/Fill/Fill'
import { Eraser } from '../instruments/Eraser/Eraser'
import { Selection, SelectionDetails } from '../instruments/Selection/Selection'
import { Rectangle } from '../../common/Rectangle'
import { Instrument } from '../../common/Instrument'
import { SelectionZoneType } from '../../common/SelectionZoneType'
import { Point } from '../../common/Point'

export const App = () => {
  const create = useCallback(() => {
    const canvas = document.createElement('canvas')
    ;[canvas.width, canvas.height] = [800, 450]
    const context = canvas.getContext('2d')!
    context.fillStyle = 'white'
    context.fillRect(0, 0, 800, 450)
    return canvas
  }, [])

  const [mainCanvas, setMainCanvas] = useState(create())
  const canvasOnDisplayRef = useRef<HTMLCanvasElement | null>(null)

  const [filename] = useState('pic.png')

  const [colors, setColors] = useState([
    { r: 0, g: 0, b: 0 },
    { r: 127, g: 127, b: 127 },
    { r: 136, g: 0, b: 21 },
    { r: 237, g: 28, b: 36 },
    { r: 255, g: 127, b: 39 },
    { r: 255, g: 242, b: 0 },
    { r: 34, g: 177, b: 76 },
    { r: 0, g: 162, b: 232 },
    { r: 63, g: 72, b: 204 },
    { r: 163, g: 73, b: 164 },
    { r: 255, g: 255, b: 255 },
    { r: 195, g: 195, b: 195 },
    { r: 185, g: 122, b: 87 },
    { r: 255, g: 174, b: 201 },
    { r: 255, g: 201, b: 14 },
    { r: 239, g: 228, b: 176 },
    { r: 181, g: 230, b: 29 },
    { r: 153, g: 217, b: 234 },
    { r: 112, g: 176, b: 190 },
    { r: 200, g: 191, b: 231 }
  ])
  const [primaryColor, setPrimaryColor] = useState<Color>(colors[0]!)
  const [secondaryColor, setSecondaryColor] = useState<Color>(colors[10]!)
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary')
  const [instrument, setInstrument] = useState<Instrument>('pen')

  const [isSelectionActive, setIsSelectionActive] = useState(false)
  const [selectionDetails, setSelectionDetails] = useState<SelectionDetails | null>(null)
  const [selectionZoneType, setSelectionZoneType] = useState<SelectionZoneType>('rectangle')
  const [isSelectionTransparent, setIsSelectionTransparent] = useState(false)

  useLayoutEffect(() => {
    const canvasOnDiplay = canvasOnDisplayRef.current
    if (!canvasOnDiplay) return
    const ctx = canvasOnDiplay.getContext('2d')!
    canvasOnDiplay.width = mainCanvas.width
    canvasOnDiplay.height = mainCanvas.height
    ctx.drawImage(mainCanvas, 0, 0)
  }, [mainCanvas])

  const updateCanvas = (newCanvas: HTMLCanvasElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = newCanvas.width
    canvas.height = newCanvas.height
    const context = canvas.getContext('2d')!
    context.drawImage(newCanvas, 0, 0)
    setMainCanvas(canvas)
  }

  // #region functions
  const addNewColor = (newColor: Color) => {
    if (colors.find(
      color =>
        color.r === newColor.r &&
        color.g === newColor.g &&
        color.b === newColor.b)) return
    if (colors.length !== 30) {
      setColors([...colors, newColor])
      if (activeColor === 'primary') {
        setPrimaryColor(newColor)
      } else {
        setSecondaryColor(newColor)
      }
    } else {
      setColors([
        ...colors.slice(0, 20),
        ...colors.slice(21),
        newColor
      ])
      if (activeColor === 'primary') {
        setPrimaryColor(newColor)
      } else {
        setSecondaryColor(newColor)
      }
    }
  }
  // #endregion

  const selectInstrument = (instrument: Instrument) => {
    setInstrument(instrument)
    setSelectionDetails(null)
    setIsSelectionActive(false)
    setSelectionZoneType('rectangle')
  }

  const openFileAsCanvas = useCallback(async (event: ChangeEvent<HTMLInputElement>): Promise<HTMLCanvasElement | null> => {
    const file = event.target.files?.[0]
    if (!file) return null
    const reader = new FileReader()
    try {
      await new Promise<ProgressEvent<FileReader>>((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = resolve
        reader.onerror = reject
      })
      // to catch error
      // eslint-disable-next-line sonarjs/prefer-immediate-return
      const canvas = await new Promise<HTMLCanvasElement>((resolve, reject) => {
        reader.readAsDataURL(file as Blob)
        reader.onload = e => {
          if (!e.target) throw new Error("Couldn't access FileReader from event")
          const img = new Image()
          img.src = e.target.result as string
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (!ctx) return reject(new Error())
            ctx.drawImage(img, 0, 0)
            resolve(canvas)
          }
          img.onerror = reject
        }
      })
      return canvas
    } catch (error) {
      alert("Couldn't open file")
      return null
    }
  }, [])

  const createSelectionDetailsFromPastedImage = useCallback((pastedImage: HTMLImageElement | HTMLCanvasElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(pastedImage.width, mainCanvas.width)
    canvas.height = Math.max(pastedImage.height, mainCanvas.height)
    const context = canvas.getContext('2d')
    if (!context) throw new Error()
    context.fillStyle = `rgb(${secondaryColor.r},${secondaryColor.g},${secondaryColor.b})`
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(mainCanvas, 0, 0)
    const pastedCanvas = document.createElement('canvas')
    pastedCanvas.width = pastedImage.width
    pastedCanvas.height = pastedImage.height
    const pastedContext = pastedCanvas.getContext('2d')
    if (!pastedContext) throw new Error()
    pastedContext.drawImage(pastedImage, 0, 0)
    if (isSelectionTransparent) {
      const imageData = pastedContext.getImageData(0, 0, pastedCanvas.width, pastedCanvas.height)
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (secondaryColor.r === imageData.data[i] &&
            secondaryColor.g === imageData.data[i + 1] &&
            secondaryColor.b === imageData.data[i + 2]) {
          imageData.data[i + 3] = 0
        }
      }
      pastedContext.putImageData(imageData, 0, 0)
    }
    const newMainCanvas = document.createElement('canvas')
    newMainCanvas.width = canvas.width
    newMainCanvas.height = canvas.height
    const newMainCanvasContext = newMainCanvas.getContext('2d')
    if (!newMainCanvasContext) throw new Error()
    newMainCanvasContext.drawImage(canvas, 0, 0)
    newMainCanvasContext.drawImage(pastedCanvas, 0, 0)
    updateCanvas(newMainCanvas)
    setSelectionDetails({
      background: canvas,
      image: pastedCanvas,
      rectangle: { top: 0, left: 0, width: pastedImage.width, height: pastedImage.height }
    })
    setInstrument('selection')
  }, [mainCanvas, secondaryColor, isSelectionTransparent])

  const createSelectionDetailsFromRectangle = useCallback((rectangle: Rectangle) => {
    if (rectangle.width === 0 && rectangle.height === 0) {
      setSelectionDetails(null)
      return
    }
    const backgroundCanvas = document.createElement('canvas')
    backgroundCanvas.width = mainCanvas.width
    backgroundCanvas.height = mainCanvas.height
    const backgroundCtx = backgroundCanvas.getContext('2d')
    if (!backgroundCtx) throw new Error()
    backgroundCtx.drawImage(mainCanvas, 0, 0)
    backgroundCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`
    backgroundCtx.fillRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height)

    const selectionCanvas = document.createElement('canvas')
    selectionCanvas.width = rectangle.width
    selectionCanvas.height = rectangle.height
    const selectionCtx = selectionCanvas.getContext('2d')
    if (!selectionCtx) throw new Error()
    selectionCtx.drawImage(
      mainCanvas,
      rectangle.left,
      rectangle.top,
      rectangle.width,
      rectangle.height,
      0,
      0,
      selectionCanvas.width,
      selectionCanvas.height
    )
    if (isSelectionTransparent) {
      const imageData = selectionCtx.getImageData(0, 0, selectionCanvas.width, selectionCanvas.height)
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (secondaryColor.r === imageData.data[i] &&
            secondaryColor.g === imageData.data[i + 1] &&
            secondaryColor.b === imageData.data[i + 2]) {
          imageData.data[i + 3] = 0
        }
      }
      selectionCtx.putImageData(imageData, 0, 0)
    }
    setSelectionDetails({
      background: backgroundCanvas,
      image: selectionCanvas,
      rectangle
    })
  }, [isSelectionTransparent, mainCanvas, secondaryColor])

  const createSelectionDetailsFromPointSequence = useCallback((path: Point[]) => {
    if (path.length <= 1) {
      setSelectionDetails(null)
      setIsSelectionActive(false)
      return
    }

    const top = Math.min(...path.map(point => point.y))
    const left = Math.min(...path.map(point => point.x))
    const rectangle = {
      top,
      left,
      width: Math.max(...path.map(point => point.x)) - left,
      height: Math.max(...path.map(point => point.y)) - top
    }
    if (rectangle.width === 0 && rectangle.height === 0) {
      setSelectionDetails(null)
      setIsSelectionActive(false)
      return
    }

    const backgroundCanvas = document.createElement('canvas')
    backgroundCanvas.width = mainCanvas.width
    backgroundCanvas.height = mainCanvas.height
    const backgroundCtx = backgroundCanvas.getContext('2d')
    if (!backgroundCtx) throw new Error()
    backgroundCtx.drawImage(mainCanvas, 0, 0)
    backgroundCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`

    backgroundCtx.beginPath()
    const [start, ...rest] = path as [Point, ...Point[]]
    backgroundCtx.moveTo(start.x, start.y)
    for (const point of rest) {
      backgroundCtx.lineTo(point.x, point.y)
    }
    backgroundCtx.fill()

    const selectionCanvas = document.createElement('canvas')
    selectionCanvas.width = rectangle.width
    selectionCanvas.height = rectangle.height
    const selectionCtx = selectionCanvas.getContext('2d')
    if (!selectionCtx) throw new Error()
    selectionCtx.imageSmoothingEnabled = false
    selectionCtx.beginPath()
    selectionCtx.moveTo(start.x - rectangle.left, start.y - rectangle.top)
    for (const point of rest) {
      selectionCtx.lineTo(point.x - rectangle.left, point.y - rectangle.top)
    }
    selectionCtx.clip()
    selectionCtx.drawImage(
      mainCanvas,
      rectangle.left,
      rectangle.top,
      rectangle.width,
      rectangle.height,
      0,
      0,
      selectionCanvas.width,
      selectionCanvas.height
    )
    if (isSelectionTransparent) {
      const imageData = selectionCtx.getImageData(0, 0, selectionCanvas.width, selectionCanvas.height)
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (secondaryColor.r === imageData.data[i] &&
          secondaryColor.g === imageData.data[i + 1] &&
          secondaryColor.b === imageData.data[i + 2]) {
          imageData.data[i + 3] = 0
        }
      }
      selectionCtx.putImageData(imageData, 0, 0)
    }
    setSelectionDetails({
      background: backgroundCanvas,
      image: selectionCanvas,
      rectangle
    })
  }, [isSelectionTransparent, mainCanvas, secondaryColor])

  const open = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const canvas = await openFileAsCanvas(event)
    if (!canvas) return
    setMainCanvas(canvas)
    selectInstrument(instrument)
  }, [instrument, openFileAsCanvas])

  const pasteFromFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const canvas = await openFileAsCanvas(event)
    if (!canvas) return
    createSelectionDetailsFromPastedImage(canvas)
  }, [createSelectionDetailsFromPastedImage, openFileAsCanvas])

  const pasteFromBlob = useCallback((blob: Blob) => {
    const source = window.URL.createObjectURL(blob)
    const pastedImage = new Image()
    pastedImage.onload = () => {
      createSelectionDetailsFromPastedImage(pastedImage)
    }
    pastedImage.src = source
  }, [createSelectionDetailsFromPastedImage])

  const pasteFromCtrlV = useCallback((e: ClipboardEvent) => {
    if (e.clipboardData) {
      const items = e.clipboardData.items
      if (!items) return

      const imageClipboardItem = [...items].find(item => item.type.indexOf('image') !== -1)
      if (!imageClipboardItem) return

      const blob = imageClipboardItem.getAsFile()
      if (!blob) return
      pasteFromBlob(blob)
      e.preventDefault()
    }
  }, [pasteFromBlob])
  useEffect(() => {
    document.addEventListener('paste', pasteFromCtrlV)
    return () => {
      document.removeEventListener('paste', pasteFromCtrlV)
    }
  }, [pasteFromCtrlV])

  const invertSelectedZone = useCallback(() => {
    if (!selectionDetails) {
      return
    }
    const backgroundCanvas = document.createElement('canvas')
    backgroundCanvas.width = mainCanvas.width
    backgroundCanvas.height = mainCanvas.height
    const backgroundCtx = backgroundCanvas.getContext('2d')
    if (!backgroundCtx) throw new Error()
    backgroundCtx.fillStyle = `rgb(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b})`
    backgroundCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height)
    backgroundCtx.drawImage(selectionDetails.image, selectionDetails.rectangle.left, selectionDetails.rectangle.top)

    const selectionCanvas = document.createElement('canvas')
    selectionCanvas.width = mainCanvas.width
    selectionCanvas.height = mainCanvas.height
    const selectionCtx = selectionCanvas.getContext('2d')
    if (!selectionCtx) throw new Error()
    selectionCtx.drawImage(selectionDetails.background, 0, 0)
    if (isSelectionTransparent) {
      const imageData = selectionCtx.getImageData(0, 0, selectionCanvas.width, selectionCanvas.height)
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (secondaryColor.r === imageData.data[i] &&
            secondaryColor.g === imageData.data[i + 1] &&
            secondaryColor.b === imageData.data[i + 2]) {
          imageData.data[i + 3] = 0
        }
      }
      selectionCtx.putImageData(imageData, 0, 0)
    }
    selectionCtx.globalCompositeOperation = 'destination-out'
    selectionCtx.drawImage(selectionDetails.image, selectionDetails.rectangle.left, selectionDetails.rectangle.top)
    selectionCtx.globalCompositeOperation = 'source-over'

    setSelectionDetails({
      background: backgroundCanvas,
      image: selectionCanvas,
      rectangle: { top: 0, left: 0, width: mainCanvas.width, height: mainCanvas.height }
    })
  }, [isSelectionTransparent, mainCanvas, secondaryColor, selectionDetails])

  const copy = useCallback(async () => {
    if (!selectionDetails) return
    const copiedCanvas = document.createElement('canvas')
    copiedCanvas.width = selectionDetails.rectangle.width
    copiedCanvas.height = selectionDetails.rectangle.height
    const copiedCtx = copiedCanvas.getContext('2d')
    if (!copiedCtx) throw new Error()
    copiedCtx.drawImage(
      mainCanvas,
      selectionDetails.rectangle.left,
      selectionDetails.rectangle.top,
      selectionDetails.rectangle.width,
      selectionDetails.rectangle.height,
      0,
      0,
      copiedCanvas.width,
      copiedCanvas.height
    )
    const blob = await new Promise<Blob | null>(resolve =>
      copiedCanvas.toBlob(resolve, 'image/png', 1)
    )
    if (!blob) throw new Error("Couldn't acquire blob from canvas")
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
  }, [mainCanvas, selectionDetails])
  useEffect(() => {
    document.addEventListener('copy', copy)
    return () => {
      document.removeEventListener('copy', copy)
    }
  }, [copy])

  const deleteSelected = useCallback(() => {
    if (!selectionDetails) return
    const newCanvas = document.createElement('canvas')
    newCanvas.width = mainCanvas.width
    newCanvas.height = mainCanvas.height
    const newCtx = newCanvas.getContext('2d')
    if (!newCtx) throw new Error()
    newCtx.drawImage(selectionDetails.background, 0, 0)
    selectInstrument('selection')
    updateCanvas(newCanvas)
  }, [mainCanvas, selectionDetails])

  const cut = useCallback(async () => {
    copy()
    deleteSelected()
  }, [copy, deleteSelected])
  useEffect(() => {
    document.addEventListener('cut', cut)
    return () => {
      document.removeEventListener('cut', cut)
    }
  }, [cut])

  const clip = useCallback(async () => {
    if (!selectionDetails) return
    const newCanvas = document.createElement('canvas')
    newCanvas.width = selectionDetails.rectangle.width
    newCanvas.height = selectionDetails.rectangle.height
    const newCtx = newCanvas.getContext('2d')
    if (!newCtx) throw new Error()
    newCtx.drawImage(mainCanvas, -selectionDetails.rectangle.left, -selectionDetails.rectangle.top)
    selectInstrument('selection')
    updateCanvas(newCanvas)
  }, [mainCanvas, selectionDetails])

  const selectZoneType = useCallback((type: SelectionZoneType) => {
    selectInstrument('selection')
    setSelectionZoneType(type)
  }, [])

  const selectAll = useCallback(() => {
    const newRectangle = {
      top: 0,
      left: 0,
      width: mainCanvas.width,
      height: mainCanvas.height
    }
    selectInstrument('selection')
    setSelectionZoneType('rectangle')
    createSelectionDetailsFromRectangle(newRectangle)
  }, [createSelectionDetailsFromRectangle, mainCanvas])

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!(e.ctrlKey && e.code === 'KeyA')) return
      selectAll()
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [selectAll])

  let instrumentComponent = <></>
  switch (instrument) {
    case 'pen':
      instrumentComponent = <Pen
        color={primaryColor}
        image={mainCanvas}
        onImageChange={updateCanvas} />
      break
    case 'dropper':
      instrumentComponent = <Dropper
        onColorSelected={(color) => {
          setPrimaryColor(color)
          setInstrument('pen')
        }}
        image={mainCanvas}
      />
      break
    case 'fill':
      instrumentComponent = <Fill
        color={primaryColor}
        image={mainCanvas}
        onImageChange={updateCanvas}
      />
      break
    case 'eraser':
      instrumentComponent = <Eraser
        color={secondaryColor}
        image={mainCanvas}
        onImageChange={updateCanvas}
        thickness={8}
      />
      break
    case 'selection':
      instrumentComponent = <Selection
        image={mainCanvas}
        onImageChange={updateCanvas}
        setIsSelectionActive={setIsSelectionActive}
        selectionDetails={selectionDetails}
        setSelectionDetails={setSelectionDetails}
        createSelectionDetailsFromRectangle={createSelectionDetailsFromRectangle}
        createSelectionDetailsFromPointSequence={createSelectionDetailsFromPointSequence}
        zoneType={selectionZoneType}
        />
      break
  }

  return <>
    <FileMenu
      onFileCreate={() => { setMainCanvas(create()); selectInstrument(instrument) }}
      onFileOpen={open}
      onDownload={() => save(mainCanvas, filename)}
    ></FileMenu>
    <NavBar>
      <NavBarItem footer="Clipboard">
        <Clipboard
          onPaste={pasteFromBlob}
          onCopy={copy}
          onCut={cut}
          canCutOrCopy={!!selectionDetails}
          onPasteFromFile={pasteFromFile}
        />
      </NavBarItem>
      <NavBarItem footer="Image">
        <ImagePanel
          instrument={instrument}
          onInstrumentSelect={selectInstrument}
          canModifySelection={!!selectionDetails}
          handleClipClick={clip}
          zoneType={selectionZoneType}
          selectZoneType={selectZoneType}
          onSelectAll={selectAll}
          onDeleteSelected={deleteSelected}
          isSelectionTransparent={isSelectionTransparent}
          setIsSelectionTransparent={setIsSelectionTransparent}
          onInvertSelectedZone={invertSelectedZone}
        />
      </NavBarItem>
      <NavBarItem footer="Instruments">
        <Instruments
          instrument={instrument}
          onInstrumentSelect={selectInstrument}/>
      </NavBarItem>
      <NavBarItem footer="Colors">
        <Colors
          colors={colors}
          activeColor={activeColor}
          primary={primaryColor}
          secondary={secondaryColor}
          onActiveColorClick={setActiveColor}
          onColorClick={(index) => activeColor === 'primary'
            ? setPrimaryColor(colors[index]!)
            : setSecondaryColor(colors[index]!)
          }
          onNewColorAdded={addNewColor}
        />
      </NavBarItem>
    </NavBar>
    <Canvas
      ref={canvasOnDisplayRef}
      canvas={mainCanvas}>
        {isSelectionActive || selectionDetails
          ? null
          : <CanvasResizer
            backgroundColor={secondaryColor}
            canvas={mainCanvas}
            onImageChange={updateCanvas}
          />}
        {instrumentComponent}
    </Canvas>
  </>
}
