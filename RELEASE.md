# Release Notes

## v0.0.5 — Material Coverage & Google Sign-In

### Highlights

- Materi diperluas dari 338 menjadi **1005 chapter MDX** untuk 38 bahasa.
- Cakupan tiap bahasa diselaraskan dengan urutan topik tutorial inti W3Schools; materi tetap ditulis ulang secara orisinal dalam bahasa Indonesia.
- Seluruh chapter memakai pola konsisten: penjelasan, contoh, `## Try it Yourself`, dan kuis 5 soal.
- Menambahkan **Sign in with Google** (OAuth 2.0) di halaman login dan register.
- Alur OAuth memakai state cookie untuk CSRF, menukar kode di server, lalu membuat/mencari user berdasarkan email Google yang terverifikasi.
- Akun Google memakai `passwordHash` acak sehingga tidak bisa masuk memakai password biasa.
- `.env.example` didokumentasikan dengan `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `PUBLIC_SITE_URL`.

### Konfigurasi yang Diperlukan

Redirect URI harus didaftarkan di Google Cloud Console pada OAuth client bertipe *Web application*:

```text
https://onboss-academy.elviskudo.workers.dev/api/auth/google/callback
http://localhost:4321/api/auth/google/callback
```

Secret production dipasang lewat `npx wrangler secret put GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `PUBLIC_SITE_URL`.

### Verification

- `/usr/bin/python3 scripts/check_content.py` berhasil (1005 MDX valid, 38 bahasa).
- `npx astro build` berhasil dengan adapter Cloudflare.
- Tombol Google tampil di `/login` dan `/register`.
- Endpoint `/api/auth/google` menghasilkan authorization URL Google dengan `client_id`, `redirect_uri`, `scope`, dan `state` yang benar.
- Validasi langsung ke Google menunjukkan `redirect_uri_mismatch` untuk localhost maupun production — redirect URI belum terdaftar di Google Console. Kode siap pakai begitu URI didaftarkan.


## v0.0.4 — HTML5 Forms & Runtime Preview

### Highlights

- Menambahkan chapter HTML5 tentang form modern, validasi bawaan browser, aksesibilitas label, dan studi kasus reservasi.
- Preview runtime HTML kini tampil di panel putih terpisah dari console log agar hasil halaman lebih mudah dibaca.
- Contoh HTML tetap berjalan dalam iframe sandbox.

### Verification

- `python3 scripts/check_content.py` berhasil (338 MDX valid, 38 bahasa).
- `npx astro check` berhasil.
- `npm run build` berhasil dengan adapter Cloudflare.

## v0.0.3 — Mobile Sidebar Fix

### Highlights

- Sidebar daftar bab di mobile tidak lagi sticky dan dibatasi `max-h-[40vh]` sehingga tidak menutupi hampir setengah layar.
- Perilaku desktop (lg) tetap: sticky `top-20` dengan tinggi maksimal viewport.

### Verification

- `python3 scripts/check_content.py` berhasil (337 MDX valid, 38 bahasa).
- `npx astro build` berhasil dengan adapter Cloudflare.

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
