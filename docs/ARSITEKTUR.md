# Arsitektur Awal RuangKelas

## Kondisi saat ini
- Front-end HTML/CSS/JavaScript statis pada GitHub Pages.
- Data aplikasi disimpan di localStorage per browser/perangkat.
- Studio AI Guru menyusun prompt secara lokal. Tidak ada panggilan model atau upload prompt otomatis ke server.
- Catatan pembinaan tanpa sistem poin.
- Belum ada login, database cloud, sinkronisasi lintas perangkat, atau billing.

## Target arsitektur (belum diterapkan)
1. Front-end statis dengan modul per fitur.
2. Firebase Authentication untuk identitas pengguna.
3. Cloud Firestore sebagai database.
4. Cloud Functions sebagai lapisan server untuk operasi yang perlu validasi dan pemanggilan Gemini.
5. Gemini API key disimpan di secret manager server; jangan pernah dikirim ke browser.
6. Aturan keamanan membatasi akses ke schoolId yang diikuti pengguna, dan memeriksa peran pada setiap operasi.
7. Audit log untuk perubahan data penting, backup dan prosedur pemulihan.
8. Kuota AI per pengguna/sekolah dan batas biaya di sisi server.

## Entitas data yang disarankan
- schools: nama, alamat, logo, konfigurasi periode, kebijakan retensi.
- users: identitas autentikasi dan profil minimal.
- memberships: userId, schoolId, role, status.
- students: schoolId, classId, identitas minimum yang benar-benar diperlukan, status aktif/arsip.
- attendance: schoolId, studentId, date, status, note, updatedBy, updatedAt.
- grade_records: schoolId, studentId, subjectId, score, rubricVersion, updatedBy, updatedAt.
- incidents: schoolId, studentId, date, category, factualDescription, reflection, actionPlan, followUpDate, status, updatedBy.
- curriculum_sets: schoolId atau scope global, curriculumName, phase, grade, academicYear, sourceVersion, sourceUrl, reviewedAt.
- curriculum_subjects: curriculumSetId, subjectCode, subjectName, phase, cpText, sourceType (official-summary/teacher-provided), reviewedBy.
- curriculum_elements: subjectId, elementName, cpDescription, sourceReference.
- curriculum_chapters: subjectId, chapterCode, chapterTitle, description, orderIndex, materialSource.
- learning_objectives: chapterId, objectiveCode, objectiveText, objectiveType (TP/ATP), orderIndex, reviewStatus.
- learning_materials: chapterId, materialTitle, orderIndex.
- generated_documents: schoolId, ownerId, type, promptVersion, curriculumReferences, content, createdAt, reviewedAt.
- audit_logs: schoolId, actorId, action, entityType, entityId, timestamp.

Gunakan ID acak, validasi input, minimalkan data pribadi, dan hindari menyimpan informasi sensitif yang tidak dibutuhkan. Data siswa jangan dipakai sebagai konteks Gemini secara default; gunakan contoh anonim atau agregat.

## Alur permintaan AI
1. Front-end mengirim jenis dokumen, topik, jenjang, dan tujuan pembelajaran.
2. Server memvalidasi identitas, peran, kuota, panjang input, dan menghapus data pribadi yang tidak perlu.
3. Server memanggil Gemini memakai secret yang dikelola server.
4. Server memvalidasi bentuk output dan menangani error/limit.
5. Hasil dikirim sebagai draf; guru meninjau dan mengedit sebelum menyimpan.
6. Simpan metadata penggunaan agar biaya dan kuota bisa diaudit.

## Persyaratan keamanan minimum
- Default-deny security rules; uji aturan dengan emulator atau test suite sebelum rilis.
- Jangan menaruh API key, service-account JSON, atau token admin di repo/front-end.
- Jangan menganggap URL tersembunyi sebagai autentikasi.
- Terapkan batas permintaan, kuota, pencatatan error tanpa data sensitif, dan proteksi biaya.
- Siapkan backup, retensi, ekspor, penghapusan, dan pemulihan.
- Pisahkan data tiap sekolah; uji skenario akses silang secara eksplisit.


