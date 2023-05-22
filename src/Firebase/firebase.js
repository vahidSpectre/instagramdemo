import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAbUk-cG6FNI_Q6s35InQ60rtxowt12GNE',
  authDomain: 'instagram-c64c7.firebaseapp.com',
  projectId: 'instagram-c64c7',
  storageBucket: 'instagram-c64c7.appspot.com',
  messagingSenderId: '243232603498',
  appId: '1:243232603498:web:c9b84ac835379633f43913',
  measurementId: 'G-E81J5ZKFSL',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
