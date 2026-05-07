#!/bin/bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PROJECT_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
cd "$PROJECT_ROOT"

FEATURE=${1:-}
ACTION=${2:-implement}
DELTA_FILE=${3:-}

usage() {
  cat <<EOF
Usage: $0 <feature> [action] [delta-file]

Actions:
  implement   Implement feature from SDD spec (default)
  test        Generate tests from SDD spec
  refactor    Refactor existing code using SDD context

Examples:
  $0 product
  $0 product test
  $0 product refactor
  $0 customer implement docs/specs/customer.delta.md
EOF
}

if [[ "$FEATURE" == "-h" || "$FEATURE" == "--help" ]]; then
  usage
  exit 0
fi

if [[ -z "$FEATURE" ]]; then
  usage
  exit 1
fi

case "$ACTION" in
  implement|implementation|spec)
    PROMPT_FILE="ai/prompts/implement-from-spec.md"
    ACTION_DESCRIPTION="Implement the feature described by the SDD files."
    ;;
  test|tests|unit-tests|unit)
    PROMPT_FILE="ai/prompts/test-generator.md"
    ACTION_DESCRIPTION="Generate comprehensive tests for the feature described by the SDD files."
    ;;
  refactor|refactoring)
    PROMPT_FILE="ai/prompts/refactor.md"
    ACTION_DESCRIPTION="Refactor the feature implementation using the SDD files as context."
    ;;
  *)
    echo "Unknown action: $ACTION" >&2
    usage
    exit 1
    ;;
esac

SPEC_FILE="docs/specs/${FEATURE}.spec.md"
TASKS_FILE="docs/tasks/${FEATURE}.tasks.md"
CONTEXT_FILE="ai/context/frontend.md"

for file in "$PROMPT_FILE" "$SPEC_FILE" "$TASKS_FILE" "$CONTEXT_FILE"; do
  if [[ ! -f "$file" ]]; then
    echo "Required file not found: $file" >&2
    exit 1
  fi
done

DELTA_SECTION=""
if [[ -n "$DELTA_FILE" ]]; then
  if [[ ! -f "$DELTA_FILE" ]]; then
    echo "Delta file not found: $DELTA_FILE" >&2
    exit 1
  fi

  DELTA_SECTION=$(cat <<EOF

## SDD Delta
Apply only the changes described in this delta file. Use the main specification as baseline context and avoid unrelated refactors.

$(cat "$DELTA_FILE")
EOF
)
fi

INPUT=$(cat <<EOF
$ACTION_DESCRIPTION

## AI Prompt
$(cat "$PROMPT_FILE")

## SDD Specification
$(cat "$SPEC_FILE")
$DELTA_SECTION

## SDD Tasks
$(cat "$TASKS_FILE")

## Frontend Context
$(cat "$CONTEXT_FILE")
EOF
)

claude --input "$INPUT"
