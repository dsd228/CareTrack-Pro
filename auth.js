// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBW0QcJ5jCCx52l9qfYPTj5lUHp1TjlSpA",
  authDomain: "caretrackweb.firebaseapp.com",
  projectId: "caretrackweb",
  storageBucket: "caretrackweb.firebasestorage.app",
  messagingSenderId: "31200607142",
  appId: "1:31200607142:web:c4902c1a4a1b30d962ad67",
  measurementId: "G-0G8GHGHF7Y"
};

// Inicializa Firebase y los módulos
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let role = "medico";

// Iniciar autenticación y obtener rol del usuario
export function initAuth() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, async user => {
      currentUser = user;
      if (user) {
        try {
          // Busca el rol en Firestore (colección 'roles', documento con UID)
          const ref = doc(db, "roles", user.uid);
          const snap = await getDoc(ref);
          role = snap.exists() ? snap.data().role : "medico";
        } catch {
          role = "medico";
        }
      } else {
        role = "public";
      }
      resolve(user);
    });
  });
}

// Login con email y password
export function login(email, pass) {
  return signInWithEmailAndPassword(auth, email, pass);
}

// Logout
export function logout() { return signOut(auth); }

// Obtener el rol actual
export function getRole(user=currentUser) { return role; }

// Callback para cambios de usuario autenticado
export function onUserChange(cb) {
  onAuthStateChanged(auth, cb);
}
