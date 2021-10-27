import { MouseEventHandler, FunctionComponent } from 'react'
import classNames from 'classnames'

import './Color.css'

export interface ColorProps {
  onClick?: MouseEventHandler
  value?: {
    r: number
    g: number
    b: number
  }
}

export const Color: FunctionComponent<ColorProps> = props => {
  return (
    <div
      onClick={props.onClick}
      style={
        props.value && {
          backgroundColor: `rgb(${props.value.r}, ${props.value.g}, ${props.value.b})`
        }
      }
      className={classNames('color', {
        color_undefined: !props.value
      })}
    />
  )
}
