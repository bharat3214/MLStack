#!/usr/bin/env bash
set -euo pipefail

# Run DB init (non-destructive) then start the original CMD
echo "[entrypoint] Ensuring database exists..."
python3 /usr/local/bin/init_db.py || echo "[entrypoint] init_db returned non-zero (continuing)"

echo "[entrypoint] Starting application"
exec "$@"
