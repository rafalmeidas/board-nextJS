import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: 'AIzaSyDridRCAkeYsRACN7QbTc-GDajiu9KwA4I',
  authDomain: 'board-app-253be.firebaseapp.com',
  projectId: 'board-app-253be',
  storageBucket: 'board-app-253be.appspot.com',
  messagingSenderId: '580032401125',
  appId: '1:580032401125:web:309e01ff874354e1084e0c',
  measurementId: 'G-H6H2GNF3R0',
};
// Initialize Firebase
if (!firebase.apps.length) {
  //se não tem conexão aberta abre uma conexão
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
