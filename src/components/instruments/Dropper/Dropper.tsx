import { MouseEventHandler, FunctionComponent } from 'react'

import { Color } from '../../../common/Color'

import './Dropper.css'

interface DropperProps {
  image: HTMLCanvasElement
  onColorSelected: (color: Color) => void
}

export const Dropper: FunctionComponent<DropperProps> = (props) => {
  const handleClick: MouseEventHandler = e => {
    if (!e.target || e.target !== e.currentTarget) return

    let {
      top,
      left,
      bottom,
      right
    } = (e.target as HTMLElement).getBoundingClientRect()
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

    const context = props.image.getContext('2d')
    if (!context) throw new Error()
    const imageData = context.getImageData(left, top, 1, 1)

    props.onColorSelected({
      r: imageData.data[0]!,
      g: imageData.data[1]!,
      b: imageData.data[2]!
    })
  }

  return (
    <div
      className="dropper"
      onClick={handleClick}
      style={{
        width: props.image.width,
        height: props.image.height
      }}
    />
  )
}
