/**
 * Lazy client-side Firebase access.
 *
 * Used as a fallback path when the Cloud Functions backend is unavailable
 * (e.g. the project drops off the Blaze plan and every function returns 500,
 * as happened between 2026-07-21 and 2026-08-07).
 *
 * Firestore keeps working on the free Spark plan, and firestore.rules already
 * allow public read on `names` plus shaped public create, so the memorial can
 * still accept and count names with the functions backend completely down.
 *
 * Everything here is loaded via dynamic import so the Firestore SDK is only
 * pulled into the bundle when the fallback actually fires.
 */

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: 'orbital-temple.firebaseapp.com',
  databaseURL: 'https://orbital-temple-default-rtdb.firebaseio.com',
  projectId: 'orbital-temple',
  storageBucket: 'orbital-temple.firebasestorage.app',
  messagingSenderId: '811887257933',
  appId: '1:811887257933:web:e8a5ef835911dc94cbaf04',
};

async function getDb() {
  const [{ initializeApp, getApps, getApp }, firestore] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return { db: firestore.getFirestore(app), firestore };
}

/**
 * Write a name straight to Firestore, bypassing the submitName function.
 *
 * The document is intentionally marked `needsEnrichment` because this path
 * cannot do what submitName does server-side: resolve the submitter's country
 * from their IP, and send the immediate confirmation email via Resend.
 * `enrichPendingSubmissions` in functions/src/index.ts backfills both once the
 * backend is healthy again.
 *
 * Returns the new document id.
 */
export async function submitNameDirect(params: {
  name: string;
  email: string;
  language: string;
}): Promise<string> {
  const { db, firestore } = await getDb();

  const docRef = await firestore.addDoc(firestore.collection(db, 'names'), {
    name: params.name.trim(),
    email: params.email.trim().toLowerCase(),
    language: params.language,
    status: 'pending',
    createdAt: firestore.serverTimestamp(),
    // Flags for enrichPendingSubmissions: no IP geolocation, no email sent yet.
    needsEnrichment: true,
    confirmationEmailSent: false,
    submittedVia: 'client-fallback',
  });

  return docRef.id;
}

/**
 * Count names directly from Firestore using a server-side aggregation.
 *
 * This mirrors what getCachedNameCount reports (an unfiltered count of the
 * `names` collection) without reading any documents, so it stays cheap and
 * works on the free plan.
 */
export async function countNamesDirect(): Promise<number> {
  const { db, firestore } = await getDb();

  const snapshot = await firestore.getCountFromServer(
    firestore.collection(db, 'names')
  );

  return snapshot.data().count;
}
