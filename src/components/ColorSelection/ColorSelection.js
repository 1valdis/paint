import React from 'react'
import './ColorSelection.css'

import classNames from 'classnames'

const ColorSelection = props => (
  <div className={classNames('color-selection', {'color-selection_active': props.active})} onClick={props.onClick}>
    <div
      className='color-selection-color'
      style={{
        backgroundColor: `rgb(${props.color.r},${props.color.g},${props.color.b})`
      }}
    />
    <h6 className='color-selection-header'>
      {props.header}
    </h6>
  </div>
)

export default ColorSelection