## Modul CP & TP (fondasi awal)
- Front-end awal menampilkan data Kelas VI/Fase C untuk Bahasa Indonesia, Matematika, Pendidikan Pancasila, dan Seni Rupa.
- Ringkasan CP acuan merujuk Kepka BSKAP 046/H/KR/2025; materi bab dan tujuan berasal dari materi yang disediakan guru. Keduanya ditandai terpisah agar data buku/ATP lokal tidak salah diklaim sebagai kutipan resmi.
- Dataset acuan saat ini berupa file statis `assets/kurikulum-kelas6.js`. TP tambahan dan pemetaan elemen CP dapat dikelola di browser melalui `localStorage` dengan kunci `ruangkelas-curriculum-local-v1`.
- Modul lokal mendukung tambah/hapus TP, pemetaan elemen CP, ekspor CSV, ekspor JSON dan pemulihan JSON yang divalidasi terhadap mapel/bab dataset saat ini. Konteks TP bawaan/lokal beserta status pemetaannya diteruskan ke Studio AI saat guru memilih Gunakan di Studio AI.
- Perubahan lokal belum mempunyai versioning, sinkronisasi lintas perangkat, akun, atau database cloud.
- Sebelum data ini menjadi basis produksi, perlu validasi guru terhadap ATP/KOSP, penambahan metadata sumber/versi, dan pengujian pemetaan setiap tujuan ke elemen CP yang relevan.
- Arsitektur cloud nantinya perlu memisahkan data kurikulum acuan bersama dari ATP/penyesuaian milik sekolah, dengan status verifikasi dan riwayat perubahan.


## Ekosistem data terpadu — target desain
Semua modul menggunakan identitas dan referensi yang konsisten. Ini target skema; belum berarti database cloud telah aktif.

### Master dan referensi
- school_profiles: schoolId, identitas sekolah, alamat, logo, kepala sekolah, konfigurasi dokumen.
- academic_periods: periodId, schoolId, academicYear, semester, startDate, endDate, status.
- classes: classId, schoolId, gradeLevel, phase, className, academicPeriodId, homeroomTeacherId.
- students: studentId stabil, schoolId, identitas minimum, status aktif/arsip, enrollment history.
- subjects: subjectId, schoolId/scope, subjectName, phase, gradeLevel.
- curriculum_sets / learning_objectives: versi CP/TP dan metadata sumber/verifikasi.

### Alur pembelajaran dan bukti
- lesson_plans: planId, periodId, classId, subjectId, curriculumReferences, objectives, activities, assessmentPlan, status.
- teaching_journals: journalId, lessonPlanId, date, implementationNotes, reflection.
- assessments: assessmentId, planId, subjectId, objectiveIds, type, rubricVersion, assessmentDate.
- assessment_results: resultId, assessmentId, studentId, score, evidenceReference, reviewedBy, reviewedAt.
- attendance: attendanceId, studentId, classId, periodId, date, status, source.
- student_support_notes: noteId, studentId, date, factualObservation, teacherAction, followUp, visibility, status.

### E-Rapor mandiri tetapi terhubung
- report_cards: reportId, studentId, classId, periodId, templateVersion, status (draft/reviewed/locked), generatedAt, lockedAt.
- report_subjects: reportSubjectId, reportId, subjectId, scoreSummary, achievementDescription, evidenceRefs.
- report_attendance: reportId, presentCount, sickCount, permissionCount, absentCount, sourceRefs.
- report_extracurricular: reportId, activity, achievement, description, verifiedBy.
- report_notes: reportId, homeroomNote, verifiedBy.
- report_signatures: reportId, signerRole, signerName, signedAt, signatureMethod.
- report_snapshots: immutable snapshot payload and checksum/version for each finalized report.

### Aturan integritas
1. Gunakan ID stabil; nama siswa bukan kunci relasi.
2. Semua catatan dan nilai terikat pada periode akademik dan kelas saat kejadian.
3. Kenaikan kelas mengubah enrollment aktif, bukan memindahkan atau menulis ulang arsip periode lama.
4. Rapor yang dikunci menjadi snapshot; koreksi dibuat sebagai revisi dengan jejak audit.
5. Deskripsi capaian harus memiliki referensi bukti/asesmen dan dapat diedit guru; tanpa bukti, sistem meminta tinjauan, bukan mengarang.
6. Impor data selalu melalui staging, preview, validasi, dan konfirmasi; sediakan ekspor serta rollback.
7. Batasi akses catatan pembinaan; jangan otomatis menampilkan catatan privat ke rapor.
8. Untuk data cloud: tenant isolation, default-deny, role-based access, audit log, backup, retensi, dan uji akses silang wajib.
9. Saat mode lokal, tandai data sebagai lokal dan sediakan backup yang dapat dipulihkan; jangan mengklaim sinkronisasi.

### Pusat kesiapan dokumen guru
Dashboard kelengkapan menggabungkan status perangkat ajar, jurnal, asesmen, absensi, nilai, rapor, dan dokumen supervisi. Setiap item menunjuk ke sumber data aslinya dan menampilkan periode serta status verifikasi. Checklist membantu guru memeriksa permintaan administrasi sewaktu-waktu tanpa menganggap semua dokumen sudah lengkap.

