import React, { Component } from 'react'
import './Colors.css'

import { rgbToHex } from '../helpers'

import ColorPalette from './ColorPalette'
import ColorSelection from './ColorSelection'
import ColorInput from './ColorInput'

class Colors extends Component {
  constructor () {
    super()
    this.state = {
      colors: [
        { r: 0, g: 0, b: 0 },
        { r: 127, g: 127, b: 127 },
        { r: 136, g: 0, b: 21 },
        { r: 237, g: 28, b: 36 },
        { r: 255, g: 127, b: 39 },
        { r: 255, g: 242, b: 0 },
        { r: 34, g: 177, b: 76 },
        { r: 0, g: 162, b: 232 },
        { r: 63, g: 72, b: 204 },
        { r: 163, g: 73, b: 164 },
        { r: 255, g: 255, b: 255 },
        { r: 195, g: 195, b: 195 },
        { r: 185, g: 122, b: 87 },
        { r: 255, g: 174, b: 201 },
        { r: 255, g: 201, b: 14 },
        { r: 239, g: 228, b: 176 },
        { r: 181, g: 230, b: 29 },
        { r: 153, g: 217, b: 234 },
        { r: 112, g: 176, b: 190 },
        { r: 200, g: 191, b: 231 }
      ],
      activeColor: 'primary',
      colorSelections: {
        primary: 0,
        secondary: 10
      }
    }
  }
  render () {
    return (
      <div className='colors'>
        <ColorSelection
          header='Цвет 1'
          color={this.state.colors[this.state.colorSelections.primary]}
          active={this.state.activeColor === 'primary'}
          onClick={() => this.setActiveColor('primary')}
        />
        <ColorSelection
          header='Цвет 2'
          color={this.state.colors[this.state.colorSelections.secondary]}
          active={this.state.activeColor === 'secondary'}
          onClick={() => this.setActiveColor('secondary')}
        />
        <ColorPalette
          colors={this.state.colors}
          activeColor={this.state.colorSelections[this.state.activeColor]}
          onColorClick={this.setColor}
        />
        <ColorInput
          onChange={this.customColorSelected}
          value={rgbToHex(
            this.state.colors[
              this.state.colorSelections[this.state.activeColor]
            ]
          )}
        />
      </div>
    )
  }
  setActiveColor (color) {
    this.setState({ activeColor: color })
  }
  setColor = color => {
    debugger
    this.setState(
      state => ({
        colorSelections: {
          ...state.colorSelections,
          [this.state.activeColor]: color
        }
      }),
      () =>
        this.props.onSelectedColorsChanged(
          this.state.colors[
            this.state.colorSelections[this.state.colorSelections.primary]
          ],
          this.state.colors[
            this.state.colorSelections[this.state.colorSelections.secondary]
          ]
        )
    )
  }
  customColorSelected = e => {
    const hexRgb = e.target.value.match(/[A-Za-z0-9]{2}/g)
    const rgb = hexRgb.map(v => parseInt(v, 16))
    const rgbObject = { r: rgb[0], g: rgb[1], b: rgb[2] }
    const rgbObjectString = JSON.stringify(rgbObject)
    let found = false
    for (let i = 0; i < this.state.colors.length; i++) {
      if (JSON.stringify(this.state.colors[i]) === rgbObjectString) {
        found = true
        break
      }
    }
    if (!found) {
      if (this.state.colors.length !== 30) {
        this.setState(state => ({
          colors: [...state.colors, rgbObject],
          colorSelections: {
            ...state.colorSelections,
            [state.activeColor]: state.colors.length
          }
        }))
      } else {
        this.setState(state => ({
          colors: [
            ...state.colors.slice(0, 20),
            ...state.colors.slice(21),
            rgbObject
          ],
          colorSelections: {
            ...state.colorSelections,
            [state.activeColor]: state.colors.length - 1
          }
        }))
      }
    }
  }
}

export default Colors
