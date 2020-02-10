export interface ChangeImageAction {
  type: 'changeImage'
  payload: {
    fileName?: string
    imageData?: ImageData
  }
}
