// Pure JavaScript Ruby Marshal 4.8 Parser & Serializer
class RubyMarshal {
  static decode(buffer) {
    const buf = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    if (buf.length < 2) {
      throw new Error('Invalid or empty Ruby Marshal buffer');
    }
    const streams = [];
    let offset = 0;
    while (offset < buf.length) {
      if (buf.length - offset < 2 || buf[offset] !== 4 || buf[offset + 1] !== 8) {
        if (streams.length === 0) {
          const major = buf[offset];
          const minor = buf[offset + 1];
          throw new Error(`Invalid Ruby Marshal version: ${major}.${minor}`);
        }
        break;
      }
      const reader = new MarshalReader(buf, offset);
      streams.push(reader.read());
      offset = reader.pos;
    }
    if (streams.length === 1) return streams[0];
    Object.defineProperty(streams, '__ruby_multi_stream__', { value: true, enumerable: false, configurable: true });
    return streams;
  }

  static encode(obj) {
    if (Array.isArray(obj) && obj.__ruby_multi_stream__) {
      const parts = obj.map(item => new MarshalWriter().write(item));
      const total = parts.reduce((acc, p) => acc + p.length, 0);
      const out = new Uint8Array(total);
      let pos = 0;
      for (const p of parts) {
        out.set(p, pos);
        pos += p.length;
      }
      return out;
    }
    const writer = new MarshalWriter();
    return writer.write(obj);
  }
}

class RubySymbol {
  constructor(name) {
    this.name = name;
  }
  toString() {
    return ':' + this.name;
  }
}

class RubyObject {
  constructor(className, ivars = {}) {
    this.__ruby_class__ = className;
    Object.assign(this, ivars);
  }
}

class RubyUserDump {
  constructor(className, data) {
    this.__ruby_class__ = className;
    this.__ruby_user_dump__ = data;
    if (className === 'Table' && data && data.length >= 20) {
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      const count = view.getUint32(16, true);
      const arr = [];
      for (let i = 0; i < count && (20 + i * 2 + 2) <= data.byteLength; i++) {
        arr.push(view.getInt16(20 + i * 2, true));
      }
      Object.defineProperty(this, '__table_data__', { value: arr, enumerable: false, writable: true, configurable: true });
    }
  }

  syncTableBytes() {
    if (this.__ruby_class__ === 'Table' && Array.isArray(this.__table_data__) && this.__ruby_user_dump__ instanceof Uint8Array && this.__ruby_user_dump__.length >= 20) {
      const arr = this.__table_data__;
      let view = new DataView(this.__ruby_user_dump__.buffer, this.__ruby_user_dump__.byteOffset, this.__ruby_user_dump__.byteLength);
      const dim = view.getUint32(0, true);
      let count = view.getUint32(16, true);
      if (dim === 1 && arr.length > count) {
        const grown = new Uint8Array(20 + arr.length * 2);
        grown.set(this.__ruby_user_dump__.subarray(0, 20), 0);
        this.__ruby_user_dump__ = grown;
        view = new DataView(grown.buffer, grown.byteOffset, grown.byteLength);
        view.setUint32(4, arr.length, true);
        view.setUint32(16, arr.length, true);
        count = arr.length;
      }
      const lim = Math.min(count, arr.length);
      for (let i = 0; i < lim && (20 + i * 2 + 2) <= this.__ruby_user_dump__.byteLength; i++) {
        const clamped = Math.max(-32768, Math.min(32767, Math.trunc(Number(arr[i]) || 0)));
        view.setInt16(20 + i * 2, clamped, true);
      }
    }
    return this.__ruby_user_dump__;
  }
}

class RubyRawString {
  constructor(bytes) {
    this.__ruby_raw_bytes__ = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  }
  toString() {
    let s = '';
    for (let i = 0; i < this.__ruby_raw_bytes__.length; i++) s += String.fromCharCode(this.__ruby_raw_bytes__[i]);
    return s;
  }
}

const UNSAFE_MARSHAL_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  'syncTableBytes'
]);

function isUnsafeMarshalKey(k) {
  if (typeof k !== 'string' && typeof k !== 'number') return true;
  const s = String(k);
  return UNSAFE_MARSHAL_KEYS.has(s) || s.startsWith('__ruby_') || s === '__table_data__';
}

class MarshalReader {
  constructor(buf, startPos = 0) {
    this.buf = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    this.pos = startPos;
    this.symbols = [];
    this.objects = [];
  }

