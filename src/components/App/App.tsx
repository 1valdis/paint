import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import './App.css'

import { FileMenu } from '../FileMenu/FileMenu'
import { Canvas } from '../Canvas/Canvas'
import { NavBar } from '../NavBar/NavBar'
import { NavBarItem } from '../NavBar/NavBarItem'
import { Colors } from '../Colors/Colors'
import { ImagePanel } from '../Image/Image'
import { Clipboard } from '../Clipboard/Clipboard'
import { Instruments } from '../instruments/Instruments'
import { create } from './create'
import { open } from './open'
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

export const App = () => {
  const [{ canvas: mainCanvas, context: mainCanvasCtx }, setMainCanvas] = useState(create())
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
    setMainCanvas({ canvas, context })
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

  const [isSelectionActive, setIsSelectionActive] = useState(false)
  const [selectionRectangle, setSelectionRectangle] = useState<Rectangle | null>(null)
  const [selectionImage, setSelectionImage] = useState<HTMLCanvasElement | null>(null)
  const [selectionBackground, setSelectionBackground] = useState<HTMLCanvasElement | null>(null)

  const selectInstrument = (instrument: Instrument) => {
    setInstrument(instrument)
    setSelectionRectangle(null)
    setSelectionBackground(null)
    setSelectionImage(null)
  }

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
        context={mainCanvasCtx}
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
        />
      break
  }

  return <>
    <FileMenu
      onFileCreate={() => setMainCanvas(create())}
      onFileOpen={async (event) => { event.target.files?.[0] && setMainCanvas(await open(event.target.files[0])) }}
      onDownload={() => save(mainCanvas, filename)}
    ></FileMenu>
    <NavBar>
      <NavBarItem footer="Clipboard">
        <Clipboard
          canvas={mainCanvas}
          onPaste={pasteFromBlob}
        />
      </NavBarItem>
      <NavBarItem footer="Image">
        <ImagePanel
          instrument={instrument}
          onInstrumentSelect={selectInstrument}
          image={mainCanvas}
          onImageChange={updateCanvas}
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
            key='shmek'
          />}
        {instrumentComponent}
    </Canvas>
  </>
}
