const buckets = new Map<string, { tokens: number; last: number }>();

// Token bucket sederhana per IP — cukup untuk menekan abuse pada Piston proxy.
// Di serverless multi-instance tidak 100% ketat; untuk produksi tambahkan Redis.
export function rateLimit(key: string, maxPerMinute = 10): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: maxPerMinute, last: now };
  b.tokens = Math.min(maxPerMinute, b.tokens + ((now - b.last) / 60000) * maxPerMinute);
  b.last = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}

export function clientIp(request: Request, locals: App.Locals): string {
  return (
    (locals as { clientAddress?: string }).clientAddress ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}