  read() {
    this.depth = 0;
    const major = this.readByte();
    const minor = this.readByte();
    if (major !== 4 || minor !== 8) {
      throw new Error(`Invalid Ruby Marshal version: ${major}.${minor}`);
    }
    return this.readAny();
  }

  readByte() {
    if (this.pos >= this.buf.length) throw new Error('Unexpected EOF in Ruby Marshal');
    return this.buf[this.pos++];
  }

  readBytes(len) {
    if (len < 0 || len > this.buf.length - this.pos) {
      throw new Error('Invalid or out-of-bounds length in Ruby Marshal bytes');
    }
    const slice = this.buf.subarray(this.pos, this.pos + len);
    this.pos += len;
    return slice;
  }

  readCount() {
    const count = this.readFixnum();
    if (count < 0 || count > this.buf.length - this.pos) {
      throw new Error('Invalid collection length in Ruby Marshal');
    }
    return count;
  }

  readFixnum() {
    let b = this.readByte();
    if (b > 127) b -= 256; // signed int8
    if (b === 0) return 0;
    if (b > 0) {
      if (b <= 4) {
        let val = 0;
        for (let i = 0; i < b; i++) {
          val = (val | (this.readByte() << (i * 8))) >>> 0;
        }
        return val;
      }
      return b - 5;
    } else {
      if (b >= -4) {
        const len = -b;
        let val = len === 4 ? 0 : (-1 << (len * 8));
        let n = 0;
        for (let i = 0; i < len; i++) {
          n |= (this.readByte() << (i * 8));
        }
        return val | n;
      }
      return b + 5;
    }
  }

  readSymbol() {
    const len = this.readFixnum();
    const bytes = this.readBytes(len);
    const sym = new TextDecoder('utf-8').decode(bytes);
    this.symbols.push(sym);
    return sym;
  }

