interface Color {
  r: number
  g: number
  b: number
}

export interface StoreState {
  image: {
    data: ImageData
    name: string
  }
  colors: {
    list: Color[]
    activeColor: 'primary' | 'secondary'
    primary: number
    secondary: number
  }
  instruments: any
}
