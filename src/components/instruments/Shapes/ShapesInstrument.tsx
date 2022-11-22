import { FunctionComponent } from 'react'
import { Shape } from '../../Shapes/Shapes'
import type { ShapesInstrumentProps } from './ShapesInstrumentProps'
import { StraightLine } from './StraightLine'
import { CurvedLine } from './CurvedLine'
import { Polygon } from './Polygon'
import { drawRectangle, VectorForm } from './VectorForms'
import './Shapes.css'

const shapeToComponentMap: Record<Shape, FunctionComponent<ShapesInstrumentProps>> = {
  'straight-line': StraightLine,
  'curved-line': CurvedLine,
  ellipse: VectorForm(drawRectangle),
  rectangle: VectorForm(drawRectangle),
  'rounded-rectangle': VectorForm(drawRectangle),
  polygon: Polygon,
  triangle: VectorForm(drawRectangle),
  'right-triangle': VectorForm(drawRectangle),
  rhombus: VectorForm(drawRectangle),
  pentagon: VectorForm(drawRectangle),
  hexagon: VectorForm(drawRectangle),
  'right-arrow': VectorForm(drawRectangle),
  'left-arrow': VectorForm(drawRectangle),
  'top-arrow': VectorForm(drawRectangle),
  'down-arrow': VectorForm(drawRectangle),
  'four-pointed-star': VectorForm(drawRectangle),
  'five-pointed-star': VectorForm(drawRectangle),
  'six-pointed-star': VectorForm(drawRectangle),
  'rounded-rectangle-bubble': VectorForm(drawRectangle),
  'elliptical-bubble': VectorForm(drawRectangle),
  'cloud-bubble': VectorForm(drawRectangle),
  heart: VectorForm(drawRectangle),
  lightning: VectorForm(drawRectangle)
}

export const ShapesInstrument: FunctionComponent<ShapesInstrumentProps> = (props) => {
  const ShapeElement = shapeToComponentMap[props.shape]
  return <ShapeElement {...props} />
}
