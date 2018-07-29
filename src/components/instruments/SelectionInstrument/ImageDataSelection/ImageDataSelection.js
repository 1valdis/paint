resizeCanvasToFitPasted = () => {
  const canvas = document.createElement('canvas')

  canvas.width = Math.max(this.props.imageData, this.props.selectionImageData)
  const ctx = canvas.getContext('2d')

  this.newCtx.canvas.width = Math.max(
    this.newCtx.canvas.width,
    this.props.selectionImageData.width
  )
  this.newCtx.canvas.height = Math.max(
    this.newCtx.canvas.height,
    this.props.selectionImageData.height
  )
  this.newCtx.imageSmoothingEnabled = false
  this.newCtx.fillStyle = `rgb(${this.props.secondaryColor.r}, ${this.props.secondaryColor.g}, ${this.props.secondaryColor.b})`
  this.newCtx.fillRect(
    0,
    0,
    this.newCtx.canvas.width,
    this.newCtx.canvas.height
  )
  this.newCtx.drawImage(this.oldCtx.canvas, 0, 0)

  this.oldCtx.canvas.width = this.newCtx.canvas.width
  this.oldCtx.canvas.height = this.newCtx.canvas.height
  this.oldCtx.drawImage(this.newCtx.canvas, 0, 0)

  this.props.changeImage(
    this.newCtx.getImageData(
      0,
      0,
      this.newCtx.canvas.width,
      this.newCtx.canvas.height
    )
  )
}