import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { changeImage } from '../App/actions'
import { disableSelection } from '../instruments/SelectionInstrument/actions'

import Resizer from '../Resizer/Resizer'
import CanvasEditor from '../CanvasEditor/CanvasEditor'

import './Canvas.css'

class Canvas extends PureComponent {
  render () {
    return (
      <div className='canvas-wrapper'>
        <canvas
          ref='canvas'
          className='canvas'
          width={this.props.data ? this.props.data.width : 0}
          height={this.props.data ? this.props.data.height : 0}
        />
        <div
          className='canvas-upper-layer'
          style={{
            width: this.props.data ? this.props.data.width : 0,
            height: this.props.data ? this.props.data.height : 0
          }}
        >
          <Resizer
            mode='canvas'
            onResizeEnd={this.onResize}
            onResizing={this.props.disableSelection}
            width={this.props.data ? this.props.data.width : 0}
            height={this.props.data ? this.props.data.height : 0}
            top={0}
            left={0}
          />
          <CanvasEditor />
        </div>
      </div>
    )
  }
  updateCanvas = () => {
    const canvas = this.refs.canvas
    if (canvas != null && this.props.data != null) {
      ;[canvas.width, canvas.height] = [
        this.props.data.width,
        this.props.data.height 
      ]
      const ctx = canvas.getContext('2d')
      ctx.putImageData(this.props.data, 0, 0)
    }
  }
  onResize = (top, left, toWidth, toHeight) => {
    if (this.props.data.width !== toWidth || this.props.data.height !== toHeight) {
      const newCanvas = document.createElement('canvas')
      newCanvas.width = toWidth
      newCanvas.height = toHeight
      const newCtx = newCanvas.getContext('2d')
      newCtx.fillStyle = `rgb(${this.props.secondaryColor.r},${this.props.secondaryColor.g},${this.props.secondaryColor.b})`
      newCtx.fillRect(0, 0, toWidth, toHeight)
      newCtx.putImageData(this.props.data, 0, 0)
      this.props.changeImage(newCtx.getImageData(0, 0, toWidth, toHeight))
    }
  }
  componentDidMount () {
    this.updateCanvas()
  }
  componentDidUpdate () {
    this.updateCanvas()
  }
}

Canvas.propTypes = {
  data: PropTypes.object
}

const mapStateToProps = state => ({
  data: state.image.data,
  secondaryColor: state.colors.list[state.colors.secondary]
})

const mapDispatchToProps = dispatch => ({
  changeImage: data => dispatch(changeImage(data)),
  disableSelection: () => dispatch(disableSelection())
})

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
