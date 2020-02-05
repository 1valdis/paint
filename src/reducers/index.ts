import { combineReducers } from 'redux'

import { colorsReducer, ColorsStoreState } from './colors'
import { instrumentsReducer, InstrumentStoreState } from './instruments'
import { imageReducer, ImageStoreState } from './image'

export interface StoreState {
  image: ImageStoreState
  colors: ColorsStoreState
  instruments: InstrumentStoreState
}
export const reducer = combineReducers<StoreState>({
  image: imageReducer,
  colors: colorsReducer,
  instruments: instrumentsReducer
})

export default reducer
