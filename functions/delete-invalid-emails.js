const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

async function deleteInvalidEmailEntries() {
  try {
    console.log('Fetching all names...');
    const namesSnapshot = await db.collection('names').get();

    console.log(`Total entries: ${namesSnapshot.size}`);

    const invalidEntries = [];
    const validEntries = [];

    namesSnapshot.forEach(doc => {
      const data = doc.data();
      if (isValidEmail(data.email)) {
        validEntries.push(doc.id);
      } else {
        invalidEntries.push({
          id: doc.id,
          name: data.name,
          email: data.email,
        });
      }
    });

    console.log(`\nValid emails: ${validEntries.length}`);
    console.log(`Invalid emails: ${invalidEntries.length}`);

    // Show sample of invalid entries
    console.log('\nSample of invalid entries (first 10):');
    invalidEntries.slice(0, 10).forEach(entry => {
      console.log(`  - Name: "${entry.name}", Email: "${entry.email}"`);
    });

    // Ask for confirmation
    console.log(`\n⚠️  About to delete ${invalidEntries.length} entries with invalid emails.`);
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Starting deletion...');

    // Delete in batches of 500 (Firestore limit)
    let deletedCount = 0;
    const batchSize = 500;

    for (let i = 0; i < invalidEntries.length; i += batchSize) {
      const batch = db.batch();
      const batchEntries = invalidEntries.slice(i, i + batchSize);

      batchEntries.forEach(entry => {
        const docRef = db.collection('names').doc(entry.id);
        batch.delete(docRef);
      });

      await batch.commit();
      deletedCount += batchEntries.length;
      console.log(`Deleted ${deletedCount} / ${invalidEntries.length} entries...`);
    }

    console.log('\n✅ Deletion complete!');
    console.log(`Deleted: ${deletedCount} entries`);
    console.log(`Remaining: ${validEntries.length} entries with valid emails`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the deletion
deleteInvalidEmailEntries();
