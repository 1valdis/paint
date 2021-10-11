import { useEffect, useRef, useState } from 'react'

import './App.css'

import { FileMenu } from '../NewFileMenu/FileMenu'
import { Canvas } from '../NewCanvas/Canvas'
import { NavBar } from '../NewNavBar/NavBar'
import { NavBarItem } from '../NewNavBar/NavBarItem'
import { Colors } from '../NewColors/Colors'
import { Image, Instruments } from '../NewImage/Image'
import { Clipboard } from '../NewClipboard/Clipboard'
import { createCanvas } from './create-canvas'
import { open } from './open'
import { save } from './save'

export const App = () => {
  const [{ canvas: mainCanvas, context: mainCanvasCtx }, setMainCanvas] = useState(createCanvas())
  const canvasOnDisplayRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvasOnDiplay = canvasOnDisplayRef.current
    if (!canvasOnDiplay) return
    const ctx = canvasOnDiplay.getContext('2d')!
    canvasOnDiplay.width = mainCanvas.width
    canvasOnDiplay.height = mainCanvas.height
    ctx.drawImage(mainCanvas, 0, 0)
  }, [mainCanvas])

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
  const [primaryColor, setPrimaryColor] = useState(0)
  const [secondaryColor, setSecondaryColor] = useState(10)
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary')
  const [instrument, setInstrument] = useState<Instruments>('pen')

  return <>
    <FileMenu
      onFileCreate={() => setMainCanvas(createCanvas())}
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
          selectInstrument={setInstrument}
          image={mainCanvas}
          changeImage={(canvas, context) => setMainCanvas({ canvas, context })}
        />
      </NavBarItem>
      {/* <NavBarItem footer="Instruments">
        <Instruments />
      </NavBarItem> */}
      <NavBarItem footer="Colors">
        <Colors
          colors={colors}
          activeColor={activeColor}
          primary={primaryColor}
          secondary={secondaryColor}
          onActiveColorClick={setActiveColor}
          onColorClick={(index) => activeColor === 'primary'
            ? setPrimaryColor(index)
            : setSecondaryColor(index)
          }
          onColorInputChange={(event) => {
            const hexRgb = event.target.value.match(/[A-Za-z0-9]{2}/g)
            if (!hexRgb) return
            const rgb = hexRgb.map(v => parseInt(v, 16))
            const newColor = { r: rgb[0], g: rgb[1], b: rgb[2] }
            if (colors.find(
              color =>
                color.r === newColor.r &&
                color.g === newColor.g &&
                color.b === newColor.b)) return
            if (colors.length !== 30) {
              setColors([...colors, newColor])
              if (activeColor === 'primary') {
                setPrimaryColor(colors.length)
              } else {
                setSecondaryColor(colors.length)
              }
            } else {
              setColors([
                ...colors.slice(0, 20),
                ...colors.slice(21),
                newColor
              ])
              if (activeColor === 'primary') {
                setPrimaryColor(colors.length - 1)
              } else {
                setSecondaryColor(colors.length - 1)
              }
            }
          }}
        />
      </NavBarItem>
    </NavBar>
    <Canvas ref={canvasOnDisplayRef} />
  </>
}
