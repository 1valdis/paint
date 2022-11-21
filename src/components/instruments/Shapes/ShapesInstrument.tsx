import { FunctionComponent } from 'react'
import { Shape } from '../../Shapes/Shapes'
import type { ShapesInstrumentProps } from './ShapesInstrumentProps'
import { StraightLine } from './StraightLine'
import { CurvedLine } from './CurvedLine'
import { Polygon } from './Polygon'

const shapeToComponentMap: Record<Shape, FunctionComponent<ShapesInstrumentProps>> = {
  'straight-line': StraightLine,
  'curved-line': CurvedLine,
  ellipse: undefined,
  rectangle: undefined,
  'rounded-rectangle': undefined,
  polygon: Polygon,
  triangle: undefined,
  'right-triangle': undefined,
  rhombus: undefined,
  pentagon: undefined,
  hexagon: undefined,
  'right-arrow': undefined,
  'left-arrow': undefined,
  'top-arrow': undefined,
  'down-arrow': undefined,
  'four-pointed-star': undefined,
  'five-pointed-star': undefined,
  'six-pointed-star': undefined,
  'rounded-rectangle-bubble': undefined,
  'elliptical-bubble': undefined,
  'cloud-bubble': undefined,
  heart: undefined,
  lightning: undefined
}

export const ShapesInstrument: FunctionComponent<ShapesInstrumentProps> = (props) => {
  const ShapeElement = shapeToComponentMap[props.shape]
  return ShapeElement ? <ShapeElement {...props} /> : null
}
