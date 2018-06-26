import React from 'react'
import PropTypes from 'prop-types'

import './Color.css'

import classNames from 'classnames'

const Color = props => {
  return (
    <div
      onClick={props.onClick}
      style={props.value && { backgroundColor: `rgb(${props.value.r}, ${props.value.g}, ${props.value.b})` }}
      className={classNames('color', { color_active: props.active, color_undefined: !props.value })}
    />
  )
}

Color.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number
  }),
  active: PropTypes.bool
}

export default Color
