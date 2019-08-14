import { PointerEvent as ReactPointerEvent } from 'react'

export interface ClickOutsideListener {
  (event: MouseEvent): void
}

export function addClickOutsideListener(
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
  return outsideClickListener
}

export function removeClickOutsideListener(listener: ClickOutsideListener) {
  document.removeEventListener('click', listener)
}

const isVisible = (elem: HTMLElement) =>
  !!elem &&
  !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

function componentToHex(c: number) {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export function bresenhamLine(
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
    var e2 = 2 * err
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

export function getCanvasCoordsFromEvent(
  canvas: HTMLCanvasElement,
  e: ReactPointerEvent<HTMLCanvasElement> | PointerEvent
) {
  const { top, left } = canvas.getBoundingClientRect()
  const [mouseX, mouseY] = [e.clientX, e.clientY]
  return [Math.floor(mouseX - left), Math.floor(mouseY - top)]
}
