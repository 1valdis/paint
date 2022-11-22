/* eslint-disable sonarjs/no-duplicate-string */
import './Shapes.css'
import { FunctionComponent } from 'react'
import { Dropdown } from '../Dropdown/Dropdown'
import classNames from 'classnames'

const ShapeSettingValues = ['none', 'solid'] as const

export type ShapeSettingValue = typeof ShapeSettingValues[number]

export type Shape =
  | 'straight-line'
  | 'curved-line'
  | 'ellipse'
  | 'rectangle'
  | 'rounded-rectangle'
  | 'polygon'
  | 'triangle'
  | 'right-triangle'
  | 'rhombus'
  | 'pentagon'
  | 'hexagon'
  | 'right-arrow'
  | 'left-arrow'
  | 'top-arrow'
  | 'down-arrow'
  | 'four-pointed-star'
  | 'five-pointed-star'
  | 'six-pointed-star'
  | 'rounded-rectangle-bubble'
  | 'elliptical-bubble'
  | 'cloud-bubble'
  | 'heart'
  | 'lightning'

interface ShapesMenuProps {
  contour: ShapeSettingValue
  setContour: (contour: ShapeSettingValue) => void
  filling: ShapeSettingValue
  setFilling: (filling: ShapeSettingValue) => void
  shape: Shape | null
  setShape: (shape: Shape) => void
}

export interface ShapeProps {
  thickness: number
  contour: ShapeSettingValue
  filling: ShapeSettingValue
}

export const Shapes: FunctionComponent<ShapesMenuProps> = (props) => {
  return (
    <nav className="shapes">
      <div className='shapes-grid'>
        <button className={classNames({ shape_active: props.shape === 'straight-line' }, 'straight-line')} onClick={() => props.setShape('straight-line')}></button>
        <button className={classNames({ shape_active: props.shape === 'curved-line' }, 'curved-line')} onClick={() => props.setShape('curved-line')}></button>
        <button className={classNames({ shape_active: props.shape === 'ellipse' }, 'ellipse')} onClick={() => props.setShape('ellipse')}></button>
        <button className={classNames({ shape_active: props.shape === 'rectangle' }, 'rectangle')} onClick={() => props.setShape('rectangle')}></button>
        <button className={classNames({ shape_active: props.shape === 'rounded-rectangle' }, 'rounded-rectangle')} onClick={() => props.setShape('rounded-rectangle')}></button>
        <button className={classNames({ shape_active: props.shape === 'polygon' }, 'polygon')} onClick={() => props.setShape('polygon')}></button>
        <button className={classNames({ shape_active: props.shape === 'triangle' }, 'triangle')} onClick={() => props.setShape('triangle')}></button>
        <button className={classNames({ shape_active: props.shape === 'right-triangle' }, 'right-triangle')} onClick={() => props.setShape('right-triangle')}></button>
        <button className={classNames({ shape_active: props.shape === 'rhombus' }, 'rhombus')} onClick={() => props.setShape('rhombus')}></button>
        <button className={classNames({ shape_active: props.shape === 'pentagon' }, 'pentagon')} onClick={() => props.setShape('pentagon')}></button>
        <button className={classNames({ shape_active: props.shape === 'hexagon' }, 'hexagon')} onClick={() => props.setShape('hexagon')}></button>
        <button className={classNames({ shape_active: props.shape === 'right-arrow' }, 'right-arrow')} onClick={() => props.setShape('right-arrow')}></button>
        <button className={classNames({ shape_active: props.shape === 'left-arrow' }, 'left-arrow')} onClick={() => props.setShape('left-arrow')}></button>
        <button className={classNames({ shape_active: props.shape === 'top-arrow' }, 'top-arrow')} onClick={() => props.setShape('top-arrow')}></button>
        <button className={classNames({ shape_active: props.shape === 'down-arrow' }, 'down-arrow')} onClick={() => props.setShape('down-arrow')}></button>
        <button className={classNames({ shape_active: props.shape === 'four-pointed-star' }, 'four-pointed-star')} onClick={() => props.setShape('four-pointed-star')}></button>
        <button className={classNames({ shape_active: props.shape === 'five-pointed-star' }, 'five-pointed-star')} onClick={() => props.setShape('five-pointed-star')}></button>
        <button className={classNames({ shape_active: props.shape === 'six-pointed-star' }, 'six-pointed-star')} onClick={() => props.setShape('six-pointed-star')}></button>
        <button className={classNames({ shape_active: props.shape === 'rounded-rectangle-bubble' }, 'rounded-rectangle-bubble')} onClick={() => props.setShape('rounded-rectangle-bubble')}></button>
        <button className={classNames({ shape_active: props.shape === 'elliptical-bubble' }, 'elliptical-bubble')} onClick={() => props.setShape('elliptical-bubble')}></button>
        <button className={classNames({ shape_active: props.shape === 'cloud-bubble' }, 'cloud-bubble')} onClick={() => props.setShape('cloud-bubble')}></button>
        <button className={classNames({ shape_active: props.shape === 'heart' }, 'heart')} onClick={() => props.setShape('heart')}></button>
        <button className={classNames({ shape_active: props.shape === 'lightning' }, 'lightning')} onClick={() => props.setShape('lightning')}></button>
      </div>
      <div>
        <Dropdown buttonContent="Contour ▾">
          <button onClick={() => props.setContour('none')} className={classNames({ 'dropdown-button-active': props.contour === 'none' })}>No contour</button>
          <button onClick={() => props.setContour('solid')} className={classNames({ 'dropdown-button-active': props.contour === 'solid' })}>Solid color</button>
        </Dropdown>
        <Dropdown buttonContent="Filling ▾" isDisabled={['straight-line', 'curved-line'].includes(props.shape as any)}>
          <button onClick={() => props.setFilling('none')} className={classNames({ 'dropdown-button-active': props.filling === 'none' })}>No filling</button>
          <button onClick={() => props.setFilling('solid')} className={classNames({ 'dropdown-button-active': props.filling === 'solid' })}>Solid color</button>
        </Dropdown>
      </div>
    </nav>
  )
}
