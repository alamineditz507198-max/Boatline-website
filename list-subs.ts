import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfigJson from './firebase-applet-config.json';

const app = initializeApp({
  projectId: firebaseConfigJson.projectId,
  appId: firebaseConfigJson.appId,
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
});

const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId);
const auth = getAuth(app);

async function listSubs() {
  await signInAnonymously(auth);
  const snap = await getDocs(collection(db, 'subscribers'));
  console.log('Total subscribers in Firestore:', snap.size);
  snap.forEach((doc) => {
    console.log('ID:', doc.id, 'Data:', doc.data());
  });
  process.exit(0);
}

listSubs();
