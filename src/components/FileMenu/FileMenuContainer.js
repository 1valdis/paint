import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import FileMenuComponent from './FileMenuComponent'

class FileMenuContainer extends PureComponent {
  constructor () {
    super()
    this.state = { open: false }
  }
  render () {
    return (
      <FileMenuComponent
        isOpen={this.state.open}
        onClick={this.toggleMenu}
        onClickOutside={this.closeMenu}
        onClickInside={this.closeMenu}
        {...this.props}
      />
    )
  }
  toggleMenu = () => this.setState(state => ({ open: !state.open }))
  closeMenu = () => this.setState({ open: false })
}

FileMenuContainer.propTypes = {
  downloadHref: PropTypes.string,
  downloadName: PropTypes.string,
  onFileCreate: PropTypes.func,
  onFileOpen: PropTypes.func
}

export default FileMenuContainer
