
import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"

 const firebaseConfig = {
  apiKey: "AIzaSyDQDr-Zbo6p3eVgvneEi-qiRWUIquozONk",
  authDomain: "auth-de9bb.firebaseapp.com",
  projectId: "auth-de9bb",
  storageBucket: "auth-de9bb.appspot.com",
  messagingSenderId: "243534955447",
  appId: "1:243534955447:web:72141217b1d2cf08d19e32"
};

firebase.initializeApp(firebaseConfig);

export default firebase;