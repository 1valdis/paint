import { FunctionComponent, useState, useEffect } from 'react'

import { Color } from '../../../common/Color'

interface ModernEyedropperProps {
  onColorSelected: (color: Color) => void
  switchInstrument: () => void
}

declare class EyeDropper {
  open(options?: { signal: AbortSignal }): Promise<{ sRGBHex: string }>
}

const useEyedropperApi = (onSelect: (color: Color) => void, onReject: () => void) => {
  const [eyedropper] = useState(new EyeDropper())

  useEffect(() => {
    eyedropper.open()
      .then(result => {
        const hexRgb = result.sRGBHex.match(/[A-Za-z0-9]{2}/g)
        if (!hexRgb) return
        const rgb = hexRgb.map(v => parseInt(v, 16)) as [number, number, number]
        const newColor = { r: rgb[0], g: rgb[1], b: rgb[2] }
        onSelect(newColor)
      })
      .catch(() => {
        onReject()
      })
  }, [eyedropper, onReject, onSelect])
}

export const ModernEyedropper: FunctionComponent<ModernEyedropperProps> = (props) => {
  useEyedropperApi((color: Color) => {
    props.onColorSelected(color)
    props.switchInstrument()
  }, props.switchInstrument)

  return null
}
