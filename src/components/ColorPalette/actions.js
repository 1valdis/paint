import { types as colorTypes } from '../Colors/actions'

export function selectColor (color) {
  return {
    type: colorTypes.SELECT_COLOR,
    color
  }
}
