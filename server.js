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
  '/run-server.bat'
]);

const ROOT_DIR = path.resolve(__dirname);

const server = http.createServer((req, res) => {
  const secHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer'
  };

  let pathname;
  try {
    const parsed = new URL(req.url, 'http://localhost');
    pathname = decodeURIComponent(parsed.pathname);
  } catch (e) {
    res.writeHead(400, { ...secHeaders, 'Content-Type': 'text/plain' });
    res.end('400 Bad Request');
    return;
  }

  if (pathname === '/') pathname = '/index.html';

  const lowerPath = pathname.toLowerCase();
  if (lowerPath.includes('/.') || BLOCKED_FILES.has(lowerPath)) {
    res.writeHead(403, { ...secHeaders, 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const safeRelPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.resolve(ROOT_DIR, '.' + safeRelPath);

  // Path traversal guard: must stay inside ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR + path.sep) && filePath !== ROOT_DIR && filePath !== path.join(ROOT_DIR, 'index.html')) {
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
      res.end(content);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`SaveEdit Offline Server running at http://${HOST}:${PORT}/`);
});
