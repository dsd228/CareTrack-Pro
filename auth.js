import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

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
export function onUserChange(cb) { onAuthStateChanged(auth, cb); }

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
