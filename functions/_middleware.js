export async function onRequest(context) {
  const url = new URL(context.request.url);
  let path = url.pathname;
  try {
    path = decodeURIComponent(path);
  } catch (e) {
    return new Response('400 Bad Request', { status: 400 });
  }
  path = path.toLowerCase();

  // Pattern ที่บอทสแกนช่องโหว่มักเรียกหา
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
    '.save',
    '.yml',
    '.yaml',
    'phpinfo',
    'credentials',
    'gcp-sa',
    'auth.json',
    'wp-admin',
    'wp-login',
    'phpmyadmin'
  ];

  // ตรวจจับ hidden files/folders (เช่น /.svn, /.hg) หรือ path traversal ยกเว้น /.well-known
  const isHiddenFile = (path.includes('/.') && !path.startsWith('/.well-known')) || path.includes('..');

  // ตรวจจับถ้า path มีคำต้องสงสัย ให้บล็อกทันที (403 Forbidden)
  const isSuspicious = isHiddenFile || blockedPatterns.some((pattern) => path.includes(pattern));

  if (isSuspicious) {
    return new Response('403 Forbidden - Access Denied by WAF Middleware', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
