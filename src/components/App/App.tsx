import { useEffect, useRef, useState } from 'react'

import './App.css'

import { FileMenu } from '../FileMenu/FileMenu'
import { Canvas } from '../Canvas/Canvas'
import { NavBar } from '../NavBar/NavBar'
import { NavBarItem } from '../NavBar/NavBarItem'
import { Colors } from '../Colors/Colors'
import { Image, Instrument } from '../Image/Image'
import { Clipboard } from '../Clipboard/Clipboard'
import { Instruments } from '../instruments/Instruments'
import { create } from './create'
import { open } from './open'
import { save } from './save'
import { pasteFromEvent } from './paste-from-event'
import { CanvasResizer } from '../CanvasResizer/CanvasResizer'
import { Color } from '../../common/Color'
import { Pen } from '../instruments/Pen/Pen'
import { Dropper } from '../instruments/Dropper/Dropper'

export const App = () => {
  const [{ canvas: mainCanvas, context: mainCanvasCtx }, setMainCanvas] = useState(create())
  const canvasOnDisplayRef = useRef<HTMLCanvasElement | null>(null)

  const [filename, setFilename] = useState('pic.png')

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
  const [primaryColor, setPrimaryColor] = useState<Color>(colors[0])
  const [secondaryColor, setSecondaryColor] = useState<Color>(colors[10])
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary')
  const [instrument, setInstrument] = useState<Instrument>('pen')

  useEffect(() => {
    const canvasOnDiplay = canvasOnDisplayRef.current
    if (!canvasOnDiplay) return
    const ctx = canvasOnDiplay.getContext('2d')!
    canvasOnDiplay.width = mainCanvas.width
    canvasOnDiplay.height = mainCanvas.height
    ctx.drawImage(mainCanvas, 0, 0)
  })

  useEffect(() => {
    document.addEventListener('paste', pasteFromEvent(mainCanvas, mainCanvasCtx, setMainCanvas))
  })

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
        setPrimaryColor(colors[colors.length])
      } else {
        setSecondaryColor(colors[colors.length])
      }
    } else {
      setColors([
        ...colors.slice(0, 20),
        ...colors.slice(21),
        newColor
      ])
      if (activeColor === 'primary') {
        setPrimaryColor(colors[colors.length - 1])
      } else {
        setSecondaryColor(colors[colors.length - 1])
      }
    }
  }
  // #endregion

  let instrumentComponent = <></>
  switch (instrument) {
    case 'pen':
      instrumentComponent = <Pen
        color={primaryColor}
        image={mainCanvas}
        onImageChange={(canvas, context) => setMainCanvas({ canvas, context })} />
      break
    case 'dropper':
      instrumentComponent = <Dropper
        onColorSelected={(color) => {
          setPrimaryColor(color)
          setInstrument('pen')
        }}
        context={mainCanvasCtx}
      />
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
          onPaste={(canvas, context) => setMainCanvas({ canvas, context })}
        />
      </NavBarItem>
      <NavBarItem footer="Image">
        <Image
          selectionCoords={undefined}
          instrument={instrument}
          onInstrumentSelect={setInstrument}
          image={mainCanvas}
          onImageChange={(canvas, context) => setMainCanvas({ canvas, context })}
        />
      </NavBarItem>
      <NavBarItem footer="Instruments">
        <Instruments
          instrument={instrument}
          onInstrumentSelect={setInstrument}/>
      </NavBarItem>
      <NavBarItem footer="Colors">
        <Colors
          colors={colors}
          activeColor={activeColor}
          primary={primaryColor}
          secondary={secondaryColor}
          onActiveColorClick={setActiveColor}
          onColorClick={(index) => activeColor === 'primary'
            ? setPrimaryColor(colors[index])
            : setSecondaryColor(colors[index])
          }
          onNewColorAdded={addNewColor}
        />
      </NavBarItem>
    </NavBar>
    <Canvas
      ref={canvasOnDisplayRef}
      canvas={mainCanvas}>
      <CanvasResizer
          backgroundColor={secondaryColor}
          canvas={mainCanvas}
          onImageChange={(canvas, context) => setMainCanvas({ canvas, context })}
        />
      {instrumentComponent}
    </Canvas>
  </>
}
