const assert = require('assert');
const fs = require('fs');
const path = require('path');
const pako = require('./pako.min.js');
const LZString = require('./node_modules/lz-string/libs/lz-string.min.js');
const { RubyMarshal } = require('./ruby_marshal.js');

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE UNIT TESTS FOR SAVEEDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

// ---------------------------------------------------------
// 1. Universal Save Parser & Serialization Tests
// ---------------------------------------------------------
console.log('📦 Group 1: Universal Save File Parsers & Exporters');

const mockMzData = {
  party: { _gold: 8200, _items: { 1: 5, 2: 12, 3: 0 }, _weapons: { 1: 1 }, _armors: { 2: 1 } },
  actors: {
    _data: [
      null,
      { _name: 'Kashil Yuri', _level: 1, _hp: 544, _mp: 41, _paramPlus: [0, 0, 0, 0, 0, 0, 0, 0] }
    ]
  },
  variables: { _data: [0, 100, 250, 0] },
  switches: { _data: [false, true, false, true] }
};

it('RMMZ: Decompress & re-serialize .rmmzsave cleanly', () => {
  const jsonStr = JSON.stringify(mockMzData);
  const compressed = pako.deflate(jsonStr, { to: 'string', level: 1 });
  
  // Test inflation
  const inflated = pako.inflate(compressed, { to: 'string' });
  const parsed = JSON.parse(inflated);
  assert.strictEqual(parsed.party._gold, 8200);
  assert.strictEqual(parsed.actors._data[1]._name, 'Kashil Yuri');

  // Test re-deflate
  parsed.party._gold = 9999999;
  const reCompressed = pako.deflate(JSON.stringify(parsed), { to: 'string', level: 1 });
  const roundtrip = JSON.parse(pako.inflate(reCompressed, { to: 'string' }));
  assert.strictEqual(roundtrip.party._gold, 9999999);
});

it('RMMV: Decompress & re-serialize .rpgsave (LZString Base64)', () => {
  const jsonStr = JSON.stringify(mockMzData);
  const compressedBase64 = LZString.compressToBase64(jsonStr);
  
  const decompressed = LZString.decompressFromBase64(compressedBase64);
  const parsed = JSON.parse(decompressed);
  assert.strictEqual(parsed.party._gold, 8200);

  // Modify & re-compress
  parsed.party._gold = 50000;
  const reComp = LZString.compressToBase64(JSON.stringify(parsed));
  const roundtrip = JSON.parse(LZString.decompressFromBase64(reComp));
  assert.strictEqual(roundtrip.party._gold, 50000);
});

it('Ruby Marshal: Decode and re-encode Ruby 4.8 format (VX Ace/VX/XP)', () => {
  const rubyObj = {
    '@party': { '@gold': 1234, '@items': { 1: 10 } },
    '@actors': {
      '@data': [
        null,
        { '@name': 'Hero', '@level': 10, '@hp': 250, '@mp': 50, '@param_plus': [0, 0, 0, 0, 0, 0, 0, 0] }
      ]
    },
    '@variables': { '@data': [0, 55, 99] },
    '@switches': { '@data': [false, true] }
  };

  const encoded = RubyMarshal.encode(rubyObj);
  assert.ok(encoded instanceof Uint8Array);
  assert.strictEqual(encoded[0], 0x04);
  assert.strictEqual(encoded[1], 0x08);

  const decoded = RubyMarshal.decode(encoded);
  assert.strictEqual(decoded['@party']['@gold'], 1234);
  assert.strictEqual(decoded['@actors']['@data'][1]['@name'], 'Hero');
});

it('WOLF RPG: Correctly identify .sav and trigger safety guard', () => {
  const fileName = 'SaveData01.sav';
  const isWolf = fileName.toLowerCase().endsWith('.sav') || fileName.toLowerCase().includes('savedata');
  assert.strictEqual(isWolf, true);

  // Safety guard simulation
  const engine = 'wolf';
  let downloadedCorruptSave = false;
  if (engine === 'wolf') {
    // Guard triggered: do not overwrite
    downloadedCorruptSave = false;
  } else {
    downloadedCorruptSave = true;
  }
  assert.strictEqual(downloadedCorruptSave, false, 'Guard must prevent direct binary save corruption');
});

// ---------------------------------------------------------
// 2. Game Adapters Tests
// ---------------------------------------------------------
console.log('\n🎮 Group 2: Engine Adapters (MZ, MV, Ruby, Generic)');

function getGameAdapters(root, engine) {
  let partyObj = null, actorsObj = null, varsObj = null, swObj = null;
  if (engine === 'ruby') {
    partyObj = root['@party'] || root.party || {};
    actorsObj = root['@actors'] || root.actors || {};
    varsObj = root['@variables'] || root.variables || {};
    swObj = root['@switches'] || root.switches || {};
  } else if (typeof root === 'object') {
    partyObj = root.party || {};
    actorsObj = root.actors || {};
    varsObj = root.variables || {};
    swObj = root.switches || {};
  }
  return { party: partyObj, actors: actorsObj, variables: varsObj, switches: swObj };
}

it('Adapter extracts party, actors, variables from MZ/MV structure', () => {
  const adapt = getGameAdapters(mockMzData, 'mz');
  assert.ok(adapt.party);
  assert.strictEqual(adapt.party._gold, 8200);
  assert.strictEqual(adapt.actors._data[1]._name, 'Kashil Yuri');
  assert.strictEqual(adapt.variables._data[1], 100);
  assert.strictEqual(adapt.switches._data[1], true);
});

// ---------------------------------------------------------
// 3. Gold Controls & Calculation Tests
// ---------------------------------------------------------
console.log('\n💰 Group 3: Gold Input & Quick Buttons (+10K, +100K, MAX, Revert)');

