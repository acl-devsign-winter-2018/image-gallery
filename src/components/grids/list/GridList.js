import html from './grid-list.html';
import './grid-list.css';
import Template from '../../Template';
import Grid from './Grid';
import { db } from '../../../services/firebase';

const template = new Template(html);
const grids = db.ref('grids');

export default class GridList {

  render() {
    const dom = template.clone();

    const ul = dom.querySelector('ul');
    
    const map = new Map();
    
    this.childAdded = grids.on('child_added', data => {
      const grid = new Grid(data.key, data.val());
      const gridDom = grid.render();
      map.set(data.key, {
        component: grid,
        nodes: [...gridDom.childNodes]
      });
    
      ul.appendChild(gridDom);
    });
    
    this.childRemoved = grids.on('child_removed', data => {
      const toRemove = map.get(data.key);
      map.delete(data.key);
      toRemove.nodes.forEach(node => node.remove());
      toRemove.component.unrender();
    });
    
    this.childChange = grids.on('child_changed', data => {
      map.get(data.key).component.update(data.val());
    });

    return dom;
  }

  unrender() {
    grids.off('child_added', this.childAdded);
    grids.off('child_removed', this.childRemoved);
    grids.off('child_changed', this.childChange);
  }
}