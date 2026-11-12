const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const pako = require(path.resolve(__dirname, '../../pako.min.js'));
const LZString = require(path.resolve(__dirname, '../../node_modules/lz-string/libs/lz-string.min.js'));
const { RubyMarshal } = require(path.resolve(__dirname, '../../ruby_marshal.js'));

const htmlPath = path.resolve(__dirname, '../../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const scriptMatches = [...htmlContent.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

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
      children,
      get innerHTML() { return _innerHTML; },
      set innerHTML(val) {
        _innerHTML = String(val || '');
        if (_innerHTML === '') children.length = 0;
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
      removeChild: (child) => {
        const idx = children.indexOf(child);
        if (idx !== -1) children.splice(idx, 1);
        return child;
      },
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
  ['weapons', 'armors', 'items', 'skills', 'enemies', 'classes', 'actors'].forEach(cat => {
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
    window: { addEventListener: () => {}, switchTab: null },
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

module.exports = async function runDomMockIntegrationTests(it) {
  await it('DOM Integration: index.html wires UI, Gold presets, and export handler', async () => {
    const { sandbox, elementsById, tabBtns, getLastBlob } = createDomSandbox();

    assert.strictEqual(typeof elementsById['btn-change-file'].onclick, 'function');
    elementsById['btn-change-file'].click();
    assert.strictEqual(elementsById['file-input'].clicked, true);

    const varArr = new Array(605).fill(0);
    varArr[1] = 10;
    varArr[600] = 777;
    const sampleSave = {
      party: { _gold: 8200, _items: { 1: 5 } },
      actors: { _data: [null, { _name: 'Hero', _classId: 1, _level: 20, _exp: { 1: 52899 }, _hp: 500, _mp: 50, _states: [4, 5], _skills: [1, 2], _paramPlus: [0,0,0,0,0,0,0,0] }] },
      variables: { _data: varArr },
      switches: { _data: [false, true] },
      system: { _saveEnabled: false, _encounterEnabled: true },
      player: { _moveSpeed: 4, _through: false }
    };
    const fileBuffer = Buffer.from(pako.deflate(JSON.stringify(sampleSave), { to: 'string', level: 1 }), 'utf8');

    elementsById['file-input'].onchange({
      target: { files: [{ name: 'file1.rmmzsave', _buffer: fileBuffer }] }
    });

    await new Promise(r => setImmediate(r));

    // Phase 1: Verify Cure States, QoL Bar, and Variables > 500 search
    elementsById['btn-char-cure-states'].click();
    const qolCards = elementsById['qol-system-bar'].children;
    const moveSpdIn = qolCards[0].querySelector('input');
    moveSpdIn.value = '6';
    moveSpdIn.onchange({ target: moveSpdIn });
    const noclipIn = qolCards[1].querySelector('input');
    noclipIn.checked = true;
    noclipIn.onchange({ target: noclipIn });
    const allowSaveIn = qolCards[2].querySelector('input');
    allowSaveIn.checked = true;
    allowSaveIn.onchange({ target: allowSaveIn });

    elementsById['variables-search'].value = '600';
    elementsById['variables-search'].oninput();
    assert.strictEqual(elementsById['variables-cards-container'].children.length, 1);

    // Phase 2: Load Items.json with a normal item (itypeId: 1) and a Key Item (itypeId: 2) and test Safe Unlock All
    const itemsDbJson = JSON.stringify([
      null,
      { id: 1, name: 'Potion', itypeId: 1, price: 50 },
      { id: 2, name: 'Hi-Potion', itypeId: 1, price: 200 },
      { id: 3, name: 'Dungeon Key', itypeId: 2, price: 0 }
    ]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'Items.json', _text: itemsDbJson }] }
    });
    elementsById['btn-items-unlock-safe'].click();

    // Verify LEVEL, EXP, and NAME cards and auto-sync when lowering level
    const statCards = elementsById['char-stats-container'].children;
    // Card 0 is LEVEL, Card 1 is EXP, Card 4 is NAME
    const lvlInput = statCards[0].querySelector('input');
    const expInput = statCards[1].querySelector('input');
    const nameInput = statCards[4].querySelector('input');
    nameInput.value = 'Iris';
    nameInput.onchange();
    lvlInput.value = '1';
    lvlInput.onchange();
    assert.strictEqual(Number(expInput.value), 0);

    expInput.value = '1500';
    expInput.onchange();

    const goldInput = elementsById['quick-gold-input'];
    assert.strictEqual(Number(goldInput.value), 8200);

    elementsById['btn-gold-add-10k'].click();
    assert.strictEqual(Number(goldInput.value), 18200);
    elementsById['gold-revert-btn'].click();
    assert.strictEqual(Number(goldInput.value), 8200);
    assert.ok(!elementsById['label-changes'].textContent.includes('Gold'), 'Reverting gold must remove Gold from change set');

    elementsById['btn-gold-max'].click();
    assert.strictEqual(Number(goldInput.value), 9999999);

    elementsById['btn-review-download'].click();
    const exportedZipped = getLastBlob().parts[0];
    const exportedJson = JSON.parse(pako.inflate(exportedZipped, { to: 'string' }));
    assert.strictEqual(exportedJson.party._gold, 9999999);
    assert.strictEqual(exportedJson.actors._data[1]._name, 'Iris');
    assert.strictEqual(exportedJson.actors._data[1]._level, 1);
    assert.strictEqual(exportedJson.actors._data[1]._exp[1], 1500);
    assert.deepStrictEqual(exportedJson.actors._data[1]._states, []);
    assert.strictEqual(exportedJson.player._through, true);
    assert.strictEqual(exportedJson.player._moveSpeed, 6);
    assert.strictEqual(exportedJson.system._saveEnabled, true);
    // Safe Unlock All should add Hi-Potion (id 2) but NOT Dungeon Key (id 3, Key Item)
    assert.strictEqual(exportedJson.party._items[2], 99);
    assert.strictEqual(exportedJson.party._items[3], undefined);

    // Verify Clear File in Save Editor
    assert.strictEqual(typeof elementsById['btn-clear-save'].onclick, 'function');
    elementsById['btn-clear-save'].click();
    assert.strictEqual(elementsById['upload-section'].style.display, 'flex');
    assert.strictEqual(elementsById['save-editor-screen'].style.display, 'none');

    // Verify Download Save when no file is loaded warns instead of downloading "null"
    elementsById['btn-review-download'].click();
    assert.ok(elementsById['toast'].textContent.includes('No save file loaded'));

    // Verify Clear Database Files buttons exist and are wired
    assert.strictEqual(typeof elementsById['btn-db-clear-all'].onclick, 'function');
    assert.strictEqual(typeof elementsById['btn-clear-db-header'].onclick, 'function');

    // Phase 3: Verify Classes.json, Enemies.json, Actors.json load into their dedicated slots and never overwrite Weapons
    const classesJson = JSON.stringify([null, { id: 1, name: 'NEET', expParams: [30,20,30,30], learnings: [{ level: 15, skillId: 5 }], params: [[1,16],[1,10],[1,16]] }]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'Classes.json', _text: classesJson }] }
    });
    assert.strictEqual(elementsById['db-label-type'].textContent, 'CLASSES DATABASE');
    assert.strictEqual(elementsById['db-slot-file-classes'].textContent, 'Classes.json');
    assert.notStrictEqual(elementsById['db-slot-file-weapons'].textContent, 'Classes.json');
    elementsById['btn-bulk-class-fast-exp'].click();
    elementsById['btn-bulk-class-lv1-skills'].click();

    const enemiesJson = JSON.stringify([null, { id: 1, name: 'Slime', exp: 10, gold: 5, params: [100,0,10,10,10,10,10,10], dropItems: [{ kind: 1, dataId: 1, denominator: 10 }] }]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'Enemies.json', _text: enemiesJson }] }
    });
    assert.strictEqual(elementsById['db-label-type'].textContent, 'ENEMIES DATABASE');
    elementsById['btn-bulk-enemy-drops'].click();
    elementsById['btn-bulk-enemy-rewards'].click();

    const actorsJson = JSON.stringify([null, { id: 1, name: 'Iris', initialLevel: 1, maxLevel: 99, classId: 1 }]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'Actors.json', _text: actorsJson }] }
    });
    assert.strictEqual(elementsById['db-label-type'].textContent, 'ACTORS DATABASE');
    elementsById['btn-bulk-actor-maxlv'].click();

    // Verify unsupported DB file (e.g. MapInfos.json) is safely skipped
    const mapInfosJson = JSON.stringify([null, { id: 1, name: 'Town', parentId: 0, order: 1 }]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'MapInfos.json', _text: mapInfosJson }] }
    });
    assert.ok(elementsById['toast'].textContent.includes('Skipped MapInfos.json'));

    // Verify renamed valid DB file (e.g. my_custom_file.json with wtypeId) is detected by content
    const renamedWeaponsJson = JSON.stringify([null, { id: 1, name: 'Excalibur', wtypeId: 2, params: [0,0,500,0,0,0,0,0], price: 1000 }]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'my_custom_file.json', _text: renamedWeaponsJson }] }
    });
    assert.strictEqual(elementsById['db-label-type'].textContent, 'WEAPONS DATABASE');
    assert.strictEqual(elementsById['db-label-filename'].textContent, 'my_custom_file.json');
    assert.strictEqual(elementsById['db-slot-file-weapons'].textContent, 'my_custom_file.json');

    // Phase 4: Verify binary Zlib RMMZ save (rmmzsave_bin), Max Stats EXP sync, and Key Item protection on Set All 99
    const binSave = {
      party: { _gold: 100, _items: { 1: 2, 3: 1 } },
      actors: { _data: [null, { _name: 'Hero', _classId: 1, _level: 5, _exp: { 1: 100 }, _hp: 0, _mp: 0, _paramPlus: [0,0,0,0,0,0,0,0] }] }
    };
    const rawBinBuffer = pako.deflate(JSON.stringify(binSave), { level: 1 });
    elementsById['file-input'].onchange({
      target: { files: [{ name: 'binary_save.rmmzsave', _buffer: rawBinBuffer }] }
    });
    await new Promise(r => setImmediate(r));

    // Verify 0 HP / 0 MP is not masked by 100 / 50 default
    const zeroHpCardInput = elementsById['char-stats-container'].children[2].querySelector('input');
    const zeroMpCardInput = elementsById['char-stats-container'].children[3].querySelector('input');
    assert.strictEqual(Number(zeroHpCardInput.value), 0, '0 HP must display as 0, not 100');
    assert.strictEqual(Number(zeroMpCardInput.value), 0, '0 MP must display as 0, not 50');

    // Verify adding weapon to a party without _weapons creates and persists party._weapons
    elementsById['btn-add-weapon-dialog'].click();

    elementsById['btn-char-max-stats'].click();
    elementsById['btn-items-set-all-99'].click();
    elementsById['btn-review-download'].click();

    const binExportBlob = getLastBlob();
    assert.strictEqual(binExportBlob.opts.type, 'application/octet-stream');
    const binRoundtrip = JSON.parse(pako.inflate(binExportBlob.parts[0], { to: 'string' }));
    assert.strictEqual(binRoundtrip.actors._data[1]._level, 99);
    assert.strictEqual(binRoundtrip.actors._data[1]._exp[1], 9999999);
    assert.strictEqual(binRoundtrip.party._items[1], 99);
    assert.strictEqual(binRoundtrip.party._items[3], 1, 'Key item quantity must not be overwritten to 99');
    assert.strictEqual(binRoundtrip.party._weapons['99'], 1, 'Newly added weapon on empty bag must persist in party._weapons');
  });
};
