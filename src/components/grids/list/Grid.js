import Template from '../../Template';
import html from './grid.html';
import './grid.css';
import { db } from '../../../services/firebase';
import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);
const gridsImages = db.ref('grid-images');

export default class Grid {
  constructor(key, grid) {
    this.key = key;
    this.grid = grid;
    this.gridImages = gridsImages.child(key).limitToFirst(1);
  }

  update(grid) {
    this.caption.textContent = `${grid.name}`;
    this.subcaption.textContent = `${grid.type}`;
    this.image.alt = grid.name;
  }

  render() {
    const dom = template.clone();

    dom.querySelector('a').href = `#grids/${this.key}`;
    this.caption = dom.querySelector('h2');
    this.subcaption = dom.querySelector('h4');
    this.image = dom.querySelector('img');

    this.update(this.grid);
    
    this.onValue = this.gridImages.on('child_added', data => {
      this.image.src = getUrl(data.val(), 'c_fill,w_500,h_500');
    });

    return dom;
  }

  unrender() {
    this.gridImages.off('child_added', this.onValue);
  }
}