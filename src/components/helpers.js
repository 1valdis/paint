export function addClickOutsideListener (element, callback) {
  const outsideClickListener = event => {
    if (!element.contains(event.target)) {
      if (isVisible(element)) {
        callback()
      }
    }
  }

  document.addEventListener('click', outsideClickListener)
  return outsideClickListener
}

export function removeClickOutsideListener (listener) {
  document.removeEventListener('click', listener)
}

const isVisible = elem =>
  !!elem &&
  !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

function componentToHex (c) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function rgbToHex ({ r, g, b }) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export function bresenhamLine (x0, y0, x1, y1, callback) {
  var dx = Math.abs(x1 - x0)
  var dy = Math.abs(y1 - y0)
  var sx = x0 < x1 ? 1 : -1
  var sy = y0 < y1 ? 1 : -1
  var err = dx - dy

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

export function getCanvasCoordsFromEvent(canvas, e) {
  let { top, left } = canvas.getBoundingClientRect()
  const [mouseX, mouseY] = [e.clientX, e.clientY]
  return [Math.floor(mouseX - left), Math.floor(mouseY - top)]
}
