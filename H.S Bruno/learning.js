/* ===== 08. Quiz individual e correção ===== */

function renderizarQuizDaAula() {
    const container = document.getElementById("lessonQuizContainer");
    if (!container || !moduloAtual) return;
    const idAula = idDaAula(moduloAtual, aulaAtualIndice);
    const quiz = quizzesPorAula[idAula] || [];
    const resultados = lerResultadosQuizzes();
    const jaRespondido = resultados[idAula] && !resultados[idAula].refazendo ? resultados[idAula] : null;
    container.replaceChildren();
    if (!quiz.length) {
        container.hidden = true;
        return;
    }
    container.hidden = false;
    const titulo = document.createElement("h3");
    titulo.className = "lesson-quiz-title";
    titulo.textContent = "Quiz da aula";
    const subtitulo = document.createElement("p");
    subtitulo.className = "lesson-quiz-subtitle";
    subtitulo.textContent = "3 perguntas rápidas para revisar o que você aprendeu.";
    container.append(titulo, subtitulo);

    const form = document.createElement("form");
    form.className = "lesson-quiz-form";
    quiz.forEach((item, qIndex) => {
        const bloco = document.createElement("fieldset");
        bloco.className = "lesson-quiz-question";
        const legend = document.createElement("legend");
        legend.textContent = (qIndex + 1) + ". " + item.pergunta;
        bloco.appendChild(legend);
        const rotacao = (qIndex + aulaAtualIndice + modulos.findIndex(m => m.id === moduloAtual.id)) % item.opcoes.length;
        const opcoesEmOrdem = item.opcoes.map((_, originalIndex) => originalIndex)
            .sort((a,b) => ((a + rotacao) % item.opcoes.length) - ((b + rotacao) % item.opcoes.length));
        opcoesEmOrdem.forEach(originalIndex => {
            const label = document.createElement("label");
            label.className = "lesson-quiz-option";
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "lesson-q-" + qIndex;
            input.value = String(originalIndex);
            input.checked = jaRespondido?.respostas?.[qIndex] === originalIndex;
            input.disabled = Boolean(jaRespondido);
            label.append(input, document.createTextNode(item.opcoes[originalIndex]));
            bloco.appendChild(label);
        });
        form.appendChild(bloco);
        if (jaRespondido) {
            const resposta = jaRespondido.respostas?.[qIndex];
            const linhaResultado = document.createElement("p");
            linhaResultado.className = "lesson-quiz-explanation";
            const acertou = resposta === item.correta;
            linhaResultado.textContent = (acertou ? "Resposta correta. " : "Resposta incorreta. ") +
                "Resposta certa: " + item.opcoes[item.correta] + ". " + item.explicacao;
            bloco.appendChild(linhaResultado);
        }
    });

    const feedback = document.createElement("div");
    feedback.className = "lesson-quiz-result";
    feedback.setAttribute("aria-live", "polite");
    const enviar = document.createElement("button");
    enviar.type = "submit";
    enviar.className = "primary lesson-quiz-submit";
    enviar.textContent = jaRespondido ? "Refazer quiz" : "Conferir respostas";
    form.append(enviar, feedback);

    if (jaRespondido) {
        feedback.classList.add("is-visible", jaRespondido.score === 3 ? "good" : "review");
        feedback.textContent = "Resultado: " + jaRespondido.score + "/3. " +
            (jaRespondido.score === 3 ? "Excelente, você acertou tudo!" : "Revise as explicações e, se quiser, tente novamente.");
    }
    form.addEventListener("submit", async evento => {
        evento.preventDefault();
        if (jaRespondido) {
            const resultadosAtuais = lerResultadosQuizzes();
            const registroAnterior = resultadosAtuais[idAula] || jaRespondido;
            resultadosAtuais[idAula] = { ...registroAnterior, refazendo: true };
            try { localStorage.setItem(chaveQuizzesDoUsuario(), JSON.stringify(resultadosAtuais)); } catch (_) {}
            const novasAulas = aulasConcluidas.filter(id => id !== idAula);
            await salvarListaAulas(novasAulas, idAula, false);
            atualizarResumo();
            renderizarQuizDaAula();
            atualizarBotaoProximaAula();
            return;
        }
        const escolhas = quiz.map((_, qIndex) => {
            const selecionada = form.querySelector('input[name="lesson-q-' + qIndex + '"]:checked');
            return selecionada ? Number(selecionada.value) : null;
        });
        if (escolhas.some(resposta => resposta === null)) {
            mostrarToast("Responda as três perguntas para conferir.");
            return;
        }
        const score = quiz.reduce((total, item, qIndex) => total + (escolhas[qIndex] === item.correta ? 1 : 0), 0);
        const dataQuiz = new Date().toISOString();
        const atual = lerResultadosQuizzes()[idAula];
        const tentativas = [...(atual?.tentativas || []), { score, respostas: escolhas, data: dataQuiz }].slice(-50);
        salvarResultadoQuizAula(idAula, { score, respostas: escolhas, data: dataQuiz, tentativas });
        atualizarResumo();
        if (videosAssistidos.includes(idAula)) {
            concluirAulaAtual().then(() => { renderizarQuizDaAula(); atualizarBotaoProximaAula(); });
        } else {
            renderizarQuizDaAula();
            atualizarBotaoProximaAula();
            mostrarToast("Quiz concluído! Termine a videoaula para marcar a aula como feita.");
        }
    });
    container.appendChild(form);
}
/* ===== 09. Fluxo de aula e controles ===== */

