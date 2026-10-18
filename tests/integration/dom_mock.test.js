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
      get innerHTML() { return _innerHTML; },
      set innerHTML(val) {
        _innerHTML = String(val || '');
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

    const sampleSave = {
      party: { _gold: 8200, _items: { 1: 5 } },
      actors: { _data: [null, { _name: 'Hero', _level: 1, _hp: 500, _mp: 50, _paramPlus: [0,0,0,0,0,0,0,0] }] },
      variables: { _data: [0, 10] },
      switches: { _data: [false, true] }
    };
    const fileBuffer = Buffer.from(pako.deflate(JSON.stringify(sampleSave), { to: 'string', level: 1 }), 'utf8');

    elementsById['file-input'].onchange({
      target: { files: [{ name: 'file1.rmmzsave', _buffer: fileBuffer }] }
    });

    await new Promise(r => setImmediate(r));

    const goldInput = elementsById['quick-gold-input'];
    assert.strictEqual(Number(goldInput.value), 8200);

    elementsById['btn-gold-add-10k'].click();
    assert.strictEqual(Number(goldInput.value), 18200);

    elementsById['btn-gold-max'].click();
    assert.strictEqual(Number(goldInput.value), 9999999);

    elementsById['btn-review-download'].click();
    const exportedZipped = getLastBlob().parts[0];
    const exportedJson = JSON.parse(pako.inflate(exportedZipped, { to: 'string' }));
    assert.strictEqual(exportedJson.party._gold, 9999999);
  });
};
