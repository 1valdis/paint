import { ThunkAction } from 'redux-thunk'
import { ImageFile } from '../core/src/ImageFile'
import { ChangeEvent } from 'react'
import { StoreState } from '../reducers'
import { ChangeImageAction } from '../actions'
import { Canvas } from '../core/src/Canvas'

const canvas = new Canvas()

export const changeImage = (imageData: ImageData): ChangeImageAction => {
  canvas.putImageData(imageData)
  return {
    type: 'changeImage',
    payload: { imageData }
  }
}

export const createFile = (): ChangeImageAction => {
  const imageData = ImageFile.create()
  return changeImage(imageData)
}

export const getInitialState = (): StoreState => {
  const imageData = ImageFile.create()
  return {
    image: {
      fileName: 'Picture.png',
      imageData
    }
    // colors: {
    //   list: [
    //     { r: 0, g: 0, b: 0 },
    //     { r: 127, g: 127, b: 127 },
    //     { r: 136, g: 0, b: 21 },
    //     { r: 237, g: 28, b: 36 },
    //     { r: 255, g: 127, b: 39 },
    //     { r: 255, g: 242, b: 0 },
    //     { r: 34, g: 177, b: 76 },
    //     { r: 0, g: 162, b: 232 },
    //     { r: 63, g: 72, b: 204 },
    //     { r: 163, g: 73, b: 164 },
    //     { r: 255, g: 255, b: 255 },
    //     { r: 195, g: 195, b: 195 },
    //     { r: 185, g: 122, b: 87 },
    //     { r: 255, g: 174, b: 201 },
    //     { r: 255, g: 201, b: 14 },
    //     { r: 239, g: 228, b: 176 },
    //     { r: 181, g: 230, b: 29 },
    //     { r: 153, g: 217, b: 234 },
    //     { r: 112, g: 176, b: 190 },
    //     { r: 200, g: 191, b: 231 }
    //   ],
    //   activeColor: 'primary',
    //   primary: 0,
    //   secondary: 10
    // },
    // instruments: {
    //   selected: 'pen',
    //   text: {},
    //   eraser: {
    //     thickness: 4
    //   },
    //   zoom: {
    //     current: 1
    //   },
    //   brushes: {
    //     current: 0,
    //     list: [
    //       {
    //         type: 'kek',
    //         thickness: 228
    //       }
    //     ]
    //   },
    //   shapes: {
    //     current: 0,
    //     list: [
    //       {
    //         type: 'line',
    //         thickness: 4
    //       }
    //     ]
    //   },
    //   selection: {
    //     coords: null
    //   }
    // }
  }
}

export const download = (name: string) => {
  ImageFile.save(canvas.canvas, name)
}
export const openFile = (
  e: ChangeEvent<HTMLInputElement>
): ThunkAction<
  void,
  StoreState,
  undefined,
  ChangeImageAction
> => async dispatch => {
  const files = (e.nativeEvent.target as HTMLInputElement).files
  const file = files && files[0]
  if (!file) return
  const imageData = await ImageFile.open(file)
  dispatch(changeImage(imageData))
}
export const pasteFromEvent = (event: ClipboardEvent) => () => {}
export const pasteManually = () => {}
