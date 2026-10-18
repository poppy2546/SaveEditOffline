const assert = require('assert');
const path = require('path');
const { RubyMarshal } = require(path.resolve(__dirname, '../../ruby_marshal.js'));

module.exports = function runRubyMarshalUnitTests(it) {
  it('RubyMarshal: Encodes header with magic bytes 0x04 0x08', () => {
    const raw = RubyMarshal.encode({ test: 123 });
    assert.ok(raw instanceof Uint8Array, 'Output must be Uint8Array');
    assert.strictEqual(raw[0], 0x04, 'Magic byte 0 must be 0x04');
    assert.strictEqual(raw[1], 0x08, 'Magic byte 1 must be 0x08');
  });

  it('RubyMarshal: Encodes and decodes nested objects and numbers accurately', () => {
    const data = {
      '@party': { '@gold': 9999, '@items': { 1: 5 } },
      '@actors': [{ '@name': 'Hero', '@hp': 500 }]
    };
    const encoded = RubyMarshal.encode(data);
    const decoded = RubyMarshal.decode(encoded);
    assert.strictEqual(decoded['@party']['@gold'], 9999);
    assert.strictEqual(decoded['@party']['@items'][1], 5);
    assert.strictEqual(decoded['@actors'][0]['@name'], 'Hero');
  });

  it('RubyMarshal: Depth limiter prevents stack overflow attack on deeply nested payload', () => {
    const deepBytes = [0x04, 0x08];
    for (let i = 0; i < 135; i++) {
      deepBytes.push(0x5b, 0x01, 0x01); // '[' with 1 element
    }
    deepBytes.push(0x30); // nil '0'
    assert.throws(() => {
      RubyMarshal.decode(new Uint8Array(deepBytes));
    }, /depth limit exceeded/i);
  });
};
