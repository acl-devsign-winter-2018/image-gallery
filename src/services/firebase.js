import firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyDcZ3A1n9e2-4AKy1zeAofog6xdo-qq9e0',
  authDomain: 'gallery-app-3a98b.firebaseapp.com',
  databaseURL: 'https://gallery-app-3a98b.firebaseio.com',
  projectId: 'gallery-app-3a98b',
  storageBucket: 'gallery-app-3a98b.appspot.com',
  messagingSenderId: '784609845835'
};

const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database(); //the real-time database
export const storage = firebase.storage(); //the firebase storage adjunct for images
export const auth = firebaseApp.auth(); //the firebase auth namespace