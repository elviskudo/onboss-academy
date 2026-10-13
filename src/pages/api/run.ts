import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { rateLimit, clientIp } from '../../lib/rate-limit';
import { json } from '../../lib/http';

// Provider eksekusi kode.
// Default: instance publik Judge0 (ce.judge0.com) — tanpa Docker, tanpa API key.
// Self-host (opsional): set PISTON_URL ke instance Piston milikmu, mis. http://localhost:2000/api/v2/piston
const JUDGE0_URL = env.JUDGE0_URL || 'https://ce.judge0.com';
const PISTON_URL = env.PISTON_URL || '';

// Map id bahasa kita → language_id Judge0 (+ alias nama Piston umum)
const JUDGE0_LANG: Record<string, number> = {
  python: 71, java: 62, c: 50, cpp: 54, 'c++': 54, csharp: 51, 'c#': 51, go: 60, golang: 60, rust: 73,
  kotlin: 78, swift: 83, ruby: 72, php: 68, typescript: 74, r: 80, bash: 46,
};

const MAX_CODE = 100_000;

export const POST: APIRoute = async (context) => {
  const ip = clientIp(context.request, context.locals);
  if (!rateLimit(`run:${ip}`, 12)) {
    return json({ ok: false, error: 'Terlalu banyak permintaan eksekusi. Coba lagi dalam semenit.' }, 429);
  }

  let body: { language?: string; files?: { name?: string; content?: string }[]; stdin?: string };
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Permintaan tidak valid.' }, 400);
  }

  const language = String(body.language || '');
  const files = Array.isArray(body.files)
    ? body.files
        .filter((f) => f && typeof f.content === 'string' && f.content.length <= MAX_CODE)
        .map((f) => ({ name: String(f.name || 'main'), content: String(f.content) }))
    : [];
  const stdin = typeof body.stdin === 'string' ? body.stdin.slice(0, 10_000) : '';

  if (!language || files.length === 0) {
    return json({ ok: false, error: 'Bahasa atau kode kosong.' }, 400);
  }
  const code = files.map((f) => f.content).join('\n');

  try {
    // ——— Piston (self-hosted) ———
    if (PISTON_URL) {
      const res = await fetch(`${PISTON_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, version: 'latest', files, stdin }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`piston:${res.status}`);
      const data = await res.json();
      const run = data.run || {};
      const compile = data.compile;
      return json({
        ok: true,
        stdout: String(run.stdout || '').slice(0, 50_000),
        stderr: String(run.stderr || '').slice(0, 20_000),
        compile: compile && compile.code !== 0 ? String(compile.stderr || '').slice(0, 10_000) : null,
        code: run.code ?? null,
      });
    }

    // ——— Judge0 (publik) ———
    const langId = JUDGE0_LANG[language];
    if (!langId) {
      return json({ ok: false, error: `Bahasa "${language}" belum tersedia di runtime.` }, 400);
    }
    // base64 agar kode UTF-8 (emoji/karakter non-ASCII) diterima — mode teks menolaknya dengan 400
    const enc = (s: string) => Buffer.from(s, 'utf8').toString('base64');
    const dec = (s: unknown) => (typeof s === 'string' && s ? Buffer.from(s, 'base64').toString('utf8') : '');
    const res = await fetch(`${JUDGE0_URL}/submissions/?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: langId,
        source_code: enc(code),
        stdin: enc(stdin),
        cpu_time_limit: 5,
        memory_limit: 128000,
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      return json({ ok: false, error: `Runtime tidak tersedia (${res.status}). Coba lagi nanti.` }, 502);
    }
    const data = await res.json();
    const status = data.status?.description || '';
    const compileErr = data.compile_output ? dec(data.compile_output).slice(0, 10_000) : null;
    return json({
      ok: true,
      stdout: dec(data.stdout).slice(0, 50_000),
      stderr: dec(data.stderr).slice(0, 20_000),
      compile: compileErr,
      code: data.exit_code ?? null,
      status,
    });
  } catch (e) {
    console.error('[api/run] fetch gagal:', e);
    return json({ ok: false, error: 'Runtime sedang sibuk atau tidak bisa dihubungi. Coba lagi sebentar lagi.' }, 504);
  }
};
