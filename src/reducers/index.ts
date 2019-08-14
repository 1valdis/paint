interface Color {
  r: number
  g: number
  b: number
}

export interface ColorsStoreState {
  list: Color[]
  activeColor: 'primary' | 'secondary'
  primary: number
  secondary: number
}

export interface StoreState {
  image: {
    data: ImageData
    name: string
  }
  colors: ColorsStoreState
  instruments: any
  aboutOpen: boolean
}
