const fs = require('fs');
const path = require('path');

const pakoCode = fs.readFileSync(path.join(__dirname, 'pako.min.js'), 'utf8');
const lzCode = fs.readFileSync(path.join(__dirname, 'node_modules/lz-string/libs/lz-string.min.js'), 'utf8');

// We will construct the updated index.html
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Replace the embedded script section with both pako and lz-string
const oldScriptMarker = '<!-- Embedded LZString library for RPG Maker MV/MZ compatibility -->';
const newLibraries = `<!-- Embedded LZString & Pako libraries for RPG Maker MV/MZ compatibility -->
<script>
// Pako (zlib/deflate) for RPG Maker MZ (.rmmzsave)
${pakoCode}
</script>
<script>
// LZString for RPG Maker MV (.rpgsave)
${lzCode}
</script>`;

if (html.includes(oldScriptMarker)) {
  const parts = html.split(oldScriptMarker);
  const afterMarker = parts[1];
  // Find where the next <script> (Application Logic) starts
  const appLogicIdx = afterMarker.indexOf('<!-- Application Logic -->');
  html = parts[0] + newLibraries + '\n\n' + afterMarker.substring(appLogicIdx);
  console.log('Libraries injected successfully');
} else {
  console.error('Marker not found!');
  process.exit(1);
}

// Now update parseSaveData and generateExportBlob
// Replace parseSaveData
const oldParseRegex = /async function parseSaveData\(rawBytes, fileName\) \{[\s\S]*?throw new Error\('Unrecognized save file format\. Supported: RPG Maker MV\/MZ, Gzip, Zlib, JSON, XML, Base64, INI\.'\);[\s\S]*?\}/;

const newParseFunction = `async function parseSaveData(rawBytes, fileName) {
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const text = textDecoder.decode(rawBytes).trim();

    // 1. Check RPG Maker MZ (.rmmzsave) - Uses pako deflate with string output
    if (typeof pako !== 'undefined') {
      try {
        const unzipped = pako.inflate(text, { to: 'string' });
        if (unzipped && (unzipped.startsWith('{') || unzipped.startsWith('['))) {
          const json = JSON.parse(unzipped);
          return {
            format: 'rmmzsave',
            formatLabel: 'RPG Maker MZ (.rmmzsave)',
            root: json,
            textOriginal: unzipped
          };
        }
      } catch (e) {}

      // Try binary Uint8Array inflate with pako
      try {
        const unzipped = pako.inflate(rawBytes, { to: 'string' });
        if (unzipped && (unzipped.startsWith('{') || unzipped.startsWith('['))) {
          const json = JSON.parse(unzipped);
          return {
            format: 'rmmzsave_bin',
            formatLabel: 'RPG Maker MZ / Zlib (Pako)',
            root: json,
            textOriginal: unzipped
          };
        }
      } catch (e) {}
    }

    // 2. Check RPG Maker MV (.rpgsave) - Uses LZString base64
    if (fileName.endsWith('.rpgsave') || /^[A-Za-z0-9+/=]+$/.test(text)) {
      try {
        const decompressed = LZString.decompressFromBase64(text);
        if (decompressed && (decompressed.startsWith('{') || decompressed.startsWith('['))) {
          const json = JSON.parse(decompressed);
          return {
            format: 'rpgmaker_lz',
            formatLabel: 'RPG Maker MV (.rpgsave)',
            root: json,
            textOriginal: decompressed
          };
        }
      } catch (e) {}
    }

    // 3. Check GZIP (magic 0x1f 0x8b)
    if (rawBytes.length > 2 && rawBytes[0] === 0x1f && rawBytes[1] === 0x8b) {
      const decompressed = await decompressBytes(rawBytes, 'gzip');
      if (decompressed) {
        const decText = textDecoder.decode(decompressed);
        try {
          const json = JSON.parse(decText);
          return { format: 'gzip', formatLabel: 'Gzip + JSON', root: json, textOriginal: decText };
        } catch (e) {
          return { format: 'gzip_text', formatLabel: 'Gzip + Text', root: parseKeyValues(decText), textOriginal: decText };
        }
      }
    }

    // 4. Check ZLIB / Deflate (magic 0x78)
    if (rawBytes.length > 2 && rawBytes[0] === 0x78) {
      const decompressed = await decompressBytes(rawBytes, 'deflate');
      if (decompressed) {
        const decText = textDecoder.decode(decompressed);
        try {
          const json = JSON.parse(decText);
          return { format: 'deflate', formatLabel: 'Zlib/Deflate + JSON', root: json, textOriginal: decText };
        } catch (e) {
          // Check if valid INI or text
          const kv = parseKeyValues(decText);
          if (kv && Object.keys(kv).length > 0) {
            return { format: 'deflate_text', formatLabel: 'Zlib/Deflate + Text', root: kv, textOriginal: decText };
          }
        }
      }
    }

    // 5. Check Direct JSON
    if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
      try {
        const json = JSON.parse(text);
        return {
          format: 'json',
          formatLabel: 'JSON File',
          root: json,
          textOriginal: text
        };
      } catch (e) {}
    }

    // 6. Check Base64 encoded JSON
    if (/^[A-Za-z0-9+/=\\s]+$/.test(text) && text.length > 8) {
      try {
        const decoded = atob(text.replace(/\\s+/g, ''));
        if (decoded.startsWith('{') || decoded.startsWith('[')) {
          const json = JSON.parse(decoded);
          return {
            format: 'base64_json',
            formatLabel: 'Base64 + JSON',
            root: json,
            textOriginal: decoded
          };
        }
      } catch (e) {}
    }

    // 7. Check XML (Unity PlayerPrefs, .xml)
    if (text.startsWith('<') && text.endsWith('>')) {
      const xmlParsed = parseXmlSave(text);
      if (xmlParsed) {
        return {
          format: 'xml',
          formatLabel: 'XML Save (Unity/Generic)',
          root: xmlParsed.data,
          textOriginal: text
        };
      }
    }

    // 8. Check Key-Value / INI (STRICT: Reject binary/non-ascii garbled text)
    if (!hasControlOrBinaryGarbage(text)) {
      const kv = parseKeyValues(text);
      if (kv && Object.keys(kv).length > 0) {
        return {
          format: 'ini',
          formatLabel: 'Key-Value / INI',
          root: kv,
          textOriginal: text
        };
      }
    }

    throw new Error('Unrecognized save file format. Supported: RPG Maker MV (.rpgsave), RPG Maker MZ (.rmmzsave), Gzip, Zlib, JSON, XML, Base64, INI.');
  }`;

