import React, { Component } from 'react'
import '../App.css'

import Canvas from './Canvas'
import FileMenu from './FileMenu'

class Paint extends Component {
  render () {
    return (
      <React.Fragment>
        <FileMenu />
        <Canvas />
      </React.Fragment>
    )
  }
}

export default Paint
