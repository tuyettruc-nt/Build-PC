// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEsDm_-MWsTE78NrduBEAfFsRfCUP-F-U",
  authDomain: "build-pc-3e7ae.firebaseapp.com",
  projectId: "build-pc-3e7ae",
  storageBucket: "build-pc-3e7ae.appspot.com",
  messagingSenderId: "695612617718",
  appId: "1:695612617718:web:a87140f8782cb9e2804dd7",
  measurementId: "G-THKJ7WNKL0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, firebase };
