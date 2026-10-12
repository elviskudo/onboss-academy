import { defineMiddleware } from 'astro:middleware';
import { getSessionUser } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  (context.locals as App.Locals).user = await getSessionUser(context);
  return next();
});
