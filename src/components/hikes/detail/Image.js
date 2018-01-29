import html from './image.html';
import Template from '../../Template';
import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);

export default class Image {
  constructor(src, onRemove) {
    this.src = src;
    this.onRemove = onRemove;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('img').src = getUrl(this.src, 'c_scale,w_400,bo_2px_solid_rgb:385432');
    dom.querySelector('button').addEventListener('click', () => {
      this.onRemove();
    });

    return dom;
  }
}