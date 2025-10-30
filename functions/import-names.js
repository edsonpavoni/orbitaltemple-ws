const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin with service account
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importNames() {
  const csvPath = path.join(__dirname, '..', 'names_e-mails_aws.csv');
  const csvData = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvData.split('\n').filter(line => line.trim());

  console.log(`Found ${lines.length} names to import`);

  let imported = 0;
  let errors = 0;
  let batch = db.batch();
  let batchCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (format: ID,Name,Email,UUID,...,timestamp,...)
    const parts = line.split(',');

    if (parts.length < 8) {
      console.log(`Skipping invalid line ${i + 1}: ${line}`);
      errors++;
      continue;
    }

    const name = parts[1].trim();
    const email = parts[2].trim();
    const timestamp = parts[7].trim();

    // Skip if name or email is empty
    if (!name || !email) {
      console.log(`Skipping line ${i + 1}: missing name or email`);
      errors++;
      continue;
    }

    // Convert timestamp to Firestore Timestamp
    let createdAt;
    try {
      const date = new Date(timestamp);
      createdAt = admin.firestore.Timestamp.fromDate(date);
    } catch (e) {
      console.log(`Invalid timestamp on line ${i + 1}: ${timestamp}`);
      createdAt = admin.firestore.Timestamp.now();
    }

    // Create document reference
    const docRef = db.collection('names').doc();

    // Add to batch
    batch.set(docRef, {
      name: name,
      email: email,
      status: 'pending',
      createdAt: createdAt
    });

    batchCount++;
    imported++;

    // Firestore batch limit is 500 operations
    if (batchCount === 500) {
      await batch.commit();
      console.log(`Imported ${imported} names so far...`);
      batch = db.batch(); // Create new batch
      batchCount = 0;
    }

    // Progress update every 1000 records
    if (imported % 1000 === 0) {
      console.log(`Progress: ${imported} / ${lines.length}`);
    }
  }

  // Commit remaining batch
  if (batchCount > 0) {
    await batch.commit();
  }

  console.log('\n=== Import Complete ===');
  console.log(`Total imported: ${imported}`);
  console.log(`Errors/Skipped: ${errors}`);
  console.log(`Total processed: ${lines.length}`);
}

// Run the import
importNames()
  .then(() => {
    console.log('\nImport finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
