# Contribuindo para o DB Diagram

Obrigado por seu interesse em contribuir! Todo tipo de contribuição é bem-vindo.

## Como Contribuir

### Reportar Bugs

1. Verifique se o bug já foi reportado em [Issues](https://github.com/IamThiago-IT/diagram/issues)
2. Se não, abra uma nova issue com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Prints ou GIFs se possível

### Sugerir Funcionalidades

1. Abra uma issue com a tag `enhancement`
2. Descreva a funcionalidade e o caso de uso

### Enviar Pull Requests

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feat/nova-funcionalidade`)
3. Faça suas alterações
4. Execute o build para verificar:
   ```bash
   npm run build
   ```
5. Faça commit com mensagem descritiva:
   ```bash
   git commit -m "feat: adicionar funcionalidade X"
   ```
6. Push para sua branch:
   ```bash
   git push origin feat/nova-funcionalidade
   ```
7. Abra um Pull Request

## Convenções de Commit

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

| Prefixo | Descrição |
|---------|-----------|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alteração na documentação |
| `style:` | Formatação (não afeta o código) |
| `refactor:` | Refatoração sem alterar funcionalidade |
| `test:` | Adicionar ou ajustar testes |
| `chore:` | Tarefas de manutenção |

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar em produção
npm start
```

## Estrutura do Projeto

```
src/
├── app/              # Páginas e layout (Next.js App Router)
├── components/
│   ├── diagram/      # Componentes do diagrama
│   └── ui/           # Componentes shadcn/ui
├── interface/        # Types TypeScript
├── store/            # Zustand store
└── lib/              # Utilitários
```

## Perguntas?

Abra uma issue com a tag `question` ou entre em contato pelo GitHub.
