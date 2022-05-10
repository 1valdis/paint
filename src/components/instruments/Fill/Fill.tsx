import { MouseEvent, FunctionComponent, useEffect, useRef } from 'react'

import './Fill.css'
import { getCanvasCoordsFromEvent } from '../../../common/helpers'
import { Color } from '../../../common/Color'

export interface FillProps {
  color: Color
  image: HTMLCanvasElement
  onImageChange: (canvas: HTMLCanvasElement) => void
}

type CoordinatePair = [number, number]

// optimized the shit out of it (as I can judge)
const floodFill = (
  data: ImageData,
  x: number,
  y: number,
  colorToReplace: Color,
  colorToFillWith: Color
// eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const replaceR = colorToReplace.r
  const replaceG = colorToReplace.g
  const replaceB = colorToReplace.b
  const fillR = colorToFillWith.r
  const fillG = colorToFillWith.g
  const fillB = colorToFillWith.b

  const i = (y * data.width + x) * 4

  if (
    !(
      replaceR === data.data[i] &&
      replaceG === data.data[i + 1] &&
      replaceB === data.data[i + 2]
    ) ||
    (replaceR === fillR && replaceG === fillG && replaceB === fillB)
  ) {
    return
  }

  const q: CoordinatePair[] = []

  data.data[i] = fillR
  data.data[i + 1] = fillG
  data.data[i + 2] = fillB

  q.push([x, y])

  while (q.length !== 0) {
    const n = q.shift()!
    const i = (n[1] * data.width + n[0]) * 4
    if (
      n[0] > 0 &&
      replaceR === data.data[i - 4] &&
      replaceG === data.data[i - 3] &&
      replaceB === data.data[i - 2]
    ) {
      data.data[i - 4] = fillR
      data.data[i - 3] = fillG
      data.data[i - 2] = fillB
      q.push([n[0] - 1, n[1]])
    }
    if (
      n[0] < data.width - 1 &&
      replaceR === data.data[i + 4] &&
      replaceG === data.data[i + 5] &&
      replaceB === data.data[i + 6]
    ) {
      data.data[i + 4] = fillR
      data.data[i + 5] = fillG
      data.data[i + 6] = fillB
      q.push([n[0] + 1, n[1]])
    }
    if (
      n[1] > 0 &&
      replaceR === data.data[i - data.width * 4] &&
      replaceG === data.data[i - data.width * 4 + 1] &&
      replaceB === data.data[i - data.width * 4 + 2]
    ) {
      data.data[i - data.width * 4] = fillR
      data.data[i - data.width * 4 + 1] = fillG
      data.data[i - data.width * 4 + 2] = fillB
      q.push([n[0], n[1] - 1])
    }
    if (
      n[1] < data.height - 1 &&
      replaceR === data.data[i + data.width * 4] &&
      replaceG === data.data[i + data.width * 4 + 1] &&
      replaceB === data.data[i + data.width * 4 + 2]
    ) {
      data.data[i + data.width * 4] = fillR
      data.data[i + data.width * 4 + 1] = fillG
      data.data[i + data.width * 4 + 2] = fillB
      q.push([n[0], n[1] + 1])
    }
  }
}

// TODO cancellation on right click
export const Fill: FunctionComponent<FillProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const context = canvasRef.current!.getContext('2d')!
    context.drawImage(props.image, 0, 0)
  }, [props.image])

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return
    const [x, y] = getCanvasCoordsFromEvent(canvasRef.current, e)
    const context = canvasRef.current.getContext('2d')!
    const data = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    floodFill(
      data,
      x,
      y,
      {
        r: data.data[(y * data.width + x) * 4]!,
        g: data.data[(y * data.width + x) * 4 + 1]!,
        b: data.data[(y * data.width + x) * 4 + 2]!
      },
      props.color
    )
    context.putImageData(data, 0, 0)
    props.onImageChange(canvasRef.current)
  }

  return (
    <canvas
      className="fill-canvas"
      ref={canvasRef}
      width={props.image.width}
      height={props.image.height}
      onMouseDown={handleMouseDown}
    />
  )
}
