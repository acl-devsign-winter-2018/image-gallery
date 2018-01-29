import Template from '../../Template';
import html from './hike-detail.html';
import Images from './Images';
import { db } from '../../../services/firebase';

const template = new Template(html);
const hikes = db.ref('hikes');

export default class hikeDetail {
  constructor(key) {
    this.key = key;
    this.hike = hikes.child(key);
  }

  render() {
    const dom = template.clone();

    const header = dom.querySelector('h2');
    const location = dom.querySelector('h3');
    const description = dom.querySelector('p');
    const name = dom.querySelector('.name');

    this.onValue = this.hike.on('value', data => {
      const hike = data.val();
      header.textContent = hike.name;
      location.textContent = hike.location;
      description.textContent = hike.description;
      name.textContent = ` ${hike.name}`;
    });

    this.images = new Images(this.key);
    dom.querySelector('section.images').append(this.images.render());

    return dom;
  }

  unrender() {
    hikes.child(this.key).off('value', this.onValue);
    this.images.unrender();
  }
}