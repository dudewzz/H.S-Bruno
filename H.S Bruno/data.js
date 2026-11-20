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
    { area: "Hardware", pergunta: "Um PC fica lento quando vários programas estão abertos, mas melhora ao fechá-los. Qual hipótese é mais coerente?", opcoes: ["A RAM pode estar sendo muito utilizada, causando maior uso de memória virtual","O SSD está necessariamente queimado","A placa-mãe parou de reconhecer o processador","O monitor está consumindo toda a capacidade da CPU"], correta: 0, explicacao: "Muitos programas ativos consomem RAM; quando ela fica insuficiente, o sistema pode recorrer à memória virtual, mais lenta." },
    { area: "Hardware", pergunta: "Um computador apresenta falhas ao ligar, e o técnico suspeita de um módulo de RAM mal encaixado. Qual procedimento inicial é mais seguro?", opcoes: ["Retirar e recolocar a RAM com o equipamento desligado e desconectado, seguindo cuidados antiestáticos","Pressionar o módulo enquanto o computador está ligado","Limpar os contatos com água e recolocar imediatamente","Atualizar o navegador antes de abrir o gabinete"], correta: 0, explicacao: "A inspeção e o reencaixe devem ocorrer com o equipamento desligado e desconectado, adotando medidas contra descarga eletrostática." },
    { area: "Hardware", pergunta: "Uma placa-mãe possui um soquete diferente do processador disponível. Mesmo que ambos sejam modernos, o que deve ser verificado antes da montagem?", opcoes: ["Compatibilidade de soquete, chipset e suporte de BIOS/firmware","Apenas a marca do gabinete","Se o monitor usa HDMI","A quantidade de arquivos no SSD"], correta: 0, explicacao: "Compatibilidade depende do soquete, chipset e suporte do fabricante, incluindo a versão de firmware quando aplicável." },
    { area: "Hardware", pergunta: "Após instalar um SSD, o computador liga, mas o dispositivo não aparece no sistema. Qual sequência de investigação faz mais sentido?", opcoes: ["Verificar conexão, detecção na BIOS/UEFI e se o disco precisa ser inicializado ou particionado","Formatar imediatamente todos os outros discos","Trocar a fonte sem testar","Reinstalar o antivírus e ignorar o SSD"], correta: 0, explicacao: "Primeiro verifique se o SSD é detectado no firmware e se o sistema precisa configurá-lo; formatação não deve ser a primeira ação." },
    { area: "Hardware", pergunta: "Um computador desliga durante tarefas pesadas e a temperatura da CPU está elevada. Qual ação ajuda a distinguir superaquecimento de outras causas?", opcoes: ["Observar temperaturas e verificar fluxo de ar, cooler e dissipador antes de substituir peças","Desativar permanentemente os sensores de temperatura","Apagar arquivos pessoais para reduzir calor","Aumentar a resolução do monitor e repetir o teste"], correta: 0, explicacao: "Temperaturas e condições de refrigeração fornecem evidências para investigar superaquecimento antes de trocar componentes." },
    { area: "Hardware", pergunta: "Ao montar um PC, o conector de alimentação da CPU não corresponde ao conector encontrado na placa-mãe. O que fazer?", opcoes: ["Consultar manual e compatibilidade; não forçar nem improvisar conexão","Forçar o encaixe até travar","Usar qualquer cabo disponível da fonte","Ligar sem conectar e testar sob carga"], correta: 0, explicacao: "Conectores devem ser identificados e compatíveis; forçar ou improvisar pode danificar hardware e criar risco." },
    { area: "Hardware", pergunta: "Um teclado USB não funciona em uma porta, mas funciona em outra. Qual conclusão é mais prudente?", opcoes: ["A falha pode estar na porta, conexão ou configuração; o teste isolado não prova defeito no teclado","O teclado está definitivamente queimado","O sistema operacional deve ser formatado","A RAM precisa ser ampliada"], correta: 0, explicacao: "Comparar portas e dispositivos ajuda a isolar a origem; um teste isolado não determina a causa definitiva." },
    { area: "Hardware", pergunta: "Após limpeza, o PC liga, mas não exibe imagem. Qual abordagem evita mudanças desnecessárias?", opcoes: ["Revisar os componentes e cabos que foram manuseados, começando por RAM e conexões de vídeo","Trocar CPU, placa-mãe e SSD ao mesmo tempo","Formatar o disco sem verificar sinal de vídeo","Instalar mais aplicativos para testar"], correta: 0, explicacao: "Como o problema surgiu após a limpeza, revise cuidadosamente os encaixes e conexões alterados antes de realizar outras intervenções." },
    { area: "Software", pergunta: "Um aplicativo não abre para um usuário, mas funciona em outra conta do mesmo computador. O que isso sugere?", opcoes: ["Pode haver configuração, permissão ou dado de perfil específico do usuário afetado","O processador é incompatível com todo o sistema","O SSD está sem espaço obrigatoriamente","A rede elétrica impede a abertura apenas naquela conta"], correta: 0, explicacao: "Funcionamento em outro perfil sugere investigar configurações, permissões ou dados do perfil, sem descartar outras causas." },
    { area: "Software", pergunta: "Um instalador solicita permissões de administrador e veio de um site desconhecido. Qual atitude é mais adequada?", opcoes: ["Cancelar e verificar origem, reputação e necessidade do programa antes de conceder privilégios","Aceitar porque instaladores sempre precisam de acesso total","Desativar as proteções do sistema para concluir","Executar e depois verificar se há problemas"], correta: 0, explicacao: "Privilégios elevados aumentam o impacto de um programa malicioso; valide a fonte antes de executar." },
    { area: "Software", pergunta: "Um arquivo importante foi renomeado de relatorio.docx para relatorio.txt e não abre corretamente. Qual é a explicação mais provável?", opcoes: ["Alterar a extensão não converte o conteúdo para outro formato","Renomear sempre repara o documento","A RAM transforma automaticamente documentos em texto simples","A extensão não tem relação com o formato"], correta: 0, explicacao: "Renomear a extensão não converte a estrutura interna do arquivo; é necessário usar um programa capaz de exportar ou converter o formato." },
    { area: "Software", pergunta: "Após uma atualização, um driver novo causa instabilidade. Qual ação é mais adequada para investigar e recuperar?", opcoes: ["Verificar histórico e compatibilidade da atualização e considerar reverter o driver por um método oficial","Desativar todas as atualizações para sempre","Apagar a pasta de documentos do usuário","Instalar vários drivers de sites aleatórios"], correta: 0, explicacao: "Relacionar a falha à atualização e usar ferramentas oficiais para reverter ou corrigir o driver é uma abordagem controlada." },
    { area: "Software", pergunta: "Um navegador mostra alertas de certificado inválido em um site de login. O que o usuário deve fazer?", opcoes: ["Não informar credenciais e investigar endereço, conexão e certificado antes de prosseguir","Ignorar o alerta se o site tiver logotipo conhecido","Desativar a validação de certificados no navegador","Enviar a senha para o suporte por mensagem"], correta: 0, explicacao: "Alertas de certificado podem indicar conexão insegura ou problema de configuração; não insira dados sensíveis até esclarecer." },
    { area: "Software", pergunta: "Um computador tem pouco espaço livre e a atualização do sistema falha. Qual ação é mais apropriada?", opcoes: ["Verificar o espaço necessário e liberar espaço com ferramentas confiáveis, preservando arquivos importantes","Excluir aleatoriamente pastas do sistema","Desinstalar todos os drivers","Desativar atualizações permanentemente"], correta: 0, explicacao: "A atualização precisa de espaço; use ferramentas de limpeza e revise os arquivos antes de remover dados." },
    { area: "Software", pergunta: "Um usuário suspeita que um arquivo baixado seja malicioso. O arquivo ainda não foi executado. Qual opção reduz o risco?", opcoes: ["Não abrir, verificar origem e analisar com proteção de segurança atualizada","Executar para observar o comportamento","Renomear o arquivo para .jpg","Desativar o antivírus e extrair o conteúdo"], correta: 0, explicacao: "Evite executar arquivos suspeitos; valide a origem e utilize ferramentas de segurança antes de qualquer abertura." },
    { area: "Software", pergunta: "Uma impressora está instalada, mas os documentos ficam presos na fila. Qual teste inicial é mais útil?", opcoes: ["Verificar estado da impressora, conexão e fila de impressão antes de reinstalar tudo","Excluir arquivos pessoais do computador","Trocar o processador","Desativar o firewall sem avaliar a rede"], correta: 0, explicacao: "Estado do dispositivo, conexão e fila de impressão ajudam a identificar a causa antes de mudanças maiores." }
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
let videosAssistidos = [];
let resultadosDesafios = {};
let historicoDesafios = [];
let historicoQuizGeral = [];
let aulaAtualIndice = 0;
let pontuacaoAtual = null;
        atividadesSemanais = [];
let sessaoAtual = null;
let modoCadastro = false;
let moduloAtual = null;
let indicePergunta = 0;
let respostas = {};
let ordemOpcoesQuizGeral = {};
let filtroAtual = "Todos";
let avatarPerfilSelecionado = "🦊";
