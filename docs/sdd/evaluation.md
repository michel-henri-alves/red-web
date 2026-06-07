# SDD Evaluation

## Baseline
The previous adapter flow for a POS implementation loaded:
- `ai/prompts/implement-from-spec.md`
- `docs/specs/pos.spec.md`
- `docs/tasks/pos.tasks.md`
- `ai/context/frontend.md`

Measured with:

```bash
npm run sdd:estimate -- pos --mode legacy --model codex
```

Estimated size:
- 1072 words
- 6889 characters
- 2069 input tokens for the `codex` model profile

## Updated Feature Flow
For a feature folder such as `docs/features/0001-pos-sdd-context`, the adapter now loads:
- `docs/sdd/constitution.md`
- `docs/sdd/workflow.md`
- `docs/sdd/context-map.md`
- `ai/prompts/sdd-execute.md`
- `ai/agents/implementation-engineer.md`
- `docs/features/0001-pos-sdd-context/spec.md`
- `docs/features/0001-pos-sdd-context/plan.md`
- `docs/features/0001-pos-sdd-context/tasks.md`

Measured with:

```bash
npm run sdd:estimate -- 0001-pos-sdd-context --model codex
```

Estimated size:
- 1308 words
- 9297 characters
- 2763 input tokens for the `codex` model profile

Other model profiles for the same feature bundle:
- Run `npm run sdd:estimate -- 0001-pos-sdd-context --model claude`
- Run `npm run sdd:estimate -- 0001-pos-sdd-context --model copilot`

## Result
- Word count is now about 22% higher than the legacy POS baseline because the stable SDD context includes agent and MCP guidance.
- Character count is about 35% higher than the legacy POS baseline.
- Estimated `codex` input tokens are about 34% higher than the legacy POS baseline. The added cost buys stronger orchestration, explicit review roles, and clearer context rules.
- Requirements are traceable through `REQ-*` ids.
- The SDD checker now blocks missing core docs, missing feature files, missing package scripts, missing domain task files, declared high-impact feature documentation gaps, missing route config, and missing POS implementation references.
- Feature plans now explicitly identify pages, hooks, API modules, reusable components, and verification commands before implementation.
- SDD agents now define professional roles for spec review, planning, implementation, testing, code review, and performance/cost review.
- Project skills now define reusable specialized procedures for frontend domain workflows, API contracts, auth/session/tenant, UI states/accessibility, React Query testing, build/deploy config, and high-impact SDD documentation gates.

## Agent Layer
The project now includes:
- `docs/sdd/agents.md`
- `ai/agents/sdd-spec-reviewer.md`
- `ai/agents/sdd-planner.md`
- `ai/agents/implementation-engineer.md`
- `ai/agents/test-engineer.md`
- `ai/agents/code-reviewer.md`
- `ai/agents/performance-cost-reviewer.md`
- `docs/sdd/skills.md`
- `ai/skills/red-web-domain-workflow/SKILL.md`
- `ai/skills/red-web-api-contract/SKILL.md`
- `ai/skills/red-web-auth-session-tenant/SKILL.md`
- `ai/skills/red-web-ui-state-accessibility/SKILL.md`
- `ai/skills/red-web-react-query-testing/SKILL.md`
- `ai/skills/red-web-build-deploy-config/SKILL.md`
- `ai/skills/red-web-sdd-documentation-gate/SKILL.md`

List the available agents with:

```bash
npm run sdd:agents
```

The agent layer should reduce rework and improve review quality, but it should not be loaded wholesale into every prompt. Load only the active agent prompt for the current SDD step.

## Token Estimation Method
Use `npm run sdd:estimate` instead of hand-counting words when updating this file.

The estimator mirrors the adapter context bundle and reports:
- words
- characters
- lines
- estimated input tokens by model profile
- per-section contribution

The token estimate uses the higher value between:
- `characters / charsPerToken`
- `words * tokensPerWord`

Then it adds adapter overhead:
- one message overhead for the assembled prompt
- one small framing overhead per loaded file

Available model profiles:
- `codex`
- `openai`
- `claude`
- `copilot`

Useful commands:

```bash
npm run sdd:estimate -- 0001-pos-sdd-context --model codex
npm run sdd:estimate -- 0001-pos-sdd-context --model claude
npm run sdd:estimate -- pos --mode legacy --model codex
npm run sdd:estimate -- customer implement docs/specs/customer.delta.md --model codex
```

## Remaining Risks
- Automated tests are configured with Vitest, but coverage is still young and should grow with each feature.
- Domain specs are still broad and should be migrated into feature folders over time.
- Legacy feature folders without `Impact Classification` currently warn instead of failing; add the classification when those features are touched.
- Existing duplicated docs outside this repository can still drift unless one canonical docs root is chosen.
- Token counts are estimates, not provider billing records. They are useful for trend comparison between SDD runs and model profiles.
