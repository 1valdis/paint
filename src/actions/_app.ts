interface StoreState {
  filename: string
  imageData: ImageData
  colors: {
    list: {
      r: number
      g: number
      b: number
    }[]
    activeColor: 'primary' | 'secondary'
    primary: number
    secondary: number
  }
  instruments: {
    pen: {
      isSelected: boolean
    }
    fill: {
      isSelected: boolean
    }
    text: {
      isSelected: boolean
      // some other text settings or currently filled text
    }
    eraser: {
      isSelected: boolean
      thickness: number
    }
    dropper: {
      isSelected: boolean
    }
    zoom: {
      isSelected: boolean
      current: number
    }
    brushes: {
      isSelected: boolean
      list: {
        type: string
        thickness: number
      }[]
      current: number
    }
    shapes: {
      isSelected: boolean
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
      }
      // some other data, still need to figure out how that will work
    }
  }
}
