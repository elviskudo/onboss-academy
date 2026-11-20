import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
const STATE_COOKIE = 'oba_oauth_state';

function runtime(key: string): string | undefined {
  const e = env as unknown as Record<string, string | undefined>;
  return e[key] || undefined;
}

function config() {
  const clientId = import.meta.env.DEV
    ? import.meta.env.GOOGLE_CLIENT_ID
    : runtime('GOOGLE_CLIENT_ID');
  const clientSecret = import.meta.env.DEV
    ? import.meta.env.GOOGLE_CLIENT_SECRET
    : runtime('GOOGLE_CLIENT_SECRET');
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET belum diatur.');
  }
  return { clientId, clientSecret };
}

function siteUrl(context: APIContext) {
  const configured = import.meta.env.DEV
    ? import.meta.env.PUBLIC_SITE_URL
    : runtime('PUBLIC_SITE_URL');
  if (configured) return configured.replace(/\/$/, '');
  return new URL(context.request.url).origin;
}

function redirectUri(context: APIContext) {
  return `${siteUrl(context)}/api/auth/google/callback`;
}

function randomState() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function beginGoogleLogin(context: APIContext) {
  const { clientId } = config();
  const state = randomState();
  context.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(context),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  });
  return context.redirect(`${AUTH_URL}?${params.toString()}`);
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

interface GoogleUser {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function completeGoogleLogin(context: APIContext): Promise<GoogleUser> {
  const { clientId, clientSecret } = config();
  const url = new URL(context.request.url);
  const state = url.searchParams.get('state') || '';
  const code = url.searchParams.get('code') || '';
  const stored = context.cookies.get(STATE_COOKIE)?.value || '';
  context.cookies.delete(STATE_COOKIE, { path: '/' });

  const fail = (msg: string): never => {
    throw new Error(msg);
  };

  if (!state || !stored || state !== stored) fail('State OAuth tidak cocok. Silakan coba lagi.');
  if (!code) fail(url.searchParams.get('error') || 'Kode otorisasi tidak ditemukan.');

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri(context),
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    const detail = await tokenRes.text().catch(() => '');
    fail(`Gagal menukar kode OAuth (${tokenRes.status}). ${detail.slice(0, 200)}`);
  }
  const token = (await tokenRes.json()) as GoogleTokenResponse;
  if (!token.access_token) fail('Google tidak mengembalikan access token.');

  const userRes = await fetch(USERINFO_URL, {
    headers: { authorization: `Bearer ${token.access_token}` },
  });
  if (!userRes.ok) fail(`Gagal mengambil profil Google (${userRes.status}).`);
  const user = (await userRes.json()) as GoogleUser;

  if (!user.sub || !user.email) fail('Profil Google tidak memiliki email.');
  if (user.email_verified === false) fail('Email Google belum terverifikasi.');
  return user;
}
