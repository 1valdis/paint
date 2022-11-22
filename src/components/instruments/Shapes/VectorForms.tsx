import { FunctionComponent } from 'react'
import { ShapesInstrumentProps } from './ShapesInstrumentProps'

type DrawForm = (ctx: CanvasRenderingContext2D) => void

export const drawRectangle: DrawForm = (ctx) => {}

export const VectorForm: (drawForm: DrawForm) => FunctionComponent<
  ShapesInstrumentProps
  // eslint-disable-next-line react/display-name
> = (drawForm: DrawForm) => (props) => {
  return <></>
}
