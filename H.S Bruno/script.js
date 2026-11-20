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


/* Quizzes individuais: 3 perguntas para cada uma das 17 aulas. */
const quizzesPorAula = {
    "hardware-1-aula-1": [
        { pergunta:"O que é hardware?", opcoes:["A parte física do computador","Os programas instalados","Um tipo de arquivo","Uma conexão de internet"], correta:0, explicacao:"Hardware é o conjunto de componentes físicos, como teclado, memória, placa-mãe e processador." },
        { pergunta:"Qual item é um exemplo de hardware?", opcoes:["Windows","Navegador","Teclado","Editor de texto"], correta:2, explicacao:"O teclado é um dispositivo físico; os outros exemplos são softwares." },
        { pergunta:"Hardware e software trabalham juntos porque:", opcoes:["O hardware funciona sem instruções","O software dá instruções que o hardware executa","O software é sempre uma peça física","Hardware é apenas o monitor"], correta:1, explicacao:"O software fornece instruções, enquanto o hardware executa e dá suporte a essas operações." }
    ],
    "hardware-1-aula-2": [
        { pergunta:"Qual é a função principal da memória RAM?", opcoes:["Guardar arquivos permanentemente","Armazenar temporariamente dados usados pelos programas","Fornecer energia ao computador","Conectar os periféricos"], correta:1, explicacao:"A RAM mantém temporariamente dados e instruções que o computador está usando, permitindo acesso rápido." },
        { pergunta:"A RAM é considerada uma memória volátil. O que isso significa?", opcoes:["Ela conserva tudo sem energia","Ela é usada apenas para imagens","Se perde os dados armazenados quando fica sem energia","Ela é mais lenta que qualquer HD"], correta:2, explicacao:"Memória volátil precisa de energia para manter os dados; ao desligar, o conteúdo da RAM é perdido." },
        { pergunta:"O que pode ocorrer quando há pouca RAM disponível e muitos programas abertos?", opcoes:["O computador pode ficar lento","O monitor aumenta de tamanho","Os arquivos do SSD são apagados","O teclado para de enviar comandos"], correta:0, explicacao:"Pouca memória disponível pode obrigar o sistema a usar recursos mais lentos e causar lentidão." }
    ],
    "hardware-1-aula-3": [
        { pergunta:"Qual é a finalidade do armazenamento (SSD ou HD)?", opcoes:["Guardar dados mesmo com o PC desligado","Executar cálculos da CPU","Resfriar componentes","Enviar comandos pelo teclado"], correta:0, explicacao:"SSD e HD são dispositivos de armazenamento não volátil, que mantêm arquivos e programas sem energia." },
        { pergunta:"Qual é uma característica típica do SSD em comparação ao HD mecânico?", opcoes:["Possui discos giratórios","Tem partes móveis e ruído constante","É geralmente mais rápido e não usa partes móveis","Serve apenas para memória temporária"], correta:2, explicacao:"SSD usa memória flash e não tem discos mecânicos móveis, geralmente oferecendo maior velocidade." },
        { pergunta:"Qual item costuma ficar armazenado no SSD ou HD?", opcoes:["Arquivos pessoais e programas instalados","Somente dados temporários da RAM","A energia da fonte","O movimento do cooler"], correta:0, explicacao:"Arquivos, aplicativos e sistema operacional são armazenados em SSD ou HD para permanecerem após desligar." }
    ],
    "hardware-1-aula-4": [
        { pergunta:"Qual é o papel principal da placa-mãe?", opcoes:["Exibir imagens no monitor","Interligar componentes e permitir comunicação entre eles","Guardar todos os arquivos pessoais","Refrigerar a fonte"], correta:1, explicacao:"A placa-mãe conecta componentes como CPU, RAM, armazenamento e periféricos, permitindo a comunicação." },
        { pergunta:"Onde a memória RAM é instalada normalmente?", opcoes:["Em slots da placa-mãe","Dentro do monitor","No cabo de energia","Na ventoinha do gabinete"], correta:0, explicacao:"Os módulos de RAM são encaixados nos slots de memória da placa-mãe." },
        { pergunta:"Por que é importante conferir compatibilidade da placa-mãe com o processador?", opcoes:["Para que o monitor tenha brilho","Para evitar que os arquivos mudem de nome","Porque o soquete e suporte precisam ser compatíveis","Para fazer o computador funcionar sem RAM"], correta:2, explicacao:"CPU precisa ser compatível com o soquete e suporte da placa-mãe, incluindo requisitos de firmware." }
    ],
    "hardware-1-aula-5": [
        { pergunta:"Qual componente executa instruções e cálculos do computador?", opcoes:["SSD","Processador (CPU)","Fonte de alimentação","Gabinete"], correta:1, explicacao:"A CPU executa instruções e processa operações necessárias aos programas e ao sistema." },
        { pergunta:"O que indica a quantidade de núcleos de um processador?", opcoes:["Quantas unidades de processamento ele possui","A capacidade do SSD em gigabytes","A potência da fonte","A resolução máxima do monitor"], correta:0, explicacao:"Núcleos são unidades de processamento dentro da CPU, permitindo lidar com tarefas em paralelo." },
        { pergunta:"A frequência de um processador, medida em GHz, está relacionada:", opcoes:["À velocidade de operação do relógio da CPU","Ao espaço físico do gabinete","À quantidade de arquivos guardados","À voltagem do monitor"], correta:0, explicacao:"GHz expressa ciclos por segundo; desempenho depende também da arquitetura e de outros fatores." }
    ],
    "hardware-2-aula-1": [
        { pergunta:"Qual atitude reduz o risco de choque e dano ao computador antes da manutenção?", opcoes:["Deixar o computador ligado","Desconectar o equipamento da tomada","Usar ferramentas molhadas","Trabalhar sobre superfície metálica sem cuidado"], correta:1, explicacao:"Desligue e desconecte da energia antes de abrir ou limpar o equipamento, seguindo procedimentos seguros." },
        { pergunta:"Para que serve uma pulseira antiestática usada na manutenção?", opcoes:["Aumentar a velocidade da CPU","Evitar descargas eletrostáticas prejudiciais aos componentes","Medir a temperatura do gabinete","Desligar a fonte remotamente"], correta:1, explicacao:"A pulseira ajuda a equalizar o potencial elétrico e reduzir o risco de descarga eletrostática." },
        { pergunta:"Qual ferramenta é mais adequada para retirar parafusos do gabinete?", opcoes:["Chave de fenda apropriada","Tesoura de cozinha","Faca de ponta","Caneta"], correta:0, explicacao:"Use uma chave compatível com o tipo e tamanho do parafuso, evitando danificar a peça." }
    ],
    "hardware-2-aula-2": [
        { pergunta:"Ao instalar um componente, o que deve ser feito se ele não encaixar facilmente?", opcoes:["Forçar até entrar","Verificar posição, encaixe e compatibilidade","Ligar o computador para testar","Lixar o conector"], correta:1, explicacao:"Confira orientação, trava e compatibilidade. Componentes devem encaixar corretamente sem força excessiva." },
        { pergunta:"Qual etapa é importante ao montar um computador?", opcoes:["Conectar cabos e componentes conforme os encaixes e instruções","Instalar RAM com o PC energizado","Deixar o processador solto","Ignorar os conectores do painel"], correta:0, explicacao:"A montagem exige encaixes corretos e conexão dos cabos de acordo com os manuais e marcações." },
        { pergunta:"Por que verificar se os cabos estão firmemente conectados após a montagem?", opcoes:["Para aumentar o peso do gabinete","Para evitar falhas por conexão frouxa","Para reduzir o tamanho da RAM","Para alterar o sistema operacional"], correta:1, explicacao:"Conexões frouxas podem causar ausência de energia, falhas de inicialização ou funcionamento intermitente." }
    ],
    "hardware-2-aula-3": [
        { pergunta:"Qual é o objetivo da limpeza preventiva?", opcoes:["Remover poeira e ajudar a manter o funcionamento adequado","Apagar os programas instalados","Aumentar a capacidade do SSD","Trocar o sistema operacional"], correta:0, explicacao:"A limpeza preventiva reduz o acúmulo de poeira que pode prejudicar a ventilação e o resfriamento." },
        { pergunta:"Antes de limpar internamente o computador, você deve:", opcoes:["Desconectá-lo da tomada","Abrir programas de teste","Molhar o gabinete","Deixar o PC em suspensão"], correta:0, explicacao:"Desligue o computador e desconecte a alimentação antes da limpeza interna." },
        { pergunta:"O acúmulo de poeira em ventoinhas e dissipadores pode:", opcoes:["Melhorar o resfriamento","Bloquear a ventilação e aumentar a temperatura","Aumentar o espaço de armazenamento","Atualizar automaticamente os drivers"], correta:1, explicacao:"Poeira dificulta a passagem de ar e pode elevar a temperatura dos componentes." }
    ],
    "hardware-2-aula-4": [
        { pergunta:"Qual é uma boa primeira etapa para diagnosticar uma falha?", opcoes:["Trocar todas as peças de uma vez","Identificar sintomas e reproduzir o problema com segurança","Formatar sempre o computador","Ignorar mensagens de erro"], correta:1, explicacao:"Observe sintomas, mensagens e quando a falha ocorre; isso ajuda a investigar de forma organizada." },
        { pergunta:"Por que testar uma possível causa por vez?", opcoes:["Para identificar qual alteração resolve ou causa a falha","Para gastar mais tempo","Para impedir que o computador ligue","Para evitar anotar os resultados"], correta:0, explicacao:"Alterar uma variável por vez torna o teste mais claro e ajuda a isolar a causa." },
        { pergunta:"Se o computador não liga, qual verificação inicial é razoável?", opcoes:["Verificar tomada, cabo e conexões de energia","Reinstalar todos os programas","Trocar a senha de usuário","Apagar os arquivos do SSD"], correta:0, explicacao:"Verificações simples de energia e conexões são um ponto de partida antes de avançar para diagnósticos internos." }
    ],
    "software-1-aula-1": [
        { pergunta:"O que é software?", opcoes:["Conjunto de programas e instruções","Somente peças físicas","Um tipo de conector","A energia que alimenta o PC"], correta:0, explicacao:"Software é a parte lógica do computador: programas, aplicativos e instruções." },
        { pergunta:"Qual alternativa é um exemplo de software?", opcoes:["Processador","Memória RAM","Sistema operacional","Placa-mãe"], correta:2, explicacao:"Sistema operacional é software; os demais são componentes físicos." },
        { pergunta:"Qual é a relação entre aplicativo e software?", opcoes:["Aplicativo é um tipo de software","Aplicativo é sempre uma peça de hardware","Software existe apenas em celulares","Aplicativos não executam tarefas"], correta:0, explicacao:"Aplicativos são programas de software que permitem ao usuário realizar tarefas específicas." }
    ],
    "software-1-aula-2": [
        { pergunta:"Qual é uma função central do sistema operacional?", opcoes:["Gerenciar recursos do computador e oferecer serviços aos programas","Aumentar fisicamente a RAM","Substituir a placa-mãe","Fabricar arquivos de hardware"], correta:0, explicacao:"O sistema operacional gerencia recursos, dispositivos, arquivos e fornece ambiente para aplicativos." },
        { pergunta:"Qual destes é um sistema operacional?", opcoes:["Windows","Microsoft Word","Google Chrome","VLC"], correta:0, explicacao:"Windows é um sistema operacional; Word, Chrome e VLC são aplicativos." },
        { pergunta:"O que é uma interface gráfica?", opcoes:["Uma forma visual de interagir com o sistema por janelas, ícones e menus","Um tipo de memória RAM","Um cabo usado para vídeo","Uma função exclusiva de impressoras"], correta:0, explicacao:"Interface gráfica permite interação visual usando elementos como janelas, menus e ícones." }
    ],
    "software-1-aula-3": [
        { pergunta:"O que é uma pasta no computador?", opcoes:["Um local para organizar arquivos e outras pastas","Um tipo de processador","Um programa que apaga dados","Uma memória temporária"], correta:0, explicacao:"Pastas organizam arquivos e subpastas em uma estrutura hierárquica." },
        { pergunta:"O que uma extensão como .pdf ou .jpg geralmente indica?", opcoes:["Formato ou tipo de arquivo","Tamanho da memória RAM","Marca do computador","Velocidade do processador"], correta:0, explicacao:"A extensão ajuda a identificar o formato do arquivo e os programas que podem abri-lo." },
        { pergunta:"Qual caminho representa uma localização dentro de pastas?", opcoes:["C:\\Users\\Aluno\\Documentos","1920 x 1080","3,4 GHz","16 GB de RAM"], correta:0, explicacao:"Um caminho de arquivo mostra a sequência de pastas e a localização de um item no sistema." }
    ],
    "software-1-aula-4": [
        { pergunta:"Qual é uma prática segura ao instalar um programa?", opcoes:["Baixar de fonte oficial ou confiável","Usar qualquer link de anúncio","Desativar a proteção do sistema","Instalar versões desconhecidas"], correta:0, explicacao:"Prefira fontes oficiais ou confiáveis para reduzir o risco de programas adulterados." },
        { pergunta:"Por que verificar requisitos antes da instalação?", opcoes:["Para confirmar compatibilidade com o sistema e hardware","Para apagar arquivos antigos automaticamente","Para evitar que o programa tenha ícone","Para trocar a senha do computador"], correta:0, explicacao:"Requisitos ajudam a confirmar que o programa é compatível e pode funcionar adequadamente." },
        { pergunta:"O que uma atualização de programa pode trazer?", opcoes:["Correções, melhorias e ajustes de segurança","Apenas novos wallpapers","Aumento garantido de memória física","Desinstalação automática de todos os arquivos"], correta:0, explicacao:"Atualizações podem corrigir bugs, melhorar funções e fechar vulnerabilidades." }
    ],
    "software-2-aula-1": [
        { pergunta:"Qual é um exemplo de aplicativo utilitário?", opcoes:["Calculadora","Placa de vídeo","Memória RAM","Cabo HDMI"], correta:0, explicacao:"Calculadora é um programa utilitário; os demais são itens de hardware." },
        { pergunta:"Para que serve um gerenciador de arquivos?", opcoes:["Organizar, copiar, mover e localizar arquivos e pastas","Aumentar a frequência da CPU","Substituir o sistema operacional","Reparar fisicamente o monitor"], correta:0, explicacao:"Gerenciadores de arquivos permitem organizar e manipular arquivos e pastas." },
        { pergunta:"Qual programa é normalmente usado para abrir páginas da internet?", opcoes:["Navegador","Editor de imagem","Calculadora","Desfragmentador"], correta:0, explicacao:"Navegadores são usados para acessar sites e serviços na web." }
    ],
    "software-2-aula-2": [
        { pergunta:"Qual prática ajuda a proteger uma conta?", opcoes:["Usar senhas fortes e diferentes","Compartilhar senha em grupos","Reutilizar a senha em todos os sites","Desativar autenticação extra"], correta:0, explicacao:"Senhas únicas e fortes reduzem o impacto de vazamentos e dificultam acesso indevido." },
        { pergunta:"O que é phishing?", opcoes:["Tentativa de enganar alguém para obter dados ou acesso","Uma atualização do Windows","Um tipo de memória","Uma ferramenta de limpeza física"], correta:0, explicacao:"Phishing usa mensagens ou páginas falsas para induzir a vítima a revelar dados ou executar ações." },
        { pergunta:"Ao receber um link suspeito por mensagem, o mais seguro é:", opcoes:["Abrir imediatamente","Verificar remetente e endereço, sem clicar se houver suspeita","Enviar seus dados para confirmar","Desativar o antivírus"], correta:1, explicacao:"Links suspeitos podem levar a páginas fraudulentas ou downloads maliciosos; verifique antes e evite abrir." }
    ],
    "software-2-aula-3": [
        { pergunta:"Qual é a função de um antivírus?", opcoes:["Detectar, bloquear e ajudar a remover ameaças","Aumentar a resolução do monitor","Criar arquivos de texto","Substituir o processador"], correta:0, explicacao:"Antivírus ajuda a identificar e bloquear malware e pode remover ameaças detectadas." },
        { pergunta:"Por que manter o sistema atualizado?", opcoes:["Para receber correções e melhorias, inclusive de segurança","Para impedir o uso de arquivos","Para desativar a internet","Para apagar a memória RAM permanentemente"], correta:0, explicacao:"Atualizações corrigem falhas conhecidas e ajudam a proteger o sistema." },
        { pergunta:"O que é um patch de segurança?", opcoes:["Uma correção que resolve vulnerabilidades ou falhas","Um acessório para o gabinete","Uma pasta de arquivos pessoais","Um dispositivo para conectar teclado"], correta:0, explicacao:"Patch é uma atualização/correção que pode resolver falhas, incluindo vulnerabilidades de segurança." }
    ],
    "software-2-aula-4": [
        { pergunta:"Um programa apresenta erro após uma atualização. Qual abordagem inicial é adequada?", opcoes:["Anotar a mensagem e verificar compatibilidade e soluções conhecidas","Apagar todos os arquivos pessoais","Desligar permanentemente o antivírus","Trocar a memória RAM sem investigar"], correta:0, explicacao:"Identifique a mensagem e o contexto; verifique compatibilidade, atualizações ou reparos antes de mudanças maiores." },
        { pergunta:"Por que reiniciar o computador pode ajudar em alguns problemas de software?", opcoes:["Pode encerrar processos temporários e reiniciar serviços","Repara qualquer peça física automaticamente","Aumenta permanentemente a capacidade do SSD","Substitui todos os aplicativos instalados"], correta:0, explicacao:"Reiniciar pode limpar estados temporários e reiniciar processos ou serviços, mas não resolve todos os problemas." },
        { pergunta:"Se um problema começou após instalar um aplicativo, o que ajuda no diagnóstico?", opcoes:["Verificar se o erro começou após a instalação e avaliar o aplicativo","Ignorar o momento em que começou","Alterar várias configurações sem registro","Excluir todos os documentos"], correta:0, explicacao:"Relacionar o início da falha a uma mudança recente ajuda a identificar uma possível causa." }
    ]
};

