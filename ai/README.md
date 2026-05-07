# AI-Assisted Development for RED Frontend

This directory contains tools and prompts for AI-assisted development in the `red-web` project.

## Structure

- `instruction.md` — General instructions for AI assistants
- `context/frontend.md` — Frontend-specific context and architecture
- `prompts/` — Agnostic prompt templates for different tasks
  - `implement-from-spec.md` — For implementing features from SDD specs
  - `test-generator.md` — For generating comprehensive tests
  - `refactor.md` — For refactoring existing code
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

## Contributing

When adding new prompts or adapters:

1. Keep prompts vendor-agnostic
2. Test with multiple AI assistants
3. Update this README if structure changes
4. Ensure scripts are executable and handle errors gracefully