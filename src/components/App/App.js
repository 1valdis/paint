import React, { PureComponent } from 'react'

import './App.css'

import { connect } from 'react-redux'

import { FileMenu } from '../FileMenu/FileMenu'
import Canvas from '../Canvas/Canvas'
import { NavBar } from '../NavBar/NavBar'
import { NavBarItem } from '../NavBar/NavBarItem'
import { Clipboard } from '../Clipboard/Clipboard'
import Image from '../Image/Image'
import Instruments from '../instruments/Instruments'
import { ColorsContainer } from '../Colors/ColorsContainer'

import { openFile, createFile, paste, download } from './actions'

class App extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <FileMenu
          onDownload={() => download(this.props.downloadName)}
          onFileCreate={this.props.onFileCreate}
          onFileOpen={this.props.onFileOpen}
        />
        <NavBar>
          <NavBarItem footer="Clipboard">
            <Clipboard
              onPasteClick={this.props.onClipboardPasteClick}
              disabled={this.props.clipboardDisabled}
            />
          </NavBarItem>
          <NavBarItem footer="Image">
            <Image />
          </NavBarItem>
          <NavBarItem footer="Instruments">
            <Instruments />
          </NavBarItem>
          <NavBarItem footer="Colors">
            <ColorsContainer />
          </NavBarItem>
        </NavBar>
        <Canvas onCanvasRef={this.handleCanvasRef} />
      </React.Fragment>
    )
  }

  componentDidMount() {
    document.addEventListener('paste', this.props.onPaste)
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.props.onPaste)
  }
}

const mapStateToProps = state => ({
  downloadName: state.image.name
})
const mapDispatchToProps = dispatch => ({
  onFileCreate: () => dispatch(createFile()),
  onFileOpen: e => dispatch(openFile(e)),
  onPaste: e => dispatch(paste(e))
})

export { default as rootReducer } from './reducer'
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
