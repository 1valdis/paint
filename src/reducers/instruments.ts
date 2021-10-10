import { Action, getInitialState } from '../actions'

export interface InstrumentStoreState {
  selected: ''
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
  state: InstrumentStoreState = getInitialState().instruments,
  action: Action
): InstrumentStoreState => {
  switch (action.type) {
    case 'changeInstrument':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}