  readAny() {
    if (++this.depth > 128) {
      throw new Error('RubyMarshal recursion depth limit exceeded (possible malformed file)');
    }
    try {
      const type = String.fromCharCode(this.readByte());
      let res;
      switch (type) {
        case '0': res = null; break;
        case 'T': res = true; break;
        case 'F': res = false; break;
        case 'i': res = this.readFixnum(); break;
        case ':': res = this.readSymbol(); break;
        case ';': {
          const idx = this.readFixnum();
          if (idx < 0 || idx >= this.symbols.length) throw new Error('Invalid symbol link index');
          res = this.symbols[idx];
          break;
        }
        case '@': {
          const idx = this.readFixnum();
          if (idx < 0 || idx >= this.objects.length) throw new Error('Invalid object link index');
          res = this.objects[idx];
          if (typeof res === 'string' || res instanceof RubyRawString) {
            this.lastReadType = '"';
            return res;
          }
          if (typeof res === 'number') {
            this.lastReadType = Number.isInteger(res) ? 'l' : 'f';
            return res;
          }
          break;
        }
        case '"': {
          const len = this.readFixnum();
          const bytes = this.readBytes(len);
          let str;
          try {
            str = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
          } catch (e) {
            str = new RubyRawString(new Uint8Array(bytes));
          }
          this.objects.push(str);
          res = str;
          break;
        }
        case 'I': {
          // Wrapped with instance variables (e.g. String with UTF-8/Shift-JIS encoding ivar)
          const obj = this.readAny();
          const innerType = this.lastReadType;
          const ivarCount = this.readCount();
          const ivars = {};
          for (let i = 0; i < ivarCount; i++) {
            const k = this.readAny();
            const v = this.readAny();
            if (isUnsafeMarshalKey(k)) continue;
            ivars[k] = v;
          }
          if (obj instanceof RubyObject) {
            Object.assign(obj, ivars);
          } else if (typeof obj === 'object' && obj !== null && Object.keys(ivars).length > 0) {
            Object.defineProperty(obj, '__ruby_ivars__', { value: ivars, enumerable: false, writable: true, configurable: true });
          }
          this.lastReadType = innerType === '"' ? '"' : 'I';
          return obj;
        }
        case '[': {
          const arr = [];
          this.objects.push(arr);
          const len = this.readCount();
          for (let i = 0; i < len; i++) {
            arr.push(this.readAny());
          }
          res = arr;
          break;
        }
        case '{':
        case '}': {
          const hash = {};
          const keyTypes = {};
          Object.defineProperty(hash, '__ruby_key_types__', { value: keyTypes, enumerable: false, configurable: true });
          this.objects.push(hash);
          const len = this.readCount();
          for (let i = 0; i < len; i++) {
            const k = this.readAny();
            const kType = this.lastReadType;
            const v = this.readAny();
            if (isUnsafeMarshalKey(k)) continue;
            if (kType === 'i' || kType === 'l') keyTypes[k] = 'int';
            else if (kType === '"' || kType === 'I') keyTypes[k] = 'string';
            else keyTypes[k] = 'symbol';
            hash[k] = v;
          }
          if (type === '}') {
            const defVal = this.readAny();
            Object.defineProperty(hash, '__ruby_default__', { value: defVal, enumerable: false, configurable: true });
          }
          res = hash;
          break;
        }
        case 'o': {
          const className = String(this.readAny() ?? '');
          const obj = new RubyObject(className);
          this.objects.push(obj);
          const ivarCount = this.readCount();
          for (let i = 0; i < ivarCount; i++) {
            const k = this.readAny();
            const v = this.readAny();
            if (isUnsafeMarshalKey(k)) continue;
            obj[k] = v;
          }
          res = obj;
          break;
        }
        case 'u': {
          const className = String(this.readAny() ?? '');
          const len = this.readFixnum();
          const data = new Uint8Array(this.readBytes(len));
          const u = new RubyUserDump(className, data);
          this.objects.push(u);
          res = u;
          break;
        }
        case 'U': {
          const className = String(this.readAny() ?? '');
          const u = { __ruby_class__: className };
          Object.defineProperty(u, '__ruby_user_marshal__', { value: null, writable: true, enumerable: false, configurable: true });
          this.objects.push(u);
          u.__ruby_user_marshal__ = this.readAny();
          res = u;
          break;
        }
        case 'S': {
          const className = String(this.readAny() ?? '');
          const s = { __ruby_class__: className };
          Object.defineProperty(s, '__ruby_struct__', { value: true, enumerable: false, configurable: true });
          this.objects.push(s);
          const memberCount = this.readCount();
          for (let i = 0; i < memberCount; i++) {
            const k = this.readAny();
            const v = this.readAny();
            if (isUnsafeMarshalKey(k)) continue;
            s[k] = v;
          }
          res = s;
          break;
        }
        case 'C': {
          const className = String(this.readAny() ?? '');
          const inner = this.readAny();
          if (inner && typeof inner === 'object') {
            Object.defineProperty(inner, '__ruby_uclass__', { value: className, enumerable: false, configurable: true });
          }
          res = inner;
          break;
        }
        case 'e': {
          const modName = String(this.readAny() ?? '');
          const inner = this.readAny();
          if (inner && typeof inner === 'object') {
            Object.defineProperty(inner, '__ruby_ext__', { value: modName, enumerable: false, configurable: true });
          }
          res = inner;
          break;
        }
        case 'c':
        case 'm':
        case 'M': {
          const len = this.readFixnum();
          const name = new TextDecoder('utf-8').decode(this.readBytes(len));
          const ref = { __ruby_module_tag__: type, name };
          this.objects.push(ref);
          res = ref;
          break;
        }
        case '/': {
          const len = this.readFixnum();
          const src = new TextDecoder('utf-8').decode(this.readBytes(len));
          const opts = this.readByte();
          const rx = { __ruby_regexp__: src, options: opts };
          this.objects.push(rx);
          res = rx;
          break;
        }
        case 'f': {
          const len = this.readFixnum();
          const bytes = this.readBytes(len);
          const str = new TextDecoder('utf-8').decode(bytes).split('\0')[0];
          const val = str === 'inf' ? Infinity : (str === '-inf' ? -Infinity : (str === 'nan' ? NaN : parseFloat(str)));
          this.objects.push(val);
          res = val;
          break;
        }
        case 'l': {
          const sign = String.fromCharCode(this.readByte());
          const shortLen = this.readCount();
          if (shortLen > 64) {
            throw new Error('Ruby Marshal Bignum length exceeds safe limit');
          }
          const bytes = this.readBytes(shortLen * 2);
          let big = 0n;
          for (let i = bytes.length - 1; i >= 0; i--) {
            big = (big << 8n) | BigInt(bytes[i]);
          }
          if (sign === '-') big = -big;
          const val = Number(big);
          this.objects.push(val);
          res = val;
          break;
        }
        default:
          throw new Error('Unsupported or corrupted Ruby Marshal tag: ' + type);
      }
      this.lastReadType = type;
      return res;
    } finally {
      this.depth--;
    }
  }
}

class MarshalWriter {
  constructor() {
    this.bytes = [];
    this.symbols = new Map();
    this.objectLinks = new Map();
    this.objectCount = 0;
    this.depth = 0;
  }

  write(root) {
    this.depth = 0;
    this.writeByte(4);
    this.writeByte(8);
    this.writeAny(root);
    return new Uint8Array(this.bytes);
  }

