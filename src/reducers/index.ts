import { combineReducers } from 'redux'

import { colorsReducer, ColorsStoreState } from './colors'
import { instrumentsReducer } from './instruments'
import { imageReducer, ImageStoreState } from './image';

export interface StoreState {
  image: ImageStoreState
  colors: ColorsStoreState
  instruments: any // todo fix that
}
export const reducer = combineReducers<StoreState>({
  image: imageReducer,
  colors: colorsReducer,
  instruments: instrumentsReducer
})

export default reducer
