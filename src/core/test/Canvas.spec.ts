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
})
