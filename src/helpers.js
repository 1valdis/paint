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

export function rgbToHex ({r, g, b}) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}