  writeByte(b) {
    this.bytes.push(b & 0xff);
  }

  writeBytes(arr) {
    for (let i = 0; i < arr.length; i++) this.bytes.push(arr[i] & 0xff);
  }

  writeFixnum(n) {
    n = Math.round(n);
    if (n === 0) {
      this.writeByte(0);
    } else if (n > 0 && n < 123) {
      this.writeByte(n + 5);
    } else if (n < 0 && n > -124) {
      this.writeByte((n - 5) & 0xff);
    } else if (n > 0) {
      const b = [];
      let temp = n;
      while (temp > 0) {
        b.push(temp & 0xff);
        temp = Math.floor(temp / 256);
      }
      this.writeByte(b.length);
      this.writeBytes(b);
    } else {
      const b = [];
      let temp = ~n;
      while (temp > 0) {
        b.push((~temp) & 0xff);
        temp >>= 8;
      }
      this.writeByte((-b.length) & 0xff);
      this.writeBytes(b);
    }
  }

  writeSymbol(str) {
    if (this.symbols.has(str)) {
      this.writeByte(0x3b); // ';'
      this.writeFixnum(this.symbols.get(str));
    } else {
      const idx = this.symbols.size;
      this.symbols.set(str, idx);
      this.writeByte(0x3a); // ':'
      const enc = new TextEncoder().encode(str);
      this.writeFixnum(enc.length);
      this.writeBytes(enc);
    }
  }

  writeBignum(val) {
    this.writeByte(0x6c); // 'l'
    this.writeByte(val < 0 ? 0x2d : 0x2b); // '-' or '+'
    let big = BigInt(Math.trunc(val));
    if (big < 0n) big = -big;
    const bytes = [];
    while (big > 0n) {
      bytes.push(Number(big & 0xffn));
      big >>= 8n;
    }
    if (bytes.length === 0) bytes.push(0);
    if (bytes.length % 2 !== 0) bytes.push(0);
    this.writeFixnum(bytes.length / 2);
    this.writeBytes(bytes);
    this.objectCount++;
  }

  writeAny(val) {
    if (++this.depth > 128) {
      throw new Error('RubyMarshal write recursion depth limit exceeded');
    }
    try {
      return this._writeAnyInner(val);
    } finally {
      this.depth--;
    }
  }

