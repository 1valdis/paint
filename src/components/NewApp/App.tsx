import { useEffect, useRef, useState } from 'react'

import './App.css'

import { FileMenu } from '../NewFileMenu/FileMenu'
import { Canvas } from '../NewCanvas/Canvas'

const createCanvas = () => {
  const canvas = document.createElement('canvas')
  ;[canvas.width, canvas.height] = [800, 450]
  const context = canvas.getContext('2d')!
  context.fillStyle = 'white'
  context.fillRect(0, 0, 800, 450)
  return { canvas, context }
}

const save = async (canvas: HTMLCanvasElement, filename: string) => {
  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve)
  )
  const href = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = filename
  a.href = href
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(href)
}

const open = async (file: File): Promise<{ canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }> => {
  const reader = new FileReader()
  await new Promise<ProgressEvent<FileReader>>(resolve => {
    reader.readAsDataURL(file)
    reader.onload = resolve
  })
  return new Promise(resolve => {
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
        if (!ctx) throw new Error("Coulnd't create context")
        ctx.drawImage(img, 0, 0)
        resolve({ canvas, context: ctx })
      }
    }
  })
}

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

  return <>
    <FileMenu
      onFileCreate={() => setMainCanvas(createCanvas())}
      onFileOpen={async (event) => { event.target.files?.[0] && setMainCanvas(await open(event.target.files[0])) }}
      onDownload={() => save(mainCanvas, filename)}
    ></FileMenu>
    <Canvas ref={canvasOnDisplayRef} />
  </>
}
