import React, { Component } from 'react'
import './styles/Paint.css'

import Canvas from './Canvas'
import FileMenu from './FileMenu'
import NavBar from './NavBar'

class Paint extends Component {
  render () {
    return (
      <React.Fragment>
        <FileMenu />
        <NavBar />
        <Canvas />
      </React.Fragment>
    )
  }
}

export default Paint
