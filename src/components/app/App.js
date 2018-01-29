import Template from '../Template';
import html from './app.html';
import './app.css';
import { removeChildren } from '../dom';
import Header from './Header';
import Home from '../home/Home';
import Hikes from '../hikes/Hikes';

const template = new Template(html);

const map = new Map();
map.set('#home', Home);
map.set('#hikes', Hikes);

export default class App {

  constructor() {
    this.hashChange = () => this.setPage();
    window.addEventListener('hashchange', this.hashChange);
  }

  setPage() {
    const routes = window.location.hash.split('/');
    const page = routes[0];
    if(window.location.hash !== '#home') {
      this.footer.classList.remove('hidden');
      this.header.classList.remove('hidden');
    }
    if(window.location.hash === '#home' || window.location.hash === '') {
      this.footer.classList.add('hidden');
      this.header.classList.add('hidden');
    }
    if(page === this.page) return;

    if(this.pageComponent) this.pageComponent.unrender();
    this.page = page;
    const Component = map.get(this.page) || Home;
    this.pageComponent = new Component();
    removeChildren(this.main);
    this.main.appendChild(this.pageComponent.render());
    
  }

  render() {
    const dom = template.clone();   

    dom.querySelector('header').appendChild(new Header().render());

    this.footer = dom.querySelector('#footer');
    this.header = dom.querySelector('#header');
    this.main = dom.querySelector('main');
    this.setPage();

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}
