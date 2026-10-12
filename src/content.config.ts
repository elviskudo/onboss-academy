import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const quizQuestion = z.object({
  q: z.string(),
  options: z.array(z.string()).min(2),
  answer: z.number().int().nonnegative(),
  explain: z.string().optional(),
});

const chapters = defineCollection({
  loader: glob({ base: './src/content/chapters', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    quiz: z.array(quizQuestion).min(1),
    example: z
      .object({
        code: z.string(),
        lang: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { chapters };
