"use strict";

const SUPABASE_URL = "https://iivvqoipxeuyatatzkmt.supabase.co";
const SUPABASE_KEY = "sb_publishable_a4z_om77FoLDDkLsRlEJ9A_1zYFOLRG";
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const TOTAL_LESSONS = 17;
let students = [];

const byId = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
const formatDate = (value) => value ? new Date(value).toLocaleDateString("pt-BR") : "—";
const showError = (message) => {
  byId("loading").hidden = true;
  byId("errorBox").textContent = message;
  byId("errorBox").hidden = false;
};

async function carregarPainel() {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError || !sessionData.session) {
    showError("Você precisa entrar na sua conta do H.S Bruno antes de acessar o painel. Abra o site principal, faça login e tente novamente.");
    return;
  }

  let session = sessionData.session;
  if (session.user.app_metadata?.role !== "admin") {
    const { data: refreshed, error: refreshError } = await client.auth.refreshSession();
    if (!refreshError && refreshed.session) session = refreshed.session;
  }

  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || userData.user?.app_metadata?.role !== "admin") {
    showError("Esta conta não possui permissão administrativa. Se a permissão acabou de ser concedida, saia da conta no site principal e entre novamente.");
    return;
  }

  byId("adminEmail").textContent = userData.user.email || "Administrador";
  const { data, error } = await client.functions.invoke("admin-dashboard");
  if (error || data?.error) {
    showError(data?.error || "Não foi possível consultar os dados administrativos. Atualize a página e tente novamente.");
    return;
  }

  students = (data.users || []).filter((user) => user.role !== "admin");
  renderDashboard(data.users || []);
  byId("loading").hidden = true;
  byId("dashboard").hidden = false;
}

function renderDashboard(allUsers) {
  const totalLessons = students.reduce((sum, user) => sum + (user.completed_lessons?.length || 0), 0);
  const scores = students.map((user) => user.quiz_score).filter((score) => Number.isFinite(score));
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;

  byId("totalUsers").textContent = allUsers.length;
  byId("totalStudents").textContent = students.length;
  byId("totalLessons").textContent = totalLessons;
  byId("averageScore").textContent = average === null ? "—" : average + "%";

  const recent = [...students].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  byId("recentStudents").innerHTML = recent.length ? recent.map((user) => `
    <tr><td class="student-email">${escapeHtml(user.email)}</td><td>${formatDate(user.created_at)}</td>
    <td>${user.completed_lessons?.length || 0}/${TOTAL_LESSONS}</td><td>${user.quiz_score == null ? "—" : escapeHtml(user.quiz_score) + "%"}</td></tr>
  `).join("") : '<tr><td colspan="4" class="empty">Ainda não há alunos cadastrados.</td></tr>';

  renderStudents();
  renderAssessments();
}

function renderStudents() {
  const term = byId("studentSearch").value.trim().toLowerCase();
  const filtered = students.filter((user) => user.email.toLowerCase().includes(term));
  byId("studentCount").textContent = filtered.length + " aluno(s)";
  byId("studentsTable").innerHTML = filtered.length ? filtered.map((user) => `
    <tr><td class="student-email">${escapeHtml(user.email)}</td><td>${formatDate(user.created_at)}</td>
    <td>${user.completed_lessons?.length || 0}/${TOTAL_LESSONS}</td><td>${user.completed_modules?.length || 0}/4</td>
    <td>${user.quiz_score == null ? "—" : escapeHtml(user.quiz_score) + "%"}</td><td>${formatDate(user.updated_at)}</td></tr>
  `).join("") : '<tr><td colspan="6" class="empty">Nenhum aluno encontrado.</td></tr>';
}

function renderAssessments() {
  const withScores = students.filter((user) => user.quiz_score != null)
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  byId("assessmentsTable").innerHTML = withScores.length ? withScores.map((user) => `
    <tr><td class="student-email">${escapeHtml(user.email)}</td><td>${escapeHtml(user.quiz_score)}%</td><td>${formatDate(user.updated_at)}</td></tr>
  `).join("") : '<tr><td colspan="3" class="empty">Ainda não existem pontuações registradas.</td></tr>';
}

document.querySelectorAll("[data-section]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const section = link.dataset.section;
    document.querySelectorAll(".page-section").forEach((item) => item.classList.toggle("active", item.id === section));
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.toggle("active", item.dataset.section === section));
    byId("pageTitle").textContent = ({ overview: "Visão geral", students: "Alunos", assessments: "Avaliações" })[section];
    history.replaceState(null, "", "#" + section);
  });
});

document.querySelectorAll('a[href="#students"][data-section="students"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector('[data-section="students"]').click();
  });
});
byId("studentSearch").addEventListener("input", renderStudents);
byId("logoutButton").addEventListener("click", async () => {
  await client.auth.signOut();
  window.location.href = "index.html";
});

carregarPainel().catch((error) => {
  console.error(error);
  showError("Ocorreu um erro ao abrir o painel administrativo.");
});