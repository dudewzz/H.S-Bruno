/* ===== 01. Armazenamento local e estado ===== */

function lerArmazenamento(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (erro) {
        console.warn("Não foi possível acessar os dados salvos.", erro);
        return null;
    }
}

function carregarLista(chave) {
    try {
        const valor = JSON.parse(lerArmazenamento(chave) || "[]");
        if (!Array.isArray(valor)) return [];
        return [...new Set(valor.filter(id => modulos.some(modulo => modulo.id === id)))];
    } catch (erro) {
        console.warn("Não foi possível ler os dados salvos.", erro);
        return [];
    }
}

function salvar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (erro) {
        mostrarToast("Não foi possível salvar neste navegador.");
        console.error(erro);
        return false;
    }
}

/* ===== 02. Tema e preferências visuais ===== */

function configurarTema() {
    const botao = document.getElementById("themeToggle");
    const temaSalvo = lerArmazenamento("hsbruno_theme");
    const tema = temaSalvo === "dark" ? "dark" : "light";
    document.body.classList.toggle("dark-mode", tema === "dark");
    atualizarBotaoTema();
    botao?.addEventListener("click", () => {
        const escuro = !document.body.classList.contains("dark-mode");
        document.body.classList.toggle("dark-mode", escuro);
        try { localStorage.setItem("hsbruno_theme", escuro ? "dark" : "light"); } catch (erro) {
            console.warn("Não foi possível salvar a preferência de tema.", erro);
        }
        atualizarBotaoTema();
    });
}

function atualizarBotaoTema() {
    const botao = document.getElementById("themeToggle");
    if (!botao) return;
    const escuro = document.body.classList.contains("dark-mode");
    botao.textContent = escuro ? "☀" : "☾";
    botao.setAttribute("aria-label", escuro ? "Ativar modo claro" : "Ativar modo escuro");
    botao.title = escuro ? "Ativar modo claro" : "Ativar modo escuro";
}

/* ===== 03. Metas e atividade semanal ===== */

function chaveAtividadeSemanal() {
    return "hsbruno_weekly_" + (sessaoAtual?.user?.id || "visitante");
}

function lerAtividadeSemanalLocal() {
    try {
        const valor = JSON.parse(localStorage.getItem(chaveAtividadeSemanal()) || "[]");
        return Array.isArray(valor) ? valor : [];
    } catch (_) {
        return [];
    }
}

function normalizarAtividadesSemanais(lista) {
    const porAula = new Map();
    const idsValidos = new Set(modulos.flatMap(modulo =>
        modulo.aulas.map((_, indice) => idDaAula(modulo, indice))
    ));

    (Array.isArray(lista) ? lista : []).forEach(item => {
        if (!item || !idsValidos.has(item.id)) return;
        const data = new Date(item.data);
        if (Number.isNaN(data.getTime())) return;
        const anterior = porAula.get(item.id);
        if (!anterior || new Date(anterior.data) < data) {
            porAula.set(item.id, { id: item.id, data: data.toISOString() });
        }
    });

    return [...porAula.values()];
}

function prepararAtividadeSemanal(idAula, concluida) {
    const atividades = atividadesSemanais.filter(item => item.id !== idAula);
    if (concluida && idAula) atividades.push({ id: idAula, data: new Date().toISOString() });
    return normalizarAtividadesSemanais(atividades);
}

function salvarCopiaLocalAtividadeSemanal(atividades) {
    try {
        localStorage.setItem(chaveAtividadeSemanal(), JSON.stringify(atividades));
    } catch (erro) {
        console.warn("Não foi possível salvar a cópia local da meta semanal.", erro);
    }
}

function inicioDaSemana(data = new Date()) {
    const inicio = new Date(data);
    inicio.setHours(0, 0, 0, 0);
    const dia = (inicio.getDay() + 6) % 7;
    inicio.setDate(inicio.getDate() - dia);
    return inicio;
}

