(() => {
"use strict";
const $=id=>document.getElementById(id);
const scoreKey="ruangkelas-lab-score-v1";
let score=0;try{score=Math.max(0,Number(localStorage.getItem(scoreKey))||0)}catch(e){}
const scoreEl=$("labScore");
const showScore=()=>{if(scoreEl)scoreEl.textContent="Poin pribadi: "+score};
const addScore=n=>{score+=n;try{localStorage.setItem(scoreKey,String(score))}catch(e){}showScore()};
showScore();
let equation={a:3,b:4,x:5,c:19};
let equationSolved=false;
const fmt=n=>n<0?" - "+Math.abs(n):" + "+n;
function nextEquation(){
 const a=1+Math.floor(Math.random()*6),x=-3+Math.floor(Math.random()*13),b=-9+Math.floor(Math.random()*19);
 equation={a,b,x,c:a*x+b};equationSolved=false;$("labEquation").textContent=a+"x"+fmt(b)+" = "+equation.c;
 $("labAnswer").value="";$("labFeedback").textContent="Temukan x dengan operasi kebalikan.";$("labFeedback").dataset.state="";$("labAnswer").focus();
}
$("labCheck").addEventListener("click",()=>{
 const raw=$("labAnswer").value.trim(),f=$("labFeedback");
 if(raw===""){f.textContent="Masukkan nilai x terlebih dahulu.";f.dataset.state="error";return}
 if(Number(raw)===equation.x){if(equationSolved){f.textContent="Soal ini sudah berhasil diselesaikan. Buat soal berikutnya untuk mendapat poin lagi.";f.dataset.state="success";return}equationSolved=true;f.textContent="Benar! Brankas terbuka. +5 poin. Coba soal berikutnya.";f.dataset.state="success";addScore(5)}
 else{f.textContent="Belum tepat. Kurangi konstanta di kedua ruas, lalu bagi dengan koefisien x.";f.dataset.state="error"}
});
$("labNext").addEventListener("click",nextEquation);
$("labAnswer").addEventListener("keydown",e=>{if(e.key==="Enter")$("labCheck").click()});
const steps=[{id:"open",text:"Buka aplikasi email"},{id:"compose",text:"Pilih menu Tulis pesan"},{id:"recipient",text:"Masukkan alamat penerima"},{id:"content",text:"Isi subjek dan pesan"},{id:"review",text:"Periksa kembali alamat dan isi pesan"},{id:"send",text:"Klik tombol Kirim"}];
let stepOrder=[],stepProgress=0;
function renderSteps(){
 $("labStepStatus").textContent="Langkah "+Math.min(stepProgress+1,steps.length)+" dari "+steps.length;
 $("labStepList").innerHTML=stepOrder.map(step=>{const done=steps.findIndex(s=>s.id===step.id)<stepProgress;return '<button type="button" class="lab-step-button'+(done?' is-correct':'')+'" data-step-id="'+step.id+'" '+(done?'disabled':'')+'><span class="step-index">'+(done?'✓':'↳')+'</span><span>'+step.text+'</span></button>'}).join("");
}
function shuffleSteps(){stepOrder=steps.slice().sort(()=>Math.random()-.5);stepProgress=0;renderSteps();$("labStepFeedback").textContent="Pilih langkah yang harus dilakukan pertama.";$("labStepFeedback").dataset.state=""}
$("labStepList").addEventListener("click",e=>{
 const b=e.target.closest("[data-step-id]");if(!b||b.disabled)return;
 const f=$("labStepFeedback");
 if(b.dataset.stepId!==steps[stepProgress].id){f.textContent="Belum tepat. Pikirkan prasyarat sebelum menjalankan langkah ini.";f.dataset.state="error";return}
 stepProgress++;renderSteps();
 if(stepProgress===steps.length){f.textContent="Algoritma berhasil disusun! +10 poin.";f.dataset.state="success";addScore(10)}
 else{f.textContent="Tepat. Lanjutkan ke langkah berikutnya.";f.dataset.state="success"}
});
$("labResetSteps").addEventListener("click",shuffleSteps);shuffleSteps();
})();