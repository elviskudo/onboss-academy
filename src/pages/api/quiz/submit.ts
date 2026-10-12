import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { db } from '../../../lib/db';
import { getLangChapters, getPassedChapters, isChapterUnlocked } from '../../../lib/progress';
import { issueCertificateIfDone } from '../../../lib/cert';
import { getLanguage } from '../../../data/languages';
import { json } from '../../../lib/http';

export const POST: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) return json({ ok: false, error: 'Silakan masuk terlebih dahulu.' }, 401);

  let body: { langId?: string; chapterId?: string; answers?: number[] };
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Permintaan tidak valid.' }, 400);
  }
  const { langId, chapterId, answers } = body;
  if (!langId || !chapterId || !Array.isArray(answers)) {
    return json({ ok: false, error: 'Permintaan tidak valid.' }, 400);
  }

  const entry = await getEntry('chapters', `${langId}/${chapterId}`);
  if (!entry) return json({ ok: false, error: 'Bab tidak ditemukan.' }, 404);

  const chapters = await getLangChapters(langId);
  const index = chapters.findIndex((c) => c.id === entry.id);
  const passed = await getPassedChapters(user.id, langId);
  if (!isChapterUnlocked(index, passed, chapters)) {
    return json({ ok: false, error: 'Selesaikan kuis bab sebelumnya untuk membuka bab ini.' }, 403);
  }

  const quiz = entry.data.quiz;
  let correct = 0;
  const detail = quiz.map((q, i) => {
    const ok = answers[i] === q.answer;
    if (ok) correct++;
    return { ok, answer: q.answer, explain: q.explain };
  });
  const score = Math.round((correct / quiz.length) * 100);
  const passedQuiz = score >= 70;

  if (passedQuiz) {
    await db.chapterProgress.upsert({
      where: { userId_langId_chapterId: { userId: user.id, langId, chapterId: entry.id } },
      create: { userId: user.id, langId, chapterId: entry.id, quizScore: score },
      update: { quizScore: score },
    });
    const lang = getLanguage(langId);
    await issueCertificateIfDone(user.id, langId, lang?.name || langId, chapters.length);
  }

  return json({ ok: true, score, correct, total: quiz.length, passed: passedQuiz, detail });
};
