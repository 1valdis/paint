import React, { PureComponent, ChangeEvent } from 'react'

import './App.css'

import { connect } from 'react-redux'

import { FileMenu } from '../FileMenu/FileMenu'
import Canvas from '../Canvas/Canvas'
import { NavBar } from '../NavBar/NavBar'
import { NavBarItem } from '../NavBar/NavBarItem'
import { Clipboard } from '../Clipboard/Clipboard'
import { Image } from '../Image/Image'
import { Instruments } from '../instruments/Instruments'
import { ColorsContainer } from '../Colors/ColorsContainer'

import { openFile, createFile, paste, download, Action } from '../../actions'
import { StoreState } from '../../reducers'
import { ThunkDispatch } from 'redux-thunk'

export interface AppProps {
  downloadName: string
  onFileCreate: () => void
  onFileOpen: (e: ChangeEvent<HTMLInputElement>) => void
  onPaste: (e: ClipboardEvent) => void
}

class _App extends PureComponent<AppProps> {
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
            <Clipboard />
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
        <Canvas />
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

const mapStateToProps = (state: StoreState) => ({
  downloadName: state.image.name
})
const mapDispatchToProps = (
  dispatch: ThunkDispatch<StoreState, undefined, Action>
) => ({
  onFileCreate: () => dispatch(createFile()),
  onFileOpen: (e: ChangeEvent<HTMLInputElement>) => dispatch(openFile(e)),
  onPaste: (e: ClipboardEvent) => dispatch(paste(e))
})

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(_App)
