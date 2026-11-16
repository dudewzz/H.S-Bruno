/* =====================================================
   H.S. BRUNO — PORTAL DE ESTUDOS
   Funcionalidades principais
===================================================== */

"use strict";

const STORAGE = {
    progress: "hsbruno_modulos_concluidos_v2",
    score: "hsbruno_ultima_pontuacao_v2"
};

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

let concluidos = carregarLista(STORAGE.progress);
let moduloAtual = null;
let indicePergunta = 0;
let respostas = {};
let filtroAtual = "Todos";

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

function renderizarModulos() {
    const inicio = document.getElementById("homeModules");
    const todos = document.getElementById("allModules");

    if (inicio) {
        inicio.replaceChildren(...modulos.map(criarCard));
    }

    if (todos) {
        const filtrados = filtroAtual === "Todos"
            ? modulos
            : modulos.filter(modulo => modulo.area === filtroAtual);
        todos.replaceChildren(...filtrados.map(criarCard));
    }

    aplicarPesquisa();
}

function renderizarListaAulas(modulo) {
    const lista = document.getElementById("lessonList");
    const selecionado = document.getElementById("lessonSelected");
    const contador = document.getElementById("lessonCount");
    if (!lista || !selecionado || !contador) return;

    lista.replaceChildren();
    contador.textContent = modulo.aulas.length + (modulo.aulas.length === 1 ? " assunto" : " assuntos");

    modulo.aulas.forEach((aula, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "lesson-item" + (indice === 0 ? " active" : "");
        botao.textContent = String(indice + 1).padStart(2, "0") + " · " + aula;
        botao.setAttribute("aria-pressed", indice === 0 ? "true" : "false");
        botao.addEventListener("click", () => {
            lista.querySelectorAll(".lesson-item").forEach(item => {
                item.classList.remove("active");
                item.setAttribute("aria-pressed", "false");
            });
            botao.classList.add("active");
            botao.setAttribute("aria-pressed", "true");
            selecionado.textContent = "Assunto selecionado: " + aula;
        });
        lista.appendChild(botao);
    });

    selecionado.textContent = modulo.aulas.length
        ? "Assunto selecionado: " + modulo.aulas[0]
        : "Nenhum assunto cadastrado neste módulo.";
}

function abrirModulo(id) {
    const modulo = modulos.find(item => item.id === id);
    if (!modulo) return;

    moduloAtual = modulo;
    document.getElementById("lessonArea").textContent = modulo.area.toUpperCase();
    document.getElementById("lessonTitle").textContent = modulo.titulo;
    document.getElementById("moduleDescription").textContent = modulo.descricao;
    renderizarListaAulas(modulo);

    const videoContainer = document.getElementById("moduleVideo");
    videoContainer.replaceChildren();

    const player = document.createElement("video");
    player.className = "module-player";
    player.controls = true;
    player.preload = "metadata";
    player.playsInline = true;
    player.setAttribute("aria-label", "Videoaula: " + modulo.titulo);
    player.style.width = "100%";
    player.style.maxHeight = "480px";
    player.style.aspectRatio = "16 / 9";
    player.style.display = "block";
    player.style.background = "#101010";
    player.style.borderRadius = "12px";
    player.style.objectFit = "contain";

    const fonte = document.createElement("source");
    fonte.src = modulo.video;
    fonte.type = "video/mp4";
    fonte.addEventListener("error", () => player.dispatchEvent(new Event("error")));
    player.appendChild(fonte);

    const aviso = document.createElement("p");
    aviso.textContent = "Seu navegador não conseguiu carregar este vídeo. Confira se o arquivo existe em: " + modulo.video;
    player.appendChild(aviso);

    player.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "video-placeholder";
        const tituloAviso = document.createElement("h3");
        tituloAviso.textContent = "Vídeo ainda não adicionado";
        const descricaoAviso = document.createElement("p");
        descricaoAviso.textContent = "Coloque o arquivo MP4 neste caminho dentro da pasta do projeto:";
        const caminho = document.createElement("small");
        caminho.textContent = modulo.video;
        placeholder.append(tituloAviso, descricaoAviso, caminho);
        videoContainer.replaceChildren(placeholder);
    });

    videoContainer.appendChild(player);

    const botao = document.getElementById("completeModule");
    const concluido = concluidos.includes(modulo.id);
    botao.textContent = concluido ? "✓ Módulo concluído" : "Marcar módulo como concluído ✓";
    botao.disabled = concluido;
    navegar("aula");
}

function concluirModulo() {
    if (!moduloAtual) return;
    let persistido = true;
    if (!concluidos.includes(moduloAtual.id)) {
        concluidos.push(moduloAtual.id);
        persistido = salvar(STORAGE.progress, concluidos);
    }
    atualizarResumo();
    abrirModulo(moduloAtual.id);
    mostrarToast(persistido
        ? "Módulo marcado como concluído!"
        : "Concluído nesta sessão, mas não foi possível salvar.");
}

function atualizarResumo() {
    const percentual = Math.round((concluidos.length / modulos.length) * 100);
    const percent = document.getElementById("percent");
    const ring = document.getElementById("ring");
    const done = document.getElementById("doneCount");

    if (percent) percent.textContent = percentual + "%";
    if (ring) {
        const angulo = percentual * 3.6;
        ring.style.background = `conic-gradient(#19b7a2 0deg ${angulo}deg, #dfe7f8 ${angulo}deg 360deg)`;
    }
    if (done) done.textContent = concluidos.length;

    renderizarModulos();
    atualizarPainelProgresso();
}

function atualizarPainelProgresso() {
    const pontuacao = lerArmazenamento(STORAGE.score);
    const score = document.getElementById("score");
    const performance = document.getElementById("performance");
    if (score) score.textContent = pontuacao === null ? "—" : pontuacao + "%";

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
        const feito = concluidos.includes(modulo.id);
        barra.style.width = feito ? "100%" : "0%";
        trilho.appendChild(barra);
        const estado = document.createElement("span");
        estado.textContent = feito ? "Concluído" : "Pendente";
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

function finalizarQuiz() {
    const respondidas = Object.keys(respostas).length;
    if (respondidas < perguntas.length) {
        mostrarToast("Responda todas as questões antes de finalizar.");
        return;
    }
    const acertos = perguntas.reduce((total, pergunta, indice) => total + (respostas[indice] === pergunta.correta ? 1 : 0), 0);
    const nota = Math.round((acertos / perguntas.length) * 100);
    const pontuacaoSalva = salvar(STORAGE.score, nota);
    atualizarPainelProgresso();
    document.getElementById("question").textContent = `Você acertou ${acertos} de ${perguntas.length} questões!`;
    document.getElementById("answers").replaceChildren();
    const feedback = document.getElementById("feedback");
    feedback.className = "feedback " + (nota >= 70 ? "good" : "bad");
    feedback.textContent = `Sua pontuação foi ${nota}%. ${nota >= 70 ? "Muito bem! Continue praticando." : "Revise os módulos e tente novamente."}${pontuacaoSalva ? "" : " A pontuação não pôde ser salva neste navegador."}`;
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

function iniciarPortal() {
    configurarNavegacao();
    configurarFiltros();
    configurarQuiz();

    document.getElementById("search").addEventListener("input", pesquisarCursos);
    document.getElementById("completeModule").addEventListener("click", concluirModulo);

    renderizarModulos();
    atualizarResumo();
    console.log("H.S. Bruno iniciado.");
}

document.addEventListener("DOMContentLoaded", iniciarPortal);
