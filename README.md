# PEI Dr Gaspar Ricardo Junior

Aplicação web responsiva para gestão da biblioteca da PEI Dr Gaspar Ricardo Junior, com catálogo, busca e filtros, detalhes de livros, leitores, empréstimos e dashboard. A interface está em português do Brasil e os dados são persistidos no `localStorage` do navegador — não é necessário nenhum serviço externo.

## Executar localmente

Requisitos: Node.js 18+ e npm.

```bash
npm install
npm run dev
```

Abra a URL exibida pelo Vite (normalmente `http://localhost:5173`). Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Funcionalidades

- Dashboard com métricas, empréstimos recentes e ações rápidas.
- Catálogo com dados de exemplo, busca por título/autor, filtro por categoria e painel de detalhes.
- Login do bibliotecário com sessão persistida no navegador.
- Cadastro de novos bibliotecários com nome, e-mail, CPF e senha com letras e números.
- Recuperação de senha pelo e-mail cadastrado (modo demonstração local).
- Cadastro de alunos com nome, RA, telefone e e-mail opcional.
- Inclusão de novos livros e exemplares no acervo.
- Exclusão de livros com confirmação e proteção contra remoção de itens com empréstimo ativo.
- Botão para atualizar o aplicativo e painel público com dica de leitura e aluno destaque do mês.
- Registro de empréstimos com data de devolução.
- Devolução de livros, com estados ativo, em atraso e devolvido.
- Dados mantidos entre sessões usando `localStorage`.
- Layout adaptável para desktop e celular, com navegação por teclado e rótulos acessíveis.

Para resetar os dados de exemplo, remova as chaves `bv-books`, `bv-users` e `bv-loans` no armazenamento local do navegador.

## Acesso de demonstração

- E-mail: `bibliotecario@bibliotecaviva.com`
- Senha: `biblioteca123`

A sessão do bibliotecário é armazenada na chave `bv-librarian-session` e as contas na chave `bv-librarians` do `localStorage`. Como este é um protótipo sem backend, a recuperação de senha ocorre diretamente no navegador; em produção, substitua por um fluxo seguro com envio de token por e-mail.