function atualizarWidgetsDeMeta() {
    const inicioSemana = inicioDaSemana();
    const atividades = atividadesSemanais.filter(item => {
        const data = new Date(item.data);
        return item.id && !Number.isNaN(data.getTime()) && data >= inicioSemana;
    });
    const feitasSemana = new Set(atividades.map(item => item.id)).size;
    const weeklyDone = document.getElementById("weeklyDone");
    const weeklyBar = document.getElementById("weeklyBar");
    if (weeklyDone) weeklyDone.textContent = Math.min(feitasSemana, 3);
    if (weeklyBar) weeklyBar.style.width = Math.min(feitasSemana / 3 * 100, 100) + "%";
}

function proximaAulaPendente() {
    for (const modulo of modulos) {
        for (let indice = 0; indice < modulo.aulas.length; indice++) {
            if (!aulasConcluidas.includes(idDaAula(modulo, indice))) {
                return { modulo, indice, nome: modulo.aulas[indice] };
            }
        }
    }
    return null;
}

/* ===== 04. Modais, confirmações e notificações ===== */

function abrirModalModulo(id) {
    const modulo = modulos.find(item => item.id === id);
    const modal = document.getElementById("moduleModal");
    const conteudo = document.getElementById("moduleModalContent");
    if (!modulo || !modal || !conteudo) return;

    const feitas = aulasConcluidasDoModulo(modulo);
    conteudo.replaceChildren();
    const cabecalho = document.createElement("div");
    cabecalho.className = "module-modal-head";
    const tituloArea = document.createElement("div");
    const etiqueta = document.createElement("small");
    etiqueta.className = "module-modal-kicker";
    etiqueta.textContent = modulo.area + " · EMENTA";
    const titulo = document.createElement("h2");
    titulo.id = "moduleModalTitle";
    titulo.textContent = modulo.titulo.replace(modulo.area + " — ", "Módulo ");
    tituloArea.append(etiqueta, titulo);
    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "module-modal-close";
    fechar.setAttribute("aria-label", "Fechar ementa");
    fechar.textContent = "×";
    fechar.addEventListener("click", fecharModalModulo);
    cabecalho.append(tituloArea, fechar);

    const descricao = document.createElement("p");
    descricao.className = "module-modal-description";
    descricao.textContent = modulo.descricao;
    const progresso = document.createElement("p");
    progresso.className = "module-modal-progress";
    progresso.textContent = feitas + " de " + modulo.aulas.length + " aulas concluídas";

    const lista = document.createElement("div");
    lista.className = "module-modal-list";
    modulo.aulas.forEach((nomeAula, indice) => {
        const id = idDaAula(modulo, indice);
        const linha = document.createElement("div");
        linha.className = "module-modal-lesson";
        const texto = document.createElement("span");
        texto.textContent = String(indice + 1).padStart(2, "0") + " · " + nomeAula;
        const abrirAula = document.createElement("button");
        abrirAula.type = "button";
        abrirAula.className = "module-modal-open-lesson";
        abrirAula.textContent = "Abrir aula";
        abrirAula.addEventListener("click", () => {
            fecharModalModulo();
            abrirModulo(modulo.id);
            selecionarAula(indice);
        });
        linha.append(texto, abrirAula);
        lista.appendChild(linha);
    });

    const rodape = document.createElement("div");
    rodape.className = "module-modal-footer";
    const dica = document.createElement("small");
    dica.textContent = "Conclua o quiz de cada aula para registrar seu progresso.";
    const botaoFechar = document.createElement("button");
    botaoFechar.type = "button";
    botaoFechar.className = "primary";
    botaoFechar.textContent = "Concluir";
    botaoFechar.addEventListener("click", fecharModalModulo);
    rodape.append(dica, botaoFechar);
    conteudo.append(cabecalho, descricao, progresso, lista, rodape);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function fecharModalModulo() {
    const modal = document.getElementById("moduleModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function configurarModalModulo() {
    const modal = document.getElementById("moduleModal");
    modal?.addEventListener("click", evento => {
        if (evento.target === modal) fecharModalModulo();
    });
    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") fecharModalModulo();
    });
}

