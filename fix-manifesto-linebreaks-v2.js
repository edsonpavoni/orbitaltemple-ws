const fs = require('fs');
const path = require('path');

// Find all manifesto.json files recursively
function findManifestoFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findManifestoFiles(fullPath));
    } else if (item.name === 'manifesto.json') {
      files.push(fullPath);
    }
  }

  return files;
}

// Apply transformations based on paragraph index and structure
function transformParagraph(para, index) {
  let updated = para;
  let modified = false;

  // Paragraph 3 (index 3): "Everything in a temple is an invocation" - cathedral/tree/gold section
  if (index === 3) {
    // Find "cathedral" or similar and split pattern after it and before "that makes"
    // Pattern: "cathedral" + text + "," -> "cathedral\n" + text + ",\n\n"
    const parts = updated.split('\n');
    if (parts.length >= 2 && !parts[0].includes('\n\n')) {
      // Look for the invocation line, typically 2nd sentence
      const match = updated.match(/([^\n]+)\n(.+cathedral[^,\n]*)(,?\s*)(.+small[^,\n]*)(,?\s*)(.*tree[^,\n]*)(,?\s*)(.+within[^,\n]*)(,?\s*)(.*?(desert|bare)[^,\n]*)(,?\s*)(.*?gold[^,\n]*)(,?\s*)(.+transcendence.*)/is);
      if (match) {
        updated = match[1] + '\n' +
                  match[2] + '\n' + match[4] + ',\n\n' +
                  match[6] + '\n' + match[8] + ',\n\n' +
                  match[10] + ',\n\n' +
                  match[12] + '\n' + match[14];
        modified = true;
      }
    }
  }

  // Paragraph 4 (index 4): "The artist..." - split after final comma in first phrase
  if (index === 4) {
    // Pattern: "The artist, like... shaman," should have line break after last comma
    // Then later "to lend... born," should also split
    const lines = updated.split('\n');

    // First line: look for pattern ending with shaman/chamán/etc + comma
    if (lines[0] && !lines[0].endsWith(',\n')) {
      const firstCommaPos = lines[0].lastIndexOf(',');
      if (firstCommaPos > 0 && firstCommaPos > lines[0].length * 0.5) {
        // If there's a comma in second half of first line, add break
        lines[0] = lines[0].substring(0, firstCommaPos + 1) + '\n' + lines[0].substring(firstCommaPos + 1).trim();
        modified = true;
      }
    }

    // Look for "born" or "nacer" or similar - 4th line typically
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/(born|nacer|nascere|né|geboren|나타나|nascido|рожден)/i)) {
        const commaPos = lines[i].indexOf(',');
        if (commaPos > 0 && lines[i][commaPos + 1] !== '\n') {
          lines[i] = lines[i].substring(0, commaPos + 1) + '\n' + lines[i].substring(commaPos + 1).trim();
          modified = true;
        }
      }
    }

    if (modified) {
      updated = lines.join('\n');
    }
  }

  // Paragraph 6 (index 6): "The doors of a temple..." - split "cut," and "enter/and who"
  if (index === 6) {
    // Split after "cut" and around "who can enter and who cannot"
    updated = updated.replace(/(cut|cortar|tagliare|couper|schneiden|切る|cortar|резать),(\s+)/i, '$1,\n');
    updated = updated.replace(/(enter|entrar|entrare|entrer|eintreten|들어가|entrar|войти)(\s+)(and who|y quienes|e chi|et qui|und wer|그리고|e quem|и кто)/i, '$1\n$3');
    if (updated !== para) modified = true;
  }

  // Paragraph 9 (index 9): "A church... mosque... shrine" - each on own line
  if (index === 9) {
    // Find lines with church/mosque/shrine and ensure they're separated
    const churchPattern = /(church|iglesia|chiesa|église|Kirche|教会|igreja|церковь)([^,\n]+),(\s*)(mosque|mezquita|moschea|mosquée|Moschee|モスク|mesquita|мечеть)([^,\n]+),(\s*)(shrine|santuario|sanctuaire|Schrein|神社|santuário|храм)/i;
    if (churchPattern.test(updated)) {
      updated = updated.replace(churchPattern, '$1$2,\n$4$5,\n$7');
      modified = true;
    }
  }

  // Paragraph 13 (index 13): "Yes, this place is space..." - split firmament line
  if (index === 13) {
    // Split "firmament," from "celestial vault"
    updated = updated.replace(/(firmament|firmamento|firmament|Firmament|大空|firmamento|небосвод),(\s+)(the celestial|la bóveda|la volta|la voûte|das Himmels|天空|a abóbada|небесный)/i, '$1,\n$3');
    if (updated !== para) modified = true;
  }

  // Paragraph 14 (index 14): "There may exist a place beyond every border" - split into lines
  if (index === 14) {
    // Split after "border,", "beings,", "group,"
    updated = updated.replace(/(border|frontera|confine|frontière|Grenze|国境|fronteira|граница),(\s+)/i, '$1,\n');
    updated = updated.replace(/(beings|seres|esseri|êtres|Wesen|存在|seres|существ),(\s+)/i, '$1,\n');
    updated = updated.replace(/(group|grupo|gruppo|groupe|Gruppe|グループ|grupo|группа),(\s+)/i, '$1,\n');
    if (updated !== para) modified = true;
  }

  // Paragraph 15 (index 15): "An artistic invitation..." - split after "space,"
  if (index === 15) {
    updated = updated.replace(/(space|espacio|spazio|espace|Raum|宇宙|espaço|космос),(\s+)(a temple|un templo|un tempio|un temple|ein Tempel|寺院|um templo|храм)/i, '$1,\n$3');
    if (updated !== para) modified = true;
  }

  // Paragraph 16 (index 16): "And we will hold it... aligns" - split after "aligns"
  if (index === 16) {
    updated = updated.replace(/(aligns|alinea|si allinea|s'aligne|ausrichtet|整列|alinha|выравнивается)(\s+)(with|con|avec|mit|と|com|с)/i, '$1\n$3');
    if (updated !== para) modified = true;
  }

  return { updated, modified };
}

const files = findManifestoFiles('public/locales');
console.log(`Found ${files.length} manifesto.json files\n`);

let totalModified = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!data.paragraphs || !Array.isArray(data.paragraphs)) {
      console.log(`⊘ Skipping ${filePath} - no paragraphs array`);
      return;
    }

    let fileModified = false;

    // Process each paragraph
    data.paragraphs = data.paragraphs.map((para, index) => {
      const result = transformParagraph(para, index);
      if (result.modified) {
        fileModified = true;
      }
      return result.updated;
    });

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ Updated ${filePath}`);
      totalModified++;
    }

  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Done! Modified ${totalModified} files.`);
