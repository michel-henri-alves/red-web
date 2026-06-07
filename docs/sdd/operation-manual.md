# SDD Operation Manual / Manual de Operacao SDD

## English

### Purpose
Use this manual to operate the SDD workflow for new features, improvements, tests, and fixes. The same flow applies to frontend and backend projects; only the verification commands change by project.

### 1. Create A New Spec Manually
Use manual creation when the change is already clear or when you want full control over the wording.

1. Create a feature folder:

```bash
mkdir -p docs/features/NNNN-feature-slug
```

2. Create or copy the three required files:

```text
docs/features/NNNN-feature-slug/spec.md
docs/features/NNNN-feature-slug/plan.md
docs/features/NNNN-feature-slug/tasks.md
```

3. Fill the minimum required content:
- `spec.md`: problem, scope, impact classification, criticality, requirements with `REQ-*` ids, API/data contract, test strategy, and MCP sources when relevant.
- `plan.md`: files, canonical documentation updates for high-impact work, context bundle, agents, implementation sequence, tests, verification commands, risks, and Definition of Done.
- `tasks.md`: one implementation task and one verification/test task for each `REQ-*` id, plus a canonical documentation task when the feature is high impact.

4. Validate:

```bash
npm run sdd:check
```

If the terminal prints `Manual follow-up required`, fill those fields before implementation.

High-impact frontend features include new domains/workflows, domain data assumption changes, public backend/frontend contract changes, auth/tenant/role/session changes, POS/payment/data-loss flows, durable project memory changes, and reusable architecture patterns. For these features, update or create the impacted `docs/specs/{domain}.spec.md`, `docs/tasks/{domain}.tasks.md`, and `docs/memory/project.memory.md` entries before closing the work.

### 2. Create A New Spec With The Wizard
Use the wizard when you want consistent files and less manual formatting.

Local deterministic wizard:

```bash
npm run sdd:new
```

Translate wizard, useful when you answer in Portuguese and want English SDD files:

```bash
OPENAI_API_KEY=... npm run sdd:new:translate
```

AI-assisted wizard, useful for complex, ambiguous, or risky work:

```bash
OPENAI_API_KEY=... npm run sdd:new:ai
```

Custom AI provider:

```bash
SDD_AI_PROVIDER=custom SDD_AI_COMMAND="your-ai-command" npm run sdd:new:ai
```

The wizard creates:

```text
docs/features/NNNN-feature-slug/spec.md
docs/features/NNNN-feature-slug/plan.md
docs/features/NNNN-feature-slug/tasks.md
```

The AI-assisted wizard also creates:

```text
docs/features/NNNN-feature-slug/ai-report.md
```

### 3. Review Before Coding
List available agents:

```bash
npm run sdd:agents
```

Create an agent prompt/report for a feature:

```bash
npm run sdd:agent -- NNNN-feature-slug spec-reviewer
npm run sdd:agent -- NNNN-feature-slug planner
```

Recommended sequence:
- `spec-reviewer`: clarify ambiguity, missing requirements, contracts, risks, and acceptance criteria.
- `planner`: verify files, tests, implementation order, high-impact documentation updates, and Definition of Done.
- `implementation`: implement the approved plan.
- `test`: add or improve automated tests.
- `code-reviewer`: inspect correctness, maintainability, regressions, missing tests, and missing high-impact documentation updates.
- `performance-cost`: use when latency, database access, bundle size, cloud cost, or AI token cost matters.

Project skills:
- Read `docs/sdd/skills.md` when a task may need specialized frontend guidance.
- Load only the matching `ai/skills/{skill}/SKILL.md` files.
- Use `red-web-domain-workflow` for pages, routes, menus, API modules, hooks, forms, lists, details, and locales.
- Use `red-web-api-contract` for backend/frontend payloads, filters, pagination, status/error handling, and contract drift.
- Use `red-web-auth-session-tenant` for login, auth context, roles, protected routes, tenant/company context, and headers.
- Use `red-web-ui-state-accessibility` for UI states, i18n, accessibility, responsive layout, and user-facing interactions.
- Use `red-web-react-query-testing` for Vitest, Testing Library, React Query, API mocks, and regression tests.
- Use `red-web-build-deploy-config` for Vite env vars, API base URL, production bundle behavior, and deploy docs.
- Use `red-web-sdd-documentation-gate` for high-impact documentation and feature closure.

Do not continue while any feature file contains `[NEEDS CLARIFICATION: ...]`. Resolve the question in `spec.md`, update `plan.md`, then regenerate or edit `tasks.md`.

