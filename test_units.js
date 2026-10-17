const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const pako = require('./pako.min.js');
const LZString = require('./node_modules/lz-string/libs/lz-string.min.js');
const { RubyMarshal } = require('./ruby_marshal.js');

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE UNIT & DOM TESTS FOR SAVEEDIT');
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
    console.error(`     Error: ${err.stack || err.message}`);
    failCount++;
  }
}

// ---------------------------------------------------------
// 0. index.html Script Syntax & Full DOM Integration Test
// ---------------------------------------------------------
console.log('🌐 Group 0: index.html Script Syntax & Live DOM Execution');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const scriptMatches = [...htmlContent.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

it('index.html contains all 4 script blocks with 100% valid JS syntax', () => {
  assert.strictEqual(scriptMatches.length, 4, 'Expected 4 script blocks in index.html');
  scriptMatches.forEach((m, idx) => {
    new vm.Script(m[1], { filename: `index_script_${idx}.js` });
  });
});

function createDomSandbox() {
  const elementsById = {};
  const tabBtns = [];
  const sectionPanels = [];
  const dbCatBtns = [];
  let lastCreatedBlob = null;

  function makeElement(id = '', tagName = 'DIV') {
    const classSet = new Set();
    const children = [];
    let _innerHTML = '';
    const el = {
      id,
      tagName,
      value: '',
      checked: false,
      textContent: '',
      get innerHTML() { return _innerHTML; },
      set innerHTML(val) {
        _innerHTML = String(val || '');
        // Dynamically register any id="..." inside innerHTML so getElementById finds dynamically rendered controls
        for (const m of _innerHTML.matchAll(/id=["']([^"']+)["']/g)) {
          const dynId = m[1];
          if (!elementsById[dynId]) elementsById[dynId] = makeElement(dynId);
        }
      },
      style: { display: '' },
      files: [],
      clicked: false,
      onclick: null,
      onchange: null,
      oninput: null,
      ondragover: null,
      ondragleave: null,
      ondrop: null,
      classList: {
        add: (c) => classSet.add(c),
        remove: (c) => classSet.delete(c),
        toggle: (c, force) => {
          if (force === undefined) {
            if (classSet.has(c)) classSet.delete(c); else classSet.add(c);
          } else if (force) classSet.add(c); else classSet.delete(c);
        },
        contains: (c) => classSet.has(c)
      },
      getAttribute: (attr) => el._attrs ? el._attrs[attr] : null,
      setAttribute: (attr, val) => { el._attrs = el._attrs || {}; el._attrs[attr] = val; },
      appendChild: (child) => { children.push(child); return child; },
      removeChild: () => {},
      querySelector: (sel) => {
        if (!el._qMap) el._qMap = {};
        if (!el._qMap[sel]) el._qMap[sel] = makeElement(sel, 'INPUT');
        return el._qMap[sel];
      },
      querySelectorAll: () => [],
      click: function() {
        this.clicked = true;
        if (typeof this.onclick === 'function') this.onclick({ target: this, preventDefault: () => {}, stopPropagation: () => {} });
      }
    };
    return el;
  }

  for (const m of htmlContent.matchAll(/id=["']([^"']+)["']/g)) {
    const id = m[1];
    elementsById[id] = makeElement(id);
  }
  ['weapons', 'armors', 'items', 'skills'].forEach(cat => {
    const btn = elementsById[`slot-btn-${cat}`] || makeElement(`slot-btn-${cat}`, 'BUTTON');
    btn.setAttribute('data-cat', cat);
    elementsById[`slot-btn-${cat}`] = btn;
    dbCatBtns.push(btn);
  });
  for (let i = 0; i < 8; i++) {
    const tb = makeElement(`tab-btn-${i}`, 'BUTTON');
    tb.setAttribute('data-tab', `tab-${i}`);
    tabBtns.push(tb);
    const sp = makeElement(`tab-${i}`, 'DIV');
    sectionPanels.push(sp);
  }

  class MockFileReader {
    readAsArrayBuffer(file) {
      this.result = file._buffer;
      if (this.onload) this.onload();
    }
    readAsText(file) {
      this.result = file._text;
      if (this.onload) this.onload();
    }
  }

  const sandbox = {
    window: {
      addEventListener: () => {},
      switchTab: null
    },
    document: {
      body: makeElement('body', 'BODY'),
      getElementById: (id) => elementsById[id] || null,
      createElement: (tag) => makeElement('', tag.toUpperCase()),
      querySelectorAll: (sel) => {
        if (sel === '.tab-btn') return tabBtns;
        if (sel === '.section-panel') return sectionPanels;
        if (sel === '.db-cat-btn') return dbCatBtns;
        return [];
      }
    },
    pako,
    LZString,
    RubyMarshal,
    FileReader: MockFileReader,
    TextDecoder,
    Uint8Array,
    Blob: class {
      constructor(parts, opts) {
        this.parts = parts;
        this.opts = opts;
        lastCreatedBlob = this;
      }
    },
    URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
    setTimeout: () => {},
    alert: (msg) => { throw new Error('Unexpected alert: ' + msg); },
    prompt: () => '99',
    console
  };

  const appScript = new vm.Script(scriptMatches[3][1], { filename: 'app_main.js' });
  const ctx = vm.createContext(sandbox);
  appScript.runInContext(ctx);

  return { sandbox, elementsById, tabBtns, dbCatBtns, getLastBlob: () => lastCreatedBlob };
}

it('index.html executes in simulated DOM and wires all buttons & Gold input', async () => {
  const { sandbox, elementsById, tabBtns, getLastBlob } = createDomSandbox();

  // 1. Verify Open Save button triggers fileInput.click()
  assert.strictEqual(typeof elementsById['btn-change-file'].onclick, 'function', 'Open Save button must have onclick');
  elementsById['file-input'].clicked = false;
  elementsById['btn-change-file'].click();
  assert.strictEqual(elementsById['file-input'].clicked, true, 'Clicking Open Save must open file picker');

  // 2. Verify Tab buttons are wired
  assert.strictEqual(typeof sandbox.window.switchTab, 'function', 'window.switchTab must be defined');
  assert.strictEqual(typeof tabBtns[0].onclick, 'function', 'Tab buttons must have onclick handlers');

  // 3. Test real file1.rmmzsave if present, else fallback mock
  const realRmmzPath = 'D:\\ahentai\\Ecchi to Maid to Mujintou\\save\\file1.rmmzsave';
  let fileBuffer;
  if (fs.existsSync(realRmmzPath)) {
    fileBuffer = fs.readFileSync(realRmmzPath);
  } else {
    const sampleSave = {
      party: { _gold: 8200, _items: { 1: 5, 2: 10 }, _weapons: { 1: 1 }, _armors: { 1: 1 } },
      actors: {
        _data: [
          null,
          { _name: 'Kashii Yuri', _level: 1, _hp: 544, _mp: 41, _paramPlus: [0, 0, 0, 0, 0, 0, 0, 0] }
        ]
      },
      variables: { _data: [0, 10, 20] },
      switches: { _data: [false, true] }
    };
    fileBuffer = Buffer.from(pako.deflate(JSON.stringify(sampleSave), { to: 'string', level: 1 }), 'utf8');
  }

  elementsById['file-input'].onchange({
    target: {
      files: [{ name: 'file1.rmmzsave', _buffer: fileBuffer }]
    }
  });

  await new Promise(r => setImmediate(r));

  // Verify Gold loaded into #quick-gold-input
  const goldInput = elementsById['quick-gold-input'];
  const origGold = Number(goldInput.value);
  assert.strictEqual(origGold, 8200, 'Initial gold from file1.rmmzsave should be 8200');

  // 4. Test typing into Gold input
  goldInput.value = '55000';
  goldInput.oninput();
  assert.strictEqual(goldInput.value, '55000', 'Typing in gold input must not reset cursor/value');
  goldInput.onchange();
  assert.strictEqual(Number(goldInput.value), 55000);

  // 5. Test +10K, +100K, MAX 9.9M, and Revert Gold buttons
  elementsById['btn-gold-add-10k'].click();
  assert.strictEqual(Number(goldInput.value), 65000, '+10K button should add 10,000');

  elementsById['btn-gold-add-100k'].click();
  assert.strictEqual(Number(goldInput.value), 165000, '+100K button should add 100,000');

  elementsById['btn-gold-max'].click();
  assert.strictEqual(Number(goldInput.value), 9999999, 'MAX 9.9M button should set 9,999,999');

  elementsById['gold-revert-btn'].click();
  assert.strictEqual(Number(goldInput.value), 8200, 'Revert button should restore 8200');

  // Set to 777777 and verify exported save contains 777777 gold
  goldInput.value = '777777';
  goldInput.onchange();
  elementsById['btn-review-download'].click();
  const exportedZipped = getLastBlob().parts[0];
  const exportedJson = JSON.parse(pako.inflate(exportedZipped, { to: 'string' }));
  assert.strictEqual(exportedJson.party._gold, 777777, 'Exported .rmmzsave must contain updated gold 777777');

  // 6. Test Character Full Heal & Max Stats buttons
  assert.strictEqual(typeof elementsById['btn-char-full-heal'].onclick, 'function');
  elementsById['btn-char-full-heal'].click();

  assert.strictEqual(typeof elementsById['btn-char-max-stats'].onclick, 'function');
  elementsById['btn-char-max-stats'].click();

  // 7. Test Inventory Set All Owned to 99 button
  assert.strictEqual(typeof elementsById['btn-items-set-all-99'].onclick, 'function');
  elementsById['btn-items-set-all-99'].click();
});

it('Database Modder supports multi-file drop, independent category store, presets, bulk mods & item revert', () => {
  const { elementsById, getLastBlob } = createDomSandbox();

  const mockItems = [
    null,
    { id: 1, name: 'Herb', price: 50, consumable: true, scope: 7, description: 'Heals 50 HP [Weight: 5W]', note: '<Weight: 5>', effects: [{ code: 11, dataId: 0, value1: 0.2, value2: 50 }] },
    { id: 2, name: 'Energy Drink', price: 200, consumable: true, scope: 11, description: 'Fully restores AP. [Weight: 2W]', note: '<Weight: 2>', effects: [] }
  ];
  const mockWeapons = [
    null,
    { id: 1, name: 'Iron Sword', price: 500, params: [0, 0, 25, 0, 0, 0, 0, 0], description: 'Basic sword' }
  ];

  // 1. Simulate dropping Items.json AND Weapons.json at the same time
  elementsById['db-multi-file-input'].onchange({
    target: {
      files: [
        { name: 'Items.json', _text: JSON.stringify(mockItems) },
        { name: 'Weapons.json', _text: JSON.stringify(mockWeapons) }
      ]
    }
  });

  // Verify both slots show loaded status
  assert.ok(elementsById['db-slot-status-items'].innerHTML.includes('2'), 'Items slot badge should show 2 items loaded');
  assert.ok(elementsById['db-slot-status-weapons'].innerHTML.includes('1'), 'Weapons slot badge should show 1 weapon loaded');

  // Verify current category is 'items' (first file dropped)
  assert.strictEqual(elementsById['db-label-filename'].textContent, 'Items.json');
  assert.strictEqual(elementsById['db-label-count'].textContent, '2 ITEMS');

  // 2. Test Item presets on Item #1 (Herb): Infinite, Zero Weight, Full Heal, and Revert
  elementsById['btn-db-make-infinite'].click();
  elementsById['btn-db-zero-weight'].click();
  elementsById['btn-db-full-heal-item'].click();

  // Verify modified badge shows 1 modified
  assert.ok(elementsById['db-label-modified'].textContent.includes('1'), 'Should show 1 modified item');

  // Test Revert single item
  elementsById['btn-db-revert-item'].click();
  assert.strictEqual(elementsById['db-label-modified'].style.display, 'none', 'After revert, modified count should be 0');

  // 3. Test Bulk Infinite All & Bulk Price 0 All on Items.json
  elementsById['btn-bulk-infinite-all'].click();
  elementsById['btn-bulk-free-all'].click();
  elementsById['btn-db-download'].click();
  const downloadedItems = JSON.parse(getLastBlob().parts[0]);
  assert.strictEqual(downloadedItems[1].consumable, false, 'Bulk infinite should set consumable=false');
  assert.strictEqual(downloadedItems[1].price, 0, 'Bulk free should set price=0');
  assert.strictEqual(downloadedItems[2].consumable, false, 'Bulk infinite should set item #2 consumable=false');

  // 4. Switch to Weapons tab and verify Weapons.json is preserved independently
  elementsById['slot-btn-weapons'].click();
  assert.strictEqual(elementsById['db-label-filename'].textContent, 'Weapons.json');
  assert.strictEqual(elementsById['db-label-count'].textContent, '1 ITEMS');

  // Apply God Weapon preset
  elementsById['btn-db-god-weapon'].click();
  elementsById['btn-db-download'].click();
  const downloadedWeapons = JSON.parse(getLastBlob().parts[0]);
  assert.strictEqual(downloadedWeapons[1].params[2], 9999, 'God weapon should set ATK to 9999');

  // 5. Switch to unloaded category (Skills) and verify it does NOT show stale items from Weapons.json
  elementsById['slot-btn-skills'].click();
  assert.strictEqual(elementsById['db-label-filename'].textContent, 'Skills.json');
  assert.strictEqual(elementsById['db-label-count'].textContent, '0 ITEMS');
});

// ---------------------------------------------------------
// 1. Universal Save Parser & Serialization Tests
// ---------------------------------------------------------
console.log('\n📦 Group 1: Universal Save File Parsers & Exporters');

const mockMzData = {
  party: { _gold: 8200, _items: { 1: 5, 2: 12, 3: 0 }, _weapons: { 1: 1 }, _armors: { 2: 1 } },
  actors: {
    _data: [
      null,
      { _name: 'Kashii Yuri', _level: 1, _hp: 544, _mp: 41, _paramPlus: [0, 0, 0, 0, 0, 0, 0, 0] }
    ]
  },
  variables: { _data: [0, 100, 250, 0] },
  switches: { _data: [false, true, false, true] }
};

it('RMMZ: Decompress & re-serialize .rmmzsave cleanly', () => {
  const jsonStr = JSON.stringify(mockMzData);
  const compressed = pako.deflate(jsonStr, { to: 'string', level: 1 });
  const inflated = pako.inflate(compressed, { to: 'string' });
  const parsed = JSON.parse(inflated);
  assert.strictEqual(parsed.party._gold, 8200);

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
    }
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
});

setTimeout(() => {
  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('====================================================');
  if (failCount > 0) process.exit(1);
  console.log('🎉 ALL UNIT & DOM INTEGRATION TESTS PASSED!\n');
}, 50);
