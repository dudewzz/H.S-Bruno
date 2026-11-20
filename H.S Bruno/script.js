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
    const novosModulos = modulos.filter(modulo => moduloCompleto(modulo)).map(modulo => modulo.id);
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

function criarCard(modulo){const artigo=document.createElement("article");artigo.className="module-card";artigo.dataset.area=modulo.area;artigo.dataset.search=(modulo.titulo+" "+modulo.descricao+" "+modulo.aulas.join(" ")).toLocaleLowerCase("pt-BR");const imagem=document.createElement("img");imagem.src=modulo.imagem;imagem.alt="Imagem ilustrativa do tema "+modulo.area;imagem.loading="lazy";imagem.onerror=()=>{imagem.hidden=true;};const corpo=document.createElement("div");corpo.className="module-body";const area=document.createElement("small");area.className="module-area-tag";area.textContent=modulo.area;const titulo=document.createElement("h3");titulo.textContent=modulo.titulo.replace(modulo.area+" — ","Módulo ");const descricao=document.createElement("p");descricao.textContent=modulo.descricao;const prog=document.createElement("small");prog.className="module-modal-progress";prog.textContent=progressoModulo(modulo)+"% das atividades concluídas";const botao=document.createElement("button");botao.className="primary";botao.type="button";botao.textContent=moduloCompleto(modulo)?"Revisar módulo →":"Começar →";botao.addEventListener("click",()=>abrirModalModulo(modulo.id));corpo.append(area,titulo,descricao,prog,botao);artigo.append(imagem,corpo);return artigo;}

function criarCardInicio(modulo){const artigo=document.createElement("article");artigo.className="home-module-card";const imagem=document.createElement("div");imagem.className="home-module-image";imagem.style.backgroundImage="url('"+modulo.imagem+"')";const corpo=document.createElement("div");corpo.className="home-module-body";const titulo=document.createElement("h3");titulo.textContent=modulo.area;const subtitulo=document.createElement("p");subtitulo.textContent=modulo.titulo.replace(modulo.area+" — ","Módulo ");const percent=progressoModulo(modulo),linha=document.createElement("div");linha.className="home-module-progress";const trilho=document.createElement("span"),barra=document.createElement("i");barra.style.width=percent+"%";trilho.appendChild(barra);const valor=document.createElement("b");valor.textContent=percent+"%";linha.append(trilho,valor);const botao=document.createElement("button");botao.type="button";botao.className="home-module-button";botao.textContent=percent===0?"▶  Começar":"▶  Continuar";botao.addEventListener("click",()=>abrirModalModulo(modulo.id));if(percent===100){const selo=document.createElement("span");selo.className="home-module-done";selo.textContent="✓";imagem.appendChild(selo);botao.textContent="✓  Revisar";}corpo.append(titulo,subtitulo,linha,botao);artigo.append(imagem,corpo);return artigo;}

