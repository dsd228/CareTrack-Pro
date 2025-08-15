// firebase.js
// Centraliza la inicialización de Firebase (modular v9+)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW0QcJ5jCCx52l9qfYPTj5lUHp1TjlSpA",
  authDomain: "caretrackweb.firebaseapp.com",
  projectId: "caretrackweb",
  storageBucket: "caretrackweb.appspot.com",
  messagingSenderId: "31200607142",
  appId: "1:31200607142:web:c4902c1a4a1b30d962ad67",
  measurementId: "G-0G8GHGHF7Y"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
