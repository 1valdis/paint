import React, { Component } from 'react'
import './styles/Paint.css'

import Canvas from './Canvas'
// import CanvasResizer from './CanvasResizer'
import FileMenu from './FileMenu'
import NavBar from './NavBar'
import Colors from './Colors'
import Clipboard from './Clipboard'

class Paint extends Component {
  constructor (...args) {
    console.log('constructing app')
    super(...args)
    this.state = {
      canvasBlob: null,
      ctx: null,
      primaryColor: null,
      secondaryColor: null
    }
  }
  render () {
    console.log('rendering app')
    return (
      <React.Fragment>
        <FileMenu
          onFileOpen={this.openFile}
          downloadSrc={this.state.canvasBlob}
          onFileCreate={this.createFile}
        />
        <NavBar>
          <Clipboard onPasteClick={this.props.onClipboardPasteClick} disabled={this.props.clipboardDisabled} footer="Буфер обмена"/>
          <Colors onSelectedColorsChanged={this.handleSelectedColorsChanged} footer="Цвета"/>
        </NavBar>
        <Canvas onCanvasRef={this.handleCanvasRef} />
      </React.Fragment>
    )
  }
  handleCanvasRef = canvas => {
    console.log('handling canvas ref')
    this.setState(
      state => {
        return {
          ctx: canvas.getContext('2d', { alpha: false })
        }
      },
      () => this.createFile()
    )
  }
  setupCanvas = () => {
    console.log('setting up canvas')
    this.state.ctx.fillStyle = '#FFFFFF'
    this.state.ctx.fillRect(
      0,
      0,
      this.state.ctx.canvas.width,
      this.state.ctx.canvas.height
    )
  }
  canvasChanged () {
    console.log('canvas changed called')
    const lastURL = this.state.canvasBlob
    this.state.ctx.canvas.toBlob(blob => {
      this.setState({ canvasBlob: window.URL.createObjectURL(blob) }, () => {
        if (lastURL != null) {
          window.URL.revokeObjectURL(lastURL)
        }
      })
    })
  }
  resizeCanvas (width, height) {
    console.log('resizing canvas')
    const imageData = this.state.ctx.getImageData(
      0,
      0,
      this.state.ctx.canvas.width,
      this.state.ctx.canvas.height
    )
    ;[this.state.ctx.canvas.width, this.state.ctx.canvas.height] = [
      width,
      height
    ]
    this.setupCanvas()
    this.state.ctx.putImageData(imageData, 0, 0)
  }
  openFile = e => {
    const file = e.nativeEvent.target.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        this.resizeCanvas(img.width, img.height)
        this.state.ctx.drawImage(img, 0, 0)
        this.canvasChanged()
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }
  createFile = e => {
    console.log('creating file')
    this.resizeCanvas(800, 450)
    this.setupCanvas()
    this.canvasChanged()
  }
  
  handleSelectedColorsChanged = (primaryColor, secondaryColor) => {
    this.setState({primaryColor, secondaryColor})
  }

  componentDidMount () {
    document.addEventListener('paste', this.paste)
  }
  componentWillUnmount () {
    document.removeEventListener('paste', this.paste)
  }

  paste = e => {
    if (e.clipboardData) {
      const items = e.clipboardData.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          const source = window.URL.createObjectURL(blob)
          const pastedImage = new Image()
          pastedImage.onload = () => {
            this.resizeCanvas(
              Math.max(this.state.ctx.canvas.width, pastedImage.width),
              Math.max(this.state.ctx.canvas.height, pastedImage.height)
            )
            this.state.ctx.drawImage(pastedImage, 0, 0)
            this.canvasChanged()
          }
          pastedImage.src = source
          break
        }
      }
      e.preventDefault()
    }
  }
}

export default Paint
