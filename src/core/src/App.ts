import { ImageClipboard } from './ImageClipboard';
import { ImageFile } from './ImageFile';

export class App {
  private clipboard: ImageClipboard;

  constructor() {
    this.clipboard = new ImageClipboard();
  }

  async init() {
    await this.clipboard.init();
  }
}
