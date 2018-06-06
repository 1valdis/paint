import React, { Component } from 'react'
import './styles/Paint.css'

import Canvas from './Canvas'
import FileMenu from './FileMenu'
import NavBar from './NavBar'

class Paint extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      width: 800,
      height: 450,
      resizing: false,
      canvasBlob: null,
      canvas: null
    }
  }
  render () {
    return (
      <React.Fragment>
        <FileMenu onFileOpen={this.openFile} downloadSrc={this.state.canvasBlob} onFileCreate={this.createFile}/>
        <NavBar />
        <Canvas
          width={this.state.width}
          height={this.state.height}
          onCanvasRef={this.handleCanvasRef}
        />
      </React.Fragment>
    )
  }
  handleCanvasRef = canvas => {
    this.setState(state => {
      const ctx = canvas.getContext('2d', { alpha: false })
      this.setupCanvas(ctx)
      return {
        ctx,
        canvas: canvas
      }
    })
  }
  setupCanvas = (ctx) => {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  canvasChanged () {
    this.state.canvas.toBlob(blob=>{
      this.setState({canvasBlob: window.URL.createObjectURL(blob)})
    })
  }
  openFile = (e) => {
    const file = e.nativeEvent.target.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        this.setState(state=>({
          width: img.width,
          height: img.height
        }))
        this.state.ctx.drawImage(img, 0, 0)
        this.canvasChanged()
      }
      img.src=e.target.result
    }
    reader.readAsDataURL(file)
  }
  createFile = e => {
    this.setState({
      width: 800,
      height: 450
    }, ()=>{
      this.setupCanvas(this.state.ctx)
      this.canvasChanged()
    })
  }
}

export default Paint