### 4. Estimate LLM Context Cost
Estimate before expensive or large LLM runs:

```bash
npm run sdd:estimate -- NNNN-feature-slug --model codex
npm run sdd:estimate -- NNNN-feature-slug implement --model claude
npm run sdd:estimate -- NNNN-feature-slug test --model copilot
```

The estimate reports words, characters, lines, files, and approximate tokens by section. It is an estimate, not the provider billing source.

### 5. Generate Code With Supported LLMs
All adapters use the same SDD context bundle and action model.

Codex:

```bash
ai/adapters/codex.sh NNNN-feature-slug
ai/adapters/codex.sh NNNN-feature-slug test
ai/adapters/codex.sh NNNN-feature-slug refactor
ai/adapters/codex.sh NNNN-feature-slug implement T003
```

Claude:

```bash
ai/adapters/claude.sh NNNN-feature-slug
ai/adapters/claude.sh NNNN-feature-slug test
ai/adapters/claude.sh NNNN-feature-slug refactor
```

GitHub Copilot CLI:

```bash
ai/adapters/copilot.sh NNNN-feature-slug
ai/adapters/copilot.sh NNNN-feature-slug test
ai/adapters/copilot.sh NNNN-feature-slug refactor
```

Optional delta file:

```bash
ai/adapters/codex.sh NNNN-feature-slug implement docs/specs/example.delta.md
ai/adapters/codex.sh NNNN-feature-slug implement docs/specs/example.delta.md T003
```

Actions:
- `implement`: implements the feature from SDD files using `implementation-engineer`.
- `test`: generates focused tests using `test-engineer`.
- `refactor`: refactors using SDD context without adding an agent role.

For non-trivial work, prefer task-focused execution with `Txxx`. Each task in `tasks.md` should include a `REQ-*` id, responsible agent, dependency note, and verification command or check.

### 6. What The Terminal Shows After An LLM Run
Adapter executions are quiet by default to reduce terminal noise and avoid carrying large logs into later AI context. During a run, the terminal shows a compact loading indicator. On success, it prints only provider, feature, action, exit status, duration, and the saved compact log path when available.

The adapter does not collect stdout/stderr or estimate output tokens by default. Use `SDD_EXEC_OUTPUT=full` only when you need the provider stdout/stderr in the terminal for debugging.

### 7. Record Verification Evidence
Run and record verification:

```bash
npm run sdd:run -- NNNN-feature-slug
```

The command writes:

```text
docs/features/NNNN-feature-slug/runs/<timestamp>.md
```

The report includes command status, start time, duration, stdout, and stderr for each verification command. Output is summarized by default to keep SDD evidence compact. Use `SDD_RUN_OUTPUT=full npm run sdd:run -- NNNN-feature-slug` only when complete logs are needed.

### 8. Project-Specific Quality Gates
Frontend:

```bash
npm run sdd:check
npm run contracts:check
npm run test
npm run lint
npm run build
```

The frontend starts without a global coverage threshold, but critical features must declare focused test files and verification tasks.

Backend:

```bash
npm run sdd:check
npm run openapi:check
npm test
npm run test:coverage
npm run lint
```

The backend requires global Jest coverage of 80% for statements, branches, functions, and lines.

### 9. Manual Fields That May Still Be Required
The wizard creates a strong first draft, but some fields may still require human completion:
- exact API contract details when the backend endpoint does not exist yet;
- exact database indexes, migrations, or backfill strategy;
- exact AWS/AtlasDB MCP source names after connectors are configured;
- criticality decision;
- test file paths for critical features;
- out-of-scope boundaries;
- rollout, monitoring, or rollback notes for risky changes.

`npm run sdd:check` prints `Manual follow-up required` in the terminal when it detects common placeholders or unfinished SDD fields.

## Portugues BR

### Objetivo
Use este manual para operar o fluxo SDD para novas features, melhorias, testes e correcoes. O fluxo e o mesmo para frontend e backend; o que muda sao os comandos de verificacao de cada projeto.

### 1. Criar Uma Nova Spec Manualmente
Use a criacao manual quando a mudanca ja esta clara ou quando voce quer controle total sobre o texto.

1. Crie a pasta da feature:

```bash
mkdir -p docs/features/NNNN-feature-slug
```

2. Crie ou copie os tres arquivos obrigatorios:

```text
docs/features/NNNN-feature-slug/spec.md
docs/features/NNNN-feature-slug/plan.md
docs/features/NNNN-feature-slug/tasks.md
```

