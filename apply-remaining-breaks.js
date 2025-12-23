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

const files = findManifestoFiles('public/locales');
let totalModified = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!data.paragraphs) return;

    let fileModified = false;

    // Fix paragraph 4 (artist paragraph)
    if (data.paragraphs[4]) {
      let original = data.paragraphs[4];
      let p = original;

      // Find first sentence ending with comma (should be shaman/chamán line)
      const firstSentence = p.split('\n')[0];
      const lastCommaInFirst = firstSentence.lastIndexOf(',');
      if (lastCommaInFirst > 0 && lastCommaInFirst > firstSentence.length * 0.4) {
        const before = firstSentence.substring(0, lastCommaInFirst + 1);
        const after = firstSentence.substring(lastCommaInFirst + 1).trim();
        const rest = p.substring(firstSentence.length);
        if (after && !after.startsWith('\n')) {
          p = before + '\n' + after + rest;
        }
      }

      // Find lines with "born/nacer/né/nascere" etc and split after comma
      const lines = p.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/nacer|born|né|nascere|nascido|geboren|生まれ|рожден|태어/i)) {
          const commaIdx = lines[i].indexOf(',');
          if (commaIdx > 0 && commaIdx < lines[i].length - 2 && lines[i][commaIdx + 2] !== '\n') {
            lines[i] = lines[i].substring(0, commaIdx + 1) + '\n' + lines[i].substring(commaIdx + 1).trim();
          }
        }
      }
      p = lines.join('\n');

      if (p !== original) {
        data.paragraphs[4] = p;
        fileModified = true;
      }
    }

    // Fix paragraph 6 (doors paragraph)
    if (data.paragraphs[6]) {
      let original = data.paragraphs[6];
      let p = original;

      // Find first comma (after cut/cortar/etc) and add line break
      const firstLine = p.split('\n')[0];
      const firstComma = firstLine.indexOf(',');
      if (firstComma > 0 && !firstLine[firstComma + 2] !== '\n') {
        const before = firstLine.substring(0, firstComma + 1);
        const after = firstLine.substring(firstComma + 1).trim();
        const rest = p.substring(firstLine.length);
        if (after && !after.startsWith('\n')) {
          p = before + '\n' + after + rest;
        }
      }

      // Split before "and who/y quienes/e chi/et qui"
      p = p.replace(/(\s+)(and who|y quienes|e chi|et qui|und wer|и кто|그리고|e quem)/i, '\n$2');

      if (p !== original) {
        data.paragraphs[6] = p;
        fileModified = true;
      }
    }

    // Fix paragraph 13 (firmament)
    if (data.paragraphs[13]) {
      let original = data.paragraphs[13];
      // Look for firmament/firmamento followed by comma and split
      let p = original.replace(/(firmament[o]?),(\s+)(the celestial|la bóveda|la volta|la voûte|das Himmels|天空|a abóbada|небесный|천상)/i, '$1,\n$3');
      if (p !== original) {
        data.paragraphs[13] = p;
        fileModified = true;
      }
    }

    // Fix paragraph 14 (borders)
    if (data.paragraphs[14]) {
      let original = data.paragraphs[14];
      let p = original;
      // Split after "border,"
      p = p.replace(/(frontera|border|confine|frontière|Grenze|国境|fronteira|граница|경계),(\s+)(for all|para todos|per tutti|pour tous|für alle|すべて|para todos|для всех)/i, '$1,\n$3');
      // Split after "beings,"
      p = p.replace(/(seres sensibles|sentient beings|esseri senzienti|êtres sensibles|fühlende Wesen|感覚的存在|seres sencientes|разумных существ|지각있는),(\s+)(un templo|a temple|un tempio|un temple|ein Tempel|寺院|um templo|храм)/i, '$1,\n$3');
      // Split after "group,"
      p = p.replace(/(grupo|group|gruppo|groupe|Gruppe|グループ|группа|그룹),(\s+)(guiados|guided|guidati|guidés|geleitet|導か|guiados|ведомых)/i, '$1,\n$3');
      if (p !== original) {
        data.paragraphs[14] = p;
        fileModified = true;
      }
    }

    // Fix paragraph 15 (artistic invitation)
    if (data.paragraphs[15]) {
      let original = data.paragraphs[15];
      let p = original.replace(/(en el espacio|in space|nello spazio|dans l'espace|im Raum|宇宙で|no espaço|в космосе|우주에),(\s+)(un templo|a temple|un tempio|un temple|ein Tempel|寺院|um templo|храм)/i, '$1,\n$3');
      if (p !== original) {
        data.paragraphs[15] = p;
        fileModified = true;
      }
    }

    // Fix paragraph 16 (aligns)
    if (data.paragraphs[16]) {
      let original = data.paragraphs[16];
      let p = original.replace(/(alinea|aligns|si allinea|s'aligne|ausrichtet|整列|alinha|выравнивается|정렬)(\s+)(with|con|avec|mit|と|com|с)/i, '$1\n$3');
      if (p !== original) {
        data.paragraphs[16] = p;
        fileModified = true;
      }
    }

    if (fileModified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ ${path.basename(path.dirname(filePath))}`);
      totalModified++;
    }

  } catch (error) {
    console.error(`✗ ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Modified ${totalModified} files`);
