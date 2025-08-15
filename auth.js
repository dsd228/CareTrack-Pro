import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBW0QcJ5jCCx52l9qfYPTj5lUHp1TjlSpA",
  authDomain: "caretrackweb.firebaseapp.com",
  projectId: "caretrackweb",
  storageBucket: "caretrackweb.appspot.com", // corregido!
  messagingSenderId: "31200607142",
  appId: "1:31200607142:web:c4902c1a4a1b30d962ad67",
  measurementId: "G-0G8GHGHF7Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let currentUser = null;
let role = "medico";

export function initAuth() {
  return new Promise(resolve => {
    onAuthStateChanged(auth, async user => {
      currentUser = user;
      if (user) {
        try {
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

export function login(email, pass) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export function logout() { return signOut(auth); }

export function getRole(user=currentUser) { return role; }

export function onUserChange(cb) {
  onAuthStateChanged(auth, cb);
}

export async function register(email, pass, name, roleUser="medico") {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "roles", cred.user.uid), {
    role: roleUser,
    name: name,
    email: email
  });
  return cred.user;
}
