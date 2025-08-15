// Firebase Authentication + roles
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let role = "medico";

export function initAuth() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, async user => {
      currentUser = user;
      if (user) {
        // Obtener rol desde Firestore
        const ref = doc(db, "roles", user.uid);
        const snap = await getDoc(ref);
        role = snap.exists() ? snap.data().role : "medico";
      } else {
        role = "public";
      }
      resolve(user);
    });
  });
}
export function login(email, pass) {
  return signInWithEmailAndPassword(auth, email, pass);
}
export function showNotification(msg) {
  // Simple ejemplo de notificación
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg.text || msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

export function setupRealtimeNotifications(userId, cb) {
  // Implementación pendiente: solo llama al callback como ejemplo
  // Puedes conectar aquí tu lógica de notificaciones desde Firebase
  // cb({ text: "Notificaciones en tiempo real no implementadas aún." });
}
export function logout() { return signOut(auth); }
export function getRole(user=currentUser) { return role; }
export function onUserChange(cb) {
  onAuthStateChanged(auth, cb);
}
