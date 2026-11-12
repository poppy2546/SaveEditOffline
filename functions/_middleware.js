const WIN_RESERVED_DEVICE_RE = /(^|\/)(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;

export async function onRequest(context) {
  const method = context.request.method;
  if (method !== 'GET' && method !== 'HEAD') {
    return new Response('405 Method Not Allowed', {
      status: 405,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    });
  }

  const url = new URL(context.request.url);
  let path = url.pathname;
  try {
    path = decodeURIComponent(path);
    if (path.includes('%') || path.includes('\0')) {
      return new Response('400 Bad Request', { status: 400 });
    }
  } catch (e) {
    return new Response('400 Bad Request', { status: 400 });
  }
  const rawNormalized = path.replace(/\\/g, '/');
  path = rawNormalized.toLowerCase().replace(/[.\s]+$/, '');

  // Pattern ที่บอทสแกนช่องโหว่มักเรียกหา และไฟล์ภายในโปรเจกต์ที่ไม่ควรเปิดให้ดาวน์โหลด
  const blockedPatterns = [
    '.env',
    '.git',
    '.svn',
    '.hg',
    '.bzr',
    '.ds_store',
    '.php',
    '.bak',
    '.old',
    '.yml',
    '.yaml',
    '.lnk',
    '.bat',
    '.exe',
    'server.js',
    'builder_promax.js',
    'package.json',
    'package-lock.json',
    'wrangler',
    'run_pyramid',
    '/tests/',
    '/functions/',
    '/node_modules/',
    'phpinfo',
    'credentials',
    'gcp-sa',
    'auth.json',
    'wp-admin',
    'wp-login',
    'phpmyadmin'
  ];

  // ตรวจจับ hidden files/folders (เช่น /.svn, /.hg) หรือ path traversal ยกเว้น /.well-known
  const isHiddenFile = (path.includes('/.') && !path.startsWith('/.well-known')) || path.includes('..') || /[.\s](\/|$)/.test(rawNormalized);

  // ตรวจจับถ้า path มีคำต้องสงสัย ให้บล็อกทันที (403 Forbidden)
  const isSuspicious = isHiddenFile || WIN_RESERVED_DEVICE_RE.test(rawNormalized) || blockedPatterns.some((pattern) => path.includes(pattern));

  if (isSuspicious) {
    return new Response('403 Forbidden - Access Denied by WAF Middleware', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';"
      }
    });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  const isHtmlDoc = path === '/' || path === '/index.html' || path.endsWith('.html');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set(
    'Content-Security-Policy',
    isHtmlDoc
      ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none';"
      : "default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; form-action 'none'; base-uri 'none';"
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