---

## Audit arsitektur dan kontrak integrasi (2026-11-04)

### Keputusan produk
RuangKelas adalah **workspace pribadi guru pada tahap sekarang**, dengan fondasi yang disiapkan untuk menjadi **platform multi-sekolah**. Semua modul tetap dipertahankan. Pengembangan dilakukan bertahap tanpa memaksa aktivasi login/cloud sebelum model data, backup, dan kontrol akses siap.

### Peta implementasi nyata
| Area | Kondisi kode saat audit | Sumber/penyimpanan |
|---|---|---|
| Dashboard dan navigasi | Ada | `index.html`, `assets/app.js` |
| Perangkat Ajar, Penilaian, Pusat Materi | Katalog kerja lokal; sebagian berupa item/template, bukan editor dokumen penuh | store aplikasi |
| Data Kelas, Absensi & Siswa | CRUD siswa, arsip/kenaikan kelas, absensi dan rekap dasar | `ruangkelas-data-v1` |
| Jurnal Mengajar | Pencatatan jurnal lokal | `ruangkelas-data-v1` |
| Catatan Siswa & Pembinaan | Catatan faktual, tindak lanjut, status, riwayat; tidak otomatis menjadi rapor | `ruangkelas-data-v1` |
| CP & TP | Dataset awal kelas VI/Fase C; TP tambahan dan pemetaan tersimpan lokal | `assets/kurikulum-kelas6.js`, `ruangkelas-curriculum-local-v1` |
| Studio AI Guru | Pembuat prompt lokal; layanan AI dibuka terpisah oleh guru | browser; belum ada API |
| Pengolahan Nilai | Rekaman nilai dasar terikat periode; ekspor CSV | `ruangkelas-data-v1` |
| E-Rapor | Draf per siswa, catatan wali kelas, snapshot terkunci, impor CSV dengan preview dan proteksi duplikat; belum rapor final lengkap | `ruangkelas-data-v1` |
| Pengembangan Profesi | Portofolio dan referensi | konten statis |
| Laboratorium Media | Dua aktivitas interaktif; skor terpisah | `ruangkelas-lab-score-v1` |
| Pusat Data Terpadu | Ringkasan workspace lokal dan jembatan kompatibilitas; bukan database terpisah/cloud | `ruangkelas-data-v1` |
| Pusat Kesiapan Dokumen Guru | Target desain; belum menjadi modul operasional mandiri | belum ada |

### Kontrak data lokal yang wajib dipertahankan
- `ruangkelas-data-v1` adalah store utama aplikasi saat ini. Perubahan skema harus bersifat additive dan memiliki default untuk data lama.
- Properti lama seperti `students[].id`, `students[].studentKey`, `classInfo`, `settings`, `gradeRecords`, `reportCards`, `incidents`, dan `journals` tidak boleh diganti nama atau dibuang tanpa migrasi eksplisit.
- `studentKey` adalah identitas stabil tambahan; jangan mengganti relasi lama berbasis `studentId` dalam satu langkah.
- `workspace` adalah lapisan master lokal yang diselaraskan oleh `syncWorkspaceMaster()`; saat ini `schoolId`, `teacherId`, dan `academicPeriodId` masih identitas lokal sederhana, bukan identitas akun/tenant cloud.
- CP/TP dan skor Laboratorium Media mempunyai key localStorage terpisah. Jangan menganggap backup store utama otomatis mencakup keduanya.
- Data lama pada nilai yang belum memiliki `periodId` dipertahankan, tetapi tidak otomatis dimasukkan ke E-Rapor periode aktif.
- Snapshot rapor terkunci tidak boleh ikut berubah saat nilai sumber berubah. Catatan pembinaan privat tidak boleh disalin ke rapor.

### Aturan perubahan yang aman
1. Audit pemakaian key dan bentuk data sebelum mengubah fungsi penyimpanan.
2. Jangan menghapus, menimpa, atau menggabungkan data lokal saat aplikasi dibuka.
3. Migrasi harus idempotent: aman dijalankan lebih dari sekali, membuat backup sebelum transformasi, dan mempertahankan properti yang tidak dikenal.
4. Impor harus melalui file → pemetaan → preview → validasi → konfirmasi; default-nya tidak menimpa rekaman yang sudah ada.
5. Gunakan ID stabil untuk relasi baru; nama siswa hanya untuk tampilan/pencarian, bukan primary key.
6. Pisahkan data privat pembinaan, data pembelajaran, bukti penilaian, dan keluaran rapor.
7. Setiap modul boleh memiliki UI dan fungsi sendiri, tetapi membaca referensi master yang sama melalui fungsi layanan bersama.
8. Jangan mengaktifkan cloud/login sampai skema tenant, aturan akses, backup, pemulihan, dan migrasi lokal diuji.

