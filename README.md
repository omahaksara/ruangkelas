# RuangKelas

Workspace pendidikan pribadi untuk guru, dengan fondasi yang disiapkan agar kelak dapat dikembangkan menjadi platform sekolah dan produk digital.

## Status
Prototipe front-end tahap 1. Belum memiliki login, backend, database bersama, atau sinkronisasi lintas perangkat.

## Fitur prototipe
- Dashboard responsif
- Perangkat ajar, penilaian, dan pusat materi
- Agenda serta catatan kelas berbasis data contoh
- Simulasi pengolahan nilai dan ekspor CSV
- Pengaturan profil dan pilihan kurikulum
- Pencarian, filter, tema gelap, tambah/hapus item
- Penyimpanan lokal di browser (localStorage)

## Jalankan
Buka `index.html` di browser modern, atau aktifkan GitHub Pages menggunakan langkah berikut.

## Publikasi GitHub Pages
1. Buka **Settings → Pages** pada repositori.
2. Pada **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih branch `main` dan folder `/(root)`, lalu simpan.
4. Tunggu deployment selesai. URL biasanya berbentuk `https://omahaksara.github.io/ruangkelas/`.

## Struktur
```text
ruangkelas/
├── index.html
├── README.md
└── assets/
    ├── app.js
    └── styles.css
```

## Catatan keamanan
- Jangan masukkan data pribadi siswa atau data sensitif ke versi demo publik.
- `localStorage` hanya tersimpan pada browser/perangkat saat ini dan bukan database bersama.
- Jangan simpan kata sandi, token, atau kunci API di kode front-end.
- Login multi-pengguna memerlukan backend/database, autentikasi, otorisasi per peran, validasi input, dan aturan privasi.

## Arah pengembangan
1. Audit dan uji alur front-end pada desktop dan ponsel.
2. Lengkapi editor dokumen dan ekspor.
3. Rancang konfigurasi kurikulum yang fleksibel.
4. Tambahkan backend dan autentikasi setelah kebutuhan multi-pengguna ditetapkan.
5. Siapkan mode sekolah dan lisensi produk setelah keamanan diuji.


## Administrasi guru kelas VI
- Daftar siswa dapat ditambahkan per kelas, nama/NIS/kelas dapat diedit, dan siswa yang keluar dapat diarsipkan atau dihapus permanen.
- Kenaikan kelas otomatis: kelas I–V naik satu tingkat, kelas VI masuk arsip/lulus, dan kelas I siap diisi siswa baru.
- Identitas kepala sekolah dapat diedit untuk kop laporan.
- Absensi per tanggal dengan status Hadir, Izin, Sakit, Alpa, atau Belum diisi.
- Rekap ringkas, ekspor CSV, dan cetak laporan absensi.
- Identitas sekolah/wali kelas serta checklist persiapan supervisi.
- Seluruh data administrasi kelas disimpan lokal di browser; belum ada sinkronisasi atau database sekolah.
- Untuk data nyata, gunakan perangkat pribadi yang aman dan ikuti kebijakan perlindungan data sekolah.
