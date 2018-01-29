import Template from '../../Template';
import html from './images.html';
import Image from './Image';
import { db, storage } from '../../../services/firebase';

const template = new Template(html);
const hikesImages = db.ref('hike-images');
const hikeImageStorage = storage.ref('hikes');

export default class Images {
  constructor(key) {
    this.hikeImages = hikesImages.child(key);
    this.imageStorage = hikeImageStorage.child(key);
  }

  handleUpload(file) {
    const hikeImage = this.hikeImages.push();
    const uploadTask = this.imageStorage.child(hikeImage.key).put(file);
    
    uploadTask.on('state_changed', (/*snapshot*/) => {
      // progress, pause and cancel events
    }, err => {
      console.error(err);
    }, () => {
      const downloadUrl = uploadTask.snapshot.downloadURL;
      this.fileInput.value = null;
      hikeImage.set(downloadUrl);
    });
  }

  handleEmbed(url) {
    const hikeImage = this.hikeImages.push();
    hikeImage.set(url);
  }

  handleRemove(imageKey) {
    this.hikeImages.child(imageKey).remove();
    const storage = this.imageStorage.child(imageKey);
    storage.delete()
      .catch(err => {
        if(err.code === 'storage/object-not-found') return;
        console.error(err);
      });
  }

  render() {
    const dom = template.clone();

    const uploadForm = dom.querySelector('.upload');
    const addImageButton = dom.querySelector('#add-image');
    const cancelUploadButton = dom.querySelector('#cancel-upload');

    addImageButton.addEventListener('click', (event) => {
      event.preventDefault();
      uploadForm.classList.remove('hidden');
      addImageButton.classList.add('hidden');
    });

    cancelUploadButton.addEventListener('click', (event) => {
      event.preventDefault();
      uploadForm.classList.add('hidden');
      addImageButton.classList.remove('hidden');
    });

    
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
      embedForm.reset();
    });

    const ul = dom.querySelector('ul');
    const map = new Map();

    this.childAdded = this.hikeImages.on('child_added', data => {
      const image = new Image(data.val(), () => this.handleRemove(data.key));
      const imageDom = image.render();
      map.set(data.key, {
        nodes: [...imageDom.childNodes],
        component: image
      });
      ul.appendChild(imageDom);
    });

    this.childRemoved = this.hikeImages.on('child_removed', data => {
      const toRemove = map.get(data.key);
      toRemove.nodes.forEach(node => node.remove());
      // toRemove.component.unrender();
    });

    return dom;
  }

  unrender() {
    this.hikeImages.on('child_added', this.childAdded);
    this.hikeImages.on('child_removed', this.childRemoved);
  }
}