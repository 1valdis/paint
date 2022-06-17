import { FC, PointerEvent } from 'react'

import './Zoom.css'

export const ZoomLevels = [0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type ZoomLevel = typeof ZoomLevels[number]

export interface ZoomProps {
  level: ZoomLevel
  onLevelChange: (newLevel: ZoomLevel) => void
}

export const Zoom: FC<ZoomProps> = (props) => {
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button === 0) {
      console.log('zoom in')
    }
    if (event.button === 2) {
      console.log('zoom out')
    }
    event.preventDefault()
  }
  return <div className='zoom' onPointerDown={handlePointerDown} onContextMenu={e => e.preventDefault()}></div>
}
