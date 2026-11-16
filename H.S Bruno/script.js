/* =====================================================
   H.S. BRUNO — PORTAL DE ESTUDOS
   Funcionalidades principais
===================================================== */

"use strict";

const STORAGE = {
    progress: "hsbruno_modulos_concluidos_v2",
    score: "hsbruno_ultima_pontuacao_v2"
};

const SUPABASE_URL = "https://iivvqoipxeuyatatzkmt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_a4z_om77FoLDDkLsRlEJ9A_1zYFOLRG";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);



const modulos = [
    {
        id: "hardware-1",
        video: "videos/hardware-1.mp4",
        area: "Hardware",
        titulo: "Hardware — Módulo 1",
        descricao: "Conheça os principais componentes e entenda como um computador funciona.",
        imagem: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=80",
        aulas: ["Introdução ao hardware", "Memória RAM", "Armazenamento", "Placa-mãe", "Processador"]
    },
    {
        id: "hardware-2",
        video: "videos/hardware-2.mp4",
        area: "Hardware",
        titulo: "Hardware — Módulo 2",
        descricao: "Aprenda cuidados, montagem, limpeza e diagnóstico de computadores.",
        imagem: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
        aulas: ["Ferramentas e segurança", "Montagem do computador", "Limpeza preventiva", "Diagnóstico de falhas"]
    },
    {
        id: "software-1",
        video: "videos/software-1.mp4",
        area: "Software",
        titulo: "Software — Módulo 1",
        descricao: "Entenda os programas, sistemas operacionais e a organização de arquivos.",
        imagem: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
        aulas: ["O que é software?", "Sistemas operacionais", "Arquivos e pastas", "Instalação e atualização de programas"]
    },
    {
        id: "software-2",
        video: "videos/software-2.mp4",
        area: "Software",
        titulo: "Software — Módulo 2",
        descricao: "Conheça aplicativos, segurança digital e boas práticas no uso do computador.",
        imagem: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        aulas: ["Aplicativos e utilitários", "Segurança digital", "Antivírus e atualizações", "Solução de problemas de software"]
    }
];

