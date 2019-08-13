import React, {
  PureComponent,
  ChangeEventHandler,
  MouseEventHandler
} from 'react'

import { FileMenuComponent } from './FileMenuComponent'

export interface FileMenuProps {
  onDownload(fileName: string): void
  downloadName: string
  onFileCreate: MouseEventHandler
  onFileOpen: ChangeEventHandler
}

interface FileMenuState {
  menuOpen: boolean
  aboutOpen: boolean
}

export class FileMenu extends PureComponent<FileMenuProps, FileMenuState> {
  constructor(props: FileMenuProps) {
    super(props)
    this.state = { menuOpen: false, aboutOpen: false }
  }

  render() {
    return (
      <FileMenuComponent
        isOpen={this.state.menuOpen}
        isAboutOpen={this.state.aboutOpen}
        onClick={this.toggleMenu}
        onClickInside={this.closeMenu}
        onClickOutside={this.closeMenu}
        onAboutOpen={this.openAbout}
        onAboutClose={this.closeAbout}
        {...this.props}
        onDownload={() => this.props.onDownload(this.props.downloadName)}
      />
    )
  }

  toggleMenu = () => this.setState(state => ({ menuOpen: !state.menuOpen }))

  closeMenu = () => this.setState({ menuOpen: false })

  openAbout = () => this.setState({ aboutOpen: true })

  closeAbout = () => this.setState({ aboutOpen: false })
}
