import { Canvas } from './Canvas'
import { Fill } from './Fill'
import { Pen } from './Pen'
import assert from 'assert'
// import { ImageFile } from './ImageFile';
// import { ImageClipboard } from './ImageClipboard';
// import { createCanvas } from './utils';

const canvas = new Canvas(10, 10)
const fill = new Fill(canvas)
const pen = new Pen(canvas, { x: 5, y: 0 }, { r: 255, g: 255, b: 255 })
pen.continueLine({ x: 5, y: 4 })
pen.continueLine({ x: 6, y: 5 })
pen.continueLine({ x: 10, y: 5 })
pen.finishLine()
fill.fill({ x: 2, y: 8 }, { r: 100, g: 100, b: 100 })
const newImageData = canvas.getImageData()

// separated zone
assert.strictEqual(newImageData.data[(newImageData.width * 1 + 8) * 4], 0)
assert.strictEqual(newImageData.data[(newImageData.width * 1 + 8) * 4 + 1], 0)
assert.strictEqual(newImageData.data[(newImageData.width * 1 + 8) * 4 + 2], 0)
// line
assert.strictEqual(newImageData.data[(newImageData.width * 5 + 6) * 4], 255)
assert.strictEqual(newImageData.data[(newImageData.width * 5 + 6) * 4 + 1], 255)
assert.strictEqual(newImageData.data[(newImageData.width * 5 + 6) * 4 + 2], 255)
// filled zone
assert.strictEqual(newImageData.data[(newImageData.width * 8 + 2) * 4], 100)
assert.strictEqual(newImageData.data[(newImageData.width * 8 + 2) * 4 + 1], 100)
assert.strictEqual(newImageData.data[(newImageData.width * 8 + 2) * 4 + 2], 100)

// (async () => {
//   const canvas = new Canvas();
//   const clipboard = new ImageClipboard();
//   await clipboard.init();
//   canvas.putImageData(ImageFile.create());

//   const onPaste = async () => {
//     const blob = await clipboard.paste();
//     if (!blob) return;
//     const url = window.URL.createObjectURL(blob);
//     const img = document.createElement('img');
//     img.src = url;
//     await new Promise(resolve => {
//       img.onload = resolve;
//     });
//     const { canvas, context } = createCanvas(img.width, img.height);
//     context.drawImage(img, 0, 0);
//   };
// })();