html = html.replace(oldParseRegex, newParseFunction);

// Add helper hasControlOrBinaryGarbage
const helperCode = `  function hasControlOrBinaryGarbage(str) {
    if (!str || str.length === 0) return true;
    let nonPrintable = 0;
    const checkLength = Math.min(str.length, 1000);
    for (let i = 0; i < checkLength; i++) {
      const code = str.charCodeAt(i);
      if (code === 0 || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
        return true;
      }
      if (code > 126 && code < 160) {
        nonPrintable++;
      }
    }
    return nonPrintable / checkLength > 0.15;
  }
`;

html = html.replace('function parseXmlSave(text) {', helperCode + '\n  function parseXmlSave(text) {');

// Update generateExportBlob to support rmmzsave
const oldExportRegex = /async function generateExportBlob\(\) \{[\s\S]*?return new Blob\(\[jsonStr\], \{ type: 'application\/json;charset=utf-8' \}\);[\s\S]*?\}/;

const newExportFunction = `async function generateExportBlob() {
    const format = currentFile.format;
    const jsonStr = JSON.stringify(currentFile.parsedRoot);
    const prettyJsonStr = JSON.stringify(currentFile.parsedRoot, null, 2);

    // RPG Maker MZ (.rmmzsave)
    if (format === 'rmmzsave' || format === 'rmmzsave_bin') {
      const zipped = pako.deflate(jsonStr, { to: 'string', level: 1 });
      return new Blob([zipped], { type: 'text/plain;charset=utf-8' });
    }

    // RPG Maker MV (.rpgsave)
    if (format === 'rpgmaker_lz') {
      const compressed = LZString.compressToBase64(jsonStr);
      return new Blob([compressed], { type: 'text/plain;charset=utf-8' });
    }

    if (format === 'gzip') {
      const enc = new TextEncoder();
      const compressed = await compressBytes(enc.encode(prettyJsonStr), 'gzip');
      return new Blob([compressed], { type: 'application/octet-stream' });
    }

    if (format === 'deflate') {
      const enc = new TextEncoder();
      const compressed = await compressBytes(enc.encode(prettyJsonStr), 'deflate');
      return new Blob([compressed], { type: 'application/octet-stream' });
    }

    if (format === 'base64_json') {
      const b64 = btoa(unescape(encodeURIComponent(prettyJsonStr)));
      return new Blob([b64], { type: 'text/plain;charset=utf-8' });
    }

    if (format === 'ini') {
      let output = '';
      for (const [k, v] of Object.entries(currentFile.parsedRoot)) {
        output += \`\${k}=\${v}\\n\`;
      }
      return new Blob([output], { type: 'text/plain;charset=utf-8' });
    }

    // Default JSON
    return new Blob([prettyJsonStr], { type: 'application/json;charset=utf-8' });
  }`;

html = html.replace(oldExportRegex, newExportFunction);

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('index.html updated successfully with Pako & RPG Maker MZ support!');
