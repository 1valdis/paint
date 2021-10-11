export const save = async (canvas: HTMLCanvasElement, filename: string) => {
  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve)
  )
  const href = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.download = filename
  a.href = href
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(href)
}
