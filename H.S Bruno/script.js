
/* =====================================================
   H.S. BRUNO — PORTAL DE ESTUDOS
   JavaScript principal
===================================================== */


/* =====================================================
   1. CONFIGURAÇÕES
===================================================== */

const TOTAL_AULAS = 17;
const CHAVE_PROGRESso = "hsbruno_aulas_concluidas";

let aulasConcluidas = [];


/* =====================================================
   2. CARREGAR PROGRESSO SALVO
===================================================== */

function carregarProgresso() {
    try {
        const dados = localStorage.getItem(CHAVE_PROGRESso);

        if (dados) {
            const aulasSalvas = JSON.parse(dados);

            if (Array.isArray(aulasSalvas)) {
                aulasConcluidas = aulasSalvas;
            }
        }
    } catch (erro) {
        console.error("Erro ao carregar progresso:", erro);
        aulasConcluidas = [];
    }
}


/* =====================================================
   3. SALVAR PROGRESSO
===================================================== */

function salvarProgresso() {
    try {
        localStorage.setItem(
            CHAVE_PROGRESso,
            JSON.stringify(aulasConcluidas)
        );
    } catch (erro) {
        console.error("Erro ao salvar progresso:", erro);
    }
}


/* =====================================================
   4. ATUALIZAR BOTÕES DAS AULAS
===================================================== */

function atualizarBotoes() {

    const botoes = document.querySelectorAll(".botao-concluir");

    botoes.forEach(botao => {

        const idAula = botao.dataset.aula;

        const concluida = aulasConcluidas.includes(idAula);

        if (concluida) {

            botao.textContent = "✓ Aula concluída";

            botao.classList.add("concluida");

            botao.setAttribute("aria-pressed", "true");

        } else {

            botao.textContent = "Marcar como concluída";

            botao.classList.remove("concluida");

            botao.setAttribute("aria-pressed", "false");

        }

    });
}


/* =====================================================
   5. CALCULAR PROGRESSO GERAL
===================================================== */

function atualizarProgresso() {

    const quantidade = aulasConcluidas.length;

    const porcentagem = Math.round(
        (quantidade / TOTAL_AULAS) * 100
    );

    const barra = document.getElementById("progressoGeral");

    const texto = document.getElementById("textoProgresso");

    if (barra) {

        barra.style.width = porcentagem + "%";

        barra.setAttribute("role", "progressbar");

        barra.setAttribute("aria-valuemin", "0");

        barra.setAttribute("aria-valuemax", "100");

        barra.setAttribute("aria-valuenow", porcentagem);

    }

    if (texto) {

        texto.textContent =
            porcentagem + "% concluído (" +
            quantidade + " de " + TOTAL_AULAS + " aulas)";

    }

}


/* =====================================================
   6. MARCAR E DESMARCAR AULAS
===================================================== */

function configurarConclusao() {

    const botoes = document.querySelectorAll(".botao-concluir");

    botoes.forEach(botao => {

        botao.addEventListener("click", function() {

            const idAula = this.dataset.aula;

            if (!idAula) return;

            if (aulasConcluidas.includes(idAula)) {

                aulasConcluidas = aulasConcluidas.filter(
                    id => id !== idAula
                );

            } else {

                aulasConcluidas.push(idAula);

            }

            salvarProgresso();

            atualizarBotoes();

            atualizarProgresso();

        });

    });

}


/* =====================================================
   7. SISTEMA DE PESQUISA
===================================================== */

function configurarPesquisa() {

    const campoPesquisa = document.getElementById("pesquisa");

    if (!campoPesquisa) return;

    campoPesquisa.addEventListener("input", function() {

        const termo = this.value
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Pesquisar módulos

        const cursos = document.querySelectorAll(".card-curso");

        cursos.forEach(curso => {

            const conteudo = curso.textContent
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            curso.style.display =
                conteudo.includes(termo) ? "" : "none";

        });


        // Pesquisar aulas

        const aulas = document.querySelectorAll(".aula");

        aulas.forEach(aula => {

            const conteudo = aula.textContent
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            aula.style.display =
                conteudo.includes(termo) ? "" : "none";

        });

    });

}


/* =====================================================
   8. MENU DE NAVEGAÇÃO
===================================================== */

function configurarMenu() {

    const links = document.querySelectorAll(".menu-item");

    links.forEach(link => {

        link.addEventListener("click", function() {

            links.forEach(item => {

                item.classList.remove("ativo");

            });

            this.classList.add("ativo");

        });

    });

}


/* =====================================================
   9. INICIALIZAÇÃO DO PORTAL
===================================================== */

function iniciarPortal() {

    carregarProgresso();

    configurarConclusao();

    configurarPesquisa();

    configurarMenu();

    atualizarBotoes();

    atualizarProgresso();

    console.log("H.S. Bruno iniciado com sucesso!");

}


/* =====================================================
   10. EXECUTAR QUANDO A PÁGINA CARREGAR
===================================================== */

document.addEventListener("DOMContentLoaded", iniciarPortal);
