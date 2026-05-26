# POS SDD Context Spec

## Problem
The POS workflow is one of the highest-risk frontend flows, but SDD execution previously depended on broad domain docs plus the entire frontend context. This made AI-assisted changes more expensive and less traceable.

## Scope
Create a feature-based SDD example for POS context selection without changing POS runtime behavior.

## Requirements
- REQ-POS-SDD-001: POS feature work must define requirements in a feature folder before implementation.
- REQ-POS-SDD-002: POS feature context must identify involved pages, hooks, components, and backend APIs.
- REQ-POS-SDD-003: Verification must include `npm run sdd:check`, `npm run test`, `npm run lint`, and `npm run build`.

## Acceptance Criteria
- Feature spec, plan, and tasks exist under `docs/features/0001-pos-sdd-context/`.
- The plan points to the POS files most likely to be relevant for future POS changes.
- No runtime POS files are modified by this documentation-only feature.

## Out Of Scope
- Changing POS UI behavior.
- Adding or removing keyboard shortcuts.
- Changing backend product lookup behavior.
