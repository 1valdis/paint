import {
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent
} from 'react'

export interface ClickOutsideListener {
  (event: MouseEvent): void
}

const isVisible = (elem: HTMLElement) =>
  !!elem &&
  !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

export function addClickOutsideListener (
  element: HTMLElement,
  callback: ClickOutsideListener
) {
  const outsideClickListener = (event: MouseEvent) => {
    if (!element.contains(event.target as HTMLElement)) {
      if (isVisible(element)) {
        callback(event)
      }
    }
  }

  document.addEventListener('click', outsideClickListener)
  return () => {
    document.removeEventListener('click', outsideClickListener)
  }
}

function componentToHex (c: number) {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function rgbToHex ({ r, g, b }: { r: number; g: number; b: number }) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export function bresenhamLine (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  callback: (x: number, y: number) => void
) {
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy

  while (true) {
    callback(x0, y0)

    if (x0 === x1 && y0 === y1) break
    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}

export function getCanvasCoordsFromEvent (
  canvas: HTMLCanvasElement,
  event: ReactPointerEvent<HTMLCanvasElement> | PointerEvent | ReactMouseEvent
) {
  const { top, left } = canvas.getBoundingClientRect()
  const [mouseX, mouseY] = [event.clientX, event.clientY]
  return [Math.floor(mouseX - left), Math.floor(mouseY - top)]
  // return [Math.floor(event.pageX - canvas.offsetLeft), event.pageY - canvas.offsetTop]
}

export function createCanvas (width?: number, height?: number) {
  const canvas = document.createElement('canvas')
  if (width) canvas.width = width
  if (height) canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error("Couldn't get canvas context")
  return { canvas, context }
}
