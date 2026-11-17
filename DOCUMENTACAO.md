# H.S. Bruno — Centro de Aprendizado Tecnológico

> Documentação do projeto, de suas funcionalidades e de sua utilização.

- **Projeto:** H.S. Bruno — Centro de Aprendizado Tecnológico
- **Tipo:** plataforma educacional web
- **Público-alvo:** estudantes, professores e pessoas interessadas em informática
- **Áreas de estudo:** Hardware e Software
- **Acesso:** navegador de computador ou celular
- **Repositório:** https://github.com/dudewzz/H.S-Bruno
- **Endereço publicado:** https://h-s-bruno.vercel.app

---

## 1. Apresentação

O H.S. Bruno é uma plataforma educacional desenvolvida para organizar conteúdos introdutórios de informática em um ambiente digital. A proposta é oferecer uma experiência de aprendizagem simples, permitindo que o estudante consulte módulos, acompanhe seu progresso e responda a avaliações.

O sistema foi planejado para funcionar em computadores e celulares, diretamente pelo navegador, sem exigir a instalação de um aplicativo.

## 2. Problema identificado

Muitos estudantes têm dificuldade para encontrar conteúdos de informática organizados em uma sequência clara e acessível. O projeto procura reunir os assuntos de Hardware e Software em um único ambiente, com acompanhamento do aprendizado.

## 3. Objetivos

### Objetivo geral

Desenvolver uma plataforma web de apoio ao aprendizado de conceitos fundamentais de Hardware e Software.

### Objetivos específicos

- Organizar os conteúdos em módulos e assuntos.
- Disponibilizar uma área para videoaulas.
- Permitir que o estudante acompanhe as aulas concluídas.
- Apresentar o progresso geral e uma meta semanal de estudos.
- Oferecer um quiz para praticar os conhecimentos.
- Registrar informações de progresso e pontuação.
- Disponibilizar uma área administrativa para acompanhamento dos dados dos alunos.

## 4. Organização dos conteúdos

O planejamento didático possui quatro módulos e 17 assuntos:

| Módulo | Área | Conteúdos |
|---|---|---|
| Hardware — Módulo 1 | Hardware | Introdução ao hardware; Memória RAM; Armazenamento; Placa-mãe; Processador |
| Hardware — Módulo 2 | Hardware | Ferramentas e segurança; Montagem do computador; Limpeza preventiva; Diagnóstico de falhas |
| Software — Módulo 1 | Software | O que é software?; Sistemas operacionais; Arquivos e pastas; Instalação e atualização de programas |
| Software — Módulo 2 | Software | Aplicativos e utilitários; Segurança digital; Antivírus e atualizações; Solução de problemas de software |

**Situação dos conteúdos:** os módulos e seus assuntos estão cadastrados na aplicação. Os arquivos das videoaulas ainda precisam ser produzidos/adicionados. Enquanto isso, a área de vídeo apresenta um espaço reservado.

## 5. Funcionalidades do sistema

### 5.1 Área do estudante

- **Início:** apresenta boas-vindas, acesso aos módulos, resumo do progresso e desempenho.
- **Módulos:** lista os módulos e permite filtrar por Hardware, Software, andamento e conclusão.
- **Pesquisa:** permite localizar módulos e assuntos pelo campo de pesquisa.
- **Aulas:** apresenta os assuntos do módulo selecionado e a área reservada ao vídeo.
- **Meu Progresso:** permite consultar o avanço registrado nas aulas.
- **Avaliações (Quiz):** apresenta perguntas de múltipla escolha sobre Hardware e Software, com feedback e pontuação.
- **Meta semanal:** acompanha a quantidade de aulas concluídas na semana, considerando a meta exibida no sistema.
- **Perfil e conta:** reúne as opções de conta e saída do sistema.
- **Tema claro/escuro:** permite alternar a aparência e guardar a preferência no navegador.

### 5.2 Cadastro e autenticação

O sistema utiliza o Supabase Auth para autenticar as contas. O estudante pode criar uma conta e entrar para acessar os recursos vinculados à sua sessão.

A autenticação é necessária para associar o progresso à conta do estudante. A disponibilidade do cadastro e as regras de acesso devem ser conferidas nas configurações do projeto antes da divulgação pública.

