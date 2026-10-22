#!/usr/bin/env bash
# Runs ON the VPS (called by .github/workflows/deploy.yml). Env: BRANCH (main), SERVICE (netra-api).
set -euo pipefail
cd "$(dirname "$0")/.."
BRANCH=${BRANCH:-main}; SERVICE=${SERVICE:-netra-api}

old=$(git rev-parse HEAD)
git fetch --quiet origin "$BRANCH"
git reset --hard "origin/$BRANCH"
new=$(git rev-parse HEAD)
[ "$old" = "$new" ] && { echo "up to date ($new)"; exit 0; }

# restart API only when server code changed; static web/ is live after the pull
if git diff --name-only "$old" "$new" | grep -q '^server/'; then
  node server/claim-api.js --check || { git reset --hard "$old"; echo "self-check failed, rolled back"; exit 1; }
  sudo systemctl restart "$SERVICE"
  sleep 2
  systemctl is-active --quiet "$SERVICE" || { git reset --hard "$old"; sudo systemctl restart "$SERVICE"; echo "service down, rolled back"; exit 1; }
fi
echo "deployed $old -> $new"