  _writeAnyInner(val) {
    if (val === null || val === undefined) {
      this.writeByte(0x30); // '0'
    } else if (val === true) {
      this.writeByte(0x54); // 'T'
    } else if (val === false) {
      this.writeByte(0x46); // 'F'
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        if (val > 0x3fffffff || val < -0x40000000) {
          this.writeBignum(val);
        } else {
          this.writeByte(0x69); // 'i'
          this.writeFixnum(val);
        }
      } else {
        this.writeByte(0x66); // 'f'
        const s = Number.isNaN(val) ? 'nan' : (val === Infinity ? 'inf' : (val === -Infinity ? '-inf' : val.toString()));
        this.writeFixnum(s.length);
        this.writeBytes(new TextEncoder().encode(s));
        this.objectCount++;
      }
    } else if (typeof val === 'string') {
      const enc = new TextEncoder().encode(val);
      let hasNonAscii = false;
      for (let i = 0; i < enc.length; i++) {
        if (enc[i] >= 0x80) { hasNonAscii = true; break; }
      }
      if (hasNonAscii) {
        this.writeByte(0x49); // 'I'
        this.writeByte(0x22); // '"'
        this.writeFixnum(enc.length);
        this.writeBytes(enc);
        this.objectCount++;
        this.writeFixnum(1); // 1 ivar
        this.writeSymbol('E');
        this.writeByte(0x54); // true (UTF-8)
      } else {
        this.writeByte(0x22); // '"'
        this.writeFixnum(enc.length);
        this.writeBytes(enc);
        this.objectCount++;
      }
    } else if (typeof val === 'object') {
      if (this.objectLinks.has(val)) {
        this.writeByte(0x40); // '@'
        this.writeFixnum(this.objectLinks.get(val));
        return;
      }
      const ivarKeys = (val.__ruby_ivars__ && typeof val.__ruby_ivars__ === 'object')
        ? Object.keys(val.__ruby_ivars__)
        : [];
      if (ivarKeys.length > 0) {
        this.writeByte(0x49); // 'I'
      }
      if (val.__ruby_ext__) {
        this.writeByte(0x65); // 'e'
        this.writeSymbol(String(val.__ruby_ext__));
      }
      if (val.__ruby_uclass__) {
        this.writeByte(0x43); // 'C'
        this.writeSymbol(String(val.__ruby_uclass__));
      }
      if (val instanceof RubyRawString || val.__ruby_raw_bytes__) {
        this.objectLinks.set(val, this.objectCount++);
        const raw = val.__ruby_raw_bytes__ instanceof Uint8Array
          ? val.__ruby_raw_bytes__
          : new Uint8Array(Object.values(val.__ruby_raw_bytes__));
        this.writeByte(0x22); // '"'
        this.writeFixnum(raw.length);
        this.writeBytes(raw);
      } else if (Array.isArray(val)) {
        this.objectLinks.set(val, this.objectCount++);
        this.writeByte(0x5b); // '['
        this.writeFixnum(val.length);
        for (let i = 0; i < val.length; i++) {
          this.writeAny(val[i]);
        }
      } else if (val instanceof RubyUserDump || val.__ruby_user_dump__ !== undefined) {
        this.writeByte(0x75); // 'u'
        this.writeSymbol(val.__ruby_class__);
        this.objectLinks.set(val, this.objectCount++);
        if (typeof val.syncTableBytes === 'function') val.syncTableBytes();
        const dumpBytes = val.__ruby_user_dump__ instanceof Uint8Array
          ? val.__ruby_user_dump__
          : new Uint8Array(Object.values(val.__ruby_user_dump__));
        this.writeFixnum(dumpBytes.length);
        this.writeBytes(dumpBytes);
      } else if (val.__ruby_user_marshal__ !== undefined) {
        this.writeByte(0x55); // 'U'
        this.writeSymbol(val.__ruby_class__);
        this.objectLinks.set(val, this.objectCount++);
        this.writeAny(val.__ruby_user_marshal__);
      } else if (val.__ruby_struct__) {
        this.writeByte(0x53); // 'S'
        this.writeSymbol(val.__ruby_class__);
        this.objectLinks.set(val, this.objectCount++);
        const keys = Object.keys(val).filter(k => k !== '__ruby_class__');
        this.writeFixnum(keys.length);
        for (const k of keys) {
          this.writeSymbol(k);
          this.writeAny(val[k]);
        }
      } else if (val.__ruby_module_tag__) {
        this.objectLinks.set(val, this.objectCount++);
        this.writeByte(val.__ruby_module_tag__.charCodeAt(0));
        const enc = new TextEncoder().encode(val.name || '');
        this.writeFixnum(enc.length);
        this.writeBytes(enc);
      } else if (val.__ruby_regexp__ !== undefined) {
        this.objectLinks.set(val, this.objectCount++);
        this.writeByte(0x2f); // '/'
        const enc = new TextEncoder().encode(val.__ruby_regexp__);
        this.writeFixnum(enc.length);
        this.writeBytes(enc);
        this.writeByte(val.options || 0);
      } else if (val.__ruby_class__) {
        this.writeByte(0x6f); // 'o'
        this.writeSymbol(val.__ruby_class__);
        this.objectLinks.set(val, this.objectCount++);
        const keys = Object.keys(val).filter(k => k !== '__ruby_class__');
        this.writeFixnum(keys.length);
        for (const k of keys) {
          this.writeSymbol(k);
          this.writeAny(val[k]);
        }
      } else {
        this.objectLinks.set(val, this.objectCount++);
        const hasDefault = Object.prototype.hasOwnProperty.call(val, '__ruby_default__');
        this.writeByte(hasDefault ? 0x7d : 0x7b); // '}' or '{'
        const keys = Object.keys(val);
        const keyTypes = val.__ruby_key_types__ || {};
        this.writeFixnum(keys.length);
        for (const k of keys) {
          const kt = keyTypes[k];
          if (kt === 'int' || (!kt && /^-?\d+$/.test(k))) {
            this.writeAny(parseInt(k, 10));
          } else if (kt === 'string') {
            this.writeAny(k);
          } else if (k.startsWith(':')) {
            this.writeSymbol(k.slice(1));
          } else {
            this.writeSymbol(k);
          }
          this.writeAny(val[k]);
        }
        if (hasDefault) {
          this.writeAny(val.__ruby_default__);
        }
      }
      if (ivarKeys.length > 0) {
        this.writeFixnum(ivarKeys.length);
        for (const k of ivarKeys) {
          this.writeSymbol(k);
          this.writeAny(val.__ruby_ivars__[k]);
        }
      }
    }
  }
}

// Module export for testing
if (typeof module !== 'undefined') {
  module.exports = { RubyMarshal, RubyObject, RubyUserDump, RubyRawString };
}
