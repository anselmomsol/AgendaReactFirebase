import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyA76g0kMywQ8Slt6rtEOUYs3bmWARheVSM",
    authDomain: "firestore-534c7.firebaseapp.com",
    projectId: "firestore-534c7",
    storageBucket: "firestore-534c7.appspot.com",
    messagingSenderId: "306109279402",
    appId: "1:306109279402:web:430fc4a473d0cdbf0f34d3",
    measurementId: "G-G3JWT8SLDK"
  };
  // Initialize Firebase
  const fireb = firebase.initializeApp(firebaseConfig);
  
  const store = fireb.firestore();

  export {store}