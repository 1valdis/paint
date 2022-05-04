export const create = () => {
  const canvas = document.createElement('canvas')
  ;[canvas.width, canvas.height] = [800, 450]
  const context = canvas.getContext('2d')!
  context.fillStyle = 'white'
  context.fillRect(0, 0, 800, 450)
  return canvas
}
