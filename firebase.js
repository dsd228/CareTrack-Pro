// Mock Firebase for development/testing when Firebase is not available
console.log('Using mock Firebase implementation');

// Mock Firebase app
export const app = {
  name: 'mock-firebase',
  options: {}
};

// Mock Auth
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Simulate no user logged in
    setTimeout(() => callback(null), 100);
    return () => {}; // unsubscribe function
  },
  signInWithEmailAndPassword: async (email, password) => {
    return {
      user: {
        uid: 'mock-user-id',
        email: email,
        displayName: 'Mock User'
      }
    };
  },
  createUserWithEmailAndPassword: async (email, password) => {
    return {
      user: {
        uid: 'mock-user-id',
        email: email,
        displayName: 'Mock User'
      }
    };
  },
  signOut: async () => {
    return Promise.resolve();
  }
};

// Mock Firestore
export const db = {
  type: 'mock-firestore'
};