const perguntas = [
    { area: "Hardware", pergunta: "Qual componente executa as instruções dos programas?", opcoes: ["Memória RAM", "Processador (CPU)", "SSD", "Fonte"], correta: 1, explicacao: "A CPU interpreta e executa as instruções dos programas." },
    { area: "Hardware", pergunta: "Qual é a principal função da memória RAM?", opcoes: ["Armazenar arquivos permanentemente", "Exibir imagens", "Guardar temporariamente dados em uso", "Fornecer energia"], correta: 2, explicacao: "A RAM mantém temporariamente os dados necessários aos programas em execução." },
    { area: "Hardware", pergunta: "Qual dispositivo normalmente armazena o sistema operacional mesmo após desligar o PC?", opcoes: ["RAM", "SSD ou HD", "Cooler", "Placa de vídeo"], correta: 1, explicacao: "SSD e HD são unidades de armazenamento não volátil." },
    { area: "Hardware", pergunta: "A placa-mãe serve principalmente para:", opcoes: ["Conectar e permitir a comunicação entre componentes", "Resfriar o processador", "Armazenar energia", "Substituir a memória RAM"], correta: 0, explicacao: "A placa-mãe interliga os componentes e permite que se comuniquem." },
    { area: "Hardware", pergunta: "Qual cuidado é importante antes de limpar o interior do computador?", opcoes: ["Deixá-lo ligado", "Molhar as peças", "Desligar e desconectar da energia", "Retirar o processador"], correta: 2, explicacao: "Desligar e desconectar o equipamento reduz riscos elétricos e danos." },
    { area: "Hardware", pergunta: "Qual componente é responsável por fornecer energia aos componentes do computador?", opcoes: ["Fonte de alimentação", "Memória RAM", "SSD", "Cooler"], correta: 0, explicacao: "A fonte converte e distribui energia elétrica para o computador." },
    { area: "Hardware", pergunta: "Um computador liga, mas apresenta temperatura muito alta. Qual pode ser uma causa?", opcoes: ["Pasta térmica ressecada ou ventilação obstruída", "Papel de parede", "Nome da pasta Documentos", "Brilho do monitor"], correta: 0, explicacao: "Problemas de refrigeração, poeira e pasta térmica podem elevar a temperatura." },
    { area: "Hardware", pergunta: "Qual destes é um periférico de entrada?", opcoes: ["Monitor", "Impressora", "Teclado", "Caixa de som"], correta: 2, explicacao: "O teclado envia informações e comandos ao computador." },
    { area: "Software", pergunta: "O que é software?", opcoes: ["Parte física do computador", "Conjunto de programas e instruções", "Somente o gabinete", "Um tipo de cabo"], correta: 1, explicacao: "Software é a parte lógica: programas, aplicativos e sistemas." },
    { area: "Software", pergunta: "Qual alternativa apresenta um sistema operacional?", opcoes: ["Windows", "Google Chrome", "Microsoft Word", "Photoshop"], correta: 0, explicacao: "Windows é um sistema operacional que gerencia o computador." },
    { area: "Software", pergunta: "Qual é a função de uma extensão como .pdf ou .jpg?", opcoes: ["Indicar o tipo/formato do arquivo", "Aumentar a memória RAM", "Ligar o computador", "Proteger contra quedas"], correta: 0, explicacao: "A extensão ajuda a identificar o formato e os aplicativos compatíveis." },
    { area: "Software", pergunta: "Qual prática ajuda a manter o sistema mais seguro?", opcoes: ["Desativar todas as atualizações", "Usar a mesma senha em tudo", "Manter sistema e programas atualizados", "Baixar qualquer arquivo desconhecido"], correta: 2, explicacao: "Atualizações corrigem falhas e podem melhorar a segurança." },
    { area: "Software", pergunta: "Para que serve um antivírus?", opcoes: ["Aumentar o tamanho da tela", "Detectar, bloquear ou remover ameaças", "Criar peças físicas", "Substituir o sistema operacional"], correta: 1, explicacao: "Antivírus ajuda a identificar e lidar com softwares maliciosos." },
    { area: "Software", pergunta: "O que acontece ao excluir um atalho da área de trabalho?", opcoes: ["O programa é sempre desinstalado", "O computador é formatado", "Normalmente apenas o atalho é removido", "A memória RAM é apagada"], correta: 2, explicacao: "Apagar um atalho não costuma desinstalar o aplicativo original." },
    { area: "Software", pergunta: "Qual atitude é mais segura ao receber um anexo inesperado?", opcoes: ["Abrir imediatamente", "Verificar remetente e contexto antes de abrir", "Encaminhar para todos", "Desativar o antivírus"], correta: 1, explicacao: "Anexos inesperados podem conter golpes ou arquivos maliciosos." },
    { area: "Software", pergunta: "Qual programa é usado principalmente para navegar na internet?", opcoes: ["Navegador", "Calculadora", "Bloco de Notas", "Gerenciador de tarefas"], correta: 0, explicacao: "Navegadores, como Firefox e Chrome, acessam páginas e serviços da web." }
];

let concluidos = [];
let aulasConcluidas = [];
let aulaAtualIndice = 0;
let pontuacaoAtual = null;
let sessaoAtual = null;
let modoCadastro = false;
let moduloAtual = null;
let indicePergunta = 0;
let respostas = {};
let filtroAtual = "Todos";
let avatarPerfilSelecionado = "🦊";

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

function criarCard(modulo) {
    const artigo = document.createElement("article");
    artigo.className = "module-card";
    artigo.dataset.area = modulo.area;
    artigo.dataset.search = (modulo.titulo + " " + modulo.descricao + " " + modulo.aulas.join(" ")).toLocaleLowerCase("pt-BR");

    const imagem = document.createElement("img");
    imagem.src = modulo.imagem;
    imagem.alt = "Imagem ilustrativa do tema " + modulo.area;
    imagem.loading = "lazy";
    imagem.onerror = () => { imagem.hidden = true; };

    const corpo = document.createElement("div");
    corpo.className = "module-body";

    const titulo = document.createElement("h3");
    titulo.textContent = modulo.titulo;

    const descricao = document.createElement("p");
    descricao.textContent = modulo.descricao;

    const botao = document.createElement("button");
    botao.className = "primary";
    botao.type = "button";
    botao.textContent = concluidos.includes(modulo.id) ? "Revisar módulo →" : "Começar módulo →";
    botao.addEventListener("click", () => abrirModulo(modulo.id));

    corpo.append(titulo, descricao, botao);
    artigo.append(imagem, corpo);
    return artigo;
}

