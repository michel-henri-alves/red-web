---
name: red-web-build-deploy-config
description: Use when changing red-web Vite build configuration, environment variables, VITE_API_BASE_URL, API base URL resolution, production bundle behavior, deployment docs, or CI build/deploy wiring.
---

# Red Web Build Deploy Config

## Use When
- Code or docs touch Vite env vars, `VITE_*`, API base URL resolution, production build output, deployment workflows, CloudFront/S3 docs, or CI build commands.
- A production issue involves requests hitting localhost or the wrong backend host.

## Required Context
- `src/shared/utils/apiBaseUrl.js`
- `.env.example`
- `vite.config.mjs`
- deployment docs and CI workflow files when relevant
- built `dist/` artifact when verifying production behavior

## Workflow
1. Remember that Vite bakes `VITE_*` values at build time.
2. Validate source and built artifact when production behavior is the issue.
3. Do not default production API calls to localhost.
4. Keep env var docs aligned with source behavior.
5. Run `npm run build`; inspect `dist/` when API host behavior changed.
6. Update deployment docs for durable config changes.

## Verification
- `npm run sdd:check`
- `npm run lint`
- `npm run build`
- inspect `dist/` for stale localhost or wrong host when relevant

## Review Checks
- Build-time env requirements are explicit.
- `.env.example` and deployment docs match source.
- The generated bundle does not contain forbidden localhost backend URLs for production.
