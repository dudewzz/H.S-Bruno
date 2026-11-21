/* ===== 14. Autenticação, perfil e sessão ===== */

function mostrarAcesso(mensagem = "") {
    const overlay = document.getElementById("authOverlay");
    const message = document.getElementById("authMessage");
    if (message) message.textContent = mensagem;
    if (overlay) overlay.classList.remove("hidden");
}

function ocultarAcesso() {
    document.getElementById("authOverlay")?.classList.add("hidden");
    document.getElementById("authMessage").textContent = "";
}

function atualizarBotaoConta() {
    const botao = document.getElementById("authToggle");
    if (botao) {
        botao.textContent = sessaoAtual?.user?.user_metadata?.profile_avatar
            || sessaoAtual?.user?.email?.[0]?.toUpperCase()
            || "V";
        botao.setAttribute("aria-label", sessaoAtual ? "Abrir meu perfil" : "Entrar na conta");
    }

    const adminLink = document.getElementById("adminNavLink");
    if (adminLink) {
        const isAdmin = sessaoAtual?.user?.app_metadata?.role === "admin";
        adminLink.style.display = isAdmin ? "" : "none";
    }
}

function renderizarPerfilAluno() {
    if (!sessaoAtual?.user) return;
    const usuario = sessaoAtual.user;
    const metadata = usuario.user_metadata || {};
    const nomePadrao = usuario.email?.split("@")[0] || "Aluno(a)";
    const nome = metadata.profile_name || nomePadrao;
    avatarPerfilSelecionado = metadata.profile_avatar || "🦊";
    const totalAulas = modulos.reduce((total, modulo) => total + modulo.aulas.length, 0);
    const percentual = Math.round((aulasConcluidas.length / totalAulas) * 100);
    const dataCadastro = usuario.created_at
        ? new Date(usuario.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
        : "—";

    document.getElementById("profileAvatarPreview").textContent = avatarPerfilSelecionado;
    document.getElementById("profileDisplayName").textContent = nome;
    document.getElementById("profileDisplayEmail").textContent = usuario.email || "";
    document.getElementById("profileJoinDate").textContent = "Membro desde " + dataCadastro;
    document.getElementById("profilePercent").textContent = percentual + "%";
    document.getElementById("profileLevelText").textContent =
        percentual === 100 ? "Jornada concluída!" : percentual >= 50 ? "Você está evoluindo muito!" : percentual > 0 ? "Continue nesse ritmo!" : "Começando a jornada";
    document.getElementById("profileLessons").textContent = aulasConcluidas.length + "/" + totalAulas;
    document.getElementById("profileModules").textContent = concluidos.length + "/" + modulos.length;
    document.getElementById("profileScore").textContent = pontuacaoAtual === null ? "—" : pontuacaoAtual + "%";
    document.getElementById("profileNameInput").value = metadata.profile_name || "";
    document.querySelectorAll("[data-profile-avatar]").forEach(botao => {
        botao.classList.toggle("selected", botao.dataset.profileAvatar === avatarPerfilSelecionado);
        botao.setAttribute("aria-pressed", botao.dataset.profileAvatar === avatarPerfilSelecionado ? "true" : "false");
    });

    const conquistas = [
        { icone: "🌱", nome: "Primeiro passo", descricao: "Concluir 1 aula", meta: 1 },
        { icone: "📘", nome: "Estudante dedicado", descricao: "Concluir 5 aulas", meta: 5 },
        { icone: "🔥", nome: "Em evolução", descricao: "Concluir 10 aulas", meta: 10 },
        { icone: "🏆", nome: "Mestre do conteúdo", descricao: "Concluir todas as aulas", meta: totalAulas }
    ];
    const lista = document.getElementById("profileAchievements");
    lista.replaceChildren();
    conquistas.forEach(conquista => {
        const liberada = aulasConcluidas.length >= conquista.meta;
        const item = document.createElement("div");
        item.className = "profile-achievement" + (liberada ? " unlocked" : "");
        const icone = document.createElement("span");
        icone.className = "profile-achievement-icon";
        icone.textContent = conquista.icone;
        const texto = document.createElement("div");
        const titulo = document.createElement("strong");
        titulo.textContent = conquista.nome;
        const descricao = document.createElement("small");
        descricao.textContent = liberada ? "Conquista desbloqueada" : conquista.descricao;
        texto.append(titulo, descricao);
        item.append(icone, texto);
        lista.appendChild(item);
    });
}

function configurarPerfilAluno() {
    document.getElementById("authToggle").addEventListener("click", () => {
        if (sessaoAtual) {
            renderizarPerfilAluno();
            navegar("perfil");
        } else {
            mostrarAcesso();
        }
    });

    document.getElementById("profileAvatarOptions").addEventListener("click", evento => {
        const botao = evento.target.closest("[data-profile-avatar]");
        if (!botao) return;
        avatarPerfilSelecionado = botao.dataset.profileAvatar;
        document.querySelectorAll("[data-profile-avatar]").forEach(opcao => {
            const selecionado = opcao === botao;
            opcao.classList.toggle("selected", selecionado);
            opcao.setAttribute("aria-pressed", selecionado ? "true" : "false");
        });
        document.getElementById("profileAvatarPreview").textContent = avatarPerfilSelecionado;
    });

    document.getElementById("profileForm").addEventListener("submit", async evento => {
        evento.preventDefault();
        if (!sessaoAtual) return mostrarAcesso();
        const nome = document.getElementById("profileNameInput").value.trim();
        if (!nome) {
            mostrarToast("Digite seu nome para salvar o perfil.");
            return;
        }
        const botao = document.getElementById("profileSave");
        botao.disabled = true;
        botao.textContent = "Salvando...";
        const metadataAtual = sessaoAtual.user.user_metadata || {};
        const { data, error } = await supabaseClient.auth.updateUser({
            data: { ...metadataAtual, profile_name: nome, profile_avatar: avatarPerfilSelecionado }
        });
        botao.disabled = false;
        botao.textContent = "Salvar alterações";
        if (error) {
            console.error("Erro ao atualizar perfil:", error);
            mostrarToast("Não foi possível salvar seu perfil. Tente novamente.");
            return;
        }
        if (data?.user) sessaoAtual.user = data.user;
        atualizarBotaoConta();
        renderizarPerfilAluno();
        botao.classList.remove("is-saved");
        void botao.offsetWidth;
        botao.classList.add("is-saved");
        setTimeout(() => botao.classList.remove("is-saved"), 900);
        mostrarToast("Perfil atualizado com sucesso!");
    });

    document.getElementById("profileSignOut").addEventListener("click", async () => {
        if (!(await confirmarAcao("Deseja sair da sua conta?"))) return;
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            mostrarToast("Não foi possível sair da conta. Tente novamente.");
            return;
        }
        sessaoAtual = null;
        concluidos = [];
        aulasConcluidas = [];
        pontuacaoAtual = null;
        atividadesSemanais = [];
        atualizarResumo();
        atualizarBotaoConta();
        mostrarAcesso("Você saiu da sua conta.");
    });
}

