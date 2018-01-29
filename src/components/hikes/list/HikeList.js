import html from './hikelist.html';
import Template from '../../Template';
import Hike from './Hike';
import AddHike from '../add/AddHike';
import { db } from '../../../services/firebase';

const template = new Template(html);
const hikes = db.ref('hikes');

export default class HikeList {
  
  render() {
    const dom = template.clone();
    
    const ul = dom.querySelector('ul');

    const map = new Map();

    this.childAdded = hikes.on('child_added', data => {
      const hike = new Hike(data.key, data.val());
      const hikeDom = hike.render();
      map.set(data.key, {
        component: hike,
        nodes: [...hikeDom.childNodes]
      });

      ul.appendChild(hikeDom);
    });

    this.childRemoved = hikes.on('child_removed', data => {
      const toRemove = map.get(data.key);
      map.delete(data.key);
      toRemove.nodes.forEach(node => node.remove());
      toRemove.component.unrender();
    });

    this.childChange = hikes.on('child_changed', data => {
      map.get(data.key).component.update(data.val());
    });

    dom.querySelector('#add-hike').appendChild(new AddHike().render());

    return dom;
  }

  unrender() {
    hikes.off('child_added', this.childAdded);
    hikes.off('child_removed', this.childRemoved);
    hikes.off('child_changed', this.childChange);
  }
}