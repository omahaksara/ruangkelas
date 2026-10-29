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
- Modul lokal mendukung tambah/hapus TP, pemetaan elemen CP, ekspor CSV, ekspor JSON dan pemulihan JSON yang divalidasi terhadap mapel/bab dataset saat ini.
- Perubahan lokal belum mempunyai versioning, sinkronisasi lintas perangkat, akun, atau database cloud.
- Sebelum data ini menjadi basis produksi, perlu validasi guru terhadap ATP/KOSP, penambahan metadata sumber/versi, dan pengujian pemetaan setiap tujuan ke elemen CP yang relevan.
- Arsitektur cloud nantinya perlu memisahkan data kurikulum acuan bersama dari ATP/penyesuaian milik sekolah, dengan status verifikasi dan riwayat perubahan.
