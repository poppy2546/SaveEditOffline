// Pure JavaScript Ruby Marshal 4.8 Parser & Serializer
class RubyMarshal {
  static decode(buffer) {
    const reader = new MarshalReader(buffer);
    return reader.read();
  }

  static encode(obj) {
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
  }
}

class MarshalReader {
  constructor(buf) {
    this.buf = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    this.pos = 0;
    this.symbols = [];
    this.objects = [];
  }

  read() {
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
    if (this.pos + len > this.buf.length) throw new Error('Unexpected EOF in Ruby Marshal bytes');
    const slice = this.buf.subarray(this.pos, this.pos + len);
    this.pos += len;
    return slice;
  }

  readFixnum() {
    let b = this.readByte();
    if (b > 127) b -= 256; // signed int8
    if (b === 0) return 0;
    if (b > 0) {
      if (b <= 4) {
        let val = 0;
        for (let i = 0; i < b; i++) {
          val |= (this.readByte() << (i * 8));
        }
        return val;
      }
      return b - 5;
    } else {
      if (b >= -4) {
        const len = -b;
        let val = -1;
        val <<= (len * 8);
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
    const type = String.fromCharCode(this.readByte());
    switch (type) {
      case '0': return null;
      case 'T': return true;
      case 'F': return false;
      case 'i': return this.readFixnum();
      case ':': return this.readSymbol();
      case ';': {
        const idx = this.readFixnum();
        return this.symbols[idx];
      }
      case '@': {
        const idx = this.readFixnum();
        return this.objects[idx];
      }
      case '"': {
        const len = this.readFixnum();
        const bytes = this.readBytes(len);
        let str;
        try { str = new TextDecoder('utf-8').decode(bytes); }
        catch(e) { str = String.fromCharCode.apply(null, bytes); }
        this.objects.push(str);
        return str;
      }
      case 'I': {
        // Wrapped with instance variables (e.g. String with UTF-8 encoding ivar)
        const obj = this.readAny();
        const ivarCount = this.readFixnum();
        const ivars = {};
        for (let i = 0; i < ivarCount; i++) {
          const k = this.readAny();
          const v = this.readAny();
          ivars[k] = v;
        }
        if (typeof obj === 'object' && obj !== null) {
          Object.assign(obj, ivars);
        }
        return obj;
      }
      case '[': {
        const arr = [];
        this.objects.push(arr);
        const len = this.readFixnum();
        for (let i = 0; i < len; i++) {
          arr.push(this.readAny());
        }
        return arr;
      }
      case '{': {
        const hash = {};
        this.objects.push(hash);
        const len = this.readFixnum();
        for (let i = 0; i < len; i++) {
          const k = this.readAny();
          const v = this.readAny();
          hash[k] = v;
        }
        return hash;
      }
      case 'o': {
        const className = this.readAny();
        const obj = new RubyObject(className);
        this.objects.push(obj);
        const ivarCount = this.readFixnum();
        for (let i = 0; i < ivarCount; i++) {
          const k = this.readAny();
          const v = this.readAny();
          obj[k] = v;
        }
        return obj;
      }
      case 'u': {
        const className = this.readAny();
        const len = this.readFixnum();
        const data = this.readBytes(len);
        const u = new RubyUserDump(className, data);
        this.objects.push(u);
        return u;
      }
      case 'f': {
        const len = this.readFixnum();
        const bytes = this.readBytes(len);
        const str = new TextDecoder('utf-8').decode(bytes);
        const val = parseFloat(str);
        this.objects.push(val);
        return val;
      }
      default:
        console.warn('Unhandled Ruby Marshal tag:', type);
        return null;
    }
  }
}

class MarshalWriter {
  constructor() {
    this.bytes = [];
    this.symbols = new Map();
  }

  write(root) {
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
        temp >>= 8;
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

  writeAny(val) {
    if (val === null || val === undefined) {
      this.writeByte(0x30); // '0'
    } else if (val === true) {
      this.writeByte(0x54); // 'T'
    } else if (val === false) {
      this.writeByte(0x46); // 'F'
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        this.writeByte(0x69); // 'i'
        this.writeFixnum(val);
      } else {
        this.writeByte(0x66); // 'f'
        const s = val.toString();
        this.writeFixnum(s.length);
        this.writeBytes(new TextEncoder().encode(s));
      }
    } else if (typeof val === 'string') {
      this.writeByte(0x22); // '"'
      const enc = new TextEncoder().encode(val);
      this.writeFixnum(enc.length);
      this.writeBytes(enc);
    } else if (Array.isArray(val)) {
      this.writeByte(0x5b); // '['
      this.writeFixnum(val.length);
      for (let i = 0; i < val.length; i++) {
        this.writeAny(val[i]);
      }
    } else if (val instanceof RubyUserDump) {
      this.writeByte(0x75); // 'u'
      this.writeSymbol(val.__ruby_class__);
      this.writeFixnum(val.__ruby_user_dump__.length);
      this.writeBytes(val.__ruby_user_dump__);
    } else if (typeof val === 'object') {
      if (val.__ruby_class__) {
        this.writeByte(0x6f); // 'o'
        this.writeSymbol(val.__ruby_class__);
        const keys = Object.keys(val).filter(k => k !== '__ruby_class__');
        this.writeFixnum(keys.length);
        for (const k of keys) {
          this.writeSymbol(k);
          this.writeAny(val[k]);
        }
      } else {
        this.writeByte(0x7b); // '{'
        const keys = Object.keys(val);
        this.writeFixnum(keys.length);
        for (const k of keys) {
          this.writeSymbol(k);
          this.writeAny(val[k]);
        }
      }
    }
  }
}

// Module export for testing
if (typeof module !== 'undefined') {
  module.exports = { RubyMarshal, RubyObject, RubyUserDump };
}
