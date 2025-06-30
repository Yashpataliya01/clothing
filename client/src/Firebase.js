// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRheJ56fBX7ZLWN7Fbgy5KahiZoG8K8jc",
  authDomain: "clothing-7205b.firebaseapp.com",
  projectId: "clothing-7205b",
  storageBucket: "clothing-7205b.firebasestorage.app",
  messagingSenderId: "516452441896",
  appId: "1:516452441896:web:3ebadb13410aff9f1ffa1d",
  measurementId: "G-Q7LR1YJMCM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
