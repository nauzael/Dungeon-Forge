import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
export { onAuthStateChanged };
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database, ref, onValue, Unsubscribe } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Capacitor } from '@capacitor/core';

// Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
};

// Initialize Firebase
let firebaseApp: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let databaseInstance: Database | null = null;
let storageInstance: FirebaseStorage | null = null;

// MUST be before RTDB init below — onValue can fire synchronously for .info/connected
// and accessing a `let`-declared variable in its TDZ throws ReferenceError.
let rtdbAvailable = false;

try {
  firebaseApp = initializeApp(firebaseConfig);
  authInstance = getAuth(firebaseApp);

  // En Android WebView (Capacitor), Firestore puede fallar con WebChannel.
  // Force a more stable transport to avoid "transport errored".
  if (Capacitor.getPlatform() === 'android') {
    firestoreInstance = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true,
    });
  } else {
    firestoreInstance = getFirestore(firebaseApp);
  }

  databaseInstance = getDatabase(firebaseApp);
  storageInstance = getStorage(firebaseApp);

  // Validate RTDB connectivity (non-blocking)
  // CRITICAL: Do NOT call goOffline() — it's a one-way door that permanently kills
  // the RTDB instance for the session. Instead, set rtdbAvailable flag for fallback.
  if (databaseInstance && firebaseConfig.databaseURL) {
    const rtdbRef = ref(databaseInstance, '.info/connected');
    const timeout = setTimeout(() => {
      rtdbAvailable = false;
    }, 5000);
    let unsub: Unsubscribe | null = null;
     
    unsub = onValue(rtdbRef, (snap) => {
      clearTimeout(timeout);
      const connected = snap.val() === true;
      if (connected) {
        rtdbAvailable = true;
      } else {
        rtdbAvailable = false;
      }
      // Guard: onValue fires synchronously, so unsub may still be null on first call
      if (unsub) unsub();
    }, (err) => {
      clearTimeout(timeout);
      rtdbAvailable = false;
    });
  }

  // Handle redirect result from OAuth flow
  if (authInstance) {
    getRedirectResult(authInstance)
      .then((result: unknown) => {
        if (result && typeof result === 'object' && 'user' in result) {
          const resultObj = result as { user: { email: string | null } };
        }
      })
      .catch((_error: unknown) => {
        // Ignore redirect result errors during init
      });
  }
} catch (e) {
}

export const auth = authInstance;
export const firestore = firestoreInstance;
export const database = databaseInstance;
export const storage = storageInstance;

export const isRtdbAvailable = () => rtdbAvailable;

/** Timeout helper for Firestore operations that can hang indefinitely when Firestore is unreachable */
export const firestoreTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`[Timeout] ${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
