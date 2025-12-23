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
console.log(`Processing ${files.length} files\n`);

let totalModified = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!data.paragraphs) return;

    let fileModified = false;
    const original = JSON.stringify(data.paragraphs);

    // Paragraph 4 (index 4): Split after shaman, and after born,
    if (data.paragraphs[4]) {
      let p = data.paragraphs[4];
      // Split after shaman/chamán/etc - look for pattern with multiple roles ending in comma
      if (!p.match(/,\ntakes part|,\nparticipa|,\npartecipa|,\nparticipe|,\nnimmt teil/i)) {
        p = p.replace(/(shaman|chamán|sciamano|chaman|Schamane|シャーマン|xamã|шаман),(\s*)(takes part|participa|partecipa|participe|nimmt teil|참여|participa|принимает)/i, '$1,\n$3');
      }
      // Split after born/nacer/etc
      if (!p.match(/(born|nacer|nascere|naître|geboren|生まれ|nascer|рожден),\n(to serve|para servir|per servire|pour servir|zu dienen|奉仕|para servir|служить)/i)) {
        p = p.replace(/(born|nacer|nascere|naître|geboren|生まれ|nascer|рожден),(\s*)(to serve|para servir|per servir|pour servir|zu dienen|奉仕|para servir|служить)/i, '$1,\n$3');
      }
      if (p !== data.paragraphs[4]) {
        data.paragraphs[4] = p;
        fileModified = true;
      }
    }

    // Paragraph 6 (index 6): Split doors paragraph
    if (data.paragraphs[6]) {
      let p = data.paragraphs[6];
      // Split after cut, before "to draw"
      if (!p.match(/cut,\nto draw|cortar,\nde abrir|tagliare,\ndi creare|trancher,\nde créer/i)) {
        p = p.replace(/(cut|cortar|tagliare|trancher|schneiden|切る|cortar|резать),(\s*)(to draw|de abrir|di creare|de créer|zu ziehen|描く|desenhar|нарисовать)/i, '$1,\n$3');
      }
      // Split "who can enter" from "and who cannot"
      if (!p.match(/(enter|entrar|entrare|entrer|eintreten|入る|entrar|войти)\nand who|y quienes|e chi|et qui|und wer|そして|e quem|и кто/i)) {
        p = p.replace(/(enter|entrar|entrare|entrer|eintreten|入る|entrar|войти)(\s+)(and who|y quienes|e chi|et qui|und wer|그리고|e quem|и кто)/i, '$1\n$3');
      }
      if (p !== data.paragraphs[6]) {
        data.paragraphs[6] = p;
        fileModified = true;
      }
    }

    // Paragraph 13 (index 13): Split firmament line
    if (data.paragraphs[13]) {
      let p = data.paragraphs[13];
      if (!p.match(/(firmament|firmamento),\n(the celestial|la bóveda|la volta|la voûte|das Himmels)/i)) {
        p = p.replace(/(firmament|firmamento),(\s+)(the celestial|la bóveda|la volta|la voûte|das Himmels|天空|a abóbada|небесный)/i, '$1,\n$3');
      }
      if (p !== data.paragraphs[13]) {
        data.paragraphs[13] = p;
        fileModified = true;
      }
    }

    // Paragraph 14 (index 14): Split "place beyond borders" into 4 lines
    if (data.paragraphs[14]) {
      let p = data.paragraphs[14];
      // Split after border,
      if (!p.match(/(border|frontera|confine|frontière|Grenze|国境|fronteira|граница),\n(for all|para todos|per tutti|pour tous)/i)) {
        p = p.replace(/(border|frontera|confine|frontière|Grenze|国境|fronteira|граница),(\s+)(for all|para todos|per tutti|pour tous|für alle|すべて|para todos|для всех)/i, '$1,\n$3');
      }
      // Split after beings,
      if (!p.match(/(beings|seres|esseri|êtres|Wesen|存在),\n(a temple|un templo|un tempio|un temple)/i)) {
        p = p.replace(/(beings|seres|esseri|êtres|Wesen|存在),(\s+)(a temple|un templo|un tempio|un temple|ein Tempel|寺院|um templo|храм)/i, '$1,\n$3');
      }
      // Split after group,
      if (!p.match(/(group|grupo|gruppo|groupe|Gruppe|グループ),\n(guided|guiados|guidati|guidés)/i)) {
        p = p.replace(/(group|grupo|gruppo|groupe|Gruppe|グループ),(\s+)(guided|guiados|guidati|guidés|geleitet|導か|guiados|ведомых)/i, '$1,\n$3');
      }
      if (p !== data.paragraphs[14]) {
        data.paragraphs[14] = p;
        fileModified = true;
      }
    }

    // Paragraph 15 (index 15): Split artistic invitation
    if (data.paragraphs[15]) {
      let p = data.paragraphs[15];
      if (!p.match(/(space|espacio|spazio|espace|Raum|宇宙|espaço|космос),\n(a temple|un templo|un tempio|un temple)/i)) {
        p = p.replace(/(space|espacio|spazio|espace|Raum|宇宙|espaço|космос),(\s+)(a temple|un templo|un tempio|un temple|ein Tempel|寺院|um templo|храм)/i, '$1,\n$3');
      }
      if (p !== data.paragraphs[15]) {
        data.paragraphs[15] = p;
        fileModified = true;
      }
    }

    // Paragraph 16 (index 16): Split "aligns"
    if (data.paragraphs[16]) {
      let p = data.paragraphs[16];
      if (!p.match(/(aligns|alinea|si allinea|s'aligne|ausrichtet|整列|alinha|выравнивается)\n(with|con|avec|mit)/i)) {
        p = p.replace(/(aligns|alinea|si allinea|s'aligne|ausrichtet|整列|alinha|выравнивается)(\s+)(with|con|avec|mit|と|com|с)/i, '$1\n$3');
      }
      if (p !== data.paragraphs[16]) {
        data.paragraphs[16] = p;
        fileModified = true;
      }
    }

    if (fileModified || JSON.stringify(data.paragraphs) !== original) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ ${filePath}`);
      totalModified++;
    }

  } catch (error) {
    console.error(`✗ ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Modified ${totalModified} files`);
