import html from './upload.html';
import './upload.css';
import Image from './Image';
import Template from '../../Template';
import { db, storage } from '../../../services/firebase';

const template = new Template(html);
const gridsImages = db.ref('grid-images');
const gridImageStorage = storage.ref('grids');

export default class Upload {
  constructor(key) {
    this.gridImages = gridsImages.child(key);
    this.imageStorage = gridImageStorage.child(key);
  }

  handleUpload(file) {
    const gridImage = this.gridImages.push();
    const uploadTask = this.imageStorage.child(gridImage.key).put(file);
    
    uploadTask.on('state_changed', (/*snapshot*/) => {
      // progress, pause and cancel events
    }, error => {
      // something went wrong :(
      console.error(error);
    }, () => {
      // success! Get the download url...
      const downloadUrl = uploadTask.snapshot.downloadURL;
      this.fileInput.value = null;
      gridImage.set(downloadUrl);
    });
  }

  handleEmbed(url) {
    const gridImage = this.gridImages.push();
    gridImage.set(url);
  }

  handleRemove(imageKey) {
    this.gridImages.child(imageKey).remove();
    const storage = this.gridStorage.child(imageKey);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);
      });
  }

  render() {
    const dom = template.clone();

    this.fileInput = dom.querySelector('input[type=file]');
    this.fileInput.addEventListener('change', event => {
      const files = event.target.files;
      if(!files || !files.length) return;
      this.handleUpload(files[0]);
    });

    const embedForm = dom.querySelector('form');
    embedForm.addEventListener('submit', event => {
      event.preventDefault();
      this.handleEmbed(event.target.elements.url.value);
    });

    const ul = dom.querySelector('ul');
    const map = new Map();

    this.childAdded = this.gridImages.on('child_added', data => {
      const image = new Image(data.val(), () => this.handleRemove(data.key));
      const imageDom = image.render();
      map.set(data.key, {
        nodes: [...imageDom.childNodes],
        component: image
      });
      ul.appendChild(imageDom);
    });

    this.childRemoved = this.gridImages.on('child_removed', data => {
      const toRemove = map.get(data.key);
      toRemove.nodes.forEach(node => node.remove()); // toRemove.component.unrender();
    });

    return dom;
  }

  unrender() {
    this.gridImages.on('child_added', this.childAdded);
    this.gridImages.on('child_removed', this.childRemoved);
  }
}