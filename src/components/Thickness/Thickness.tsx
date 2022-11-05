import classNames from 'classnames'
import { FC } from 'react'
import { Dropdown } from '../Dropdown/Dropdown'
import './Thickness.css'

interface ThicknessProps {
  available: readonly number[]
  current?: number | null
  setThickness: (thickness: number) => void
}

export const InstrumentToThicknessMap = {
  pen: [1, 2, 3, 4],
  fill: false,
  text: false,
  eraser: [4, 6, 8, 10],
  dropper: false,
  zoom: false,
  brushes: false,
  shapes: [1, 3, 5, 8],
  selection: false
} as const// satisfies Record<Instrument, readonly number[] | false>

type TunableThicknesses<T> = {
  [P in keyof T]: T[P] extends readonly number[] ? T[P][number] : false
}

export type TunableInstrumentToThicknessMap = TunableThicknesses<typeof InstrumentToThicknessMap>

const ThicknessItem: FC<{ thickness: number }> = (props) => <div className="thickness-item" style={{ width: '100%', height: `${props.thickness}px` }}></div>

export const Thickness: FC<ThicknessProps> = (props) => {
  return <Dropdown
    buttonContent={<><div className='thicknessess-example'>{
      [1, 2, 6, 10].map(i => <ThicknessItem thickness={i} key={i}></ThicknessItem>)
    }</div>Thickness<br/>▾</>}
    isDisabled={!!props.available.length}
  >{
    props.available.map(
      (thickness) => <div
        onClick={() => props.setThickness(thickness)}
        className={classNames({ 'thickness-active': thickness === props.current })}
        key={thickness}
      >
        <ThicknessItem thickness={thickness} />
      </div>
    )
  }</Dropdown>
}
