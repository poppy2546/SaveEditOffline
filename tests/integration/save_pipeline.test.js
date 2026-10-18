const assert = require('assert');
const path = require('path');
const pako = require(path.resolve(__dirname, '../../pako.min.js'));
const LZString = require(path.resolve(__dirname, '../../node_modules/lz-string/libs/lz-string.min.js'));
const { RubyMarshal } = require(path.resolve(__dirname, '../../ruby_marshal.js'));

module.exports = function runSavePipelineIntegrationTests(it) {
  it('Pipeline RMMZ: Inflate save -> Mod Gold -> Deflate -> Inflate preserves edits', () => {
    const originalSave = {
      party: { _gold: 100, _items: { 1: 2 } },
      actors: { _data: [null, { _name: 'Leader', _level: 5 }] }
    };

    const initialCompressed = pako.deflate(JSON.stringify(originalSave), { to: 'string', level: 1 });
    const parsed = JSON.parse(pako.inflate(initialCompressed, { to: 'string' }));

    parsed.party._gold = 9999999;
    parsed.party._items[1] = 99;

    const exported = pako.deflate(JSON.stringify(parsed), { to: 'string', level: 1 });
    const verified = JSON.parse(pako.inflate(exported, { to: 'string' }));

    assert.strictEqual(verified.party._gold, 9999999);
    assert.strictEqual(verified.party._items[1], 99);
  });

  it('Pipeline RMMV: Decompress LZString -> Mod Stats -> Compress Base64 roundtrip', () => {
    const originalSave = {
      party: { _gold: 500 },
      actors: { _data: [null, { _hp: 120, _maxHp: 120 }] }
    };

    const rawStr = LZString.decompressFromBase64(LZString.compressToBase64(JSON.stringify(originalSave)));
    const parsed = JSON.parse(rawStr);
    parsed.party._gold = 777777;
    parsed.actors._data[1]._hp = 9999;

    const reExported = LZString.compressToBase64(JSON.stringify(parsed));
    const roundtrip = JSON.parse(LZString.decompressFromBase64(reExported));

    assert.strictEqual(roundtrip.party._gold, 777777);
    assert.strictEqual(roundtrip.actors._data[1]._hp, 9999);
  });

  it('Pipeline RubyMarshal: Decode -> Mod Inventory -> Encode roundtrip binary fidelity', () => {
    const rubyData = {
      '@party': { '@gold': 2000, '@items': { 1: 3 } },
      '@actors': [{ '@name': 'Kashii', '@level': 1 }]
    };

    const bin = RubyMarshal.encode(rubyData);
    const loaded = RubyMarshal.decode(bin);

    loaded['@party']['@gold'] = 500000;
    loaded['@party']['@items'][1] = 99;

    const savedBin = RubyMarshal.encode(loaded);
    const verified = RubyMarshal.decode(savedBin);

    assert.strictEqual(verified['@party']['@gold'], 500000);
    assert.strictEqual(verified['@party']['@items'][1], 99);
  });
};
