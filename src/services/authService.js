import { auth } from '../firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const OFFICIAL_ADMIN_EMAIL = 'contact@yuktisoftware.com';

/**
 * Sign in admin user using Firebase Authentication
 * Automatically seeds contact@yuktisoftware.com if not already registered.
 */
export async function signInAdmin(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    throw new Error('Please enter both admin email and password.');
  }

  if (!auth) {
    // Fallback if Firebase Auth is not initialized
    if (cleanEmail === OFFICIAL_ADMIN_EMAIL && cleanPass === 'yukti2026') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('yukti_admin_auth', 'true');
        localStorage.setItem('yukti_admin_email', cleanEmail);
      }
      return { email: cleanEmail, uid: 'offline_admin' };
    }
    throw new Error('Firebase Authentication is not configured.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yukti_admin_auth', 'true');
      localStorage.setItem('yukti_admin_email', cred.user.email);
      localStorage.setItem('yukti_admin_uid', cred.user.uid);
    }
    return cred.user;
  } catch (err) {
    console.warn('[AuthService] Sign-in error:', err.code, err.message);

    // Auto-seed if the user does not exist yet for contact@yuktisoftware.com
    if (
      cleanEmail === OFFICIAL_ADMIN_EMAIL && 
      cleanPass === 'yukti2026' &&
      (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')
    ) {
      try {
        console.log('[AuthService] Attempting auto-seed for contact@yuktisoftware.com...');
        const createCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        if (typeof window !== 'undefined') {
          localStorage.setItem('yukti_admin_auth', 'true');
          localStorage.setItem('yukti_admin_email', createCred.user.email);
          localStorage.setItem('yukti_admin_uid', createCred.user.uid);
        }
        return createCred.user;
      } catch (createErr) {
        if (createErr.code === 'auth/email-already-in-use') {
          throw new Error('Incorrect password for ' + cleanEmail + '. Please check password.');
        }
        throw new Error(createErr.message || 'Failed to authenticate admin.');
      }
    }

    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password. Please try again.');
    } else if (err.code === 'auth/too-many-requests') {
      throw new Error('Access temporarily blocked due to multiple failed attempts. Try again later.');
    } else if (err.code === 'auth/user-not-found') {
      throw new Error(`Admin account "${cleanEmail}" not found in Firebase Authentication.`);
    } else {
      throw new Error(err.message || 'Firebase Authentication failed.');
    }
  }
}

/**
 * Sign out admin user from Firebase Authentication
 */
export async function signOutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('yukti_admin_auth');
    localStorage.removeItem('yukti_admin_email');
    localStorage.removeItem('yukti_admin_uid');
  }

  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[AuthService] Sign out error:', e);
    }
  }
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Get currently authenticated admin user
 */
export function getCurrentAdminUser() {
  if (auth?.currentUser) {
    return auth.currentUser;
  }
  if (typeof window !== 'undefined') {
    const email = localStorage.getItem('yukti_admin_email');
    const isAuth = localStorage.getItem('yukti_admin_auth') === 'true';
    return isAuth && email ? { email } : null;
  }
  return null;
}
