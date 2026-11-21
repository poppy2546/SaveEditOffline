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
        if (sel && sel.startsWith('#') && elementsById[sel.slice(1)]) {
          return elementsById[sel.slice(1)];
        }
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

    assert.strictEqual(elementsById['btn-clear-save'].style.display, 'none', 'Save action buttons must be hidden before loading a file');
    assert.strictEqual(elementsById['btn-review-download'].style.display, 'none', 'Download Save must be hidden before loading a file');
    assert.strictEqual(elementsById['btn-change-file'].style.display, '', 'Open Save must remain visible before loading a file');

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
      player: { _moveSpeed: 4, _through: false, _mapId: 1, _x: 10, _y: 12, _realX: 10, _realY: 12 }
    };
    const fileBuffer = Buffer.from(pako.deflate(JSON.stringify(sampleSave), { to: 'string', level: 1 }), 'utf8');

    elementsById['file-input'].onchange({
      target: { files: [{ name: 'file1.rmmzsave', _buffer: fileBuffer }] }
    });

    await new Promise(r => setImmediate(r));

    assert.strictEqual(elementsById['btn-clear-save'].style.display, '', 'Save action buttons must become visible after loading a save');
    assert.strictEqual(elementsById['btn-review-download'].style.display, '', 'Download Save must become visible after loading a save');

    // Phase 1: Verify Cure States, QoL Bar (including Location), and Variables > 500 search
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

    elementsById['qol-map-id'].value = '5';
    elementsById['qol-map-id'].onchange({ target: elementsById['qol-map-id'] });
    elementsById['qol-player-x'].value = '25';
    elementsById['qol-player-x'].onchange({ target: elementsById['qol-player-x'] });
    elementsById['qol-player-y'].value = '30';
    elementsById['qol-player-y'].onchange({ target: elementsById['qol-player-y'] });

    elementsById['variables-search'].value = '600';
    elementsById['variables-search'].oninput();
    assert.strictEqual(elementsById['variables-cards-container'].children.length, 1);

    // Phase 2: Load Items.json & Skills.json, verify Data Files status, Skill Picker, and Safe Unlock All
    const itemsDbJson = JSON.stringify([
      null,
      { id: 1, name: 'Potion', itypeId: 1, price: 50 },
      { id: 2, name: 'Hi-Potion', itypeId: 1, price: 200 },
      { id: 3, name: 'Dungeon Key', itypeId: 2, price: 0 }
    ]);
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'Items.json', _text: itemsDbJson }] }
    });
    const skillsDbJson = JSON.stringify([
      null,
      { id: 1, name: 'Attack', stypeId: 1, mpCost: 0 },
      { id: 7, name: 'Fireball', stypeId: 1, mpCost: 10 }
    ]);
    elementsById['data-file-input'].onchange({
      target: { files: [{ name: 'Skills.json', _text: skillsDbJson }] }
    });
    assert.ok(elementsById['datafiles-status-list'].innerHTML.includes('3 names'), 'Data Files tab must show loaded Items.json count');
    assert.ok(elementsById['datafiles-status-list'].innerHTML.includes('2 names'), 'Data Files tab must show loaded Skills.json count');
    assert.strictEqual(elementsById['char-skill-picker'].style.display, 'inline-block', 'Skill picker must display when Skills.json is loaded');
    elementsById['char-skill-picker'].value = '7';
    elementsById['btn-char-add-skill'].click();
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
    assert.ok(exportedJson.actors._data[1]._skills.includes(7), 'Skill added via Skill Picker must persist in save');
    assert.strictEqual(exportedJson.player._through, true);
    assert.strictEqual(exportedJson.player._moveSpeed, 6);
    assert.strictEqual(exportedJson.player._mapId, 5);
    assert.strictEqual(exportedJson.player._x, 25);
    assert.strictEqual(exportedJson.player._y, 30);
    assert.strictEqual(exportedJson.player._realX, 25);
    assert.strictEqual(exportedJson.player._realY, 30);
    assert.strictEqual(exportedJson.system._saveEnabled, true);
    // Safe Unlock All should add Hi-Potion (id 2) but NOT Dungeon Key (id 3, Key Item)
    assert.strictEqual(exportedJson.party._items[2], 99);
    assert.strictEqual(exportedJson.party._items[3], undefined);

    // Verify Clear File in Save Editor
    assert.strictEqual(typeof elementsById['btn-clear-save'].onclick, 'function');
    elementsById['btn-clear-save'].click();
    assert.strictEqual(elementsById['upload-section'].style.display, 'flex');
    assert.strictEqual(elementsById['save-editor-screen'].style.display, 'none');
    assert.strictEqual(elementsById['btn-clear-save'].style.display, 'none', 'Save action buttons must hide after Clear File');
    assert.strictEqual(elementsById['btn-review-download'].style.display, 'none', 'Download Save must hide after Clear File');

    // Verify Download Save when no file is loaded warns instead of downloading "null"
    elementsById['btn-review-download'].click();
    assert.ok(elementsById['toast'].textContent.includes('No save file loaded'));

    // Verify Database Modder header buttons exist and are wired
    assert.strictEqual(typeof elementsById['btn-clear-db-header'].onclick, 'function');
    assert.strictEqual(typeof elementsById['btn-db-download-all'].onclick, 'function');

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

    // Verify Multi-file DB download and Clear All DB header button
    elementsById['btn-db-download-all'].click();
    assert.ok(elementsById['toast'].textContent.includes('database file(s)'), 'Download All Modified must download loaded/modified DB files');
    elementsById['btn-clear-db-header'].click();
    assert.ok(elementsById['toast'].textContent.includes('All database files cleared'), 'Clear DB header button must clear all DB slots');

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

    // Verify adding weapon via inline ID input to a party without _weapons creates and persists party._weapons
    elementsById['weapons-add-id'].value = '99';
    elementsById['btn-add-weapon-dialog'].click();

    elementsById['btn-char-max-stats'].click();
    elementsById['btn-items-set-all-99'].click();

    // Verify Change Log drawer opens on #label-changes click and lists modified fields
    elementsById['label-changes'].click();
    assert.strictEqual(elementsById['save-changes-drawer'].style.display, 'flex', 'Clicking #label-changes must open #save-changes-drawer');
    assert.ok(elementsById['save-changes-drawer'].innerHTML.includes('Add Weapon #99'), 'Changes drawer must list Add Weapon #99');
    assert.ok(elementsById['save-changes-drawer'].innerHTML.includes('Max Stats'), 'Changes drawer must list Max Stats');

    elementsById['btn-review-download'].click();

    const binExportBlob = getLastBlob();
    assert.strictEqual(binExportBlob.opts.type, 'application/octet-stream');
    const binRoundtrip = JSON.parse(pako.inflate(binExportBlob.parts[0], { to: 'string' }));
    assert.strictEqual(binRoundtrip.actors._data[1]._level, 99);
    assert.strictEqual(binRoundtrip.actors._data[1]._exp[1], 9999999);
    assert.strictEqual(binRoundtrip.party._items[1], 99);
    assert.strictEqual(binRoundtrip.party._items[3], 1, 'Key item quantity must not be overwritten to 99');
    assert.strictEqual(binRoundtrip.party._weapons['99'], 1, 'Newly added weapon on empty bag must persist in party._weapons');

    // Phase 5: Verify QoL Revert All Save Changes closes drawer & Toast-based parse error feedback
    assert.strictEqual(typeof elementsById['btn-revert-save'].onclick, 'function');
    await elementsById['btn-revert-save'].onclick();
    assert.strictEqual(elementsById['label-changes'].textContent, '0 CHANGES', 'Revert All must reset change counter');
    assert.strictEqual(elementsById['save-changes-drawer'].style.display, 'none', 'Revert All must close #save-changes-drawer');
    assert.strictEqual(Number(elementsById['quick-gold-input'].value), 100, 'Revert All must restore original Gold');
    assert.ok(elementsById['toast'].textContent.includes('Reverted all save changes'));

    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'broken.json', _text: '{invalid json' }] }
    });
    assert.ok(elementsById['toast'].textContent.includes('Failed to parse broken.json'), 'Invalid JSON must report via Toast with filename');
    assert.ok(elementsById['toast'].className.includes('danger'), 'Invalid JSON Toast must use danger style');

    // Phase 6: Dropping a decrypted save JSON in Database Modder mode routes to Save Editor
    elementsById['btn-mode-db'].click();
    const decryptedSaveJson = JSON.stringify({
      party: { _gold: 777 },
      actors: { _data: [null, { _name: 'Aria', _level: 5 }] }
    });
    elementsById['db-multi-file-input'].onchange({
      target: { files: [{ name: 'decrypted_save.json', _text: decryptedSaveJson, _buffer: Buffer.from(decryptedSaveJson, 'utf8') }] }
    });
    await new Promise(r => setImmediate(r));
    assert.strictEqual(elementsById['save-editor-screen'].style.display, 'flex', 'Decrypted save JSON dropped in DB mode must open Save Editor');
    assert.strictEqual(elementsById['label-filename'].textContent, 'decrypted_save.json');

    // Phase 7: Loading WOLF RPG .sav file renders WOLF RPG inspection view
    elementsById['file-input'].onchange({
      target: { files: [{ name: 'SaveData.sav', _buffer: Buffer.from('WOLF_SAVE_HEADER', 'utf8') }] }
    });
    await new Promise(r => setImmediate(r));
    assert.strictEqual(elementsById['badge-char-count'].textContent, 'WOLF', 'WOLF RPG .sav file must set char badge to WOLF');

    // Phase 8: Japanese RPG decoder (RJ01077453-style Items), <Max Item: 1>, Event Dummy skipping, & English search
    const jpSave = {
      party: { _gold: 500, _items: {} },
      actors: { _data: [null, { _name: 'Kei', _classId: 1, _level: 1 }] }
    };
    const jpSaveBuf = Buffer.from(pako.deflate(JSON.stringify(jpSave), { to: 'string', level: 1 }), 'utf8');
    elementsById['file-input'].onchange({
      target: { files: [{ name: 'jp_test.rmmzsave', _buffer: jpSaveBuf }] }
    });
    await new Promise(r => setImmediate(r));

    const jpItemsJson = JSON.stringify([
      null,
      { id: 15, name: '媚薬', description: '\\I[72] \\c[6]使用者\\c[0] 堕落度を 30点 上昇させる。', note: '', itypeId: 1, effects: [] },
      { id: 18, name: 'SPの書', description: 'SPを 20点 獲得する。', note: '<STS Get Sp: 20>', itypeId: 1, effects: [] },
      { id: 21, name: '★ゴルゴンチーズ', description: '\\I[119] \\c[6]イベントアイテム\\c[0] チーズ', note: '', itypeId: 1, effects: [] },
      { id: 50, name: '概要', description: '', note: '<SGカテゴリ:人物>', itypeId: 3, effects: [] },
      { id: 51, name: '晴れの日の花瓶', description: 'ただの花瓶。<br>毎日意欲度＋１', note: '<Max Item: 1>', itypeId: 1, effects: [] },
      { id: 55, name: '淫魔の誘惑', description: 'アルコールチョコ。<br>淫乱な気持ち＋５０', note: '', itypeId: 1, effects: [{ code: 44, dataId: 766, value1: 1, value2: 0 }] },
      { id: 101, name: 'アルバイト初心者', description: 'イベント用ダミー', note: '', itypeId: 1, effects: [] }
    ]);
    elementsById['data-file-input'].onchange({
      target: { files: [{ name: 'Items.json', _text: jpItemsJson }] }
    });
    assert.ok(elementsById['inventory-picker-select'].innerHTML.includes('Motivation +1'), 'Picker must include decoded English gloss');
    assert.ok(elementsById['inventory-picker-select'].innerHTML.includes('Max:1'), 'Picker must include Max:1 tag');
    assert.ok(elementsById['inventory-picker-select'].innerHTML.includes('Corruption'), 'Picker must decode 堕落度 to Corruption');
    assert.ok(elementsById['inventory-picker-select'].innerHTML.includes('SP +20'), 'Picker must decode <STS Get Sp: 20> to SP +20');

    elementsById['btn-items-unlock-safe'].click();
    elementsById['inventory-search'].value = 'motivation';
    elementsById['inventory-search'].oninput();
    assert.strictEqual(elementsById['inventory-cards-container'].children.length, 1, 'Searching "motivation" must match 晴れの日の花瓶');
    assert.ok(elementsById['inventory-cards-container'].children[0].innerHTML.includes('Motivation +1'));

    elementsById['inventory-search'].value = 'corruption';
    elementsById['inventory-search'].oninput();
    assert.strictEqual(elementsById['inventory-cards-container'].children.length, 1, 'Searching "corruption" must match 媚薬');
    assert.ok(elementsById['inventory-cards-container'].children[0].innerHTML.includes('30 Up'));

    await elementsById['btn-translate-jp'].onclick();
    assert.ok(elementsById['toast'].textContent.includes('Decoded'), 'Offline Translate JP button must report decoded count');

    elementsById['btn-review-download'].click();
    const jpExport = JSON.parse(pako.inflate(getLastBlob().parts[0], { to: 'string' }));
    assert.strictEqual(jpExport.party._items[15], 99, 'Normal Zarakiel item 媚薬 unlocks to 99');
    assert.strictEqual(jpExport.party._items[18], 99, 'Normal Zarakiel item SPの書 unlocks to 99');
    assert.strictEqual(jpExport.party._items[21], undefined, 'Safe Unlock must protect ★イベントアイテム even if itypeId=1');
    assert.strictEqual(jpExport.party._items[50], undefined, 'Safe Unlock must skip itypeId=3 Hidden/Glossary item 概要');
    assert.strictEqual(jpExport.party._items[51], 1, 'Safe Unlock must respect <Max Item: 1> instead of 99');
    assert.strictEqual(jpExport.party._items[55], 99, 'Regular Japanese item without Max tag unlocks to 99');
    assert.strictEqual(jpExport.party._items[101], undefined, 'Safe Unlock must skip イベント用ダミー');
  });
};
