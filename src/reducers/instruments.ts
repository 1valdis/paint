import { ActionTypes, Instruments } from '../actions'
import { AnyAction } from 'redux'

export interface InstrumentStoreState {
  selected:
    | 'pen'
    | 'fill'
    | 'text'
    | 'eraser'
    | 'dropper'
    | 'zoom'
    | 'brushes'
    | 'shapes'
    | 'selection'
  text: {
    // some other text settings or currently filled text
  }
  eraser: {
    thickness: number
  }
  zoom: {
    current: number
  }
  brushes: {
    list: {
      type: string
      thickness: number
    }[]
    current: number
  }
  shapes: {
    list: {
      type: string
      thickness: number
    }[]
    current: number
    // there should be some other settings of fill etc
  }
  selection: {
    coords: {
      top: number
      left: number
      width: number
      height: number
    } | null
    // some other data, still need to figure out how that will work
  }
}

export const instrumentsReducer = (
  state: InstrumentStoreState = { 
    
  },
  action: AnyAction
): InstrumentStoreState => {
  switch (action.type) {
    case ActionTypes.changeInstrument:
      return action.instrumentData
    default:
      return state
  }
}
