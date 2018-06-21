import React, { Component } from 'react'

import FileMenuComponent from './FileMenuComponent'

class FileMenuContainer extends Component {
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
        onFileCreate={this.props.onFileCreate}
      />
    )
  }
  toggleMenu = () => this.setState(state => ({ open: !state.open }))
  closeMenu = () => this.setState({ open: false })
}

export default FileMenuContainer
