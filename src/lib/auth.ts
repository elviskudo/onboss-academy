import type { APIContext } from 'astro';
import bcrypt from 'bcryptjs';
import { db } from './db';

const SESSION_COOKIE = 'oba_session';
const SESSION_DAYS = 30;

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, context: APIContext) {
  const session = await db.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000),
    },
  });
  context.cookies.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return session;
}

export async function destroySession(context: APIContext) {
  const id = context.cookies.get(SESSION_COOKIE)?.value;
  if (id) {
    await db.session.deleteMany({ where: { id } });
  }
  context.cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function getSessionUser(context: APIContext) {
  const id = context.cookies.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const session = await db.session.findUnique({
    where: { id },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await db.session.deleteMany({ where: { id } });
    context.cookies.delete(SESSION_COOKIE, { path: '/' });
    return null;
  }
  return session.user;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
