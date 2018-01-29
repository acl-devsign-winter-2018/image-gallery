import firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyBW3vuwYeQzQ6WvILHZFKc34pWblZ2roOs',
  authDomain: 'themeapp-8b2fe.firebaseapp.com',
  databaseURL: 'https://themeapp-8b2fe.firebaseio.com',
  projectId: 'themeapp-8b2fe',
  storageBucket: 'themeapp-8b2fe.appspot.com',
  messagingSenderId: '815698127022'
};

const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.database(); //the real-time database
export const storage = firebase.storage(); //the firebase storage adjunct for images