3. Preencha o conteudo minimo:
- `spec.md`: problema, escopo, classificacao de impacto, criticidade, requisitos com ids `REQ-*`, contrato de API/dados, estrategia de testes e fontes MCP quando aplicavel.
- `plan.md`: arquivos, atualizacoes documentais canonicas para trabalho de alto impacto, pacote de contexto, agentes, sequencia de implementacao, testes, comandos de verificacao, riscos e Definition of Done.
- `tasks.md`: uma tarefa de implementacao e uma tarefa de verificacao/teste para cada id `REQ-*`, mais uma tarefa de documentacao canonica quando a feature for de alto impacto.

4. Valide:

```bash
npm run sdd:check
```

Se o terminal mostrar `Manual follow-up required`, preencha esses campos antes de implementar.

Features frontend de alto impacto incluem novos dominios/workflows, mudancas nas premissas de dados de dominio, mudancas no contrato publico backend/frontend, mudancas de auth/tenant/role/sessao, fluxos de POS/pagamento/perda de dados, mudancas duraveis na memoria do projeto e novos padroes arquiteturais reutilizaveis. Para essas features, atualize ou crie os registros impactados em `docs/specs/{domain}.spec.md`, `docs/tasks/{domain}.tasks.md` e `docs/memory/project.memory.md` antes de fechar o trabalho.

### 2. Criar Uma Nova Spec Com Wizard
Use o wizard quando quiser arquivos consistentes e menos formatacao manual.

Wizard local deterministico:

```bash
npm run sdd:new
```

Wizard com traducao, util quando voce responde em portugues e quer os arquivos SDD em ingles:

```bash
OPENAI_API_KEY=... npm run sdd:new:translate
```

Wizard assistido por IA, util para trabalho complexo, ambiguo ou arriscado:

```bash
OPENAI_API_KEY=... npm run sdd:new:ai
```

Provider customizado:

```bash
SDD_AI_PROVIDER=custom SDD_AI_COMMAND="your-ai-command" npm run sdd:new:ai
```

O wizard cria:

```text
docs/features/NNNN-feature-slug/spec.md
docs/features/NNNN-feature-slug/plan.md
docs/features/NNNN-feature-slug/tasks.md
```

O wizard assistido por IA tambem cria:

```text
docs/features/NNNN-feature-slug/ai-report.md
```

### 3. Revisar Antes De Codar
Liste os agentes disponiveis:

```bash
npm run sdd:agents
```

Crie um prompt/relatorio de agente para uma feature:

```bash
npm run sdd:agent -- NNNN-feature-slug spec-reviewer
npm run sdd:agent -- NNNN-feature-slug planner
```

Sequencia recomendada:
- `spec-reviewer`: esclarece ambiguidades, requisitos ausentes, contratos, riscos e criterios de aceite.
- `planner`: valida arquivos, testes, ordem de implementacao, atualizacoes documentais de alto impacto e Definition of Done.
- `implementation`: implementa o plano aprovado.
- `test`: adiciona ou melhora testes automatizados.
- `code-reviewer`: revisa corretude, manutencao, regressoes, testes faltantes e atualizacoes documentais de alto impacto ausentes.
- `performance-cost`: use quando houver impacto em latencia, banco de dados, bundle, custo cloud ou custo de tokens.

Skills do projeto:
- Leia `docs/sdd/skills.md` quando a tarefa puder exigir orientacao frontend especializada.
- Carregue somente os arquivos `ai/skills/{skill}/SKILL.md` correspondentes.
- Use `red-web-domain-workflow` para paginas, rotas, menus, modulos de API, hooks, formularios, listas, detalhes e locales.
- Use `red-web-api-contract` para payloads backend/frontend, filtros, paginacao, status/erros e drift de contrato.
- Use `red-web-auth-session-tenant` para login, auth context, roles, rotas protegidas, tenant/company context e headers.
- Use `red-web-ui-state-accessibility` para estados de UI, i18n, acessibilidade, layout responsivo e interacoes visiveis ao usuario.
- Use `red-web-react-query-testing` para Vitest, Testing Library, React Query, mocks de API e testes de regressao.
- Use `red-web-build-deploy-config` para variaveis Vite, API base URL, bundle de producao e docs de deploy.
- Use `red-web-sdd-documentation-gate` para documentacao de alto impacto e fechamento de feature.

Nao continue enquanto qualquer arquivo da feature tiver `[NEEDS CLARIFICATION: ...]`. Resolva a pergunta no `spec.md`, atualize o `plan.md` e entao regenere ou edite o `tasks.md`.

