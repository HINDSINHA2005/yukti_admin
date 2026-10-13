import { db } from '../firebase.js';
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
    let snapshot;
    try {
      const q = query(collection(db, collectionName), orderBy(sortField, direction));
      snapshot = await getDocs(q);
    } catch (orderErr) {
      console.warn(`[AdminService] OrderBy failed for ${collectionName}, falling back to plain fetch:`, orderErr.message);
      snapshot = await getDocs(collection(db, collectionName));
    }
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Client-side fallback sort
    return items.sort((a, b) => {
      const valA = a[sortField] || a.submittedAt || a.createdAt || '';
      const valB = b[sortField] || b.submittedAt || b.createdAt || '';
      return direction === 'desc'
        ? String(valB).localeCompare(String(valA))
        : String(valA).localeCompare(String(valB));
    });
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
    type === 'workshop_certificate' ? 'YUK-WS' :
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
    endDate: data.endDate || '',
    validTill: data.validTill || '',
    description: (data.description || '').trim(),
    ceoSignatureUrl: data.ceoSignatureUrl || '',
    ctoSignatureUrl: data.ctoSignatureUrl || '',
    ceoName: data.ceoName || 'MANISHA KUMARI',
    ceoTitle: data.ceoTitle || 'Founder & CEO',
    ctoName: data.ctoName || 'MITHILESH KUMAR',
    ctoTitle: data.ctoTitle || 'CTO',
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

/**
 * Workshop Registrations Helper Functions
 */
export async function getWorkshopRegistrations() {
  return getCollectionItems('workshop_registrations', 'submittedAt', 'desc');
}

export async function updateWorkshopRegistration(id, data) {
  return updateItem('workshop_registrations', id, data);
}

export async function deleteWorkshopRegistration(id) {
  return deleteItem('workshop_registrations', id);
}

/**
 * Generates an Official Verified Certificate for a Workshop Attendee
 * Saves in `certificates` collection and updates registration status
 */
export async function generateWorkshopCertificate(registration, options = {}) {
  if (!db) throw new Error('Firestore not initialized.');

  const currentYear = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const certId = options.certId || `YUK-WS-${currentYear}-${randomNum}`;
  
  const studentName = (registration.studentName || 'Participant').trim();
  const college = (registration.college || 'College / University').trim();
  const course = (registration.course || 'Degree Program').trim();
  const section = registration.section ? ` (${registration.section})` : '';
  const passingYear = registration.passingYear ? ` • Class of ${registration.passingYear}` : '';
  const workshopName = (registration.workshopName || 'Full Stack Web Development').trim();
  const workshopDate = registration.workshopDate || new Date().toISOString().split('T')[0];

  const defaultDescription = `This is to certify that ${studentName} from ${college} (${course}${section}${passingYear}) has actively participated and successfully completed the Hands-on Industrial Workshop on "${workshopName}" conducted by Yukti Software on ${workshopDate}. During this workshop, the participant demonstrated keen learning, analytical skills, and exemplary technical engagement.`;

  const certPayload = {
    id: certId,
    certId: certId,
    type: 'workshop_certificate',
    subtitle: 'OF WORKSHOP PARTICIPATION & COMPLETION',
    studentName: studentName,
    college: college,
    title: workshopName,
    duration: 'Hands-on Technical Workshop Session',
    issueDate: workshopDate,
    startDate: workshopDate,
    endDate: workshopDate,
    grade: options.grade || 'Exemplary Participation (Grade A+)',
    skills: options.skills || `${workshopName}, Technical Hands-on Lab, Yukti Software Industrial Training`,
    projectTitle: options.projectTitle || `${workshopName} Practical Implementation`,
    rollNumber: (registration.rollNumber || '').trim(),
    description: options.description || defaultDescription,
    ceoSignatureUrl: options.ceoSignatureUrl || (typeof localStorage !== 'undefined' ? localStorage.getItem('yukti_global_ceo_sign') : '') || '',
    ctoSignatureUrl: options.ctoSignatureUrl || (typeof localStorage !== 'undefined' ? localStorage.getItem('yukti_global_cto_sign') : '') || '',
    ceoName: options.ceoName || 'MANISHA KUMARI',
    ceoTitle: options.ceoTitle || 'Founder & CEO',
    ctoName: options.ctoName || 'MITHILESH KUMAR',
    ctoTitle: options.ctoTitle || 'CTO',
    instructor: options.instructor || 'Lead Technical Workshop Faculty',
    authorizedSignatory: options.authorizedSignatory || 'Manisha Kumari (Founder & CEO)',
    status: 'active',
    verificationSeal: 'Authenticated by Yukti Software Greater Noida',
    registrationRefId: registration.registrationId || registration.id || '',
    createdAt: new Date().toISOString(),
    serverTimestamp: serverTimestamp()
  };

  const { doc, setDoc, updateDoc } = await import('firebase/firestore');
  
  // 1. Create certificate in 'certificates' collection
  await setDoc(doc(db, 'certificates', certId), certPayload);

  // 2. Mark registration doc as certificateIssued: true
  if (registration.id) {
    try {
      await updateDoc(doc(db, 'workshop_registrations', registration.id), {
        certificateIssued: true,
        certificateId: certId,
        certificateGeneratedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to update registration status:', e);
    }
  }

  return certPayload;
}


