const fs = require('fs');
const path = require('path');

// Read the English reference
const enData = JSON.parse(fs.readFileSync('public/locales/en/manifesto.json', 'utf8'));
const enLineCounts = enData.paragraphs.map(p => p.split('\n').length);

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

const files = findManifestoFiles('public/locales');
let totalModified = 0;

files.forEach(filePath => {
  if (filePath.includes('/en/')) return; // Skip English

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.paragraphs) return;

    let fileModified = false;
    const lang = path.basename(path.dirname(filePath));

    // Para 5: Artist paragraph (should have 10 lines)
    if (data.paragraphs[5] && data.paragraphs[5].split('\n').length < 10) {
      let p = data.paragraphs[5];
      // Split after shaman/chamán variant in first line
      const lines = p.split('\n');
      if (lines[0]) {
        const match = lines[0].match(/^(.+[,،、]\s*)(.+)$/);
        if (match && match[1].length > lines[0].length * 0.4) {
          lines[0] = match[1] + '\n' + match[2];
          fileModified = true;
        }
      }
      // Split line with "born/nacer" variant
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/nacer|born|né|nascere|nascido|geboren|生まれ|рожден|태어|जन्म|ജനി/i)) {
          const match = lines[i].match(/^([^,،、]+[,،、]\s*)(.+)$/);
          if (match) {
            lines[i] = match[1] + '\n' + match[2];
            fileModified = true;
          }
        }
      }
      data.paragraphs[5] = lines.join('\n');
    }

    // Para 7: Doors paragraph (should have 6 lines)
    if (data.paragraphs[7] && data.paragraphs[7].split('\n').length < 6) {
      let p = data.paragraphs[7];
      // Split after first comma (cut,)
      const match1 = p.match(/^([^,،、]+[,،、]\s*)(.+)$/);
      if (match1) {
        p = match1[1] + '\n' + match1[2];
        fileModified = true;
      }
      // Split "enter\nand who"
      p = p.replace(/(enter|entrar|entrare|entrer|eintreten|入る|войти|들어가|प्रवेश|പ്രവേ)(\s+)(and who|y quienes|e chi|et qui|und wer|そして|и кто|그리고|और|കൂടെ)/i, '$1\n$3');
      // Split "cannot.\nThat is"
      p = p.replace(/(cannot|no pueden|non possono|ne peuvent|nicht können|できない|не могут|할 수 없|नहीं|കഴി)\.\s+(That is|Así es|Così|C'est|Das ist|それが|Так|그것이|यही|അതാണ്)/i, '$1.\n$2');
      data.paragraphs[7] = p;
    }

    // Para 16: Place beyond borders (should have 4 lines)
    if (data.paragraphs[16] && data.paragraphs[16].split('\n').length < 4) {
      let p = data.paragraphs[16];
      // Split after "border,"
      p = p.replace(/^([^,،、]+border[^,،、]*[,،、]\s*)/, '$1\n');
      p = p.replace(/^([^\n]+\n[^,،、]+beings[^,،، ]*[,،، ]\s*)/, '$1\n');
      p = p.replace(/^([^\n]+\n[^\n]+\n[^,،، ]+group[^,،، ]*[,،، ]\s*)/, '$1\n');
      data.paragraphs[16] = p;
      fileModified = true;
    }

    // Para 18: Artistic invitation (should have 2 lines)
    if (data.paragraphs[18] && data.paragraphs[18].split('\n').length < 2) {
      let p = data.paragraphs[18];
      // Find "space," or equivalent and split
      const match = p.match(/^([^,،、]+space[^,،،]*[,،، ]\s*)(.+)$/i);
      if (!match) {
        // Try with actual translation patterns
        p = p.replace(/(espacio|space|spazio|espace|Raum|宇宙|espaço|космос|空間|स्थान|സ്ഥല)[,،، ]\s+([au]n?\s+temple)/i, '$1,\n$2');
      } else {
        p = match[1] + '\n' + match[2];
      }
      data.paragraphs[18] = p;
      fileModified = true;
    }

    // Para 20: Aligns (should have 7 lines)
    if (data.paragraphs[20] && data.paragraphs[20].split('\n').length < 7) {
      let p = data.paragraphs[20];
      // Split "aligns\nwith"
      p = p.replace(/(alinea|aligns|allinea|aligne|ausrichtet|整列|alinha|выравнивается|정렬|संरेखित|വിന്യ)(\s+)(with|con|avec|mit|と|com|с|와|के साथ|കൂടെ)/i, '$1\n$3');
      data.paragraphs[20] = p;
      fileModified = true;
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