function configurarProximaAula() {
    const botao = document.getElementById("nextLessonButton");
    if (!botao) return;
    botao.addEventListener("click", async () => {
        if (!moduloAtual) return;
        const idAtual = idDaAula(moduloAtual, aulaAtualIndice);
        if (!quizDaAulaFoiConcluido(idAtual)) {
            mostrarToast("Responda o quiz desta aula antes de avançar.");
            return;
        }
        await concluirAulaAtual();
        const indiceGlobal = modulos.findIndex(modulo => modulo.id === moduloAtual.id);
        if (aulaAtualIndice + 1 < moduloAtual.aulas.length) {
            selecionarAula(aulaAtualIndice + 1);
            return;
        }
        const proximoModulo = modulos[indiceGlobal + 1];
        if (proximoModulo) {
            abrirModulo(proximoModulo.id);
        } else {
            mostrarToast("Você chegou à última aula. Parabéns por concluir a trilha!");
            navegar("cursos");
        }
    });
}

async function concluirAulaAtual(){if(!moduloAtual)return false;const id=idDaAula(moduloAtual,aulaAtualIndice);if(!videosAssistidos.includes(id))salvarVideosAssistidos([...videosAssistidos,id]);if(!quizDaAulaFoiConcluido(id)){atualizarResumo();mostrarToast("Vídeo assistido! Faça o quiz para concluir a aula.");return true;}if(aulasConcluidas.includes(id))return true;return await salvarListaAulas([...aulasConcluidas,id],id,true);}

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

/* ===== 10. Resumo, painel e progresso visual ===== */

