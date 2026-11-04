# Peta Ekosistem RuangKelas

Dokumen acuan integrasi seluruh fitur agar RuangKelas menjadi pegangan kerja guru dari persiapan pembelajaran sampai pelaporan. Dokumen ini adalah rancangan pengembangan, bukan pernyataan bahwa semua modul telah aktif.

## 1. Alur kerja terpadu

```text
Profil Sekolah + Tahun Ajaran + Semester + Kelas + Master Siswa
                         |
CP/TP + Kurikulum ------> Perangkat Ajar (RPP/Modul, ATP, Prota/Promes)
                         |
                         +--> LKPD / Bahan Ajar / Media / Bank Materi
                         |
                         +--> Jurnal Mengajar dan Refleksi
                         |
                         +--> Asesmen / Bank Soal / Kisi-kisi / Rubrik
                                      |
                                      v
                              Bukti dan Hasil Nilai
                                      |
Absensi + Catatan Wali Kelas ------> Pengolahan Nilai
                                      |
                                      v
                                  E-RAPOR
                                      |
                     Pratinjau -> Verifikasi -> Pengesahan
                                      |
                         Snapshot Semester + Arsip PDF
                                      |
                                      v
                         Pusat Kesiapan Dokumen Guru
```

## 2. Modul produk

| Modul | Fungsi | Terhubung ke |
|---|---|---|
| Profil & Kalender Akademik | Identitas sekolah/guru, tahun ajaran, semester, kelas | Semua modul dan dokumen |
| Master Siswa | Satu identitas siswa, status aktif/arsip, riwayat kelas | Absensi, pembinaan, nilai, rapor |
| CP & TP | Referensi kurikulum dan tujuan | Perangkat, LKPD, asesmen, rapor |
| Perangkat Ajar | RPP, Modul Ajar, ATP, Prota, Promes | CP/TP, jurnal, asesmen |
| Pusat Materi | LKPD, bahan ajar, media, referensi | Perangkat dan asesmen |
| Studio AI Guru | Draf terarah yang ditinjau guru | Perangkat, asesmen, LKPD, deskripsi rapor |
| Jurnal Mengajar | Pelaksanaan dan refleksi | Perangkat dan bukti pembelajaran |
| Penilaian & Bank Soal | Kisi-kisi, soal, rubrik, hasil asesmen | CP/TP, nilai, E-Rapor |
| Absensi | Kehadiran berdasarkan tanggal dan kelas | Master siswa, rekap rapor |
| Catatan & Pembinaan | Observasi faktual dan tindak lanjut | Riwayat siswa; akses terbatas |
| Pengolahan Nilai | Rekap komponen dan capaian | Bukti asesmen, E-Rapor |
| E-Rapor | Laporan individual per semester | Master siswa, mapel, nilai, absensi |
| Pusat Kesiapan Dokumen | Checklist dan pencarian dokumen yang diminta | Semua modul |
| Pengembangan Profesi & Laboratorium Media | Portofolio dan aktivitas pengembangan guru | Berdiri sebagai ruang pendukung |

## 3. Aturan agar guru tidak keliru saat diminta dokumen

Setiap dokumen yang dihasilkan harus menampilkan:
- nama dokumen dan jenisnya;
- nama sekolah, kelas, mata pelajaran, tahun ajaran, dan semester yang relevan;
- tanggal dibuat/diperbarui dan sumber data;
- status: draf, perlu diperiksa, diverifikasi, disahkan, atau arsip;
- penanda data contoh/lokal jika bukan data produksi;
- peringatan bila kolom wajib belum lengkap atau sumber belum diverifikasi.

Checklist pemeriksaan sebelum menyerahkan dokumen:
1. Identitas sekolah, guru, kelas, dan periode benar.
2. Versi kurikulum, CP/TP, dan ATP/KOSP sesuai dokumen sekolah.
3. Tujuan, kegiatan, dan asesmen saling selaras.
4. Nilai berasal dari bukti yang benar dan sudah diperiksa.
5. Absensi memakai periode yang tepat.
6. Deskripsi rapor faktual, tidak mengarang, dan telah disunting guru.
7. Catatan privat pembinaan tidak otomatis muncul pada rapor.
8. Dokumen sudah diperiksa tata letak, tanggal, dan tanda tangan/pengesahan.
9. Arsip final tersimpan dan dapat dipulihkan.

## 4. E-Rapor sebagai modul mandiri

E-Rapor memiliki navigasi, halaman kerja, konfigurasi, pratinjau, dan cetak sendiri. Namun tidak memiliki master siswa atau master nilai duplikat. Ia membaca data melalui ID yang sama dan menyimpan snapshot hasil final.

Fitur target:
- konfigurasi identitas sekolah, periode, kelas, mapel, wali kelas, dan penandatangan;
- komponen/bobot penilaian yang dapat dikonfigurasi sesuai kebijakan sekolah;
- input manual dan impor XLSX/CSV dengan pemetaan kolom, preview, validasi, duplikasi, dan konfirmasi;
- ringkasan capaian per mapel/tujuan dan deskripsi berbasis bukti;
- rekap kehadiran, ekstrakurikuler, prestasi, dan catatan wali kelas;
- pratinjau per siswa, cetak individual, cetak satu kelas, dan ekspor PDF;
- status draf → diperiksa → disahkan/dikunci;
- snapshot final dan revisi dengan riwayat perubahan;
- backup/restore dan ekspor data yang dapat dibaca kembali.

Format dan rumus nilai tidak boleh diasumsikan seragam nasional. Pengaturan harus dapat disesuaikan dengan kurikulum, kebijakan, dan format rapor sekolah. Sistem tidak boleh mengklaim dokumen resmi tanpa verifikasi dan pengesahan sekolah.

