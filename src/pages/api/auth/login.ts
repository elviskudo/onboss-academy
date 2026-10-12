import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { createSession, verifyPassword } from '../../../lib/auth';

export const POST: APIRoute = async (context) => {
  const form = await context.request.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');

  const fail = (msg: string) => context.redirect(`/login?error=${encodeURIComponent(msg)}&email=${encodeURIComponent(email)}`);

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return fail('Email atau password salah.');
  }
  await createSession(user.id, context);
  return context.redirect('/dashboard');
};
