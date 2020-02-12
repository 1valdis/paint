import { assert } from 'chai'
import { Canvas } from '../src/Canvas'
import { Selection } from '../src/Selection'

export {}

describe('Selection', () => {
  it('should create selection from coordinates', () => {
    const canvas = new Canvas()
    const selection = new Selection(canvas, {
      top: 100,
      left: 101,
      width: 102,
      height: 103
    })
    assert.deepStrictEqual(selection.currentSelection, {
      top: 100,
      left: 101,
      width: 102,
      height: 103
    })
  })
  it('should create selection from coordinates with background color opacity')
  it('should create selection of custom shape')
  it('should create selection from image data')
  it('should move selection')
  it('should not change background color after first move')
  it('should remove selection')
})
