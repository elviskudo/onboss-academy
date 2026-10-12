import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { createSession, hashPassword, isValidEmail } from '../../../lib/auth';

export const POST: APIRoute = async (context) => {
  const form = await context.request.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');

  const fail = (msg: string) =>
    context.redirect(`/register?error=${encodeURIComponent(msg)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);

  if (name.length < 2) return fail('Nama minimal 2 karakter.');
  if (!isValidEmail(email)) return fail('Format email tidak valid.');
  if (password.length < 8) return fail('Password minimal 8 karakter.');

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return fail('Email sudah terdaftar. Silakan masuk.');

  const user = await db.user.create({
    data: { name, email, passwordHash: await hashPassword(password) },
  });
  await createSession(user.id, context);
  return context.redirect('/dashboard?welcome=1');
};