### Temuan audit dan pekerjaan berikutnya
- README sebelumnya belum mencerminkan E-Rapor tahap awal dan beberapa modul yang telah ditambahkan.
- Roadmap memiliki status impor CSV yang saling bertentangan; CSV sudah tersedia, sedangkan XLSX langsung belum.
- Pusat Data Terpadu adalah lapisan ringkasan/kompatibilitas lokal, bukan bukti sinkronisasi lintas perangkat.
- Katalog Perangkat Ajar, Penilaian, dan Pusat Materi belum boleh dipasarkan sebagai editor dokumen lengkap.
- E-Rapor belum memiliki bobot asesmen fleksibel, narasi capaian berbasis bukti CP/TP, revisi snapshot/audit trail, ekstrakurikuler/prestasi, dan cetak individual final.
- Belum ada bukti uji browser end-to-end atau verifikasi deployment pada audit ini.

Urutan kerja yang aman: (1) backup/restore dan validasi skema lokal, (2) satukan layanan master profile/period/student tanpa menghapus kompatibilitas, (3) rapikan aliran data jurnal–asesmen–nilai–E-Rapor, (4) bangun Pusat Kesiapan Dokumen, (5) uji browser desktop/ponsel, baru (6) rancang backend multi-sekolah.


## Implementasi jembatan data bersama (2026-11-04)

File `assets/app.js` kini menyediakan API baca-saja `window.RuangKelasData` sebagai kontrak awal antarmodul. API ini bersifat aditif dan tidak mengganti `ruangkelas-data-v1` maupun struktur data lama.

- `getSnapshot()`: profil workspace, ID periode aktif, dan daftar siswa.
- `getStudents({ includeArchived: true })`: daftar siswa; secara default hanya siswa aktif.
- `getStudent(idOrKey)`: mencari siswa menggunakan ID lama atau `studentKey`.
- `getActivePeriod()`: identitas periode aktif.
- `getCurriculum()`: dataset CP/TP yang dimuat pada halaman.
- `subscribe(callback)`: mendengarkan event `ruangkelas:data-changed`; fungsi hasil pemanggilan dapat digunakan untuk berhenti berlangganan.

Event perubahan hanya mengirim metadata ringkas (ID periode dan jumlah siswa), bukan seluruh data pribadi. API mengembalikan salinan data untuk mencegah modul lain mengubah state utama tanpa melalui alur penyimpanan aplikasi. Pemanggil harus membaca ulang data melalui API setelah menerima event.

Ekspor rekap Penilaian juga sudah diselaraskan dengan periode aktif, sama seperti tampilan nilai dan E-Rapor. Nilai lintas semester/tahun ajaran tidak boleh tercampur dalam satu ekspor periode.

Status: kontrak baca dan notifikasi perubahan tersedia; integrasi konsumen antarmodul tetap harus dilakukan dan diuji per modul.

## Relasi siswa dan jurnal pembelajaran (2026-11-04)

Data siswa baru dari formulir, input massal, dan impor CSV kini langsung memperoleh `studentKey` stabil dengan pola kompatibel `stu-<id>`. Data lama tetap dipertahankan; proses pemuatan aplikasi sebelumnya juga mengisi `studentKey` yang belum tersedia.

Catatan Pembinaan menyimpan `studentKey` bersama `studentId` lama. Tautan riwayat siswa dapat dicari melalui kunci stabil maupun ID lama, sehingga catatan lama tetap terbaca dan perubahan nama tidak memutus relasi.

Jurnal Mengajar baru menyimpan metadata konteks saat dibuat atau diedit: `periodId`, tahun ajaran, semester, sekolah, kelas, guru, `schoolId`, dan `teacherId`. Jurnal lama tidak dipaksa diberi periode secara massal karena tanggal/periode historisnya belum diverifikasi. Jurnal tetap dapat dibuka dan diedit; saat disimpan ulang, metadata periode aktif akan dicatat.

Batas integrasi saat ini: jurnal masih merupakan catatan pembelajaran tingkat kelas, belum menjadi bukti capaian individual siswa. Pengaitan jurnal ke bukti belajar per siswa memerlukan alur pemilihan siswa dan validasi guru sebelum dapat memberi kontribusi ke Penilaian atau E-Rapor.