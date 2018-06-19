import React, { Component } from 'react'
import './App.css'

import { createStore, compose } from 'redux'
import { connect } from 'react-redux'

import FileMenu from '../FileMenu/FileMenuContainer'
import Canvas from '../Canvas/Canvas'
import NavBar from '../NavBar/NavBar'
import Clipboard from '../Clipboard/Clipboard'
import Colors from '../Colors/Colors'
import { openFile, createFile, paste } from './actions'

class App extends Component {
  constructor (...args) {
    console.log('constructing app')
    super(...args)
  }
  render () {
    console.log('rendering app')
    return (
      <React.Fragment>
        <FileMenu
          downloadHref={this.props.donwloadHref}
          downloadName={this.props.downloadName}
          onFileCreate={this.props.onFileCreate}
          onFileOpen={this.props.onFileOpen}
        />
        <NavBar>
          <Clipboard
            onPasteClick={this.props.onClipboardPasteClick}
            disabled={this.props.clipboardDisabled}
            footer='Буфер обмена'
          />
          <Colors
            onSelectedColorsChanged={this.handleSelectedColorsChanged}
            footer='Цвета'
          />
        </NavBar>
        <Canvas onCanvasRef={this.handleCanvasRef} />
      </React.Fragment>
    )
  }
  handleSelectedColorsChanged = (primaryColor, secondaryColor) => {
    this.setState({ primaryColor, secondaryColor })
  }
  componentDidMount () {
    document.addEventListener('paste', this.props.onPaste)
    this.props.onFileCreate()
  }
  componentWillUnmount () {
    document.removeEventListener('paste', this.props.onPaste)
  }
}

const mapStateToProps = state => ({
  donwloadHref: state.image.downloadHref,
  downloadName: state.image.name
})
const mapDispatchToProps = dispatch => ({
  onFileCreate: ()=>dispatch(createFile()),
  onFileOpen: e=>dispatch(openFile(e)),
  onPaste: e=>dispatch(paste(e))
})

export { default as rootReducer } from './reducer'
export default connect(mapStateToProps, mapDispatchToProps)(App)
