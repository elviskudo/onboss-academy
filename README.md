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

- Astro 7 dengan SSR Node.
- Tailwind CSS 4 dan MDX.
- Prisma dengan SQLite.
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
