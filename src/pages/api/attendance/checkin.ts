import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { json } from '../../../lib/http';

function ymd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) return json({ ok: false, error: 'Silakan masuk terlebih dahulu.' }, 401);

  const today = ymd();
  const existing = await db.attendance.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (existing) {
    return json({ ok: true, already: true, message: 'Kamu sudah absen hari ini. Sampai jumpa besok!' });
  }

  await db.attendance.create({ data: { userId: user.id, date: today } });

  // hitung streak: mundur dari hari ini selama user absen beruntun
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const row = await db.attendance.findUnique({
      where: { userId_date: { userId: user.id, date: ymd(cursor) } },
    });
    if (!row) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const total = await db.attendance.count({ where: { userId: user.id } });
  return json({ ok: true, streak, total, message: `Absen tercatat! Streak kamu ${streak} hari.` });
};
