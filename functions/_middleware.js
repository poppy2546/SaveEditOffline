export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.toLowerCase();

  // Pattern ที่บอทสแกนช่องโหว่มักเรียกหา
  const blockedPatterns = [
    '.env',
    '.git',
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

  // ตรวจจับถ้า path มีคำต้องสงสัย ให้บล็อกทันที (403 Forbidden)
  const isSuspicious = blockedPatterns.some((pattern) => path.includes(pattern));

  if (isSuspicious) {
    return new Response('403 Forbidden - Access Denied by WAF Middleware', {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    });
  }

  return context.next();
}
