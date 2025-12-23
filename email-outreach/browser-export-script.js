/**
 * FIREBASE CONSOLE BROWSER EXPORT SCRIPT
 *
 * HOW TO USE:
 * 1. Open Firebase Console: https://console.firebase.google.com/project/orbital-temple/firestore
 * 2. Open browser Developer Tools (F12 or Cmd+Option+I)
 * 3. Go to "Console" tab
 * 4. Paste this entire script and press Enter
 * 5. Wait for it to finish
 * 6. It will download a JSON file automatically
 */

(async function exportFirestoreData() {
  console.log('🚀 Starting Firestore export...');

  try {
    // Get Firestore instance from Firebase Console
    const db = firebase.firestore();

    console.log('📥 Fetching names collection...');
    const snapshot = await db.collection('names').get();

    console.log(`✅ Found ${snapshot.size} documents`);

    // Convert to array of objects
    const data = [];
    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log('💾 Preparing download...');

    // Convert to JSON
    const jsonData = JSON.stringify(data, null, 2);

    // Create download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'names-export-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✨ Export complete! Check your downloads folder.');
    console.log(`📊 Exported ${data.length} records`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    console.log('Make sure you are on the Firebase Console page and logged in.');
  }
})();
