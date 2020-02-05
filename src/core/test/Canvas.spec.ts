import { assert } from 'chai'
import { Canvas } from '../src/Canvas'

describe('Canvas', () => {
  it('should create 800 * 450 canvas by default', () => {
    const canvas = new Canvas()
    assert.strictEqual(canvas.canvas.width, 800)
    assert.strictEqual(canvas.canvas.height, 450)
  })
  it('should create canvas of specified size', () => {
    const canvas = new Canvas(10, 20)
    assert.strictEqual(canvas.canvas.width, 10)
    assert.strictEqual(canvas.canvas.height, 20)
  })
  it('should resize canvas', () => {
    const canvas = new Canvas(10, 20)
    assert.strictEqual(canvas.canvas.width, 10)
    assert.strictEqual(canvas.canvas.height, 20)
    const newCanvas = new Canvas(200, 250)
    const newImageData = newCanvas.getImageData()
    canvas.putImageData(newImageData)
    assert.strictEqual(canvas.canvas.width, 200)
    assert.strictEqual(canvas.canvas.height, 250)
  })
})
