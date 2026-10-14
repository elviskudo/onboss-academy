# OnBoss Academy

Platform belajar pemrograman berbahasa Indonesia dengan materi terstruktur, contoh kode yang bisa dijalankan, kuis, progres belajar, dan sertifikat.

## Fitur

- 38 bahasa dan topik teknologi.
- 336 chapter MDX dengan urutan belajar yang jelas.
- Materi Python mengikuti alur tutorial inti W3Schools, termasuk Project Mini.
- Editor kode interaktif untuk runtime yang didukung.
- Kuis per chapter dengan nilai kelulusan minimal 70%.
- Progres belajar, absensi harian, streak, dan sertifikat.
- Logo aplikasi di navbar dan favicon.

## Stack

- Astro 7 dengan SSR di Cloudflare Workers (`@astrojs/cloudflare`).
- Tailwind CSS 4 dan MDX.
- Prisma dengan Cloudflare D1 (SQLite di edge).
- CodeMirror 6.
- sql.js untuk menjalankan SQL di browser.
- jsPDF untuk sertifikat.
- Runtime kode melalui iframe sandbox, sql.js, dan endpoint Judge0/Piston.

## Menjalankan Lokal

Persyaratan: Node.js `>=22.12.0`.

```sh
npm install
npx prisma migrate dev
npm run dev
```

Aplikasi tersedia di `http://localhost:4321`.

Untuk menjalankan server di background:

```sh
astro dev --background
```

Kelola server background dengan:

```sh
astro dev status
astro dev logs
astro dev stop
```

## Environment

Salin `.env.example` menjadi `.env`, lalu isi nilainya:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="acak-panjang"
JUDGE0_URL="https://ce.judge0.com"
PISTON_URL=""
```

Jangan commit `.env`, database lokal, atau secret.

Runtime Cloudflare membaca `JUDGE0_URL` dan `PISTON_URL` dari `vars` di `wrangler.jsonc`. Secret production dipasang dengan `npx wrangler secret put <KEY>`.

## Deploy ke Cloudflare

Production: <https://onboss-academy.elviskudo.workers.dev>

Simpan kredensial hanya di `.env` (sudah di-gitignore) — jangan pernah di-commit:

```
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

Buat database D1 (sekali saja) lalu isi `database_id` di `wrangler.jsonc`:

```sh
npx wrangler d1 create onboss-academy
```

Terapkan skema ke D1 remote, lalu deploy:

```sh
npm run db:migrate:remote
npm run deploy
```

Perintah pendukung:

| Perintah | Fungsi |
| --- | --- |
| `npm run db:migrate:local` | Terapkan migrasi D1 lokal (untuk dev/preview) |
| `npm run db:migrate:remote` | Terapkan migrasi ke D1 produksi |
| `npm run generate-types` | Regenerasi `worker-configuration.d.ts` setelah ubah `wrangler.jsonc` |
| `npx astro preview` | Preview build memakai workerd |

### Update ke web live

Perubahan kode maupun konten MDX **tidak otomatis** tayang. Keduanya ikut ter-bundle ke dalam worker, jadi setiap kali ada perubahan jalankan lagi:

```sh
npm run deploy
```

Yang berubah langsung tanpa deploy hanya data di D1 (user, progres, absen, sertifikat).

Catatan: `session: false` dipakai karena autentikasi memakai cookie + tabel `Session` di D1, bukan Astro Sessions.

## Troubleshooting

- Error `The file does not exist at ".../node_modules/.vite/deps_ssr/..."` saat `npm run dev`: cache optimizer Vite basi, biasanya setelah `.env` atau config berubah saat server berjalan. Hentikan server lalu bersihkan cache:

```sh
npx astro dev stop
rm -rf node_modules/.vite
npm run dev
```

## Validasi dan Build

```sh
python3 scripts/check_content.py
npx astro check
npm run build
```

## Struktur Konten

Chapter berada di:

```text
src/content/chapters/{langId}/NN-slug.mdx
```

Frontmatter chapter menggunakan `title`, `description`, `order`, `quiz`, dan `example`. Daftar bahasa, runtime, dan metadata berada di `src/data/languages.ts`.

Panduan penulisan MDX tersedia di `AGENTS.md`.

## Perintah Utama

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npx astro check` | Memeriksa tipe dan integrasi Astro |
| `python3 scripts/check_content.py` | Memvalidasi seluruh konten MDX |
| `npx prisma migrate dev` | Menjalankan migrasi database lokal |

## Lisensi

Project ini dikelola untuk pengembangan OnBoss Academy.
