import React, { PureComponent } from 'react'

import './App.css'

import { connect } from 'react-redux'

import FileMenu from '../FileMenu/FileMenuContainer'
import Canvas from '../Canvas/Canvas'
import NavBar from '../NavBar/NavBar'
import Clipboard from '../Clipboard/Clipboard'
import Image from '../Image/Image'
import Instruments from '../instruments/Instruments'
import Colors from '../Colors/ColorsContainer'

import { openFile, createFile, paste, resize, download } from './actions'

class App extends PureComponent {
  render () {
    return (
      <React.Fragment>
        <FileMenu
          onDownload={() => download(this.props.downloadName)}
          onFileCreate={this.props.onFileCreate}
          onFileOpen={this.props.onFileOpen}
        />
        <NavBar>
          <Clipboard
            onPasteClick={this.props.onClipboardPasteClick}
            disabled={this.props.clipboardDisabled}
            footer='Буфер обмена'
          />
          <Image footer='Изображение' />
          <Instruments footer='Инструменты' />
          <Colors footer='Цвета' />
        </NavBar>
        <Canvas
          onCanvasRef={this.handleCanvasRef}
          onResize={this.props.onResize}
        />
      </React.Fragment>
    )
  }
  componentDidMount () {
    document.addEventListener('paste', this.props.onPaste)
  }
  componentWillUnmount () {
    document.removeEventListener('paste', this.props.onPaste)
  }
}

const mapStateToProps = state => ({
  downloadName: state.image.name
})
const mapDispatchToProps = dispatch => ({
  onFileCreate: () => dispatch(createFile()),
  onFileOpen: e => dispatch(openFile(e)),
  onPaste: e => dispatch(paste(e)),
  onResize: (top, left, width, height) => dispatch(resize(width, height))
})

export { default as rootReducer } from './reducer'
export default connect(mapStateToProps, mapDispatchToProps)(App)
