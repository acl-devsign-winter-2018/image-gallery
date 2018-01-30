import html from './add-grid.html';
import './add-grid.css';
import Template from '../../Template';
//upload
// import Upload from '../detail/Upload';
//
import { db } from '../../../services/firebase';

const template = new Template(html);
const grids = db.ref('grids');

export default class AddGrid {
  
  constructor(onAdd) {
    this.onAdd = onAdd;
    // this.key = key;
    // this.grid = grids.child(key);
  }

  handleSubmit(form) {
    this.error.textContent = '';

    const data = new FormData(form);
    const grid = {};
    data.forEach((value, key) => grid[key] = value);    
    
    const ref = grids.push();
    ref.set(grid)
      .then(() => window.location.hash = `#grids/${ref.key}`)
      .catch(err => this.error.textContent = err);
  }

  render() {
    const dom = template.clone();

    this.error = dom.querySelector('.error');

    this.form = dom.querySelector('form');
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.handleSubmit(event.target);
    });

    dom.querySelector('button[type=button]').addEventListener('click', event => {
      event.preventDefault();
      window.location.hash = '#grids';
    });

    // upload
    // this.images = new Upload(this.key);
    // dom.querySelector('section.images').append(this.images.render());

    return dom;
  }

  unrender() {
    // upload
    // grids.child(this.key).off('value', this.onValue);
    // this.images.unrender();
  }
}