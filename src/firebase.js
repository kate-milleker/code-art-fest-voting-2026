// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS OBJECT with your actual config from the Firebase dashboard!
const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);