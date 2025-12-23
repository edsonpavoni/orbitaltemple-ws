const fs = require('fs');
const path = require('path');

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

const enData = JSON.parse(fs.readFileSync('public/locales/en/manifesto.json', 'utf8'));

const files = findManifestoFiles('public/locales');
let totalModified = 0;

files.forEach(filePath => {
  if (filePath.includes('/en/')) return;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.paragraphs) return;

    let fileModified = false;
    const lang = path.basename(path.dirname(filePath));

    // Para 7: Doors - should have 6 lines
    if (data.paragraphs[7] && data.paragraphs[7].split('\n').length < 6) {
      let p = data.paragraphs[7];
      const enLines = enData.paragraphs[7].split('\n').length;
      const currentLines = p.split('\n');

      // First line should be split after first comma
      if (currentLines.length < 6 && currentLines[0]) {
        const firstComma = currentLines[0].indexOf(',');
        if (firstComma > 0 && firstComma < currentLines[0].length - 5) {
          currentLines[0] = currentLines[0].substring(0, firstComma + 1) + '\n' + currentLines[0].substring(firstComma + 1).trim();
        }
      }

      p = currentLines.join('\n');
      if (p.split('\n').length !== data.paragraphs[7].split('\n').length) {
        data.paragraphs[7] = p;
        fileModified = true;
      }
    }

    // Para 16: Place beyond borders - should have 4 lines
    if (data.paragraphs[16] && data.paragraphs[16].split('\n').length < 4) {
      let p = data.paragraphs[16];
      // Split after 1st, 2nd, and 3rd commas
      const commas = [];
      for (let i = 0; i < p.length; i++) {
        if (p[i] === ',' || p[i] === '،' || p[i] === '、') {
          commas.push(i);
        }
      }

      if (commas.length >= 3) {
        // Insert line breaks after first 3 commas (in reverse to preserve indices)
        for (let i = 2; i >= 0; i--) {
          const pos = commas[i] + 1;
          // Skip if already has line break
          if (p[pos] !== '\n') {
            p = p.substring(0, pos) + '\n' + p.substring(pos).trim();
          }
        }
      }

      if (p !== data.paragraphs[16]) {
        data.paragraphs[16] = p;
        fileModified = true;
      }
    }

    // Para 18: Artistic invitation - should have 2 lines
    if (data.paragraphs[18] && data.paragraphs[18].split('\n').length < 2) {
      let p = data.paragraphs[18];
      // Find first comma and split there
      const firstComma = p.indexOf(',');
      if (firstComma > 0 && firstComma < p.length - 5) {
        p = p.substring(0, firstComma + 1) + '\n' + p.substring(firstComma + 1).trim();
      }

      if (p !== data.paragraphs[18]) {
        data.paragraphs[18] = p;
        fileModified = true;
      }
    }

    // Para 20: Aligns - should have 7 lines
    if (data.paragraphs[20] && data.paragraphs[20].split('\n').length < 7) {
      let p = data.paragraphs[20];
      const lines = p.split('\n');

      // Find line with "align" and split before "with/con/avec/mit/com"
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/alinee|aligns|allinea|aligne|ausrichtet|整列|alinha|выравнивается|정렬|संरेखित/i)) {
          // Split before with/con/etc
          lines[i] = lines[i].replace(/(\S+)\s+(with|con|avec|mit|と|com|с|와|के साथ)/i, '$1\n$2');
        }
      }

      p = lines.join('\n');
      if (p !== data.paragraphs[20]) {
        data.paragraphs[20] = p;
        fileModified = true;
      }
    }

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ ${lang}`);
      totalModified++;
    }

  } catch (error) {
    console.error(`✗ ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Modified ${totalModified} files`);
