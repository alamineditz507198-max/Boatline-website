import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

export const firebaseConfig = {
  projectId: firebaseConfigJson.projectId || 'reverberant-encoder-hsmzh',
  appId: firebaseConfigJson.appId || '1:603562371495:web:c1188bf8cedbec4c55ee82',
  apiKey: firebaseConfigJson.apiKey || 'AIzaSyD0KsPqgzsf5pMmKFChPUG89Wwi8_J6oA0',
  authDomain: firebaseConfigJson.authDomain || 'reverberant-encoder-hsmzh.firebaseapp.com',
  storageBucket: firebaseConfigJson.storageBucket || 'reverberant-encoder-hsmzh.firebasestorage.app',
  messagingSenderId: firebaseConfigJson.messagingSenderId || '603562371495',
};

const databaseId = firebaseConfigJson.firestoreDatabaseId || 'ai-studio-08ee8421-2c6c-492e-997a-f9ad7de2d5dc';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID provisioned for this app
export const db = getFirestore(app, databaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Test connection on boot as recommended by Firebase architecture directives
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database initializing.');
    }
  }
}
testConnection();

// Authenticate admin session
export async function authenticateAdmin(): Promise<User | null> {
  try {
    if (auth.currentUser) return auth.currentUser;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Anonymous auth note (fallback mode active):', err);
    return null;
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
