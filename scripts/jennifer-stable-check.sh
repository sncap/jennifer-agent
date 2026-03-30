#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f "dist/entry.js" && ! -f "dist/entry.mjs" ]]; then
  echo "[prep] Missing build output (dist/entry.*). Running build first..."
  pnpm ui:build
  pnpm build
fi

CLI="node jennifer.mjs"

run_step() {
  local label="$1"
  shift
  echo "\n$label"
  if ! "$@"; then
    echo "[warn] Step failed: $label"
  fi
}

run_step "[1/4] Gateway status" $CLI gateway status
run_step "[2/4] Channel probe" $CLI channels status --probe
run_step "[3/4] Doctor (non-interactive)" $CLI doctor --non-interactive
run_step "[4/4] Runtime status" $CLI status

echo "\nStable check complete."
