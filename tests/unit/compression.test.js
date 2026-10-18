const assert = require('assert');
const path = require('path');
const pako = require(path.resolve(__dirname, '../../pako.min.js'));
const LZString = require(path.resolve(__dirname, '../../node_modules/lz-string/libs/lz-string.min.js'));

module.exports = function runCompressionUnitTests(it) {
  it('Pako: Deflates and inflates UTF-8 strings without loss', () => {
    const raw = JSON.stringify({ gold: 12345, items: ['herb', 'potion'] });
    const deflated = pako.deflate(raw, { to: 'string', level: 1 });
    assert.ok(deflated.length > 0, 'Deflated output should not be empty');
    const inflated = pako.inflate(deflated, { to: 'string' });
    assert.strictEqual(inflated, raw, 'Inflated string must match original');
  });

  it('LZString: Compresses and decompresses Base64 payloads correctly', () => {
    const raw = JSON.stringify({ system: 'RMMV', switches: [true, false, true] });
    const compressed = LZString.compressToBase64(raw);
    assert.ok(typeof compressed === 'string' && compressed.length > 0);
    const decompressed = LZString.decompressFromBase64(compressed);
    assert.strictEqual(decompressed, raw);
  });

  it('Format Detection: Wolf RPG and extension detectors recognize valid filenames', () => {
    const isWolf = (name) => {
      const lower = name.toLowerCase();
      return lower.endsWith('.sav') || lower.includes('savedata');
    };
    assert.strictEqual(isWolf('SaveData01.sav'), true);
    assert.strictEqual(isWolf('file1.rmmzsave'), false);
    assert.strictEqual(isWolf('file1.rpgsave'), false);
  });
};
