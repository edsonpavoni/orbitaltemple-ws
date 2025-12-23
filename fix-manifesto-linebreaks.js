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

const files = findManifestoFiles('public/locales');
console.log(`Found ${files.length} manifesto.json files`);

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    if (!data.paragraphs || !Array.isArray(data.paragraphs)) {
      console.log(`Skipping ${filePath} - no paragraphs array`);
      return;
    }

    let modified = false;

    // Process each paragraph
    data.paragraphs = data.paragraphs.map(para => {
      let updated = para;

      // Fix 1: Artist paragraph - split after "shaman," (index varies by translation)
      // Looking for pattern where artist/priest/sage/shaman is followed by "takes part"
      const artistPattern1 = /([^\n]+shaman[^\n]*),(\s*takes part)/i;
      if (artistPattern1.test(updated)) {
        updated = updated.replace(artistPattern1, '$1,\n$2');
        modified = true;
      }

      // Fix 2: "to lend their hands" - split after "born,"
      const bornPattern = /(\bborn),(\s*to serve)/i;
      if (bornPattern.test(updated)) {
        updated = updated.replace(bornPattern, '$1,\n$2');
        modified = true;
      }

      // Fix 3: Doors paragraph - split "to cut, to draw a wound"
      const doorsPattern1 = /(\bcut),(\s*to draw a wound)/i;
      if (doorsPattern1.test(updated)) {
        updated = updated.replace(doorsPattern1, '$1,\n$2');
        modified = true;
      }

      const doorsPattern2 = /(who can enter)(\s+and who cannot)/i;
      if (doorsPattern2.test(updated)) {
        updated = updated.replace(doorsPattern2, '$1\n$2');
        modified = true;
      }

      // Fix 4: Church, mosque, shrine - each on own line
      const templePattern = /(church[^,\n]+),(\s*)(mosque[^,\n]+),(\s*)(shrine[^,\n]+)/i;
      if (templePattern.test(updated)) {
        updated = updated.replace(templePattern, '$1,\n$3,\n$5');
        modified = true;
      }

      // Fix 5: Cathedral/tree descriptions - add spacing
      const cathedralPattern = /(cathedral)(\s+that makes you feel small),(\s*)(dark as)/i;
      if (cathedralPattern.test(updated)) {
        updated = updated.replace(cathedralPattern, '$1\n$2,\n\n$4');
        modified = true;
      }

      const treePattern = /(tree)(\s+that makes you look within),(\s*)(bare as|or sumptuous)/i;
      if (treePattern.test(updated)) {
        updated = updated.replace(treePattern, '$1\n$2,\n\n$4');
        modified = true;
      }

      const desertPattern = /(silences distraction),(\s*)(or sumptuous)/i;
      if (desertPattern.test(updated)) {
        updated = updated.replace(desertPattern, '$1,\n\n$3');
        modified = true;
      }

      const goldPattern = /(sumptuous with gold)(\s+that promises transcendence)/i;
      if (goldPattern.test(updated)) {
        updated = updated.replace(goldPattern, '$1\n$2');
        modified = true;
      }

      // Fix 6: Firmament - split line
      const firmamentPattern = /(firmament),(\s*)(the celestial vault)/i;
      if (firmamentPattern.test(updated)) {
        updated = updated.replace(firmamentPattern, '$1,\n$3');
        modified = true;
      }

      // Fix 7: Place beyond borders - split into lines
      const bordersPattern = /(beyond every border),(\s*)(for all humans)/i;
      if (bordersPattern.test(updated)) {
        updated = updated.replace(bordersPattern, '$1,\n$3');
        modified = true;
      }

      const humansPattern = /(all sentient beings),(\s*)(a temple to imagine)/i;
      if (humansPattern.test(updated)) {
        updated = updated.replace(humansPattern, '$1,\n$3');
        modified = true;
      }

      const groupPattern = /(one group),(\s*)(guided by values)/i;
      if (groupPattern.test(updated)) {
        updated = updated.replace(groupPattern, '$1,\n$3');
        modified = true;
      }

      // Fix 8: Artistic invitation - split
      const invitationPattern = /(temple in space),(\s*)(a temple built)/i;
      if (invitationPattern.test(updated)) {
        updated = updated.replace(invitationPattern, '$1,\n$3');
        modified = true;
      }

      // Fix 9: Orbital Temple aligns - split
      const alignsPattern = /(Temple aligns)(\s+)(with our antennas)/i;
      if (alignsPattern.test(updated)) {
        updated = updated.replace(alignsPattern, '$1\n$3');
        modified = true;
      }

      return updated;
    });

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ Updated ${filePath}`);
    } else {
      console.log(`  No changes needed for ${filePath}`);
    }

  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('\nDone!');
