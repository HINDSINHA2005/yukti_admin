import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Generic Fetch Collection
 */
export async function getCollectionItems(collectionName, sortField = 'createdAt', direction = 'desc') {
  if (!db) {
    console.warn(`[AdminService] Firestore not initialized for ${collectionName}`);
    return [];
  }

  try {
    let q;
    try {
      q = query(collection(db, collectionName), orderBy(sortField, direction));
    } catch {
      q = collection(db, collectionName);
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(`[AdminService] Error fetching ${collectionName}:`, err);
    throw err;
  }
}

/**
 * Generic Add Document
 */
export async function addItem(collectionName, data) {
  if (!db) throw new Error('Firestore not initialized. Configure Firebase credentials in Settings.');
  
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, collectionName), payload);
  return { id: docRef.id, ...payload };
}

/**
 * Generic Update Document
 */
export async function updateItem(collectionName, id, data) {
  if (!db) throw new Error('Firestore not initialized.');
  
  const docRef = doc(db, collectionName, id);
  const payload = {
    ...data,
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, payload);
  return { id, ...payload };
}

/**
 * Generic Delete Document
 */
export async function deleteItem(collectionName, id) {
  if (!db) throw new Error('Firestore not initialized.');
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return id;
}

/**
 * Enquiries Helper Functions
 */
export async function getEnquiries() {
  return getCollectionItems('enquiries', 'submittedAt', 'desc');
}

export async function updateEnquiryStatus(id, status) {
  return updateItem('enquiries', id, { status });
}

export async function deleteEnquiry(id) {
  return deleteItem('enquiries', id);
}
