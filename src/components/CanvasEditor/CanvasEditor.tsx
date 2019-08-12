import React from 'react'
import { connect } from 'react-redux'

import SelectionInstrument from '../instruments/SelectionInstrument/SelectionInstrument'
import Pen from '../instruments/Pen/Pen'
import Fill from '../instruments/Fill/Fill'
import Dropper from '../instruments/Dropper/Dropper'
import Eraser from '../instruments/Eraser/Eraser'

import { StoreState } from '../../reducers'

// todo maybe can be done better?
const instruments = {
  pen: Pen,
  fill: Fill,
  selection: SelectionInstrument,
  dropper: Dropper,
  eraser: Eraser
}

interface CanvasEditorProps {
  instrument: keyof typeof instruments
}

const _CanvasEditor = (props: CanvasEditorProps): JSX.Element | null => {
  const Element = instruments[props.instrument]
  return Element != null ? <Element /> : null
}

const mapStateToProps = (state: StoreState) => ({
  instrument: state.instruments.instrument
})

export const CanvasEditor = connect(mapStateToProps)(_CanvasEditor)