async function salvarListaAulas(novasAulas, idAulaAlterada, foiConcluida) {
    if (!sessaoAtual) {
        mostrarToast("Entre na sua conta para registrar as aulas concluídas.");
        mostrarAcesso();
        return false;
    }

    const idsValidos = modulos.flatMap(modulo => modulo.aulas.map((_, indice) => idDaAula(modulo, indice)));
    const resultadosQuiz = lerResultadosQuizzes();
    const listaValida = [...new Set(novasAulas.filter(id => idsValidos.includes(id) && (resultadosQuiz[id] || !foiConcluida)))];
    const novosModulos = modulos.filter(modulo => modulo.aulas.every((_, indice) => {
        const id = idDaAula(modulo, indice);
        return listaValida.includes(id) && videosAssistidos.includes(id) && Boolean(resultadosQuiz[id]);
    }) && Boolean(resultadosDesafios[modulo.id]?.completed)).map(modulo => modulo.id);
    const novasAtividadesSemanais = prepararAtividadeSemanal(idAulaAlterada, foiConcluida);

    const { error } = await supabaseClient.from("student_progress").upsert({
        user_id: sessaoAtual.user.id,
        completed_lessons: listaValida,
        completed_modules: novosModulos,
        weekly_activity: novasAtividadesSemanais,
        quiz_score: pontuacaoAtual,
        updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });

    if (error) {
        console.error("Erro ao salvar progresso:", error);
        mostrarToast("Não foi possível atualizar o progresso. Tente novamente.");
        return false;
    }

    aulasConcluidas = listaValida;
    atualizarModulosConcluidos();
    atividadesSemanais = novasAtividadesSemanais;
    salvarCopiaLocalAtividadeSemanal(atividadesSemanais);
    atualizarResumo();
    if (moduloAtual) renderizarListaAulas(moduloAtual);
    mostrarToast(foiConcluida ? "Aula marcada como concluída!" : "Aula removida das concluídas.");
    return true;
}


function confirmarAcao(mensagem) {
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.className = "confirm-overlay";
        const caixa = document.createElement("section");
        caixa.className = "confirm-dialog";
        caixa.setAttribute("role", "dialog");
        caixa.setAttribute("aria-modal", "true");
        caixa.setAttribute("aria-labelledby", "confirmTitle");
        const icone = document.createElement("div");
        icone.className = "confirm-icon";
        icone.textContent = "!";
        const titulo = document.createElement("h2");
        titulo.id = "confirmTitle";
        titulo.textContent = "Confirmar ação";
        const texto = document.createElement("p");
        texto.textContent = mensagem;
        const botoes = document.createElement("div");
        botoes.className = "confirm-actions";
        const cancelar = document.createElement("button");
        cancelar.type = "button";
        cancelar.className = "confirm-cancel";
        cancelar.textContent = "Cancelar";
        const confirmar = document.createElement("button");
        confirmar.type = "button";
        confirmar.className = "confirm-accept";
        confirmar.textContent = "Confirmar";
        botoes.append(cancelar, confirmar);
        caixa.append(icone, titulo, texto, botoes);
        overlay.appendChild(caixa);
        document.body.appendChild(overlay);
        const finalizar = resultado => {
            overlay.remove();
            document.removeEventListener("keydown", teclaEsc);
            resolve(resultado);
        };
        const teclaEsc = evento => {
            if (evento.key === "Escape") finalizar(false);
        };
        cancelar.addEventListener("click", () => finalizar(false));
        confirmar.addEventListener("click", () => finalizar(true));
        overlay.addEventListener("click", evento => {
            if (evento.target === overlay) finalizar(false);
        });
        document.addEventListener("keydown", teclaEsc);
        confirmar.focus();
    });
}

