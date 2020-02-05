export {}

describe('Actions', () => {
  describe('File menu', () => {
    it('should create blank canvas')
    it('should open file')
    it('should save file')
  })
  it('should paste image from file')
  describe('Resizers', () => {
    it('should resize canvas according to background color')
    it('should disable selection before resize')
  })
  describe('Clipboard', () => {
    it('should copy selected part')
    it('should paste from clipboard')
    it('should resize canvas if pasted image is bigger')
    it('should cut selected part')
  })
  describe('Selection manipulation', () => {
    it('should rotate selection')
    it('should mirror selection horizontally and vertically')
    it('should cut off from its sides')
  })
})
