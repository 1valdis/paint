export function createCanvas (width?: number, height?: number) {
  const canvas = document.createElement('canvas')
  if (width) canvas.width = width
  if (height) canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error("Couldn't get canvas context")
  return { canvas, context }
}
