import { defineMiddleware } from 'astro:middleware';
import { getSessionUser } from './lib/auth';

import { db } from './lib/db';
import { env } from 'cloudflare:workers';

async function hashIp(ip: string | null) {
  if (!ip) return null;
  const data = new TextEncoder().encode(`${env.SESSION_SECRET}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const onRequest = defineMiddleware(async (context, next) => {
  (context.locals as App.Locals).user = await getSessionUser(context);
  const path = context.url.pathname;
  if (!path.startsWith('/api/') && !path.includes('.')) {
    const visitorId = context.cookies.get('visitor_id')?.value || crypto.randomUUID();
    context.cookies.set('visitor_id', visitorId, { httpOnly: true, sameSite: 'lax', secure: import.meta.env.PROD, maxAge: 60 * 60 * 24 * 365, path: '/' });
    if (db.visitorEvent) {
      const userAgent = context.request.headers.get('user-agent') || '';
      const device = /mobile|android|iphone|ipad/i.test(userAgent) ? 'Mobile' : 'Desktop';
      await db.visitorEvent.create({ data: {
        visitorId,
        userId: context.locals.user?.id,
        path,
        referrer: context.request.headers.get('referer')?.slice(0, 500),
        device,
        country: context.request.headers.get('cf-ipcountry') || null,
        ipHash: await hashIp(context.request.headers.get('cf-connecting-ip')),
      } });
    }
  }
  return next();
});