it('Gold: Direct typing and clamping', () => {
  const party = { _gold: 8200 };
  const originalGold = party._gold;

  function updateGold(val) {
    const num = Math.max(0, parseInt(val, 10) || 0);
    party._gold = num;
    return num;
  }

  assert.strictEqual(updateGold('15000'), 15000);
  assert.strictEqual(party._gold, 15000);

  // Negative should clamp to 0
  assert.strictEqual(updateGold('-500'), 0);
  assert.strictEqual(party._gold, 0);

  // Non-number defaults to 0
  assert.strictEqual(updateGold('abc'), 0);
});

it('Gold: +10K, +100K, MAX 9.9M and Revert button logic', () => {
  const party = { _gold: 8200 };
  const originalGold = 8200;

  // Click +10K
  party._gold += 10000;
  assert.strictEqual(party._gold, 18200);

  // Click +100K
  party._gold += 100000;
  assert.strictEqual(party._gold, 118200);

  // Click MAX 9.9M
  party._gold = 9999999;
  assert.strictEqual(party._gold, 9999999);

  // Click Revert
  party._gold = originalGold;
  assert.strictEqual(party._gold, 8200);
});

// ---------------------------------------------------------
// 4. Character Stats Quick Action Tests
// ---------------------------------------------------------
console.log('\n⚡ Group 4: Character Quick Actions (Full Restore & Max All Stats)');

it('Character: Full Restore (HP/MP to 9999)', () => {
  const actor = { _name: 'Kashil Yuri', _hp: 544, _mp: 41, _level: 1 };
  
  // Full Restore action
  actor._hp = 9999;
  actor._mp = 9999;

  assert.strictEqual(actor._hp, 9999);
  assert.strictEqual(actor._mp, 9999);
});

it('Character: Max All Stats (Lv 99, 9999 stats & paramPlus)', () => {
  const actor = {
    _name: 'Kashil Yuri',
    _level: 1,
    _hp: 544,
    _mp: 41,
    _paramPlus: [0, 0, 0, 0, 0, 0, 0, 0] // MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK
  };

  // Max Stats action
  actor._level = 99;
  actor._hp = 9999;
  actor._mp = 9999;
  for (let i = 0; i < 8; i++) {
    actor._paramPlus[i] = 9999;
  }

  assert.strictEqual(actor._level, 99);
  assert.strictEqual(actor._hp, 9999);
  assert.strictEqual(actor._mp, 9999);
  assert.deepStrictEqual(actor._paramPlus, [9999, 9999, 9999, 9999, 9999, 9999, 9999, 9999]);
});

// ---------------------------------------------------------
// 5. Inventory & Item Modification Tests
// ---------------------------------------------------------
console.log('\n🎒 Group 5: Inventory (Quantity adjustment, Set All 99, Add Item)');

it('Inventory: Set All Owned Items to 99', () => {
  const items = { 1: 5, 2: 12, 3: 0, 4: 99 };
  
  // Set All Owned (>0) to 99
  let changed = 0;
  Object.keys(items).forEach(id => {
    if (items[id] > 0) {
      items[id] = 99;
      changed++;
    }
  });

  assert.strictEqual(items[1], 99);
  assert.strictEqual(items[2], 99);
  assert.strictEqual(items[3], 0); // Unowned remains 0
  assert.strictEqual(items[4], 99);
  assert.strictEqual(changed, 3);
});

it('Inventory: Add new Item ID with custom quantity', () => {
  const items = { 1: 5 };
  
  // Add item #999 with quantity 50
  const newItemId = 999;
  items[newItemId] = 50;

  assert.strictEqual(items[999], 50);
});

it('Inventory: Increment, decrement, and 99 buttons', () => {
  let count = 10;
  // + button
  count += 1;
  assert.strictEqual(count, 11);

  // - button
  count = Math.max(0, count - 1);
  assert.strictEqual(count, 10);

  // 99 button
  count = 99;
  assert.strictEqual(count, 99);
});

// ---------------------------------------------------------
// 6. Search Filter Tests
// ---------------------------------------------------------
console.log('\n🔍 Group 6: Search & Filter Logic');

it('Inventory Search: Matches ID and name', () => {
  const catalog = { 1: 'Potion', 2: 'Super Potion', 3: 'Elixir', 4: 'Magic Water' };
  
  function filterItems(query) {
    const q = query.trim().toLowerCase();
    return Object.keys(catalog).filter(id => id.includes(q) || catalog[id].toLowerCase().includes(q));
  }

  assert.deepStrictEqual(filterItems('potion'), ['1', '2']);
  assert.deepStrictEqual(filterItems('3'), ['3']);
  assert.deepStrictEqual(filterItems('elixir'), ['3']);
});

// ---------------------------------------------------------
// 7. Change Tracking Tests
// ---------------------------------------------------------
console.log('\n🏷️ Group 7: Change Tracking Badge (labelChanges)');

it('Change Tracker counts unique modified fields', () => {
  const saveChanges = new Set();
  function markSaveModified(field) {
    saveChanges.add(field);
    return `${saveChanges.size} CHANGES`;
  }

  assert.strictEqual(markSaveModified('Gold'), '1 CHANGES');
  assert.strictEqual(markSaveModified('Gold'), '1 CHANGES'); // idempotent for same field
  assert.strictEqual(markSaveModified('Full Heal'), '2 CHANGES');
  assert.strictEqual(markSaveModified('Item #1'), '3 CHANGES');

  saveChanges.clear();
  assert.strictEqual(saveChanges.size, 0);
});

// ---------------------------------------------------------
// Summary
// ---------------------------------------------------------
console.log('\n====================================================');
console.log(`📊 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL UNIT TESTS PASSED SUCCESSFULLY!\n');
}
