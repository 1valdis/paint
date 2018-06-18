import React from 'react'
import './Color.css'

import classNames from 'classnames'

const Color = props => {
  return (
    <div
      onClick={props.onClick && (() => props.onClick(props.colorId))}
      style={props.value && { backgroundColor: `rgb(${props.value.r}, ${props.value.g}, ${props.value.b})` }}
      className={classNames('color', { color_active: props.active, color_undefined: !props.value })}
    />
  )
}

export default Color
