# DB Diagram

Editor interativo de diagramas de banco de dados. Crie tabelas, defina colunas e tipos, conecte relações com cardinalidade visual (crow's foot), e exporte como SQL DDL, JSON ou PNG.

## Tecnologias

- **[Next.js](https://nextjs.org/)** — Framework React (App Router, Turbopack)
- **[React Flow](https://reactflow.dev/)** — Motor de diagramas interativos
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Gerenciamento de estado com undo/redo e persistência
- **[shadcn/ui](https://ui.shadcn.com/)** — Componentes UI (Radix UI + Tailwind CSS)
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Estilização utilitária
- **[Lucide Icons](https://lucide.dev/)** — Ícones

## Funcionalidades

### Edição de Tabelas
- **Duplo-clique** em uma tabela para editar nome, colunas, tipos SQL e chaves primárias
- Adicione, remova e reordene colunas no modal de edição
- **22 tipos SQL** suportados (integer, varchar, uuid, jsonb, etc.)
- Botão **X** no header do nó para excluir a tabela

### Relações e Cardinalidade
- Conecte colunas arrastando entre handles (aparecem ao hover)
- Notação **crow's foot** visual com símbolos SVG (1:1, 1:N, N:M)
- Labels de cardinalidade nas arestas
- Selecione uma aresta e clique no **X** para remover

### Sidebar
- Lista de tabelas existentes com contagem de colunas
- **Campo de busca** para filtrar tabelas
- **Zoom-to**: clique no ícone de foco para navegar até a tabela
- Seção de **Relações** listando todas as conexões

### Controles do Cabeçalho
- **Undo/Redo** (botões ou `Ctrl+Z` / `Ctrl+Y`)
- **Exportar** como JSON, SQL DDL ou PNG
- **Importar** diagrama a partir de arquivo JSON
- **Limpar** diagrama (com confirmação)

### Persistência
- Salvamento automático no **localStorage**
- Dados persistem entre sessões

### Atalhos de Teclado
| Atalho | Ação |
|---|---|
| `Ctrl+Z` | Desfazer |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Refazer |
| `Delete` / `Backspace` | Excluir nó ou aresta selecionado |

## Como Rodar

### Pré-requisitos

- **Node.js** 18+ ou **Bun**
- npm, yarn, pnpm ou bun

### Instalação

```bash
git clone https://github.com/IamThiago-IT/diagram.git
cd diagram
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz (fonts, metadata)
│   ├── page.tsx            # Página principal com ReactFlow
│   └── globals.css         # Tokens de design shadcn/ui
├── components/
│   ├── diagram/
│   │   ├── custom-node.tsx     # Nó de tabela (renderização + edição)
│   │   ├── custom-edge.tsx     # Aresta com cardinalidade crow's foot
│   │   ├── edit-table-dialog.tsx # Modal de edição de tabela
│   │   └── sidebar.tsx         # Sidebar com lista, busca, relações
│   └── ui/                     # Componentes shadcn/ui
├── interface/
│   └── index.tsx            # Types (Table, Column, Relation, SQL_TYPES)
├── store/
│   └── diagram-store.ts    # Zustand store (CRUD, undo/redo, persist)
└── lib/
    └── utils.ts            # cn() utility
```

## Licença

MIT