async function carregarProgressoDaConta(){
 concluidos=[];aulasConcluidas=[];atividadesSemanais=[];pontuacaoAtual=null;videosAssistidos=lerVideosAssistidos();resultadosDesafios={};historicoDesafios=[];historicoQuizGeral=lerHistoricoQuizGeral();
 if(!sessaoAtual){atualizarResumo();return;}
 const {data,error}=await supabaseClient.from("student_progress").select("completed_lessons,quiz_score,weekly_activity").eq("user_id",sessaoAtual.user.id).maybeSingle();
 if(error){console.error("Erro ao carregar progresso:",error);mostrarToast("Não foi possível carregar seu progresso.");atualizarResumo();return;}
 if(data){const valid=modulos.flatMap(m=>m.aulas.map((_,i)=>idDaAula(m,i))),results=lerResultadosQuizzes();aulasConcluidas=Array.isArray(data.completed_lessons)?[...new Set(data.completed_lessons.filter(id=>valid.includes(id)&&results[id]&&!results[id].refazendo))]:[];videosAssistidos=[...new Set([...videosAssistidos,...aulasConcluidas])];salvarVideosAssistidos(videosAssistidos);pontuacaoAtual=data.quiz_score??null;}
 const remote=normalizarAtividadesSemanais(data?.weekly_activity),local=normalizarAtividadesSemanais(lerAtividadeSemanalLocal());atividadesSemanais=normalizarAtividadesSemanais([...remote,...local]);
 const saved=lerDesafiosSalvos();resultadosDesafios=saved.resultados||{};historicoDesafios=Array.isArray(saved.historico)?saved.historico:[];
 if(JSON.stringify(atividadesSemanais)!==JSON.stringify(remote)){const modulesDone=modulos.filter(m=>moduloCompleto(m)).map(m=>m.id);const {error:sync}=await supabaseClient.from("student_progress").upsert({user_id:sessaoAtual.user.id,completed_lessons:aulasConcluidas,completed_modules:modulesDone,weekly_activity:atividadesSemanais,quiz_score:pontuacaoAtual,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(sync)console.warn("Não foi possível sincronizar atividade semanal antiga.",sync);else salvarCopiaLocalAtividadeSemanal(atividadesSemanais);}
 atualizarModulosConcluidos();atualizarResumo();
}


function atualizarModoAcesso() {
    const titulo = document.getElementById("authTitle");
    const submit = document.getElementById("authSubmit");
    const switchText = document.getElementById("authSwitchText");
    const password = document.getElementById("authPassword");
    titulo.textContent = modoCadastro ? "Criar sua conta" : "Acesse sua conta";
    submit.textContent = modoCadastro ? "Criar conta" : "Entrar";
    password.autocomplete = modoCadastro ? "new-password" : "current-password";
    switchText.firstChild.textContent = modoCadastro ? "Já tem uma conta? " : "Ainda não tem conta? ";
    document.getElementById("authSwitch").textContent = modoCadastro ? "Fazer login" : "Criar conta";
}

function configurarAcesso() {
    const mensagemAcesso = document.getElementById("authMessage");
    const campoEmail = document.getElementById("authEmail");
    const campoSenha = document.getElementById("authPassword");

    // Ao corrigir os dados, remove o erro anterior para permitir uma nova tentativa.
    [campoEmail, campoSenha].forEach(campo => {
        campo.addEventListener("input", () => {
            mensagemAcesso.textContent = "";
        });
    });

    document.getElementById("authSwitch").addEventListener("click", () => {
        modoCadastro = !modoCadastro;
        mensagemAcesso.textContent = "";
        atualizarModoAcesso();
    });

    document.getElementById("authForm").addEventListener("submit", async evento => {
        evento.preventDefault();
        mensagemAcesso.textContent = "";
        const email = campoEmail.value.trim();
        const password = campoSenha.value;
        const submit = document.getElementById("authSubmit");
        submit.disabled = true;
        submit.textContent = "Aguarde...";

        try {
            if (modoCadastro) {
                const { data, error } = await supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin + window.location.pathname
                    }
                });
                if (error) throw error;
                if (data.session) {
                    sessaoAtual = data.session;
                    await carregarProgressoDaConta();
                    atualizarBotaoConta();
                    ocultarAcesso();
                    mostrarToast("Conta criada com sucesso!");
                } else {
                    document.getElementById("authMessage").textContent =
                        "Conta criada! Confira seu e-mail para confirmar o cadastro e depois faça login.";
                }
            } else {
                const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                if (error) throw error;

                // Só finalizar o fluxo se o Supabase devolver uma sessão real.
                if (!data?.session?.user) {
                    throw new Error("O login foi aceito, mas a sessão não foi retornada. Tente novamente.");
                }

                sessaoAtual = data.session;

                // Fechar o acesso imediatamente após validar a sessão.
                // Atualizações de perfil/progresso não podem bloquear o fechamento do login.
                ocultarAcesso();
                atualizarBotaoConta();
                mostrarToast("Login realizado!");

                // Perfil e progresso são atualizados depois de liberar a tela.
                try {
                    renderizarPerfilAluno();
                } catch (erroPerfil) {
                    console.error("Erro ao atualizar perfil após login:", erroPerfil);
                }
                carregarProgressoDaConta().catch(erro => {
                    console.error("Erro ao carregar progresso após login:", erro);
                    mostrarToast("Você entrou, mas não foi possível carregar o progresso agora.");
                });
            }
        } catch (erro) {
            document.getElementById("authMessage").textContent =
                erro.message || "Não foi possível concluir o acesso.";
        } finally {
            submit.disabled = false;
            atualizarModoAcesso();
        }
    });

    document.getElementById("signOut").addEventListener("click", async () => {
        if (!(await confirmarAcao("Deseja sair da sua conta?"))) return;
        await supabaseClient.auth.signOut();
        sessaoAtual = null;
        concluidos = [];
        aulasConcluidas = [];
        pontuacaoAtual = null;
        atividadesSemanais = [];
        atualizarResumo();
        atualizarBotaoConta();
        mostrarAcesso("Você saiu da sua conta.");
    });

    document.getElementById("resetProgress").addEventListener("click", async () => {
        if (!sessaoAtual) return mostrarAcesso();
        const confirmar = await confirmarAcao("Tem certeza de que deseja resetar todo seu progresso? Aulas, quizzes, vídeos assistidos, desafios, histórico de avaliações e meta semanal serão apagados da sua conta e deste dispositivo. Essa ação não pode ser desfeita.");
        if (!confirmar) return;

        const { error } = await supabaseClient
            .from("student_progress")
            .delete()
            .eq("user_id", sessaoAtual.user.id);

        if (error) {
            console.error("Erro ao resetar progresso:", error);
            mostrarToast("Não foi possível resetar seu progresso. Tente novamente.");
            return;
        }

        concluidos = [];
        aulasConcluidas = [];
        pontuacaoAtual = null;
        atividadesSemanais = [];
        videosAssistidos = [];
        resultadosDesafios = {};
        historicoDesafios = [];
        historicoQuizGeral = [];
        salvarVideosAssistidos([]);
        salvarDesafiosSalvos();
        salvarHistoricoQuizGeral([]);
        try {
            localStorage.removeItem(chaveAtividadeSemanal());
            localStorage.removeItem(chaveQuizzesDoUsuario());
        } catch (_) {}
        atualizarResumo();
        if (moduloAtual) renderizarListaAulas(moduloAtual);
        mostrarToast("Seu progresso foi resetado para 0%.");
    });

    atualizarModoAcesso();
}

