import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, addDoc,
         serverTimestamp, Timestamp, getCountFromServer } from 'firebase/firestore';

const app = initializeApp({ projectId: 'orbital-temple', apiKey: 'fake-api-key' });
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

const base = {
  name: 'Rules Test',
  email: 'test@example.com',
  language: 'en',
  status: 'pending',
  needsEnrichment: true,
  confirmationEmailSent: false,
  submittedVia: 'client-fallback',
};

// The exact shape src/lib/firebaseClient.ts writes.
try {
  const ref = await addDoc(collection(db, 'names'), { ...base, createdAt: serverTimestamp() });
  console.log('PASS  serverTimestamp() write ALLOWED ->', ref.id);
} catch (e) {
  console.log('FAIL  serverTimestamp() write DENIED ->', e.code, '|', e.message);
}

// The alternative, in case serverTimestamp is rejected by the rule.
try {
  const ref = await addDoc(collection(db, 'names'), { ...base, createdAt: Timestamp.now() });
  console.log('PASS  Timestamp.now() write ALLOWED ->', ref.id);
} catch (e) {
  console.log('FAIL  Timestamp.now() write DENIED ->', e.code, '|', e.message);
}

// The counter fallback.
try {
  const s = await getCountFromServer(collection(db, 'names'));
  console.log('PASS  getCountFromServer ALLOWED -> count =', s.data().count);
} catch (e) {
  console.log('FAIL  getCountFromServer DENIED ->', e.code, '|', e.message);
}
process.exit(0);
