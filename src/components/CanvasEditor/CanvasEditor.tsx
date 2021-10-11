import { FunctionComponent } from 'react'
import { Instrument } from '../Image/Image'

// import { SelectionInstrument } from '../instruments/SelectionInstrument/SelectionInstrument';
// import { Pen } from '../instruments/Pen/Pen'
// import { Fill } from '../instruments/Fill/Fill'
// import { Dropper } from '../instruments/Dropper/Dropper'
// import { Eraser } from '../instruments/Eraser/Eraser'

const instruments = {
  pen: null,
  fill: null,
  // selection: SelectionInstrument,
  dropper: null,
  eraser: null,
  text: null,
  zoom: null,
  brushes: null,
  shapes: null,
  selection: null
}

interface CanvasEditorProps {
  instrument: Instrument
}

export const CanvasEditor: FunctionComponent<CanvasEditorProps> = props => {
  const El = instruments[props.instrument]
  return /* El ? <El />  : */ null
}
