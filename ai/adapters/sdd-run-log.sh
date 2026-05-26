#!/bin/bash

sdd_now_ms() {
  local now
  now=$(date +%s%3N)
  if [[ "$now" == *N ]]; then
    echo "$(($(date +%s) * 1000))"
  else
    echo "$now"
  fi
}

sdd_count_chars() {
  printf '%s' "${1:-}" | wc -c | tr -d ' '
}

sdd_count_lines() {
  if [[ -z "${1:-}" ]]; then
    echo 0
  else
    printf '%s\n' "$1" | wc -l | tr -d ' '
  fi
}

sdd_estimate_tokens_from_chars() {
  local chars=${1:-0}
  echo $(((chars + 3) / 4))
}

sdd_count_file_lines() {
  awk 'END { print NR }' "$1"
}

sdd_build_execution_log() {
  local provider=$1
  local status=$2
  local started_at=$3
  local duration_ms=$4
  local output_file=$5

  local input_chars input_lines input_tokens output_chars output_lines output_tokens total_tokens output_ratio diagnostic
  input_chars=$(sdd_count_chars "${INPUT:-}")
  input_lines=$(sdd_count_lines "${INPUT:-}")
  input_tokens=$(sdd_estimate_tokens_from_chars "$input_chars")
  output_chars=$(wc -c < "$output_file" | tr -d ' ')
  output_lines=$(sdd_count_file_lines "$output_file")
  output_tokens=$(sdd_estimate_tokens_from_chars "$output_chars")
  total_tokens=$((input_tokens + output_tokens))
  output_ratio=0
  if [[ "$input_tokens" -gt 0 ]]; then
    output_ratio=$((output_tokens / input_tokens))
  fi

  diagnostic="adequado"
  if [[ "$output_tokens" -gt 20000 || "$output_ratio" -gt 3 ]]; then
    diagnostic="alto: revise o prompt de execucao e evite logs/diffs completos na resposta"
  fi

  cat <<EOF

## Log da execucao SDD
- Projeto: ${PROJECT_ROOT:-$(pwd)}
- Provider: $provider
- Feature: ${FEATURE:-}
- Acao: ${ACTION_CANONICAL:-${ACTION:-}}
- Status: $status
- Inicio UTC: $started_at
- Duracao: ${duration_ms}ms
- Prompt: ${PROMPT_FILE:-}
- Delta: ${DELTA_FILE:-none}
- Entrada: ${input_chars} chars, ${input_lines} linhas, ~${input_tokens} tokens
- Saida: ${output_chars} chars, ${output_lines} linhas, ~${output_tokens} tokens
- Total estimado: ~${total_tokens} tokens
- Diagnostico de saida: ${diagnostic}
- Observacao: tokens estimados localmente por chars/4; o uso cobrado pelo provider pode variar.
EOF
}

sdd_execution_log_path() {
  if [[ -z "${FEATURE:-}" ]]; then
    return 1
  fi

  local feature_dir runs_dir stamp action
  feature_dir="${PROJECT_ROOT:-$(pwd)}/docs/features/${FEATURE}"
  if [[ ! -d "$feature_dir" ]]; then
    return 1
  fi

  runs_dir="$feature_dir/runs"
  mkdir -p "$runs_dir"
  stamp=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
  action="${ACTION_CANONICAL:-${ACTION:-run}}"
  echo "${runs_dir}/${stamp}-${action}-${1}-execution-log.md"
}

run_sdd_logged() {
  local provider=$1
  shift

  local started_at start_ms end_ms duration_ms status output_file execution_log log_path
  output_file=$(mktemp "${TMPDIR:-/tmp}/sdd-run.XXXXXX")
  started_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  start_ms=$(sdd_now_ms)

  set +e
  "$@" 2>&1 | tee "$output_file"
  status=${PIPESTATUS[0]}
  set -e

  end_ms=$(sdd_now_ms)
  duration_ms=$((end_ms - start_ms))
  execution_log=$(sdd_build_execution_log "$provider" "$status" "$started_at" "$duration_ms" "$output_file")
  printf '%s\n' "$execution_log"
  if log_path=$(sdd_execution_log_path "$provider"); then
    printf '%s\n' "$execution_log" > "$log_path"
    printf '\n- Log de consumo salvo em: %s\n' "${log_path#${PROJECT_ROOT:-$(pwd)}/}"
  fi
  rm -f "$output_file"

  return "$status"
}
