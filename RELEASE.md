# Release Notes

## v0.0.2 — Admin Analytics

### Highlights

- Admin dashboard di `/admin`, hanya dapat diakses oleh admin yang dikonfigurasi.
- Ringkasan visitor unik, page views, user terdaftar, aktivitas belajar, sertifikat, dan check-in.
- Grafik pertumbuhan visitor dan user baru selama 14 hari.
- Daftar halaman populer, device, negara, referrer, serta page views dari user login.
- Visitor tracking privacy-first menggunakan cookie; IP hanya disimpan sebagai hash SHA-256 bersalt untuk security.
- D1 migration `0002_visitor_metadata.sql` menambahkan metadata analytics tanpa menghapus data existing.

### Verification

- `python3 scripts/check_content.py` berhasil.
- `npx astro check` berhasil.
- `npm run build` berhasil.
- Migration D1 local dan remote berhasil diterapkan.


## v0.0.1 — Initial Release

### Highlights

- Platform belajar pemrograman berbasis Astro.
- 38 bahasa dan topik teknologi.
- 336 chapter pembelajaran dalam format MDX.
- Menu Python disusun mengikuti urutan tutorial inti W3Schools.
- Project Mini Python dengan aplikasi kasir CLI.
- Contoh kode interaktif untuk runtime yang didukung.
- Kuis, progres belajar, absensi, streak, dan sertifikat.
- Navbar memakai `public/logo.png` sebagai logo dan favicon.
- Seluruh chapter dapat dibuka langsung untuk eksplorasi materi.

### Python Learning Path

1. Pengenalan Python
2. Variabel & Tipe Data
3. Percabangan
4. Looping
5. Function
6. String Lanjutan & Format
7. List, Dict & Set Methods
8. File Handling
9. Error Handling
10. OOP & Proyek
11. Project Mini Python

### Deployment

- SSR dipindahkan dari Node adapter ke `@astrojs/cloudflare`.
- Database dipindahkan dari Prisma + SQLite lokal ke Prisma + Cloudflare D1 (`@prisma/adapter-d1`).
- Skema D1 dikelola lewat `d1_migrations/` dengan `wrangler d1 migrations apply`.
- Nilai runtime diambil dari `cloudflare:workers` (`env`), bukan `process.env`.
- `session: false` karena autentikasi memakai cookie + tabel `Session` di D1.
- Perubahan kode maupun konten MDX harus di-`npm run deploy` ulang; hanya data D1 yang langsung berubah.
- Production: <https://onboss-academy.elviskudo.workers.dev>

### Verification

- `python3 scripts/check_content.py` berhasil.
- `npx astro build` berhasil dengan adapter Cloudflare.
- Smoke test production: halaman publik, register, dashboard, kuis, absen, dan eksekusi kode lolos.
- `npx astro check` masih punya 36 error tipe lama (`data` dari `response.json()` bertipe `unknown` di `QuizRunner.astro`, `TryIt.astro`, `CheckinButton.astro`, `api/run.ts`) — tidak terkait migrasi ini.

### Catatan

- Runtime kode eksternal bergantung pada konfigurasi Judge0 atau Piston.
- Kredensial Cloudflare hanya disimpan di `.env` yang di-gitignore — jangan pernah di-commit.
- `prisma/dev.db` tidak lagi dipakai saat runtime; D1 adalah sumber data produksi.
