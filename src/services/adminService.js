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

/**
 * Certificate & Document Studio Helper Functions
 */
export async function getCertificates() {
  return getCollectionItems('certificates', 'createdAt', 'desc');
}

export async function createCertificateDoc(data = {}) {
  if (!db) throw new Error('Firestore not initialized.');

  const type = data.type || 'training_certificate';
  const prefix = 
    type === 'internship_offer' ? 'YUK-OFFER' :
    type === 'mou' ? 'YUK-MOU' :
    type === 'internship_certificate' ? 'YUK-INT' : 'YUK-CERT';

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  const certId = data.certId ? data.certId.trim().toUpperCase() : `${prefix}-${currentYear}-${randomNum}`;

  const payload = {
    id: certId,
    certId: certId,
    type: type,
    studentName: (data.studentName || '').trim(),
    college: (data.college || '').trim(),
    title: (data.title || data.courseOrRole || '').trim(),
    duration: (data.duration || '').trim(),
    issueDate: data.issueDate || new Date().toISOString().split('T')[0],
    grade: (data.grade || 'Grade A+ (Distinction)').trim(),
    skills: (data.skills || '').trim(),
    projectTitle: (data.projectTitle || '').trim(),
    stipend: (data.stipend || '').trim(),
    startDate: data.startDate || '',
    validTill: data.validTill || '',
    instructor: (data.instructor || 'Lead Technical Faculty').trim(),
    authorizedSignatory: (data.authorizedSignatory || 'Director of Academic Affairs').trim(),
    status: 'active',
    verificationSeal: 'Authenticated by Yukti Software Greater Noida',
    createdAt: new Date().toISOString(),
    serverTimestamp: serverTimestamp()
  };

  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(db, 'certificates', certId), payload);
  return payload;
}

export async function deleteCertificateDoc(certId) {
  if (!db || !certId) return false;
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(db, 'certificates', certId));
  return true;
}

