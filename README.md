# makefun-national-statistics-site-01

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Zikri167/makefun-national-statistics-site-01/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Zikri167/makefun-national-statistics-site-01/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Statistik Nusantara — situs statistik nasional Indonesia yang berjalan offline dari file statis: penduduk, ekonomi, kesehatan, pendidikan, dan data 38 provinsi (2015–2024), dengan grafik SVG yang digambar sendiri dan semua kontrol berfungsi. Node 22, stdlib only.

## Jalankan

```sh
# Lihat situsnya
node serve.ts   # lalu buka http://localhost:8080
# atau server statis apa pun dengan app/ sebagai root

# Bangun dossier penyerahan
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Isi

- `app/` — situs statis: `index.html`, `style.css`, `main.js` (routing hash), `data.js` (data Indonesia + 38 provinsi, termasuk IPM dan piramida penduduk), `charts.js` (grafik SVG, sparkline, piramida penduduk), `map.js` (peta ubin 38 provinsi), `views.js` (halaman).
- `screenshots/` — 4 render asli situs: beranda, ekonomi, provinsi (desktop 1280×800), dan beranda ukuran HP (390×844).
- `shots.json` — daftar screenshot dan tampilan yang direkamnya.
- `main.ts` — menyalin `app/` dan `screenshots/` ke output dan menulis `dossier.json` via `vendor/makefun-frontend.ts`.

Data: BPS, Bank Indonesia, World Bank, Kementerian Kesehatan RI, Kementerian Pendidikan RI (lihat halaman Tentang di situs untuk sumber dan metodologi).

---

<sub>Entered on [make.fun](https://make.fun/?ref=63s6rw9w&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
