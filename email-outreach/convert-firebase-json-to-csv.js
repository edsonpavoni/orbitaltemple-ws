/**
 * Convert Firebase JSON export to CSV for Resend
 * Usage: node convert-firebase-json-to-csv.js names-export.json
 */

const fs = require('fs');
const path = require('path');

// Get input file from command line
const inputFile = process.argv[2] || 'names-export.json';

if (!fs.existsSync(inputFile)) {
  console.error(`❌ File not found: ${inputFile}`);
  console.log('\nUsage: node convert-firebase-json-to-csv.js names-export.json');
  process.exit(1);
}

console.log(`📁 Reading ${inputFile}...`);
const rawData = fs.readFileSync(inputFile, 'utf8');
const data = JSON.parse(rawData);

console.log(`✅ Loaded ${Object.keys(data).length} records\n`);

// Process records
const allRecords = [];
const englishRecords = [];
const portugueseRecords = [];

let processedCount = 0;
let skippedCount = 0;

/**
 * Detect language based on email domain
 */
function detectLanguage(email) {
  const emailLower = email.toLowerCase();
  const brazilianDomains = ['.br', 'uol.com', 'globo.com', 'terra.com.br', 'bol.com.br', 'ig.com.br', 'r7.com'];

  for (const domain of brazilianDomains) {
    if (emailLower.includes(domain)) {
      return 'pt';
    }
  }
  return 'en';
}

/**
 * Calculate days between dates
 */
function calculateDaysAgo(timestamp) {
  const submissionDate = new Date(timestamp._seconds * 1000);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - submissionDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Escape CSV field
 */
function escapeCsvField(field) {
  if (!field) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Process each record
for (const [docId, record] of Object.entries(data)) {
  // Skip if no email or name
  if (!record.email || !record.name) {
    skippedCount++;
    continue;
  }

  // Skip if deleted
  if (record.status === 'deleted') {
    skippedCount++;
    continue;
  }

  // Calculate days
  const daysAgo = calculateDaysAgo(record.createdAt);

  // Detect language
  const language = detectLanguage(record.email);

  // Create record
  const exportRecord = {
    email: record.email.trim(),
    name: record.name.trim(),
    daysAgo: daysAgo,
    language: language,
    submissionDate: new Date(record.createdAt._seconds * 1000).toISOString().split('T')[0]
  };

  allRecords.push(exportRecord);

  if (language === 'pt') {
    portugueseRecords.push(exportRecord);
  } else {
    englishRecords.push(exportRecord);
  }

  processedCount++;
}

console.log(`✅ Processed ${processedCount} records`);
console.log(`⏭️  Skipped ${skippedCount} records\n`);
console.log(`📊 Language breakdown:`);
console.log(`   English: ${englishRecords.length} records`);
console.log(`   Portuguese: ${portugueseRecords.length} records\n`);

/**
 * Convert to CSV
 */
function toCSV(records) {
  const header = 'email,name,daysAgo,language,submissionDate\n';
  const rows = records.map(r =>
    `${escapeCsvField(r.email)},${escapeCsvField(r.name)},${r.daysAgo},${r.language},${r.submissionDate}`
  ).join('\n');
  return header + rows;
}

// Create output directory
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write CSV files
const allCsvPath = path.join(outputDir, 'all-names.csv');
fs.writeFileSync(allCsvPath, toCSV(allRecords), 'utf8');
console.log(`💾 Saved: ${allCsvPath}`);

const enCsvPath = path.join(outputDir, 'names-english.csv');
fs.writeFileSync(enCsvPath, toCSV(englishRecords), 'utf8');
console.log(`💾 Saved: ${enCsvPath}`);

const ptCsvPath = path.join(outputDir, 'names-portuguese.csv');
fs.writeFileSync(ptCsvPath, toCSV(portugueseRecords), 'utf8');
console.log(`💾 Saved: ${ptCsvPath}\n`);

// Show samples
console.log('📋 Sample English records:');
englishRecords.slice(0, 3).forEach((r, i) => {
  console.log(`   ${i+1}. ${r.name} (${r.email}) - ${r.daysAgo} days ago`);
});

console.log('\n📋 Sample Portuguese records:');
portugueseRecords.slice(0, 3).forEach((r, i) => {
  console.log(`   ${i+1}. ${r.name} (${r.email}) - ${r.daysAgo} days ago`);
});

console.log('\n✨ Export complete!');
console.log('\nNext steps:');
console.log('1. Review CSV files in output/ folder');
console.log('2. Go to Resend: https://resend.com/audiences');
console.log('3. Create two audiences and import the CSVs');
console.log('4. Set up email templates');
console.log('5. Send! 🚀\n');
