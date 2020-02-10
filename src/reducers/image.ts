import { Action, getInitialState } from '../actions'

export interface ImageStoreState {
  fileName: string
  imageData: ImageData
}

export const imageReducer = (
  state: ImageStoreState | undefined = getInitialState().image,
  action: Action
): ImageStoreState => {
  console.log('reducer called')
  switch (action.type) {
    case 'changeImage':
      return {
        imageData: action.payload.imageData || state.imageData,
        fileName: action.payload.fileName || state.fileName
      }
    default:
      return state
  }
}
