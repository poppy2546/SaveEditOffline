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

  it('RubyMarshal: Rejects negative or out-of-bounds lengths to prevent DoS', () => {
    // String '"' (0x22) with negative fixnum -1 (0xfa)
    const negLenBytes = new Uint8Array([0x04, 0x08, 0x22, 0xfa]);
    assert.throws(() => {
      RubyMarshal.decode(negLenBytes);
    }, /invalid or out-of-bounds length/i);

    // Array '[' (0x5b) with huge count 100000 (0x03, 0xa0, 0x86, 0x01) on tiny buffer
    const hugeArrBytes = new Uint8Array([0x04, 0x08, 0x5b, 0x03, 0xa0, 0x86, 0x01]);
    assert.throws(() => {
      RubyMarshal.decode(hugeArrBytes);
    }, /invalid collection length/i);

    // Empty buffer must throw instead of returning empty multi-stream array
    assert.throws(() => {
      RubyMarshal.decode(new Uint8Array(0));
    }, /invalid or empty ruby marshal buffer/i);

    // Unknown tag byte (e.g. 'Z' = 0x5a) must throw instead of silently returning null
    const badTagBytes = new Uint8Array([0x04, 0x08, 0x5a]);
    assert.throws(() => {
      RubyMarshal.decode(badTagBytes);
    }, /unsupported or corrupted ruby marshal tag/i);
  });

  it('RubyMarshal: Preserves integer Hash keys as Fixnum (0x69) instead of Symbols', () => {
    const items = { 1: 5, 2: 10 };
    const encoded = RubyMarshal.encode(items);
    // Header (04 08), Hash (7b), count 2 (07), then first key must be Fixnum 'i' (0x69), NOT Symbol ':' (0x3a)
    assert.strictEqual(encoded[4], 0x69, 'Numeric hash key must be encoded as Fixnum (0x69)');
    const decoded = RubyMarshal.decode(encoded);
    assert.strictEqual(decoded[1], 5);
    assert.strictEqual(decoded[2], 10);
  });

  it('RubyMarshal: Encodes and decodes 64-bit Bignum ("l") and shared/circular object links ("@")', () => {
    const sharedActor = { '@name': 'Aluxes', '@exp': 5000000000, '@debt': -5000000000 };
    const root = { partyActor: sharedActor, actorsList: [sharedActor] };
    root.selfRef = root;

    const encoded = RubyMarshal.encode(root);
    const decoded = RubyMarshal.decode(encoded);

    assert.strictEqual(decoded.partyActor['@exp'], 5000000000);
    assert.strictEqual(decoded.partyActor['@debt'], -5000000000);
    assert.strictEqual(decoded.partyActor, decoded.actorsList[0], 'Shared object references must be preserved via @ link');
    assert.strictEqual(decoded.selfRef, decoded, 'Circular references must resolve without stack overflow');
  });

  it('RubyMarshal: Preserves 4-byte negative Fixnums, binary strings, multi-stream .rvdata2, and RGSS Table UserDump', () => {
    for (const n of [-16777217, -100000000, -1073741824]) {
      assert.strictEqual(RubyMarshal.decode(RubyMarshal.encode(n)), n, `Failed 4-byte negative Fixnum ${n}`);
    }

    const rawBinStr = new Uint8Array([0x04, 0x08, 0x22, 0x08, 0xff, 0xfe, 0x80]);
    const reBin = RubyMarshal.encode(RubyMarshal.decode(rawBinStr));
    assert.deepStrictEqual(Array.from(reBin), Array.from(rawBinStr), 'Binary non-UTF8 string bytes must roundtrip without U+FFFD corruption');

    const tableBytes = new Uint8Array(20 + 6);
    const dv = new DataView(tableBytes.buffer);
    dv.setUint32(0, 1, true); // 1D
    dv.setUint32(4, 3, true); // xsize=3
    dv.setUint32(8, 1, true); // ysize=1
    dv.setUint32(12, 1, true); // zsize=1
    dv.setUint32(16, 3, true); // count=3
    dv.setInt16(20, 0, true);
    dv.setInt16(22, 42, true);
    dv.setInt16(24, 99, true);

    const headerStream = RubyMarshal.encode({ characters: [['Hero', 0]], playtime_s: '00:10:00' });
    const { RubyObject, RubyUserDump } = require(path.resolve(__dirname, '../../ruby_marshal.js'));
    const contentsStream = RubyMarshal.encode({
      party: new RubyObject('Game_Party', { '@gold': 1200 }),
      variables: new RubyObject('Game_Variables', { '@data': new RubyUserDump('Table', tableBytes) })
    });
    const combined = new Uint8Array(headerStream.length + contentsStream.length);
    combined.set(headerStream, 0);
    combined.set(contentsStream, headerStream.length);

    const streams = RubyMarshal.decode(combined);
    assert.ok(Array.isArray(streams) && streams.length === 2, 'Multi-stream .rvdata2 must decode both streams');
    assert.strictEqual(streams[1].party['@gold'], 1200);
    assert.strictEqual(streams[1].variables['@data'].__table_data__[1], 42);
    streams[1].variables['@data'].__table_data__[1] = 777;
    streams[1].variables['@data'].__table_data__[2] = 99999;

    const reCombined = RubyMarshal.encode(streams);
    const reDecoded = RubyMarshal.decode(reCombined);
    assert.strictEqual(reDecoded[1].variables['@data'].__table_data__[1], 777, 'RGSS Table edits must persist on re-encode');
    assert.strictEqual(reDecoded[1].variables['@data'].__table_data__[2], 32767, 'RGSS Table must clamp Int16 values to prevent overflow wrap-around');
  });

  it('RubyMarshal: Preserves @-linked String/Bignum Hash keys, Infinity/NaN floats, 1D Table growth, and I-wrapped binary strings', () => {
    const h1 = { hp: 100 };
    Object.defineProperty(h1, '__ruby_key_types__', { value: { hp: 'string' }, enumerable: false });
    const h2 = { hp: 200 };
    Object.defineProperty(h2, '__ruby_key_types__', { value: { hp: 'string' }, enumerable: false });
    const decodedHashes = RubyMarshal.decode(RubyMarshal.encode([h1, h2]));
    assert.strictEqual(decodedHashes[1].__ruby_key_types__.hp, 'string', 'Linked string key via @ must remain string type, not symbol');

    const floats = RubyMarshal.decode(RubyMarshal.encode([Infinity, -Infinity, NaN, 3.14]));
    assert.strictEqual(floats[0], Infinity);
    assert.strictEqual(floats[1], -Infinity);
    assert.ok(Number.isNaN(floats[2]));
    assert.strictEqual(floats[3], 3.14);

    // I-wrapped non-UTF8 RubyRawString (e.g. Shift-JIS with encoding ivar)
    const { RubyUserDump } = require(path.resolve(__dirname, '../../ruby_marshal.js'));
    const sjisWithIvar = new Uint8Array([0x04, 0x08, 0x49, 0x22, 0x07, 0x82, 0xa0, 0x06, 0x3a, 0x06, 0x45, 0x46]);
    const decSjis = RubyMarshal.decode(sjisWithIvar);
    assert.strictEqual(decSjis.__ruby_ivars__.E, false);
    assert.deepStrictEqual(Array.from(RubyMarshal.encode(decSjis)), Array.from(sjisWithIvar));

    // 1D Table dynamic growth when editing higher variable/switch index
    const tBytes = new Uint8Array(20 + 4);
    const dv = new DataView(tBytes.buffer);
    dv.setUint32(0, 1, true);
    dv.setUint32(4, 2, true);
    dv.setUint32(8, 1, true);
    dv.setUint32(12, 1, true);
    dv.setUint32(16, 2, true);
    const tbl = new RubyUserDump('Table', tBytes);
    tbl.__table_data__[5] = 1234;
    const decTbl = RubyMarshal.decode(RubyMarshal.encode(tbl));
    assert.strictEqual(decTbl.__table_data__[5], 1234, '1D Table must grow when higher index is set');
  });
};
