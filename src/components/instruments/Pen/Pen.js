import React, { PureComponent } from 'react'

import { connect } from 'react-redux'

class Pen extends PureComponent {
  render () {
    return <canvas ref='canvas' {...this.props} />
  }
  componentDidMount () {
    // ...
  }
}

const mapStateToProps = state => ({
  width: state.image.data ? state.image.data.width : 1,
  height: state.image.data ? state.image.data.height : 1
})

export default connect(mapStateToProps)(Pen)
