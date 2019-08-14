import React, { Component } from 'react'
import './Image.css'

import { connect } from 'react-redux'

import classNames from 'classnames'

import { selectInstrument } from '../../actions'
import { changeImage } from '../App/actions'

class Image extends Component {
  render() {
    return (
      <nav className="image">
        <button
          className={classNames('select', {
            select_active: this.props.instrument === 'selection'
          })}
          onClick={this.handleClick}>
          <svg viewBox="0 0 15 10">
            <rect
              width="15"
              height="10"
              style={{
                fill: 'transparent',
                strokeWidth: '1',
                strokeDasharray: '1',
                stroke: 'black'
              }}
            />
          </svg>
          <footer>Выделить</footer>
        </button>
        <div className="side-buttons">
          <button
            onClick={this.handleClipClick}
            disabled={!(this.props.selection && this.props.selection.coords)}>
            Обрезать
          </button>
          <button>Изменить размер</button>
          <button>Повернуть</button>
        </div>
      </nav>
    )
  }

  handleClick = () => {
    this.props.selectInstrument('selection')
  }

  handleClipClick = () => {
    if (!(this.props.selection && this.props.selection.coords)) {
      return
    }
    const newCanvas = document.createElement('canvas')
    const newCtx = newCanvas.getContext('2d')
    ;({
      width: newCanvas.width,
      height: newCanvas.height
    } = this.props.selection.coords)

    newCtx.putImageData(this.props.image, 0, 0)
    this.props.changeImage(
      newCtx.getImageData(
        this.props.selection.coords.left,
        this.props.selection.coords.top,
        this.props.selection.coords.width,
        this.props.selection.coords.height
      )
    )
    this.props.selectInstrument('selection')
  }
}

const mapStateToProps = state => ({
  image: state.image.data,
  instrument: state.instruments.instrument,
  selection: state.instruments.selection
})
const mapDispatchToProps = dispatch => ({
  selectInstrument: instrument => dispatch(selectInstrument(instrument)),
  changeImage: imageData => dispatch(changeImage(imageData))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Image)
