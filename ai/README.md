# AI-Assisted Development for RED Frontend

This directory contains tools and prompts for AI-assisted development in the `red-web` project.

## Structure

- `instruction.md` — General instructions for AI assistants
- `context/frontend.md` — Frontend-specific context and architecture
- `prompts/` — Agnostic prompt templates for different tasks
  - `implement-from-spec.md` — For implementing features from SDD specs
  - `test-generator.md` — For generating comprehensive tests
  - `refactor.md` — For refactoring existing code
- `agents/` — Role-specific professional agents for SDD execution and review
  - `sdd-spec-reviewer.md` — Reviews feature specs before planning
  - `sdd-planner.md` — Converts specs into focused plans and tasks
  - `implementation-engineer.md` — Implements approved SDD plans
  - `test-engineer.md` — Adds focused automated tests
  - `code-reviewer.md` — Reviews correctness and maintainability
  - `performance-cost-reviewer.md` — Reviews runtime cost and AI context cost
- `skills/` — Project-specific capability guides loaded only when the task matches
- `adapters/` — Scripts to invoke specific AI assistants
  - `copilot.sh` — For GitHub Copilot CLI
  - `claude.sh` — For Claude
  - `codex.sh` — For Codex

## Usage

### Using Adapters

Each adapter script takes a feature name and optional action:

```bash
# Implement a feature from SDD
./ai/adapters/copilot.sh product
./ai/adapters/claude.sh product implement

# Generate tests
./ai/adapters/copilot.sh product test

# Refactor code
./ai/adapters/copilot.sh product refactor
```

### Requirements

- SDD files must exist: `docs/specs/{feature}.spec.md` and `docs/tasks/{feature}.tasks.md`
- AI tools must be installed and configured (e.g., `@github/copilot-cli`, `claude`, `codex`)

### Agnostic Prompts

The prompts in `prompts/` are designed to work with any capable AI assistant. They provide structured guidance for:

- Understanding SDD specifications
- Following frontend architecture patterns
- Generating testable, maintainable code
- Ensuring consistency with existing codebase

### SDD Agents

The agents in `agents/` are reusable role prompts. Use them with the SDD docs to keep each AI run focused:

```bash
# Inspect available agents
npm run sdd:agents

# Recommended sequence
# 1. sdd-spec-reviewer
# 2. sdd-planner
# 3. implementation-engineer
# 4. test-engineer
# 5. code-reviewer
# 6. performance-cost-reviewer when needed
```

Each agent should receive only:
- `docs/sdd/constitution.md`
- the active agent prompt
- the relevant feature SDD files
- the smallest set of code files needed for that role

Use `docs/sdd/agents.md` for orchestration, `docs/sdd/skills.md` for skill selection, and MCP guidance from the SDD docs.

### SDD Skills

Skills are specialized procedures that can be combined with any agent. Load only the skills that match the task.

Examples:
- frontend domain workflow: `ai/skills/red-web-domain-workflow/SKILL.md`
- backend/API contract work: `ai/skills/red-web-api-contract/SKILL.md`
- auth/session/tenant work: `ai/skills/red-web-auth-session-tenant/SKILL.md`
- UI state/accessibility work: `ai/skills/red-web-ui-state-accessibility/SKILL.md`
- React Query/testing work: `ai/skills/red-web-react-query-testing/SKILL.md`
- production build/deploy config: `ai/skills/red-web-build-deploy-config/SKILL.md`
- high-impact documentation closure: `ai/skills/red-web-sdd-documentation-gate/SKILL.md`

## Contributing

When adding new prompts or adapters:

1. Keep prompts vendor-agnostic
2. Test with multiple AI assistants
3. Update this README if structure changes
4. Ensure scripts are executable and handle errors gracefully
