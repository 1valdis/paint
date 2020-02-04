import * as assert from 'assert'
import { Pen } from '../src/Pen'
import { Canvas } from '../src/Canvas'

describe('Pen', () => {
  it('should draw a point on given coordinates', () => {
    const canvas = new Canvas(5, 5)
    const pen = new Pen(canvas, { x: 2, y: 3 }, { r: 14, g: 88, b: 228 })
    pen.finishLine()
    const newImageData = canvas.getImageData()
    assert.strictEqual(newImageData.data[(newImageData.width * 3 + 2) * 4], 14)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 3 + 2) * 4 + 1],
      88
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 3 + 2) * 4 + 2],
      228
    )
  })

  it('should not draw anything until line is finished', () => {
    const canvas = new Canvas(5, 5)
    const pen = new Pen(canvas, { x: 2, y: 3 }, { r: 14, g: 88, b: 228 })
    const newImageData = canvas.getImageData()
    assert.strictEqual(newImageData.data[(newImageData.width * 3 + 2) * 4], 255)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 3 + 2) * 4 + 1],
      255
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 3 + 2) * 4 + 2],
      255
    )
  })

  it('should draw lines correctly', () => {
    const canvas = new Canvas(10, 10)
    const pen = new Pen(canvas, { x: 1, y: 1 }, { r: 14, g: 88, b: 228 })
    pen.continueLine({ x: 5, y: 5 })
    pen.continueLine({ x: -10, y: 5 })
    pen.continueLine({ x: 9, y: 9 })
    pen.finishLine()
    const newImageData = canvas.getImageData()

    // starting point
    assert.strictEqual(newImageData.data[(newImageData.width * 1 + 1) * 4], 14)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 1 + 1) * 4 + 1],
      88
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 1 + 1) * 4 + 2],
      228
    )

    // point on first part of line
    assert.strictEqual(newImageData.data[(newImageData.width * 4 + 4) * 4], 14)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 4 + 4) * 4 + 1],
      88
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 4 + 4) * 4 + 2],
      228
    )

    // point on second part of line
    assert.strictEqual(newImageData.data[(newImageData.width * 5 + 1) * 4], 14)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 5 + 1) * 4 + 1],
      88
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 5 + 1) * 4 + 2],
      228
    )

    // finish point
    assert.strictEqual(newImageData.data[(newImageData.width * 9 + 9) * 4], 14)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 9 + 9) * 4 + 1],
      88
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 9 + 9) * 4 + 2],
      228
    )

    // other random point
    assert.strictEqual(newImageData.data[(newImageData.width * 2 + 3) * 4], 255)
    assert.strictEqual(
      newImageData.data[(newImageData.width * 2 + 3) * 4 + 1],
      255
    )
    assert.strictEqual(
      newImageData.data[(newImageData.width * 2 + 3) * 4 + 2],
      255
    )
  })
})
