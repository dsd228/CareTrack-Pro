import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "./firebase-auth-mock.js";
import { doc, setDoc, getDoc } from "./firebase-mock.js";

export let currentUser = null;
export let currentRole = "public";

export function subscribeAuth(callback) {
  onAuthStateChanged(auth, async user => {
    currentUser = user;
    if (user) {
      const ref = doc(db, "roles", user.uid);
      const snap = await getDoc(ref);
      currentRole = snap.exists() ? snap.data().role : "medico";
    } else {
      currentRole = "public";
    }
    if (typeof callback === "function") callback(currentUser, currentRole);
  });
}

export async function login(email, pass) {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  return res.user;
}

export async function logout() {
  await signOut(auth);
}

export async function register(email, pass, name, role="medico") {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "roles", cred.user.uid), {
    role, name, email
  });
  return cred.user;
}

export function getRole() {
  return currentRole;
}

export async function checkAuthState(action) {
  if (action === 'check') {
    // Return the current user if authenticated
    const user = localStorage.getItem('mock_user');
    return user ? JSON.parse(user) : null;
  } else if (action === 'logout') {
    // Log out the user
    await signOut(auth);
    currentUser = null;
    currentRole = "public";
  }
}