function criarCardInicio(modulo) {
    const artigo = document.createElement("article");
    artigo.className = "home-module-card";
    const imagem = document.createElement("div");
    imagem.className = "home-module-image";
    imagem.style.backgroundImage = "url('" + modulo.imagem + "')";
    const corpo = document.createElement("div");
    corpo.className = "home-module-body";
    const titulo = document.createElement("h3");
    titulo.textContent = modulo.area;
    const subtitulo = document.createElement("p");
    subtitulo.textContent = modulo.titulo.replace(modulo.area + " — ", "Módulo ");
    const feitas = aulasConcluidasDoModulo(modulo);
    const percentual = Math.round(feitas / modulo.aulas.length * 100);
    const linha = document.createElement("div");
    linha.className = "home-module-progress";
    const trilho = document.createElement("span");
    const barra = document.createElement("i");
    barra.style.width = percentual + "%";
    trilho.appendChild(barra);
    const valor = document.createElement("b");
    valor.textContent = percentual + "%";
    linha.append(trilho, valor);
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "home-module-button";
    botao.textContent = percentual === 0 ? "▶  Começar" : "▶  Continuar";
    botao.addEventListener("click", () => abrirModulo(modulo.id));
    if (percentual === 100) {
        const selo = document.createElement("span");
        selo.className = "home-module-done";
        selo.textContent = "✓";
        imagem.appendChild(selo);
        botao.textContent = "✓  Revisar";
    }
    corpo.append(titulo, subtitulo, linha, botao);
    artigo.append(imagem, corpo);
    return artigo;
}

function renderizarModulos() {
    const inicio = document.getElementById("homeModules");
    const todos = document.getElementById("allModules");

    if (inicio) {
        inicio.replaceChildren(...modulos.map(criarCardInicio));
    }

    if (todos) {
        const filtrados = filtroAtual === "Todos"
            ? modulos
            : modulos.filter(modulo => modulo.area === filtroAtual);
        todos.replaceChildren(...filtrados.map(criarCard));
    }

    aplicarPesquisa();
}

function idDaAula(modulo, indice) {
    return modulo.id + "-aula-" + (indice + 1);
}

function aulasConcluidasDoModulo(modulo) {
    return modulo.aulas.filter((_, indice) => aulasConcluidas.includes(idDaAula(modulo, indice))).length;
}

function atualizarModulosConcluidos() {
    concluidos = modulos.filter(modulo => modulo.aulas.length > 0 && aulasConcluidasDoModulo(modulo) === modulo.aulas.length).map(modulo => modulo.id);
}

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
        botao.textContent = (concluida ? "✓ " : "") + String(indice + 1).padStart(2, "0") + " · " + aula;
        botao.setAttribute("aria-pressed", indice === aulaAtualIndice ? "true" : "false");
        botao.addEventListener("click", () => selecionarAula(indice));
        lista.appendChild(botao);
    });
    selecionado.textContent = modulo.aulas.length ? "Aula selecionada: " + modulo.aulas[aulaAtualIndice] : "Nenhuma aula cadastrada neste módulo.";
}

function selecionarAula(indice) {
    if (!moduloAtual || indice < 0 || indice >= moduloAtual.aulas.length) return;
    aulaAtualIndice = indice;
    renderizarListaAulas(moduloAtual);
    carregarVideoDaAula();
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
}

