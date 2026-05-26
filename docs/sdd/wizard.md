# SDD Feature Wizard

Use the local wizard to start a feature with clear requirements before asking an AI assistant to implement it.

For the complete guide to all three wizard modes, see `docs/sdd/wizards-readme.md`.
For the full operational guide in English and Portuguese BR, see `docs/sdd/operation-manual.md`.

## Command

```bash
npm run sdd:new
```

To answer in Portuguese and generate English SDD docs:

```bash
npm run sdd:new:translate
```

To let AI ask follow-up questions and refine the final docs:

```bash
npm run sdd:new:ai
```

The wizard creates:

```text
docs/features/NNNN-feature-slug/
  spec.md
  plan.md
  tasks.md
```

## How To Answer
- Keep answers short and concrete.
- Use semicolons when a prompt asks for multiple items.
- Prefer observable behavior over implementation guesses.
- Put uncertain implementation details in risks or out-of-scope.

## Recommended Flow
1. Run `npm run sdd:new`.
2. Review the generated `spec.md`, `plan.md`, and `tasks.md`.
3. Use `ai/agents/sdd-spec-reviewer.md` when the feature has ambiguity, backend risk, auth/tenant impact, or user workflow complexity.
4. Use `ai/agents/sdd-planner.md` when the expected files, tests, or implementation sequence are not obvious.
5. Run `npm run sdd:check`.
6. Estimate the prompt/context cost if useful:

```bash
npm run sdd:estimate -- NNNN-feature-slug --model codex
```

7. Ask the adapter to work from the feature folder:

```bash
ai/adapters/codex.sh NNNN-feature-slug
```

8. Use `ai/agents/test-engineer.md` and `ai/agents/code-reviewer.md` before closing the feature.

## Translate Mode
Translate mode makes one translation/refinement call after collecting all answers.

Use either:

```bash
OPENAI_API_KEY=... npm run sdd:new:translate
```

Optionally choose a model:

```bash
SDD_TRANSLATE_MODEL=gpt-4o-mini OPENAI_API_KEY=... npm run sdd:new:translate
```

Or provide your own local/external translator command. It receives JSON on stdin and must return JSON with the same keys:

```bash
SDD_TRANSLATE_COMMAND="your-translator-command" npm run sdd:new:translate
```

The translator must preserve paths, endpoints, commands, env vars, and code symbols.

## AI-Assisted Mode
AI-assisted mode asks a few initial questions, calls the selected LLM to create follow-up questions, asks those follow-ups, then calls the LLM once more to create refined English SDD content.

It writes an extra report:

```text
docs/features/NNNN-feature-slug/ai-report.md
```

The report includes provider, model, detected input language, whether translation was needed, and token usage when the provider returns it.

Use OpenAI:

```bash
OPENAI_API_KEY=... npm run sdd:new:ai
```

Choose a model interactively or set:

```bash
SDD_AI_MODEL=gpt-4o-mini OPENAI_API_KEY=... npm run sdd:new:ai
```

Use a custom provider:

```bash
SDD_AI_PROVIDER=custom SDD_AI_COMMAND="your-ai-command" npm run sdd:new:ai
```

The custom command receives JSON on stdin and must return JSON. For follow-up calls, return `{ "questions": [...] }`. For final doc calls, return the requested SDD fields.

## Token Cost
This wizard has zero AI token cost. It runs locally and writes Markdown files deterministically.

Translate mode is optional and has a small token cost because it sends the collected answers once for translation/refinement.

It reduces later token use by producing:
- smaller feature-scoped context;
- explicit `REQ-*` ids;
- expected files and verification commands;
- clear out-of-scope boundaries.

Agent reviews are optional but recommended for higher-risk features. Load only the active agent prompt to avoid unnecessary token cost.
