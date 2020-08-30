import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'

// import { SelectionInstrument } from '../instruments/SelectionInstrument/SelectionInstrument';
import { Pen } from '../instruments/Pen/Pen'
import { Fill } from '../instruments/Fill/Fill'
import { Dropper } from '../instruments/Dropper/Dropper'
import { Eraser } from '../instruments/Eraser/Eraser'

import { StoreState } from '../../reducers'
import { Instruments } from '../../actions'

const instruments = {
  pen: Pen,
  fill: Fill,
  // selection: SelectionInstrument,
  dropper: Dropper,
  eraser: Eraser,
  text: null,
  zoom: null,
  brushes: null,
  shapes: null,
  selection: null
}

interface CanvasEditorProps {
  instrument: Instruments
}

const _CanvasEditor: FunctionComponent<CanvasEditorProps> = props => {
  const El = instruments[props.instrument]
  return El ? <El /> : null
}

const mapStateToProps = (state: StoreState) => ({
  instrument: state.instruments.selected
})

export const CanvasEditor = connect(mapStateToProps)(_CanvasEditor)