### 5.3 Painel administrativo

O painel fica no arquivo `H.S Bruno/admin.html` e é destinado a contas com permissão administrativa.

Possui três áreas:

- **Visão geral:** exibe totais de contas, alunos, aulas concluídas e média das pontuações, além de uma lista de alunos recentes.
- **Alunos:** permite pesquisar contas por e-mail e consultar data de cadastro, aulas e módulos concluídos, pontuação e última atividade.
- **Avaliações:** apresenta as pontuações registradas pelos alunos.

O painel verifica a sessão e a permissão administrativa antes de solicitar os dados. A consulta é realizada pela função de servidor `admin-dashboard`. A proteção dessa função e as políticas do banco precisam permanecer habilitadas.

O painel também possui alternância entre tema claro e escuro, compartilhando a preferência `hsbruno_theme` com a página principal no mesmo navegador.

## 6. Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura das páginas e componentes |
| CSS3 | Estilos, layout e adaptação para diferentes telas |
| JavaScript | Navegação, interações, quiz, progresso e lógica da aplicação |
| Supabase Auth | Cadastro, login e gerenciamento de sessão |
| Supabase Database | Armazenamento dos dados de progresso e pontuação |
| Supabase Edge Functions | Consulta protegida de dados do painel administrativo |
| Git e GitHub | Versionamento e armazenamento do código-fonte |
| Vercel | Hospedagem e publicação do site |
| Playwright | Testes automatizados de interface em navegadores |

A interface utiliza as fontes DM Sans e Manrope, carregadas pelo Google Fonts. A biblioteca cliente do Supabase é carregada pela CDN do jsDelivr.

## 7. Estrutura dos principais arquivos

A aplicação principal está na pasta `H.S Bruno/`.

| Arquivo ou pasta | Responsabilidade |
|---|---|
| `index.html` | Estrutura da plataforma do estudante |
| `style.css` | Aparência da plataforma principal e estilos dos temas |
| `script.js` | Módulos, navegação, autenticação, quiz, progresso e interações |
| `admin.html` | Estrutura do painel administrativo |
| `admin.css` | Estilos do painel administrativo |
| `admin.js` | Autorização, consulta e exibição dos dados administrativos |
| `videos/` | Local planejado para os arquivos das videoaulas |
| `tests/` | Testes automatizados do projeto, na raiz do repositório |

## 8. Dados e serviços

O projeto utiliza um serviço Supabase para autenticação e persistência de informações.

A tabela de progresso utilizada pela aplicação é `public.student_progress`. Ela relaciona os dados ao identificador da conta e armazena informações como módulos concluídos, aulas concluídas, pontuação do quiz, data de atualização e atividade semanal.

A função `admin-dashboard` fornece os dados necessários ao painel administrativo. A função deve validar a permissão administrativa no servidor. Chaves secretas e a chave de serviço do Supabase nunca devem ser colocadas no código do navegador ou neste documento.

A chave publicável usada pelo cliente web não substitui as regras de segurança. As políticas de Row Level Security (RLS), as permissões da função e as regras de autenticação precisam ser verificadas antes do lançamento público.

## 9. Como acessar e utilizar

### 9.1 Acessar a plataforma

1. Abra o navegador no computador ou celular.
2. Acesse https://h-s-bruno.vercel.app.
3. Crie uma conta ou entre com uma conta existente, conforme as opções disponíveis.
4. Navegue pelo menu para abrir os módulos, o progresso ou as avaliações.

### 9.2 Estudar um módulo

1. Abra **Módulos**.
2. Escolha um módulo de Hardware ou Software.
3. Selecione o assunto desejado.
4. Consulte a área de conteúdo. Quando a videoaula correspondente for adicionada, ela será exibida nessa área.
5. Utilize a opção de conclusão disponível para registrar o avanço.

### 9.3 Responder ao quiz

1. Abra **Avaliações**.
2. Leia a pergunta apresentada.
3. Escolha uma alternativa.
4. Utilize os controles de navegação para avançar ou voltar.
5. Consulte o feedback e a pontuação apresentada pelo sistema.

### 9.4 Acessar o painel administrativo