async function concluirAulaAtual() {
    if (!moduloAtual) return;
    if (!sessaoAtual) { mostrarToast("Entre na sua conta para salvar a aula concluída."); return; }
    const idAula = idDaAula(moduloAtual, aulaAtualIndice);
    if (aulasConcluidas.includes(idAula)) { mostrarToast("Esta aula já está concluída."); return; }
    const novasAulasConcluidas = [...aulasConcluidas, idAula];
    const novosModulosConcluidos = modulos.filter(modulo => modulo.aulas.length > 0 && modulo.aulas.every((_, indice) => novasAulasConcluidas.includes(idDaAula(modulo, indice)))).map(modulo => modulo.id);
    const { error } = await supabaseClient.from("student_progress").upsert({
        user_id: sessaoAtual.user.id,
        completed_lessons: novasAulasConcluidas,
        completed_modules: novosModulosConcluidos,
        quiz_score: pontuacaoAtual,
        updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (error) {
        console.error("Erro ao salvar aula concluída:", error);
        mostrarToast("Não foi possível salvar sua aula. Tente novamente.");
        return;
    }
    aulasConcluidas = novasAulasConcluidas;
    concluidos = novosModulosConcluidos;
    atualizarResumo();
    renderizarListaAulas(moduloAtual);
    mostrarToast(concluidos.includes(moduloAtual.id) ? "Parabéns! Você concluiu todas as aulas deste módulo." : "Aula concluída e progresso salvo!");
}

function abrirModulo(id) {
    const modulo = modulos.find(item => item.id === id);
    if (!modulo) return;
    moduloAtual = modulo;
    aulaAtualIndice = 0;
    document.getElementById("lessonArea").textContent = modulo.area.toUpperCase();
    document.getElementById("lessonTitle").textContent = modulo.titulo;
    document.getElementById("moduleDescription").textContent = modulo.descricao;
    const botaoConcluirModulo = document.getElementById("completeModule");
    if (botaoConcluirModulo) {
        botaoConcluirModulo.hidden = true;
        botaoConcluirModulo.style.display = "none";
    }
    renderizarListaAulas(modulo);
    carregarVideoDaAula();
    navegar("aula");
}

function atualizarResumo() {
    const totalAulas = modulos.reduce((total, modulo) => total + modulo.aulas.length, 0);
    const percentual = Math.round((aulasConcluidas.length / totalAulas) * 100);
    const percent = document.getElementById("percent");
    const ring = document.getElementById("ring");
    const done = document.getElementById("doneCount");
    if (percent) percent.textContent = percentual + "%";
    if (ring) {
        const angulo = percentual * 3.6;
        ring.style.background = "conic-gradient(#20aee9 0deg, #3864e8 " + angulo + "deg, #dfe7f8 " + angulo + "deg 360deg)";
    }
    if (done) done.textContent = aulasConcluidas.length;
    const homeDone = document.getElementById("homeDoneCount");
    if (homeDone) homeDone.textContent = aulasConcluidas.length;
    const homeLessons = document.getElementById("homeLessons");
    const homeScore = document.getElementById("homeScore");
    if (homeLessons) homeLessons.textContent = aulasConcluidas.length + " de " + totalAulas;
    if (homeScore) homeScore.textContent = pontuacaoAtual === null ? "—" : pontuacaoAtual + "%";
    renderizarModulos();
    atualizarPainelProgresso();
    if (document.getElementById("perfil")?.classList.contains("active")) renderizarPerfilAluno();
}

function atualizarPainelProgresso() {
    const score = document.getElementById("score");
    const performance = document.getElementById("performance");
    if (score) score.textContent = pontuacaoAtual === null ? "—" : pontuacaoAtual + "%";
    if (!performance) return;
    performance.replaceChildren();
    modulos.forEach(modulo => {
        const linha = document.createElement("div");
        linha.className = "performance-row";
        const nome = document.createElement("span");
        nome.textContent = modulo.titulo;
        const trilho = document.createElement("div");
        trilho.className = "track";
        const barra = document.createElement("span");
        const feitas = aulasConcluidasDoModulo(modulo);
        barra.style.width = (modulo.aulas.length ? feitas / modulo.aulas.length * 100 : 0) + "%";
        trilho.appendChild(barra);
        const estado = document.createElement("span");
        estado.textContent = feitas === modulo.aulas.length ? "Concluído" : feitas + "/" + modulo.aulas.length + " aulas";
        linha.append(nome, trilho, estado);
        performance.appendChild(linha);
    });
}

function normalizar(texto) {
    return texto.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function aplicarPesquisa() {
    const campo = document.getElementById("search");
    if (!campo) return;

    const termo = normalizar(campo.value.trim());
    document.querySelectorAll("#allModules .module-card").forEach(card => {
        const conteudo = normalizar(card.dataset.search || card.textContent);
        card.hidden = termo !== "" && !conteudo.includes(termo);
    });
}

function pesquisarCursos() {
    const campo = document.getElementById("search");
    if (!campo) return;

    const termo = campo.value.trim();

    if (!termo) {
        aplicarPesquisa();
        return;
    }

    if (filtroAtual !== "Todos") {
        filtroAtual = "Todos";
        document.querySelectorAll(".filter").forEach(botao => {
            botao.classList.toggle("active", botao.dataset.filter === "Todos");
        });
        renderizarModulos();
    } else {
        aplicarPesquisa();
    }

    const paginaCursos = document.getElementById("cursos");
    if (paginaCursos && !paginaCursos.classList.contains("active")) {
        navegar("cursos");
    }
}

function configurarFiltros() {
    document.querySelectorAll(".filter").forEach(botao => {
        botao.addEventListener("click", () => {
            filtroAtual = botao.dataset.filter || "Todos";
            document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === botao));
            renderizarModulos();
        });
    });
}

function renderizarPergunta() {
    const pergunta = perguntas[indicePergunta];
    if (!pergunta) return;

    document.getElementById("quizCount").textContent = `Questão ${indicePergunta + 1} de ${perguntas.length}`;
    document.getElementById("question").textContent = pergunta.pergunta;
    document.getElementById("quizBar").style.width = `${((indicePergunta + 1) / perguntas.length) * 100}%`;

    const respostasEl = document.getElementById("answers");
    respostasEl.replaceChildren();

    pergunta.opcoes.forEach((opcao, indice) => {
        const label = document.createElement("label");
        label.className = "answer";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "resposta";
        input.value = indice;
        input.checked = respostas[indicePergunta] === indice;
        input.addEventListener("change", () => {
            respostas[indicePergunta] = indice;
            renderizarPergunta();
        });
        const texto = document.createElement("span");
        texto.textContent = opcao;
        label.classList.toggle("selected", input.checked);
        label.append(input, texto);
        respostasEl.appendChild(label);
    });

    const feedback = document.getElementById("feedback");
    feedback.replaceChildren();
    if (respostas[indicePergunta] !== undefined) {
        const correta = respostas[indicePergunta] === pergunta.correta;
        feedback.className = "feedback " + (correta ? "good" : "bad");
        feedback.textContent = (correta ? "Correto! " : "Ainda não. ") + pergunta.explicacao;
    } else {
        feedback.className = "";
    }

    document.getElementById("quizPrev").disabled = indicePergunta === 0;
    document.getElementById("quizNext").textContent = indicePergunta === perguntas.length - 1 ? "Finalizar quiz ✓" : "Próxima questão →";
}

async function finalizarQuiz() {
    const respondidas = Object.keys(respostas).length;
    if (respondidas < perguntas.length) {
        mostrarToast("Responda todas as questões antes de finalizar.");
        return;
    }
    if (!sessaoAtual) {
        mostrarToast("Entre na sua conta para salvar sua pontuação.");
        return;
    }
    const acertos = perguntas.reduce((total, pergunta, indice) => total + (respostas[indice] === pergunta.correta ? 1 : 0), 0);
    const nota = Math.round((acertos / perguntas.length) * 100);
    const { error } = await supabaseClient
        .from("student_progress")
        .upsert({
            user_id: sessaoAtual.user.id,
            completed_modules: concluidos,
            completed_lessons: aulasConcluidas,
            quiz_score: nota,
            updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

    if (error) {
        console.error("Erro ao salvar pontuação:", error);
        mostrarToast("Não foi possível salvar sua pontuação. Tente novamente.");
        return;
    }

    pontuacaoAtual = nota;
    atualizarPainelProgresso();
    document.getElementById("question").textContent = `Você acertou ${acertos} de ${perguntas.length} questões!`;
    document.getElementById("answers").replaceChildren();
    const feedback = document.getElementById("feedback");
    feedback.className = "feedback " + (nota >= 70 ? "good" : "bad");
    feedback.textContent = `Sua pontuação foi ${nota}%. ${nota >= 70 ? "Muito bem! Continue praticando." : "Revise os módulos e tente novamente."}`;
    document.getElementById("quizCount").textContent = "Resultado final";
    document.getElementById("quizNext").textContent = "Refazer quiz";
    document.getElementById("quizPrev").disabled = true;
    document.getElementById("quizNext").dataset.resultado = "true";
}

function configurarQuiz() {
    document.getElementById("quizPrev").addEventListener("click", () => {
        indicePergunta = Math.max(0, indicePergunta - 1);
        renderizarPergunta();
    });
    document.getElementById("quizNext").addEventListener("click", () => {
        const botao = document.getElementById("quizNext");
        if (botao.dataset.resultado === "true") {
            indicePergunta = 0;
            respostas = {};
            delete botao.dataset.resultado;
            renderizarPergunta();
            return;
        }
        if (respostas[indicePergunta] === undefined) {
            mostrarToast("Selecione uma alternativa para continuar.");
            return;
        }
        if (indicePergunta === perguntas.length - 1) finalizarQuiz();
        else {
            indicePergunta++;
            renderizarPergunta();
        }
    });
    renderizarPergunta();
}

function configurarNavegacao() {
    document.querySelectorAll("[data-page]").forEach(botao => {
        botao.addEventListener("click", evento => {
            evento.preventDefault();
            navegar(botao.dataset.page);
        });
    });
}

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
        atualizarResumo();
        atualizarBotaoConta();
        mostrarAcesso("Você saiu da sua conta.");
    });
}