async function iniciarPortal() {
    configurarTema();
    configurarModalModulo();
    configurarNavegacao();
    configurarProximaAula();
    configurarFiltros();
    document.querySelectorAll(".filter").forEach(botao => botao.setAttribute("aria-pressed", botao.classList.contains("active") ? "true" : "false"));
    configurarQuiz();
    configurarAcesso();

    document.getElementById("search").addEventListener("input", pesquisarCursos);
    configurarPerfilAluno();

    renderizarModulos();

    // Registrar o listener antes de consultar a sessão evita perder eventos de autenticação
    // e impede que a resposta inicial atrasada reabra o login depois de um login bem-sucedido.
    let eventoAuthRecebido = false;
    supabaseClient.auth.onAuthStateChange((eventoAuth, session) => {
        eventoAuthRecebido = true;
        sessaoAtual = session;

        if (!session) {
            concluidos = [];
            aulasConcluidas = [];
            videosAssistidos = [];
            resultadosDesafios = {};
            historicoDesafios = [];
            historicoQuizGeral = [];
            pontuacaoAtual = null;
            atividadesSemanais = [];
            atualizarResumo();
            mostrarAcesso();
        } else {
            atualizarBotaoConta();
            ocultarAcesso();

            if (eventoAuth === "INITIAL_SESSION" || eventoAuth === "TOKEN_REFRESHED") {
                setTimeout(() => {
                    carregarProgressoDaConta().catch(erro => {
                        console.error("Erro ao carregar progresso da sessão:", erro);
                    });
                }, 0);
            }
        }
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) console.error("Erro ao verificar sessão:", error);

    // Só aplica a consulta inicial se nenhum evento de autenticação mais recente já ocorreu.
    if (!eventoAuthRecebido) {
        sessaoAtual = data?.session || null;
        if (sessaoAtual) {
            ocultarAcesso();
            carregarProgressoDaConta().catch(erro => {
                console.error("Erro ao carregar progresso inicial:", erro);
            });
        } else {
            concluidos = [];
            aulasConcluidas = [];
            pontuacaoAtual = null;
            atividadesSemanais = [];
            atualizarResumo();
            mostrarAcesso();
        }
    }

    atualizarBotaoConta();
    console.log("H.S. Bruno iniciado.");
}

/* ===== 15. Cálculo de progresso geral ===== */

function quantidadeQuizzesConcluidos(){const results=lerResultadosQuizzes();return modulos.reduce((sum,m)=>sum+m.aulas.filter((_,i)=>Boolean(results[idDaAula(m,i)]&&!results[idDaAula(m,i)].refazendo)).length,0);}
function quantidadeDesafiosConcluidos(){return modulos.filter(m=>Boolean(resultadosDesafios[m.id]?.completed)).length;}
function tarefasConcluidasModulo(m){const results=lerResultadosQuizzes(),video=m.aulas.filter((_,i)=>videosAssistidos.includes(idDaAula(m,i))).length,quiz=m.aulas.filter((_,i)=>Boolean(results[idDaAula(m)]&&!results[idDaAula(m)].refazendo)).length,challenge=resultadosDesafios[m.id]?.completed?1:0;return video+quiz+challenge;}
function totalTarefasModulo(m){return m.aulas.length*2+1;}
function progressoModulo(m){return Math.round(tarefasConcluidasModulo(m)/totalTarefasModulo(m)*100);}
function moduloCompleto(m){return tarefasConcluidasModulo(m)===totalTarefasModulo(m);}
function tarefasConcluidasPortal(){return videosAssistidos.length+quantidadeQuizzesConcluidos()+quantidadeDesafiosConcluidos();}
function totalTarefasPortal(){return modulos.reduce((sum,m)=>sum+totalTarefasModulo(m),0);}
const desafiosPorModulo={
 "hardware-1":[{pergunta:"PC lento ao abrir várias aplicações. O que investigar?",opcoes:["Uso de RAM e programas ativos","Trocar o monitor","Desconectar teclado","Formatar sem diagnóstico"],correta:0,explicacao:"Confira memória e processos ativos antes de trocar peças."},{pergunta:"Vai comprar RAM adicional. O que verificar?",opcoes:["Compatibilidade, tipo e capacidade suportada pela placa-mãe","Cor do gabinete","Modelo do mouse","Resolução do monitor"],correta:0,explicacao:"Compatibilidade, capacidade e slots são importantes."},{pergunta:"SSD não aparece no sistema. Primeiro passo?",opcoes:["Verificar detecção na BIOS/UEFI e conexão","Trocar mouse","Desinstalar navegador","Aumentar brilho"],correta:0,explicacao:"Verifique firmware e conexão para diferenciar falha física e configuração."}],
 "hardware-2":[{pergunta:"Após limpeza, PC liga sem imagem. O que revisar?",opcoes:["Conexões e encaixes que foram manuseados","Instalar navegador","Formatar","Trocar todas as peças"],correta:0,explicacao:"Revise RAM, vídeo e cabos manuseados com cuidado."},{pergunta:"Componente não encaixa no conector. O que fazer?",opcoes:["Parar e verificar orientação e compatibilidade no manual","Forçar","Lixar conector","Ligar parcialmente encaixado"],correta:0,explicacao:"Não force peças. Confira orientação e compatibilidade."},{pergunta:"PC aquece e cooler está coberto de poeira. Procedimento?",opcoes:["Desligar, desconectar e limpar com segurança, verificando fluxo de ar","Cobrir entradas de ar","Desativar sensores térmicos","Abrir mais programas"],correta:0,explicacao:"Poeira pode comprometer o resfriamento. Limpeza segura e ventilação ajudam."}],
 "software-1":[{pergunta:"Renomear .docx para .txt não converte. Por quê?",opcoes:["A extensão não altera o formato interno","RAM define extensão","GPU bloqueia conversão","Sistema apaga conteúdo"],correta:0,explicacao:"Renomear é diferente de converter o formato."},{pergunta:"Programa funciona em outra conta, mas não na sua. O que investigar?",opcoes:["Permissões, configurações e dados do perfil","Processador","Tela","Desconectar SSD"],correta:0,explicacao:"O problema pode estar no perfil do usuário."},{pergunta:"Instalar programa de forma segura?",opcoes:["Fonte oficial e requisitos verificados","Qualquer link","Desativar antivírus","Executar anexos desconhecidos"],correta:0,explicacao:"Use fontes oficiais e verifique requisitos."}],
 "software-2":[{pergunta:"E-mail pede senha por link urgente e desconhecido. O que fazer?",opcoes:["Não clicar e acessar pelo endereço oficial","Informar senha","Repassar link","Desligar antivírus"],correta:0,explicacao:"Pode ser phishing. Evite links e nunca compartilhe credenciais."},{pergunta:"Proteção alerta malware num arquivo. Como agir?",opcoes:["Não abrir e analisar com ferramenta confiável","Ignorar alerta","Renomear arquivo","Desativar proteção"],correta:0,explicacao:"Não execute arquivo suspeito; use proteção de segurança."},{pergunta:"Impressão travada na fila. Checagem inicial?",opcoes:["Conexão, estado e fila de impressão","Placa de vídeo","Apagar documentos","Desinstalar apps"],correta:0,explicacao:"Conexão e fila são verificações básicas para diagnóstico."}]
};
/* ===== 16. Desafios práticos ===== */

function renderizarDesafios(){
 const grid=document.getElementById("challengeModules");if(!grid)return;grid.replaceChildren();
 modulos.forEach(m=>{
  const result=resultadosDesafios[m.id],card=document.createElement("article");card.className="panel challenge-card";
  const top=document.createElement("div");top.className="challenge-card-top";
  const icon=document.createElement("span");icon.className="challenge-card-symbol";icon.textContent=m.id.startsWith("hardware")?"⚙":"▣";
  const status=document.createElement("span");status.className="challenge-status "+(result?.completed?"is-complete":"is-pending");status.textContent=result?.completed?"Concluído":"Disponível";top.append(icon,status);
  const title=document.createElement("h2");title.textContent=m.titulo;const desc=document.createElement("p");desc.textContent=m.descricao;
  const details=document.createElement("div");details.className="challenge-card-details";details.innerHTML='<span>◆ 3 situações</span><span>⌁ Prática aplicada</span>';
  const meta=document.createElement("div");meta.className="challenge-card-score";meta.innerHTML='<span class="challenge-score-label">'+(result?.completed?"Último resultado":"Meta de respostas")+'</span><strong>'+(result?.completed?result.score+"/3":"3 questões")+'</strong>';
  const track=document.createElement("div");track.className="challenge-card-progress";const bar=document.createElement("span");bar.style.width=result?.completed?"100%":"0%";track.appendChild(bar);
  const btn=document.createElement("button");btn.type="button";btn.className=result?.completed?"secondary":"primary";btn.textContent=result?.completed?"Revisar desafio ↗":"Começar desafio →";btn.addEventListener("click",()=>abrirDesafio(m.id));
  card.append(top,title,desc,details,meta,track,btn);grid.appendChild(card);
 });
}
function abrirDesafio(moduleId,refazer=false){
 const m=modulos.find(v=>v.id===moduleId),area=document.getElementById("challengeWorkspace");if(!m||!area)return;
 const items=desafiosPorModulo[moduleId]||[],previous=refazer?null:resultadosDesafios[moduleId];area.hidden=false;area.replaceChildren();
 const head=document.createElement("div");head.className="challenge-workspace-head";const copy=document.createElement("div");
 const eyebrow=document.createElement("small");eyebrow.textContent="SIMULAÇÃO DE SITUAÇÕES";const heading=document.createElement("h2");heading.textContent=m.titulo;copy.append(eyebrow,heading);
 const close=document.createElement("button");close.type="button";close.className="secondary challenge-close";close.textContent="Fechar ×";close.addEventListener("click",()=>{area.hidden=true;area.replaceChildren();});head.append(copy,close);
 const intro=document.createElement("p");intro.className="challenge-intro";intro.textContent="Leia cada cenário, escolha a alternativa que representa a melhor decisão e confira o resultado ao finalizar.";
 const statusRow=document.createElement("div");statusRow.className="challenge-live-progress";const progressText=document.createElement("strong");progressText.textContent=(previous?.completed?"3":"0")+" de "+items.length+" respondidas";
 const progressTrack=document.createElement("div");progressTrack.className="challenge-live-track";const progressFill=document.createElement("span");progressFill.style.width=previous?.completed?"100%":"0%";progressTrack.appendChild(progressFill);statusRow.append(progressText,progressTrack);
 const form=document.createElement("form");form.className="challenge-form";
 items.forEach((item,index)=>{
  const field=document.createElement("fieldset");field.className="challenge-question";const questionTop=document.createElement("div");questionTop.className="challenge-question-top";
  const number=document.createElement("span");number.className="challenge-question-number";number.textContent=String(index+1).padStart(2,"0");const questionType=document.createElement("small");questionType.textContent="SITUAÇÃO "+(index+1);questionTop.append(number,questionType);
  const legend=document.createElement("legend");legend.textContent=item.pergunta;field.append(questionTop,legend);const options=document.createElement("div");options.className="challenge-options";
  const order=item.opcoes.map((_,i)=>i).sort((a,b)=>((a+index)%item.opcoes.length)-((b+index)%item.opcoes.length));
  order.forEach(optionIndex=>{
   const label=document.createElement("label");label.className="challenge-answer";const input=document.createElement("input");input.type="radio";input.name="challenge-"+index;input.value=String(optionIndex);input.checked=previous?.respostas?.[index]===optionIndex;input.disabled=Boolean(previous?.completed);
   const marker=document.createElement("span");marker.className="challenge-answer-marker";const answerText=document.createElement("span");answerText.className="challenge-answer-text";answerText.textContent=item.opcoes[optionIndex];label.append(input,marker,answerText);options.appendChild(label);
  });field.appendChild(options);
  if(previous?.completed){const explain=document.createElement("div");explain.className="challenge-explanation "+(previous.respostas[index]===item.correta?"is-correct":"is-wrong");const explainTitle=document.createElement("strong");explainTitle.textContent=previous.respostas[index]===item.correta?"Resposta correta":"Revise esta situação";const explainText=document.createElement("p");explainText.textContent="Resposta: "+item.opcoes[item.correta]+". "+item.explicacao;explain.append(explainTitle,explainText);field.appendChild(explain);}
  form.appendChild(field);
 });
 const actions=document.createElement("div");actions.className="challenge-submit-row";const submit=document.createElement("button");submit.type="submit";submit.className="primary";submit.textContent=previous?.completed?"Refazer desafio ↻":"Conferir respostas →";submit.disabled=!previous?.completed;const feedback=document.createElement("div");feedback.className="challenge-result";
 if(previous?.completed){feedback.classList.add("is-visible");feedback.innerHTML='<strong>Resultado anterior: '+previous.score+'/'+items.length+'</strong><span>'+(previous.score===items.length?"Todas as questões corretas!":"Confira as explicações e tente novamente para melhorar.")+'</span>';}
 actions.append(submit);form.append(actions,feedback);
 if(!previous?.completed){const updateProgress=()=>{const answered=items.filter((_,i)=>form.querySelector('input[name="challenge-'+i+'"]:checked')).length;progressText.textContent=answered+" de "+items.length+" respondidas";progressFill.style.width=(answered/items.length*100)+"%";submit.disabled=answered!==items.length;};form.addEventListener("change",updateProgress);updateProgress();}
 form.addEventListener("submit",async e=>{
  e.preventDefault();if(!sessaoAtual){mostrarToast("Entre na conta para registrar o desafio.");mostrarAcesso();return;}if(previous?.completed){abrirDesafio(moduleId,true);return;}
  const answers=items.map((_,i)=>{const selected=form.querySelector('input[name="challenge-'+i+'"]:checked');return selected?Number(selected.value):null;});if(answers.some(v=>v===null)){mostrarToast("Responda às três situações antes de finalizar.");return;}
  const score=items.reduce((sum,item,i)=>sum+(answers[i]===item.correta?1:0),0),date=new Date().toISOString(),entry={moduleId,score,respostas:answers,data:date},attempts=[...(resultadosDesafios[moduleId]?.attempts||[]),entry].slice(-50);
  resultadosDesafios[moduleId]={completed:true,score,respostas:answers,data:date,attempts};historicoDesafios=[...historicoDesafios,entry].slice(-50);salvarDesafiosSalvos();
  const completeModules=modulos.filter(moduloCompleto).map(x=>x.id);const {error:saveError}=await supabaseClient.from("student_progress").upsert({user_id:sessaoAtual.user.id,completed_lessons:aulasConcluidas,completed_modules:completeModules,weekly_activity:atividadesSemanais,quiz_score:pontuacaoAtual,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(saveError)console.warn("Desafio guardado localmente; falha ao sincronizar conclusão de módulos",saveError);
  atualizarResumo();abrirDesafio(moduleId);mostrarToast("Desafio concluído!");
 });
 area.append(head,intro,statusRow,form);area.scrollIntoView({behavior:"smooth",block:"start"});
}
/* ===== 17. Histórico e gráficos de desempenho ===== */

function renderizarHistorico(){
const resultados=lerResultadosQuizzes(),quizCount=quantidadeQuizzesConcluidos(),challengeCount=quantidadeDesafiosConcluidos(),generalCount=historicoQuizGeral.length,notes=[];
Object.values(resultados).forEach(r=>{
 const tentativas=Array.isArray(r.tentativas)&&r.tentativas.length?r.tentativas:[r];
 tentativas.forEach(t=>notes.push(Math.round((Number(t.score)||0)/3*100)));
});
historicoQuizGeral.forEach(r=>notes.push(Number(r.score)||0));
historicoDesafios.forEach(r=>notes.push(Math.round((Number(r.score)||0)/3*100)));
const avg=notes.length?Math.round(notes.reduce((a,b)=>a+b,0)/notes.length):null;
const q=document.getElementById("historyLessonQuizzes"),d=document.getElementById("historyChallenges"),g=document.getElementById("historyGeneralAttempts"),a=document.getElementById("historyAverage");
if(q)q.textContent=quizCount+"/17";if(d)d.textContent=challengeCount+"/4";if(g)g.textContent=generalCount;if(a)a.textContent=avg===null?"—":avg+"%";
const container=document.getElementById("historyActivities");if(!container)return;container.replaceChildren();const entries=[];
Object.entries(resultados).forEach(([id,r])=>{
 const lesson=buscarAulaId(id);if(!lesson)return;
 const tentativas=Array.isArray(r.tentativas)&&r.tentativas.length?r.tentativas:[r];
 tentativas.forEach((attempt,index)=>entries.push({type:index===tentativas.length-1?"Quiz da aula":"Tentativa anterior",title:lesson.nome,details:lesson.module.titulo,date:attempt.data||r.data,score:Math.round((Number(attempt.score)||0)/3*100)}));
});
historicoQuizGeral.forEach(r=>entries.push({type:"Quiz geral",title:"Avaliação geral",details:"Hardware e Software",date:r.data,score:r.score}));
historicoDesafios.forEach(r=>{const module=modulos.find(m=>m.id===r.moduleId);entries.push({type:"Desafio prático",title:module?.titulo||"Desafio",details:"Tentativa registrada",date:r.data,score:Math.round((Number(r.score)||0)/3*100)});});
entries.sort((a,b)=>new Date(b.date)-new Date(a.date));renderizarGraficosHistorico(entries,quizCount,challengeCount);
if(!entries.length){const empty=document.createElement("p");empty.className="history-empty";empty.textContent="Ainda não há atividades. Faça uma aula, quiz ou desafio para iniciar seu histórico.";container.appendChild(empty);return;}
entries.slice(0,50).forEach(entry=>{const row=document.createElement("div");row.className="history-activity";const icon=document.createElement("span");icon.className="history-activity-icon";icon.textContent=entry.type.includes("Desafio")?"◆":entry.type.includes("geral")?"★":"✓";const copy=document.createElement("div");copy.className="history-activity-copy";const title=document.createElement("strong");title.textContent=entry.title;const detail=document.createElement("small");detail.textContent=entry.type+" · "+entry.details+" · "+(entry.date?new Date(entry.date).toLocaleString("pt-BR"):"data indisponível");copy.append(title,detail);const score=document.createElement("span");score.className="history-activity-score";score.textContent=entry.score===undefined?"":entry.score+"%";row.append(icon,copy,score);container.appendChild(row);});
}
function renderizarGraficosHistorico(entries,quizCount,challengeCount){
const evolution=document.getElementById("historyEvolutionChart"),lessons=document.getElementById("historyLessonChart"),activities=document.getElementById("historyActivityChart");if(!evolution||!lessons||!activities)return;
const scores=entries.filter(e=>typeof e.score==="number"&&!Number.isNaN(e.score)).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(-8);evolution.replaceChildren();
if(scores.length){const bars=document.createElement("div");bars.className="history-evolution-bars";scores.forEach(e=>{const item=document.createElement("div");item.className="history-evolution-item";const bar=document.createElement("div");bar.className="history-evolution-bar-wrap";const fill=document.createElement("div");fill.className="history-evolution-bar";fill.style.height=Math.max(5,Math.min(100,e.score))+"%";fill.title=e.score+"%";const val=document.createElement("span");val.className="history-evolution-value";val.textContent=e.score+"%";fill.appendChild(val);bar.appendChild(fill);const label=document.createElement("small");label.textContent=e.date?new Date(e.date).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}):"—";fill.title=(e.title||"Avaliação")+" · "+e.score+"% · "+(e.date?new Date(e.date).toLocaleString("pt-BR"):"data indisponível");item.append(bar,label);bars.appendChild(item);});evolution.appendChild(bars);const legend=document.createElement("div");legend.className="history-chart-legend";legend.textContent="Últimas "+scores.length+" avaliações registradas";evolution.appendChild(legend);}else{const empty=document.createElement("p");empty.className="history-chart-empty";empty.textContent="Conclua quizzes ou desafios para ver sua evolução.";evolution.appendChild(empty);}
lessons.replaceChildren();const completed=Math.max(0,Math.min(17,quizCount)),pct=Math.round(completed/17*100);const ring=document.createElement("div");ring.className="history-lesson-ring";ring.style.background="conic-gradient(#1765ed "+pct+"%, #e8eefb 0)";const center=document.createElement("div");center.className="history-lesson-ring-center";center.innerHTML="<strong>"+completed+"/17</strong><small>quizzes</small>";ring.appendChild(center);const info=document.createElement("div");info.className="history-lesson-legend";const done=document.createElement("span");done.className="history-legend-dot done";done.textContent="Concluídas · "+completed;const pending=document.createElement("span");pending.className="history-legend-dot pending";pending.textContent="Pendentes · "+(17-completed);info.append(done,pending);lessons.append(ring,info);
activities.replaceChildren();const quizTotal=entries.filter(e=>e.type.includes("Quiz")).length,challengeTotal=entries.filter(e=>e.type.includes("Desafio")).length,generalTotal=entries.filter(e=>e.type.includes("geral")).length,total=quizTotal+challengeTotal+generalTotal;[{label:"Quizzes das aulas",count:quizTotal,color:"blue"},{label:"Desafios",count:challengeTotal,color:"purple"},{label:"Quiz geral",count:generalTotal,color:"green"}].forEach(item=>{const row=document.createElement("div");row.className="history-activity-bar-row"+(item.count===0?" is-zero":"");const label=document.createElement("span");label.textContent=item.label;const track=document.createElement("div");track.className="history-activity-bar-track";const fill=document.createElement("div");fill.className="history-activity-bar-fill "+item.color;fill.style.width=(total?item.count/total*100:0)+"%";track.appendChild(fill);const count=document.createElement("strong");count.textContent=item.count;if(item.count===0)track.hidden=true;row.append(label,track,count);activities.appendChild(row);});const foot=document.createElement("small");foot.className="history-chart-legend";foot.textContent="Total de registros: "+total;activities.appendChild(foot);
}
/* ===== 18. Utilitários de identificação de aulas ===== */

function buscarAulaId(id){for(const m of modulos){const index=m.aulas.findIndex((_,i)=>idDaAula(m,i)===id);if(index>=0)return{module:m,nome:m.aulas[index],indice:index};}return null;}
document.addEventListener("DOMContentLoaded", iniciarPortal);
