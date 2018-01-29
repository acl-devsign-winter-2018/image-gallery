import Template from '../../Template';
import html from './hike.html';
import { db } from '../../../services/firebase';
import { getUrl } from '../../../services/cloudinary';

const template = new Template(html);
const hikesImages = db.ref('hike-images');

export default class Hike {
  constructor(key, hike) {
    this.key = key;
    this.hike = hike;
    this.hikeImages = hikesImages.child(key).limitToFirst(1);
  }

  update(hike) {
    this.caption.textContent = `${hike.name}: ${hike.location}`;
    this.image.alt = hike.name;
  }

  render() {
    const dom = template.clone();
    dom.querySelector('a').href = `#hikes/${this.key}`;
    this.caption = dom.querySelector('figcaption');
    this.image = dom.querySelector('img');

    this.update(this.hike);
    
    this.onValue = this.hikeImages.on('child_added', data => {
      this.image.src = getUrl(data.val(), 'c_scale,w_400,bo_2px_solid_rgb:385432');
    });

    return dom;
  }

  unrender() {
    this.hikeImages.off('child_added', this.onValue);
  }
}