async function carregarProgressoDaConta() {
    concluidos = [];
    aulasConcluidas = [];
    pontuacaoAtual = null;
    if (!sessaoAtual) {
        atualizarResumo();
        return;
    }

    const { data, error } = await supabaseClient
        .from("student_progress")
        .select("completed_lessons, quiz_score")
        .eq("user_id", sessaoAtual.user.id)
        .maybeSingle();

    if (error) {
        console.error("Erro ao carregar progresso:", error);
        mostrarToast("Não foi possível carregar seu progresso.");
        atualizarResumo();
        return;
    }

    if (data) {
        const idsValidos = modulos.flatMap(modulo => modulo.aulas.map((_, indice) => idDaAula(modulo, indice)));
        aulasConcluidas = Array.isArray(data.completed_lessons)
            ? [...new Set(data.completed_lessons.filter(id => idsValidos.includes(id)))]
            : [];
        pontuacaoAtual = data.quiz_score ?? null;
    }
    atualizarModulosConcluidos();
    atualizarResumo();
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
    document.getElementById("authSwitch").addEventListener("click", () => {
        modoCadastro = !modoCadastro;
        document.getElementById("authMessage").textContent = "";
        atualizarModoAcesso();
    });

    document.getElementById("authForm").addEventListener("submit", async evento => {
        evento.preventDefault();
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value;
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
                sessaoAtual = data.session;
                await carregarProgressoDaConta();
                atualizarBotaoConta();
                renderizarPerfilAluno();
                ocultarAcesso();
                mostrarToast("Login realizado. Seu progresso foi carregado!");
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
        atualizarResumo();
        atualizarBotaoConta();
        mostrarAcesso("Você saiu da sua conta.");
    });

    document.getElementById("resetProgress").addEventListener("click", async () => {
        if (!sessaoAtual) return mostrarAcesso();
        const confirmar = await confirmarAcao("Tem certeza de que deseja resetar seu progresso? Os módulos concluídos e a última pontuação serão apagados da sua conta. Essa ação não pode ser desfeita.");
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
        atualizarResumo();
        if (moduloAtual) renderizarListaAulas(moduloAtual);
        mostrarToast("Seu progresso foi resetado para 0%.");
    });

    atualizarModoAcesso();
}

async function iniciarPortal() {
    configurarNavegacao();
    configurarFiltros();
    configurarQuiz();
    configurarAcesso();

    document.getElementById("search").addEventListener("input", pesquisarCursos);
    configurarPerfilAluno();

    renderizarModulos();

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) console.error("Erro ao verificar sessão:", error);
    sessaoAtual = data?.session || null;

    if (sessaoAtual) {
        await carregarProgressoDaConta();
        ocultarAcesso();
    } else {
        concluidos = [];
        pontuacaoAtual = null;
        atualizarResumo();
        mostrarAcesso();
    }

    atualizarBotaoConta();
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        sessaoAtual = session;
        if (!session) {
            concluidos = [];
            aulasConcluidas = [];
            pontuacaoAtual = null;
            atualizarResumo();
            mostrarAcesso();
        } else {
            setTimeout(async () => {
                await carregarProgressoDaConta();
                atualizarBotaoConta();
                ocultarAcesso();
            }, 0);
        }
    });

    console.log("H.S. Bruno iniciado.");
}

document.addEventListener("DOMContentLoaded", iniciarPortal);
