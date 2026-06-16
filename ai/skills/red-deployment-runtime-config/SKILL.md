---
name: red-deployment-runtime-config
description: Use when changing red-web or red-backend environment variables, Vite build-time configuration, production API hosts, Docker/serverless/deploy wiring, CORS, or runtime configuration docs.
---

# Red Deployment Runtime Config

## Use When
- Code or docs touch `.env*`, `VITE_*`, API base URL resolution, production build output, Docker, serverless, CORS, deploy manuals, or CI commands.
- A production issue involves wrong API host, localhost in bundle, missing env vars, CORS, or incompatible runtime packaging.

## Required Context
- `src/shared/utils/apiBaseUrl.js`, `.env.example`, `vite.config.mjs`, deployment docs, and CI workflow when frontend is affected.
- Backend `serverless.yaml`, `Dockerfile`, env usage, CORS setup, and deploy docs when backend is affected.
- Built artifact when validating production frontend behavior.

## Workflow
1. Classify each variable as build-time, runtime, secret, or local-only.
2. Keep production frontend builds from falling back to localhost backend URLs.
3. Keep `.env.example` and deploy docs aligned with source behavior.
4. Avoid committing real secrets; use examples or documented placeholders.
5. Validate runtime packaging after changing serverless, Docker, or dependency boundaries.
6. Record deployment verification in the active feature run when deployment behavior changed.

## Verification
- Frontend: `npm run build`, inspect `dist/` when host behavior changed.
- Backend: `npm run lint`, `npm test`, and deployment packaging checks when applicable.
- SDD: `npm run sdd:check` in touched project.

## Review Checks
- No committed env file contains production secrets.
- Required env vars are documented.
- CI/deploy commands match package scripts.
- Production behavior does not depend on dev-server-only assumptions.
