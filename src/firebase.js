import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function getFirebaseConfig() {
  const customConfigStr = typeof window !== 'undefined' ? localStorage.getItem('yukti_admin_firebase_config') : null;
  if (customConfigStr) {
    try {
      return JSON.parse(customConfigStr);
    } catch (e) {
      console.error('Invalid custom Firebase config in localStorage:', e);
    }
  }

  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' && process.env ? process.env : {});

  return {
    apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyBtUShIHy6dhnJ2pwRSBt0ef3GbK7M7hb8',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'loginlogout-bae71.firebaseapp.com',
    projectId: env.VITE_FIREBASE_PROJECT_ID || 'loginlogout-bae71',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'loginlogout-bae71.firebasestorage.app',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '462567498722',
    appId: env.VITE_FIREBASE_APP_ID || '1:462567498722:web:5e8bff98d813654724cfbb'
  };
}

let app = null;
let db = null;
let auth = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (config.apiKey && config.projectId) {
    try {
      app = getApps().length === 0 ? initializeApp(config) : getApp();
      db = getFirestore(app);
      auth = getAuth(app);
      return { app, db, auth, isConfigured: true };
    } catch (err) {
      console.error('[Firebase Admin] Init failed:', err);
      return { app: null, db: null, auth: null, isConfigured: false, error: err.message };
    }
  }
  return { app: null, db: null, auth: null, isConfigured: false };
}

const instance = initFirebase();
app = instance.app;
db = instance.db;
auth = instance.auth;

export { app, db, auth };
