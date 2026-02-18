// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// REPLACE THIS OBJECT with your actual config from the Firebase dashboard!
const firebaseConfig = {
  apiKey: "AIzaSyAQ58gAC5WnUY1iROEF-jjEasdkyRmjBC0",
  authDomain: "codeyourself-2026.firebaseapp.com",
  projectId: "codeyourself-2026",
  storageBucket: "codeyourself-2026.firebasestorage.app",
  messagingSenderId: "738985310028",
  appId: "1:738985310028:web:901941bceef08eea9c01e9",
  measurementId: "G-M5TZQWEZWL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);