let concluidos = [];
let aulasConcluidas = [];
let atividadesSemanais = [];
let aulaAtualIndice = 0;
let pontuacaoAtual = null;
        atividadesSemanais = [];
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
        linha.className = "module-modal-lesson" + (aulasConcluidas.includes(id) ? " is-complete" : "");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "moduleLesson-" + id;
        checkbox.checked = aulasConcluidas.includes(id);
        checkbox.setAttribute("aria-label", "Marcar " + nomeAula + " como concluída");
        checkbox.addEventListener("change", async () => {
            const novas = checkbox.checked
                ? [...new Set([...aulasConcluidas, id])]
                : aulasConcluidas.filter(item => item !== id);
            const sucesso = await salvarListaAulas(novas, id, checkbox.checked);
            if (sucesso) abrirModalModulo(modulo.id);
            else checkbox.checked = !checkbox.checked;
        });
        const texto = document.createElement("label");
        texto.htmlFor = checkbox.id;
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
        linha.append(checkbox, texto, abrirAula);
        lista.appendChild(linha);
    });

    const rodape = document.createElement("div");
    rodape.className = "module-modal-footer";
    const dica = document.createElement("small");
    dica.textContent = "Marque as aulas que você já concluiu.";
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
    const listaValida = [...new Set(novasAulas.filter(id => idsValidos.includes(id)))];
    const novosModulos = modulos.filter(modulo =>
        modulo.aulas.length > 0 && modulo.aulas.every((_, indice) => listaValida.includes(idDaAula(modulo, indice)))
    ).map(modulo => modulo.id);
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
    concluidos = novosModulos;
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

    const area = document.createElement("small");
    area.className = "module-area-tag";
    area.textContent = modulo.area;

    const titulo = document.createElement("h3");
    titulo.textContent = modulo.titulo.replace(modulo.area + " — ", "Módulo ");

    const descricao = document.createElement("p");
    descricao.textContent = modulo.descricao;

    const botao = document.createElement("button");
    botao.className = "primary";
    botao.type = "button";
    botao.textContent = concluidos.includes(modulo.id) ? "Revisar módulo →" : "Começar →";
    botao.addEventListener("click", () => abrirModalModulo(modulo.id));

    corpo.append(area, titulo, descricao, botao);
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
    botao.addEventListener("click", () => abrirModalModulo(modulo.id));
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

    if (inicio) inicio.replaceChildren(...modulos.map(criarCardInicio));

    if (todos) {
        const filtrados = modulos.filter(modulo => {
            const feitas = aulasConcluidasDoModulo(modulo);
            const total = modulo.aulas.length;
            if (filtroAtual === "Hardware" || filtroAtual === "Software") return modulo.area === filtroAtual;
            if (filtroAtual === "Em andamento") return feitas > 0 && feitas < total;
            if (filtroAtual === "Concluídos") return feitas === total;
            return true;
        });
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


function atualizarBotaoProximaAula() {
    const botao = document.getElementById("nextLessonButton");
    if (!botao || !moduloAtual) return;
    const indiceModulo = modulos.findIndex(modulo => modulo.id === moduloAtual.id);
    const temProximaNaAula = aulaAtualIndice + 1 < moduloAtual.aulas.length;
    const temProximoModulo = indiceModulo >= 0 && indiceModulo + 1 < modulos.length;
    if (temProximaNaAula || temProximoModulo) {
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

function carregarVideoDaAula {
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

async 
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

function renderizarQuizDaAula() {
    const container = document.getElementById("lessonQuizContainer");
    if (!container || !moduloAtual) return;
    const idAula = idDaAula(moduloAtual, aulaAtualIndice);
    const quiz = quizzesPorAula[idAula] || [];
    const resultados = lerResultadosQuizzes();
    const jaRespondido = resultados[idAula];
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
    form.addEventListener("submit", evento => {
        evento.preventDefault();
        if (jaRespondido) {
            const resultadosAtuais = lerResultadosQuizzes();
            delete resultadosAtuais[idAula];
            try { localStorage.setItem(chaveQuizzesDoUsuario(), JSON.stringify(resultadosAtuais)); } catch (_) {}
            renderizarQuizDaAula();
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
        salvarResultadoQuizAula(idAula, { score, respostas: escolhas, data: new Date().toISOString() });
        renderizarQuizDaAula();
    });
    container.appendChild(form);
}
function configurarProximaAula() {
    const botao = document.getElementById("nextLessonButton");
    if (!botao) return;
    botao.addEventListener("click", async () => {
        if (!moduloAtual) return;
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

function concluirAulaAtual() {
    if (!moduloAtual) return;
    const idAula = idDaAula(moduloAtual, aulaAtualIndice);
    if (aulasConcluidas.includes(idAula)) return;
    const novas = [...aulasConcluidas, idAula];
    await salvarListaAulas(novas, idAula, true);
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
        ring.style.background = "conic-gradient(#39765F 0deg, #39765F " + angulo + "deg, #E8E0D4 " + angulo + "deg 360deg)";
    }
    if (done) done.textContent = aulasConcluidas.length;

    const homeDone = document.getElementById("homeDoneCount");
    const homeLessons = document.getElementById("homeLessons");
    const homeScore = document.getElementById("homeScore");
    const mensagem = document.querySelector(".home-progress-message strong");
    const botaoInicio = document.getElementById("homeResumeButton");
    const proxima = document.getElementById("homeNextLesson");
    if (homeDone) homeDone.textContent = aulasConcluidas.length;
    if (homeLessons) homeLessons.textContent = aulasConcluidas.length + " de " + totalAulas;
    if (homeScore) homeScore.textContent = pontuacaoAtual === null ? "N/A" : pontuacaoAtual + "%";
    if (mensagem) mensagem.textContent = percentual === 0
        ? "Pronto para começar sua jornada!"
        : percentual === 100 ? "Jornada concluída. Parabéns!" : "Você está indo muito bem!";
    if (botaoInicio) {
        const texto = botaoInicio.querySelector("span");
        if (texto) texto.textContent = percentual === 100
            ? "Revisar Estudos"
            : percentual === 0 ? "Começar Estudos" : "Retomar Estudos";
    }
    const proximaAula = proximaAulaPendente();
    if (proxima) proxima.textContent = proximaAula
        ? "Próxima aula: " + proximaAula.nome
        : "Todas as aulas foram concluídas!";
    atualizarWidgetsDeMeta();

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
    atualizarResumo();
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

async function carregarProgressoDaConta() {
    concluidos = [];
    aulasConcluidas = [];
    atividadesSemanais = [];
    pontuacaoAtual = null;

    if (!sessaoAtual) {
        atualizarResumo();
        return;
    }

    const { data, error } = await supabaseClient
        .from("student_progress")
        .select("completed_lessons, quiz_score, weekly_activity")
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

    const atividadesRemotas = normalizarAtividadesSemanais(data?.weekly_activity);
    const atividadesLocais = normalizarAtividadesSemanais(lerAtividadeSemanalLocal());
    atividadesSemanais = normalizarAtividadesSemanais([...atividadesRemotas, ...atividadesLocais]);

    if (JSON.stringify(atividadesSemanais) !== JSON.stringify(atividadesRemotas)) {
        const modulosConcluidos = modulos.filter(modulo =>
            modulo.aulas.every((_, indice) => aulasConcluidas.includes(idDaAula(modulo, indice)))
        ).map(modulo => modulo.id);

        const { error: erroMigracao } = await supabaseClient.from("student_progress").upsert({
            user_id: sessaoAtual.user.id,
            completed_lessons: aulasConcluidas,
            completed_modules: modulosConcluidos,
            weekly_activity: atividadesSemanais,
            quiz_score: pontuacaoAtual,
            updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

        if (erroMigracao) {
            console.warn("Não foi possível sincronizar o histórico semanal antigo.", erroMigracao);
        } else {
            salvarCopiaLocalAtividadeSemanal(atividadesSemanais);
        }
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
        atividadesSemanais = [];
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
        atividadesSemanais = [];
        try { localStorage.removeItem(chaveAtividadeSemanal()); localStorage.removeItem(chaveQuizzesDoUsuario()); } catch (_) {}
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

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) console.error("Erro ao verificar sessão:", error);
    sessaoAtual = data?.session || null;

    if (sessaoAtual) {
        await carregarProgressoDaConta();
        ocultarAcesso();
    } else {
        concluidos = [];
        pontuacaoAtual = null;
        atividadesSemanais = [];
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
            atividadesSemanais = [];
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
