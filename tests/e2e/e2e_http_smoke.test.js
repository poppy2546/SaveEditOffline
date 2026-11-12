const assert = require('assert');
const http = require('http');
const path = require('path');
const server = require(path.resolve(__dirname, '../../server.js'));

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
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await it('E2E HTTP: Serves index.html with 200 OK and valid CSP meta', async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.headers['content-type'].includes('text/html'));
      assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
      assert.ok(res.body.includes('http-equiv="Content-Security-Policy"'), 'Must deliver CSP');
      assert.ok(res.body.includes('Universal RPG Maker Save Editor'), 'Must contain title');
    });

    await it('E2E HTTP: Delivers core runtime assets (ruby_marshal.js & pako.min.js)', async () => {
      const resRuby = await fetch(`${baseUrl}/ruby_marshal.js`);
      assert.strictEqual(resRuby.statusCode, 200);
      assert.ok(resRuby.headers['content-type'].includes('text/javascript'));
      assert.ok(resRuby.body.includes('RubyMarshal'));

      const resPako = await fetch(`${baseUrl}/pako.min.js`);
      assert.strictEqual(resPako.statusCode, 200);
    });

    await it('E2E HTTP Security: Rejects directory traversal and blocked internal files with 403 Forbidden', async () => {
      const res = await fetch(`${baseUrl}/../../../../Windows/win.ini`);
      assert.ok(res.statusCode === 403 || res.statusCode === 404, 'Must not allow traversal outside root');

      const resBlocked = await fetch(`${baseUrl}/server.js`);
      assert.strictEqual(resBlocked.statusCode, 403, 'Must block internal server.js');

      const resTrailingDot = await fetch(`${baseUrl}/server.js.`);
      assert.strictEqual(resTrailingDot.statusCode, 403, 'Must block Windows trailing-dot bypass');

      const resInternalDir = await fetch(`${baseUrl}/functions/_middleware.js`);
      assert.strictEqual(resInternalDir.statusCode, 403, 'Must block non-allowlisted internal files');

      const resWinDevice = await fetch(`${baseUrl}/sample/con`);
      assert.strictEqual(resWinDevice.statusCode, 403, 'Must block Windows reserved device names');

      const resDoubleEnc = await fetch(`${baseUrl}/%252e%252e/server.js`);
      assert.strictEqual(resDoubleEnc.statusCode, 400, 'Must reject double URL encoding with 400');

      const resSvg = await fetch(`${baseUrl}/favicon.svg`);
      assert.strictEqual(resSvg.statusCode, 200);
      assert.ok(resSvg.headers['content-security-policy'].includes("default-src 'none'"), 'Non-HTML assets must lock script execution');
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};
