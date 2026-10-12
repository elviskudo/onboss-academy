import { randomBytes } from 'node:crypto';
import { db } from './db';

export function makeCertCode(langId: string): string {
  return `OBA-${langId.toUpperCase().slice(0, 4)}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function issueCertificateIfDone(userId: string, langId: string, langTitle: string, totalChapters: number) {
  const passedCount = await db.chapterProgress.count({ where: { userId, langId } });
  if (passedCount < totalChapters) return null;

  const existing = await db.certificate.findFirst({ where: { userId, langId } });
  if (existing) return existing;

  // retry-safe: unique code
  for (let i = 0; i < 5; i++) {
    try {
      return await db.certificate.create({
        data: { userId, langId, langTitle, code: makeCertCode(langId) },
      });
    } catch {
      /* code collision — coba lagi */
    }
  }
  return null;
}
