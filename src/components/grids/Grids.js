import html from './grids.html';
import './grids.css';
import Template from '../Template';
import AddGrid from './add/AddGrid';
import GridDetail from './detail/GridDetail';
import GridList from './list/GridList';
import { removeChildren } from '../dom';

const template = new Template(html);

export default class Grids {

  constructor() {
    this.hashChange = () => this.setChildPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setChildPage() {
    const routes = window.location.hash.split('/');
    const childPage = routes[1] || '';
    if(this.childPage === childPage) return;

    this.childPage = childPage;
    if(this.childComponent) this.childComponent.unrender();
    removeChildren(this.section);

    let childComponent;
    if(childPage === 'add') childComponent = new AddGrid();
    else if(childPage) childComponent = new GridDetail(childPage);
    else childComponent = new GridList();

    this.childComponent = childComponent;
    this.section.appendChild(childComponent.render());
  }

  render() {
    const dom = template.clone();

    this.section = dom.querySelector('section');
    this.setChildPage();

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}