## 5. Sumber data tunggal

Gunakan ID stabil untuk school, academicPeriod, class, student, subject, learningObjective, assessment, dan report. Jangan menggunakan nama sebagai kunci relasi. Perubahan nama, kenaikan kelas, atau perubahan rombel tidak boleh merusak relasi histori.

Semua input impor melewati staging: file → pemetaan kolom → preview → validasi → konfirmasi → catat hasil. Tidak boleh menimpa seluruh data tanpa pratinjau dan backup.

## Implementasi integrasi awal (2026-11)

- Navigasi dan halaman **Pusat Data Terpadu** sudah ditambahkan ke aplikasi.
- Fondasi `workspace` menyimpan profil acuan, identitas periode akademik, dan versi skema.
- Data siswa lama diberi `studentKey` stabil saat disimpan, tanpa mengganti ID lama atau menghapus riwayat.
- Ringkasan pusat data membaca langsung daftar siswa, absensi, jurnal, dan rekaman nilai dari store aplikasi yang sama.
- Formulir profil dan identitas kelas diselaraskan melalui jembatan kompatibilitas agar modul lama tetap berjalan.
- Ini merupakan integrasi lokal satu browser. Belum ada sinkronisasi cloud, konflik multi-perangkat, autentikasi, atau pembagian akses pengguna.

## 6. Status implementasi saat ini

- Front-end HTML/CSS/JavaScript statis.
- Sebagian data siswa, absensi, nilai, pembinaan, jurnal, dan CP/TP disimpan di localStorage.
- Studio AI baru menyusun prompt lokal; tidak ada API AI aktif.
- Belum ada database cloud, login, atau sinkronisasi lintas perangkat. E-Rapor tahap awal sudah tersedia; fitur rapor final dan revisi arsip masih dalam pengembangan.
- Jangan masukkan data siswa nyata ke demo publik. Uji fitur dengan data sintetis sampai keamanan dan backup tervalidasi.

## 7. Tahap implementasi yang disarankan

1. Satukan kontrak data dan profil periode; buat ID stabil tanpa menghapus data lama.
2. Bangun E-Rapor mandiri menggunakan data lokal yang sudah ada, dengan impor/ekspor dan pratinjau.
3. Hubungkan sumber nilai dan absensi, lalu buat snapshot rapor per semester.
4. Tambahkan pusat kesiapan dokumen dan checklist administrasi.
5. Uji migrasi, arsip, kenaikan kelas, pemulihan, dan cetak dengan data sintetis.
6. Baru rancang backend, login, dan sinkronisasi dengan aturan akses serta backup yang diuji.

## 8. Prinsip hak cipta dan sumber

Referensi eksternal boleh dipelajari sesuai izin dan lisensi yang berlaku. Catat nama proyek, URL, pemilik, lisensi, bagian yang digunakan, perubahan, dan atribusi. Jangan memasukkan dataset siswa, dokumen, gambar, atau aset pihak lain tanpa hak penggunaan yang jelas.


## Implementasi E-Rapor awal (2026-11)

- Halaman E-Rapor berdiri sendiri pada navigasi RuangKelas.
- Draf per siswa menyalin identitas, periode, nilai yang sudah terikat periode, dan rekap kehadiran.
- Catatan wali kelas pada draf dapat diedit; catatan pembinaan privat tidak diambil.
- Snapshot dapat dikunci per siswa dan periode agar tidak ikut berubah ketika nilai sumber diedit.
- Nilai lama yang belum memiliki penanda periode tidak dimasukkan otomatis. Guru perlu memeriksa dan menyimpan ulang nilai pada periode yang benar.
- Pengolahan nilai kini memisahkan rekaman berdasarkan periode aktif.
- Cetak daftar rapor tersedia melalui dialog cetak browser. Format ini masih kerangka awal, bukan pengganti format rapor resmi sekolah.
- Belum tersedia revisi snapshot terkunci, impor XLSX langsung, komponen bobot fleksibel, deskripsi capaian berbasis CP/TP, serta cetak PDF individual final.


### Impor nilai E-Rapor (tahap awal)
- E-Rapor kini menyediakan impor nilai berbasis CSV dengan pemetaan kolom nama siswa/NISN, mata pelajaran, dan nilai.
- Sistem menampilkan pratinjau, jumlah baris siap impor, dan baris yang dilewati sebelum konfirmasi.
- Pencocokan siswa menggunakan nama atau kode/NISN yang sama persis; nilai harus 0–100.
- Rekaman nilai yang sudah ada pada siswa, mapel, dan periode yang sama tidak ditimpa. Baris duplikat/invalid dilewati.
- XLSX langsung, pemetaan nilai berbobot, dan uji browser masih menjadi pekerjaan berikutnya. Untuk file Excel, simpan/ekspor dahulu sebagai CSV UTF-8.
- Data tetap tersimpan lokal di browser; lakukan cadangan data sebelum impor besar.


## Pembaruan status audit (2026-11-04)
- E-Rapor tahap awal telah memiliki impor CSV dengan pemetaan kolom, pratinjau, validasi dasar, pencocokan nama/kode siswa, dan perlindungan dari overwrite. Impor XLSX langsung belum tersedia.
- Pusat Data Terpadu membaca data lokal dari store aplikasi dan menjadi ringkasan/kompatibilitas; belum menjadi layanan database atau sinkronisasi cloud.
- Semua modul yang telah ada dipertahankan. Modul katalog seperti Perangkat Ajar, Penilaian, dan Pusat Materi belum seluruhnya berupa editor dokumen lengkap.
- Status implementasi, kontrak localStorage, dan aturan migrasi aman yang lebih rinci mengikuti [ARSITEKTUR.md](ARSITEKTUR.md).
