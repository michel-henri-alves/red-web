# SDD Wizards README

This project has three feature-planning wizards. All of them create a feature folder under `docs/features/`.

For the full operation and best-practices manual in English and Portuguese BR, see `docs/sdd/operation-manual.md`.

```text
docs/features/NNNN-feature-slug/
  spec.md
  plan.md
  tasks.md
```

The AI-assisted wizard also creates:

```text
ai-report.md
```

## 1. Local Wizard

```bash
npm run sdd:new
```

Use this for simple or well-understood features.

Properties:
- zero AI token cost;
- fully local and deterministic;
- fastest option;
- creates `spec.md`, `plan.md`, and `tasks.md`;
- keeps your answers mostly as written.

Recommended when:
- the requirement is already clear;
- you want the lowest possible cost;
- you do not need translation or AI follow-up questions.

## 2. Translate Wizard

```bash
npm run sdd:new:translate
```

Use this when you want to answer in Portuguese and generate concise English SDD docs.

With OpenAI:

```bash
OPENAI_API_KEY=... npm run sdd:new:translate
```

With a specific model:

```bash
SDD_TRANSLATE_MODEL=gpt-4o-mini OPENAI_API_KEY=... npm run sdd:new:translate
```

With a custom translation command:

```bash
SDD_TRANSLATE_COMMAND="your-translator-command" npm run sdd:new:translate
```

Properties:
- one AI/translation call after all answers are collected;
- small token cost;
- preserves paths, commands, endpoints, env vars, and code symbols;
- creates `spec.md`, `plan.md`, and `tasks.md` in English.

Recommended when:
- you think better in Portuguese;
- the feature is not complex enough to need AI-generated follow-up questions;
- you want cleaner English docs before implementation.

## 3. AI-Assisted Wizard

```bash
npm run sdd:new:ai
```

Use this for complex, ambiguous, or high-risk features.

With OpenAI:

```bash
OPENAI_API_KEY=... npm run sdd:new:ai
```

With a specific model:

```bash
SDD_AI_MODEL=gpt-4o-mini OPENAI_API_KEY=... npm run sdd:new:ai
```

With a custom provider:

```bash
SDD_AI_PROVIDER=custom SDD_AI_COMMAND="your-ai-command" npm run sdd:new:ai
```

Properties:
- asks initial planning questions;
- calls the selected LLM to generate follow-up questions;
- asks those follow-up questions interactively;
- calls the LLM again to generate refined English SDD docs;
- only translates when the input is not already English;
- creates `spec.md`, `plan.md`, `tasks.md`, and `ai-report.md`;
- reports token usage when the provider returns usage data.

Recommended when:
- the feature has unclear scope;
- backend/frontend/API behavior needs careful discovery;
- auth, tenant, permissions, data impact, or workflow risk matters;
- you want better questions before implementation begins.

## After Creating A Feature

Run:

```bash
npm run sdd:check
```

For non-trivial features, run the agent review sequence before implementation:

```text
ai/agents/sdd-spec-reviewer.md
ai/agents/sdd-planner.md
```

Then implement from the generated feature folder:

```bash
ai/adapters/codex.sh NNNN-feature-slug
```

After implementation, use:

```text
ai/agents/test-engineer.md
ai/agents/code-reviewer.md
ai/agents/performance-cost-reviewer.md when performance or token cost matters
```

## Cost Guidance

- `sdd:new`: zero tokens.
- `sdd:new:translate`: low token cost, usually one compact request.
- `sdd:new:ai`: higher cost than translate mode because it uses at least two AI calls, but it can reduce expensive rework during implementation.

Prefer the cheapest wizard that gives enough clarity:

```text
clear task      -> sdd:new
Portuguese docs -> sdd:new:translate
unclear feature -> sdd:new:ai
```

Prefer the cheapest agent sequence that gives enough safety:

```text
small code change       -> implementation + test/check review
normal feature          -> spec reviewer + planner + implementation + test + code review
high-risk feature       -> full sequence + MCP-backed contract checks
performance/cost change -> include performance-cost reviewer
```

## Provider Notes

OpenAI modes require `OPENAI_API_KEY`.

Custom provider commands receive JSON through stdin and must return JSON through stdout. For `sdd:new:ai`, the command is called once for follow-up questions and once for final SDD content. If the custom provider returns token usage, include it in a `usage` object.
