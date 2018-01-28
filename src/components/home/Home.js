import html from './home.html';
import Template from '../Template';

const template = new Template(html);

export default class Home {

  render() {
    const dom = template.clone();

    const splash = dom.querySelector('#splash');
    splash.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.hash = '#hikes';
    });

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}