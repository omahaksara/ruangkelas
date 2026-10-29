# RuangKelas — Peta Jalan Produk

Dokumen ini menjadi acuan jangka panjang agar fitur dibangun bertahap, konsisten, aman, dan dapat dikomersialkan. Status menjelaskan keadaan kode saat ini; bukan janji bahwa layanan eksternal sudah aktif.

## Prinsip produk
- Satu sumber data siswa untuk absensi, nilai, dan pembinaan.
- Privasi siswa, akses minimum, dan pencatatan perubahan sebagai persyaratan dasar.
- AI hanya membantu membuat draf dan analisis pendukung; guru memeriksa dan memutuskan.
- Tidak menerapkan poin pelanggaran otomatis sebelum kebijakan sekolah disepakati dan dapat dikonfigurasi.
- Jangan menyimpan kunci rahasia API di front-end atau repositori publik.
- Setiap tahap memiliki kriteria uji dan rencana pemulihan sebelum rilis.

## Tahap 0 — Fondasi workspace (sebagian sudah ada)
- [x] Workspace statis GitHub Pages dan navigasi modul.
- [x] Daftar siswa, absensi, nilai dasar, dan catatan pembinaan lokal.
- [x] Studio AI untuk menyusun prompt dan menyalinnya ke layanan AI.
- [x] Halaman CP & TP awal Kelas VI/Fase C untuk empat mapel, dengan ringkasan CP acuan, bab, tujuan dari materi, materi pokok, pencarian, salin, dan pengiriman konteks ke Studio AI.
- [ ] Validasi pemetaan setiap bab/TP terhadap ATP/KOSP sekolah dan uji alur CP & TP pada browser.
- [ ] Uji alur UI nyata di browser desktop dan ponsel.
- [ ] Tetapkan kebijakan cadangan, ekspor, dan pemulihan data lokal.

## Tahap 1 — Administrasi inti
- [ ] Data sekolah, tahun ajaran, kelas, guru, dan identitas dokumen dalam satu profil.
- [ ] Validasi data siswa, impor/ekspor dengan pratinjau dan deteksi duplikat.
- [ ] Riwayat perubahan nilai/absensi dan konfirmasi tindakan berisiko.
- [ ] Laporan cetak konsisten: absensi, nilai, pembinaan, dan rekap kelas.
- [ ] Uji perhitungan nilai dengan kasus batas dan data contoh yang tidak mengandung data pribadi.

## Tahap 2 — Backend, login, dan sinkronisasi
Arsitektur kandidat: Firebase Authentication + Cloud Firestore + Cloud Functions. Evaluasi Supabase sebagai alternatif sebelum keputusan final.
- [ ] Buat proyek cloud, konfigurasi environment, dan pengelolaan rahasia.
- [ ] Login Google/email, logout, pemulihan akun, dan sesi aman.
- [ ] Skema tenant/sekolah: school, membership, profile, students, attendance, grades, incidents, audit logs.
- [ ] Aturan akses per sekolah dan peran; default deny; uji akses lintas sekolah.
- [ ] Migrasi data lokal dengan pratinjau, cadangan, konflik, dan rollback.
- [ ] Sinkronisasi multi-perangkat, indikator status, penanganan offline, dan konflik edit.
- [ ] Backup terjadwal, prosedur pemulihan, retensi, dan penghapusan akun/data.
- [ ] Uji keamanan sebelum memasukkan data siswa sungguhan.

## Tahap 3 — Gemini AI melalui backend
- [x] Form penyusun prompt lokal untuk modul ajar, RPP, asesmen, LKPD, deskripsi rapor berbasis placeholder, dan rencana pembinaan.
- [ ] Cloud Function memanggil Gemini API; API key hanya di secret manager/server.
- [ ] Validasi input/output, batas panjang, rate limit, penanganan error, dan kuota per akun.
- [ ] Hasil AI berupa draf yang bisa disunting, disalin, dan disimpan setelah persetujuan guru.
- [ ] Template Kurikulum Merdeka menggunakan CP/tujuan yang diberikan atau sumber terverifikasi; jangan mengarang kutipan resmi.
- [ ] Perluas dataset CP/TP per fase, kelas, mapel, versi dokumen, dan sumber; sediakan alur impor serta validasi guru.
- [ ] Narasi rapor tidak boleh mengarang capaian; harus merujuk bukti yang diverifikasi guru.
- [ ] Insight perilaku memakai agregat seperlunya, menghindari label diagnostik, dan tidak membuat keputusan otomatis.
- [ ] Uji kualitas, bias, privasi, dan biaya per permintaan.

## Tahap 4 — PDF dan identitas sekolah
- [ ] Profil kop sekolah, logo, alamat, tanda tangan/jabatan, periode laporan.
- [ ] PDF konsisten dengan pratinjau cetak, nomor halaman, tanggal, dan nama file.
- [ ] Validasi layout pada A4, tinta hitam-putih, dan printer umum.
- [ ] Template tidak mengklaim dokumen resmi yang belum disahkan sekolah.

## Tahap 5 — Produk dan monetisasi
- [ ] Basic: fitur inti lokal, template standar, ekspor dasar.
- [ ] Pro: kuota AI yang jelas, template premium, backup/sinkronisasi cloud, dan laporan lanjutan.
- [ ] Admin billing, status langganan, pembatasan fitur di server, faktur, pembatalan, dan dukungan.
- [ ] Hitung biaya model, penyimpanan, bandwidth, pajak, dan dukungan sebelum menetapkan harga.
- [ ] Jangan mengandalkan pembatasan UI saja untuk mengamankan fitur berbayar.

## Definisi siap rilis
1. Tidak ada error JavaScript pada alur inti.
2. Semua formulir divalidasi dan aksi berisiko dapat dibatalkan atau dipulihkan.
3. Uji akses memastikan akun tidak dapat membaca data sekolah lain.
4. Backup dan pemulihan diuji, bukan hanya didokumentasikan.
5. AI gagal secara aman saat kuota/API bermasalah, dan tidak mengubah nilai/absensi secara otomatis.
6. Status deployment dan pengujian browser diverifikasi sebelum dinyatakan siap.

## Status saat ini
Studio AI hanya menyusun prompt di browser dan membuka Gemini untuk penggunaan manual. Belum ada panggilan Gemini API, autentikasi, database cloud, sinkronisasi, billing, atau PDF server-side.
