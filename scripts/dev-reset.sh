#!/usr/bin/env bash
set -euo pipefail

PORT_START="${PORT_START:-3000}"
PORT_END="${PORT_END:-3010}"

echo "Checking active listeners on ports ${PORT_START}-${PORT_END}..."
PIDS="$(lsof -tiTCP:${PORT_START}-${PORT_END} -sTCP:LISTEN || true)"

if [ -n "${PIDS}" ]; then
  echo "Killing stale dev processes: ${PIDS}"
  kill ${PIDS} || true
  sleep 1
else
  echo "No stale dev server processes found."
fi

# Prevent watch EMFILE issues on macOS.
ulimit -n 65536 || true

echo "Starting fresh dev server..."
exec npm run dev
