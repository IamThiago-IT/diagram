# Changelog

Todas as mudanças notáveis deste projeto são documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.1.0] - 2026-11-26

Primeiro release público do DB Diagram.

### Adicionado

- Editor visual de diagramas de banco de dados com React Flow.
- Criação de tabelas por drag-and-drop, com nome, colunas, tipos SQL e chaves primárias.
- Edição de tabelas por duplo-clique, incluindo adição, remoção e edição de colunas.
- 22 tipos SQL (integer, bigint, varchar, uuid, jsonb, timestamp, entre outros).
- Relações entre colunas com notação crow's foot e labels de cardinalidade.
- Sidebar com busca de tabelas, contagem de colunas, zoom-to e lista de relações.
- Undo/redo com `Ctrl+Z`, `Ctrl+Y` e `Ctrl+Shift+Z`.
- Persistência automática no `localStorage`.
- Exportação em JSON, SQL DDL e PNG.
- Importação de diagramas via JSON.
- Tema claro/escuro com `next-themes`.
- Internacionalização em pt-BR, en, fr, ja e es com `next-intl`.
- Paleta de cores sage-green customizada.
- Build Docker multi-stage com `output: standalone` e `docker-compose`.
- Documentação: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY e licença MIT.

[0.1.0]: https://github.com/IamThiago-IT/diagram/releases/tag/v0.1.0
