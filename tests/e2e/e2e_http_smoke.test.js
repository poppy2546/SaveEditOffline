const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

function createTestServer() {
  return http.createServer((req, res) => {
    let pathname;
    try {
      const parsed = new URL(req.url, 'http://localhost');
      pathname = decodeURIComponent(parsed.pathname);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('400 Bad Request');
      return;
    }

    if (pathname === '/') pathname = '/index.html';

    const safeRelPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.resolve(ROOT_DIR, '.' + safeRelPath);

    if (!filePath.startsWith(ROOT_DIR + path.sep) && filePath !== ROOT_DIR && filePath !== path.join(ROOT_DIR, 'index.html')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data).toString('utf8')
        });
      });
    }).on('error', reject);
  });
}

module.exports = async function runE2ESmokeTests(it) {
  const server = createTestServer();

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await it('E2E HTTP: Serves index.html with 200 OK and valid CSP meta', async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.headers['content-type'].includes('text/html'));
      assert.ok(res.body.includes('http-equiv="Content-Security-Policy"'), 'Must deliver CSP');
      assert.ok(res.body.includes('Save &amp; DB Studio') || res.body.includes('Save & DB Studio'), 'Must contain title');
    });

    await it('E2E HTTP: Delivers core runtime assets (ruby_marshal.js & pako.min.js)', async () => {
      const resRuby = await fetch(`${baseUrl}/ruby_marshal.js`);
      assert.strictEqual(resRuby.statusCode, 200);
      assert.ok(resRuby.headers['content-type'].includes('text/javascript'));
      assert.ok(resRuby.body.includes('RubyMarshal'));

      const resPako = await fetch(`${baseUrl}/pako.min.js`);
      assert.strictEqual(resPako.statusCode, 200);
    });

    await it('E2E HTTP Security: Rejects directory traversal attempts with 403 Forbidden', async () => {
      const res = await fetch(`${baseUrl}/../../../../Windows/win.ini`);
      assert.ok(res.statusCode === 403 || res.statusCode === 404, 'Must not allow traversal outside root');
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};
