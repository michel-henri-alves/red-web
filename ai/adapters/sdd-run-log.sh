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

sdd_print_progress() {
  local pid=$1
  local start_ms=$2
  local interval=${SDD_PROGRESS_INTERVAL_SECONDS:-2}

  printf 'SDD executando'
  while kill -0 "$pid" 2>/dev/null; do
    local now_ms elapsed_seconds
    now_ms=$(sdd_now_ms)
    elapsed_seconds=$(((now_ms - start_ms) / 1000))
    printf '\rSDD executando... %ss' "$elapsed_seconds"
    sleep "$interval"
  done
  printf '\r'
}

sdd_build_execution_log() {
  local provider=$1
  local status=$2
  local started_at=$3
  local duration_ms=$4

  local input_chars input_lines input_tokens
  input_chars=$(sdd_count_chars "${INPUT:-}")
  input_lines=$(sdd_count_lines "${INPUT:-}")
  input_tokens=$(sdd_estimate_tokens_from_chars "$input_chars")

  cat <<EOF

## Resumo da execucao SDD
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
- Saida: nao coletada para evitar logs grandes e estimativas enganosas
- Observacao: entrada estimada localmente por chars/4; o uso real deve ser consultado no provider quando disponivel.
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

  local started_at start_ms end_ms duration_ms status execution_log log_path output_mode
  output_mode=${SDD_EXEC_OUTPUT:-quiet}
  started_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  start_ms=$(sdd_now_ms)

  set +e
  if [[ "$output_mode" == "full" ]]; then
    "$@" 2>&1
    status=$?
  else
    "$@" >/dev/null 2>&1 &
    local command_pid=$!
    sdd_print_progress "$command_pid" "$start_ms" 2>/dev/null &
    local progress_pid=$!
    wait "$command_pid"
    status=$?
    kill "$progress_pid" 2>/dev/null || true
    wait "$progress_pid" 2>/dev/null || true
    printf '\nSDD finalizado. Preparando resumo...\n'
  fi
  set -e

  end_ms=$(sdd_now_ms)
  duration_ms=$((end_ms - start_ms))
  execution_log=$(sdd_build_execution_log "$provider" "$status" "$started_at" "$duration_ms")

  printf 'SDD resumo: provider=%s feature=%s acao=%s status=%s duracao=%sms\n' \
    "$provider" "${FEATURE:-}" "${ACTION_CANONICAL:-${ACTION:-}}" "$status" "$duration_ms"

  if [[ "$status" -ne 0 && "$output_mode" != "full" ]]; then
    printf 'SDD erro: saida suprimida. Rode com SDD_EXEC_OUTPUT=full para diagnosticar.\n'
  fi

  if log_path=$(sdd_execution_log_path "$provider"); then
    printf '%s\n' "$execution_log" > "$log_path"
    printf 'SDD log: %s\n' "${log_path#${PROJECT_ROOT:-$(pwd)}/}"
  fi

  return "$status"
}
