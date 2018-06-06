import React, { Component } from 'react'
import './styles/Resizer.css'

class Resizer extends Component {
  render () {
    return (
      <div className='resizer-outer' style={{...this.props.outerStyle}}>
        <div className='resizer-inner' style={{...this.props.innerStyle}} />
      </div>
    )
  }
}

export default Resizer