1. Entre primeiro na plataforma com uma conta autorizada.
2. Abra a página administrativa em `/admin.html`.
3. Se a conta possuir permissão administrativa, o painel carregará os indicadores e as informações disponíveis.
4. Utilize o menu lateral para alternar entre visão geral, alunos e avaliações.
5. Use o botão de tema para alternar entre modo claro e escuro.
6. Utilize **Sair** para encerrar a sessão.

O endereço do painel não concede permissão por si só. Somente uma conta autorizada deve conseguir consultar os dados administrativos.

## 10. Como executar o projeto localmente

1. Instale o Git e o Node.js em uma versão LTS.
2. Faça uma cópia do repositório:
   ```bash
   git clone https://github.com/dudewzz/H.S-Bruno.git
   ```
3. Entre na pasta do projeto:
   ```bash
   cd H.S-Bruno
   ```
4. Abra a pasta no Visual Studio Code.
5. Inicie um servidor local para servir os arquivos da pasta `H.S Bruno/`. Pode ser utilizada a extensão Live Server.
6. Abra no navegador o endereço local informado pelo servidor.

A aplicação depende de conexão com a internet para carregar o Supabase e recursos externos. As operações de autenticação e persistência dependem da disponibilidade e configuração do projeto Supabase.

## 11. Testes automatizados

O projeto possui testes automatizados com Playwright. Na configuração atual, os testes são executados nos projetos Chromium, Firefox e WebKit.

Para executar os testes na raiz do repositório:

```bash
npx playwright test
```

Para abrir o relatório HTML:

```bash
npx playwright show-report
```

**Registro de execução informado durante o desenvolvimento:** 21 testes aprovados. Esse resultado corresponde à execução realizada naquele momento e não significa que todos os recursos, integrações, contas ou dispositivos tenham sido testados.

## 12. Publicação e atualização

O código-fonte é mantido no GitHub e o projeto está configurado para publicação pela Vercel. Quando a integração estiver ativa, alterações enviadas à branch principal podem iniciar uma nova publicação automaticamente.

Para atualizar uma cópia local com as alterações do repositório:

```bash
git pull
```

A publicação deve ser conferida no painel da Vercel e testada pelo endereço público após cada atualização importante.

## 13. Requisitos e limitações atuais

- Navegador moderno e conexão com a internet.
- Cadastro e login dependem da configuração do Supabase Auth.
- O progresso sincronizado depende do acesso ao Supabase.
- As videoaulas ainda precisam ser adicionadas.
- O conteúdo textual completo de cada aula deve ser preparado pela equipe.
- O funcionamento em celulares deve ser conferido em aparelhos e tamanhos de tela diferentes.
- O painel administrativo exige uma conta com permissão específica.
- O sistema não deve ser divulgado amplamente antes da revisão das regras de acesso, RLS, função administrativa e privacidade.

## 14. Segurança e privacidade

Como a plataforma pode ser utilizada por estudantes, inclusive menores de idade, a equipe responsável deve:

- Informar de forma clara quais dados são coletados e para qual finalidade.
- Coletar somente os dados necessários ao funcionamento.
- Restringir o acesso aos dados administrativos.
- Garantir que cada estudante só possa consultar e alterar os próprios dados de progresso.
- Revisar as políticas RLS e a função administrativa.
- Não publicar senhas, tokens ou chaves secretas no repositório.
- Definir um canal de contato para dúvidas e solicitações relacionadas aos dados.

Este documento descreve o funcionamento técnico observado no projeto; ele não substitui uma política de privacidade nem uma auditoria de segurança.

## 15. Melhorias previstas

- Produzir e inserir as videoaulas dos quatro módulos.
- Preparar os materiais de apoio de cada assunto.
- Validar o cadastro, login, recuperação de sessão e sincronização de progresso na versão publicada.
- Testar a experiência em celulares.
- Revisar as regras de segurança do banco e do painel administrativo.
- Finalizar as informações de privacidade e orientações aos usuários.

## 16. Considerações finais

O H.S. Bruno reúne uma estrutura web para apoiar o ensino introdutório de Hardware e Software. A plataforma já possui navegação por módulos, recursos de acompanhamento, quiz e painel administrativo. A conclusão do projeto depende da inclusão dos conteúdos didáticos e da validação final de publicação, segurança, acessibilidade e experiência em dispositivos móveis.

---

**Documento de referência do projeto H.S. Bruno.**
