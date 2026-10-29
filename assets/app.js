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
    classInfo:{schoolName:"",teacherName:"",className:"VI",semester:"1",academicYear:"2026/2027"},
    supervision:[false,false,false,false,false,false],
    tasks:[false,false,false,false],
    settings:{teacherName:"Guru",schoolName:"",curriculum:"Kurikulum Merdeka",academicYear:"2026/2027"}
  };
  let data = clone(defaults);
  let currentDialogType = "ajar";
  let toastHandle;
  try { const saved = localStorage.getItem("ruangkelas-data-v1"); if(saved) data = Object.assign(clone(defaults), JSON.parse(saved)); } catch(e) {}
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
  function renderGrades(){const kkm=clamp(Number($("#kkm").value)||75,0,100);const max=clamp(Number($("#maxGrade").value)||90,kkm,100);$("#kkm").value=kkm;$("#maxGrade").value=max;const vals=data.grades.map(x=>Object.assign({},x,{final:Math.round(kkm+(Math.max(0,Math.min(100,x.raw))* (max-kkm)/100))}));$("#gradeBody").innerHTML=vals.map((x,i)=>'<tr><td>'+(i+1)+'</td><td>'+escapeHtml(x.name)+'</td><td>'+x.raw+'</td><td><strong>'+x.final+'</strong></td><td><span class="status-pill" '+(x.final<kkm?'style="background:#fff0ed;color:#bc5b4a"':"")+'>'+(x.final<kkm?"Perlu tindak lanjut":"Mencapai KKM")+'</span></td></tr>').join("");const avg=vals.reduce((s,x)=>s+x.final,0)/Math.max(vals.length,1);$("#gradeSummary").textContent=vals.length+" data contoh · Rata-rata nilai akhir: "+avg.toFixed(1)+" · KKM: "+kkm;$("#countAjar").textContent=data.ajar.length;$("#countAssessment").textContent=data.assessments.length;$("#countMaterials").textContent=data.materials.length;}
  function localDate(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function attendanceFor(student,date){if(!student.attendance)student.attendance={};if(!student.attendance[date])student.attendance[date]={status:"Belum diisi",note:""};return student.attendance[date];}
  function renderAttendance(){
    const date=$("#attendanceDate").value||localDate();const q=($("#studentSearch").value||"").trim().toLowerCase();
    const statuses={"Hadir":0,"Izin":0,"Sakit":0,"Alpa":0,"Belum diisi":0};
    data.students.forEach(s=>{const a=attendanceFor(s,date);if(statuses[a.status]===undefined)a.status="Belum diisi";statuses[a.status]++;});
    $("#attendanceTotal").textContent=data.students.length;$("#attendancePresent").textContent=statuses.Hadir;$("#attendanceExcused").textContent=statuses.Izin;$("#attendanceSick").textContent=statuses.Sakit;$("#attendanceAbsent").textContent=statuses.Alpa;$("#attendancePending").textContent=statuses["Belum diisi"];
    const list=data.students.filter(s=>(s.name+" "+(s.code||"")).toLowerCase().includes(q));
    $("#attendanceBody").innerHTML=list.map((s,i)=>{const a=attendanceFor(s,date);return '<tr data-student-row="'+s.id+'"><td>'+(data.students.indexOf(s)+1)+'</td><td><input class="attendance-edit-input student-name-input" data-student-field="name" data-student-id="'+s.id+'" aria-label="Nama siswa" maxlength="120" value="'+escapeHtml(s.name)+'"></td><td><input class="attendance-edit-input student-code-input" data-student-field="code" data-student-id="'+s.id+'" aria-label="NIS siswa" maxlength="40" value="'+escapeHtml(s.code||"")+'" placeholder="—"></td><td><select class="attendance-status-select" data-attendance-status="'+s.id+'" aria-label="Status kehadiran '+escapeHtml(s.name)+'">'+["Belum diisi","Hadir","Izin","Sakit","Alpa"].map(st=>'<option'+(a.status===st?' selected':'')+'>'+st+'</option>').join("")+'</select></td><td><input class="attendance-edit-input attendance-note-input" data-attendance-note="'+s.id+'" aria-label="Catatan kehadiran" maxlength="180" value="'+escapeHtml(a.note||"")+'" placeholder="Opsional"></td><td><button class="table-action student-delete" type="button" data-delete-student="'+s.id+'">Hapus</button></td></tr>';}).join("")||'<tr><td colspan="6" class="attendance-empty">'+(data.students.length?"Tidak ada siswa yang cocok dengan pencarian.":"Belum ada daftar siswa. Tambahkan siswa pada formulir di atas untuk memulai.")+'</td></tr>';
    const pct=data.students.length?Math.round(statuses.Hadir/data.students.length*100):0;
    $("#attendanceSummary").textContent="Tanggal "+date+" · "+data.students.length+" siswa · Hadir "+statuses.Hadir+" ("+pct+"%) · Izin "+statuses.Izin+" · Sakit "+statuses.Sakit+" · Alpa "+statuses.Alpa+" · Belum diisi "+statuses["Belum diisi"];
    $("[data-supervision]").forEach(el=>el.checked=!!data.supervision[Number(el.dataset.supervision)]);
    $("#supervisionCount").textContent=data.supervision.filter(Boolean).length+"/6";
  }
  function renderClassInfo(){const c=data.classInfo||{};$("#classSchool").value=c.schoolName||"";$("#classTeacher").value=c.teacherName||"";$("#classLabel").value=c.className||"VI";$("#classSemester").value=c.semester||"1";$("#classYear").value=c.academicYear||data.settings.academicYear||"2026/2027";}
  function exportAttendance(){
    const date=$("#attendanceDate").value||localDate();const rows=[["No","Nama Siswa","NIS","Tanggal","Status Kehadiran","Catatan"]];
    data.students.forEach((s,i)=>{const a=attendanceFor(s,date);rows.push([i+1,s.name,s.code||"",date,a.status,a.note||""]);});
    const csv=rows.map(row=>row.map(v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
    const blob=new Blob(["\\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="absensi-kelas-"+($("#classLabel").value||"VI").replace(/[^a-z0-9_-]/gi,"-")+"-"+date+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast("CSV absensi disiapkan.");
  }
  function renderAll(){renderAjar();renderAssessments();renderMaterials();renderSchedule();renderNotes();renderGrades();renderAttendance();renderClassInfo();$$("[data-task]").forEach(el=>el.checked=!!data.tasks[Number(el.dataset.task)]);$("#taskCount").textContent=data.tasks.filter(Boolean).length+"/4";$("#teacherName").value=data.settings.teacherName||"Guru";$("#schoolName").value=data.settings.schoolName||"";$("#curriculum").value=data.settings.curriculum||"Kurikulum Merdeka";$("#academicYear").value=data.settings.academicYear||"2026/2027";const name=data.settings.teacherName||"Guru";$$(".profile-mini strong").forEach(el=>el.textContent=name);$$(".user-chip span:nth-child(2)").forEach(el=>el.textContent=name);}
  function openDialog(type){currentDialogType=type;const titles={ajar:"Tambah perangkat ajar",assessment:"Tambah perangkat penilaian",material:"Tambah materi",note:"Tambah catatan kelas"};$("#dialogTitle").textContent=titles[type]||"Tambah item";$("#dialogCopy").textContent=type==="note"?"Tambahkan catatan singkat untuk mengingat ide atau tindak lanjut.":"Tambahkan item baru ke workspace Anda. Item tersimpan lokal di browser ini.";$("#itemName").value="";$("#itemDescription").value="";$("#itemCategory").value=type==="assessment"?"Evaluasi":type==="material"?"Bahan ajar":type==="note"?"Catatan":"Perencanaan";$("#itemCategory").closest(".field").style.display=type==="note"?"none":"grid";$("#itemDialog").showModal();setTimeout(()=>$("#itemName").focus(),60);}
  function addItem(e){e.preventDefault();const name=$("#itemName").value.trim();if(!name)return;const description=$("#itemDescription").value.trim();const category=$("#itemCategory").value;const id=Date.now();if(currentDialogType==="note"){data.notes.unshift({id,name,description:description||"Catatan baru."});renderNotes();}else{const item={id,name,category,description:description||"Item baru yang bisa disesuaikan.",icon:currentDialogType==="material"?"▣":currentDialogType==="assessment"?"✓":"▤"};if(currentDialogType==="assessment")data.assessments.unshift(item);else if(currentDialogType==="material")data.materials.unshift(item);else data.ajar.unshift(item);renderAll();}save();$("#itemDialog").close();showToast("Item tersimpan di browser ini.");}
  function deleteItem(id,kind){let key=kind==="assessmentGrid"?"assessments":kind==="materialGrid"?"materials":"ajar";const item=data[key].find(x=>x.id===id);if(!item||!confirm('Hapus "'+item.name+'" dari data lokal?'))return;data[key]=data[key].filter(x=>x.id!==id);save();renderAll();showToast("Item dihapus.");}
  function exportCSV(){const kkm=clamp(Number($("#kkm").value)||75,0,100);const max=clamp(Number($("#maxGrade").value)||90,kkm,100);const rows=[["No","Nama contoh","Mata pelajaran","Nilai mentah","Nilai akhir","Keterangan"]];data.grades.forEach((x,i)=>{const final=Math.round(kkm+x.raw*(max-kkm)/100);rows.push([i+1,x.name,$("#subjectName").value,x.raw,final,final<kkm?"Perlu tindak lanjut":"Mencapai KKM"]);});const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="ruangkelas-rekap-nilai-demo.csv";a.click();URL.revokeObjectURL(url);showToast("File CSV berhasil disiapkan.");}
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
  $("#attendanceDate").value=localDate();
  $("#attendanceDate").addEventListener("change",renderAttendance);
  $("#studentSearch").addEventListener("input",renderAttendance);
  $("#studentForm").addEventListener("submit",e=>{e.preventDefault();const name=$("#newStudentName").value.trim();const code=$("#newStudentCode").value.trim();if(!name)return;if(data.students.some(s=>s.name.trim().toLowerCase()===name.toLowerCase())){showToast("Nama siswa tersebut sudah ada.");return;}data.students.push({id:Date.now(),name,code,attendance:{}});save();$("#newStudentName").value="";$("#newStudentCode").value="";renderAttendance();showToast("Siswa ditambahkan.");});
  $("#attendanceBody").addEventListener("change",e=>{const date=$("#attendanceDate").value||localDate();const statusEl=e.target.closest("[data-attendance-status]");if(statusEl){const student=data.students.find(s=>s.id===Number(statusEl.dataset.attendanceStatus));if(student){attendanceFor(student,date).status=statusEl.value;save();renderAttendance();showToast("Absensi disimpan.");return;}}const noteEl=e.target.closest("[data-attendance-note]");if(noteEl){const student=data.students.find(s=>s.id===Number(noteEl.dataset.attendanceNote));if(student){attendanceFor(student,date).note=noteEl.value.trim();save();renderAttendance();showToast("Catatan absensi disimpan.");return;}}});
  $("#attendanceBody").addEventListener("change",e=>{const field=e.target.closest("[data-student-field]");if(!field)return;const student=data.students.find(s=>s.id===Number(field.dataset.studentId));if(!student)return;const value=field.value.trim();if(field.dataset.studentField==="name"&&!value){field.value=student.name;showToast("Nama siswa tidak boleh kosong.");return;}student[field.dataset.studentField]=value;save();showToast("Data siswa disimpan.");});
  $("#attendanceBody").addEventListener("click",e=>{const btn=e.target.closest("[data-delete-student]");if(!btn)return;const id=Number(btn.dataset.deleteStudent);const student=data.students.find(s=>s.id===id);if(!student||!confirm('Hapus data siswa "'+student.name+'" beserta riwayat absensinya dari browser ini?'))return;data.students=data.students.filter(s=>s.id!==id);save();renderAttendance();showToast("Data siswa dihapus.");});
  $("#classInfoForm").addEventListener("submit",e=>{e.preventDefault();data.classInfo={schoolName:$("#classSchool").value.trim(),teacherName:$("#classTeacher").value.trim(),className:$("#classLabel").value.trim()||"VI",semester:$("#classSemester").value,academicYear:$("#classYear").value.trim()||"2026/2027"};save();showToast("Identitas kelas disimpan.");});
  $("#exportAttendance").addEventListener("click",exportAttendance);
  $("#printAttendance").addEventListener("click",()=>{window.print();});
  $("[data-supervision]").forEach(el=>el.addEventListener("change",()=>{data.supervision[Number(el.dataset.supervision)]=el.checked;save();$("#supervisionCount").textContent=data.supervision.filter(Boolean).length+"/6";}));
  $("#recalculate").addEventListener("click",()=>{renderGrades();showToast("Nilai dihitung ulang.");});$("#kkm").addEventListener("change",renderGrades);$("#maxGrade").addEventListener("change",renderGrades);$("#exportGrades").addEventListener("click",exportCSV);
  $("#settingsForm").addEventListener("submit",e=>{e.preventDefault();data.settings={teacherName:$("#teacherName").value.trim()||"Guru",schoolName:$("#schoolName").value.trim(),curriculum:$("#curriculum").value,academicYear:$("#academicYear").value.trim()};save();renderAll();$("#settingsStatus").textContent="Pengaturan tersimpan pada browser ini.";showToast("Pengaturan tersimpan.");});
  $("#resetDemo").addEventListener("click",()=>{if(!confirm("Kembalikan seluruh data demo ke kondisi awal?"))return;data=clone(defaults);save();renderAll();$("#settingsStatus").textContent="Data demo dikembalikan ke kondisi awal.";showToast("Data demo direset.");});
  $("#yearNow").textContent=new Date().getFullYear();$("#todayLabel").textContent=new Intl.DateTimeFormat("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
  renderAll();const initial=location.hash.replace("#","");if(initial)route(initial);
})();