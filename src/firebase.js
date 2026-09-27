import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export function getFirebaseConfig() {
  const customConfigStr = localStorage.getItem('yukti_admin_firebase_config');
  if (customConfigStr) {
    try {
      return JSON.parse(customConfigStr);
    } catch (e) {
      console.error('Invalid custom Firebase config in localStorage:', e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  };
}

let app = null;
let db = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (config.apiKey && config.projectId) {
    try {
      app = getApps().length === 0 ? initializeApp(config) : getApp();
      db = getFirestore(app);
      return { app, db, isConfigured: true };
    } catch (err) {
      console.error('[Firebase Admin] Init failed:', err);
      return { app: null, db: null, isConfigured: false, error: err.message };
    }
  }
  return { app: null, db: null, isConfigured: false };
}

const instance = initFirebase();
app = instance.app;
db = instance.db;

export { app, db };
