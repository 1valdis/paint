import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

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
            onResize={this.props.onResize}
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
  data: state.image.data
})

export default connect(mapStateToProps)(Canvas)
