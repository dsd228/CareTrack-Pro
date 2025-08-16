// Mock Firebase for local development
const mockData = {};

// Mock Firestore functions
export function collection(db, collectionName) {
  return { collectionName };
}

export async function getDocs(collectionRef) {
  const data = mockData[collectionRef.collectionName] || {};
  const docs = Object.keys(data).map(id => ({
    id,
    data: () => data[id],
    exists: () => true
  }));
  return { docs };
}

export function doc(db, collectionName, id) {
  return { collectionName, id };
}

export async function getDoc(docRef) {
  const data = mockData[docRef.collectionName]?.[docRef.id];
  return {
    exists: () => !!data,
    data: () => data || {}
  };
}

export async function setDoc(docRef, data) {
  if (!mockData[docRef.collectionName]) {
    mockData[docRef.collectionName] = {};
  }
  mockData[docRef.collectionName][docRef.id] = data;
  console.log('Mock setDoc:', docRef.collectionName, docRef.id, data);
}

export async function deleteDoc(docRef) {
  if (mockData[docRef.collectionName]?.[docRef.id]) {
    delete mockData[docRef.collectionName][docRef.id];
  }
  console.log('Mock deleteDoc:', docRef.collectionName, docRef.id);
}

export async function addDoc(collectionRef, data) {
  const id = 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  if (!mockData[collectionRef.collectionName]) {
    mockData[collectionRef.collectionName] = {};
  }
  mockData[collectionRef.collectionName][id] = data;
  console.log('Mock addDoc:', collectionRef.collectionName, id, data);
  return { id };
}