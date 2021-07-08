import { combineReducers } from 'redux'

import { colorsReducer, ColorsStoreState } from './colors'
import { instrumentsReducer, InstrumentStoreState } from './instruments'
import { imageReducer, ImageStoreState } from './image'
import { clipboardReducer, ClipboardStoreState } from './clipboard'

export interface StoreState {
  image: ImageStoreState
  colors: ColorsStoreState
  instruments: InstrumentStoreState
  clipboard: ClipboardStoreState
}
export const reducer = combineReducers<StoreState>({
  image: imageReducer,
  colors: colorsReducer,
  instruments: instrumentsReducer,
  clipboard: clipboardReducer
})

export default reducer
