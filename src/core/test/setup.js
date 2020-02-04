import canvas from 'canvas';

// -----------------
// Node assert
// -----------------
import { strict as assert } from 'assert';
global.assert = assert;

// -----------------
// JSDom
// -----------------
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
const { document } = new JSDOM(`
<!DOCTYPE html>
<html>
  <body>
    <canvas id="gameCanvas" width="650" height="650"></canvas>
  </body>
</html>
`).window;
global.document = document;
global.window = document.defaultView;

// -----------------
// Mocks
// -----------------
global.Audio = class {};
global.Image = class {};
window.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};
window.HTMLCanvasElement = canvas.Canvas;
