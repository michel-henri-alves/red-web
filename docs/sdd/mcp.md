# RED Web MCP Sources

MCP is the controlled source-of-truth layer for SDD agents. Use it when the
needed context lives outside the feature docs or local code excerpts.

## Recommended Sources

### Backend Contract MCP
Use for:
- endpoint paths
- request/response payloads
- auth and tenant behavior
- backend validation and error codes

Preferred source:
- `red-backend` routes, controllers, services, validations, DTOs, and specs.
- `red-backend/docs/contracts/openapi.json` when available.

Value:
- Blocks frontend API calls that do not exist in the backend.
- Makes auth, tenant, payload, and response expectations explicit.
- Reduces prompt guessing and keeps feature specs tied to real backend behavior.

### Repository MCP
Use for:
- changed files
- pull requests
- issues
- commit history
- CI status

### Design/Product MCP
Use for:
- screen states
- copy
- accessibility expectations
- user workflow acceptance criteria

### Documentation MCP
Use for:
- official React, Vite, React Router, React Query, Testing Library, and i18next behavior.

### AWS Runtime MCP
Use for:
- deployed frontend/backend environment variables
- CloudWatch/API errors that affect frontend flows
- deployment metadata and rollback checks

Value:
- Distinguishes frontend bugs from backend/API/runtime outages.
- Gives review agents real production/staging evidence before recommending changes.

### AtlasDB MCP
Use indirectly through backend investigation for:
- tenant data shape
- index drift
- API failures caused by duplicate or malformed data

Value:
- Helps the frontend understand whether an issue is UI state, API contract, or persisted data.

## Rules
- Use MCP only for authoritative context.
- Summarize findings instead of pasting large outputs.
- Record contradictions between MCP and SDD docs before implementation.
- Cite the source class in agent output, for example `MCP: backend contract`.
- Do not use MCP as a substitute for feature-scoped specs.
- Use least-privilege read-only credentials by default.
- Never expose secrets, tokens, connection strings, or customer data in agent prompts or run reports.

## Feature Documentation
When MCP is used, record the relevant source in:

```text
docs/features/{feature-id}/spec.md -> MCP Sources
docs/features/{feature-id}/runs/{timestamp}.md -> Context Sources
```
