import { Color } from '../../../common/Color'
import { Shape, ShapeSettingValue } from '../../Shapes/Shapes'

export interface ShapesInstrumentProps {
  shape: Shape
  primaryColor: Color
  secondaryColor: Color
  contour: ShapeSettingValue
  filling: ShapeSettingValue
  image: HTMLCanvasElement
  thickness: number,
  onImageChange: (canvas: HTMLCanvasElement) => void
}
