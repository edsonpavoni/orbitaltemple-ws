/**
 * Export Firebase names to CSV for Resend email campaign
 *
 * This script:
 * 1. Reads all records from Firestore "names" collection
 * 2. Calculates days since submission
 * 3. Detects language based on email domain heuristics
 * 4. Exports to CSV files (one for English, one for Portuguese)
 *
 * Usage: tsx export-names-for-resend.ts
 */

import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Initialize Firebase Admin with service account
const serviceAccount = require("../service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "orbital-temple"
});

const db = admin.firestore();

interface NameDocument {
  name: string;
  email: string;
  status: "pending" | "sent" | "confirmed" | "deleted";
  createdAt: admin.firestore.Timestamp;
  ipAddress?: string;
  country?: string;
  countryCode?: string;
}

interface ExportRecord {
  email: string;
  name: string;
  daysAgo: number;
  language: string;
  submissionDate: string;
}

/**
 * Detect language based on email domain heuristics
 */
function detectLanguage(email: string): string {
  const emailLower = email.toLowerCase();

  // Brazilian email domains and providers
  const brazilianDomains = [
    ".br",           // Brazil TLD
    "uol.com",       // UOL (Brazilian ISP)
    "globo.com",     // Globo
    "terra.com.br",  // Terra Brazil
    "bol.com.br",    // BOL
    "ig.com.br",     // IG
    "r7.com",        // R7
    "zipmail.com.br"
  ];

  // Check if email matches Brazilian patterns
  for (const domain of brazilianDomains) {
    if (emailLower.includes(domain)) {
      return "pt";
    }
  }

  // Default to English
  return "en";
}

/**
 * Calculate days between two dates
 */
function calculateDaysAgo(submissionDate: Date): number {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - submissionDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeCsvField(field: string): string {
  if (!field) return "";

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

/**
 * Convert records array to CSV string
 */
function recordsToCSV(records: ExportRecord[]): string {
  // CSV header
  const header = "email,name,daysAgo,language,submissionDate\n";

  // CSV rows
  const rows = records.map(record => {
    return [
      escapeCsvField(record.email),
      escapeCsvField(record.name),
      record.daysAgo.toString(),
      record.language,
      record.submissionDate
    ].join(',');
  }).join('\n');

  return header + rows;
}

/**
 * Main export function
 */
async function exportNames() {
  console.log("🚀 Starting Firebase export for Resend campaign...\n");

  try {
    // Fetch all names from Firestore
    console.log("📥 Fetching names from Firestore...");
    const namesSnapshot = await db.collection("names").get();

    console.log(`   Found ${namesSnapshot.size} total records\n`);

    const allRecords: ExportRecord[] = [];
    const englishRecords: ExportRecord[] = [];
    const portugueseRecords: ExportRecord[] = [];

    let processedCount = 0;
    let skippedCount = 0;

    // Process each document
    namesSnapshot.forEach((doc) => {
      const data = doc.data() as NameDocument;

      // Skip if no email or name
      if (!data.email || !data.name) {
        skippedCount++;
        return;
      }

      // Skip if status is deleted
      if (data.status === "deleted") {
        skippedCount++;
        return;
      }

      // Calculate days since submission
      const submissionDate = data.createdAt.toDate();
      const daysAgo = calculateDaysAgo(submissionDate);

      // Detect language
      const language = detectLanguage(data.email);

      // Create export record
      const record: ExportRecord = {
        email: data.email.trim(),
        name: data.name.trim(),
        daysAgo: daysAgo,
        language: language,
        submissionDate: submissionDate.toISOString().split('T')[0] // YYYY-MM-DD
      };

      // Add to appropriate lists
      allRecords.push(record);
      if (language === "pt") {
        portugueseRecords.push(record);
      } else {
        englishRecords.push(record);
      }

      processedCount++;
    });

    console.log(`✅ Processed ${processedCount} records`);
    console.log(`⏭️  Skipped ${skippedCount} records (deleted or invalid)\n`);

    console.log(`📊 Language breakdown:`);
    console.log(`   English: ${englishRecords.length} records`);
    console.log(`   Portuguese: ${portugueseRecords.length} records\n`);

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Export all records to one CSV
    const allCsvPath = path.join(outputDir, "all-names.csv");
    const allCsv = recordsToCSV(allRecords);
    fs.writeFileSync(allCsvPath, allCsv, "utf8");
    console.log(`💾 Saved all records to: ${allCsvPath}`);

    // Export English records
    const enCsvPath = path.join(outputDir, "names-english.csv");
    const enCsv = recordsToCSV(englishRecords);
    fs.writeFileSync(enCsvPath, enCsv, "utf8");
    console.log(`💾 Saved English records to: ${enCsvPath}`);

    // Export Portuguese records
    const ptCsvPath = path.join(outputDir, "names-portuguese.csv");
    const ptCsv = recordsToCSV(portugueseRecords);
    fs.writeFileSync(ptCsvPath, ptCsv, "utf8");
    console.log(`💾 Saved Portuguese records to: ${ptCsvPath}\n`);

    // Print sample records for verification
    console.log("📋 Sample records (first 3 English):");
    englishRecords.slice(0, 3).forEach((record, i) => {
      console.log(`   ${i + 1}. ${record.name} (${record.email}) - ${record.daysAgo} days ago`);
    });

    console.log("\n📋 Sample records (first 3 Portuguese):");
    portugueseRecords.slice(0, 3).forEach((record, i) => {
      console.log(`   ${i + 1}. ${record.name} (${record.email}) - ${record.daysAgo} days ago`);
    });

    console.log("\n✨ Export complete!");
    console.log("\nNext steps:");
    console.log("1. Review the CSV files in the 'output' folder");
    console.log("2. Import names-english.csv to Resend (create 'Orbital Temple - English' audience)");
    console.log("3. Import names-portuguese.csv to Resend (create 'Orbital Temple - Portuguese' audience)");
    console.log("4. Set up email templates with merge fields: {{name}} and {{daysAgo}}");
    console.log("5. Send the campaigns!\n");

  } catch (error) {
    console.error("❌ Error during export:", error);
    throw error;
  } finally {
    // Close Firebase connection
    await admin.app().delete();
  }
}

// Run the export
exportNames()
  .then(() => {
    console.log("🎉 Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
