// Mock auth.js for development/testing when Firebase is not available
import { auth, db } from './firebase.js';

console.log('Using mock auth implementation');

export let currentUser = null;
export let currentRole = "public";

// Mock Firebase auth functions
const mockCreateUserWithEmailAndPassword = async (email, password) => {
  return {
    user: {
      uid: 'mock-user-id',
      email: email,
      displayName: 'Mock User'
    }
  };
};

const mockSignInWithEmailAndPassword = async (email, password) => {
  return {
    user: {
      uid: 'mock-user-id',
      email: email,
      displayName: 'Mock User'
    }
  };
};

const mockSignOut = async () => {
  return Promise.resolve();
};

const mockOnAuthStateChanged = (auth, callback) => {
  // Simulate no user logged in
  setTimeout(() => callback(null), 100);
  return () => {}; // unsubscribe function
};

const mockUpdateProfile = async (user, profile) => {
  return Promise.resolve();
};

const mockDoc = (db, collection, id) => {
  return { mockCollection: collection, mockId: id };
};

const mockSetDoc = async (docRef, data) => {
  console.log('Mock setDoc:', docRef, data);
  return Promise.resolve();
};

const mockGetDoc = async (docRef) => {
  return {
    exists: () => false,
    data: () => ({ role: 'medico' })
  };
};

export function subscribeAuth(callback) {
  return mockOnAuthStateChanged(auth, async user => {
    currentUser = user;
    if (user) {
      currentRole = "medico";
    } else {
      currentRole = "public";
    }
    callback?.(user);
  });
}

export async function checkAuthState(action) {
  if (action === 'check') {
    return currentUser;
  } else if (action === 'logout') {
    await mockSignOut();
    currentUser = null;
    currentRole = "public";
    return null;
  }
  return currentUser;
}

export async function login(email, password) {
  try {
    const result = await mockSignInWithEmailAndPassword(email, password);
    currentUser = result.user;
    currentRole = "medico";
    return result.user;
  } catch (error) {
    throw error;
  }
}

export async function register(email, password, displayName, role = "medico") {
  try {
    const result = await mockCreateUserWithEmailAndPassword(email, password);
    await mockUpdateProfile(result.user, { displayName });
    await mockSetDoc(mockDoc(db, "roles", result.user.uid), { role, displayName });
    currentUser = result.user;
    currentRole = role;
    return result.user;
  } catch (error) {
    throw error;
  }
}

export function getRole() {
  return currentRole;
}

export function getUser() {
  return currentUser;
}