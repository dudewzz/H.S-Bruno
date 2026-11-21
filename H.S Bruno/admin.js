"use strict";

const SUPABASE_URL = "https://iivvqoipxeuyatatzkmt.supabase.co";
const SUPABASE_KEY = "sb_publishable_a4z_om77FoLDDkLsRlEJ9A_1zYFOLRG";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const TOTAL_LESSONS = 17;
const MODULES = [
  {id:"hardware-1",title:"Hardware · Módulo 1",lessons:["Introdução ao hardware","Memória RAM","Armazenamento","Placa-mãe","Processador"]},
  {id:"hardware-2",title:"Hardware · Módulo 2",lessons:["Ferramentas e segurança","Montagem do computador","Limpeza preventiva","Diagnóstico de falhas"]},
  {id:"software-1",title:"Software · Módulo 1",lessons:["O que é software?","Sistemas operacionais","Arquivos e pastas","Instalação e atualização de programas"]},
  {id:"software-2",title:"Software · Módulo 2",lessons:["Aplicativos e utilitários","Segurança digital","Antivírus e atualizações","Solução de problemas de software"]}
];
let students = [];
let realtimeChannel = null;
let refreshTimer = null;
let lastUpdate = null;
const byId = (id) => document.getElementById(id);
function configurarTema(){
  const button=byId("themeToggle");
  let saved=null;try{saved=localStorage.getItem("hsbruno_theme")}catch(_){}
  document.body.classList.toggle("dark-mode",saved==="dark");
  const update=()=>{const dark=document.body.classList.contains("dark-mode");button.textContent=dark?"☀":"☾";button.setAttribute("aria-label",dark?"Ativar modo claro":"Ativar modo escuro");button.title=dark?"Ativar modo claro":"Ativar modo escuro"};
  update();button.addEventListener("click",()=>{const dark=!document.body.classList.contains("dark-mode");document.body.classList.toggle("dark-mode",dark);try{localStorage.setItem("hsbruno_theme",dark?"dark":"light")}catch(_){}update()});
}
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const formatDate=value=>value?new Date(value).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"}):"—";
const scorePercent=score=>Math.round((Number(score)||0)/3*100);
function getQuizResults(user){return user.lesson_quiz_results&&typeof user.lesson_quiz_results==="object"?user.lesson_quiz_results:{}}
function quizAttempts(result){return Array.isArray(result?.tentativas)&&result.tentativas.length?result.tentativas:[...(result?.data?[{score:result.score,data:result.data}]:[])]}
function quizStats(user){const results=getQuizResults(user),records=Object.values(results).filter(r=>r&&!r.refazendo);const attempts=records.flatMap(r=>quizAttempts(r));const scores=attempts.map(a=>scorePercent(a.score)).filter(Number.isFinite);return{completed:records.length,attempts:attempts.length,average:scores.length?Math.round(scores.reduce((s,n)=>s+n,0)/scores.length):null,results}}
function challengeCount(user){const values=user.challenge_results||{};return Object.values(values).filter(v=>v&&v.completed).length}
function moduleQuizStats(users,module){const prefix=module.id+"-aula-",quizRows=users.flatMap(u=>Object.entries(getQuizResults(u)).filter(([id,r])=>id.startsWith(prefix)&&r&&!r.refazendo).map(([id,r])=>({id,r,user:u})));const attempts=quizRows.flatMap(({r})=>quizAttempts(r));const scores=attempts.map(a=>scorePercent(a.score));return{completed:quizRows.length,average:scores.length?Math.round(scores.reduce((s,n)=>s+n,0)/scores.length):null}}
function showError(message){byId("loading").hidden=true;byId("errorBox").textContent=message;byId("errorBox").hidden=false}
async function carregarPainel({quiet=false}={}){
  if(!quiet){byId("loading").hidden=false;byId("errorBox").hidden=true}
  const {data:sessionData,error:sessionError}=await client.auth.getSession();
  if(sessionError||!sessionData.session){if(!quiet)showError("Você precisa entrar na sua conta do H.S Bruno antes de acessar o painel. Abra o site principal, faça login e tente novamente.");return false}
  let session=sessionData.session;
  if(session.user.app_metadata?.role!=="admin"){const{data:refreshed,error:refreshError}=await client.auth.refreshSession();if(!refreshError&&refreshed.session)session=refreshed.session}
  const{data:userData,error:userError}=await client.auth.getUser();
  if(userError||userData.user?.app_metadata?.role!=="admin"){if(!quiet)showError("Esta conta não possui permissão administrativa. Se a permissão acabou de ser concedida, saia e entre novamente.");return false}
  byId("adminEmail").textContent=userData.user.email||"Administrador";
  const{data,error}=await client.functions.invoke("admin-dashboard");
  if(error||data?.error){if(!quiet)showError(data?.error||"Não foi possível consultar os dados administrativos.");return false}
  students=(data.users||[]).filter(u=>u.role!=="admin");lastUpdate=new Date();renderDashboard(data.users||[]);
  if(!quiet){byId("loading").hidden=true;byId("dashboard").hidden=false}
  return true
}
function renderDashboard(allUsers){
  const lessons=students.reduce((s,u)=>s+(u.completed_lessons?.length||0),0);
  const quizData=students.map(quizStats),totalCompleted=quizData.reduce((s,q)=>s+q.completed,0),allScores=quizData.flatMap(q=>Object.values(q.results).filter(r=>r&&!r.refazendo).flatMap(quizAttempts).map(a=>scorePercent(a.score)));
  const avg=allScores.length?Math.round(allScores.reduce((s,n)=>s+n,0)/allScores.length):null;
  const challenges=students.reduce((s,u)=>s+challengeCount(u),0);
  byId("totalUsers").textContent=allUsers.length;byId("totalStudents").textContent=students.length;byId("totalLessons").textContent=lessons;byId("totalLessonQuizzes").textContent=totalCompleted;byId("averageScore").textContent=avg===null?"—":avg+"%";byId("totalChallenges").textContent=challenges;
  renderModulePerformance();renderActivitySummary();
  const recent=[...students].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5);
  byId("recentStudents").innerHTML=recent.length?recent.map(u=>{const q=quizStats(u);return `<tr><td class="student-email">${escapeHtml(u.email)}</td><td>${formatDate(u.created_at)}</td><td>${u.completed_lessons?.length||0}/${TOTAL_LESSONS}</td><td>${q.completed}/17</td></tr>`}).join(""):'<tr><td colspan="4" class="empty">Ainda não há alunos cadastrados.</td></tr>';
  renderStudents();renderAssessments();
  updateLastRefresh();
}
function renderModulePerformance(){
  const container=byId("modulePerformance");if(!container)return;
  container.innerHTML=MODULES.map(m=>{const stat=moduleQuizStats(students,m),percent=Math.round(stat.completed/m.lessons.length*100);return `<div class="module-performance-row"><div class="module-performance-top"><span>${escapeHtml(m.title)}</span><strong>${stat.completed}/${m.lessons.length} quizzes</strong></div><div class="module-performance-track"><span style="width:${percent}%"></span></div><div class="module-performance-meta"><span>Realização ${percent}%</span><span>Média: ${stat.average===null?"—":stat.average+"%"}</span></div></div>`}).join("")
}
function renderActivitySummary(){
 const c=byId("activitySummary");if(!c)return;const now=Date.now(),active7=students.filter(u=>u.updated_at&&now-new Date(u.updated_at).getTime()<=7*86400000).length,active30=students.filter(u=>u.updated_at&&now-new Date(u.updated_at).getTime()<=30*86400000).length,never=students.filter(u=>!u.updated_at).length;
 c.innerHTML=[["Ativos nos últimos 7 dias",active7],["Ativos nos últimos 30 dias",active30],["Sem progresso sincronizado",never],["Alunos cadastrados",students.length]].map(([label,value])=>`<div class="activity-summary-item"><span>${label}</span><strong>${value}</strong></div>`).join("")
}
function renderStudents(){
 const term=byId("studentSearch").value.trim().toLowerCase(),filtered=students.filter(u=>(u.email||"").toLowerCase().includes(term));
 byId("studentCount").textContent=filtered.length+" aluno(s)";
 byId("studentsTable").innerHTML=filtered.length?filtered.map(u=>{const q=quizStats(u);return `<tr><td class="student-email">${escapeHtml(u.email)}</td><td>${formatDate(u.created_at)}</td><td>${u.completed_lessons?.length||0}/17</td><td>${q.completed}/17</td><td>${q.average===null?"—":q.average+"%"}</td><td>${challengeCount(u)}/4</td><td>${u.completed_modules?.length||0}/4</td><td>${formatDate(u.updated_at)}</td></tr>`}).join(""):'<tr><td colspan="8" class="empty">Nenhum aluno encontrado.</td></tr>'
}
function renderAssessments(){
 const rows=students.flatMap(u=>MODULES.flatMap(m=>m.lessons.map((lesson,index)=>{const id=m.id+"-aula-"+(index+1),r=getQuizResults(u)[id];if(!r||r.refazendo)return null;const attempts=quizAttempts(r),scores=attempts.map(a=>scorePercent(a.score));return{email:u.email,lesson,module:m.title,attempts,scores,date:r.data||attempts.at(-1)?.data}}))).filter(Boolean).sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
 byId("assessmentsTable").innerHTML=rows.length?rows.map(r=>`<tr><td class="student-email">${escapeHtml(r.email)}</td><td>${escapeHtml(r.lesson)}</td><td>${escapeHtml(r.module)}</td><td>${r.attempts.length}</td><td>${r.scores.length?r.scores.at(-1)+"%":"—"}</td><td>${r.scores.length?Math.max(...r.scores)+"%":"—"}</td><td>${formatDate(r.date)}</td></tr>`).join(""):'<tr><td colspan="7" class="empty">Os quizzes ainda não estão sincronizados para o banco de dados.</td></tr>'
}
function updateLastRefresh(){let el=byId("lastUpdated");if(el)el.textContent="Dados atualizados: "+lastUpdate.toLocaleTimeString("pt-BR")}
function configurarAtualizacaoAutomatica(){
  if(refreshTimer)clearInterval(refreshTimer);
  refreshTimer=setInterval(()=>carregarPainel({quiet:true}),30000);
  realtimeChannel=client.channel("admin-progress-updates").on("postgres_changes",{event:"*",schema:"public",table:"student_progress"},()=>carregarPainel({quiet:true})).subscribe();
}
document.querySelectorAll("[data-section]").forEach(link=>link.addEventListener("click",event=>{event.preventDefault();const section=link.dataset.section;document.querySelectorAll(".page-section").forEach(s=>s.classList.toggle("active",s.id===section));document.querySelectorAll(".nav-link").forEach(n=>n.classList.toggle("active",n.dataset.section===section));byId("pageTitle").textContent=({overview:"Visão geral",students:"Alunos",assessments:"Avaliações"})[section];history.replaceState(null,"","#"+section)}));
byId("studentSearch").addEventListener("input",renderStudents);
byId("logoutButton").addEventListener("click",async()=>{await client.auth.signOut();window.location.href="index.html"});
configurarTema();carregarPainel().then(ok=>{if(ok)configurarAtualizacaoAutomatica()}).catch(error=>{console.error(error);showError("Ocorreu um erro ao abrir o painel administrativo.")});