function atualizarResumo(){const total=modulos.reduce((sum,m)=>sum+m.aulas.length,0),percent=Math.round((total?aulasConcluidas.length/total:0)*100);const percentEl=document.getElementById("percent"),ring=document.getElementById("ring"),done=document.getElementById("doneCount");if(percentEl)percentEl.textContent=percent+"%";if(ring){const angle=percent*3.6;ring.style.background="conic-gradient(#39765F 0deg, #39765F "+angle+"deg, #E8E0D4 "+angle+"deg 360deg)";}if(done)done.textContent=aulasConcluidas.length;const homeDone=document.getElementById("homeDoneCount"),homeLessons=document.getElementById("homeLessons"),homeScore=document.getElementById("homeScore"),message=document.querySelector(".home-progress-message strong"),resume=document.getElementById("homeResumeButton"),next=document.getElementById("homeNextLesson");if(homeDone)homeDone.textContent=aulasConcluidas.length;if(homeLessons)homeLessons.textContent=aulasConcluidas.length+" de "+total+" aulas concluídas";if(homeScore)homeScore.textContent=pontuacaoAtual===null?"N/A":pontuacaoAtual+"%";if(message)message.textContent=percent===0?"Pronto para começar sua jornada!":percent===100?"Jornada concluída. Parabéns!":"Você está indo muito bem!";if(resume){const span=resume.querySelector("span");if(span)span.textContent=percent===100?"Revisar Estudos":percent===0?"Começar Estudos":"Retomar Estudos";}const upcoming=proximaAulaPendente();if(next)next.textContent=upcoming?"Próxima aula: "+upcoming.nome:"Todas as aulas foram concluídas!";atualizarWidgetsDeMeta();renderizarModulos();atualizarPainelProgresso();renderizarDesafios();renderizarHistorico();if(document.getElementById("perfil")?.classList.contains("active"))renderizarPerfilAluno();}

function atualizarPainelProgresso(){const score=document.getElementById("score"),performance=document.getElementById("performance");if(score)score.textContent=pontuacaoAtual===null?"—":pontuacaoAtual+"%";if(!performance)return;performance.replaceChildren();modulos.forEach(m=>{const row=document.createElement("div");row.className="performance-row";const name=document.createElement("span");name.textContent=m.titulo;const track=document.createElement("div");track.className="track";const fill=document.createElement("span");fill.style.width=progressoModulo(m)+"%";track.appendChild(fill);const status=document.createElement("span");status.textContent=moduloCompleto(m)?"Concluído":tarefasConcluidasModulo(m)+"/"+totalTarefasModulo(m)+" atividades";row.append(name,track,status);performance.appendChild(row);});}

/* ===== 11. Pesquisa e filtros ===== */

