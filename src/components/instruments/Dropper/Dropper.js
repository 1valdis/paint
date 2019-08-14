import React, { PureComponent } from 'react'

import { connect } from 'react-redux'
import { addColor, selectInstrument } from '../../../actions'
import './Dropper.css'

class Dropper extends PureComponent {
  render() {
    return (
      <div
        className="dropper"
        onClick={this.handleClick}
        style={{
          width: this.props.imageData.width,
          height: this.props.imageData.height
        }}
      />
    )
  }

  handleClick = e => {
    if (e.target !== e.currentTarget) return

    let { top, left, bottom, right } = e.target.getBoundingClientRect()
    ;[top, left, bottom, right] = [
      top + window.pageYOffset,
      left + window.pageXOffset,
      bottom + window.pageYOffset,
      right + window.pageXOffset
    ]
    const [mouseX, mouseY] = [
      e.clientX + window.pageXOffset,
      e.clientY + window.pageYOffset
    ]
    ;[top, left] = [Math.ceil(mouseY - top), Math.ceil(mouseX - left)]

    const i = (top * this.props.imageData.width + left) * 4

    this.props.addColor({
      r: this.props.imageData.data[i],
      g: this.props.imageData.data[i + 1],
      b: this.props.imageData.data[i + 2]
    })
    this.props.selectInstrument('pen')
  }
}

const mapStateToProps = state => ({
  imageData: state.image.data
})
const mapDispatchToProps = dispatch => ({
  addColor: color => dispatch(addColor(color)),
  selectInstrument: instrument => dispatch(selectInstrument(instrument))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dropper)
