const fs = require('fs');
const path = require('path');
const LZString = require('./node_modules/lz-string');

const saveDir = 'd:\\ahentai\\The Adventures of HILLS-1.0.3\\www\\save';
const timeStr = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(saveDir, `backup_${timeStr}`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const targetFiles = [
  'file1.rpgsave',
  'file1.rpgsave.original_backup',
  'file2.rpgsave',
  'file3.rpgsave',
  'file4.rpgsave'
];

console.log('--- 1. BACKUP PHASE ---');
targetFiles.forEach(file => {
  const src = path.join(saveDir, file);
  if (fs.existsSync(src)) {
    // Copy into timestamped backup folder
    const dest = path.join(backupDir, file);
    fs.copyFileSync(src, dest);
    console.log(`Copied to backup folder: ${file}`);

    // If file is file2, file3, file4, also create .original_backup if it doesn't already exist
    if (/^file\d\.rpgsave$/.test(file)) {
      const origBackupPath = path.join(saveDir, file + '.original_backup');
      if (!fs.existsSync(origBackupPath)) {
        fs.copyFileSync(src, origBackupPath);
        console.log(`Created permanent original backup: ${file}.original_backup`);
      } else {
        console.log(`Permanent original backup already exists: ${file}.original_backup`);
      }
    }
  } else {
    console.warn(`File not found: ${file}`);
  }
});
console.log(`Backup completed successfully in: ${backupDir}\n`);

console.log('--- 2. TEST & VERIFICATION PHASE ---');
const filesToTest = [
  'file2.rpgsave',
  'file3.rpgsave',
  'file4.rpgsave',
  'file1.rpgsave.original_backup'
];

filesToTest.forEach(file => {
  const filePath = path.join(saveDir, file);
  console.log(`\n========================================`);
  console.log(`Testing file: ${file}`);
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf8').trim();
  console.log(`Raw file size: ${raw.length} characters`);

  // Decompress
  let decompressed;
  try {
    decompressed = LZString.decompressFromBase64(raw);
  } catch (err) {
    console.error(`LZString decompression failed: ${err.message}`);
    return;
  }

  if (!decompressed) {
    console.error('LZString returned null/empty!');
    return;
  }
  console.log(`Decompressed size: ${decompressed.length} characters`);

  // Parse JSON
  let json;
  try {
    json = JSON.parse(decompressed);
    console.log('JSON parse: SUCCESS');
  } catch (err) {
    console.error(`JSON parse failed: ${err.message}`);
    return;
  }

  // Inspect content
  const party = json.party || {};
  const gold = party._gold !== undefined ? party._gold : (json.party && json.party.gold);
  const actors = json.actors ? json.actors._data : null;
  const system = json.system || {};
  const playTime = json.system ? json.system._framesOnSave : null;
  const mapId = json.map ? json.map._mapId : null;

  console.log(`Summary info:`);
  console.log(`- Gold: ${gold !== undefined ? gold : 'N/A'}`);
  console.log(`- Map ID: ${mapId !== null ? mapId : 'N/A'}`);
  console.log(`- Playtime (frames): ${playTime !== null ? playTime : 'N/A'}`);
  if (actors && Array.isArray(actors)) {
    const actorNames = actors.filter(Boolean).map(a => `${a._name || 'Hero'} (Lv.${a._level || '?'}, HP:${a._hp || '?'})`);
    console.log(`- Actors: ${actorNames.join(', ')}`);
  }
  if (json.variables && json.variables._data) {
    const varCount = Object.keys(json.variables._data).length;
    console.log(`- Variables count: ${varCount}`);
  }
  if (json.switches && json.switches._data) {
    const swCount = Object.keys(json.switches._data).length;
    console.log(`- Switches count: ${swCount}`);
  }

  // Round-trip test: compress again and compare
  const recompressed = LZString.compressToBase64(JSON.stringify(json));
  const testDecomp = LZString.decompressFromBase64(recompressed);
  const roundTripJson = JSON.parse(testDecomp);
  const roundTripPass = JSON.stringify(roundTripJson) === JSON.stringify(json);
  console.log(`Round-trip compression test: ${roundTripPass ? 'PASS (100% Match)' : 'FAIL'}`);
});