function normalizar(texto) {
    return texto.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function aplicarPesquisa() {
    const campo = document.getElementById("search");
    const grade = document.getElementById("allModules");
    const feedback = document.getElementById("searchFeedback");
    if (!campo || !grade) return;

    const textoDigitado = campo.value.trim();
    const termo = normalizar(textoDigitado);
    let encontrados = 0;

    grade.querySelectorAll(".module-card").forEach(card => {
        const conteudo = normalizar(card.dataset.search || card.textContent);
        const corresponde = termo === "" || conteudo.includes(termo);
        card.hidden = !corresponde;
        if (corresponde) encontrados++;
    });

    if (feedback) {
        if (textoDigitado && encontrados === 0) {
            feedback.hidden = false;
            feedback.textContent = 'Nenhum resultado encontrado para "' + textoDigitado + '". Confira a escrita ou tente outro termo.';
        } else if (textoDigitado) {
            feedback.hidden = false;
            feedback.textContent = encontrados + (encontrados === 1 ? ' resultado encontrado para "' : ' resultados encontrados para "') + textoDigitado + '".';
        } else if (grade.querySelectorAll(".module-card").length === 0) {
            feedback.hidden = false;
            feedback.textContent = "Nenhum módulo encontrado neste filtro.";
        } else {
            feedback.hidden = true;
            feedback.textContent = "";
        }
    }
}

function pesquisarCursos() {
    const campo = document.getElementById("search");
    if (!campo) return;

    const termo = campo.value.trim();

    if (!termo) {
        aplicarPesquisa();
        return;
    }

    aplicarPesquisa();

    const paginaCursos = document.getElementById("cursos");
    if (paginaCursos && !paginaCursos.classList.contains("active")) {
        navegar("cursos");
    }
}

function configurarFiltros() {
    document.querySelectorAll(".filter").forEach(botao => {
        botao.addEventListener("click", () => {
            filtroAtual = botao.dataset.filter || "Todos";
            document.querySelectorAll(".filter").forEach(item => {
                const ativo = item.dataset.filter === filtroAtual;
                item.classList.toggle("active", ativo);
                item.setAttribute("aria-pressed", ativo ? "true" : "false");
            });
            renderizarModulos();
        });
    });
}

/* ===== 12. Quiz geral ===== */

function renderizarPergunta() {
    const pergunta = perguntas[indicePergunta];
    if (!pergunta) return;

    document.getElementById("quizCount").textContent = `Questão ${indicePergunta + 1} de ${perguntas.length}`;
    document.getElementById("question").textContent = pergunta.pergunta;
    document.getElementById("quizBar").style.width = `${((indicePergunta + 1) / perguntas.length) * 100}%`;

    const respostasEl = document.getElementById("answers");
    respostasEl.replaceChildren();

    if (!ordemOpcoesQuizGeral[indicePergunta]) {
        ordemOpcoesQuizGeral[indicePergunta] = pergunta.opcoes.map((_, indice) => indice)
            .sort(() => Math.random() - 0.5);
    }
    ordemOpcoesQuizGeral[indicePergunta].forEach(indiceOriginal => {
        const opcao = pergunta.opcoes[indiceOriginal];
        const label = document.createElement("label");
        label.className = "answer";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "resposta";
        input.value = indiceOriginal;
        input.checked = respostas[indicePergunta] === indiceOriginal;
        // Depois de escolher uma resposta, bloqueia todas as alternativas desta questão.
        input.disabled = respostas[indicePergunta] !== undefined;
        input.addEventListener("change", () => {
            if (respostas[indicePergunta] !== undefined) return;
            respostas[indicePergunta] = indiceOriginal;
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
    const botaoProximo = document.getElementById("quizNext");
    botaoProximo.textContent = indicePergunta === perguntas.length - 1 ? "Finalizar quiz ✓" : "Próxima questão →";
}

async function finalizarQuiz(){const answered=Object.keys(respostas).length;if(answered<perguntas.length){mostrarToast("Responda todas as questões antes de finalizar.");return;}if(!sessaoAtual){mostrarToast("Entre na sua conta para salvar sua pontuação.");return;}const hits=perguntas.reduce((sum,p,i)=>sum+(respostas[i]===p.correta?1:0),0),score=Math.round(hits/perguntas.length*100);const {error}=await supabaseClient.from("student_progress").upsert({user_id:sessaoAtual.user.id,completed_modules:concluidos,completed_lessons:aulasConcluidas,quiz_score:score,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(error){console.error("Erro ao salvar pontuação:",error);mostrarToast("Não foi possível salvar sua pontuação. Tente novamente.");return;}pontuacaoAtual=score;salvarHistoricoQuizGeral([...historicoQuizGeral,{score,acertos:hits,total:perguntas.length,data:new Date().toISOString()}]);atualizarResumo();document.getElementById("question").textContent="Você acertou "+hits+" de "+perguntas.length+" questões!";document.getElementById("answers").replaceChildren();const feedback=document.getElementById("feedback");feedback.className="feedback "+(score>=70?"good":"bad");feedback.textContent="Sua pontuação foi "+score+"%. "+(score>=70?"Muito bem! Continue praticando.":"Revise os módulos e tente novamente.");document.getElementById("quizCount").textContent="Resultado final";document.getElementById("quizNext").textContent="Refazer quiz";document.getElementById("quizPrev").disabled=true;document.getElementById("quizNext").dataset.resultado="true";}

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
            ordemOpcoesQuizGeral = {};
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

/* ===== 13. Navegação principal ===== */

function configurarNavegacao() {
    document.querySelectorAll("[data-page]").forEach(botao => {
        botao.addEventListener("click", evento => {
            evento.preventDefault();
            navegar(botao.dataset.page);
        });
    });

    const botaoRetomar = document.getElementById("homeResumeButton");
    botaoRetomar?.addEventListener("click", () => {
        if (!sessaoAtual) {
            mostrarAcesso("Entre na sua conta para continuar seus estudos.");
            return;
        }

        const proxima = proximaAulaPendente();
        if (!proxima) {
            navegar("cursos");
            return;
        }

        abrirModulo(proxima.modulo.id);
        selecionarAula(proxima.indice);
    });
}
