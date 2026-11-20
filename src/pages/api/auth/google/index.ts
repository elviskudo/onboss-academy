import type { APIRoute } from 'astro';
import { beginGoogleLogin } from '../../../../lib/google';

export const GET: APIRoute = (context) => beginGoogleLogin(context);
