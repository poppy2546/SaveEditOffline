const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HOST = '127.0.0.1';
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const BLOCKED_FILES = new Set([
  '/server.js',
  '/builder_promax.js',
  '/package.json',
  '/package-lock.json',
  '/open.exe',
  '/run-server.bat',
  '/functions/_middleware.js'
]);

const ALLOWED_PUBLIC_FILES = new Set([
  '/index.html',
  '/pako.min.js',
  '/ruby_marshal.js',
  '/favicon.svg',
  '/app.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/googleb849330cd4b9cc23.html',
  '/license',
  '/readme.md',
  '/sample/test_save.rpgsave',
  '/sample/readme.md'
]);

const WIN_RESERVED_DEVICE_RE = /(^|\/)(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;

const ROOT_DIR = path.resolve(__dirname);

const server = http.createServer((req, res) => {
  const baseSecHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; form-action 'none'; base-uri 'none';"
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...baseSecHeaders, 'Content-Type': 'text/plain' });
    res.end('405 Method Not Allowed');
    return;
  }

  // Host header & Sec-Fetch-Site validation (blocks DNS rebinding & cross-site localhost probing)
  const hostHeader = String(req.headers.host || '').toLowerCase();
  if (hostHeader && !/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(hostHeader)) {
    res.writeHead(403, { ...baseSecHeaders, 'Content-Type': 'text/plain' });
    res.end('403 Forbidden - Invalid Host');
    return;
  }
  const secFetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase();
  if (secFetchSite === 'cross-site') {
    res.writeHead(403, { ...baseSecHeaders, 'Content-Type': 'text/plain' });
    res.end('403 Forbidden - Cross-Site Request Blocked');
    return;
  }

  let pathname;
  try {
    if (!req.url || req.url.length > 2048 || !req.url.startsWith('/') || req.url.startsWith('//')) {
      throw new Error('Invalid request target');
    }
    const parsed = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(parsed.pathname).replace(/\\/g, '/');
    if (pathname.includes('%') || pathname.includes('\0')) {
      throw new Error('Blocked double encoding or null byte');
    }
  } catch (e) {
    res.writeHead(400, { ...baseSecHeaders, 'Content-Type': 'text/plain' });
    res.end('400 Bad Request');
    return;
  }

  if (pathname === '/') pathname = '/index.html';

  const normalizedUrlPath = path.posix.normalize(pathname);
  const lowerPath = normalizedUrlPath.toLowerCase().replace(/[.\s]+$/, '');
  if (
    pathname.includes('/.') ||
    pathname.includes('..') ||
    /[.\s](\/|$)/.test(pathname) ||
    WIN_RESERVED_DEVICE_RE.test(normalizedUrlPath) ||
    lowerPath.includes('/.') ||
    BLOCKED_FILES.has(lowerPath) ||
    !ALLOWED_PUBLIC_FILES.has(lowerPath)
  ) {
    res.writeHead(403, { ...baseSecHeaders, 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const secHeaders = lowerPath === '/index.html'
    ? {
        ...baseSecHeaders,
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none';"
      }
    : baseSecHeaders;

  const safeRelPath = normalizedUrlPath.replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.resolve(ROOT_DIR, '.' + safeRelPath);

  // Path traversal guard: must stay inside ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR + path.sep) && filePath !== path.join(ROOT_DIR, 'index.html')) {
    res.writeHead(403, { ...secHeaders, 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'EISDIR') {
        res.writeHead(404, { ...secHeaders, 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { ...secHeaders, 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { ...secHeaders, 'Content-Type': contentType });
      res.end(req.method === 'HEAD' ? undefined : content);
    }
  });
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`SaveEdit Offline Server running at http://${HOST}:${PORT}/`);
  });
}

module.exports = server;
