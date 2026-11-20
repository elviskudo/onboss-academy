import type { APIRoute } from 'astro';
import { db } from '../../../../lib/db';
import { createSession, hashPassword } from '../../../../lib/auth';
import { completeGoogleLogin } from '../../../../lib/google';

export const GET: APIRoute = async (context) => {
  const fail = (msg: string) =>
    context.redirect(`/login?error=${encodeURIComponent(msg)}`);

  let profile;
  try {
    profile = await completeGoogleLogin(context);
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Login Google gagal.');
  }

  const email = profile.email!.toLowerCase();
  const name = (profile.name || email.split('@')[0]).trim().slice(0, 80);

  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // passwordHash tetap NOT NULL di schema; isi dengan nilai acak yang tidak
    // pernah diketahui siapa pun sehingga akun OAuth tidak bisa login memakai password.
    user = await db.user.create({
      data: {
        email,
        name,
        passwordHash: await hashPassword(crypto.randomUUID()),
      },
    });
  } else if (name && user.name !== name) {
    user = await db.user.update({ where: { id: user.id }, data: { name } });
  }

  await createSession(user.id, context);
  return context.redirect('/dashboard?welcome=google');
};
