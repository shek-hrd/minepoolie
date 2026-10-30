#!/usr/bin/env bash
# scripts/install-xmrig.sh — reproducible xmrig installer
# Survives workspace wipes by being committed in-repo.
# Run: bash scripts/install-xmrig.sh

set -euo pipefail

echo "[install-xmrig] checking existing..."
if command -v xmrig >/dev/null 2>&1; then
  echo "[install-xmrig] xmrig already at $(which xmrig) — $(xmrig --version 2>&1 | head -1)"
  exit 0
fi

echo "[install-xmrig] xmrig missing — installing eazyminer (bundles xmrig 6.22.3)..."
npm install -g eazyminer

echo "[install-xmrig] copying binary..."
cp /usr/local/lib/node_modules/eazyminer/assets/miners/xmrig/xmrig /usr/local/bin/xmrig
chmod +x /usr/local/bin/xmrig

echo "[install-xmrig] verifying..."
xmrig --version 2>&1 | head -1
echo "[install-xmrig] DONE — real mining available at /usr/local/bin/xmrig"