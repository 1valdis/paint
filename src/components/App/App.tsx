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
import { Selection } from '../instruments/Selection/Selection'
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
  const [selectionRectangle, setSelectionRectangle] = useState<Rectangle | null>(null)
  const [selectionImage, setSelectionImage] = useState<HTMLCanvasElement | null>(null)
  const [selectionBackground, setSelectionBackground] = useState<HTMLCanvasElement | null>(null)
  const [selectionZoneType, setSelectionZoneType] = useState<SelectionZoneType>('rectangle')
  const [freeformSelectionPath, setFreeformSelectionPath] = useState<Array<Point> | null>(null)
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
    setSelectionRectangle(null)
    setSelectionBackground(null)
    setSelectionImage(null)
    setIsSelectionActive(false)
    setSelectionZoneType('rectangle')
  }

  const open = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    try {
      await new Promise<ProgressEvent<FileReader>>((resolve, reject) => {
        reader.readAsDataURL(file)
        reader.onload = resolve
        reader.onerror = reject
      })
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
      setMainCanvas(canvas)
      selectInstrument(instrument)
    } catch (error) {
      alert("Couldn't open file")
    }
  }, [instrument])

  const pasteFromBlob = useCallback((blob: Blob) => {
    const source = window.URL.createObjectURL(blob)
    const pastedImage = new Image()
    pastedImage.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(pastedImage.width, mainCanvas.width)
      canvas.height = Math.max(pastedImage.height, mainCanvas.height)
      const context = canvas.getContext('2d')
      if (!context) throw new Error("Couldn't create context")
      context.fillStyle = `rgb(${secondaryColor.r},${secondaryColor.g},${secondaryColor.b})`
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(mainCanvas, 0, 0)
      updateCanvas(canvas)
      setSelectionBackground(canvas)
      const pastedCanvas = document.createElement('canvas')
      pastedCanvas.width = pastedImage.width
      pastedCanvas.height = pastedImage.height
      const pastedContext = pastedCanvas.getContext('2d')
      if (!pastedContext) throw new Error("Couldn't create context")
      pastedContext.drawImage(pastedImage, 0, 0)
      setSelectionImage(pastedCanvas)
      setSelectionRectangle({ top: 0, left: 0, width: pastedImage.width, height: pastedImage.height })
      setInstrument('selection')
    }
    pastedImage.src = source
  }, [mainCanvas, secondaryColor])

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

  const copy = useCallback(async () => {
    if (!selectionRectangle) return
    const copiedCanvas = document.createElement('canvas')
    copiedCanvas.width = selectionRectangle.width
    copiedCanvas.height = selectionRectangle.height
    const copiedCtx = copiedCanvas.getContext('2d')
    if (!copiedCtx) throw new Error()
    copiedCtx.drawImage(
      mainCanvas,
      selectionRectangle.left,
      selectionRectangle.top,
      selectionRectangle.width,
      selectionRectangle.height,
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
  }, [mainCanvas, selectionRectangle])
  useEffect(() => {
    document.addEventListener('copy', copy)
    return () => {
      document.removeEventListener('copy', copy)
    }
  }, [copy])

  const deleteSelected = useCallback(() => {
    if (!selectionRectangle) return
    const newCanvas = document.createElement('canvas')
    newCanvas.width = mainCanvas.width
    newCanvas.height = mainCanvas.height
    const newCtx = newCanvas.getContext('2d')
    if (!newCtx) throw new Error()
    if (selectionBackground) {
      newCtx.drawImage(selectionBackground, 0, 0)
    } else {
      newCtx.drawImage(mainCanvas, 0, 0)
      newCtx.fillStyle = `rgb(${secondaryColor.r},${secondaryColor.g},${secondaryColor.b})`
      newCtx.fillRect(selectionRectangle.left, selectionRectangle.top, selectionRectangle.width, selectionRectangle.height)
    }
    selectInstrument('selection')
    updateCanvas(newCanvas)
  }, [mainCanvas, secondaryColor, selectionBackground, selectionRectangle])

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
    if (!selectionRectangle) return
    const newCanvas = document.createElement('canvas')
    newCanvas.width = selectionRectangle.width
    newCanvas.height = selectionRectangle.height
    const newCtx = newCanvas.getContext('2d')
    if (!newCtx) throw new Error()
    newCtx.drawImage(mainCanvas, -selectionRectangle.left, -selectionRectangle.top)
    selectInstrument('selection')
    updateCanvas(newCanvas)
  }, [mainCanvas, selectionRectangle])

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
    setSelectionRectangle(newRectangle)
  }, [mainCanvas])

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
        selectionRectangle={selectionRectangle}
        setSelectionRectangle={setSelectionRectangle}
        selectionImage={selectionImage}
        setSelectionImage={setSelectionImage}
        selectionBackground={selectionBackground}
        setSelectionBackground={setSelectionBackground}
        secondaryColor={secondaryColor}
        zoneType={selectionZoneType}
        setFreeformSelectionPath={setFreeformSelectionPath}
        freeformSelectionPath={freeformSelectionPath}
        isSelectionTransparent={isSelectionTransparent}
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
          canCutOrCopy={!!selectionRectangle}
        />
      </NavBarItem>
      <NavBarItem footer="Image">
        <ImagePanel
          instrument={instrument}
          onInstrumentSelect={selectInstrument}
          canModifySelection={!!selectionRectangle}
          handleClipClick={clip}
          zoneType={selectionZoneType}
          selectZoneType={selectZoneType}
          onSelectAll={selectAll}
          onDeleteSelected={deleteSelected}
          isSelectionTransparent={isSelectionTransparent}
          setIsSelectionTransparent={setIsSelectionTransparent}
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
        {isSelectionActive || selectionRectangle
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
