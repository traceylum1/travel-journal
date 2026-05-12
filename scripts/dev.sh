#!/usr/bin/env bash
# Run Go API and Vite dev server together. Ctrl+C stops both.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

cleanup() {
  if [[ -n "${GO_PID:-}" ]]; then kill "$GO_PID" 2>/dev/null || true; fi
  if [[ -n "${FE_PID:-}" ]]; then kill "$FE_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

go run ./cmd/server &
GO_PID=$!

(cd frontend && npm run dev) &
FE_PID=$!

# Blocks until both exit (e.g. you stop them). Ctrl+C triggers trap cleanup.
wait
