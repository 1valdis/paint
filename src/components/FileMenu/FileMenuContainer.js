import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import FileMenuComponent from './FileMenuComponent'

class FileMenuContainer extends PureComponent {
  constructor () {
    super()
    this.state = { open: false, aboutOpen: false }
  }
  render () {
    return (
      <FileMenuComponent
        isOpen={this.state.open}
        onClick={this.toggleMenu}
        onClickOutside={this.closeMenu}
        onClickInside={this.closeMenu}
        isAboutOpen={this.state.aboutOpen}
        onAboutOpen={this.openAbout}
        onAboutClose={this.closeAbout}
        {...this.props}
        onDownload={()=>this.props.onDownload(this.props.downloadName)}
      />
    )
  }
  toggleMenu = () => this.setState(state => ({ open: !state.open }))
  closeMenu = () => this.setState({ open: false })
  openAbout = () => this.setState({aboutOpen: true})
  closeAbout = () => this.setState({aboutOpen: false})
}

FileMenuContainer.propTypes = {
  onDownload: PropTypes.func.isRequired,
  downloadName: PropTypes.string,
  onFileCreate: PropTypes.func,
  onFileOpen: PropTypes.func
}

export default FileMenuContainer
