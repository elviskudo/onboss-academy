import { getCollection, type CollectionEntry } from 'astro:content';
import { db } from './db';

export type ChapterEntry = CollectionEntry<'chapters'>;

export async function getLangChapters(langId: string): Promise<ChapterEntry[]> {
  const all = await getCollection('chapters', (e) => e.id.startsWith(`${langId}/`));
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPassedChapters(userId: string, langId: string): Promise<Set<string>> {
  const rows = await db.chapterProgress.findMany({
    where: { userId, langId },
    select: { chapterId: true },
  });
  return new Set(rows.map((r) => r.chapterId));
}

/** Bab terbuka kalau 5 bab pertama, atau bab sebelumnya sudah lulus quiz. */
export function isChapterUnlocked(index: number, passed: Set<string>, chapters: ChapterEntry[]): boolean {
  if (index < 5) return true;
  const prev = chapters[index - 1];
  return prev ? passed.has(prev.id) : false;
}

export function chapterIdToSlug(langId: string, entryId: string): string {
  return entryId.slice(langId.length + 1);
}