### 4. Estimar Custo De Contexto Da LLM
Estime antes de execucoes grandes ou caras:

```bash
npm run sdd:estimate -- NNNN-feature-slug --model codex
npm run sdd:estimate -- NNNN-feature-slug implement --model claude
npm run sdd:estimate -- NNNN-feature-slug test --model copilot
```

A estimativa mostra palavras, caracteres, linhas, arquivos e tokens aproximados por secao. E uma estimativa, nao a fonte oficial de cobranca do provider.

### 5. Gerar Codigo Com As LLMs Suportadas
Todos os adapters usam o mesmo pacote de contexto SDD e o mesmo modelo de acao.

Codex:

```bash
ai/adapters/codex.sh NNNN-feature-slug
ai/adapters/codex.sh NNNN-feature-slug test
ai/adapters/codex.sh NNNN-feature-slug refactor
ai/adapters/codex.sh NNNN-feature-slug implement T003
```

Claude:

```bash
ai/adapters/claude.sh NNNN-feature-slug
ai/adapters/claude.sh NNNN-feature-slug test
ai/adapters/claude.sh NNNN-feature-slug refactor
```

GitHub Copilot CLI:

```bash
ai/adapters/copilot.sh NNNN-feature-slug
ai/adapters/copilot.sh NNNN-feature-slug test
ai/adapters/copilot.sh NNNN-feature-slug refactor
```

Arquivo delta opcional:

```bash
ai/adapters/codex.sh NNNN-feature-slug implement docs/specs/example.delta.md
ai/adapters/codex.sh NNNN-feature-slug implement docs/specs/example.delta.md T003
```

Acoes:
- `implement`: implementa a feature a partir dos arquivos SDD usando `implementation-engineer`.
- `test`: gera testes focados usando `test-engineer`.
- `refactor`: refatora usando o contexto SDD sem adicionar um papel de agente.

Para trabalhos nao triviais, prefira execucao focada por tarefa com `Txxx`. Cada tarefa em `tasks.md` deve incluir um id `REQ-*`, agente responsavel, dependencia e comando ou check de verificacao.

### 6. O Que O Terminal Mostra Ao Final De Uma Execucao LLM
As execucoes dos adapters sao silenciosas por padrao para reduzir ruido no terminal e evitar que logs grandes entrem em contextos de IA posteriores. Durante a execucao, o terminal mostra um indicador compacto de andamento. Em sucesso, imprime apenas provider, feature, acao, status de saida, duracao e o caminho do log compacto salvo quando existir.

O adapter nao coleta stdout/stderr nem estima tokens de saida por padrao. Use `SDD_EXEC_OUTPUT=full` somente quando precisar ver stdout/stderr do provider no terminal para depuracao.

### 7. Registrar Evidencia De Verificacao
Execute e registre as verificacoes:

```bash
npm run sdd:run -- NNNN-feature-slug
```

O comando grava:

```text
docs/features/NNNN-feature-slug/runs/<timestamp>.md
```

O relatorio inclui status, inicio, duracao, stdout e stderr de cada comando de verificacao. A saida e resumida por padrao para manter a evidencia SDD compacta. Use `SDD_RUN_OUTPUT=full npm run sdd:run -- NNNN-feature-slug` somente quando logs completos forem necessarios.

### 8. Quality Gates Por Projeto
Frontend:

```bash
npm run sdd:check
npm run contracts:check
npm run test
npm run lint
npm run build
```

O frontend comeca sem threshold global de cobertura, mas features criticas precisam declarar arquivos de teste focados e tarefas de verificacao.

Backend:

```bash
npm run sdd:check
npm run openapi:check
npm test
npm run test:coverage
npm run lint
```

O backend exige cobertura global Jest de 80% para statements, branches, functions e lines.

### 9. Campos Manuais Que Ainda Podem Ser Necessarios
O wizard cria um primeiro rascunho forte, mas alguns campos ainda podem exigir preenchimento humano:
- detalhes exatos do contrato de API quando o endpoint do backend ainda nao existe;
- indices de banco, migrations ou estrategia de backfill;
- nomes exatos das fontes MCP AWS/AtlasDB depois que os conectores forem configurados;
- decisao de criticidade;
- caminhos dos arquivos de teste para features criticas;
- limites de fora de escopo;
- notas de rollout, monitoramento ou rollback para mudancas arriscadas.

`npm run sdd:check` imprime `Manual follow-up required` no terminal quando detecta placeholders comuns ou campos SDD ainda incompletos.
