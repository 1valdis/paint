import { SelectedColor } from '../actions'

interface Color {
  r: number
  g: number
  b: number
}

export interface ColorsStoreState {
  list: Color[]
  activeColor: SelectedColor
  primary: number
  secondary: number
}

export interface StoreState {
  image: {
    data: ImageData
    name: string
  }
  colors: ColorsStoreState
  instruments: any // todo fix that
  aboutOpen: boolean
}
