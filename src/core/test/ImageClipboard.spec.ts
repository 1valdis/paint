import { assert } from 'chai'
import { ImageClipboard } from '../src/ImageClipboard'

describe('ImageClipboard', () => {
  it('should be able to copy image', async () => {
    const imageClipboard = new ImageClipboard()
    await imageClipboard.init()
    const canvas = document.createElement('canvas')
    await imageClipboard.copy(canvas)
  })
  it('should be able to paste image', async () => {
    const imageClipboard = new ImageClipboard()
    await imageClipboard.init()
    const canvas = await imageClipboard.paste()
    assert.exists(canvas)
  }).timeout(60000)
})
