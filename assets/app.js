(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const defaults = {
    ajar: [
      {id:1,name:"Modul Ajar",category:"Perencanaan",description:"Kerangka tujuan, langkah pembelajaran, dan refleksi.",icon:"▤"},
      {id:2,name:"Rencana Pelaksanaan Pembelajaran",category:"Perencanaan",description:"Rencana kegiatan belajar yang dapat disesuaikan.",icon:"▤"},
      {id:3,name:"Alur Tujuan Pembelajaran",category:"Perencanaan",description:"Pemetaan alur tujuan pembelajaran.",icon:"⌁"},
      {id:4,name:"Program Tahunan",category:"Semester",description:"Rencana pembelajaran selama satu tahun.",icon:"▦"},
      {id:5,name:"Program Semester",category:"Semester",description:"Pembagian program belajar per semester.",icon:"▦"},
      {id:6,name:"Jurnal Mengajar",category:"Perencanaan",description:"Catatan proses dan refleksi pembelajaran.",icon:"✎"}
    ],
    assessments: [
      {id:11,name:"Kisi-kisi Penilaian",category:"Evaluasi",description:"Pemetaan tujuan, indikator, dan bentuk soal.",icon:"✓"},
      {id:12,name:"Bank Soal",category:"Evaluasi",description:"Kumpulan soal yang siap disusun kembali.",icon:"▤"},
      {id:13,name:"Rubrik Penilaian",category:"Evaluasi",description:"Kriteria penilaian yang transparan.",icon:"☷"},
      {id:14,name:"Asesmen Diagnostik",category:"Evaluasi",description:"Contoh pemetaan kebutuhan awal belajar.",icon:"◎"}
    ],
    materials: [
      {id:21,name:"LKPD Pembelajaran",category:"LKPD",description:"Lembar kerja peserta didik untuk dikembangkan.",icon:"▣"},
      {id:22,name:"Bahan Ajar",category:"Bahan ajar",description:"Ringkasan materi dan penjelasan konsep.",icon:"▣"},
      {id:23,name:"Referensi Guru",category:"Referensi",description:"Daftar sumber untuk persiapan pembelajaran.",icon:"⌕"},
      {id:24,name:"Template Presentasi",category:"Template",description:"Kerangka presentasi untuk materi kelas.",icon:"▧"},
      {id:25,name:"Lembar Refleksi",category:"LKPD",description:"Panduan refleksi setelah kegiatan belajar.",icon:"✎"},
      {id:26,name:"Glosarium",category:"Referensi",description:"Daftar istilah penting dalam pembelajaran.",icon:"A"},
      {id:27,name:"Media Pembelajaran",category:"Bahan ajar",description:"Catatan media yang digunakan saat mengajar.",icon:"▧"},
      {id:28,name:"Template Evaluasi",category:"Template",description:"Format evaluasi yang dapat disesuaikan.",icon:"✓"}
    ],
    schedules: [
      {id:31,name:"Persiapan materi",day:"Senin",kind:"Perencanaan",status:"Direncanakan"},
      {id:32,name:"Kegiatan pembelajaran",day:"Selasa",kind:"Pembelajaran",status:"Contoh"},
      {id:33,name:"Penyusunan asesmen",day:"Rabu",kind:"Penilaian",status:"Direncanakan"},
      {id:34,name:"Refleksi kelas",day:"Kamis",kind:"Refleksi",status:"Contoh"},
      {id:35,name:"Tinjau materi pekan",day:"Jumat",kind:"Evaluasi",status:"Direncanakan"}
    ],
    notes: [
      {id:41,name:"Ide pembelajaran",description:"Simpan ide aktivitas yang ingin dicoba."},
      {id:42,name:"Tindak lanjut",description:"Catat hal yang perlu ditinjau kembali."}
    ],
    grades: [
      {name:"Siswa Contoh 01",raw:92},{name:"Siswa Contoh 02",raw:84},{name:"Siswa Contoh 03",raw:78},{name:"Siswa Contoh 04",raw:68},{name:"Siswa Contoh 05",raw:95}
    ],
    students:[],
    incidents:[],
    gradeRecords:[],
    classInfo:{schoolName:"SD INPRES 2 TINOMBALA",teacherName:"Ridwan",principalName:"Zainudin",className:"VI",semester:"1",academicYear:"2026/2027"},
    lastPromotionYear:"",
    supervision:[false,false,false,false,false,false],
    tasks:[false,false,false,false],
    settings:{teacherName:"Guru",schoolName:"",curriculum:"Kurikulum Merdeka",academicYear:"2026/2027"}
  };
  let data = clone(defaults);
  let currentDialogType = "ajar";
  let toastHandle;
  try { const saved = localStorage.getItem("ruangkelas-data-v1"); if(saved) { const parsed=JSON.parse(saved); data = Object.assign(clone(defaults), parsed); data.classInfo=Object.assign(clone(defaults.classInfo),parsed.classInfo||{}); data.students=Array.isArray(parsed.students)?parsed.students:[]; data.incidents=Array.isArray(parsed.incidents)?parsed.incidents:[]; data.gradeRecords=Array.isArray(parsed.gradeRecords)?parsed.gradeRecords:[]; data.students.forEach(s=>{if(!s.classLevel)s.classLevel="6";if(typeof s.archived!=="boolean")s.archived=false;}); } } catch(e) {}
  function save(){ try{localStorage.setItem("ruangkelas-data-v1",JSON.stringify(data));}catch(e){} }
  function escapeHtml(value){return String(value == null ? "" : value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
  function showToast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastHandle);toastHandle=setTimeout(()=>el.classList.remove("show"),2600);}
  function route(page){const target=$("#page-"+page);if(!target)return;$$(".page").forEach(el=>el.classList.toggle("active",el===target));$$(".nav-link").forEach(el=>el.classList.toggle("active",el.dataset.page===page));$("#crumbCurrent").textContent=target.dataset.title||"Workspace";if(page!=="beranda")location.hash=page;else history.replaceState(null,"",location.pathname+location.search);$("#sidebar").classList.remove("open");}
  function card(item,kind){return '<article class="resource-card"><div class="resource-card-top"><span class="resource-icon">'+escapeHtml(item.icon||"▤")+'</span><span class="resource-category">'+escapeHtml(item.category||"Catatan")+'</span></div><h3>'+escapeHtml(item.name)+'</h3><p>'+escapeHtml(item.description||"Item workspace yang bisa disesuaikan.")+'</p><div class="resource-actions"><button data-open-item="'+item.id+'" data-kind="'+kind+'">Lihat detail ↗</button><button class="delete-item" data-delete-item="'+item.id+'" data-kind="'+kind+'" aria-label="Hapus '+escapeHtml(item.name)+'">Hapus</button></div></article>';}
  function renderAjar(){const q=$("#ajarSearch").value.toLowerCase();const f=$("#ajarFilter").value;const list=data.ajar.filter(x=>(!f||x.category===f)&&(x.name+" "+x.description+" "+x.category).toLowerCase().includes(q));$("#ajarGrid").innerHTML=list.map(x=>card(x,"ajarGrid")).join("")||'<div class="empty-state">Belum ada perangkat yang cocok.</div>';}
  function renderAssessments(){const q=$("#assessmentSearch").value.toLowerCase();const list=data.assessments.filter(x=>(x.name+" "+x.description+" "+x.category).toLowerCase().includes(q));$("#assessmentGrid").innerHTML=list.map(x=>card(x,"assessmentGrid")).join("")||'<div class="empty-state">Belum ada perangkat penilaian yang cocok.</div>';}
  function renderMaterials(){const q=$("#materialSearch").value.toLowerCase();const f=$("#materialFilter").value;const list=data.materials.filter(x=>(!f||x.category===f)&&(x.name+" "+x.description+" "+x.category).toLowerCase().includes(q));$("#materialGrid").innerHTML=list.map(x=>card(x,"materialGrid")).join("")||'<div class="empty-state">Belum ada materi yang cocok.</div>';}
  function renderSchedule(){const q=$("#scheduleSearch").value.toLowerCase();const list=data.schedules.filter(x=>(x.name+" "+x.day+" "+x.kind+" "+x.status).toLowerCase().includes(q));$("#scheduleBody").innerHTML=list.map(x=>'<tr><td>'+escapeHtml(x.name)+'</td><td>'+escapeHtml(x.day)+'</td><td>'+escapeHtml(x.kind)+'</td><td><span class="status-pill">'+escapeHtml(x.status)+'</span></td><td><button class="table-action" data-delete-schedule="'+x.id+'">Hapus</button></td></tr>').join("")||'<tr><td colspan="5">Tidak ada agenda yang cocok.</td></tr>';}
  function renderNotes(){$("#classNotes").innerHTML=data.notes.map(x=>'<article class="note-card"><strong>'+escapeHtml(x.name)+'</strong><p>'+escapeHtml(x.description||"")+'</p></article>').join("")||'<div class="empty-state">Belum ada catatan kelas.</div>';$("#classNoteCount").textContent=data.notes.length+" catatan";}
  function clamp(n,min,max){return Math.min(max,Math.max(min,n));}
  function renderGrades(){
const kkm=clamp(Number($("#kkm").value)||75,0,100),max=clamp(Number($("#maxGrade").value)||90,kkm,100),subject=($("#subjectName").value||"Mata Pelajaran").trim();
$("#kkm").value=kkm;$("#maxGrade").value=max;
const students=data.students.filter(s=>!s.archived).slice().sort((a,b)=>a.name.localeCompare(b.name,"id"));
$("#gradeBody").innerHTML=students.map((s,i)=>{
const rec=data.gradeRecords.find(r=>r.studentId===s.id&&r.subject===subject),raw=rec&&rec.raw!==""&&rec.raw!=null?Number(rec.raw):null;
const final=raw===null?null:Math.round(kkm+(Math.max(0,Math.min(100,raw))*(max-kkm)/100));
const status=final===null?"Belum dinilai":(final<kkm?"Perlu tindak lanjut":"Mencapai KKM");
return '<tr><td>'+(i+1)+'</td><td>'+escapeHtml(s.name)+'</td><td><input class="attendance-edit-input grade-raw-input" type="number" min="0" max="100" step="1" inputmode="numeric" data-grade-student="'+s.id+'" aria-label="Nilai mentah '+escapeHtml(s.name)+'" value="'+(raw===null?"":raw)+'" placeholder="0–100"></td><td><strong>'+(final===null?"—":final)+'</strong></td><td><span class="status-pill">'+status+'</span></td></tr>';
}).join("")||'<tr><td colspan="5" class="attendance-empty">Belum ada siswa aktif. Tambahkan daftar siswa melalui menu Absensi &amp; Siswa.</td></tr>';
const scored=students.filter(s=>data.gradeRecords.some(r=>r.studentId===s.id&&r.subject===subject&&r.raw!==""&&r.raw!=null));
const finals=scored.map(s=>{const r=data.gradeRecords.find(x=>x.studentId===s.id&&x.subject===subject);return Math.round(kkm+(Math.max(0,Math.min(100,Number(r.raw)||0))*(max-kkm)/100));});
const avg=finals.length?finals.reduce((a,b)=>a+b,0)/finals.length:0;
$("#gradeSummary").textContent=students.length+" siswa aktif · "+scored.length+" sudah dinilai · "+(scored.length?"Rata-rata nilai akhir: "+avg.toFixed(1)+" · ":"")+"KKM: "+kkm+" · Mapel: "+(subject||"belum diisi");
$("#countAjar").textContent=data.ajar.length;$("#countAssessment").textContent=data.assessments.length;$("#countMaterials").textContent=data.materials.length;
}
  function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function attendanceFor(student,date){if(!student.attendance)student.attendance={};if(!student.attendance[date])student.attendance[date]={status:"Belum diisi",note:""};return student.attendance[date];}
  function normalizeClass(value){const raw=String(value==null?"":value).trim().toLowerCase().replace(/^kelas\s*/,"");const roman={"i":"1","ii":"2","iii":"3","iv":"4","v":"5","vi":"6"};return roman[raw]||(/^[1-6]$/.test(raw)?raw:"1");}
  function className(value){return "Kelas "+({"1":"I","2":"II","3":"III","4":"IV","5":"V","6":"VI"}[normalizeClass(value)]||"I");}
  function ensureStudentFields(){data.students.forEach(s=>{if(!s.classLevel)s.classLevel="6";if(typeof s.archived!=="boolean")s.archived=false;if(!s.attendance)s.attendance={};});}
  function renderAttendance(){
    ensureStudentFields();
    const date=$("#attendanceDate").value||localDate();const q=($("#studentSearch").value||"").trim().toLowerCase();const filter=$("#studentClassFilter").value||"active";
    const visibleStudents=data.students.filter(s=>{
      if(filter==="archived"?!s.archived:s.archived)return false;
      if(filter!=="active"&&filter!=="archived"&&normalizeClass(s.classLevel)!==filter)return false;
      return (s.name+" "+(s.code||"")).toLowerCase().includes(q);
    });
    const activeStudents=data.students.filter(s=>!s.archived);
    const statuses={"Hadir":0,"Izin":0,"Sakit":0,"Alpa":0,"Belum diisi":0};
    activeStudents.forEach(s=>{const a=attendanceFor(s,date);if(statuses[a.status]===undefined)a.status="Belum diisi";statuses[a.status]++;});
    $("#attendanceTotal").textContent=activeStudents.length;$("#attendancePresent").textContent=statuses.Hadir;$("#attendanceExcused").textContent=statuses.Izin;$("#attendanceSick").textContent=statuses.Sakit;$("#attendanceAbsent").textContent=statuses.Alpa;$("#attendancePending").textContent=statuses["Belum diisi"];
    $("#attendanceBody").innerHTML=visibleStudents.map((s,i)=>{const a=attendanceFor(s,date);const archived=!!s.archived;return '<tr data-student-row="'+s.id+'"><td>'+(i+1)+'</td><td><input class="attendance-edit-input student-name-input" data-student-field="name" data-student-id="'+s.id+'" aria-label="Nama siswa" maxlength="120" value="'+escapeHtml(s.name)+'"></td><td><input class="attendance-edit-input student-code-input" data-student-field="code" data-student-id="'+s.id+'" aria-label="NIS siswa" maxlength="40" value="'+escapeHtml(s.code||"")+'" placeholder="—"></td><td><select class="attendance-status-select student-class-select" data-student-field="classLevel" data-student-id="'+s.id+'" aria-label="Kelas siswa">'+["1","2","3","4","5","6"].map(cl=>'<option value="'+cl+'"'+(normalizeClass(s.classLevel)===cl?' selected':'')+'>'+className(cl)+'</option>').join("")+'</select></td><td>'+(archived?'<span class="soft-label">Diarsipkan</span>':'<select class="attendance-status-select" data-attendance-status="'+s.id+'" aria-label="Status kehadiran '+escapeHtml(s.name)+'">'+["Belum diisi","Hadir","Izin","Sakit","Alpa"].map(st=>'<option'+(a.status===st?' selected':'')+'>'+st+'</option>').join("")+'</select>')+'</td><td>'+(archived?'<span class="soft-label">Riwayat disimpan</span>':'<input class="attendance-edit-input attendance-note-input" data-attendance-note="'+s.id+'" aria-label="Catatan kehadiran" maxlength="180" value="'+escapeHtml(a.note||"")+'" placeholder="Opsional">')+'</td><td class="student-actions">'+(archived?'<button class="table-action" type="button" data-restore-student="'+s.id+'">Pulihkan</button> ':'<button class="table-action student-archive" type="button" data-archive-student="'+s.id+'">Arsipkan</button> ')+'<button class="table-action student-delete" type="button" data-delete-student="'+s.id+'">Hapus</button></td></tr>';}).join("")||'<tr><td colspan="7" class="attendance-empty">'+(filter==="archived"?"Belum ada siswa di arsip.":(activeStudents.length?"Tidak ada siswa yang cocok dengan filter/pencarian.":"Daftar siswa aktif masih kosong. Kelas I tersedia untuk diisi siswa baru."))+'</td></tr>';
    const pct=activeStudents.length?Math.round(statuses.Hadir/activeStudents.length*100):0;
    $("#attendanceSummary").textContent=(filter==="archived"?"Arsip: "+visibleStudents.length+" siswa · riwayat absensi dipertahankan.":"Tanggal "+date+" · "+activeStudents.length+" siswa aktif · Hadir "+statuses.Hadir+" ("+pct+"%) · Izin "+statuses.Izin+" · Sakit "+statuses.Sakit+" · Alpa "+statuses.Alpa+" · Belum diisi "+statuses["Belum diisi"]);
    $("[data-supervision]").forEach(el=>el.checked=!!data.supervision[Number(el.dataset.supervision)]);
    $("#supervisionCount").textContent=data.supervision.filter(Boolean).length+"/6";
    $("#promotionYear").value=data.classInfo.academicYear||"2026/2027";renderIncidentStudentOptions();
  }
  function renderClassInfo(){const c=data.classInfo||{};$("#classSchool").value=c.schoolName||"";$("#classTeacher").value=c.teacherName||"";$("#classPrincipal").value=c.principalName||"Zainudin";$("#classLabel").value=c.className||"VI";$("#classSemester").value=c.semester||"1";$("#classYear").value=c.academicYear||data.settings.academicYear||"2026/2027";}
  function exportAttendance(){
    const date=$("#attendanceDate").value||localDate();const rows=[["No","Nama Siswa","NIS","Tanggal","Status Kehadiran","Catatan"]];
    data.students.filter(s=>!s.archived).forEach((s,i)=>{const a=attendanceFor(s,date);rows.push([i+1,s.name,s.code||"",date,a.status,a.note||""]);});
    const csv=rows.map(row=>row.map(v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
    const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="absensi-kelas-"+($("#classLabel").value||"VI").replace(/[^a-z0-9_-]/gi,"-")+"-"+date+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast("CSV absensi disiapkan.");
  }
  function renderIncidentStudentOptions(selectedValue){
const el=$("#incidentStudent"),current=selectedValue||el.value,students=data.students.filter(s=>!s.archived).slice().sort((a,b)=>a.name.localeCompare(b.name,"id"));
el.innerHTML='<option value="">Pilih siswa aktif</option>'+students.map(s=>'<option value="'+s.id+'">'+escapeHtml(s.name)+' · '+escapeHtml(className(s.classLevel))+'</option>').join("");
if(current&&students.some(s=>String(s.id)===String(current)))el.value=String(current);
}
function resetIncidentForm(){$("#incidentForm").reset();$("#incidentDate").value=localDate();$("#incidentStatus").value="Perlu tindak lanjut";$("#incidentForm").dataset.editId="";$("#saveIncident").textContent="Simpan catatan";$("#cancelIncidentEdit").hidden=true;renderIncidentStudentOptions("");}
function renderIncidents(){
renderIncidentStudentOptions();const q=($("#incidentSearch").value||"").trim().toLowerCase(),status=$("#incidentStatusFilter").value;
const list=data.incidents.filter(x=>(!status||x.status===status)&&[x.studentName,x.category,x.description,x.action,x.reflection].join(" ").toLowerCase().includes(q)).slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
$("#incidentTotal").textContent=data.incidents.length;$("#incidentPending").textContent=data.incidents.filter(x=>x.status!=="Selesai").length;$("#incidentDone").textContent=data.incidents.filter(x=>x.status==="Selesai").length;
$("#incidentBody").innerHTML=list.map(x=>'<tr><td>'+escapeHtml(x.date||"—")+'</td><td>'+escapeHtml(x.studentName||"Siswa tidak tersedia")+'</td><td>'+escapeHtml(x.category||"Lainnya")+'</td><td class="incident-description">'+escapeHtml(x.description||"")+'</td><td class="incident-description">'+escapeHtml(x.action||"")+(x.followUpDate?'<small>Evaluasi: '+escapeHtml(x.followUpDate)+'</small>':"")+'</td><td><span class="status-pill incident-status">'+escapeHtml(x.status||"Perlu tindak lanjut")+'</span></td><td class="student-actions"><button class="table-action" type="button" data-edit-incident="'+x.id+'">Edit</button> <button class="table-action student-delete" type="button" data-delete-incident="'+x.id+'">Hapus</button></td></tr>').join("")||'<tr><td colspan="7" class="attendance-empty">Belum ada catatan yang cocok.</td></tr>';
$("#incidentSummary").textContent=list.length+" catatan ditampilkan · "+data.incidents.length+" catatan tersimpan · tanpa sistem poin.";
}
function saveIncidentForm(e){
e.preventDefault();const s=data.students.find(x=>!x.archived&&String(x.id)===$("#incidentStudent").value);if(!s){showToast("Pilih siswa aktif terlebih dahulu.");return;}
const description=$("#incidentDescription").value.trim();if(!description){showToast("Keterangan faktual wajib diisi.");$("#incidentDescription").focus();return;}
const payload={studentId:s.id,studentName:s.name,classLevel:normalizeClass(s.classLevel),date:$("#incidentDate").value||localDate(),category:$("#incidentCategory").value,description,reflection:$("#incidentReflection").value.trim(),action:$("#incidentAction").value.trim(),followUpDate:$("#incidentFollowUpDate").value,status:$("#incidentStatus").value,updatedAt:new Date().toISOString()};
const id=Number($("#incidentForm").dataset.editId);if(id){const old=data.incidents.find(x=>x.id===id);if(!old){showToast("Catatan tidak ditemukan.");resetIncidentForm();return;}Object.assign(old,payload);old.id=id;}else data.incidents.unshift(Object.assign({id:Date.now(),createdAt:new Date().toISOString()},payload));
save();renderIncidents();resetIncidentForm();showToast(id?"Catatan pembinaan diperbarui.":"Catatan kejadian disimpan.");
}
function editIncident(id){
const x=data.incidents.find(i=>i.id===id);if(!x)return;renderIncidentStudentOptions(x.studentId);$("#incidentStudent").value=String(x.studentId||"");$("#incidentDate").value=x.date||localDate();
if(!Array.from($("#incidentCategory").options).some(o=>o.value===(x.category||"Lainnya"))){const opt=document.createElement("option");opt.value=x.category;opt.textContent=x.category;$("#incidentCategory").appendChild(opt);}
$("#incidentCategory").value=x.category||"Lainnya";$("#incidentDescription").value=x.description||"";$("#incidentReflection").value=x.reflection||"";$("#incidentAction").value=x.action||"";$("#incidentFollowUpDate").value=x.followUpDate||"";$("#incidentStatus").value=x.status||"Perlu tindak lanjut";$("#incidentForm").dataset.editId=String(id);$("#saveIncident").textContent="Simpan perubahan";$("#cancelIncidentEdit").hidden=false;$("#incidentForm").scrollIntoView({behavior:"smooth",block:"start"});$("#incidentDescription").focus();
}
function exportIncidents(){
const rows=[["Tanggal","Nama siswa","Kelas saat kejadian","Kategori","Keterangan faktual","Refleksi siswa","Pembinaan / kesepakatan","Tanggal evaluasi","Status"]];
data.incidents.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(x=>rows.push([x.date||"",x.studentName||"",className(x.classLevel||"1"),x.category||"",x.description||"",x.reflection||"",x.action||"",x.followUpDate||"",x.status||""]));
const csv=rows.map(row=>row.map(v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ruangkelas-catatan-pembinaan-"+localDate()+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast("CSV catatan pembinaan disiapkan.");
}
  function renderAll(){renderAjar();renderAssessments();renderMaterials();renderSchedule();renderNotes();renderGrades();renderAttendance();renderClassInfo();renderIncidents();$$("[data-task]").forEach(el=>el.checked=!!data.tasks[Number(el.dataset.task)]);$("#taskCount").textContent=data.tasks.filter(Boolean).length+"/4";$("#teacherName").value=data.settings.teacherName||"Guru";$("#schoolName").value=data.settings.schoolName||"";$("#curriculum").value=data.settings.curriculum||"Kurikulum Merdeka";$("#academicYear").value=data.settings.academicYear||"2026/2027";const name=data.settings.teacherName||"Guru";$$(".profile-mini strong").forEach(el=>el.textContent=name);$$(".user-chip span:nth-child(2)").forEach(el=>el.textContent=name);}
  function openDialog(type){currentDialogType=type;const titles={ajar:"Tambah perangkat ajar",assessment:"Tambah perangkat penilaian",material:"Tambah materi",note:"Tambah catatan kelas"};$("#dialogTitle").textContent=titles[type]||"Tambah item";$("#dialogCopy").textContent=type==="note"?"Tambahkan catatan singkat untuk mengingat ide atau tindak lanjut.":"Tambahkan item baru ke workspace Anda. Item tersimpan lokal di browser ini.";$("#itemName").value="";$("#itemDescription").value="";$("#itemCategory").value=type==="assessment"?"Evaluasi":type==="material"?"Bahan ajar":type==="note"?"Catatan":"Perencanaan";$("#itemCategory").closest(".field").style.display=type==="note"?"none":"grid";$("#itemDialog").showModal();setTimeout(()=>$("#itemName").focus(),60);}
  function addItem(e){e.preventDefault();const name=$("#itemName").value.trim();if(!name)return;const description=$("#itemDescription").value.trim();const category=$("#itemCategory").value;const id=Date.now();if(currentDialogType==="note"){data.notes.unshift({id,name,description:description||"Catatan baru."});renderNotes();}else{const item={id,name,category,description:description||"Item baru yang bisa disesuaikan.",icon:currentDialogType==="material"?"▣":currentDialogType==="assessment"?"✓":"▤"};if(currentDialogType==="assessment")data.assessments.unshift(item);else if(currentDialogType==="material")data.materials.unshift(item);else data.ajar.unshift(item);renderAll();}save();$("#itemDialog").close();showToast("Item tersimpan di browser ini.");}
  function deleteItem(id,kind){let key=kind==="assessmentGrid"?"assessments":kind==="materialGrid"?"materials":"ajar";const item=data[key].find(x=>x.id===id);if(!item||!confirm('Hapus "'+item.name+'" dari data lokal?'))return;data[key]=data[key].filter(x=>x.id!==id);save();renderAll();showToast("Item dihapus.");}
  function exportCSV(){
const kkm=clamp(Number($("#kkm").value)||75,0,100),max=clamp(Number($("#maxGrade").value)||90,kkm,100),subject=($("#subjectName").value||"Mata Pelajaran").trim();
const rows=[["No","Nama siswa","Mata pelajaran","Nilai mentah","Nilai akhir","Keterangan"]];
data.students.filter(s=>!s.archived).slice().sort((a,b)=>a.name.localeCompare(b.name,"id")).forEach((s,i)=>{
const r=data.gradeRecords.find(x=>x.studentId===s.id&&x.subject===subject);if(!r||r.raw===""||r.raw==null){rows.push([i+1,s.name,subject,"","","Belum dinilai"]);return;}
const raw=clamp(Number(r.raw)||0,0,100),final=Math.round(kkm+raw*(max-kkm)/100);rows.push([i+1,s.name,subject,raw,final,final<kkm?"Perlu tindak lanjut":"Mencapai KKM"]);
});
const csv=rows.map(row=>row.map(v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ruangkelas-rekap-nilai-"+(subject||"mapel").replace(/[^a-z0-9_-]/gi,"-")+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast("CSV rekap nilai disiapkan.");
}
  $$(".nav-link").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();route(a.dataset.page);}));
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>route(b.dataset.go)));
  $("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  document.addEventListener("click",e=>{if($("#sidebar").classList.contains("open")&&!e.target.closest("#sidebar")&&!e.target.closest("#menuToggle"))$("#sidebar").classList.remove("open");});
  $("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark");try{localStorage.setItem("ruangkelas-dark",document.body.classList.contains("dark")?"1":"0");}catch(e){}});
  try{if(localStorage.getItem("ruangkelas-dark")==="1")document.body.classList.add("dark");}catch(e){}
  $("#profileButton").addEventListener("click",()=>route("pengaturan"));
  $(".notice-close").addEventListener("click",()=>$(".notice").remove());
  $("#globalSearch").addEventListener("keydown",e=>{if(e.key!=="Enter")return;const q=e.target.value.trim().toLowerCase();if(!q)return;const pages=[["perangkat-ajar",data.ajar],["penilaian",data.assessments],["pusat-materi",data.materials],["data-kelas",data.schedules]];const match=pages.find(entry=>entry[1].some(x=>(x.name+" "+(x.description||"")+" "+(x.category||"")).toLowerCase().includes(q)));if(match){route(match[0]);showToast("Bagian terkait dibuka.");}else showToast("Belum ada hasil. Coba kata kunci lain.");});
  $("#ajarSearch").addEventListener("input",renderAjar);$("#ajarFilter").addEventListener("change",renderAjar);$("#assessmentSearch").addEventListener("input",renderAssessments);$("#materialSearch").addEventListener("input",renderMaterials);$("#materialFilter").addEventListener("change",renderMaterials);$("#scheduleSearch").addEventListener("input",renderSchedule);
  $("#addAjar").addEventListener("click",()=>openDialog("ajar"));$("#addAssessment").addEventListener("click",()=>openDialog("assessment"));$("#addMaterial").addEventListener("click",()=>openDialog("material"));$("#addClassNote").addEventListener("click",()=>openDialog("note"));
  $("#closeDialog").addEventListener("click",()=>$("#itemDialog").close());$("#cancelDialog").addEventListener("click",()=>$("#itemDialog").close());$("#itemForm").addEventListener("submit",addItem);
  document.addEventListener("click",e=>{const open=e.target.closest("[data-open-item]");if(open){const kind=open.dataset.kind;const key=kind==="assessmentGrid"?"assessments":kind==="materialGrid"?"materials":"ajar";const item=data[key].find(x=>x.id===Number(open.dataset.openItem));if(item)showToast(item.name+": "+(item.description||"Item workspace"));return;}const del=e.target.closest("[data-delete-item]");if(del){deleteItem(Number(del.dataset.deleteItem),del.dataset.kind);return;}const sd=e.target.closest("[data-delete-schedule]");if(sd){const item=data.schedules.find(x=>x.id===Number(sd.dataset.deleteSchedule));if(item&&confirm('Hapus agenda "'+item.name+'"?')){data.schedules=data.schedules.filter(x=>x.id!==item.id);save();renderSchedule();showToast("Agenda dihapus.");}}});
  $$("[data-task]").forEach(el=>el.addEventListener("change",()=>{data.tasks[Number(el.dataset.task)]=el.checked;save();$("#taskCount").textContent=data.tasks.filter(Boolean).length+"/4";}));
  $("#bulkStudentForm").addEventListener("submit",e=>{e.preventDefault();const lines=$("#bulkStudentNames").value.split(String.fromCharCode(10)).map(line=>line.trim()).filter(Boolean);if(!lines.length){showToast("Tempel nama siswa terlebih dahulu.");return;}let added=0,skipped=0;const defaultClass=normalizeClass($("#bulkDefaultClass").value);lines.forEach((line,index)=>{const parts=line.split("|").map(x=>x.trim());const name=(parts[0]||"").slice(0,120);const cls=parts[1]?normalizeClass(parts[1]):defaultClass;if(!name){skipped++;return;}if(data.students.some(s=>s.name.trim().toLowerCase()===name.toLowerCase())){skipped++;return;}data.students.push({id:Date.now()+index,name,code:parts[2]||"",classLevel:cls,archived:false,attendance:{}});added++;});save();$("#bulkStudentNames").value="";renderAttendance();showToast(added+" siswa ditambahkan"+(skipped?", "+skipped+" baris dilewati (duplikat/kosong).":"."));});
  $("#attendanceDate").value=localDate();
  $("#attendanceDate").addEventListener("change",renderAttendance);
  $("#studentSearch").addEventListener("input",renderAttendance);
  $("#studentForm").addEventListener("submit",e=>{e.preventDefault();const name=$("#newStudentName").value.trim();const code=$("#newStudentCode").value.trim();const classLevel=normalizeClass($("#newStudentClass").value);if(!name)return;if(data.students.some(s=>!s.archived&&s.name.trim().toLowerCase()===name.toLowerCase())){showToast("Nama siswa tersebut sudah ada pada data aktif.");return;}data.students.push({id:Date.now(),name,code,classLevel,archived:false,attendance:{}});save();$("#newStudentName").value="";$("#newStudentCode").value="";$("#newStudentClass").value="1";$("#studentClassFilter").value="active";renderAttendance();showToast("Siswa ditambahkan ke "+className(classLevel)+".");});
  $("#attendanceBody").addEventListener("change",e=>{const date=$("#attendanceDate").value||localDate();const statusEl=e.target.closest("[data-attendance-status]");if(statusEl){const student=data.students.find(s=>s.id===Number(statusEl.dataset.attendanceStatus));if(student){attendanceFor(student,date).status=statusEl.value;save();renderAttendance();showToast("Absensi disimpan.");return;}}const noteEl=e.target.closest("[data-attendance-note]");if(noteEl){const student=data.students.find(s=>s.id===Number(noteEl.dataset.attendanceNote));if(student){attendanceFor(student,date).note=noteEl.value.trim();save();renderAttendance();showToast("Catatan absensi disimpan.");return;}}});
  $("#attendanceBody").addEventListener("change",e=>{const field=e.target.closest("[data-student-field]");if(!field)return;const student=data.students.find(s=>s.id===Number(field.dataset.studentId));if(!student)return;const value=field.dataset.studentField==="classLevel"?normalizeClass(field.value):field.value.trim();if(field.dataset.studentField==="name"&&!value){field.value=student.name;showToast("Nama siswa tidak boleh kosong.");return;}student[field.dataset.studentField]=value;save();renderAttendance();showToast(field.dataset.studentField==="classLevel"?"Kelas siswa diperbarui.":"Data siswa disimpan.");});
  $("#attendanceBody").addEventListener("click",e=>{const archive=e.target.closest("[data-archive-student]");if(archive){const s=data.students.find(x=>x.id===Number(archive.dataset.archiveStudent));if(!s||!confirm("Arsipkan "+s.name+"? Data dan riwayat absensinya tetap disimpan."))return;s.archived=true;save();renderAttendance();showToast("Siswa diarsipkan; riwayat tetap tersimpan.");return;}const restore=e.target.closest("[data-restore-student]");if(restore){const s=data.students.find(x=>x.id===Number(restore.dataset.restoreStudent));if(!s)return;s.archived=false;save();renderAttendance();showToast("Siswa dipulihkan ke daftar aktif.");return;}const btn=e.target.closest("[data-delete-student]");if(!btn)return;const id=Number(btn.dataset.deleteStudent);const student=data.students.find(s=>s.id===id);if(!student||!confirm("Hapus permanen data siswa "+student.name+" beserta seluruh riwayat absensinya? Tindakan ini tidak dapat dibatalkan."))return;data.students=data.students.filter(s=>s.id!==id);save();renderAttendance();showToast("Data siswa dihapus permanen.");});
  $("#classInfoForm").addEventListener("submit",e=>{e.preventDefault();data.classInfo={schoolName:$("#classSchool").value.trim(),teacherName:$("#classTeacher").value.trim(),principalName:$("#classPrincipal").value.trim(),className:$("#classLabel").value.trim()||"VI",semester:$("#classSemester").value,academicYear:$("#classYear").value.trim()||"2026/2027"};save();$("#promotionYear").value=data.classInfo.academicYear;showToast("Identitas sekolah, kepala sekolah, dan kelas disimpan.");});
  $("#studentClassFilter").addEventListener("change",renderAttendance);
  $("#promoteStudents").addEventListener("click",()=>{ensureStudentFields();const targetYear=$("#promotionYear").value.trim();if(!targetYear){showToast("Isi tahun ajaran tujuan terlebih dahulu.");return;}if(data.lastPromotionYear===targetYear){showToast("Kenaikan kelas untuk tahun "+targetYear+" sudah pernah dijalankan.");return;}const active=data.students.filter(s=>!s.archived);if(!active.length){showToast("Belum ada siswa aktif untuk dinaikkan.");return;}const counts={"1":0,"2":0,"3":0,"4":0,"5":0,"6":0};active.forEach(s=>counts[normalizeClass(s.classLevel)]++);const message="Naikkan kelas untuk tahun "+targetYear+"?\n\nKelas I: "+counts["1"]+" → II\nKelas II: "+counts["2"]+" → III\nKelas III: "+counts["3"]+" → IV\nKelas IV: "+counts["4"]+" → V\nKelas V: "+counts["5"]+" → VI\nKelas VI: "+counts["6"]+" → arsip/lulus.\n\nPastikan daftar tahun lalu sudah benar. Proses ini tidak menghapus riwayat absensi.";if(!confirm(message))return;active.forEach(s=>{const cl=Number(normalizeClass(s.classLevel));if(cl>=1&&cl<6)s.classLevel=String(cl+1);else if(cl===6){s.archived=true;s.exitReason="Lulus / akhir kelas VI";}});data.lastPromotionYear=targetYear;data.classInfo.academicYear=targetYear;save();$("#studentClassFilter").value="active";renderAttendance();showToast("Kenaikan kelas "+targetYear+" selesai. Kelas I siap diisi siswa baru.");});
  $("#exportAttendance").addEventListener("click",exportAttendance);
  $("#printAttendance").addEventListener("click",()=>{window.print();});
  $("[data-supervision]").forEach(el=>el.addEventListener("change",()=>{data.supervision[Number(el.dataset.supervision)]=el.checked;save();$("#supervisionCount").textContent=data.supervision.filter(Boolean).length+"/6";}));
  $("#incidentDate").value=localDate();
$("#incidentForm").addEventListener("submit",saveIncidentForm);$("#cancelIncidentEdit").addEventListener("click",resetIncidentForm);
$("#incidentSearch").addEventListener("input",renderIncidents);$("#incidentStatusFilter").addEventListener("change",renderIncidents);
$("#incidentBody").addEventListener("click",e=>{const edit=e.target.closest("[data-edit-incident]");if(edit){editIncident(Number(edit.dataset.editIncident));return;}const del=e.target.closest("[data-delete-incident]");if(!del)return;const id=Number(del.dataset.deleteIncident),item=data.incidents.find(x=>x.id===id);if(!item||!confirm("Hapus catatan kejadian untuk "+(item.studentName||"siswa ini")+"? Penghapusan tidak dapat dibatalkan."))return;data.incidents=data.incidents.filter(x=>x.id!==id);save();renderIncidents();if(Number($("#incidentForm").dataset.editId)===id)resetIncidentForm();showToast("Catatan dihapus.");});
$("#exportIncidents").addEventListener("click",exportIncidents);$("#printIncidents").addEventListener("click",()=>{route("pelanggaran-pembinaan");window.print();});
  $("#gradeBody").addEventListener("change",e=>{
const input=e.target.closest("[data-grade-student]");if(!input)return;const studentId=Number(input.dataset.gradeStudent),subject=($("#subjectName").value||"Mata Pelajaran").trim();
if(input.value===""){data.gradeRecords=data.gradeRecords.filter(r=>!(r.studentId===studentId&&r.subject===subject));save();renderGrades();showToast("Nilai dikosongkan.");return;}
const raw=Number(input.value);if(!Number.isFinite(raw)||raw<0||raw>100){showToast("Nilai mentah harus 0 sampai 100.");renderGrades();return;}
let rec=data.gradeRecords.find(r=>r.studentId===studentId&&r.subject===subject);if(!rec){rec={studentId,subject,raw};data.gradeRecords.push(rec);}else rec.raw=raw;save();renderGrades();showToast("Nilai "+subject+" disimpan.");
});
  $("#recalculate").addEventListener("click",()=>{renderGrades();showToast("Nilai dihitung ulang.");});$("#kkm").addEventListener("change",renderGrades);$("#maxGrade").addEventListener("change",renderGrades);$("#subjectName").addEventListener("change",renderGrades);$("#exportGrades").addEventListener("click",exportCSV);
  $("#settingsForm").addEventListener("submit",e=>{e.preventDefault();data.settings={teacherName:$("#teacherName").value.trim()||"Guru",schoolName:$("#schoolName").value.trim(),curriculum:$("#curriculum").value,academicYear:$("#academicYear").value.trim()};save();renderAll();$("#settingsStatus").textContent="Pengaturan tersimpan pada browser ini.";showToast("Pengaturan tersimpan.");});
  $("#resetDemo").addEventListener("click",()=>{if(!confirm("Kembalikan seluruh data demo ke kondisi awal?"))return;data=clone(defaults);save();renderAll();$("#settingsStatus").textContent="Data demo dikembalikan ke kondisi awal.";showToast("Data demo direset.");});
  $("#yearNow").textContent=new Date().getFullYear();$("#todayLabel").textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
  renderAll();const initial=location.hash.replace("#","");if(initial)route(initial);
})();