# RuangKelas

Workspace pendidikan pribadi untuk guru, dengan fondasi yang disiapkan agar kelak dapat dikembangkan menjadi platform sekolah dan produk digital.

## Status
Prototipe front-end tahap 1. Belum memiliki login, backend, database bersama, atau sinkronisasi lintas perangkat.

## Fitur prototipe
- Dashboard responsif
- Perangkat ajar, penilaian, dan pusat materi
- Agenda serta catatan kelas berbasis data contoh
- Pengolahan nilai per siswa aktif dan mata pelajaran; nilai tersimpan per siswa dan dapat diekspor ke CSV
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

## Modul pelanggaran dan pembinaan
- Catatan kejadian berbasis siswa aktif, refleksi, kesepakatan pembinaan, jadwal evaluasi, status tindak lanjut, pencarian, edit/hapus, ekspor CSV, dan cetak.
- Tidak ada poin atau hukuman otomatis; kategori adalah label pencatatan yang dapat disesuaikan.
- Catatan ini masih disimpan di browser/perangkat yang sama.

## Rencana sinkronisasi cloud (belum aktif)
- GitHub Pages menyajikan front-end statis; autentikasi dan database harus disediakan layanan backend.
- Rekomendasi awal: Firebase Authentication + Cloud Firestore dengan akses per sekolah/tenant, peran pengguna, dan prinsip akses minimum.
- Sebelum memakai data siswa nyata, pengelola perlu membuat proyek Firebase, mengaktifkan metode login, merancang struktur sekolah, menerapkan dan menguji Security Rules, serta menyiapkan cadangan dan prosedur penghapusan data.
- Jangan menaruh service-account key, token admin, atau rahasia backend di front-end/repository.
- Sinkronisasi cloud belum aktif sampai konfigurasi proyek, aturan keamanan, login, migrasi, dan pengujian lintas akun selesai.


## Fondasi pengembangan jangka panjang
- Studio AI Guru saat ini menyusun prompt secara lokal untuk disalin ke layanan AI; integrasi Gemini API belum aktif.
- Peta jalan dan arsitektur target: [docs/ROADMAP.md](docs/ROADMAP.md) dan [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md).
- Login, database cloud, sinkronisasi, AI server-side, PDF lanjutan, dan monetisasi adalah tahap berikutnya dan belum dinyatakan aktif.


## CP & TP Kurikulum Merdeka — Kelas VI / Fase C
- Halaman **CP & TP** memuat ringkasan CP acuan fase dan elemen per mata pelajaran, lalu menampilkan bab, tujuan pembelajaran dari materi yang digunakan, dan materi pokok.
- Data awal mencakup Bahasa Indonesia, Matematika, Pendidikan Pancasila (label alternatif materi: PPKn), dan Seni Rupa.
- Bab, tujuan, dan materi pokok mengikuti data yang diberikan pengguna. Rumusan tersebut tidak otomatis diklaim sebagai TP resmi pemerintah; guru perlu memeriksa dan menyelaraskannya dengan ATP/KOSP sekolah.
- Ringkasan CP merujuk Kepka BSKAP Nomor 046/H/KR/2025. Ringkasan di aplikasi merupakan bantuan kerja, bukan pengganti dokumen resmi. Rujukan umum dapat diverifikasi melalui [portal resmi CP & ATP](https://guru.kemendikdasmen.go.id/kurikulum-merdeka).
- Tujuan dapat disalin dan dikirim sebagai konteks awal ke Studio AI Guru. Studio AI masih membuat prompt lokal; koneksi Gemini API belum aktif.
- Pemetaan TP ke elemen CP dapat disimpan per browser, serta tersedia tambah/hapus TP lokal, ekspor CSV, cadangan JSON, pemulihan JSON, dan cetak/PDF browser. Data lokal tidak otomatis sinkron ke perangkat lain.
- Dataset berada di `assets/kurikulum-kelas6.js`; antarmuka berada di `index.html`, `assets/app.js`, dan `assets/styles.css`.
