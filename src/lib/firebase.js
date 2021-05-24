import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBlgOL30AYiEGPIkYriaI1u7aNnRDT7AaA',
  authDomain: 'instagram-clone-c745f.firebaseapp.com',
  projectId: 'instagram-clone-c745f',
  storageBucket: 'instagram-clone-c745f.appspot.com',
  messagingSenderId: '712175176361',
  appId: '1:712175176361:web:3954ad83cb598498aef7b8',
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
