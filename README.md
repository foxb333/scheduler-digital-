# Scheduler Digital

**Uma plataforma web de agenda escolar desenvolvida para auxiliar estudantes e equipes na organização de atividades acadêmicas.**

O Scheduler Digital simplifica o acompanhamento da rotina escolar, permitindo o gerenciamento de tarefas, trabalhos, avaliações, horários de aula e compromissos em um só lugar.

Em vez de depender de anotações espalhadas, o sistema oferece uma interface intuitiva com painéis dedicados para alunos, professores, diretores e administração.

## Características

* **Interface prática e intuitiva** — Design moderno com alternância entre tema escuro e tema claro.


* **Gestão académica completa** — Organização de tarefas, trabalhos, metas e notas bimestrais.
* **Calendário escolar** — Acompanhamento visual de prazos, avaliações e compromissos importantes.


* **Autenticação integrada** — Sistema de login seguro para alunos, equipe escolar e administradores via Supabase.


* **Painéis dedicados** — Áreas específicas e personalizadas para alunos, professores, direção e gestão de acessos.


* **Design responsivo** — Adaptado para funcionar corretamente em computadores e dispositivos móveis.

## Requisitos e Tecnologias

* HTML5, CSS3 e JavaScript


* Conta e projeto configurados no Supabase (para banco de dados e autenticação)


* Git e GitHub para controle de versão


* Navegador web atualizado



## Estrutura do Projeto

```text
scheduler-digital-/
├── README.md
├── index.html
├── login.html
├── admin-dashboard.html
├── aluno.html
├── professores.html
├── diretores.html
├── criadores.html
├── config.js
├── calendario.js
├── botão_tema.js
├── design.css
├── ana.png
├── gabriela.png
└── pietro.png

```
Nota: Os arquivos de imagem (ana.png, gabriela.png, pietro.png) podem ser substituídos ou atualizados conforme a necessidade para atender aos requisitos de exibição dos painéis e perfis dos criadores.

| Arquivo | Responsabilidade |
| :--- | :--- |
| `index.html` | Página inicial de apresentação e redirecionamento da plataforma.|
| `login.html` | Interface de autenticação e login de usuários.|
| `admin-dashboard.html` | Painel de controle e gerenciamento administrativo completo. |
| `aluno.html` | Painel exclusivo do aluno para tarefas, metas e horários.|
| `professores.html` | Área e informações voltadas ao corpo docente.|
| `diretores.html` | Área voltada à gestão escolar e diretoria.|
| `criadores.html` | Página de créditos com informações sobre os desenvolvedores. |
| `config.js` | Configuração e conexão com o Supabase.|
| `calendario.js` | Lógica e manipulação do calendário escolar. |
| `botão_tema.js` | Script de alternância entre os temas claro e escuro.|
| `design.css` | Folha de estilos principal do layout.|

## Como Executar

1. Crie uma pasta no seu computador com o nome de sua preferência.
2. Abra o **Visual Studio Code** e abra a pasta criada.
3. Abra o terminal integrado do VS Code e execute o comando abaixo para clonar o repositório:
   ```bash
   git clone [https://github.com/foxb333/scheduler-digital-.git](https://github.com/foxb333/scheduler-digital-.git)
4. Utilize a extensão Live Server para abrir o arquivo desktop HTML (index.html) diretamente no navegador.