function renderizarModulos(){const inicio=document.getElementById("homeModules"),todos=document.getElementById("allModules");if(inicio)inicio.replaceChildren(...modulos.map(criarCardInicio));if(todos){const filtrados=modulos.filter(m=>{const feitas=tarefasConcluidasModulo(m),total=totalTarefasModulo(m);if(filtroAtual==="Hardware"||filtroAtual==="Software")return m.area===filtroAtual;if(filtroAtual==="Em andamento")return feitas>0&&feitas<total;if(filtroAtual==="Concluídos")return moduloCompleto(m);return true;});todos.replaceChildren(...filtrados.map(criarCard));}aplicarPesquisa();}

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
    form.addEventListener("submit", async evento => {
        evento.preventDefault();
        if (jaRespondido) {
            const resultadosAtuais = lerResultadosQuizzes();
            delete resultadosAtuais[idAula];
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

function atualizarResumo(){const total=modulos.reduce((sum,m)=>sum+m.aulas.length,0),percent=Math.round(tarefasConcluidasPortal()/totalTarefasPortal()*100);const percentEl=document.getElementById("percent"),ring=document.getElementById("ring"),done=document.getElementById("doneCount");if(percentEl)percentEl.textContent=percent+"%";if(ring){const angle=percent*3.6;ring.style.background="conic-gradient(#39765F 0deg, #39765F "+angle+"deg, #E8E0D4 "+angle+"deg 360deg)";}if(done)done.textContent=aulasConcluidas.length;const homeDone=document.getElementById("homeDoneCount"),homeLessons=document.getElementById("homeLessons"),homeScore=document.getElementById("homeScore"),message=document.querySelector(".home-progress-message strong"),resume=document.getElementById("homeResumeButton"),next=document.getElementById("homeNextLesson");if(homeDone)homeDone.textContent=aulasConcluidas.length;if(homeLessons)homeLessons.textContent=aulasConcluidas.length+" de "+total+" aulas concluídas";if(homeScore)homeScore.textContent=pontuacaoAtual===null?"N/A":pontuacaoAtual+"%";if(message)message.textContent=percent===0?"Pronto para começar sua jornada!":percent===100?"Jornada concluída. Parabéns!":"Você está indo muito bem!";if(resume){const span=resume.querySelector("span");if(span)span.textContent=percent===100?"Revisar Estudos":percent===0?"Começar Estudos":"Retomar Estudos";}const upcoming=proximaAulaPendente();if(next)next.textContent=upcoming?"Próxima aula: "+upcoming.nome:"Todas as aulas foram concluídas!";atualizarWidgetsDeMeta();renderizarModulos();atualizarPainelProgresso();renderizarDesafios();renderizarHistorico();if(document.getElementById("perfil")?.classList.contains("active"))renderizarPerfilAluno();}

function atualizarPainelProgresso(){const score=document.getElementById("score"),performance=document.getElementById("performance");if(score)score.textContent=pontuacaoAtual===null?"—":pontuacaoAtual+"%";if(!performance)return;performance.replaceChildren();modulos.forEach(m=>{const row=document.createElement("div");row.className="performance-row";const name=document.createElement("span");name.textContent=m.titulo;const track=document.createElement("div");track.className="track";const fill=document.createElement("span");fill.style.width=progressoModulo(m)+"%";track.appendChild(fill);const status=document.createElement("span");status.textContent=moduloCompleto(m)?"Concluído":tarefasConcluidasModulo(m)+"/"+totalTarefasModulo(m)+" atividades";row.append(name,track,status);performance.appendChild(row);});}

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

async function carregarProgressoDaConta(){
 concluidos=[];aulasConcluidas=[];atividadesSemanais=[];pontuacaoAtual=null;videosAssistidos=lerVideosAssistidos();resultadosDesafios={};historicoDesafios=[];historicoQuizGeral=lerHistoricoQuizGeral();
 if(!sessaoAtual){atualizarResumo();return;}
 const {data,error}=await supabaseClient.from("student_progress").select("completed_lessons,quiz_score,weekly_activity").eq("user_id",sessaoAtual.user.id).maybeSingle();
 if(error){console.error("Erro ao carregar progresso:",error);mostrarToast("Não foi possível carregar seu progresso.");atualizarResumo();return;}
 if(data){const valid=modulos.flatMap(m=>m.aulas.map((_,i)=>idDaAula(m,i))),results=lerResultadosQuizzes();aulasConcluidas=Array.isArray(data.completed_lessons)?[...new Set(data.completed_lessons.filter(id=>valid.includes(id)&&results[id]))]:[];videosAssistidos=[...new Set([...videosAssistidos,...aulasConcluidas])];salvarVideosAssistidos(videosAssistidos);pontuacaoAtual=data.quiz_score??null;}
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

    // Registrar o listener antes de consultar a sessão evita perder eventos de autenticação
    // e impede que a resposta inicial atrasada reabra o login depois de um login bem-sucedido.
    let eventoAuthRecebido = false;
    supabaseClient.auth.onAuthStateChange((eventoAuth, session) => {
        eventoAuthRecebido = true;
        sessaoAtual = session;

        if (!session) {
            concluidos = [];
            aulasConcluidas = [];
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

function quantidadeQuizzesConcluidos(){const results=lerResultadosQuizzes();return modulos.reduce((sum,m)=>sum+m.aulas.filter((_,i)=>Boolean(results[idDaAula(m,i)])).length,0);}
function quantidadeDesafiosConcluidos(){return modulos.filter(m=>Boolean(resultadosDesafios[m.id]?.completed)).length;}
function tarefasConcluidasModulo(m){const results=lerResultadosQuizzes(),video=m.aulas.filter((_,i)=>videosAssistidos.includes(idDaAula(m,i))).length,quiz=m.aulas.filter((_,i)=>Boolean(results[idDaAula(m)])).length,challenge=resultadosDesafios[m.id]?.completed?1:0;return video+quiz+challenge;}
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
function renderizarDesafios(){const grid=document.getElementById("challengeModules");if(!grid)return;grid.replaceChildren();modulos.forEach(m=>{const result=resultadosDesafios[m.id],card=document.createElement("article");card.className="panel challenge-card";const title=document.createElement("h2");title.textContent=m.titulo;const desc=document.createElement("p");desc.textContent=m.descricao;const meta=document.createElement("small");meta.className="challenge-card-meta";meta.textContent=result?.completed?"Concluído · nota "+result.score+"/3":"3 situações práticas";const track=document.createElement("div");track.className="challenge-card-progress";const bar=document.createElement("span");bar.style.width=result?.completed?"100%":"0%";track.appendChild(bar);const btn=document.createElement("button");btn.type="button";btn.className=result?.completed?"secondary":"primary";btn.textContent=result?.completed?"Ver/Refazer":"Iniciar desafio";btn.addEventListener("click",()=>abrirDesafio(m.id));card.append(title,desc,meta,track,btn);grid.appendChild(card);});}
function abrirDesafio(moduleId,refazer=false){const m=modulos.find(v=>v.id===moduleId),area=document.getElementById("challengeWorkspace");if(!m||!area)return;const items=desafiosPorModulo[moduleId]||[],previous=refazer?null:resultadosDesafios[moduleId];area.hidden=false;area.replaceChildren();const heading=document.createElement("h2");heading.textContent="Desafio prático · "+m.titulo;const intro=document.createElement("p");intro.className="challenge-intro";intro.textContent="Responda às situações aplicando o que aprendeu. Depois de finalizar, veja as explicações e tente novamente se quiser.";area.append(heading,intro);const form=document.createElement("form");form.className="challenge-form";
items.forEach((item,index)=>{const field=document.createElement("fieldset");field.className="challenge-question";const legend=document.createElement("legend");legend.textContent=(index+1)+". "+item.pergunta;field.appendChild(legend);const order=item.opcoes.map((_,i)=>i).sort((a,b)=>((a+index)%item.opcoes.length)-((b+index)%item.opcoes.length));order.forEach(optionIndex=>{const label=document.createElement("label");label.className="challenge-answer";const input=document.createElement("input");input.type="radio";input.name="challenge-"+index;input.value=String(optionIndex);input.checked=previous?.respostas?.[index]===optionIndex;input.disabled=Boolean(previous?.completed);label.append(input,document.createTextNode(item.opcoes[optionIndex]));field.appendChild(label);});if(previous?.completed){const explain=document.createElement("p");explain.className="lesson-quiz-explanation";explain.textContent=(previous.respostas[index]===item.correta?"Acertou. ":"Errou. ")+"Resposta: "+item.opcoes[item.correta]+". "+item.explicacao;field.appendChild(explain);}form.appendChild(field);});
const feedback=document.createElement("div");feedback.className="challenge-result";const button=document.createElement("button");button.type="submit";button.className="primary";button.textContent=previous?.completed?"Refazer desafio":"Finalizar desafio";form.append(button,feedback);if(previous?.completed)feedback.textContent="Nota: "+previous.score+"/3. "+(previous.score===3?"Excelente!":"Revise as explicações e refaça se desejar.");
form.addEventListener("submit",async e=>{e.preventDefault();if(!sessaoAtual){mostrarToast("Entre na conta para registrar o desafio.");mostrarAcesso();return;}if(previous?.completed){abrirDesafio(moduleId,true);return;}const answers=items.map((_,i)=>{const selected=form.querySelector('input[name="challenge-'+i+'"]:checked');return selected?Number(selected.value):null;});if(answers.some(v=>v===null)){mostrarToast("Responda às três situações antes de finalizar.");return;}const score=items.reduce((sum,item,i)=>sum+(answers[i]===item.correta?1:0),0),date=new Date().toISOString(),entry={moduleId,score,respostas:answers,data:date},attempts=[...(resultadosDesafios[moduleId]?.attempts||[]),entry].slice(-50);resultadosDesafios[moduleId]={completed:true,score,respostas:answers,data:date,attempts};historicoDesafios=[...historicoDesafios,entry].slice(-50);salvarDesafiosSalvos();const completeModules=modulos.filter(moduloCompleto).map(x=>x.id);const {error:saveError}=await supabaseClient.from("student_progress").upsert({user_id:sessaoAtual.user.id,completed_lessons:aulasConcluidas,completed_modules:completeModules,weekly_activity:atividadesSemanais,quiz_score:pontuacaoAtual,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(saveError)console.warn("Desafio guardado localmente; falha ao sincronizar conclusão de módulos",saveError);atualizarResumo();abrirDesafio(moduleId);mostrarToast("Desafio concluído!");});area.appendChild(form);area.scrollIntoView({behavior:"smooth",block:"start"});}
function renderizarHistorico(){const quizCount=quantidadeQuizzesConcluidos(),challengeCount=quantidadeDesafiosConcluidos(),generalCount=historicoQuizGeral.length,notes=[];Object.values(lerResultadosQuizzes()).forEach(r=>notes.push(Math.round((Number(r.score)||0)/3*100)));historicoQuizGeral.forEach(r=>notes.push(Number(r.score)||0));historicoDesafios.forEach(r=>notes.push(Math.round((Number(r.score)||0)/3*100)));const avg=notes.length?Math.round(notes.reduce((a,b)=>a+b,0)/notes.length):null;const q=document.getElementById("historyLessonQuizzes"),d=document.getElementById("historyChallenges"),g=document.getElementById("historyGeneralAttempts"),a=document.getElementById("historyAverage");if(q)q.textContent=quizCount+"/17";if(d)d.textContent=challengeCount+"/4";if(g)g.textContent=generalCount;if(a)a.textContent=avg===null?"—":avg+"%";const container=document.getElementById("historyActivities");if(!container)return;container.replaceChildren();const entries=[];Object.entries(lerResultadosQuizzes()).forEach(([id,r])=>{const lesson=buscarAulaId(id);if(lesson)entries.push({type:"Quiz da aula",title:lesson.nome,details:lesson.module.titulo,date:r.data,score:Math.round((Number(r.score)||0)/3*100)});(r.tentativas||[]).forEach(attempt=>entries.push({type:"Tentativa anterior",title:lesson?.nome||"Quiz",details:"Quiz da aula",date:attempt.data,score:Math.round((Number(attempt.score)||0)/3*100)}));});historicoQuizGeral.forEach(r=>entries.push({type:"Quiz geral",title:"Avaliação geral",details:"Hardware e Software",date:r.data,score:r.score}));historicoDesafios.forEach(r=>{const module=modulos.find(m=>m.id===r.moduleId);entries.push({type:"Desafio prático",title:module?.titulo||"Desafio",details:"Tentativa registrada",date:r.data,score:Math.round((Number(r.score)||0)/3*100)});});entries.sort((a,b)=>new Date(b.date)-new Date(a.date));if(!entries.length){const empty=document.createElement("p");empty.className="history-empty";empty.textContent="Ainda não há atividades. Faça uma aula, quiz ou desafio para iniciar seu histórico.";container.appendChild(empty);return;}entries.slice(0,50).forEach(entry=>{const row=document.createElement("div");row.className="history-activity";const icon=document.createElement("span");icon.className="history-activity-icon";icon.textContent=entry.type.includes("Desafio")?"◆":entry.type.includes("geral")?"★":"✓";const copy=document.createElement("div");copy.className="history-activity-copy";const title=document.createElement("strong");title.textContent=entry.title;const detail=document.createElement("small");detail.textContent=entry.type+" · "+entry.details+" · "+(entry.date?new Date(entry.date).toLocaleString("pt-BR"):"data indisponível");copy.append(title,detail);const score=document.createElement("span");score.className="history-activity-score";score.textContent=entry.score===undefined?"":entry.score+"%";row.append(icon,copy,score);container.appendChild(row);});}
function buscarAulaId(id){for(const m of modulos){const index=m.aulas.findIndex((_,i)=>idDaAula(m,i)===id);if(index>=0)return{module:m,nome:m.aulas[index],indice:index};}return null;}
document.addEventListener("DOMContentLoaded", iniciarPortal);
