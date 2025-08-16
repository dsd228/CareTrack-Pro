// Mock auth functions for local development
export async function createUserWithEmailAndPassword(auth, email, password) {
  const user = { uid: 'mock_' + Date.now(), email, displayName: 'Mock User' };
  localStorage.setItem('mock_user', JSON.stringify(user));
  return { user };
}

export async function signInWithEmailAndPassword(auth, email, password) {
  const user = { uid: 'mock_' + Date.now(), email, displayName: 'Mock User' };
  localStorage.setItem('mock_user', JSON.stringify(user));
  return { user };
}

export async function signOut(auth) {
  localStorage.removeItem('mock_user');
}

export function onAuthStateChanged(auth, callback) {
  // Simulate auth state
  setTimeout(() => {
    const user = localStorage.getItem('mock_user');
    callback(user ? JSON.parse(user) : null);
  }, 100);
  return () => {}; // unsubscribe function
}

export async function updateProfile(user, profile) {
  const currentUser = JSON.parse(localStorage.getItem('mock_user') || '{}');
  Object.assign(currentUser, profile);
  localStorage.setItem('mock_user', JSON.stringify(currentUser));
}