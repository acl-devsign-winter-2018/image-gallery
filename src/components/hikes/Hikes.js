import Template from '../Template';
import html from './hikes.html';
import AddHike from './add/AddHike';
import HikeDetail from './detail/HikeDetail.js';
import HikeList from './list/HikeList';
import { removeChildren } from '../dom';

const template = new Template(html);

export default class Hikes {
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
    if(childPage === 'add') childComponent = new AddHike();
    else if(childPage) childComponent = new HikeDetail(childPage);
    else childComponent = new HikeList();

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