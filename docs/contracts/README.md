# RED Web Contract Tests

This folder is reserved for frontend/backend contract evidence.

## Goal
Keep `red-web` aligned with `red-backend` API behavior without relying on prompt memory.

## Recommended Contract Sources
- `red-backend/docs/contracts/openapi.json`.
- Backend route/controller/validation specs exposed through MCP.
- Shared DTO/schema package, if one is introduced later.

## Commands

```bash
npm run contracts:check
```

By default, this reads:

```text
../red-backend/docs/contracts/openapi.json
```

Override with:

```bash
RED_BACKEND_OPENAPI=/path/to/openapi.json npm run contracts:check
```

## Expected Future Flow
1. Backend publishes or exposes API contracts.
2. Frontend contract tests validate API client expectations against that contract.
3. SDD feature specs cite the contract source in `MCP Sources`.
4. CI runs contract checks before merge.

## External Input Needed
To make these tests executable, provide one canonical source:
- OpenAPI/Swagger file;
- generated JSON schema;
- shared package;
- or MCP connector that can query backend contracts.
