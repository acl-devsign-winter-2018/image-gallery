import Template from '../../Template';
import html from './add-hike.html';
import { db } from '../../../services/firebase';

const template = new Template(html);
const hikes = db.ref('hikes');

export default class AddHike {
  constructor(onAdd) {
    this.onAdd = onAdd;
  }

  handleSubmit(form) {
    this.error.textContent = '';

    const data = new FormData(form);
    const hike = {};
    data.forEach((value, key) => hike[key] = value);    
    
    const ref = hikes.push();
    ref.set(hike)
      .then(() => window.location.hash = `#hikes/${ref.key}`)
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
      if(window.location.hash == '#hikes') this.form.reset();
      else window.location.hash = '#hikes';
    });

    return dom;
  }

  unrender() {
    // no-op
  }
}