import React, { FunctionComponent, MouseEventHandler } from 'react'
import classNames from 'classnames'

import './ColorSelection.css'

interface ColorSelectionProps {
  active: boolean
  color: {
    r: number
    g: number
    b: number
  }
  onClick: MouseEventHandler
  header: string
}

export const ColorSelection: FunctionComponent<ColorSelectionProps> = props => (
  <div
    className={classNames('color-selection', {
      'color-selection_active': props.active
    })}
    onClick={props.onClick}>
    <div
      className="color-selection-color"
      style={{
        backgroundColor: `rgb(${props.color.r},${props.color.g},${props.color.b})`
      }}
    />
    <h6 className="color-selection-header">{props.header}</h6>
  </div>
)