function mostrarToast(mensagem) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add("show");
    clearTimeout(mostrarToast.timer);
    mostrarToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ===== 05. Navegação e componentes de módulos ===== */

function navegar(pagina) {
    const destino = document.getElementById(pagina);
    if (!destino) return;

    document.querySelectorAll(".page").forEach(secao => secao.classList.remove("active"));
    destino.classList.add("active");

    document.querySelectorAll(".nav-link").forEach(link => {
        const ativo = link.dataset.page === pagina;
        link.classList.toggle("active", ativo);
        if (ativo) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    if (pagina === "progresso") atualizarPainelProgresso();
    if (pagina === "perfil") renderizarPerfilAluno();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function criarCard(modulo){const artigo=document.createElement("article");artigo.className="module-card";artigo.dataset.area=modulo.area;artigo.dataset.moduleId=modulo.id;artigo.dataset.search=(modulo.titulo+" "+modulo.descricao+" "+modulo.aulas.join(" ")).toLocaleLowerCase("pt-BR");const imagem=document.createElement("img");imagem.src=modulo.imagem;imagem.alt="Imagem ilustrativa do tema "+modulo.area;imagem.loading="lazy";imagem.onerror=()=>{imagem.hidden=true;};const corpo=document.createElement("div");corpo.className="module-body";const area=document.createElement("small");area.className="module-area-tag";area.textContent=modulo.area;const titulo=document.createElement("h3");titulo.textContent=modulo.titulo.replace(modulo.area+" — ","Módulo ");const descricao=document.createElement("p");descricao.textContent=modulo.descricao;const prog=document.createElement("small");prog.className="module-modal-progress";prog.textContent=progressoModulo(modulo)+"% das atividades concluídas";const botao=document.createElement("button");botao.className="primary";botao.type="button";botao.textContent=moduloCompleto(modulo)?"Revisar módulo →":"Começar →";botao.addEventListener("click",()=>abrirModalModulo(modulo.id));corpo.append(area,titulo,descricao,prog,botao);artigo.append(imagem,corpo);return artigo;}

function criarCardInicio(modulo){const artigo=document.createElement("article");artigo.className="home-module-card";artigo.dataset.area=modulo.area;artigo.dataset.moduleId=modulo.id;const imagem=document.createElement("div");imagem.className="home-module-image";imagem.style.backgroundImage="url('"+modulo.imagem+"')";const corpo=document.createElement("div");corpo.className="home-module-body";const titulo=document.createElement("h3");titulo.textContent=modulo.area;const subtitulo=document.createElement("p");subtitulo.textContent=modulo.titulo.replace(modulo.area+" — ","Módulo ");const percent=progressoModulo(modulo),linha=document.createElement("div");linha.className="home-module-progress";const trilho=document.createElement("span"),barra=document.createElement("i");barra.style.width=percent+"%";trilho.appendChild(barra);const valor=document.createElement("b");valor.textContent=percent+"%";linha.append(trilho,valor);const botao=document.createElement("button");botao.type="button";botao.className="home-module-button";botao.textContent=percent===0?"▶  Começar":"▶  Continuar";botao.addEventListener("click",()=>abrirModalModulo(modulo.id));if(percent===100){const selo=document.createElement("span");selo.className="home-module-done";selo.textContent="✓";imagem.appendChild(selo);botao.textContent="✓  Revisar";}corpo.append(titulo,subtitulo,linha,botao);artigo.append(imagem,corpo);return artigo;}

function renderizarModulos(){const inicio=document.getElementById("homeModules"),todos=document.getElementById("allModules");if(inicio)inicio.replaceChildren(...modulos.map(criarCardInicio));if(todos){const filtrados=modulos.filter(m=>{const feitas=tarefasConcluidasModulo(m),total=totalTarefasModulo(m);if(filtroAtual==="Hardware"||filtroAtual==="Software")return m.area===filtroAtual;if(filtroAtual==="Em andamento")return feitas>0&&feitas<total;if(filtroAtual==="Concluídos")return moduloCompleto(m);return true;});todos.replaceChildren(...filtrados.map(criarCard));}aplicarPesquisa();}

/* ===== 06. Aulas, vídeos e conclusão ===== */

function idDaAula(modulo, indice) {
    return modulo.id + "-aula-" + (indice + 1);
}

function aulasConcluidasDoModulo(modulo) {
    return modulo.aulas.filter((_, indice) => aulasConcluidas.includes(idDaAula(modulo, indice))).length;
}

function atualizarModulosConcluidos(){concluidos=modulos.filter(modulo=>moduloCompleto(modulo)).map(modulo=>modulo.id);}

function renderizarListaAulas(modulo) {
    const lista = document.getElementById("lessonList");
    const selecionado = document.getElementById("lessonSelected");
    const contador = document.getElementById("lessonCount");
    if (!lista || !selecionado || !contador) return;
    lista.replaceChildren();
    const feitas = aulasConcluidasDoModulo(modulo);
    contador.textContent = feitas + "/" + modulo.aulas.length + " aulas concluídas";
    modulo.aulas.forEach((aula, indice) => {
        const concluida = aulasConcluidas.includes(idDaAula(modulo, indice));
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "lesson-item" + (indice === aulaAtualIndice ? " active" : "");
        botao.textContent = String(indice + 1).padStart(2, "0") + " · " + aula;
        botao.setAttribute("aria-pressed", indice === aulaAtualIndice ? "true" : "false");
        botao.addEventListener("click", () => selecionarAula(indice));
        lista.appendChild(botao);
    });
    selecionado.textContent = modulo.aulas.length ? "Aula selecionada: " + modulo.aulas[aulaAtualIndice] : "Nenhuma aula cadastrada neste módulo.";
}


function quizDaAulaFoiConcluido(idAula) {
    return Boolean(lerResultadosQuizzes()[idAula]);
}

function atualizarBotaoProximaAula() {
    const botao = document.getElementById("nextLessonButton");
    if (!botao || !moduloAtual) return;
    const idAula = idDaAula(moduloAtual, aulaAtualIndice);
    const quizConcluido = quizDaAulaFoiConcluido(idAula);
    const indiceModulo = modulos.findIndex(modulo => modulo.id === moduloAtual.id);
    const temProximaNaAula = aulaAtualIndice + 1 < moduloAtual.aulas.length;
    const temProximoModulo = indiceModulo >= 0 && indiceModulo + 1 < modulos.length;
    if (!quizConcluido) {
        botao.disabled = true;
        botao.textContent = "Faça o quiz para continuar";
    } else if (temProximaNaAula || temProximoModulo) {
        botao.disabled = false;
        botao.textContent = "Próxima aula →";
    } else {
        botao.disabled = true;
        botao.textContent = "Última aula";
    }
}

function selecionarAula(indice) {
    if (!moduloAtual || indice < 0 || indice >= moduloAtual.aulas.length) return;
    aulaAtualIndice = indice;
    renderizarListaAulas(moduloAtual);
    carregarVideoDaAula();
    atualizarBotaoProximaAula();
}

function carregarVideoDaAula() {
    if (!moduloAtual) return;
    const videoContainer = document.getElementById("moduleVideo");
    if (!videoContainer) return;
    videoContainer.replaceChildren();
    const caminhoVideo = "videos/" + moduloAtual.id + "-aula-" + (aulaAtualIndice + 1) + ".mp4";
    const nomeAula = moduloAtual.aulas[aulaAtualIndice];
    const player = document.createElement("video");
    player.className = "module-player";
    player.controls = true;
    player.preload = "metadata";
    player.playsInline = true;
    player.setAttribute("aria-label", "Videoaula: " + nomeAula);
    player.style.width = "100%";
    player.style.maxHeight = "480px";
    player.style.aspectRatio = "16 / 9";
    player.style.display = "block";
    player.style.background = "#101010";
    player.style.borderRadius = "12px";
    player.style.objectFit = "contain";
    player.addEventListener("ended", concluirAulaAtual);
    const fonte = document.createElement("source");
    fonte.src = caminhoVideo;
    fonte.type = "video/mp4";
    player.appendChild(fonte);
    player.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "video-placeholder";
        const tituloAviso = document.createElement("h3");
        tituloAviso.textContent = "Vídeo ainda não adicionado";
        const descricaoAviso = document.createElement("p");
        descricaoAviso.textContent = "Adicione o vídeo MP4 desta aula neste caminho:";
        const caminho = document.createElement("small");
        caminho.textContent = caminhoVideo;
        placeholder.append(tituloAviso, descricaoAviso, caminho);
        videoContainer.replaceChildren(placeholder);
    }, { once: true });
    videoContainer.appendChild(player);
    renderizarQuizDaAula();
    atualizarBotaoProximaAula();
}

/* ===== 07. Persistência de vídeos, desafios e quizzes ===== */

function chaveVideosAssistidos(){return "hsbruno_videos_assistidos_"+(sessaoAtual?.user?.id||"visitante");}
function lerVideosAssistidos(){try{const v=JSON.parse(localStorage.getItem(chaveVideosAssistidos())||"[]");return Array.isArray(v)?v:[];}catch(_){return [];}}
function salvarVideosAssistidos(v){videosAssistidos=[...new Set(v)];try{localStorage.setItem(chaveVideosAssistidos(),JSON.stringify(videosAssistidos));}catch(_){mostrarToast("Não foi possível guardar o registro de vídeo neste dispositivo.");}}
function chaveDesafios(){return "hsbruno_desafios_"+(sessaoAtual?.user?.id||"visitante");}
function lerDesafiosSalvos(){try{const v=JSON.parse(localStorage.getItem(chaveDesafios())||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:{resultados:{},historico:[]};}catch(_){return {resultados:{},historico:[]};}}
function salvarDesafiosSalvos(){try{localStorage.setItem(chaveDesafios(),JSON.stringify({resultados:resultadosDesafios,historico:historicoDesafios}));}catch(_){mostrarToast("Não foi possível guardar os desafios neste dispositivo.");}}
function chaveHistoricoQuizGeral(){return "hsbruno_quiz_geral_historico_"+(sessaoAtual?.user?.id||"visitante");}
function lerHistoricoQuizGeral(){try{const v=JSON.parse(localStorage.getItem(chaveHistoricoQuizGeral())||"[]");return Array.isArray(v)?v:[];}catch(_){return [];}}
function salvarHistoricoQuizGeral(list){historicoQuizGeral=list.slice(-50);try{localStorage.setItem(chaveHistoricoQuizGeral(),JSON.stringify(historicoQuizGeral));}catch(_){mostrarToast("Não foi possível guardar o histórico de avaliações.");}}
function chaveQuizzesDoUsuario() {
    return "hsbruno_quizzes_aulas_" + (sessaoAtual?.user?.id || "visitante");
}

function lerResultadosQuizzes() {
    try {
        const dados = JSON.parse(localStorage.getItem(chaveQuizzesDoUsuario()) || "{}");
        return dados && typeof dados === "object" && !Array.isArray(dados) ? dados : {};
    } catch (_) {
        return {};
    }
}

function salvarResultadoQuizAula(idAula, resultado) {
    const resultados = lerResultadosQuizzes();
    resultados[idAula] = resultado;
    try {
        localStorage.setItem(chaveQuizzesDoUsuario(), JSON.stringify(resultados));
    } catch (_) {
        mostrarToast("Não foi possível guardar a pontuação deste quiz neste dispositivo.");
    }
}
