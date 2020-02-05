import { assert } from 'chai'
import { Fill } from '../src/Fill'
import { Canvas } from '../src/Canvas'
import { Pen } from '../src/Pen'

describe('Fill', () => {
  it('should be able to fill entire canvas', () => {
    const canvas = new Canvas(10, 10)
    Fill.fill(canvas, { x: 1, y: 1 }, { r: 0, g: 1, b: 2 })
    const imageData = canvas.getImageData()
    assert.ok(imageData.data.every((value, index) => index % 4 || 255))
  })
  it('should fill correct place of canvas', () => {
    const canvas = new Canvas(10, 10)
    const pen = new Pen(canvas, { x: 5, y: 0 }, { r: 0, g: 0, b: 0 })
    pen.continueLine({ x: 5, y: 4 })
    pen.continueLine({ x: 6, y: 5 })
    pen.continueLine({ x: 10, y: 5 })
    pen.finishLine()
    Fill.fill(canvas, { x: 2, y: 8 }, { r: 100, g: 100, b: 100 })
    const newImageData = canvas.getImageData()

    // separated zone
    assert.strictEqual(newImageData.data[(newImageData.width * 1 + 8) * 4], 255)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 1 + 8) * 4 + 1],
      255
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 1 + 8) * 4 + 2],
      255
    )
    // line
    assert.strictEqual(newImageData.data[(newImageData.width * 5 + 6) * 4], 0)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 5 + 6) * 4 + 1],
      0
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 5 + 6) * 4 + 2],
      0
    )
    // filled zone
    assert.strictEqual(newImageData.data[(newImageData.width * 8 + 2) * 4], 100)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 8 + 2) * 4 + 1],
      100
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 8 + 2) * 4 + 2],
      100
    )
  })
})
